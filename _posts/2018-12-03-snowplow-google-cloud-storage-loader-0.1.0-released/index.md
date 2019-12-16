---
layout: post
title-short: Snowplow Google Cloud Storage Loader 0.1.0 released
title: "Snowplow Google Cloud Storage Loader 0.1.0 released"
image: /assets/img/blog/2018/12/snowplow-gcp.jpg
tags: [snowplow, real-time, GCP]
author: Ben
category: Releases
permalink: /blog/2018/11/13/snowplow-google-cloud-storage-loader-0.1.0-released/
---

We are pleased to release the first version of the [Snowplow Google Cloud Storage Loader][loader]. This application reads data from a Google [Pub/Sub][pubsub] topic and writes it to a Google Cloud Storage bucket. This is an essential component in the Snowplow for GCP stack we are launching: this application enables users to sink any bad data from Pub/Sub to [Cloud Storage][storage], from where it can be reprocessed, and subsequently sink either the raw or enriched data to Cloud Storage as a permanent backup.

Please read on after the fold for:

1. [An overview of the Snowplow Google Cloud Storage Loader](#csl)
2. [Running the Snowplow Google Cloud Storage Loader](#running)
3. [The GCP roadmap](#roadmap)
4. [Getting help](#help)

<!--more-->

<h2 id="csl">1. An overview of the Snowplow Google Cloud Storage Loader</h2>

The Snowplow Google Cloud Storage Loader is a [Cloud Dataflow][dataflow] job which:

* Consumes the contents of a [Pub/Sub][pubsub] topic through an input subscription
* Groups the records by a configurable time window
* Writes the records into a [Cloud Storage][storage] bucket

As part of a Snowplow installation on GCP, this loader is  particularly useful to archive data from the raw, enriched, or bad streams to long-term storage.

It can additionally partition the output bucket by date (up to the hour), making it faster and less expensive to query the data over particular time periods. The following is an example layout of the output bucket:

- gs://output-bucket/
  - 2018/
    - 11/
      - 01/
        - output-2018-11-01T15:25:00.000Z-2018-11-01T15:30:00.000Z-pane-0-last-00000-of-00001.txt

Note that every part of the filename is configurable:

- `output` corresponds to the filename prefix
- `2018-10-25T15:25:00.000Z-2018-10-25T15:30:00.000Z-pane-0-last-00000-of-00001` is the shard template and can be further broken down as:
  - `2018-11-01T15:25:00.000Z-2018-11-01T15:30:00.000Z`, the time window
  - `pane-0-last`, the pane label, where panes refer to the data actually emitted after aggregation in a time window
  - `00000-of-00001`, the shard index and total number of shards respectively, where shards refer to the
number of files produced per window which is also configurable
- `.txt` is the filename suffix

If the notions of windows or panes are still relatively new to you, we recommend reading the
following article series by Tyler Akidau which detail the different [Cloud Dataflow][dataflow]
capabilities with regards to streaming and windowing:

- [The world beyond batch: streaming 101][dataflow-streaming-101]
- [The world beyond batch: streaming 102][dataflow-streaming-102]

Finally, the loader can optionally compress data in gzip or bz2. Note that bz2-compressed data can't be
loaded directly into [BigQuery][bq].

<h2 id="running">2. Running the Snowplow Google Cloud Storage Loader</h2>

The Google Cloud Storage Loader comes as a ZIP archive, a Docker image, or a
[Cloud Dataflow template][template], feel free to choose the one which fits your use case the most.

<h3 id="template">2.1 Running through the template</h3>

You can run Dataflow templates using a variety of means:

- Using the GCP console
- Using `gcloud` at the command line
- Using the REST API

Refer to [the documentation on executing templates][executing-templates] to learn more.

Here, we provide an example using `gcloud`:

{% highlight bash %}
gcloud dataflow jobs run ${JOB_NAME} \
  --gcs-location gs://snowplow-hosted-assets/4-storage/snowplow-google-cloud-storage-loader/0.1.0/SnowplowGoogleCloudStorageLoaderTemplate-0.1.0 \
  --parameters \
    inputSubscription=projects/${PROJECT}/subscriptions/${SUBSCRIPTION},\
    outputDirectory=gs://${BUCKET}/YYYY/MM/dd/HH/,\ # partitions by date
    outputFilenamePrefix=output,\ # optional
    shardTemplate=-W-P-SSSSS-of-NNNNN,\ # optional
    outputFilenameSuffix=.txt,\ # optional
    windowDuration=5,\ # optional, in minutes
    compression=none,\ # optional, gzip, bz2 or none
    numShards=1 # optional
{% endhighlight %}

Make sure to set all the `${}` environment variables included above.

<h3 id="zip">2.2 Running through the zip archive</h3>

You can find the archive hosted on [our Bintray][bintray].

Once unzipped the artifact can be run as follows:

{% highlight bash %}
./bin/snowplow-google-cloud-storage-loader \
  --runner=DataFlowRunner \
  --project=${PROJECT} \
  --streaming=true \
  --zone=europe-west2-a \
  --inputSubscription=projects/${PROJECT}/subscriptions/${SUBSCRIPTION} \
  --outputDirectory=gs://${BUCKET}/YYYY/MM/dd/HH/ \ # partitions by date
  --outputFilenamePrefix=output \ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \ # optional
  --outputFilenameSuffix=.txt \ # optional
  --windowDuration=5 \ # optional, in minutes
  --compression=none \ # optional, gzip, bz2 or none
  --numShards=1 # optional
{% endhighlight %}

Make sure to set all the `${}` environment variables included above.

To display the help message:

{% highlight bash %}
./bin/snowplow-google-cloud-storage-loader --help
{% endhighlight %}

To display documentation about Cloud Storage Loader-specific options:

{% highlight bash %}
./bin/snowplow-google-cloud-storage-loader --help=com.snowplowanalytics.storage.googlecloudstorage.loader.Options
{% endhighlight %}

<h3 id="docker">2.3 Running through the Docker image</h3>

You can also find the Docker image on [our Bintray][bintray-docker].

A container can be run as follows:

{% highlight bash %}
docker run \
  -e GOOGLE_APPLICATION_CREDENTIALS=/snowplow/config/credentials.json \ # if running outside GCP
  snowplow-docker-registry.bintray.io/snowplow/snowplow-google-cloud-storage-loader:0.1.0 \
  --runner=DataFlowRunner \
  --job-name=${JOB_NAME} \
  --project=${PROJECT} \
  --streaming=true \
  --zone=${ZONE} \
  --inputSubscription=projects/${PROJECT}/subscriptions/${SUBSCRIPTION} \
  --outputDirectory=gs://${BUCKET}/YYYY/MM/dd/HH/ \ # partitions by date
  --outputFilenamePrefix=output \ # optional
  --shardTemplate=-W-P-SSSSS-of-NNNNN \ # optional
  --outputFilenameSuffix=.txt \ # optional
  --windowDuration=5 \ # optional, in minutes
  --compression=none \ # optional, gzip, bz2 or none
  --numShards=1 # optional
{% endhighlight %}

Make sure to set all the `${}` environment variables included above.

To display the help message:

{% highlight bash %}
docker run snowplow-docker-registry.bintray.io/snowplow/snowplow-google-cloud-storage-loader:0.1.0 \
  --help
{% endhighlight %}

To display documentation about Cloud Storage Loader-specific options:

{% highlight bash %}
docker run snowplow-docker-registry.bintray.io/snowplow/snowplow-google-cloud-storage-loader:0.1.0 \
  --help=com.snowplowanalytics.storage.googlecloudstorage.loader.Options
{% endhighlight %}

<h3 id="additional">2.4 Additional options</h3>

A full list of all the Beam CLI options can be found in the [documentation for Google Cloud Dataflow][beam-cli-docs].

<h2 id="roadmap">3. GCP roadmap</h2>

For those of you following our Google Cloud Platform progress, make sure you read our [official GCP launch announcement][launch] and our [BigQuery Loader release post][bql].

We plan to shortly release:

- A new event recovery workflow
- A new release of Beam Enrich, which integrates with Cloud Dataflow templates mentioned above; you
can check out [the original blogpost for Snowplow R110 Valle dei Templi][r110] to find out more about Beam Enrich


<h2 id="help">4. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[loader]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/
[release]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/releases/0.1.0
[bintray]: https://bintray.com/snowplow/snowplow-generic/snowplow-google-cloud-storage-loader
[bintray-docker]: https://bintray.com/snowplow/registry/snowplow%3Asnowplow-google-cloud-storage-loader

[r110]: https://snowplowanalytics.com/blog/2018/09/12/snowplow-r110-valle-dei-templi-introduces-real-time-enrichments-on-gcp/

[pubsub]: https://cloud.google.com/pubsub/
[storage]: https://cloud.google.com/storage/
[dataflow]: https://cloud.google.com/dataflow/
[dataflow-streaming-101]: https://www.oreilly.com/ideas/the-world-beyond-batch-streaming-101
[dataflow-streaming-102]: https://www.oreilly.com/ideas/the-world-beyond-batch-streaming-102
[bq]: https://cloud.google.com/bigquery/
[template]: https://cloud.google.com/dataflow/docs/templates/overview
[executing-templates]: https://cloud.google.com/dataflow/docs/templates/executing-templates

[beam-cli-docs]: https://cloud.google.com/dataflow/pipelines/specifying-exec-params#setting-other-cloud-pipeline-options

[discourse]: https://discourse.snowplowanalytics.com/

[launch]: /blog/2018/12/03/snowplow-for-google-cloud-platform-is-here/

[bql]: /blog/2018/12/03/snowplow-bigquery-loader-0.1.0-released/
