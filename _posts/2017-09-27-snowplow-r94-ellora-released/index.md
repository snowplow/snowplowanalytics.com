---
layout: post
title: "Snowplow R94 Ellora Released"
title-short: Snowplow R94 Ellora
tags: [redshift, aws]
author: Keane
category: Releases
permalink: /blog/2017/09/27/snowplow-r94-ellora-released/
---

We are excited to announce the release of [Snowplow R94 Ellora](https://github.com/snowplow/snowplow/releases/r94-ellora).

This release is primarily focussed on updates to atomic.events - namely a switch to ZSTD encoding and a change in the `domain_sessionidx` field. The change in encoding should lead to significant reductions in the disk space used by atomic.events for all of our users who port Snowplow to Redshift.

If you’d like to know more about R93 Ellora, named after an [archaeological site in India](https://en.wikipedia.org/wiki/Ellora_Caves), please continue reading this post:

<!--more-->

1. [Updating atomic.events to use ZSTD Compression](#updating-atomic.events-to-use-zstd-compression)
2. [Update domain_sessionidx column in atomic.events to accept larger values](#update-domain_sessionidx-column-in-atomic.events-to-accept-larger-values)
3. [Bump scala-uri to 0.5.0](#bump-scala-uri-to-0.5.0)
4. [Upgrading](#upgrading)
5. [Get Help](#get-help)

![Ellora](http://cdn.touropia.com/gfx/b/2016/09/Cave_10.jpg "http://cdn.touropia.com/gfx/b/2016/09/Cave_10.jpg")

<h2 id="/blog/2017/09/27/snowplow-r94-ellora-released#updating-atomic.events-to-use-zstd-compression">1. Updating atomic.events to use ZSTD Compression</h2>

Ever since AWS added ZSTD support for Redshift earlier this year, we’ve been very interested in applying it to `atomic.events` for the potential reductions in disk space usage (see issue [#3435](https://github.com/snowplow/snowplow/issues/3435)). Our tests have been highly successful. We’ve found the tradeoff in terms of performance to be negligible across a variety of query types. Most-notably, we’ve found that applying ZSTD to `atomic.events` leads to a ~60% reduction in size on average.

Due to it not being possible to modify the compression of table columns in Redshift, a deep copy is required in order to migrate an already-existing `atomic.events` table to ZSTD (see migration script in [Upgrading](#upgrading)). We recommend that you have at least 50% Redshift storage space remaining prior to upgrading your `atomic.events` table. It may be the case that you have temporarily resize your cluster and/or pause your pipeline in order to make the switch. To help with this we’ve written [a migration script](link) along with the [new table definition](link). 

See the [AWS Documentation](http://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html) for more information on ZSTD Compression.

<h2 id="update-domain_sessionidx-column-in-atomic.events-to-accept-larger-values">2. Update domain_sessionidx column in atomic.events to accept larger values</h2>

Some of our users with frequently visited services have faced issues due to recording values higher than `32767` - enforced by the field being a `smallint`. With the underlying field being a java Integer with a range of -2147483648 to 2147483647, we’ve updated the `domain_sessionidx` to be a Redshift `INTEGER` (see issue [#1788](https://github.com/snowplow/snowplow/issues/1788)).

<h2 id="bump-scala-uri-to-0.5.0">3. Bump scala-uri to 0.5.0</h2>

With a number of our users losing data due to URL’s containing more than one `#` character, we’ve bumped Scala Common Enrich to take advantage of the new URL tolerance (see issue [#2893](https://github.com/snowplow/snowplow/issues/2893)).

<h2 id="upgrading">4. Upgrading</h2>

- The new atomic.events table definition can be found [here](https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/atomic-def.sql)
- [Migration script](https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.8.0_to_0.9.0.sql) to update existing `atomic.events` tables to 0.9.0

<h2 id="get-help">5. Get Help</h2>

For more details on this release, as always please check out the [release notes](https://github.com/snowplow/snowplow/releases/r94-ellora) on GitHub.

If you have any questions or run into any problems, please raise an issue or get in touch with us through the usual channels.
