---
layout: post
title-short: Snowplow 90 Lascaux
title: "Snowplow 90 Lascaux released, moving loading step onto EMR"
tags: [snowplow, shred, relational databases]
author: Anton
category: Releases
---

We are tremendously excited to announce the release of [Snowplow 90 Lascaux][snowplow-release].
This release introduces RDB Loader, a new EMR application replacing StorageLoader, according to our [Splitting EmrEtlRunner RFC][splitting-eer-rfc] as well as various enhancements in EmrEtlRunner.

Read on for more information on R90 Lascaux, named after [Upper Paleolithic cave complex in southwestern France][lascaux]:

1. [RDB Loader](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#rdb-loader)
2. [Other changes](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#other)
3. [Upgrading](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#upgrading)
4. [Roadmap](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#roadmap)
5. [Getting help](/blog/2017/07/26/snowplow-r90-lascaux-released-moving-loading-step-onto-emr#help)

![lascaux][lascaux-img]

<!--more-->

Reasons to move the StorageLoader into EMR:

<h2 id="rdb-loader">1. RDB Loader</h2>

<h3 id="indroducing">1.1 Introducing</h3>

StorageLoader was standalone JRuby app, running after EmrEtlRunner on EC2 box and allowing our users to ingest shredded data into relational databases, such as AWS Redshift or PostgreSQL. Approach with standalone application served us quite well since Snowplow batch pipeline inception. However, as we're moving towards supporting [new cloud providers][azure-rfc] and [simplifying existing orchestration tools][splitting-eer-rfc], we decided to modularize our batch pipeline and as a next step in this direction we made StorageLoader part of EMR jobflow, rather than standalone application and in Scala and make it

Loading storage within EMR jobflow has many advantages:

* Better for security - server running EmrEtlRunner doesn't have to have access to your Redshift any more
* Simpler to setup - user no longer have to setup StorageLoader, it will be automatically fetched and run for you by EMR in same manner as Shred and Enrich jobs
* Modularity - we're taking away features that are either too generic and must be implemented in Dataflow Runner and SQL Runner or too narrow-scoped and can be better performed with specialized tools such as `S3DistCp` or EMR itself

<h3 id="other">1.2 Other improvements</h3>

Although we entirely re-implemented and changed execution model of StorageLoader - RDB Loader has all functionality it predecessor had.

Along with shifting from standalone app to EMR step we also made several important improvements in loading process:

* Events archiving logic now extracted into EmrEtlRunner and `S3DistCp`, which increases stability and performance of file moving process [#1777][issue-1777]
* RDB Loader loads all existing run folders from shredded good folder, eliminating possibility of data missing in Redshift due blind archiving [#2962][issue-2962]
* RDB Loader uses IAM role instead of credentials to access Redshift [#3281][issue-3281]
* Fixed eventual consistency problem [#3113][issue-3113]
* Whole codebase now written in Scala, which allows us to share many components across codebases and add features in more consistent and confident manner [#3023][issue-3023]

<h3 id="plans">1.3 Plans for RDB Loader</h3>

With initial release of RDB Loader we've achieved feature-parity with StorageLoader, however executing load as EMR step imposes several new restrictions, which we're currently actively looking forward to fix. All of these limitations are addressed by [dedicated milestone][rdb-improvements-milestone] on Github.

Most important limitations include impossibility to load Redshift via an SSH tunnel or similar non-standard setups and visibility of base64-encoded Redshift credentials in EMR console. Latter is much less important that it may look like at first sight, as AWS console supposed to be available only to staff working with pipeline and Redshift supposed to be placed inside dedicated subnet. However, we at Snowplow are taking even minor security issues extremely serious and keep working on improving it.

Last known limitation is that user will have to check EMR step stdout log to diagnose several types of RDB Loader failure, such as invalid configuration or fatal errors, such as OOM. All other success or failure messages should be printed to stdout by EmrEtlRunner.

<h2 id="other">2. Other changes</h2>

We've also received tremendous feedback on [R89][r89], the most recurrent problem users faced was that Spark did  not get the most out of their EMR cluster with the default configuration.
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

In addition to giving you the tools to tune your Spark cluster to fit your exact needs, we (the whole Snowplow community) will be releasing guides on how best to do just that on [our discourse][discourse].
[Rick Bolkey][rbolkey] from [OneSpot][onespot] already started working on such a guide which you can find [here][spark-guide], thanks a lot to him!

Third application received update in R90 is Event Manifest Populator, released as part of [R88 Angkor Wat][r88]. It now supports enriched archives created with pre-R83 version of Snowplow ([#3293][issue-3293]).

<h2 id="upgrading">3. Upgrading</h2>

<h3 id="upgrading-binaries">3.1 Upgrading EmrEtlRunner</h3>

Latest version of EmrEtlRunner is available from our [Bintray][app-dl].

<h3 id="upgrading-config.yml">3.2 Updating config.yml</h3>

In order to use RDB Loader you need to make following addition in your configuration YAML:

{% highlight yaml %}
storage:
  versions:
    rdb_loader: 0.12.0        # NEW
{% endhighlight %}

Following setting doesn't make sense anymore, as Postgres loading happens on EMR node, therefore can be deleted:

{% highlight yaml %}
storage:
  download:                   # TO REMOVE
    folder:                   # TO REMOVE
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

EmrEtlRunner now accepts new `--include` option with single possible `vacuum` argument, which will be passed to RDB Loader.

Also, `--skip` now accepts new `rdb_load`, `archive_enriched` and `analyze` arguments.
Skipping `rdb_load` and `archive_enriched` steps is identical to running R89 EmrEtlRunner without StorageLoader.

Note, that StorageLoader is no more part of batch pipeline apps archive.

<h3 id="creating-role">3.4 Creating IAM Role for Redshift</h3>

As RDB Loader is EMR step now, we wanted to make sure that user's AWS credentials are not exposed anywhere.
To load Redshift we're using [IAM Roles](http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) that allow Redshift to load data from S3.

To [create IAM Role][create-role] you need to go to AWS Console -> IAM -> Roles -> Create new role.
Then you need chose Amazon Redshift -> `AmazonS3ReadOnlyAccess`, choose a role name, for example `RedshiftLoadRole`. Once created, copy the Role ARN as you will need it in the next section.

Now you need to attach new role to running Redshift cluster.
Go to AWS Console -> Redshift -> Clusters -> Manage IAM Roles -> Attach just created role.

<h3 id="updating-storage-config">3.5 Whitelisting EMR in Redshift</h3>

Your EMR cluster's master node will need to be whitelisted in Redshift in order to perform the load.

If you are using an "EC2 Classic" environment, you will need to navigate to the Redshift UI and create a Cluster Security Group and add an EC2 Security Group, most likely called `ElasticMapReduce-master`. Make sure to enable this Cluster Security Group against your Redshift cluster.

If you are using modern VPC-based environment, then you will need to modify the Redshift cluster, and add a VPC security group, most likely called `ElasticMapReduce-Master-Private`.

<h3 id="updating-storage-config">3.6 Updating Storage configs</h3>

Redshift storage target config requires to attach Role ARN.

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
