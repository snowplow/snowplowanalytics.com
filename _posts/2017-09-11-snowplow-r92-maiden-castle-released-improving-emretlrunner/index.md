---
layout: post
title-short: Snowplow 92 Maiden Castle
title: "Snowplow 92 Maiden Castle released"
tags: [snowplow, emr]
author: Ben
category: Releases
permalink: /blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner/
---

We are pleased to announce the release of [Snowplow 92 Maiden Castle][snowplow-release].

This release is a direct follow-up of [Snowplow 91 Stonehenge][stonehenge], incorporating various
improvements from seeing R90 and R91 operate in the wild. In particular, this release fixes some
important gotchas in EmrEtlRunner's `--skip` behavior, as well as a bug in the handling of run locks.

<!--more-->

If you'd like to know more about R92 Maiden Castle, named after [the Iron Age hill fort in England][maiden-castle], please read on:

1. [Fixing the skip shred bug](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#shredded-data)
2. [The new archive_shredded step](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#archive-shredded)
3. [Fixing the run lock bug](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#lock)
4. [Better RDB Loader logs management](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#rdb-logs)
5. [Removal of RDB Shredder and Loader](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#move-rdb)
6. [Upgrading](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#upgrading)
7. [Roadmap](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#roadmap)
8. [Help](/blog/2017/09/11/snowplow-r92-maiden-castle-released-improving-emretlrunner#help)



<h2 id="shredded-data">1. Fixing the skip shred bug</h2>

When we ported across the RDB Loader from the StorageLoader in R90, we implemented a behavior of
skipping the loading of the shredded data (self-describing events and contexts) if the `shred` step
was skipped.

This was a mistake ([#3403][issue-3403]) - it meant that if you needed to resume your pipeline due to for example a Redshift problem, then although the `atomic.events` table would be loaded, the shredded types (events and contexts) would not.

We have a [comprehensive guide to this problem][skip-shred-thread] on Discourse, in case you have been affected by it.

This bug has been corrected in R92.

<h2 id="archive-shredded">2. The new archive_shredded step</h2>

Prior to R92, the `archive_enriched` step encompassed both the fact of archiving the enriched events
as well as the shredded ones. This was confusing but also difficult to work with:

1. If you skipped `shred` but did not not skip `archive_enriched`, then the S3DistCp step trying to archive the shredded events would fail because there would be no shredded events.
2. Conversely, if you skipped `archive_enrich` while also skipping `shred`, the enriched events
would be left in place which would prevent the next EmrEtlRunner run from starting due to a
`enriched:good` bucket not empty no-op, as described below

As a result, a standalone `archive_shredded` step has been introduced which is skippable as usual through
the `--skip` EmrEtlRunner option.

<h2 id="lock">3. Fixing the run lock bug</h2>

When running EmrEtlRunner, there are a few situations that will prevent it from launching an EMR
cluster:

* There are no log files in the `in` buckets
* There are files present in the `enriched:good` bucket
* There are files present in the `shredded:good` bucket

We refer to those situations as "no-ops" (for no operations to perform).

The locking mechanism introduced in R91 suffered from a bug ([#3396][issue-3396]): it failed to release the lock
in cases of a no-op. This has been fixed in R92.

<h2 id="rdb-logs">4. Better RDB Loader logs management</h2>

The logs produced by RDB Loader are stored in S3 and downloaded by EmrEtlRunner to be displayed as
log messages. This release improves on this process with the following measures:

* An attempt to retrieve those logs will happen even if the RDB Loader EMR step is cancelled
* These log messages will be output using an appropriate log level, according to the state of the RDB Loader EMR
step (i.e. error if failed, warning if cancelled, info if successful)
* After they have been displayed they will be removed from the box running EmrEtlRunner

<h2 id="move-rdb">5. Removal of RDB Shredder and Loader</h2>

Following the [release of the RDB Loader v0.13.0][rdb-loader-013], we have now removed the RDB Shredder and RDB Loader components from the Snowplow "mono-repo". This represents an important milestone in us decoupling database-specific loader applications from the core Snowplow release process.

<h2 id="upgrading">6. Upgrading</h2>

The latest version of EmrEtlRunner is available from our [Bintray][app-dl].

In order to use [recently released][rdb-loader-013] RDB Loader, remember to make following update to your configuration YAML:

{% highlight yaml %}
storage:
  versions:
    rdb_loader: 0.13.0        # Was 0.12.0
{% endhighlight %}

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases include:

* [R93 [STR] Virunum][r93], a general upgrade of the apps constituting our stream processing pipeline
* [R94 [BAT] ZSTD support][r94], enhancing our Redshift event storage with the ZSTD encoding
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark, Unbounce, StatusGator)

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on Github.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r92-maiden-castle



[stonehenge]: /blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix
[lascaux]: /blog/2017/07/26/snowplow-r90-lascaux-released-moving-database-loading-into-emr
[rdb-loader-013]: /blog/2017/09/06/rdb-loader-0.13.0-released

[discourse]: http://discourse.snowplowanalytics.com/

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r92_maiden_castle.zip

[skip-shred-thread]: https://discourse.snowplowanalytics.com/t/important-alert-r90-r91-bug-may-result-in-shredded-types-not-loading-into-redshift-after-recovery/1422
[issue-3403]: https://github.com/snowplow/snowplow/issues/3403
[issue-3396]: https://github.com/snowplow/snowplow/issues/3396

[r93]: https://github.com/snowplow/snowplow/milestone/135
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144
