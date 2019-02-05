---
layout: post
title-short: Snowplow RDB Loader R30
title: "Snowplow RDB Loader R30 released"
tags: [snowplow, shred, redshift, manifest]
author: Anton
category: Releases
permalink: /blog/2018/08/29/snowplow-rdb-loader-r30-released-with-stability-improvements/
---

We are pleased to announce the release of [Snowplow RDB Loader R30][release] which adds multiple usability and stability improvements.

Please read on after the fold for:

1. [Load manifest improvements](#load-manifest)
2. [Configuration refactoring](#configuration)
3. [Logging improvements](#logging)
4. [Snowplow Processing Manifest](#processing-manifest)
5. [Other improvements](#other)
6. [Upgrading](#upgrading)
7. [Getting help](#help)

<!--more-->

<h2 id="load-manifest">1. Load manifest improvements</h2>

In [R87 Chichen Itza][r87-post] we introduced the Redshift load manifest table, widely known as `atomic.manifest`.
Each row in this table represents metadata about a loading "job" performed by RDB Loader.

Until now, neither RDB Loader nor any other Snowplow software has used this table for any purpose - it was purely informational. In this release, we have changed that and implemented several defensive checks that work on top of the `manifest` table and add additional safety to the loading process.

<h3>Protection from double-loading</h3>

The first issue we have addressed using load manifest is accidental double-loading, which can happen if the Snowplow operator isn't very experienced with the recovery process. R30 implements the following load algorithm:

1. Start a DB transaction
2. Load data into `atomic.events` table
3. Check latest `etl_tstamp` in `atomic.events`
4. If latest record in `atomic.manifest` has same `etl_tstamp`, abort the transaction
5. Otherwise, proceed to shredded data, write new record to the manifest, and commit the transaction

Before R30 we didn't have the third and fourth steps so nothing in RDB Loader prevented loading the same data multiple times.

<h3>Historical loading</h3>

RDB Loader has always assumed that the most recent `etl_tstamp` in `atomic.events` is the timestamp of the current "run" folder.

This is normally the case - but sometimes we need to load archived data using the `--folder` option introduced in [RDB Loader 0.13.0][v013-post]); this could happen when the operator discovers that a given folder was not loaded (in turn happening perhaps due to mistakenly using `--resume-from` in EmrEtlRunner).

In this case, RDB Loader incorrectly treats the most recent `etl_tstamp` as the timestamp for the historical load, which can corrupt the manifest table or prevent data from loading.

R30 introduces a "transitional load" mode, activating only when the `--folder` option is passed. In this mode, RDB Loader loads atomic data into a temporary created table, with a schema identical to `atomic.events`, in order to get precise information about the dataset that it is about to load.

With transitional load, RDB Loader can inspect the temporary table and get the correct `etl_tstamp` without being confused by existing data. Only if `etl_tstamp` does not exist in the load manifest will the data be moved over to the `atomic.events` table and the temporary table be dropped; otherwise, the transaction will be aborted.

Notice that in order to use this feature, your database user should have permissions to create and drop tables.

<h3>New skippable steps</h3>

R30 also introduces three new steps that the user can skip during and RDB Loader job:

* `load_manifest_check` - skipping the check described above, meaning that any data, even duplicated data, will be loadable into Redshift
* `load_manifest` - skipping all the load manifest interactions, i.e. checking and writing to the manifest
* `transitional_load` - skipping the "transitional load" mode introduced above, even when `--folder` is specified

Note that as of [R102 Afontova Gora][r102-post], EmrEtlRunner will skip `load_manifest` for any pipeline with "stream enrich" mode running, as the `etl_tstamp` does not bear any useful information within real-time pipeline.

Skip these steps at your own risk and when you fully understand the consequences, as a failure during `load_manifest_check` almost always will mean double-loading.

<h2 id="configuration">2. Configuration refactoring</h2>

Historically, RDB Loader used PostgreSQL-compatible options to configure an SSL connection, which could have one of following available settings: `DISABLE`, `REQUIRE`, `VERIFY_CA` or `VERIFY_FULL`.

However, this method does not match the [Redshift configuration][redshift-jdbc], where `sslMode` could be only `verify-ca` or `verify-full`.

In this version we have re-worked the configuration file to instead use direct JDBC configuration options in a new `jdbc` object, which includes most of the available Redshift JDBC options. You can see full list of available settings in [configuring JSON Schema][target-jdbc-options].

Note that the root-level `sslMode` is not a valid setting anymore.

We also took this opportunity to make some forward-looking changes and clean-ups:

* All optional root-level settings cannot now be omitted, and must be set to `null`
* `id` setting is not an optional anymore, and must be set to a (random) UUID
* A new optional `processingManifest` option has been added (more on this later)

All mandatory changes are set out in the [upgrading](#upgrading) section below.

<h2 id="logging">3. Logging improvements</h2>

Historically, RDB Loader provided very concise log output, showing only what steps were successfully executed. Using this output for debugging purposes was challenging, and operators had to rely on third-party sources.

With R30, RDB Loader provides very detailed information about the load process, in particular adding:

1. List of discovered folders (usually just one) with a full list of shredded types found there
2. Eventual consistency check delays
3. Improved failure messages, showing possible resolution steps
4. Timestamps for all messages, helping to highlight which steps take the most time
5. List of timestamped and truncated `COPY INTO` statements in `stdout` - this won't be printed by EmrEtlRunner, but *will* be present in EMR logs

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

* RDB Shredder with enabled cross-batch deduplication does not automatically create DynamoDB event manifest anymore - you will need to create this table manually [#62][issue-62]
* We fixed a bug where the Loader would fail if the JDBC password could be interpreted as an invalid regular expression [#87][issue-87]

<h2 id="upgrading">6. Upgrading</h2>

To make use of the new version, you will need to update your EmrEtlRunner configuration, and also the storage target configuration for either Redshift or Postgres.

<h3>EmrEtlRunner</h3>

If you are using EmrEtlRunner, you'll need to update your `config.yml` file:

{% highlight yaml %}
storage:
  versions:
    rdb_shredder: 0.14.0 # WAS 0.13.1
    rdb_loader: 0.15.0 # WAS 0.14.0
{% endhighlight %}

<h3>Redshift</h3>

In the storage target configuration for Redshift, you'll need to do following changes:

1. Switch SchemaVer to `3-0-0`
2. Remove `sslMode` and add `jdbc` JSON object instead
3. In case you had `"sslMode": "DISABLE"` - add `"ssl": false` to `jdbc`; if you had `"sslMode": "REQUIRE"` - add `"ssl": true` to `jdbc`
4. Assign random UUID to `id` property (add it if it didn't exist)
5. Add `"sshTunnel": null` unless you already have configured SSL tunnel, introduced in [R28][r28-post]
6. Add `"processingManifest": null` unless you're going to use the processing manifest (to be covered in a future release announcement)

<h3>PostgreSQL</h3>

If you're loading data to PostgreSQL, you'll need to make following changes in respective config:

1. Switch SchemaVer to `2-0-0`
2. Assign random UUID to `id` property (add it if it didn't exist)
3. Add `"sslTunnel": null` unless you already have configured SSL tunnel, introduced in [R28][r28-post]
4. Add `"processingManifest": null` unless you're going to use the processing manifest (to be covered in a future release announcement)

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[v013-post]: https://snowplowanalytics.com/blog/2017/09/06/rdb-loader-0.13.0-released/
[r28-post]: https://snowplowanalytics.com/blog/2017/11/13/rdb-loader-r28-released/
[r87-post]: https://snowplowanalytics.com/blog/2017/02/21/snowplow-r87-chichen-itza-released/
[r102-post]: https://snowplowanalytics.com/blog/2018/04/03/snowplow-r102-afontova-gora-with-emretlrunner-improvements/
[snowflake-loader-post]: https://snowplowanalytics.com/blog/2017/12/28/snowplow-snowflake-loader-0.3.0-released/

[redshift-jdbc]: https://docs.aws.amazon.com/redshift/latest/mgmt/configure-jdbc-options.html
[target-jdbc-options]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/3-0-0#L196-L254

[issue-62]: https://github.com/snowplow/snowplow-rdb-loader/issues/62
[issue-87]: https://github.com/snowplow/snowplow-rdb-loader/issues/87

[discourse]: http://discourse.snowplowanalytics.com/
[release]: https://github.com/snowplow/snowplow-rdb-loader/releases/r30
