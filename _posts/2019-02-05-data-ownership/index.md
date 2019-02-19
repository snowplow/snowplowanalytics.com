---
layout: post
title: "How data ownership makes you a more effective data scientist"
description: The importance of owning your data
image: /assets/img/blog/2019/02/will.png
title-short: Why you should own your own data
tags: [analytics, data, data ownership, data stack, data pipeline]
author: Anthony
category: Analytics
permalink: /blog/2019/02/05/how-data-ownership-makes-you-a-more-effective-data-scientist/
discourse: true
---

Data scientists report spending 80% of their time cleaning and collecting data, leaving only the remaining 20% for actual analysis. As a data scientist, you spend time finding ways to query across multiple data sets, formatting data to work with different analytics tools, and applying any number of modifications to take data you’ve collected and turn it into data you can use.

Contrast this with companies who own their data infrastructure end-to-end with solutions like Snowplow; their data scientists have complete control over their data and can easily plug it into any environment or tool, freeing up 80-90% of their time for analysis. Snowplow Analytics helps you become a highly effective data scientist by giving your company ownership of your data back from analytics tools that are limiting you, so you can focus on plying your craft.

<h2 id="what is data ownership">What does data ownership mean?</h2>

When we talk to companies about owning their own data, here’s what we mean:
* You're free to collect whatever you want.
* You can collect data in whatever format you want.
* You can trace your data through your pipeline back to when it was created.
* Your data is usable however you see fit.
* Data stays within your own internal servers and platforms.

End-to-end data ownership means taking deliberate control of the state of your data: you become responsible for what data you collect, how you collect that data, where it goes after collection, and how it gets there. When you own your data infrastructure, you collect the data that's important to you to learn about your products or customers.

Being able to see what happens to your data as it moves from collection to your data warehouse means you can trust that it's accurate, as well as spot any quality issues before they interfere with your analysis. After data is collected, you need to have the freedom to perform any kind of analysis or manipulation on the data that you choose.

<h2 id="limits of data tools">Don’t let your tools dictate your job</h2>

You might not be in as much control of your data as you think. Many analytics platforms don't offer the degree of ownership outlined above. To provide a more user friendly experience out of the box, it's not uncommon for analytics platforms to make assumptions about how to label your data, what you want to do with bad data, or even how you should model your data. The classic example is Google Analytics. A powerful web analytics platform that reliably serves a large community of analysts, Google Analytics has its own conception of what data should look like, such as how it defines a browsing session or how it attributes an eCommerce event to a marketing campaign.

This may be sufficient to start with, but many businesses outgrow Google Analytics data and require more specialized analysis to answer more sophisticated questions. While experienced analysts (like Simo Ahava) can seemingly do anything with Google Analytics, these analytic workarounds can be labor-intensive and are rarely straightforward.

If your response to this lack of control is to immediately champion building your own pipeline from scratch, expect to end up replacing one burden with another: you will be beholden to whatever internal engineering resources at your company to continuously monitor and update your custom pipeline as your data types change when your business grows.

<h2 id="get better results from data">Your data needs to support your goals</h2>

As a data scientist, your prime directive is to use data to help your organization achieve its goals. How effectively you can use that data depends on its quality, and if you're at the mercy of the vendors and tools you use to determine your data quality, your effectiveness is suffering (whether you realize it or not). Taking ownership of your data with Snowplow eliminates the hours wasted on cleaning data so you can get back to being a data scientist instead of a data janitor.

![good will hunting][will]

When it's not clear exactly what your data represents, either because your analytics tool's internal processing obfuscates your raw data or lack of clarity into your data collection, any analysis you undertake is based on imprecise data. This leads to problems collaborating with other business units, for example the marketing team spending money on suboptimal campaigns targeting the wrong people. To put it plainly, if you don’t own your data, your business is leaving money on the table.

<h2 id="own your data">Take control of your data with Snowplow</h2>

Event data is a rich asset. Used right, it can be the difference between companies winning and losing in their industries. Traditionally, taking ownership of your data means one of two options: a solution built by a third-party vendor or an entirely bespoke data stack. Paying for a SaaS analytics platform brings all of the data challenges that come from working with third parties, and building your own data pipeline requires time and specialized resources.  

Snowplow Insights offers the flexibility and customization of a bespoke data pipeline combined with the security, quality, and reliability of enterprise-strength software. Our pipeline is built for data ownership: it's fully transparent, meaning you know what format your data is in at every stage, when it's enriched, and how we calculate the enrichments taking place. We've built tools like our Analytics SDKs that allow you to let you work natively with your event data from Python, .NET, Scala, or JavaScript. Nothing is held back or obscured, you're served everything that Snowplow collects.

In one day, you can deploy a data pipeline for Google BigQuery, AWS Redshift, or Snowflake Database that lets you:
* Own all of your own data without access mediated by a third party
* Ensure your data is secure and doesn't leave your internal environment
* Have complete control over what is tracked, from where, and how it's processed and used

You decide what you want to track, and we deliver that data to you, in your own data warehouse, so you can ask any question, perform any analysis, or use any tool you choose. We serve your data in real-time so you can act on it, instead of spending time configuring collectors or trying to join tables.

[Get in the driver's seat][demo] with Snowplow and finally take ownership of your data.


[demo]: https://snowplowanalytics.com/request-demo/?utm_source=website&utm_medium=blog&utm_campaign=data-ownership&utm_term=-&utm_content=text-link

[will]: /assets/img/blog/2019/02/will.png
