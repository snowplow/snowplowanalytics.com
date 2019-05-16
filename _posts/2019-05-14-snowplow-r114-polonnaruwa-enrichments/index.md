---
layout: post
title-short: "Snowplow R114 with new adapter, enrichment and other improvements"
title: "Snowplow R114 released with new adapter, enrichment and other improvements"
tags: [snowplow, enrichment, release]
author: Ben B
category: Releases
permalink: /blog/2019/05/14/snowplow-r114-polonnaruwa-enrichments/
---

We are pleased to release [Snowplow 114 Polonnaruwa][snowplow-release], named after
[the ancient city of Polonnaruwa in Sri Lanka](http://whc.unesco.org/en/list/201). This Snowplow release includes a number of new features and updates, most of which live in
Scala Common Enrich:

1. [New enrichment: YAUAA (Yet Another UserAgent Analyzer)](#yauaa)
2. [New feature: remote HTTP adapter](#remoteAdapter)
3. [New tutorial: add an enrichment to the pipeline](#tutoEnrichment)
4. [Other improvements](#improvements)
5. [Updates for EmrEtlRunner](#eer)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Getting help](#help)

<h2 id="yauaa">1. New enrichment: YAUAA (Yet Another UserAgent Analyzer)</h2>

Understanding what device a website visitor is using, and what browser and operating system they are running, is incredibly valuable. They can, for example, be used to:

* Understand how user engagement varies by device: Are patterns of engagement different for users on the go (on their mobiles), vs tablets and desktop? If so - how does that engagement vary?
* Identify issues with the user experience on particular devices, operating systems or browsers

Device detection on web is typically done using the useragent string. Prior to this release, Snowplow supported two different user agent enrichments, that each used a different library to derive additional data points about the device events occur on. The [User Agent Utils enrichment](https://github.com/snowplow/snowplow/wiki/user-agent-utils-enrichment) used the [User-agent-utils](https://www.bitwalker.eu/software/user-agent-utils) library to infer the following data points from the useragent string:

* `br_name`
* `br_family`
* `br_version`
* `br_type`
* `br_renderengine`
* `os_name`
* `os_family`
* `os_manufacturer`
* `dvce_type`
* `dvce_ismobile`

The library was deprecated and so we recommended users employ a second [ua-parser](https://github.com/snowplow/snowplow/wiki/ua-parser-enrichment) enrichment, which used the [Browserscope user agent parser](https://github.com/ua-parser/uap-core/) to infer the following fields, all located in the [`ua_parser_context`](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0):

* `useragent_family`
* `useragent_major`
* `useragent_minor`
* `useragent_patch`
* `useragent_version`
* `os_family`
* `os_minor`
* `os_patch`
* `os_patch_minor`
* `os_version`
* `device_family`

However, a [number of users spotted issues with the detection of particular devices](https://discourse.snowplowanalytics.com/t/how-to-track-devices-and-or-models/1519) and as a result, we have released another useragent enrichment, this time based on the [YAUAA](https://github.com/nielsbasjes/yauaa) ("Yet another user agent analyzer") library. The YAUAA enrichment can easily be enabled by adding the following config file to your enrichments:


It populates the following fields in the new [YAUAA context](https://github.com/snowplow/iglu-central/blob/master/schemas/nl.basjes/yauaa_context/jsonschema/1-0-0), which includes a raft of new fields:

* `device_class`
* `device_name`
* `device_brand`
* `device_cpu`
* `device_cpu_bits`
* `device_firmware_version`
* `device_version`
* `operating_system_class`
* `operating_system_name`
* `operating_system_name_version`
* `operating_system_version_build`
* `layout_engine_class`
* `layout_engine_name`
* `layout_engine_version`
* `layout_engine_version_major`
* `layout_engine_build`
* `agent_class`
* `agent_version`
* `agent_version_major`
* `agent_build`
* `agent_language`
* `agent_language_code`
* `agent_information_email`
* `agent_information_url`
* `agent_security`
* `agent_uuid`
* `webview_app_name`
* `webview_app_version`
* `webview_app_version_major`
* `facebook_carrier`
* `facebook_device_class`
* `facebook_device_name`
* `facebook_device_version`
* `facebook_fbop`
* `facebook_fbss`
* `facebook_operating_system_name`
* `facebook_operating_system_version`
* `anonymized`
* `hacker_attack_vector`
* `hacker_toolkit`
* `kobo_affiliate`
* `kobo_platform_id`
* `ie_compatibility_version`
* `ie_compatibility_version_major`
* `carrier`
* `gsa_installation_id`
* `network_type`

More information about this enrichment can be found on the [wiki page](https://github.com/snowplow/snowplow/wiki/YAUAA-enrichment).

Because device detection is so important, we are additionally looking to add a WURFL enrichment in a forthcoming release. We welcome any feedback from users on which fields would be most useful to fetch as part of that enrichment, given the [enormous number](https://www.scientiamobile.com/capabilities/) supported by the WURFL team.

<h2 id="remoteAdapter">2. New feature: remote HTTP adapter</h2>

The HTTP adapter provides Snowplow users with the opportunity to extend Snowplow to ingest data from a range of sources and processes without having to tamper with the Snowplow source code itself.

Snowplow has for sometime supported ingesting data from specific sources via adapters. For example, Snowplow users can ingest data from SendGrid via our SendGrid adapter: SendGrid is configured to stream data via a webhook pointing to:

{% highlight bash %}
https://$YOUR_COLLECTOR_ENDPOINT/com.SendGrid/v3
{% endhighlight %}

Snowplow uses the fact that the data has landed on the `/com.SendGrid/v3` path to identify that this data needs to be processed by the SendGrid adapter prior to being validated and enriched. Adapters provide an opportunity to convert the data from the format used by the 3rd party webhook into one matching a Snowplow-authored event, so that it can subsequently be processed like any other Snowplow event.

With the HTTP adapter, it is possible to configure Snowplow to stream data landing on particular collector paths to an external HTTP endpoint where users can configure their own applications for converting that data into a format suitable for Snowplow to continue to process. (This transformed data is returned in the HTTP response.) This means that any Snowplow user can write their own Snowplow adapter for any source of data they wish. Some example use cases:

1. A company might want to ingest data from their own application which exposes it in a particular format, and not have the opportunity to either update that application to emit the data using a Snowplow Tracker, or update the shape of the data currently emitted into one suitable for ingestion via our standard [Iglu Webhook](https://github.com/snowplow/snowplow/wiki/Iglu-webhook-adapter). This might be the case for a legacy application which is no longer being developed, for example. In this case, a standalone adapter could be written to perform the relevant transformation.
2. A company might wish to write an adapter for a third party provider but not wish to do so in Scala. In this case, the adapter could be written in any language that suited the author.
3. A company might wish to ingest data into Snowplow generated by data science models that are typically written in R or Python.

The HTTP adapter is enabled via a configuration like the following to the stream-enrich configuration file:

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

In the above example, Snowplow has been configured to forward any payloads that land on the path `/special-vendor/v1` to `http://remote-adapter.com:9090`.

The HTTP request sent to the remote adapter at `http://remote-adapter.com:9090` will contain the following parameters:

- `contentType` -> `payload.contentType`
- `queryString` -> `payload.querystring`
- `headers` -> `payload.context.headers`
- `body` -> `payload.body`

Snowplow expects the body of the HTTP response to be a JSON with a field `events` which is a list of `Map[String, String]`, each map being placed in the parameters of a raw event
(a collector payload can contain several raw events). In the event that the remote adapter was not able to process the event successfully Snowplow expects the response to contain a string field called `error` containing an error message.

The feature has been added to _Scala Common Enrich_ but can be used only in _stream-enrich_ for now. We plan to add it to _beam-enrich_ shortly, so that GCP users can benefit from it.

This incredibly powerful feature has been contributed by [Saeed Zareian](https://github.com/szareiangm) at The Globe and Mail. Saeed has also very kindly provided an example of code for an HTTP remote adapter  [here](https://github.com/snowplow-incubator/remote-adapter-example/). Many thanks Saeed!


<h2 id="tutoEnrichment">3. New tutorial: add an enrichment to the pipeline</h2>

We've had a number of users express an interest in contributing new enrichments to Snowplow, so have written a tutorial on how to do so. This can be found [here](https://github.com/snowplow/snowplow/tree/master/3-enrich#how-to-add-an-enrichment).

<h2 id="improvements">4. Other improvements</h2>

<h4>4.1. More relaxed URL parsing</h4>

A number of Snowplow users employ Snowplow tracking on websites that they do not directly control. (For example, this is the case for companies that provide widgets, or analytics for marketing effectiveness.)

For these users, the relatively strict URL parsing employed previously by Snowplow was problematic, because it meant events that occurred on URLs that were strictly speaking invalid (but worked on the web) would fail validation.

In this version of Snowplow that URL parsing has been relaxed. For example it now supports URLs containing macros like `%%a%%` or `##a##`.

<h4>4.2. IP address now deduced from `xForwardedFor` where this conflicts with `Forwared: for=`</h4>

In this version of Snowplow, if both `X-Forwarded-For` and `Forwarded: for=` are set in the headers, `X-Forwarded-For` now takes priority.

<h4>4.3. IAB Bots and Spiders enrichment skipped for IPv6 addresses</h4>

The library used by Snowplow to interface with the IAB Bots and Spiders enrichment does not support IPv6 addresses. As a result, events recorded against these IP addresses failed validation in previous versions of Snowplow.

With this version any events recorded against an IPv6 address are not processed using the IAB enrichemnt, so that they are successfully processed by Snowplow. (But lack the additional data points generated by the IAB Bots and Spiders enrichment.)

We plan to update this behaviour once we rollout support for IPv6 in the IAB Bots and Spiders library.

<h4>4.4. SendGrid integration update</h4>

We have updated our SendGrid integration so that the optional `marketing_campaign_*` fields are now captured by the pipeline. (These were added to the SendGrid webhook payloads since we rolled out our initial SendGrid integration.)

More info about these fields on [this page](https://SendGrid.com/docs/for-developers/tracking-events/event/).

<h4>4.5. IP lookup enrichment</h4>

IP lookup enrichment now supports IPs (v4) containing a port.

<h2 id="eer">5. Updates for EmrEtlRunner</h2>

We are continuing the effort started in R113 to decrease the number of connection issues.

The backoff periods for retries have been increased, so that it's less likely to hit EMR rate limits with multiple pipelines running concurrently.

The calls being made to the EMR API to monitor the jobs have also been updated, so that there is no redundant calls any more.

<h2 id="upgrading">6. Upgrading</h2>

<h3>6.1. Upgrading your enrichment platform</h3>

If you are a GCP pipeline user, a new Beam Enrich can be found on Bintray:
- as [a ZIP archive](https://bintray.com/snowplow/snowplow-generic/snowplow-beam-enrich/0.3.0#files)
- as [a Docker image](https://bintray.com/snowplow/registry/snowplow%3Abeam-enrich)

If you are a Kinesis or Kafka pipeline user, a new Stream Enrich can be found on
[Bintray](https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.21.0#files).

Finally, if you are a batch pipeline user, a new Spark Enrich can be used by setting the new version
in your EmrEtlRunner configuration:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.18.0 # WAS 1.17.0
{% endhighlight %}

or directly make use of the new Spark Enrich available at:

`s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.18.0.jar`

For the batch pipeline, we've also extended [the timeout recovery introduced in R112](https://snowplowanalytics.com/blog/2019/02/20/snowplow-r112-baalbek-batch-pipeline-reliability-improvements/#timeouts).
A new version of EmrEtlRunner incorporating those improvements is available from our Bintray
[here][bintray-eer].

The new version of EmrEtlRunner aiming at decreasing the number of connection issues is also available in
[our Bintray](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r114_polonnaruwa.zip).

<h3>6.2. Using YAUAA enrichment</h3>

***YAUAA enrichment requires an additional 400Mb of memory to run, so be careful when sizing clusters or individual machines.***

To use new YAUAA enrichment, add `yauaa_enrichment_config.json` to the folder with configuration files for enrichments, with the following content:
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

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases include:

* [R115 New bad row format](https://github.com/snowplow/snowplow/milestone/154), a release which will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r114-polonnaruwa
[discourse]: http://discourse.snowplowanalytics.com/
