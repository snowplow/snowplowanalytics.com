---
layout: post
title-short: "Snowplow R115 with minor updates to EmrEtlRunner and Event Manifest Populator"
title: "Snowplow R115 with minor updates to EmrEtlRunner and Event Manifest Populator"
tags: [snowplow, emretlrunner, release]
author: Benjamin Benoist
category: Releases
permalink: /blog/2019/07/18/snowplow-r115-sigiriya-emretlrunner/
---

We are pleased to release [Snowplow R115 Sigiriya][snowplow-release], named after
[the ancient ancient rock fortress in Sri Lanka](https://en.wikipedia.org/wiki/Sigiriya#Archaeological_remains_and_features). This Snowplow release includes two updates to EmrEtlRunner and one to Event Manifest Populator (used for cold start deduplication).

1. [EmrEtlRunner](#eer)
2. [Event Manifest Populator](#emp)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Getting help](#help)

<h2 id="eer">1. Updates to EmrEtlRunner</h2>

<h3>1.1. Bug fix to the function displaying failures</h3>

While improving the reliability of [EmrEtlRunner](https://github.com/snowplow/snowplow/tree/master/3-enrich/emr-etl-runner) in R114, a bug had been introduced where a step could fail without having the error message in the logs.

This has now been fixed and we improved the code quality of `EmrEtlRunner` by adding more unit testing.

<h3>1.2. Step failure on transient EMR cluster</h3>

Still in an effort to improve the reliability of `EmrEtlRunner`, an update has been made so that `EmrEtlRunner` fails if an EMR step can't be successfully submitted to a transient EMR cluster.

This was already the case for a standard EMR cluster.

<h2 id="emp">2. Event Manifest Populator</h2>

To solve the "cold start" problem for cross-batch deduplication in the RDB Shredder, we had developed the [Event Manifest Populator](https://github.com/snowplow/snowplow/tree/master/5-data-modeling/event-manifest-populator).

It was developed to use events emitted by `spark-enrich` as the input, but we have now added the possibility to also read events emitted by `stream-enrich`.

<h2 id="upgrading">3. Upgrading</h2>

The new version of EmrEtlRunner with improved reliability is available in
[our Bintray](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r115_sigiriya.zip).

<h2 id="roadmap">4. Roadmap</h2>

2 Snowplow releases are currently being worked on:

* [R116 Madara Rider](https://github.com/snowplow/snowplow/milestone/171): this release will mainly add features to the [Scala Stream Collector](https://github.com/snowplow/snowplow/tree/master/2-collectors/scala-stream-collector), like for instance the possibility to specify custom path mappings, the support for TLS port binding and certificate or the ossibility to use multiple cookie domains.
* [R117 Morgantina](https://github.com/snowplow/snowplow/milestone/154): this release will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r115-sigiriya
[discourse]: http://discourse.snowplowanalytics.com/

