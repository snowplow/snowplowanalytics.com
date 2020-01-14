---
layout: post
title: "Google Cloud Loader 0.2.0 released"
title-short: Google Cloud Loader 0.2.0
tags: [snowplow, gcs, gcp, loader]
author: Ben
category: Releases
permalink: /blog/2019/12/11/gcs-loader-0.2.0-released/
---

We are pleased to announce [version 0.2.0][release-020] of Google Cloud Storage loader that allows you to get more performance when using default settings.
This small release is centered around critical bug fixes and updated default configuration.

<!--more-->

<h2 id="shards">1. Default shard number</h2>

Google Dataflow is Google's job runner implementation that allows for "zero-configuration" scaling.
The autoscaling enables dynamic worker number adjustment to the needs of a pipeline.
Dataflow automatically detects imbalances in work assignments and can dynamically reassign underused workers to decrease job's overall processing time. However, setting a fixed number of shards (maintained throughout the job run) can negatively impact the dynamic work reassignment by either scattering data too much or throttling writes. Therefore making runner control the number of shards makes a better default and should comply to any environment that it is being run.

Previous shard numbering default would have often resulted in a lot of syncing and unnecessary bookkeeping. We observed significant drop in performance - down to 200 entries/sec on a `n1-standard-1` machine. With shard management being the runner's responsibility we're now able to use available resources more efficiently and rely on GCP's autoscaling practices bringing up the performance to more constant value. 
We observed that horizontal scaling does not scale the performance linearly. Because of both autoscaling and windowed writes the performance characteristic could resemble a saw diagram. Dataflow job then should operate within bounds of the traffic supplied by the collectors at around 1:1 ratio given a constant input source (so around 1-3k per node).

<h2 id="roadmap">2. Upgrading</h2>

To make use of the new defaults no additional steps need to be performed, however if running via Google Dataflow template, `--numShards=1` flag needs to be passed upon [template upload][gcs-loader-template-upload].

Keeping the old behaviour and set shards to a fixed number, set `--numShards=1` when running the job.

<h2 id="roadmap">3. Roadmap</h2>

GCS loader continues to evolve at Snowplow. In the next release are going to introduce improved data partitioning based upon data types.

If you have other features in mind, feel free to log an issue in [the GitHub repository][gcs-loader-issues].

<h2 id="contributing">4. Contributing</h2>

You can check out the [repository][gcs-loader-repo] if you'd like to get involved!

<h2 id="contributing">5. Getting Help</h2>

If you have any questions or run into any problem, [raise an issue][gcs-loader-issues] please visit [our Discourse forum][discourse].


[release-020]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/releases/tag/0.2.0

[gcs-loader-repo]: https://github.com/snowplow/dataflow-runner/
[gcs-loader-issues]: https://github.com/snowplow/dataflow-runner/issues/
[gcs-loader-template-upload]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader#cloud-dataflow-template

[discourse]: https://discourse.snowplowanalytics.com/
