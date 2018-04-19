---
layout: post
title: "Snowplow 104 Stoplesteinan released with important EmrEtlRunner bugfixes"
title-short: Snowplow 104 Stoplesteinan
tags: [batch, emr, emretlrunner, lambda]
author: Anton
category: Releases
permalink: /blog/2018/04/24/snowplow-r104-stoplesteinan-released-with-important-bugfixes/
---

We are pleased to announce the release of [Snowplow R104 Stoplesteinan][release-notes].
This release brings few critical stability-related bugfixes to Stream Enrich mode introduced in EmrEtlRunner [R102 Afontova Gora][r102-post].

Read on for more information on R104 Stoplesteinan, named after [the ancient stone circle located in southwestern Norway][stoplesteinan]:

<!--more-->

1. [Bugs in R102 Stream Enrich mode](#r102-bugs)
2. [Who is affected](#affected)
3. [How to recover](#recovery)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![stoplesteinan][stoplesteinan-img]

<h2 id="r102-bugs">1. Bugs in R102 Stream Enrich mode</h2>

In R102 Afontova Gora we presented a new Stream Enrich mode for EmrEtlRunner, improving [Snowplow Lambda architecture][discourse-lambda-architecture].

Unfortunately, several critical bugs were introduced in recovery process of pipelines with Stream enrich mode enabled, that combined can lead to folders being staled in `enriched.good` or archived without proper shredding and loading (but no data should be lost).

In Stream Enrich mode, EmrEtlRunner has new skippable step - `staging_stream_enrich`, which replaces both `staging` and `enrich` steps from classic Batch Enrich mode.
EmrEtlRunner R102 accepts these skip steps and effectively makes them no-op, which can lead pipeline operator to think that EmrEtlRunner did not add staging step.
However, without skipped `staging_stream_enrich` it does stage enriched data into `enriched.good` folder.

Another related bug is always false negative for "ongoing run" check that results in run folders being staled in `enriched.good`.

All these bugs were addressed in R104 Stoplesteinan.

<h2 id="affected">2. Who is affected</h2>

All bugs described above impact only Stream Enrich mode and do not cause issues in classic Batch Enrich mode.
Pipeline likely was affected by these bugs if recovery attempt was made with R102.

* If recovery process was launched skipping `staging` or `enrich` - you need check `enriched.good` for leftover folders
* If recovery process was launched skipping also `shred` or `rdb_load` - you need to check if Redshift misses any data from folders present in `enriched.archive` or `shredded.archive`

<h2 id="recovery">3. How to recover</h2>

Recommended way to recover is to [upgrade](#upgrading) to R104 and launch usual recovery process, e.g. with `--resume-from shred` or `--skip staging_stream_enrich`.
If data was archived without loading or for some reasons immediate upgrade is not possible - you can simply restage data from run folders to `enriched.stream` folder to be staged and processed during next launch.

<h2 id="upgrading">4. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R10x [STR] PII Enrichment phase 2][r10x-pii], enhancing our recently-released GDPR-focused PII
  Enrichment for the realtime pipeline
* [R10x [STR] New webhooks and enrichment][r10x-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]


<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[stoplesteinan]: https://en.wikipedia.org/wiki/Stoplesteinan
[stoplesteinan-img]: /assets/img/blog/2018/04/stoplesteinan.jpg

[r102-post]: https://snowplowanalytics.com/blog/2018/04/03/snowplow-r102-afontova-gora-with-emretlrunner-improvements/

[discourse-lambda-architecture]: https://discourse.snowplowanalytics.com/t/how-to-setup-a-lambda-architecture-for-snowplow/249

[eer-ddl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r104_stoplesteinan.zip

[r10x-pii]: https://github.com/snowplow/snowplow/milestone/153
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[r10x-ms]: https://github.com/snowplow/snowplow/milestone/158

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r104-stoplesteinan
[discourse]: http://discourse.snowplowanalytics.com/
