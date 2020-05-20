---
layout: post
title: "What happens to your data during a traffic spike"
description: "In this article we cover what happens during a traffic spike, potential consequences, and Snowplow’s approach to dealing with data surges so you don’t lose valuable data."
author: Lyuba
category: Data insights
permalink: /blog/2020/05/20/what-happens-to-your-data-during-a-traffic-spike/
---


Businesses can experience traffic spikes at any moment. In some cases, the increase in traffic is expected, like after the launch of a marketing campaign, a new product, or because of seasonal spikes around the holidays. In other cases, changes in traffic patterns are much less predictable and might result from a breaking news story, a DDOS attack, or a worldwide pandemic. 

Having a strategy in place to handle these situations is critical for any business, especially ones that rely on customer data. A sudden spike in traffic directly translates into a spike in data volumes, and a data pipeline that can automatically scale to handle surges prevents the business from losing valuable data when this happens. In this article we’ll cover the potential consequences of traffic surges, and Snowplow’s approach to dealing with data spikes to make sure our customers don’t lose their data.


## How traffic spikes impact your business and customers


Between January and March of 2020, the retail sector saw a [6% increase in traffic](https://www.semrush.com/blog/ecommerce-covid-19/), which translates into 1.5 billion new visitors in just 3 months. Other sectors are also seeing traffic skyrocket as more people transition into remote work and entertainment, and many businesses are struggling to increase data center capacity to deal with new customers and the bandwidth issues they bring.


The problem many businesses now face, is how to handle the repercussions a traffic spike has on both the business and on customers. From a data collection perspective, a burst in traffic to your website or app leads to a spike in your customer data as well. When this happens, both your website and your data pipeline need to scale in order to handle the increased data volume. If your website or app does not scale fast enough, it can result in crashes or slower performance. If the pipeline does not scale quickly, it can become overloaded, leading to a loss of data during the time the pipeline was down.

This is problematic for a number of reasons. From a business point of view, this means you would lose data about visitors who came to your site or app while the pipeline was down. This also means your data team will have patchy data, leading to inaccurate analytics for that time period of the pipeline failure. 

From a customer’s perspective, the data loss can damage the user experience. For example, if you use personalization or automation on your page, gaps in your data might lead to incorrect targeting and recommendations. If someone makes a purchase on your site while your pipeline is down, your data won’t reflect the purchase and you might end up advertising the same product to the user later on. Similarly, if your website or app becomes overloaded, users might experience slower loading or crashes. These examples lead to a poor experience for the user, and inefficient marketing spend for your business. 

The best way to prevent this from happening is to have a system in place for scaling your website or apps’ bandwidth during traffic spikes, which also means scaling your data pipeline. A strategy that ensures your data delivery platform can handle sudden changes in data volumes is critical for any business reliant on data.


## Snowplow’s approach to handling data volume surges

Any business might experience a traffic and data surge, and as the past few months have made clear, it is not always possible to predict when it will happen. At Snowplow, we believe data pipelines should be designed to handle customer data surges. This is a key component of a high-quality data asset because without surge protection, it is hard to guarantee the completeness of your data. What’s more, we believe that the most cost effective solution for our customers, is to have a pipeline in place that can automatically scale up or down depending on data volumes instead of always running at full capacity. That’s why we provide auto scaling for all of our Snowplow Insights customers, even for the most extreme data spikes, to ensure that traffic spikes never cause you any issues.


## Summary

Now more than ever the importance of having infrastructure in place to handle extreme changes in traffic patterns is becoming clear. Snowplow ensures your pipeline is ready to handle spikes in customer data and takes care of automatically scaling your pipeline up or down depending on your data volumes. 

To find out more about how Snowplow can set up a reliable data delivery platform for your business, [get in touch with our team here](https://snowplowanalytics.com/get-started/).
