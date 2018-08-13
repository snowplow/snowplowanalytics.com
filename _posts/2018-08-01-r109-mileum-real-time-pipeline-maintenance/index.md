---
layout: post
title-short: Snowplow 109 Lambaesis
title: "Snowplow R109 Lambaesis real-time pipeline maintenance"
tags: [snowplow, real-time, collector]
author: Ben
category: Releases
permalink: /blog/2018/08/01/snowplow-r109-lambaesis-real-time-pipeline-maintenance/
---

We are pleased to announce the release of [Snowplow 109 Lambaesis][snowplow-release], named
after [the archeological site in north-eastern Algeria][lambaesis]. This release focuses on
upgrading the real-time pipeline components.

This release is one of the most community-driven release in the history of Snowplow. As such,
we would like to give a huge shoutout to the contributors who made it possible:

- [Kevin Irwin][userkci] and [Rick Bolkey][rbolkey] from [OneSpot][onespot]
- [Saeed Zareian][szareiangm] from [the Globe and Mail](https://www.theglobeandmail.com/)
- [Arihant Surana][arihantsurana] from [BigCommerce](https://www.bigcommerce.com/)
- [Dani Solà][danisola] from [Simply Business](https://www.simplybusiness.co.uk/)
- [Robert Kingston][kingo55] from [Mint Metrics](https://mintmetrics.io/)

Please read on after the fold for:

1. [Enrichment process updates](#se)
2. [Scala Stream Collector updates](#ssc)
3. [EmrEtlRunner bugfix](#eer)
4. [Community updates](#community)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

![lambaesis][lambaesis-img]
Lambese - M. Gasmi / CC-BY 2.5

<h2 id="se">1. Enrichment process updates</h2>

<h3 id="ext">1.1 Externalize the file used for the user agent parser enrichment</h3>

Up until this release, the user agent parser enrichment relied on a "database" of user agents
regexes that was part of the JAR. With this release, we have externalized this file to
decorrelate updates to the file with updates the library which gives us a lot more flexibility.

We will be doing the same thing for the referer parser enrichment in a future release.

Huge thanks to [Kevin Irwin][userkci] for contributing this change!

<h3 id="cf">1.2 More flexible Iglu webhook</h3>

Up until this release if you were to POST a JSON array to the Iglu webhook, such as:

{% highlight bash %}
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '[
    {"name": "name1"},
    {"name": "name2"}
  ]' \
  'http://collector/com.snowplowanalytics.iglu/v1?schema=iglu%3Acom.acme%2Fschema%2Fjsonschema%2F1-0-0'
{% endhighlight %}

The Iglu webhook would assume a singleton event with an array at its root and a schema which would
look like the following:

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

We have now changed this behaviour to instead consider an array as multiple events which, in our
case, would have the following schema:

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

This should ease integration with webhooks which send data in bulk.

<h3 id="cf">1.3 Cloudfront updates</h3>

This release introduces support for the 26-field Cloudfront format that was released in January.
You can find more information in [the AWS documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html#LogFileFormat).
Thanks to [Moshe Demri](https://github.com/mdemri) for signaling the issue.

We have also taken advantage of working on Cloudfront to leverage the `x-forwarded-for` field to
populate the user's ip address.
Thanks a lot to [Dani Solà][danisola] for contributing this change!

<h3 id="ips">1.4 Handle comma-separated list of ips</h3>

Speaking about `X-Forwarded-For` headers, they can contain a comma-separated list of ips in case
the request went through multiple load balancers. The header will indeed accumulate the different
ips, for example:

`X-Forwarded-For: 132.130.245.228, 14.189.65.12, 132.71.227.98`

According to [the specification for this header](http://www.squid-cache.org/Doc/config/follow_x_forwarded_for/),
the first one is supposed to be the original client ip whereas the following ones correspond to
the successive proxies.

Based on these facts, we have made the choice to only conserve the first ip in case of a
comma-separated list.

<h3 id="kinesis">1.5 Enable specifying a custom Kinesis endpoint</h3>

Before this release, the Kinesis endpoint to use for Stream Enrich was determined based on the AWS
region you wanted to run on. Unfortunately, this didn't allow for use of projects like
[localstack](https://github.com/localstack/localstack) which lets you mimick AWS services locally.

Thanks to [Arihant Surana][arihantsurana], it is now possible to
optionally specify a custom endpoint directly through the `customEndpoint` configuration.

Note that this feature is also available for the Scala Stream Collector.

<h3 id="misc">1.6 Miscellaneous updates</h3>

Thanks a lot to [Saeed Zareian][szareiangm] for a flurry of build dependency updates and
[Robert Kingston][kingo55] for example updates.

<h2 id="se">2. Scala Stream Collector updates</h2>

<h3 id="dnt">2.1 Respect a do not track cookie</h3>

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

<h3 id="root">2.2 Customize the response from the root route</h3>

It is now possible to customize what is sent back when hitting the `/` route of the Scala Stream
Collector. Whereas the collector always sent a 404 before, you can now customize it through a
configuration:

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

<h3 id="head">2.3 Support for HEAD requests </h3>

The collector now supports `HEAD` requests wherever `GET` requests were supported previously

<h3 id="crossdomain">2.4 Allow for multiple domains in crossdomain.xml</h3>

You can now specify an array domains when specifying your `/crossdomain.xml` route:

{% highlight hocon %}
crossDomain {
  enabled = false
  domains = [ "*.acme.com", "*.emca.com" ]
  secure = true
}
{% endhighlight %}

<h2 id="eer">3. EmrEtlRunner bugfix</h2>

In [R108][r108-blogpost] we started leveraging the official AWS Ruby SDK in EmrEtlRunner and
replaced our deprecated Sluice library.

However, the functions we wrote to run the different empty checks were recursive and can blow up the
stack if you have a large number of [EMR S3 empty files][emr-s3-empty-files] (more than five
thousands in our tests).

This issue prevents the EMR job from being launched.

We've fixed this issue by making those functions iterative.

<h2 id="community">4. Community updates</h2>

We have taken advantage of this release to improve how we interact with our community of open source
developers. This initiative translates into:

- [A new Gitter room](https://gitter.im/snowplow/snowplow) where you can chat with us on which
feature you want to contribute next
- [A new contributing guide](https://github.com/snowplow/snowplow/blob/master/CONTRIBUTING.md)
- As well as new issue and pull request templates which should hopefully give better guidance if you
are looking to contribute

<h2 id="upgrading">5. Upgrading</h2>

This release applies only to our real-time pipeline on AWS, GCP or on-premise through Kafka - if you
are running any other flavor of Snowplow, there is no upgrade necessary.

<h3 id="upg-se">5.1 Upgrading Stream Enrich</h3>

- artifact
- optional endpoint

<h3 id="upg-ssc">5.2 Upgrading the Scala Stream Collector</h3>

- artifact
- optional endpoint
- dnt
- customizable root route
- crossdomains

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases are:

* [R110 Vallei dei Templi][r110], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r109-lambaesis

[lambaesis]: https://en.wikipedia.org/wiki/Lambaesis
[lambaesis-img]: /assets/img/blog/2018/08/lambaesis.jpg

[userkci]: https://github.com/userkci
[rbolkey]: https://github.com/rbolkey
[onespot]: https://www.onespot.com/
[szareiangm]: https://github.com/szareiangm
[arihantsurana]: https://github.com/arihantsurana
[danisola]: https://github.com/danisola
[kingo55]: https://github.com/kingo55

[discourse]: http://discourse.snowplowanalytics.com/

[r110]: https://github.com/snowplow/snowplow/milestone/151
[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[r108-blogpost]: https://snowplowanalytics.com/blog/2018/07/24/snowplow-r108-val-camonica-with-batch-pipeline-encryption-released/
[emr-s3-empty-files]: https://aws.amazon.com/premiumsupport/knowledge-center/emr-s3-empty-files/

