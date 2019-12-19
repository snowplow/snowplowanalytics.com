---
layout: post
title: "How we Snowplow at Snowplow"
title-short: Snowplow at Snowplow
tags: [snowplow, data analytics, data management]
author: Anthony
category: Inside the plow
permalink: /blog/2017/10/18/how-we-snowplow-at-snowplow/
description: "How we use Snowplow data here at Snowplow Analytics"
---

In [a blog post by co-founder Alex Dean][alex-blog], he said, “Ensuring that the data is high fidelity is essential to ensuring that any operational and strategic decision making that’s made on the basis of that data is sound.”  This concept of high fidelity data is a core component of the Snowplow philosophy; storing granular, event-level data ensures that the resulting internal database is full of deep, rich information that can be sliced and diced in hundreds of different ways.

Collection, however, is only half of the equation. Like any tool, even the most sophisticated data collection and reporting is only truly effective when it’s solving the right problem. Because Snowplow data has such a high degree of fidelity, it enables us to view it from whichever angle is necessary, making it ideally suited for informing strategic decisions across all of the Snowplow Analytics teams.

While many of our users use the data from our platform for marketing and digital product development decisions, at Snowplow, thanks to the efforts of our engineering and development teams, we’re able to do so much more. We believe in the unified log approach, and as more organizations shift to become highly sophisticated in their use of data we thought it would be a good idea to show how we use our data to inform cross-functional decision making here at Snowplow.


<h2 id="analytics and services">Analytics and Services Teams</h2>

The Analytics and Services teams are responsible for ensuring the success and pipeline integrity of our clients. Analytics and Services team members will onboard new clients, working closely with the engineers and analysts on the client’s team to implement our trackers that feed the data pipeline and identify the business problems our clients are looking to solve and how that can be accomplished using Snowplow data.

Because the Analytics and Services teams work with clients from implementation through execution, our support engineers and data analysts possess a deep mastery of the Snowplow platform and its many components. Members of the Analytics and Services teams are like cartographers, using their wide berth of knowledge about Snowplow data and a client’s objectives to chart a course forward. Every day, they work with our clients to use Snowplow data to create new models or glean new insight from business intelligence tools.


<h2 id="tech ops">Technical Operations</h2>

Our Technical Operations team manages the development and improvement of the infrastructure required to maintain the Snowplow platform, both internally and for our clients. Our business focuses on setting up and running Snowplow for our clients, an ultimately technically challenging process; there are very few companies that exist which are responsible for overseeing many data pipelines in many different client cloud computing accounts.

We believe that the data generated belongs to our clients, and therefore should be served with a 0% loss rate. To do this, with maximum data integrity, requires extremely good monitoring capabilities so our systems and operations teams have constant visibility on exactly what is running and where. We accomplish this with Snowplow, naturally. Because the data belongs to our clients, it remains within their own cloud environment and never leaves. The applications themselves, that comprise the Snowplow pipeline we configure for our clients, emit ‘events’ that describe the current state and performance of the pipelines. These events and metadata are fed into our own Snowplow pipeline, referred to as “Spine,” which acts as the central nervous system for our business and allows us to build a global view of the health of all our client infrastructure.

On top of monitoring pipeline health, we run a set of microservices that compute on client metadata and autoscale our client pipelines so they can effectively handle fluctuations in traffic. These autoscaling algorithms are also powered by Snowplow data: as client Snowplow subsystems transmit data to our internal Spine, we compute the latency of data being processed at each stage of the real-time pipeline. We can then scale these pipelines up, with appropriate Kinesis streams and associated applications processing the data, to reduce that latency ensuring not only that we deliver 100% of our client’s data, but that we do it fast.


![latency-monitoring][latency]


<h2 id="product development">Product Development</h2>

Our Product team is responsible for the continued upgrading of the Snowplow suite of products, including Insights and our open source platform [Iglu][iglu], as well as working on new tools and features for future releases like [Sauna][sauna]. Taking advantage of visualizations of our real-time and batch pipelines, the Product team continually monitors usage of Snowplow software to ensure functionality meets client needs. The Product team collects usage data along with feedback from the Analytics and Services teams in order to identify areas of necessary improvement or bugs that require fixing in upcoming software updates.

The Product team uses our in-app tracking code and associated microservices to best understand how clients are engaging with Snowplow tools to ensure the platform can best deliver the data our clients expect. As organizations become more sophisticated in their understanding and usage of data, the needs of our clients shift and the Product team’s goal is to align our software with those needs. And, by integrating Snowplow code into client scripts, the Product team was able to build the visualizations that we rely on to monitor the health of our data pipeline as well as serving as a demonstrable example of Snowplow in action.


<h2 id="future">Marketing and Sales</h2>

One of the most common ways for our clients to use Snowplow data is in driving marketing decisions, and we’re very similar to them in that regard; Snowplow’s rich, granular data and flexible tracker implementations allow for hyper-specific analysis of our website visitors’ journey from entry to exit. On the Marketing team, we’re able to take the enriched data from our pipeline and use it to determine with high clarity how visitors are engaging with our website, including page views per session, time spent on page, and even examine conversion rates and lead generation. This level of insight helps us organize our website to support the various users who are visiting, ensuring they can reach their goal with as little friction as possible and maximizing our chances for conversions.

By breaking down our traffic data on our blog, for example, we chart engagement around specific topic categories to inform our marketing messaging. We look closely at this data to understand what content our audience is viewing the most and determine how long they spend reaching each piece of content with the resulting data used to strategically plan our content publishing. The Marketing team also directly supports Sales, using Snowplow data to provide Sales with highly detailed lead qualification with the full event stream for any lead, containing each point of contact and engagement between Snowplow and the user, giving Sales a comprehensive view of the individual before starting a conversation.


<h2 id="leadership">Leadership</h2>

Because Snowplow delivers such rich event data, it’s ideal for reporting on dozens of metrics. Our data scientists feed Snowplow data into Redash, where they’ve constructed custom dashboards based on their models. The high-fidelity data Snowplow delivers enables us to get a clear picture of our customers, both who they are and what they want. The diversity of the information contained within the Snowplow data log is widely applicable across many business units, each one with unique reporting and querying needs.

With each team reporting different KPI’s and supporting statistics, the fact that each metric is tracked from the same log means that our leadership has a holistic view of cross-functional business development data, data that can be accurately queried further to more deeply analyze any given metric or answer questions. By clearly defining our business goals and challenges, our data scientists have modeled our Snowplow data to deliver actionable reports to our leadership. We take a garbage in = garbage out approach to strategically using data: using poor data will result in poor decision making, so we only use the best data.

If you have any questions or want to discuss how we use Snowplow data further, please visit [our Discourse forum][discourse].



[alex-blog]: https://snowplowanalytics.com/blog/2013/04/10/snowplow-event-validation/ "Towards high-fidelity web analytics"

[iglu]: https://github.com/snowplow/iglu "Iglu"

[sauna]: https://snowplowanalytics.com/blog/2016/09/22/introducing-sauna-a-decisioning-and-response-platform/ "Introducing Sauna"

[discourse]: http://discourse.snowplowanalytics.com/ "Discourse"

[latency]: /assets/img/blog/2017/10/latency.png
