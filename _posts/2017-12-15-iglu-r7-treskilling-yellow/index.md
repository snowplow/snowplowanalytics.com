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
3. [New Linters](#new-linters)
4. [A custom format, date, for JSON Schema v4](#new-format-date)
5. [Other Updates](#other-updates)
6. [Getting Help](#other-updates)

Read on for more information on Release 7 Treskilling Yellow, named after [a Swedish postage stamp][Treskilling-Yellow] of which only one example is known to exist:

![treskilling-yellow-img] [treskilling-yellow-img]

<!--more-->

<h2 id="schema-inference">1. The Road to Schema Inference</h2>

Since its inception, Iglu supported only explicitly versioned datums, e.g. users have to be fully aware of schema they attach to datums.
And indeed, very often users themselves are in charge of schema and have full control over it.

But "often" doesn't mean "always" and that's where so called "unreliable narrator" problem starts to emerge.
In layman terms this problem happens when third-party service is sending data to user's pipeline.
In most of the cases this is a webhook, seending data from SaaS that knows nothing about Iglu.
What is even worse is that many providers do not care about their API/schema documentation - Snowplow users have to use [Schema Guru][schema-guru] to derive JSON Schema and hope nothing will change on the another side.
And in fact, SaaS providers rarely care about API compatibility as well, so this is a question of time, when significant part of received data will go the bad bucket due invalidation against obsolete schema, or even schema that was never accurate enough.

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

In this example, we have known model and unknown revision and addition - it means that when pipeline will find a datum with this schema attached - it'll either try to find a schema within model `1` that datum fits best or to infer a new schema and upload it to Iglu Registry if no matches found.

This is a very ambitious project here at Snowplow and in fact a biggest change in Iglu since its inception - a lot of work need to be done on this front, but this is the first step.

Expect more news in this area soon.

**Do not use this versioning yet - it is not implemented nor supported by Snowplow pipeline - your data will be invalidated**.

<h2 id="scala-core">2. Iglu Scala Core overhaul</h2>

In order to make above plans possible, we slightly changed our reference implementation of Iglu Core.

Most important change is that `SchemaKey` entity now is not anymore "universal", e.g. can be attached to both schema and datum.
Instead, `SchemaKey` remains entity that can be attached only to self-describing datum and it has `SchemaVer` that can be either `Explicit` or `Partial` to reflect the fact that we may need to infer it.
On the other side, `SchemaMap` is the new almost isomorhpic entity, but for schemas - it always has explicit `SchemaVer` as it doesn't make sense to have define schema with unkown version.

Another important change lays in package-structure. Previously, you had to know what type-class instances you need to import and also mark them implicit yourself.
As time shown - this approach didn't work well for people, who are just exploring Iglu Core and just want to use its primitives.
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

<h2 id="new-linters">3. New Linters</h2>

On the front of less radical changes, we added some new linting features to `igluctl lint` command, which should allow you to avoid subtle mistakes in your schema.

<h3 id="custom-linter">3a. Lint custom formats</h3>

Let's say you have a JSON Schema which implies `camelCase` format. 
Although for some users this format might seem legit or particular validators even support it, unfortunately Iglu does not have this format and we want to make it very explicit that none properties will be validated against it.
Also, this linter can help with plain old typos - for example if schema author mistyped `date-time` format as `datetime`, which is very common mistake.

This linter available for default, first severity level, which means it will always be enabled.

<h3 id="optional-linter">3b. Lint optional fields</h3>

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

Although, this is totally valid JSON Schema, we at Snowplow find it much more convenient to express "nullability" in datum with actual `null` as value, instead of omitting it entirely.

This gives us following advantages:

* schema-derivation tools (like one in Spark DataFrame) will always end up knowing about missed property even for super-small datasets
* it shows that developer is really aware of optional property, not just forgot it
* it's easier to use null with templating languages

This very opionated preference available only for third severity level, so you'll have to enable it yourself.

<h3 id="maxlength-linter">3c. Lint maxLength</h3>

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

As this is a very common problem in our users' schemas - we decided to make it available at default, first severity level.

<h3 id="new-format-date">4. A new "date" custom format</h3>

One of the most often "wrong" format among our uses was a `date` format.
But instead of prohibiting it with our new linters - [Mike Robbins][miike] submitted a PR implementing support of `date` format for our `static generate` command (thanks, Mike!).
Now, all JSON Schemas with `date` format can be transformed into Redshift DDLs with corresponding [`DATE` type][redshift-date].

`date` format supposed to validate strings of format `YYYY-MM-DD` and now implemented only for Igluctl, but support for [Schema Guru][schema-guru-date] and [Iglu Scala Client][iglu-client-date] is to come.

<h2 id="other-updates">5. Other Updates</h2>

Besides of already mentioned new features and refreshments, we also fixed [an important bug][issue-271], resulted in output filenames incompatible with RDB Loader.
Also, [Iglu Ruby Client][iglu-ruby-client] now officially added to small family of Iglu clients.

For a complete list of updates see the [changelog][changelog].

<h2 id="help">6. Getting Help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/iglu/snowplow/releases/r7
[discourse]: http://discourse.snowplowanalytics.com/
[changelog]: https://github.com/snowplow/iglu/blob/master/CHANGELOG

[Treskilling-Yellow]: https://en.wikipedia.org/wiki/Treskilling_Yellow
[treskilling-yellow-img]: /assets/img/blog/2017/12/treskilling_yellow.jpg
[json-schema-v3]: https://tools.ietf.org/html/draft-zyp-json-schema-03
[json-schema-v4]: https://tools.ietf.org/html/draft-fge-json-schema-validation-00
[igluctl]: https://github.com/snowplow/iglu/tree/master/0-common/igluctl

[schema-guru]: https://github.com/snowplow/schema-guru/
[redshift-date]: http://docs.aws.amazon.com/redshift/latest/dg/r_Datetime_types.html#r_Datetime_types-date
[iglu-client-date]: https://github.com/snowplow/iglu-scala-client/issues/71
[schema-guru-date]: https://github.com/snowplow/schema-guru/issues/177
[miike]: https://github.com/miike

[iglu-ruby-client]: https://github.com/snowplow/iglu-ruby-client
[issue-271]: https://github.com/snowplow/iglu/issues/271
