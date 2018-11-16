---
layout: post
title-short: Snowplow BigQuery Loader released
title: "Snowplow BigQuery Loader released"
tags: [bigquery, storage, GCP, real-time]
author: Anton
category: Releases
permalink: /blog/2018/11/21/snowplow-bigquery-loader-0.1.0-released/
---

We are tremendously excited to announce the public release of the [Snowplow BigQuery Loader][bigquery-loader-repo].
[Google BigQuery][bigquery] is a highly-scalable and fully-managed data warehouse with real-time ingestion and rich support for semi-structured data. Since its launch, we have had many Snowplow users and prospective users request that we extend Snowplow to support loading Snowplow data into BigQuery as a storage target. This release enables us to do just that.

The BigQuery Loader was the key "missing piece" in the Google Cloud Platform version of Snowplow pipeline, following [Google Pub/Sub support][r101-initial-support] in the Stream Collector and [Beam Enrich][r110-beam-enrich] in Snowplow core. This release gets us very close to completing an initial version of Snowplow that runs end-to-end in GCP, making Snowplow a truly multi-cloud platform.

Read on below the fold for:

1. [Google Cloud Platform (GCP) support](#gcp)
2. [Google BigQuery](#bigquery)
3. [Snowplow BigQuery Loader](#loader)
4. [Setup](#setup)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

<!--more-->

<h2 id="gcp">1. Google Cloud Platform (GCP) support</h2>

One year ago we published [our "Porting Snowplow to Google Cloud Platform" RFC][rfc], which laid the ground for native support of Google Cloud Platform across the Snowplow core components: collector, enrichment, warehouse loading and event archival.

Since that announcement, we have been busy exploring the Google Cloud Platform and working on prototype components.
[R101 Neapolis][r101-initial-support] introduced [Google Cloud Pub/Sub][google-pubsub] support to our Stream Collector and added provisional Cloud Pub/Sub support to Stream Enrich (our existing real-time enrichment process for Kinesis).

[R110 Valle dei Templi][r110-beam-enrich] then added a new Beam Enrich application, which reads raw events from Pub/Sub subscription and performs standard the enrichment process using [Google Cloud Dataflow][dataflow], a service for distributed data processing; this replaced the Cloud Pub/Sub support in Stream Enrich.

And with today's release of the BigQuery Loader, you can now deploy your entire pipeline on Google Cloud and analyze Snowplow enriched data using best-in-class tools such as BigQuery and Cloud Dataflow.

<h2 id="bigquery">2. Google BigQuery</h2>

Google BigQuery is gaining increasing adoption and mind-share as a cloud-native, elastically scalable data warehouse. It provides seamless integration with many [Google services][bigquery-transfer], including other GCP products and [Google Analytics][google-analytics-360], supports near real-time analytics and offers a familiar SQL interface for analysts.

BigQuery has a unique combination of features and characteristics that make it a perfect addition to a growing list of storage targets supported by Snowplow:

* **Elastic compute** - BigQuery scales elastically, making it performant to run very computationally intensive queries
* **Real-time ingestion** - with Snowplow loading into BigQuery we can sink tremendous volumes of data and query it with sub-second delays. This makes BigQuery appealing for use cases like fraud-detection or real-time recommendations engines
* **Fully managed** - unlike with Amazon Redshift, for example, you don't need to worry about warehouse maintenance, such as `VACUUM`ing or cluster scaling - our test pipelines have been handling tens of millions records per day without any disruption
* **Support for semi-structured data** - Google BigQuery has support for `STRUCT`s (JSON objects) and `REPEATED` elements (arrays), and enforces statically known structures for these entities so that all queries are type-checked
* **On-demand pricing model** - with BigQuery you pay only for scanned rows. This makes BigQuery a better suited data store than Redshift for users who want to warehouse very large volumes of data
* **Extensive ecosystem** - as one of the most popular analytics warehouses, BigQuery already has a wide [range of integrations][bigquery-transfer], support for various [public datasets][bigquery-public-datasets] and growing list of [partners][bigquery-partners]. In particular, many Google services, including Campaign Manager (formerly DoubleClick), Ad Manager, and Youtube, support exporting data directly into BigQuery, where it is now possible to join that data with Snowplow data

<h2 id="loader">3. Snowplow BigQuery Loader</h2>

<h3 id="loader-overview">3.1. Overview</h3>

We have been able to take the lessons learnt building loaders for Redshift and SnowflakeDB and apply them to the BigQuery Loader.

For example, the BigQuery Loader automatically updates table definitions in BigQuery when events and entities (i.e. contexts) are received with new schema versions. Simply ensure that any new schema versions have been uploaded your Iglu registry, then start sending events with the new schema: the BigQuery Loader will create the corresponding additional column inside your BigQuery events table automatically.

It was also great to integrate with BigQuery's expressive SQL type system. To keep our event data as structured as possible, in BigQuery each self-describing schema is mapped to a `STRUCT` column, reflecting all its properties. This also works with any kind of nested structure, including deeply nested arrays - any shredded type can be represented as a separate column, not a separate table as we have to use in Redshift.

These two features are powered by our Iglu schema technology, which as of [R10 Tiflis][iglu-r10] includes a full-featured BigQuery DDL abstract syntax tree and support for JSON Schema to BigQuery DDL generation.

<h3 id="loader-architecture">3.2. Architecture</h3>

Unlike existing Loaders, the BigQuery Loader's architecture is entirely real-time and designed for unbounded data streams. It does not use cloud/blob storage to stage the data, and it makes no assumptions about data volumes. As with the other components of Snowplow GCP pipeline, the Loader exclusively uses Cloud Pub/Sub topics in order to read enriched events, sink bad rows, and handle all related tasks.

The Snowplow BigQuery Loader consists of two applications:

1. The Loader itself, a Cloud Dataflow job that transforms stream of enriched events into BigQuery format and ingests them
2. The Mutator, a stand-alone JVM application that performs the necessary `ALTER TABLE` statements

![architecture][architecture-img]

The two applications communicate through the `typesTopic`. The Loader writes to that topic all of the types that it has encountered; the Mutator then reads from that topic to perform mutation of the events table as necessary. The Mutator should be constantly running and consuming Pub/Sub messages.

Alongside the `typesTopic`, the Loader makes use of two other Pub/Sub topics:

1. `badRows` - rows that for some reason couldn't be transformed into BigQuery format. These could be caused by an Iglu registry outage, or by an unexpected schema patch or overwrite. This closely resembles the "shredded bad" data generated by our RDB Shredder for Redshift, and contains the reason of failure and raw enriched JSON
2. `failedInserts` - the Loader sends data to this topic that *has* passed transformation, but for some reason failed during the actual insertion stage. Unlike `badRows` data, these records unfortunately do not contain the reason of failure - they are in the form of ready-to-be-inserted BigQuery row format. The main source of failed inserts is the short period of time between the first event with new schema processed by the Loader, and the Mutator performing the necessary mutation

Both "bad rows" and "failed inserts" have different formats, causes and recovery strategies.

Bad rows should be extremely rare and in order to recover them one needs to sink the data to Cloud Storage (we recommend using our [`snowplow-google-cloud-storage-loader`][snowplow-google-cloud-storage-loader] and apply an appropriate recovery strategy depending on the root cause. Stay tuned for the release of `snowplow-event-recovery` - to do just this.)

Failed inserts in turn usually can be simply forwarded to BigQuery using the auxiliary [BigQuery Forwarder job][forwarder].
If they were simply caused by the Mutator's delay, then BigQuery will accept these rows the second time.

Note that Pub/Sub has a [retention time][pubsub-retention] of 7 days. After this time, messages will be silently dropped. Therefore, we recommend sinking these topics to Cloud Storage to prevent data loss.

<h2 id="bigquery">4. Setup</h2>

Setup of the Snowplow BigQuery Loader is relatively straightforward, involving the following steps:

1. Setup rest of the Snowplow GCP stack
2. Create the necessary Pub/Sub topics and subscriptions
3. Initialize the empty events table (optionally with [partitioning][partitioning-setup] on the `derived_tstamp` column)
4. Write the configuration file
5. Launch the Mutator
6. Submit the Loader job to Dataflow

Both Mutator and Loader use the same self-describing JSON configuration file with this schema:

[`iglu:com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0`][bigquery-config]

Here is a configuration example:

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

For more information on these configuration properties, check out [the Loader's wiki][documentation].

You can initialize the Mutator like this:

{% highlight bash %}
$ ./snowplow-bigquery-mutator \
    listen      # Can be "init" to create empty table
    --config $CONFIG \
    --resolver $RESOLVER \
{% endhighlight %}

Then you can submit the Loader itself to Cloud Dataflow like so:

{% highlight bash %}
$ snowplow-bigquery-loader \
    --config=$CONFIG \
    --resolver=$RESOLVER \
    --runner=DataflowRunner \
    --saveHeapDumpsToGcsPath=gs://dataflow-staging-us-central1-102462720186/heap/
{% endhighlight %}

<h2 id="roadmap">5. Roadmap</h2>

This is the first public release of BigQuery Loader, and it can be considered stable and reliable enough for most production use cases.

It has performed well in our internal testing program, but many things are still subject to change. Upcoming changes will most likely be focused on the following aspects:

* **Table structure** - currently all columns are created with the precise version of schema, e.g. `contexts_com_acme_product_context_1_0_0`. We think that this model is enough for many use cases, but not optimal for data models which make heavy use of self-describing data with regularly evolving schemas. We're thus considering `MODEL`-based versioning (e.g. `contexts_com_acme_product_context_1`) using table-sharding for the next major version of Loader - but are still open to suggestions
* **Deduplication** - Google Cloud Pub/Sub has very weak delivery guarantees and a Snowplow pipeline has to contend with [various sources of duplicates][deduplication], so we will need some deduplication mechanism in due course
* **State management** - currently, the loader tracks its own state via the `typesTopic` introduced above. This makes it very hard to reason about how BigQuery loading is proceeding, so we are looking for more sophisticated solutions going forwards

<h2 id="help">6. Getting help</h2>

You'll find documentation for the BigQuery Loader on the [project's wiki][documentation].

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
[forwarder]: https://github.com/snowplow-incubator/snowplow-bigquery-loader/wiki#snowplow-bigquery-forwarder

[iglu-r10]: https://snowplowanalytics.com/blog/2018/08/29/iglu-r10-tiflis-released/
[bigquery-config]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0
[documentation]: https://github.com/snowplow-incubator/snowplow-bigquery-loader/wiki
[deduplication]: https://snowplowanalytics.com/blog/2015/08/19/dealing-with-duplicate-event-ids/

[google-pubsub]: https://cloud.google.com/pubsub/
[dataflow]: https://cloud.google.com/dataflow/
[partitioning-setup]: https://cloud.google.com/bigquery/docs/creating-column-partitions

[r101-initial-support]: https://snowplowanalytics.com/blog/2018/03/21/snowplow-r101-neapolis-with-initial-gcp-support/
[r110-beam-enrich]: https://snowplowanalytics.com/blog/2018/09/12/snowplow-r110-valle-dei-templi-introduces-real-time-enrichments-on-gcp/
[sql-runner]: https://discourse.snowplowanalytics.com/t/sql-runner-0-8-0-released
[architecture-img]: /assets/img/blog/2018/11/bigquery-architecture.png

[bigquery-loader-repo]: https://github.com/snowplow-incubator/snowplow-bigquery-loader
[bigquery]: https://cloud.google.com/bigquery/
[snowplow-repo]: https://github.com/snowplow/snowplow

[release-notes]: https://github.com/snowplow/snowplow-bigquery-loader/releases/tag/0.1.0
[discourse]: http://discourse.snowplowanalytics.com/

[snowplow-google-cloud-storage-loader]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader
