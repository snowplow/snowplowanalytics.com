---
layout: post
title-short: Snowplow R113 real-time pipeline improvements
title: "Snowplow R113 Filitosa real-time pipeline improvements"
tags: [snowplow, real-time, kafka, collector]
author: Ben
category: Releases
permalink: /blog/2019/02/18/snowplow-r113-filitosa-real-time-pipeline-improvements/
---

[Snowplow 113 Filitosa][snowplow-release], named after
[the megalithic site in Southern Corsica][filitosa], is a release focusing on improvements to the
Scala Stream Collector as well as new features for Scala Common Enrich, the library powering all
the different enrichment platforms.

This release is almost entirely made of community contributions, shoutout to all the contributors:

- [LiveIntent][liveintent] for:
  - adding [Prometheus][prometheus] support to the Scala Stream Collector
  - making it possible to use POST requests in the API request enrichment
  - and other improvements to the Scala Stream Collector
- [Peter Zhu][misterpig] and [Mike][miike] from [Snowflake Analytics][sa] for:
  - the [HubSpot][hubspot] webhook integration
  - and other improvements to the existing webhook integrations and Scala Stream Collector
- [Sven Pfenning][sven] and [Mirko Prescha][mirko] for the improvements made to our Kafka platform
- [Arun Manivannan](https://github.com/arunma), [Saeed Zareian](https://github.com/szareiangm) from
[the Globe and Mail](https://www.theglobeandmail.com/) and
[Toni Cebrián](https://github.com/tonicebrian) for the build improvements

Thanks a lot to everyone involved!

Please read on after the fold for:

1. [Scala Stream Collector improvements](#ssc)
2. [Scala Common Enrich improvements](#sce)
3. [Upgrading](#upgrading)
4. [Roadmap](#roadmap)
5. [Help](#help)

![filitosa][filitosa-img]
<br>
Jean-Pol Grandmont [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)

<!--more-->

<h2 id="ssc">1. Scala Stream Collector improvements</h2>

<h3 id="metrics">1.1 Prometheus metrics support</h3>

Thanks to [LiveIntent][liveintent], the Scala Stream Collector now publishes
[Prometheus][prometheus] metrics to the `/metrics` endpoint. You'll find the following metrics
published at this endpoint:

- `http_requests_total`: the total count of requests
- `http_request_duration_seconds`: the time spent handling requests

Which you'll be able to slice and dice by endpoint, method and/or response code.

Additional information will also be available, such as the Java and Scala versions as well as the
version of the Scala Stream Collector artifact.

<h3 id="kafka">1.2 Improved Kafka support</h3>

It is now possible to specify arbitrary Kafka producer configurations for the collector through the
`collector.streams.sink.producerConf` configuration setting. Additionally, the Kafka library has
been upgraded to the latest version to leverage the latest features.

Note, that those changes are also true for Stream Enrich for Kafka through the
`enrich.streams.sourceSink.{producerConf, consumerConf}` configurations.

Thanks a lot to [Sven Pfenning][sven] and [Mirko Prescha][mirko] for those two awesome features!

<h3 id="ssc-other">1.3 Other improvements</h3>

For people using [the do not track cookie feature](https://snowplowanalytics.com/blog/2018/08/21/snowplow-r109-lambaesis-real-time-pipeline-upgrade/#dnt)
of the Scala Stream Collector, [LiveIntent][liveintent] has improved the feature by letting you
specify a regex for the cookie value.

[Mike][miike] from [Snowflake Analytics][sa] has introduced a configurable `Access-Control-Max-Age`
header which lets clients cache the results of `OPTIONS` request, resulting in fewer requests and
faster `POST` requests: no need to make a preflight request if the result is already cached.

<h2 id="sce">2. Scala Common Enrich improvements</h2>

<h3 id="hubspot">2.1 HubSpot webhook integration</h3>

[Peter Zhu][misterpig] from [Snowflake Analytics][sa] built the [HubSpot][hubspot] webhook
integration from scratch for this release, huge props to him!

You'll now be able to track the following HubSpot events in your Snowplow pipeline:

- Deal creation
- Deal change
- Deal deletion
- Contact creation
- Contact change
- Contact deletion
- Company creation
- Company change
- Company deletion

Improvements have also been made to the [Marketo](https://www.marketo.com/) and
[CallRail](https://www.callrail.com/) integrations.

<h3 id="post">2.2 POST support in the API request enrichment</h3>

It is now possible to use `POST` requests to interact with the API leveraged in the API request
enrichment. Thanks to [LiveIntent][liveintent] for this feature.

<h2 id="upgrading">3. Upgrading</h2>

<h3 id="upg-ssc">3.1 Upgrading the Scala Stream Collector</h3>

A new version of the Scala Stream Collector incorporating the changes discussed above can be found
on [our Bintray][bintray-ssc].

To make use of this new version, you’ll need to amend your configuration in the following ways:

- Add a `collector.cors` section to specify the `Access-Control-Max-Age` duration:

{% highlight hocon %}
cors {
  accessControlMaxAge = 5 seconds # -1 seconds disables the cache
}
{% endhighlight %}

- Add a `collector.prometheusMetrics` section:

{% highlight hocon %}
prometheusMetrics {
  enabled = false
  durationBucketsInSeconds = [0.1, 3, 10] # optional buckets by which to group by the `http_request_duration_seconds` metric
}
{% endhighlight %}

- Modify the `collector.doNotTrackCookie` section if you want to make use of a regex:

{% highlight hocon %}
doNotTrackCookie {
  enabled = true
  name = cookie-name
  value = ".+cookie-value.+"
}
{% endhighlight %}

- Add the optional `collector.streams.sink.producerConf` if you want to specify additional Kafka
producer configuration:

{% highlight hocon %}
producerConf {
  acks = all
}
{% endhighlight %}

This also holds true for Stream Enrich `enrich.streams.sourceSink.{producerConf, consumerConf}`.

A full example configuration can be found in [the repository][config-ssc].

<h3 id="upg-cc">3.2 Upgrading your enrichment platform</h3>

If you are a GCP pipeline user, a new Beam Enrich can be found on Bintray:
- as [a ZIP archive][bintray-zip-be]
- as [a Docker image][bintray-docker-be]

If you are a Kinesis or Kafka pipeline user, a new Stream Enrich can be found on
[Bintray][bintray-se].

Finally, if you are a batch pipeline user, a new Spark Enrich can be used by setting the new version
in your EmrEtlRunner configuration:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.17.0 # WAS 1.16.0
{% endhighlight %}

or directly make use of the new Spark Enrich available at:

`s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.17.0.jar`

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases include:

* [R114 New bad row format][r114], a release which will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r113-filitosa

[filitosa]: https://en.wikipedia.org/wiki/filitosa
[filitosa-img]: /assets/img/blog/2019/02/filitosa.jpg

[r114]: https://github.com/snowplow/snowplow/milestone/154

[liveintent]: https://liveintent.com/
[misterpig]: https://github.com/misterpig
[miike]: https://github.com/miike
[sa]: https://www.snowflake-analytics.com/
[sven]: https://github.com/0xE282B0
[mirko]: https://github.com/mirkoprescha

[prometheus]: https://prometheus.io/
[hubspot]: https://www.hubspot.com/

[bintray-ssc]: https://bintray.com/snowplow/snowplow-generic/snowplow-scala-stream-collector/0.15.0#files
[config-ssc]: https://github.com/snowplow/snowplow/blob/r113-filitosa/2-collectors/scala-stream-collector/examples/config.hocon.sample
[bintray-zip-be]: https://bintray.com/snowplow/snowplow-generic/snowplow-beam-enrich/0.2.0#files
[bintray-docker-be]: https://bintray.com/snowplow/registry/snowplow%3Abeam-enrich
[bintray-se]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.20.0#files

[discourse]: http://discourse.snowplowanalytics.com/
