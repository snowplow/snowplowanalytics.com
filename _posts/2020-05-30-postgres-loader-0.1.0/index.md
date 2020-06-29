---
layout: post
title: Snowplow Postgres Loader 0.1.0 released
title-short: Snowplow Postgres Loader 0.1.0
tags: [postgres, shred, relational databases, storage]
author: Anton
category: Releases
permalink: /blog/2020/05/30/snowplow-postgres-loader-0.1.0/
---

For last several years we were getting requests from OSS community to add PostgreSQL support to Snowplow.
Today we're thrilled to announce the initial release of Snowplow Postgres Loader.

In this post:

1. [Why PostgreSQL](#why)
2. [Snowplow Postgres Loader](#loader)
3. [Next steps](#next)
4. [Setup](#setup)
5. [Getting help](#help)

<h2 id="why">1. Why Postgres</h2>

[PostgreSQL][postgresql] is one of top 5 database engines as of mid 2020.
It is almost standard de-facto among OLTP relational databases with enormous amount of extensions and tools that can turn it into anything from [time-series database][timescale] to a [monstrous multi-node cluster with analytical workloads][citus].
Vanila PostgreSQL though was never meant to be used as OLAP and it still can be hard to tune the perfrormance of analytical queries on multi-GB scans.
However, not everyone is having datasets with hundreds of gigabytes, nor everyone is interested in analytical queries.

In fact, most of requests we've seen were coming from users who would like to try out Snowplow and don't want to pay for Redshift or Snowflake or setup them.
Snowplow is easy to run on-premise, it is supported by almost any known cloud provider and and has incredible ecosystem and community.

These are good reasons to extend the pool of supported databases with such a great candidate!

<h2 id="loader">2. Snowplow Postgres Loader</h2>

[RDB Loader][rdb-loader] (and its predecessor, StorageLoader) had PostgreSQL support since inception, but this support was extremely limited.
Several major examples of this limited functionality:

* It supported only `atomic.events` table, without all shredded types (not to mention recently added support of automigrations)
* It used batch loading, mimicking Redshift and other OLAPs, which is suboptimal for PostgreSQL and for end user meant very infrequent and expensive loading
* It was tightly coupled with AWS
* It required EmrEtlRunner

Although we have big plans for RDB Loader, we decided that PostgreSQL has inherently different requirementts and RDB Loader should be oriented towards batch loading,
whereas PostgreSQL deserves its dedicated, [Snowplow Postgres Loader][repo].

We're [planning][remove-pg] to remove PostgreSQL support from RDB Loader in one of the next releases, while Postgres Loader will be leveraging all the benefits of its only storage target.

With this initial release, Postgres Loader is already capable of:

* Working with "streaming inserts", i.e. reading events directly from a subscription, which then turned into a transaction with bunch of `INSERT` statements for every entity in the event. As a result, Postgres Loader is a single application, responsible for transformation and loading
* Supporting table creation and migrations out of the box so no need to generate and apply DDLs
* Supports both [GCP PubSub][pubsub] and [Amazon Kinesis][kinesis] as sources, other implementations are very easy to add - and [PRs are welcome][repo]!
* Loading both enriched data and plain self-describing JSONs, which can be used as a replacement for ElasticSearch for debugging Snowplow [bad rows][badrows]
* Using rich set of unique PostgreSQL types, such as `UUID` (for strings with `uuid` format) and `JSONB` (for arrays and union types)
* Being used as a library (published on Maven Central as a `snowplow-postgres`) for building complex data pipelines involving Postgres and Snowplow

<h2 id="next">3. Next steps</h2>

Postgres Loader was born as a hackathon project, as a response to a very frequent OSS community request.
Despite a very solid ground such as [FS2][fs2] and [KCL][kcl] it is not meant to be used in pipelines with scalability requirements and we never tested it in real-world scenarios.
However, we do seek for your feedback!
We believe Postgres Loader has a big potential in many areas: demos, QA, low-volume pipelines and eventually mid-high volume pipelines.

Currently, Postgres Loader is missing following features and we would like to implement them in upcoming releases:

* Postgres Loader doesn't try to perform any optimisations on its tables: no indexes, foreign keys, contstraints etc. Given Postgres' rich functionality for altering tables - it is better to let user perform this alterations manuallly
* It is implemented on top of plain JDBC and SQL statementts, whereas [Postgres Wire protocol][postgres-wire] could make it significantly more performant
* Currently all bad rows produced by the Loader (e.g. if type cannot be converted to SQL or DB connection lost) just printed to stdout, whereas it would be better to sink them to filesystem or send back to topic
* PubSub and Kinesis (KCL) sources have very different semantics

Please do share your feedback on Discourse and GitHub!
It will help us to prioritize the work.

<h1 id="setup">4. Setup</h1>

Setup is described on our [docs website][docs].

<h1 id="help">5. Getting help</h1>

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].
If you spotted a bug or have a feature request - please fill an issue on [GitHub][repo].


[repo]: https://github.com/snowplow-incubator/snowplow-postgres-loader

[postgresql]: https://www.postgresql.org/
[db-engines-ranking]: https://db-engines.com/en/ranking
[timescale]: https://www.timescale.com/
[citus]: https://www.citusdata.com/product/community

[rdb-loader]: https://docs.snowplowanalytics.com/docs/open-source-components-and-applications/snowplow-rdb-loader/
[remove-pg]: https://github.com/snowplow/snowplow-rdb-loader/issues/191
[pubsub]: https://cloud.google.com/pubsub
[kinesis]: https://aws.amazon.com/kinesis/

[postgres-wire]: https://segmentfault.com/a/1190000017136059
[badrows]: https://docs.snowplowanalytics.com/docs/managing-data-quality/understanding-failed-events/
[fs2]: https://fs2.io/
[kcl]: https://github.com/awslabs/amazon-kinesis-client

[docs]: https://docs.snowplowanalytics.com/docs/open-source-components-and-applications/snowplow-postgres-loader/

[discourse]: https://discourse.snowplowanalytics.com/
