---
layout: post
title: "What are Snowplow events and entities and what makes them so powerful"
title-short: "What are Snowplow events and entities and what makes them so powerful"
description: "This article explains what events and entities are, and how they allow you to set up your data collection for better data quality, data richness and flexibility so you can derive more value and insights from your data"
author: Lyuba
category:  Product features
permalink: /blog/2020/03/25/what-are-snowplow-events-and-entities-and-what-makes-them-so-powerful/
discourse: false
---


Events and entities are one of Snowplow’s most unique features. They are a key reason why Snowplow is able to deliver incredibly rich, granular and flexible data. However, Snowplow events and entities differ from the way other vendors collect and organize data which means the concept can be confusing at first. This article explains what events and entities are, and how they allow you to set up your data collection for better data quality, data richness and flexibility so you can derive more value and insights from your data.


## What are events and entities?

Events and entities describe your users’ behavior and actions. One of your first steps when setting up Snowplow is to define upfront what data you want to collect and what that data will look like. Defining your data structure through events and entities makes it possible to collect granular data shaped to your business and use cases, as well as improve the quality of your data. Let’s take a look at events and entities in more detail.



### Events

Similar to other vendors, Snowplow defines an event as anything that can be observed at a particular point in time. This can range from a link click, to commenting on a post or submitting a form. For example, if a user navigates to your website, and clicks on a blog post link, that link click would be recorded as an event.

Other examples of Snowplow events include:

*   Loading a web page
*   Adding an item to basket
*   Searching for an item
*   Sharing a video

In this way, events are useful for tracking specific user actions across your websites or app. However, events on their own often don’t give you the full picture of when or where something happened. To provide more detail, Snowplow automatically collects each event with [130 properties](https://github.com/snowplow/snowplow/wiki/canonical-event-model) to give users a snapshot of the environment the event took place in. For web events this includes data points such as device information, timestamp fields, scroll depth, marketing parameters, among others.

Getting started with events is easy since many events including page views, page pings, and other standard web analytics events are collected out-of-the-box. However, it is also possible to create [custom events](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/). This is especially useful for businesses who want to track events that are unique to their business or use case.


### Entities

Entities are attached to events, and describe the environment an event took place in. While an event describes an action that occured at a specific point in time, entities can persist over time.

For example, the link click event described above could include the following entities to add further detail and context around the event:

*   A user entity, who performed the link click
*   The web page where the event occurred
*   Information about the content featured in the blog

You can collect out-of-the-box entities, and entities can have their own properties as well to provide more context around each entity, giving you rich data by default. However, to get the most value out of your data we usually recommend setting up [custom entities](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/predefined-vs-custom-entities/) to augment your events with additional data that is specific and relevant to your product, website or app.

Another useful property of entities, is that multiple entities of the same or different types can be appended to a single event. For example, if a user navigates to your blog and clicks on an article, entities collected with this event might include user information such as a user identifier or the device the user was on when they clicked on the blog. Since the user is likely to carry out other events, such as submitting a form, entities offer an easy way to attach the same entity data across those events. This offers a convenient way to define common entities once, then use those definitions across all your events where those entities are relevant. As a result, a single event can have hundreds of properties; 130 out-of-the-box properties, properties of the custom event, and properties of the entities appended to the event (whether custom or automatic).

For example, in the diagram below a media website can track events to understand video viewership, with entities to provide additional information around when the video was added, the title of the video and what the video is about. Then, you can easily attach the same entity definition to other relevant events instead of having to manually build it each time.


![Events and entities - media example](/assets/img/blog/2020/03/events-entities-media.png)


### Using schemas to define your events and entities

To derive maximum business value from your data, it is important to have data quality, data meaning and data governance “built in” to your data collection. Events and entities make this possible because they are defined through a set of self-describing schemas. This means each schema is set up with information on who created the event and entity, what they are about, what format the custom properties are in, and the schema version. As a result, schemas allow you to:

*   Control what data is collected, and who can access it for better data governance.
*   Validate your data against the schemas, to ensure data accuracy.
*   Derive insights more easily from your data because it is loaded into your data warehouse with an expected structure.
*   Evolve event and entity definitions over time by updating those schemas, making it easier to evolve your data collection alongside your business.
*   Include more data as the business becomes increasingly data sophisticated and needs to collect more granular data.

In short, schemas make it possible to set up your tracking in a durable and scalable way, and enforce coherence in tracking definitions for each event and entity across the business with a clear and easy-to-understand record.


## What makes events and entities so powerful?

Now that you have a better understanding of what events and entities are, and how they are defined, you can begin to see why collecting and organizing data in this way is so effective. Let’s dive into some of the reasons behind what makes events and entities so powerful.


### Better data quality

For companies using data to inform business decisions, it is critical for the data to be as complete and accurate as possible. When it comes to ensuring [data quality](https://snowplowanalytics.com/blog/2020/02/12/what-is-data-quality-and-why-is-it-important/), many analytics vendors either drop bad data (leading to incomplete data sets) or try to transform the data in the data warehouse after the fact. Because SaaS vendors are ‘black boxes’ it is near impossible to know what happens to ‘bad data’.

As described above, all the data sent into the Snowplow pipeline is ‘validated’ against the schema definitions used to define your events and entities. These schemas make it possible for the pipeline to validate the data, and any data that fails validation goes into a separate location where users can debug and diagnose the issue. The bad data can subsequently be recovered and re-processed, preventing incomplete data sets from reaching the end user. The data that passes validation is therefore accurate and complete, and gets loaded into tidy tables in your data warehouse where it’s ready for your analysts to work with.


### Richer and more granular data

What sets events and entities apart from the way other vendors collect data, is their level of richness and granularity. As you already know, each event and entity is by default collected with at [130 properties](https://github.com/snowplow/snowplow/wiki/canonical-event-model#common), and you can track as many entities with each event, with as many data points per entity as you like.

Richer data means companies have access to much more granular insights into user behavior and preferences, which provides valuable data for a range of use cases, from customer journey optimisation to marketing attribution and operational reporting.


### Flexible data structures

Most analytics tools have a fixed data structure, which makes it difficult to accurately and effectively map tracking to your user’s behavior once you move beyond typical use cases. Snowplow’s data structure is completely flexible, meaning companies can define both their own events and entities.

What’s more, most data-informed companies want to collect data from a number of different sources. Often this is problematic with other vendors because the data from each source arrives in a different structure and in separate tables making it more difficult to join the data sets together for analysis. To help overcome this problem, Snowplow events and entities are not platform specific. This means data collected on mobile, web, server-side or from third-party sources arrives in your warehouse in a common format, making it much easier to work with the data.

More specifically, each line in the Snowplow events table represents a single event. Individual fields are stored in their own columns, which makes writing sophisticated queries on the data easy, and straightforward for analysts to use any kind of analysis tool with their Snowplow data to compose and execute queries. More specifically, here is how you can expect your data to look in your warehouse following a simple transformation:

![Data structure](/assets/img/blog/2020/03/events-entities-data-structure.png)

## Summary

Although working with events, entities and schemas requires putting in time and effort to define your tracking upfront, the result is a much more robust data strategy optimized for getting the most value and insights out of your data.

If you are interested in learning more about events and entities, or how we work with our customers to design and implement a customized data collection strategy, get in touch with us [here](https://snowplowanalytics.com/get-started/).
