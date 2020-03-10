---
layout: post
title: "Why data collection is key to your data strategy - Part two"
title-short: "Why data collection is key to your data strategy - Part two"
description: "Part two in a series on data collection and how it forms the foundation of your data strategy"
author: Erika
category:  How to guides
permalink: /blog/2020/03/10/why-data-collection-is-key-to-your-data-strategy-part-two/
discourse: false
---
# How to do data collection right

_The second in a two-part blog series on data collection, and how, if done properly, it forms the foundation of your data strategy_.

Doing data collection right puts data front and center, as it should be, given its strategic importance and high value. The way you secure data, share it, protect its value, and fundamentally, collect it demonstrates your respect for the trust users have shown in sharing their data in the first place. At a time when consumer trust in organizations is eroding, suspicion about data collection is growing, and regulations are beginning to impede what data analytics vendors can do with data, preserving trust and handling data respectfully has never been more important. 

We know that data collection is not easy, and doing it right is even more challenging. Heads of data and their data teams frequently tell us that they struggle with the governance of collecting data. That is, how should they govern all the activity around data collection? How can they ensure consistency and better standardization in data collection? How should they define the nitty-gritty of how they collect data? Who is responsible for or should own each aspect of data collection? These are tough questions, and the shape of this process is evolving to meet changing needs. Part of the data collection equation is cultural, that is, it is focused on who works with data and how, and what they want to accomplish. But without two key things -- _the core that is data collection, and the confidence you have in that data_ -- the journey to an effective data strategy is an exercise in futility.

Confidence in data begins in [how you collect ](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/)it. We discussed the strategic business imperatives of data collection in the [first blog post in this series](https://snowplowanalytics.com/blog/2020/02/25/why-data-collection-is-key-to-your-data-strategy-part-one/). In the second post, we will dig into the hands-on work of what you need to do to collect data properly. 


## Best practices in data collection: the Snowplow way

Right out of the gate, let’s state that we’re broadly defining best practices in data collection as the Snowplow approach to data collection. It’s not that there are not other ways to collect data, but we happen to believe that your having **_ownership_ and _control_ of your data infrastructure** are cornerstones of successful, long-term data strategies and effective data governance. Organizations with long-term interests in advanced data analytics use cases require not just the sophistication of a future-proof and extensible data stack, but also the ability to make decisions about data management. 

Whether it is a matter of deciding how and where to store your data, or wanting to avoid vendor lock-in, or determining how to structure incoming data and your own data tracking attributes and policies, some proprietary analytics solutions are little more than black boxes that offer little or no transparency over how your data is handled. To have complete control, you need your own infrastructure and data pipeline and the ability to collect data your own way to perform the kinds of analysis you want to do.


## How to collect reliable, understandable and easy-to-use data

In our previous post, we highlighted data ownership, [data quality](https://snowplowanalytics.com/blog/2020/02/12/what-is-data-quality-and-why-is-it-important/) and reliability, data understandability, and data ease of use as the pillars of proper data collection. In this post we will go into greater depth about a few of these points as they pertain to techniques and processes for collecting high-quality data: reliability, understandability and ease of use.


### Collect for data reliability

Nothing will ever be 100 percent reliable, and ensuring data reliability is no exception. Still, building confidence in the reliability of data is in part down to the quality of the underlying event data. To get as close as possible to having complete and accurate data, your data collection can be set up to ensure:



*   **[Auditability](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#auditable)**: Each processing step can be broken down, and repeated/reprocessed as needed, to check the input and output at each step to both build confidence in the reliability of the data, and potentially identify missteps in the collection that compromised the data.
*   **Complete/[non-lossy data](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#non-lossy)**: In the data collection process, data loss – that is, data that does not make it through the pipeline – is a common problem. The “failed” data should be retained and redirected for further investigation, and reprocessed if deemed necessary. It’s hard to ensure that your data set is complete if some of it disappears entirely without allowing you to verify it.
*   **[Precision metadata](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#precision)**: Data cannot tell us everything, and even if we had complete and accurate data about an event, it cannot tell us, by itself, everything we need to know. We need context to understand or measure things with greater precision. This is why metadata generated with Snowplow data can nuance to our assumptions..


### Collect for data understandability

At its most basic, data reflects what has happened in the world. We collect qualitative and quantitative data to understand why and to what degree things are the way they are. Thus making sense of, and understanding, data relies on its lining up with human logic, and how our mental representations of events work. Easy-to-understand data:



*   **Reflects human logic/[mental construction](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#natural-representation) of what happened**: Data should be structured to mirror how we think. Data collection will be individual to a specific company because each company’s relationship with its users is different. Collecting and structuring data to align with how data users think about user journeys makes data easier to work with for the team using it.
*   **Includes [contextual metadata](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#metadata)**: Given the massive size of modern data sets reflecting countless data sources from multiple processes, housed in multiple places, it’s useful to bundle the data you collect with its contextual metadata. This metadata can describe what the data is, and how and under what conditions it was generated and processed. Structuring and packaging the metadata with the data itself adds value to the data, particularly in the long term, because it provides more information and insight.


### Collect for data ease-of-use

Is your data ready to go, plug-and-play, and analytics-ready? Does your data help your data team avoid time-consuming, onerous data preparation and cleaning work? In a nutshell, is your data easy to use? Our take on what makes data easy to use is that it is:



*   **[Highly structured](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#structured)**: We’d argue that part of collecting good data is making sure that the data you collect is structured, made up of clear and well-understood properties, so that data analysts, data scientists, data engineers and any other data consumers are able to work with the data seamlessly.
*   **[Rich](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#rich)**: You are able to answer both broader, and more detailed, questions if you have captured rich data. This means being able to enrich and enhance your data collection with additional first and third-party data points and data sets. It takes some effort but pays dividends in terms of the usefulness of the data.
*   **[Systematically modeled](https://snowplowanalytics.com/blog/2017/01/16/data-collection-the-essential-but-unloved-foundation-of-the-data-value-chain/#systematically-modeled)**: Creating usable data sets that can be easily visualized and socialized across a business is one of the key end products of good data collection. Using [event data modeling](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/), that is, applying business logic and assumptions to raw data, is the process that makes this possible. Because the business logic usually changes over time, or with changing business questions, it’s important that the data be “re-modelable”. We believe that event data modeling is only growing in importance, as companies begin to break away from standard modeling offered within packaged solutions like Google; investing time and effort into custom modeling does require more upfront effort, but yields results more specific to your business and data challenges and more suited to advanced analysis, rather than inflexible reporting tools.


## March to the beat of your own data: Build precision data collection into your data strategy

What we’ve outlined here is a great starting point, but getting data collection right is an ongoing process - technically and culturally. As business objectives change, so too do the demands made on your data. Will your data collection approach and tools evolve with and scale for these new demands, questions and use cases? Will it enable greater precision in data collection to match up with more targeted analytics goals? We believe that by embracing data collection as a strategic activity, organizations stand to forge ahead with meeting the challenges posed by new data sources, types of data, and custom data modeling needs while driving greater value from the data they collect.

Not every company needs this level of control and detail right now, but many do, certainly as enterprise data use cases become more sophisticated. Many organizations run into _durability_ problems, and the solution that meets their needs now may have limited applicability or extensibility as they outgrow their previous data requirements and don’t have the flexibility to expand, or because new regulatory restrictions make it much more difficult to derive reliable insights using third-party tools. Taking ownership of and directing the collection of your own data will ensure that you don’t end up at a data dead-end. 

Snowplow is designed to help companies achieve all of the above on their own terms. Snowplow’s flexibility lets you march to the beat of your own data, drumming precision into your current data strategy while keeping the pace for inevitable shifts, pivots and growth in your business. 