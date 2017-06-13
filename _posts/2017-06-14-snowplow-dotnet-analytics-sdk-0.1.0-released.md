---
layout: post
title: Snowplow .NET Analytics SDK 0.1.0 released
title-short: Snowplow .NET Analytics SDK 0.1.0
tags: [snowplow, enriched events, .NET, .NETStandard, Microsoft Azure]
author: Devesh
category: Releases
---

Following in the footsteps of the [Snowplow Scala Analytics SDK][scala-sdk-post] and [Snowplow Python Analytics SDK][python-sdk-post], we are happy to announce the release of the [Snowplow .NET Analytics SDK][sdk-repo].

This SDK makes your Snowplow enriched events easier to work with from [Azure Data Lake Analytics][azure-data-lake-analytics], [Azure Functions][azure-functions], [AWS Lambda][lambda], [Microsoft Orleans][microsoft-orleans] and other .NET-compatible data processing frameworks.

This SDK has been developed as a first step towards our RFC, [Porting Snowplow to Microsoft Azure][azure-rfc]. Over time, we expect this SDK will be used for tasks such as:

1. Performing [event data modeling][event-data-modeling] in Azure Data Lake Analytics
2. Performing analytics-on-write in Azure Functions as part of an [Event Hubs][event-hubs]-based real-time pipeline
3. Writing real-time decisioning engines on Snowplow event streams in Microsoft Orleans:

![sdk-usage-img][sdk-usage-img]

Read on below the jump for:

1. [Overview](/blog/2017/06/14/snowplow-dotnet-analytics-sdk-0.1.0-released#overview)
2. [The JSON Event Transformer](/blog/2017/06/14/snowplow-dotnet-analytics-sdk-0.1.0-released#json-event-transformer)
3. [Installation](/blog/2017/06/14/snowplow-dotnet-analytics-sdk-0.1.0-released#installation)
4. [Usage](/blog/2017/06/14/snowplow-dotnet-analytics-sdk-0.1.0-released#usage)
5. [Getting help](/blog/2017/06/14/snowplow-dotnet-analytics-sdk-0.1.0-released#help)

<!--more-->

<h2 id="overview">1. Overview</h2>

Snowplow's enrichment process outputs enriched events in a TSV format. This TSV currently has 131 fields, some of which are complex heterogeneous self-describing JSON, which can make it difficult to work with directly.

The Snowplow .NET Analytics SDK currently supports one transformation: the JSON Event Transformer, for turning this TSV into a more tractable JSON. Let's check this out next.

<h2 id="json-event-transformer">2. The JSON Event Transformer</h2>

The JSON Event Transformer uses the exact same algorithm as that found in the [Snowplow Scala Analytics SDK][ssas]. Here is an excerpt from a generated JSON:

{% highlight json %}
{
  "app_id":"demo", "platform":"web","etl_tstamp":"2015-12-01T08:32:35.048Z",
  "collector_tstamp":"2015-12-01T04:00:54.000Z","dvce_tstamp":"2015-12-01T03:57:08.986Z",
  "event":"page_view","event_id":"f4b8dd3c-85ef-4c42-9207-11ef61b2a46e",
  "name_tracker":"co","v_tracker":"js-2.5.0","v_collector":"clj-1.0.0-tom-0.2.0",
  ...
}
{% endhighlight %}

The most complex piece of processing is the handling of the self-describing JSONs found in the enriched event's `unstruct_event`, `contexts` and `derived_contexts` fields. All self-describing JSONs found in the event are flattened into top-level plain (i.e. not self-describing) objects within the enriched event JSON.

For example, if an enriched event contained a `com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1`, then the final JSON would contain:

{% highlight json %}
{
  ...
  "name_tracker":"co","v_tracker":"js-2.5.0","v_collector":"clj-1.0.0-tom-0.2.0",
  "unstruct_event_com_snowplowanalytics_snowplow_link_click_1": {
    "targetUrl":"http://www.example.com",
    "elementClasses":["foreground"],
    "elementId":"exampleLink"
  },
  ...
}
{% endhighlight %}

<h2 id="installation">3. Installation</h2>

The Snowplow .NET Analytics is published to [NuGet][nuget], the .NET package manager. To add it to your project, install it in the Visual Studio Package Manager Console like so:

{% highlight bash %}
Install-Package Snowplow.Analytics
{% endhighlight %}

<h2 id="usage">4. Usage</h2>

Use the SDK like this:

{% highlight csharp %}
using Snowplow.Analytics.Json;
using Snowplow.Analytics.Exceptions;

try
{
    EventTransformer.Transform(enrichedEventTsv);
}
catch (SnowplowEventTransformationException sete)
{
    sete.ErrorMessages.ForEach((message) => Console.WriteLine(message));
}

{% endhighlight %}

If there are any problems in the input TSV (such as unparseable JSON fields or numeric fields), the `transform` method will throw a `SnowplowEventTransformationException`. This exception contains a list of error messages - one for every problematic field in the input.

For more information, please check out the [.NET Analytics SDK wiki page][sdk-docs].

<h2 id="help">5. Getting help</h2>

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

And if there's another Snowplow Analytics SDK you'd like us to prioritize creating, please let us know on our [Discourse][discourse]!

[sdk-repo]: https://github.com/snowplow/snowplow-dotnet-analytics-sdk
[sdk-usage-img]: /assets/img/blog/2017/06/dotnet-analytics-sdk-usage.png
[sdk-docs]: https://github.com/snowplow/snowplow/wiki/.NET-Analytics-SDK

[event-data-modeling]: http://snowplowanalytics.com/blog/2016/03/16/introduction-to-event-data-modeling/

[azure-data-lake-analytics]: https://azure.microsoft.com/en-gb/services/data-lake-analytics/
[azure-functions]: https://azure.microsoft.com/en-gb/services/functions/
[lambda]: https://aws.amazon.com/lambda/
[microsoft-orleans]: https://dotnet.github.io/orleans/
[event-hubs]: https://azure.microsoft.com/en-au/services/event-hubs/

[azure-rfc]: http://discourse.snowplowanalytics.com/t/porting-snowplow-to-microsoft-azure/1178

[nuget]: https://www.nuget.org/
[ssas]: https://github.com/snowplow/snowplow-scala-analytics-sdk
[scala-sdk-post]: https://snowplowanalytics.com/blog/2017/05/24/snowplow-scala-analytics-sdk-0.2.0-released/
[python-sdk-post]: https://snowplowanalytics.com/blog/2017/04/11/snowplow-python-analytics-sdk-0.2.0-released/
[issues]: https://github.com/snowplow/snowplow/iglu
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com/