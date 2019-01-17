---
layout: post
title: Snowplow Snowflake Loader 0.4.0 released
title-short: Snowflake Loader 0.4.0
tags: [snowflake, storage, relational databases]
author: Rostyslav
category: Releases
permalink: /blog/2019/01/23/snowplow-snowflake-loader-0.4.0-released/
---

We are pleased to announce version 0.4.0 of the [Snowplow Snowflake Loader][snowflake-loader-repo]! This release introduces optional event deduplication, brings significant performance improvements to the Snowflake Transformer, and includes several other updates and bugfixes.

Read on below the fold for:

1. [Deduplication](#dedupe)
2. [S3 optimizations](#s3-optimizations)
3. [New configuration options](#new-config)
4. [Other changes](#other-changes)
5. [Upgrading](#upgrading)
6. [Getting help](#help)

<!--more-->

<h2 id="dedupe">1. Deduplication</h2>

It’s possible for two or more Snowplow events to have the same event ID, for example because a duplicate has been introduced at one of the stages in the data processing upstream of the data landing in Snowflake DB. Event duplicates can prove a challenge in any event pipeline - we have previously discussed this issue in detail in [this blog post][duplicate-blog] and on our [Discourse forum][duplicate-discourse].

To mitigate this issue, version 0.4.0 introduces both in-batch deduplication and [DynamoDB][dynamodb]-powered cross-batch deduplication:

* In-batch deduplication groups events with the same `event_id` and `event_fingerprint` in a single batch.

* Cross-batch deduplication works by extracting the ID and fingerprint of an event, as well as `etl_tstamp` which identifies a single batch, then storing these properties in a DynamoDB table. Duplicate events with the same ID and fingerprint that were seen in previous batches are silently dropped from the Snowflake Transformer output. (Note that this feature is experimental as of version 0.4.0 and may not be 100% foolproof.)

More details on setting up deduplication in the Snowflake Transformer can be found in the [project's wiki][duplicate-wiki].

Alongside this Snowflake Loader release, we have also released the first version of [Snowplow Events Manifest][events-manifest]. This standalone Scala library contains logic used for cross-batch natural deduplication of Snowplow events, and will be responsible for deduplication in our AWS-based pipelines.

<h2 id="s3-optimizations">2. S3 optimizations</h2>

This update introduces a significant performance improvement eliminating an S3-based bottleneck in the Snowflake Transformer. In previous versions, when the Transformer wrote files from Spark, the output was initially stored to a temporary destination and then renamed when the job has succeeded. However, because S3 is an object store, renaming files is a very expensive operation that requires a complete rewrite. This process was a notable bottleneck in the Transformer, making it incapable of processing large volumes of data (over 1TB/day) even with a large EMR cluster.

Version 0.4.0 solves this problem by using a [custom staging committer][s3committer], which accelerates writing to S3 from Spark by writing task outputs to a temporary directory on the local filesystem rather than S3. This represents a significant performance improvement by avoiding expensive S3 renaming operations. While usage of this committer is optional, it is highly recommended - an example of a Dataflow Runner config with the optimization enabled can be found in the [Setup Guide][dataflow-runner-wiki].

<h2 id="new-config">3. New configuration options</h2>

Version 0.4.0 introduces two new configuration options to the Snowflake Loader config:
* `maxError` - An optional setting used when writing to Snowflake - a table copy statement will skip an input file when the number of errors in it exceeds the specified number. This can be used to process runs with a certain number of expected bad rows without immediately failing, but should usually be set to 0.
* `jdbcHost` - An optional host for the JDBC driver that has priority over automatically derived hosts. This is useful for targets such as Snowflake on Azure with different conventions for deriving hosts.

<h2 id="other-changes">4. Other changes</h2>

This release introduces plenty of other updates:

* Newly created Snowflake warehouses are now created with `AUTO_SUSPEND` set to 5 mins and `AUTO_RESUME` set to `TRUE`, and will be suspended after inactivity to prevent incurring unnecessary costs. (These settings can be manually modified in the Snowflake console if necessary.)
* Text strings are now automatically truncated to their target lengths instead of producing an error if a loaded string exceeds the target length.
* Sensitive columns in `atomic.events` have been widened to support the [PII Pseudonymization Enrichment][pii], and the `geo_region` column has been bumped to 3 characters due to changes in MaxMind regional codes. Thanks to community member [miike][miike] for contributing the latter feature!
* A DynamoDB client will now attempt recovery if its temporary session credentials have expired, preventing critical run failures when a job takes more than 6 hours.
* The Snowflake Loader will now correctly fail if no data is located in the specified staging folder, preventing "blank loads" for complex recovery/historical load scenarios.
* The Snowflake JDBC driver has been updated to 3.6.22.

<h2 id="upgrading">5. Upgrading</h2>

To make use of the new versions of the Snowflake Transformer and Loader, you will need to update your Dataflow Runner configurations to use the following jar files:

{% highlight bash %}

s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-transformer-0.4.0.jar
s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-loader-0.4.0.jar

{% endhighlight %}

Due to several columns in atomic.events being widened to support pseudonymization and MaxMind changes, the table schema on Snowflake will need to be migrated. In order to automatically update the relevant column definitions in Snowflake, use the new `migrate` command and specify the loader's version:

`java -jar snowplow-snowflake-loader-0.4.0.jar migrate --loader-version 0.4.0`

<h2 id="help">6. Getting help</h2>

For more details on this release, check out the [0.4.0 release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowflake-loader-repo]: https://github.com/snowplow-incubator/snowplow-snowflake-loader
[duplicate-blog]: https://snowplowanalytics.com/blog/2015/08/19/dealing-with-duplicate-event-ids/
[duplicate-discourse]: https://discourse.snowplowanalytics.com/t/recovering-pipelines-with-cross-batch-deduplication-enabled-tutorial/1397
[dynamodb]: https://aws.amazon.com/dynamodb/
[duplicate-wiki]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/wiki/Setup-Guide
[events-manifest]: https://github.com/snowplow-incubator/snowplow-events-manifest
[s3committer]: https://github.com/rdblue/s3committer
[dataflow-runner-wiki]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/wiki/Setup-Guide#dataflow-runner
[pii]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/
[miike]: https://github.com/miike
[release-notes]: https://github.com/snowplow/snowplow-snowflake-loader/releases/tag/0.4.0
[discourse]: http://discourse.snowplowanalytics.com/
