---
layout: post
title-short: "What is data modeling and why do I need it?"
title: "What is data modeling and why do I need it?"
description: "How and why to model and democratize your data with data modeling"
author: Erika
category: Other
permalink: /blog/2019/10/14/what-is-data-modeling-and-why-do-i-need-it/
---



In its most basic form, data modeling is a way of giving structure to raw, event-level data. This structure is essentially _your_ business logic applied to the data you bring into your data warehouse – making it easier to query and use for your specific use cases. (At least that is the Snowplow approach to data modeling.)The reason is fairly clear: data modeling adds meaning to what is probably a great volume of raw data coming in from multiple, disparate sources. The raw data itself is usable and unopinionated, having no structure or meaning until you assign that structure, which happens at the data modeling stage.

![data-modeling](/assets/img/blog/2019/10/data-modeling.jpg) 
 
Data modeling is an essential step in socializing event-level data around your organization and performing data analysis. 

The point of data modeling is to produce a data set that is easy for different data consumers to work with using basic SQL skills. Typically the modeled data will be socialized across the business using one or more business intelligence tools and will contribute to making business decisions with data-informed business analytics. 

At the core of this approach is the idea that the raw data stream is immutable, but modeled data is mutable. That is, new event data or an update to business logic will change how we understand something that happened in the past. Instead of changing or updating the immutable event stream itself, which will live as a repository of unchanged, raw data, we change the data model to reflect changes. Thus there will always be two data sets. Both represent what has happened, but one is an unopinionated and comprehensive description of everything that has happened and is ideal for auditability and completeness. The second, modeled (opinionated), data set is designed for ease of use and access and can be specifically queried. 


## Why do data modeling?

Why is modeling the data important? For one thing, data is only as valuable as what you do with it once you have it. The data itself is agnostic, but what you want to do with it is not. Data analytics is a dynamic process with varying levels of sophistication, depending on a company’s level of data maturity. There are several possible drivers for developing data sources and their unstructured data into usable models:



*   your organization is becoming more sophisticated with data, meaning that you will begin to see greater uses for the data - modeling democratizes data and makes it easier for non-data scientists and analysts to query.
*   you want to build custom attribution models and dashboards that reflect your business reality, not what an external vendor thinks is important for your industry. After all, you understand your business best.
*   you want to shape your company as a data-first organization.
*   you want to take ownership of your data across data sources and use it to empower teams across your organization to self-serve their own relevant reporting and data visualization.
*   you want to answer business questions faster, without involving extensive data engineering work. 

 

 {% include shortcodes/ebook.html background_class="data-modeling-landingpage" layout="blog" title="Data modeling 101 guide" description="Learn how and why to model and democratize your data with data modeling" btnText="Download the white paper" link="https://www.snowplowanalytics.com/lp/data-modeling/" %}


## How to get started with data modeling

Now you’ve taken the step of getting your data into your data warehouse, and your ultimate objective is to socialize your _modeled_ data. Centralizing your data in this way will make it accessible to data consumers in your organization, enabling them to work with it unimpeded and letting them contribute to data-informed decision-making across the business.

How do you get from the raw event stream living in your data warehouse to a place where you’ve joined event-level data with other data sets, aggregated event-level data into smaller data sets or applied your business logic? You guessed it - with data modeling.

In our experience, the most successful data teams of all sizes succeed when a data centralization project includes centralizing business logic upfront, ensuring that you have defined your key metrics, such as sessions, conversions and time spent, in the best way for your business model. Defining business logic in advance and based on your specific needs may seem like an extra and unnecessary step when there are existing analytics products with pre-packaged logic and modeling. This may work for many companies whose customer journeys are fairly standard, but for a large number of businesses, there are complexities that make flexible, self-determined data modeling preferable. For example a two-sided marketplace, such as a recruitment website, has recruiters and job seekers using the site and exhibiting two very different sets of behavior and journeys. Designing your own data models and employing your own data modeling techniques can propel advanced analytics insight in ways that pre-packaged solutions cannot match. 

The business logic process is immediately followed by setting data modeling concepts into motion put together with a powerful data visualization tool. Pulling in data from a variety of sources, such as web, mobile, server, e-mail and third-party, and giving it structure and consistency leads to the completeness of data that is essential for data modeling. 

There’s a whole host of information we’d like to share about how you can do data modeling, including:



*   How you set your business logic, which is the first step in your decision-making — the business logic should be centralized before you start data modeling. This is an extra step upfront, but gives you much more flexibility and ownership than out-of-the-box, packaged analytics vendors. 
*   Data modeling examples, such as: 
    *   modeling macro events from micro events (e.g. video views)
    *   modeling workflows (e.g. sign-up funnels)
    *   modeling sessions
    *   modeling users
*   Some of the top tools for building and implementing data models

We’ve put together a Data modeling 101 guide to help you learn the ins and outs of data modeling, and how you can get started with democratizing your data and building data models that you own from end to end. 