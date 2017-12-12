---
layout: post
title: "The importance of face-to-face for remote teams"
title-short: Face to face
tags: [company culture, management]
author: Anthony
category: Inside the Plow
permalink: /blog/2017/12/11/the-importance-of-face-to-face-for-remote-teams/
description: "The role of team retreats for distributed companies"
---

![prague-scene][prague]

Tucked away in a labyrinthian apartment building above a cafe in Prague, the Snowplow Analytics team met to reflect on the past year and turn our eyes to the future. We are a global team, distributed around the world, and during Away Week we come together to see old friends, greet new team members, and work together to help keep Snowplow Analytics evolving. We had team members come from the United Kingdom, France, Germany, Russia, Ukraine, Portugal, Ireland and, for the first time, the United States, all determined to turn our collective skills and abilities towards Snowplow’s success. These Away Weeks present a unique opportunity to combine our skillsets and get a shared perspective on the challenges we face as a company. Our last Away Week, for example, resulted in the release of our support for Kafka.

<h2 id="culture heroes">Culture Heroes</h2>

Learning, and professional growth, were recurring themes throughout our culture conversations. Snowplow Analytics team members have incredibly diverse backgrounds, which you can read about in depth in the Team section of our company page, giving each of us a distinctive frame of mind for problem solving and insight on our daily activities. Being able to learn from such a varied group not only enhances us as individuals, but allows the sum of us to be greater than the individual parts. This Away Week was a unique experience for team members old and new: in the time that elapsed since our previous away week, the Snowplow team nearly doubled in size and, thanks in large part to our new Office Manager Nicki, we were much more organized.

During the culture sessions, team members had the chance to talk about what's important to them about our company culture. These conversations were important because, as our team is distributed across many geographies and time zones, maintaining a cohesive culture can be challenging. While everyone's Snowplow experience is unique, there were common threads in love of learning, a thirst for problem solving, and commitment to enabling our users to do more with their data. As co-founder Yali Sassoon would say, "There's a strong streak of data and technology optimism that runs through the company and is one of the many things that motivate our team." We believe whole heartedly in the ability of data to help individuals and businesses make better decisions, and each team member is dedicated to helping our users unlock that potential. As the culture sessions continued, the team collectively highlighted the autonomy each team member has as a significant factor in what empowers us to do our best work for our users. As part of the Snowplow team, you have the freedom and space to innovate including making mistakes (when necessary).

![team-photo][team]

<h2 id="hackathon">Hackathon</h2>

Mid-week, we undertook the traditional Snowplow Away Week Hackathon: an entire day of meticulous planning, programming, strategizing, and building around some of Snowplow’s most unique and under-investigated challenges and questions on how our products work. Five teams spent their time tackling knowledge sharing, company messaging, web development, internal data collection, and data modeling. As the teams presented the fruits of their labors over pizza that evening, it was obvious that these ideas, despite being in their early stages, would be significant improvements for Snowplow and there have already been discussions about various implementations.

One core reason we’re able to be a valuable resource for our users is our understanding of the challenges they’re facing, and we’ve taken steps to more comprehensively understand the process and benefits of A/B testing. Knowing that A/B testing is a high priority for many of our users, and having come across positive feedback for [Wasabi][wasabi], an open source testing platform by Intuit, one of our hackathon teams focused on setting up and integrating a Wasabi instance, allowing us to configure a wide range of experiments for our website and products. Given the success of this test, we’re even exploring offering Wasabi as a tool for our users, letting them quickly and seamlessly test hypotheses about their website or product and collect data with their Snowplow pipeline.

The Snowplow user experience was top of mind for our hackathon teams. Beyond A/B testing, we also had a team focused on data modeling. The data modeling step of the digital analytic process can often be the most challenging, with access to so much data often making it difficult to know what questions to ask to get started. Data modeling is also a key step in the Snowplow data pipeline: it is where "meaning" is effectively layered onto the underlying event data which then makes that data meaningful and actionable around the business. Given how critical this step is, it is a real pain point today that the data modeling process effectively lives in SQL. During the hackathon, this team attempted to develop three alternatives to the SQL-based approach: building a data modeling DSL from scratch, building a data modeling process in a graph database using [Neo4j][neo], and building a data modeling process in PySpark. You can look forward to further information about a more streamlined, user friendly data modeling process in a future post. To further empower our users, another team set about creating what they called Snowplow Wire. Using Wire, we turned our analytic capabilities inward on our pipeline, allowing us to collect brand new data on the health and performance of the pipelines we manage as well as how to socialize this metadata to our users so they can benefit from it as well.

![team-hackathon][hackathon]

<h2 id="today here tomorrow the world">Today here, tomorrow the world</h2>

Away Week provided an opportunity to get people across our different teams to put our heads together around security. Data security is something that our whole team at Snowplow is concerned with, and we were able to war game together with a view to identifying new vulnerabilities and approaches to guard against them. We played our every scenario we could imagine, from the mundane to the wildly outlandish. While our Tech Ops team has already protected us against the majority of these cases, as an exercise it helped us identify and plan for potential challenges we would have otherwise not considered. The integrity of our users’ data is our number one priority, and time spent planning for any possible threat scenario is time well spent.

We are very fortunate to work for a company that values openness and transparency, especially in regards to strategy for the future. Though we covered many topics in our discussions, plans for the upcoming year were a constant undercurrent. By collaborating on annual goals, projects, and plans for 2018, we were able to engage individuals across teams to identify the necessary cooperative steps to reach our goals. No person or team at Snowplow operates in isolation, and this was reinforced by everyone’s willingness to support each team’s goals and readiness to volunteer to help them reach success.

While we’ll be making more detailed announcements in the future, we can share some of our priorities for the upcoming year:
+ Make our core data collection product easier to use
+ Expand multi-cloud offering including supporting Google Cloud Platform and Azure
+ Generate high quality, educational content geared towards marketers and product managers in particular
+ Improve support to our global community through conference attendance and Snowplow Meetups

Make sure you subscribe to our email list at the bottom of the page and stay tuned to [social media][twitter] to stay in the loop as we roll out the plans and features that came out of away week including updates to the Snowplow Analytics platform along with developments from our hackathon. And, as always, we'd love to discuss the ideas in this post further with you on [Discourse.][discourse]



[twitter]: https://twitter.com/snowplowdata

[prague]: /assets/img/blog/2017/12/prague.JPG

[team]: /assets/img/blog/2017/12/the-team.JPG

[hackathon]: /assets/img/blog/2017/12/hackathon.jpg

[wasabi]: https://github.com/intuit/wasabi

[discourse]: http://discourse.snowplowanalytics.com/

[neo]: https://neo4j.com/
