---
layout: post
title-short: Snowplow for retail 4
title: "Snowplow for retail part 4: what can we do with data when we're growing?"
tags: [analytics, data, insights, retail, retail analytics, ecommerce]
author: Archit
image: /assets/img/blog/2019/03/indicative.png
category: Data Insights
permalink: /blog/2019/03/06/snowplow-for-retail-part-4-what-can-we-do-with-data-when-were-growing/
discourse: true
---

We recommend that you have read the [first post in this series][part-1] before diving into this one to ensure you have all the context you need!

Now we’re looking at a data team that is growing and has several analysts and maybe some spare engineering resource as the company is starting to see real value in the analytics you have served to date.

We’re working under the assumption that you’ve already taken all the [steps recommended for a data team that’s just starting out.][part-3]

That means that at this point you have (where applicable):

- Aggregated and refined web and mobile data
- Joined data from web, mobile and offline
- Created a marketing attribution model

Now that you are a team with several analysts then you can take this a bit further and take the following steps:

1. [Track online conversions server side](#server)
2. [Use webhooks to track app installs and social media clicks](#webhooks)
3. [Understand the funnels in your products](#funnels)
4. [Begin building a more intelligent user stitch](#stitch)

Again, let’s take a non-technical look at how each of these could be achieved with Snowplow. All the ideas mentioned here are things we have seen Snowplow users do.

<h2 id="server">1. Track conversions server-side</h2>

Rather than rewrite what has already been brilliantly covered by Rebecca, please read her [blog post on the subject][server-side].

In short, ensure that you are always tracking your mission critical events server-side as this is the most robust way to track these. Doing this also helps maintain good data governance by limiting what information is pushed to the data layer.

<h2 id="webhooks">2. Use webhooks to track app installs and social media clicks</h2>

Use Snowplow’s third party integrations to track app installs and social media clicks (as examples).

Any third party data can be sent through the Snowplow pipeline so that it lands in your warehouse in the same format as all the other events. This means you can use whatever service you are comfortable with to track social media clicks and send this event to the Snowplow pipeline. Yali also wrote [a great blog post that goes into more detail on ad impressions and link clicks.][ad-impressions]

With these events in your data warehouse, you can gain an even better understanding of your user journeys. You can also add this data to your attribution model and refine it further.

Remember, you can figure out which user installed the app or clicked on the facebook link using the third party cookie or IDFA/IDFV as described in the earlier section on how to “Join web, mobile and offline data”.

As your team gets more sophisticated, so too should your tracking. With a customizable tool like Snowplow, your tracking design is limited only by your imagination. With more sophisticated tracking, you can gain an even better understanding of your users and how your money is being spent.

<h2 id="funnels">3. Funnels</h2>

We have written an ebook on the subject on Product Analytics which you can [download now.][ebook]

To look specifically at user journeys, most Snowplow Insights customers can take advantage of our [Indicative integration][indicative] with a free Indicative account. Indicative is one of the best tools out there for understanding how users move through your product. Do get in touch for more information or to [request a demo!][demo]

**Example: the signup process**
Let’s assume the product manager wants some insights into how users move through the signup process.

Out of the box tracking for form filling behavior (not just form submission behavior) lets you understand how people are dropping off. What we have seen many clients do is add a custom field to a signup custom event that holds the failure reason if a user enters an invalid value, which is what is shown in the example below.

This is a user flow for someone going through a signup process in an app. Each row contains one event. There are three event types, screen views (out of the box), application background (out of the box) and signup flow custom events. There is one entity, a screen entity that tells us what screen the event took place on.

![signup flow][flow]
<br>
<br>
![timestamps][tstamp]

From this table, some quick insights we have:

- Which steps took the longest to complete (step 2)
- The user gave up after their email address attempt had an invalid underscore character (steps 10 and 11)

This is only one user so the data isn’t too reliable, so now that you have an understanding of the data, it is easy to aggregate up to millions of sessions and users and show this in Indicative:

![indicative][sample-indicative]

The UX designer and Product manager can work on this to maximize conversions where possible.

<h2 id="stitch">4. Behavioral user stitching</h2>

In a previous section we talked through how to do a standard user stitch that relies on a user identifying themselves. Snowplow was built as a tool to capture many user identifiers so it is well suited to that task.

However, in some cases a user will just refuse to identify themselves, browsing your site in blissful anonymity. For example, you might have multiple people browsing your site with the same browser (a family, office or school) where not all of them identify themselves in every session: how would the analysts on your data team separate their behavior?

Let’s steer clear of Machine Learning as a one stop solution for now though. What can you do to build on the user stitch of the [previous post?][part-2-stitching]

Assuming each family member identifies themselves at some point, you have some sessions where you have a high confidence that you know who they are. You can start assigning probabilities to future sessions on the same device based on behavior.

- One family member (Josephine) goes on the careers pages often
- The other family member searches for products often (Joseph)

You can build a simple ranking of frequent behavior using the event level data. Then, when a session starts and the user doesn’t identify themselves you can guess who they are.

- They search for “hobs”: they want to buy hobs, probably Joseph?
- Wait, they just searched for “jobs”: Slightly more likely to be Joseph than Josephine
- They view 6 job pages: pretty sure its Josephine

This is a very simplified example just meant to illustrate what you can do with access to rich, event level data. The model that you build will be specific to your business and will be designed after thorough exploration of this rich dataset.

Read part 5 next: [What can we do with the data when we're well established?][part-5]



[part-1]: /blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/

[part-3]: /blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/

[part-5]: /blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/

[server-side]: https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/

[ad-impressions]: https://snowplowanalytics.com/blog/2016/03/07/ad-impression-and-click-tracking-with-snowplow/

[ebook]: https://go.snowplowanalytics.com/l/571483/2018-06-26/2z9m4gd?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-series-1

[indicative]: https://snowplowanalytics.com/blog/2018/09/20/snowplow-indicative-relay-released/

[demo]: https://snowplowanalytics.com/request-demo/?utm_source=blog&utm_medium=retail-analytics-4&utm_content=text-link

[flow]: /assets/img/blog/2019/03/flow.png

[tstamp]: /assets/img/blog/2019/03/tstamp.png

[sample-indicative]: /assets/img/blog/2019/03/indicative.png

[part-2-stitching]: /blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/#join
