---
layout: resources
title: Getting started with Snowplow
description: The Snowplow technology is ideal for data teams who want to manage the collection and warehousing of event data across all their platforms, in real-time.
permalink: /resources/getting-started/
class: how-we-compare
assets:
  css: assets/css/casestudy.css
  js:
toc: true
---

# Getting started with Snowplow
This serves as a high-level guide covering, in non-technical terms, what Snowplow is, what problems it can solve and how to best make use of it.
<br>
<br>

## What is Snowplow?
Snowplow is a data collection platform. It is software that you can install in your cloud environment (AWS or GCP) to collect rich and high quality data, delivered to your data warehouse.

You can use one of Snowplow’s 16 trackers in your website, app or server, or make use of a Snowplow webhook to capture third-party data. The Snowplow pipeline will deliver the data to a data warehouse of your choice. From there, you are free to use the data as you wish.

Snowplow puts you in full control of your data and empowers you to ask an answer any question of your data using whatever tool, method or technology you want.
<br>
<br>

![get-started](/assets/img/resources/getting-started/get-started@2x.png)
<br>
<br>

## Why would I use Snowplow?
There are many reasons why we think companies should use Snowplow. We’ve compiled a short-list of what we believe are some of the most compelling reasons:
<br>
<br>

1.  All your data lives in your own environment, not Snowplow’s, so you have unlimited access to and full control of all your event-level data
2.  Your data is available in real-time (<2 seconds), which means you can build real-time applications on top of your data
3.  Your data from all your platforms (web/mobile/server/emails/ad impressions) is structured in the same way and stored in the same place
4.  You can fully customize your tracking design; your design is tailored to your business and use cases, meaning you capture data tailored to you
5.  Your data can be enriched, in real-time, with a [range of third-party sources](https://docs.snowplowanalytics.com/snowplow-insights/enrichments/)
6.  Data is very well structured and of high quality due to the validation step in the pipeline (events that fail validation are stored, but not in the warehouse, meaning the pipeline is non-lossy) making it a perfect input for machine learning models
7.  Tracking is versioned allowing for your data strategy to evolve - the complexity and detail can grow with the complexity of the questions that you want to answer
8.  Snowplow events are extremely rich, each event collected has at least 130 properties (where available) allowing for a very robust understanding of your users
9.  Snowplow offers lots of tooling around privacy to allow for GDPR compliance, including data hashing at collection and scrubbing of stored data
<br>
<br>

## How do I use Snowplow?
With Snowplow Insights, we set up and maintain your pipeline. All you need to do is:
<br>
<br>

1. Decide what you want to track
2. Build custom models to start actioning off the data
<br>
<br>

The only resource you need to begin using Snowplow is some time from a front end developer who can add our tracker code in your website, app and server as necessary. For out-of-the-box tracking, this should only take an hour but for custom tracking this can take up to a day.
To really derive value from Snowplow data, you will need data analysts who can use SQL to build data models.
<br>
<br>

## What do I track?
With Snowplow, you can track events and entities.
<br>
<br>

### What events do I track? 
The first (and hardest) step is to decide on what events you want to track. Creating a tracking design should start with thinking long and hard about what questions you want to ask of the data. With Snowplow Insights, you can access the Implementation Engineering team who leverage best practises from numerous implementations to help you get this foundation right. 
Compared to designing a tracking strategy, implementing the tracking is simple. For instance, for tracking on the web we have a wealth of out of the box tracking that can be set up in minutes using a tool like Google Tag Manager.
Some out of the box events you can track are:
+ Page views
+ Page pings
+ Link clicks
+ Form fills
+ Search
<br>
<br>

You can track an unlimited number of custom events, each with an unlimited number of custom properties with varying data types. Some examples that could be useful are:
+ Subscription flow
+ Checkout flow
+ Signup/signin flow
+ Product return flow
+ Engagement (like, comment, rate, share)
+ Impression
<br>
<br>

Remember, all Snowplow events (custom/out-of-the-box/web/mobile) are tracked with the same 130 properties (when they are available/relevant) collecting data on:
+ Timestamp fields
+ User identifiers
+ Device and platform information
+ Location fields
+ Web page information
+ Marketing parameters
<br>
<br>

### What are entities, and which ones do I track?
Once you have a list of events you want to track, you can decide on which entities to track. An entity is something that is attached to an event. Each entity describes the environment the event takes place in. 
Multiple entities of different, or the same type can be sent with any event. The two main reasons to use an entity are as follows:
<br>
<br>

1. You want to send multiple of the same entity with an event. For example, with a search event, you want to send multiple search result entities, one for each search result displayed. Each search result entity can have rich information about that search result such as order, name, vendor, price.
<br>
<br>
    ![Multiple Entities](/assets/img/resources/getting-started/SPW-Website-Resources-Getting-Started-Entities-1.png)
<br>
<br>

2. You want to send the same custom information with many events. To standardise how this custom data is captured, you can create one entity and send this with many event types. For example, to know whether a user is a subscriber or not is useful with many events so this can be sent in a user entity with all events.
<br>
<br>
    ![Multiple Entities](/assets/img/resources/getting-started/SPW-Website-Resources-Getting-Started-Entities-2.png)
<br>
<br>
    ![Multiple Entities](/assets/img/resources/getting-started/SPW-Website-Resources-Getting-Started-Entities-3.png)
<br>
<br>

Some example entities often used by our customers are:
+ User
+ Content (can be split into video, article etc)
+ Product
+ Transaction
+ Subscription
<br>
<br>

### What will the data actually look like?
Let’s take an example of someone looking for parts to refurbish their snow plow before winter comes (this view should reflect that of a retailer).
<br>
<br>

![Data](/assets/img/resources/getting-started/SPW-Website-Resources-Getting-Started-Data-1.png)
*Note: Remember that only 3 out of 130 out of the box properties are shown here, each event can also come with timestamps, weather, location, device, cookies, marketing campaign id and much more. In addition, each custom event and entity can have many many more properties, only a subset are shown here.*
*Warning: The name is shown as an example field to make the blog post more readable, always be cautious collecting PII.*
<br>
<br>

This shows a very simplified user journey as it would appear in your data warehouse. Data from all trackers is loaded into one table, the image above is what a subset of your BigQuery columns may look like. 
These are the actions that correspond with the data in this table:
<br>
<br>

1. Someone goes on their laptop and visits the site. We know what site they visited and on which browser.
2. A few minutes later they register and we know their name is Joe. We know they are the same user as they have the same cookie.
2. They then search for “wheels”, we know that they were only served with 2 results: “wheel_set” and “wheel” and their respective prices.
4. Joe clicked on the wheel_set.
5. After scrolling the page (scroll measured with pings, not shown in table), Joe adds the wheel_set to their basket.
6. A few days later, Joe opens an email on the laptop (we know it's Joe because the 3rd party cookie is the same) with a Black Friday coupon. We can capture which campaign it was part of.
7. Joe was busy earlier so later that day Joe logs in on the iOS app and decides to checkout using the Black Friday coupon.
8. Joe checks out with two items, the wheel_set and a plow (previously added to basket) and a transaction ID is logged.
9. An event from the server is also logged with the same transaction ID showing the discounted price ($499.99 + $3499.99) x 0.7 = 2799.99 with 30% off from the coupon.
10. Sadly, a week later, Joe is unhappy with the plow and returns it. This event is logged in the server with the same transaction ID.
<br>

Let’s take another example where someone is looking to learn more about machines that plow snow (this view should reflect that of a media company).
<br>
<br>

![Data](/assets/img/resources/getting-started/SPW-Website-Resources-Getting-Started-Data-2.png)
*Note: remember that only 3 out of 130 out of the box properties are shown here, each event can also come with timestamps, weather, location, device, cookies, marketing campaign and much more. In addition, each custom event and entity can have many many more properties, only a subset are shown here.*
*Warning: The name is shown as an example field to make the blog post more readable, always be cautious collecting PII.*
<br>
<br>

These are the actions that correspond with the data in this table:
1. Someone goes on their laptop and opens an email sent by you. You know which campaign it was part of and more importantly, the 3rd party cookie of the user that opened it.
2. They click a link in the email and visit your site, you know what page they visited when, and on which browser and device.
3. They decide they want to learn more about machines that plow snow so they search for “snowplo” as they are unsure how to spell it. Your site returns 2 results, one for an article on Snowplows, the other on Snowploughs.
4. They choose the article on Snowplows! You also know who wrote the article and when it was created and last updated as these are custom properties of the content entity (not shown in table above).
5. They enjoy the article so much they share it. You know that they shared it on Facebook as that was one of the properties of the ‘engage’ event (not shown).
6. They attempt to download a fact file on Snowplows but they are blocked by a paywall.
7. The paywall works and they begin the subscription flow by entering their personal details like name (events for this not shown) to create an account and choose a monthly plan.
8. After some other steps (not shown), Joe successfully subscribes. A subscription ID is now associated with all future events created by Joe on those devices.
9. Since this is a critical event to track, to get around potential ad blocker issues, the subscription is confirmed server-side too.
10. Some days later Joe is on their phone, having previously downloaded the app and logged in, to find that article again to show some friends they are with.
11. Joe and friends watch a Snowstorm video in the related content section of the Snowplow article in the app.
12. They spot a picture in the same article that they want to send to another friend so they screenshot it. In reality this event occurred offline when Joe and friends were in the metro but the event was sent when the connection was re-established (the timestamp with the event was actually accurate to when the event was created).
<br>

Hopefully you can now begin to see what Snowplow can do. The platform collects and delivers great raw data. What you decide to do with it is in the hands of your Data Team.
<br>
<br>

### What can I do with the data?
The short answer is; whatever you want. Snowplow puts you in full control of your data and empowers you to ask an answer any question of your data using whatever tool, method or technology you want. 
Snowplow users and customers use our technology for a range of things and it really depends on their industry, business model and team size. Some common use cases include:
+ Build a single customer view across web, mobile, offline and 3rd party channels
+ Accurately measure, attribute and optimize marketing spend
+ Understand the customer/user journey 
+ Use the data to power machine learning models and A/B tests
+ Build real-time applications and automations on top of the data
<br>
<br>

What you do with the data depends on how developed your data team is. We refer to this as data maturity and usually find our customers in one of three categories:

1. *We’re getting started* - Data team with 1 data analyst
+ Track web and mobile engagement and conversions
+ Map user journeys and funnels
+ Basic user stitching
+ Retention analysis
+ Marketing attribution modeling
<br>
<br>

2. *We’re growing* - Data team with many data analysts
+ Track events server-side
+ Ingest 3rd party marketing data
+ Advanced user stitching
+ A/B testing and rule-based automations
<br>
<br>

3. *We’re well established* - Data team with data analysts, engineers and scientists
+ Real-time marketing automation
+ Personalisation of product and user experience
+ Fraud and anomaly detection
+ Sentiment analysis
+ Machine learning
<br>
<br>
<br>
<br>