---
layout: resources
title: Snowplow vs packaged analytics providers
description: Understanding the differences between Snowplow and packaged analytics providers for building out your data infrastructure
permalink: /resources/snowplow-vs-packaged-analytics-providers/
class: how-we-compare
assets:
  css: assets/css/casestudy.css
  js:
toc: true
---


# Setting the scene
Snowplow is a data collection platform for companies that have taken the strategic decision to invest in building out their own data asset and data capability. They are typically investing in a data lake, a data warehouse and real-time processing capabilities. They have or are building a data team, and wish to or are already using advanced analytical techniques like machine learning. And they have a culture around data and experimentation.

Snowplow is the best data collection solution for companies who want reliable, rich, high quality event data, from across all their different platforms and channels, in their data warehouse and available in real-time. 

Packaged analytics providers such as Adobe or Google Analytics 360 provide powerful user interfaces with a great range of out-of-the-box reporting to support marketers and product teams. However, these solutions are not built do enable users to join this data with other data sources (non-web and mobile data) to build out customised reports and dashboards, consume the data in real-time applications and employ more advanced analytical techniques like machine learning. Companies that have these requirements should look beyond packaged analytics solutions to a platform like Snowplow.
<br>
<br>

## More complete reporting can be built on a more complete data set
With Snowplow Insights you get more events and more data points per event. Snowplow goes beyond web and mobile and tracks data from server-side systems, support desks (e.g. Zendesk), marketing platforms (display advertising, email) as well as third parties (e.g. Adjust, SendGrid). 

When collecting data from web and mobile platforms, Snowplow delivers more lines of data and more events per session than packaged analytics vendors. For example, out-of-the-box web tracking includes page view IDs (so analysts can distinguish actions taken on different page views that might be open by a user in different tabs simultaneously), scroll depth, time on page (measured accurately using heart beats), page load times, link clicks and interactions with any form elements. On mobile, we automatically track foreground, background, screen views and other core events, making it possible for analysts to determine exactly how long users engage with each screen and replay their journey through the app.

By delivering the data in a highly-structured way to your data warehouse it can easily be joined with other data sets such as financial data, ad spend or stock levels.
<br>
<br>

## The power of flexible data structures
Adobe and GA360 provide a one-size fits all data structure. Recognising that different companies have different business models and offer websites and apps with wildly different purposes and user experiences, they offer lists of configurable variables (sProps and eVars for Adobe, custom dimensions and metrics for GA360) to enable companies to extend tracking beyond out-of-the-box events like page views and transactions.

In contrast, Snowplow offers companies the ability to define their own event and entity model from the ground up: a jobs board might want to track recruiters looking for talent and job seekers, performing a range of tasks including searching for jobs, viewing jobs, uploading CVs, applying for jobs, handling applications etc.. The actual data collected, and the structure of that data, would look totally different to a mobile banking provider, dating site, game or productivity tool.
<br>
<br>

## Your data is ready to be consumed
All Snowplow data is validated upfront in the pipeline, ensuring only high quality data is delivered to your warehouse. This means your data is ready to be consumed by machine learning models or real-time applications and your data scientists don’t have to waste their time on cleaning and preparing data.
<br>
<br>

## Evolving your data with your business
Snowplow is built from the ground up to evolve with your business: we offer a systematic approach for companies that want to evolve their event and entity definitions, and data processing rules, as their business evolves, in a way that means data collected before an update remains available for ongoing use. In contrast, packaged analytics vendors are not built flexibly: any reallocation of e.g. a particular sProp or custom dimension will render data collected prior to the change unusable, making these systems much more brittle.
<br>
<br>

## Ownership means control
Companies populating their warehouse with data from GA360 or Adobe have to rely on those third-parties to deliver the data required in a timely way into their data warehouses. They have no visibility or control into the pipeline that feeds that data warehouse. Snowplow users have complete control and ownership of those pipelines. This has implications for security (they can tell their customers they own and manage their data end-to-end), reliability (the data can be diligenced at every stage of the pipeline) and accessibility (the data can be accessed at very low latency from Kinesis or Pub/Sub, ahead of being loaded into the data warehouse).
<br>
<br>

## Complementary solution = Snowplow + a packaged analytics provider
Many companies effectively leverage a packaged analytics provider like GA360 alongside Snowplow Insights. These companies use GA360 for what it’s great at: empowering marketers to optimize conversion rates and digital spend across different channels and campaigns. They leverage Snowplow data to provide additional reporting that encompasses more than just web and mobile data. Snowplow Insights provides rich, granular data for product teams to run A/B tests and for data scientists to power machine learning models.
<br>
<br>
<br>
<br>