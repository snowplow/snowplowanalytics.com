---
layout: post
title-short: Avoid turning your data lakes into data swamps
title: "Piecing together the complex customer journey for a complete single customer view"
description: "How travel startup Tourlane uses Snowplow to centralize and stitch together multiple data sources"
author: Erika
category: Analytics
permalink: /blog/2019/09/20/piecing-together-the-complex-customer-journey-for-a-complete-single-customer-view/
discourse: true
---

In many pieces on travel, we’ve touched on the [concept of hyper-relevance](https://snowplowanalytics.com/blog/2019/08/29/mapping-the-customer-journey-with-complete-picture-data/) - that is, delivering the right product to the right customer at the right time on the right platform or in the right channel. But how do you actually get to hyper-relevance? In this era of data-informed decision-making, your data can give you a complete, end-to-end view of your customer journey and the touchpoints all along the way. And, perhaps most importantly, this granular, event-level view of cross-device, cross-channel, and on and offline user activity delivers insight into what _is_ most relevant to potential customers, what resonates with them, what they interact with, and ultimately what they end up purchasing. How, where and when did they purchase? Where did that journey start? When did they make the purchase decision? This is what attribution is all about. 


## Case in point: Tourlane

One Snowplow customer example is Tourlane, a Berlin-based travel startup and booking platform specializing in bespoke multi-day tours. Tourlane’s customer journey affects everything from product planning to company staffing, meaning that getting to an in-depth understanding of the journey and its multi-touchpoint, cross-device trajectory is key to their fundamental business strategy. But before any digging into such details could begin, Tourlane - like any company in a business that involves considerable customer research, a sales process that can be lengthy and  does by its very nature involve complex, multi-touchpoint interactions - also needs to know what prompted a user to begin their Tourlane journey in the first place as well as how much it cost to get their journey started. 

That is, Tourlane wants to understand what happens from the point when a prospective customer sees and clicks on a Tourlane ad for a specific destination and arrives on the Tourlane landing page. Tourlane’s process is a resource-intensive, multi-touchpoint journey that does lead to this so-called hyper-relevance. But hyper-relevance is a kind of circle: the journey ensures relevance, but the relevance only happens if attribution has been done properly and the insights gained are fed back into the marketing efforts and spend.

_“In every Tourlane team there is a need to understand the customer journey. To get there, we need to understand the whole data flow, have it centralized and reported. If we get a unique ID of a user or lead or customer, we need to be able to “explode” it to find out everything and then trust what is in the database to get the necessary complete view of that user. We needed a high-quality, reliable single source of truth that every team at Tourlane could come to to get and build what they need.”  –_ _Kevin James Parks, Data Engineer, **Tourlane**_

 {% include shortcodes/ebook.html background_class="tripaneer-casestudy" layout="blog" title="Tourlane case study" description="How travel startup Tourlane uses Snowplow to centralize and stitch together multiple data sources for a complete single customer view and predict supply and demand" btnText="Download case study" link="https://snowplowanalytics.com/customers/tourlane/" %}


## What Tourlane was able to do: Personalized customer journey and more accurate attribution

 

With a business model based on a completely personalized experience, Tourlane needed to capture on and offline, cross-device data, including historical data, to centralize in one data warehouse and stitch it together to achieve a granular, per-customer data view. 

Starting from wanting to learn the current user journey to calculating conversion rates by session, the number of sessions by geolocation, and people’s destination of interest, the aim was to: 



*   **Understand user behaviors for greater personalization: **A centralized data overview that includes both live and historical, on and offline data from across multiple sources (email, phone, website, ads, etc.), creates a single source of truth from which Tourlane can begin to dig into the whole user persona and journey to modify the products themselves and the marketing efforts and spend around the products.
*   **Understand the business value of the destinations advertised:** For example, display ads and how prospective customers interacted with them once prospective customers arrived on their site. For example, Tourlane could begin to answer the question: if someone saw X destination in an ad and clicked through to reach the website, how would they be inclined to convert later on in the journey? 
*   **Begin to attribute marketing spend and efforts more accurately and plan for future marketing plans and staffing/resource needs**: With more in-depth, complete data, Tourlane will be able to achieve a more precise view of the most impactful marketing channels and efforts to decide where to allocate staffing and marketing resources, and make improvements to products and marketing campaigns in the future. They will also be able to reach more accurate figures for customer value.

With Snowplow’s flexible and extendable data collection platform, capturing rich events across web, mobile, email and third-party, Tourlane has been able to begin their own journey of stitching together very different datasets. This includes online data over time alongside offline phone logs and external and internal systems. This has enabled previously nearly impossible data insights, including getting more accurate marketing attribution figures, more complete, holistic views of their customers, the sales funnel and supply and demand and the ability to balance current and future supply and demand needs.

[Download the Tourlane case study](https://snowplowanalytics.com/customers/tourlane/) to find out how Snowplow helped Tourlane achieve a single source of truth and understand their complex customer journey.



What this means is that organizations (data-driven and those that aspire to be) need to build a blueprint for managing data collection before they even dip a toe into the data lake. This proactive approach should focus on how data will be structured and data governance before it even comes into the data lake to make it accessible for in-depth analytics and other use cases organization-wide. This may sound like an insurmountable challenge, and that’s partly what keeps many companies from looking at data from a structure-first point of view. Many companies, though, rely on the kind of flexibility that is, ironically, supplied by structure, such as La Presse, a Canadian media company:

 

Snowplow customer La Presse has taken this exact “apply schemas to data”, quality-first approach to data strategy, breaking down in-house silos that kept the company and its various teams from getting as much value from their data as they could. By moving from a traditional business intelligence pipeline and data warehousing to the faster-moving agility of data lakes, La Presse was able to eliminate the long data discovery phase that typified the warehouse solution while surfacing relevant data through the data lakes and data shores (an additional data preparation step La Presse built for data storage and easy consumption once data was structured and ready to use for decision making). As data enters the pipeline, data is validated against pre-defined data schemas – so even though the data that moves to their data lake is still essentially “raw”, it is structured and has already been through a level of quality control. At this stage, different business users and stakeholders can access and use the data for advanced analytics, different use cases and more sophisticated data modeling or machine-learning initiatives.




## Data quality differentiates the data lake

Snowplow Analytics has built Snowplow from a data-quality-first perspective, meaning that incoming event data is always validated against schemas, so nothing goes into the data lake without a structure. The emphasis on data quality ensures that users gain the greatest value – faster – when they think critically about data upfront. For example, Snowplow Insights makes it easy to add, validate and publish data schemas directly from your console so users can manage and evolve their data structure over time. What’s more, this helps users surface insights faster, expose data to apply to new use cases, and ultimately deliver on the promise of meaningful, real-time insights.

 

We’ve taken a deeper dive into the data lake topic in a new white paper, “Avoid drowning in your data lake – how to improve quality, richness and analytics of your data”. <b>[Download the paper](https://www.snowplowanalytics.com/lp/data-lakes/)</b> to learn how to make key decisions about data collection and structure, how to manage your data lakes effectively, and how Snowplow can support you in achieving your data-related goals.