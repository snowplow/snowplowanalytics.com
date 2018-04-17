---
layout: post
title: "Snowplow R103 Paestum released with IP Lookups Enrichment upgrade"
title-short: Snowplow R103 Paestum
tags: [enrichments, clojure collector, ip lookups]
author: Ben
category: Releases
permalink: /blog/2018/04/17/snowplow-r103-paestum-released-with-ip-lookups-enrichment-upgrade/
---

We are proud to announce the release of [Snowplow R103 Paestum][release-notes]. This release is
centered around upgrading the [IP Lookups Enrichment][ip-lookups-enrichment] for both the batch and streaming pipelines given
the impending end of life of Maxmind's legacy databases.

It also ships with a security improvement for cross-domain policy management on the Clojure
Collector.

Read on for more information on R103 Paestum, named after [the ancient city in in Italy][paestum]:

<!--more-->

1. [Upgrading the IP lookups enrichment](#ip-lookups)
2. [Cross domain policy management for the Clojure collector](#cdp)
3. [PII enrichment for the batch pipeline](#pii)
4. [Community contributions](#oss)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

![paestum][paestum-img]

<h2 id="ip-lookups">1. Upgrading the IP Lookups Enrichment</h2>

As described in [our Discourse post][disc-ip-lookups], MaxMind will not provide monthly updates to
their now-legacy databases starting April 2nd.

To tackle this issue and keep the IP Lookups Enrichment as accurate as possible, we are
releasing a new version of the enrichment, for both the batch and streaming pipelines, which
interacts with GeoIP2 databases, Maxmind's new format.

A special thanks to [Tiago Macedo][tmacedo] and [Andrew Korzhuev][andrusha], who worked on
[the scala-maxmind-iplookups library upgrade][scala-maxmind-iplookups], without which this
enrichment upgrade wouldn't have been possible.

<h2 id="cdp">2. Cross-domain policy management for the Clojure collector</h2>

On the security side of things, we have made the cross-domain policy of the Clojure Collector
configurable; this change is inline with the updates made to the Scala Stream Collector back in [Release 98 Argentomagus][r98-ssc].

First, what is a Flash cross-domain policy? Quoting the [Adobe website][cross-domain]:

> A cross-domain policy file is an XML document that grants a web client, such as Adobe Flash Player
or Adobe Acrobat (though not necessarily limited to these), permission to handle data across
domains. When clients request content hosted on a particular source domain and that content make
requests directed towards a domain other than its own, the remote domain needs to host a
cross-domain policy file that grants access to the source domain, allowing the client to continue
the transaction.
>
> To allow a Flash media player hosted on another web server to access content from the Adobe Media
Server web server, we require a crossdomain.xml file. A typical use case will be HTTP streaming
(VOD or Live) to a Flash Player. The crossdomain.xml file grants a web client the required
permission to handle data across multiple domains.

A cross-domain policy file gives the necessary permissions when, for example, you are trying to make
a request to a Snowplow collector from a Flash game given that both are running on different hosts.

The Clojure Collector embeds what was a very permissive cross-domain policy file, giving
permission to any domain and not enforcing HTTPS:

{% highlight xml %}
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*" secure="false" />
</cross-domain-policy>
{% endhighlight %}

With this release, we're completely removing the `/crossdomain.xml` route by default - should you need it, manually re-enable it by adding the two following environment properties to your Elastic Beanstalk application:

- `SP_CDP_DOMAIN`: the domain that is granted access, `*.acme.com` will match both `http://acme.com`
and `http://sub.acme.com`.
- `SP_CDP_SECURE`: a boolean indicating whether to only grant access to HTTPS or both HTTPS and
HTTP sources

<h2 id="pii">3. PII enrichment for the batch pipeline</h2>

This release also marks the availability of the PII enrichment for the batch pipeline, check out
[the dedicated blog post][r100-bp] to know more.

<h2 id="oss">4. Community contributions</h2>

This release contains quite a few community contributions which we'd like to highlight, huge thanks
to everyone involved!

<h3 id="ip">4.1 Improvement to the IP address extractor</h3>

Thanks to [Mike Robins][miike] from [Snowflake Analytics][snowflake-analytics], extracting IP
addresses from collector payloads originating from the Scala Stream Collector has gotten better.

Snowplow now successfully extracts IPv6 IPs from these Scala Stream Collector payloads, and now inspects the `Forwarded` header in addition to the
historically supported `X-Forwarded-For` header.

<h3 id="mandrill">4.2 Improvements to the Mandrill integration</h3>

An unexpected `subaccount` property in the Mandrill events format has meant that many Mandrill events have been failing enrichment.

To resolve this, community member [Adam Gray][acgray] has authored new 1-0-1 schemas for our Mandrill events, and updated the adapter to emit these new versions.

<h3 id="doc">4.3 Documentation improvements</h3>

Finally, thanks to [Kristoffer Snabb][ksnabb] and [Thales Mello][thalesmello] for improving the
repo-embedded documentation, as follows:

- Redirecting our users to Discourse for support requests in our `CONTRIBUTING.md`
- Renaming Caravel to Superset in our `README.md`

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="upgrading-ip">5.1 Upgrading the IP Lookups Enrichment</h3>

Whether you are using the batch or streaming pipeline, it is important to perform this upgrade if
you make use of the MaxMind IP Lookups Enrichment.

To make use of the new enrichment, you will need to update your `ip_lookups.json` so that it
conforms to [the new `2-0-0` schema][ip-lookups-schema].

An example is provided in [the GitHub repository][ip-lookups-example].

<h4 id="upgrading-ip-stream">5.1.1 Stream Enrich</h4>

If you are a streaming pipeline user, a version of Stream Enrich incorporating the upgraded IP
Lookups Enrichment can be found on our Bintray [here][se].

<h4 id="upgrading-ip-batch">5.1.2 Spark Enrich</h4>

If you are a batch pipeline user, you'll need to either update your EmrEtlRunner configuration
to the following:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.13.0 # WAS 1.12.0
{% endhighlight %}

or directly make use of the new Spark Enrich available at:

`s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.13.0.jar`

<h3 id="upgrading-clj">5.2 Upgrading the Clojure Collector</h3>

The new Clojure Collector is available in S3 at:

`s3://snowplow-hosted-assets/2-collectors/clojure-collector/clojure-collector-2.0.0-standalone.war`

To re-enable the `/crossdomain.xml` path, make sure to specify the `SP_CDP_DOMAIN` and `SP_CDP_SECURE`
environment properties as described above.

<h2 id="roadmap">6. Roadmap</h2>

We have a packed schedule of new and improved features coming for Snowplow. Upcoming Snowplow releases will include:

* [R104 Stoplesteinan][r104-fix], fixing some issues in EmrEtlRuner's "Stream Enrich mode" which were identified in R102 following release
* [R10x [STR] PII Enrichment phase 2][r10x-pii], enhancing our recently-released GDPR-focused PII
  Enrichment for the realtime pipeline
* [R10x [STR] New webhooks and enrichment][r10x-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[paestum]: https://en.wikipedia.org/wiki/Paestum
[paestum-img]: /assets/img/blog/2018/04/paestum.jpg

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r103-paestum
[discourse]: http://discourse.snowplowanalytics.com/

[r104-fix]: https://github.com/snowplow/snowplow/milestone/157
[r10x-pii]: https://github.com/snowplow/snowplow/milestone/153
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[r10x-ms]: https://github.com/snowplow/snowplow/milestone/158

[r100-pii]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/#pii-enrichment
[r98-ssc]: https://snowplowanalytics.com/blog/2018/01/05/snowplow-r98-argentomagus/#flash

[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
[cross-domain]: http://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html

[ip-lookups-enrichment]: https://github.com/snowplow/snowplow/wiki/IP-lookups-enrichment
[disc-ip-lookups]: https://discourse.snowplowanalytics.com/t/end-of-life-for-the-maxmind-legacy-ip-lookups-databases-important/1863
[scala-maxmind-iplookups]: https://github.com/snowplow/scala-maxmind-iplookups
[ip-lookups-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ip_lookups/jsonschema/2-0-0
[ip-lookups-example]: https://github.com/snowplow/snowplow/blob/r103-paestum/3-enrich/config/enrichments/ip_lookups.json

[se]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.16.0#files

[miike]: https://github.com/miike
[snowflake-analytics]: https://www.snowflake-analytics.com/
[acgray]: https://github.com/acgray
[ksnabb]: https://github.com/ksnabb
[thalesmello]: https://github.com/thalesmello

[tmacedo]: https://github.com/tmacedo
[andrusha]: https://github.com/andrusha
