---
layout: post
title-short: How to ensure your data collection evolves alongside your business
title: "How to ensure your data collection evolves alongside your business"
description: "With Snowplow, you can easily publish, update and validate your tracking so your data collection evolves with your business"
author: Lyuba
category: Product features
permalink: /blog/2019/07/23/how-to-ensure-your-data-collection-evolves-alongside-your-business/
discourse: true
---





Modern businesses evolve quickly. While twenty years ago it was common to update a website every few years, now modern digital businesses make changes to their websites and applications weekly, or even daily. At the same time, most data-driven businesses would agree that collecting data is an essential part of optimizing the user experience. This creates a data collection challenge: the faster companies evolve their websites and apps, the harder it becomes to reliably collect data that describes the current state of user journeys through those websites and apps. On top of that, digital businesses typically need to extend their tracking over time as they become more analytically sophisticated and ask tougher questions of the data, creating a second driver for evolving their data collection. 

 

However, as an organization collects more data, the process of evolving or adding new tracking becomes messy, difficult to record, and time consuming to organize. As a result, many companies end up working with data that does not reflect the reality of how users interact with their website or app. In this post, we will explore how schema versioning enables companies to evolve their data collection with their business and therefore meet the challenge posed above.


## The foundation of your data collection: events, entities and schemas

 

Defining events and entities you want to track is the key to making sure you collect the right data. Web and mobile data collection record a stream of events, where each event describes an action taken by a user at a particular point in time. This includes actions such as adding an item to a basket, sharing a video, entering a destination or loading a web page. To add more detail to your data, you can also track entities with your events; objects tracked across events such as a person, web page, shopping basket or product. 

Whilst there are a number of data collection platforms that will enable you to define your own events, [Snowplow](https://snowplowanalytics.com/) is the only data collection platform that allows you to define your own entities - these definitions (of events and entities) are schemas. Schemas define the fields recorded with each event and entity, and describe the data points contained within each entity. For example, a product can contain data points including SKU, name, size or price. Snowplow stores your schemas in a schema registry: this creates a centralized source of truth for a company’s data collection. In fact, you can think of schemas as the ‘DNA’ of your data because they provide data teams with a clear understanding of the data structure, format and content. 

 

However, many companies struggle to bring their schemas up to speed quickly enough, which leads to data that does not properly describe the events taking place on the website or app. Read on to find out how Snowplow makes it easier for your business to easily and consistently evolve your data tracking.

 


## How Snowplow can make it easier for you to update your tracking and collect higher quality data

Schemas in Snowplow are versioned. This means Snowplow users can change their schemas over time to reflect the changes they make to their tracking. What’s more, schema versioning in Snowplow is very flexible: it is even possible for companies running Snowplow to make breaking changes to their schemas. Because Snowplow data is self-describing, with every event and entity recorded with a reference to what schema it uses including the version, it is possible to collect multiple different versions of events at the same time. This becomes critical at larger organisations where the pace of evolution might vary between different websites, apps and platforms. Snowplow’s technology works in such a way that data collected against old definitions lives alongside data collected against new definitions. 

At Snowplow, we’re committed to helping data-driven companies evolve data collection alongside your business and products, no matter how many events or entities you track. With Snowplow, you can create new schemas and update existing schemas in only a few steps, making it much easier for companies to keep their data collection evolving with their business. 

 

The ability to version and iterate schemas is one of the most powerful features offered in Snowplow open source and [Snowplow Insights](https://snowplowanalytics.com/products/snowplow-insights/). With the latest release of Snowplow Insights, Snowplow users can now create, edit, test and publish schemas through a convenient UI, so keeping your data collection evolving with your business is easier than ever.

 

To find out how Snowplow Insights can improve your data collection, you can [get in touch with our team here](https://snowplowanalytics.com/request-demo/).
