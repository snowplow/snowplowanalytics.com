---
layout: post
title: Iglu R10 Tiflis released
title-short: Iglu R10 Tiflis
tags: [iglu, json, json schema, registry, schema registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/08/21/iglu-r10-tiflis-released/
---

We are excited to announce the release of Iglu R10 Tiflis, paving the way for a smoother Igluctl workflow.
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

Working with JSON schemas in Snowplow ecosystem includes following steps:

1. Lint
2. Generate DDLs, optionally with jsonpaths
3. Push to one or more schema registries 
4. Sync to one or more Amazon S3 buckets

All these actions are handled by a specific igluctl subcommand, one operation at a time.

Although going step by step may bring a better understanding of what's going on, the time has shown that granular approach to schema workflow was also opening the way for some human mistakes, such as forgetting linting sometimes which could cause serious issues downwards the workflow.
Also, having to go through each of the steps manually starts to become cumbersome and error prone, especially if you regularly work with schemas.

With R10 Tiflis, we are introducing a new igluctl subcommand, `static deploy`, to perform whole schema workflow at single step. 
This new command will work with a config file, provided by user.
We aim to simplify the schema workflow and lower the entry barrier.

This new command accepts a single argument - path to self-describing JSON config file:

{% highlight bash %}
$ igluctl static deploy /path/to/config.json
{% endhighlight %}

Config file itself contains list of steps to perform and all necessary necessary information such as bucket paths, registry endpoints and linting options.
Checkout [Iglu wiki][igluctl-wiki] to learn more about configuration file.

Some users might also want to maintain separate versions of environments for production and test (such as Snowplow Mini) environments.


<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

<h3 id="draft-schemas">2.1 Drafting schemas</h3>

R10 Tiflis introduces a new service in Iglu Server, enabling to draft schemas.
All endpoints under `/api/schemas/` has a correspondence under `/api/draft/`, meaning that a work-in-progress schema can be added, read and updated as draft.
When the work on a schema is finalized, it is ready to be processed under `/api/schemas/` endpoints.

Note that, for any `/api/schemas/` endpoint ending with `version`, it ends with `draftNumber` under `/api/draft`.
Draft number of a schema starts with `1` and increase as needed.

Using draft service frees user from thinking about `version` until the schema is ready to be used under `/api/schemas/` endpoints.

<h3 id="validation-methods">2.2 Validation endpoints, revisited</h3>

Iglu Server offers two endpoints under `/api/schemas/validate`.
One endpoint to check if a schema is self-describing and another endpoint to validate a JSON instance against its JSON schema.

However, both endpoints append schema to request's URL since their HTTP method is `GET`.
It was possible to hit URI lenght limit of Akka HTTP server or any possible reverse proxy or load balancer in front of Iglu Server, if your schema is long enough.

As of R10 Tiflis, both validation endpoints use `POST` method so that schemas won't be in request URL, removing the chance of hitting a limitation from server.

<h2 id="core-improvements">3. Improvements to core libraries</h2>

Both core libraries, Schema DDL and Iglu Core received their updates as well.

Schema DDL now includes abstract syntax tree Google BigQuery which can be used to generate BigQuery DDLs from JSON Schemas and cast self-describing JSON instances to their corresponding BigQuery schema.

Iglu Scala Core also includes several minor changes such as new `Decoder` and `Encoder` instances in `iglu-core-circe` module and convenient `parse` methods on all core entities.

As a last change - we've dropped Scala 2.10 support from all core libraries. Scala 2.11 is minimal required version of compiler.

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [here from Bintray][iglu-server-download] (download will start). Unzip the compressed file and then you can launch server with following interface: `java -jar $JAR_PATH --config $CONFIG_PATH`.

The only breaking change is regarding 2 validation endpoints under `/api/schemas/validate/`.
Previously, a `GET` request sent to any endpoint under `/api/schemas/validate/` would be used for validation.
From now on, same request should be sent using `POST` method.
Also, schemas shouldn't be appended to request URL, instead they should be in body as form data.

<h3 id="upgrade-igluctl">4.2 igluctl</h3>

The latest igluctl can be downloaded from [here from Bintray][igluctl-download].

The new version, igluctl 0.5.0, doesn't deprecate any interface from previous version, 0.4.1.

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the [wiki page][iglu-server-wiki] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].


[igluctl-wiki]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.5.0.zip

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r10-tiflis
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server-setup
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.4.0.zip

[bigquery]: https://cloud.google.com/bigquery/

[tiflis]: https://commons.wikimedia.org/wiki/Stamps_of_Russia,_1857-1917#Tiflis
[tiflis-img]: /assets/img/blog/2018/08/tiflis.jpg
