---
layout: post
Title: "How DataOps can meet the challenges of managing behavioral data"
Description: "Solving key logistical problems in data management with DataOps"
author: Yali
category: Data governance
permalink: /blog/2020/07/28/how-dataops-can-meet-the-challenges-of-managing-behavioral-data/
discourse: false
---


This is the first in a series of posts on DataOps, with a specific focus on how DataOps approaches can be used to meet challenges working with behavioral data (e.g. web and mobile data).

In this post we start by exploring the types of challenges that manifest in organizations when working with behavioral data that can lend themselves to a DataOps approach. In future approaches we will flesh out how those DataOps processes and methodologies work, and how Snowplow technology can support them.


## Introduction

Casey was exhausted. One of only a handful of data product managers at Global News Inc, she found she was constantly being pulled back and forth between the many different team members at the firm that cared about data. In particular, she frequently found herself being pulled in one direction by the development teams that wanted to use behavioral data, and the different squads that she had to coordinate across to ensure consistent data systems across Global News’ more than 100 different apps. If only she could spend less time getting people aligned on what data they needed, and where to find it, she could actually spend some time making time supporting teams drive value from the data.

Nowhere were the challenges Casey faced more evident than in the case of coordinating work between the “Changing Times” mobile team, the Global News Business Intelligence team, and the newly spun up personalization team:



*   “Changing Times” is one of Global News' most successful titles, in the key US market. A subscription publication, it has a wide audience of subscribers. Internally, the squad responsible for the Changing Times mobile and tablet app is particularly lauded, given the high levels of engagement in the app and its good reputation. That team takes pride in its data-driven approach to product development, with a commitment to only rolling out new features if they meet particular thresholds prior to launch, which are measured through A/B testing.
*   The Business Intelligence team has been working for more than a year on an approach to provide unified reporting across the business, including the 100+ different apps across different titles. This team has had some success rolling out some reporting across some of the Global News brands, but the data from “Changing Times” has not yet been incorporated, and this is seen as a major missing piece of this project to date.
*   The Personalization team has only recently spun up, with a mandate to use AI to drive engagement across Global News’s myriad different titles. The team has experimented with potential approaches on some publications, but again the Changing Times is notable as it is not part of the pilot yet. This is particularly troublesome as Changing Times has one of the larger audiences and some of the higher engagement levels, making it one of the most fruitful places to experiment with different approaches to using personalization. 

Both the Business Intelligence and Personalization teams were very keen to incorporate Changing Times in their reporting and personalization solutions – given the importance of Changing Times to Global News as a whole. However, that was proving much more challenging than integrating other titles. Successive efforts either to incorporate the data from Changing Times in the company wide reporting, or to test the personalization product on the Changing Times app, kept failing because of data integration issues.

The Business Intelligence and Personalization teams kept complaining that the Changing Times data quality was poor: every time they agreed a specification for the different data they required from the Changing Times team, they’d find that the data delivered would not be complete, and this was because the Changing Times team were making very frequent changes to the mobile app, so that successive versions would generate different data sets shaped in slightly different ways. Casey had investigated and validated that this was the case - the Changing Times app was very fast evolving, with frequent changes being made to the data collected. 

On questioning the Changing Times squad, however, they were frustrated that the “slow moving” Business Intelligence and Personalization teams were trying to “trap” them into specific approaches to data collection when they needed the freedom to evolve their application as fast as possible, based on the experiments they were running: this was a key driver for the success of the app in the first place! “Please don’t let us sit in another long planning meeting with the BI or Personalization team” the Changing Times product manager would beg Casey. Some of us actually need to make money in this place!”


## Challenges for Casey and the teams working with behavioral data at Global News Inc

The type of situation described at “Global News Inc.” is common in the data operations at many companies today. Delivering enterprise data projects involving behavioral data, for example:



*   Unified reporting
*   Personalization services
*   Product Analytics
*   Real-time A/B testing

End up being difficult for data professionals because:



*   The behavioral data that those projects require depend on many different teams. In this example at minimum it depends on the different squads that are responsible for the over 100 apps that the data is collected from, and the centralized Data Engineering Team that is responsible for overall data preparation, that Casey is a part of.
*   The behavioral data that those projects require is being used by multiple teams running different projects, and the different requirements might conflict. In the example given the Changing Times mobile app squad, the business Intelligence Team and the personalization team all need to be able to work with the behavioral data generated from the Changing Times mobile app. They want a level of stability in the structure and definition of that data, one that the Changing Times team find too constrictive. In reality, the number of teams that would want to work with the data  is likely to be higher and could include:
    *   A team looking to optimize the design of the paywall on “Changing Times” to maximize subscription rates
    *   Another team looking to optimize retention / reduce churn across subscribers to the “Changing Times”
    *   Another team looking to maximize ad revenue
    *   Another team looking to provide journalists and other content creators on the Changing Times publication with intelligence to help them identify what type of content their audience want to consume
*   The number of people that need to coordinate across an organization in order for any projects to be successful is enormous. Just to get personalization running successfully on the “Changing Times” app requires the squad responsible for the mobile app, the squad responsible for the personalization service and the data team to all coordinate together. 
*   In any modern organisation the requirements on the data are likely to evolve rapidly – both as the sources of data evolve (e.g. the “Changing Times” mobile app) and the different consumers of the data develop their applications (e.g. the Personalization team). That means that once a use case e.g. the personalization service has been put live, ongoing effort is required to ensure it stays up to date with any changes to the nature of data generated from the Changing Times app.


## These are exactly the sort of challenges that the DataOps practice was developed to solve

These challenges around behavioral data are specific examples of some of the more general data management challenges that have prompted implementing DataOps as a discipline. The conditions that give rise to these challenges are:



*   Data sophisticated companies find themselves having to build and manage multiple, data pipelines:

    *   At minimum a data pipeline is required for systems for continuous delivery of useful data,
    *   At minimum, a data pipeline is required for every use case you want to execute on: even if a new team is executing on a use case that only requires well understood data, from a well-governed data warehouse that is already used by many other applications, some additional processing on that data will be required for the new use case.
*   Data pipelines have dependencies on one another: a break in one of them causes an issue with any downstream pipelines.
*   Data pipelines need to have a data governance system in place to keep up with evolving use cases. This makes change the norm.
*   Managing changes to data pipelines is organizationally complicated, as different teams are often responsible for different parts of the pipeline.
*   It involves orchestration across multiple teams and team members (DBAs, data engineers, data scientists, integration architects and data stewards as well as the teams responsible for any data production or data consuming systems.


## Data and analytics leaders can leverage DataOps approaches to meet these challenges

The recent DataOps report from Gartner recommends that Data and Analytics Leaders:



*   Leverage techniques from agile methodology (software development i.e. DevOps) to address these challenges in the data lifecycle.
*   Focus on continuous improvement in collaboration and eliminating silos across the myriad teams and roles that span the data pipelines in an organization. 
*   Introduce these capabilities in a phased manner, with a focus on requirement definition, development and monitoring. 

To learn more, we recommend readers download the Gartner white paper [here](https://snowplowanalytics.com/lp/introducing-dataops-into-your-data-management-discipline-gartner/). 

In this series of follow-up posts from the Snowplow Team, we will bring to life how DataOps approaches can be brought to bear to solve challenges around behavioral data, in particular, and how Snowplow technology can help support those practices. Upcoming posts include:



*   Delivering business value one use case at a time. How not fall into the trap of trying to do too much with your data, at once.
*   Decoupling data pipelines. How to organise teams around data pipelines  and data architecture so that everyone can productively execute on their own use cases. (And why data product managers and SLAs are so important.)
*   How to execute machine learning, data science and AI applications on behavioral data so that they do not get stuck in development and actually deliver value in production.