---
layout: post
title: "High-end customer analytics with Snowplow and Indicative"
description: Snowplow Analytics and partner Indicative build joint integration
image:
title-short: Snowplow and Indicative joint integration
tags: [analytics, partnerships, Indicative, dataviz, visualization, behavioral analytics, customer analytics]
author: Anthony
category: Integration
permalink: /blog/2018/09/20/high-end-customer-analytics-with-snowplow-and-indicative/
discourse: true
---

*This is an introduction to the Snowplow Analytics Indicative Relay. For detailed technical instructions, please see the [official developer release][technical]*

---
<br>

You've launched a new feature in your application and naturally you can’t help but wonder, “who’s using this?” You begin to wonder, what do those interactions with the new feature look like and at what point in the customer journey do they take place? Are people even using it in the way you anticipated when it was designed? We've all been there.

As analysts of all kinds of data, we have access to so much information about how people engage with us, from our advertising to our websites and digital products. Event level data, being so rich and granular, is particularly well suited to describing these engagements in great detail and helping us piece together how these different data sources tell a singular story. However, the greater the detail, the more complicated the data becomes, and we need a great deal of detail to answer important questions like ‘are people who engage with this feature more likely to be successful?’ and if so, how?

<h2 id="data driven decision making">Event-data driven decision making</h2>

To understand the user journey as a whole using event data effectively means analyzing the series and sequence of events that make up an individual’s journey and then aggregating over multiple user journeys to spot similarities and differences. This can help you build insight into those journeys and identify where they’re successful, where they’re not, and what went wrong. However, aggregating individual events into something that’s easily digestible and accurately describes different user experiences is convoluted; statistical functions and SQL commands have not been developed to understand sequences of events and draw meaning out of them.

As a result, the most actionable insights remain buried deep within the data, largely inaccessible without the complicated SQL necessary to make sense of event data in the SQL-based data warehouses powering most BI tools. Traditional business intelligence tools and SQL grew up around simple tables of data, and statistics gives us a wide set of functions to understand this data. But with event data, to see how it describes complex behaviors in great detail, we need to look at sequences of events and aggregate them with other sequences to see a bigger picture which enables us to look for patterns and find insights. Think of your customers and how unique and varied their journeys with your brand are: how would you represent that in a BI tool? Event data is a different, powerful kind of data.

<h2 id="be empowered by data">Be empowered by data, not burdened</h2>

Typically, in order to explore data to the depth necessary to drive the greatest impact, the most successful Snowplow users have substantial SQL expertise and invest significant amounts of time into modeling their data to make it easy for users throughout their company to consume with their BI tool of choice.

This creates friction in socializing the data around the company and means that certain types of user journey analysis can only be performed by (or with) the people in the data team that have the relevant SQL expertise. End users of the BI tool are left only able slice or dice the metrics and dimensions that are output from the model, they cannot create their own. Indicative has been built to solve this problem.

<h2 id="customer analytics tool">Built from the ground up for customer analytics</h2>

Indicative takes [a new and different approach][partnership] to data analysis than what’s been previously used by BI tools built on tabular data and SQL data warehouses. The Indicative platform stores data in a proprietary database optimized for user journey analytics and provides an intuitive interface that makes it easy for any product manager or marketer to explore user journeys by simply dragging and dropping.

Since we initially [announced our partnership][snowplow-partnership], the number of Snowplow users who have adopted Indicative has grown, and we have seen how powerful the combination of rich Snowplow data with Indicative’s analysis UI can be. We wanted to enable more of our users to benefit from Indicative’s technology and so jumped at the opportunity to build a one click integration with Indicative.

*Using event data in a traditional analytics tool is a lot like Morse code: the dots and dashes are all laid out in nice, neat rows that take time to read but ultimately describe something. But, when you take event data and analyze and visualize it in a way that’s optimized to handle its unique richness, the results are very different.*

![morse code vs pointillism][morse]

With Indicative, you can take detailed, highly structured Snowplow data and quickly build funnels to visualize that data to explore and make sense of the customer journeys you want to understand better. This makes it possible to build significantly more complex graphs than are supported by traditional funnel analytics tools.

<h2 id="answer questions with data">Find answers easily with Snowplow and Indicative</h2>

Often we find that the best analyses start with the most interesting questions. Subsequently, those questions often arise when you democratize data and put it in the hands of as many people as possible, specifically the product managers driving product development and the marketing managers coordinating advertising budgets. As the people who work with the product features and marketing channels that you’re analyzing every day, they are best equipped to ask meaningful, insightful questions.

We're enormously excited about enabling Snowplow users to analyze their data with Indicative because it empowers end users, particularly marketing and product managers, the ability to ask any questions directly of their highly descriptive Snowplow data.

Analyzing Snowplow data with Indicative lets product managers explore complicated questions about their users’ behavior to discover answers they’ve always searched for but could not accurately represent, all unbridled by their level of SQL expertise. Product managers can uncover:

* Which of our users have tried the new feature?
* How have users engaged with the new feature?
* At what stage in their journey do they start with the new feature?
* How long do they spend working with the new feature?
* How many of them used it to actually accomplish something?
* Are there any differences in characteristics between the users who tried the feature and those who did not?
* Are there differences in the behavior of users who have engaged with the new feature, with those who have not, down the line?
* If so - what are those differences? When do they start to emerge?

Indicative is also well suited to exploring Snowplow data from marketing channels and answering the questions that marketing managers need to effectively lead their teams:

* What is the user journey from first touch through to first purchase or sign up?
* How many marketing campaigns does a user engage with prior to sign up?
* What does the user behavior look like subsequent to each touch? Can we start to identify a user's propensity to buy, at different points in the buying cycle? Can we use that understanding to attribute value to each marketing touch, and use that to calculate a return on marketing spend?

<h2 id="effective use of data">Optimize your data stack for success</h2>

At Snowplow we believe that event data is one of the most valuable, interesting, and important data sets any company can collect. There is an enormous amount that can be done with this data. We shouldn’t be surprised, then, that to make the most out of event data, there are multiple types of tools that companies need to work to build maximum insight. Four really important categories are:

**BI tools:** *Looker, ChartIO, Tableau, Redash, Medabase, Superset*
<br>
As we’ve described above, BI tools are poorly suited to give marketers and product managers the ability to answer open ended questions about customer journeys. However, they are great tools for a host of more traditional analytics (that can also be performed on event data), for example reporting on the number of visitors to your website or app broken out by user type and session intent.

**Customer journey analytics tools:** *Indicative, Amplitude, Mixpanel*
<br>
These are built very specifically to support people performing user journey analysis without technical experience. These tools let end users easily build conversion funnels, for example. This is a really important category of analytics tool for product managers and marketers working with event data because so many interesting questions in product and marketing analytics can be illuminated through exploring customer journeys. In this category, Indicative is our standout favorite because of the power it provides end users to do complicated analysis through a very simple drag and drop interface.

**Data science tools:** *R, Python, Spark*
<br>
Data science tools have a multitude of use cases. Across our customer base we find them used particularly for predictive analytics such as calculating the expected customer lifetime value; the likelihood to churn; or which product or service, content or ad a user is most likely to find interesting. They can be used to identify important characteristics or events in a user journey that, if they occur, make it more likely that other high value events (like sales) will occur later on.

**A/B testing tools:** *Conductrics, Optimizely, Wasabi*
<br>
Event data by itself only describes the world as it is. By running experiments, like testing different product updates and marketing campaigns, companies can create the conditions in which they can rigorously measure the impact those product updates or marketing campaigns have on customer acquisition.

<h2 id="get started">Get started with Snowplow and Indicative</h2>

Snowplow Growth and Enterprise Insights customers who want to see how powerful Indicative is for themselves can easily set up the integration by [creating a free Indicative account][indicative-landing] then following our [setup guide][snowplow-doc].

If you’re new to Snowplow and Indicative and would like to better understand how both technologies work together to provide you with unparalleled control and flexibility to work with your event data, [get in touch][demo] to see the integration in action.

Open source users: please follow the instructions [here][docs].

---
*Make sure you [read Indicative's announcement][indicative-announcement] about using Snowplow with Indicative to power real-time analytics*


[technical]: https://snowplowanalytics.com/blog/2018/08/01/snowplow-indicative-relay-released/

[partnership]: https://www.indicative.com/blog/insight-data-science-snowplow-analytics-indicative-partnership/?utm_source=partners&utm_medium=snowplow&utm_campaign=partnershipannouncement

[snowplow-partnership]: https://snowplowanalytics.com/blog/2018/03/22/analyzing-behavioral-data-with-indicative-and-snowplow/

[morse]: /assets/img/blog/2018/09/morse-code-pointillism.jpg

[indicative-landing]: https://www.indicative.com/snowplow?utm_source=partners&utm_medium=snowplow&utm_campaign=integration

[snowplow-doc]: https://docs.snowplowanalytics.com/snowplow-insights/setup/indicative-integration-overview/

[demo]: https://snowplowanalytics.com/request-demo/?utm_source=snp-blog&utm_medium=demo-link&utm_content=snowplow-indicative-relay

[docs]: https://support.indicative.com/hc/en-us/articles/360015380991

[indicative-announcement]: https://www.indicative.com/blog/real-time-data-analysis-efficient-business/?utm_source=partners&utm_medium=snowplow&utm_campaign=relayannouncement
