---
layout: post
title: Snowplow Scala Analytics SDK 0.4.0 released
title-short: Snowplow Scala Analytics SDK 0.4.0
tags: [scala, snowplow, enriched events]
author: Rostyslav
category: Releases
permalink: /blog/2019/02/13/snowplow-scala-analytics-sdk-0.4.0-released/
---

We are excited to announce the 0.4.0 release of the [Snowplow Scala Analytics SDK][sdk-repo], a library that provides tools to process and analyze Snowplow enriched events in [Apache Spark][spark], [AWS Lambda][lambda], [Apache Flink][flink], [Scalding][scalding], and other JVM-compatible data processing frameworks. This release reworks the JSON Event Transformer to use a new type-safe API, and introduces several other internal changes.

Read on below the fold for:

1. [Event API](#event-api)
2. [Using the typesafe API](#typesafe-api)
3. [Additional changes](#additional-changes)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

<!--more-->

<h2 id="event-api">1. Event API</h2>

Previously, the JSON Event Transformer - a module that takes a Snowplow enriched event and converts it into a JSON ready for further processing - used to return Strings, which represented enriched events turned into JSON objects. While this was a non-opinionated and minimalistic approach, it involved a lot of extra post-processing, namely:

- Accessing individual JSON fields required casting the result to an instance of the json4s AST class via unsafe functions such as `parse(result)`.
- Accessing always existing fields still required redundant error processing logic, e.g. `parsedJson.map("event_id").getOrElse(throw new RuntimeException("event_id is not present in the enriched event")`.
- Getting a list of shredded types required using an additional, separate function, `jsonifyWithInventory`.

In 0.4.0, the `EventTransformer` API has been replaced by `Event` - a single typesafe container that contains all 132 members of a [canonical Snowplow event][canonical-event-model]. All fields are automatically converted to appropriate non-String types where possible; for instance, the `event_id` column is represented as a [UUID instance][java-uuid], while timestamps are converted into optional [Instant][java-instant] values, eliminating the need for common string conversions. Contexts and self-describing events are also wrapped in [self-describing data container types][self-describing-type], allowing for advanced operations such as Iglu URI lookups.

The case class has the following primary functions:

- `Event.parse(line)` - similar to the old `transform` function, this method accepts an enriched Snowplow event in a canonical TSV+JSON format as a string and returns an `Event` instance as a result.
- `event.toJson(lossy)` - similar to the old `getValidatedJsonEvent` function, it transforms an `Event` into a validated JSON whose keys are the field names corresponding to the EnrichedEvent POJO of the Scala Common Enrich project. If the lossy argument is true, any self-describing events in the fields (unstruct_event, contexts, and derived_contexts) are returned in a "shredded" format, e.g. `"unstruct_event_com_acme_1_myField": "value"`. If it is set to false, they use a standart self-describing format instead of being flattened into underscore-separated top-level fields.
- `event.inventory` - extracts metadata from the event containing information about the types and Iglu URIs of its shred properties (unstruct_event, contexts and derived_contexts). Unlike version 0.3.0, it no longer requires a `transformWithInventory` call and can be obtained from any `Event` instance.
- `atomic` - returns the event as a map of keys to Circe JSON values, while dropping inventory fields. This method can be used to modify an event's JSON AST before converting it into a final result.
- `ordered` - returns the event as a list of key/Circe JSON value pairs. Unlike `atomic`, which has randomized key ordering, this method returns the keys in the order of the canonical event model, and is particularly useful for working with relational databases.

<h2 id="typesafe-api">2. Using the typesafe API</h2>

Since base results of the Scala Analytics SDK are now members of the `Event` case class, their output needs to be converted to JSON strings. For instance, the following code can be used in an AWS Lambda to load a series of events into a Spark dataframe:

{% highlight scala %}
import com.snowplowanalytics.snowplow.analytics.scalasdk.Event

val events = input
  .map(line => Event.parse(line))
  .flatMap(_.toOption)
  .map(event => event.toJson(true).noSpaces)

val dataframe = spark.read.json(events)
{% endhighlight %}

Here, `event.toJson(true).noSpaces` first converts the `Event` instances to a member of Circe's `Json` AST class using the `toJson` function with its lossy parameter set to true (meaning that contexts and self describing event fields will be "flattened"), then converts the `Json` into a string using the `noSpaces` method - pretty-printing the JSON to a compact string with no spaces. (Alternatively, `spaces2` and `spaces4` functions, or even a custom Circe printer, can be used for a more human-readable output.)

Working with individual members of an `Event` is now as simple as accessing a specific field of a case class. For example, the following code can be used to safely access the ID, fingerprint and ETL timestamp of an event, replacing the fingerprint with a random UUID if it doesn't exist and throwing an exception if the timestamp is not set:

{% highlight scala %}
val eventId = event.event_id.toString
val eventFingerprint = event.event_fingerprint.getOrElse(UUID.randomUUID().toString)
val etlTstamp = event.etl_tstamp.getOrElse(throw new RuntimeException(s"etl_tstamp in event $eventId is empty or missing"))
{% endhighlight %}

<h2 id="additional-changes">3. Additional changes</h2>

Version 0.4.0 also includes several changes to the SDK's dependencies:

- The json4s AST has been removed in favor of [circe][circe], a JSON library based on Cats.
- Scala 2.12 has been updated to 2.12.8.
- The AWS SDK has been updated to 1.11.490.

<h2 id="upgrading">4. Upgrading</h2>

The Scala Analytics SDK is available for download at Maven Central. If you're using SBT, you can add it to your project as follows:

{% highlight scala %}
libraryDependencies += "com.snowplowanalytics" %% "scala-analytics-sdk" % "0.4.0"
{% endhighlight %}

<h2 id="help">5. Getting help</h2>

To find out more up-to-date documentation about the SDK, check out the [Scala Analytics SDK][sdk-docs] on the main Snowplow wiki. If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

And if there's another Snowplow Analytics SDK that you'd like us to prioritize creating, please let us know on [Discourse][discourse]!

[sdk-repo]: https://github.com/snowplow/snowplow-scala-analytics-sdk

[spark]: http://spark.apache.org/
[lambda]: https://aws.amazon.com/lambda/
[flink]: https://flink.apache.org/
[scalding]: https://github.com/twitter/scalding

[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[java-uuid]: https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html
[java-instant]: https://docs.oracle.com/javase/8/docs/api/java/time/Instant.html
[self-describing-type]: https://github.com/snowplow/iglu/wiki/Scala-iglu-core#container-types
[circe]: https://github.com/circe/circe

[sdk-docs]: https://github.com/snowplow/snowplow/wiki/Scala-Analytics-SDK
[issues]: https://github.com/snowplow/snowplow-scala-analytics-sdk/issues
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com/
