---
layout: post
title-short: Snowplow 89 Plain of Jars
title: "Snowplow 89 Plain of Jars released"
tags: [snowplow, spark, enrich, shred]
author: Ben
category: Releases
---

We are tremendously excited to announce the release of
[Snowplow 89 Plain of Jars][snowplow-release]. This release centers around the
port of our batch pipeline from [Twitter Scalding][scalding] to
[Apache Spark][spark].

Read on for more information on R89 Plain of Jars, named after [an archeological
site in Laos][plain-of-jars]:

1. [Thanks](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#thanks)
2. [Why Spark?](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#why-spark)
3. [Spark Enrich and Relational Database Shredder](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#jobs)
4. [Under the hood](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#under-the-hood)
5. [Upgrading](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#upgrading)
6. [Request for feedback](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#feedback)
7. [Roadmap](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#roadmap)
8. [Getting help](/blog/2017/05/10/snowplow-r89-plain-of-jars-released#help)

![plain-of-jars][plain-of-jars-img]

<!--more-->

<h2 id="thanks">1. Thanks</h2>

This release has been a real community effort and, as such, we'd like to start
this post off by thanking a few people that were key to this port:

- [Gabor Ratky][rgabo] for his awesome help during QA
- [Phil Kallos][pkallos] for his initial help getting this huge undertaking off
the ground
- [David White][13scoobie] for IDONTKNOWWHATPLSHALP
- every one else who followed along on our journey

This just goes to show how anyone can get involved in a Snowplow release and
have a great impact on the quality of the product.

<h2 id="why-spark">2. Why Spark?</h2>

You might be wondering why we went through the trouble of rewriting our entire
batch pipeline. As stated in our [RFC][rfc], this is motivated by a few factors.

First, we think that Apache Spark is now mainstream enough to benefit from a
resilient ecosystem of tools and integrations (e.g. the great support in AWS EMR
for the latest versions). Furthermore, we feel confident that Apache Spark is
becoming the de facto replacement for Hadoop. As such, we think that a lot of
the innovation in the big data landscape will take place around the Spark
ecosystem. In order to benefit from those future innovations we had to get ready
and this means, in part, porting the batch pipeline to Spark.

Moreover, we believe that there are a lot of performance gains to be had by
switching to Spark. Compared to Hadoop, Spark relies a lot less on disk to
perform computations especially for intermediary results. This should save us
costly (in time) roundtrips to disk across both the enrich and shred jobs.

Finally, this is part of a larger effort across Snowplow to move a few critical
parts to Spark. For example, this is the case for data modeling and our
[Event Manifest Manipulator][emp] or our analytics SDKs in
[Scala][scala-sdk] and [Python][python-sdk].

In short, this is about making sure the batch pipeline is future-proof and
moving to Spark solves this issue.

<h2 id="jobs">3. Spark Enrich and Relational Database Shredder</h2>

Scala Hadoop Enrich and Scala Hadoop Shred are the two main pieces that have
been ported over to Spark.

Spark Enrich effectively replaces Scala Hadoop Enrich. It'll have the same set
of functionalities and effectively act as a drop-in replacement. As such, it'll
load your events, enrich them and write them out just as before.

For its part, Relational Database Shredder is the successor to Scala Hadoop
Shred. Here too, the feature set of Scala Hadoop Shred has been preserved. It'll
shred and deduplicate the events outputted by the enrich job as before.
Note that the shred job has been moved to the storage part of Snowplow instead
of enrich.

<h2 id="under-the-hood">4. Under the hood</h2>

This release also brings a lot of other improvements in a continued effort to
modernize the batch pipeline and make it Spark-ready.

- Scala Common Enrich, Spark Enrich and Relational Database Shredder run on
Scala 2.11 with Java 8 ([#3061, #3070, #3071][scala211-issues])
- Scala Common Enrich, Spark Enrich and Relational Database Shredder uses Java 8
([#2381, #3212, #3213][java8-issues])
- EmrEtlRunner is now able to run Spark jobs ([#641][641])
- StorageLoader is now able to read Spark's output directory structure
([#3044][3044])

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="upgrading-binaries">5.1 Upgrading EmrEtlRunner and StorageLoader</h3>

The latest version of EmrEtlRunner and StorageLoader are available from our
[Bintray][app-dl].

<h3 id="upgrading-config.yml">5.2 Updating config.yml</h3>

In order to leverage Spark Enrich and Relational Database Shredder, we've made
a few modifications to our configuration YAML:

{% highlight yaml %}
aws:
  emr:
    jobflow:
      job_name: Snowplow ETL
enrich:
  versions:
    spark_enrich: 1.9.0
storage:
  versions:
    relational_database_shredder: 0.12.0
    hadoop_elasticsearch: 0.1.0
{% endhighlight %}

Note that the job name is now part of the jobflow, it didn't make sense to still
have it in the enrich version. Also, Relational Database Shredder and Hadoop
Elasticsearch have been moved to storage since they are effectively part of
storage.

For a complete example, see our [sample `config.yml` template][config-yml].

<h2 id="feedback">6. Request for feedback</h2>

Because this is the greatest change in the batch pipeline in recent memory,
we would really appreciate any feedback regarding performance (be it improvement
or degradation) and regressions that might be Spark-related. Please, let us
know on [discourse][discourse].

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases include:

* [R9x [HAD] Storage Loader reboot][r9x-sr-reboot], which will port the storage
loader to Scala
* [R9x [HAD] EmrEtlRunner robustness][r9x-eer], which brings a lot of
improvements to EmrEtlRunner
* [R9x [HAD] 4 webhooks][r9x-webhooks], which will add support for 4 new
webhooks (Mailgun, Olark, Unbounce, StatusGator)

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the
[release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please
[raise an issue][issues] or get in touch with us through
[the usual channels][talk-to-us].

[plain-of-jars]: https://en.wikipedia.org/wiki/Plain_of_Jars
[plain-of-jars-img]: /assets/img/blog/2017/02/chichen-itza-mexico.jpg

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r89-plain-of-jars

[pkallos]: https://github.com/pkallos
[13scoobie]: https://github.com/13scoobie
[rgabo]: https://github.com/rgabo

[rfc]: http://discourse.snowplowanalytics.com/t/migrating-the-snowplow-batch-jobs-from-scalding-to-spark/492
[scalding]: https://github.com/twitter/scalding
[spark]: http://spark.apache.org

[emp]: https://github.com/snowplow/snowplow/tree/master/5-data-modeling/event-manifest-populator
[scala-sdk]: https://github.com/snowplow/snowplow-scala-analytics-sdk
[python-sdk]: https://github.com/snowplow/snowplow-python-analytics-sdk

[scala211-issues]: https://github.com/snowplow/snowplow/issues?utf8=✓&q=is%3aissue%20is%3aopen%203061%20|%203070%20|%203071
[java8-issues]: https://github.com/snowplow/snowplow/issues?utf8=✓&q=is%3aissue%20is%3aopen%202381%20|%203212%20|%203213
[641]: https://github.com/snowplow/snowplow/issues/641
[3044]: https://github.com/snowplow/snowplow/issues/3044

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r89_plain_of_jars.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/master/3-enrich/emr-etl-runner/config/config.yml.sample

[discourse]: http://discourse.snowplowanalytics.com/

[r9x-sr-reboot]: https://github.com/snowplow/snowplow/milestone/121
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-eer]: https://github.com/snowplow/snowplow/milestone/141

[issues]: https://github.com/snowplow/snowplow/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
