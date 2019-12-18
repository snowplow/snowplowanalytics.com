---
layout: post
title: How Animoto uses event tracking data to understand and optimize the user journey
title-short: How Animoto uses event trackiong data
author: Alex & Jason
category: User stories
permalink: /blog/2019/09/02/how-animoto-uses-event-tracking-data-to-optimize-the-user-journey/
---

_“How are people using my site?”_

_“What is a typical customer’s journey?”_

_“How many times does a user visit before purchasing? And how many pages do they visit? Which one had the biggest impact on their decision?”_

These are a few questions that data analysts hear all the time from marketing, product and finance teams. The concepts of a “customer journey”, “clickstream analysis”, and “multi-touch attribution” have been around for a long time and are not unique to Animoto. Being able to “tell a story” based on data is imperative to growing and optimizing a website and overall business. Any company that wants to scale their business has to answer these questions at some point.

In order to answer some of these questions, Animoto was looking for a scalable, sophisticated, and cost-effective solution to help collect and analyze our ever-growing user data. For the analyses we wanted to do, we needed a solution that could help us in four main ways:



1. The ability to reconstruct and stitch together a user’s visits to show a “journey” that was unique to our business
2. The ability to track every interaction with our site -- for both anonymous and registered users 
3. The ability to answer very specific questions related to the user journey, attribution modeling, improving our funnel, understanding growth initiatives, and analyzing the effectiveness of new product features
4. Something that was optimized for database and query performance, along with world-class support

Snowplow checked all of these boxes for us and for the last few years has been the foundation of the systems and models developed by the Analytics team at Animoto. We have found that Snowplow’s best-in-class data collection platform gives us the flexibility we need to craft our user data to meet our needs.

The Analytics team has been using data collected through Snowplow to develop out four proprietary models that we use every single day to help us make data-backed decisions for our business. Any business can use variations of these models to gain meaningful insights on a day-to-day basis. The four models we developed are: 


## Milestones

The Milestones model at a high level is a way for us to understand what users are doing post-registration. When using our product, there are certain “milestones” that most users hit in their tenure, and we needed a way for us to identify these specific points in time. The model is mainly used to give us insight into two things: 



1. What are users doing between registration and placing an order?
2. How are users interacting with specific features within the product? 

The Milestones model is organized at an individual user level, with events in chronological order. Each event utilizes various Snowplow context tables to fill in numerous details associated with the event, including details such as the product feature the user was interacting with, the geographic and device being used, and whether the event occurred within an ongoing A/B test. 

We can use this model to give us insights into things, such as how to optimize our registration-to-paid funnel, the state of product feature usage/adoption, and the most common ways users are interacting with our product.


## Signup Journey

The Signup Journey model is a way for us to determine what pages users were visiting _prior_ to registration. Similar to the Milestones model, the Signup Journey model is at an individual user level and contains events in chronological order. For this model though, both known (i.e., went on to sign up) and anonymous users are included. 

This is a _very_ complex model because of the inherent difficulties with “stitching” users across sessions and different devices. These challenges are inherent in any type of journey model, but the Snowplow data we collect provides enough detail to stitch the correct users with a high degree of accuracy. Some of the high-value information we gather from this model includes overall visit-to-reg conversion rate, traffic volume from various sources and marketing mediums, and full path analysis of the user journey before registration.


## Multi-Touch Attribution

Our multi-touch attribution model is a way for us to attribute orders to the various sources from which users visit our website. This model is used as an alternative to Google Analytics because it allows us to set our own business logic. Based on our marketing strategies, there are some traffic sources that should be weighted more heavily towards having an impact on subsequent orders, and some that can be weighted less heavily or ignored completely. 

With most services such as Google Analytics, the attribution logic is applied by default and cannot be changed (some would refer to it as a “black box”). Since we collect visit and UTM data through Snowplow, we can leverage it to create our own attribution model that incorporates all touches from users. As long as we can connect these visits to the correct users, our attribution model will be effective -- this is where our Signup Journey model comes into play! We’ve already done our user stitching in that model so we can use it to inform this multi-touch attribution model. 

This model allows us to more accurately attribute orders to our marketing channels, giving us a better picture of which channels are successful. We can then ensure that we are optimizing our ad spend to the right places.


## Testing

There are two services Animoto uses for A/B testing: 



1. Optimizely
2. LaunchDarkly

Optimizely has its own internal dashboard that reports on metrics related to the experiments, but it is another “black box” and there is no way for us to corroborate the results of the different experiments. Since Optimizely data is logged with each Snowplow event in a context table, we can use it to accurately determine what users are doing within each experiment. 

LaunchDarkly is similar to Optimizely, but was implemented by our Engineering team as a feature flag management system for testing. While it doesn’t have its own reporting interface, we can control which features a user can or cannot see, and this data is logged in a Snowplow context table. In doing so, we can determine what actions users are taking while within an “experiment”. 


When we connect these two models to our Milestones and Signup Journey models, we can see all of the metrics contained in those models broken up by the experiments and variations specified by either Optimizely or LaunchDarkly. This is _incredibly_ powerful and informative for helping us determine the impact or success of anything we test.


## Painless insights with Snowplow

As a testament to the ease of use and robust data collection capabilities of the Snowplow platform, we were able to accomplish and build all of these models with only two data analysts.

While these models have given us a ton of meaningful insights into our users and overall business, our models and processes are not perfect. Just as with any company we have to deal with such issues as:



*   Missing data due to ad blockers and users visiting in the EU (thanks, GDPR!)
*   Difficulty connecting events from the same user visiting on different browsers or different platforms (web or mobile)
*   Maintaining and supporting four huge models with limited resources


## What’s next for Animoto event tracking?

As Animoto moves forward and continues to grow as a company, understanding the user journey becomes one of the most important objectives of the Analytics team. Over the last three years, Animoto has been able to utilize our event tracking data to build best-in-class, proprietary models to support our marketing, product, product marketing, and growth teams. But as we continue to develop these models and try to answer more and increasingly difficult questions about the user journey, we have started to realize that what we have in place is just the tip of the iceberg.

In the coming months, we’re planning to enhance our existing models even more, while utilizing them to build other in-depth models. We’re planning on accessing data in real time to be able to personalize the user experience on our site through predictive modeling. And we’re working on brand new models to answer questions we haven’t had the capabilities to answer in the past. Now that we have discovered the power of event tracking and understanding the user journey, we're excited to apply this knowledge across all business models - from retention and churn to lifetime value and path analysis.