---
layout: post
title: "Getting the most out of product analytics with intelligent questions"
title-short: Intelligent question-driven product analytics
description: How asking the right questions can lead to product improvements
image: /assets/img/blog/2018/04/retained-users.png
tags: [analytics, product analytics, digital products]
author: Anthony
category: Data insights
permalink: /blog/2018/04/27/getting-the-most-out-of-product-analytics-with-intelligent-questions/
discourse: true
---

*Part six of our series on product analytics. Read: [Part 1][product1], [Part 2][product2], [Part 3][product3], [Part 4][product4], [Part 5][product5], [Part 7][product7], [Part 8][product8]*

---

In the beginning, when you’re starting out with analytic-driven product development, the amount of data your analytic platform gives you access to can be overwhelming. With all of the preconfigured charts and dashboards, it can be easy to fall into a trap of passively consuming the data in front of you, assuming the answers you need are somewhere within. Unfortunately in digital analytics, this is how it often goes: tools like Google Analytics and Mixpanel present digital analysts with a plethora of reports and as a result, analysts are often tempted to start with the reports within those tools and work backward to the questions they want to ask.

This is dangerous territory. While the default reports that come with most analytic tools are great for their specific, intended uses, trying to orient your entire analytic process around them can often be misleading. Real insight starts with asking sensible questions, and that requires an understanding of the business unconstrained by out-of-the-box configurations. Nowhere is this clearer than the case of product analytics. Because digital products vary so widely, both in what they aim to do for their users and how how they monetize, an essential part of data-driven product development is asking intelligent questions unique to your use case. It’s hard to capture how to ask intelligent questions in a vacuum, so in this post we’re going to look at a specific case study of how a product team used question-based analysis to drive significant business impact.

<h2 id="data driven product development">Using data to inform product development for Lifecake</h2>

[Lifecake][lifecake] is a service for family members to collect, share, and celebrate memories, in the form of photos and videos, with one-another. Their goal is to create an intimate, private space for sharing photos and videos. The Lifecake team is very focused on developing their product, and they want to make sure that they’re focusing their development efforts on the parts of the product that count. They want to use data to make sure that they’re improving the service for their users, while growing their user base, over time.

The initial analysis was focused on identifying where is the product working, and where is it not. The Lifecake team knew they were spending a lot on acquiring new customers, but their user base wasn’t growing as fast as they were expecting. Naturally, the first question to ask was what’s going wrong?


<h2 id="where am I losing users">Where are users being lost?</h2>

After the first round of analysis on their product data, a retention analysis showed that a huge percentage of users dropped Lifecake after day one. Here is an approximation of what Lifecake’s retention curve looked like (created with simulated data):


![Lifecake retention curve][curve]


The Lifecake team could clearly see that the biggest drop off point in users is within the first day. A graph like this indicates two things:

1. A very large number of users log into the app on day one but then don’t return. Something is going wrong there that needs to be explored.
2. Those users that are still around on day two have very high retention.

This suggested that Lifecake has two types of distinct user journeys, that there’s some sort of friction point that one a user gets past, they love the service, but that a large number of users never make it beyond that point. Identifying what causes that friction, and removing it, became the Lifecake team’s number one priority.

Solving this day one retention problem presented a huge opportunity for Lifecake: if the team can find a way to get more users to stay with the app for an additional day, the overall numbers of active users would increase significantly. This would lead to a massive increase in return on their acquisition spend with most of the users acquired being retained well beyond three days.


<br>
{% include shortcodes/ebook.html layout="blog" title="Being data-driven starts with the right question" description="Learn about how the worlds biggest startups successfully use data." btnText="Download eBook" link="https://go.snowplowanalytics.com/l/571483/2018-06-26/2z9m4gd?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-series-6" %}


<h2 id="improving day one retention">How do we solve the day one retention problem?</h2>

Diving into the service’s user data, the first step to answer this question was to separate out the user journeys of those who retained and those who did not in order to surface what key differences might have have influenced these users’ behavior. The first step was to do some basic statistical analysis: we used binomial regression to quantify the impact of activities on retention, and from there, used random forest to identify which activities predict and differentiate best.

Once we had identified a list of different ‘engagement metrics’ that appeared to distinguish users who retained with those who didn’t, the Lifecake team wanted to know, **“which matters the most?”**


![Difference between retained and churned users][retained]


Doing this analysis, it became apparent that comments on photos, instead of likes, were a much more meaningful metric for determining engagement and a user’s likelihood of retaining.  

<h2 id="different needs for different users">What do different user types need from their experience?</h2>

This information around engagement, though just a starting point, was enough of a foundation for the product team to start developing alternative sign up experiences and rigorously A/B test how these changes to the customer experience impacted the desired user behaviors and contributed to the desired outcome of a higher day one retention.

From the beginning, the Lifecake team had a hunch that for their product, additional segmenting of the analyzed behaviors would be necessary. They suspected that it would be necessary to look at the different user types individually: parents will exhibit quite different behaviors on the app (primarily driving content creation through uploading new photos) when compared to other family members (like grandparents and other extended family who skew more towards consuming content generated by the parents). A quick analysis showed that these different types of users do engage with the app in very different ways:


![Comparing different types of Lifecake users][key]


The Lifecake team is now refining all of the initial analysis with this newly developed understanding of their user types and associated behaviors, motivations, and desires. The team is looking at how their product is perceived by the different user types and how they can improve the day one experience for each segment individually. What does a grandmother, for example, need to experience after signing up for Lifecake to feel what she needs to feel to keep her coming back to the app? How is that different for a new father? Or the keeper of all of a family’s photo albums?

<h2 id="intelligent questions">Intelligent questions yield actionable results</h2>

Armed with this insight, the Lifecake team has been able to dramatically increase the number of users acquired that retain in their app, lowering their cost of customer acquisition and enabling them to bring their unique and much loved service to many more families. While the questions they asked were specific to Lifecake, the process of starting with the business and product first, then asking the right questions, led the team to real and actionable insight that they’ve been able to use to improve their user experience and grow their customer base. That [process][process] is one that can be adopted by any product team with a commitment to data-driven growth.


[product1]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[product2]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[product3]: https://snowplowanalytics.com/blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/

[product4]: https://snowplowanalytics.com/blog/2018/02/09/the-product-analyst-toolkit/

[product5]: https://snowplowanalytics.com/blog/2018/02/23/creative-experiments-and-ab-tests-produce-the-best-results/

[product7]: https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/

[product8]: https://snowplowanalytics.com/blog/2018/06/01/the-right-data-infrastructure-to-support-successful-squads/

[process]: https://snowplowanalytics.com/blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/

[lifecake]: https://www.lifecake.com/

[curve]: /assets/img/blog/2018/04/retention-curve.png

[key]: /assets/img/blog/2018/04/key-moments.png

[retained]: /assets/img/blog/2018/04/retained-users.png
