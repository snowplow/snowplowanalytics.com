---
layout: post
title: "How do you structure your data team?"
title-short: "How do you structure your data team?"
description: "A rundown of different ways to structure the data team, with examples from Snowplow customers"
author: SimonP
category:  User stories
permalink: /blog/2020/03/10/how-do-you-structure-your-data-team/
discourse: false
---



## With examples from Snowplow customers 

The business world is witnessing the rise of the data team. When companies first worked with data, it was in fragmented silos, with marketing teams, BI teams and analysts within product teams, each handling data individually. Since then, data has become recognized as a valuable business asset, and the dedicated ‘data team’ (or teams) has emerged. 

Data is now a full-time job for engineers, architects, analysts and data scientists who are grouped into teams – tasked with collecting and managing data and deriving value from it. But one size doesn’t fit all. Each data team is as individual and multifaceted as the companies they support, and most are in a state of flux, continually evolving alongside their business.  

In search of what makes up an ‘ideal’ data team composition, and the optimal way for data professionals to interact with other teams, we asked our customers how they structure their data teams, and how they operationalize data across the business. 


## Example data team structures

Each company has its own, individual data requirements and a unique approach to organizing the data team. Examples of data team structures that we see often among Snowplow customers include the centralized team, a distributed model and a structure of multiple data teams. 

**The centralized data team** is arguably the most straightforward team structure to implement and a go-to for companies who are taking the first steps to become a data-informed organization. This model can lead to a central data ‘platform’ that can serve the rest of the business, enabling data professionals to work towards their own key projects. 

– **The distributed model** shares data resources with the rest of the business by equipping other teams with individual data professionals, sometimes with data ‘pods’ that might contain an engineer and an analyst. 

– **Multiple data teams** share data responsibilities such as data engineering, data science and business intelligence. Choosing multiple teams can be a robust solution for companies that handle high-scale data operations, without wanting to ‘bloat’ a single data team. 


## The centralized team 

The centralized data team is a tried-and-tested team model that will allow companies to deliver data with the least possible complexity. One advantage of a central data team is that it can serve other teams while working towards its own core business projects – it’s a flexible model that can adapt to the changing needs of a growing business. 

Perhaps it comes as no surprise that, among our customers, the centralized data team was the most popular structural choice. Several of our customers told us that the centralized model forms a basis for the data team to work on long-term projects, while serving surrounding teams. 

Some data teams, like at [Tourlane](https://snowplowanalytics.com/customers/tourlane/), embrace the role of data ‘suppliers’ who encourage inquiries from other teams for website or marketing-related data. For Tourlane, the central data team is responsible for democratizing data insights.

> **“Our mindset across the company is to make data available to everyone. We also hold internal training for team leads for Metabase so they can get data themselves.”** - **_Tourlane_**

Promoting a culture of self-serve data is also a core focus for Auto Trader’s central data platform. Auto Trader has an experienced and capable team, made up of data engineers, developers, analysts and data scientists, but they also stress the importance of empowering other teams to help themselves and preventing a bottleneck. 

> **“Our teams are empowered to care about the analytics their products are generating and the insights they want to drive.”** - **_Auto Trader_**


But Auto Trader’s data team is not one dimensional. By creating an agile ‘project team’, data engineers can get in the trenches alongside developers, analysts, and data scientists to build product features together. In one such project, Auto Trader’s data team is working on a cross-functional project to enhance customer performance. For Auto Trader, as with many other data teams, it is important to strike the right balance between making themselves available to others while maintaining focus on core data projects.   


### A balancing act

The centralized data team is not without its challenges. As the first port of call for any data-related queries from the rest of the business, it’s easy for a data team to be pulled in so many different directions that it cannot focus on its own tasks. 

At [Peak](https://snowplowanalytics.com/customers/peak/) Labs, the data team faced exactly that challenge. Inundated with demands from internal stakeholders, such the product team, Peak’s data team were so busy with requests that they were forced to compromise on their own endeavors. 

People are habitual creatures, and despite efforts to limit outside distractions, employees from other teams simply got used to approaching individuals in the data team. Those approaches meant the team had to be constantly code-switching.


> **“We were all becoming less productive because of the context switching we were having to do multiple times per day. Sometimes per hour!”** - **_Peak_**

To tackle the issue, Dr. Emma Walker, Lead Data Scientist at Peak, drew up new communication rules around data. She set up public Slack channels with each team or project managers, and encouraged other teams to use those channels as their first point of contact, rather than messaging individuals. She also established ‘office hours’, when a member of the team would host an hour-long data clinic in the company kitchen for employees to ask any data-related question. These questions would range from finding user information, how to track new features, determining the success of a marketing campaign or even questions about GDPR. 

Peak’s proactive approach to data communication paid off. Now the team has the headspace to focus on their long-term goals, while making data accessible and approachable to other team members. 


> **“By controlling the channels of communication, but making sure that we have a daily presence in the office, we’ve almost entirely eliminated the context switching that comes from questions over Slack and have increased our ability to focus. It’s a win for everyone.”** - **_Peak_**


## The distributed model 

While a centralized team is limited in its ability to sit alongside others, the distributed data team can work alongside existing business teams, such as product and marketing. For some, the centralized data team is a stepping stone on the journey to a distributed model, but the centralized and decentralized models aren’t always mutually exclusive. 

For PEBMED, decentralizing the data team was a process of incremental steps. They first deployed a centralized team to build business-critical data models, then augmented their product teams with two data analysts, before moving to a system of distributed pods in 2020. 

Taking a different approach, Animoto decided on a ‘hybrid’ between centralized and distributed structures. Describing their system as ‘semi-embedded’, Animoto has a central analytics team while at the same time equipping other teams with data ‘ambassadors’. The ambassadors are responsible for data analytics within each team, as well as coordinating a unified approach to data for the company overall. The system works well, and means that Animoto has the best of both worlds when it comes to the structure of their data function. 


> **“On each team, we have somebody who is an ambassador. We're trying to democratize the data and we trust this person to be more advanced and to help the other members of the team with data analytics.”** - **_Animoto_**


## Multiple data teams 

There are times when one data team just isn’t enough. As a company scales and data volumes increase, it can be necessary to divide and conquer data responsibilities to keep up with business demands.  

At Omio, there is not just one data team, but three, divided by discipline. Firstly, there is a large data engineering team that provides a central source of business intelligence. Secondly, a smaller data team that supports marketing, and finally a team dedicated to data science and insights – one of the primary consumers of data provided by the data engineering team. 

This ‘federated’ model allows Omio to operate a central data function, while operating minor contingents that serve other parts of the business. Each contingent can operate with a level of independence, without relying on one large central team that slows down operations. 

Omio may eventually transition to a fully distributed structure where each team has its own data engineers and analysts. As they continue to grow, Omio is focused on expanding their data capabilities, without bloating an individual team so much that it is no longer agile enough to meet business demands. 

> **“It's a problem of scale. We started with four people last year, we're not a large team, and the demands are increasing. But it doesn't make sense to keep adding more and more people to this big, central group.”** - **_Omio_**


## How Snowplow helps data teams (of all shapes and sizes)

Whether you already have a thriving data function or you’re looking to expand your data team, here’s how Snowplow can help you power your data journey to success.


* **Unified data collection:** Snowplow enables you to unify your data collection strategy and establish a shared tracking methodology across the business. 
* **Data quality you can trust**: With complete, accurate data from Snowplow, your data team has access to high-quality data they can rely on. 
* **Empowered data consumers:** Snowplow helps you to empower your data consumers such as analysts and data scientists with clean, well-structured data that’s ready for use. 
* **Freedom and flexibility:** Snowplow gives you complete freedom to collect and model your data on your terms, with no vendor lock-in or prescribed rules. That means you can manage your data delivery in a way that makes the most sense for your business.