---
layout: post
title-short: Snowplow 90 Lascaux
title: "Snowplow 90 Lascaux released, moving loading step onto EMR"
tags: [snowplow, shred, relational databases]
author: Anton
category: Releases
---

We are tremendously excited to announce the release of [Snowplow 90 Lascaux][snowplow-release]. This release introduces RDB Loader, a new EMR-run application replacing our trusty StorageLoader, as proposed in our [Splitting EmrEtlRunner RFC][splitting-eer-rfc]. This release also brings various enhancements and alterations in EmrEtlRunner.

Read on for more information on R90 Lascaux, named after [the Upper Paleolithic cave complex in southwestern France][lascaux]:

1. [RDB Loader](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#rdb-loader)
2. [Other improvements](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#other)
3. [Upgrading](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#upgrading)
4. [Roadmap](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#roadmap)
5. [Getting help](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#help)

![lascaux][lascaux-img]

<!--more-->

<h2 id="rdb-loader">1. RDB Loader</h2>

<h3 id="indroducing">1.1 The rationale for replacing StorageLoader</h3>

StorageLoader was a standalone JRuby app, typically running after EmrEtlRunner on the same orchestration server and ingesting shredded Snowplow event data into relational databases, such as AWS Redshift or PostgreSQL. This approach served us well over the years, but has started to show its age. As we're moving towards supporting [new cloud providers][azure-rfc] and [simplifying our existing orchestration tools][splitting-eer-rfc], we want to modularize and simplify our batch pipeline, making StorageLoader part of the existing EMR jobflow, and rewriting it in Scala to maximize opportunities for code reuse.

Loading storage targets like Redshift from within EMR jobflow has many advantages:

* Better for security - the server running EmrEtlRunner no longer needs access to your Redshift cluster
* Simpler to setup - user no longer have to setup StorageLoader: it will be automatically fetched and run for you by EMR in same manner as the existing Spark Shred and Enrich jobs
* Modularity - we're removing features that are either better implemented in Dataflow Runner or SQL Runner, or better performed with specialized tools such as `S3DistCp` or EMR itself

<h3 id="other">1.2 Other improvements</h3>

Although we entirely re-implemented and changed the execution model of StorageLoader, RDB Loader is a strict port: it has all functionality that it predecessor had.

Along with shifting from standalone app to EMR step we also made several important improvements in loading process:

* The enriched and shredded events archiving logic now runs in EMR, using `S3DistCp` and orchestrated by EmrEtlRunner, increasing stability and performance ([issue #1777][issue-1777])
* RDB Loader loads *all* existing run folders from shredded good folder, eliminating possibility of data missing in Redshift due to "blind" archiving ([issue #2962][issue-2962])
* RDB Loader uses an IAM role instead of credentials to access Redshift ([issue #3281][issue-3281])
* We fixed the long-standing eventual consistency problem ([issue #3113][issue-3113])

And finally, to reiterate that the whole codebase has been written in Scala, which allows us to share many components across codebases and add features in more consistent and confident manner ([issue #3023][issue-3023]).

<h3 id="plans">1.3 Limitations and plans for RDB Loader</h3>

With the initial release of RDB Loader we've achieved feature-parity with StorageLoader, however executing the load as an EMR step imposes several new restrictions, which we're currently actively looking  to fix. All of these limitations are addressed by a [dedicated milestone][rdb-improvements-milestone] on Github.

The most important known limitations are:

1. The impossibility of loading Redshift or Postgres via an SSH tunnel or similar non-standard setups
2. The visibility of Base64-encoded Redshift credentials in the EMR console

Finally, we should flag that you will have to check the EMR logs for certain types of RDB Loader failure, such as invalid configuration or fatal OutOfMemory errors. All other success or failure messages should be printed to stdout by EmrEtlRunner.

<h2 id="other">2. Other improvements</h2>

We received some tremendous community feedback on [Snowplow R89 Plain of Jars][r89]; one recurrent theme was the challenges of getting Spark to fully leverage the provided EMR cluster.

As a result, based on this feedback, we're introducing a way to specify arbitrary EMR configuration options through the EmrEtlRunner configuration file:

{% highlight yaml %}
aws:
  emr:
    // ...
    configuration:
      yarn-site:
         yarn.resourcemanager.am.max-attempts: "1"
       spark:
         maximizeResourceAllocation: "true"
       spark-defaults:
         spark.executor.instances: "17"
         spark.yarn.executor.memoryOverhead: "4096"
         spark.executor.memory: "35G"
         spark.yarn.driver.memoryOverhead: "4096"
        // etc
{% endhighlight %}

In addition to giving you these tuning tools for Spark, the Snowplow community is busy sharing guides on how best to optimize Spark on [our Discourse][discourse].
[Rick Bolkey][rbolkey] from [OneSpot][onespot] has already released a guide, [Learnings from using the new Spark EMR Jobs][spark-guide], thanks a lot Rick!

Lastly, the Event Manifest Populator from [R88 Angkor Wat][r88] was also updated in this release. It now supports enriched archives created with pre-R83 versions of Snowplow ([issue #3293][issue-3293]).

<h2 id="upgrading">3. Upgrading</h2>

<h3 id="upgrading-binaries">3.1 Upgrading EmrEtlRunner</h3>

The latest version of EmrEtlRunner is available from our [Bintray][app-dl].

<h3 id="upgrading-config.yml">3.2 Updating config.yml</h3>

In order to use RDB Loader you need to make following addition in your configuration YAML:

{% highlight yaml %}
storage:
  versions:
    rdb_loader: 0.12.0        # NEW
{% endhighlight %}

The following settings no longer make sense, as Postgres loading also happens on EMR node, therefore can be deleted:

{% highlight yaml %}
storage:
  download:                   # REMOVE
    folder:                   # REMOVE
{% endhighlight %}

To gradually configure your EMR application you can add optional `emr.configuration` property:

{% highlight yaml %}
emr:
  configuration:                                  # NEW
    yarn-site:
      yarn.resourcemanager.am.max-attempts: "1"
    spark:
      maximizeResourceAllocation: "true"
{% endhighlight %}

For a complete example, see our [sample `config.yml` template][config-yml]

<h3 id="upgrading-scripts">3.3 Updating EmrEtlRunner scripts</h3>

EmrEtlRunner now accepts a new `--include` option with a single possible `vacuum` argument, which will be passed to RDB Loader.

Also, `--skip` now accepts new `rdb_load`, `archive_enriched` and `analyze` arguments. Skipping `rdb_load` and `archive_enriched` steps is identical to running R89 EmrEtlRunner without StorageLoader.

Finally, note that the StorageLoader is no more part of batch pipeline apps archive.

<h3 id="creating-role">3.4 Creating IAM Role for Redshift</h3>

As RDB Loader is EMR step now, we wanted to make sure that user's AWS credentials are not exposed anywhere. To load Redshift we're using [IAM Roles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), which allow Redshift to load data from S3.

To [create an IAM Role][create-role] you need to go to AWS Console -> IAM -> Roles -> Create new role.

Then you need chose Amazon Redshift -> `AmazonS3ReadOnlyAccess`, choose a role name, for example `RedshiftLoadRole`. Once created, copy the Role ARN as you will need it in the next section.

Now you need to attach new role to running Redshift cluster. Go to AWS Console -> Redshift -> Clusters -> Manage IAM Roles -> Attach just created role.

<h3 id="updating-storage-config">3.5 Whitelisting EMR in Redshift</h3>

Your EMR cluster's master node will need to be whitelisted in Redshift in order to perform the load.

If you are using an "EC2 Classic" environment, from the Redshift UI you will need to create a Cluster Security Group and add the relevant EC2 Security Group, most likely called `ElasticMapReduce-master`. Make sure to enable this Cluster Security Group against your Redshift cluster.

If you are using modern VPC-based environment, you will need to modify the Redshift cluster, and add a VPC security group, most likely called `ElasticMapReduce-Master-Private`.

In both cases, you only need to whitelist access from the EMR master node, because RDB Loader runs exclusively from the master node.

<h3 id="updating-storage-config">3.6 Updating Storage configs</h3>

We have updated the Redshift storage target config - the new version requires the Role ARN that you noted down above:

{% highlight json %}
{
    "schema": "iglu:com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-0-0",       // WAS 1-0-0
    "data": {
        "name": "AWS Redshift enriched events storage",
        ...
        "roleArn": "arn:aws:iam::719197435995:role/RedshiftLoadRole",                               // NEW
        ...
    }
}
{% endhighlight %}

<h2 id="roadmap">4. Roadmap</h2>

Upcoming Snowplow releases include:

* [R9x [STR] Stream refresh][r9x-str], a general upgrade of the apps constituting our Kinesis-based stream processing pipeline
* [R9x [HAD] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark, Unbounce, StatusGator)
* [R9x [HAD] EmrEtlRunner robustness][r9x-eer], continuing our work making EmrEtlRunner more reliable and modular

This release is also an important staging post in our mission of loading Snowplow event data into more databases, and in near-real-time. Watch this space! 

<h2 id="help">5. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[lascaux]: https://en.wikipedia.org/wiki/Lascaux
[lascaux-img]: /assets/img/blog/2017/07/lascaux.jpg

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r90-lascaux

[splitting-eer-rfc]: http://discourse.snowplowanalytics.com/t/splitting-emretlrunner-into-snowplowctl-and-dataflow-runner/350
[azure-rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-microsoft-azure/1178
[create-role]: http://docs.aws.amazon.com/redshift/latest/gsg/rs-gsg-create-an-iam-role.html
[r88]: /blog/2017/04/27/snowplow-r88-angkor-wat-released/
[r89]: /blog/2017/06/12/snowplow-r89-plain-of-jars-released

[rdb-improvements-milestone]: https://github.com/snowplow/snowplow/milestone/143

[issue-1777]: https://github.com/snowplow/snowplow/issues/1777
[issue-2962]: https://github.com/snowplow/snowplow/issues/2962
[issue-3023]: https://github.com/snowplow/snowplow/issues/3023
[issue-3113]: https://github.com/snowplow/snowplow/issues/3113
[issue-3281]: https://github.com/snowplow/snowplow/issues/3281
[issue-3293]: https://github.com/snowplow/snowplow/issues/3293

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r90_lascaux.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/master/3-enrich/emr-etl-runner/config/config.yml.sample

[rbolkey]: https://github.com/rbolkey
[onespot]: https://www.onespot.com
[spark-guide]: http://discourse.snowplowanalytics.com/t/learnings-from-using-the-new-spark-emr-jobs/1260

[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-eer]: https://github.com/snowplow/snowplow/milestone/141
[r9x-str]: https://github.com/snowplow/snowplow/milestone/135

[discourse]: http://discourse.snowplowanalytics.com/

[issues]: https://github.com/snowplow/snowplow/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
