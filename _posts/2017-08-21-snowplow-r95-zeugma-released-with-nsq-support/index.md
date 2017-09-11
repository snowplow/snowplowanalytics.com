---
layout: post
title: "Snowplow 95 Zeugma released with NSQ support"
title-short: Snowplow 95 Zeugma
tags: [enrichment, collector, nsq]
author: Enes
category: Releases
permalink: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support/
---

We are pleased to announce the release of Snowplow 95 Zeugma. This release brings initial support for using [NSQ][nsq-website] with the Snowplow real-time pipeline, as an alternative to Amazon Kinesis and Apache Kafka. Read on for more information on R95 Zeugma, named after [an ancient city of Commagene located in southeastern Anatolia][zeugma]:

<!--more-->

1. [Supporting NSQ][supporting-nsq]
2. [Setting up NSQ][setting-up-nsq]
3. [Scala Stream Collector and NSQ][collector-nsq]
4. [Stream Enrich and NSQ][enrich-nsq]
5. [Other NSQ releases][other-nsq-releases]
6. [Upgrading][upgrading]
7. [Getting Help][getting-help]

![zeugma][zeugma-img]


<h2 id="supporting-nsq">1. Supporting NSQ </h2>

[NSQ] [nsq-website] is realtime distributed messaging platform. We are planning on [migrating Snowplow Mini to use NSQ under the hood][snowplow-mini-nsq-ticket], and so this new functionality is a stepping stone to this goal.

Main reason of the NSQ migration is making the Snowplow Mini pipeline less brittle. Right now, Snowplow Mini is using named Unix pipes for inter process communication and we observed that Unix pipes causes unexpected behaviours. Reason of the choosing NSQ as an replacement is that easy usage of the NSQ however being able to operate at scale makes it candidate for using in full-fledged Snowplow in the future.

Adding NSQ support comprises:

* Adding a NSQ sink to the Scala Stream Collector
* Adding a NSQ source and a NSQ sink to Stream Enrich

In the next sections we will set out what is available in this release.

<h2 id="setting-up-nsq">2. Setting up NSQ </h2>

After [setting up the Docker] [docker-installing], you should run the below commands:

```
docker pull nsqio/nsq
docker run --name lookupd -p 4160:4160 -p 4161:4161 nsqio/nsq /nsqlookupd
docker run --name nsqd -p 4150:4150 -p 4151:4151 \
    nsqio/nsq /nsqd \
    --broadcast-address=<host> \
    --lookupd-tcp-address=<host>:4160
```
After run the above commands, you should send POST request to the following endpoints in order to create NSQ topics which we will use later on.

```
curl -X POST http://<host>/topic/create?topic=GoodRawEvents
curl -X POST http://<host>/topic/create?topic=BadRawEvents
curl -X POST http://<host>/topic/create?topic=GoodEnrichedEvents
curl -X POST http://<host>/topic/create?topic=BadEnrichedEvents
```

`<host>` should be docker host's ip. You can find it with `ifconfig | grep addr` command.

If you run all these commands without getting any error, you are ready to continue with next steps.

<h2 id="collector-nsq">3. Scala Stream Collector and NSQ</h2>

This release brings support for a new sink target for our Scala Stream Collector in the form of a NSQ topic. This feature maps one-to-one in functionality with the current Kinesis and Kafka offering.

If you have followed the [setting up NSQ section][setting-up-nsq] you would update your config to have the following values:

```
collector {
  ...

  sink = "nsq"
  streams {
    # Events which have successfully been collected will be stored in the good stream/topic
    good = "GoodRawEvents"

    # Events that are too big (w.r.t Kinesis 1MB limit) will be stored in the bad stream/topic
    bad = "BadRawEvents"
    ...

    nsq {
      # Host name for NSQ tools
      host = "<host>"

      # HTTP port for nsqd
      port = "4150"
    }

    ...
}
```
`<host>` must be docker host's ip which you found in the previous section with `ifconfig | grep addr` command.

Launching the collector in this configuration will then start sinking raw events to your configured NSQ topic, allowing them to be picked up and consumed by other applications, including Stream Enrich.

<h2 id="enrich-nsq">4. Stream Enrich and NSQ</h2>

This component has also been updated to now support both a NSQ topic as a source, and as a sink. This feature maps one-to-one in functionality with the current Kinesis and Kafka offering.

Following on from the Stream Collector section above, you can then configure your Stream Enrich application like so:

```
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
      # Channel name for nsq source
      # If more than one application reading from the same NSQ topic at the same time,
      # all of them must have unique channel name for getting all the data from the same topic
      rawChannel: "StreamEnrichChannel"

      # Host name for NSQ tools
      host: "<host>"

      # HTTP port for nsqd
      port: "4150"

      # HTTP port for nsqlookupd
      lookupPort: "4161"
    }

    ...
  }
  ...
}
```

`<host>` must be docker host's ip which you found in the previous section with `ifconfig | grep addr` command.

Events from the Stream Collector’s raw topic will then start to be picked up and enriched before being dropped back into the out topic.

<h2 id="other-nsq-releases">5. Other NSQ releases</h2>

As we previously mentioned, main purpose of the NSQ support is NSQ migration in the Snowplow Mini. Because of this purpose, we added NSQ support to [Elasticsearch Loader][es-loader] and [S3 Loader][s3-loader] in their new versions.
You can find more detailed information about these new versions in the [ES Loader 0.10.0 blog post][es-loader-blog-post] and [S3 Loader 0.6.0 blog post][s3-loader-blog-post].

<h2 id="upgrading">6. Upgrading</h2>

The real-time apps for R95 Zeugma are available in the following zipfiles:

```
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.x.0.zip
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.x.0.zip
```

Also, you need to make previously specified changes in the config of the Stream Collector and Stream Enrich.

<h2 id="getting-help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on Github.

If you have any questions or run into any problems, please [raise an issue][issue] or get in touch with us through [the usual channels][usual-channels].

[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html
[docker-installing]: https://docs.docker.com/engine/installation/

[zeugma]: https://en.wikipedia.org/wiki/Zeugma,_Commagene
[zeugma-img]: /assets/img/blog/2017/08/zeugma.jpg
[snowplow-mini-nsq-ticket]: https://github.com/snowplow/snowplow-mini/issues/24

[supporting-nsq]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#supporting-nsq
[setting-up-nsq]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#setting-up-nsq
[collector-nsq]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#collector-nsq
[enrich-nsq]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#enrich-nsq
[other-nsq-releases]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#other-nsq-releases
[upgrading]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#upgrading
[getting-help]: /blog/2017/08/21/snowplow-r95-zeugma-released-with-nsq-support#getting-help

[es-loader]: https://github.com/snowplow/snowplow-elasticsearch-loader
[s3-loader]: https://github.com/snowplow/snowplow-s3-loader

[es-loader-blog-post]: https://snowplowanalytics.com/blog/2017/09/12/elasticsearch-loader-0.10.0-released/
[s3-loader-blog-post]: https://snowplowanalytics.com/blog/2017/09/13/snowplow-s3-loader-0.6.0-released/

[release-notes]: https://github.com/snowplow/snowplow/releases
[issue]: https://github.com/snowplow/snowplow/issues/new
[usual-channels]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
