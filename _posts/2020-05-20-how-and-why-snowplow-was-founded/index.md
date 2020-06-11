---
layout: post
title: "How and why Snowplow was founded"
description: "How Alex Dean and Yali Sassoon launched Snowplow"
author: SimonP
category: Inside the plow
permalink: /blog/2020/05/20/how-and-why-snowplow-was-founded/
custom-cta-title: Snowplow is now a 65-person strong dedicated to empowering data teams all over the world.
custom-cta-sub-title: Click here to learn more about how Snowplow can power your data journey. 
custom-cta-link: get-started/
custom-cta-link-text: Get started
---

Snowplow’s inception is the story of two data enthusiasts whose frustration with packaged analytics products sparked them into creativity. Their aim was to be free to ask whatever questions they wanted of their data, without the limitations of restrictive tools, and to enable companies to drill deeper into their behavioral data sets. 


> **“The first version we made in a day – it was really hacky. We spent the next day blogging about it and putting together documentation about it so other people could understand what we were doing – because we thought it was really cool.”** - **_Yali Sassoon, CPO, Snowplow_**


Their passion for data collection transformed from side-project into a VC-backed platform powering data delivery for enterprise data teams. But it didn’t happen overnight. in fact, Snowplow has been a journey spanning several years, product iterations and new team members.   

<br/>

*The timeline:*

**2012** – First version of Snowplow is made available on GitHub

**2013** – Snowplow launches support for loading data into Amazon Redshift 

**2014** – Snowplow schema’ing tech (Iglu) is released, Snowplow expands to support real-time processing and the first full-time team member is hired 

**2015** – First Snowplow Meetups held in London, Berlin, San Francisco and Sydney. Commercial version of Snowplow, Snowplow Insights, sold to first customers

**2016** – Launched SDK for building real-time apps on top of Snowplow data. Meetups held in New York, Amsterdam, Tel Aviv, Budapest and Boston

**2017** – 100th customer signs up to Snowplow Insights. Company Away Weeks take place in Berlin and Prague

**2018** – Snowplow launches native support on Google Cloud Platform and team grows to 35 Snowplowers

**2019** – Snowplow announces £4m Series A funding with research-led VC firm, MMC Ventures

**2020** – The team grows to 60 Snowplowers, Snowplow’s JavaScript Tracker becomes third-most adopted web tracker in the world


### Brave new world

In the wake of the global financial crisis in 2008, Snowplow founders Alex Dean and Yali Sasson began working as consultants, advising businesses on how to maximise the value of their customer data. After founding Keplar LLP, Alex and Yali were consulting for companies such as Jack Wills and V&A museum on how to drive value from their customer data. But what started out as a world focused on offline data from point of sales (POS) and enterprise resource planning (ERP) systems was turning to devices and computer screens. 


> **“In 2012, mobile was kicking off and the web was getting more interactive. It felt like more of our lives as digital citizens were being mediated through digital platforms”** - **_Yali_**


 

In the new world, people were living increasingly digital lives. Digital applications changed not only how consumers buy things but how people were spending their time, how they were collaborating, how they were managing their careers and even how they were falling in love. Suddenly a vast amount of behavioral data was becoming available, describing all aspects of our lives - but the only tools available to question the data were extremely limited. 

> **“Our clients wanted access to more digital, online data, referred to at the time as ‘clickstream’ data – essentially web analytics”** - **_Alex Dean, CEO, Snowplow_**


Despite the opportunity to take advantage of the new digital data, the only analytics tools available at the time were packaged solutions like Google Analytics and SiteCatalyst, developed by Omniture (now Adobe Analytics). For Yali, logging into Google Analytics (GA) was disheartening, because the data’s potential was hindered by the restrictions of GA: “I thought, here’s this really exciting pot of data, but it’s trapped inside these tools and I, as a data analyst, wasn’t allowed to ask the questions I wanted of the data”. GA and other vendors had predetermined how data was being collected and modelled, heavily informed by classic e-commerce examples. For businesses looking for answers to complex questions, or for businesses that didn’t conform to the standard e-commerce model, this wasn’t enough.

Yali and Alex needed a way to answer more questions of their data, without being hindered by the limitations of these packaged tools. They needed to capture raw, unprocessed data which they could then process and model on behalf of their clients. With no clear solutions on the market, it was evident they would have to build it themselves. Thankfully Alex and Yali had experience building data infrastructure at a previous company, OpenX, so they got to work piecing together their own data pipeline. 

At that time, two new technologies emerged that changed the data landscape completely: Hadoop, which made it possible to collect and process event-level web data and Amazon Web Services (AWS), which made this operation achievable in a cost effective way.

> **“We thought: wow, we can take this amazing new tech, spin up any computing resource we need at any time and bring that to bear on this amazing behavioral dataset”** - **_Yali_**


### Why open source?

Building a business was not front of mind for Yali and Alex at the time. It was about building an alternative way to collect granular, [event-level data](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) without being held ransom by packaged analytics tools. Especially important was the sense of ownership – a belief that everyone should be able to collect their own data. This passion was behind the decision to open source the technology, to enable other data professionals to collect and own their data and data infrastructure.  

> **“A lot of people were building SaaS products at the time, but we didn’t want to do that. We made it open source to open it up for others and to share what we were building.”** - **_Alex_**


At first, as Yali recalls, the response was muted – “we published loads of stuff in those days and most of our stuff was ignored!”. But steadily data engineers caught on, especially the ‘data MacGyvers’ of the time, the one-person data-teams who were beginning to experiment with different tools to make data work for their companies. 

The early versions of Snowplow were not for everyone. It was tricky to set up, but it struck a chord with the ‘MacGyvers’ who had the right combination of engineering experience and analytics savvy to put the data to use. This gave Yali and Alex an idea – to supply customers with their own Snowplow pipelines as a managed service, deployed in their clients’ own cloud environment. It would offer the best of both worlds, enabling data teams a chance to own and control their data, without having to spend months building their own infrastructure. The service ultimately became known as [Snowplow Insights](https://snowplowanalytics.com/products/snowplow-insights/).

By the time Amazon launched the data warehouse, Redshift, Snowplow’s open source community was beginning to flourish and contributions were coming in from Snowplow enthusiasts. With a growing number of customers signing up to Insights, Alex and Yali were able to work on developing Snowplow full time and eventually hire their first employee. 

> **“At the time, we thought we were disrupting the market...but we were being disruptive in a different way. We were defining a new category, creating a toolkit for these emerging data teams.”** - **_Alex_**


### The data industry shifts gears 

Snowplow started to resonate with a new generation of data professionals who wanted more from their data. Over time, the ‘[data team](https://snowplowanalytics.com/blog/2020/03/10/how-do-you-structure-your-data-team/)’ emerged, comprised of data scientists, engineers and analysts who were hungry to capture more granular data, and willing to experiment with new tools like Snowplow to empower unique use cases. 

> **“The industry really did start to shift in the direction of owning your data and not letting a vendor dictate what your data structure should look like. We didn’t make it happen, but we were part of the wave.”** - **_Yali_**

The industry shifted towards data ownership, as more companies committed to building a [high-quality, central data asset](https://snowplowanalytics.com/blog/2020/02/25/why-you-should-centralize-your-data/) as a driving force in their organization. The release of privacy protocols such as Safari’s[ Intelligent Tracking Prevention (ITP)](https://snowplowanalytics.com/blog/2019/12/16/how-itp-2.3-expands-on-itp-2.1-and-2.2-and-what-it-means-for-your-web-analytics/) further emphasized the need for reliable, first-party data capture. And as the word spread about Snowplow, Alex and Yali held Meetups in cities around the world to encourage the new approach to data collection. 

Other changes were incremental. Snowplow expanded beyond web analytics to capture data from mobile, desktop and IoT sources with over 16 different trackers.  Snowplow became available to run natively in Google Cloud Platform and pioneered a schema registry system called [Iglu](https://github.com/snowplow/iglu) (an open source project in its own right) to ensure consistent data structures, Snowplow enabled data teams not only to collect data, but also to handle the wider challenges of data delivery. These features would prove vital for data professionals who were using data to power diverse and intricate use cases.

> **“We still champion the data MacGyvers, it’s just the MacGyvers have grown up!  ”** - **_Alex_**



### Snowplow today

The data landscape has exploded and many teams have matured in their approach to capturing and handling data, a discipline many refer to as ‘[data ops](https://www.gartner.com/en/information-technology/glossary/data-ops)’. Where technological challenges have diminished, people challenges have surfaced instead. Today, delivering data has a lot to do with instilling the right [‘data culture’](https://snowplowanalytics.com/blog/2020/02/04/building-a-data-quality-culture-and-data-ownership-at-omio/) and ensuring alignment between cross-functional teams. The modern world demands more from data, and as companies increase their investments into their data assets, tools like Snowplow play an integral role in empowering data engineers. 


> **“The interesting thing that everyone wants to do is to use AI to use data to drive future decision-making. That is still something that’s really hard, so I’m still interested in helping the whole industry move to a world where companies can do that much more easily.”** - **_Yali_**

Over the horizon lies another huge challenge. Data has traditionally been a retrospective tool for analyzing past events, but the idea of ‘forward-deploying’ data in the future is the holy grail for many companies. There is still a long way to go, but Snowplow has come a long way from the side-project that started eight years ago. Much has changed in the data industry and the wider world, but Yali and Alex remain committed to equipping modern data teams with the tools they need to succeed.


