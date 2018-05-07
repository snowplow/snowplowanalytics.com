---
layout: post
title-short: Snowplow 105 Pompeii
title: "Snowplow 105 Pompeii released"
tags: [snowplow, kinesis, realtime]
author: Ben
category: Releases
permalink: /blog/2018/05/07/snowplow-r105-pompeii-released-realtime-pipeline-duplication-issue/
---

We are pleased to announce the urgent release of [Snowplow 105 Pompeii][snowplow-release], named
after [the famous but ill-fated ancient Roman city][pompeii].

Shortly after the [Snowplow 103 Paestum][paestum] release, open-source user
[Asger Bachmann][asgergb] noticed an increase in the number of duplicated events outputted by
Stream Enrich. To be clear: our real-time pipeline on Kinesis does have [at-least once processing semantics][at-least-once], but the levels of duplication that Asger observed were far in excess of any normal operation.

Upon reproducing the issue, we immediately prioritised an urgent Snowplow release to fix this
specific issue, pushing back the other Snowplow releases currently in progress.

Please read on after the fold for:

1. [Fixing the Stream Enrich event duplication issue](#dupe)
2. [A word on quality](#quality)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

![pompeii][pompeii-img]

<h2 id="dupe">1. Fixing the Stream Enrich event duplication issue</h2>

As part of our refactor to support GCP, [Snowplow 101 Neapolis][neapolis] accidentally introduced the sharing of the same Kinesis sink across multiple [Amazon Kinesis Client Library][kcl]'s `RecordProcessor`s. This resulted in the same Kinesis
sink being flushed as many times as there were `RecordProcessor`s, leading to duplicated events if
there were more than one `RecordProcessor` running on the same Stream Enrich instance.

This behavior has been corrected in this release by re-implementing one Kinesis sink per
`RecordProcessor`.

There is a [comprehensive guide to this issue][dupe-thread] on Discourse, detailing who can be
affected and the steps to mitigate the issue, in case you would like to discuss it further.

<h2 id="quality">2. A word on quality</h2>

The event duplication issue introduced in R101 was a major bug, and does not reflect the code quality and operational standards that we aim for at Snowplow.

As our team grows and we strive for an ever-faster release cadence across our major projects, it is crucial that our software quality actually improves - we cannot achieve flow and deliver high throughput without high-grade quality-supporting processes.

On our side, we are prioritising two areas of improvement:

* Extending and enhancing our internal QA processes and tools, to make sure that issues such as this are identified at an early stage
* Improving our internal collaboration and communication around upcoming releases (from design through to publication), to give our wider team the ability to detect issues like this much earlier 

Another idea we are starting to consider is less frequent "LTS" (Long-Term Support) releases of Snowplow, similar for example to the [Ubuntu release process][ubuntu-lts].

Above all we want the community's ideas on how we can improve software quality at Snowplow. Do please share your thoughts in [our Discourse forum][discourse]. 

<h2 id="upgrading">3. Upgrading</h2>

The latest version of Stream Enrich is available from our Bintray [here][se-dl].

If you are currently on R101, please note that you will need to follow the R103 Stream Enrich upgrade steps, relating to the IP Lookups Enrichment. Check out the [R103 Upgrading guide][r103-upgrade].

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases are unchanged:

* [R106 Acropolis][r106-pii], enhancing our recently-released GDPR-focused PII
  Enrichment for the realtime pipeline
* [R10x [STR] New webhooks and enrichment][r10x-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics], plus a new enrichment for detecting bots and spiders using [data from the IAB][iab-data]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">5. Getting help</h2>

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

[at-least-once]: https://docs.aws.amazon.com/streams/latest/dev/kinesis-record-processor-duplicates.html
[iab-data]: https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/
[r103-upgrade]: /blog/2018/04/17/snowplow-r103-paestum-released-with-ip-lookups-enrichment-upgrade/#upgrading
[ubuntu-lts]: https://wiki.ubuntu.com/LTS

[snowflake-analytics]: https://www.snowflake-analytics.com/
[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[kcl]: https://github.com/awslabs/amazon-kinesis-client
[asgergb]: https://github.com/asgergb

[discourse]: http://discourse.snowplowanalytics.com/

[se-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.16.1#files
