---
layout: post
title-short: Snowplow RDB Loader R31
title: "Snowplow RDB Loader R31 released"
tags: [snowplow, shred, redshift, manifest, bad-rows]
author: Anton
category: Releases
permalink: /blog/2019/08/27/snowplow-rdb-loader-r31-released-with-new-bad-rows/
featured: true
---

We are pleased to announce the release of [Snowplow RDB Loader R31][release]. This updates the format of bad rows emitted to a [new format][bad-rows-rfc], as part of a broader piece of work we have been undertaking to improve Snowplow's capabilities around bad row handling, debugging and recovery; and fixes a data quality issue with synthetic duplicates in the RDB Shredder.

Please read on after the fold for:

1. [New bad rows format](#new-bad-rows-format)
2. [Synthetic duplicates issue](#synthetic-duplicates-issue)
3. [Other improvements](#other)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

<!--more-->

<h2 id="new-bad-rows-format">1. New bad rows format</h2>

At the beginning of 2019 we at Snowplow initiated a big effort to redesign the [Snowplow bad row format][bad-rows-rfc].
The purpose of the new  format is to make bad rows easier to query and therefore monitor, debug and recover, by making them much more highly structured. In the new approach, bad rows will be in a self-describing JSON format. 

While the primary source of bad rows for Snowplow users is the Stream Enrich job that validates every event being processed by the pipeline, every microservice that makes up a Snowplow pipeline, including the RDB Loader, will emit a bad row if an attempt to process the event (in this case load it into Redshift) is unsuccessful. We're happy to announce that Snowplow RDB Shredder is the first component of Snowplow pipeline released supporting the new format of bad rows.

The RDB Shredder 0.15.0 can produce the following types of bad rows:

* `iglu:com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/1-0-0` - a generic loader error, caused if the event is not a valid "enriched event"
* `iglu:com.snowplowanalytics.snowplow.badrows/loader_iglu_error/jsonschema/1-0-0` - an error raised by Iglu Client
* `iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-0` - an unstructured error, raised by one of low-level shredding components, such as DynamoDB outage during cross-batch deduplication

<h2 id="synthetic-duplicates-issue">2. Synthetic duplicates issue</h2>

In [Snowplow R86 Petra][snowplow-r86] we introduced [an in-batch synthetic deduplication][synthetic-deduplication] step. This step identified rows of data that were distinct (i.e. have different event fingerprints), but that had the same `event_id`: this can occur if for example the Snowplow Javascript is executed in an environment where it cannot generate UUIDs e.g. by a robot scraping the website, for example. Where two events in a batch have the same event ID but different event fingerprints, they are assigned a new event ID to prevent collision, with the original event ID preserved in the `com.snowplowanalytics.snowplow/duplicate/jsonschema/1-0-0` context that is attached to any event that is mutated in this way.

Recently, we discovered an anomaly in shredded data, where some events, which were clearly synthetic duplicates, were not "attached" to any context or unstructured event tables.
Vice versa, some contexts and unstructured events had `root_id` values which did not correspond to any rows in the `atomic.events` table, effectively resulting in "orphaned events".

It turned out that this was caused by an issue with how Apache Spark caches parts of its execution DAG.
After the shred job creates an event object with a new unique `event_id`, it caches this object and proceeds to the next step of creating an object containing all shredded entities with the same id.
But if for some reasons there is not enough memory to store the initial cached object,  a new event object would be generated, along with a new unique event id.
This second event id would only be used only in the shredded entities since the original event would already be written to HDFS, resulting in the `event_id` on the row in the events table not matching the `root_id` on the associated shredded tables.

As a result, it was possible to have an event with an original event ID of A, end up with:

* `event_id` `B` in `atomic.events`
* `root_id` `C` in all contexts and unstruct event tables
* `root_id` `D` in `duplicate_1` table (but with `originalEventId` `A` in its column)

This problem manifests itself quite rarely, depending on cluster load (which affects cache utiliztion) and overall amount of synthetic duplicates.
In an analysis of a large number of our customers, we found it occurs to ~1% of synthetic duplicates.

In order to check if your pipeline has been affected, you can count how many rows in `com_snowplowanalytics_snowplow_duplicate_1` don't have a parent in `atomic.events`:

{% highlight sql %}
SELECT root_tstamp::DATE, count(*) FROM atomic.com_snowplowanalytics_snowplow_duplicate_1
  WHERE root_id NOT IN (SELECT event_id FROM atomic.events WHERE collector_tstamp >= current_date - 100)
  AND root_tstamp >= current_date - 100
  GROUP BY 1 ORDER BY 1
{% endhighlight %}

Whilst this issue only impacts a small % of data, and then only synthetic duplicates that are generated by bot activity, we have still treated this issue as a data quality issue and prioritised fully understanding the issue and putting out a fix. 

<h2 id="other">3. Other improvements</h2>

* We bumped Apache Spark to 2.3.2, which means that the required EMR AMI version is now [5.19][ami-519]. This means that [M5 and C5 instances are now supported][emr-instances]
* Iglu Scala Client has been updated to [0.6.0][iglu-client-060], making the JSON validator stricter [#141][issue-141]
* RDB Shredder does not depend on Scala Common Enrich anymore and works on top of [Scala Analytics SDK][analytics-sdk]
* String values in atomic events are truncated according to [`atomic` JSON Schema][atomic] rather than hard-coded values [#143][issue-143]

<h2 id="upgrading">4. Upgrading</h2>

### 4.1 Checks to perform prior to upgrading

The new RDB Loader uses a new version of the [Iglu Client library][iglu-client-060], that itself uses a new library for JSON schema validation. This is stricter than the old library. As a result, a number of issues with schemas that previously wouldn't have prevented RDB Loader from successfully loading events will now cause events to fail to successfully load. We therefore recommend checking the following before performing upgrade.

#### 4.1.1 All schemas have the correct `$schema` value set

All Iglu Schemas are self-describing themselves, and therefore contain a `$schema` property. The property should be set as follows:

{% highlight json %}
"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
{% endhighlight %}

i.e. the value should always be `http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#`. This is the "meta-schema" that describes the schemas themselves.

The previous version of Iglu Client library was insensitive to the value that this field was set at, so it wasn't uncommon for Snowplow users to create schemas and set alternative values. (E.g. owing to a misunderstanding about what the property meant, and what that value should be.) 

Please therefore check this value in any schemas in your own Iglu Schema Registry before performing an upgrade, as any mistakes here may cause the corresponding events or contexts to not be loaded into Redshift successfully.

#### 4.1.2 Any string fields that are specified format `uri` have to be full URIs and not simply paths

The jsonschema standard supports a `uri` format for strings.

The previous Iglu Client library would accept paths e.g. `/my/path` as valid URIs. The new library will not, and as a result any fields defined in the schema as a URI but with paths as values will not load into Redshift successfully.

### 4.2 Performing the upgrade

If you are using EmrEtlRunner, you'll need to update your `config.yml` file:

{% highlight yaml %}
aws:
  emr:
    ami_version: 5.19.0   # WAS 5.9.0
storage:
  versions:
    rdb_shredder: 0.15.0  # WAS 0.14.0
    rdb_loader: 0.16.0    # WAS 0.15.0
{% endhighlight %}

Bear in mind that the new minimum required AMI version might now support some old instance types, such as c1.medium or m1.small.
In that case you need to upgrade your instance type as well.

Once you have upgraded we recommended closely monitoring the location on S3 where the RDB Loader is configured to write any bad rows, to make sure that none of the issues flagged in 4.2.1 mean that data has failed to load into Redshift as a result of the upgrade.

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[bad-rows-rfc]: https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558

[synthetic-deduplication]: https://github.com/snowplow/snowplow/wiki/Relational-Database-Shredder#42-in-batch-synthetic-de-duplication
[iglu-client-060]: https://snowplowanalytics.com/blog/2019/08/09/iglu-scala-client-0.6.0-released/
[snowplow-r86]: https://snowplowanalytics.com/blog/2016/12/20/snowplow-r86-petra-released/

[emr-instances]: https://aws.amazon.com/about-aws/whats-new/2018/05/amazon-emr-now-supports-m5-and-c5-instances/
[ami-519]: https://docs.amazonaws.cn/en_us/emr/latest/ReleaseGuide/emr-whatsnew-history.html#emr-5190-whatsnew
[issue-141]: https://github.com/snowplow/snowplow-rdb-loader/issues/141
[issue-143]: https://github.com/snowplow/snowplow-rdb-loader/issues/143

[analytics-sdk]: https://github.com/snowplow/snowplow-scala-analytics-sdk
[atomic]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0

[discourse]: http://discourse.snowplowanalytics.com/
[release]: https://github.com/snowplow/snowplow-rdb-loader/releases/r31
