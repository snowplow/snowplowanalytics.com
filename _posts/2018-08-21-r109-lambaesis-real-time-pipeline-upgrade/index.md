---
layout: post
title-short: Snowplow 109 Lambaesis
title: "Snowplow R109 Lambaesis real-time pipeline upgrade"
tags: [snowplow, real-time, collector]
author: Ben
category: Releases
permalink: /blog/2018/08/21/snowplow-r109-lambaesis-real-time-pipeline-upgrade/
---

We are pleased to announce the release of [Snowplow 109 Lambaesis][snowplow-release], named
after [the archeological site in north-eastern Algeria][lambaesis]. This release focuses on
upgrading the AWS real-time pipeline components, although it also updates EmrEtlRunner and Spark
Enrich for batch pipeline users.

This release is one of the most community-driven releases in the history of Snowplow Analytics. As such,
we would like to give a huge shout-out to each of the contributors who made it possible:

- [Kevin Irwin][userkci] and [Rick Bolkey][rbolkey] from [OneSpot][onespot]
- [Saeed Zareian][szareiangm] from [the Globe and Mail][the-globe-and-mail]
- [Arihant Surana][arihantsurana] from [HiPages][hi-pages]
- [Dani Solà][danisola] from [Simply Business][simply-business]
- [Robert Kingston][kingo55] from [Mint Metrics][mint-metrics]

Please read on after the fold for:

1. [Enrichment process updates](#se)
2. [Scala Stream Collector updates](#ssc)
3. [EmrEtlRunner bugfix](#eer)
4. [Supporting community contributions](#community)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

![lambaesis][lambaesis-img]
<br>
Lambese - M. Gasmi / CC-BY 2.5

<h2 id="se">1. Enrichment process updates</h2>

<h3 id="ext">1.1 Externalizing the file used for the user agent parser enrichment</h3>

Up until this release, the [User Agent Parser Enrichment][ua-parser-enrichment] relied on a "database" of user agent regexes that was embedded along the code. With this release, we have externalized this file to
decorrelate updates to the file from updates to the library, which gives us a lot more flexibility.

This User Agent Parser Enrichment update is available for both batch and real-time users, and we'll be doing the same thing for the Referer Parser Enrichment as well.

Huge thanks to [Kevin Irwin][userkci] for contributing this change!

<h3 id="cf">1.2 More flexible Iglu webhook</h3>

Up to this release, if you were to POST a JSON array to the Iglu webhook, such as:

{% highlight bash %}
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '[
    {"name": "name1"},
    {"name": "name2"}
  ]' \
  'http://collector/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.acme%2Fschema%2Fjsonschema%2F1-0-0'
{% endhighlight %}

The Iglu webhook would assume you were sending a singleton event with an array of objects at its root; the schema would look like the following:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for acme",
  "self": {
    "vendor": "com.acme",
    "name": "schema",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "name": { "type": "string" }
    }
  }
}
{% endhighlight %}

We have now changed this behavior to instead treat an incoming array as multiple events which, in our case, would each have the following schema:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for acme",
  "self": {
    "vendor": "com.acme",
    "name": "schema",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  }
}
{% endhighlight %}

This should make it easier to work with event sources which need to `POST` events to Snowplow in bulk.

<h3 id="ips">1.3 Handle a comma-separated list of IP addresses</h3>

We have seen Snowplow users and customers encountering `X-Forwarded-For` headers containing a comma-separated list of IP addresses, occurring when the request went through multiple load balancers. The header in the raw event payload will indeed accumulate the different IP addresses, for example:

{% highlight bash %}
X-Forwarded-For: 132.130.245.228, 14.189.65.12, 132.71.227.98
{% endhighlight %}

According to [the specification for this header][x-forwarded-for-docs],
the first address is supposed to be the original client IP address whereas the following ones correspond to
the successive proxies.

Based on this, we have made the choice to only conserve the first IP address in the case of a
comma-separated list.

<h3 id="rt">1.4 Stream Enrich updates</h3>

This section is for updates that apply to the real-time pipeline only.

Before this release, the Kinesis endpoint for Stream Enrich was determined by the AWS
region that you wanted to run in. Unfortunately, this didn't allow for use of projects like
[localstack][localstack] which let you mimic AWS services locally.

Thanks to [Arihant Surana][arihantsurana], it is now possible to
optionally specify a custom endpoint directly through the `customEndpoint` configuration.

Note that this feature is also available for the Scala Stream Collector.

<h3 id="batch">1.5 Spark Enrich updates</h3>

This section is for updates that apply to the batch pipeline only.

This release introduces support for the 26-field CloudFront format that was released in January, for Snowplow users processing CloudFront access logs using Snowplow.

You can find more information in [the AWS documentation][cf-logs]; thanks to [Moshe Demri][mdemri] for signaling the issue.

We have also taken advantage of our work on CloudFront to leverage the `x-forwarded-for` field to
populate the user's IP address. Thanks a lot to [Dani Solà][danisola] for contributing this change!

<h3 id="misc">1.6 Miscellaneous updates</h3>

Thanks a lot to [Saeed Zareian][szareiangm] for a flurry of build dependency updates and
[Robert Kingston][kingo55] for example updates.

<h2 id="ssc">2. Scala Stream Collector updates</h2>

<h3 id="dnt">2.1 Reject requests with "do not track" cookies</h3>

The Scala Stream Collector can now reject requests which contain a cookie with a specified name
and value. If the request is rejected based on this cookie, no tracking will happen: no events will
be sent downstream and no cookies will be sent back.

The configuration takes the following form:

{% highlight hocon %}
doNoTrackCookie {
  enabled = false
  name = do-not-track
  value = yes-do-not-track
}
{% endhighlight %}

You will have to set this cookie yourself, on a domain which the Scala Stream Collector can read.

<h3 id="root">2.2 Customize the response from the root route</h3>

It is now possible to customize what is sent back when hitting the `/` route of the Scala Stream
Collector. Whereas the collector always sent a 404 before, you can now customize it through the following configuration:

{% highlight hocon %}
rootResponse {
  enabled = false
  statusCode = 302
  # Optional, defaults to empty map
  headers = {
    Location = "https://127.0.0.1/"
    X-Custom = "something"
  }
  # Optional, defaults to empty string
  body = "302, redirecting"
}
{% endhighlight %}

This neat feature lets you provide an information page about your event collection and processing on the collector's root URL, ready for site visitors to review.

<h3 id="head">2.3 Support for HEAD requests </h3>

The Scala Stream Collector now supports `HEAD` requests wherever `GET` requests were supported previously.

<h3 id="crossdomain">2.4 Allow for multiple domains in crossdomain.xml</h3>

You can now specify an array of domains when specifying your `/crossdomain.xml` route:

{% highlight hocon %}
crossDomain {
  enabled = false
  domains = [ "*.acme.com", "*.acme.org" ]
  secure = true
}
{% endhighlight %}

<h2 id="eer">3. EmrEtlRunner bugfix</h2>

In [R108][r108-blogpost] we started leveraging the official AWS Ruby SDK in EmrEtlRunner and
replaced our deprecated Sluice library.

Unfortunately, the functions we wrote to run the different empty file checks were recursive and can blow up the
stack if you have a large number of [EMR S3 empty files][emr-s3-empty-files] (more than 5,000 files in our tests).

This issue can prevent the Elastic MapReduce job from being launched.

We've now fixed this by making those functions iterative.

On a side note: we now encourage everyone to use `s3a` when referencing buckets in the EmrEtlRunner
configuration because, when using `s3a`, those problematic empty files are simply not generated.

<h2 id="community">4. Supporting community contributions</h2>

We have taken advantage of this release to improve how we support our community of open source
developers and other contributors. This initiative translates into:

- [A new Gitter room for Snowplow][gitter-snowplow], where you can chat with the Snowplow engineers and share ideas on contributions you would like to make to the project
- [A new contributing guide][contributing]
- New issue and pull request templates to give better guidance if you are looking to contribute

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="upg-se">5.1 Upgrading Stream Enrich</h3>

A new version of Stream Enrich incorporating the changes discussed above can be found on our Bintray
[here][se-dl].

<h3 id="upg-seb">5.2 Upgrading Spark Enrich</h3>

If you are a batch pipeline user, you'll need to either update your EmrEtlRunner configuration
to the following:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.16.0 # WAS 1.15.0
{% endhighlight %}

or directly make use of the new Spark Enrich available at:

`s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.16.0.jar`

<h3 id="upg-uap">5.3 Upgrading the User Agent Parser Enrichment</h3>

To make use of an external user agent database, you can update your enrichment file to the
following:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/ua_parser_config/jsonschema/1-0-1",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "ua_parser_config",
    "enabled": true,
    "parameters": {
      "database": "regexes-latest.yaml",
      "uri": "s3://snowplow-hosted-assets/third-party/ua-parser/"
    }
  }
}
{% endhighlight %}

Note the bump to the version `1-0-1` as well as the specification of the location of the user agent
database. The database is the one maintained in the [uap-core repository][uap-core].

An example can be found in [our repository][ua-parser-config].

We will be keeping the external user agent database that we host in Amazon S3 up-to-date as the upstream project releases new versions of it.

<h3 id="upg-ssc">5.4 Upgrading the Scala Stream Collector</h3>

A new version of Stream Enrich incorporating the changes discussed above can be found on our Bintray
[here][ssc-dl].

To make use of this new version, you'll need to amend your configuration in the following ways:

- Add a `doNotTrackCookie` section:

{% highlight hocon %}
doNotTrackCookie {
  enabled = false
  name = cookie-name
  value = cookie-value
}
{% endhighlight %}

- Add a `rootResponse` section:

{% highlight hocon %}
rootResponse {
  enabled = false
  statusCode = 200
  body = “ok”
}
{% endhighlight %}

- Turn `crossDomain.domain` into `crossDomain.domains`:

{% highlight hocon %}
crossDomain {
  enabled = false
  domains = [ "*.acme.com", "*.emca.com" ]
  secure = true
}
{% endhighlight %}

A full configuration can be found [in the repository][ssc-config].

<h3 id="upg-eer">5.5 Upgrading EmrEtlRunner</h3>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

We also encourage people to switch all of your bucket paths to `s3a`, which will prevent the pipeline's S3DistCp steps from creating empty files, like so:

{% highlight yaml %}
aws:
  s3:
    bucket:
      raw:
        in:
          - "s3a://bucket/in"
        processing: "s3a://bucket/processing"
        archive: "s3a://bucket/archive/raw"
      enriched:
        good: "s3a://bucket/enriched/good"
        bad: "s3a://bucket/enriched/bad"
        errors: "s3a://bucket/enriched/errors"
        archive: "s3a://bucket/archive/enriched"
      shredded:
        good: "s3a://bucket/shredded/good"
        bad: "s3a://bucket/shredded/bad"
        errors: "s3a://bucket/shredded/errors"
        archive: "s3a://bucket/archive/shredded"
...
{% endhighlight %}

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases include:

* [R110 Vallei dei Templi][r110], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]
* [R11x [BAT] Increased stability][r11x-stability], improving batch pipeline stability

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r109-lambaesis

[lambaesis]: https://en.wikipedia.org/wiki/Lambaesis
[lambaesis-img]: /assets/img/blog/2018/08/lambaesis.jpg


[simply-business]: https://www.simplybusiness.co.uk/
[userkci]: https://github.com/userkci
[rbolkey]: https://github.com/rbolkey
[onespot]: https://www.onespot.com/
[szareiangm]: https://github.com/szareiangm
[arihantsurana]: https://github.com/arihantsurana
[kingo55]: https://github.com/kingo55
[danisola]: https://github.com/danisola

[discourse]: http://discourse.snowplowanalytics.com/

[contributing]: https://github.com/snowplow/snowplow/blob/master/CONTRIBUTING.md

[ua-parser-enrichment]: https://github.com/snowplow/snowplow/wiki/ua-parser-enrichment

[x-forwarded-for-docs]: http://www.squid-cache.org/Doc/config/follow_x_forwarded_for/
[localstack]: https://github.com/localstack/localstack

[gitter-snowplow]: https://gitter.im/snowplow/snowplow

[the-globe-and-mail]: https://www.theglobeandmail.com/
[hi-pages]: https://www.homeimprovementpages.com.au/
[mint-metrics]: https://mintmetrics.io/

[cf-logs]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#LogFileFormat
[mdemri]: https://github.com/mdemri

[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r109_lambaesis.zip
[se-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.19.0#files
[ssc-dl]: https://bintray.com/snowplow/snowplow-generic/snowplow-scala-stream-collector/0.14.0#files

[uap-core]: https://github.com/ua-parser/uap-core
[ua-parser-config]: https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/ua_parser_config.json
[ssc-config]: https://github.com/snowplow/snowplow/blob/r109-lambaesis/2-collectors/scala-stream-collector/examples/config.hocon.sample

[r110]: https://github.com/snowplow/snowplow/milestone/151
[r11x-stability]: https://github.com/snowplow/snowplow/milestone/162
[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[r108-blogpost]: https://snowplowanalytics.com/blog/2018/07/24/snowplow-r108-val-camonica-with-batch-pipeline-encryption-released/
[emr-s3-empty-files]: https://aws.amazon.com/premiumsupport/knowledge-center/emr-s3-empty-files/
