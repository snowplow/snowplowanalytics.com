---
layout: post
title: Snowplow R119 Tycho Magnetic Anomaly Two released with new bad row format generally available
title-short: Snowplow R119 Tycho Magnetic Anomaly Two
tags: [snowplow, enrichment, bad-rows, release]
author: Anton
category: Releases
permalink: /blog/2020/05/1/snowplow-release-r119/
---

We are excited to release [Snowplow R119 Tycho Magnetic Anomaly Two][snowplow-release],
This release is an important milestone for Snowplow pipeline. It makrs general availability of new bad rows (failed events) format and becomes last umbrella release in history of the project.
Read on to learn more about Snowplow R119 Tycho Magnetic Anomaly Two,  named after the [powerful Space Odyssey monolithic artefact that breaks itself into smaller objects][tma2].

![tma2-img][tma2]

1. [General availability of bad rows format](#badrows-ga)
2. [Changes in Snowplow Open Source](#monorepo)     **TODO: FROM ANTON IT FEELS THAT THE HEADING IS UNNECESSARY ALARMING**
3. [Other changes](#other)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

<h2 id="badrows-ga">1. General availability of bad rows format</h2>

In [Snowplow R118 Morgantina][r118-post] we introduced a new format for bad rows (failed events), bringing a much more structured approach for events failed at any step of the pipeline.
We announced R118 as public beta, given the big changes we've made in that release.
We and our open source community extensively tested all assets from R118 and now we're excited to announce that R119 marks general availability of new bad rows format and all associated functionality.

We identified several bugs in R118 that were related to changes we've made there:

* Events from a POST payload could get lost if the payload contained at least one corrupted event ([#4320][issue-4320])
* Enrich process could crash with `NullPointerException` in case of empty query parameter in IgluAdapter ([#4330][issue-4320])
* Enrich process could crash with `NullPointerException` in case of empty query parameter in Snowplow Adapter ([#4324][issue-4324], thanks [Rob Kingston][robkingston] for spotting it!)

In order to make R119 production-ready we also wanted to make sure that new functionality related to bad rows is on feature-parity (or above) with the legacy format.
Hence the Event Recovery job 0.2.0 will be announced soon, which leverages all benefits of the new format.

**TODO: MIKE N TO POTENTIALLY ADVERTISE ALL SHINY THINGS AVAILBLE TO PAID CUSTOMERS**

<h2 id="monorepo">2. Change in Snowplow Open Source</h2>

Historically, most of Snowplow Open Source estate was hosted by a single [GitHub monorepository][monorepo].
This repository holds the whole history of changes back to inception in 2012.
Almost every month we then would do a big bang release with all assets and associated blog post.
One of the goals of these big bang releases was a compatibility guarantee, which meant that all assets within a single release are compatible with each other.

However, as Snowplow OSS estate was growing, we started to realise that it's getting harder to maintain this guarantee and that the monorepository approach makes our development process very inflexible as we sometimes had to do an umbrella release and a blog post just for an urgent hot fix.
In order to solve that problem we've made a decision to split the Snowplow monorepository into individual repository, each containing code for a single application.
We hope that it will make our development even more OSS-friendly and easier to contribute.

We also would like to use this as a next step in our batch pipeline deprecation process and archive following components:

* Snowplow Cloudfront Collecotr
* Snowplow Clojure Collector
* Hadoop Elasticsearch Sink

We're creating following new repositories for our subprojects:

* Scala Stream Collector
* Scala Common Enrich
* Stream Enrich
* Beam Enrich (which already existed as independepent asset for a couple of months)
* EmrEtlRunner
* Spark Enrich
**TODO: WHAT ABOUT DATA MODELING**

We're not going to delete the current monorepository and planning to use it a starting point for OSS community, containing all necessary links to the latest assets in a form of git sumbodules.
We will keep doing the Snowplow umbrella meta releases, announcing any breaking changes in the way components work together.

<h1 id="other">3. Other changes</h1>

Apart from ground-breaking changes such as new bad rows format and change in the project structure, we also made a few tweaks 

* It is guaranteed that enrichment always produces either one good or one bad row ([#3795][issue-3795])
* EmrEtlRunner now retries to acquire a connection to EMR if current one got lost ([#4290][issue-4290])
* EmrEtlRunner now properly sets amount of core instances, which previously would led to an underprovisiouned cluster ([#4285][issue-4285])

<h1 id="upgrading">4. Upgrading</h1>

The upgrading guide can be found on our [wiki page](https://github.com/snowplow/snowplow/wiki/Upgrade-Guide#r119).

<h1 id="roadmap">5. Roadmap</h1>

**TODO: UP TO PRODUCT**

<h1 id="help">6. Getting help</h1>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. Open source users will receive high-priority support for components of this release.

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r119-tycho-magnetic-anamoly-two
[r118-post]: https://snowplowanalytics.com/blog/2020/01/16/snowplow-release-r118-badrows/
[failed-events-docs]: https://docs.snowplowanalytics.com/docs/managing-data-quality/understanding-failed-events/
[discourse]: http://discourse.snowplowanalytics.com/

[issue-4320]: https://github.com/snowplow/snowplow/issues/4320
[issue-4324]: https://github.com/snowplow/snowplow/issues/4324
[issue-4330]: https://github.com/snowplow/snowplow/issues/4330
[issue-3795]: https://github.com/snowplow/snowplow/issues/3795
[issue-4290]: https://github.com/snowplow/snowplow/issues/4290
[issue-4285]: https://github.com/snowplow/snowplow/issues/4285
[robkingston]: https://twitter.com/robkingston

[monorepo]: https://github.com/snowplow/snowplow

[tma2]: https://2001.fandom.com/wiki/Jovian_Monolith
[tma2-img]: /assets/img/blog/2020/04/tma2.jpg
