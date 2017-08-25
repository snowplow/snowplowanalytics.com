---
layout: post
title: "[Snowplow Release Blog Post Title]"
title-short: Snowplow Release Blog Post Title
tags: [enrichment, collector, nsq]
author: Enes
category: Releases
---

<h2>NSQ Support for Scala Stream Collector and Stream Enrich</h2> 

With the new versions of the Scala Stream Collector and Stream Enrich, we are adding NSQ as a stream source and sink which is one step for our effort to have the Snowplow platform become cloud-agnostic. 

[NSQ] [nsq-website] is realtime distributed messaging platform. You can find detailed information about setup the NSQ in [here] [nsq-installing]. After setup the NSQ, only things you have to do is changing "source" and "sink" field for Stream Enrich and changing "sink" field for Stream Collector to the "nsq" in the config file, filling the NSQ part of the config according to the your NSQ setup and changing stream names in the config file to the your NSQ topic names. After making this changes in the config file, you can start to use the Stream Enrich and Stream Collector with NSQ.

[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html