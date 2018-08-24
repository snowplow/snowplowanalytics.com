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
This release also introduces small but important updates to Iglu Server and the core libraries.

1. [Schema workflow, simplified](#schema-workflow-simplified)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to core libraries](#core-improvements)
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

Although going step-by-step may bring a better understanding of what's going on, it is also easy for human error to creep in, such as forgetting to lint (which can cause serious issues downstream). And of course all of the manual steps quickly become painfully repetitive and cause friction when working with schemas regularly.

With R10 Tiflis, to address this friction we are introducing a new igluctl subcommand, `static deploy`, to perform the whole schema workflow from a single command.

This new command is powered by a config file provided by the user and takes a single argument - the path to self-describing JSON config file:

{% highlight bash %}
$ igluctl static deploy /path/to/config.json
{% endhighlight %}

The config file itself contains a list of steps to perform along with all necessary information such as bucket paths, registry endpoints, and linting options. Check out the [Iglu wiki][igluctl-wiki] to learn more about the configuration file format.

You can also use this approach to maintain separate schema registry setups for production and test (e.g. Snowplow Mini) environments.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

<h3 id="draft-schemas">2.1 Drafting schemas</h3>

Preparing a JSON schema can be a laborious process that likely takes time and requires several iterations. However, it's possible to upload work-in-progress schema to your registry, or store them elsewhere, until they're ready to be used.

Knowing that this is a common practice among users working with schema, R10 Tiflis introduces a new service, `Draft Schemas`, to handle unfinished, i.e. `draft`, schemas. This new service comes with seven endpoints, hosted under `/api/draft/`;

* `GET HOST/api/draft/public`: Retrieves all public & draft schemas
* `GET HOST/api/draft/{vendor}`: Retrieves all draft schemas belonging to a specific vendor
* `GET HOST/api/draft/{vendor}/{name}`: Retrieves all draft schemas belonging to a specific vendor & name combination
* `GET HOST/api/draft/{vendor}/{name}/{format}`: Retrieves all draft schemas belonging to a specific vendor & name & format combination
* `GET HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Retrieve a draft schema based on its (vendor, name, format, draftNumber)
* `POST HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Adds a draft schema based on its (vendor, name, format, draftNumber)
* `PUT HOST/api/draft/{vendor}/{name}/{format}/{draftNumber}`: Retrieve a draft schema based on its (vendor, name, format, draftNumber)

The default draft number of a schema starts with `1` and can be increased as needed.

Using the `Draft Schemas` service frees the user from thinking about which `version` to decide on until the schema is finalized.

Visit the [Draft Schemas Wiki Page][draft-schemas-wiki] for more details about this new service.

<h3 id="validation-methods">2.2 Validation endpoints, revisited</h3>

Iglu Server offers two endpoints under `/api/schemas/validate`.
One endpoint to check if a schema is self-describing and another endpoint to validate a JSON instance against its JSON schema.

However, both endpoints append the schema to the request's URL since their HTTP method is `GET`. If your schema is long enough, you run the risk of hitting the URL length limit of Akka HTTP server or any reverse proxy or load balancer you have in front of Iglu Server.

As of R10 Tiflis, both validation endpoints use `POST` so that schemas won't be in the request URL, removing the chance of hitting a limitation from the server.

<h2 id="core-improvements">3. Improvements to core libraries</h2>

Both core libraries, Schema DDL and Iglu Core, received updates as well.

Schema DDL now includes abstract syntax trees for Google BigQuery which can be used to generate BigQuery DDLs from JSON Schemas and cast self-describing JSON instances to their corresponding BigQuery schema.

Iglu Scala Core also includes several minor changes such as new `Decoder` and `Encoder` instances in the `iglu-core-circe` module and convenient `parse` methods on all core entities.

And finally - we've dropped Scala 2.10 support from all core libraries. **Scala 2.11 is now the minimal required version of compiler.**

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [Bintray][iglu-server-download] (download will start).

Unzip the compressed file and then you can launch the server with the following command:

{% highlight bash %}
$ java -jar $JAR_PATH --config $CONFIG_PATH
{% endhighlight %}

The only major change comes from the validation endpoints update mentioned above.

* `HOST/api/schemas/validate/{schemaFormat}` : the endpoint to validate if a schema is self describing

Until recently, this endpoint only accepted `GET` requests where schema are appended to the URL.

As of Iglu Server `0.4.0`, this endpoint also accepts `POST` requests where schema are sent as form data. An example request using `cURL` would look something like:

```
curl -X POST \
HOST/api/schemas/validate/jsonschema \
-F 'schema={...}'
```

* `/api/schemas/validate/{vendor}/{name}/{schemaFormat}/{version}` : the endpoint to validate a schema against its schema

This endpoint previously only accepted `GET` requests where the instance is appended to the URL.

As of Iglu Server `0.4.0`, this endpoint accepts `POST` requests where the instance is sent as form data. An example request using `cURL` would look like:

```
curl -X POST \
HOST/api/schemas/validate/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0 \
-F 'instance={...}'
```

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

[tiflis]: https://commons.wikimedia.org/wiki/Stamps_of_Russia,_1857-1917#Tiflis
[tiflis-img]: /assets/img/blog/2018/08/tiflis.jpg
