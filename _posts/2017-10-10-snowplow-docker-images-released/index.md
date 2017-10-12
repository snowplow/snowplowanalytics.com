---
layout: post
title: "Snowplow Docker images released"
title-short: Snowplow Docker images
tags: [snowplow, realtime, docker]
author: Ben
category: Releases
permalink: /blog/2017/10/10/snowplow-docker-images-released/
---

We are thrilled to announce [the first batch of official Docker images for Snowplow][release-1].
This first release focuses on laying the foundations for running a Snowplow real-time pipeline in a
[Docker][docker]-containerized environment. As a result, this release includes images for:

- [The Scala Stream Collector][ssc]
- [Stream Enrich][se]
- [The Snowplow S3 Loader][s3]
- [The Snowplow Elasticsearch Loader][es]

Bringing Docker support to Snowplow has been a real community effort - huge thanks to [Joshua Cox][joshuacox], [Tamas Szuromi][tromika] and last but not least [Daniel Zohar][danielzohar] for their heroic contributions here.

<!--more-->

In this post, we will cover:

1. [Why provide Docker images?](#why)
2. [A foundation common to all images](#foundation)
3. [Real-time pipeline images](#realtime)
4. [Docker Compose example](#example)
5. [Future work](#future)
6. [Contributing](#contributing)

<h2 id="why">1. Why provide Docker images?</h2>

Snowplow community members have been experimenting with building their own Docker images for Snowplow for some time. Our decision to bring this "in house" and start publishing and maintaining our own official images is based on a few factors.

An important reason is around the ease of distribution and scheduling Snowplow, through container orchestrators such as
[Kubernetes][kubernetes], [Nomad][nomad], [OpenShift][openshift] or [Docker Swarm][docker-swarm]. Providing officially supported images should help to reduce the friction in adopting these platforms for Snowplow real-time pipeline users.

Another argument can be made for resource efficiency. For example, running two instances of Stream
Enrich will require two different boxes costing us the OS overheads. Moving to containers should
allow you to run those two instances on the same box, giving us higher resource utilization.

But most fundamentally, providing Docker images for the Snowplow realtime pipeline is part of a broader move
on our side to formalize the Snowplow real-time pipeline as an [asynchronous micro-services-based architecture][async-and-unified-log].

Micro-services architectures are growing in popularity, and the Snowplow real-time pipeline is an example of a platform built out of a set of asynchronously connected micro-services. Asynchronous means that none of our apps have any direct coupling with each other - instead they all rely on an overarching streaming abstraction such as Kinesis or Apache Kafka to communicate. These kinds of architectures are very often containerized using Docker to ease deployment and scheduling.

Official Docker images have been a long-requested feature - we're excited to finally be providing these to
the community!

<h2 id="foundation">2. A foundation common to all Snowplow images</h2>

In this section, we'll detail a few technical aspects we've taken care of to ensure reliable and
performant images.

Every Snowplow Docker image is based on [our own base image][base-image] which leverages
[the Java 8 Alpine image][alpine-image].

Thanks to this base image, every component runs under [dumb-init][dumb-init] which handles reaping
zombie processes and forwarding signals to all processes running in the container. They also uses
[su-exec][su-exec] as a sudo replacement, to run any component as the non-root `snowplow` user.

Each container exposes the `/snowplow/config` volume to store the component's configuration. If this
folder is bind-mounted then ownership will be changed to the `snowplow` user.

The `-XX:+UnlockExperimentalVMOptions` and `-XX:+UseCGroupMemoryLimitForHeap` JVM options are
automatically provided when launching any component in order to make the JVM adhere to the memory
limits imposed by Docker; for more information, see [this article][oracle-article].

Finally, if you want to manually tune certains aspect of the JVM, additional options can be set
through the `SP_JAVA_OPTS` environment variable when launching a container.

<h2 id="realtime">3. Real-time pipeline images</h2>

As mentioned above, this release includes images for the Snowplow real-time pipeline. In this section, we'll
cover each of these in turn.

Note that all of these images are hosted in our [snowplow-docker-registry.bintray.io][registry] Docker registry.

<h3 id="collector">3.1 Scala Stream Collector</h3>

You can pull and run the image with:

{% highlight bash %}
docker pull snowplow-docker-registry.bintray.io/snowplow/scala-stream-collector:0.10.0
docker run \
  -d \
  -v ${PWD}/config:/snowplow/config \
  -p 80:80 \
  -e 'SP_JAVA_OPTS=-Xms512m -Xmx512m' \
  snowplow-docker-registry.bintray.io/snowplow/scala-stream-collector:0.10.0 \
  --config /snowplow/config/config.hocon
{% endhighlight %}

In the above, we're assuming that there is [a valid Scala Stream Collector configuration][ssc-conf]
located in the `config` folder in the current directory.

Alternatively, you can build the image yourself:

{% highlight bash %}
docker pull snowplow-docker-registry.bintray.io/snowplow/base:0.1.0
docker build -t snowplow/scala-stream-collector:0.10.0 scala-stream-collector/0.10.0
{% endhighlight %}

The above assumes that you've cloned [the repository][repo].

This image was contributed by [Joshua Cox][joshuacox], huge thanks Josh!

<h3 id="enrich">3.2 Stream Enrich</h3>

We can pull the image and launch a container with:

{% highlight bash %}
docker pull snowplow-docker-registry.bintray.io/snowplow/stream-enrich:0.11.1
docker run \
  -d \
  -v ${PWD}/config:/snowplow/config \
  -e 'SP_JAVA_OPTS=-Xms512m -Xmx512m' \
  snowplow-docker-registry.bintray.io/snowplow/stream-enrich:0.11.1 \
  --config /snowplow/config/config.hocon \
  --resolver file:/snowplow/config/resolver.json \
  --enrichments file:/snowplow/config/enrichments/ \
  --force-ip-lookups-download
{% endhighlight %}

Here we're assuming [a valid Stream Enrich configuration][se-conf] as well as [a resolver][resolver]
and [enrichments][enrichments] in the `config` directory.

The Stream Enrich image was written by [Daniel Zohar][danielzohar]. Big thanks to Daniel for this
image and all the advice that he's given us on our Docker journey!

<h3 id="es-loader">3.3 Elasticsearch Loader</h3>

Same as before we can pull and run with the following:

{% highlight bash %}
docker pull snowplow-docker-registry.bintray.io/snowplow/elasticsearch-loader:0.10.1
docker run \
  -d \
  -v ${PWD}/config:/snowplow/config \
  -e 'SP_JAVA_OPTS=-Xms512m -Xmx512m' \
  snowplow-docker-registry.bintray.io/snowplow/elasticsearch-loader:0.10.1 \
  --config /snowplow/config/config.hocon
{% endhighlight %}

Refer to [the Elasticsearch Loader configuration example][es-conf] as required.

<h3 id="s3-loader">3.4 S3 Loader</h3>

As before:

{% highlight bash %}
docker pull snowplow-docker-registry.bintray.io/snowplow/s3-loader:0.6.0
docker run \
  -d \
  -v ${PWD}/config:/snowplow/config \
  -e 'SP_JAVA_OPTS=-Xms512m -Xmx512m' \
  snowplow-docker-registry.bintray.io/snowplow/s3-loader:0.6.0 \
  --config /snowplow/config/config.hocon
{% endhighlight %}

Check out [the S3 Loader config example][s3-conf] to remind yourself of the format.

<h2 id="example">4. Docker Compose example</h2>

To help you get started there is also [a Docker Compose example][example] which incorporates one
container for the Scala Stream Collector and another one for Stream Enrich.

As is, the provided configurations make the following assumptions:

- The `snowplow-raw` Kinesis stream exists and is used to store the collected events
- The `snowplow-enriched` Kinesis stream exists and is used to store the enriched events
- The `snowplow-bad` Kinesis stream exists and is used to store the events which failed validation
- All those streams are located in the `us-east-1` region

Feel free to modify the given configuration files to suit your needs. **This Docker Compose example is provided to illustrate how you can start to compose our Snowplow containers together; it is not intended to be a reference or production-ready deployment.**

The containers can be launched with:

{% highlight bash %}
docker swarm init
docker stack deploy -c docker-compose.yml snowplow-realtime
{% endhighlight %}

A Scala Stream Collector and a Stream Enrich container are now running!

If you want to stop them:

{% highlight bash %}
docker stack rm snowplow-realtime
{% endhighlight %}

The Docker Compose example was contributed by [Tamas Szuromi][tromika], thanks Tamas!

<h2 id="future">5. Future work</h2>

This release is just the beginning of a huge amount of experimentation around Docker, containerized environments and container scheduling that we are embarking on here at Snowplow.

Within the `snowplow-docker` project, we are planning on publishing our images directly to [Docker Hub][dockerhub], as
well as adding other images related to [Iglu][iglu] and [RDB Loader][rdb-loader].

Within [Snowplow Mini][snowplow-mini], we have firm plans to swap out our current architecture for a Docker Compose-based composition of the various services that make up Snowplow Mini. See the [Docker milestone][snowplow-mini-docker] for more details.

And of course if there are other aspects of containerization that you would like us to explore, please let us know!

<h2 id="contributing">6. Contributing</h2>

Please check out the [repository][repo] and the [open issues](https://github.com/snowplow/snowplow-docker/issues?utf8=✓&q=is%3Aissue%20is%3Aopen%20) if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[repo]: https://github.com/snowplow/snowplow-docker
[release-1]: https://github.com/snowplow/snowplow-docker/releases/tag/r1

[discourse]: http://discourse.snowplowanalytics.com/

[docker]: https://www.docker.com/
[kubernetes]: https://kubernetes.io/
[docker-swarm]: https://docs.docker.com/engine/swarm/
[openshift]: https://www.openshift.com/
[nomad]: https://www.nomadproject.io/

[base-image]: https://github.com/snowplow/snowplow-docker/blob/master/base/Dockerfile
[alpine-image]: https://github.com/docker-library/openjdk/blob/master/8-jre/alpine/Dockerfile

[dumb-init]: https://github.com/Yelp/dumb-init
[su-exec]: https://github.com/ncopa/su-exec
[oracle-article]: https://blogs.oracle.com/java-platform-group/java-se-support-for-docker-cpu-and-memory-limits

[ssc]: https://github.com/snowplow/snowplow/tree/master/2-collectors/scala-stream-collector
[se]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich
[es]: https://github.com/snowplow/snowplow-elasticsearch-loader/
[s3]: https://github.com/snowplow/snowplow-s3-loader/

[ssc-conf]: https://github.com/snowplow/snowplow/blob/master/2-collectors/scala-stream-collector/examples/config.hocon.sample
[se-conf]: https://github.com/snowplow/snowplow/blob/master/3-enrich/stream-enrich/examples/config.hocon.sample
[resolver]: https://github.com/snowplow/snowplow/blob/master/3-enrich/config/iglu_resolver.json
[enrichments]: https://github.com/snowplow/snowplow/tree/master/3-enrich/config/enrichments
[es-conf]: https://github.com/snowplow/snowplow-elasticsearch-loader/blob/master/examples/config.hocon.sample
[s3-conf]: https://github.com/snowplow/snowplow-s3-loader/blob/master/examples/config.hocon.sample

[async-and-unified-log]: https://www.slideshare.net/alexanderdean/asynchronous-microservices-and-the-unified-log

[registry]: https://bintray.com/snowplow/registry

[example]: https://github.com/snowplow/snowplow-docker/tree/master/example

[joshuacox]: https://github.com/joshuacox
[danielzohar]: https://github.com/danielzohar
[tromika]: https://github.com/tromika

[dockerhub]: https://hub.docker.com
[iglu]: https://github.com/snowplow/iglu
[rdb-loader]: https://github.com/snowplow/snowplow-rdb-loader

[snowplow-mini]: https://github.com/snowplow/snowplow-mini
[snowplow-mini-docker]: https://github.com/snowplow/snowplow-mini/milestone/4
