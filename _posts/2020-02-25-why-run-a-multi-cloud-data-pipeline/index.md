---
layout: post
title-short: Why run a multi-cloud data pipeline?
title: "Why run a multi-cloud data pipeline?"
description: "Find out why you should run a multi-cloud pipeline"
author: Erika
category: How to guides
permalink: /blog/2020/02/25/why-run-a-multi-cloud-data-pipeline/
---

# Precision data collection: The foundation of your data strategy

Who doesn’t love having freedom of choice, and even better - being able to choose more than one thing? If you’re given a choice between chocolate or vanilla, or instead, you actually can have a little bit of both, what’s going to appeal to you more? 

You have your preferences, and your reasons for those preferences. If you’re thinking about owning and running your own data pipeline, for example, there’s surely a choice-driven, flexibility-loving maverick in you who demands vanilla, chocolate and some unknown third flavor. 

This call for choice and flexibility is at least in part how we have ended up living in a multi-cloud world. Most enterprises (about 84% according to a [Flexera State of the Cloud survey](https://www.flexera.com/blog/cloud/2019/02/cloud-computing-trends-2019-state-of-the-cloud-survey/)) leverage multiple cloud services to gain competitive advantage and differentiate their offerings. We’ve discussed this shift before, covering the “[why adopt a multi-cloud strategy](https://snowplowanalytics.com/blog/2019/10/31/why-and-how-to-seize-the-multi-cloud-data-analytics-opportunity/)”. Everything from ensuring uptime and robustness to shifting workloads to capture maximum efficiency, cost savings or avoiding vendor lock-in, there are a lot of good reasons for running your infrastructure across clouds. 

The multi-cloud world goes well beyond the initial promise of commodity cloud storage and compute power and enables a host of differentiated services. Multi-cloud helps achieve more advanced use cases higher in the stack, letting you move between clouds to get the best of each cloud service without disruption.

In the data analytics space specifically, multi-cloud strategies allow for adopting best-in-breed features and differentiators among the major cloud platforms. But at a more granular level, why would a company want to run a multi-cloud data pipeline?


{% include shortcodes/ebook.html background_class="multi-cloud-landingpage" layout="blog" title="Multi-cloud for data analytics white paper" description="Find out how to seize the multi-cloud data analytics opportunity" btnText="Download the white paper" link="https://www.snowplowanalytics.com/lp/multi-cloud/" %}


## Why would you want to run a multi-cloud data pipeline?

In larger, data-sophisticated organizations, there are often complex requirements for handling data. For example, there will sometimes be a need to: 



*   deliver different subsets of the customer data to different teams
    *   in different applications
    *   In different formats
    *   all with different services level requirements or specifications

You can see how it already starts to get a bit messy. Some examples of these needs in practice could include: 



*   An organization wanting a subset of the data delivered at very low latency to deliver high-priority, low-latency reporting, e.g. a newspaper that optimizes its homepage during the day. This might mean streaming a subset of the data into Elasticsearch, or loading a subset of the data into BigQuery, where recomputing data models on a small set of data is computationally efficient; or, running a real-time computation on a subset of the data in-stream and delivering the output to Elasticsearch, DynamoDB or Druid.
*   A particular team might want a subset of the data available as a feed to power a real-time application or to syndicate with a customer or partner.
*   A team might want to prototype a new application on a subset of the data before publishing it to production.
*   Customer or product teams might require access to data collected from customers to improve their experience, and will need more of the customer data than a marketing team, who are only allowed to access data for those users who have opted-in for marketing purposes.

Looking at the breadth of these different use cases, it is not only clear that there’s a certain degree of complexity, but also these different endpoints may well be located in _different clouds_. For example, customer data may live in a BigQuery (GCP) data warehouse, with a data lake in S3 (AWS). 

Historically, it has been challenging to break down barriers between different clouds. It has been next to impossible to share data across clouds, creating immediate “cloud silos”. A multi-cloud data pipeline could enable data sharing/streaming on top of the cloud infrastructure to enable the primary function behind the multi-cloud promise: to load destinations on different clouds. Different reasoning powers these decisions:



*   Taking advantage of cloud-specific tooling
*   Restrictions on what cloud services you can use for specific purposes
*   Cost considerations/incentives

Let’s take a closer look at each of these points. 


### Benefits of cloud-specific tooling

We’ve already highlighted that cloud computing has evolved beyond commoditized offerings, and the major cloud providers (AWS, GCP and Azure) compete on the differentiated tooling they each provide. The ability to pick and choose among these services according to your needs and use them in parallel can be quite compelling. Some examples:


#### AWS



*   S3 is well-regarded for data lakes. There are many options available for computing on data stored in S3, including AWS services, such as Athena, EMR, Redshift Spectrum, as well as non-AWS services, such as Databricks and Qubole. 
*   Real-time processing options are available, such as Lambda + Dynamo and Kinesis Analytics.


#### GCP



*   GCP’s popular BigQuery cloud data warehousing technology enables large-scale storage with built-in ML.
*   Google’s Cloud Dataflow is a platform for writing real-time batch and stream data processing jobs consistently.
*   AI Platform enables the building of AI applications that run on GCP and on-premise.


#### Azure



*   Microsoft provides analytics tooling that integrates well with Excel and SQL Server.
*   Event Hubs for big data streaming and event ingestion.
*   Data Lake Analytics offers advantages over S3, such as support for broader SQL syntax when querying the data lake and enables on-demand, pay-per-job analytics.
*   Azure Stream Analytics makes it easy to run SQL on streaming data and visualize the output.


### Restrictions or reservations about specific cloud use 

There may be reasons why a particular company or team needs to use a particular cloud, or why they are restricted from or wary about using certain cloud providers or services. For example:



*   Certain companies are not allowed to use AWS, but are allowed to use Azure, for example
*   Retailers may look for alternatives to AWS because they compete with Amazon
*   Media companies may look for alternatives to GCP because they compete with Google
*   Multi-cloud setups can mean minimizing exposure to a particular cloud, e.g. using AWS just to prepare data but then do the heavy lifting in, e.g. Azure


### Cost considerations and incentives 

Cost considerations are always a factor, and choosing one cloud for one purpose, and another cloud for a different purpose may have cost implications. For example:



*   Third-party endpoints may charge by volume of data sent, making it useful to remove events that aren’t relevant.
*   Storage targets often charge based on compute required to run a query, or are very expensive for storing large data sets.
*   Real-time applications have costs that scale up with the volume of processed data.

Reducing data processing to the subset of data that matters most can make it more cost effective than handling the full data set. 

On the other side of the same coin, some cloud providers incentivize use of their platform, e.g. Microsoft offers Azure credits to help grow market share; all three major platforms offer varying levels of marketing support and “credits” to incentivize use and might influence the decision to go for a multi-cloud option.


## Should you build-your-own multi-cloud pipeline?

The idea of building your own multi-cloud data pipeline is probably tempting. Cloud technologies have made such undertakings much easier than in the past. Still, some of the aforementioned barriers to multi-cloud exist, including:



*   **Maintenance**: Do you have the technology in hand to be able to stream data from one cloud to another? Can you maintain and ensure uptime of these streams and of the pipeline itself? 
*   **Talent**: Building a multi-cloud data pipeline is one thing, but maintaining it is another. The scarcity of data ops talent in the multi-cloud space may stand in the way of building and keeping up a robust multi-cloud pipeline yourself. Do you have the in-house expertise to move data seamlessly and securely across cloud platforms?

Given the challenges of building and maintaining your multi-cloud pipeline yourself weighed against the potential rewards, it might be time to consider another way that lets you retain control and choice, but removes maintenance and talent from the equation. 


## Why go for a Snowplow multi-cloud data pipeline?

With the Snowplow multi-cloud pipeline, you get the flexibility to create the pipeline you want with none of the hassle. You can run Snowplow across different clouds in real-time, enabling you to adopt a multi-cloud strategy with access to data and analytics tools across all three clouds: AWS, GCP and Azure. 

**Choose and use**: Leverage best-in-class data warehousing, data discovery, analytics and ML tools from AWS, GCP and Azure to meet each team's unique requirements.

**Get the best of all worlds**: With a global business footprint, cloud services work best when in close geographic proximity to end users. Extend your reach to cloud locations outside of dominant (AWS) locations.

**Break up to speed up**: It is easier to deliver very low latency data and computed metrics if the volumes of data are smaller; breaking the workload up according to needs can provide latency reduction.

**Avoid vendor lock-in**: Free your infrastructure and cloud services from single-cloud silos and cloud provider lock-in.

**Focus on your data, not the pipeline**: With SLAs, 24x7 support, and a focus on data quality, Snowplow will manage your custom multi-cloud pipeline.

Run as private SaaS, i.e., SaaS in a private cloud), a Snowplow multi-cloud data pipeline lets you “build” your own custom pipelines to get exactly the data you want, in the format you want, to the destination you want, while freeing you from having to maintain the multi-cloud service yourself. Snowplow supports you in shifting your data seamlessly across clouds in real time and load the data to your destination of choice.