---
layout: post
title-short: Snowplow for media part 4
title: "Snowplow for media part 4: what can we do with the data when we're growing?"
tags: [analytics, data, insights, media, media analytics]
author: Archit
image: /assets/img/blog/2019/03/pipeline.png
category: How to guides
permalink: /blog/2019/05/29/snowplow-for-media-part-4/
discourse: true
---

We recommend you read the previous posts on this topic before diving into this article to ensure you have all the context you need:
1. [Main post](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-1/)
2. [What do I track](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/)
3. [What can we do with the data, we’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/)

<br>

Bear in mind there is 1 more post in this series you can read after this one: [What can we do with the data, we’re well established](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-5/).

<br>

[What can we do with the data as our data team grows?](#what-can-we-do-with-the-data-as-our-data-team-grows)
1. [Advertiser analytics](#1-advertiser-analytics)
2. [Track critical events server-side](#2-track-critical-events-server-side)
3. [Track app installs and social media clicks](#3-track-app-installs-and-social-media-clicks)
4. [Funnels to improve UX and inform paywall decisions](#4-funnels-to-improve-ux-and-inform-paywall-decisions)
5. [Further user stitching](#5-further-user-stitching)
6. [Informed content creation](#6-informed-content-creation)

## What can we do with the data as our data team grows?

Now we’re looking at a data team that is growing and has several analysts and maybe some spare engineering resources as the company is starting to see real value in the analytics you have served to date.

We’re working under the assumption that you’ve already taken all the [steps recommended for a data team that’s just starting out](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/).

That means that at this point you have (where applicable):

- Aggregated and refined web and mobile data
- Joined data from web and mobile
- Created a marketing attribution model
- Understood what drives user retention

Now that you are a team with several analysts then you can take this a bit further and take the following steps:

1. Advertiser analytics
2. Track critical events server-side
3. Use webhooks to track app installs and social media clicks
4. Understand the conversion funnels
5. Begin building a more intelligent user stitch
6. Make informed content creation decisions

Again, let’s take a non-technical look at how each of these could be achieved with Snowplow. All the ideas mentioned here are things we have seen Snowplow users do.

### 1. Advertiser analytics

If you rely on ad revenue rather than subscriptions or donations (or even a mixture of all 3), some key questions can be answered with event level data.

- Which users should we look to find more of since they are attracting high bid values
- What content attracts many and/or high bids (not just article name, but product mentions in content, themes, personalities etc., all captured by custom entities)
- How much is each page view worth
- Which authors are the best at driving high CPMs

Successful bid data can be tracked as Snowplow events server-side or if the data already exists in tables in your warehouse, it can be easily joined to Snowplow user engagement data in your warehouse. If you use prebid.js, all the bid data the user browser receives can be tracked as Snowplow events allowing you to build a great understanding of ad space value in your product since you know which impression received which bids.

A better understanding of what drives DSP decisions can lead to large gains in ad revenue and is something that can be quite hard to understand at a granular level with one-size-fits-all analytics solutions.

All this great analysis can also then be served back to advertisers and affiliates to encourage confidence and therefore further investment.

### 2. Track critical events server-side

Rather than rewrite what has already been brilliantly covered by our Customer Success Lead, Rebecca Lane, please read her blog post on the subject [here](https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/).

In short, ensure that you are always tracking your mission critical events, such as subscriptions and donations, server-side as this is the most robust way to track these. Doing this also helps maintain good data governance by limiting what information is pushed to the datalayer.

### 3. Track app installs and social media clicks

Use Snowplow’s third party integrations to track app installs and social media clicks (as examples). Any third party data can be sent through the Snowplow pipeline so that it lands in your warehouse in the same format as all the other events. This means you can use whatever service you are comfortable with to track social media clicks and send this event to the Snowplow pipeline. A great blog post that goes into more detail on this by Snowplow Co-Founder Yali Sassoon can be found [here](https://snowplowanalytics.com/blog/2016/03/07/ad-impression-and-click-tracking-with-snowplow/).

With these events in your data warehouse, you can gain an even better understanding of your user journeys. You can also add this data to your attribution model and refine it further. Remember, you can figure out which user installed the app or clicked on the Facebook link using the third party cookie or IDFA/IDFV as described in the earlier section on [how to join mobile and web data](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/#1-stitch-user-data-gain-a-360-view).

### 4. Funnels to improve UX and inform paywall decisions

We have written an eBook on the subject of Product Analytics which you can download [here](https://go.snowplowanalytics.com/l/571483/2018-06-26/2z9m4gd?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-series-1). To look specifically at user journeys, most Snowplow Insights customers can take advantage of our [Indicative integration](https://snowplowanalytics.com/blog/2018/09/20/snowplow-indicative-relay-released/) with a free Indicative account. Indicative is one of the best tools out there for understanding how users move through your product. Do get in touch for more information or to [request a demo](https://snowplowanalytics.com/request-demo/)!

<br>

**Example: the signup process**

Let’s assume the product manager wants some insights into how users move through the signup process before subscribing. The Snowplow data they would work with may look something like this:

![A table of the signup flow][signup-flow-table]

![A table of the signup flow 2][signup-flow-table-2]

From this table, some quick insights we have:

- Which steps took the longest to complete (step 2)
- The user gave up after their email address attempt had an invalid underscore character (steps 10 and 11)

This is only one user so the data isn’t too reliable, so now that you have an understanding of the data, it is easy to aggregate up to millions of sessions and users and show this in Indicative:

![Indicative funnel visualisation][indicative-funnel]

The UX designer and product manager can work on this to maximise conversions where possible.

Importantly, funnels can be built based on paywall experiments. A/B test data for different paywall strategies can be pulled into Indicative to inform decisions on what paywall logic to employ. Are there unsubscribed users who exhibit traits of high LTV subscribers engaging in certain content? Can this be taken advantage of to push them to subscribe?

Using data to drive paywalling decisions means that you won’t be giving away content for less than it is worth.

### 5. Further user stitching

Snowplow was built as a tool to help companies understand their users and take actions from that understanding. A key step in that process is to evolve the user stitch. The more reflective the user stitch is of the truth, the more confidence we have when bucketing users. They can be bucketed based on which are the most valuable and what influences them. Armed with knowledge on how to influence the most valuable users, very effective actions can be taken off the data.

An example of what I mean by evolving the user stitch is to look at the case where multiple people browse your site with the same browser (a family, office or school) and not all of them identify themselves in every session.

Let’s steer clear of machine learning as a one stop solution for now since we are working under the assumption the data team consists of 4-5 data analysts at this stage. What can you do to build on the user stitch of the previous section?

Assuming each family member identifies themselves at some point, you have some sessions where you have a high confidence that you know who they are. You can start assigning probabilities to future sessions on the same device based on behaviour.

- One family member (Josephine) reads informational content and tends not to comment
- The other family member (Joseph) watches many videos and leaves comments often

You can build a simple ranking of frequent behaviour using the event level data. Then, when a session starts and the user doesn’t identify themselves you can guess who they are.

- They search for “snowplo” and open a “Snowplows” article about how those machines work - might be Josephine
- They scroll 75% of the way through the article - more likely Josephine
- In the sidebar the spot a video and play it - could actually be Joseph
- They then watch a related video and leave a string of comments - quite sure its Joseph

This is a very simplified example just meant to illustrate what you can do with access to rich, event level data. The model that you build will be specific to your business and will be designed after thorough exploration of this rich dataset.

### 6. Informed content creation

Having already answered some basic questions about what content is most popular in [User engagement on the website](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/#2-perform-aggregations-make-your-own-assumptions-to-understand-engagement) we can start to think about what content is most sought after at what time. This can then inform what content is created.

Using your data to drive an understanding of which content is being engaged with by which users means a content roadmap can be built. This allows for highly efficient spend on its creation and means that only the content most likely to encourage engagement and therefore higher ad revenue, higher subscription rates and lower churn will be produced.

The producers of content can also be served dashboards on how their content performs. This is made easy as you can track a custom property in a content entity which contains a creator_id. Having access to all the event level data means you can simply filter all events for that creator_id and serve the same dashboard to every creator.

<br>

Read next: [What can we do with the data, we’re well established](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-5/)

[signup-flow-table]: /assets/img/blog/2019/05/signup-flow-table.png
[signup-flow-table-2]: /assets/img/blog/2019/05/signup-flow-table-2.png
[indicative-funnel]: /assets/img/blog/2019/05/indicative-funnel.png
