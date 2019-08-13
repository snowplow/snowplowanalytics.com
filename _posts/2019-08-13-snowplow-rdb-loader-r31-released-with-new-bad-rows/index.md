---
layout: post
title-short: Snowplow RDB Loader R31
title: "Snowplow RDB Loader R31 released"
tags: [snowplow, shred, redshift, manifest, bad-rows]
author: Anton
category: Releases
permalink: /blog/2019/08/13/snowplow-rdb-loader-r31-released-with-new-bad-rows/
---

We are pleased to announce the release of [Snowplow RDB Loader R31][release] which adds a [new format of bad rows][bad-rows-rfc] and fixes a data quality issue with synthetic duplicates.

Please read on after the fold for:

1. [New bad rows format](#new-bad-rows-format)
2. [Synthetic duplicates issue](#synthetic-duplicates-issue)
3. [Logging improvements](#logging)
5. [Other improvements](#other)
6. [Upgrading](#upgrading)
7. [Getting help](#help)

<!--more-->

<h2 id="load-manifest">1. New bad rows format</h2>

At the beginning of 2019 we at Snowplow initiated a big effort of redesigning [Snowplow bad rows][bad-rows-rfc].
The new design supposed to make bad rows easier to monitor, debug and recover by leveraging self-describing JSON format.

While primary source of bad rows, the Stream Enrich job is still in QA phase, we're happy to announce that Snowplow RDB Shredder is the first component of Snowplow pipeline supporting the new format of bad rows.
The RDB Shredder 0.15.0 can produce following types of bad rows:

* `iglu:com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/1-0-0` - a generic loader error, caused by invalid enriched data
* `iglu:com.snowplowanalytics.snowplow.badrows/loader_iglu_error/jsonschema/1-0-0` - an error raised by Iglu Client
* `iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-0` - an unstructured error, raised by one of low-level shredding components, such as DynamoDB outage during cross-batch deduplication

The RDB Shredder usually produces extremely small amount of bad rows or does not produce them at all, because all input data has already been validated and processed by enrich step.
However, due to change in [Iglu Client validation library][iglu-client-060] we strongly recommend our users to monitor `loader_iglu_error` bad rows for at least couple of runs after upgrade

<h2 id="synthetic-duplicates-issue">Synthetic duplicates issue</h2>

In [Snowplow R86 Petra][snowplow-r86] we introduced an [in-batch synthetic deduplication][synthetic-deduplication].
The deduplication generated new event id for events that for some reasons (e.g. due a bug in random number generator) have the same `event_id`, but in fact are different events (have different `event_fingerprint`s).
As a result, all events in a batch contain unique event ids, but at the same time not all events have their original ids.
Original event ids are preserved in `com.snowplowanalytics.snowplow/duplicate/jsonschema/1-0-0` context attached only to events where duplicated ids were found.

Recently, we discovered an anomaly in shredded data, where some events, which were clearly synthetic duplicates at the origin were not "attached" to any context or unstructured event tables.
Vice versa, some contexts and unstructured events had `root_id`, which did not correspond to any rows in `atomic.events` table, effectively resulting in "orphan events".

Turned out the problem layed in how Apache Spark caches parts of its execution DAG.
After Shred job created an event object with new unique `event_id`, it caches this object and proceeds to the next step of creating an object containing all shredded entities with the same id.
But for some reasons there could be not enough memory to store initial cached object anymore.
This would result in a new event object generation, along with new unique event id.
But this second event id will be used only in shredded entities as original event is already written to HDFS.

As a result, we could end up with a situation, where original enriched event with id `A` could end up in a shredded bucket with:

* `event_id` `B` in `atomic.events`
* `root_id` `C` in all contexts and unstruct event tables
* `root_id` `D` in `duplicate_1` table (but with `originalEventId` `A` in its column)

This problem manifests itself quite rarely, depending on cluster load (which affects cache utilizztion) and overall amount of synthetic duplicates.
In our statistics, it happens to ~1% of synthetic duplicates.


<h2 id="processing-manifest">4. Snowplow Processing Manifest</h2>

Another major new feature of this release isthe introduction of Snowplow Processing Manifest - not to be confused with the Redshift `atomic.manifest` table discussed above.

Snowplow Processing Manifest is a library and journal allowing jobs to keep a record of all significant processing steps in a pipeline. It has been designed as a very generic mechanism, independent from specific processing engines and target databases.

Currently only AWS DynamoDB is available as a backend for the manifest, and only Redshift (through RDB Shredder and Loader) is supported as target database, however a similar approach is used in the [Snowplow Snowflake Loader][snowflake-loader-post], and we have plans to migrate Snowflake Loader to use the Snowplow Processing Manifest, which will ultimately evolve into a "universal glue" between pipeline components.

The most important features of Snowplow Processing Manifest include:

* Tracking of all shredded types in a folder, in order to skip S3 consistency check delays
* Tracking of all RDB Shredder and Loader runs with their respective timestamps and exit statuses
* Locking mechanism, preventing double-loading and race conditions

Right now, the Snowplow Processing Manifest as embedded in RDB Loader is considered *beta*, and it does **not** need to be enabled in order to use RDB Loader, nor make use of any of the new functionality outlined above. The manifest is disabled by default.

Stay tuned for more information on Snowplow Processing Manifest, coming in an official announcement soon.

<h2 id="other">5. Other improvements</h2>

* Iglu Scala Client is updated to 0.6.0, making JSON validator more restrictive [#141][issue-141]
* RDB Shredder does not depend on Scala Common Enrich anymore and works on top of [Scala Analytics SDK][analytiics-sdk]
* String values in atomic events truncated according to [`atomic` JSON Schema][atomic] and not hard-coded anymore https://github.com/snowplow/snowplow-rdb-loader/issues/143

<h2 id="upgrading">6. Upgrading</h2>

To make use of the new version, you will need to update your EmrEtlRunner configuration, and also the storage target configuration for either Redshift or Postgres.

<h3>EmrEtlRunner</h3>

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

Make sure you monitor you shredded bad rows.

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[bad-rows-rfc]: TODO

[synthetic-deduplication]: https://github.com/snowplow/snowplow/wiki/Relational-Database-Shredder#42-in-batch-synthetic-de-duplication

[iglu-client-060]: https://snowplowanalytics.com/blog/2019/08/09/iglu-scala-client-0.6.0-released/
[snowplow-r86]: https://snowplowanalytics.com/blog/2016/12/20/snowplow-r86-petra-released/


[issue-141]: https://github.com/snowplow/snowplow-rdb-loader/issues/141
[issue-143]: https://github.com/snowplow/snowplow-rdb-loader/issues/143

[analytics-sdk]: https://github.com/snowplow/snowplow-scala-analytics-sdk
[atomic]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/atomic/jsonschema/1-0-0

[discourse]: http://discourse.snowplowanalytics.com/
[release]: https://github.com/snowplow/snowplow-rdb-loader/releases/r31
