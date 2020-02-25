---
layout: post
title-short: Why data collection is key to your data strategy - part one
title: "Why data collection is key to your data strategy - part one"
description: "How you collect data forms the foundation of your data strategy "
author: Erika
category: Data governance
permalink: /blog/2020/02/25/why-data-collection-is-key-to-your-data-strategy-part-one/
---

_The first in a two-part blog series on data collection, and how, done properly, it forms the foundation of your data strategy_.

How do you actually get all the data that populates your data platform and feeds your analytics use cases? That’s right — you have to collect your data somehow. It is becoming increasingly important to pay attention to and make active decisions about _how_ your data is collected. Why? Because the data collection process itself may determine a lot about the data quality you end up with, how much you can do with the data you collect, and how accurate the predictions and insights you make are. 

Once upon a time, _no one_ talked about how they collected data, or acknowledged the importance of the data collection process. As use cases have grown more sophisticated, and organizations have begun to understand the importance of owning their data and controlling for data quality, once-ignored data gathering practices are becoming - or should be - a focal point for steering data strategy.  

We’ve been [beating the data collection drum](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/) for a long time, and while keeping the rhythm going has at times been difficult, the beat is starting to be heard more widely.


## Why data collection matters

You wouldn’t start a military campaign by marching untrained troops into battle, would you? No. The same is true of analytics; you can’t run an analytics function without a data strategy. Analyst firm [Forrester argues that up to 73% of data goes unused for analytics](https://www.inc.com/jeff-barrett/misusing-data-could-be-costing-your-business-heres-how.html); this is arguably because the data strategy is not clear, and data is being collected en masse without clarity as to why it’s collected or how it might be used. Most kinds of organizations need a strategy, underpinned by administrative, logistical and resource planning directives. Your data strategy is not that different. 

Achieving your business goals and strategic aims, and in fact determining these aims, is driven by the data you have, want to have -- and how you collect that data. In essence, you are “training” your data collection process(es) and the organization as a whole to understand that the foundation of data strategy depends on doing data right, which starts with how data is collected. 


### Own your data 

Regardless of how many data sources, types of data and data collection tools you use, one of the fundamentals of your approach to data collection is [owning your own data](https://snowplowanalytics.com/blog/2019/02/05/how-data-ownership-makes-you-a-more-effective-data-scientist/). If data is as valuable as you (and we) think it is, and is both an asset and a competitive advantage, data ownership, and the way you collect and process it, is essential. Taking control of your data is one of the best ways to make sure you not only own the data but have the freedom and flexibility to process and use data to derive business value from it. 

Owning your complete, raw data and deciding how to process it (e.g., for example, selecting the data pipeline that lets you collect and process data the way you want to) means that you have flexibility over how and what data you ingest, where you store your data, and the use cases you can apply -- and indeed questions you can ask of the data -- both now and in the future. Owning the end-to-end data collection process and underlying infrastructure clears the way to:



*   collecting whatever data you want in the format you want within your own infrastructure; deciding what you want your data to look like
*   traceability and auditability of your data through your pipeline back to when it was created
*   better oversight and compliance with data governance regulations, such as GDPR and CCPA; companies are required to take more responsibility for the data they collect, and show accountability and justification for why and how they store user data and what they do with it.  
*   enabling first-party data collection and tracking; because you are collecting data from your own properties, you avoid the problems many third-party analytics tools encounter as browser makers crack down on third-party tracking
*   accessing your raw, unopinionated data for custom data modeling, usability across use cases and the ability to return to the data to query with new questions or audits
*   flexibility to plug data into any environment or tool and freedom from supplier lock-in and their product roadmap and feature changes
*   ensuring data quality, i.e., accuracy and completeness, not just collecting aggregated data samples or pre-determined forms of data, to be able to ask more complex questions.


### Get high-quality data you can rely on

Most companies have at least some of their own data, but there’s only so far they will be able to go with it because it lacks the level of quality required for advanced applications. Going beyond basic reporting and analysis, actionable insights come from data assets that can deliver accuracy and completeness. In addition to forming the basis for business decision making, high-quality data is essential for more sophisticated and real-time data initiatives, such as personalization, fraud detection, and machine-learning and AI applications. 


#### How do we define data quality?

What is [data quality](https://snowplowanalytics.com/blog/2020/02/12/what-is-data-quality-and-why-is-it-important/)? At the most basic level, good data is reliable. Reliable data can be trusted to perform data analysis and make informed decisions. 

Drilling down into what “reliable” means, we’ve defined the foundations of [“data quality” as “accurate” and “complete”](https://snowplowanalytics.com/blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/). 



*   **Accurate data**. Accurate data must reflect an accurate account of what has happened. For example, if the data suggests that a user viewed item A, we need to be sure that the user was, in fact, looking at A. Data precision also fits under this umbrella; that is, precise data will indicate, for example, that a user viewed an article for two minutes and 10 seconds -- it will not just be rounded down to two minutes. Accuracy helps data analysts easily understand and work with the data, leading to more accurate insights based on that data.
*   **Complete data**. Complete data should deliver a complete picture of events that occurred from a complete data set without missing data. Whether event tracking failed or an event failed to be tracked in the first place, or new tracking restrictions begin to limit the data flowing in, ensuring complete data has always been -- and continues to grow increasingly -- difficult.

The data-quality gap often arises because data has not been collected properly in the first place. To get good, high-quality data, the first step is putting in place the processes and systems that generate, collect and store good data. In the past, we’ve compared the importance of good data to building a solid foundation for a house. But it’s also similar to the military (or any high-performing team) analogy we made earlier. Good data must guide the strategy, but to build the strategy, you also need to know what resources you’re working with. Your data collection process will treat unstructured data much like the untrained army we referenced earlier: you need to provide the structure to make sense of and direct the actions of the data (or the army or team).


### Make data understandable and easy to work with

Making data understandable and easy to work with requires understanding the context in which data exists in order to make sense of it. 

Good data does not exist without surrounding contextual information, which in data collection often refers to metadata generated when the data itself is collected. Imagine that we’ve collected event data to try to understand a user journey. We can’t fully understand the journey without understanding the events as they relate to each other. This context should also be factored into data collection. 

In addition to the points outlined above, part of why data collection is important is the ability to ensure ease of use. Can you plug your collected data into different analytics tools for analysis? Can you avoid time-consuming, onerous data preparation and cleaning work, i.e. time wasted for data teams? Easy-to-use data is structured data. Can you take steps upfront to define your data collection to ensure that downstream data analysis can be done? If data isn’t easy to work with, what is the likelihood of its being used? These are the questions you should ask if you want to evaluate the true quality of your data. 


## Business strategies and planning for good data collection


### Develop a data collection plan

Before you start to gather data, there are key planning considerations to feed into a good data strategy. These include



*   understanding before you start to collect data what questions you want to answer 
*   determining the type and amount of data needed to answer these questions, whether it exists or needs to be collected
*   determining how the data will be collected and from where/what data sources

This plan will vary, of course, but it is important to align these considerations before you start data collection. You may be tempted to ingest every kind of data you can, dump it in a data lake, and sort it out later. But this is not only time-consuming and ineffective, it runs afoul of best practices in the use of data and is precisely the kind of behavior that has led to mistrust. First and foremost, be thoughtful and judicious about what data you collect and your methods of data storage. 


## Precision data collection: The foundation of your data strategy

Developing a successful data strategy relies on the wisdom to understand that data collection should be as precise an operation as possible. Your organization’s data is one of its most valuable resources, and it depends on [retaining customer trust](https://techcrunch.com/2019/10/10/your-mass-consumer-data-collection-is-destroying-consumer-trust/) and fostering good customer experiences. Thus “precision data usage”, as enabled by responsible data collection methods and data management, will bring far greater long-term value to your business. 


> **“It means striving to collect only the consumer data that you really need to give equal or greater value back to your customer — and protecting it. It means no more selling, sharing and buying user data. It means being transparent about your marketing practices. Doing so will take your focus off data collection for the sake of data collection and put that focus where it belongs — on understanding your customer’s needs, delivering them more and more value and regaining their trust and respect.”** - **_from [TechCrunch, “Your Mass Consumer Data Collection is Destroying Consumer Trust”](https://techcrunch.com/2019/10/10/your-mass-consumer-data-collection-is-destroying-consumer-trust/)_**


The ability to collect and define once but reuse to meet future needs turns your data into a multi-purpose and sustainable asset that fits into a long-term data strategy rather than an ad hoc commodity with a limited shelf life. As challenges to data use and compliant interaction with users’ personal information amass, we want to help you look comprehensively at your data collection to support your sustainable data strategy. 

In the second part of this blog series, we will dive deeper into the hands-on work of defining and building your dedicated data collection process. This first post aimed to lay the groundwork for understanding the strategic business imperative of doing data collection right, and in the next we will look at what you need to do to get there. As we alluded to earlier in this article, not every analytics solution manages data collection in the same way. We will outline what we believe to be a best-practice approach (which is the Snowplow approach) and explain the steps for putting processes and systems in place that will keep the rhythm of your data collection in step with your data strategy.



