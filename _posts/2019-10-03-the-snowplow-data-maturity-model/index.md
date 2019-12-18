---
layout: post
title-short: "The Snowplow Data Maturity Model"
title: "The Snowplow Data Maturity Model"
description: "This article shares our perspective on data maturity, and the five distinct stages we’ve identified in the journey."
author: Lyuba
category: Data insights
permalink: /blog/2019/10/03/the-snowplow-data-maturity-model/
---


![data-quality-model](/assets/img/blog/2019/10/data-maturity-model.png) 
 

As a business grows and expands its data strategy, it passes through different stages of data capability, or maturity, on its way toward becoming fully data informed. Data maturity can serve as a useful tool for businesses to measure where they are along the data journey, identify next steps and potential challenges or roadblocks. 

Companies including [Dell](https://www.cio.com/article/3077871/the-four-stages-of-the-data-maturity-model.html) and [Periscope](https://www.periscopedata.com/blog/what-is-data-maturity) have already developed insightful definitions of data maturity. At Snowplow, thanks to our work with a diverse customer base, we’ve also aimed to define data maturity to better understand existing and potential customers, their pain points and how we can help them achieve their data goals at each stage. This article shares our perspective on data maturity, and the five distinct stages we’ve identified in the journey.


## Snowplow’s definition of data maturity

To define what data maturity means at Snowplow, we looked at how our customers have evolved along their data journeys, as well as researching and interviewing data teams from other businesses. The result was a Snowplow data maturity model divided into five stages. Each stage aims to describe the current state of the company’s data strategy, key data and analytics challenges, and what the data team looks like.


![data-quality-defenition](/assets/img/blog/2019/10/data-maturity-defenition.png)



### Stage 1: Data Aware

A Data Aware business is in the earliest stages of defining its data strategy, with a few analysts spread across different teams. A business in this stage does not yet have a data warehouse as there’s no urgent need to store or join data sets from different  sources. While some standardized reporting is used, the data and reports are siloed, with ad-hoc spreadsheets and Google Analytics able to handle most of the company’s use cases. 

The main challenges at this stage are limitations around resources. For example, limited budget to build out a data team or invest in more sophisticated data technology. Moreover, the business has yet to define their goals around data, and get the right processes in place.

As a business moves into the next stage, it defines key uses cases that go beyond what they are currently able to do, and starts to set the foundation for more data-informed projects by making strategic investments into building out a data team, and acquiring the tech needed to make data more accessible across teams. 


### Stage 2: Data Capable

At this stage, a business starts to warehouse some of its data, usually backend, ERP or CRM data, and adopts an analytics platform for wider reporting and analysis. The data capability now supports A/B testing, allowing teams to drive marketing and product improvements. Data starts to gain more traction in the business and guide decision-making within specific teams.

The data team has grown into a small team of analysts, often with (data) engineers contributing to the team as well. In some businesses, a “data evangelist” takes charge of introducing new ideas and winning support from stakeholders and other teams for new data initiatives. As a result, successful data use cases appear, but they still tend to be siloed within teams without getting wider adoption or recognition or proper buy-in from the management and C-suite.

By now, a business is already seeing the benefits of moving to a more data-centric approach. However, analysts still get bogged down preparing and cleaning data instead of deriving actionable insights. Moreover, there is low trust in the [accuracy or completeness](https://snowplowanalytics.com/blog/2019/09/09/how-to-optimize-your-pipeline-for-data-quality/) of the data, with no “single source of truth”, which makes data management difficult. The data team might also start to notice the limitations of its analytics platform, which is a good indicator that the business is ready to move to the next phase of data maturity. 


### Stage 3: Data Adept

The data team has grown into a team of data analysts, scientists and data engineers. It might be centralized, with a Head of Data, or decentralized with analysts, data scientists and engineers working as part of other teams. At this stage, companies start moving away from pre-packaged analytics solutions, such as Google Analytics and Mixpanel, to gain more flexibility, create a single source of truth, and build custom models e.g. for better marketing attribution. This is also when data teams start experimenting with machine learning models and applying supervised ML models to historical data.

As a business collects higher volumes of data and expands its use cases, it starts to notice challenges around data governance and compliance, as well as keeping the data infrastructure running smoothly. Additional challenges include modeling data across the organization and creating a shared data strategy across the business. 


### Stage 4: Data Informed

As a company reaches this stage, the data team has grown significantly, with several data team leads managing dedicated data teams. The main characteristic of a company in the Data Informed stage, is that it uses data to [build data products](https://towardsdatascience.com/designing-data-products-b6b93edf3d23), such as real-time recommendation engines. However, deploying machine learning models across the business to achieve more tangible business benefits remains a challenge, largely because data teams [struggle to get high-quality data](https://www.wsj.com/articles/data-challenges-are-halting-ai-projects-ibm-executive-says-11559035800).

Data Informed companies continue to face challenges around data governance and compliance. On top of that, with data now embedded in decision-making and products, maintaining the data infrastructure, and optimizing the data strategy becomes critical. For example, Data Informed businesses begin exploring multi-cloud strategies as a way to gain more flexibility to choose where and how to deploy workloads and avoid vendor lock-in.


### Stage 5: Data Pioneers

We’ve used the term “Data Pioneers” to describe companies like Netflix, Amazon or Airbnb that are pushing the limits of what is possible with big data. Data Pioneers create highly personalized experiences for each user, which is often achieved by operationalizing machine learning in real time. At this stage, data drives the company forward and the focus moves to automating and maintaining the data infrastructure so each step runs smoothly, with data that is easy to use and discover throughout the organization. As a result, the data teams become more engineering heavy, with data engineers and infrastructure engineers building out new tools and maintaining existing technology. 

The key challenges for Data Pioneers are around people and technology; it is hard to find people with the right skill set. What’s more, Data Pioneers have to build out most of their own data infrastructure because what they need is not available on the market. Data governance and security remain key challenges as well.


### Where Snowplow sits on the data maturity curve

As an enterprise-strength data pipeline, Snowplow provides the most value for companies in the Data Adept and Data Informed stages. For companies in the Data Capable stage who want to build out their data infrastructure, but don’t have all of the necessary resources in place yet, we recommend working with a consultancy or [Snowplow partner](https://snowplowanalytics.com/partners/). In our view, this is the best way to move quickly up the data maturity curve and improve your analytics capability.

Once a business moves higher up the data maturity curve, and starts to notice the limitations of their analytics platform(s), they will want to gain more control, ownership and flexibility to customize their data infrastructure to their specific business needs.

Moreover, many businesses realize they need to increase the accuracy and completeness of their data to power business critical reports and data products. At this point, some companies choose to invest engineering resources into building their own data pipelines, while for others, a managed data pipeline, such as Snowplow, is a better fit. 


### Conclusion

Every business is different, which means no two data journeys are the same. The Snowplow data maturity model is meant to provide a framework businesses can use to better understand their own data journey, and how they can solve existing challenges to gain more value from their data. If you’d like to find out how Snowplow can help you on your data journey, [get in touch with us here.](https://snowplowanalytics.com/get-started/)