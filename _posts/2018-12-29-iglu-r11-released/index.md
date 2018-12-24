---
layout: post
title: Iglu R11 Capul de bour released
title-short: Iglu R11 Capul de bour
tags: [iglu, json, json schema, registry, schema registry]
author: Anton
category: Releases
permalink: /blog/2018/12/29/iglu-r11-capul-de-bour-released/
---

We are excited to announce the release of Iglu R11 Capul de bour, with long-awaited detailed linter messages and major improvements in Iglu Server and core libraries.

1. [Improved linter messages](#linting)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to the core libraries](#core-improvements)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

Read on for more information about Release 11 Capul de bour, named after [the series of first postage stamps of Romania][capul-de-bour].

![capul-de-bour-img][capul-de-bour-img]

<!--more-->

<h2 id="schema-workflow-simplified">1. Improved linter messages</h2>

Since its inception, igluctl was able to check a static registry for many kinds of inconsistencies in JSON schemas, that cannot be handled by JSON meta schema, such as `minimum` value greater than `maximum` or set of string-specific properties in a field with non-string type.
However, it was quite cumbersome to find out the problematic place in the JSON Schema, because messages produced by igluctl did not contain any references to the field.
Since 0.7.0 igluctl produced detailed messages with JSON Pointers to exact place in a JSON Schema.

Working with JSON Schemas within the Snowplow ecosystem can be cumbersome and requires multiple steps:

1. Lint
2. Generate DDLs for Redshift, along with JSON Paths files
3. Push schemas to one or more schema registries
4. Sync JSON Paths files to one or more Amazon S3 buckets

All of these actions are handled by specific igluctl subcommands, one operation at a time.

Although going step-by-step may bring a better understanding of what's going on, it is also easy for human error to creep in, such as forgetting to lint (which can cause serious issues downstream). And of course the manual steps quickly become painfully repetitive and cause friction when working with schemas regularly.

With R10 Tiflis, to address this friction we are introducing a new igluctl subcommand, `static deploy`, to perform the whole schema workflow from a single command.

This new command is powered by a self-describing JSON config file provided by the user, and takes a single argument - the path to this config file:


<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

Preparing a JSON Schema can be a laborious process, taking time and requiring several iterations. A schema author will want to store these work-in-progress schemas somewhere, until they're ready to be used.


<h2 id="core-improvements">3. Improvements to the core libraries</h2>

Both core libraries, Schema DDL and Iglu Core, have received updates as well.

And finally - we have dropped Scala 2.10 support from all core Iglu libraries. Scala 2.11 is now the minimum Scala version to compile against.

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [Bintray][iglu-server-download] (download will start).

Unzip the compressed file and you can launch the server with the following command:

{% highlight bash %}
$ java -jar $JAR_PATH --config $CONFIG_PATH
{% endhighlight %}

Alter the `schemas` table in order to make it compatible with the 0.4.0 schema:

{% highlight bash %}
$ psql \
    -U $IGLU_DBUSER \
    -h $IGLU_HOST \
    -W $IGLU_DBNAME \
    -c "ALTER TABLE schemas ADD COLUMN "draftnumber" VARCHAR(50) NOT NULL DEFAULT '0';"
{% endhighlight %}

The only major change comes from the `POST`-using validation endpoints update mentioned above:

* `HOST/api/schemas/validate/{schemaFormat}` - the endpoint to validate if a schema is self-describing
* `/api/schemas/validate/{vendor}/{name}/{schemaFormat}/{version}` - the endpoint to validate a JSON instance against its schema

Until recently, these endpoints only accepted `GET` requests where schema or instance are appended to the URL.

As of Iglu Server `0.4.0`, these endpoints also accept `POST` requests where schema or instance are sent as form data. An example request for checking if a schema is self-describing would look something like this:

{% highlight bash %}
$ curl -X POST \
HOST/api/schemas/validate/jsonschema \
-F 'schema={...}'
{% endhighlight %}

An example request to validate a JSON instance against its JSON Schema would look like:

{% highlight bash %}
$ curl -X POST \
HOST/api/schemas/validate/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0 \
-F 'instance={...}'
{% endhighlight %}

<h3 id="upgrade-igluctl">4.2 igluctl</h3>

The latest igluctl, version 0.6.0, can be downloaded [from Bintray here][igluctl-download].

This new version doesn't deprecate any behaviors from the previous version, 0.5.0.

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the relevant documentation pages:

* [Iglu Server][iglu-server-wiki]
* [Igluctl][igluctl-wiki]

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[igluctl-wiki]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.5.0.zip

[draft-schemas-wiki]: https://github.com/snowplow/iglu/wiki/The-draft-schema-service

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r11-capul-de-bour
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.6.0.zip

[capul-de-bour]: https://en.wikipedia.org/wiki/Moldavian_Bull%27s_Heads
[tiflis-img]: /assets/img/blog/2018/12/iglu-r11-stamp.jpg
