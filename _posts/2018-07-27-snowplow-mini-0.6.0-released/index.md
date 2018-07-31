---
layout: post
title: Snowplow Mini 0.6.0 released
title-short: Snowplow Mini 0.6.0
tags: [snowplow-mini, docker, iglu-server, elasticsearch]
author: Oguzhan
category: Releases
permalink: /blog/2018/07/27/snowplow-mini-0.6.0-released/
---

We are pleased to announce the 0.6.0 release of Snowplow Mini, our accessible "Snowplow in a box" distribution.

Snowplow Mini is the complete Snowplow real-time pipeline running on a single instance, available
for easy deployment as a pre-built AMI on AWS, and now as a hosted image for GCP. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release brings the Snowplow Mini experience to Google Cloud Platform, migrates the underlying
[infrastructure to Docker][docker-migration-issue] and bumps the Elasticsearch stack to the latest
stable version.

Finally, as of this release, Snowplow Mini will be available in three different sizes,
`large`, `xlarge` and `xxlarge`, to meet your scalability requirements.

Read on for:

1. [Google Cloud Platform support](#gcp-support)
2. [Docker migration](#docker-migration)
3. [New Iglu Server](#iglu-server)
4. [Updating the Elasticsearch stack](#elasticsearch)
5. [Tiered image sizes](#image-sizes)
6. [Other updates](#other-changes)
7. [Documentation, getting help and contributing back](#help)

<!--more-->

<h2 id="gcp-support">1. Google Cloud Platform support</h2>

Version 0.6.0 introduces Snowplow Mini to the Google Cloud Platform ecosystem, enabling our users to experience Snowplow
Mini for the first time on GCP!

We offer three different GCP images for the three new sizes of Snowplow Mini.

Check out [the Snowplow Mini GCP Setup Guide][setup-guide-gcp] to find out how to use them and more.

<h2 id="docker-migration">2. Docker migration</h2>

Until this release, we were using the traditional Linux startup manager, SysVinit, to
bring up the different applications and services in Snowplow Mini.

Although this approach is of course tried-and-tested, we wanted to leverage our [Docker images][snowplow-docker] to benefit from the advantages managing Snowplow Mini with Docker - namely portability across machines, out-of-the-box logging, volume management and more.

This change should be transparent to the Snowplow Mini user, but under the hood Snowplow Mini now uses [Docker Compose][docker-compose] to run its component parts.

<h2 id="iglu-server">3. New Iglu Server</h2>

One of our medium-term goals for Snowplow Mini is to make it stateless, meaning that all the required data stores, such as Iglu Server and Elasticsearch, will live outside the actual server running Snowplow Mini. This will increase the maintainability and reliability of Snowplow Mini.

In support of this goal, we introduced a Control Plane in [Snowplow Mini v0.4.0][snowplow-mini-0.4.0-control-plane].
Today we are adding a new feature to the Control Plane: enabling Iglu Server to use an external Postgres instance.

To be more specific - the Control Plane lets you upload a complete Iglu Server configuration file, letting you configure any aspect of the Iglu Server - not just the Postgres connection details:

![iglu-server-conf][iglu-server-conf-img]

This release also bumps Iglu Server to version 0.3.0 which [introduced various improvements][iglu-server-improvements], including a new configuration parameter `repo-server.baseURL`. If you upload your own
Iglu Server configuration file, be sure to set `repo-server.baseURL` to `<snowplow-mini-deployment-address>/iglu-server`,
if you want to interact with the Iglu Server through the Swagger UI. Note that you should omit the
protocol (i.e. http(s)://), because the Swagger UI will automatically prepend that.

<h2 id="elasticsearch">4. Updating the Elasticsearch stack</h2>

Most of the recent issues we have seen with Snowplow Mini have related to us running very old versions
of Elasticsearch (v1.7.5) and Kibana (v4.0.1) inside the instance.

Although we considered updating these versions before, there has always been a tradeoff between a newer Elasticsearch version and the attendant heavier resource requirements. We have finally made the decision to bump Elasticsearch to July 2018's [version 6.3.1][elasticsearch-6.3.1], at the expense of using bigger instances.

<h2 id="image-sizes">5. Tiered image sizes</h2>

Historically Snowplow Mini has typically been used with small AWS images (e.g. a `t2.medium`, with 2 vCPUs and
4Gb of RAM) for relatively unstrenuous use cases.

More recently however, we have seen Snowplow users and customers starting to send more and more events to Mini; machine resources have correspondingly started to become an obstacle, sometimes causing issues with Elasticsearch.

For this reason, Snowplow Mini v0.6.0 is now available in three different sizes:

* `large`: Elasticsearch has 4 GB as heap size and Snowplow apps each have 512 MB as heap size.
* `xlarge`: double the `large` image. Elasticsearch has 8 GB as heap size and Snowplow apps each have 1.5 GB as heap size.
* `xxlarge`: double the `xlarge` image. Elasticsearch has 16 GB heap size and Snowplow apps each have 3 GB as heap size.

<h2 id="other-changes">6. Other updates</h2>

This release also comes with some internal changes under the hood, including:

* Bumping Stream Enrich to v0.18.0 ([issue #174][174])
* Bumping the Scala Stream Collector to v0.13.0 ([issue #176][176])

Finally, please note that as part of bumping Elasticsearch version to 6.x, we had to remove the Elasticsearch Head plugin,
because site plugins have been removed from Elasticsearch. However, the Head plugin can still be used as a [Google Chrome extension][head-plugin] should you so wish.

<h2 id="help">7. Documentation, getting help and contributing back</h2>

To learn more about getting started with Snowplow Mini, check out the [Quickstart guide][quickstart].

If you run into any problems, please [raise a bug][issues] or get in touch with us through [the usual channels][talk-to-us].

If you'd like to help out with the development of Snowplow Mini, please [join our Gitter room][gitter-room].

[docker-migration-issue]: https://github.com/snowplow/snowplow-mini/issues/23
[control-plane-doc]: https://github.com/snowplow/snowplow-mini/wiki/Control-Plane-API
[iglu-server-improvements]: https://snowplowanalytics.com/blog/2018/04/19/iglu-r9-bulls-eye-released/#server-improvements
[snowplow-mini-0.4.0-control-plane]: https://snowplowanalytics.com/blog/2017/12/21/snowplow-mini-0.4.0-released/#control-plane

[152]: https://github.com/snowplow/snowplow-mini/issues/152
[79]: https://github.com/snowplow/snowplow-mini/issues/79
[174]: https://github.com/snowplow/snowplow-mini/issues/174
[176]: https://github.com/snowplow/snowplow-mini/issues/176

[docker-compose]: https://docs.docker.com/compose/

[setup-guide-gcp]: https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-GCP
[quickstart]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide
[issues]: https://github.com/snowplow/snowplow-mini/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[gitter-room]: https://gitter.im/snowplow/snowplow-mini

[elasticsearch-6.3.1]: https://www.elastic.co/blog/elastic-stack-6-3-1-released

[iglu-server-conf-img]: /assets/img/blog/2018/07/iglu-server-conf.png

[head-plugin]: https://chrome.google.com/webstore/detail/elasticsearch-head/ffmkiejjmecolpfloofpjologoblkegm

[snowplow-docker]: https://github.com/snowplow/snowplow-docker
