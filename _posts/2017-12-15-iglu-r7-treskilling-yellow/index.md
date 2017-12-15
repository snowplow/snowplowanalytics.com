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

1. [Support for Unversioned Schema](#unversioned-schema)
2. [New Linters](#new-linters)
3. [A custom format, date, for JSON Schema v4](#new-format-date)
4. [Other Updates](#other-updates)

Read on for more information on Release 7 Treskilling Yellow, named after [a Swedish postage stamp][Treskilling-Yellow] of which only one example is known to exist:

![treskilling-yellow-img] [treskilling-yellow-img]

<!--more-->

<h2 id="unversioned-schema">1. Support for Unversioned Schema</h2>

It is possible to see unversioned JSON instances as following:

`com.acme/order/jsonschema/?-?-?`


`com.acme/order/jsonschema/1-?-?`


`com.acme/order/jsonschema/1-3-?`


In order to distinguish versioned and unversioned JSON instances, we decided to introduce two SchemaVer classes, `SchemaVer.Full` and `SchemaVer.Partial`. As expected, `SchemaVer.Full` is for versioned instances and `SchemaVer.Partial` is for unversioned instances.

<h2 id="new-linters">2. New Linters</h2>

<h3 id="custom-linter">2a. Lint custom formats</h3>

Let's say you have a JSON Schema which makes use of a custom format as following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for an example event",
  "self": {
    "vendor": "com.example_company",
    "name": "staff",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "format": "camelCase"
    },
    "age": {
        "type": "number"
    }
  },
  "required":["name"]
}
{% endhighlight %}

As of Release 7, linting will warn if you have a custom format.

{% highlight bash %}
$ /path/to/igluctl lint schemas/com.example_company/staff/ --severityLevel 1
FAILURE: Schema [/path/to/schema/registry/schemas/com.example_company/staff/jsonschema/1-0-0] contains following errors:
1. Format [camelCase] is not supported. Available options are: date-time, date, email, hostname, ipv4, ipv6, uri
TOTAL: 0 Schemas were successfully validated
TOTAL: 1 invalid Schemas were encountered
TOTAL: 1 errors were encountered
{% endhighlight %}


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

Users would omit a field in `required` if that field isn't required. As natural as it sounds, it is likely to forget omitting some fields. igluctl didn't used to warn for such cases but with this release, we are introducing a higher severity level, 3, so that users will be warned for fields not listed in `required` and fields without `null` `type` information.

See `Error 1` below.
{% highlight bash %}
$ /path/to/igluctl lint schemas/com.example_company/example_event/ --severityLevel 3
FAILURE: Schema [/path/to/schema/registry/schemas/com.example_company/example_event/jsonschema/1-0-0] contains following errors:
1. It is recommended to express absence of property via nullable type
2. String Schema doesn't contain maxLength nor enum properties nor appropriate format
3. Numeric Schema doesn't contain minimum and maximum properties
TOTAL: 0 Schemas were successfully validated
TOTAL: 1 invalid Schemas were encountered
TOTAL: 3 errors were encountered
{% endhighlight %}

<h3 id="maxlength-linter">2b. Lint maxLength</h3>

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
      "maxLength": 65536
    },
    "age": {
        "type": "number"
    }
  },
  "required":["name"]
}
{% endhighlight %}

Redshift VARCHAR character type can be at most 65535 bytes.

{% highlight bash %}
$ /path/to/igluctl lint schemas/com.example_company/example_event/ --severityLevel 1
FAILURE: Schema [/path/to/schema/registry/schemas/com.example_company/example_event/jsonschema/1-0-0] contains following errors:
1. maxLength [65536] is greater than Redshift VARCHAR(max), 65535
TOTAL: 0 Schemas were successfully validated
TOTAL: 1 invalid Schemas were encountered
TOTAL: 1 errors were encountered
{% endhighlight %}

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
