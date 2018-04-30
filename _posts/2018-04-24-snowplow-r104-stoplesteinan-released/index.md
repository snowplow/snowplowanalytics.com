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
This release brings a few critical stability-related bug fixes to the new Stream Enrich mode introduced in EmrEtlRunner in [R102 Afontova Gora][r102-post].

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

In R102 Afontova Gora we presented a new Stream Enrich mode for EmrEtlRunner, evolving the [Snowplow Lambda architecture][discourse-lambda-architecture] towards something more performant and cost-effective.

Unfortunately, several critical bugs were introduced in the **recovery process** of pipelines with Stream Enrich mode enabled; these issues combined can lead to folders becoming "stalled" in `enriched.good` or archived without proper shredding and loading (though no data should be lost).

In Stream Enrich mode, EmrEtlRunner has a new skippable step, `staging_stream_enrich`, which replaces both `staging` and `enrich` steps from the classic Batch Enrich mode.

The problem is that EmrEtlRunner R012 running in Stream Enrich mode still accepted the inappropriate `staging` and `enrich` steps as valid skip values; recovery scripts which were not updated to skip `staging_stream_enrich` instead of `staging` and `enrich` would:

* Silently swallow the `staging` and `enrich` skips
* Run an unwanted `staging_stream_enrich` step, which would incorrectly stage new enriched data into an `enriched.good` folder
* This new folder of enriched data would be "stalled" in `enriched.good` and never processed

Another related bug was EmrEtlRunner returning a false negative for the "ongoing run" check when enriched event folders had stalled in `enriched.good`.

These issues have been addressed in R104 Stoplesteinan.

<h2 id="affected">2. Who is affected</h2>

The bugs described above impact **only** Stream Enrich mode and do not cause issues in classic Batch Enrich mode. A corresponding Snowplow pipeline likely was affected by these bugs if a recovery attempt was made with R102:

* If a recovery process was launched which incorrectly skipped `staging` or `enrich` - you should check `enriched.good` for leftover folders
* If a recovery process was launched which also skipped `shred` or `rdb_load` - you should check if Redshift is missing any data from folders present in `enriched.archive` or `shredded.archive`

<h2 id="recovery">3. How to recover</h2>

If you find that you are missing data in Redshift and in `shredded.archive`, then first [upgrade](#upgrading) to R104.

To recover the data, you can simply restage data from the run folders to the `enriched.stream` folder, to be staged and processed during your next launch.

<h2 id="upgrading">4. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

There are no configuration-level changes in this release.

When you upgrade, make sure to update any recovery scripts you have which previously featured `--skip staging,enrich` and change them to either `--resume-from shred` or `--skip staging_stream_enrich`.

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R105 Pompeii][r015-dedupe], fixing an urgent duplication issue which was introduced in R101 Neapolis (when we introduced the initial GCP support)
* [R106 Acropolis][r106-pii], enhancing our recently-released GDPR-focused PII
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

[r105-dedupe]: https://github.com/snowplow/snowplow/milestone/159
[r106-pii]: https://github.com/snowplow/snowplow/milestone/153
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[r10x-ms]: https://github.com/snowplow/snowplow/milestone/158

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r104-stoplesteinan
[discourse]: http://discourse.snowplowanalytics.com/
