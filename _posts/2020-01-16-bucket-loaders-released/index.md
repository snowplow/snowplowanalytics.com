---
layout: post
title: "Google Cloud Loader 0.3.0 and S3 loader 0.7.0 released"
title-short: Bucket loaders released
tags: [snowplow, gcs, gcp, loader]
author: Peel
category: Releases
permalink: /blog/2020/01/16/gcs-s3-loaders-released/
---

We are pleased to announce updated versions of our bucket loaders: [version 0.3.0][release-030] of Google Cloud Storage loader and [version 0.7.0][release-070] of S3 Loader that allow you to partition events by schema.

<!--more-->

<h2 id="partitioning">1. Partitioning by schema</h2>

At Snowplow we use [self-describing-json][self-describing JSON] format to keep a well-defined, type-spec'd data definitions. When used with self-describing JSON, bucket loaders are now able to send each schema-formatted event to applicable schema directory in a tidy directory structure.

The change comes along with [r118-release][R118] changes introducing a beta release of the new bad event format for easier post-processing.

<h2 id="upgrading">2. Upgrading</h2>

We have aligned configuration settings to expose the same set of options so it is easier to deploy across GCP and AWS. In future we will further consolidate configuration to make the configuration even more portable. This, along with new capabilities, required some backwards-incompatible options.

<h3>S3 Loader</h3>

If you want to make use of the new partitioning mechanism make sure to set additional new parameter `s3.partitionedBucket=s3://[BUCKET]` in your configuration file. The parameter is pointing to s3 URI where partitioned JSON files are to be stored. 
Otherwise no partitioning will be performed and data will be stored within top-level directory followed by `s3.dateFormat` if set.

We introduced a new optional configuration settings `s3.outputDirectory` for static directory prefix, `s3.dateFormat={YYYY}/{MM}/{dd}/{HH}` that follows the `outputDirectory` and `s3.filenamePrefix` that prefixes file resulting in: `s3://[s3.bucket|s3.partitionedBucket]/[s3.outputDirectory]/[s3.dateFormat]/[s3.filenamePrefix]-...`

<h3>Google Cloud Storage Loader</h3>

Google Cloud Storage loader deployment is no longer supported using [dataflow-templates][Dataflow templates]. This comes from upstream limitation for optional, runtime parameters. Therefore from now on only command-line, docker-based deployment is supported.

We introduced a new flag `--dateFormat=YYYY/MM/dd/HH/` that removes date formatting from `--outputDirectory` flag. 
Output directory no longer interprets date format string and therefore becomes `--outputDirectory=gs://[BUCKET]/` instead of `--outputDirectory=gs://[BUCKET]/YYYY/MM/dd/HH/`.

If you want to make use of the new partitioning mechanism make sure to set additional new parameter `--partitionedOutputDirectory=gs://[BUCKET]/[BUCKET_DIR]` is set. Otherwise no partitioning will be performed and data will be stored within top-level directory followed by `--dateFormat` if set.

<h2 id="roadmap">3. Roadmap</h2>

GCS loader and S3 loader continue to evolve at Snowplow. If you have other features in mind, feel free to log an issue in [GCS loader GitHub repository][gcs-loader-issues] or [S3 loader GitHub repository][s3-loader-issues].

<h2 id="contributing">4. Contributing</h2>

You can check out the [GCS loader repository][gcs-loader-repo] and [S3 loader repository][s3-loader-repo] if you'd like to get involved!

<h2 id="contributing">5. Getting Help</h2>

If you have any questions or run into any problem, raise an [GCS loader issue][gcs-loader-issues], [S3 loader issue][s3-loader-issues] please visit [our Discourse forum][discourse].

[self-describing-json]: https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/
[r118-release]: https://snowplowanalytics.com/blog/2020/01/16/snowplow-release-r118-badrows/
[dataflow-templates]: https://cloud.google.com/dataflow/docs/guides/templates/overview

[release-030]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/releases/tag/0.3.0
[release-070]: https://github.com/snowplow/snowplow-s3-loader/releases/tag/0.7.0

[gcs-loader-repo]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader
[gcs-loader-issues]: https://github.com/snowplow-incubator/snowplow-google-cloud-storage-loader/issues/

[s3-loader-repo]: https://github.com/snowplow/snowplow-s3-loader
[s3-loader-issues]: https://github.com/snowplow/snowplow-s3-loader/issues/

[discourse]: https://discourse.snowplowanalytics.com/
