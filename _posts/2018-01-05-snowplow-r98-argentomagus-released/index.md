---
layout: post
title: "Snowplow 98 Argentomagus released"
title-short: Snowplow 98 Argentomagus
tags: [collector]
author: Ben
category: Releases
permalink: /blog/2018/01/05/snowplow-r98-argentomagus/
---

We are pleased to announce the release of [Snowplow R98 Argentomagus][release-notes]. This realtime pipeline release brings some critical security and quality-related improvements, new Scala Stream Collector capabilities plus the introduction of the four webhooks introduced in [R97 Knossos's][r97] to the realtime pipeline.

The new features for the Scala Stream Collector were driven by community member [Rick Bolkey][rbolkey] from [OneSpot][onespot] - huge thanks Rick!

Read on for more information on R98 Argentomagus, named after [the ancient Roman city located in central France][argentomagus]:

<!--more-->

1. [Stream Enrich: better timestamp validation](#ts)
2. [Scala Stream Collector: configurable Flash cross-domain policy](#flash)
3. [Other Scala Stream Collector improvements](#ssc)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![argentomagus][argentomagus-img]

<h2 id="ts">1. Stream Enrich: better timestamp validation</h2>

Prior to this release both the realtime and batch enrichment processes would let nonsensical
timestamps, such as `22017-11-28 10:01:36`, through. However, those events would fail loading into
the database of your choice.

With Argentomagus, our realtime enrichment process will now reject those events, which will be routed to the "bad rows" event stream.

This data quality improvement will make its way to the batch pipeline in the next release.

<h2 id="flash">2. Scala Stream Collector: configurable Flash cross-domain policy</h2>

On the security side of things, we have made the cross domain policy of the Scala Stream Collector
configurable.

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

The Scala Stream Collector embeds what was a very permissive cross-domain policy file, giving
permission to any domain and not enforcing HTTPS:

{% highlight xml %}
<?xml version="1.0"?>
<cross-domain-policy>
  <allow-access-from domain="*" secure="false" />
</cross-domain-policy>
{% endhighlight %}

With Release 98, we're completely removing the `/crossdomain.xml` route by default - it will have
to be manually re-enabled by adding the following `crossDomain` section to the configuration:

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

[Rick Bolkey][rbolkey] from [OneSpot][onespot] has contributed a whole suite of improvements to the Scala Stream Collector -
much appreciated, Rick.

<h3 id="replacement-macro">3.1 URL redirect replacement macro</h3>

This new feature lets you scan your redirect for a pattern and replaces it with the `network_userid`. This is a powerful tool for performing *cookie matching*, aka "cookie sync", for sharing your Snowplow third-party cookie IDs with an ad platform or similar.

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
http://example.com?nuid=123
{% endhighlight %}

Where `123` is the `network_userid`.

<h3 id="scheme">3.2 Preserving the HTTP scheme when leveraging cookie bounce</h3>

In [Snowplow R93 Virunum][r93], we introduced [cookie bounce][cookie-bounce]. The limitation of this feature was
that, when running Scala Stream Collectors behind a load balancer, redirects would lose the original
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

Note that for AWS Classic ELB, the original request's scheme is contained in the `X-Forwarded-Proto` header; your load balancer may use a different header.

<h3 id="redirect">3.3 Bypassing Akka-HTTP partial URL decoding of redirects</h3>

When using redirects, the Scala Stream Collector would leverage the built-in `Location` header
provided by [Akka-HTTP][akka-http], the HTTP server library used by the Scala Stream Collector.

However, if this redirect contained a URL as a query parameter, this URL would be partially
decoded and would not be resolvable. This has been fixed in Argentomagus.

<h2 id="upgrading">4. Upgrading</h2>

The real-time applications for R98 Argentomagus are available at the following locations:

{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.12.0.zip
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.13.0.zip
{% endhighlight %}

Docker images for those new artifacts will follow [shortly][docker-rel-3].

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R99 [BAT] GDPR support][r99-gdpr], the first wave of GDPR features being added to Snowplow
* [R9x [STR] GCP support][r9x-gcp], which will let you run the Snowplow realtime pipeline on
Google Cloud Platform
* [R9x [BAT] Priority fixes][r9x-bat], the release analogous to this one for the batch pipeline

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[argentomagus]: https://en.wikipedia.org/wiki/Argentomagus
[argentomagus-img]: /assets/img/blog/2017/12/argentomagus.jpg

[r93]: https://snowplowanalytics.com/blog/2017/10/03/snowplow-r93-virunum-released-realtime-pipeline-refresh/
[r97]: https://snowplowanalytics.com/blog/2017/12/18/snowplow-r97-knsossos-released/

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r97-zeugma
[discourse]: http://discourse.snowplowanalytics.com/

[r99-gdpr]: https://github.com/snowplow/snowplow/milestone/149
[r9x-gcp]: https://github.com/snowplow/snowplow/milestone/138
[r9x-bat]: https://github.com/snowplow/snowplow/milestone/145
[docker-rel-3]: https://github.com/snowplow/snowplow-docker/milestone/3

[cross-domain]: http://www.adobe.com/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html
[cookie-bounce]: https://snowplowanalytics.com/blog/2017/10/03/snowplow-r93-virunum-released-realtime-pipeline-refresh/#cookie-bounce

[rbolkey]: https://github.com/rbolkey
[onespot]: https://www.onespot.com/
[akka-http]: https://doc.akka.io/docs/akka-http/current/index.html
