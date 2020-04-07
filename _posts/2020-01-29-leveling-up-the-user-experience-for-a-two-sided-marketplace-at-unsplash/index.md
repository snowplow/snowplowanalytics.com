---
layout: post
title: "Leveling up the user experience for a two-sided marketplace at Unsplash"
description: "Find out how Unsplash uses Snowplow to centralize their data and improve the user experience for a two-sided marketplace"
author: SimonP
category: User stories
permalink: /blog/2020/01/29/leveling-up-the-user-experience-for-a-two-sided-marketplace-at-unsplash/
discourse: false
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Unsplash.png
thumbnail-image: /assets/img/blog/featured/SP-Blog-Thumb-Unsplash.png
---


Improving the user experience is hard work. It involves an ongoing discovery process, sometimes with multiple customer interviews and internal product meetings. It also requires sorting through reams of behavioral data to identify pain points and uncover customer challenges. And that’s before you can even use your findings to improve the experience for your users. But what about when you have two distinct types of users doing entirely different things? 


## The challenge: Breaking free from limited analytics

As [we’ve discussed before](https://snowplowanalytics.com/blog/2018/10/31/building-reliable-scalable-customer-acquisition-for-marketplaces/), two-sided marketplaces consist of two distinct user groups with different user journeys – adding complexity to your analytics. A good example is Unsplash, where two types of users: photo consumers and contributors behave completely differently. 

Unsplash is a popular online photo marketplace where consumers download over 50 million, free, high-definition images each month – provided by a vibrant community of contributors, photographers and creatives. Unsplash’s marketplace was thriving, but when it came to their analytics, tracking their two different users proved challenging. As Timothy Carbone, Data Engineer at Unsplash, discovered, traditional analytics products were not ideal for Unsplash because they are primarily designed for ‘standard’ business models with a single user. 

Without the ability to differentiate the two types of users, it would be impossible to track their behavior properly, much less improve the user experience. Timothy grew frustrated with the limitations of tools like Google Analytics, and began looking for a solution that gave him the freedom to collect raw data from each user group and the flexibility to model his data sets separately. 


## The solution: The freedom of Snowplow data

Once Timothy and his team had identified the benefits of owning their data and structuring it according to their needs, it became an easy decision to adopt Snowplow. With Snowplow, Unsplash could take control of their data, customize their data collection process and ensure consistent tracking across multiple sources. 

Unsplash chose Snowplow to 



*   Take ownership of their user data and data infrastructure
*   Define custom events in their format of choice
*   Collect rich, granular data about user behavior 
*   Cross-reference user data with their product database to identify contributors and consumers

A crucial part of Unsplash’s offering is their API technology that integrates with hundreds of tools such as Medium, Trello and Square. Using Snowplow, Unsplash was able to capture events from all their sources in a consistent format, making it possible to centralize data sets from across the entire Unsplash ecosystem. 


> **“With Snowplow, we discovered that we own the data, which isn’t formatted in a way that forces you to a specific use case — it’s free and open so you can do what you want with it. We collect the data, use it to build a BI dashboard and connect it to the product to help our contributors”** - **_Timothy Carbone, Data Engineer, Unsplash_**



## Serving both sides of the marketplace 

Within Unsplash’s marketplace, consumers and contributors want different things. For consumers, it’s about quickly finding and downloading the right image; contributors are creatives who want to share their work as widely as possible. 

With Snowplow, Unsplash was able to tailor their tracking strategy to get better insight on each set of their users. As well as enabling Unsplash to implement A/B testing, setting up custom contexts allowed Unsplash to see exactly what images consumers are looking for and monitor which keywords appear on which partner platforms, e.g. searches for ‘technology’ photos in the iOS app. This meant the Unsplash team could better understand consumer search behavior and in turn, improve their ranking system and their overall search function. 

But rather than keeping insights to themselves, Unsplash was able to aggregate this search data into mini-dashboards that could be served back to contributors. This helps contributors see how their images are performing, where they are most downloaded, what searches they appear in, and how they can maximize their exposure. Since Unsplash managed to centralize their data across platforms, they have even been able to feature ‘trending topics’ in their community newsletter, so contributors can take advantage of the hottest search requests. 

> **“Snowplow is really at the center of a lot of things we do on the product, whether it’s to improve the experience for consumers or to improve the experience for contributors by delivering stats on and insights into how they can be more impactful.”** - **_Timothy Carbone, Data Engineer, Unsplash_**


## The future with Snowplow

Unsplash has big plans for the future, from featuring more detailed user recommendations to solving image-related challenges with machine learning. In the near term, Timothy aims to use Snowplow data to help users who search for content that doesn’t yet exist by steering them toward the best-matching content that’s already there. He also wants to implement personalized alerts that notify users when new, relevant content becomes available that may match their interests. 

All this will be possible as Unsplash collects large volumes of event-level data about how individual users behave and how frequently they look at a particular subset of images. Moving forward, Snowplow will continue to be a critical part of how Unsplash delivers on its mission to connect a growing community of creatives with millions of content-hungry consumers. 