---
layout: post
title: How to optimize your pipeline for data quality
title-short: How to optimize your pipeline for data quality
description: This article explores two key data quality issues that arise in a business, and how data teams can improve the quality of their data.
author: Lyuba
category: How to guides
permalink: /blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-How_Optimize_Pipeline.jpg
thumbnail-image: /assets/img/blog/featured/SP-Blog-Post-How_Optimize_Pipeline-mini.jpg
---

Data-informed businesses rely on customer data. It powers their products, provides valuable insights and drives new ideas. However, as a business expands its data collection, it also becomes more vulnerable to data quality issues. Poor quality data, such as inaccurate, missing or inconsistent data, provides a bad foundation for decision making and can no longer be used to uphold arguments or support ideas based on that data. And once trust in the data is lost, the data, data team, and any data infrastructure loses its value as well. 

When this happens, stakeholders no longer let data guide decision making, and the data team’s influence in the business declines, making it more difficult to justify investment in new data-driven projects. Ultimately, stakeholders’ trust in the data determines whether they accept and use the information provided by the data, or not.

To build and maintain trust, teams need data infrastructure that delivers high quality data, and when necessary, be able to demonstrate the data’s quality to others in the organization. This article explores two key data quality issues that arise in a business, and how data teams can improve the quality of their data.

 


## What does high quality data look like?

For data to be considered high quality, it must be accurate and complete. When these conditions are met, maintaining trust in that data becomes significantly easier. Let’s take a look at what it means to have accurate and complete data within an organization.



### Accurate data

When data is accurate, what the data says happened, actually happened. Say you want to measure how long a user spent on your page. You’ll want to know if it was really five minutes, or if they left the tab open while navigating to another page. In other words, accurate data correctly captures the real-world event that took place. What’s more, accuracy implies that data values are correct; you record what actually happened. Accuracy also implies that the data is interpreted as intended, in a consistent and unambiguous format. When this is done successfully, analysts can easily understand and work with the data, leading to more accurate insights based on that data. 

Problems with data accuracy can arise for several reasons. For example, when data teams struggle to set up consistent tracking across teams, apps and websites, this can lead to incorrect, duplicate or inconsistent values. Moreover, it can be hard to identify the source of inaccurate data, especially if an organization does not have visibility into each stage of their data collection process.


#### Snowplow’s approach to ensuring accurate data 

One of the ways Snowplow makes it easier to collect accurate data is by making tracking straightforward and unambiguous to define across events. Users can specify what fields are recorded with each [event and entity](https://docs.snowplowanalytics.com/snowplow-insights/schemas/event-and-entity-definition/), which lets you check for tracking consistency and keep a central “source of truth” across your teams so anyone that needs to use or edit the existing tracking understands the purpose of each field, and where it is collected.

To ensure that only well-structured, usable data comes through the pipeline, and give data teams a way to demonstrate the data’s accuracy, Snowplow uses a built in up-front validation step where all collected data is confirmed against its definitions of the fields recorded with each event and entity.

Developers and analysts also have a way to test new tracking before it goes live. For example, they can spin up development sandboxes to inspect the collected data and make sure it matches the specifications before pushing the tracking live. Teams can see, in real-time, exactly what data is generated as someone engages with the app or website and validate that the data matches the user’s actions. This level of control ensures that the tracking that goes into production is accurate.


### Complete data

Simply put, complete data means there is no missing data. It also means that, to the extent possible, the data gives a full picture of the “real-world” events that took place. Without complete data, there is limited visibility into how customers actually behave on a website or app. 

Typically, there are two main sources of missing or lost data: events that failed to be tracked, and downstream technical issues. Events that are not tracked could result from implementation errors, such as misconfigured trackers, or events that were overlooked during the tracking design stage. Downstream technical issues are usually even more difficult to detect, unless you have a pipeline you can audit at every stage and discover where the issue took place.

Having complete data also means collecting a rich set of data points with each event, so you know as much information about your users as possible. For example, instead of only knowing that someone spent 30 seconds on a web page, you would gain a more complete understanding of your user by knowing that the web page contained an article about tours to New Zealand, the article’s author, any tags associated with the article, what section of the website the article belongs to, what device the user read the article on - the list goes on. Finally, with the introduction of [new restrictions around ITP](https://snowplowanalytics.com/blog/2019/06/17/how-ITP2.1-works-what-it-means-for-web-analytics/) and ad blocking, it is also important to consider how this might result in missing or inaccurate data about your users. 


#### Snowplow’s approach to delivering complete data

Snowplow was designed as a fully transparent pipeline that lives in your cloud, with no client data ever entering Snowplow Analytics owned infrastructure. This also means data teams can audit each stage in the pipeline and identify failed, missing or inaccurate data. Snowplow also makes it easier to avoid missing data due to errors in the tracking code through tooling developers can use in their automated test suites to ensure data collection is not accidentally broken in new releases _before_ the tracking goes live.

Non-lossy architecture is another way to prevent missing data. For example, Snowplow uses local batching to queue events locally if a collector is down, and sends the events through once the collector is up and running again. Similarly, instead of deleting bad data, Snowplow isolates and stores bad data so the source of the processing problem can be diagnosed. If you don’t know what data you’re losing, it’s very difficult to know if your data set is complete. 

As a [first-party data collection platform](https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/), Snowplow also makes it possible to set first-party, server-side cookies, which are not subject to the same ITP restrictions. To avoid ad blockers, Snowplow users can self-host their JavaScript trackers, set up server-side tracking or use their own collector end point to set custom paths and continue collecting data across all users. 

Finally, to deliver a richer and more granular dataset, Snowplow automatically sends 130 properties with each event, where available, and allows users to define custom events and entities to build a more complete data set. Users can also enhance their datasets by adding first and third-party data points to each event, in real-time, further down the data collection pipeline using [Snowplow’s enrichment modules](https://docs.snowplowanalytics.com/snowplow-insights/enrichments/).


### Conclusion

Once lost, trust is hard to win back. That’s why starting with anything less than high quality data is counterproductive for a data-driven company. Data quality is a necessity: data must be reliable, detailed, easy to understand and work with in order for it to be useful and impactful across a business. If your company wants to use data to drive growth, you need to make sure you’re using the highest quality data you can get.

Snowplow Insights makes it easy to get started with collecting high quality data. [You can get in touch with us here](https://snowplowanalytics.com/request-demo/) to learn more.