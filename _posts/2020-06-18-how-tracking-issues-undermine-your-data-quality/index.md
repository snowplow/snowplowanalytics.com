---
layout: post
title: "How tracking issues undermine your data quality"
description: "Many factors determine how successfully you’re able to power real-time applications, improve the user experience and inform critical product decisions."
author: Lyuba
category: Data insights
permalink: /blog/2020/06/18/how-tracking-issues-undermine-your-data-quality/
---


Many factors determine how successfully you’re able to power real-time applications, improve the user experience and inform critical product decisions. However, the first step is to set the right foundation for these use cases, and others, by collecting the highest quality data. Getting this right depends on two critical elements; creating a robust tracking design, then implementing the tracking correctly and consistently.

Although it might seem straightforward, most companies struggle with data quality issues resulting from tracking problems. This usually happens because for many developers setting up tracking is not their main priority, and they assume any issues with the data can be sorted out downstream. At the same time, setting up tracking is getting harder because businesses want to track much more detailed data, leaving more room for error.

These two factors create an environment in which data quality issues are much more likely to crop up, and data consumers end up working with incomplete or inaccurate data leading to lower quality products, poor decision-making, and a loss of confidence in the data.

In this article, we’ll explore why tracking issues emerge within your data pipeline leading to data quality issues downstream, and Snowplow’s approach to minimizing bad data, as well as detecting and resolving issues when they do happen.


 


## How tracking issues emerge in the data pipeline

 

Typically, there are two tracking issues we see data teams face more often than others; tracking implemented incorrectly, and updates to your app or website that break tracking that had previously been working.


### Tracking issue 1: Implementation errors

Businesses today typically want to collect rich, highly structured, very granular data, which requires a detailed tracking specification. Implementing a detailed spec correctly can be challenging - it is easy for errors and misconfigurations to creep in and go unnoticed. This can lead to different types of errors and issues, for example:



*   One or more property ends up missing that needs to be sent with an event
*   A property is set as the wrong type, for example a price field that was set as a string field instead of a number field
*   Misspelled keys, e.g. “post_code” rather than “postcode”
*   Wrong values sent in the wrong field, for example sending a postcode for a telephone number and vice-versa
*   An event is set up but fails to fire in certain situations, for example on certain browsers

Implementing tracking with one or more of these errors can lead to important data being invalid or lost, resulting in lower quality data downstream.



### Tracking issue 2: Broken tracking 


Changes to a website or app that break existing tracking is another data quality challenge data teams face. It is relatively common to have tracking break when an app or website is updated because:



*   Tracking is often performed implicitly rather than explicitly. For example, on a website, an event might be set up to record a button click for buttons with a particular class. This makes it easy to set up automatic tracking for all those button clicks, however this will break if a developer updates the class the button belongs to without updating the corresponding tracking.This often happens because it might not be obvious to the developer that successful tracking for those button clicks depends on the button class name.
*   Tracking might be implemented through a tag manager and then depend on a data layer. However, typically the data layer has an implicit structure that is used to determine the sending of data into multiple systems. If the data layer structure is updated - either to improve data transfer into one downstream system, or because the website has been updated, it might result in a failure to send the data the correct way to the analytics system. Once again, for the individual updating the push of data into the data layer, it might be difficult to spot whether a specific change will break the sending of data from that data layer to a downstream system.

When tracking is broken, it can lead to incomplete data, which means data consumers will once again have poor quality data to work with.


## How to prevent and resolve data quality issues

It is a good idea to have a strategy in place to prevent tracking issues from happening in the first place, however, eliminating them altogether is unlikely. The next best option is to pinpoint [data quality ](https://snowplowanalytics.com/blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/)and fix issues as soon as possible.

At Snowplow, our approach is to provide tooling to make it easier for developers to implement correct tracking, and prevent incorrect tracking from making it through to production. However, we also know that not all tracking problems can be avoided, which is why we offer a suite of tools customers can use to identify tracking issues that make it through to production as soon as possible so they can be fixed.



### How Snowplow supports correct tracking implementation

Snowplow offers two tools that make it easier to prevent tracking issues from cropping up in the first place; Snowplow Mini and Snowplow Micro.

Snowplow Mini provides developers and QA engineers with a real-time QA environment: they can spin up an environment just for their particular implementation, and conveniently inspect every event emitted from the app. They can also inspect the processed data and see if, for example, any events fail to process correctly because the event or entity does not match the associated definition.

Snowplow Micro enables developers to write tests to check that key events are emitted at the correct point in the user journey, with the correct properties. Snowplow Micro actually processes the events, validating them against their definitions - making it possible for developers writing tests to check not only that the correct event has been emitted, but that it is correctly formed and contains the right properties and values.

However, even with both Snowplow Micro and Snowplow Mini, it is still possible for data quality problems to make it through to production, which means having a way to monitor your pipeline is the best way to catch these errors and resolve them.



### Monitoring and detecting data quality issues 


Even if an engineer tests their tracking implementation, they are unlikely to test the whole solution. That’s why at Snowplow we use monitoring to pick up on these regression issues and spot broken tracking, ideally pre-production. But even if the issues are not caught pre-production, they can still be reported and recovered post production.

We do this by offering a near real-time user interface that provides customers with a “data quality score” indicating the percentage of data that fails to be processed in the production pipeline because of tracking issues.

What’s more, you see a breakdown of tracking issues by type and platform, so it is easy to identify the number of issues, which app the issue originated in and the actual underlying issue, so the correct action can be taken to resolve the issue with the appropriate team.


![data quality](/assets/img/blog/2020/06/data-quality-ui.png)
<span class="image-text-description">*Monitor data quality in near real time from the Snowplow Insights console* </span>

By using these tools in combination, you can minimize the amount of invalid, missing or incomplete data your data collection pipeline generates, which means your team will have higher quality data to power their use cases.

If you would like to learn more about how Snowplow can help you increase trust in your data with real-time data quality monitoring, [reach out to our team here](https://snowplowanalytics.com/get-started/).

