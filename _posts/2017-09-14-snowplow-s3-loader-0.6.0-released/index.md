---
layout: post
title: "Snowplow S3 Loader 0.6.0 released"
title-short: Snowplow S3 Loader 0.6.0
tags: [kinesis, s3, aws, nsq]
author: Enes
category: Releases
permalink: /blog/2017/09/13/snowplow-s3-loader-0.6.0-released/
---

We are pleased to release [version 0.6.0][release] of Snowplow S3 Loader, formerly known as
Kinesis S3, our project dedicated to storing data, including Snowplow raw and enriched event streams,
to Amazon S3.

<!--more-->

This post will cover:

1. [NSQ Support](/blog/2017/09/14/snowplow-s3-loader-0.6.0-released#nsq-support)
2. [Support for "AT_TIMESTAMP" as initial position](/blog/2017/09/14/snowplow-s3-loader-0.6.0-released#at-timestamp)
3. [Upgrading](/blog/2017/09/14/snowplow-s3-loader-0.6.0-released#upgrading)
4. [Contributing](/blog/2017/09/14/snowplow-s3-loader-0.6.0-released#contributing)


<h2 id="nsq-support">1. NSQ Support</h2>

This release introduces NSQ as an event source - it is for this reason that we have renamed the project from Kinesis S3.
Adding NSQ support to the Snowplow S3 Loader is another step towards migrating Snowplow Mini to use NSQ, also enabling Snowplow Mini to back-up its event stream to S3.

[NSQ][nsq-website] is a realtime distributed messaging platform. For more information on getting started, you can read the [NSQ installation guide][nsq-install].

Assuming you have NSQ setup already, you will need to make some changes to the S3 Loader's
configuration file in order to sink your NSQ events into an S3 folder:

- Change the "source" and "sink" values to "nsq"
- Complete the NSQ section of the config per your NSQ setup
- Change the stream names to match your NSQ topic names

<h2 id="at-timestamp">2. Support for "AT_TIMESTAMP" as initial position</h2>

Prior to this release, there were two possible configuration options to serve as the initial
processing position for the Kinesis stream: `TRIM_HORIZON` and `LATEST`.

These determine what happens on the first run of the application, when the Kinesis Client
Library inside the Elasticsearch Loader creates a DynamoDB table to track what it has consumed from
the stream so far. Either on first run it would start consuming from `LATEST` (the most recent
record in the stream), or from `TRIM_HORIZON` (the oldest record available in the stream).

This release adds a third option for the initial position, `AT_TIMESTAMP`. With the `AT_TIMESTAMP`
option, consuming will start from the specified timestamp. To use `AT_TIMESTAMP` as an initial
position, you should change the `initialPosition` and `initialTimestamp` fields in the
configuration. `initialPosition` should be `AT_TIMESTAMP` and the `initialTimestamp` field must be
changed to the point in time at which message consumption will begin. This timestamp needs to follow
the "yyyy-MM-ddTHH:mm:ssZ" format. You can get more information about initial positions from
[our own guide to Kinesis at-least-once processing][kinesis-at-least-once-processing].

<h2 id="upgrading">3. Upgrading</h2>

Two important changes have been made to how you run the Snowplow Loader.

<h3 id="jar">3.1 Non-executable JARs</h3>

From now on, the produced artifacts will be non-executable JAR files. We found that sbt-assembly,
the plugin we use to build fat JARs, was producing executable but unfortunately corrupt JAR files, hence this change.

As a result, you’ll now have to launch the loader like so:

`java -jar snowplow-s3-loader-0.6.0.jar --config my.config`

<h3 id="conf">3.2 Configuration changes</h3>

There have been quite a few changes made to the configuration expected by the S3 Loader. Please
check out the [example configuration file][example-config] in the repository to make sure that your
configuration file has the expected parameters.

<h2 id="contributing">4. Contributing</h2>

You can check out the [repository][repo] and the [open issues][issues] if you’d like to get involved!

[nsq-website]: http://nsq.io
[nsq-install]: http://nsq.io/deployment/installing.html

[kinesis-at-least-once-processing]: https://github.com/snowplow/snowplow/wiki/Kinesis-at-least-once-processing

[example-config]: https://github.com/snowplow/snowplow-s3-loader/blob/master/examples/config.hocon.sample

[repo]: https://github.com/snowplow/snowplow-s3-loader
[issues]: https://github.com/snowplow/snowplow-s3-loader/issues
[release]: https://github.com/snowplow/snowplow-s3-loader/releases/tag/0.6.0
