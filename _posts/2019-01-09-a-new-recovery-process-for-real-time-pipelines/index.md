---
layout: post
title-short: Snowplow Event Recovery 0.1.0 released
title: "Snowplow Event Recovery 0.1.0 released"
tags: [snowplow, real-time, GCP, AWS, recovery, bad-rows]
author: Ben
category: releases
permalink: /blog/2019/01/09/snowplow-event-recovery-0.1.0-released/
---

We are excited to announce the release of [Snowplow Event Recovery][ser].

The different Snowplow pipelines being all non-lossy, if something goes wrong during, for example,
schema validation or enrichment the payloads (alongside the errors that happened) are stored into a
bad rows storage solution, be it a data stream or object storage, instead of being discarded.

The goal of recovery is to fix the payloads contained in these bad rows so that they are ready to be
processed successfully by a Snowplow enrichment platform.

Snowplow Event Recovery lets you run data recoveries on data emitted by real-time Snowplow pipelines
on AWS and GCP.

Please read on after the fold for:

1. [Overview](#overview)
2. [Recovery scenarios](#csl)
3. [Snowplow Event Recovery on AWS](#aws)
4. [Snowplow Event Recovery on GCP](#gcp)
5. [Roadmpa](#roadmap)
6. [Getting help](#help)

<!--more-->

<h2 id="overview">1. Overview</h2>

Our current approach to data recovery, [Hadoop Event Recovery][hadoop-recovery], suffers from a few
issues:

- it's limited to data produced by the batch pipeline
- you need to code your own recovery almost from scratch in JavaScript
- you cannot test this JavaScript except by running an actual recovery
- it doesn't promote reuse: if you run the same recovery twice, you'll need to copy/paste your
recovery code from one recovery to another

Snowplow Event Recovery aims to tackle most of these issues and make the data recovery process:

- not require any coding for the most common cases
- extensible when outside the most common cases
- testable
- unified across the real-time pipelines (AWS and GCP) and, in the future across all pipelines
(real-time and batch)

<h2 id="csl">2. Recovery scenarios</h2>

<h3 id="out-of-the-box">2.1 Out of the box recovery scenarios</h3>

<h3 id="custom">2.2 Custom recovery scenarios</h3>

<h3 id="config">2.3 Configuration</h3>

We can then combine

<h2 id="aws">3. Snowplow Event Recovery on AWS</h2>

<h2 id="gcp">4. Snowplow Event Recovery on GCP</h2>

Leveraging the Google Cloud Storage Loader

<h2 id="roadmap">5. Roadmap</h2>

rfc

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[release]: https://github.com/snowplow-incubator/snowplow-event-recovery/releases/0.1.0
[ser]: https://github.com/snowplow-incubator/snowplow-event-recovery/

[discourse]: https://discourse.snowplowanalytics.com/

[hadoop-recovery]: https://github.com/snowplow/snowplow/wiki/Hadoop-Event-Recovery
