---
layout: post
title: "Snowplow 96 Zeugma released with NSQ support"
title-short: Snowplow 96 Zeugma
tags: [enrichment, collector, nsq, snowplow-mini]
author: Enes
category: Releases
permalink: /blog/2017/11/21/snowplow-r96-zeugma-released-with-nsq-support/
---

We are pleased to announce the release of Snowplow 96 Zeugma. This release brings initial support
for using [NSQ][nsq-website] with the Snowplow real-time pipeline, as an alternative to Amazon
Kinesis or Apache Kafka.

Read on for more information on R96 Zeugma, named after [an ancient city of Commagene located in southeastern Anatolia][zeugma]:

<!--more-->

1. [Supporting NSQ](#supporting-nsq)
2. [Setting up NSQ](#setting-up-nsq)
3. [Scala Stream Collector and NSQ](#nsq-collector)
4. [Stream Enrich and NSQ](#nsq-enrich)
5. [Other NSQ releases](#other-nsq-releases)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Help](#help)

![Zeugma][zeugma-img]

<h2 id="supporting-nsq">1. Supporting NSQ </h2>

[NSQ][nsq-website] is a realtime distributed messaging platform - think of it as a highly-scalable pub/sub system. We are planning on
[migrating Snowplow Mini to use NSQ under the hood][snowplow-mini-nsq-ticket], and so this new
functionality is a stepping stone towards this goal.

At the moment, Snowplow Mini uses named Unix pipes "under the hood" for communicating between the various Snowplow components. This is an opaque and fairly brittle process - leading to unexpected behaviours such as backpressure issues and race conditions
when launching. Switching Snowplow Mini to use NSQ is a good compromise: much simpler to setup than Kafka or Kinesis, but much more predictable than named Unix pipes.

Additionally, being highly scalable and relatively low-cost may make NSQ an important alternative to Kafka or Kinesis for some large-scale Snowplow roll-outs, particularly around the IoT space.

Adding NSQ support in Snowplow translates to:

* Adding an NSQ sink to the Scala Stream Collector
* Adding an NSQ source and an NSQ sink to Stream Enrich

We will detail both those steps below, but first let's setup NSQ.

<h2 id="setting-up-nsq">2. Setting up NSQ</h2>

The easiest way to spin up NSQ is through [the NSQ quick start][nsq-quickstart]. For our purposes,
we only need `nsqlookupd` and `nsqd`.

`nsqlookupd` is a component dedicated to managing who produces and consumes what. `nsqd`, on the
other hand, is in charge of receiving, queueing and delivering messages.

After starting both `nsqlookupd` and `nsqd`, you can send the following `POST` requests in order to
create the NSQ topics that we will use later on.

{% highlight bash %}
curl -X POST http://127.0.0.1:4161/topic/create?topic=GoodRawEvents
curl -X POST http://127.0.0.1:4161/topic/create?topic=BadRawEvents
curl -X POST http://127.0.0.1:4161/topic/create?topic=GoodEnrichedEvents
curl -X POST http://127.0.0.1:4161/topic/create?topic=BadEnrichedEvents
{% endhighlight %}

Assuming all these commands run without error, you are ready to continue with the next
steps.

<h2 id="nsq-collector">3. Scala Stream Collector and NSQ</h2>

This release brings support for a new sink target for our Scala Stream Collector, in the form of a
NSQ topic. This feature maps one-to-one in functionality with the current Kinesis and Kafka
offerings.

If you have followed the [setting up NSQ section](#setting-up-nsq) you would need to update your
Scala Stream Collector configuration to the following:

{% highlight conf %}
collector {
  ...

  streams {
    # Events which have successfully been collected will be stored in the good stream/topic
    good = "GoodRawEvents"

    # Events that are too big will be stored in the bad stream/topic
    bad = "BadRawEvents"
    ...

    sink {
      enabled = nsq

      # Host name for nsqd
      host = "127.0.0.1"

      # TCP port for nsqd
      port = 4150
    }

    ...
}
{% endhighlight %}

Launching the collector in this configuration will then start sinking raw events to your configured
NSQ topic, allowing them to be picked up and consumed by other applications, including Stream Enrich.

<h2 id="nsq-enrich">4. Stream Enrich and NSQ</h2>

Stream Enrich has also been updated to support a NSQ topic as a source, and another one as a sink.
Again, this feature maps one-to-one in functionality with the current Kinesis and Kafka offerings. If you are familiar with our Kinesis or Kafka support, you know the drill!

Following on from the Stream Collector section above, you can then configure your Stream Enrich
application like so:

{% highlight conf %}
enrich {
  source = "nsq"
  sink = "nsq"

  ...

  streams {
    in {
      # Stream/topic where the raw events to be enriched are located
      raw = "GoodRawEvents"
    }

    out {
      # Stream/topic where the events that were successfully enriched will end up
      enriched = "GoodEnrichedEvents"
      # Stream/topic where the event that failed enrichment will be stored
      bad = "BadEnrichedEvents"
      ...
    }

    nsq {
      # Channel name for the nsq source
      # If more than one applications are reading from the same NSQ topic simultaneously,
      # all of them must have the same channel name for getting all the data from the same topic
      rawChannel = "StreamEnrichChannel"

      # Host name for nsqd
      host = "127.0.0.1"

      # TCP port for nsqd
      port = 4150

      # Host name for nsqlookupd
      lookupHost = "127.0.0.1

      # HTTP port for nsqlookupd
      lookupPort = 4161
    }

    ...
  }
  ...
}
{% endhighlight %}

Events from the Stream Collector’s raw topic will then start to be picked up and enriched before
being written to the `out.enriched` topic.

<h2 id="other-nsq-releases">5. Other NSQ releases</h2>

As we previously mentioned, the primary purpose of the NSQ support is Snowplow Mini's migration.
In support of that, we have already added NSQ support to [the Elasticsearch Loader][es-loader] and
[S3 Loader][s3-loader].

You can find more detailed information about these versions in
[the ElasticSearch Loader 0.10.0][es-loader-blog-post] and
[the S3 Loader 0.6.0][s3-loader-blog-post] blog posts.

<h2 id="upgrading">6. Upgrading</h2>

The real-time applications for R96 Zeugma are available at the following locations:

{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.11.0.zip
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.12.0.zip
{% endhighlight %}

To use NSQ, you will need to make the changes to the configurations of the Stream
Collector and Stream Enrich as specified in the above sections to use NSQ.

If you are already using Kafka or Kinesis: there are no breaking changes in the R96 confguration for Stream Enrich, but you will need to update your Scala Stream Collector's configuration. This is because only *one* sink configuration is needed from now on.

For example, if you're using Kinesis only the Kinesis configuration will be needed:

{% highlight conf %}
collector {
  ...

  # sink = kinesis # REMOVED

  streams {
    ...

    sink {         # ADDED
      enabled = kinesis # or kafka or nsq

      region = eu-west-1
      threadPoolSize = 10
      aws {
        accessKey = iam
        secretKey = iam
      }
      backoffPolicy {
        minBackoff = {{kinesisMinBackoffMillis}}
        maxBackoff = {{kinesisMaxBackoffMillis}}
      }

      # Or Kafka
      #brokers = "{{kafkaBrokers}}"
      ## Number of retries to perform before giving up on sending a record
      #retries = 0

      # Or NSQ
      ## Host name for NSQ tools
      #host = "{{nsqHost}}"
      ## TCP port for nsqd, 4150 by default
      #port = {{nsqdPort}}
    }
  }
}
{% endhighlight %}

Finally, [an upcoming release of the Snowplow Docker images][docker-r2] will include images for
both the Scala Stream Collector and Stream Enrich with NSQ support.

There are no material non-NSQ-related changes in R96.

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R97 [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark,
Unbounce, StatusGator)
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream
processing pipeline

And of course, please stay tuned for the [Snowplow Mini 0.4.0 release][snowplow-mini-040] with NSQ support!

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on Github.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html
[nsq-quickstart]: http://nsq.io/overview/quick_start.html

[zeugma]: https://en.wikipedia.org/wiki/Zeugma,_Commagene
[zeugma-img]: /assets/img/blog/2017/11/zeugma.jpg
[snowplow-mini-nsq-ticket]: https://github.com/snowplow/snowplow-mini/issues/24

[es-loader]: https://github.com/snowplow/snowplow-elasticsearch-loader
[s3-loader]: https://github.com/snowplow/snowplow-s3-loader

[es-loader-blog-post]: https://snowplowanalytics.com/blog/2017/09/12/elasticsearch-loader-0.10.0-released/
[s3-loader-blog-post]: https://snowplowanalytics.com/blog/2017/09/13/snowplow-s3-loader-0.6.0-released/

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r96-zeugma
[discourse]: http://discourse.snowplowanalytics.com/

[docker-r2]: https://github.com/snowplow/snowplow-docker/milestone/2
[snowplow-mini-040]: https://github.com/snowplow/snowplow-mini/milestone/14
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144
