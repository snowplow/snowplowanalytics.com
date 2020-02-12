---
layout: post
title-short: Mapping the customer journey with complete-picture data
title: "Mapping the customer journey with complete-picture data"
description: "Finally, travel companies can get an accurate view of the end-to-end customer journey by joining multiple data sources, letting them get closer to the single customer view."
author: Erika
category: User stories
permalink: /blog/2019/08/29/mapping-the-customer-journey-with-complete-picture-data/
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Mapping_Customer_Journey.jpg
thumbnail-image: /assets/img/blog/featured/Thumb-Customer-Touchpoint.png
---


With data unification - the ability to join multiple data sources and get a full-picture view - travel companies are harnessing the power of understanding their customer journey at a more granular level, finally tapping into insight untethered from previously siloed sources. This creates conditions for “[hyper-relevance](https://www.accenture.com/se-en/insights/travel/hyper-relevance-in-travel)” as a differentiator in a crowded travel market dominated by big, household names. Data joined together from across the customer journey - whether from web and mobile, from booking data, from the CRM or phone call data - paints a fuller picture, which informs how companies tailor dynamic personal experiences for consumers. 

In large part, the way online travel companies have continuously enhanced their understanding of the customer through adding more, fresher and real-time data to the picture has fostered the consumer perception that online travel agencies (OTAs) provide a more relevant experience for them than traditional travel companies. OTAs constantly adapt to meet individual consumers where they are  - or want to be - by tapping into cross-device, cross-platform, multi-channel, past and present data. Historically, collecting and joining data from these disparate sources has been difficult, but it is essential to: understanding the customer journey; delivering real-time hyper-relevance and, perhaps most importantly, being able to develop - or get closer to - a single customer view.


## How to get to hyper-relevance in the travel segment


### Dig into multi-channel, cross-device data to identify your customer

The complete customer journey comes together more clearly the more data a company can collect and stitch together. Ideally, this multi-channel, cross-device granularity would lead to the holy grail of insight for virtually any kind of e-commerce retailer - the single customer view. But getting there can be incremental and largely predicated upon mapping out a very clear customer journey in detail first. Different companies, particularly in the fast-moving travel startup arena, are working toward that pinnacle, adding more pieces of data as their level of data management and analytics sophistication grows. In doing so, they build out a step-by-step picture of the customer journey, making use of the data they are able to collect, join and analyze. Given the unique challenges of the travel industry, such as market fragmentation and fierce competition, identifying the single customer view (SCV) would be the ideal, but piecing together on and offline and multi-channel data is a start. Being able to answer questions about how prospective customers discover your site or apps and what actions they take once they get there helps you tap into the [data you need](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-1-what-data-do-I-track/) to build the foundational information: the customer journey. This gets you a step closer to the SCV and helps you influence the customer experience. 

Travel start-up Tripaneer echoed this thinking recently in sharing their Snowplow story: “If you want to do multi-channel marketing well you have to understand how these different channels interact with the customer in their research and purchase journey.” For Tripaneer, Snowplow enabled a cross-device, chronological event log per customer that helped them to develop a deep understanding of the end-to-end customer journey for building customer relationships. This is not dissimilar to what others in the travel sector gain, as data helps unlock the end-to-end journey, illustrating several key discoveries, such as: 



*   Real attribution - precision campaign metrics and results attributable to specific channels and efforts, ROI and insight into where best to allocate resources, guide marketing strategy and optimize content
*   Customer lifetime value
*   Key data for creating hyper-personalized experiences 
*   Insight into customer intent and other predictive measures to drive future customer interactions and business decisions - from what functionality to add to the platform or apps to how products should develop



 {% include shortcodes/ebook.html background_class="tripaneer-casestudy" layout="blog" title="Tripaneer case study" description="How Tripaneer uses their event-level data to map their multi-channel customer journey" btnText="Download case study" link="https://snowplowanalytics.com/customers/tripaneer/" %}





### Time travel through data: Stitching multi-channel data from past and present delivers a complete picture

A true single customer view would include not only multi-channel, multi-device, on and offline data, including from your website and apps, but also from your CRM, e-mail, booking data, phone system, and so on. Many companies in the travel sector rely on these non-web and offline channels for major parts of their sales cycle, including the final booking. They are thus essential to creating a single customer view. That said, many of the online and multi-channel data basics pose challenges enough without adding external sources immediately. 

One way in which many travel companies run into barriers is when they capture data from many different sources and devices, but it only moves forward in time. This effectively excludes a big part of the customer journey, obscuring event data that was captured before the user was identified. 

Customers - and indeed their journeys - jump all over the map in that they hop from one device to another, sometimes going directly to your site or app, sometimes finding your site again through search, sometimes clicking on ads - but you don’t know that a single individual can be traced back to all those interactions unless you have a way to log historical data and stitch that together with present data, marrying up previously anonymous events with identifiable events once a customer and their devices are known to you. This historical view is necessary to getting the complete customer picture. Otherwise, a lot of rich data about a customer ends up going unidentified, obscuring the full customer journey. 

Tripaneer experienced this disconnect, and getting Snowplow and the data quality it provides gave them the ability to dive much deeper into the customer journey. With historical logs, Tripaneer could revisit and recompute historical data with current identifying data. That is, a user could have visited the Tripaneer site several different times over the course of many days. At some point, they might sign up for an account. Then after a couple of weeks using the website on desktop, the user goes mobile and logs in, continuing to use Tripaneer across devices. Suddenly, Tripaneer has a rich tapestry of web and mobile events to stitch together and match up because they now know that these events were triggered by the same individual. And that changes the landscape, influencing what Tripaneer - or indeed any travel company with this new insight - [can do](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/).


### How Snowplow can help you see the full end-to-end customer journey (and eventually the single customer view)

Even for data teams just getting started, Snowplow offers [all the relevant pieces](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/) to help you deliver hyper-relevance to your users. As you develop, the Snowplow solution [adapts to your growth](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-4-what-can-we-do-with-data-when-were-growing/) and need for more sophisticated [data modeling and predictive analytics](https://snowplowanalytics.com/blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/).

What makes Snowplow ideal for helping you visualize your entire customer journey and eventually derive your single customer view in addition to more complex data analytics use cases? In the words of many Snowplow customers:



*   **Granularity and completeness of first-party data collection** - Unlimited numbers of events and entities can be captured, enabling more accurate attribution and accurate conversion tracking, thanks to first-party and server-side tracking. As potential travelers and current customers come to your site(s) and app(s) from many different devices and often in many locations (ranging from their homes and offices to mid-vacation/at their destination), you benefit from being able to capture everything.
*   **Ability to stitch everything, past and present, together for a complete view** - With a range of user identifiers and access to your raw, event-level data, and the ability to ingest third-party data from multiple sources, a complete, end-to-end customer journey can be constructed.
*   **Flexibility** - With ownership of data throughout time and the freedom to track what and how you want, you open the floodgates to more experimentation, customer personalization and ideas about using data to power different aspects of your business.

 

We talked with Tripaneer about their experience using Snowplow to understand their full customer journey and to work toward a single view of the customer. [Download the case study](https://snowplowanalytics.com/customers/tripaneer/) to learn about how they have used Snowplow to map the customer journey and to run multiple real-time marketing and retargeting experiments.