---
layout: post
title: Snowplow R119 Tycho Magnetic Anomaly Two production release with new bad row format 
title-short: Snowplow R119 Tycho Magnetic Anomaly Two
tags: [snowplow, enrichment, bad-rows, release]
author: Anton
category: Releases
permalink: /blog/2020/04/29/snowplow-release-r119/
---

We are thrilled to release [Snowplow R119 Tycho Magnetic Anomaly Two][snowplow-release].

This release is about as big as they come, as it is an important milestone for the Snowplow pipeline. It marks the production ready release of a new bad rows (failed events) format and becomes the **last umbrella release** in the history of this project.

Read on to learn more about Snowplow R119 Tycho Magnetic Anomaly Two, named after the [powerful Space Odyssey monolithic artefact that breaks itself into smaller objects][tma2].

![tma2-img][tma2-img]

credit: _2001: A Space Oddyssey_

In this post:

1. [Production release of the new failed events format](#badrows-ga)
2. [No more monorepo](#monorepo)
3. [Other changes](#other)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

<h2 id="badrows-ga">1. Production release of the new failed events format</h2>

In [Snowplow R118 Morgantina][r118-post] we introduced a new format for failed events (bad rows), bringing a much more structured approach for events that fail at any step of the pipeline. This significantly improves the experience of diagnosing what is causing the failures. For more information on understanding failed events see our documentation [here][fe-docs]

We announced R118 as a public beta, given the big changes we made in that release.

We, our open source community and customers extensively tested all assets from R118 and now we're excited to announce that R119 marks general availability of the new format and all associated functionality.

We identified several bugs in R118 that are related to changes we've made there:

* Events from a POST payload could get lost if the payload contained at least one corrupted event ([#4320][issue-4320])
* Enrich process could crash with `NullPointerException` in case of empty query parameter in IgluAdapter ([#4330][issue-4320])
* Enrich process could crash with `NullPointerException` in case of empty query parameter in Snowplow Adapter ([#4324][issue-4324], thanks [Rob Kingston][robkingston] for spotting it!)

In order to make R119 production-ready we also wanted to make sure that new functionality related to bad rows is on feature-parity (or above) with the legacy format.

Hence the Event Recovery job 0.2.0 will be announced soon, which leverages all benefits of the new format.

<h2 id="monorepo">2. Change in Snowplow Open Source</h2>

Historically, most of Snowplow's Open Source estate was hosted by a single [GitHub monorepository][monorepo].
This repository holds the whole history of changes back to inception in 2012.
Almost every month we then would do a big bang release with all assets and an associated blog post.
One of the goals of these big bang releases was a compatibility guarantee, which meant that all assets within a single release are compatible with each other.

However, as Snowplow's OSS estate was growing, we started to realise that it's getting harder to maintain this guarantee and that the monorepository approach makes our development process very inflexible as we sometimes had to do an umbrella release and a blog post just for an urgent hot fix.
In order to solve that problem we've made a decision to split the Snowplow monorepository into individual repositories, each containing code for a single application.

We expect this change will make development even more OSS-friendly and easier to contribute to.

We also would like to use this as a next step in our batch pipeline deprecation process and archive the following components:

* [Snowplow Cloudfront Collector][clojure]
* [Snowplow Clojure Collector][clojure]
* [Hadoop Elasticsearch Sink][hadoop]

We're creating the following new repositories for our subprojects:

* Scala Stream Collector
* Scala Common Enrich
* Stream Enrich
* Beam Enrich (which already existed as independepent asset for a couple of months)
* EmrEtlRunner
* Spark Enrich

We're not going to delete the current monorepository, rather we are planning to use it as starting point for the OSS community, containing all necessary links to the latest assets in a form of git sumbodules.

We will keep doing the Snowplow umbrella meta releases, announcing any breaking changes in the way components work together.

<h1 id="other">3. Other changes</h1>

Apart from ground-breaking changes such as the new failed events format and change in the project structure, we also made a few additional tweaks: 

* An event that has an attached invalid context (e.g. by API request enrichment) will result in a bad row and it is guaranteed that enrichment will always produce either one good or one bad row ([#3795][issue-3795])
* EmrEtlRunner now retries to acquire a connection to EMR if current one is lost ([#4290][issue-4290])
* EmrEtlRunner now properly sets amount of core instances, which previously would led to an under-provisioned cluster ([#4285][issue-4285])
* Extensive unit test coverage added accross the enrichment workflow
* Allow Stream Enrich to download data from private S3 or GCS buckets ([#4269][issue-4269])

<h1 id="upgrading">4. Upgrading</h1>
For Snowplow Insights customers, there is nothing you need to do. We will be in touch with an upgrade message with details of when we will be upgrading your production pipeline.

The upgrade guide for open source users can be found on our [wiki page](https://github.com/snowplow/snowplow/wiki/Upgrade-Guide#r119).

<h1 id="roadmap">5. Roadmap</h1>

Some of the work that is coming up:

* Event Recovery 0.2.0
* RDB Loader Update
* BQ Loader Update 

<h1 id="help">6. Getting help</h1>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. Open source users will receive high-priority support for components of this release.

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r119-tycho-magnetic-anamoly-two
[fe-docs]: https://docs.snowplowanalytics.com/docs/managing-data-quality/understanding-failed-events/
[r118-post]: https://snowplowanalytics.com/blog/2020/01/16/snowplow-release-r118-badrows/
[failed-events-docs]: https://docs.snowplowanalytics.com/docs/managing-data-quality/understanding-failed-events/
[discourse]: http://discourse.snowplowanalytics.com/
[clojure]: https://discourse.snowplowanalytics.com/t/deprecation-notice-clojure-collector-and-spark-enrich/3443
[hadoop]: https://discourse.snowplowanalytics.com/t/migrating-the-snowplow-batch-jobs-from-scalding-to-spark/492

[issue-4320]: https://github.com/snowplow/snowplow/issues/4320
[issue-4324]: https://github.com/snowplow/snowplow/issues/4324
[issue-4330]: https://github.com/snowplow/snowplow/issues/4330
[issue-3795]: https://github.com/snowplow/snowplow/issues/3795
[issue-4290]: https://github.com/snowplow/snowplow/issues/4290
[issue-4285]: https://github.com/snowplow/snowplow/issues/4285
[issue-4269]: https://github.com/snowplow/snowplow/issues/4269
[robkingston]: https://twitter.com/robkingston

[monorepo]: https://github.com/snowplow/snowplow

[tma2]: https://2001.fandom.com/wiki/Jovian_Monolith
[tma2-img]: /assets/img/blog/2020/04/tma2.jpg
