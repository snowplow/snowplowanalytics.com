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
for easy deployment as a pre-built AMI on AWS as well as a hosted image for GCP. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release brings Snowplow Mini experience to Google Cloud Platform, migrates the underlying
[infrastructure to Docker][docker-migration-issue] and bumps the Elasticsearch stack to latest
stable version. Finally, as of this release, Snowplow Mini will be available in 3 different sizes:
`large`, `xlarge` and `xxlarge` to meet varying purposes.

Read on for:

<!--more-->

1. [Google Cloud Platform support](#gcp-support)
2. [Docker migration](#docker-migration)
3. [New Iglu Server](#iglu-server)
4. [Freshening the Elasticsearch stack](#elasticsearch)
5. [Other updates](#other-changes)
6. [Documentation and getting help](#help)


<h2 id="gcp-support">1. Google Cloud Platform support</h2>

`0.6.0` introduces Snowplow Mini to the GCP ecosystem, enabling our users to experience Snowplow 
Mini on GCP!

We offer 3 different images for 3 new sizes of Snowplow Mini.

Check out [the Snowplow Mini GCP Setup Guide][setup-guide-gcp] to find out how to use them and more!

<h2 id="docker-migration">2. Docker migration</h2>

Up until this release, we were using the traditional Linux service management package, `SysVinit` to
manager the different components in Mini. Even though this approach is quite mature, we wanted to
leverage our [Docker images][snowplow-docker] to benefit from the advantages of Docker for Snowplow
Mini's management, i.e. portability across machines, out-of-the-box logging service, volume
management, etc.

<h2 id="iglu-server">3. New Iglu Server</h2>

One of our goals for Snowplow Mini is making it stateless, meaning that all the required services
such as Iglu Server, Elasticsearch, Postgres etc live outside the actual box running Snowplow Mini.

As part of this goal, we've introduced the Control Plane in [Snowplow Mini 0.4.0][snowplow-mini-0.4.0-post].
Today we are adding a new feature on top of it, enabling Iglu Server to use an external Postgres instance.

Instead of specifying external Postgres configuration only, we introduce the ability to upload
a complete Iglu Server configuration file so that you can play with all the bits of the
configuration including Postgres connection details.

![iglu-server-conf][iglu-server-conf-img]

Note that this release also bumps Iglu Server to `0.3.0` which [introduced][iglu-server-improvements]
a new configuration parameter `repo-server.baseURL` meaning that you should upload your own
Iglu Server config file with `repo-server.baseURL` set to `<snowplow-mini-deployment-address>/iglu-server`,
if you want to interact with the Iglu Server through Swagger UI. Note that you should omit the
protocol (i.e. http(s)://), because Swagger UI will automatically prepend that.

<h2 id="elasticsearch">4. Freshening the Elasticsearch stack</h2>

Most of the recent issues we faced with Snowplow Mini were mostly due to running very old versions
of Elasticsearch (1.7.5) and Kibana (4.0.1). Although we considered renewing them before, there was
a tradeoff between heavier resource usage and having a brand-new Elasticsearch stack. We finally
made the call and decided to bump Elasticsearch to `6.3.1` at the expense of using bigger
instances.

<h2 id="other-changes">5. Other updates</h2>

Until today, Snowplow Mini was being used for fairly small AWS images (`t2.medium` or 2 vCPUs and
4Gb of RAM) and it was almost always enough until now. However, we observed that Snowplow Mini
started exceeding its initial goal as people were sending more and more events to Mini, machine
resources started to become an obstacle, causing issues with Elasticsearch, for example. This is
why, `0.6.0` is available in 3 different sizes:

* `large`: Elasticsearch has `4G` as heap size and Snowplow apps each have `512M` as heap size.
* `xlarge` : Double the large image. Elasticsearch has `8G` as heap size and Snowplow apps each have `1.5G` as heap size.
* `xxlarge` : Double the xlarge image. Elasticsearch has `16G` heap size and Snowplow apps each have `3G` as heap size.

This release also comes with some internal changes under the hood, including:

* Bumping Stream Enrich to 0.18.0 ([#174][174])
* Bumping the Scala Stream Collector to 0.13.0 ([#176][176])

What's more, as part of bumping Elasticsearch version to `6.x`, we had to remove the Head plugin
since site plugins were removed from Elasticsearch. However, the Head plugin can be used as Google
Chrome [extension][head-plugin].

<h2 id="help">5. Documentation and getting help</h2>

To learn more about getting started with Snowplow Mini, check out the [Quickstart guide][quickstart].

If you run into any problems, please [raise a bug][issues] or [join our gitter room][gitter-room] or get in touch with us through [the usual channels][talk-to-us].

[docker-migration-issue]: https://github.com/snowplow/snowplow-mini/issues/23
[control-plane-doc]: https://github.com/snowplow/snowplow-mini/wiki/Control-Plane-API
[iglu-server-improvements]: https://snowplowanalytics.com/blog/2018/04/19/iglu-r9-bulls-eye-released/#server-improvements
[snowplow-mini-0.4.0-post]: https://snowplowanalytics.com/blog/2017/12/21/snowplow-mini-0.4.0-released/#control-plane

[152]: https://github.com/snowplow/snowplow-mini/issues/152
[79]: https://github.com/snowplow/snowplow-mini/issues/79
[174]: https://github.com/snowplow/snowplow-mini/issues/174
[176]: https://github.com/snowplow/snowplow-mini/issues/176

[setup-guide-gcp]: https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-GCP
[quickstart]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide
[issues]: https://github.com/snowplow/snowplow-mini/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[gitter-room]: https://gitter.im/snowplow/snowplow-mini

[iglu-server-conf-img]: /assets/img/blog/2018/07/iglu-server-conf.png

[head-plugin]: https://chrome.google.com/webstore/detail/elasticsearch-head/ffmkiejjmecolpfloofpjologoblkegm

[snowplow-docker]: https://github.com/snowplow/snowplow-docker
