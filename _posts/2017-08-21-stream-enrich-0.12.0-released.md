---
layout: post
title: "Stream Enrich 0.12.0 released"
title-short: Stream Enrich 0.12.0
tags: [enrichment, nsq]
author: Enes
category: Releases
---

We are thrilled to announce version 0.12.0 of Stream Enrich, our component that lets you process your raw Snowplow events . 

In this post, we will cover: 

1. [NSQ support](/blog/2017/08/21/stream-enrich-0.12.0-released#nsq-support)
2. [Contributing](/blog/2017/08/21/stream-enrich-0.12.0-released#contributing)

<!--more-->

<h2 id="nsq-support">1. NSQ Support</h2>

With this release, we are adding NSQ as a stream source and sink which is one step for our effort to have the Snowplow platform become cloud-agnostic. 

[NSQ] [nsq-website] is realtime distributed messaging platform. You can find detailed information about setup the NSQ in [here] [nsq-installing]. After setup the NSQ, only things you have to do is changing "source" and sink field to the "NSQ" in the config file, filling the NSQ part of the config according to the your NSQ setup and changing stream names in the config file to the your NSQ topic names. After making this changes in the config file, you can start to use the Stream Enrich with NSQ.

<h2 id="contributing">2. Contributing</h2>

You can check out the [repository] [repo] and the [open issues] [issues] if you’d like to get involved!


[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html
[example-config]: https://github.com/snowplow/snowplow/blob/master/3-enrich/stream-enrich/examples/config.hocon.sample
[repo]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich
[issues]: https://github.com/snowplow/snowplow/issues?utf8=%E2%9C%93&q=enrich