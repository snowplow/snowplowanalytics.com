---
layout: post
title: "Snowplow R99 Carnac released with Google Analytics support"
title-short: Snowplow R99 Carnac
tags: [google analytics, measurement protocol]
author: Ben
category: Releases
permalink: /blog/2018/01/25/snowplow-r99-carnac-with-google-analytics-support/
---

We are pleased to announce the release of [Snowplow R99 Carnac][release-notes]. This batch pipeline
release debuts the much anticipated Google Analytics integration in Snowplow.

We are initially adding support for Google Analytics to the Snowplow batch pipeline; extending this support to the real-time pipeline will follow in due course.

Read on for more information on R99 Carnac, named after
[the collection of megalithic sites around the village of Carnac in Britanny, France][carnac]:

<!--more-->

1. [Why integrate Google Analytics into Snowplow?](#why)
2. [Overall architecture](#architecture)
3. [The Snowplow Google Analytics plugin](#plugin)
4. [New Iglu Central schemas](#schemas)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

<h2 id="why">1. Why integrate Google Analytics into Snowplow?</h2>

Back in May, we put out [an RFC on sending Google Analytics events into Snowplow][rfc]. The central idea
is to allow data sent using [the Google Analytics JavaScript tag][ga] or
[the Measurement Protocol][mp] to be seamlessly integrated into the Snowplow pipeline as events and
contexts.

To quote the RFC on why we went through the trouble of integrating Google Analytics events in
Snowplow:

>Google Analytics is the most widely used digital analytics platform in the world. And for good
>reason: it’s a great product - and it’s free!
>
>However, as all Snowplow users will be aware, there are significant limitations with Google
>Analytics - especially with the free product:
>
>- Access to your own data is mediated via Google. You can access your data via the Google Analytics
>UI and APIs, but there are many restrictions on what data you can fetch, the volume of data you can
>fetch and the granularity of data you can fetch. In addition, only a subset of data is available in
>real-time
>- Google Analytics applies a standard set of data processing (modeling) steps on the data that are
>standard across it’s enormous user base; this data modeling includes sessionization and marketing
>attribution. These steps are not necessarily appropriate for all users
>- Google Analytics data is sampled. You can understand why Google would want to fall back to
>sampling: this has significant implications when you’re providing a product like Google Analytics,
>with such an enormous user base, for free. But it is a pain if you want to perform very particular
>analyses on very particular subsets of users, for example, because the data becomes unreliable as
>the sample size drops
>
>Many of the above reasons are motivations for Google Analytics users to setup Snowplow alongside
>Google Analytics. However there is some overhead to doing this, particularly on the tracking side:
>for every Google tag that you create, you need to integrate a comparable Snowplow tracking tag.
>
>By adding native support for Google Analytics and the Measurement Protocol to Snowplow, it should
>be straightforward for any GA user to add a single small snippet of JavaScript to their setup to
>push their data to Snowplow as well as GA, and thus benefit from all the opportunities that
>Snowplow opens up for them.

Since the release of the RFC, we've been hard at work on making this a reality.

<h2 id="architecture">2. Overall architecture</h2>

To make things as plug-and-play as possible, we've chosen to write [a Google Analytics plugin][ga-plugin]
which will intercept requests made to Google Analytics' endpoint and duplicate them to a
Snowplow collector.

On the Snowplow side of things, we've extended our pipeline to handle Google Analytics events through
a new adapter (a component translating specific third-party events into Snowplow ones), plus a set of Iglu
schemas describing Google Analytics events.

The following diagram sums up our approach:

![schema][ga-schema-img]

We'll be detailing each subsystem in turn.

<h2 id="plugin">3. The Snowplow Google Analytics plugin</h2>

As mentioned above, we have written a small open-source Google Analytics plugin that will mirror the
requests made to Google Analytics to your Snowplow collector. It is available
[on GitHub][spga-plugin], and hosted on our CloudFront.

It is fairly straightforward to setup, integrating nicely into your existing Google Analytics
setup:

{% highlight javascript %}
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-12345-1', 'auto');
  ga('require', 'spGaPlugin', { endpoint: 'https://events.acme.com' });
  ga('send', 'pageview');
</script>
<script async src="https://d1fc8wv8zag5ca.cloudfront.net/sp-ga-plugin/0.1.0/sp-ga-plugin.js"></script>
{% endhighlight %}

Note that only two lines differ from the usual Google Analytics setup:

- `ga('require', 'spGaPlugin', { endpoint: 'https://events.acme.com' });` which will instantiate our
plugin configured to mirror requests to the `https://events.acme.com` Snowplow collector endpoint
- `<script async src="https://d1fc8wv8zag5ca.cloudfront.net/sp-ga-plugin/0.1.0/sp-ga-plugin.js"></script>` which will load our plugin code.

<h2 id="schemas">4. New Iglu Central schemas</h2>

Google Analytics support comes with a host of new schemas which are available as:

- A spreadsheet on [Google Drive][spreadsheet]
- The schemas themselves in [the Iglu Central repository][mp-schemas]

As the multitude of schemas indicates, the approach we took involved breaking down the
Google Analytics payloads into a large set of closely-defined entities.

As a result, a Google Analytics payload will result in a single enriched event consisting of:

1. A self-describing JSON, populated into the `unstruct_event` field and determined by the Google Analytics'
event `hitType`
2. Zero or more self-describing JSONs, populated into the `contexts` field and determined by the rest of the contextual information in the Google Analytics payload

As an example, let's take [a pageview event from the Measurement Protocol definition][pageview]. Processing this in Snowplow
will result in an enriched event with:

- A `page_view` entity as `unstruct_event`
- A list of additional `user`, `hit`, `system_info` and similar entities stored in the `contexts` field

<h2 id="upgrading">5. Upgrading</h2>

On the client-side you will need to make use of the plugin as described in [section 3](#plugin).

To benefit from the new Google Analytics integration on the batch pipeline side, you'll need to bump the
Spark Enrich version used in the EmrEtlRunner configuration file:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.12.0
{% endhighlight %}

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R100 [BAT] PII Enrichment phase 1][r100-pii], the first wave of GDPR features being added to Snowplow, centred on a new enrichment which can pseudonymize sensitive personally identifiable information
* [R10x [STR] GCP support][r10x-gcp], which will let you run the Snowplow realtime pipeline on
Google Cloud Platform
* [R10x [BAT] Priority fixes][r10x-bat], various stability, security and data quality improvements for the batch pipeline

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[ga-schema-img]: /assets/img/blog/2018/01/ga-schema.jpg

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r99-carnac
[discourse]: http://discourse.snowplowanalytics.com/

[r100-pii]: https://github.com/snowplow/snowplow/milestone/149
[r10x-gcp]: https://github.com/snowplow/snowplow/milestone/138
[r10x-bat]: https://github.com/snowplow/snowplow/milestone/145

[rfc]: https://discourse.snowplowanalytics.com/t/sending-google-analytics-events-into-snowplow/1201
[ga]: https://analytics.google.com/analytics/web
[mp]: https://developers.google.com/analytics/devguides/collection/protocol/v1/
[ga-plugin]: https://developers.google.com/analytics/devguides/collection/analyticsjs/using-plugins
[spga-plugin]: https://github.com/snowplow-incubator/snowplow-google-analytics-plugin
[mp-schemas]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.google.analytics.measurement-protocol
[spreadsheet]: https://docs.google.com/spreadsheets/d/1Y4dLkFPWhAqtWdjQA-C4Oi-5dTyrw8hD3xA8_DdcklM/edit#gid=0
[pageview]: https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#page
