---
layout: post
title-short: Snowplow RDB Loader R30
title: "Snowplow RDB Loader R30 released"
tags: [snowplow, pii, shred, redshift]
author: Anton
category: Releases
permalink: /blog/2018/06/12/snowplow-rdb-loader-r29-released-with-pii-issue-fix/
---


RDB Loader: add ability to skip all load manifest interactions (#97)
RDB Loader: tolerate deleted folder artifacts when consistency_check is skipped (#80)
RDB Loader: fix manifest population assumes load is most recent (#70)
RDB Loader: fail load if entry exists in manifest (#14)

RDB Shredder: remove auto-creation of event manifests table (#62)
Common: use processing manifest (#81)
RDB Loader: make SSL configuration compatible with native JDBC settings (#73)
RDB Loader: improve log output (#23)
RDB Loader: escape input for sanitize function (#87)

We are pleased to announce the release of [Snowplow RDB Loader R30][release] adding multiple usability and stability improvements.

Please read on after the fold for:

1. [Load manifest improvements](#load-manifest)
2. [Configuration refactoring](#configuration)
3. [Logging improvements](#logging)
4. [Processing manifest](#processing-manifest)
4. [Other improvements](#other)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

<h2 id="load-manifest">1. Load manifest improvements</h2>

In [R87 Chichen Itza][r87-post] we introduced Redshift load manifest, widely known as `atomic.manifest` table in Redshift.

All these columns were widened to 128 characters so that they store values produced by the most commonly used hash-algorithms.

Unfortunately, during the R100 release we missed the fact that RDB Shredder, which prepares events for loading into Redshift and Postgres, also performs a truncation on various atomic event columns;
without the required corresponding update, RDB Shredder continued to truncate the above columns to their previous lengths.

This bug affected mainly users of the PII Enrichment, but during investigation of the bug we also noticed that two further Redshift columns were being excessively truncated:

* `os_timezone`
* `se_label`

However, we think that these two columns, even when excessively truncated, most likely had sufficient capacity for all real-world use cases so there was likely no negative impact *on these two columns*.

<h2 id="recovery">2. Recovery</h2>

This bug resides only in RDB Shredder, so all enriched data remains valid and can therefore be re-processed by RDB Shredder and Loader.

In order to do that you need to:

1. Identify all affected runs - since the day PII Enrichment has been enabled
2. Delete all affected runs from Redshift
3. [Upgrade](#upgrading) `rdb_shredder` in your `config.yml`
4. Delete all affected runs from `shredded.archive`
5. Re-stage enriched data from `enriched.archive` to `enriched.good`
6. Run EmrEtlRunner with `--resume-from shred` option

**Important note about steps 5 and 6:** archived folders cannot be staged all at once. They need to be staged and processed one by one, or their contents should be merged into one new folder.

<h2 id="upgrading">3. Upgrading</h2>

If you are using RDB Loader to load events into Redshift or Postgres, you'll need to update your EmrEtlRunner configuration to the following:

{% highlight yaml %}
storage:
  versions:
    rdb_shredder: 0.13.1 # WAS 0.13.0
{% endhighlight %}

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

[r87-post]: https://snowplowanalytics.com/blog/2017/02/21/snowplow-r87-chichen-itza-released/

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
