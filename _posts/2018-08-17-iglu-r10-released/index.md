---
layout: post
title: Iglu R10 Tiflis released
title-short: Iglu R9 Tiflis
tags: [iglu, json, json schema, registry, schema registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/08/17/iglu-r10-tiflis-released/
---

We are excited to announce the release of Iglu R10 Tiflis, paving the way for a smoother schema workflow. This release also introduces small but important updates to Iglu Server and Iglu Core.

1. [Schema workflow, simplified](#schema-workflow)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to Iglu Core](#core-improvements)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

Read on for more information about Release 10 Tiflis, named after [the first provisional stamp of Russia][tiflis].

![tiflis-img][tiflis-img]

<!--more-->

<h2 id="schema-workflow">1. Schema workflow, simplified</h2>

Working with json schemas in Snowplow ecosystem includes following steps; linting, generating DDLs, optionally with jsonpaths, pushing to one or more schema registries and syncing to one or more Amazon S3 buckets, which are all handled by a specific igluctl subcommand, one operation at a time.

Although going step by step may bring a better understanding of what's going on, the time has shown that granular approach to schema workflow was also opening the way for some human mistakes, such as forgetting linting sometimes which could cause serious issues downwards the workflow. Also, having to go through each of the steps manually starts to become cumbersome and error prone, especially if you regularly work with schemas.

With R10 Tiflis, we are introducing a new igluctl subcommand, `static deploy`, to perform whole schema workflow at one step. This new command will work with a config file, provided by user. We aim to simplify the schema workflow and lower the entry barrier to get started with that. Although existing subcommands are still there, we'd recommend starting to use `static deploy` from now on.

Checkout [Igluctl wiki][igluctl] to learn more about configuration file.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

<h3 id="draft-schemas">2.1 Drafting schemas</h3>

R10 Tiflis introduces a new service in Iglu Server, enabling to draft schemas. All endpoints under `/api/schemas/` has a correspondence under `/api/draft/`, meaning that a work-in-progress schema can be added, read and updated as draft. When the work on a schema is finalized, it is ready to be processed under `/api/schemas/` endpoints.

Note that, for any `/api/schemas/` endpoint ending with `version`, it ends with `draftNumber` under `/api/draft`. Draft number of a schema starts with `1` and increase as needed.

Using draft service frees user from thinking about `version` until the schema is ready to be used under `/api/schemas/` endpoints.

<h3 id="validation-methods">2.2 Validation endpoints, revisited</h3>

Iglu server offers two endpoints under `/api/schemas/validate`. One endpoint to check if a schema is self-describing and another endpoint to validate a json instance against its json schema.

However, both endpoints append schema to request's URL since their HTTP method is `GET`. It was possible to hit `Maximum URI Length` limit of `Akka-Http`, our backend server, or any possible reverse proxy or load balancer in front of Iglu Server, if your schema is a long one.

As of R10 Tiflis, both validation endpoints use `POST` method so that schemas won't be in request URL, removing the chance of hitting a limitation from server.

<h2 id="server-bumps">3. Improvements to Iglu Core</h2>



<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [here from Bintray][iglu-server-download] (download will start). Unzip the compressed file and then you can launch server with following interface: `java -jar $JAR_PATH --config $CONFIG_PATH`.

The only breaking change is regarding 2 validation endpoints under `/api/schemas/validate/`. Previously, a `GET` request sent to any endpoint under `/api/schemas/validate/` would be used for validation. From now on, same request should be sent using `POST` method. Also, schemas shouldn't be appended to request URL, instead they should be in body as form data where key is `schema` and value is your schema.

<h3 id="upgrade-igluctl">4.2 igluctl</h3>

The latest igluctl can be downloaded from [here from Bintray][igluctl-download] (download will start).

The new version, igluctl 0.5.0, doesn't deprecate any interface from previous version, 0.4.1.

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the [wiki page][iglu-server-wiki] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].


[igluctl]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.5.0.zip

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r10-tiflis
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server-setup
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.3.1.zip

[tiflis]: https://commons.wikimedia.org/wiki/Stamps_of_Russia,_1857-1917#Tiflis
[tiflis-img]: /assets/img/blog/2018/08/tiflis.jpg
