---
layout: post
title-short: Snowplow 92 Maiden Castle
title: "Snowplow 92 Maiden Castle released"
tags: [snowplow, emr]
author: Ben
category: Releases
---

We are pleased to announce the release of [Snowplow 92 Maiden Castle][snowplow-release].

This release is a direct follow up of [Snowplow 91 Stonehenge][stonehenge], making it more robust with regard
to how both locks and Relational Database Loader (introduced in [Snowplow 90 Lascaux][lascaux]) logs are
handled.

If you'd like to know more about R92 Maiden Castle, named after
[the Iron Age fort in England][maiden-castle], please read on:

1. [Better RDB Loader logs management](/blog/2017/09/07/snowplow-r92-maiden-castle-released#rdb-logs)
2. [Improved lock handling](/blog/2017/09/07/snowplow-r92-maiden-castle-released#lock)
3. [The new archive shredded step](/blog/2017/09/07/snowplow-r92-maiden-castle-released#archive-shredded)
4. [Consistent loading of shredded data](/blog/2017/09/07/snowplow-r92-maiden-castle-released#shredde-data)
5. [Upgrading](/blog/2017/09/07/snowplow-r92-maiden-castle-released#upgrading)
6. [Roadmap](/blog/2017/09/07/snowplow-r92-maiden-castle-released#roadmap)
7. [Help](/blog/2017/09/07/snowplow-r92-maiden-castle-released#help)

![maiden-castle][maiden-castle-img]

<!--more-->

<h2 id="rdb-logs">1. Better RDB Loader logs management</h2>

The logs produced by RDB Loader are stored in S3 and downloaded by EmrEtlRunner to be displayed as
log messages. This release improves on this process with the following measures:

- An attempt to retrieve those logs will happen even if the RDB Loader EMR step is cancelled
- They will be logged using an appropriate log level according to the state of the RDB Loader EMR
step (i.e. error if failed, warning if cancelled, info if successful)
- After they've been displayed they will be removed from the box running EmrEtlRunner

<h2 id="lock">2. Improved lock handling</h2>

When running EmrEtlRunner, there are a few situations that will prevent it from launching an EMR
cluster:

- There are no log files in the `in` buckets
- There are files present in the `enriched:good` bucket
- There are files present in the `shredded:good` bucket

We refer to those situations as no-ops.

The locking mechanism introduced in R91 suffered from a shortcoming: it failed to released the lock
in cases of a no-op. This has been fixed in R92.

<h2 id="archive-shredded">3. The new archive shredded step</h2>

Prior to R92, the `archive_enriched` step encompassed both the fact of archiving the enriched events
as well as the shredded ones. This didn't really make much sense and could cause confusion.

Moreover, if one was to not skip `archive_enriched` but skip `shred`, the EMR step actually
archiving the shredded events would fail because there would be no shredded events.

Conversely, if one was to skip `archive_enrich` while also skipping `shred`, the enriched events
would be left in place which would prevent the next Emretlrunner run from starting due to a
`enriched:good` bucket not empty no-op as described above.

As a result, a standalone `archive_shredded` step has been introduced which is skippable through
the `--skip` EmrEtlRunner option.

<h2 id="shredded-data">4. Consistent loading of shredded data</h2>

A behaviour which was inherited by RDB Loader from the now defunct StorageLoader was to skip loading
the shredded data if the `shred` step was skipped. This behaviour was corrected in R92.

<h2 id="upgrading">5. Upgrading</h2>

The latest version of EmrEtlRunner is available from our [Bintray][app-dl].

Upgrading from R91 is straightforward and encouraged since no changes are needed.

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases include:

* [R93 [STR] Virunum][r93], a general upgrade of the apps constituting our stream processing pipeline
* [R9x [BAT] Priority fixes and ZSTD support][r9x-bat-quality], working on data quality and security issues and enhancing our Redshift event storage with the ZSTD encoding
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark, Unbounce, StatusGator)

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on Github.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r92-maiden-castle

[maiden-castle]: https://en.wikipedia.org/wiki/Maiden_Castle,_Dorset
[maiden-castle-img]: /assets/img/blog/2017/09/maiden_castle.jpg

[stonehenge]: /blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix
[lascaux]: /blog/2017/07/26/snowplow-r90-lascaux-released-moving-database-loading-into-emr

[discourse]: http://discourse.snowplowanalytics.com/

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r92_maiden_castle.zip

[r93]: https://github.com/snowplow/snowplow/milestone/135
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144
