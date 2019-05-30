---
layout: post
title-short: Snowplow for media part 2
title: "Snowplow for media part 2: what do I track?"
tags: [analytics, data, insights, media, media analytics]
author: Archit
image: /assets/img/blog/2019/03/pipeline.png
category: Analytics
permalink: /blog/2019/05/29/snowplow-for-media-part-2/
discourse: true
---

We recommend you read the [main post](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-1/) on this topic before diving into this article to ensure you have all the context you need!

Bear in mind there are 3 more posts in this series that you can read after this one:
1. [What can we do with the data, we’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/)
2. [What can we do with the data, we’re growing](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-4/)
3. [What can we do with the data, we’re well established](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-5/)

<br>

- [What do I track?](#what-do-i-track)
- [Great, what events do I track?](#great-what-events-do-i-track)
- [What are entities, and which ones do I track?](#what-are-entities-and-which-ones-do-i-track)

## What do I track?

With Snowplow, you can track entities as well as events.

## Great, what events do I track?

The first (and hardest) step is to decide on what events you want to track. Creating a tracking design should start with thinking long and hard about what questions you want to ask of the data. With Snowplow Insights, you have access to the Implementation Engineering team who leverage best practises from numerous implementations to help you get this foundation right.

Compared to designing a tracking strategy, implementing the tracking is simple. For instance, for tracking on the web we have a wealth of out of the box tracking that can be set up in minutes using a tool like Google Tag Manager.

For the purposes of this blog post, we will give some examples from what we have seen many clients in the media sector do.

To begin with, some out of the box events you can track are:

- Page views
- Page pings
- Link clicks
- Form fills

You can track an unlimited number of custom events, each with an unlimited number of custom properties with varying data types. Some examples that could be useful are:

- Subscription flow
- Donation flow
- Sign up/sign in flow
- Generic engagement (like, comment, rate, share)
- Video engagement (video play, video stop)
- Native ad impression
- Paywall

Remember, all Snowplow events (custom/out-of-the-box/web/mobile) are tracked with the same 130 properties (when they are available/relevant) collecting data on:

- Timestamp fields
- User identifiers
- Device and platform information
- Location fields
- Webpage information
- Marketing parameters

## What are entities, and which ones do I track?

Once you have a list of events you want to track, you can decide on which entities to track. An entity is something that is attached to an event. Each entity describes the environment the event takes place in.

Multiple entities of different, or the same type can be sent with any event. The two main reasons to use an entity are as follows:

1. You want to send multiple entities of the same type with an event. For example, with a search event, you want to send multiple search result entities, one for each search result displayed. Each search result entity can have rich information about that search result such as order, name, vendor, price.

![search results][search results]

2. You want to send the same custom information with many events. To standardise how this custom data is captured, you can create one entity and send this with many event types. For example, to know whether a user is a subscriber or not is useful with many events so this can be sent in a user entity with all events.

![event properties 1][event properties 1]
![event properties 2][event properties 2]

Some example entities often used by media companies are:
- User
- Article
- Video
- Native ad
- Subscription
- Affiliate

Read next: [What can we do with the data, we’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/)

[search results]: /assets/img/blog/2019/05/search-result.png
[event properties 1]: /assets/img/blog/2019/05/entities-1.png
[event properties 2]: /assets/img/blog/2019/05/entities-2.png
