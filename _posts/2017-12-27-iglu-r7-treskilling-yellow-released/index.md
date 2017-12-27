---
layout: post
title: Iglu 7 Treskilling Yellow released
title-short: Iglu 7 Treskilling Yellow
tags: [iglu, json, json schema, redshift]
author: Oguzhan
category: Releases
permalink: /blog/2017/12/26/iglu-r7-treskilling-yellow-released/
---

We are pleased to announce a new Iglu release, R7 Treskilling Yellow, bringing the codebase up-to-date and preparing it for some significant releases going forwards.

1. [Iglu Core overhaul for Scala developers](#scala-core)
2. [New linters for igluctl users](#new-linters)
3. [A custom format, date, for JSON Schema v4](#new-format-date)
4. [Other updates](#other-updates)
5. [Getting Help](#other-updates)

Read on for more information on Release 7 Treskilling Yellow, named after [a Swedish postage stamp][treskilling-yellow] of which only one example is known to exist:

![treskilling-yellow-img] [treskilling-yellow-img]

<!--more-->

<h2 id="scala-core">1. Iglu Core overhaul for Scala developers</h2>

In preparation for our planned work on schema versioning and schema inference (RFC coming soon), we have made various changes to our Scala reference implementation of Iglu Core.

The most important change is that the `SchemaKey` entity now is no longer attachable to both the schema and the self-describing instance itself. Now, `SchemaKey` can only be attached to the self-describing instance, and contains a `SchemaVer` that can be either `Explicit` or `Partial` to reflect the fact that we may need to infer the schema's version.

Meanwhile, schema objects are described by a new `SchemaMap` - similar to the `SchemaKey`, but with an always-explicit `SchemaVer` because a schema must always be defined with a definite version.

Another important change lies in the package structure. Previously, you had to know what type-class instances you need to import and also mark them implicit yourself. This is confusing for people who are exploring Iglu Core and just want to use its primitives.

So now, all you need to know are these two imports:

{% highlight scala %}
// Import all primitive data structures, such as SchemaVer, SchemaKey, SelfDescribingData[A], etc
import com.snowplowanalytics.iglu.core._
// Extend primitives with AST-specific syntax and functionality
import com.snowplowanalytics.iglu.core.json4s.implicits._
// Or for circe
import com.snowplowanalytics.iglu.core.circe.implicits._
{% endhighlight %}

This should greatly improve the usability and portability of Iglu Core.

And lastly, Iglu Scala Core now supports all major Scala versions (2.10, 2.11 and 2.12), the latest stable version of Circe (0.9.0) and the version of Json4s used widely in Snowplow (3.2.11).

<h2 id="new-linters">2. New linters for igluctl users</h2>

Moving on to less dramatic changes to Iglu, this release adds some new linting features to igluctl's `lint` command, which should allow you to avoid subtle mistakes in your schemata.

<h3 id="custom-linter">2.1 Linting custom formats</h3>

Let's say you have a JSON Schema which applies a fictitious `camelCase` format to certain properties. Although this format might be supported by certain non-standard validators, Iglu does not support this format. Our linter now rejects this format, making it explicit that properties will **not** be successfully validated against it.

This also helps with plain old typos - for example if the schema author mistyped `date-time` format as `datetime`, then this linter will pick this up.

This new linting feature is available for the (default) first severity level, meaning it will always run.

<h3 id="optional-linter">2.2 Linting optional fields</h3>

Let's say you have a JSON Schema as following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.example-company",
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

Although, this is a valid JSON Schema, at Snowplow we find it better to express "nullability" in a record with an actual `null` as value, instead of the absence of that property entirely.

Taking this approach gives us some distinct advantages:

* Schema-derivation tools (like Spark DataFrame's own) will always end up knowing about the null property even for super-small datasets
* It shows that the developer is aware of the optional property (and has not simply forgotten it)
* Null is more convenient when working with templating languages

This explicit use of `null` is an opionated preference, available only at the third severity level of linting.

<h3 id="maxlength-linter">2.3 Linting maxLength</h3>

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

Again, for most users this might look like a valid JSON Schema.

But if you're going to use this schema with Redshift, you'll hit one of Redshift's limitations - that Redshift's `VARCHAR` type is limited to at most 65,535 bytes. It means your data will be silently truncated, which is most likely not what you want.

As this is a common problem in our users' schemas, we decided to make this available at the default, first severity level.

<h3 id="new-format-date">3. A new "date" custom format</h3>

One of the most common mis-steps in writing JSON Schemas is trying to use a `date` format which does not formally exist.

In place of prohibiting it with our new linters, [Mike Robbins][miike] of Snowflake Analytics has submitted a PR implementing support of the `date` format for igluctl's `static generate` command. Huge thanks, Mike!

Now, all JSON Schemas with `date` format can be transformed into Redshift DDLs with a corresponding [`DATE` type][redshift-date].

The `date` format validates strings of format `YYYY-MM-DD` and is so far only implemented for igluctl, but support for [Schema Guru][schema-guru-date] and [Iglu Scala Client][iglu-client-date] is planned.

<h2 id="other-updates">4. Other updates</h2>

Treskilling Yellow also fixes [an important bug][i-271] in igluctl, which could generate output filenames which are incompatible with the Snowplow RDB Loader.

Also, we have now added the [Iglu Ruby Client][iglu-ruby-client] to the list of officially supported Iglu clients.

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/iglu/releases/r7-treskilling-yellow
[discourse]: http://discourse.snowplowanalytics.com/
[changelog]: https://github.com/snowplow/iglu/blob/master/CHANGELOG

[treskilling-yellow]: https://en.wikipedia.org/wiki/Treskilling_Yellow
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
[i-271]: https://github.com/snowplow/iglu/issues/271
