---
layout: post
title: "Scala Stream Collector 0.11.0 released"
title-short: Scala Stream Collector 0.11.0
tags: [collector, nsq]
author: Enes
category: Releases
---

We are thrilled to announce version 0.11.0 of Scala Stream Collector, our component that lets you collect your Snowplow events. 

In this post, we will cover: 

1. [NSQ support](/blog/2017/08/21/scala-stream-collector-0.11.0-released#nsq-support)
2. [Configuration changes](/blog/2017/08/21/scala-stream-collector-0.11.0-released#config)
3. [Contributing](/blog/2017/08/21/scala-stream-collector-0.11.0-released#contributing)

<!--more-->

<h2 id="nsq-support">1. NSQ Support</h2>

With this release, we are adding NSQ as a stream sink which is one step for our effort to have the Snowplow platform become cloud-agnostic. 

[NSQ] [nsq-website] is realtime distributed messaging platform. You can find detailed information about setup the NSQ in [here] [nsq-installing]. After setup the NSQ, only things you have to do is changing "enabled" field to the "NSQ" in the config file, filling the NSQ part of the config according to the your NSQ setup and changing stream names in the config file to the your NSQ topic names. After making this changes in the config file, you can start to use the Scala Stream Collector with NSQ and start sending raw events to NSQ.

<h2 id="conf">2 Configuration changes</h2>

There have been quite a few changes made to the configuration expected by the Scala Stream Collector. Please check out the [example configuration file] [example-config] in the repository to make sure your configuration file has the expected parameters.

<h2 id="contributing">3. Contributing</h2>

You can check out the [repository] [repo] and the [open issues] [issues] if you’d like to get involved!


[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html
[example-config]: https://github.com/snowplow/snowplow/blob/master/2-collectors/scala-stream-collector/examples/config.hocon.sample
[repo]: https://github.com/snowplow/snowplow/tree/master/2-collectors/scala-stream-collector
[issues]: https://github.com/snowplow/snowplow/labels/2.%20Collectors