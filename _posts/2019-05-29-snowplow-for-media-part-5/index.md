---
layout: post
title-short: Snowplow for media part 5
title: "Snowplow for media part 5: what can we do with the data when we're well established?"
tags: [analytics, data, insights, media, media analytics]
author: Archit
image: /assets/img/blog/2019/03/pipeline.png
category: Data insights
permalink: /blog/2019/05/29/snowplow-for-media-part-5/
discourse: true
---

We recommend you read the previous posts on this topic before diving into this article to ensure you have all the context you need:
1. [Main post](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-1/)
2. [What do I track](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/)
3. [What can we do with the data, we’re getting started](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-3/)
4. [What can we do with the data, we’re growing](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-4/)

<br>

Do read the post that answers the question: [What do I track?](https://snowplowanalytics.com/blog/2019/05/29/snowplow-for-media-part-2/)

<br>

[What can we do with the data, we’re a well established data team?](#what-can-we-do-with-the-data-were-a-well-established-data-team)
1. [Set up marketing automation](#1-set-up-marketing-automation)
2. [Personalise the product](#2-personalise-the-product)
3. [Anomaly detection](#3-anomaly-detection)
4. [Fraud detection](#4-fraud-detection)
5. [Predict future trends](#5-predict-future-trends)

## What can we do with the data, we’re a well established data team?

Senior management love the work of the data team so far:

- You’re tracking site and mobile app engagement with a host of custom events.
- You have brought down marketing spend tremendously after proving some campaigns drove subscriptions far more effectively than others. Of course you’re tracking social media clicks, email opens and ad impressions across the web and you know which user performed these actions
- Content is far more efficient at driving ad clicks and converting users
- This surge in content engagement has seen ad bids steadily increase in value and advertisers are happy with the analytics you serve them
- The product manager and UX designer are singing your praises after taking a data-driven approach to redesign the online products and are seeing a large reduction in drop offs

Lower marketing spend, higher ad revenue and an uptick in lifetime values have management pretty happy so they have decided to triple the size of the data team adding data engineers and data scientists.

It’s good you have Snowplow at this point in your growth because this is when the tool is most effective.

![Data team maturity][data-team-maturity]

With the luxury of having a lot of analysts, we have seen our customers embed analysts in the teams that are the end consumers of the data such as editorial teams - this makes Snowplow data highly effective as these analysts are empowered with Snowplow’s rich event level data.

Here’s a small selection of the things you can begin to do now:

1. Set up marketing automation
2. Dynamically personalise in-site and in-app user experience
3. Set up anomaly detection
4. Enable fraud detection
5. Predict future trends

The focus in this section is on unlocking the power of real-time Snowplow data using your new engineering resource, and building on previous analytics with ML powered insights using your data science resource.

There are a few things that make Snowplow data great for feeding ML algorithms:
- Snowplow data is granular and rich which means the algorithms are less likely to over-fit.
- Snowplow data is validated up front and highly structured, this makes it great input for a machine learning model. Data scientists often spend 80% of their time cleaning and structuring data, Snowplow frees up their time creating an excellent return on investment.
- Raw Snowplow data is unopinionated so you won’t be baking any bias into the ML models by feeding them biased data.

A reminder that this post is entirely non-technical. It is intended to give you an understanding of what is possible with the tool and is by no means a playbook. Where relevant there will be links to more technical deep dives, otherwise please do [get in touch](https://snowplowanalytics.com/request-demo/) for more information!

### 1. Set up marketing automation

So far we haven’t really leveraged the real-time features Snowplow offers. All the data being loaded into your data warehouse is first written to a real-time stream. In a few short steps, you can read off this stream to action the data using an AWS Lambda function or GCP cloud function.

<br>

**Example: automated native ads**

The data analyst defines the rules: users are scored depending on their past and current usage, for example viewing 4 articles and a video in 10 minutes increases this score greatly. These rules can be created by exploring Snowplow’s rich event level data.

The data engineer writes a function that, when the user reaches a certain score, a native ad can be surfaced to them with relevant content. Snowplow has SDKs that makes this process quite straightforward. Snowplow Co-Founder Yali Sassoon wrote a how to write a real-time app using Snowplow data in [this tutorial](https://discourse.snowplowanalytics.com/t/real-time-reporting-using-aws-lambda-and-dynamodb-a-tutorial-to-compute-the-number-of-players-in-a-game-level-on-the-snowplow-event-stream-1-2/1008).

The data scientist could maintain a lookup table of user groups and the content that is most effective for each. This way the email that is sent contains material that is most likely to make them convert.

All of this has the potential to vastly improve conversion rates and optimise marketing spend further. Why spend on marketing to the group of users who will never convert or will definitely convert - focus on those who might convert. The data scientists can group users into these 3 categories with the rich user profiles you can build with Snowplow data.

The point of Snowplow in this setup is to deliver the best possible inputs for a fully customised solution, it is however up to your data team to build that solution.

### 2. Personalise the product

Using the approach taken in the section above on “Automated native ads”, you can also personalise the actual product features.

Using historic data you can gauge what a user would need to see to make them most likely to convert. Snowplow has delivered data that is the best possible input for your model and its up to you to take it from here. You can then use the real-time data feed to personalise the experience users have on the site or in the app by serving a paywall or suggesting content.

A/B testing with Snowplow is made easier with our [Optimizely integration](https://snowplowanalytics.com/blog/2016/03/03/snowplow-javascript-tracker-2.6.0-released-with-optimizely-and-augur-integration/#optimizely-integration). Any other service you want to A/B test with can also be done using our custom tooling. See a blog post on our approach [here](https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/).

### 3. Anomaly detection

By reading from Snowplow’s real-time stream, you can use time series forecasting to predict what the data should look like. If it deviates by more than some % this can trigger a notification via Slack or email to the relevant team. For example, the newsroom can be sent a slack message if an article is underperforming so they can update the title to improve performance.

We have [seen this used](https://www.youtube.com/watch?v=Fv8rjhUeAr4) and it is possible to alert relevant teams to abnormally low usage of a certain feature, prompting them to investigate and find a bug. They are then able to fix this bug before it causes a significant loss in revenue.

If there is a bug within a step in the subscription process that goes undetected for too long, this could have serious consequences. The potential return on investment of a good data feed and robust data strategy is immeasurable in cases like this.

### 4. Fraud detection

Fraud detection combines the ideas of previous sections and is something Snowplow is very well suited to for a few reasons:

- Snowplow data is available in real-time
- Every Snowplow event is very rich and captured with 130 properties by default
- Events are fully customisable allowing you to track whatever you like with as many properties as you choose to define
- Events are validated and therefore have an expected structure before being passed to the real-time event stream

Using the wealth of historic data as inputs for a machine learning model, you can assess what behaviour is most predictive of ad fraud. Then as a ‘user’ arrives on your site you can, in real-time, compare their usage to key indicators of fraud generated by the machine learning model to assess whether or not to block site usage to prevent ad fraud. You can use this to flag users based on TTI, geography, IP and hyper engagement to name a few.

Again the return on investment here is potentially large, depending on the levels of fraud currently being faced.

### 5. Predict future trends

Create content that people are asking for but doesn’t currently exist. Gauge user sentiment from their actions and searches to inform what kind of goods your consumers want. Machine learning can be used to predict what content will be most engaged with by users in ways that manual analysis wouldn’t be able to. As mentioned previously, Snowplow’s rich, structured data is perfectly suited to this application.

[data-team-maturity]: /assets/img/blog/2019/05/data-team-maturity.png
