---
layout: post
title-short: Time spent is the most important metric for media
title: "Time spent is the most important metric for media, here’s how to get it right"
description: "We look at how first-generation analytics tools fall short of accurately measuring the time spent metric and how Snowplow Insights gets it right."
author: Simon
category: Data insights
permalink: /blog/2019/08/07/time-spent-is-the-most-important-metric-for-media/
discourse: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Time_Broken.jpg
thumbnail-image: /assets/img/blog/featured/Thumb-Time-Broken.png
---

**_The actual product media companies sell is the engagement and attention of their audience yet the way it’s commonly measured is completely broken. Let’s look at the problem of measuring attention, ways to solve it and explore some examples of media companies doing it well._**

Media companies trade in the attention of audiences. Audiences visit them—and hopefully pay them—to inform and entertain. Advertisers pay them to get the attention of those audiences.

If there’s one thing a publisher should really understand it’s how much attention their content is receiving. But most media companies really don’t have a handle on it. The most common analytics platforms do such a bad job of measuring it they’re actually worse than useless, so most media companies focus instead on pageviews and reach metrics.


## Time spent is broken

![Time Spent][time-spent]

So what’s the problem with the _time spent_ metric in first-generation analytics tools? The most common way of calculating it, used by Google Analytics, Adobe Analytics, Comscore and Nielsen, measures the time gap between two pageviews and allocates the time to the earlier pageview.

In the example above we see a user session consisting of three pageviews. The user spends 30 seconds on the first page, 60 seconds on the second page and 90 seconds on the final page. With only the pageview events sent through to the analytics platform, the only information it has to go on is the difference in time between each pageview event.

So while the user spent 180 seconds—three minutes—reading the content, the analytics tool is only able to measure 90 seconds—one and a half minutes. This isn’t an uncommon pattern of behaviour:



*   Lands on home page
*   Navigates to the desired content
*   Spends time reading
*   Leaves

In the last few years the pattern has become even shorter with the dominance of traffic coming from the social behemoths, especially Facebook.



*   Lands on content page from Facebook
*   Spends time reading
*   Leaves

In these cases the first-generation analytics tools record a _time spent_ of zero seconds because there is no additional event after the first pageview.


## Why is this a problem?

Without an accurate way to determine the content that users are actually reading, editors have to fall back to simpler metrics. Rewarding content that gets more _pageviews_ and _reach_ (unique browsers) tends to favour low-quality clickbait content. The kind of content that requires a click to answer the question posed in the headline and lede: _you won’t believe what happened next_. Users click through and leave very quickly.

What’s more, because the _time spent_ metric in first-generation analytics tools is actually wrong, editors can end up optimizing directly against the kind of engaging content that can work on social platforms. A long, detailed feature article might not get as many clicks as clickbait but when users spend serious time with it, tens of minutes and more, that time adds up quickly.

At the end of the day, advertisers and editors want engaged audiences so their messages are in front of them for a long time.


## Use _page pings_ to measure time spent accurately


![Page Ping][page-ping]

Getting a much more accurate time spent metric is pretty straightforward. This is how it’s done in Snowplow Insights. Instead of just recording a pageview, you send in a regular beacon while the user is still engaging with the content. When the browser stops sending those beacons it indicates the user has stopped reading the content. Multiply the number of “page ping” pixels received by the interval between those pixels and you now have a much better idea of the time spent.

In the example above, a page ping is sent every 5 seconds after the pageview while the user is still active, so we would expect to see the pageview and an additional 5 page pings.

There are some workarounds to get a better time spent metric in first-generation analytics tools. You could send additional events into Google or Adobe Analytics to do a similar job to page pings of time spent. Unfortunately Google Analytics has a [hard limit on the number of hits per session](https://developers.google.com/analytics/devguides/collection/analyticsjs/limits-quotas#universal_properties) and simply throws away anything received after that, even for paid accounts. Adobe Analytics could probably do something like this with a custom metric but it would get very expensive with the per hit pricing model.


## Why don’t the big analytics platforms already do this?

So why don’t Google Analytics, Adobe Analytics, Comscore and Nielsen do this? Web analytics and the earlier versions of these tools were developed in the late 1990s. Collecting, storing and processing large volumes of data was a really complex and expensive thing. Omniture, who created web analytics as we know it and became Adobe Analytics, had to build and maintain a completely custom data processing pipeline in their own data centres. So they settled on their definition for _time spent_, which was also the same way the predecessor technology of log analysis worked.

Since the 1990s the rapid technological changes in data processing mean that it’s now reasonably straightforward to collect, store and process the additional data volumes. Unfortunately those existing platforms haven’t caught up.


## How do you use this data?


![See Data][see-data]





Canada’s Globe & Mail have built their own proprietary analytics platform, [Sophi](https://sophi.io/), using Snowplow as the data collector. It provides real-time feedback to editorial teams using a scoring methodology they developed internally to suit their own needs as a subscription newspaper.

Everyone in editorial has instant access to see what content is working in real time as well as detailed analysis of historical performance. Analytics experts are embedded within editorial teams to help answer questions and develop analytical skills and instincts among journalists and editors.


## Start tracking engagement

If you work with content you need to understand how people are engaging with it. The written word is no different to video or audio in this respect. The great thing about digital analytics is that you _can_ measure engagement in great detail. You can find out exactly what works and what doesn’t, in real time, and adjust the content to take advantage of those insights. Start measuring it properly - [get in touch](https://snowplowanalytics.com/request-demo/)!






[page-ping]: /assets/img/blog/2019/08/time-spent/page-ping.png
[see-data]: /assets/img/blog/2019/08/time-spent/see-data.png
[time-spent]: /assets/img/blog/2019/08/time-spent/time-spent.png