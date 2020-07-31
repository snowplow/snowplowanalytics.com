---
layout: post
title: "Should you build or buy your data pipeline?"
description: "What is the true cost of building your own data pipeline?"
author: Franciska
category: Data insights
permalink: /blog/2020/07/31/should-you-build-or-buy-your-data-pipeline/
discourse: false
---

Why buy, when you can build it yourself? For data teams in many companies, build vs buy has become a hot debate, and many have decided to invest internal engineering resources into building their own data pipelines. This shift has been driven by the flexibility and control that is often a trade off when relying on third-party tools. It’s especially prevalent for companies who are moving beyond reporting, using their behavioural data to feed real-time applications and products. 

Building and running DIY infrastructure is achievable. Developments in open source frameworks like Apache Kafka and Apache Spark, and web services like Amazon Web Services, Google Cloud Platform and Azure have made build-it-yourself solutions much more accessible today than was possible years ago.

Leading tech firms such as Facebook, Amazon, Uber and others have made data a vital part of their products and have invested heavily in building their own infrastructure. But while this approach makes sense for cutting-edge pioneers, is it right for the rest of us?


## DIY data pipeline: the benefits of going your own way

The logic behind building your own data infrastructure makes sense from the perspective of control, flexibility and ownership. Data is a key asset around which vital business decisions are made, features are shipped and products are powered, so it makes sense to have full mastery of your data infrastructure. Organizations who recognize the value of their data understand the importance of:



*   Owning and controlling their own data - including how and where it's processed, stored and used.
*   The flexibility to customize their data infrastructure to fit their business and use cases, without having to conform to any industry standards. 
*   Not having to rely on external vendors or teams to power your data function 

Before we continue, let’s explore these factors in more detail. 


### The importance of ownership 

Data is an organization's most valuable asset. Not only does it have potential to transform customer experiences and enhance products, but is increasingly regarded as a strategic asset worth protecting. Aside from the regulatory pressure from Europe’s GDPR (General Data Protection Regulation) and California’s CCPA (California Consumer Privacy Act) to keep your data in good order, there is a wider drive towards [centralizing the data function](https://snowplowanalytics.com/blog/2020/02/25/why-you-should-centralize-your-data/), where collection, processing and storage is overseen by an in-house data team. For these reasons, the shift towards data ownership is gaining momentum and is a key reason why many companies choose to build rather than buy their data infrastructure.


### Unmatched flexibility 

As customers demand more from their product experiences, it becomes even more important for companies to be in full control of their data set. This means the ability to define your events, set your own data quality rules and model your data according to your use cases, rather than trying to ‘fit’ with what a third-party vendor thinks is best for you. 

The freedom to track, manage and model your data in line with your business also grants the ability to evolve over time, updating data structures as new features are added to your product or website. Building your infrastructure yourself gives you unparalleled flexibility over your pipeline and overall data function. 


### No need to rely on others

Paying for data infrastructure requires placing trust in an external team to manage your most valuable business asset. While there are many trustworthy vendors to choose from, there’s always the risk something will go wrong – be it a data protection breach, a cybersecurity fail or the company going out of business.

Locking down your own infrastructure places your risk internally, which for some may be a better option than relying on external support. It also keeps technical expertise in-house, allowing engineers to learn from the building experience. 


## The challenges of building your own pipeline

Going your own way doesn’t mean you have to start from scratch. Open source projects like Apache Spark and Kubernetes will take you far, but there are still significant challenges to the self-build approach that you should consider before embarking on building your own pipeline.

Depending on your ambitions, it’s reasonable to expect self-built projects to take several months. Apart from development itself, it will take time to decide who owns the pipeline, which technology solutions to use, what data to collect, where to store data (e.g. in a data lake like Hadoop or a relational database like Redshift or BigQuery), and how the pipeline will be QA-tested. 

DIY pipelines are not ‘one-and-done’ projects. Once the infrastructure is assembled, it will require ongoing maintenance and upgrades to keep it operational and ensure it can keep up with your evolving business.

Building, architecting and maintaining reliable infrastructure is not easy. Even modest data pipelines can become multifarious and complex, relying on complex tech-stacks to operate. A few questions during the planning phase to consider are:



*   Is my pipeline optimized for data quality? How easy is it to identify data quality issues at source? Can these issues be rectified?
*   How can I ensure I’m taking advantage of the latest technologies?
*   Is my pipeline reliable? What happens when the pipeline breaks? How quickly can it be recovered? 
*   Can my pipeline scale? What happens when data volumes increase quickly and overloads my infrastructure? Have I considered the cost implications of increased load? 

Of course, each pipeline will come with its own complexities, and solving these challenges requires significant resources in terms of engineering time and expertise. 

The build-it-yourself route also requires planning and foresight. You will need to make a number of key decisions before you get started. These choices will have a critical impact on your wider business, and must therefore be made with other stakeholders in mind. Some major questions to consider before you begin might be:



*   Who is/are ultimately responsible for the data infrastructure?
*   What is the best approach to data collection and tracking?
*   What are my main data use cases now and in future? 
*   How long will it take for my team to evaluate, procure, test, deploy, and integrate my data stack before it becomes operational?
*   How will the data be shared with other teams and stakeholders?


## Pipeline maintenance is resource intensive  

Maintaining (that is to say, monitoring and upgrading) data pipelines is not always straightforward. Pipeline maintenance is an ongoing endeavor that requires a dedicated engineering team to maintain, not to mention if the pipeline breaks.

There are also important human factors to consider:



*   How can I ensure that my infrastructure is as intuitive as possible?
*   How can I keep the engineering team engaged during the build process?
*   What is my contingency plan if a key engineer is away while the pipeline breaks?
*   How can I ensure knowledge transfer so that the pipeline is operational if key engineers leave the organization?


## Not all bad news

There are several examples of self-built pipelines that have proven successful and reliable for their companies. The build-it-yourself approach offers control, ownership and flexibility that makes it a compelling choice for many data teams. 

But what if you could keep the advantages of a self-built pipeline without having to build and maintain it yourself?


## Get the best of both worlds with Snowplow Insights 

It doesn't have to be a binary choice between build vs buy. For those who want to own their data infrastructure without having to self-build, there is a third way. Snowplow Insights offers you a fully managed data pipeline, set up and hosted for you in your cloud environment of choice. 


### Snowplow vs build your own pipeline

 
 {% include shortcodes/ebook.html background_class="data-modeling-landingpage" layout="blog" title="Free white paper" description="Discover how you can leverage all the advantages of DIY infrastructure without having to self-build." btnText="Download White paper" link="https://go.snowplowanalytics.com/snowplow-vs-build_your-own_data_pipeline.pdf" %}


With Snowplow, you own all your data and data infrastructure, just as if you had built the pipeline yourself, while our dedicated team maintains, monitors and upgrades your infrastructure on your behalf. You’ll also get 24/7 support and advice on how best to scale and adapt your data infrastructure as your business evolves.

You also have full control and flexibility over how the data is collected and processed. You can define your own event structures, so that your data arrives in a clean, expected format ready to be consumed by data analysts and visualised in your favorite BI tools.

Your data also arrives in your data warehouse or data lake of choice, so you have visibility of the end-to-end pipeline. 

Compared: Snowplow vs self-build


<table style="text-align:center">
  <tr>
   <td><strong>Self-build</strong>
   </td>
   <td><strong>Snowplow Insights</strong>
   </td>
  </tr>
  <tr>
   <td colspan="2">Own all your data and data infrastructure
   </td>
  </tr>
  <tr>
   <td colspan="2" >Have full control and visibility over your data pipeline
   </td>
  </tr>
  <tr>
   <td colspan="2" >Ensure your data never leaves your cloud environment 
   </td>
  </tr>
  <tr>
   <td>Takes 3-6 months to build a deploy
   </td>
   <td>Can be deployed in as little as a day
   </td>
  </tr>
  <tr>
   <td>Evaluate and experiment with tooling until you find what works
   </td>
   <td>Take advantage of tried and tested technology that’s been iteratively improved over several years
   </td>
  </tr>
  <tr>
   <td>Dedicate 2-3 developers full time to build and deploy
   </td>
   <td>Benefit from our team of experienced engineers to deploy, monitor and manage your pipeline
   </td>
  </tr>
  <tr>
   <td>Research and troubleshoot challenges independently 
   </td>
   <td>Learn from and share with a growing community of customers, users and enthusiasts 
   </td>
  </tr>
</table>


For more information on Snowplow, please get in touch. 
