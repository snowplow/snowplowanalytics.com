---
layout: post
title: "Snowplow 98 Argentomagus released"
title-short: Snowplow 98 Argentomagus
tags: [collector]
author: Ben
category: Releases
permalink: /blog/2017/12/29/snowplow-r98-argentomagus/
---

We are pleased to announce the release of Snowplow 98 Argentomagus. This realtime release comes with
a couple of critical security and quality-related improvements as well as quite a few new features
for the Scala Stream Collector (which have been led by [Rick Bolkey][rbolkey] from
[OneSpot][onespot] so huge thanks to him) in addition to bringing support for the four webhooks
introduced in [release 97][r97] to the realtime pipeline.

Read on for more information on R98 Argentomagus, named after
[an ancient Roman city located in central France][argentomagus]:

<!--more-->

1. [Better timestamp validation](#ts)
2. [Configurable Flash cross-domain policy](#flash)
3. [Other Scala Stream Collector improvements](#ssc)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![argentomagus][argentomagus-img]

<h2 id="ts">1. Better timestamp validation</h2>

Prior to this release both the realtime and batch enrichment processes would let nonsensical
timestamps, such as 22017-11-28 10:01:36, through. However, those events would fail loading into
the database of your choice.

With Argentomagus, we are deploying the counter measure of failing enrichment for those events to
the realtime pipeline. As a result, they will now end up in the stream containing the events which
failed enrichment.

This data quality improvement will make its way to the batch pipeline in the next release.

<h2 id="flash">2. Configurable Flash cross-domain policy</h2>

On the security side of things, we have made the cross domain policy of the Scala Stream Collector
configurable.

First, what is a cross domain policy file? Quoting the [Adobe website][cross-domain]:

>A cross-domain policy file is an XML document that grants a web client, such as Adobe Flash Player
or Adobe Acrobat (though not necessarily limited to these), permission to handle data across
domains. When clients request content hosted on a particular source domain and that content make
requests directed towards a domain other than its own, the remote domain needs to host a
cross-domain policy file that grants access to the source domain, allowing the client to continue
the transaction.
To allow a Flash media player hosted on another web server to access content from the Adobe Media
Server web server, we require a crossdomain.xml file. A typical use case will be HTTP streaming
(VOD or Live) to a Flash Player. The crossdomain.xml file grants a web client the required
permission to handle data across multiple domains.

A cross-domain policy file gives the necessary permissions when, for example, you are trying to make
a request to a Snowplow collector from a Flash game given that both are running on different hosts.

The Scala Stream Collector used to be very permissive regarding this cross domain policy file giving
permission to any domain and not enforcing HTTPS:

{% highlight xml %}
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*" secure="false" />
</cross-domain-policy>
{% endhighlight %}

With release 98, we're completely removing the `crossdomain.xml` route by default and it will have
to be manually turned on by adding the following `crossDomain` section to the configuration:

{% highlight hocon %}
collector {
  # ...
  crossDomain {
    # Domain that is granted access, *.acme.com will match http://acme.com and http://sub.acme.com
    domain = "*"
    # Whether to only grant access to HTTPS or both HTTPS and HTTP sources
    secure = true
  }
}
{% endhighlight %}

<h2 id="ssc">3. Other Scala Stream Collector improvements</h2>

All those improvements have been contributed by [Rick Bolkey][rbolkey] from [OneSpot][onespot],
once again, huge thanks to him!

<h3 id="replacement-macro">3.1 URL redirect replacement macro</h3>

This new features lets you scan your redirect for a pattern and replaces it by the network user id.

As an example, let's say you've enabled this feature by adding the following to your configuration:

{% highlight hocon %}
collector {
  # ...
  redirectMacro {
    enabled = true
    placeholder = "[TOKEN]"
  }
}
{% endhighlight %}

And you're making a redirect request to:

{% highlight bash %}
http://{{your collector endpoint}}/r/tp2?u=http%3A%2F%2Fexample.com%3Fnuid%3D[TOKEN]
{% endhighlight %}

The redirect will point to:

{% highlight bash %}
http://example.com?nuid=deadbeef-dead-beef-dead-beef-dead-beef
{% endhighlight %}

Where `deadbeef-dead-beef-dead-beef-dead-beef` is the network user id.

<h3 id="scheme">3.2 Preserving the HTTP scheme when leveraging cookie bounce</h3>

In Snowplow 93, we introduced [cookie bounce][cookie-bounce]. The problem with this feature was
that when running Scala Stream Collectors behind a load balancer redirects would lose the original
request's scheme and `http` would always be assumed.

Now you can leverage a header specifying the original scheme and use it in your redirect with
the following configuration:

{% highlight hocon %}
collector {
  # ...
  cookieBounce {
    # ...
    forwardedProtocolHeader = "X-Forwarded-Proto"
  }
}
{% endhighlight %}

For AWS Classic ELB, the original request's scheme is contained in the `X-Forwarded-Proto` header.

<h3 id="redirect">3.3 Bypassing Akka-HTTP partial URL decoding of redirects</h3>

When using redirects, the Scala Stream Collector would leverage the built-in `Location` header
provided by [Akka-HTTP][akka-http], the HTTP server library the Scala Stream Collector uses.
However, if this redirect contained an URL as a query parameter, this URL would be partially
decoded and would not be resolvable. This has been fixed in release 98.

<h2 id="upgrading">4. Upgrading</h2>

The real-time applications for R98 Argentomagus are available at the following locations:

{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.12.0.zip
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.13.0.zip
{% endhighlight %}

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R99 [BAT] GDPR support][r99-gdpr], the first wave of GDPR features being added to Snowplow
* [R9x [STR] GCP support][r9x-gcp], which will let you run the Snowplow realtime pipeline on
Google Cloud Platform

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on Github.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[argentomagus]: https://en.wikipedia.org/wiki/Argentomagus
[argentomagus-img]: /assets/img/blog/2017/12/argentomagus.jpg

[r97]: https://snowplowanalytics.com/blog/2017/12/18/snowplow-r97-knsossos-released/

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r97-zeugma
[discourse]: http://discourse.snowplowanalytics.com/

[r99-gdpr]: https://github.com/snowplow/snowplow/milestone/149
[r9x-gcp]: https://github.com/snowplow/snowplow/milestone/138

[cross-domain]: http://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html
[cookie-bounce]: https://snowplowanalytics.com/blog/2017/10/03/snowplow-r93-virunum-released-realtime-pipeline-refresh/#cookie-bounce

[rbolkey]: https://github.com/rbolkey
[onespot]: https://www.onespot.com/
[akka-http]: https://doc.akka.io/docs/akka-http/current/index.html
