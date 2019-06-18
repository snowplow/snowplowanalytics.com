---
layout: post
title: Snowplow Snowflake Loader 0.5.0 released
title-short: Snowflake Loader 0.5.0
tags: [snowflake, storage, relational databases]
author: Enes
category: Releases
permalink: /blog/2019/08/28/snowplow-snowflake-loader-0.5.0-released/
---

We are pleased to announce version 0.5.0 of the [Snowplow Snowflake Loader][snowflake-loader-repo]! This release introduces bad row support with its [new format][new-bad-row-format-rfc].

Read on below the fold for:

1. [Bad row support](#bad-row)
2. [Upgrading](#upgrading)
3. [Getting help](#help)

<!--more-->

<h2 id="bad-row">1. Bad Row Support</h2>

Data quality has always been a huge focus for Snowplow. Being a non-lossy data pipeline is one of the central pieces of this data quality puzzle. Indeed, other pieces such as data validity (through our schema validation technology) or data richness (through our enrichments) connect directly with the non-lossiness piece.

In practice, for a Snowplow pipeline, non-lossiness meant that when something went wrong anywhere in the pipeline, instead of discarding it, the data impacted was parked as “bad” for later inspection, fixing and reprocessing. In Snowplow jargon, this bad data is called “bad rows”.

With this release, we are adding bad row support to Snowflake Transformer with [its new format][new-bad-row-format-rfc]. From now on, Snowflake Transformer will continue to run when it encounters unexpected data and it will write the bad rows to a separate place for further inspection instead of halting with exception. Snowflake Loader is the second component of the pipeline to introduce the new bad row format after [RDB Loader][rdb-loader-31].

In order to make bad rows easy to understand, we separated them into two types, loader parsing error and Snowflake error. As the names imply, loader parsing error represents cases where enriched events can not be parsed to [Snowplow Event][event-model] successfully and Snowflake error represents cases where enriched events are parsed without problem, however something went wrong internally while trying to transform the event into a suitable format for Snowflake. You can look at [schema of loader parsing error][loader-parsing-error-schema] and [schema of Snowflake error][snowflake-error-schema] if you want to learn more about their format.

In order to start to use Snowflake Loader with new bad row support, you have to specify where you want to store the bad rows in the config file. You can find detailed information about it in the [upgrading part](#upgrading).

<h2 id="upgrading">2. Upgrading</h2>

To make use of the new versions of the Snowflake Transformer and Loader, you will need to update your Dataflow Runner configurations to use the following jar files:

{% highlight bash %}

s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-transformer-0.5.0.jar
s3://snowplow-hosted-assets/4-storage/snowflake-loader/snowplow-snowflake-loader-0.5.0.jar

{% endhighlight %}

Due to bad row support, AWS S3 Url for bad rows need to be specified in the config file. Also, you need to update the schema version of the self describing Snowflake config json to `1-0-2`. In the end, your schema should look like: 

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-2",
  "data": {
    "name": "Snowflake",
    "auth": {
      "accessKeyId": "ABCD",
      "secretAccessKey": "abcd"
    },
    "awsRegion": "us-east-1",
    "manifest": "snowflake-manifest",
    "snowflakeRegion": "us-west-1",
    "database": "test_db",
    "input": "s3://snowflake/input/",
    "stage": "some_stage",
    "stageUrl": "s3://snowflake/output/",
    "badOutputUrl": "s3://badRows/output/",
    "warehouse": "snowplow_wh",
    "schema": "atomic",
    "account": "snowplow",
    "username": "anton",
    "password": "Supersecret2",
    "purpose": "ENRICHED_EVENTS"
  }
}
{% endhighlight %}

<h2 id="help">3. Getting help</h2>

For more details on this release, check out the [0.5.0 release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowflake-loader-repo]: https://github.com/snowplow-incubator/snowplow-snowflake-loader
[new-bad-row-format-rfc]: https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558
[release-notes]: https://github.com/snowplow/snowplow-snowflake-loader/releases/tag/0.5.0
[kryo]: https://github.com/EsotericSoftware/kryo
[discourse]: http://discourse.snowplowanalytics.com/
[event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[loader-parsing-error-schema]: https://github.com/snowplow/iglu-central/schemas/com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/1-0-0
[snowflake-error-schema]: https://github.com/snowplow/iglu-central/schemas/com.snowplowanalytics.snowplow.badrows/snowflake_error/jsonschema/1-0-0
[rdb-loader-31]: https://snowplowanalytics.com/blog/2019/08/27/snowplow-rdb-loader-r31-released-with-new-bad-rows/
