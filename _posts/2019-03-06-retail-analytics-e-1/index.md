---
layout: post
title-short: Snowplow for retail 1
title: "Snowplow for retail part 1: how can I use Snowplow?"
tags: [analytics, data, insights, retail, retail analytics, ecommerce]
author: Archit
image: /assets/img/blog/2019/03/pipeline.png
category: How to guides
permalink: /blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/
discourse: true
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Snowplow_For_Retail.jpg
thumbnail-image: /assets/img/blog/featured/SP-Blog-Post-Snowplow_For_Retail-mini.jpg
---

"We have several disparate brands and users have multiple touch points (web, app, over the phone and in store) before purchasing and we don’t have a single customer view. This means we can’t effectively group our users.

We don’t have a good understanding of how our marketing spend across multiple channels affects revenue.

We just released an app and people are downloading it but not buying on it, it feels like lost revenue.

We’re spending a lot on fraudulent transactions."

This post is non-technical and is intended to show you how you could solve these problems that retailers face every day with Snowplow. This is the first post in a series on the subject, there are 4 more in this series which you can read next:

1. [What do I track?][part-2]
2. [What can we do with data when we're getting started?][part-3]
3. [What can we do with data when we're growing?][part-4]
4. [What can we do with the data when we're well established?][part-5]
<br>

In this post, I'll cover:
- [What is Snowplow?](#what-is-snowplow)
- [Why would I use Snowplow?](#why-would-I-use-Snowplow)
- [How do I use Snowplow?](#how-do-I-use-Snowplow)
  - [What do I track?](#what-do-I-track)
- [What will the data actually look like?](#what-will-the-data-look-like)
- [What can we do with the data?](#what-can-we-do-with-the-data)
- [Dare I ask, GDPR?](#gdpr)

<h2 id="what-is-snowplow">What is Snowplow?</h2>

Simply put, Snowplow is a data collection tool.

It is software that you can install in your cloud environment (AWS or GCP) to collect rich and high quality data.

You can use one of Snowplow’s trackers in your website, app or server; or a Snowplow webhook to capture third party data and the Snowplow pipeline will deliver the data to a data warehouse of your choice. From there, you are free to use the data as you wish.

![the Snowplow pipeline][pipeline]


<h2 id="why-would-I-use-Snowplow">Why would I use Snowplow?</h2>

At risk of sounding like a clickbait article, here are 10 reasons you would use Snowplow:

1. All your data lives in your own environment, not Snowplow’s, so you have unlimited access to all your event level data
2. Snowplow events are extremely rich, each one collected with at least 130 properties (where available) allowing for a very robust understanding of your users
3. Data is available in real time, which means fresh data for your reports in seconds
4. Data from all platforms (web/mobile/server side/emails/ad impressions) is structured in the same way and stored in the same place
5. Fully customizable tracking design is possible, your design is tailored to your business and use cases, meaning you capture data tailored to you
6. Often significantly cheaper than GA360 or Adobe Analytics
7. Data can be enriched with 3rd party sources
8. Data is very well structured and of exceptionally high quality due to the validation step of the pipeline (events that fail validation are also stored, but not in the warehouse, meaning the pipeline is non-lossy) making it a perfect input for machine learning models
9. Tracking is versioned allowing for evolution of data strategy - the complexity and detail can grow with the complexity of the questions that you want to answer
10. Lots of tooling around privacy to allow for GDPR compliance including data hashing at collection and scrubbing stored data


<h2 id="how-do-I-use-Snowplow">How do I use Snowplow?</h2>

With Snowplow Insights, we set up and maintain your pipeline. All you need to do is:

1. Decide what you want to track
2. Build custom models to start actioning off the data

The only resource you need to begin using Snowplow is some time from a front end developer who can paste our tracker code in your website, app and server as necessary. For out of the box tracking, this should only take an hour but for custom tracking this can take up to a day.

To really derive value from Snowplow data, you will need data analysts who can use SQL to build data models.

<h3 id="what-do-I-track">What do I track?</h3>

With Snowplow, you can track entities as well as events. The [next post][part-2] in this series is a longer post on this topic, including an explanation of entities.

For now, let’s assume you’ve worked with our Implementation Engineering team to set up tracking following our best practices and look at what the data would look like.

<h2 id="what-will-the-data-look-like">What will the data actually look like?</h2>

Let’s take an example of someone looking for parts to refurbish their snow plow before winter comes.

![customer data][table]

This shows a very simplified user journey as it would appear in your data warehouse. Data from all trackers is loaded into one table, the image above is what a subset of your BigQuery columns may look like.

*Note: remember that only 3 out of 130 out of the box properties are shown here, each event can also come with timestamps, weather, location, device, cookies, marketing campaign and much more. In addition, each custom event and entity can have many many more properties, only a subset are shown here.*
<br>
*Warning: The name is shown as an example field to make the blog post more readable, always be cautious collecting PII.*

These are the actions that correspond with the data in this table:

1. Someone goes on their laptop and visits the site. We know what site they visited and on which browser
2. A few minutes later they register and we know their name is Joe. We know they are the same user as they have the same cookie
3. They then search for “wheels”, we know that they were only served with 2 results: “wheel_set” and “wheel” and their respective prices
4. Joe clicked on the wheel_set
5. After scrolling the page (scroll measured with pings, not shown in table), Joe adds the wheel_set to their basket
6. A few days later, Joe opens an email on the laptop (we know it's Joe because the 3rd party cookie is the same) with a Black Friday coupon, we can capture which campaign it was part of
7. Joe was busy earlier so later that day Joe logs in on the iOS app and decides to checkout using the Black Friday coupon
8. Joe checks out with two items, the wheel_set and a plow (previously added to basket) and a transaction ID is logged
9. An event from the server is also logged with the same transaction ID showing the discounted price ($499.99 + $3499.99) x 0.7 = 2799.99 with 30% off from the coupon
10. Sadly, a week later, Joe is unhappy with the plow and returns it. This event is logged in the server with the same transaction ID

Hopefully you can now begin to see what Snowplow can do. The tool collects and delivers great raw data. What you do next is in the hands of your data team.

<h2 id ="what-can-we do-with-the-data">What can we do with the data?</h2>

Use this wealth of data to drive ROI by:
- Reducing marketing spend
- Increasing conversion rates
- Minimizing revenue loss due to bugs
- Reduce costs due to fraud
- Drive revenue by optimizing what you sell

What you do with the data depends on how developed your data team is. Let’s take a look at 3 degrees of data team maturity. Follow the links to read a full post on how a team of each size in the retail sector could consume Snowplow data (note that each post assumes you have read the previous ones):

- [We’re getting started][part-3] *Data team: 1 data analyst*
  - Track web and mobile engagement
  - Track offline conversions
  - Stitch user journeys
  - Marketing attribution

- [We’re growing][part-4] *Data team: Many data analysts*
  - Track server-side
  - Ingest 3rd party marketing data
  - Funnels
  - Advanced user stitching

- [We’re well established][part-5] *Data team: Data analysts, engineers and scientists*
  - Marketing automation
  - Personalization of the product
  - Anomaly detection
  - Fraud detection
  - Supply chain optimization
  - Sentiment analysis

<h2 id="gdpr">Dare I ask, GDPR?</h2>

If you are an existing Snowplow Insights customer or are interested in Insights, do get in touch and we can send you extensive documentation on how we help you comply with GDPR. Some key points:

- Specific rows of data can be deleted from all the places they are stored if necessary
- PII, such as IP address, can be hashed by the pipeline so you can still analyze user behavior using the hashed values
- Fields can be removed from events using custom enrichments if necessary
- The client data that you capture all lives in your own cloud environment, not Snowplow’s - remember Snowplow is just a piece of software, the hardware is all in your AWS or GCP account


Read part two next: [What do I track?][part-2]








[part-2]: /blog/2019/03/06/snowplow-for-retail-part-1-what-data-do-I-track/
[part-3]: /blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/

[part-4]: /blog/2019/03/06/snowplow-for-retail-part-4-what-can-we-do-with-data-when-were-growing/

[part-5]: /blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/


[pipeline]: /assets/img/blog/2019/03/pipeline.png

[table]: /assets/img/blog/2019/03/tables.png
