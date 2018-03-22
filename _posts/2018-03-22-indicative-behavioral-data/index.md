---
layout: post
title: "Analyzing behavioral data with Indicative and Snowplow"
title-short: Behavioral data with Indicative and Snowplow
tags: [analytics, marketing, behavioral data]
author: Anthony
category: Analytics
permalink: /blog/2018/03/22/analyzing-behavioral-data-with-indicative-and-snowplow/
discourse: true
---



Digital platforms have changed the way companies engage with their users. Users can communicate directly with companies through email or social media, find support through chat interfaces, and learn about new products all through digital channels. As we lead increasingly digital lives, the range of products offered has grown exponentially. Gone are the days of simple document browsing and online shopping. Digital and web based products help us manage our schedules, monitor our health, communicate as a team across the globe, fall in love, and campaign for causes.

<h2 id="data collection">Data collection is evolving</h2>

With these advances in digital platforms, we’ve seen digital data become more interesting. Beyond page views and link clicks, more of our day-to-day behavior is being captured in some form of analytics, creating digital “user journeys” that we can analyze. Consider the wellness app Strava, an app that captures all of an individual’s exercise. These user journeys include the miles run and cycled on different terrains at different speeds at different times of day, with different people at different events.


![new types of digital platforms][platforms]


The user journeys for an online bank, however, will look vastly different and include paying bills, managing finances, and saving for the future. Our entire lives are mediated via digital platforms and as a result, digital data describes us with a fair degree of accuracy, each journey on a different platform producing a data point that makes up how we engage with specific products and services for specific ends.

<h2 id="better data">Better data is a step towards better insights</h2>

Insight into human behavior of this magnitude is unprecedented! The era of data has granted us with unparalleled, empirical evidence about how we act the likes of which has never been seen before. We can understand how people manage their health, interact with friends, spread news, or fall in love in ways that were previously impossible (if you’re interested in learning more about how people fall in love, you should refer to Christian Rudder’s book “Dataclysm”). This data is invaluable. Businesses who understand how their users engage with them and their products are in a good position to understand who those users are, what their motivations are, how well the business is meeting user needs, and in turn going the extra mile to surprise and delight users with excellent product and service delivery.

To leverage data effectively to drive competitive insight, you need a platform that can handle the collecting your event data consistently across platforms, in real-time, through a single stack. Snowplow lets companies track the entire customer journey, across different platforms and channels, through a single pipeline into a single data warehouse and unified log. This provides an essential foundation for companies so that they can understand and analyze that user journey as a whole. The platform is flexible enough to enable companies as diverse as mobile banks, dating services, online grocers, wellness apps, or massive multiplayer online games to collect a data set that describes how their unique customers engage with their brand and products across mobile, web, television, apps, email, display, and other marketing channels. User data is an asset, and the Snowplow pipeline is designed to give you ownership and control of that asset.

<h2 id="value from data">Deriving value from your data</h2>

Data collection, however, is not enough. Collection is just the foundation of the data value chain; companies also need to be able to build insight on that data and act on that insight. Visualizing and socializing Snowplow data is an essential step in enabling companies running Snowplow to derive value from their data. The act of transforming data into a useable, meaningful format allows for sharing it throughout a business and empowering different people within to build that insight. Though many companies have moved from packaged SaaS web and mobile analytics providers to Snowplow, most have chosen to visualize and socialize their data using SQL-powered business intelligence (BI) tools that have dominated traditional data visualization. While SQL databases are very good at aggregating statistical data, event data has some fundamental differences.

<h2 id="details">The data is in the details</h2>

Event data is not aggregated like traditional statistical data. Most often, businesses are interested in combining different events to build a picture of a user journey; you’re interested in the paths a user took from one place to the next, the way they’ve chosen to accomplish a specific goal, or how far along they’ve made it into a conversion funnel. This type of multi-layered aggregation is not supported in SQL.

Because they are built and optimized for SQL databases, traditional BI tools are typically limited to visualizations that have dominated statistics for decades: histograms, pie charts, line graphs. Though it might be possible to create some funnels, these tools won’t let you ask more sophisticated questions about user journeys, such as how many users take one particular path through an application versus another path. The combination of event-level data in a SQL database with a BI tool on top means that a lot of work has to be done at the data modeling layer to transmute data into insight.


![traditional charts][charts]


This leaves data consumers with narrow exposure to the data, making it difficult to explore it in open-ended ways or build segments and analyzing behavioral differences. For example, all of the user segmentation logic would need to live in the data model, meaning an analyst has to have a good grasp of working in SQL to add new segments. Segment analysis is a core component of many types of analysis, and SQL-based BI tools typically require segments be built with SQL as part of the modeling layer, restricting who can work with the data.

<h2 id="visualization">Enhanced visualizations grant greater clarity</h2>

The [Indicative][indicative] team have launched a unique product built from the ground up to handle the complexities of event data and user journey analysis. With its own storage engine optimized for analysis of the user journey, Indicative makes it easy to efficiently query the sequence of events in a given user’s journey, or the time between those events. Through the innovative UI, data consumers across a business can work with data to ask their own questions and perform their own analysis of user journeys, letting any team assess the impact of events earlier in the user journey on the likelihood of outcomes later on in that journey, all without SQL knowledge.


![multi-path funnels using Indicative][indicative-graph]
*Plotting a multi-path funnel with Indicative*
<br>
<br>

The Indicative platform comes fully equipped with an out-of-the-box Snowplow integration. This empowers business units highly reliant on data for performance, like marketing and product management, to use the combined solution to conduct their own audience segmentation based on different properties or events in their journey and use that to further understand conversion rates in a given journey and model complicated, multi-directional funnels.

Learn more about how you can [use Indicative][indicative-demo] to build next-level data visualizations powered by [Snowplow data][insights] to build insight on your users’ entire journeys across all platforms, quickly, conveniently, and with more power than imaginable.



[platforms]: /assets/img/blog/2018/03/digital-platforms.jpg

[charts]: /assets/img/blog/2018/03/charts.jpg

[indicative-graph]: /assets/img/blog/2018/03/indicative-graph.jpg

[indicative]: https://www.indicative.com/

[indicative-demo]: https://www.indicative.com/request-a-demo/?utm_source=snowplow

[insights]: https://snowplowanalytics.com/products/snowplow-insights/?utm_source=behavioral%20data%20with%20indicative&utm_medium=first%20blog&utm_campaign=indicative
