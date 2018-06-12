---
layout: post
title-short: Snowplow RDB Loader R29
title: "Snowplow RDB Loader R29 released"
tags: [snowplow, pii, shred, redshift]
author: Anton
category: Releases
permalink: /blog/2018/06/12/snowplow-rdb-loader-r29-released-with-pii-issue-fix/
---

We are pleased to announce the release of [Snowplow RDB Loader R29][release], fixing an important bug relating to the PII Enrichment introduced in [R100 Epidaurus][r100-post].

Please read on after the fold for:

1. [PII Enrichment-related bug](#bug)
2. [Recovery](#recovery)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

<h2 id="dupe">1. PII Enrichment-related bug</h2>

In [R100][r100-post] we introduced a [new enrichment][pii-enrichment] for pseudonymizing personally identifiable information to help our users to comply with GDPR.

The PII Enrichment can be configured to hash specific fields and properties in your events so that user-identifiable information is replaced with hashed values (which can still can be used in data modeling).

In order to store these new hashed values in Redshift, we also modified our atomic events table [definition][atomic-def] by widening the maximum characters for the `VARCHAR` and `CHAR` columns that are commonly used to store personally identifiable information, specifically:

* `user_ipaddress`
* `user_fingerprint`
* `domain_userid`
* `network_userid`
* `ip_organization`
* `ip_domain`
* `refr_domain_userid`
* `domain_sessionid`

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
    rdb_shredder: 1.13.1 # WAS 1.13.0
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

[release]: https://github.com/snowplow/snowplow-rdb-loader/releases/r29

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
