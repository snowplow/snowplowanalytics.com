---
layout: post
title: "An introduction to DataOps for people who are not familiar with DevOps"
author: Yali
category: Data governance
permalink: /blog/2020/09/15/an-introduction-to-dataops-for-people-who-are-not-familiar-with-devops/
discourse: false
---


### And are especially interested in behavioral (e.g. web and mobile) data

DataOps is a very hot topic at the moment and for a lot of good reasons. Many of the posts and papers on introducing DataOps explain it in terms of similar agile methodology developments in software development that led to the emergence of DevOps as a discipline. The purpose of this post is to introduce the concept of DataOps to people who are not so familiar with DevOps, as many of the people working with behavioral data, such as data analysts, do not necessarily have an engineering background. 

If you’re familiar with DataOps and want to learn more about how it can meet the challenges of managing behavioral data, check out this blog post. 


## What is DataOps?

Gartner defines the term DataOps as

_A collaborative data management practice focused on improving the communication, integration and automation of data flows between data managers and data consumers across an organisation._

The first thing to note about DataOps is that it is a practice. It is not a technology. Instead, it is an approach to driving value from data in an organization, that:

* Focuses on breaking silos and easing the flow of data between data managers and data consumers
* Emphasises communication and coordination between different team members involved in the data value chain
* Takes an iterative approach to using data to deliver business value where:
  * Value should be unlocked with each iteration 
  * Learning is accomplished with each iteration
  * The organisation works to minimize iteration cycles over time, to maximize the rate at which value is delivered and the organization learns to drive value from the data 


## What is the “opposite” of DataOps?

These are all quite abstract concepts, so it is worth contrasting them with alternative approaches to data that have been very popular to date, and continue to be popular.


### An emphasis on delivering the data into a specific location (e.g. the data lake or data warehouse), rather than on unlocking value from the data 

Projects to implement both data warehouses and data lakes often focus on “getting all the data into the lake or warehouse” - with this becoming an important goal in and of itself. Actually, the data lake and/or the data warehouse is a staging post for the data: typically more work needs to be done (the data needs to be transformed and modelled, either in the data lake / warehouse or somewhere else) in order to unlock value from the data as part of the wider data strategy. 


### An emphasis on the data at rest rather than the data in motion

In data lake and data warehouse implementation projects the focus is typically on building out the data lake or data warehouse, with those two entities taken as primary, rather than thinking in terms of the data pipelines that feed the data lake / data warehouse, or the data pipelines that need to run within those locations, or downstream of those locations, to drive value from the data.

This can lead to underinvestment in data pipelines. Effective setup, management and monitoring of these are absolutely essential for driving value from data, and very difficult to accomplish. DataOps offers data professionals some very promising approaches to taking a pipeline-first view of deriving value from data.


### Rigid, waterfall approaches to gathering and delivering on data requirements, rather than agile, iterative approaches to delivering value

In traditional approaches to data warehousing (think back to the birth of data warehousing - before “big data” and “cloud data warehouses” - organisations would go through exhaustive requirements gathering to understand:

Every question that different people in different lines of business had of the data

Every data source that needed to be incorporated to answer those questions

A several month long exercise would then be undertaken to design the appropriate data warehouse schema, and build the ETL pipelines to deliver the data sets from the different source systems into the data warehouse. The whole project was a big one-off exercise. Once the data warehouse was delivered any changes / additions involved an expensive change management process that meant change (and therefore iteration) was the exception, rather than the rule.

Approaches to implementing data lakes are generally better: the architecture of the data lake means data teams have a lot more flexibility to add more to it later, and change the structure of what data they are piping into the data lake at any one time (although with this flexibility comes a lot of additional complexity).

Approaches to web analytics implementations (think especially SiteCatalyst / Adobe implementations) are typically one-off and waterfall: with a several-month long exercise to gather requirements for digital data, develop an associated tracking plan and reporting suite and then deliver them. At that point (maybe a year after inception) the data analytics is “implemented” and it’s a change management process to alter the setup in any way e.g. to extend it with additional data points.


## What does DataOps look like when applied to behavioral (e.g. web or mobile) data?

We will dive into detail on how to apply different DataOps principles and practices to behavioral data in future posts. For this one, though, we want to bring to life what implementing a DataOps approach for behavioral data might look like, to give a flavour for how it looks different to a more traditional approach to web or mobile analytics.


## Data product managers mediate between data consumers and data producers

It is increasingly common to see data product managers play important roles “owning” the entire data platform or parts of the data stack. Data product managers will be responsible for:



1. Understanding the needs of the different stakeholders in the business for behavioral data.
2. Be responsible for meeting those needs i.e. delivering data with specific SLAs.
3. Working with implementation engineers (data producers) to instrument and evolve tracking and data engineers to run the pipelines to deliver on the above.
4. Bring together stakeholders (data producers, consumers such as data scientists and business users, and the data engineering team) to agree standards and specifications for the structure, content and processing rules for all behavioral data generated.
5. Spend time publishing and communicating e.g. the catalog of behavioral data available (including all relevant metadata), and managing the evolution of that catalog over time to increase data access.


## A tracking plan that continuously evolves

Rather than be a “one off exercise” to instrument tracking in a platform, organisations with a DataOps approach evolve their data collection over time, as:



*   The needs of the business evolve, e.g. new use cases are developed on top of the behavioral data or more sophisticated approaches are taken to existing use cases.
*   The user journeys that the behavioral data describe evolve e.g. as the mobile apps and webapps evolve.
*   Data protection regulation evolves and users become more prescriptive about what data they are happy to share and how they are willing to let it be used.


## The iterative approach to evolving behavioral data collection is driven on a use case by use case basis, with an emphasis on value delivery

Data product managers are clear on the business value driven by the different use cases, and use this to prioritize updates to the data collected to ensure maximum return on the investment in data and validate that any expected returns are realised. 


## Focus on management and monitoring of data pipelines

Companies that adopt DataOps approaches invest in understanding their data architecture and the set of data pipelines that are currently live at any one time, the relationship between each (e.g. which pipelines are dependent / downstream of other pipelines and which pipelines does each use case depend on) and aim to 



1. Monitor and manage them to minimize downtime. 
2. Effectively evolve them in a systematic way, so that new use cases can be supported without breaking existing use cases.
3. Provide an environment in which new data use cases can actively be prototyped and then put into production. 