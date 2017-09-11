---
layout: post
title-short: Snowplow 89 Plain of Jars
title: "Snowplow 89 Plain of Jars released, porting Snowplow to Spark"
tags: [snowplow, spark, enrich, shred]
author: Ben
category: Releases
image: /assets/img/blog/2017/06/plain-of-jars.jpg
permalink: /blog/2017/06/12/snowplow-r89-plain-of-jars-released-porting-snowplow-to-spark/
---

We are tremendously excited to announce the release of [Snowplow 89 Plain of Jars][snowplow-release]. This release centers around the port of our batch pipeline from [Twitter Scalding][scalding] to [Apache Spark][spark], a direct implementation of our most popular RFC, [Migrating the Snowplow batch jobs from Scalding to Spark][rfc].

Read on for more information on R89 Plain of Jars, named after [an archeological site in Laos][plain-of-jars]:

1. [Thanks](#thanks)
2. [Why Spark?](#why-spark)
3. [Spark Enrich and RDB Shredder](#jobs)
4. [Under the hood](#under-the-hood)
5. [Upgrading](#upgrading)
6. [Request for feedback](#feedback)
7. [Roadmap](#roadmap)
8. [Getting help](#help)

![plain-of-jars][plain-of-jars-img]

<!--more-->

<h2 id="thanks">1. Thanks</h2>

This release has been a real community effort and so we'd like to start off by thanking some people that were key to this port:

* [Phil Kallos][pkallos], formerly of Popsugar, for breaking ground on this port and his support throughout the coding process
* [David White][13scoobie] of Nordstrom for his guidance and encouragement
* [Gabor Ratky][rgabo] of Secret Sauce Partners for his great help during QA
* Everyone else who followed along on our journey

This has been one of the most inclusive and collaborative Snowplow releases in our history - an exciting outcome of our [burgeoning RFC process][rfcs], and one on which bodes well for the future as we roadmap exciting new features and major refactorings. Thank you all!

<h2 id="why-spark">2. Why Spark?</h2>

We take a conservative approach to technology adoption at Snowplow - your event data pipeline is far too important for us to take chances with speculative technologies or techniques. But technology does not stand still, and we must always be proactively extending and re-architecting Snowplow to ensure that it stays relevant over the next decade.

You may be wondering why we went to the trouble of rewriting the core components of our batch pipeline into Spark, and why now. The definitive explanation for this port can be found in our [RFC][rfc] - but in a nutshell, we wanted to address some particular pain points with Hadoop:

* Hadoop being excessively disk-bound, especially for intermediary results, had been very costly in terms of roundtrips to disk across both the Enrich and Shred jobs
* The impossibility of us reusing code between our batch and real-time pipelines. In particular, we want to reuse our database loading apps across our batch and real-time pipelines, not least so that our users can drip-feed Redshift in near-real-time
* The slow pace of innovation in Hadoop - although our Hadoop platform and frameworks are stable, the rapid innovation in our space has moved on to the Spark (and Flink) ecosystems

Although the core of the Snowplow batch pipeline had stayed in Scalding since early 2013, we had had multiple positive experiences working with Apache Spark on ancillary Snowplow projects, and were confident that Spark could address these pain points.

The RFC proposed moving to Spark in three phases:

1. Phase 1: porting our batch enrichment process to Spark
2. Phase 2: porting our Redshift load process to Spark/Spark Streaming
3. Phase 3: porting our remaining apps  

Snowplow 89 Plain of Jars represents the entirety of Phase 1, and the core deliverable of Phase 2 - namely porting our Hadoop Shred job to run on Spark.

<h2 id="jobs">3. Spark Enrich and Relational Database Shredder</h2>

This release ports the two core components of the Snowplow batch pipeline from Scalding to Spark:

1. Scala Hadoop Enrich, being renamed Spark Enrich
2. Scala Hadoop Shred, being renamed RDB (for Relational Database) Shredder

Spark Enrich effectively replaces Scala Hadoop Enrich. It is a "lift and shift" port, having the exact same set of functionalities and acting as a drop-in replacement.

For its part, RDB Shredder is the successor to Scala Hadoop Shred. Again, the featureset of Scala Hadoop Shred, including DynamoDB-based de-duplication, has been preserved; minor Spark-related changes have been made to the folder structure of the job's shredded output.

Also note that as part of this release the RDB Shredder has been moved to the correct `4-storage` folder within Snowplow, from the `3-enrich` folder that Scala Hadoop Shred was erroneously stored in.

<h2 id="under-the-hood">4. Under the hood</h2>

This release also includes a set of other updates, preparing the ground for the Spark port and contributing to our ongoing modernization of the Snowplow batch pipeline:

* Scala Common Enrich, Spark Enrich and RDB Shredder now run on Scala 2.11 ([#3061, #3070, #3071][scala211-issues])
* Scala Common Enrich, Spark Enrich and Relational Database Shredder now use Java 8 ([#2381, #3212, #3213][java8-issues])
* EmrEtlRunner is now able to run Spark jobs ([#641][641])
* StorageLoader has been updated to read Spark's output directory structure ([#3044][3044])

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="upgrading-binaries">5.1 Upgrading EmrEtlRunner and StorageLoader</h3>

As always, the latest versions of EmrEtlRunner and StorageLoader are now available from our [Bintray][app-dl].

<h3 id="upgrading-config.yml">5.2 Updating config.yml</h3>

In order to leverage Spark Enrich and RDB Shredder, we've made some changes to our configuration YAML:

{% highlight yaml %}
aws:
  emr:
    ami_version: 5.5.0                # WAS 4.5.0
    ...
    jobflow:
      job_name: Snowplow ETL          # MOVED
      master_instance_type: m1.medium # AS BEFORE
      ...
enrich:
  versions:
    spark_enrich: 1.9.0               # RENAMED
    ...
storage:
  versions:
    rdb_shredder: 0.12.0              # MOVED AND RENAMED
    hadoop_elasticsearch: 0.1.0       # MOVED
{% endhighlight %}

Don't forget to update the `ami_version` to 5.5.0 - the new Spark jobs will **not** run successfully on 4.5.0

Note that the `job_name` is now part of the `emr:jobflow` section, reflecting that the EMR job covers the enrichment *and* storage phases of the batch pipeline; for clarity the RDB Shredder and Hadoop Elasticsearch job versions have accordingly been moved to the `storage` section.

For a complete example, see our [sample `config.yml` template][config-yml].

<h3 id="performance-tuning">5.3 Performance profiling and tuning</h3>

The performance characteristics of Apache Spark are quite different from those of Apache Hadoop, and we strongly recommend that you make time for some thorough performance profiling and tuning as part of this upgrade.

Our experience to date, comparing Spark-based R89 to its Hadoop-based antecedents, is that R89 is more demanding in memory-terms, but much faster if those memory requirements are met.

<h2 id="feedback">6. Request for feedback</h2>

Given that this is a hugely significant change to the Snowplow batch pipeline, we would appreciate any feedback regarding the performance of this release, be it improvement or degradation; we also want to hear as soon as possible about any regressions that might be Spark-related.

For any concrete bugs or feature requests, please [open a ticket][issues] on our GitHub. For anything more discursive or subjective, please start a thread in our [forums][discourse].

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases include:

* [R9x [HAD] StorageLoader reboot][r9x-sr-reboot], which will port our JRuby-based StorageLoader app to Scala, renaming it in the process to the RDB Loader
* [R9x [STR] Stream refresh][r9x-str], a general upgrade of the apps constituting our Kinesis-based stream processing pipeline
* [R9x [HAD] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark, Unbounce, StatusGator)
* [R9x [HAD] EmrEtlRunner robustness][r9x-eer], continuing our work making EmrEtlRunner more reliable and modular

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[plain-of-jars]: https://en.wikipedia.org/wiki/Plain_of_Jars
[plain-of-jars-img]: /assets/img/blog/2017/06/plain-of-jars.jpg

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r89-plain-of-jars

[pkallos]: https://github.com/pkallos
[13scoobie]: https://github.com/13scoobie
[rgabo]: https://github.com/rgabo

[rfcs]: http://discourse.snowplowanalytics.com/c/roadmap/rfcs
[rfc]: http://discourse.snowplowanalytics.com/t/migrating-the-snowplow-batch-jobs-from-scalding-to-spark/492
[scalding]: https://github.com/twitter/scalding
[spark]: http://spark.apache.org

[scala211-issues]: https://github.com/snowplow/snowplow/issues?utf8=✓&q=is%3aissue%20is%3aclosed%203061%20|%203070%20|%203071
[java8-issues]: https://github.com/snowplow/snowplow/issues?utf8=✓&q=is%3aissue%20is%3aclosed%202381%20|%203212%20|%203213
[641]: https://github.com/snowplow/snowplow/issues/641
[3044]: https://github.com/snowplow/snowplow/issues/3044

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r89_plain_of_jars.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/master/3-enrich/emr-etl-runner/config/config.yml.sample

[discourse]: http://discourse.snowplowanalytics.com/

[r9x-sr-reboot]: https://github.com/snowplow/snowplow/milestone/121
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-eer]: https://github.com/snowplow/snowplow/milestone/141
[r9x-str]: https://github.com/snowplow/snowplow/milestone/135

[issues]: https://github.com/snowplow/snowplow/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
