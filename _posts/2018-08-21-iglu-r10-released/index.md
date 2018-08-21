---
layout: post
title: Iglu R10 Tiflis released
title-short: Iglu R10 Tiflis
tags: [iglu, json, json schema, registry, schema registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/08/21/iglu-r10-tiflis-released/
---

We are excited to announce the release of Iglu R10 Tiflis, paving the way for a smoother igluctl workflow.
This release also introduces small but important updates to Iglu Server and core libraries.

1. [Schema workflow, simplified](#schema-workflow)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to core libraries](#core-improvements)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

Read on for more information about Release 10 Tiflis, named after [the first provisional stamp of Russia][tiflis].

![tiflis-img][tiflis-img]

<!--more-->

<h2 id="schema-workflow">1. Schema workflow, simplified</h2>

Working with JSON Schemas within the Snowplow ecosystem involves quite some steps:

1. Lint
2. Generate DDLs for Redshift, along with JSON Paths files
3. Push schemas to one or more schema registries
4. Sync JSON Paths files to one or more Amazon S3 buckets

All of these actions are handled by specific igluctl subcommands, one operation at a time.

Although going step-by-step may bring a better understanding of what's going on, it is also easy for human error to creep in, such as forgetting to lint (which can cause serious issues downstream). And of course all of the manual steps quickly become painfully repetitive when you work with schemas regularly.

With R10 Tiflis, we are introducing a new igluctl subcommand, `static deploy`, to perform the whole schema workflow from a single command.

This new command is powered by a config file, provided by the user. The command takes a single argument - the path to self-describing JSON config file:

{% highlight bash %}
$ igluctl static deploy /path/to/config.json
{% endhighlight %}

The config file itself contains a list of steps to perform and all necessary information such as bucket paths, registry endpoints and linting options. Check out the [Iglu wiki][igluctl-wiki] to learn more about the configuration file format.

You can also use this approach to maintain separate schema registry setups for production and test (e.g. Snowplow Mini) environments.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

<h3 id="draft-schemas">2.1 Drafting schemas</h3>

It is likely to take more than one iteration to prepare a json schema. In the meantime, the author could choose to upload work-in-progress schema to the registry or store somewhere else until it is ready to be used.

In order to improve Iglu experience with respect to above scenarios, R10 Tiflis introduces a new service, `Draft Schemas`, to work with unfinished, i.e. `draft` schemas. This new service comes with 7 endpoints, hosted under `/api/draft/`;

* `GET HOST/api/draft/public`: Retrieves all public & draft schemas
* `GET HOST/api/draft/{vendor}`: Retrieves all draft schemas belonging to a specific vendor
* `GET HOST/api/draft/{vendor}/{name}`: Retrieves all draft schemas belonging to a specific vendor & name combination
* `GET HOST/api/draft/{vendor}/{name}/{format}`: Retrieves all draft schemas belonging to a specific vendor & name & format combination
* `GET HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Retrieve a draft schema based on its (vendor, name, format, draftNumber)
* `POST HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Adds a draft schema based on its (vendor, name, format, draftNumber)
* `PUT HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Retrieve a draft schema based on its (vendor, name, format, draftNumber)

Draft number of a schema starts with `1` and can be increased as needed.

Using draft service frees user from thinking about which `version` to decide on until the schema is finalized.

Visit [Draft Schemas Wiki Page][draft-schemas-wiki] to learn more about it.

<h3 id="validation-methods">2.2 Validation endpoints, revisited</h3>

Iglu Server offers two endpoints under `/api/schemas/validate`.
One endpoint to check if a schema is self-describing and another endpoint to validate a JSON instance against its JSON schema.

However, both endpoints append schema to request's URL since their HTTP method is `GET`.
It was possible to hit URI length limit of Akka HTTP server or any possible reverse proxy or load balancer in front of Iglu Server, if your schema is long enough.

As of R10 Tiflis, both validation endpoints use `POST` method so that schemas won't be in request URL, removing the chance of hitting a limitation from server.

<h2 id="core-improvements">3. Improvements to core libraries</h2>

Both core libraries, Schema DDL and Iglu Core received their updates as well.

Schema DDL now includes abstract syntax tree Google BigQuery which can be used to generate BigQuery DDLs from JSON Schemas and cast self-describing JSON instances to their corresponding BigQuery schema.

Iglu Scala Core also includes several minor changes such as new `Decoder` and `Encoder` instances in `iglu-core-circe` module and convenient `parse` methods on all core entities.

As a last change - we've dropped Scala 2.10 support from all core libraries. Scala 2.11 is minimal required version of compiler.

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [Bintray][iglu-server-download] (download will start).

Unzip the compressed file and then you can launch the server like so:

{% highlight bash %}
$ java -jar $JAR_PATH --config $CONFIG_PATH
{% endhighlight %}

The only breaking change is regarding validation endpoints.

* `HOST/api/schemas/validate/{schemaFormat}` : the endpoint to validate if a schema is self describing

Up to day, it accepted `GET` requests where schema is appended to url.

As of Iglu Server `0.4.0`, this endpoint accepts `POST` requests where schema is sent as form data. An example request using `cURL` could be as following;

```
curl -X POST \
HOST/api/schemas/validate/jsonschema \
-F 'schema={...}'
```

* `/api/schemas/validate/{vendor}/{name}/{schemaFormat}/{version}` : the endpoint to validate a schema against its schema

Up to day, it accepted `GET` requests where instance is appended to url.

As of Iglu Server `0.4.0`, this endpoint accepts `POST` requests where instance is sent as form data. An example request using `cURL` could be as following;

```
curl -X POST \
HOST/api/schemas/validate/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0 \
-F 'instance={...}'
```

<h3 id="upgrade-igluctl">4.2 igluctl</h3>

The latest igluctl, version 0.5.0, can be downloaded from [here from Bintray][igluctl-download].

The new version doesn't deprecate any behaviors from the previous version, 0.4.1.

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

[tiflis]: https://commons.wikimedia.org/wiki/Stamps_of_Russia,_1857-1917#Tiflis
[tiflis-img]: /assets/img/blog/2018/08/tiflis.jpg
