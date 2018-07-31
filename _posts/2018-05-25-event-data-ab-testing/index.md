---
layout: post
title: "Improving A/B testing with event data modeling"
description: How event data modeling can lead to improved A/B tests
image: /assets/img/blog/2018/05/test-design.jpg
title-short: Intelligent question-driven product analytics
tags: [analytics, product analytics, digital products]
author: Anthony
category: Analytics
permalink: /blog/2018/05/25/improving-ab-testing-with-event-data-modeling/
discourse: true
---

*Part seven of our series on product analytics. Read: [Part 1][product1], [Part 2][product2], [Part 3][product3], [Part 4][product4], [Part 5][product5], [Part 6][product6], [Part 8][product8]*

---


Conducting an A/B test is significantly more complicated than just randomly assigning users into two groups. To run a truly meaningful experiment, as we’ve pointed out, requires meticulous planning around what experiment is run, what the expected impact of the experiment will be, and what metrics will best capture that impact. Effective product teams will want to run many A/B tests in parallel each week. It is therefore essential that the process of running the tests, measuring the results, and making the decision whether or not to roll out each product update is as frictionless as possible.

Broadly speaking, there are two approaches to tracking and measuring A/B tests. The first involves defining the metrics in advance that will be compared between the different test groups, and instrumenting dedicated tracking specifically for those metrics based on what segment a user belongs in (test, control, or neither). The second is the event analytics approach. In this method, it is only necessary to track that a user belongs in a particular group at least once; afterwords, the relevant metric is computed post-collection when the data is in the data warehouse. In this post, we’ll explore how the event analytics approach works, why it is significantly easier than the alternative, and therefore why event analytic stacks like Snowplow are powerful enablers of product teams that wish to implement multiple simultaneous experiments.

<h2 id="events segments and metrics">Measuring the digital world: understanding the difference between events, segments and metrics</h2>

![measuring the digital world][measure]

To understand the difference between the two approaches for measure A/B tests, we first need to distinguish between events, segments, and metrics.

* Events are observations of things that happen, such as when a user loads a website, clicks a button, or navigates to a different page. You can think of each event as a “fact” that is recorded or an observation that is made.
* Segments are groups of users that have something in common like age group or geolocation. In an A/B test, both the “control” group and “test” groups are segments.
Metrics are things computed on user data like the number of people who visited a page or the number of pages a user has visited.
* Metrics are measurements that are computed on groups of events. For example, we might compute the “number of page views per session,” “number of sessions per user,” the “time taken” for a particular workflow to complete, or the “percent dropout” for a particular workflow. All of these are calculations that can be run on the underlying event-level data. When we’re running an A/B test, we’re comparing one or more metrics between the test and control group.

<h2 id="test structure">Test structure matters</h2>

When you’re running an A/B test, your fundamentally comparing two segments, the control group and the test group. You’re comparing a metric (or set of metrics) between the test group and control group to see if a new feature or other change has the desired effect.

On high-functioning product teams, this becomes challenging to manage. Across the team, members are coming up with great features and contributing to the overall evolution to the product. Each feature needs to be tested, to see if it has the desired effect, before being rolled out to the rest of the userbase, and the chances are high that each test will be run in a fundamentally different way than the others with a different control group and different set of variables to measure. The end result is that a well developed product, with a high functioning product team, might be running dozens or even hundreds of experiments simultaneously.

{% include shortcodes/ebook.html layout="blog" title="Make your A/B tests count" description="Learn how to use testing and other analytics to develop world class digital products." btnText="Download eBook" link="https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-7" %}

Because of this, it’s not uncommon for some companies to run multiple experiments every week. Facebook, for example, is [known for its rapid and rigorous product development cycle][top-companies] and runs hundreds of concurrent tests [every day][facebook] on its billions of users. This is no small feat: not only do those tests needs to be designed and deployed, they need to be tracked and monitored and carefully executed so as not to interfere with one another.

<h2 id="different approaches">Two different approaches to segments and metrics</h2>

In the Google Analytics world, we have the ability to assign segments and define metrics at the time of data collection. In the event analytics world, conversely, we have the ability to assign segments and design new metrics after the fact by computing them on the underling event data (observations) as part of the data modeling step.

This means with traditional analytics platforms, you have to know what segments and metrics you’ll need from the very beginning, and each new experiment requires new tracking of metrics and segments. We have the ability to develop custom metrics, but to do so requires writing a lot of Javascript to build out a metric for what might be only one, short test.

Event data modeling platforms, like Snowplow, however, are really well suited for running lots of experiments. When you’re recording event data, if you run an A/B test, you only have to record at least one event that a user has been assigned to a particular test group for a particular experiment. You should not need to setup any additional tracking to capture a new metric, because with the full event data set available in the data warehouse, it should be possible to compute essentially any metric, however specific, after the fact. This frees you up to push new experiments live and track them in an incredibly lightweight way.

<h2 id="event based ab testing">Event-based A/B testing in action</h2>

![Give product teams flexibility][product-team]

When you can configure your metrics after the fact, you can run more interesting experiments. Imagine a product team wants to experiment with real-time production recommendations on product pages. They would measure: click-through rate on those recommended products, differences in basket and transaction value for users in the test group, and conversion rate on product pages with recommended products show alongside them (does this make it less likely that a user will buy the original product they’re looking at).

This product team now wants to experiment with a new approach to internal search. They want to know if more people are buying because fewer drop out of the process because they can’t find what item they want, and if improved search capacity would shorten the buying journey because the user finds the item faster. To answer these questions, the product team can compare what percentage of users who search go on to buy a product between the control and test groups and the time taken to buy after performing a search. In both of these cases, these metrics might not have been reported prior to the experiment being run. But, with event-level data, all of the relevant information is already present, in the data warehouse, just waiting to be modeled in new and exciting ways.


<h2 id="make ab testing easier">Make A/B testing easier</h2>

Because they make recording A/B tests so easy, event analytics systems are very often used to measure A/B tests, even while a dedicated A/B testing system might be employed to assign users to test groups and delivery the test. This was one of the interesting observations at Snowplow: all of our users are measuring their A/B tests in Snowplow even while running tools like Optimizely or home-built tools. The combination of being able to easily track ongoing experiments and flexibly compute metrics on the fly means that, as your experiments become more sophisticated along with your product, an event analytics system like Snowplow can evolve and scale just as rapidly.




[product1]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[product2]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[product3]: https://snowplowanalytics.com/blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/

[product4]: https://snowplowanalytics.com/blog/2018/02/09/the-product-analyst-toolkit/

[product5]: https://snowplowanalytics.com/blog/2018/02/23/creative-experiments-and-ab-tests-produce-the-best-results/

[product6]: https://snowplowanalytics.com/blog/2018/04/27/getting-the-most-out-of-product-analytics-with-intelligent-questions/

[product8]: https://snowplowanalytics.com/blog/2018/06/01/the-right-data-infrastructure-to-support-successful-squads/

[measure]: /assets/img/blog/2018/05/measure.jpg

[product-team]: /assets/img/blog/2018/05/test-design.jpg

[top-companies]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[facebook]: https://code.facebook.com/posts/187489991429453/building-and-testing-at-facebook/
