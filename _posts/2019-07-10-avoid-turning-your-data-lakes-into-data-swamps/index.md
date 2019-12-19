---
layout: post
title-short: Avoid turning your data lakes into data swamps
title: "Avoid turning your data lakes into data swamps: Focus on data quality, not capture"
description: "How to master your data lake to surface long-term business value. Free white paper included"
author: Erika
category: Data insights
permalink: /blog/2019/07/10/avoid-turning-your-data-lakes-into-data-swamps/
discourse: true
featured: true
pdf: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Data_Lakes_Data_Swamps.jpg
thumbnail-image: /assets/img/blog/featured/SP-Blog-Post-Data_Lakes_Data_Swamps-mini.jpg
---

Putting data to work and gathering meaningful insights from it is growing increasingly complex, in large part because there is a near-unfathomable amount of data flowing in from all kinds of sources. This will come as no surprise to anyone, regardless of the industry in which they work, because data has come to be seen as the “holy grail” of business development and improvement as well as the defining factor in many changing and new business models. And data management becomes exceedingly complex. With that in mind, data appears for all intents and purposes to be steering the ship, even in cases where it has not delivered on its promised business value.




## Row – don’t float – against data lake bloat

If we are letting data be the main driver, then, and the sheer volume of data, types of data and data sources is exponentially expanding (making “big data” an understatement), smarter ways to manage data storage, classification and processing would necessarily need to follow.

 

The trend for some time has been to capture raw data and throw it into data lakes for later use. Because of nebulous definitions surrounding what data lakes actually are, there is confusion and misunderstanding as to what they do. Their function as a more flexible, less complex solution for data capture than data warehouses, which aren’t well-suited for the messiness of unstructured incoming data, is partially understood but not practically exploited. Data lakes pose an opportunity to ensure data capture at scale at a lower cost and with fewer limitations. After all, isn’t it better to ensure that all data and data types are kept even if there isn’t a plan for its structure or use?

 


#### The trouble with the “pull in and capture everything” approach is threefold: 



1. the need to store massive amounts of unstructured data without a strategy for managing it leads to data lake bloat/data swamps
2. organizational pressure to get business intelligence from - or indeed _do something_ with - the data to make it usable coupled with the challenge of getting value from raw data once it’s already stored
3. data continues flowing in constantly. A continuous flow is great for tracking insight over time, but if data is not structured in a usable way, insights and answers to business questions can be delayed (what’s the point of real-time data collection in that case?) or lost altogether.

 {% include shortcodes/ebook.html background_class="datalake-landingpage" layout="blog" title="Avoid drowning in your data lake" description="How to improve quality, richness and analytics of your data
" btnText="Download the white paper" link="https://www.snowplowanalytics.com/lp/data-lakes/" %}


## Mastering the data lake to surface long-term business value




What this means is that organizations (data-driven and those that aspire to be) need to build a blueprint for managing data collection before they even dip a toe into the data lake. This proactive approach should focus on how data will be structured and data governance before it even comes into the data lake to make it accessible for in-depth analytics and other use cases organization-wide. This may sound like an insurmountable challenge, and that’s partly what keeps many companies from looking at data from a structure-first point of view. Many companies, though, rely on the kind of flexibility that is, ironically, supplied by structure, such as La Presse, a Canadian media company:

 

Snowplow customer La Presse has taken this exact “apply schemas to data”, quality-first approach to data strategy, breaking down in-house silos that kept the company and its various teams from getting as much value from their data as they could. By moving from a traditional business intelligence pipeline and data warehousing to the faster-moving agility of data lakes, La Presse was able to eliminate the long data discovery phase that typified the warehouse solution while surfacing relevant data through the data lakes and data shores (an additional data preparation step La Presse built for data storage and easy consumption once data was structured and ready to use for decision making). As data enters the pipeline, data is validated against pre-defined data schemas – so even though the data that moves to their data lake is still essentially “raw”, it is structured and has already been through a level of quality control. At this stage, different business users and stakeholders can access and use the data for advanced analytics, different use cases and more sophisticated data modeling or machine-learning initiatives.




## Data quality differentiates the data lake

Snowplow Analytics has built Snowplow from a data-quality-first perspective, meaning that incoming event data is always validated against schemas, so nothing goes into the data lake without a structure. The emphasis on data quality ensures that users gain the greatest value – faster – when they think critically about data upfront. For example, Snowplow Insights makes it easy to add, validate and publish data schemas directly from your console so users can manage and evolve their data structure over time. What’s more, this helps users surface insights faster, expose data to apply to new use cases, and ultimately deliver on the promise of meaningful, real-time insights.

 

We’ve taken a deeper dive into the data lake topic in a new white paper, “Avoid drowning in your data lake – how to improve quality, richness and analytics of your data”. <b>[Download the paper](https://www.snowplowanalytics.com/lp/data-lakes/)</b> to learn how to make key decisions about data collection and structure, how to manage your data lakes effectively, and how Snowplow can support you in achieving your data-related goals.