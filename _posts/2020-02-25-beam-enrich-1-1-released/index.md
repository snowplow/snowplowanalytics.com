---
layout: post
title: "Beam Enrich 1.1.0 released"
title-short: Beam Enrich 1.1.0 released
tags: [snowplow, beam-enrich, enrichment]
author: Peel
category: Releases
permalink: /blog/2020/02/24/beam-enrich-1-1-released/
---

We are pleased to announce [version 1.1.0][release] of our Apache Beam enrich package that allows labelling jobs. Along the lines we updated Dataflow SDK for improved Dataflow compatibility. This is the first minor version released from its new home at [snowplow/beam-enrich][repository].

<!--more-->

<h2 id="partitioning">1. Job labelling</h2>

A small change that allows easier searching and partitioning costs by defined tag. The main use case is to allow users differentiate costs among environments. Previously, having multiple instances of a job running, you could only try to filter them by names. Now, labels can be applied across multiple services.

<h2 id="upgrading">2. Upgrading</h2>

We have added a new optional `labels` flag to apply a JSON-formatted set of labels. For example in order to set a flag named `environment` and set its value to `dev` and `version` set to `beta`, following additional flag can be used: `--labels={"environment": "dev", "version": "beta" }`. By default no labels are set.
For more details and examples on configuring `beam-enrich` see our [README][readme].

<h2 id="roadmap">3. Roadmap</h2>

Beam enrich continues to evolve at Snowplow. If you have any features in mind, feel free to log an issue in [GitHub repository][issues].

<h2 id="contributing">4. Contributing</h2>

You can check out the [beam-enrich repository][repository] if you'd like to get involved!

<h2 id="contributing">5. Getting Help</h2>

If you have any questions or run into any problem, raise an [issue][issues] please visit [our Discourse forum][discourse].

[readme]: https://github.com/snowplow/beam-enrich/blob/master/README.md
[release]: https://github.com/snowplow/beam-enrich/releases/tag/1.1.0

[repository]: https://github.com/snowplow/beam-enrich
[issues]: https://github.com/snowplow/beam-enrich/issues/

[discourse]: https://discourse.snowplowanalytics.com/
