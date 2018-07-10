---
layout: post
title-short: Snowplow R107 Trypillia
title: "Snowplow R107 Trypillia released"
tags: [enrichment, webhook, iab, vero, marketo]
author: Rostyslav
category: Releases
permalink: /blog/2018/07/03/snowplow-r107-trypillia-released/
---

We are excited to announce the release of [Snowplow R107 Trypillia][snowplow-release].

This release introduces the IAB Spiders & Robots enrichment for detecting bots and spiders using [data from the IAB][iab-data], as well as Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics].

Read on for more information:

1. [IAB Spiders & Robots enrichment support](#iab)
2. [Vero webhook support](#vero)
3. [Marketo webhook support](#marketo)
4. [Other changes](#other)
5. [Upgrading](#upgrading)
6. [Roadmap](#roadmap)
7. [Help](#help)

<!--more-->

<h2 id="iab">1. IAB Spiders & Robots enrichment</h2>

The IAB Spiders & Robots Enrichment uses the IAB/ABC International Spiders and Bots List to determine whether an event was produced by a user or a robot/spider based on its IP address and user agent.

You can find out more on the [IAB enrichment][iab-enrichment] page of the Snowplow wiki.

<h2 id="vero">2. Vero webhook support</h2>

The Vero webhook adapter lets you receive the email-related events delivered by [Vero][vero-website]. Using this functionality, you can warehouse all email-related events alongside your existing Snowplow data.

All the currently documented Vero events are supported by this release: these include bounced, clicked, created, delivered, opened, sent, unsubscribed and updated events.

For help setting up the Vero webhook, see the [Vero webhook setup][vero-setup] page.

<h2 id="marketo">3. Marketo webhook support</h2>

Support for [Marketo][marketo-website] lets you track webhook events emitted by their SaaS marketing automation system. This functionality will allow you to ensure that different campaigns you setup are correctly tracked by Snowplow.

For help setting up the Marketo webhook, refer to the [Marketo webhook setup guide][marketo-setup].

<h2 id="other">4. Other changes</h2>

In addition to the above we have made the following changes:

* Propagating the currency code to all the contexts which need it in the Google Analytics adapter (where previously it was treated as a composite context) ([#3733][issue-3733])
* Upgrading the dependency on jackson-databind to 2.9.3 for all projects that use it. Many thanks to [Roman Salin][romansalin] for this contribution ([#3767][issue-3767])
* Upgrading the example config for the PII enrichment to version 2, released in [R106 Acropolis][r106-post] ([#3812][issue-3812])

<h2 id="upgrading">5. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

To benefit from the new webhook integrations, you'll need to bump the Spark Enrich version used in
the EmrEtlRunner configuration file:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.15.0      # WAS 1.14.0
{% endhighlight %}

For a complete example, see our sample [`config.yml`][config-yml] template.

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">7. Getting Help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[iab-data]: https://www.iab.com/guidelines/iab-abc-international-spiders-bots-list/
[snowflake-analytics]: https://www.snowflake-analytics.com/

[iab-enrichment]: https://github.com/snowplow/snowplow/wiki/IAB-enrichment
[vero-website]: https://www.getvero.com/
[vero-setup]: https://github.com/snowplow/snowplow/wiki/Vero-webhook-setup
[marketo-website]: https://www.marketo.com/
[marketo-setup]: https://github.com/snowplow/snowplow/wiki/Marketo-webhook-setup

[issue-3733]: https://github.com/snowplow/snowplow/issues/3733
[issue-3767]: https://github.com/snowplow/snowplow/issues/3767
[issue-3812]: https://github.com/snowplow/snowplow/issues/3812
[romansalin]: https://github.com/romansalin
[r106-post]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/

[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r107_trypillia.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r97-knossos/3-enrich/emr-etl-runner/config/config.yml.sample

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r107-trypillia
[discourse]: http://discourse.snowplowanalytics.com/

[r10x-str]: https://github.com/snowplow/snowplow/milestone/151
[dataflow]: https://cloud.google.com/dataflow/
[beam]: https://beam.apache.org/
