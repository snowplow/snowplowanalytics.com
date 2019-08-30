---
layout: post
title-short: Snowplow for retail 5
title: "Snowplow for retail part 5: what can we do with data when we're well established?"
tags: [analytics, data, insights, retail, retail analytics, ecommerce]
author: Archit
image: /assets/img/blog/2019/03/value.png
category: Data Insights
permalink: /blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/
discourse: true
---


We recommend you have read the [first post in this series][part-1] before diving into this one to ensure you have all the context you need!

Senior management love the work of the data team so far:

- You’re tracking site and mobile app engagement with a host of custom events
- You’re tracking a host of offline conversions and can stitch these to the behavior on the site or app
- You have brought down marketing spend tremendously after proving some campaigns drove in-store purchases far more effectively than others. Of course, you’re tracking social media clicks, email opens, and ad impressions across the web, and you know which user performed each actions.
- You’ve started assigning some probabilities to guess who unidentified users are based on their behavior
- The product manager and UX designer are singing your praises after taking a data driven approach to redesign the online products and are seeing a large reduction in drop offs

Lower marketing spend and more conversions over all due to a better user experience and more targeted advertising has management pretty happy and have decided to triple the size of the data team adding data engineers and data scientists.

It’s a good you have Snowplow at this point in your growth because this is when the tool is most effective.

![value from Snowplow][value]

Here’s a small selection of the things you can begin to do now:

1. [Set up marketing automation](#automation)
2. [Dynamically personalize in-site and in-app user experience](#personalize)
3. [Set up anomaly detection](#anomaly)
4. [Enable fraud detection](#fraud)
5. [Start monitoring the wider supply chain](#supply)
6. [Predict future trends](#predict)

A reminder that this post is entirely non-technical. It is intended to give you an understanding of what is possible with the tool and is by no means a playbook. Where relevant there will be links to more technical deep dives, otherwise please do [get in touch for more information!][demo]

<h2 id="automation">1. Set up marketing automation</h2>
So far we haven’t really leveraged the real time features that Snowplow offers. All the data being loaded into your data warehouse is first written to a real time stream. In a few short steps, you can read off this stream to action the data using an AWS Lambda function.

**Example: Automated emails**
The data analyst defines the rules: users are scored depending on their past and current usage, for example viewing 4 product pages in 10 minutes increases this score greatly. These rules can be created by exploring Snowplow’s rich event level data.

The data engineer writes a function that, when the user reaches a certain score, an email can be sent to them with relevant content. Snowplow has SDKs that makes this process quite straightforward.

The data scientist could maintain a lookup table of user groups and the content that is most effective for each. This way the email that is sent contains material that is most likely to make them convert. Snowplow data is granular, validated up front and highly structured, this makes it great input for a machine learning model. Data scientists often spend 80% of their time cleaning and structuring data, Snowplow frees up their time creating an excellent return on investment.

A similar approach can be taken for serving personalized ads in real time. Once the structure is in place, the data engineers can work at rolling out the “Data actioning” side of things throughout the product.

All of this has potential to vastly improve conversion rates and optimize marketing spend further. Why spend on marketing to the group of users who will never convert or will definitely convert - focus on those who might convert. The data scientists can group users into these 3 categories with the rich user profiles you can build with Snowplow data.

The point of Snowplow in this setup is to deliver the best possible inputs for a fully customized solution, it is however up to your data team to build that solution.

<h2 id="personalize">2. Dynamically personalize in-site and in-app user experience</h2>

Using the approach taken in the section above on “Automated emails”, you can also personalize the actual product.

Using historic data you can gauge what a user would need to see to make them most likely to convert. Snowplow has delivered data that is the best possible input for your model and its up to you to take it from here. You can then use the real time data feed to personalize the experience users have on the site or in the app by altering pricing or changing the possible paths they could take.

A/B testing with Snowplow is made easier with our [Optimizely integration.][opt] Any other service you want to A/B test with can also be done using our custom tooling. See a blog post by Anthony on [our approach to A/B testing.][ab]

Aside from the online experience, in-store experience can be tailored to their target audience. If there is data that users in London tend to search for a certain product often online, this product can be made more prominent in the Oxford Street store.

<h2 id="anomaly">3. Set up anomaly detection</h2>

By reading directly from Snowplow’s real-time stream, you can use time series forecasting to predict what your data should look like. If it deviates by more than some % this can trigger a notification via slack or email to the relevant team.

We have seen this used and it is able to alert relevant teams to abnormally low usage of a certain feature, prompting them to investigate and find a bug. They are then able to fix this bug before it causes a significant loss in revenue.

If there is a bug with a step in the checkout process and goes undetected for too long, this could have serious consequences. The kind of return on investment a good data feed and robust data strategy has is immeasurable in cases like this.

<h2 id="fraud">4. Enable fraud detection</h2>

Fraud detection combines the ideas of previous sections and is something Snowplow is very well suited to for a few reasons:

- Snowplow data is available in real time
- Every Snowplow event is very rich being captured with 130 properties by default
- Events are fully customizable allowing you to track whatever you like with however many properties
- Events are validated and are therefore in an expected structure before being passed to the real time event stream

Using the wealth of historic data as inputs for a machine learning model, you can assess what behavior is most predictive of fraud. Then as a user arrives on your site you can, in real time, compare their usage to key indicators of fraud generated by the machine learning model to assess whether or not to block checkout.

Again the return on investment here is potentially very large, depending on the levels of fraud currently being faced.

<h2 id="supply">5. Start monitoring the wider supply chain</h2>

We don’t know of any Snowplow Insights customer currently doing this but there may well be Snowplow users out there who are. The tech exists to facilitate it so there’s no reason it can’t be done.

If your retail business relies on the movement of goods, then supply chain optimization is has huge potential cost savings.

Collecting supply chain events alongside conversion events in a fully customizable tracking setup means all your analytics can sit in one place and data from multiple systems can be combined to get a better view of your business.

Snowplow has a range of server side trackers for monitoring actions that are logged such as dispatches and deliveries. Snowplow also has an Arduino tracker that can be used to track events that may not necessarily be tracked by your servers. If there is an Arduino controlled gate for instance where deliveries are taken, or an Arduino controlled lift that moves goods from onsite underground storage to the main level, these events can all be sent to Snowplow.

The cost of implementation of Snowplow tracking is relatively low, with more tracking you pay only for marginally more storage space in AWS or GCP, but getting a full view of your retail business from one table in your data warehouse is truly exciting. And with Snowplow data you are building one, highly structure and very uniform wealth of data, regardless of the source.

<h2 id="predict">6. Predict future trends</h2>

Create goods that people are asking for but don’t currently exist. Gauge user sentiment from their actions and searches to inform R&D what kind of good your consumers want.

How often do you search for exactly what you want only to be served with 0 results. As a retailer it is in your power to create those results and becomes the company that delivers what your customer base is quite literally asking for.

The means to serve this information to your R&D division lie in the hands of the data team.



[part-1]: /blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/

[value]: /assets/img/blog/2019/03/value.png

[demo]: https://snowplowanalytics.com/request-demo/?utm_source=blog&utm_medium=retail-analytics-5&utm_content=text-link

[opt]: https://snowplowanalytics.com/blog/2016/03/03/snowplow-javascript-tracker-2.6.0-released-with-optimizely-and-augur-integration/#optimizely-integration

[ab]: https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/
