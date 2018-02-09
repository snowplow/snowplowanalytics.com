---
layout: post
title: "The product analyst toolkit"
title-short: Snowplow product analytics part four
tags: [analytics, product analytics, digital products]
author: Anthony
category: Analytics
permalink: /blog/2018/02/09/the-product-analyst-toolkit/
---

*Part four of our series on product analytics. Read: [Part 1][product1], [Part 2][product2], [Part 3][product3]*

---

![Use a variety of tools to get the job done][tools]


In [our previous post][product3] on product analytics, Yali discussed the product development process and how data plays a crucial role at each step. While Yali’s post was focused on the processes and people necessary for building a highly effective product team, here we want to explore some of the tools that those teams use to achieve their goals. Whether you’re part of a product division with dozens of members or a product team of three, there are many tools out there to amplify your ability to collect data on and analyze your product: the focus of this post is on listing those tools and explaining where in the product development process they can play a role.

Though it might be tempting to believe a vendor that offers a one-size-fits-all solution, given the many roles that data plays in the product development process, the reality is that there’s no one tool that can be used to solve every analytics problem. A good product analyst is aware of the variety of options and has the wisdom to know when to employ each one. We’re interested in which of the different stages identified in the previous post is a technique useful, how is the technique used in new compared to mature products, and what kind of questions or insights come from the technique along with examples.

1. [Cohort analysis](#cohort analysis)
2. [Retention analysis](#retention analysis)
3. [A/B testing](#a/b testing)
4. [Heat mapping](#heat mapping)
5. [Session replay](#session replay)
6. [Funnel analysis](#funnel analysis)
7. [User survey](#user survey)
8. [Form analysis](#form analysis)

<h2 id="cohort analysis">1. Cohort Analysis:</h2>
**Example solutions:** Mixpanel, Google Analytics, most vendors  
Cohort analysis, one of the hallmarks of product analytics, is a longitudinal study: it compares two or more user groups over a period of time. It is instructive to compare it with time series analysis, while a time series analysis of a particular metric (such as retention) might show that the metric is improving over time, a cohort analysis might show that over time new users acquired are more likely to retain than old users, for example. It gives a more precise answer to specific questions because you’re controlling for the changing composition of your userbase. Cohort analysis is typically used in early stage startups or early in a product’s life to identify product-market. Early cohorts won’t retain in the product until that fit has been achieved. Cohort analysis continues to be valuable as products mature. Any A/B tests run on the product are a form of cohort analysis, with the control group and the test group being two cohorts.


<h2 id="retention analysis">2. Retention analysis:</h2>
**Example solutions:** Segment, Amplitude  
Retention analysis looks closely at how long your customers are staying engaged with your product and can help you understand what percentage of your users come back after signing up or downloading your product. This kind of data is essential for building an accurate customer lifecycle model and determine what factors are keeping people engaged. This is important in particular for any type of subscription business, ad revenue, or virtual goods businesses where customer lifetime value is a function of the length of time a user engages with a product. Retention is fundamentally a metric: retention rates are often compared across different cohorts of users. Typically, retention curves are modeled so that given a particular one, two, or seven day retention rate, 30, 60, or 90 day retention rates can be predicted with a reasonable level of accuracy.


<h2 id="a/b testing">3. A/B Testing:</h2>
**Example solutions:** Optimizely, Maxmyzer  
This is the most important analysis technique available for product teams and one [heavily relied upon by the most successful companies][product2]. The potential benefits of A/B testing are nearly limitless. From small tweaks in the user interface to massive changes to core features, A/B tests, sometimes called split tests, allow product analysts to scrutinize the effectiveness of every little detail of a product with the ultimate goal of creating a user experience optimized for growth. A/B testing provides a formal mechanism for measuring if any given update or change to a product succeeds in generating a desired effect. Each new release and update, then, must be rigorously A/B tested to ensure its quality and impact. Early on in a product’s life A/B testing will help you rapidly iterate towards product-market fit: using A/B testing, you can gather quantitative evidence of the effectiveness of different features and how your users respond by measuring things like time engaged and retention. As a product matures, A/B testing is instrumental in keeping it competitive and relevant as new features that change along with user sentiment are piloted and rolled out.


<h2 id="heat mapping">4. Heat mapping:</h2>
**Example solutions:** Decibel Insight, Hotjar  
Examining a heat map is one of the most powerful ways for your product team to see exactly what the most popular and commonly used features or buttons are within your product. A digital heat map is a visual representation of where certain events take place within a defined area: for example, where the most clicks occur on your website’s homepage. Heat mapping is one way of visualizing how groups of people engage with individual pages or features in an application or website, showing you where your users spend most of their time. This kind of data is especially valuable in the first stage of the product development process when you’re generating ideas. Looking at heat maps is a great way to develop hypotheses: it’s a type of analysis that can turn up surprising insights, such as finding that a region of a page you don’t think is interesting actually captures a disproportionate amount of user attention or that users are struggling with a particular part of a workflow because their attention is being directed to the wrong part of the screen. There are some limitations, however. In single page apps or websites where there are a low number of options, heat maps are not as revealing.


<h2 id="session replay">5. Session replay:</h2>
**Example solutions:** Decibel Insight, Hotjar  
A session replay is a reconstruction of one user’s entire engagement section from loading an app or website to closing it or navigating away. Session replays are particularly useful for discovering how users engage with your product. This type of macro level, open ended question can be difficult to answer using only graphs and charts. Using session replays can help you see your app directly from a user perspective, confirming or refuting what you believe about how they interact with different features. This type of analysis can be particularly revealing in that you can often discover your users engaging with your product in ways you hadn’t counted on, revealing potentially new avenues for development. When analyzing session replays, it’s important to note that it’s possible to uncover unique edge cases that don’t apply to your wider audience and sometimes it can be difficult to discern between surprising insight and bizarre behavior.


<h2 id="funnel analysis">6. Funnel analysis</h2>
**Example solutions:** Mixpanel, Amplitude  
Funnel analysis is one of the standard tools for product analysts. This analysis can inspire a robust set of actionable insights, from identifying conversion areas that aren’t functioning properly to finding new ways to acquire new users and fill the top of your funnel. Sometimes, just the act of conducting a funnel analysis can help reveal any discrepancies between what you believe your funnel to be, and the steps and stages your users actually follow in their journey using your product. Being aware of the health of your funnel is useful, especially in conjunction with something like cohort analysis or retention modeling, to project revenue and inform growth strategies.

![analyze your user funnel][funnel]

<h2 id="user survey">7. User survey</h2>
**Example solutions:** Qualtrics, Survey Monkey, Optinmonster  
Though clickstream data can tell you exactly what a user did, surveys give you the chance to find out what they were trying to do, why they took a particular action, and how they feel about what happened. Often, if you want to know more about your users, simply asking them can be very powerful. Customer surveys, through email or modal boxes on a website, can be invaluable sources of customer information that you can’t extract from traditional digital metrics. Clickstream data, for example, can’t tell you why a user is on your site or if they’re happy with their experience. Intent and motivation are powerful forces, and understanding your users’ feelings and mindset can help you improve their experiences. When using customer surveys, it’s important to take sample size into consideration as one user’s experience is not indicative of everyone’s.


<h2 id="form analysis">8. Form analysis</h2>
**Example solutions:** Hotjar, Optimizely  
Many digital products include forms such as sign-up forms, contact sheets, support forms, or even customer feedback surveys. A form analysis can help you identify if the number of form submissions you receive is unusually high, low, and how to nudge that number in a more favorable direction. While form analysis is not always necessary, many different types of forms are essential for moving customers through your funnel, and a frictionless form submission process can help improve your customer feedback look and even increase new user acquisition.


We’d love to hear about what tools you use regularly as part of your product development process- is your favorite tool on this list or did we leave it out? Let us know on the [dedicated Discourse thread][discourse] and make sure you [subscribe][subscribe] so you’ll get the latest in our product analytics series and other developments from our blog.

[product1]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[product2]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[product3]: https://snowplowanalytics.com/blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/

[tools]: /assets/img/blog/2018/02/tools.jpg

[funnel]: /assets/img/blog/2018/02/funnel-analysis.jpg

[discourse]: https://discourse.snowplowanalytics.com/t/most-commonly-used-tools-of-product-analysts/1787

[subscribe]: http://snowplowanalytics.us11.list-manage.com/subscribe?u=10bb4a6f31d5f19e0d0b54476&id=bb28c7d30d&utm_source=product%20analytics%20blogs&utm_medium=hyperlink&utm_campaign=product%20analytics&utm_content=subscription
