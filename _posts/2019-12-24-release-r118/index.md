---
layout: post
title-short: "Snowplow R118 with new bad row format"
title: "Snowplow R118 beta release with new bad row format"
tags: [snowplow, enrichment, release]
author: Benjamin Benoist
category: Releases
permalink: /blog/2019/12/24/snowplow-release-r118-badrows/
---

We are excited to release [Snowplow R118 Morgantina][snowplow-release], named after the
[archaeological site in east central Sicily, southern Italy](https://en.wikipedia.org/wiki/Morgantina).

This Snowplow beta release includes the long-awaited new bad row format.
It also includes important refactoring in the libraries that we use (e.g. `cats` instead of `scalaz` and `circe` instead of`json4s`),
a bump of [Beam](https://beam.apache.org/) version to 2.11.0,
as well as an improvement to the referer parser enrichment.

[Scala Stream Collector](https://github.com/snowplow/snowplow/tree/master/2-collectors/scala-stream-collector)
and the enrich jobs versions ([Stream Enrich](https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich),
[Beam Enrich](https://github.com/snowplow/snowplow/tree/master/3-enrich/beam-enrich),
and [Spark Enrich](https://github.com/snowplow/snowplow/tree/master/3-enrich/spark-enrich)) are bumped to `1.0.0`.

1. [Beta release](#betarelease)
2. [New bad row format](#badrows)
3. [Referer parser enrichment improvement](#refererparser)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

<h1 id="betarelease">1. Beta release</h1>

While R119 is on the way (see the [roadmap](#roadmap)), we decided to release R118 as a beta release
in order to get early feedback from our OSS community.

We would like to give a high-priority OSS support to anyone who is testing R118
(whether it’s setup, debug, recovery or other aspects).

We will iterate fast on R119 RCs.

<h1 id="badrows">2. New bad row format</h1>

<h2>2.1. Why a new format?</h2>

Snowplow pipeline is non-lossy. Whenever something goes wrong, data is not discarded
but saved as a bad row for later inspection, fixing and reprocessing.

The previous format for these bad rows (generic JSON) was not straightforward to use and in an effort to always improve data quality,
we decided to rethink it.

More background about the new format can be found on the [RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

<h2>2.2. New bad row format</h2>

Bad rows emitted by Snowplow pipeline are now [self-describing JSONs](https://github.com/snowplow/iglu/wiki/Self-describing-JSONs).
All their schemas can be found on [Iglu central](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows).

On top of now being strongly typed, the new bad rows also contain more details about the origin of a failure
([example](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema/1-0-0#L12-L218) for schema violations).

<h2>2.3. Bad rows emitted by the Scala Stream Collector</h2>

<h3>2.3.1 [Size violation](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/size_violation/jsonschema/1-0-0)</h3>

The payload received by the collector can exceed the maximum size allowed by the message queue being used
(1MB for [Kinesis](https://aws.amazon.com/kinesis/) on AWS
and 10MB for [PubSub](https://cloud.google.com/pubsub/) on GCP).
In such scenario, the payload can’t be stored in its entirety, and a size violation bad row is emitted.
For example this could be the case if a big image is sent via a form.

<h2>2.4. Bad rows emitted by the enrich jobs</h2>

<h3>2.4.1. [Collector payload format violation](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/collector_payload_format_violation/jsonschema/1-0-0)</h3>

If something goes wrong when the enrich job tries to deserialize the payload serialized by the collector, a bad row of this type is emitted.
For instance this could happen in case of:
- malformed HTTP,
- truncation,
- invalid query string encoding in URL,
- path not respecting `/vendor/version`,
- etc.

<h3>2.4.2. [Adapter failure](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema/1-0-0)</h3>

We support [many webhooks](https://github.com/snowplow/snowplow/wiki/Setting-up-a-webhook) that can be plugged to Snowplow pipeline.
Whenever the event sent by a webhook doesn't respect the expected structure and list of fields for this webhook,
an adapter failure is emitted.

This could happen for instance if a webhook is updated and stops sending a field that it was sending before.

<h3>2.4.3. [Tracker protocol violation](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/tracker_protocol_violations/jsonschema/1-0-0)</h3>

Events sent by a [Snowplow tracker](https://github.com/snowplow/snowplow/tree/master/1-trackers)
are expected to follow our [tracker protocol](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol).
Whenever this protocol is not correctly respected, a tracker protocol violation bad row is emitted,
usually revealing an error on the tracker side.

<h3>2.4.4. [Schema violation](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema/1-0-0)</h3>

Snowplow pipeline can receive events that are not natively supported, we call them
[custom unstructured events](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#310-custom-unstructured-event-tracking).
This is achieved by using [self-describing JSON](https://github.com/snowplow/iglu/wiki/Self-describing-JSONs).
Is is also possible to add additional information to a supported type of event (e.g. `page_ping`, `page_view`)
through the use of [contexts](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#custom-contexts),
again by using self-describing JSONs.

Whenever the self-describing JSON is not valid for one of these 2 cases, a schema violation bad row is emitted.

<h3>2.4.5. [Enrichment failure](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema/1-0-0)</h3>

This type of bad row is emitted whenever something goes wrong in the enrichments.
This could happen for instance if the credentials used for the SQL enrichment are wrong
or with a bad link to MaxMind database for IP lookup.

For those familiar with the previous bad rows emitted in case of enrichment failure,
please note that with this new version, when an error occurs while enriching an event
(that can come from a collector payload with several events),
the bad row will contain only this event. The other events of the collector payload can be successfully enriched.
This is the same for schema violations.

<h3>2.4.6. [Size violation](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/size_violation/jsonschema/1-0-0)</h3>

Similarly as for Scala Stream Collector, this type of bad row is emitted whenever the size of the enriched event is too big for the message queue.
It can also be emitted if the size of another kind of bad row is too big for the message queue. In this case it will be truncated and wrapped in a size violation bad row instead.

<h2>2.5. Working with bad rows in Scala</h2>

Scala library [snowplow-badrows](https://github.com/snowplow-incubator/snowplow-badrows/tree/release/0.1.0/) contains all the case classes
defining the new bad rows and makes it easier to work with them. By using the same version of the library that the application producing bad rows,
we can be sure that there won't be any incompatibility when processing them.

To parse a `String` containing a bad row, one could write:

{% highlight scala %}
import com.snowplowanalytics.snowplow.badrows._

import com.snowplowanalytics.iglu.core.circe.instances._
import com.snowplowanalytics.iglu.core.SelfDescribingData

import cats.implicits._

import io.circe.parser
import io.circe.syntax._

def parseBadRow(jsonStr: String): Either[String, BadRow] =
  for {
    json <- parser.parse(jsonStr).leftMap(_.getMessage)
    sdj <- SelfDescribingData.parse(json).leftMap(_.code)
    badrow <- sdj.data.as[BadRow].leftMap(_.getMessage)
  } yield badrow
{% endhighlight %}

It is then straightforward to determine the type of bad row with pattern matching and to access its fields:

{% highlight scala %}
val badRow: BadRow = ???

badRow match {
  case BadRow.SchemaViolations(_, failure, _) =>
    val timestamp = failure.timestamp
    doSomethingWithTimestamp(timestamp)

  case BadRow.EnrichmentFailures(_, _, payload) =>
    val maybeCountry = payload.enriched.geo_country
    doSomethingWithCountry(maybeCountry)

  case _ => ???
}
{% endhighlight %}

<h1 id="refererparser">3. Referer parser enrichment improvement</h1>

Referer parser enrichment requires a [file](https://github.com/snowplow-referer-parser/referer-parser/blob/develop/resources/referers.yml)
with a list of referers to do its job.

From this release, the file doesn't need to be embedded any more and its URI can be specified
as an [input parameter](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/referer_parser/jsonschema/2-0-0#L33-L36)
of the enrichment.

The database can thus be updated without any modification to the code.

<h1 id="upgrading">4. Upgrading</h1>

The upgrading guide can be found on our [wiki page](https://github.com/snowplow/snowplow/wiki/Upgrade-Guide#r118).

<h1 id="roadmap">5. Roadmap</h1>

While R118 contains updated versions of components emitting bad rows (Scala Stream Collector and enrich jobs),
R119 will complete the ecosystem with the update of the components processing these bad rows:
- [S3 loader](https://github.com/snowplow/snowplow-s3-loader) and [GCS loader](https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader)
will partition the bad rows on disk according to their type.
- [ES loader](https://github.com/snowplow/snowplow-elasticsearch-loader) will contain a lot of refactoring and a better indexing of the bad rows.
- [Event recovery](https://github.com/snowplow-incubator/snowplow-event-recovery) will recover the new bad rows.

It should also be stressed that as we speak the loaders are also getting ready to emit the new bad row format.

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h1 id="help">6. Getting help</h1>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r118-morgantina
[discourse]: http://discourse.snowplowanalytics.com/
