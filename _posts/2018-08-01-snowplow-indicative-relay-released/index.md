---
layout: post
title-short: Snowplow Indicative Relay
title: "Snowplow Indicative Relay released"
tags: [snowplow, relay, indicative]
author: Andrzej
category: Releases
permalink: /blog/2018/08/01/snowplow-indicative-relay-released/
---

We are pleased to announce the release of Snowplow Indicative Relay.
It is an [AWS Lambda][aws-lambda] function, which allows for sending batches
of Snowplow enriched events from a Kinesis stream into [Indicative][indicative].

1. [What is Indicative?](#indicative)
2. [How does a relay work?](#how-does-it-work)
3. [Requirements and setup](#setup)
4. [Getting help](#help)

<h2 id="indicative">1. What is Indicative?</h2>

[Indicative][indicative] is an emerging customer analytics platform, optimised for
customer journey analytics. It is particularly well suited for marketers,
product managers, and analysts. Indicative connects to many data sources in order to give
a needed insight into users behaviour. To learn more, you can take a look at our [previous blog post][previous-blog].

![indicative][indicative-img]

<h2 id="how-does-it-work">2. How does a relay work?</h2>

Relay is a stream consumer in a form of an AWS Lambda function. 
It retrieves events from a Kinesis stream of Snowplow enriched events and transfers them 
straight into Indicative in real time, skipping the storage part of the pipeline.
To be most efficient and cost-effective, the relay consumes and transfers
the events in batches, thus invoking the lambda only once per many events.

Snowplow Indicative Relay uses the [Indicative REST API][indicative-rest-api] under the hood
by transforming incoming events into the format expected by Indicative.
Let's take this (very simplified for brevity) Snowplow enriched event in
a JSON form as an example:

{% highlight json %}
{
  "app_id": "foo",
  "platform": "web",
  "etl_tstamp": "2017-01-26 00:01:25.292",
  "collector_tstamp": "2013-11-26 00:02:05",
  "dvce_created_tstamp": "2013-11-26 00:03:57.885",
  "event": "page_view",
  "event_id": "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
  "user_id": "jon.doe@email.com",
  "user_fingerprint": "2161814971",
  "domain_userid": "bc2e92ec6c204a14",
  "network_userid": "ecdff4d0-9175-40ac-a8bb-325c49733607",
  "geo_country": "UK",
  "geo_city": "London",
  "page_url": "http://www.snowplowanalytics.com",
  "derived_contexts": {
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1",
    "data": [
      {
        "schema": "iglu:com.snowplowanalytics.snowplow/ua_parser_context/jsonschema/1-0-0",
        "data": {
          "useragentFamily": "Chrome",
            "useragentMajor": "67",
            "useragentMinor": "0",
            "useragentPatch": "3396",
            "useragentVersion": "Chrome 67.0.3396",
            "osFamily": "Windows 7",
            "osMajor": null,
            "osMinor": null,
            "osPatch": null,
            "osPatchMinor": null,
            "osVersion": "Windows 7",
            "deviceFamily": "Other"
        }
      }
    ]
  },
  "domain_sessionid": "2b15e5c8-d3b1-11e4-b9d6-1681e6b88ec1",
  "derived_tstamp": "2013-11-26 00:03:57.886",
  "event_vendor": "com.snowplowanalytics.snowplow",
  "event_name": "page_view",
  "event_format": "jsonschema",
  "event_version": "1-0-0",
  "event_fingerprint": "e3dbfa9cca0412c3d4052863cefb547f",
  "true_tstamp": "2013-11-26 00:03:57.886"
}
{% endhighlight %}

It would be transformed into the following Indicative event:

{% highlight json %}
 {
    "eventName": "page_view",
    "timestamp": "2013-11-26T00:03:57.886",
    "eventUniqueId": "jon.doe@email.com",
    "properties": {
        "app_id": "foo",
        "platform": "web",
        "etl_tstamp": "2017-01-26 00:01:25.292",
        "collector_tstamp": "2013-11-26 00:02:05",
        "dvce_created_tstamp": "2013-11-26 00:03:57.885",
        "event": "page_view",
        "event_id": "c6ef3124-b53a-4b13-a233-0088f79dcbcb",
        "user_id": "jon.doe@email.com",
        "user_fingerprint": "2161814971",
        "domain_userid": "bc2e92ec6c204a14",
        "network_userid": "ecdff4d0-9175-40ac-a8bb-325c49733607",
        "geo_country": "US",
        "geo_city": "New York",
        "page_url": "http://www.snowplowanalytics.com",
        "domain_sessionid": "2b15e5c8-d3b1-11e4-b9d6-1681e6b88ec1",
        "derived_tstamp": "2013-11-26 00:03:57.886",
        "event_vendor": "com.snowplowanalytics.snowplow",
        "event_name": "page_view",
        "event_format": "jsonschema",
        "event_version": "1-0-0",
        "event_fingerprint": "e3dbfa9cca0412c3d4052863cefb547f",
        "true_tstamp": "2013-11-26 00:03:57.886",
        "ua_parser_context_useragentFamily": "Chrome",
        "ua_parser_context_useragentMajor": "67",
        "ua_parser_context_useragentMinor": "0",
        "ua_parser_context_useragentPatch": "3396",
        "ua_parser_context_useragentVersion": "Chrome 67.0.3396",
        "ua_parser_context_osFamily": "Windows 7",
        "ua_parser_context_osMajor": null,
        "ua_parser_context_osMinor": null,
        "ua_parser_context_osPatch": null,
        "ua_parser_context_osPatchMinor": null,
        "ua_parser_context_osVersion": "Windows 7",
        "ua_parser_context_deviceFamily": "Other"  
    }
 }
{% endhighlight %}

All above fields can be given more descriptive names and categories through the Indicative UI:

![indicative fields][indicative-fields-img]


<h2 id="setup">3. Requirements and setup</h2>

To simplify the process of deploying the function, Snowplow Analytics provides its jar file through [Hosted assets][hosted-assets]
on AWS S3. Detailed setup instructions are provided on the project's [GitHub page][github-page].

<h2 id="help">4. Getting help</h2>

If you have questions or run into any problems, please visit [our Discourse forum][discourse]. 
In case you spot any bugs, please report them through [GitHub issues][github-issues].


[aws-lambda]: https://aws.amazon.com/lambda/
[indicative]: https://www.indicative.com/
[indicative-rest-api]: https://app.indicative.com/docs/integration.html
[indicative-img]: /assets/img/blog/2018/08/indicative-img.png
[indicative-fields-img]: /assets/img/blog/2018/08/indicative-fields-img.png

[previous-blog]: https://snowplowanalytics.com/blog/2018/03/22/analyzing-behavioral-data-with-indicative-and-snowplow/

[hosted-assets]: https://github.com/snowplow/snowplow/wiki/Hosted-assets#6-relays
[github-page]: https://github.com/snowplow-incubator/snowplow-indicative-relay
[github-issues]: https://github.com/snowplow-incubator/snowplow-indicative-relay/issues

[discourse]: http://discourse.snowplowanalytics.com/
