---
layout: post
title-short: Snowplow R114 enrichments
title: "Snowplow R114 enrichments"
tags: [snowplow, enrichment, release]
author: Ben B
category: Releases
permalink: /blog/2019/05/14/snowplow-r114-polonnaruwa-enrichments/
---

[Snowplow 114 Polonnaruwa][snowplow-release], named after
[the ancient city of Polonnaruwa in Sri Lanka](http://whc.unesco.org/en/list/201), is a release focusing mainly on
Scala Common Enrich, the library powering all the different enrichment platforms:
some enrichments have been improved, URL parsing became more relaxed (e.g. support for macros),
a guide about how to add an enrichment to the pipeline has been added,
a new enrichment has been added to the pipeline (YAUAA), as well as a new feature giving the possibility
to use a remote HTTP adapter to validate the payloads (shoutout to [Saeed Zareian](https://github.com/szareiangm) for this feature).

1. [New enrichment: YAUAA (Yet Another UserAgent Analyzer)](#yauaa)
2. [New feature: remote HTTP adapter](#remoteAdapter)
3. [New tutorial: add an enrichment to the pipeline](#tutoEnrichment)
4. [Improvements/fixes](#improvements)

<h2 id="yauaa">1. New enrichment: YAUAA (Yet Another UserAgent Analyzer)</h2>

This enrichment uses [YAUAA](https://yauaa.basjes.nl/) API to parse and analyze the user agent string of an event
and extract as many relevant attributes as possible, like for example the device class (Phone, Tablet, etc.).

This enrichment doesn't require any API key, it's already integrated directly in the pipeline.
It only needs to be activated through the configuration:
{% highlight json %}
{
    "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/yauaa_enrichment_config/jsonschema/1-0-0",
    "data": {
        "enabled": true,
        "vendor": "com.snowplowanalytics.snowplow.enrichments",
        "name": "yauaa_enrichment_config"
    }
}
{% endhighlight %}

The schema of the context added can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/nl.basjes/yauaa_context/jsonschema/1-0-0).
More information about this enrichment can be found on the [wiki page](https://github.com/snowplow/snowplow/wiki/YAUAA-enrichment).

<h2 id="remoteAdapter">2. New feature: remote HTTP adapter</h2>

In the enrichment process, an adapter validates the tracking event sent by a tracker to a collector and formats it, before further processing.
The pipeline has a predefined list of adapters (e.g. Snowplow events, Mailchimp, Pagerduty, etc.)
and for each of them the validation step takes place directly inside the pipeline, inside an enrich job.
With this new feature, it's now possible to send the collector payload to a system external to the pipeline for validation/formatting, thanks to an HTTP request.

The HTTP request sent to a remote adapter contains the following parameters:
- `contentType` -> `payload.contentType`
- `queryString` -> `payload.querystring`
- `headers` -> `payload.context.headers`
- `body` -> `payload.body`

The body of the HTTP response is expexted to be a JSON with either a string field `error` containing the error message if a problem happened
on the remote adapter, or a field `events` which is a list of `Map[String, String]`, each map being placed in the parameters of a raw event
(a collector payload can contain several raw events).

The feature has been added to _Scala Common Enrich_ but can be used only in _stream-enrich_ for now.

Let's imagine that the remote HTTP adapter that we want to use listens to `http://remote-adapter.com:9090`.
We want to send him the collector payloads that have `vendor: special-vendor` and `version: v1`.
To do so, in the configuration file of `stream-enrich` we would need to add:

{% highlight json %}
remoteAdapters = [
   {
       vendor: "special-vendor"
       version: "v1"
       url: "http://remote-adapter.com:9090"
       connectionTimeout: 1000
       readTimeout: 5000
   }
]
{% endhighlight %}

An example of code for an HTTP remote adapter can be found [here](https://github.com/snowplow-incubator/remote-adapter-example/).

<h2 id="tutoEnrichment">3. New tutorial: add an enrichment to the pipeline</h2>

There is now a tutorial that walks a developer through the steps of adding an enrichment to the pipeline.
This tutorial can be found [here](https://github.com/snowplow/snowplow/tree/master/3-enrich#how-to-add-an-enrichment).

<h2 id="improvements">4. Improvements/fixes</h2>

This release improved or fixed different parts of _Scala Common Enrich_.

<h3>4.1. More relaxed URL parsing</h3>

URL parsing, used in the enriched jobs, has become more relaxed.
For example it now supports URLs containing macros like `%%a%%` or `##a##`.
Such URLs would have caused the events to go to bad rows before, but it's not the case any more.

<h3>4.2. xForwardedFor</h3>

If both `X-Forwarded-For` and `Forwarded: for=` are set in the headers, `X-Forwarded-For` now takes priority.

<h3>4.3. IAB enrichment</h3>

Waiting for the underlying lib for IAB enrichment to support IPv6, this enrichment is skipped if the IP of the event is v6,
preventing it to go to bad row.

Events coming from Iglu webhook can have an empty user agent, which would fail IAB enrichment and go to bad rows.
In this case the enrichment is also skipped.

<h3>4.4. Sendgrid integration</h3>

The optional `marketing_campaign_*` fields are now sent by the pipeline.
More info about these fields on [this page](https://sendgrid.com/docs/for-developers/tracking-events/event/). 

<h3>4.5. IP lookup enrichment</h3>

IP lookup enrichment now supports IPs (v4) containing a port.

<h2>5. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r114-polonnaruwa

[r114]: https://github.com/snowplow/snowplow/milestone/167

[discourse]: http://discourse.snowplowanalytics.com/
