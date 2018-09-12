---
layout: post
title-short: Snowplow 110 Valle dei Templi introduces real-time enrichments on GCP
title: "Snowplow R110 Valle dei Templi GCP real-time pipeline"
tags: [snowplow, real-time, GCP]
author: Ben
category: Releases
permalink: /blog/2018/09/12/snowplow-r110-valle-dei-templi-introduces-real-time-enrichments-on-gcp/
---

We are excited to announce the release of [Snowplow 110 Valle dei Templi][snowplow-release], named
after [the archeological site in Agrigento, Sicily][valle-dei-templi]. This release brings the
real-time enrichment process on Google Cloud Platform to [Cloud Dataflow][dataflow].

Please read on after the fold for:

1. [Beam Enrich](#beam)
2. [Bug fixes](#bug-fixes)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

![valle-dei-templi][valle-dei-templi-img]
<br>
By Jos Dielis [Valle dei Templi][valle-img-cc], via Wikimedia Commons

<h2 id="beam">1. Beam Enrich</h2>

Beam Enrich is our new enrichment platform targeting Google Cloud Platform's [Cloud Dataflow][dataflow] service.
It effectively replaces Stream Enrich on GCP, which we previously introduced in [Release 101 Neapolis][r101].

This move is part of our strategy to go cloud-native on GCP, which we outlined in
[our "Porting Snowplow to Google Cloud Platform" RFC][rfc].

At a high level, Beam Enrich works in the same way as the existing enrichment platforms: it takes as input a
[Google Cloud PubSub][pubsub] topic of raw data collected by the Scala Stream Collector, enriches it,
and outputs both successfully enriched events to one topic, plus a stream of events that have
failed enrichment to another topic.

There are a multitude of reasons why Cloud Dataflow running Beam Enrich is better than compute instances
running Stream Enrich, we'll try to comment on a few here:

- No need for hardware management: Dataflow is a completely managed service - you don't have to spin
up instances and take care of them
- Designed for streaming: Dataflow provides reliable and consistent exactly-once processing
semantics as long as transformations are side-effect free, you can read more on the subject
[here][exactly-once]
- Out of the box auto-scaling: Dataflow optimizes the number of workers to maximize throughput

In the course of this development work, we have been really impressed with Cloud Dataflow's programming model. You can interact with Dataflow through the [Apache Beam][beam] API which __really__ provides the same programming model for batch and streaming computations, as well as abstracts over the execution engine (which can be Dataflow, [Spark][spark] or [Flink][flink]).

In addition, Spotify has built a very nice Scala API on top of Beam
called [Scio][scio], which Beam Enrich leverages.

<h2 id="bug-fixes">2. AWS pipeline bug fixes</h2>

This release also brings with it two important bug fixes, one each for our AWS batch and real-time pipelines.

<h3 id="cc">2.1 Clojure Collector's CORS response</h3>

As we explained in [an open source alert on our Discourse forum][disc-cc], the default configuration
for CORS changed with Tomcat 8.0.53, which, as a result, prevented `OPTIONS` requests from getting
through.

With this release, we have mirrored the behaviour of the Scala Stream Collector which is to send
back a response containing the original value of the `Origin` header as
`Access-Control-Allow-Origin`.

<h3 id="se">2.2 PII stream parent event's context</h3>

When leveraging the [PII Enrichment][pii-enrichment] introduced in [release 106][r106], the `contexts` field in the
new PII transformation event would contain the wrong schema coordinates:
`com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0` instead of
`iglu:com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0` (note the `iglu:` prefix).

This has been fixed with this release.

<h2 id="upgrading">3. Upgrading</h2>

<h3 id="beam-upg">3.1 Beam Enrich</h3>

This section will help you get started with Beam Enrich.

<h4>Beam Enrich-specific CLI options</h4>

Beam Enrich comes with a set of pre-defined CLI options:

- `--job-name`, the name of the job as it will appear in the Dataflow console
- `--raw=projects/{project}/subscriptions/{raw-topic-subscription}` which describes the input PubSub subscription Beam Enrich will consume from
- `--enriched=projects/{project}/topics/{enriched-topic}` which is the PubSub topic the successfully enriched events will be sinked to
- `--bad=projects/{project}/topics/{bad-topic}`, the PubSub topic where events that have failed enrichment will end up
- `--pii=projects/{project}/topics/{pii-topic}`, the PubSub topic where events resulting from the PII enrichment will end up, optional
- `--resolver=iglu_resolver.json`, the necessary Iglu resolver to lookup the schemas in your data
- `--enrichments=enrichments` the optional directory containing the enrichments that need to be performed

It's important to note that every enrichment relying on local files will need to have the necessary
files stored in [Google Cloud Storage][gc-storage]. For example, here is the IP Lookups Enrichment:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0",
  "data": {
    "name": "ip_lookups",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "geo": {
        "database": "GeoLite2-City.mmdb",
        "uri": "gs://gcs-bucket/maxmind"
      }
    }
  }
}
{% endhighlight %}

<h4>General Dataflow options</h4>

To run on Dataflow, Beam Enrich will rely on a set of additional configuration options:

- `--runner=DataFlowRunner` which specifies that we want to run on Dataflow
- `--project={project}`, the name of the GCP project
- `--streaming=true` to notify Dataflow that we're running a streaming application
- `--zone=europe-west2-a`, the zone where the Dataflow nodes (effectively [GCP Compute Engine][gc-compute] nodes) will be launched
- `--region=europe-west2`, the region where the Dataflow job will be launched
- `--gcpTempLocation=gs://location/`, the GCS bucket where temporary files necessary to run the job (e.g. jarfiles) will be stored

The list of all the options can be found in the [relevant Cloud Dataflow documentation][dataflow-pipeline-options].

<h4>Running</h4>

Beam Enrich comes as a ZIP archive or a Docker image, feel free to choose which fits your use case the most.

The ZIP archive is published on [our Bintray][beam-dl].

Once you have the archive unzipped, you can run it:

{% highlight bash %}
./bin/snowplow-beam-enrich \
  --runner=DataFlowRunner \
  --project=project-id \
  --streaming=true \
  --zone=europe-west2-a \
  --gcpTempLocation=gs://location/ \
  --job-name=beam-enrich \
  --raw=projects/project/subscriptions/raw-topic-subscription \
  --enriched=projects/project/topics/enriched-topic \
  --bad=projects/project/topics/bad-topic \
  --pii=projects/project/topics/pii-topic \ #OPTIONAL
  --resolver=iglu_resolver.json \
  --enrichments=enrichments/
{% endhighlight %}

You can also display a help message which will describe every Beam Enrich-specific option:

{% highlight bash %}
./bin/snowplow-beam-enrich --runner=DataFlowRunner --help
{% endhighlight %}

The Docker image for Beam Enrich is published on [our Bintray][beam-docker-dl].

You can run a container with the following command:

{% highlight bash %}
docker run \
  -v $PWD/config:/snowplow/config snowplow-beam-enrich:0.1.0 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \ # if running outside GCP
  snowplow-beam-enrich:0.1.0 \
  --runner=DataFlowRunner \
  --project=project-id \
  --streaming=true \
  --zone=europe-west2-a \
  --gcpTempLocation=gs://location/ \
  --job-name=beam-enrich \
  --raw=projects/project/subscriptions/raw-topic-subscription \
  --enriched=projects/project/topics/enriched-topic \
  --bad=projects/project/topics/bad-topic \
  --pii=projects/project/topics/pii-topic \ #OPTIONAL
  --resolver=/snowplow/config/iglu_resolver.json \
  --enrichments=/snowplow/config/enrichments/
{% endhighlight %}

This assumes that you have a `config` folder in the current directory containing:

1. Your Iglu resolver
2. Your enrichments
3. Your GCP credentials, if you're starting Beam Enrich from outside of GCP

<h3 id="cc-upg">3.2 Clojure Collector</h3>

The new Clojure Collector incorporating the fix discussed above is available in S3 at:

s3://snowplow-hosted-assets/2-collectors/clojure-collector/clojure-collector-2.1.1-standalone.war

<h3 id="se-upg">3.3 Stream Enrich</h3>

A new version of Stream Enrich incorporating the fix for the PII parent event's context
as discussed above can be found on our Bintray [here][se-dl].

Note that the latest version of Stream Enrich also removes the GCP support introduced in Snowplow R101 Neapolis - please use Beam Enrich instead.

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases include:

* [R11x [BAT] Increased stability][r11x-stability], improving batch pipeline stability

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r110-valle-dei-templi

[valle-dei-templi]: https://en.wikipedia.org/wiki/Valle_dei_Templi
[valle-img-cc]: https://creativecommons.org/licenses/by/2.0
[valle-dei-templi-img]: /assets/img/blog/2018/08/valle-dei-templi.jpg

[r101]: https://snowplowanalytics.com/blog/2018/03/21/snowplow-r101-neapolis-with-initial-gcp-support/
[r106]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/

[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[exactly-once]: https://cloud.google.com/blog/products/gcp/after-lambda-exactly-once-processing-in-google-cloud-dataflow-part-1
[beam]: https://beam.apache.org/
[spark]: https://spark.apache.org/
[flink]: https://flink.apache.org/
[scio]: https://github.com/spotify/scio
[pubsub]: https://cloud.google.com/pubsub/docs/overview

[gc-storage]: https://cloud.google.com/storage/
[gc-compute]: https://cloud.google.com/compute/
[dataflow-pipeline-options]: https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options

[pii-enrichment]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment

[discourse]: http://discourse.snowplowanalytics.com/
[rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-google-cloud-platform/1505
[disc-cc]: https://discourse.snowplowanalytics.com/t/clojure-collector-incompatibility-with-tomcat-8-0-53-or-above/2237

[se-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.19.1#files
[beam-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-beam-enrich/0.1.0#files
[beam-docker-dl]: https://bintray.com/snowplow/registry/snowplow%3Abeam-enrich

[r11x-stability]: https://github.com/snowplow/snowplow/milestone/162
