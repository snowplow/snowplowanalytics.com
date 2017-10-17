---
layout: post
title-short: Snowplow R95 Ellora
title: "Snowplow R95 Ellora released"
tags: [redshift, aws, emr]
author: Keane
category: Releases
permalink: /blog/2017/10/16/snowplow-r94-ellora-released-zstd-support/
---

We are excited to announce the release of [Snowplow R95 Ellora][snowplow-release].

This release is primarily focused on updates to the `atomic.events` table for Redshift users -
namely a switch to ZSTD encoding. The change in encoding should lead to significant
reductions in the disk space used by `atomic.events` for all of our users who load their Snowplow to
Redshift.

If you’d like to know more about R95 Ellora, named after an [archaeological site in India][ellora]),
please continue reading this post:

<!--more-->

1. [Updating atomic.events to use ZSTD Compression](#zstd)
2. [Update `domain_sessionidx` column in `atomic.events` to accept larger values](#sessionidx)
3. [Support for the newly-introduced Cloudfront format](#cloudfront)
4. [Under the hood](#misc)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

![Ellora][ellora-img]

<h2 id="zstd">1. Updating atomic.events to use ZSTD Compression</h2>

Ever since AWS added ZSTD support for Redshift earlier this year, we’ve been very interested in
applying it to `atomic.events` for the potential reductions in disk space usage
(see issue [#3435][i3435]). Our tests have been highly successful. We’ve found the tradeoff in terms
of performance to be negligible across a variety of query types. Most-notably, we’ve found that
applying ZSTD to `atomic.events` leads to a ~60% reduction in size on average.

Due to it not being possible to modify the compression of table columns in Redshift, a deep copy is
required in order to migrate an already-existing `atomic.events` table to ZSTD (see migration script
in [Upgrading](#upgrading)). We recommend that you have at least 50% Redshift storage space
remaining prior to upgrading your `atomic.events` table. It may be the case that you have
to temporarily resize your cluster and/or pause your pipeline in order to make the switch. To help
with this we’ve written [a migration script][migration-script] along with the
[new table definition][table-defintion].

See the [AWS Documentation][aws-zstd] for more information on ZSTD Compression.

Huge thanks to [Mike Robins][miike] who led the charge on ZSTD support with his excellent
[RFC][zstd-rfc] and the accompanying pull requests.

<h2 id="sessionidx">2. Update domain_sessionidx column in atomic.events to accept larger values</h2>

Some of our users with frequently visited services have faced issues due to recording values higher
than `32767` - enforced by the field being a `smallint`. With the underlying field being a java
`Integer` with a range of -2147483648 to 2147483647, we’ve updated the `domain_sessionidx` to be a
Redshift `INTEGER` (see issue [#1788][i1788]).

<h2 id="cloudfront">3. Support for the newly-introduced Cloudfront format</h2>

Recently, Amazon added a 24th field to [the Cloudfront log file format][cf-format]:
`cs-protocol-version`. As a result, events issued by new Cloudfront distributions would fail
enrichment as being unrecognized. This has been fixed in this release.

<h2 id="misc">4. Under the hood</h2>

<h3 id="url-parsing">4.1 Relaxing `page_url` parsing</h3>

With a number of our users' data failing validation due to URLs containing more than one `#`
characters, we’ve relaxed parsing of those URLs (see issue [#2893][i2893]). As a result, the enrich
process won't reject those kinds of URL anymore.

<h3 id="spark">4.2 Upgrading our Spark jobs to Spark 2.2.0</h3>

In a continuous effort to benefit from the latest performance improvements in Spark, we've updated
our enrich and shred jobs to run on Spark 2.2.0. Given that support for Spark 2.2.0 was introduced
in [EMR AMI 5.9.0][emr-ami], you will need to update the AMI version used in EmrEtlRunner as
explained in the upgrade guide below.

<h3 id="overwrite">4.3 Overwriting output datasets</h3>

Since the enrich and shred jobs are idempotent, we're now allowing overwrites of existing data for
a particular run. This is especially useful during a transient failure so that YARN can retry
a job multiple times.

This makes the `yarn.resourcemanager.am.max-attempts: "1"` configuration optional from now on.

There is a good discussion on the subject on [our Discourse forum][discourse-already-exists].

<h3 id="folder">4.4 New bootstrap action removing empty S3 artifact files</h3>

With recent EMR AMIs, empty files ending with `_$folder$` have been appearing and polluting S3
buckets (the problem is detailed in [the AWS documentation][folder-files]). As a result, listing
and finding files has been longer inside EmrEtlRunner to detect no-op (such as files already
present in the processing bucket). To remedy this issue, we're introducing a bootstrap action that
will delete those useless files from the different buckets used throughout the batch pipeline.

<h3 id="web-model">4.5 Moving the web model to its own repository</h3>

Finally, note that this release moves the web model to its own repository:
https://github.com/snowplow/web-data-model.

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="redshift">5.1 Upgrading your Redshift database</h3>

- [The migration script][migration-script] has been specifically written to update existing
`atomic.events` tables to 0.9.0
- The new atomic.events table definition can be found [here][table-defintion]

<h3 id="emr">5.2 Upgrading EmrEtlRunner</h3>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

In order to leverage the latest job versions, you'll need to make the following changes to your
configuration:

{% highlight yaml %}
aws:
  # ...
  emr:
    ami_version: 5.9.0        # WAS 5.5.0
    # ...
enrich:
  version:
    spark_enrich: 1.10.0      # WAS 1.9.0
storage:
  versions:
    rdb_loader: 0.14.0        # WAS 0.13.0
    rdb_shredder: 0.13.0      # WAS 0.12.0
{% endhighlight %}

For a complete example, see our sample [`config.yml`][config-yml] template.

<h3 id="resolver">5.3 Updating your Iglu resolver</h3>

We've set up a mirror of Iglu central on Google Cloud Platform to maintain high availability in
case of S3 outages. To benefit from this mirror, you'll need to add the following repository to your
Iglu resolver JSON file:

{% highlight json %}
{
  "name": "Iglu Central - Mirror 01",
  "priority": 1,
  "vendorPrefixes": [ "com.snowplowanalytics" ],
  "connection": {
  "http": {
    "uri": "http://mirror01.iglucentral.com"
  }
}
{% endhighlight %}

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R96 [STR] Zeugma][r96], which will add support for NSQ to the stream processing pipeline, ready
for adoption in Snowplow Mini
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream
processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark,
Unbounce, StatusGator)

<h2 id="help">7. Getting Help</h2>

For more details on this release, as always please check out the [release notes][snowplow-release]
on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r95-ellora

[discourse]: http://discourse.snowplowanalytics.com/
[discourse-already-exists]: https://discourse.snowplowanalytics.com/t/shredded-bad-rows-output-directory-already-exists/1442

[ellora]: https://en.wikipedia.org/wiki/Ellora_Caves
[ellora-img]: /assets/img/blog/2017/10/ellora.jpg

[i3435]: https://github.com/snowplow/snowplow/issues/3435
[i1788]: https://github.com/snowplow/snowplow/issues/1788
[i2893]: https://github.com/snowplow/snowplow/issues/2893

[migration-script]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.8.0_to_0.9.0.sql
[table-defintion]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/atomic-def.sql

[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r95_ellora.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r90-lascaux/3-enrich/emr-etl-runner/config/config.yml.sample

[r96]: https://github.com/snowplow/snowplow/milestone/103
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144

[miike]: https://github.com/miike
[zstd-rfc]: https://discourse.snowplowanalytics.com/t/make-big-data-small-again-with-redshift-zstd-compression/1280

[aws-zstd]: http://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html
[emr-ami]: http://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-components.html
[folder-files]: https://aws.amazon.com/premiumsupport/knowledge-center/emr-s3-empty-files/
[cf-format]: http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#LogFileFormat
