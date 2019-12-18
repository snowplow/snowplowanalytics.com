---
layout: post
title-short: Snowplow for media part 1
title: "Snowplow for media part 1: how can I use Snowplow?"
tags: [analytics, data, insights, media, media analytics]
author: Archit
image: /assets/img/blog/2019/03/pipeline.png
category: Data insights
permalink: /blog/2019/05/29/snowplow-for-media-part-1/
discourse: true
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Snowplow_for_Media.jpg
thumbnail-image: /assets/img/blog/featured/SP-Blog-Post-Snowplow_for_Media-mini.jpg
---

*“We don’t know where to focus our content creation efforts; which content leads to retention and subscription? which content categories, authors, themes drive high CPMs?*

*We have several disparate brands and users have multiple products on the web and in our app so we don’t have a single customer view. This means we can’t effectively group our users based on engagement or monitor how they are retained.*

*We don’t have a good understanding of how our marketing spend across multiple channels affects subscription or readership.”*

This post is non-technical and is intended to show you how you could solve these problems with Snowplow. This is the first post in a series on the subject, there are 4 more in this series which you can read next:

1. [What do I track](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/)
2. [What can we do with the data, we’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/)
3. [What can we do with the data, we’re growing](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-4/)
4. [What can we do with the data, we’re well established](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-5/)

<br>

Some companies with media content that use Snowplow:

![Media companies using Snowplow][media companies]

- [What is Snowplow?](#what-is-snowplow)
- [Why would I use Snowplow?](#why-would-i-use-snowplow)
- [How do I use Snowplow?](#how-do-i-use-snowplow)
- [What do I track?](#what-do-i-track)
- [What will the data actually look like?](#what-will-the-data-actually-look-like)
- [What can we do with the data?](#what-can-we-do-with-the-data)
- [Dare I ask, GDPR?](#dare-i-ask-gdpr)

## What is Snowplow?

Simply put, Snowplow is a data collection platform.

It is software that you can install in your cloud environment (AWS or GCP) to collect rich and high quality data.

You can use one of Snowplow’s trackers in your website, app or server; or a Snowplow webhook to capture third party data and the Snowplow pipeline will deliver the data to a data warehouse of your choice. From there, you are free to use the data as you wish.

![the Snowplow pipeline][pipeline]

## Why would I use Snowplow?

At risk of sounding like a clickbait article, here are 10 reasons you would use Snowplow:

1. All your data lives in your own environment, not Snowplow’s, so you have unlimited access to all your event level data
2. Often significantly cheaper than GA360 or Adobe Analytics
3. Data is available in real-time, which means fresh data for your reports or apps in seconds
4. Data from all platforms (web/mobile/server-side/emails/ad impressions) is structured in the same way and stored in the same place
5. Fully customisable tracking design is possible, your design is tailored to your business and use cases, meaning you capture data tailored to you
6. Lots of tooling around privacy to allow for GDPR compliance including data hashing at collection and scrubbing stored data
7. Data can be enriched with 3rd party sources
8. Data is very well structured and of exceptionally high quality due to the validation step of the pipeline (events that fail validation are also stored, but not in the warehouse, meaning the pipeline is non-lossy) making it a perfect input for machine learning models
9. Tracking is versioned allowing for evolution of data strategy - the complexity and detail can grow with the complexity of the questions that you want to answer
10. Snowplow events are extremely rich, each one collected with at least 130 properties (where available) allowing for a very robust understanding of your users

## How do I use Snowplow?

With Snowplow Insights, we set up and maintain your pipeline. All you need to do is:

1. Decide what you want to track
2. Build custom models to start actioning off the data

The only resource you need to begin using Snowplow is some time from a front end developer who can paste our tracker code in your website, app and server as necessary. For out-of-the-box tracking (page/screen views, heartbeats, link clicks, form fills, searches), this should only take an hour but for custom tracking this can take up to a day.

To really derive value from Snowplow data, you will need data analysts who can use SQL to build data models.

## What do I track?

With Snowplow, you can track entities as well as events. For a longer post on this topic (including an explanation of entities), click [here](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/).

For now, let’s assume you’ve worked with our Implementation Engineering team to set up tracking following our best practises and look at what the data would look like.

## What will the data actually look like?

Let’s take an example of someone looking to learn more about machines that plow snow.

![Snowplow data structure][data structure]

This shows a very simplified user journey as it would appear in your data warehouse. Data from all trackers is loaded into one table, the image above is what a subset of your BigQuery columns may look like.

*Note: remember that only 3 out of 130 out of the box properties are shown here, each event can also come with timestamps, weather, location, device, cookies, marketing campaign and much more. In addition, each custom event and entity can have many many more properties, only a subset are shown here.
<br>
Warning: The name is shown as an example field to make the blog post more readable, always be cautious collecting PII.*

These are the actions that correspond with the data in this table:

1. Someone goes on their laptop and opens an email sent by you. You know which campaign it was part of and more importantly, the 3rd party cookie of the user that opened it.
2. They click a link in the email and visit your site, you know what page they visited when, and on which browser and device.
3. They decide they want to learn more about machines that plow snow so they search for “snowplo” as they are unsure how to spell it. Your site returns 2 results, one for an article on Snowplows, the other on Snowploughs.
4. They choose the article on Snowplows! You also know who wrote the article, any products/companies mentioned in the article, the length of the article and whether the article is a native ad as these are custom properties of the content entity (not shown in table above).
5. They enjoy the article so much they share it. You know that they shared it on Facebook as that was one of the properties of the engage event (not shown).
6. They attempt to download a fact file on snowplows but they are blocked by a paywall.
7. The paywall works and they begin the subscription flow by entering their personal details like name (events for this not shown) to create an account choosing a monthly plan.
8. After some other steps (not shown), Joe successfully subscribes. A subscription ID is now associated with all future events created by Joe on those devices.
9. Since this is a critical event to track, to get around potential ad blocker issues, the subscription is confirmed server-side too.
10. Some days later Joe is on their phone, having previously downloaded the app and logged in, to find that article again to show some friends they are with.
11. Joe and friends watch a Snowstorm video in the related content section of the Snowplow article in the app.
12. They spot a picture in the same article that they want to send to another friend so they screenshot it. In reality this event occurred offline when Joe and friends were in the metro but the event was sent when connection was re-established ([the timestamp with the event](https://discourse.snowplowanalytics.com/t/which-timestamp-is-the-best-to-see-when-an-event-occurred/538) was actually accurate to when the event was created).

Hopefully you can now begin to see what Snowplow can do. The tool collects and delivers great raw data. What you do next is in the hands of your data team.

## What can we do with the data?

Use this wealth of data to drive ROI by:
- Increase the lifetime value of subscribers
- Increase revenue from ads
- Reducing spend on content creation
- Reducing marketing spend
- Increasing subscription/donation rates

What you do with the data depends on how developed your data team is. Let’s take a look at 3 degrees of data team maturity. Follow the links to read a full post on how a team of each size in the media sector could consume Snowplow data (note that each post assumes you have read the previous ones):

- [We’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/) *Data team: 1 data analyst*
  - Stitch user journeys across web and mobile
  - Aggregate that data to understand engagement
  - Retention analysis
  - Marketing attribution

- [We’re growing](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-4/) *Data team: Many data analysts*
  - Track server-side and ingest 3rd party marketing data
  - Funnel analysis and paywall optimisation
  - Advanced user stitching
  - Content production and producer dashboards
  - Advertiser analytics

- [We’re well established](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-5/) *Data team: Data analysts, engineers and scientists*
  - Marketing automation
  - Personalisation of the product
  - Recommendation engine
  - Anomaly detection
  - Fraud detection
  - Sentiment analysis

Special thanks to Simon Rumble of [Poplin Data](https://poplindata.com/) for sharing his expertise in the industry with me to help write the posts linked to above!  

## Dare I ask, GDPR?

If you are an existing Snowplow Insights customer or are interested in Insights, do get in touch and we can send you extensive documentation on how we help you comply with GDPR. Some key points:

- Specific rows of data can be deleted from all the places they are stored if necessary
- PII, such as IP address, can be hashed by the pipeline so you can still analyse user behaviour using the hashed values
- Fields can be removed from events using custom enrichments if necessary
- The client data that you capture all lives in your own cloud environment, not Snowplow’s - remember Snowplow is just a piece of software, the hardware is all in your AWS or GCP account

<br>

Read next: [What do I track?](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/)

[media companies]: /assets/img/blog/2019/05/media-companies.png
[pipeline]: /assets/img/blog/2019/03/pipeline.png
[data structure]: /assets/img/blog/2019/05/media-data-structure.png
