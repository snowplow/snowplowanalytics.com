---
layout: post
title-short: Snowplow RDB Loader R29
title: "Snowplow RDB Loader R29 released"
tags: [snowplow, pii, shred, redshift]
author: Anton
category: Releases
permalink: /blog/2018/06/06/snowplow-rdb-loader-r29-released-with-pii-issue-fix
---

We are pleased to announce the hotfix release of [Snowplow RDB Loader R29][release], fixing an important bug for PII pseudonymization enrichment introduced in [R100 Epidaurus][r100-post].

Please read on after the fold for:

1. [PII Enrichment bug](#bug)
2. [Recovery](#recovery)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

<h2 id="dupe">1. PII Enrichment bug</h2>

In [R100][r100-post] we introduced [new enrichment][pii-enrichment] for pseudonymizing personally identifiable information to help our users to comply The General Data Protection Regulation.
This enrichment can be configured to hash certain properties in your events, so that all actual information that can be used to identify a user is replaced with hashed values that still can be used in data-modeling.

In order to store these new hashed values we also modified our atomic events table [definition][atomic-def] by widening `VARCHAR`/`CHAR` columns that are commonly used to store personally identifiable information, such as:

* `user_ipaddress`
* `user_fingerprint`
* `domain_userid`
* `network_userid`
* `ip_organization`
* `ip_domain`
* `refr_domain_userid`
* `domain_sessionid`

All these values were widened to 128 characters in order to being able to store values produced by most commonly used hash-algorithms.

However, we missed the fact that RDB Shredder, a component between enrichment and storage target also performs a coercion for certain atomic event columns.
And without corresponding update, RDB Shredder continued to truncate above columns to their previous lengths.

This bug affected mainly users of PII enrichment, but we also noticed that two other Redshift columns were truncated in addition to listed above:

* `os_timezone`
* `se_label`

However, we think that above columns had enough capacity for all real-world use cases and unlikely had any negative effect.

<h2 id="recovery">2. Recovery</h2>

This bug resides only in RDB Shredder, so all enriched data remains valid and therefore can be re-processed by RDB Shredder and Loader.
In order to do that you need to:

1. Identify all affected runs - since the day PII enrichment has been enabled
2. [Clean-up all affected runs from Redshift][deleting-data]
3. [Upgrade](#upgrading) `rdb_shredder` in your `config.yml`
3. Remove all affected runs from `shredded.archive`
3. Re-stage enriched data from archive
4. Run EmrEtlRunner with `--resume-from shred` option

<h2 id="upgrading">3. Upgrading</h2>

If you are a batch pipeline user, you'll need to either update your EmrEtlRunner configuration to the following:

{% highlight yaml %}
storage:
  versions:
    rdb_shredder: 1.13.1 # WAS 1.13.0
{% endhighlight %}

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases are unchanged:

* [R106 Acropolis][r106-pii], further enhancing our recently-released GDPR-focused PII Enrichment for the realtime pipeline and fixing another related bug
* [R10x [STR] New webhooks and enrichment][r10x-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics], plus a new enrichment for detecting bots and spiders using [data from the IAB][iab-data]
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
[deleting-data]: https://discourse.snowplowanalytics.com/t/gdpr-deleting-customer-data-from-redshift-tutorial/1815

[r106-pii]: https://github.com/snowplow/snowplow/milestone/153
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[r10x-ms]: https://github.com/snowplow/snowplow/milestone/158
[dataflow]: https://cloud.google.com/dataflow/
[iab-data]: https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/

[discourse]: http://discourse.snowplowanalytics.com/
