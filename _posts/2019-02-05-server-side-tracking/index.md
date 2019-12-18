---
layout: post
title-short: Improving your analytics with server-side tracking
title: "How server-side tracking fills holes in your data and improves your analytics"
tags: [analytics, server-side, tracking, data science]
author: Rebecca
image:
category: Data Insights
permalink: /blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/
discourse: true
---

<h2 id="client side tracking">Client side tracking: a brief history lesson</h2>

At Snowplow Analytics, we fundamentally believe that getting data collection right is one of the most important steps for deriving value from data. This is often an iterative process and the data you collect and how you collect it should evolve over time as your use cases and your analytics set up evolves and matures. While collecting data client-side is universal across our customer base, we want to make sure that our customers also understand the power of combining this with server-side data collection to create richer and more detailed data.

A look back at the history of web analytics helps explain the trends in how and where we track today. The evolution of JavaScript tags to track client-side in the late 90’s meant that many people migrated from the log file analysis of the early 90’s to JavaScript tracking. People realized that by using JavaScript tags, you could capture far more information about your users and set device and session identifiers in your cookies, making it easier to identify users over time and divide browsing into sessions. Alongside this, people were starting to serve content via CDNs and delivering functionality client-side with JavaScript via AJAX - neither of these hit the server, therefore reinforcing the importance of client-side tracking.

<h2 id="limitations of client side only">The limitations of an exclusive client-side approach</h2>

Exclusively using client-side tracking does have limitations though. We work with customers who want to do sophisticated digital analytics with their data. Due to the ubiquity and well understood nature of client-side tracking, there is often the temptation to push huge amounts of data to a tag manager’s “data layer” so it can be tracked client-side. Many companies simply aren’t aware of the server-side option, so default to tracking everything client-side which can lead to pretty unusual behavior.

Let’s take the example of a media company; they want to track richer information - for example, more metadata about an article on a news site (subject, tags, author, length, written date etc.). In an exclusively client-side set up, they end up "pushing" that data from the server (where it is readily available) to the client-side data layer (where otherwise that information wouldn't be). We don’t think this is the right solution and we want to remind you about client-side tracking's under-appreciated sibling - server-side tracking.

<h2 id="server side tracking">Server-side tracking gives you greater coverage</h2>

![servers][servers]

We understand that it feels much easier to take the approach of pushing all of this information client-side, but finding the right mix of client-side and server-side is where we see Snowplow customers unlocking huge value. Besides the fact that it is more direct to record server-side data directly from servers, here are a number of other particularly compelling use cases for server-side tracking which we frequently see:

* **You want to collect data that you can’t expose client-side for commercially sensitive reasons -** across most industries there are things too sensitive to expose on the client-side that would still be beneficial to track. An example that illustrates this well is margin or profit data in Retail, e.g. relating to, SKUs which are added to a basket or that make up part of a transaction. Having this data in an analytics system is valuable: it enables companies to calculate the actual return on marketing spend (based on profit generated rather than revenue). But retailers will likely want to treat that margin data as confidential, and not expose it client-side so that visitors to the website can see exactly what profit is made on different items sold.

* **You want to track events that do not occur in the user’s browser -** there are numerous cases of this across a range of industries. Again to use a Retail use case, actions such as fraud checks and order returns would be tracked server-side.

* **You want to change the narrative on ad-blocking -** catching up with ad blockers on the client-side is a valiant effort but you can track mission critical data server-side for greater reliability.

<h2 id="use server side to your advantage">How server-side tracking can be used to your advantage</h2>

Server-side tracking has come a long way since server-log analysis in the past. Using Snowplow server-side trackers (e.g. our Python, Java, Scala, Ruby, C++ or PHP trackers), users can define their own rich events and entities, and send that information into Snowplow in near real-time, all exactly as they can client-side. The order returns example from a Retailer can illustrate how using a server-side tracker gives you richer data. When using server-log analysis in the past, you were stuck recording very basic data points i.e. this endpoint was hit at this time from this IP address. Now, harnessing server-side tracking allows you to collect granular data which tells you this red sweater was returned, in size medium, from shopper 123, via click and collect.

Sounds great - but what about joining the data? If say your objective is to understand a customer journey, this will now involve stitching client-side and server-side data about an individual user. Traditionally this has been challenging, with some web analytics tools making reverting to the option of pushing everything client-side seem sensible. However, for Snowplow users stitching this data is very simple!

You can use identifiers from three different categories; device identifiers (cookie IDs, IDFVs), User IDs or IP Addresses, to start constructing the data stitch. You will want to identify the same user across the client-side and server-side data; to join this data, we would expect this stitch to be done at the data modeling stage of the Snowplow pipeline.

There are two use cases where you would want to join your client-side and server-side data:

The first is where we are stitching together client-side and server-side events related to a journey through a website or mobile app, where you have made a deliberate decision to track some things server-side and some things client-side. For this use case in web we also ideally want to know that the client-side and server-side events are from the same session.

For an unknown user e.g. browsing a website, where the events are recorded client and server-side, it is possible to have server-side code that reads the Snowplow first party cookie (because this is set on the company's own domain), the `domain_userid` and `domain_sessionid` value and record these with the server-side events. An example of doing this with the Python Tracker can be done as documented [here][python].

The second use case for the data stitch relates to a customer journey where the server-side event doesn’t happen in the browser - for example, with a Retailer and a returned item coming back to the warehouse via the post.

For known users e.g. a user returning the red sweater, we should have a purchase ID or user ID on the return form which can be mapped to the transaction ID for the stitch.

<h2 id="is server side right for me">Client and server-side tracking: is it right for me?</h2>

Fundamentally, there is no right or wrong approach to tracking implementation
and there is no one-size-fits-all for any business model or vertical. This is why the flexibility to instrument tracking in any number of ways is core to the Snowplow product. It is worth thinking about whether the right combination of client-side and server-side tracking could allow you to unlock greater value and deliver better insights from your data in competitive times.

[Get in touch with the Snowplow team][demo] if you want to discuss how to evolve your tracking to collect richer data.


[demo]: https://snowplowanalytics.com/request-demo/?utm_source=website&utm_medium=blog&utm_campaign=server-side&utm_term=-&utm_content=text-link

[python]: https://github.com/snowplow/snowplow/wiki/Python-Tracker?utm_source=website&utm_medium=blog&utm_campaign=server-side-2&utm_term=-&utm_content=text-link#set-domain-user-id

[servers]: /assets/img/blog/2019/02/servers.jpg
