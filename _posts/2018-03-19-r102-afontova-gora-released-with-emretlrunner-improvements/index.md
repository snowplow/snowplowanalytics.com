---
layout: post
title: "Snowplow R102 Afontova Gora released with EmrEtlRunner improvements"
title-short: Snowplow R102 Afontova Gora
tags: [google analytics, measurement protocol]
author: Anton
category: Releases
permalink: /blog/2018/03/28/snowplow-r102-wfontova-gora-with-emretlrunner-improvements/
---

We are pleased to announce the release of [Snowplow R102][release-notes]. This batch pipeline release brings several long-awaited improvements and bugfixes into EmrEtlRunner.

Read on for more information on R102 Afontova Gora, named after [the complex of Upper Paleolithic sites nearby Krasnoyarsk, Central Siberia][afontova-gora]:

<!--more-->

1. [Support for Kinesis-enriched data](#kinesis-enrich)
2. [New bootstrap scripts](#bootstrap)
3. [RDB Loader R29 compatibility](#rdb-loader)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

![afontova-gora][afontova-gora-img]

<h2 id="why">1. Support for Kinesis-enriched data</h2>

Broadly speaking, Snowplow platform has two primary flavors: batch and realtime.
Both flavors have own characteristics and use cases.
For example, with batch users are able to load enriched data to Redshift and Snowflake, while with realtime - to Elasticsearch.
At the same time batch is cheap, predictable and easy-to-recover, while realtime is more expensive and implies more magic behind the scenes.

However, nobody said it is impossible to get benefits of both approaches in a single pipeline.
So called [Lambda architecture][discourse-lambda-architecture] was designed to achieve scalable and fault-tolerant combination of batch and realtime layers.

In most common scenario, Scala Stream Collector writes raw data to S3 and Kinesis, where processed by Spark Enrich and Stream Enrich respectively.
At the same time, good Lambda architecture implementation assumes that no resources are wasting on duplicated efforts and enrichment is exactly a duplicated effort, happeining in both layers.


<h2 id="architecture">2. New bootstrap scripts</h2>

<h2 id="rdb-loader">3. RDB Loader R29 compatibility</h2>


<h2 id="upgrading">5. Upgrading</h2>

On the client-side you will need to make use of the plugin as described in [section 3](#plugin).

To benefit from the new Google Analytics integration on the batch pipeline side, you'll need to bump the
Spark Enrich version used in the EmrEtlRunner configuration file:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.12.0
{% endhighlight %}

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R100 [BAT] PII Enrichment phase 1][r100-pii], the first wave of GDPR features being added to Snowplow, centred on a new enrichment which can pseudonymize sensitive personally identifiable information
* [R10x [STR] GCP support][r10x-gcp], which will let you run the Snowplow realtime pipeline on
Google Cloud Platform
* [R10x [BAT] Priority fixes][r10x-bat], various stability, security and data quality improvements for the batch pipeline

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[afontova-gora]: https://en.wikipedia.org/wiki/Afontova_Gora
[afontova-gora-img]: /assets/img/blog/2018/03/afontova-gora.jpg

[discourse-lambda-architecture]: https://discourse.snowplowanalytics.com/t/how-to-setup-a-lambda-architecture-for-snowplow/249
[discourse-stream-vs-batch]: https://discourse.snowplowanalytics.com/t/stream-vs-batch/1867

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r99-carnac
[discourse]: http://discourse.snowplowanalytics.com/

[r100-pii]: https://github.com/snowplow/snowplow/milestone/149
[r10x-gcp]: https://github.com/snowplow/snowplow/milestone/138
[r10x-bat]: https://github.com/snowplow/snowplow/milestone/145

[rfc]: https://discourse.snowplowanalytics.com/t/sending-google-analytics-events-into-snowplow/1201
[ga]: https://analytics.google.com/analytics/web
[mp]: https://developers.google.com/analytics/devguides/collection/protocol/v1/
[ga-plugin]: https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins
[spga-plugin]: https://github.com/snowplow-incubator/snowplow-google-analytics-plugin
[mp-schemas]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics.measurement-protocol
[spreadsheet]: https://docs.google.com/spreadsheets/d/1Y4dLkFPWhAqtWdjQA-C4Oi-5dTyrw8hD3xA8_DdcklM/edit#gid=0
[pageview]: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#page
