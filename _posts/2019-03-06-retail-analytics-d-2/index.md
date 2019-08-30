---
layout: post
title-short: Snowplow for retail 2
title: "Snowplow for retail part 2: what data do I track?"
tags: [analytics, data, insights, retail, retail analytics, ecommerce]
author: Archit
image: /assets/img/blog/2019/03/entities.png
category: Data Insights
permalink: /blog/2019/03/06/snowplow-for-retail-part-1-what-data-do-I-track/
discourse: true
---

We recommend you you have read the [first post in this series][part-1] before diving into this one to ensure you have all the context you need!

There are also three more posts in this series that you can read next:
1. [What can we do with data when we're getting started?][part-3]
2. [What can we do with data when we're growing?][part-4]
3. [What can we do with the data when we're well established?][part-5]

<h2 id="what">What do I track?</h2>

With Snowplow, you can track entities as well as events.

<h2 id="events">Great, what events do I track?</h2>

The first (and hardest) step is to decide on what events you want to track. Creating a tracking design should start with thinking long and hard about what questions you want to ask of the data. With Snowplow Insights, you can access the Implementation Engineering team who leverage best practices from numerous implementations to help you get this foundation right.

Compared to designing a tracking strategy, implementing the tracking is simple. For instance, for tracking on the web we have a wealth of out of the box tracking that can be set up in minutes using a tool like Google Tag Manager.

For the purposes of this blog post, we will give some examples from what we have seen many clients in the retail sector do.

Some out of the box events you can track are:

- Page views
- Page pings
- Link clicks
- Search

You can track an unlimited number of custom events, each with an unlimited number of custom properties with varying data types. Some examples that could be useful are:

- Checkout flow
- Signup/signin flow
- Return

Remember, all Snowplow events (custom/out-of-the-box/web/mobile) are tracked with the same 130 properties (when they are available/relevant) collecting data on:

- Timestamp fields
- User identifiers
- Device and platform information
- Location fields
- Webpage information
- Marketing parameters


<h2 id="entities">What are entities, and which ones do I track?</h2>

Once you have a list of events you want to track, you can decide on which entities to track. An entity is something that is attached to an event. Each entity describes the environment the event takes place in.

Multiple entities of different, or the same type can be sent with any event. The two main reasons to use an entity are as follows:

1. You want to send multiple of the same entity with an event. For example, with a search event, you want to send multiple search result entities, one for each search result displayed. Each search result entity can have rich information about that search result such as order, name, vendor, price.

![entities][entities]

2. You want to send the same custom information with many events. To standardize how this custom data is captured, you can create one entity and send this will many event types. For example, to know whether a user is a subscriber or not is useful with many events so this can be sent in a user entity with all events.

![events][events]
![props][properties]

Some example entities often used by retailers are:
- User
- Product
- Transaction


Read part 3 next: [What can we do with data when we're getting started?][part-3]







[part-1]:/blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/

[part-3]: /blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/

[part-4]: /blog/2019/03/06/snowplow-for-retail-part-4-what-can-we-do-with-data-when-were-growing/


[part-5]: /blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/


[entities]: /assets/img/blog/2019/03/entities.png

[events]: /assets/img/blog/2019/03/events.png

[properties]: /assets/img/blog/2019/03/props.png
