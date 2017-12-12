---
layout: post
title: "Making your Data Work for you"
title-short: Better Data
tags: [data analytics, data management]
author: Anthony
category: Other
permalink: /blog/2017/11/08/making-your-data-work-for-you/
description: "Better Data leads to Better Decisions"
---

![user-journey][journey]

As data collection, storage, and analytic platforms become more robust, many businesses find themselves at a precipice: make the conscious effort to become data driven, or march on as if nothing has changed. The opportunity to access more, and better, data is there for those who want to reach out and grab it, but to do it right can seem daunting, causing hesitation among decision makers within an organization. Without that buy-in from leadership, it can be difficult to orient your business processes and infrastructure to take advantage of a data-driven approach. While the decision makers might raise any number of objections, they often can be reduced to some form of one question, “Why do we need better data?”

<h2 id="The Complete Picture">The Complete Picture</h2>

Advanced analytics are so attractive because, with sophisticated data, you have the opportunity to deep questions about your users and customers across a wide range of channels and activities. This is an important point. Higher quality data means you can ask higher quality questions; if you simply equip your business with a new analytics platform and wait for the answers to come pouring in, you’re setting yourself up to be disappointed. When you start looking at data closely and investigating cause and effect across a customer’s journey, that’s when you start uncovering actionable insights. And when your data collection is advanced enough, you can create a complete picture of the customer journey from beginning to end, from channel to channel, letting you ask the really interesting questions. So let’s take a look at how you can use better data to create a better customer journey.

<h2 id="marketing">Marketing</h2>

The world of marketing is going through a renaissance revolving around analytics. Marketing professionals have access to more advanced data than ever before thanks to platforms like HubSpot, Kissmetrics, Mixpanel… the list goes on and on. If you’re already using one of those platforms or something similar, than you’ve taken the first step in owning your marketing data. The challenge then becomes how to take the data these platforms deliver and transform that into something tangible your business can use. Kissmetrics, for example, in a [blog post on email marketing][kiss] discusses open rate and click-through rate, two of the golden metrics for email performance. The post identifies these as “process metrics” and goes on to say “they shouldn’t be goals in and of themselves.” This is sound, strategic thinking.

If you use email marketing, think about your end goal. Take an eCommerce website, for example. An email marketing campaign’s ultimate goal is to drive a visitor to the website for the purpose of making a purchase. If you send an email to one hundred thousand customers and achieve a 40% open rate with a 25% click-through rate, it might feel like a successful campaign. But if the ten thousand subscribers who actually visited your site only read a blog post and ended their session without making a purchase, did you reach your goal for that campaign? Engagement is a good sign, and higher engagement often translates into higher ROI, but you can only figure that out if you identify a meaningful end goal.

In order to get an accurate calculation on the ROI of your email campaign, you need to be able to track home many of the users who clicked through the email to your website actually made a purchase. Because you have their email addresses, if you’re tracking event data, it’s a relatively straightforward process to cross reference which recipients opened your email with browsing sessions that include a purchase events. If you have a strong data pipeline set up and configured properly, your web data and your email marketing data will be joined and viewable in your BI tool. As you get more accustomed to analyzing advanced data, you can use it to plan your marketing more effectively. A better understanding of what types of email campaigns drive more purchases will let you efficiently invest resources into your marketing. As Larry Myler said in a [Forbes article from earlier this year][forbes], “The best driver of ROI from enhanced data quality is the ability to develop better marketing plans that will deliver more predictable results.”

<h2 id="web development">Web Development</h2>

Of course, no matter how effective your email marketing might be, it can all go out the window if you have an unintuitive, poorly designed website. At its core, a well designed website is easy for users to navigate from the landing page to their objective with as little friction as possible, so the fewest clicks and least amount of scrolling or searching. For SaaS companies, this usually means having clear, highly visible “Request a Demo” or “Contact Us” buttons in the main navigation. This lets potential customers complete these actions quickly and easily, regardless of which page on your website they encounter first. The challenge now becomes identifying the path of least resistance for your typical visitors.

Web analytics tools can show you data that will help you piece together what your most common site visitor paths look like. Google Analytics even has a visualization feature under “User Flow Analysis” that can give you a general idea of what are the most common journeys on your website. With this data, you can audit each of these pages to make sure:
1. There’s a clear Call to Action.
2. The next step in the user’s path is easily reachable.
3. This path is in-line with your funnel and supporting one of your business goals.

To use Kissmetrics’ term, these are process metrics. Outlining the user journeys on your website will show you how visitors get from point A to point B and is the first step towards using data to improve your website, with the next being moving beyond process metrics to understand your most profitable user journeys. Being able to join your web analytics with your CRM data will let you track how many visitors from a specific path end up becoming customers. Once a visitor signs a contract and has a complete profile within your CRM, if your data pipeline is pumping that data into a log along with your web traffic data, you can match up the customer’s CRM record with visitor history to create a complete picture of their path to purchase. Performing this analysis on your top visitor paths will show you which journeys result in visitors becoming customers at higher rates than others, allowing you to focus your efforts on improving the content and pages along that path to further drive revenue.

<h2 id="product development">Product Development</h2>

Digital analytics is closely associated with web traffic and, as they go hand-in-hand, marketing initiatives. But, as the code and software used to collect data become more advanced, it’s becoming possible to embed trackers into digital products like web and mobile applications and games. Digital products, even home console-based videogames, have shifted to being living electronic organisms as internet connectivity becomes more ubiquitous. This represents a huge opportunity for product managers, as you are no longer forced to reactively collect and compile user feedback with the hope of using it to improve your next product. Integrating analytic tracking into your digital products lets you adjust proactively, updating your product according to empirical user data and improving the user experience along with it.

Mike Nemirovsky, Product Manager for Snowplow Insights, had this to say:
>“As the first product manager for Snowplow Insights, everything we are building is brand new. This "unchartered territory" will absolutely require the use of data to help steer our roadmap in the direction of delivering a useful product to our users. Of course drinking our own Kool-aid is on the cards.
The fact that there are so many unknowns when it comes to building and releasing new features, a pre-defined data schema just wouldn't work well for us. We need to be able to have our data schema iterate along side our product. As it grows, the need for new data in new contexts will grow with it.”

As Mike explains, in order to use data to effectively understand what product features motive your users, retain them, and turn them into evangelists, your data collection needs to be specific and unique to your product. Understanding key metrics, like depth of use or efficiency, is at its most potent when those metrics are based on data specific to each product. Once you have those metrics benchmarked, along with others, ongoing monitoring will help you identify strategic areas for improvement such as any pain points your users encounter or your most popular features.

Combining this usage data with your marketing and web traffic data will give you a truly complete picture of your customer’s lifetime journey letting you map out the first touchpoint through their usage of your product and can even shed some light on what turns off the customers you lose. There are a great many analytic tools and platforms out there that will help you improve core business units, but in the search for better data, event data-based platforms that can efficiently combine your various data sources and give you a holistic understanding of your digital performance will be key in unlocking better data.

If you have any questions or want to discuss how you can better use data to drive you business, visit [our Discourse forum][discourse].


[kiss]: https://blog.kissmetrics.com/win-at-email-marketing/ "Using Marketing Analytics to Win at Email Marketing"

[forbes]: https://www.forbes.com/sites/larrymyler/2017/07/11/better-data-quality-equals-higher-marketing-roi/#74ed96517b68 "Better Data Quality Equals Higher Marketing ROI"

[journey]: /assets/img/blog/2017/11/user_journey.jpg

[discourse]: http://discourse.snowplowanalytics.com/ "Discourse"
