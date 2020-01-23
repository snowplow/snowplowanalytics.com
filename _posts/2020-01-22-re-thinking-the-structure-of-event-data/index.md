---
layout: post
title-short: "Structuring event data"
title: "Re-thinking the structure of event data"
description: "How to structure event data to maintain data meaning, data quality and data governance to derive maximum business value."
author: Cara Baestlein
category: Data insights
permalink: /blog/2020/01/22/re-thinking-the-structure-of-event-data/
---



## What is event data?

At Snowplow, we define event data as data that captures each action a user or service performs at a given time, with the relevant context. Obvious examples of event data would be a page view or a link click; but also opening an email, changing the channel on a smart TV, logging into a mobile app or moving a position in a call-center queue are digital events that can be captured. Events don’t need to be performed by humans either. For example, a server requesting or submitting search results can also be recorded in this way.


### Why is the structure of event data important?

Companies collect data to derive business value from it. Often, this means using data to better understand prospects and customers. At Snowplow, we believe that three factors are crucial for this purpose: 



*   Data meaning: The business understands the data.
*   [Data quality](https://snowplowanalytics.com/blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/): The business trusts the data and therefore the insights derived from it.
*   Data governance: The business can control who can collect or use what data, and how.

All three of these factors are impacted by the structure of the data, especially when companies capture large amounts of data. In order to explore how, let’s look at an example.


## Common ways to structure event data

Let’s consider what you are currently doing: reading this blog post on the Snowplow website. In order to get to this blog post, you might have viewed our home page, and then navigated to the blog. There, you scrolled until you saw an article of interest to you, and clicked on it. Now that you are reading it, you are probably scrolling here as well. When this activity is captured, it is represented as a stream of events. And this stream of events can be captured in multiple ways.


### Collecting events as unstructured data

The simplest way to capture events is in the form of unstructured JSON; key-value pairs are used to record the information that you would like to capture with each event. The table below shows what the activity described in the previous section could look like as unstructured events:


![unstructured-data](/assets/img/blog/2020/01/unstructured-data.png) 

The benefits and drawbacks of this approach are reviewed in the following table:

![unstructured-data-benefits](/assets/img/blog/2020/01/unstructured-data-benefits.png) 

### Collecting events following a fixed schema

Another common way to capture events, especially among packaged analytics solutions such as Google Analytics, is following a fixed schema; a finite number of columns is specified and can be filled for each event. The table below shows what the activity described in the previous section could look like as fixed-schema events:

![fixed-schema](/assets/img/blog/2020/01/collecting-events-fixed-schema.png) 

The benefits and drawbacks of this approach are summarized below:

![fixed-schema-benefits](/assets/img/blog/2020/01/fixed-schema-benefits.png) 

## What would an ideal solution look like?

Considering the benefits of the two approaches discussed above, as well as the three factors we deemed crucial to the success of using the data successfully (data meaning, data quality and data governance), we can come up with the following criteria for an ideal solution:



*   We want to maintain the flexibility of the unstructured approach.
*   We also want to achieve the predictability of the fixed-schema approach.
*   We want data to be descriptive so that its consumers understand what it means, and we want that meaning to persist over time. 
*   We want to develop a way for data consumers (and other stakeholders) to be able to enforce requirements for the data. 
*   And we want to be able to easily change what data we capture (and how) over time.


## How we structure data at Snowplow

At Snowplow, we use self-describing, versioned data structures (schemas) to collect event data. They are stored in a machine-readable schema repository called Iglu (you can find more information about it [here](https://github.com/snowplow/iglu#iglu-schema-repository)), which the data collection pipeline can talk to. Specifically, the pipeline uses the schemas to validate the data, as well as load it into tidy tables in the data warehouse. 

![diagram](/assets/img/blog/2020/01/diagram.png) 


## Using self-describing schemas

Going back to our example, let’s take a look at what one of the events would look like captured using self-describing schemas. Specifically, let’s consider the scroll event, the last event in our example. The JSON schema for this event would look as follows: 


![schema-2](/assets/img/blog/2020/01/schema-2.png) 


The “self” section at the top captures the event name, who authored the event, what format the schema has and what version of the event it refers to. Together, these four properties make up the schema key that will be referenced in the tracking code, and based on which the pipeline will look up the schema in the Iglu schema registry. 

For every property in the event, validation rules can be imposed on data type, and depending on the type, further rules on that type can be imposed (such as size). A description can be added to explain what the property means. And properties can either be optional or required. All of these rules will be validated by the Snowplow pipeline. 

However, we have forgotten some information that was captured with the scroll event previously. Therefore, with the scroll event we would want to send an article entity. An entity is a collection of properties that can be sent with an event, but are separated out so that they can be used across events, and often represent an actual entity such as a user, a page, a product, or in this case, an article. The schema for the article entity would look as follows:

![schema-1](/assets/img/blog/2020/01/schema-1.png) 



The same article entity can also be sent with page view and click events where appropriate. This ensures the same information is captured consistently across events. The schema for an entity follows the same logic as that for an event; however, the corresponding JSON object will be added differently in the tracking code. Specifically, this is how the scroll event with the article entity would look implemented via JavaScript: 

![schema-3](/assets/img/blog/2020/01/schema-3.png) 


And this is what this event will look like in the data warehouse: 

![single-event](/assets/img/blog/2020/01/single-event.png) 


Let’s review this solution against the criteria for an ideal solution we came up with before: 



1. We want to maintain the flexibility of the unstructured approach.
  * _This approach is incredibly flexible, as there are no restrictions on the custom events and entities designed, neither in number, combinability or number of properties._

2. We also want to achieve the predictability of the fixed-schema approach.
 * _This approach produces data of highly expected structures, as all data structures are schema-d in advance._ 



3. We want data to be descriptive so that its consumers understand what it means, and we want that meaning to persist over time. 
   * _Aside from the events and entities (as well as their properties) being descriptive, descriptions can be added to both to effectively maintain data meaning._
4. We want to develop a way for data consumers (and other stakeholders) to be able to enforce requirements for the data.
   * _Requirements are enforced via the validation in the data pipeline, which is based on the schemas data consumers and developers have to agree on upfront._
5. And we want to be able to change what data we capture (and how) over time.
   * _Semantic versioning allows for change without compromising on any of the above._



## Summary

Structuring event data using self-describing, versioned schemas allows you to maintain data meaning, data quality and data governance. We at Snowplow believe that these three factors are crucial in deriving real business value from your data. Specifically, they ensure that you can socialize the data around the organization as there is a common understanding of what it means, your business trusts the data, and therefore the insights derived from it, and you are able to control what data is collected, and who can access it. These factors are the foundation of becoming a data-mature company, where all decisions (whether taken by a human or machine) are informed by data. 

If you are interested in learning more about how we work with our customers in designing and implementing their data collection strategy, get in touch with us [here](https://snowplowanalytics.com/get-started/). 

