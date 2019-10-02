---
layout: post
title-short: Snowplow 94 Hill of Tara
title: "Snowplow 94 Hill of Tara released"
tags: [snowplow, kinesis, realtime]
author: Ben
category: Releases
permalink: /blog/2017/10/10/snowplow-r94-hill-of-tara-realtime-pipeline-auto-scaling-issue/
---

We are pleased to announce the urgent release of [Snowplow 94 Hill of Tara][snowplow-release], named after [the archaeological complex in Ireland][hill-of-tara].

We take data loss extremely seriously at Snowplow - shortly after the [Snowplow 93 Virunum][virunum] release, routine load testing of another component (the Elasticsearch Loader) detected an active data loss scenario for our core Stream Enrich app, introduced in R93. This data loss manifests itself around auto-scaling of the Stream Enrich component and the Kinesis stream it is writing to.

On discovering this, we immediately prioritised an urgent Snowplow release to fix this specific issue, pushing back the other Snowplow releases we are working on. 

<!--more-->

Please read on after the fold for:

1. [Fixing the Stream Enrich data loss issue](#enrich-scaling)
2. [Upgrading](#upgrading)
3. [Roadmap](#roadmap)
4. [Help](#help)


<h2 id="enrich-scaling">1. Fixing the Stream Enrich data loss issue</h2>

Prior to R93, Stream Enrich would unnecessarily crash when the Kinesis stream that Stream Enrich was
writing to was resharding and Stream Enrich was itself undergoing auto-scaling.

This issue was solved in R93 by Stream Enrich failing to instantiate the Kinesis sink until the stream had finished resharding. However, R93's Stream Enrich would unfortunately continue to read raw events and checkpoint those reads, resulting in missing enriched events.

In fact, it is completely fine to write to a stream in the process of resharding ([#3452][i3452]), so this behavior has been corrected in R94, fixing the underlying bug.

There is a [comprehensive guide to this issue][scaling-thread] on Discourse, in case you have been
affected by it or would like to discuss it further.

<h2 id="upgrading">2. Upgrading</h2>

The latest version of Stream Enrich is available from our Bintray [here][se-dl].

<h2 id="roadmap">3. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R95 [BAT] Ellora][r95], enhancing our Redshift event storage with ZSTD encoding, plus various bug fixes for the batch pipeline
* [R96 [STR] Zeugma][r96], which will add support for NSQ to the stream processing pipeline, ready for adoption in Snowplow Mini
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark,
Unbounce, StatusGator)

<h2 id="help">4. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r94-hill-of-tara

[virunum]: /blog/2017/10/03/snowplow-r93-virunum-released-realtime-pipeline-refresh/

[scaling-thread]: https://discourse.snowplowanalytics.com/t/important-alert-r93-bug-may-result-in-missing-enriched-data-when-resharding-kinesis-stream/

[r95]: https://github.com/snowplow/snowplow/milestone/147
[r96]: https://github.com/snowplow/snowplow/milestone/103
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144

[discourse]: http://discourse.snowplowanalytics.com/

[se-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.11.1.zip

[i3452]: https://github.com/snowplow/snowplow/issues/3452
