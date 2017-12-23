---
layout: post
title: Iglu 7 Treskilling Yellow released with huge refreshment
title-short: Iglu 7 Treskilling Yellow
tags: [iglu, json, json schema]
author: Oguzhan
category: Releases
permalink: /blog/2017/12/15/iglu-r7-treskilling-yellow-released/
---

We are pleased to announce a new Iglu release with some significant refreshments.

1. [The Road to Schema Inference](#schema-inference)
2. [Iglu Scala Core overhaul](#scala-core)
2. [New Linters](#new-linters)
3. [A custom format, date, for JSON Schema v4](#new-format-date)
4. [Other Updates](#other-updates)

Read on for more information on Release 7 Treskilling Yellow, named after [a Swedish postage stamp][Treskilling-Yellow] of which only one example is known to exist:

![treskilling-yellow-img] [treskilling-yellow-img]

<!--more-->

<h2 id="schema-inference">1. The Road to Schema Inference</h2>

Since its inception, Iglu supported only explicitly versioned datums, e.g. user had to be fully aware of schema for data he or she tracks.
And this is often the case, when this user is in charge of the schema.

However, quite often we've seen so called "unreliable narrator" problem, when third-party service is in charge of sending data to user's pipeline.
In most of the cases this is a webhook, seending data from SaaS that knows nothing about Iglu.
What is even worse is that many providers do not care about their API/schema documentation - Snowplow users have to use [Schema Guru][schema-guru] to derive JSON Schema and hope nothing will change on the another side.
And in fact, SaaS providers rarely care about API consistency as well, so this is a question of time, when significant part of received data will go the bad bucket due invalidation against obsolete schema.

With Schema inference our user should be able to provide only "partial" schema version, i.e. `iglu:com.acme/order/jsonschema/1-?-?` or even `iglu:com.acme/order/jsonschema/?-?-?` instead of only one currently available "explicit" version `iglu:com.acme/order/jsonschema/1-2-0`, so full datum can look like following:

{% highlight json %}
{
  "schema": "iglu:com.acme/order/jsonschema/1-?-?",
  "data" {
    "category": "books",
    "price": 12.1
  }
}
{% endhighlight %}

In this example, we have known model and unknown revision and addition - it means that when pipeline will find a datum with this schema attached - it'll either try to find a schema within model `1` that datum conforms or infer new schema and upload it to Iglu Registry.

This is a very ambitious project here at Snowplow and in fact a biggest change in Iglu since its inception - a lot of work need to be done on this front, but this is a first step.

**Do not use this versioning yet - it is not implemented nor supported by Snowplow pipeline - your data will be invalidated**.

Expect more news in this area soon.

<h2 id="scala-core">2. Iglu Scala Core overhaul</h2>

In order to make above plans possible, we slightly changed our reference implementation of Iglu Core.

Most important change is that `SchemaKey` entity now is not anymore "universal", e.g. can be attached to both schema and datum.
Instead, `SchemaKey` remains entity that can be attached only to self-describing data and it has `SchemaVer` that can be either `Explicit` or `Partial` to reflect the fact that we need to infer it.
On the other side, `SchemaMap` is the new almost isomorhpic entity for schemas - it always has explicit `SchemaVer` as we cannot have defined schema with unkown version.

Another important change lays in package-structure. Previously, you had to know what type-class instances you need to import and also mark them implicit yourself.
As time shown - this approach didn't work well for people, who are just exploring Iglu Core and want to use its primitives.
Therefore, now you all you need to know are these two imports:

{% highlight scala %}
// Import all primitive data structures, such as SchemaVer, SchemaKey, SelfDescribingData[A], etc
import com.snowplowanalytics.iglu.core._
// Extend primitives with AST-specific syntax and functionality
import com.snowplowanalytics.iglu.core.json4s.implicits._
// Or for circe
import com.snowplowanalytics.iglu.core.circe.implicits._
{% endhighlight %}

This should greatly improve user experience and portability of Iglu Core.

And last, but not least: Iglu Scala Core now supports all major Scala versions (2.10, 2.11 and 2.12), latest stable version of Circe (0.9.0) and most-common in Snowplow version of Json4s (3.2.11).

<h2 id="new-linters">2. New Linters</h2>

On the front of less radical changes, we've added some new linting features to `igluctl lint` command, which should allow you to avoid subtle mistakes in your schema.

<h3 id="custom-linter">2a. Lint custom formats</h3>

Let's say you have a JSON Schema which implies `camelCase` format. Although for some users this format might seem legit or particular validators even support it, unfortunately Iglu does not have this format and we want to make it very explicit that none properties will be validated against it.
Also, this linter can help with plain old typos - for example if schema author mistyped `date-time` format as `dale-time` or similar.

This linter available for default, first severity level, which means it will always be enabled.

<h3 id="optional-linter">2b. Lint optional fields</h3>

Let's say you have a JSON Schema as following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.example_company",
    "name": "example_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "format": "date"
    },
    "age": {
        "type": "number"
    }
  },
  "required":["name"]
}
{% endhighlight %}

Although, this is totally valid JSON Schema, we at Snowplow found it much more convenient to express "nullability" in datum with actual `null` as value, instead of omitting it entirely.

This gives us following advantages:

* schema-derivation tools (like in Spark DataFrame) will always end up knowing about missed property even for super-small datasets
* it shows that developer is really aware of optional property, not just forgot it
* it's easier to use null with templating languages

This very opionated preference available only for third severity level, so you'll have to enable it yourself.

<h3 id="maxlength-linter">2c. Lint maxLength</h3>

Let's say you have a JSON Schema as following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.example_company",
    "name": "example_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 3,
      "maxLength": 100000
    },
    "age": {
        "type": "number"
    }
  },
  "required":["name"]
}
{% endhighlight %}

Again, for most users this might look like totally valid JSON Schema.
But in fact, if you're going to use it with Redshift - you'll hit one of its limitations - particularly, Redshift's VARCHAR type can be at most 65535 bytes.
It means your data will be silently truncated, which is most likely not what you want.

As this is very common problem in our users' schemas - we decided to make it available at default, first severity level.

<h3 id="new-format-date">3. A custom format, date, for JSON Schema v4</h3>

Let's say you have a JSON Schema as following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.example_company",
    "name": "example_event",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "format": "date"
    },
    "age": {
        "type": "number"
    }
  },
  "required":["name"]
}
{% endhighlight %}

When linting, igluctl didn’t used to warn users for custom formats, `date` in our case, they don’t make schemas invalid, they are just a custom format attribute in your schema per [JSON Schema v4 specifications][json-schema-v4]. However `date` doesn't look like a custom format to people coming from [JSON Schema v3][json-schema-v3]. This nuance between JSON Schema versions could give users wrong confidence. With this release, we are defining a new format, `date`, so that `date` isn't a custom format for our users.

<h2 id="other-updates">4. Other Updates</h2>

One of the important capabilities of igluctl is to generate corresponding Redshift table definitions and JSON Path files for JSON Schemas. Thanks to our users, we noticed a few issues with [generation of JSON path filenames and Redshift filenames][issue-271]. This release comes with bug fixes to make sure they are fixed.


For a complete list of updates see the [changelog][changelog].

[Treskilling-Yellow]: https://en.wikipedia.org/wiki/Treskilling_Yellow
[treskilling-yellow-img]: /assets/img/blog/2017/12/treskilling_yellow.jpg
[json-schema-v3]: https://tools.ietf.org/html/draft-zyp-json-schema-03
[json-schema-v4]: https://tools.ietf.org/html/draft-fge-json-schema-validation-00
[igluctl]: https://github.com/snowplow/iglu/tree/master/0-common/igluctl
[changelog]: https://github.com/snowplow/iglu/blob/master/CHANGELOG

[issue-271]: https://github.com/snowplow/iglu/issues/271

[schema-guru]: TODO
