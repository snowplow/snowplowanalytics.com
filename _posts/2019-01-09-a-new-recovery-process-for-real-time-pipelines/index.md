---
layout: post
title-short: Snowplow Event Recovery 0.1.0 released
title: "Snowplow Event Recovery 0.1.0 released"
tags: [snowplow, real-time, GCP, AWS, recovery, bad-rows]
author: Ben
category: releases
permalink: /blog/2019/01/09/snowplow-event-recovery-0.1.0-released/
---

We are excited to announce the release of [Snowplow Event Recovery][ser]. This project lets you
run data recoveries on data emitted by real-time Snowplow pipelines on AWS and GCP.

Please read on after the fold for:

1. [Overview](#overview)
2. [Recovery scenarios](#csl)
3. [Snowplow Event Recovery on AWS](#aws)
4. [Snowplow Event Recovery on GCP](#gcp)
5. [Getting help](#help)

<!--more-->

<h2 id="overview">1. Overview</h2>

<h3 id="current">1.1 Current approach</h3>

<h3 id="new">1.2 New approach</h3>

Snowplow Event Recovery aims to tackle most of these issues and make the data recovery process:

- not require any coding for the most common cases
- extensible when outside the most common cases
- testable
- unified across the real-time pipelines (AWS and GCP) and, in the future across all pipelines
(real-time and batch)

<h2 id="csl">2. Recovery scenarios</h2>

xx

<h3 id="out-of-the-box">2.1 Out of the box recovery scenarios</h3>

<h3 id="custom">2.2 Custom recovery scenarios</h3>

<h3 id="config">2.3 Configuration</h3>

We can then combine

<h2 id="aws">3. Snowplow Event Recovery on AWS</h2>

<h2 id="gcp">4. Snowplow Event Recovery on GCP</h2>

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[release]: https://github.com/snowplow-incubator/snowplow-event-recovery/releases/0.1.0
[ser]: https://github.com/snowplow-incubator/snowplow-event-recovery/

[discourse]: https://discourse.snowplowanalytics.com/
