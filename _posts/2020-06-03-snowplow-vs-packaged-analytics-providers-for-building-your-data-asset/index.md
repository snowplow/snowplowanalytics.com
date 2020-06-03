---
layout: post
title: "Snowplow vs packaged analytics providers for building your data asset"
description: "Understand the differences between Snowplow and Google, Adobe and others when investing in your data asset"
author: Franciska
category: Data insights
permalink: /blog/2020/06/03/snowplow-vs-packaged-analytics-providers-for-building-your-data-asset/
---


Snowplow is a data delivery platform for companies that have taken the strategic decision to invest in building out their own data asset and data capability. They are typically already investing in a data lake, a data warehouse and real-time processing capabilities. They have [built a data team](https://snowplowanalytics.com/blog/2020/03/10/how-do-you-structure-your-data-team/) (or several teams), and are using or experimenting with advanced use cases like machine learning. And they have a strong culture around data and experimentation.

Packaged analytics providers such as Adobe or Google Analytics (GA) provide powerful user interfaces with a great range of out-of-the-box reporting to support marketers and product teams. However, these solutions are not built to enable users to join this data with other data sources (non-web and mobile data), to build out customised reports and dashboards, consume the data in real-time applications or power a recommendation engine. Companies that have these requirements should look beyond packaged analytics solutions to a platform like Snowplow.


<br>
{% include shortcodes/ebook.html background_class="data-modeling-landingpage" layout="blog" title="Understand how we compare:" description="Learn more about how Snowplow differs from packaged analytics providers" btnText="Download" link="https://go.snowplowanalytics.com/snowplow-vs-enterprise_digital_analytics.pdf" %}  




### A complete data set makes for reliable reporting

With Snowplow Insights you get more events and more data points per event and the [flexibility to structure your event data](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) according to your business. Snowplow goes beyond web and mobile, tracking data from server-side systems, support desks (e.g. Zendesk), marketing platforms (display advertising, email) as well as third parties (e.g. Adjust, SendGrid). 

When collecting data from web and mobile platforms, Snowplow delivers more[ lines of data and more events per session](https://next.snowplowanalytics.com/explore-snowplow-data-part-1/) than packaged analytics vendors. For example, out-of-the-box web tracking includes page view IDs (so analysts can distinguish actions taken on different page views that might be open by a user in different tabs simultaneously), scroll depth, [time on page](https://snowplowanalytics.com/blog/2019/08/07/time-spent-is-the-most-important-metric-for-media/) (measured accurately using heart beats), page load times, link clicks and interactions with any form elements. On mobile, Snowplow automatically tracks foreground, background, screen views and other core events, making it possible for analysts to determine exactly how long users engage with each screen and replay their journey through the app.

The data is then delivered in a highly-structured way to your data warehouse, where it can easily be joined with other data sets such as financial data, ad spend or stock levels. 


### The power of flexible data structures  

Adobe and Google Analytics provide a one-size fits all data structure. Recognizing that different companies have different business models with significantly different purposes and user experiences, they offer lists of configurable variables (sProps and eVars for Adobe, custom dimensions and metrics for GA) to enable companies to extend tracking beyond out-of-the-box events like page views and transactions.

In contrast, Snowplow offers companies the ability to [define their own data structure](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) from the ground up: a jobs board might want to track recruiters looking for talent and job seekers, performing a range of tasks including searching for jobs, viewing jobs, uploading CVs, applying for jobs, handling applications etc.. The actual data collected, and the structure of that data, would look totally different to a mobile banking provider, dating site, game or productivity tool. 

So for companies who don't fit the “model” assumed by GA and Adobe, i.e. traditional ecommerce or media, Snowplow Insights alongside a reporting tool such as Looker or PowerBI provide a more effective reporting stack than Google Analytics or Adobe. Visualization tools like Looker and PowerBI provide an enormous amount of reporting power and flexibility on top of the data delivered by Snowplow Insights.


### Your data is ready to be consumed

We often hear data analysts and scientists complain about having to spend the majority of their time cleaning and preparing data. One of the key benefits of Snowplow is that the data is validated upfront in the pipeline, ensuring only high-quality data is delivered to your warehouse. This means your data is ready to be consumed by machine learning models or real-time applications and your data scientists and analysts don’t have to waste valuable time on cleaning and preparing data. 


### Evolving your data with your business

Snowplow is built from the ground up to evolve with your business: we offer a systematic approach for companies that want to evolve their event definitions, and data processing rules, in a way that means data collected before an update remains available for ongoing use. In contrast, packaged analytics vendors are not built for flexibility: any reallocation of a particular sProp or custom dimension, for example, will render data collected prior to the change unusable, making these systems much more brittle.


### Ownership means control

Companies populating their warehouse with data from GA360 or Adobe have to rely on those third-parties to deliver the data in a timely way into their data store. They have no visibility or control into the pipeline that feeds that data warehouse. 

On the other hand, Snowplow users have complete control and ownership of those pipelines. This has implications for security (they can tell their customers they own and manage their data end-to-end), reliability (the data can be diligenced at every stage of the pipeline) and accessibility (the data can be accessed at very low latency from Kinesis or Pub/Sub, ahead of being loaded into the data warehouse).


### A complementary solution = Snowplow + a packaged analytics provider

Many companies effectively leverage a packaged analytics provider like Google Analytics alongside Snowplow Insights. These companies use GA for what it’s great at: empowering marketers to optimize conversion rates and digital spend across different channels and campaigns. They leverage Snowplow data to provide additional reporting that encompasses more than just web and mobile data or to power machine learning models or real-time applications.

We believe that for companies to succeed today, they need to treat their data as an important business asset. And while Google, Adobe and other platforms provide powerful tools for business reporting and analysis, we believe Snowplow can play a vital part in building a data asset that is owned, controlled and evolved by you.

If you’re interested in learning more about Snowplow Insights or our thoughts on how to build a data asset, [please get in touch](https://snowplowanalytics.com/get-started/).
