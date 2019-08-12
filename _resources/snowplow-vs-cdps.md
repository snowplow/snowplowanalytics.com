---
layout: resources
title: Snowplow vs CDPs
description: Understanding the differences between Snowplow and CDPs for building out your data infrastructure
permalink: /resources/snowplow-vs-cdps/
class: how-we-compare
assets:
  css: assets/css/casestudy.css
  js: assets/js/float-panel.js
toc: true
---

# Setting the scene
Snowplow is a data collection platform for companies that have taken the strategic decision to invest in building out their own data asset and data capability. They are typically investing in a data lake, a data warehouse and real-time processing capabilities. They have or are building a data team, and wish to or are already using advanced analytical techniques like machine learning. And they have a culture around data and experimentation.

Snowplow is the best data collection solution for companies who want reliable, rich, high quality event data, from across all their different platforms and channels, in their data warehouse and available in real-time. 

Customer Data Platforms (CDPs) are a new category of technology geared towards marketers that want to run unified campaigns to prospects across different channels using a common understanding of what segment a prospect is in. A handful of the companies in this segment (notably Segment and mParticle) support collecting digital event data to power those marketing campaigns, and support loading that data into the data warehouse. However, as platforms geared towards empowering marketers to run campaigns rather than data analysts and scientists to develop a data asset, they are not as powerful as Snowplow Insights for delivering data to the data warehouse.
<br>
<br>

## A richer dataset builds more comprehensive reports
Snowplow Insights delivers more events, and more data points per event, than CDPs.
When collecting data from web and mobile platforms, Snowplow delivers more lines of data and more events per session. For example, out-of-the-box web tracking includes page view IDs (so analysts can distinguish actions taken on different page views that might be open by a user in different tabs simultaneously), scroll depth, time on page (measured accurately using heart beats), page load times, link clicks, interactions with any form elements as well as device, OS and browser info. On mobile, we automatically track foreground, background, screen views and other core events, making it possible for analysts to determine exactly how long users engage with each screen and replay their journey through the app. Further, with Snowplow, events are enriched with dimension widening information such as marketing campaign attribution, bot identification and weather info. 

Richer data opens up valuable new opportunities: for analysts to answer more questions, for data scientists to feed models to better predict churn and propensity to buy and for the business in general to better understand its customers.
<br>
<br>

## The power of structured data
Snowplow Insights delivers structured rather than unstructured data to the data warehouse, which is optimized for modelling and analysis. Our schema'ing tech means our customers have the flexibility to track the events and entities that matter to their business, and build downstream reports, dashboards and data-driven applications based on a predictable input data structure. CDPs don’t enforce upfront schema validation and hence your data analysts and scientists are left with messy, incomplete data sets to clean. 

Because all the data delivered is highly structured, Snowplow Insights saves the data team from having to spend time structuring the data after collection, freeing up analysts and engineers to quickly use the data to derive insight and act on.


## Data quality is built-in
Snowplow Insights supports an extensive toolset to promote data quality, including tooling to support developers rolling out tracking and performing QA and for data analysts to proactively identify data quality issues as they emerge rather than after the fact.

By ensuring that the data delivered is high quality, Snowplow Insights saves data analysts and scientists having to spend time debugging data quality issues, freeing them up to focus on doing what they do best: driving value from the data.
<br>
<br>

## Evolving your data with your business
Snowplow is architected from the ground up to evolve with your business: we offer a systematic approach for companies that want to evolve their event and entity definitions and data processing rules, as their business evolves. CDPs offer limited to no opportunity to evolve your events or track changes over time. With Snowplow it’s easy to query the data over periods where your data structures have evolved.
<br>
<br>

## Ownership means control
Companies populating their warehouse with data from a CDP have to rely on those third-parties to deliver the data required in a timely way into their data warehouses. They have no visibility or control into the pipeline that feeds that data warehouse and is essentially sharing a pipeline with every other customer of the CDP. Snowplow users have complete control and ownership of their pipelines. This has implications for security (they can tell their customers they own and manage their data end-to-end), reliability (the data can be diligenced at every stage of the pipeline) and accessibility (the data can be accessed at very low latency from Kinesis or Pub/Sub, ahead of being loaded into the data warehouse).
<br>
<br>

## Complementary solution = Snowplow + a CDP
Companies can effectively leverage Snowplow Insights alongside a CDP such as Braze or Treasure Data. Marketers at these companies use a CDP for what it’s great at: creating actionable customer segments, linking identity, behavior, purchase and demographics together in a single record from disparate sources and take action on this data like trigger emails, ads or personalisation (adapted from [Gartner](https://blogs.gartner.com/simon-yates/2017/02/11/cdp-another-three-letter-acronym-marketers-need-to-know/)).

They’ll use Snowplow Insights to get their rich, granular event data for product teams to run A/B tests, for data scientists to power machine learning models and for real-time applications. These companies will often also use Snowplow data to power a BI tool such as Looker or Tableau.
<br>
<br>
<br>
<br>

