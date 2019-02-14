---
layout: post
title-short: Snowplow R112 batch pipeline reliability improvements
title: "Snowplow R112 Baalbek batch pipeline reliability improvements"
tags: [snowplow, batch]
author: Ben
category: Releases
permalink: /blog/2019/02/06/snowplow-r112-baalbek-batch-pipeline-reliability-improvements/
---

[Snowplow 112 Baalbek][snowplow-release], named after
[the city in Eastern Lebanon][baalbek], is a release focusing on reliability improvements for the
batch pipeline.

Please read on after the fold for:

1. [EmrEtlRunner improvements](#eer)
2. [Clojure Collector improvement](#cc)
3. [Redshift (and Postgres) data model improvement](#redshift)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![baalbek][baalbek-img]
<br>
BlingBling10 at the English Wikipedia [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/)

<!--more-->

<h2 id="eer">1. EmrEtlRunner improvements</h2>

This release is focused on improving EmrEtlRunner by adding new features and to make it
more robust with respect to AWS services at the same time.

<h3 id="persistent">1.1 Support for persistent EMR clusters</h3>

EmrEtlRunner is now able to run steps on a long-running cluster saving up and down time through a
`--use-persistent-jobflow` argument. Additionally it’s possible to specify the time-to-live of this
long-running cluster before spinning up a new one through `--persistent-jobflow-duration`.

This feature, together with EmrEtlRunner's stream enrich mode, enables drip-feeding into Redshift,
to, for example, load your enriched data into Redshift every ten minutes or less.

<h3 id="timeouts">1.2 Recovery from EMR timeouts and S3 internal errors</h3>

In recent months, we’ve observed an increase in reliability issues with Amazon EMR with more and
more timeouts. With this release we’re aiming to tackle this issue by retrying in case of timeouts
using an exponential backoff. We’re adopting the same strategy regarding S3 internal errors.

<h3 id="compaction">1.3 Compaction steps for the different jobs' output</h3>

Some users have been hitting S3 rate limits because of too many small files being written at the
same time. This is the result of making heavy use of contexts while having large volume of data. For
example, a user using 50 different contexts with a shred job running concurrently on 20 Spark
executors will result in 1000, often very small, files being written concurrently. This is just for
the Snowplow pipeline and excludes any kind of processing that could happen on your end.

To solve this issue, this release will consolidate those small files into bigger ones during their
transfer from HDFS to S3.  This will result in less writes and should mean fewer contention issues.

<h3 id="rename">1.4 Renaming of the EMR steps</h3>

We've taken advantage of this release to also rename the EMR steps and remove some of the clutter
accumulated over the years.

<h2 id="cc">2. Clojure Collector improvement</h2>

We’ve increased the number of files that can be opened concurrently on the Elastic Beanstalk
machines running the Clojure Collector from 1024 to 65536. This ensures that the collector is never
throttled on the number of open file handles it can accept.

<h2 id="redshift">3. Redshift (and Postgres) data model improvement</h2>

The `geo_region` column has been bumped to 3 characters in order to accomodate for a change in the
underlying library the IP lookups enrichment used to fill this column.

Thanks to [Mike][miike] from [Snowflake Analytics][sa] for this open source contribution.

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upg-eer">4.1 Upgrading EmrEtlRunner</h3>

The latest version of the *EmrEtlRunner* is available from our Bintray
[here](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r112_baalbek.zip).

A setting is needed to enable or disable compaction of the output of the shred job discussed above.

{% highlight yaml %}
aws:
  s3:
    consolidate_shredded_output: false
{% endhighlight %}

For a complete example, see our sample [`config.yml`](https://github.com/snowplow/snowplow/blob/r112-baalbek/3-enrich/emr-etl-runner/config/config.yml.sample) template.

<h3 id="upg-cc">4.2 Upgrading the Clojure Collector</h3>

The new Clojure Collector is available in S3 at:

{% highlight yaml %}
s3://snowplow-hosted-assets/2-collectors/clojure-collector/clojure-collector-2.1.3-standalone.war
{% endhighlight %}

<h3 id="upg-model">4.3 Upgrading the events table definition</h3>

We've put together migration scripts which are available on GitHub:

- for Redshift: [migrate_0.10.0_to_0.11.0.sql](https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.10.0_to_0.11.0.sql)
- for Postgres: [migrate_0.7.0_to_0.7.1.sql](https://github.com/snowplow/snowplow/blob/master/4-storage/postgres-storage/sql/migrate_0.7.0_to_0.7.1.0.sql)

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases include:

* [R113 [RT] Real-time maintenance][r113-rt], a release focusing on the real-time pipeline with
plenty of community contributions

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r112-baalbek

[baalbek]: https://en.wikipedia.org/wiki/baalbek
[baalbek-img]: /assets/img/blog/2019/02/baalbek.jpg

[miike]: https://github.com/miike
[sa]: https://www.snowflake-analytics.com/

[r113-rt]: https://github.com/snowplow/snowplow/milestone/165

[discourse]: http://discourse.snowplowanalytics.com/
