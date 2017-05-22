---
layout: post
title: Snowplow Scala Analytics SDK 0.2.0 released
title-short: Snowplow Scala Analytics SDK 0.2.0
tags: [scala, snowplow, enriched events, spark, dynamodb]
author: Anton
category: Releases
---

We are pleased to announce the 0.2.0 release of the [Snowplow Scala Analytics SDK][sdk-repo], a library providing tools to process and analyze Snowplow enriched event format in Scala-compatible data processing frameworks such as [Apache Spark][spark], [AWS Lambda][lambda], [Apache Flink][flink], [Scalding][scalding] and other JVM-compatible data processing frameworks.

This release adds run manifest functionality, removes Scalaz dependency and brings SDK artifacts to Maven Central along with many other internal changes.

In the rest of this post we will cover:

1. [Run manifests](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#run-manifests)
2. [Using the run manifest](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#using-manifests)
3. [Documentation](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#documentation)
4. [Other changes](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#other)
5. [Upgrading](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#upgrading)
6. [Getting help](/blog/2017/05/22/snowplow-scala-analytics-sdk-0.2.0-released#help)

<!--more-->

<h2 id="run-manifests">1. Run manifests</h2>

This release provides tooling for populating and inspecting a **Snowplow run manifest**. A Snowplow run manifest is a lightweight and robust way to track your data-modeling step progress. Using it you can check if particular folder with enriched events already was processed and now can be skipped.

Run manifests were previously introduced in [Snowplow Python Analytics SDK 0.2.0][python-sdk-post]. Scala API closely resembles Python SDK's version.

Historically, Snowplow's batch pipeline apps have moved whole folders of data around different locations in Amazon S3 in order to track progress through a pipeline run, and to avoid accidentally reprocessing that data. But file moves have their own disadvantages:

1. They are time-consuming
2. They are network-intensive
3. They are error-prone - a failure to move a file will cause the job to fail and require manual intervention
4. They only support one use-case at a time - you can't have two distinct jobs moving the same files at the same time
5. They are unflexible - it's impossible to add metadata about processing status

Although Snowplow continues to move files so far, we recommend you to use a run manifest for your own data processing jobs on Snowplow data. The idea of a manifest comes from the old naval term:

> a list of the cargo carried by a ship, made for the use of various agents and officials at the ports of destination

In this case, we store our manifest in a [AWS DynamoDB][dynamodb] table, and we use it to keep track of which Snowplow runs our job has already processed.

<h2 id="using-the-manifest">2. Using the run manifest</h2>

The run manifest functionality resides in the new `com.snowplowanalytics.snowplow.analytics.scalasdk.RunManifests` module.

Here's a short usage example:

{% highlight "scala" }
import com.amazonaws.services.s3.AmazonS3ClientBuilder
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBAsyncClientBuilder
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.snowplowanalytics.snowplow.analytics.scalasdk.RunManifests

val DynamodbRunManifestsTable = "snowplow-run-manifests"
val EnrichedEventsArchive = "s3://acme-snowplow-data/storage/enriched-archive/"

val s3Client = AmazonS3ClientBuilder.standard()
  .withCredentials(DefaultAWSCredentialsProviderChain.getInstance)
  .build()

val dynamodbClient = AmazonDynamoDBAsyncClientBuilder.standard()
  .withCredentials(DefaultAWSCredentialsProviderChain.getInstance)
  .build()

val runManifestsTable = RunManifests(dynamodbClient, DynamodbRunManifestsTable)
val runManifestsTable.create()

val unprocessed = RunManifests.listRunIds(s3Client, EnrichedEventsArchive)
  .filterNot(runManifestsTable.contains)

unprocessed.foreach { runId =>
  process(runId)
  runManifestsTable.add(runId)
}
{% endhighlight %}

In above example, we create two AWS service clients, one for S3 (to list job runs) and for DynamoDB (to access our manifest).

Then we list all Snowplow runs in a particular S3 path, filtering only those which were not processed yet and not archived to [AWS Glacier][glacier] (helping to to avoid increasing AWS costs for restoring data). Then process with the user-provided `process` function. Note that `RunId` is just a simple string with the S3 key of particular job run.

`RunManifests` class, then, is a simple API wrapper to DynamoDB, which lets you:

* `create` a DynamoDB table for manifests
* `add` a Snowplow run to the table
* check if table `contains` a given run ID

<h2 id="scalaz">3. Removed Scalaz dependency</h2>

In initial release we used `Validation` datatype from [Scalaz][scalaz] library to represent event transformation failures.
This approach is taken inside Snowplow pipeline and serves us quite well there, but in Analytics SDKs it caused some problems as it could transitively bring dependencies, break jobs compiled against Scala 2.11 and confuse analysts unfamiliar with advanced functional programming concepts.

To solve this we replaced `Validation` with `Either` - isomorphic data type from Scala standard library.
This is the only breaking change in this release and you still can filter RDD with only successfully converted JSONs in a familiar way:

{% highlight "scala" %}
val events = input
  .map(line => EventTransformer.transform(line))
  .filter(_.isRight)
  .flatMap(_.right.toOption)
{% endhighlight %}

<h2 id="documentation">4. Documentation</h2>

As we adding more features to SDK it becomes harder to keep up-to-date documentation in the project's README.
In this release we have split out the README into several wiki pages, each dedicated to a particular feature.

Check out the [Scala Analytics SDK][sdk-docs] in the main Snowplow wiki.

<h2 id="other">5. Other changes</h2>

Version 0.2.0 also includes a few internal changes and minor enhancements, including:

* Event with empty custom contexts is no more considered invalid [(#27)][issue-27]
* Unnecessary `null` in empty `unstruct_event` and `contexts` now omitted [(#11)][issue-11]
* Fixed important bug, where schema names with hyphens were considered invalid [(#22)][issue-22]

<h2 id="upgrading">5. Upgrading</h2>

Since 0.2.0, Scala Analytics SDK is available at Maven Central. If you're using SBT you can add it as following:

{% highlight scala %}
libraryDependencies += "com.snowplowanalytics" %% "scala-analytics-sdk" % "0.2.0"
{% endhighlight %}

<h2 id="help">6. Getting help</h2>

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

And if there's another Snowplow Analytics SDK you'd like us to prioritize creating, please let us know on the [forums] [discourse]!

[sdk-repo]: https://github.com/snowplow/snowplow-scala-analytics-sdk
[sdk-usage-img]: /assets/img/blog/2016/03/scala-analytics-sdk-usage.png
[sdk-docs]: https://github.com/snowplow/snowplow/wiki/Scala-Analytics-SDK

[dynamodb]: https://aws.amazon.com/dynamodb/
[glacier]: https://aws.amazon.com/glacier/

[event-data-modeling]: /blog/2016/03/16/introduction-to-event-data-modeling/
[python-sdk-post]: https://snowplowanalytics.com/blog/2017/04/11/snowplow-python-analytics-sdk-0.2.0-released/

[issue-11]: https://github.com/snowplow/snowplow-scala-analytics-sdk/issues/11
[issue-22]: https://github.com/snowplow/snowplow-scala-analytics-sdk/issues/22
[issue-27]: https://github.com/snowplow/snowplow-scala-analytics-sdk/issues/27

[spark]: http://spark.apache.org/
[lambda]: https://aws.amazon.com/lambda/
[scalding]: https://github.com/twitter/scalding
[scalaz]: https://github.com/scalaz/scalaz

[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com/
