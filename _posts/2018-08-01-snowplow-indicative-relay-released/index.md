---
layout: post
title-short: Snowplow Indicative Relay
title: "Snowplow Indicative Relay released"
tags: [snowplow, relay, indicative]
author: Andrzej
category: Releases
permalink: /blog/2018/08/01/snowplow-indicative-relay-released/
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

[Indicative][indicative] is an emerging customer analytics platform, optimised for customer journey analytics.

It is particularly well suited for marketers, product managers, and analysts. Indicative connects to many data sources in order to give a needed insight into users behavior - and is a great fit for analyzing Snowplow event data.

To learn more about using Indicative with Snowplow, take a look at our [previous blog post][snowplow-indicative-blog].

![indicative][indicative-img]

<h2 id="how-does-it-work">2. How does the relay work?</h2>

Snowplow Relay is an initiative for feeding Snowplow enriched events into third-party tools or *destinations*, from SaaS marketing platforms to open-source machine learning engines to fraud detection services. We call an individual app that feeds Snowplow events into a specific destination a *relay*.

The Snowplow Indicative Relay is a Kinesis stream consumer in a form of an AWS Lambda function.

The relay retrieves events from a Kinesis stream of Snowplow enriched events, transforms them to be compatible with Indicative's event model, and then loads them into Indicative in real time using the [Indicative REST API][indicative-rest-api].

<h2 id="setup">3. Requirements and setup</h2>

To simplify the process of deploying the Snowplow Indicative Relay function, Snowplow Analytics provides its jar file through [Hosted assets][hosted-assets] on AWS S3.

Detailed setup instructions are provided on the project's [GitHub wiki page][github-wiki-page].

<h2 id="usage">4. Usage</h2>

Once setup, the data should flow into Indicative in near real time. All event types can 
be viewed under *Events and Properties* in the Indicative's settings. You can also assign
more descriptive labels and categories for the incoming properties.

![indicative][property-labels-img]

Indicative lets you observe and analyze user journeys through *Funnels*,
which represent multidimensional user conversions.

![indicative][funnel-img]

*Segmentation* tool allows creation of classic key performance indicators
and use them to analyze user trends.

![indicative][pie-chart-img]

<h2 id="help">5. Getting help</h2>

If you have questions or run into any problems, please visit [our Discourse forum][discourse].

And if you spot any bugs, please report them through [GitHub issues][github-issues].

[aws-lambda]: https://aws.amazon.com/lambda/
[indicative]: https://www.indicative.com/
[indicative-rest-api]: https://app.indicative.com/docs/integration.html
[indicative-img]: /assets/img/blog/2018/08/indicative-img.png

[snowplow-indicative-blog]: https://snowplowanalytics.com/blog/2018/03/22/analyzing-behavioral-data-with-indicative-and-snowplow/

[property-labels-img]: /assets/img/blog/2018/08/indicative-property-labels.png
[funnel-img]: /assets/img/blog/2018/08/indicative-funnel.png
[pie-chart-img]: /assets/img/blog/2018/08/indicative-pie-chart.png

[hosted-assets]: https://github.com/snowplow/snowplow/wiki/Hosted-assets#6-relays
[github-wiki-page]: https://github.com/snowplow-incubator/snowplow-indicative-relay/wiki
[github-issues]: https://github.com/snowplow-incubator/snowplow-indicative-relay/issues

[discourse]: http://discourse.snowplowanalytics.com/
