---
layout: post
title: "Elasticsearch Loader 0.10.0 released"
title-short: Elasticsearch Loader 0.10.0
tags: [elasticsearch, kinesis, aws, nsq]
author: Enes
category: Releases
permalink: /blog/2017/09/12/elasticsearch-loader-0.10.0-released/
---

We are thrilled to announce [version 0.10.0][v0.10.0] of the Snowplow Elasticsearch Loader, our application for writing Snowplow enriched events and more to Elasticsearch.

<!--more-->

In this post, we will cover:

1. [NSQ support](/blog/2017/09/12/elasticsearch-loader-0.10.0-released#nsq-support)
2. [Support for writing raw JSONs](/blog/2017/09/12/elasticsearch-loader-0.10.0-released#json)
3. [Support for "AT_TIMESTAMP" as initial position](/blog/2017/09/12/elasticsearch-loader-0.10.0-released#at-timestamp)
4. [Configuration changes](/blog/2017/09/12/elasticsearch-loader-0.10.0-released#config)
5. [Contributing](/blog/2017/09/12/elasticsearch-loader-0.10.0-released#contributing)

<h2 id="nsq-support">1. NSQ Support</h2>

With this release, we are adding support for [NSQ][nsq-website] as an event source: the loader can now sink Snowplow enriched events from an NSQ topic to Elasticsearch. 

[NSQ][nsq-website] is a real-time distributed messaging platform. For more information on getting started, read the [NSQ installation guide][nsq-installation]. We are planning on migrating Snowplow Mini to use NSQ under the hood, and so this new functionality is a stepping stone to this goal.

Assuming you have NSQ set up already, you will need to make some changes to the Elasticsearch Loader's configuration file:

* Change the "source" field's value to "nsq"
* Complete the NSQ section of the config per your NSQ setup
* Change the stream names to match your NSQ topic names

<h2 id="json">2. Support for writing raw JSONs</h2>

We're keen to widen the community using the Snowplow loaders, and in support of this we have added the ability to write non-Snowplow JSON payloads to Elasticsearch.

You can think of this as an open-source version of [Amazon Kinesis Firehose][kinesis-firehose], but much more flexible, working as it does with NSQ, Kinesis and stdin sources and non-Elasticsearch Service clusters.

To write non-Snowplow JSONs to Elasticsearch, just change the `enabled` field to "plain-json" in the [config file][example-config].

<h2 id="at-timestamp">3. Support for "AT_TIMESTAMP" as initial position</h2>

Prior to this release, there were two possible configuration options to serve as the initial processing position for the Kinesis stream: `TRIM_HORIZON` and `LATEST`.

These determine what happens on the first run of the application, when the Kinesis Connectors Library inside the Elasticsearch Loader creates a DynamoDB table to track what it has consumed from the stream so far. Either on first run it would start consuming from `LATEST` (the most recent record in the stream), or from `TRIM_HORIZON` (the oldest record available in the stream).

This release adds a third option for the initial position, `AT_TIMESTAMP`. With the `AT_TIMESTAMP` option, consuming will start from the specified timestamp. To use `AT_TIMESTAMP` as an initial position, you should change the `initialPosition` and `initialTimestamp` fields in the configuration. `initialPosition` should be `AT_TIMESTAMP` and the `initialTimestamp` field must be changed to the point in time at which message consumption will begin. This timestamp needs to follow the "yyyy-MM-ddTHH:mm:ssZ" format. You can get more information about initial positions from [our own guide to Kinesis at-least-once processing][kinesis-at-least-once-processing].

<h2 id="config">4. Configuration changes</h2>

There have been some notable changes to the configuration file format expected by the Elasticsearch Loader.

Please check out the [example configuration file][example-config] in the repository to make sure that your configuration file has all the expected parameters.

<h2 id="contributing">5. Contributing</h2>

You can check out the [repository][repo] and the [open issues][issues] if you’d like to get involved!

[nsq-website]: http://nsq.io
[nsq-installation]: http://nsq.io/deployment/installing.html

[kinesis-at-least-once-processing]: https://github.com/snowplow/snowplow/wiki/Kinesis-at-least-once-processing
[kinesis-firehose]: https://aws.amazon.com/kinesis/firehose

[example-config]: https://github.com/snowplow/snowplow-elasticsearch-loader/blob/master/examples/config.hocon.sample

[repo]: https://github.com/snowplow/snowplow-elasticsearch-loader
[issues]: https://github.com/snowplow/snowplow-elasticsearch-loader/issues
[v0.10.0]: https://github.com/snowplow/snowplow-elasticsearch-loader/releases/tag/0.10.0
