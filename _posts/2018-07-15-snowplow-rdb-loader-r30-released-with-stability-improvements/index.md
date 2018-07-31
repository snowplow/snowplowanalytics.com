---
layout: post
title-short: Snowplow RDB Loader R30
title: "Snowplow RDB Loader R30 released"
tags: [snowplow, shred, redshift]
author: Anton
category: Releases
permalink: /blog/2018/08/01/snowplow-rdb-loader-r30-released-with-stability-improvements/
---

We are pleased to announce the release of [Snowplow RDB Loader R30][release] adding multiple usability and stability improvements.

Please read on after the fold for:

1. [Load manifest improvements](#load-manifest)
2. [Configuration refactoring](#configuration)
3. [Logging improvements](#logging)
4. [Processing manifest](#processing-manifest)
5. [Other improvements](#other)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Help](#help)

<h2 id="load-manifest">1. Load manifest improvements</h2>

In [R87 Chichen Itza][r87-post] we introduced the Redshift load manifest, widely known as `atomic.manifest` table.
Each row in this table represents metadata about a job performed by RDB Loader.

Until now RDB Loader nor other Snowplow sotfware never used this table for any purpose and it was purely informational.
In R30 we decided to change that and implemented several defensive checks that work on top of `manifest` table and add extra-safety to loading process.

### Double-loading

First issue we addressed using load manifest is accidental double-loading, which can happen quite often if pipeline operator isn't very experienced with recovery process.
In order to do that, we implemented following load algorithm in R30:

1. Start a DB transaction
2. Load data into `atomic.events` table
3. Check latest `etl_tstamp` in `atomic.events`
4. If latest record in `atomic.manifest` has same `etl_tstamp` - abort the transaction
5. Otherwise - proceed to shredded data, write new record to manifest and commit the transaction

Before R30 we didn't have 3rd and 4th steps and therefore nothing (in RDB Loader) prevented loading data multiple times.

### Folder

Sequence of steps shown above illustrates that RDB Loader always assumes that most recent `etl_tstamp` in `atomic.events` is the timestamp of current run folder.
Which is the case only when pipeline is functioning without interruptions.
However, often we need to load archived data (using `--folder` option introduced in [RDB Loader 0.13.0][v013-post]) for example when operator discovered that folder was not loaded (e.g. due mistakenly used `--resume-from` in EmrEtlRunner).
In this case, RDB Loader incorrectly identifies `etl_tstamp` of the load as most recent one, which in fact would corrupt manifest table or prevent data from loading.

In R30 we introduced so called "transitional load", which happens only when `--folder` passed.
In this mode, RDB Loader loads atomic data into a temporary created table with ideantical to `atomic.events` schema in order to get precise information about dataset that it is about to load.
With transitional load, RDB Loader can inspect temporary table and get the correct `etl_tstamp` without being confused by existing data.
If `etl_tstamp` does not exist in load manifest - data will be moved over to `atomic.events` table and temporary table will get dropped.
Otherwise - transaction will be aborted.

Notice that in order to seamlessly use this feature, your DB user should have permissions to create and drop tables.

### Steps

We also introduced three new steps that user can skip during RDB Loader job:

* `load_manifest_check` - to not perform the check described above, so any data would be able to get into Redshift
* `load_manifest` - to skip all load manifest interactions: check and write
* `transitional_load` - to skip transitional load even when `--folder` is specified

EmrEtlRunner Since R102 will skip `load_manifest` for any pipeline with enabled Stream Enrich Mode, as `etl_tstamp` does not make any sense after Stream Enrich.

Skip these at your own risk and when you fully understand the consequences, as failure during load manifest check almost always will mean double-loading.

<h2 id="configuration">2. Configuration refactoring</h2>

Historically, RDB Loader used PostgreSQL-compatible options to configure an SSL connection, which could have one of following available settings: `DISABLE`, `REQUIRE`, `VERIFY_CA` or `VERIFY_FULL`.
However, this method does not match [Redshift configuration][redshift-jdbc], where `sslMode` could be only `verify-ca` or `verify-full`.

In this version we re-worked configuration file to instead use direct JDBC configuration options in new `jdbc` object that includes most of available Redshift JDBC options.
You can see full list of available settings in [configuration JSON Schema][target-jdbc-options].

Root-level `sslMode` is not a valid setting anymore.

We also took this opportunity of configuration refactoring to make few more forward-looking changes and clean-ups:

* All optional root-level settings are cannot be omitted, and must be set to `null`
* `id` setting is not an optional anymore, and must be set to random UUID
* New optional `processingManifest` option added, more on this later

All mandatory changes are illustrated in [upgrading](#upgrading) section.

<h2 id="logging">3. Logging improvements</h2>

Historically, RDB Loader provided very modest log output, showing only what steps were successfully executed.
Using this output for debugging purposes was quite troublesome and operators had to rely on third-party sources.

Since this release, RDB Loader provides very detailed information about load process, in particular it adds:

1. List of discovered folders (usually just one) with full list of shredded types found there.
2. Eventual consistency check delays
3. Improved failure messages, showing possible resolution steps
4. Timestamps for all messages, so operator would be able to figure out what step takes most of the time
5. List of timestamped and truncated `COPY INTO` statements in `stdout` (won't be printed by EmrEtlRunner, but will be present in EMR logs)

<h2 id="logging">4. Processing manifest</h2>

Another big new feature of this release is introduction of processing manifest.
Processing manifest is 



<h2 id="other">2. Other changes</h2>

* RDB Shredder with enabled cross-batch deduplication does not automatically create DynamoDB event manifest anymore
* Fixed a bug, where Loader would fail in JDBC password could be interpreted as invalid regular expression


<h2 id="upgrading">3. Upgrading</h2>

If you are using RDB Loader to load events into Redshift or Postgres, you'll need to update your EmrEtlRunner configuration to the following:

{% highlight yaml %}
storage:
  versions:
    rdb_shredder: 0.14.0 # WAS 0.13.1
    rdb_loader: 0.15.0 # WAS 0.14.0
{% endhighlight %}

To update Redshift configuration JSON:

1. Switch SchemaVer to `3-0-0`
2. Remove `sslMode` and add `jdbc` JSON object instead
3. In case you had `"sslMode": "DISABLE"` - add `"ssl": false` to `jdbc`; if you had `"sslMode": "REQUIRE"` - add `"ssl": true` to `jdbc`
4. Assign random UUID to `id` property (add it if it didn't exist)
5. Add `"sslTunnel": null` unless you already have configured SSL tunnel, introduced in [R28][r28-post]
6. Add `"processingManifest": null` unless you're going to use the processing manifest

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases are unchanged:

* [R106 Acropolis][r106-pii], further enhancing our recently-released GDPR-focused PII Enrichment for the realtime pipeline and fixing another related bug
* [R107 [STR] New webhooks and enrichment][r107-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics], plus a new enrichment for detecting bots and spiders using [data from the IAB][iab-data]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[release]: https://github.com/snowplow/snowplow-rdb-loader/releases/r30

[v013-post]: https://snowplowanalytics.com/blog/2017/09/06/rdb-loader-0.13.0-released/
[r28-post]: https://snowplowanalytics.com/blog/2017/11/13/rdb-loader-r28-released/
[r87-post]: https://snowplowanalytics.com/blog/2017/02/21/snowplow-r87-chichen-itza-released/
[r102-post]: https://snowplowanalytics.com/blog/2018/04/03/snowplow-r102-afontova-gora-with-emretlrunner-improvements/

[redshift-jdbc]: https://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-options.html
[target-jdbc-options]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/3-0-0#L196-L254

[r100-post]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[paestum]: /blog/2018/04/17/snowplow-r103-paestum-released-with-ip-lookups-enrichment-upgrade/
[pii-enrichment]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment

[atomic-def]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/atomic-def.sql

[r106-pii]: https://github.com/snowplow/snowplow/milestone/153
[r107-ms]: https://github.com/snowplow/snowplow/milestone/158
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151

[beam]: https://beam.apache.org/
[dataflow]: https://cloud.google.com/dataflow/
[snowflake-analytics]: https://www.snowflake-analytics.com/
[iab-data]: https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/

[discourse]: http://discourse.snowplowanalytics.com/
