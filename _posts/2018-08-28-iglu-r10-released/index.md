---
layout: post
title: Iglu R10 Tiflis released
title-short: Iglu R10 Tiflis
tags: [iglu, json, json schema, registry, schema registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/08/28/iglu-r10-tiflis-released/
---

We are excited to announce the release of Iglu R10 Tiflis, paving the way for a smoother igluctl workflow.
This release also introduces small but important updates to Iglu Server and the core Iglu libraries.

1. [Schema workflow, simplified](#schema-workflow-simplified)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to the core libraries](#core-improvements)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

Read on for more information about Release 10 Tiflis, named after [the first provisional stamp of Russia][tiflis].

![tiflis-img][tiflis-img]

<!--more-->

<h2 id="schema-workflow-simplified">1. Schema workflow, simplified</h2>

Working with JSON Schemas within the Snowplow ecosystem can be cumbersome and requires multiple steps:

1. Lint
2. Generate DDLs for Redshift, along with JSON Paths files
3. Push schemas to one or more schema registries
4. Sync JSON Paths files to one or more Amazon S3 buckets

All of these actions are handled by specific igluctl subcommands, one operation at a time.

Although going step-by-step may bring a better understanding of what's going on, it is also easy for human error to creep in, such as forgetting to lint (which can cause serious issues downstream). And of course the manual steps quickly become painfully repetitive and cause friction when working with schemas regularly.

With R10 Tiflis, to address this friction we are introducing a new igluctl subcommand, `static deploy`, to perform the whole schema workflow from a single command.

This new command is powered by a self-describing JSON config file provided by the user, and takes a single argument - the path to this config file:

{% highlight bash %}
$ igluctl static deploy /path/to/config.json
{% endhighlight %}

The config file itself contains a list of steps to perform along with all necessary information such as bucket paths, registry endpoints, and linting options. Check out the [Iglu wiki][igluctl-wiki] to learn more about the configuration file format.

You can also use this approach to maintain separate schema registry setups for production and test (e.g. Snowplow Mini) environments.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

<h3 id="draft-schemas">2.1 Drafting schemas</h3>

Preparing a JSON Schema can be a laborious process, taking time and requiring several iterations. A schema author will want to store these work-in-progress schemas somewhere, until they're ready to be used.

Recognising this common use-case, R10 Tiflis introduces a new service, Draft Schemas, to handle unfinished, i.e. `draft`, schemas. This new service comes with seven endpoints, hosted under `/api/draft/`:

* `GET HOST/api/draft/public` - retrieves all draft *public* schemas
* `GET HOST/api/draft/{vendor}` - retrieves all draft schemas belonging to a specific vendor
* `GET HOST/api/draft/{vendor}/{name}` - retrieves all draft schemas belonging to a specific vendor and name combination
* `GET HOST/api/draft/{vendor}/{name}/{format}` - retrieves all draft schemas belonging to a specific vendor, name and format combination
* `GET HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}` - retrieves a draft schema based on its vendor, name, format and `draftNumber`
* `POST HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}` - adds a draft schema based on its vendor, name, format, and `draftNumber`
* `PUT HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}` - retrieves a draft schema based on its vendor, name, format and `draftNumber`

The default `draftNumber` of a schema is 1, and can be increased as needed.

Using the Draft Schemas service frees the user from thinking about which schema `version` to decide on, right until the schema is finalized.

Visit the [Draft Schemas Wiki Page][draft-schemas-wiki] for more details about this new service.

<h3 id="validation-methods">2.2 Validation endpoints, revisited</h3>

Iglu Server offers two endpoints under `/api/schemas/validate`:

* One endpoint checks if a schema is self-describing
* The other endpoint lets you validate a JSON instance against its JSON Schema

However, both endpoints append the schema to the request's URL, since their HTTP method is `GET`. If your schema is large enough, you run the risk of hitting the URL length limit of Akka HTTP server or any reverse proxy or load balancer that you have in front of Iglu Server.

As of this release, both validation endpoints support `POST`, with which the schemas are no longer sent in the request URL.

<h2 id="core-improvements">3. Improvements to the core libraries</h2>

Both core libraries, Schema DDL and Iglu Core, have received updates as well.

Schema DDL now includes abstract syntax trees for [Google BigQuery][bigquery] which can be used to generate BigQuery DDLs from JSON Schemas and cast self-describing JSON instances to their corresponding BigQuery schema.

These additions support the work we are doing with Google BigQuery following our Google Cloud Platform [RFC][rfc].

Iglu Scala Core also includes several minor changes such as new `Decoder` and `Encoder` instances in the `iglu-core-circe` module and a convenient `parse` methods on all core entities.

And finally - we have dropped Scala 2.10 support from all core Iglu libraries. Scala 2.11 is now the minimum Scala version to compile against.

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [Bintray][iglu-server-download] (download will start).

Unzip the compressed file and you can launch the server with the following command:

{% highlight bash %}
$ java -jar $JAR_PATH --config $CONFIG_PATH
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

The latest igluctl, version 0.5.0, can be downloaded [from Bintray here][igluctl-download].

This new version doesn't deprecate any behaviors from the previous version, 0.4.1.

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the relevant documentation pages:

* [Iglu Server][iglu-server-wiki]
* [Igluctl][igluctl-wiki]

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[igluctl-wiki]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.5.0.zip

[draft-schemas-wiki]: https://github.com/snowplow/iglu/wiki/The-draft-schema-service

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r10-tiflis
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.4.0.zip

[bigquery]: https://cloud.google.com/bigquery/
[rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-google-cloud-platform/1505

[tiflis]: https://commons.wikimedia.org/wiki/Stamps_of_Russia,_1857-1917#Tiflis
[tiflis-img]: /assets/img/blog/2018/08/tiflis.jpg
