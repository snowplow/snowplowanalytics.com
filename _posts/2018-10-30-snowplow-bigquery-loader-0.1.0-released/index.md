---
layout: post
title-short: Snowplow BigQuery Loader released
title: "Snowplow BigQuery Loader released"
tags: [bigquery, storage, GCP, real-time]
author: Anton
category: Releases
permalink: /blog/2018/10/30/snowplow-bigquery-loader-0.1.0-released/
---

We are tremendously excited to announce the public release of the [Snowplow BigQuery Loader][bigquery-loader-repo].
[Google BigQuery][bigquery] is a highly-scalable and fully-managed data warehouse with real-time ingestion and rich support for semi-structured data.

The BigQuery Loader was the "missing piece" in the Google Cloud Platform version of Snowplow pipeline, following after [Google PubSub support][r101-inital-support] in Stream Collector and [Beam Enrich][r110-beam-enrich] in Snowplow core. This release makes Snowplow a truly multi-cloud platform.

Read on below the fold for:

1. [Google Cloud Platform support](#gcp)
2. [Google BigQuery](#bigquery)
3. [Snowplow BigQuery Loader](#loader)
4. [Setup](#setup)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

<!--more-->

<h2 id="gcp">1. Google Cloud Platform support</h2>

One year ago we published [our "Porting Snowplow to Google Cloud Platform" RFC][rfc], which laid the ground for native support of Google Cloud Platform across the Snowplow core components: collector, enrichment, warehouse loading and event archival.

Since that announcement, we have been busy exploring the Google Cloud Platorm and working on prototype components.
[R101 Neapolis][r101-initial-support] introduced [Google Cloud PubSub][google-pubsub] support to our Stream Collector and added provisional Cloud PubSub support to Stream Enrich (our existing real-time enrichment process for Kinesis).

[R110 Valle dei Templi][r110-beam-enrich] added new Beam Enrich component that reads raw events from PubSub subscription and performs standard enrichment process using [Google Cloud Dataflow][dataflow], a service for distributed data processing.
At last, our recent release of [SQL Runner][sql-runner] makes it possible to run your data modeling playbooks against BigQuery.

Today we are ready to announce that you can deploy your entire pipeline on Google Cloud and analyze enriched data using best in class tools such as Google BigQuery and Dataflow.

<h2 id="bigquery">2. Google BigQuery</h2>

Google BigQuery is a big player on market of analytics warehouses.
It provides seamless integration with many [Google services][bigquery-transfer], including other GCP products and [Google Analytics][google-analytics-360] as well as near real-time analytics and familiar SQL interface for analysts.

It has a unique combination of features and characteristics that makes it a perfect addition to a growing list of storage targets supported by Snowplow.

* Real-time ingestion. A completely new feature in Snowplow ecosystem, allowing to sink tremendous volumes of data and query it with subsecond delays. This opens makes it appealing for such use cases as fraud-detection or real-time recommendations engine.
* Fully managed. Unlike Amazon Redshift, you don't need to worry about any kind of maintaining, such as `VACUUM`ing or scaling - our test pipelines were handling tens of millions records per day without any disruptance
* Support of semi-structured data. Taking best of two worlds, like Snowflake Google BigQuery has support of `STRUCT`s (JSON objects) and `REPEATED` mode (arrays), but at the same time maintains these entities with statically known structure, so all queries are type-checked
* As one of the most popular analytics warehouses, BigQuery has wide [range of integrations][bigquery-transfer], support of [public datasets][bigquery-public-datasets] and growing list of [partners][bigquery-partners]
* Pricing model. With BigQuery you pay only scanned rows, which combined with appropriate [partitioning][partitioning] strategy can make BigQuery an extremely cheap solution in a big variety of use cases.

<h2 id="loader">3. Snowplow BigQuery Loader</h2>

<h3 id="loader-overview">3.1. Overview</h3>

BigQuery is a third cloud warehouse supported by Snowplow (excluding several discounted ones).
By virtue of our growing expertise, each new storage option provides more seamless experience, leveraging as many warehouse's advantages as possible.

For example, real-time ingestion wouldn't be so appealing if our users had to manually generate and execute DDL statements after adding new context or self-describing event.
Therefore, automatic table mutation is implemented from the first version of BigQuery Loader.
You just upload new JSON schema to Iglu Registry and start sending data with this schema - Loader creates corresponding column automatically.

Another feature that we couldn't neglect is expressive SQL type system providing more fine-grained control over data being loaded.
There's no option for plain semistructured data as in Snowflake DB and we would like to keep data as structured as possible, thus each self-describing schema is mapped to a `STRUCT` column, reflecing all its properties.
This also works with any kind of nested structure, including deeply nested arrays, which wouldn't be possible in many other SQL-like warehouses like Redshift.
It also means, that unlike in Redshift, each shredded type is represented as a separate column, not separate table. 
It makes slow `JOIN`s unnecessary and removes problem with possible cartesian product.

These two features are powered by our Iglu schemaing technology which includes full-featured BigQuery DDL abstract syntax tree and JSON Schema to BigQuery DDL since [R10 Tiflis][iglu-r10].

<h3 id="loader-architecture">3.2. Architecture</h3>

Unlike existing Loaders, BigQuery Loader's architecture is entirely real-time and designed for unbounded data streams.
It doesn't involve a blob storage in order to stage the data (unless you configure it separately) and never makes assumption about data volumes.
Instead, as other components of Snowplow GCP pipeline, it uses exclusively Google PubSub topics in order to read enriched data, sink bad rows and fullfill other needs.

BigQuery Loader consists of two applications:

* Loader itself, a Dataflow job that transforms stream of enriched events into BigQuery format and ingests them
* Mutator, a stand-alone JVM application that performs necessary `ALTER TABLE` statements

Both applications communicate through so called `typesTopic` topic.
Loader sends there all types it encountered and Mutator performs table mutation whenever necessary. Mutator should be constantly running and consuming PubSub messages.

Beside of `typesTopic`, Loader makes use of two other PubSub topics:

* `badRows` - rows that for some reason couldn't be transformed in BigQuery format. Usually it means Iglu Registry outage or unexpected schema patch, because data already has passed validation in enrich, but Loader couldn't transform it into BigQuery format in accordance with Iglu schema. This closely resembles "shredded bad" data from RDB Shredder, it contains reason of failure and raw enriched JSON.
* `failedInserts` - another PubSub topic, where Loader sends data that has passed transformation, but for some reasons failed on last insertion stage. Unlike `badRows`-data it does not contain the reason of failure and has a form of ready-to-be-inserted BigQuery row format. Main source of failed inserts is a short period of time between first event with new schema processed by Loader and Mutator performed necessary mutation.

Both "failed inserts" and "bad rows" have different format, cause and recovery strategies.
Bad rows should be extremely rare and in order to recover them one needs to sink the data to Cloud Storage and apply recovery strategy depending on root cause.
Failed inserts in turn usually can be simply forwarded to BigQuery one more time - if they were caused by Mutator's delay and Mutator managed to perform its statements - these rows will be accepted by BigQuery.

Note that PubSub has a [retention time][pubsub-retention] for 7 days. After this time, messages will be silently dropped. It means that for this time you either need to recover them or sink to cloud storage in order to not loose the data.

<h2 id="bigquery">4. Setup</h2>

Setup of BigQuery Loader is fairly straightforward and can be divided into following steps:

1. Setup rest of Snowplow GCP stack
2. Create necessary PubSub topics and subscriptions
3. Initialize empty events table
4. Write configuration file
5. Launch Mutator
6. Submit Loader job to Dataflow

Both Muator and Loader use same self-describing JSON configuration file with [`iglu:com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0`][bigquery-config] schema.

Here's configuration example:

{% highlight yaml %}
{
    "schema": "iglu:com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0",
    "data": {
        "name": "Acme BigQuery",
        "id": "12b1159f-d110-4ab3-a7ae-c7698238d808",
        "input": "enriched-good-sub",
        "projectId": "acme-snowplow",
        "datasetId": "atomic",
        "tableId": "events",
        "typesTopic": "acme-bigquery-types-topic",
        "typesSubscription": "acme-test-types-sub",

        "badRows": "acme-bigquery-bad-rows-topic",
        "failedInserts": "acme-bigquery-failed-inserts-topic",

        "load": {
            "mode": "STREAMING_INSERTS",
            "retry": false
        },

        "purpose": "ENRICHED_EVENTS"
    }
}
{% endhighlight %}

Most of above properties should be descriptive enough. You can find more on [our wiki][documentation]

In order to run applications, you can use following commands:

{% highlight bash %}
$ snowplow-bigquery-loader \
    --config=$CONFIG \
    --resolver=$RESOLVER \
    --runner=DataflowRunner \
    --saveHeapDumpsToGcsPath=gs://dataflow-staging-us-central1-102462720186/heap/

$ ./snowplow-bigquery-mutator \
    listen      # Can be "init" to create empty table
    --config $CONFIG \
    --resolver $RESOLVER \
{% endhighlight %}

<h2 id="roadmap">5. Roadmap</h2>

This is the first public release of BigQuery Loader, and it can be considered stable and reliable enough for most production use cases.

It has performed well in our internal testing program, but many things are still subject to change. Upcoming changes will most likely be focused on the following aspects:

* **Table structure** - currently all columns are created with the precise version of schema, e.g. `contexts_com_acme_product_context_1_0_0`. We think that this model is enough for many use cases, but not optimal for data models which make heavy use of self-describing data with regularly evolving schemas. We're thus considering `MODEL`-based versioning (e.g. `contexts_com_acme_product_context_1`) for the next major version of Loader - but are still open to suggestions
* **Deduplication** - Google Cloud PubSub has very weak delivery guarantees and a Snowplow pipeline has to contend with [various sources of duplicates][deduplication], so we will need some deduplication mechanism in due course
* **State management** - currently, the loader tracks its own state via the `typesTopic` introduced above. This makes it very hard to reason about how BigQuery loading is proceeding, so we are looking for more sophisticated solutions going forwards

<h2 id="help">6. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] on GitHub.

And if you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-google-cloud-platform/1505
[google-analytics-360]: https://marketingplatform.google.com/about/analytics-360/
[bigquery-transfer]: https://cloud.google.com/bigquery/docs/transfer-service-overview
[bigquery-public-datasets]: https://cloud.google.com/bigquery/public-data/
[bigquery-partners]: https://cloud.google.com/bigquery/partners/
[bigquery-pricing]: https://cloud.google.com/bigquery/pricing

[partitioning]: https://cloud.google.com/bigquery/docs/partitioned-tables
[pubsub-retention]: https://cloud.google.com/pubsub/docs/subscriber

[iglu-r10]: https://snowplowanalytics.com/blog/2018/08/29/iglu-r10-tiflis-released/
[bigquery-config]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0
[documentation]: https://github.com/snowplow-incubator/snowplow-bigquery-loader/wiki
[deduplication]: https://snowplowanalytics.com/blog/2015/08/19/dealing-with-duplicate-event-ids/

[google-pubsub]: https://cloud.google.com/pubsub/
[dataflow]: https://cloud.google.com/dataflow/

[r101-inital-support]: https://snowplowanalytics.com/blog/2018/03/21/snowplow-r101-neapolis-with-initial-gcp-support/
[r110-beam-enrich]: https://snowplowanalytics.com/blog/2018/09/12/snowplow-r110-valle-dei-templi-introduces-real-time-enrichments-on-gcp/
[sql-runner]: TODO

[bigquery-loader-repo]: https://github.com/snowplow-incubator/snowplow-bigquery-loader
[bigquery]: https://cloud.google.com/bigquery/
[snowplow-repo]: https://github.com/snowplow/snowplow

[release-notes]: https://github.com/snowplow/snowplow-bigquery-loader/releases/tag/0.1.0
[discourse]: http://discourse.snowplowanalytics.com/
