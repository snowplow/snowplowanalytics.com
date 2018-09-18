---
layout: post
title-short: Snowplow Indicative Relay
title: "Snowplow Indicative Relay released"
tags: [snowplow, relay, indicative]
author: Andrzej
category: Releases
permalink: /blog/2018/09/18/snowplow-indicative-relay-released/
---

We are pleased to announce the release of the Snowplow Indicative Relay.

This is a Snowplow relay project, implemented as an [AWS Lambda][aws-lambda] function which allows for sending batches
of Snowplow enriched events from a Kinesis stream into [Indicative][indicative].

1. [What is Indicative?](#indicative)
2. [How does the relay work?](#how-does-it-work)
3. [Requirements and setup](#setup)
4. [Usage](#usage)
5. [Getting help](#help)

<h2 id="indicative">1. What is Indicative?</h2>

[Indicative][indicative] is an emerging customer analytics platform, optimized for analyzing customer journeys.

It is particularly well suited for marketers, product managers, and business analysts. Indicative connects to many data sources to help analyze and visualize user behavior - and because it is so well suited to working with complex, multi-touch user journeys, it is a great fit for analyzing Snowplow event data.

Indicative's multi-dimensional funnel analysis and intuitive interface make it a powerful tool for those without advanced SQL knowledge to run sophisticated analyses on their data. Marketing teams can analyze what behaviors are most common after a user opens an email and which of those behaviors indicate that user might become a customer, and product managers can clearly see how new features impact retention rates across different user cohorts.

To learn more about using Indicative with Snowplow, take a look at our [blog post about using the Indicative Relay][snowplow-indicative-blog].

![indicative][indicative-img]

<h2 id="how-does-it-work">2. How does the relay work?</h2>

Snowplow Relay is an initiative for feeding Snowplow enriched events into third-party tools or *destinations*, from SaaS marketing platforms to open-source machine learning engines to fraud detection services. We call an individual app that feeds Snowplow events into a specific destination a *relay*.

The Snowplow Indicative Relay is a Kinesis stream consumer in the form of an AWS Lambda function.

This relay retrieves events from a Kinesis stream of Snowplow enriched events, transforms them to be compatible with Indicative's event model, and then loads them into Indicative in real time using the [Indicative REST API][indicative-rest-api].

More [technical information][wiki-tech-info] on the relay can be found on the wiki.

<h2 id="setup">3. Requirements and setup</h2>

You will need to run the Snowplow Indicative Relay on [AWS Lambda][aws-lambda]; you can register your interest in Google Cloud Platform support on the [relevant GitHub issue][issue-9].

To simplify the process of deploying the Snowplow Indicative Relay function, Snowplow Analytics provides its jar file through [Hosted assets][hosted-assets] on AWS S3.

Detailed setup instructions can be found in the project's [Setup guide][wiki-setup-guide] on its wiki.

<h2 id="usage">4. Usage</h2>

Once setup, the Snowplow events should flow into Indicative in near-real-time. All event types can be viewed under *Events and Properties* in the Indicative's settings. You can also assign more descriptive labels and categories for the incoming properties:

![indicative][property-labels-img]

Indicative lets you observe and analyze user journeys through *Funnels*, which represent multidimensional user conversions:

![indicative][funnel-img]

Indicative's *Segmentation* tool allows the creation of classic key performance indicators, and using them to analyze user trends:

![indicative][pie-chart-img]

<h2 id="help">5. Getting help</h2>

If you have questions or run into any problems, please visit [our Discourse forum][discourse].

You can find more information on the relay on its [wiki][wiki].

And if you spot any bugs, please report them through [GitHub issues][github-issues].




[aws-lambda]: https://aws.amazon.com/lambda/
[indicative]: https://www.indicative.com/
[indicative-rest-api]: https://app.indicative.com/docs/integration.html
[indicative-img]: /assets/img/blog/2018/08/indicative-img.png

[snowplow-indicative-blog]: https://snowplowanalytics.com/blog/2018/09/17/high-end-customer-analytics-with-snowplow-and-indicative/

[property-labels-img]: /assets/img/blog/2018/08/indicative-property-labels.png
[funnel-img]: /assets/img/blog/2018/08/indicative-funnel.png
[pie-chart-img]: /assets/img/blog/2018/08/indicative-pie-chart.png

[hosted-assets]: https://github.com/snowplow/snowplow/wiki/Hosted-assets#6-relays

[github-issues]: https://github.com/snowplow-incubator/snowplow-indicative-relay/issues
[issue-9]: https://github.com/snowplow-incubator/snowplow-indicative-relay/issues/9

[wiki]: https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki
[wiki-tech-info]: https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki/Technical-Information
[wiki-setup-guide]: https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki/Setup-Guide

[discourse]: http://discourse.snowplowanalytics.com/
