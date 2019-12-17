---
layout: post
title-short: "How to get to a multi-touch attribution model that works for you"
title: "How to get to a multi-touch attribution model that works for you"
description: "Multi-touch attribution is alive and well. Complete, quality, first-party data are key to true multi-touch attribution accuracy"
author: Erika
category: Data insights
permalink: /blog/2019/11/15/how-to-get-to-a-multi-touch-attribution-model-that-works-for-you/
---


True multi-touch attribution begins with collecting and centralizing your multi-source data, making sure you have the volume, quality and completeness of data you need and then connecting the dots to build your attribution story. Marketing departments invest heavily in marketing strategy, tactics and campaigns. To justify marketing spend and fully understand the results of the marketing mix you’ve deployed, you undoubtedly ask yourself how you can account for or attribute the results you get. And a true picture of marketing attribution emerges from looking at all the marketing touchpoints, marketing channels and interactions your users or customers make in their interactions with you. This is where multi-touch attribution comes in. 

It sounds clear enough, but before you get to implement your multi-touch attribution models, you have to take a look at potential blockers and how you can mitigate them. One issue is that the nature of tracking is changing and becoming more difficult. Voices warning about the impending end of multi-touch attribution have been growing louder in the analytics community, citing everything from data privacy regulations like GDPR and CCPA and the major crackdown on third-party tracking techniques, thanks to in-browser anti-tracking measures, such as [ITP in Safari](https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/) and default Enhanced Tracking Protection in Firefox. But it’s not time to throw one’s hands in the air and exclaim that the sky is falling. 

Even more essential and urgent in getting to true multi-touch attribution, and removing a big roadblock, is undoing data silos. When data resides in multiple databases, coming from different sources, it’s not comprehensive, and it can quite understandably be inconsistent, providing information that is inaccurate and misleading. One of the most obvious examples here is in cases where data from a platform like Facebook is double counted. That is, in Facebook’s own attribution model, they count view through and click through actions as conversions and will assign credit to themselves for a sale if a customer has even seen an ad on Facebook during a specific timeframe. If you were to rely on Facebook data given these constraints, would you think it was an accurate analysis? Or, in an omni-channel, multi-touch, multi-device world, do you suspect that there’s more to the story? This is just one angle on how data silos and single-channel accounting lead to misleading data, but there are many ways in which siloed data clearly obscures the bigger picture.

Apart from getting insight for decision-making and accurately attributing your marketing initiatives, breaking down your data silos is the path to moving to a single source of truth model. That is, consolidate all your data in a single warehouse from which you can join all the sources together. Not only does this approach remove some of the organizational inefficiencies and bottlenecks as you cultivate more sophisticated data analytics strategies, it also makes data available for multiple uses across your business. 


## Why do attribution?

Making informed decisions about where to invest in marketing can be tricky, all the more so if you don’t have insight into your customer journey or into what happens at each stage of that journey. How does each touchpoint in your marketing funnel influence a potential customer, and what ultimately causes them to convert? What are the most common or surprising conversion paths? Analyzing the pieces of this puzzle can be complex, and the process appears to be growing more difficult with the introduction of the aforementioned barriers to collecting customer data. But it is by no means out of reach. 

If it’s so challenging, then, you might ask yourself, “Why bother doing attribution at all?” Or why not settle for something less demanding, such as a media mix model that delivers ballpark figures rather than user-level data (i.e., an estimate of marketing impact on stated objectives instead of tracking actual event-level engagements within the user journey)? Obviously, being able to attribute credit to different events in the user journey will give you granular evidence of what is and is not working within your marketing campaigns. It will also help you to optimize your content, and more importantly, your spend. At a high level, the aim of attribution is to understand the real return on ad spend (ROAS), and a data-informed, multi-touch attribution model provides that kind of insight. 


 {% include shortcodes/ebook.html background_class="data-attribution-landingpage" layout="blog" title="Attribution 101 guide" description="How to get true multi-touch attribution with Snowplow Insights" btnText="Download the guide" link="https://www.snowplowanalytics.com/lp/data-attribution/" %}


## How complete, quality data is key to multi-touch attribution

Given the increasing limitations around third-party data collection and privacy standards, your data collection and the data itself become crucial elements in developing your approach to multi-touch attribution. Collecting and centralizing your multi-source data with a first-party data pipeline, like Snowplow, means you won’t find your hands tied by restrictions. Owning and controlling your complete data is part of what keeps multi-touch attribution very much alive, and helps to ensure that you have the quality and completeness you need to do proper attribution. Many companies overfocus on the attribution algorithm or model at the expense of the data itself. The data that feeds the algorithm is at least as, if not more, important as the algorithm. 

 

Why? If you have missing events and gaps in your data, this data is not available to include in your attribution model. The attribution figures will only reflect what attribution data you put into the model, leaving you to wonder how accurate your results are. As sexy as the idea of data science and algorithms may be, the fundamental underpinnings of accurate attribution are complete, [high-quality data](https://snowplowanalytics.com/blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/). 


## Real-world attribution

A number of companies have built multi-touch attribution models by centralizing their multi-source data within a single source of truth and forming a full picture by joining the different data together. From e-commerce company, **[Green Building Supply](https://snowplowanalytics.com/customers/green-building-supply/)**, which finally was able to follow their customers’ actions at multiple touchpoints through long sales cycles and join their past and present multi-source data, to **[Animoto](https://snowplowanalytics.com/customers/animoto/)**, a video creation platform that [built custom data models](https://snowplowanalytics.com/blog/2019/09/02/how-animoto-uses-event-tracking-data-to-optimize-the-user-journey/) thanks to being able to collect end-to-end, multi-source data on the user journey, the real-world applications of attribution are many.


## Attribution with Snowplow

As your business becomes increasingly data informed, you’ll most likely start using multi-touch and custom attribution. This is great because it means you don’t have to rely on out-of-the-box, one-size-fits-all models. However, this also means that the value of your attribution models will ultimately depend on two things: the _ownership_ and _quality_ of your data, points we’ve emphasized repeatedly because they are just that important! Owning the event-level data provides a great workflow for attribution modeling in Snowplow.


```
Explore the event-level (unopinionated) data → try a model → evaluate the model → iterate the model → re-evaluate
```


With Snowplow, you can achieve accurate attribution with in-depth analysis that becomes possible when you marry user behavior and actions up with your _complete_ data, across channels and systems.

We’ve put together an Attribution 101 guide to share more real-world attribution examples, discuss the basics of attribution, take a look at different marketing attribution models, such as time decay, U-shaped, linear, first click and last click, and more, and the questions these models can answer, before we finally dive into the fundamental importance of complete, high-quality data in developing attribution models that help you understand your marketing efforts and marketing budget performance. 

[Download the guide](https://snowplowanalytics.com/lp/data-attribution/) to start changing your attribution game. 



