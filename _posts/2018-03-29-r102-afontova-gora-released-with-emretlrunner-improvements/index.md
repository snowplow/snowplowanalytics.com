---
layout: post
title: "Snowplow R102 Afontova Gora released with EmrEtlRunner improvements"
title-short: Snowplow R102 Afontova Gora
tags: [google analytics, measurement protocol]
author: Anton
category: Releases
permalink: /blog/2018/03/29/snowplow-r102-afontova-gora-with-emretlrunner-improvements/
---

We are pleased to announce the release of [Snowplow R102][release-notes]. This batch pipeline release brings several long-awaited improvements and bugfixes into EmrEtlRunner.

Read on for more information on R102 Afontova Gora, named after [the complex of Upper Paleolithic sites nearby Krasnoyarsk, Central Siberia][afontova-gora]:

<!--more-->

1. [Support for Kinesis-enriched data](#kinesis-enrich)
2. [RDB Loader R29 compatibility](#rdb-loader)
3. [Other improvements](#other)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![afontova-gora][afontova-gora-img]

<h2 id="why">1. Support for Kinesis-enriched data</h2>

<h3>1.1 Snowplow Lambda architecture 101</h3>

Broadly speaking, the Snowplow platform has two primary flavors: batch and realtime. Each with its own characteristics and use cases.
Batch pipeline is cheap, predictable and reliable, whereas realtime is faster, more expensive and employs more magic behind the scenes.

However, nobody said it is impossible to get the benefits of both approaches in a single pipeline.
So called [Lambda architecture][discourse-lambda-architecture] was designed to achieve a scalable and fault-tolerant combination of batch and realtime layers within single a pipeline.

In most common and widely-used architecture, Scala Stream Collector writes raw data from Kinesis to S3 and from this point, the pipeline splits into two independent flows, with Stream Enrich reading from Kinesis and Spark Enrich reading from S3 respectively.
At the same time, good Lambda architecture implementation assumes that no resources are wasted on duplicated efforts and in the above architecture, enrichment is nothing more than duplicated effort, happening in both layers and producing same result.

<h3>1.2 EmrEtlRunner Stream Enrich Mode</h3>

To improve the architecture described above, we can embrace [Snowplow S3 Loader][s3-loader] using single Stream Enrich to produce enriched data for the S3 sink.
But unfortunately until R102 Afontova Gora it was not possible to automate the batch part of this architecture with EmrEtlRunner, meaning users had to rely on custom [Dataflow Runner][dataflow-runner] playbooks for staging enriched data, shred it and load to Redshift.

Since R102 EmrEtlRunner supports Stream Enrich mode, which effectively forces it to skip the staging raw data and Spark Enrich steps, EmrEtlRunner can instead start from staging enriched data written by S3 Loader.
Instead of the classic `staging raw data -> enrich raw data -> shred enriched data -> load -> archive` steps, the pipeline becomes `staging stream-enriched data -> shred enriched data -> load -> archive`.

To turn this mode on, you need to add a new `aws.s3.buckets.enriched.stream` property to your `config.yml` file.
This new optional bucket should point to the bucket where S3 Loader writes enriched data.
In Stream Enrich mode, some properties such as `aws.s3.buckets.raw` or `enrich.versions` are ignored by EmrEtlRunner and can be removed.

<h2 id="rdb-loader">2. RDB Loader R29 compatibility</h2>

Upcoming [RDB Loader][rdb-loader] R29 is concentrated around increasing Shredder's and Loader's stability and dealing with problems such as S3 eventual consistency and accidental double-loading.
EmrEtlRunner from R102 passes necessary options to these EMR steps if specified versions of artifacts are from R29 or above.
For example, for Stream Enrich mode, RDB Loader won't add any new records to `atomic.manifest`, as `etl_tstamp` is effectively useless for data processed by Stream Enrich.

Apart from EMR options which will passed to EMR steps absolutely transparently, EmrEtlRunner also now allows you to optionally skip RDB Loader's upcoming `load_manifest_check` step, preventing data from being double-loaded.

<h2 id="architecture">3. Other improvements</h2>

Apart from changes related to stream enrich and RDB Loader R29, EmrEtlRunner also brings multiple bugfixes and changes increasing pipeline's stability.

EmrEtlRunner now tries to recover from very common, but intermittent failures such as `RequestTimeout` ([#3468][issue-3468]) or `ServiceUnavailable` ([#3539][issue-3539]), which were increasing amount of false alarms and adding unnecessary recover steps.
Also, for AMI5, EmrEtlRunner now uses [specific][issue-3609] bootstrap action tweaking network settings to make cluster fully compatible with [AWS NAT Gateway][nat-gateway]

<h2 id="upgrading">4. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

To start using EmrEtlRunner in Stream Enrich mode (assuming you have configured [Snowplow S3 Loader][s3-loader]) you will need to add new bucket:

{% highlight yaml %}
aws:
  s3:
    buckets:
      enriched:
        stream: s3://path-to-kinesis/output/
{% endhighlight %}

For a complete example, see our sample [config.yml][config-yml] template.

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R103 [BAT] IP Lookups Enrichment upgrade][r103-maxmind], urgent update of IP Lookup enrichment migrating to [new MaxMind database format][maximind-announcement]
* [R10x [BAT] PII Enrichment phase 2][r10x-pii-2], the second wave of GDPR features being added to Snowplow

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[afontova-gora]: https://en.wikipedia.org/wiki/Afontova_Gora
[afontova-gora-img]: /assets/img/blog/2018/03/afontova-gora.jpg

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

[r103-maximind]: https://github.com/snowplow/snowplow/milestone/156
[r10x-pii-2]: https://github.com/snowplow/snowplow/milestone/153

[maxmind-announcement]: https://blog.hqcodeshop.fi/archives/387-MaxMind-GeoIP-database-legacy-version-discontinued.html

[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r102_afontova_gora_knossos.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r102-afontova-gora/3-enrich/emr-etl-runner/config/config.yml.sample
