---
layout: post
title: "Possession is 9/10 of the Law"
title-short: Data Ownership
tags: [data analytics, data management]
author: Anthony
category: Other
permalink: /blog/2017/10/24/possession-is-9-10-of-the-law/
description: "How we use Snowplow data here at Snowplow Analytics"
---

![data-chart][chart]

We’re at a point now where data is a sexy word. Big Data, data science, data analytics- the list of emerging data-focused fields, tools, and products continues to grow. This growth is largely thanks to developing collection technology; as collection tools improve, we find ourselves handling vastly improved data and actively seeking out ways to use it. However, when it comes to utilizing data, most organizations are relatively unsophisticated in their methods.

The truth is that working with data is complex and time consuming if you want to come close to realizing the potential held within. And because of that, third-party vendors have found it relatively easy to convince you to give up your data only to buy it back, neatly wrapped and packaged. While there are a great many analytics tools and platforms available for users across a broad range of skill and technical levels, the quality of your data affects the quality of your decisions and farming out your analytics through third parties can give you incomplete data leaving you fighting with one arm tied behind your back.

<h2 id="where does the data flow">Where does the data flow?</h2>

In a typical setup, you’ll integrate small snippets of tracking code, frequently JavaScript these days, throughout the architecture you want to analyze, be it a website, browser application, or mobile game, for example. That tracker will send specified data to the platform’s warehouse, where the service will follow whatever proprietary steps it takes to turn your raw data into something you’re willing to pay for. What happens during this process will vary platform to platform, but the end result is the same: when you look at your reports, you’re seeing someone’s interpretation of your data.

Maybe that’s okay with you. Maybe the data you’re being served is sufficient to answer your questions. But, as data collection software continues to improve, and along with it the volume and quality of data available, you’ll soon find yourself wanting to know more about what’s going on behind the charts and graphs in your dashboard. This is where you’ll run into a wall. When you want to finally delve deeper into your user data, the limitations of third party analytic platforms jump out in stark resolution. Suddenly, the transformations applied to your data to make it “user friendly” can be restrictive or, at their most egregious, outright misleading.

<h2 id="the bad and the ugly">The Bad and the Ugly</h2>

There’s an unspoken trend that [no one in digital analytics talks about bad data][yali-blog], as Snowplow co-founder Yali Sassoon points out. This is a mistake. Bad data can often be as insightful as good data if you examine and analyze it closely. An unusually massive spike in account creation could be a QA team doing routine testing or the result of a digital marketing campaign going viral. But, there’s no way to know unless you can pick the data apart, piece by piece, to identify it for what it is. In effort to keep your data clean, third parties will make assumptions for you about that unusual data or blatantly disregard it as erroneous.

Take Google Analytics, for example. The platform does a great job of giving a general overview of what your web analytics look like. What the data lacks in fidelity, it makes up for with easily digestible, high-level portraits of user activity, which is often sufficient enough to draw reasonable conclusions for individuals or organizations new to data analytics. But in order to create those portraits, Google [takes certain liberties][google-analytics] with your data like making its own decisions about which acquisition channels users are coming from, sacrificing true accuracy along the way. Google Analytics also serves you data from a sampling of your traffic, meaning you’re not even seeing a complete picture of your user behavior.

<h2 id="the benefits of ownership">The Benefits of Ownership</h2>

When you own your data, from end to end, the environment is completely different. Having access to your raw data allows you to slice and dice in ways that are specific to you and your business. Though the many third party platforms out there can get you started interacting with your data more strategically, they provide a short runway. If you really want to understand your users, to draw actionable insights out of the data they generate on your website or within your game, you need the ability to look at your data without the obfuscation caused by analytics platforms force-fitting your data into their reporting formats.

{:.image-caption}
*[Pictured below: a unified log from The three eras of business data processing by Alex Dean][three-eras]*
![unified-log][unified]


Your raw, event-level data can be piped from multiple sources into your warehouse or unified log and enriched in meaningful ways to provide the answers you’re looking for in your data. Often, those answers don’t become apparent until you start looking closer. With a complete picture of your user journey, you’re no longer limited to superficial analyses of surface-level data points. You can connect a single user’s data from multiple sources such as your CRM, CMS, eCommerce platform, or within a digital environment like a web application or video game. Now, with complete ownership of your user data, you can start drawing real insights.

One stop shopping

Configuring all of these external systems to produce data that works well together isn’t always easy, but the process can be well worth the effort. Enriching CRM data, for example, with web analytics can show you how your customers are engaging with your website. By then comparing the web traffic with your lead generation, you can calculate actual conversion rates on an email beyond how many subscribers clicked on a call to action, giving you more insight into the ROI for each email you send.

At Snowplow, [we track our web content very closely][content-tracking] to learn which posts have the highest engagement and which topics our readers find the most useful so we can continue to be a valuable resource for our audience. This level of tracking goes beyond page views for a blog post: we look at time spent on a given page, unique users per average time spent, what percentage of traffic to a page are new users, and how many leads generated have visited a specific blog post. It’s only because we have access to raw event data that we can report on user activity on such a granular level. Thanks to the abundance of event data that our users generate, our data scientists can create highly perceptive reports that we use to keep our content worthwhile and optimize our website to support our business goals.


[yali-blog]: https://snowplowanalytics.com/blog/2016/01/07/we-need-to-talk-about-bad-data-architecting-data-pipelines-for-data-quality/ "We need to talk about bad data"

[google-analytics]: https://medium.com/@timmycarbone/google-analytics-modifies-your-data-24d4d6366210 "Google modifies your data"

[three-eras]: https://snowplowanalytics.com/blog/2014/01/20/the-three-eras-of-business-data-processing/ "Three eras of business data processing"

[content-tracking]: https://snowplowanalytics.com/blog/2017/01/12/looking-back-at-2016/ "Look back at 2016"

[unified]: /assets/img/blog/2017/10/unified_log_processing.jpg

[chart]: /assets/img/blog/2017/10/data_chart.jpg
