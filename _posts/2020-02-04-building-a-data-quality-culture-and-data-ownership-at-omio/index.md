---
layout: post
title: "Building a data quality culture and data ownership at Omio"
description: "Find out how Omio uses Snowplow to own and control their data and data pipeline and to ensure data quality upfront for time savings and multiple analytics use cases."
author: Erika
category: User stories
permalink: /blog/2020/02/04/building-a-data-quality-culture-and-data-ownership-at-omio/
discourse: false
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-Omio.png
thumbnail-image: /assets/img/blog/featured/SP-Blog-Thumb-Omio.png
---


When we discuss data quality, we apply the words “complete” and “accurate” to define it. A fundamental step to reaching data quality is being able to own and control your own data. Across industries, companies are finding that the demand for data is increasing to power more complex applications. The more complex the demand, the more important data quality becomes. 

At travel search platform company, Omio, as the company has grown, demands for data have increased across the company. The data team has aimed to scale up to supply data for all the downstream consumers of data within the organization, but this proved unmanageable. Serving data requests coming from data scientists, analysts and product managers was one key task facing Omio data engineers. Building a data-centric culture that scales to give them freedom to work on their challenges and projects while empowering the rest of the data and product teams with self-serve data became central to the Omio data engineering mission.


## Building blocks: Omio data culture

For Omio data engineering, one major priority is serving high quality data to data consumers in the Omio organization while freeing up their own team to work on other data-driven projects, such as performance monitoring and anomaly detection. This had to begin with creating a data culture step by step:



*   Breaking down internal silos for socializing data
*   Alleviating the scalability problem 
*   Enabling self-serve data 

 

Omio found that building this culture was possible thanks to having complete data ownership, a custom data pipeline and ensuring highly structured data. Ownership of the infrastructure would give data engineering the power to ensure data was structured upon collection. This would save the data team time and effort in cleaning data by letting them get directly to work modeling their data using high quality, structured data from the outset.


## The Omio approach to data quality

Underpinning these principles is the concept of quality data. Like Snowplow, Omio also defines data quality as **_completeness_** of data. 

Data completeness for Omio means that as they collect data, no events are missing. Data quality also means being able to solve validation problems across data sets. Being able to develop data quality relies on data ownership and the flexibility to control how the data is collected, in particular using schemas and schema validation as quality control. 


## Build versus buy: Omio chooses Snowplow Insights 

Omio began considering their data quality issues through the lens of data ownership and collection. They started off thinking about building a homegrown pipeline, sketching out their requirements and need for data ownership, unopinionated data and the ability to flexibly structure their data. After plotting out what they needed, they realized that Snowplow could meet their needs for maintaining ownership and providing customizability to allow Snowplow to serve as their general-purpose data pipeline framework, saving Omio considerable investment in pipeline building and maintenance. 



 {% include shortcodes/ebook.html background_class="omio-casestudy" layout="blog" title="Omio case study " description="How Omio used Snowplow to build a strong data culture around data quality and data ownership" btnText="Download case study" link="https://snowplowanalytics.com/customers/omio/" %}



> **“We implemented Snowplow because it offered not only a watertight pipeline for schema validation but also because we have complete control and ownership of our data with Snowplow. We can do a lot more with it. Rather than tailoring our use cases or our analytics work around what, for example, Google offers, with Snowplow we can do whatever we want.”** - **_Rahul Jain, Principal Engineering Manager, Business Intelligence Platform, Omio_**

To learn more about using Snowplow flexibility to build your own data-driven, self-serve data culture around data quality, download the Omio case study. 




