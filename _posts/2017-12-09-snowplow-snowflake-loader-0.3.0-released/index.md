---
layout: post
title-short: Snowplow Snowflake Loader 0.3.0
title: "Snowplow Snowflake Loader 0.3.0 released"
tags: [snowflake, storage, relational databases]
author: Anton
category: Releases
permalink: /blog/2017/12/09/snowplow-snowflake-loader-0.3.0-released/
---

We are tremendously excited to announce first public release of the [Snowplow Snowflake Loader][snowflake-loader-repo].

[Snowflake][snowflake-computing] is a fast-growing cloud data warehouse solution, which lets you store and access your data with broad variety of tools and application in a very efficient and scalable way.

If you’d like to know more about Snowflake Loader and how to use it, please continue reading this post:

<!--more-->

1. [Snowplow Loaders Bloom](#loaders-bloom)
2. [Introducing Snowflake Loader](#introducing)
3. [Installing Snowflake Loader](#install)
4. [Roadmap](#roadmap)
5. [Getting Help](#help)


<h2 id="loaders-bloom">1. Snowplow Loaders Bloom</h2>

Historically, we at Snowplow tried to make our platform as much as possible decoupled from particular storage solutions.
This approach allowed our users to pick the most convenient storage target and quickly and seamlessly ingest data there,
whether it be Amazon Redshift, Amazon S3, ElasticSearch, PostgreSQL or many other.

However, last few years Amazon Redshift became a standard de-facto solution, being backed by apps from [core snowplow repository][snowplow-repo].
While, Redshift is time-tested platform, having its own advantages, as stated above - we always wanted to provide our users an opportunity to choose a best-fitting solution, according to their requirements.
As part of this effort recently we [refactored][rdb-loader-12] and [moved out][rdb-loader-13] RDB Loader - a couple of applications responsible for preparing and ingesting enriched data into Amazon Redshift.
This move laid the foundation for many Snowplow loaders blooming, independently one from another.
And today, we're proud to announce a newest one - Snowflake Loader.

<h2 id="snowflake-intro">2. Introducing Snowflake Loader</h2>

Snowflake is relatively new data warehousing technology, quickly gaining its popularity due to its operational simplicity, rich support of semi-structured data and efficient pricing model.
Right now Snowflake is coupled with AWS due the fact that it stores data on S3, and S3 is the most popular staging option, but in general nothing prevents them to implement support of Azure Blob Storage or Google Cloud Storage and indeed we have evidences that Snowflake engineering team is working on other blob storages.

Comparing to Amazon Redshift, Snowflake is truly a managed service - you don't need to setup indexes or calculating capacity, in general you just choose a size of ["virtual warehouse"][snowflake-warehouse] - entity responsible for loading and querying your data, so you pay only for time your warehouse is in resumed state.
Another strong side of Snowflake is its support of semi-structured data such as JSON, AVRO or XML. All these formats are first-class citizens in Snowflake thanks to its ["VARIANT" datatype][snowflake-variant], which is heavily used for contexts and self-describing events in enriched data.

Snowplow Snowflake Loader, very much like RDB Loader consists of two parts, both residing at the same repository: 

* Snowflake Transformer - a Spark job that prepares enriched TSV data 
* Snowflake Loader, which first discovers data prepared by Transformer, then constructs and executes SQL statement to load it.

Howver, this is where similarities ended. 
Snowflake Loader takes very different approaches around maintaining a state of loaded data and structuring data inside a database.
Instead of slow and error-prone file-moving approach taken by RDB Loader, Snowflake Loader uses a run manifest on top of [AWS DynamoDB][dynamodb] which closely resembling one we introduced in [Snowplow Scala Analytics SDK 0.2.0][analytics-sdk-post].
Each time Transformer job launched - it lists enriched archive and checks what folders were added by Spark Enrich job recently and haven't been transformed into Snowflake-compatible format, if new folder found - add it to manifest, when folder has been processed - change its state to "processed" and write down all new shredded types found inside it for later table alteration.

The fact that transformer keeps shredded types in outside manifest also hugely alleviates manual labor required for keeping a DB structure up-to-date - no need to create or alter any tables, you just send data with new schemas and they will become available inside Snowflake DB.
This approach also dictates table structure inside Snowflake, particularly right now we have only one table - `atomic.events`, but unlike Redshift and PostgreSQL it contains whole enriched event structure, including all contexts and optionally unstructured event. This structure closely resembles one from [Snowplow Analytics SDKs][snowplow-sdk] (not by coincedence - SDK is in the core of Transformer!)
With contexts and unstructured events being `VARIANT` data type you can query them with Snowflake SQL dialect like they're native types.
You can find out more on how data is structured inside Snowflake in the [dedicated Discourse post][snowflake-data-structure].

<h2 id="install">3. Installing Snowflake Loader</h2>

As stated above - it's very easy to operate Snowflake DB, but also Snowflake Loader doesn't add any complexity and is very easy to setup.

The main pre-requisite is [an existing Snowflake account][snowflake-signup].
After you've got an access to Snowflake console - only few steps and configuration files are required to get Snowplow enriched data in there.

Currently, Snowflake part of pipeline can be running in parallel, along with main Redshift pipeline or instead of it.
But both loaders work with enriched data, produced by Snowplow Spark (or Hadoop) Enrich job.

Enrich job and RDB Shredder/Loader can be running via vanila EmrEtlRunner, but recommended way to run Snowflake Transformer and Loader is using [Dataflow Runner][dataflow-runner], which is going to be a default orchestration tool for Snowplow pipeline as per [our RFC][dataflow-runner-rfc].

Inside Snowplow, we're running multiple pipelines loading both Redshift and Snowflake - two pipelines with different (even overlapping) schedules can co-exist without problems: whenever "main" pipeline lefts enriched folder in archive - next Snowflake run will load it, otherwise it just won't do anything.

First, you need to create following config files:

* Dataflow Runner cluster config
* Snowplow Snowflake Loader config
* Dataflow Runner playbook

Here's example Dataflow Runner cluster configuration:

{% highlight "json" %}
{
   "schema":"iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
   "data":{
      "name": "Snowflake Pipeline",
      "logUri": "s3://snowplow-snowflake-loader/logs/",
      "region": "us-east-1",
      "credentials":{
         "accessKeyId": "env",
         "secretAccessKey": "env"
      },
      "roles":{
         "jobflow":"EMR_EC2_DefaultRole",
         "service":"EMR_DefaultRole"
      },
      "ec2":{
         "amiVersion": "5.9.0",
         "keyName": null,
         "location":{
            "vpc":{
               "subnetId":null
            }
         },
         "instances":{
            "master":{
               "type":"m2.xlarge"
            },
            "core":{
               "type":"m2.xlarge",
               "count":1
            },
            "task":{
               "type":"m1.medium",
               "count":0,
               "bid":"0.015"
            }
         }
      },
      "tags":[ ],
      "bootstrapActionConfigs":[ ],
      "configurations":[
         {
            "classification":"core-site",
            "properties":{
               "Io.file.buffer.size":"65536"
            }
         },
         {
            "classification":"mapred-site",
            "properties":{
               "Mapreduce.user.classpath.first":"true"
            }
         },
         {
            "classification":"yarn-site",
            "properties":{
               "yarn.resourcemanager.am.max-attempts":"1"
            }
         },
         {
            "classification":"spark",
            "properties":{
               "maximizeResourceAllocation":"true"
            }
         }
      ],
      "applications":[ "Hadoop", "Spark" ]
   }
}
{% endhighlight %}

The only change you really want to make is `logUri` property - this should be your own S3 path for EMR logs.
You also might want to change `keyName` and `instances` - though note that in general Snowflake Transformer requires significantly smaller cluster comparing to RDB Shredder due the fact that whole dataset doesn't need to be scattered around on filesystem.

Here's example Snowflake configuration:

{% highlight "json" %}

{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-0",
  "data": {
    "name": "Acme Snowflake Storage Target",
    "accessKeyId": "AKIAXXXXXXXXX",
    "secretAccessKey": "secret",
    "awsRegion": "us-east-1"
    "manifest": "acme-snowflake-run-manifest",
    "snowflakeRegion": "us-east-1",
    "database": "snowflake-database",
    "input": "s3://com-acme-snowplow/archive/enriched/",
    "stage": "arbitraryStageName",
    "stageUrl": "s3://com-acme-snowplow/archive/snowflake/",
    "warehouse": "snowplow_wh",
    "schema": "atomic",
    "account": "acme",
    "username": "snowflake-loader",
    "password": "secret",
    "purpose": "ENRICHED_EVENTS"
  }
}
{% endhighlight %}

Unlike with cluster configuration - you probably want to change all fields here (apart `purpose` and `schema`).
Full description of particular fields as well as setup process is available at [Snowflake Loader documentation][setup-guide]. **TODO this should migrate to snowplow/wiki straight after release**

Another configuration file you'll need is a common [Iglu Resolver config][iglu-config], so far it is used only to validate configuration itself, so feel free to use one with only Iglu Central in it.

And last file you'll need is Dataflow Runner playbook responsible for running Transformer and Loader. Here's an example:

{% highlight "json" %}
{
   "schema":"iglu:com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1",
   "data":{
      "region":"us-east-1",
      "credentials":{
         "accessKeyId":"env",
         "secretAccessKey":"env"
      },
      "steps":[
         {
            "type":"CUSTOM_JAR",
            "name":"Snowflake Transformer",
            "actionOnFailure":"CANCEL_AND_WAIT",
            "jar":"command-runner.jar",
            "arguments":[
               "spark-submit",
               "--deploy-mode",
               "cluster",
               "--class",
               "com.snowplowanalytics.snowflake.transformer.Main",

               "s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-transformer-0.3.0.jar",

               "--config",
               "{{.config}}",
               "--resolver",
               "{{.resolver}}"
            ]
         },

         {
            "type":"CUSTOM_JAR",
            "name":"Snowflake Loader",
            "actionOnFailure":"CANCEL_AND_WAIT",
            "jar":"command-runner.jar",
            "arguments":[
               "s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-loader-0.3.0.jar",
               "com.snowplowanalytics.snowflake.loader.Main",


               "load",
               "--base64",
               "--config",
               "{{.config}}",
               "--resolver",
               "{{.resolver}}"
            ]
         }
      ],
      "tags":[ ]
   }
}
{% endhighlight %}

You also can leave all configuration as is or maybe you'll want to run loader from local machine - it's up to you.

<h2 id="roadmap">4. Roadmap</h2>

Right now Snowplow Snowflake Loader has version 0.3.0 which means it was battle-tested inside Snowplow for some time and we're making it public not in its infancy, but still we have a lot of space for improvement.
Upcoming Snowplow Snowflake Loader releases will include:

* [AVRO support][issue-avro], which should significantly reduce transformer's output and speed-up whole pipeline
* [Cross-batch deduplication][issue-deduplication] similar to one we have in RDB Shredder
* [More robust manifest][issue-manifest]. Right Snowflake Shredder and Loader use separate DynamoDB manifest, which is extremely useful and proven to be reliable, but still can be improved

<h2 id="help">7. Getting Help</h2>

For more details on this release, as always do check out the [release notes][release]
on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowflake-computing]: https://www.snowflake.net/
[snowflake-loader-repo]: https://github.com/snowplow-incubator/snowplow-snowflake-loader
[snowplow-repo]: https://github.com/snowplow/snowplow

[rdb-loader-split]: https://snowplowanalytics.com/blog/2017/09/06/rdb-loader-0.13.0-released/
[analytics-sdk-post]: https://snowplowanalytics.com/blog/2017/05/24/snowplow-scala-analytics-sdk-0.2.0-released/

[snowflake-warehouse]: https://docs.snowflake.net/manuals/user-guide/warehouses-overview.html
[snowflake-variant]: https://docs.snowflake.net/manuals/sql-reference/data-types-semistructured.html

[dynamodb]: https://aws.amazon.com/dynamodb/
[snowflake-signup]: https://www.snowflake.net/free-trial/

[issue-avro]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/issues/35
[issue-deduplication]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/issues/33
[issue-manifest]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/issues/30

[setup-guide]: https://github.com/snowplow-incubator/snowplow-snowflake-loader/wiki/Setup-Guide
[iglu-config]: https://github.com/snowplow/iglu/wiki/Iglu-client-configuration

[snowplow-sdk]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK
[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/Canonical-event-model
[dataflow-runner]: https://github.com/snowplow/dataflow-runner/
[dataflow-runner-rfc]: https://discourse.snowplowanalytics.com/t/splitting-emretlrunner-into-snowplowctl-and-dataflow-runner/350

[snowflake-data-structure]: https://discourse.snowplowanalytics.com/t/how-snowplow-data-is-structured-in-snowflake/1655

[discourse]: http://discourse.snowplowanalytics.com/
[discourse-already-exists]: https://discourse.snowplowanalytics.com/t/shredded-bad-rows-output-directory-already-exists/1442
