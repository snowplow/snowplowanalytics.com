---
layout: post
title-short: Snowplow 105 Pompeii
title: "Snowplow 105 Pompeii released"
tags: [snowplow, kinesis, realtime]
author: Ben
category: Releases
permalink: /blog/2018/05/01/snowplow-r105-pompeii-released-realtime-pipeline-duplication-issue/
---

We are pleased to announce the urgent release of [Snowplow 105 Pompeii][snowplow-release], named
after [the famous ancient Roman city][pompeii].

Shortly after the [Snowplow 103 Paestum][paestum] release, open source user
[Asger Bachmann][asgergb] noticed an increase in the number of duplicated events outputted by
Stream Enrich.

Upon reproducing the issue, we immediately prioritised an urgent Snowplow release to fix this
specific issue, pushing back the other Snowplow releases we are working on.

Please read on after the fold for:

1. [Fixing the Stream Enrich data duplication issue](#dupe)
2. [Upgrading](#upgrading)
3. [Roadmap](#roadmap)
4. [Help](#help)

![pompeii][pompeii-img]

<h2 id="dupe">1. Fixing the Stream Enrich data duplication issue</h2>

[Snowplow 101 Neapolis][neapolis] introduced sharing the same Kinesis sink across multiple
[Amazon Kinesis Client Library][kcl]'s `RecordProcessor`s which would result in the same Kinesis
sink being flushed as many times as there were `RecordProcessor`s leading to duplicated events if
there was more than one `RecordProcessor` running on the same Stream Enrich instance.

This behavior has been corrected in this release by affecting one Kinesis sink per
`RecordProcessor`.

There is a [comprehensive guide to this issue][dupe-thread] on Discourse detailing who can be
affected and the steps to mitigate the issue, in case you would like to discuss it further.

<h2 id="upgrading">2. Upgrading</h2>

The latest version of Stream Enrich is available from our Bintray [here][se-dl].

<h2 id="roadmap">3. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R106 Acropolis][r106-pii], enhancing our recently-released GDPR-focused PII
  Enrichment for the realtime pipeline
* [R10x [STR] New webhooks and enrichment][r10x-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">4. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r105-pompeii

[pompeii]: https://en.wikipedia.org/wiki/Pompeii
[pompeii-img]: /assets/img/blog/2018/05/pompeii.jpg

[paestum]: /blog/2018/04/17/snowplow-r103-paestum-released-with-ip-lookups-enrichment-upgrade/
[neapolis]: /blog/2018/03/21/snowplow-r101-neapolis-with-initial-gcp-support/

[dupe-thread]: https://discourse.snowplowanalytics.com/t/important-alert-r101-bug-may-result-in-duplicated-data-in-the-real-time-pipeline/1987

[r106-pii]: https://github.com/snowplow/snowplow/milestone/153
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[r10x-ms]: https://github.com/snowplow/snowplow/milestone/158

[snowflake-analytics]: https://www.snowflake-analytics.com/
[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[kcl]: https://github.com/awslabs/amazon-kinesis-client
[asgergb]: https://github.com/asgergb

[discourse]: http://discourse.snowplowanalytics.com/

[se-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.16.1#files
