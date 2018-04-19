---
layout: post
title: "Snowplow R102 Afontova Gora released with EmrEtlRunner improvements"
title-short: Snowplow R102 Afontova Gora
tags: [batch, emr, emretlrunner, lambda]
author: Anton
category: Releases
permalink: /blog/2018/04/03/snowplow-r102-afontova-gora-with-emretlrunner-improvements/
discourse: true
---

We are pleased to announce the release of [Snowplow R102][release-notes]. This Snowplow batch pipeline release brings several long-awaited improvements and bugfixes into EmrEtlRunner, improving the efficiency and stability of the batch pipeline.

Read on for more information on R102 Afontova Gora, named after [the complex of Upper Paleolithic sites near my hometown of Krasnoyarsk, Central Siberia][afontova-gora]:

<!--more-->

1. [Support for Kinesis-enriched data](#kinesis-enrich)
2. [RDB Loader R29 compatibility](#rdb-loader)
3. [Other improvements](#improvements)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![afontova-gora][afontova-gora-img]

<h2 id="kinesis-enrich">1. Support for Stream Enrich'ed events</h2>

<h3>1.1 Snowplow Lambda architecture 101</h3>

Broadly speaking, the Snowplow platform has two primary flavors: the original batch pipeline, and the newer realtime pipeline.

The Snowplow realtime pipeline is *not* a strict superset of the capabilities of our batch pipeline: the realtime pipeline is missing the batch pipeline's functionality to prepare and load enriched events into Amazon Redshift.

For Snowplow realtime users wanting to load Redshift, we support a so-called [Lambda architecture][discourse-lambda-architecture], which serves as a scalable and fault-tolerant combination of batch and realtime layers within single a pipeline.

In the Snowplow Lambda architecture, the Scala Stream Collector writes raw collector payload data from Kinesis to S3, and it is at this point that the pipeline splits into two independent flows, with:

1. Stream Enrich reading from Kinesis, and then onwards into further Kinesis streams
2. Spark Enrich reading from S3, and then onwards into RDB Shredder and RDB Loader

Although this architecture is widely used and works well, there is some inefficiency here: we are running the same enrichment process *twice* - in the realtime and batch layers.

<h3>1.2 EmrEtlRunner's new Stream Enrich support</h3>

To remove this duplication, in theory we could setup a [Snowplow S3 Loader][s3-loader] downstream of Stream Enrich's enriched event stream, sinking those enriched events to S3. But unfortunately EmrEtlRunner didn't support processing those enriched event files, leading creative members of the community to try workarounds involving our [Dataflow Runner][dataflow-runner] app

R102 Afontova Gora fixes this, introducing a "Stream Enrich mode" for EmrEtlRunner; this mode of operation effectively forces EmrEtlRunner to skip the staging of the collector payloads and the running of Spark Enrich - instead, EmrEtlRunner kicks off by staging enriched data written by S3 Loader.

In "Stream Enrich mode", the EmrEtlRunner steps are as follows:

1. Stage the enriched events which were written to S3 by the realtime pipeline
2. Prepare the enriched events for Redshift using RDB Shredder
3. Load the events into Redshift using RDB Loader
4. Archive the events in S3

One important difference: in Stream Enrich mode the enriched event files are the master copy of the data you will load into Redshift, so make sure never to manually delete data from the `enriched.good` folder.

If you are an existing Lambda architecture user, please check out the Upgrading section below for help moving to the new architecture.

<h2 id="rdb-loader">2. RDB Loader R29 compatibility</h2>

The upcoming release for [RDB Loader][rdb-loader], R29, focuses on improving stability, and guarding against problems such as S3 eventual consistency and accidental double-loading.

This release's EmrEtlRunner update now prepares for the upcoming RDB Loader release, by passing additional information to these EMR steps if the specified versions of the artifacts are from R29 or above.

Stay tuned for the RDB Loader R29 release, where the new functionality will be explained.

<h2 id="improvements">3. Other improvements</h2>

This release of EmrEtlRunner also brings multiple bugfixes and improvements to the batch pipeline's operational stability.

EmrEtlRunner now tries to recover from very common, but intermittent, failures such as `RequestTimeout` ([#3468][issue-3468]) or `ServiceUnavailable` ([#3539][issue-3539]). This should reduce unnecessary manual recoveries.

Additionally, for AMI 5 clusters, EmrEtlRunner now uses a [specific bootstrap action][issue-3609] which tweaks network settings to make a cluster fully compatible with [AWS NAT Gateway][nat-gateway].

<h2 id="upgrading">4. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

<h3>4.1 Upgrading for batch pipeline users</h3>

If you are only using the Snowplow batch pipeline, then it is still important to upgrade EmrEtlRunner, to prepare for the next RDB Loader release.

You won't have to make any configuration file updates as part of this upgrade.

<h3>4.2 Upgrading for Lambda architecture users</h3>

If you currently run a Lambda architecture (realtime plus batch), then you will most likely want to upgrade to EmrEtlRunner's new "Stream Enrich mode".

To turn this mode on, you need to add a new `aws.s3.buckets.enriched.stream` property to your `config.yml` file.
This should point to the bucket where you have configured [Snowplow S3 Loader][s3-loader]) to write enriched events. Add this like so:

{% highlight yaml %}
aws:
  s3:
    buckets:
      enriched:
        stream: s3://path-to-kinesis/output/
{% endhighlight %}

In Stream Enrich mode, some properties in your `config.yml` file, such as `aws.s3.buckets.raw`, `aws.s3.buckets.enriched.bad` are `aws.s3.buckets.enriched.errors` are ignored by EmrEtlRunner and other batch applications.

For a complete example, we now have a dedicated sample [stream_config.yml][config-yml] template - this shows what you need to set, and what you can remove.

Notice that in Stream Enrich mode, `staging`, `enrich` and `archive_raw` steps are effectively no-op. To avoid staging enriched data during recovery in this mode you need to skip new `staging_stream_enrich` step.

**An important point:** you need to be careful when making this switchover to avoid either missing events from Redshift, or duplicating them. Our preferred switchover approach is to:

1. Prevent missing events, by building in some time period overlap between the raw and enriched folders in S3, **and**
2. Prevent duplication in Redshift, by temporarily enable cross-batch deduplication, if it's not already enabled

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R103 Paestum][r103-maxmind], an [urgent update][maxmind-announcement] of our IP Lookups Enrichment, moving us away from using the legacy MaxMind database format, which won't be updated after 2nd April 2018
* [R10x [STR] PII Enrichment phase 2][r10x-pii-2], enhancing our recently-released GDPR-focused PII Enrichment for the realtime pipeline

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[afontova-gora]: https://en.wikipedia.org/wiki/Afontova_Gora
[afontova-gora-img]: /assets/img/blog/2018/04/afontova-gora.jpg

[discourse-lambda-architecture]: https://discourse.snowplowanalytics.com/t/how-to-setup-a-lambda-architecture-for-snowplow/249
[discourse-stream-vs-batch]: https://discourse.snowplowanalytics.com/t/stream-vs-batch/1867

[s3-loader]: https://github.com/snowplow/snowplow-s3-loader
[dataflow-runner]: https://github.com/snowplow/dataflow-runner
[rdb-loader]: https://github.com/snowplow/snowplow-rdb-loader

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r102-afontova-gora
[discourse]: http://discourse.snowplowanalytics.com/

[issue-3468]: https://github.com/snowplow/snowplow/issues/3468
[issue-3539]: https://github.com/snowplow/snowplow/issues/3539
[issue-3609]: https://github.com/snowplow/snowplow/issues/3609
[nat-gateway]: https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-nat-gateway.html

[r103-maxmind]: https://github.com/snowplow/snowplow/milestone/156
[r10x-pii-2]: https://github.com/snowplow/snowplow/milestone/153

[maxmind-announcement]: https://discourse.snowplowanalytics.com/t/end-of-life-for-the-maxmind-legacy-ip-lookups-databases-important/1863

[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r102_afontova_gora.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r102-afontova-gora/3-enrich/emr-etl-runner/config/stream_config.yml.sample
