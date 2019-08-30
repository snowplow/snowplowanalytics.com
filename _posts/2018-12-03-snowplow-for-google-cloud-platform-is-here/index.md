---
layout: post
title: "Snowplow for Google Cloud Platform is here"
description: Use Snowplow with GCP
image: /assets/img/blog/2018/12/snowplow-gcp.jpg
title-short: Announcing Snowplow for GCP
tags: [analytics, Google Cloud Platform, GCP, BigQuery, data, Zendesk data, mailchimp data, python analytics, web analytics, ruby analytics, optimizely data]
author: Anthony
category: Data Insights
permalink: /blog/2018/12/03/snowplow-for-google-cloud-platform-is-here/
discourse: true
---

[Since the early days of Snowplow Analytics][2012], we’ve been committed to giving our users very granular, highly structured data because we believe that’s what you need to be truly data driven. Doing awesome things with this data, though, has been historically challenging because of how detailed it is. Thanks to Google, we have a solution to that problem.

Google Cloud Platform (GCP) has grown, over the last ten years, to become one of the largest, most popular cloud offerings. BigQuery, the analytics platform, can handle granular, highly structured data like Snowplow event data and was built to do so at enterprise level, making large-scale analysis lightning-fast. Paired with Tensorflow for machine learning, Cloud Dataflow for streaming, Data Studio for visualization, and a [flexible pricing structure][gcp-price], BigQuery makes GCP a formidable player in cloud computing that offers both power and affordability. Our [latest release][bql], lets you take full advantage of BigQuery and GCP’s entire suite of data-related tools, all in real-time, with high quality Snowplow data.

<h2 id="load data into bigquery">The best way to load data into BigQuery</h2>

![Snowplow plus BigQuery][sp-bq]

BigQuery is an elegant data solution and a natural fit for Snowplow data. As a warehouse, BigQuery offers elastic storage and compute, making it both affordable and highly performant to store and query massive amounts of data. This makes BigQuery an ideal warehousing platform for companies with enormous data sets.

Snowplow tech is built to maximize data granularity, richness, and scalability; it’s not uncommon to find our customers tracking well over 100 million events daily. Working with highly detailed data at that scale on other cloud platforms is challenging because joining large volumes of data from multiple sources can make data sets cumbersome and spread them out across multiple tables, slowing down queries. BigQuery has a number of features to address this:

* **Support for nested data.** Snowplow enables users to define their own event and entity schemas: because of BigQuery’s strong support for nested data structures, this data can be accommodated by a single, easy to query “events” table. In Redshift, conversely, we’re forced to shred the data into separate tables that have to be joined together for analysis.
* **Integrations with Google Marketing services.** BigQuery can integrate with Google marketing services like Google Ads or YouTube out-of-the-box. This makes it easy for you to join these data sets with Snowplow data from your website, mobile app, server-side systems, and third party tools like Zendesk, Mailchimp, Sendgrid, and more.
* **Streaming inserts.** The combination of Snowplow real-time data processing with [BigQuery’s streaming inserts][streaming] means that your data is available for querying in BigQuery seconds after it hits the Snowplow collector.



<h2 id="snowplow and google">BigQuery plus Snowplow</h2>

In addition to unparalleled speed, Snowplow’s enormous (and expanding) collection of integrations and tracking software let you collect data from the tools you use every day, including:

**Trackers:**
- Android and iOS
- Golang
- Javascript
- Python
- Ruby
- Unity


**Integrations:**
- Appsflyer
- Google Analytics
- Mailchimp and Mandrill
- Optimizely
- Sendgrid
- Zendesk

![Load all your data into BigQuery with Snowplow][computer]

Unifying your data sources together in BigQuery gives you a high quality, structured data set that’s easy to work with. Having that data available in real-time means you can make product and marketing decisions just as fast. And, because it’s part of the Google ecosystem, you can directly import data directly into BigQuery from your marketing tools like Google Ads. This lets you combine your ad data with your rich downstream behavioral data to adjust your marketing budget on the fly, letting you focus on your most important channels. You can even [get your Google Analytics data into BigQuery in real-time][ga-real-time].

<h2 id="get started with gcp and snowplow">Getting started</h2>

BigQuery and the rest of Google’s data tools were built to make working with massive sets of granular, structured data easy, fast, and affordable. Now with Snowplow for GCP, you can make sure you’re loading the highest quality data into BigQuery from the sources you need, in real-time as it should be.


[Get in touch][demo] with us and start querying with confidence.




[2012]: https://snowplowanalytics.com/blog/2012/09/24/what-does-snowplow-let-you-do/

[bql]: /blog/2018/12/03/snowplow-bigquery-loader-0.1.0-released/

[gcp-price]: https://cloud.google.com/pricing/

[sp-bq]: /assets/img/blog/2018/12/snowplow-gcp.jpg

[computer]: /assets/img/blog/2018/12/working.jpg

[ga-real-time]: https://snowplowanalytics.com/blog/2018/02/08/warehousing-google-analytics-data-api-vs-hit-level-data/

[streaming]: https://cloud.google.com/bigquery/streaming-data-into-bigquery

[demo]: https://snowplowanalytics.com/request-demo/?utm_source=snp-blog&utm_medium=gcp-launch&utm_content=demo
