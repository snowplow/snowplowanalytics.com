---
layout: post
title: Iglu Server 0.6.0 released
title-short: Iglu Server
tags: [iglu, json, jsonschema, iglu server]
author: Anton
category: Releases
permalink: /blog/2019/10/11/iglu-server-0.6.0-released/
---

We're tremendously excited to announce the new 0.6.0 release of the [Iglu Server][iglu-server], a next-generation of Iglu Registry, providing consistency and migration guarantees to Iglu schemas.

In the rest of this post we will cover:

1. [Performance and stability improvements](#performance)
2. [API changes](#api-changes)
3. [Upgrading](#upgrading)
4. [Roadmap and Upcoming Features](#roadmap)
5. [Getting Help](#help)

<!--more-->

<h3 id="performance">1. Performance and stability improvements</h3>

During development cycle of 0.6.0 we rewrote most of Iglu Server components from scratch, replacing old monolithic [Akka HTTP][akka-http] dependency with modern tools provided by Scala community, such as [http4s][http4s], [Rho][rho] and [fs2][fs2].
As a result, we have gained much more efficient performance and resource utilization.
Our benchmarks show that `t2.small` EC2 instance running a new version of Iglu Server can easily handle 1.000 concurrent requests per seconds without dropping them.
On the same instance, version 0.5.0 of Iglu Server starts to choke at 500 requests per second, either by dropping requests or responding within an inappropriately long time. As a consequence, the Snowplow pipeline slows down and sends some events into a bad bucket.

Another big change on the performance front is configurable thread and connection pools.
While previous versions hardcoded default settings everywhere, the new Server gives a lot of configuration options to tune the performance.

* Use single DB connection or [HikariCP][hikaricp] (recommended)
* `connectionTimeout`, `maxLifetime`, `maximumPoolSize` settings from HikariCP
* Configurable thread pool for DB transactions
* Configurable thread pool for DB connections
* Configurable thread pool for HTTP server

All thread pools can have one of the following formats: `global` for global Scala [ForkJoinPool][fork-join-pool], `cached` for [cached JVM thread pool][cached-thread-pool] or `fixed N` for connection pool with fixed N amount of threads.

Iglu Server provides sensible defaults for all these options, but it's now possible to tune the performance for specific usage scenarios.

<h3 id="api-changes">2. API changes</h3>

We had two main aims for API changes in this release:

1. Preserving the core API for fetching schemas unchanged
2. Reducing the chance of accidental mistakes by making API stricter
3. Adding more flexibility

There's not much to add for the first item - all our tools, including old versions of the Snowplow pipeline, Snowplow Mini, igluctl (with very minor inconsistencies) and Iglu Clients are working with the new version of Iglu Server just fine.
If you're interested only in stability and performance improvements - you can proceed to [upgrade section](#upgrading).

Previous versions of Iglu Server were extremelly permissive about inconsistent state, providing just basic CRUD operations without semantic checks.
This could lead to various hard to debug incidents with mutated schemas and inconsistent warehouse state.
In this release we tried to narrow down the most common user mistakes and provide defensive checks for them in Iglu Server:

* Users cannot create a schema if the previous one does not exist, e.g. if there's only `1-0-0` schema available and user tries to submit `1-0-2` it will result in 409 CONFLICT HTTP response
* Users cannot create a schema using HTTP PUT method if its URI and metadata do not correspond
* Users cannot create a private schema if previous ones were public and vice versa (otherwise there will be gaps between versions for public requests)
* Users cannot override a schema unless special `patchesAllowed` flag is set to true, marking the registry as dev-only

The next major step is to reject JSON Schemas where changes are incompatible with previous versions, e.g. if a user tries to add `1-0-1` which is clearly a `2-0-0` compared to its previous version.

We didn't just make API stricter, we also added new features!

* Health-check endpoints: `/api/meta/health` for HTTP health and `/api/meta/health/db` (recommended) for HTTP+DB health
* Meta-information endpoint at `/api/meta/server`, providing server version and some safe to expose configuration options
* Debugging mode, enabled by setting `debug` flag to `true` and switching `database.type` to `dummy` (transient in-memory implementation). Extremely useful for debugging and testing purposes
* Webhooks. You can add a list of HTTP endpoints to a configuration to force a Server to push notifications about created schemas
* Ordering endpoints at `/api/schemas/vendor/name/format/model` enabling our [Redshift automigrations][automigrations-rfc], planned for the next release of RDB Loader
* `DELETE` endpoints for dev-only registries (enabled by `patchesAllowed = true`)

<h3 id="upgrading">3. Upgrading</h3>

Unfortunately, due to a big internal refactoring and an attempt to make codebase more type-safe we had to completely overhaul the table structure Iglu Server uses, so it cannot use your old tables anymore.
Good news is that we provide tooling for automatic migration and consistency checks.

In order to perform the migration you'll need to have a new config file.
The new config file is mostly compatible with old one, but requires `database.type` and `debug`

```
database {
  type = "postgres" # or "dummy" for debugging
}

debug = false
```

All other options are optional, a full list can be found in our [setup guide][setup-guide].

In order to migrate tables you need to run a special `setup` subcommand:

{% highlight bash %}
$ ./iglu-server_0.6.0.jar setup --config $IGLU_CONFIG_PATH
{% endhighlight %}

This should migrate all your schemas and API keys or let you know about consistency issues that have to be fixed.

The Iglu Server 0.6.0 is also available on our Docker registry:

{% highlight bash %}
$ docker pull snowplow-docker-registry.bintray.io/snowplow/iglu-server:0.6.0
{% endhighlight %}

<h3 id="roadmap">5. Roadmap and Upcomming Features</h3>

The 0.6.0 release is planned to be a last one in the 0.x series. Unless critical bugs will be reported, the next version should be 1.0.0.

In 1.0.0 we plan to add:

* DynamoDB backend to make Iglu Deployment cheaper [(#23)][issue-23]
* Schema version recognition [(#30)][issue-30]

<h3 id="help">6. Getting Help</h3>

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[iglu-server]: https://github.com/snowplow-incubator/iglu-server

[akka-http]: https://doc.akka.io/docs/akka-http/current/index.html
[http4s]: https://github.com/http4s/http4s
[rho]: https://github.com/http4s/rho
[fs2]: https://fs2.io/
[hikaricp]: https://github.com/brettwooldridge/HikariCP
[fork-join-pool]: https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/ForkJoinPool.html
[cached-thread-pool]: https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/Executors.html#newCachedThreadPool--

[automigrations-rfc]: https://discourse.snowplowanalytics.com/t/redshift-automatic-table-migrations-rfc/2555

[setup-guide]: https://github.com/snowplow/iglu/wiki/Setting-up-an-Iglu-Server

[issue-23]: https://github.com/snowplow-incubator/iglu-server/issues/23
[issue-30]: https://github.com/snowplow-incubator/iglu-server/issues/30

[issues]: https://github.com/snowplow-incubator/iglu-server/issues
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
