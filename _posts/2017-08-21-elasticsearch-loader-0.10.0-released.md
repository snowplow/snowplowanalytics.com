---
layout: post
title: "Elasticsearch Loader 0.10.0 released"
title-short: Elasticsearch Loader 0.10.0
tags: [elasticsearch, kinesis, aws, nsq]
author: Enes
category: Releases
---

We are thrilled to announce version 0.10.0 of Elasticsearch Loader, our component that lets you sink your Snowplow enriched events and much more to Elasticsearch.

In this post, we will cover: 

1. [NSQ support](/blog/2017/08/21/elasticsearch-loader-0.10.0-released#nsq-support)
2. [Support for writing raw JSON's](/blog/2017/08/21/elasticsearch-loader-0.10.0-released#json)
3. [Support for "AT_TIMESTAMP" as initial position](/blog/2017/08/21/elasticsearch-loader-0.10.0-released#at-timestamp)
4. [Configuration changes](/blog/2017/08/21/elasticsearch-loader-0.10.0-released#config)
5. [Contributing](/blog/2017/08/21/elasticsearch-loader-0.10.0-released#contributing)

<!--more-->

<h2 id="nsq-support">1. NSQ Support</h2>

With this release, we are adding NSQ as a stream source which is one step for our effort to have the Snowplow platform become cloud-agnostic. 

[NSQ] [nsq-website] is realtime distributed messaging platform. You can find detailed information about setup the NSQ in [here] [nsq-installing]. After setup the NSQ, only things you have to do is changing "source" field to the "NSQ" in the config file, filling the NSQ part of the config according to the your NSQ setup and changing stream names in the config file to the your NSQ topic names. After making this changes in the config file, you can start to use the Elasticsearch Loader with NSQ and store the data from NSQ to Elasticsearch.

<h2 id="json">2. Support for writing raw JSON's</h2>

One of our aim for this project was extending the scope of this project by having the ability to write non-Snowplow events to Elasticsearch as plain JSONs. We are one step closer to this aim with adding support for writing plain JSON's in this release. If you want to store JSON object in the Elasticsearch, only thing you need to do is changing `enabled` field to "plain-json" in the [config file] [example-config]. After changing the stream type, you can start sending plain JSON events to Elasticsearch through NSQ, Kinesis or stdin.

<h2 id="at-timestamp">3. Support for "AT_TIMESTAMP" as initial position</h2>

Before this release, there were two configuration options as initial position for Kinesis streams in the Elasticsearch Loader. These two are `TRIM_HORIZON` and `LATEST`. On the first run of the application, the Kinesis Connectors Library which is used by Elasticsearch Loader creates a DynamoDB table to keep track of what it has consumed from the stream so far. Either on first run it starts consuming from `LATEST` being the most recent record in the stream,`TRIM_HORIZON` being the oldest record available in the stream.

With this release, third option which is `AT_TIMESTAMP` is added as initial position. With `AT_TIMESTAMP` option, consuming will start from the specified timestamp. You can get more information about initial positions from [here] [kinesis-at-least-once-processing].

<h2 id="config">4. Configuration changes</h2>

There have been quite a few changes made to the configuration expected by the Elasticsearch Loader. Please check out the [example configuration file] [example-config] in the repository to make sure your configuration file has the expected parameters.

<h2 id="contributing">5. Contributing</h2>

You can check out the [repository] [repo] and the [open issues] [issues] if you’d like to get involved!


[nsq-website]: http://nsq.io
[nsq-installing]: http://nsq.io/deployment/installing.html
[kinesis-at-least-once-processing]: https://github.com/snowplow/snowplow/wiki/Kinesis-at-least-once-processing
[example-config]: https://github.com/snowplow/snowplow-elasticsearch-loader/blob/v0.10.0/examples/config.hocon.sample
[repo]: https://github.com/snowplow/snowplow-elasticsearch-loader
[issues]: https://github.com/snowplow/snowplow-elasticsearch-loader/issues