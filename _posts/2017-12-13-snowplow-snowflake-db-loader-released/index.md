---
layout: post
title-short: Snowplow Snowflake DB Loader released
title: "Snowplow Snowflake DB Loader released"
tags: [snowflake, storage, relational databases]
author: Anton
category: Releases
permalink: /blog/2017/12/13/snowplow-snowflake-loader-0.3.0-released/
---

We are tremendously excited to announce the first public release of the [Snowplow Snowflake Loader][snowflake-loader-repo].

[Snowflake][snowflake-computing] is a cloud-native data warehouse that has been rapidly growing in popularity. It competes with Amazon's own Redshift and Google's BigQuery, as well as other analytical database technologies like [Teradata][teradata], [Vertica][vertica] and [Exasol][exasol].

Collectively, these database technologies have made working with high volumes of rich, granular data, like Snowplow generates, significantly easier and more manageable by making it cost effective to query that data in flexible ways at scale, and plug in a wide variety of business intelligence, data visualization, data analytics and data science toolsets directly on top of the very large data sets.

We are delighted to be able to give Snowplow users the option to easily load their Snowplow data into Snowflake DB and use this as their primary data warehousing technology. Read on to learn about the many benefits of this exciting new data warehouse technology.

<!--more-->

1. [More Snowplow Loaders](#loaders-bloom)
2. [Introducing Snowflake DB](#snowflake-intro)
3. [Introducing the Snowflake Loader](#introducing-the-loader)
4. [Installing the Snowflake Loader](#install)
5. [Roadmap](#roadmap)
6. [Getting Help](#help)


<h2 id="loaders-bloom">1. More Snowplow Loaders</h2>

Where your data lives has a significant impact on what you can do with your data. With Snowplow, we want to make it easy for companies to deliver their data into the different places that let them drive real insight from that data. To date we've supported loading the data into:

* Amazon Redshift - where it can be modeled and queried using SQL and easily visualized and socialized via any business intelligence and reporting tool
* Amazon Kinesis - where it can be accessed by real-time data-driven applications and microservices, and can be computed on using AWS Lambda and Kinesis Analytics
* Elasticsearch - where it can be quickly queried and visualized in real-time reporting solutions like Kibana and Grafana
* Amazon S3 - where it can be queried using e.g. Spark on EMR, Databricks or Qubole

Over the last few years Amazon Redshift became a de-facto solution used across most of the Snowplow userbase. The simplicity of setting up Redshift, along with its ability to scale to handle large data volumes and its widely supported PostgreSQL interface have made it the number one data warehousing location for Snowplow data.

While Redshift is a time-tested platform with many advantages, we are committed to providing our users more opportunities to choose the best solutions for their own, unique requirements. That means building out support for many more SQL data warehouses and other, NoSQL datastores.

As an important step in this direction, we recently [refactored][release-r90] our RDB Loader - the application responsible for preparing and ingesting enriched data into Amazon Redshift. This move laid the foundation for us to release Snowplow Loaders for many more data stores.

Today we're proud to announce the latest one: Snowflake Loader.

<h2 id="snowflake-intro">2. Introducing the Snowflake DB</h2>

Snowflake is a relatively new data warehousing technology, quickly gaining popularity. Snowflake has three features that distinguish it from Redshift in particular:

### 2.1 Scale compute and storage independently

With Snowflake you can scale the computational capability of your data warehouse independently of the storage component. In practice, that means you can:

* Bolster the cluster size temporarily to make queries run faster. For example, if you update your data modeling process and want to reprocess your entire data set, you have the ability to scale up the compute capacity of your cluster and then scale back down once the data modeling is completed. This makes it economical to reprocess very large data sets.
* Keep your entire data set in your data warehouse - even if the accumulated data volumes are very high. If you're one of the many Snowplow users tracking 100M+ events per day, the volume of data you accumulate in your data warehouse will grow quickly over time. Storing all that data in Redshift rapidly becomes expensive and as a result, many Snowplow users of Redshift will only keep a rolling window of the last few days, weeks or months of data in Redshift (querying the rest of the data in S3). With Snowflake, the cost of just storing that data is low: it's only when computing on all of it that the associated Snowflake costs really start rising, making Snowflake an economically attractive choice at large data volumes.

### 2.2 Faster scaling

Snowflake DB scales fast. In contrast, resizing a Redshift cluster takes hours, sometimes days - periods during which you can no longer load data into the data warehouse. Whilst this is fine for many users, for high volume users it can create a backlog of data that needs to be loaded.

### 2.3 Excellent support for nested data types including JSON and Avro

Querying JSON data in Snowflake is fast and effective. That means that when we load Snowplow data into Snowflake, we're able to load it all into a single table with a single column per event and context type, and the individual event-specific and context-specific fields available as nested types in those columns. This is an attractive data structure because all your data is in a single, easy-to-reason about table.

Redshift, by contrast, has much more limited JSON parsing support: JSON parsing is very brittle (a single malformed JSON will break a whole query) and querying JSONs in Redshift is not performant. As a result, when we load Snowplow data into Redshift we do not use JSON: we shred out each event and context type into a dedicated table, so that they can be queried in a performant way.

This works well but means often that expensive joins and unions operations are required across tables in Redshift that are not in Snowflake because everything is in a single table.

### Easier management

Snowflake is a managed service - you don't need to setup indexes or calculating capacity, in general you just choose a size of ["virtual warehouse"][snowflake-warehouse]. This is the entity responsible for loading and querying your data, so you pay only for time your warehouse is in the resumed state.

With Redshift by contrast you have to actively manage the structure of your data tables and ensure the health of your data warehouse by regularly running `vacuum` and `analyze` jobs on your data.

<h2 id="introducing-the-loader">3. Introducing the Snowflake Loader</h2>

The Snowplow Snowflake Loader, very much like RDB Loader, consists of two parts, both found in the same GitHub repo:

* Snowflake Transformer - a Spark job that prepares enriched TSV data
* Snowflake Loader, which first discovers data prepared by Transformer, then constructs and executes SQL statements to load it

However, this is where the similarities end.

The Snowflake Loader takes a very different approach to maintaining the state of loaded data and structuring data inside a database.

Instead of the slow file-moving approach taken by RDB Loader, Snowflake Loader uses a run manifest on top of [AWS DynamoDB][dynamodb] which closely resembles one we introduced in [Snowplow Scala Analytics SDK 0.2.0][analytics-sdk-post].

Each time the Transformer job is launched, it checks the location in S3 where the enriched data lives to identify entries that haven't been transformed and loaded into Snowflake DB. If a new folder of data is found, it:

1. adds it to the manifest, and
2. processes the folder has been processed - changing its state to "processed", then
3. logs all the new event and context types found inside it

This last point is important: if the Transformer discovers a new event or context type, this information is used to update the `atomic.events` table definition in Snowflake to accommodate the new type, so that any new types can be queried immediately.

With contexts and unstructured events being the `VARIANT` data type you can query any nested fields directly like they're native types.

You can find out more on how data is structured inside Snowflake in the [dedicated Discourse post][snowflake-data-structure].

<h2 id="install">4. Installing Snowflake Loader</h2>

As stated above - it's very easy to operate Snowflake DB. Not only that, but Snowflake Loader doesn't add any complexity and is very easy to setup:

* The main pre-requisite is [an existing Snowflake account][snowflake-signup]
* After you've got access to the Snowflake console - only a few steps and configuration files are required to get Snowplow enriched data in there
*  The Snowflake Loader can be run in parallel with RDB Loader so you can load Snowflake alongside of Redshift. This is useful if you want to evaluate one against the other
* Both loaders work with enriched data, produced by the Snowplow Spark (or Hadoop) Enrich job
* The Enrich job and RDB Shredder/Loader can be run directly using EmrEtlRunner. However, the recommended way of running the Snowflake Transformer and Loader is to use [Dataflow Runner][dataflow-runner], which over time will become our default orchestration tool across all Snowplow batch pipelines, as per [this RFC][dataflow-runner-rfc].

At Snowplow, we have been running multiple pipelines loading both Redshift and Snowflake. If you do wish to load both databases alongside each other, we recommend running two separate DAGs: the standard Snowplow one (via EmrEtlRunner) to load Redshift, and an additional DAG that that picks up the enriched data in the enriched archive, processes it and loads it into Snowflake. The two DAGS can be run with different (even overlapping) schedules without problems: whenever the "main" pipeline leaves an enriched folder in archive - the next Snowflake run will load it. Otherwise, it will spot that no new data is available and won't do anything.

To get started loading your Snowplow data into Snowflake, you first need to create following config files:

* Dataflow Runner cluster config
* Snowplow Snowflake Loader config
* Dataflow Runner playbook

Here's an example Dataflow Runner cluster configuration:

{% highlight json %}
{
   "schema":"iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-1-0",
   "data":{
      "name": "Snowflake Pipeline",
      "logUri": "s3://<<UPDATE ME>>",
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
         "keyName": "<<UPDATE ME>>",
         "location":{
            "vpc":{
               "subnetId": "<<UPDATE ME>>"
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

You will need to update:

* `logUri` - this should be your own S3 path for EMR logs
* `ec2.keyName` - the EC2 keypair to use for your EMR cluster
* `ec2.location.vpc.subnetId` - in which VPC subnet your job should run

You also might want to change the `instances` configuration - though note that in general Snowflake Transformer requires significantly smaller clusters compared to RDB Shredder due to the reduced impact on the cluster filesystem.

Next, here's an example self-describing JSON for configuring the Snowflake Loader:

{% highlight json %}

{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-0",
  "data": {
    "name": "Acme Snowflake Storage Target",
    "accessKeyId": "<<UPDATE ME>>",
    "secretAccessKey": "<<UPDATE ME>>",
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

You'll probably want to change all fields here, apart from `purpose` and `schema`. A full description of all the important fields, as well as setup process is available at [Snowflake Loader documentation][setup-guide].

Another configuration file you'll need is a common [Iglu Resolver config][iglu-config]. So far it is used only to validate the configuration itself, so feel free to use one with only Iglu Central in it.

And the last file you'll need is a Dataflow Runner playbook responsible for running Transformer and Loader. Here's an example:

{% highlight json %}
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

You can leave the job steps as they are, or optionally you could run the Loader step from a local machine - it's up to you.

<h2 id="roadmap">5. Roadmap</h2>

Right now Snowplow Snowflake Loader is version 0.3.0, which means it has been battle-tested by our team internally at Snowplow for some time. We're enormously excited to make it public! There is still a lot we want to do add to it, however:

* [Arvo support][issue-avro], which should significantly reduce the Transformer's output size and speed-up the whole pipeline
* [Cross-batch deduplication][issue-deduplication] - similar to what we what we've implemented in the RDB Shredder
* [More robust manifests][issue-manifest]. Currently the Snowflake Shredder and Loader use separate DynamoDB manifests, which is useful and proven to be reliable, but still can be made more efficient

<h2 id="help">6. Getting Help</h2>

For more details on this release, as always do check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowflake-computing]: https://www.snowflake.net/
[snowflake-loader-repo]: https://github.com/snowplow-incubator/snowplow-snowflake-loader
[snowplow-repo]: https://github.com/snowplow/snowplow

[release-r90]: https://snowplowanalytics.com/blog/2017/07/26/snowplow-r90-lascaux-released-moving-database-loading-into-emr/
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

[release-notes]: https://github.com/snowplow/snowplow-snowflake-loader/releases/tag/0.3.0

[discourse]: http://discourse.snowplowanalytics.com/
[teradata]: http://www.teradata.co.uk/
[vertica]: https://www.vertica.com/
[exasol]: https://www.exasol.com/en/
