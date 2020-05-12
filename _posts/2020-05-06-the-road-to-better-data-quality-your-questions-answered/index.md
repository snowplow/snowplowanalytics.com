---
layout: post
title: "The road to better data quality - your questions answered"
description: "We spoke to Yali and Christophe to get all your great questions answered"
author: Franciska
category:  Data insights
permalink: /blog/2020/05/06/the-road-to-better-data-quality-your-questions-answered/
discourse: false
---


Snowplow recently hosted a webinar where Yali Sassoon, Co-founder and CPO at Snowplow, and Christophe Bogaert, Co-founder at [Tasman Analytics](https://tasman.ai/), addressed some of the challenges companies are facing around data quality with regards to behavioral data specifically, and what we can do to address these challenges. 

We recorded the webinar and have [made it available online](https://snowplowanalytics.com/webinars/road-to-better-data-quality/). To briefly summarize, Yali first dove into why data quality has become such a big issue in web and mobile behavioral analytics and how it impacts companies in three key ways: trust in the data is lost, decisions are taken based on inaccurate or inconsistent data and data engineering spends valuable time “fixing up” the data after the fact. He then went on to outline actionable recommendations companies can take to improve their data quality through their culture, processes and technology used.

Christophe continued the conversation and went into detail about the importance of addressing data quality issues at source in the data collection process and at the data modeling stage. He brought some practical tips to what can be done at each stage and also outlined the limitations with each. 

We received some excellent questions from the audience but only had time to answer a few, so we asked Yali and Christophe to help us cover them in a blog post as a follow up. 


 {% include shortcodes/ebook.html background_class="data-quality-landingpage" layout="blog" title="The road to better data quality:" description="How to build assurance in every stage of your data pipeline" btnText="Watch recording" link="https://snowplowanalytics.com/webinars/road-to-better-data-quality/" %}


## Questions & Answers

What follows are the questions posed by the audience and answers from Yali, Christophe and others from the Snowplow team. 


#### How do you get an engineering team to care about data quality when they themselves do not have a direct incentive to pay attention to it?

It's a cultural change you're trying to drive: trying to get a group of people to care about something they didn’t care about before. It’s not easy, but it’s possible to evolve the culture. 

We’d suggest starting by giving engineers greater exposure to the teams that are using the data and show them what the data is being used for, what difference that data makes, and how valuable it is. Especially in larger organizations where teams are siloed, awareness and understanding alone can be really powerful. You can only ask someone to care about something that she is aware of and understands the importance of.


> **“We’d also suggest giving the engineers an opportunity to use the data. They are likely to have questions that the data might enable them to answer – helping them understand the value of what they have built. ”** 


One way to make people care about bad data is to measure it. By measuring the data quality, you can set goals around it and reward teams who are meeting their data quality targets and provide support to those who need it. We have to be careful that the measurements encourage the right behavior and move the effort in the right direction: thought needs to be put into how data quality is measured, and how this is communicated to the implementation teams. 

Finally, automating the QA process, which has historically been a painstakingly manual process, is another great way to encourage a cultural shift.


#### How do you manage stakeholders’ expectations around things that impact data quality that are impossible to fix (specifically around web data: ad blockers, 3rd party cookie limitations, etc.)?

Ad blockers, privacy concerns and browser-based measures to prevent tracking are all facts of life now. It’s a new normal we have to accept. We lived in a world where we could aim to track 100% of the people that engaged with us. That's not the direction we’re headed towards any longer.

We've got to get good at having really frank conversations with those stakeholders around the limitations we’re under. We have to be honest, transparent and clear. We need to explain what we can and cannot do with the data. Stakeholders will tend to accept that (a few won’t, of course), when they have the full picture and understand where those limitations are coming from.

There's still a lot we can do with the data that we have, and there's still plenty of opportunity to play for. We need to focus on executing effectively, rather than getting caught up with what we once thought was possible. Encourage your stakeholders to think on a use-case by use-case basis. Typically for any use case we can do _something_ meaningful with the data, even without the full data set. As an example, the whole field of statistics was born to enable people to infer things about populations based on samples!


#### If you want to do more real-time analysis services, how would you recommend feeding this directly from the pipeline instead of doing it from a data store/data warehouse

This is a huge area that probably deserves its own blog post, but we’ve gathered a few thoughts on this. 

The tooling for working with the data at rest is much better developed than that for working with it in-stream, however the tooling is getting better all the time. Dataflow, for example, is developing fast in GCP and cloud functions in GCP and lambda functions in AWS both make running simple computations on the data really easy. Plus it’s possible to execute SQL on streams using Dataflow in GCP and Kinesis Analytics in AWS.

There isn’t a best approach or a one-size fits all solution for building real-time analysis services, it really depends on the type of job you’re running. 
> **“In general we at Snowplow would recommend developing approaches on the data in the data warehouse and then porting them to run in-stream, picking the stream processing framework that’s best suited for the particular job. Simple jobs lend themselves to lambda or Cloud functions and more complicated jobs are better powered using Dataflow or Flink on EMR or Kinesis Analytics.”** 



#### What are the recommendations for validating data quality for data that is transformed on-the-fly in a real-time/streaming scenario? For example, if you use a lambda function to transform it, and get an unexpected input, it can result in a strange output. How can data quality be assured on-the-fly?

The same opportunities exist to validate data in-stream as at rest (e.g. in the data warehouse). In both cases you read the data (either a single row at a time or as a micro-batch) and perform checks against that row/the micro-batch. This can either be done via a dedicated job e.g. a “quality check” lambda, or as an extra step on an existing job e.g. that validates that the output of the lambda is within a particular range or validates against a particular schema, and make that validation step part of the lambda itself.

We use a real-time approach in the Snowplow pipeline itself in a couple of places:



*   We validate the data against the appropriate self-describing schema just before the enrich step. 
*   We validate the derived contexts that are added to each event after enrichment, again against their associated schemas.

In both cases the operation works on the event level, so it isn’t harder to run in-stream than on the data at rest.


#### Any advice for getting around the ad blocker problem?

There are a number of technical measures we would recommend:



*   If you’re a Snowplow customer, you can set your collector to a custom path (our team can configure this for you). 
*   You should send data from the web using POST or BEACON requests (GET requests are easier to spot and block). As we’re writing this we believe this combination beats ad blockers, but at some stage an ad blocker might evolve their approach to block this too.
*   Potentially integrate your snowplow.js or other tracking libraries in your website’s own JavaScript files.That way it isn’t possible to block tracking by blocking the loading of the supporting file.
*   [Leverage server-side tracking](https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/) wherever possible for greater reliability of critical events.

We would also advise you to being transparent and open with your users about:



*   What data you’re collecting from them, and why
*   Whom that data is being shared with, and why
*   What role advertising plays for your business
*   The impact of ad blocking on your business

Ultimately, ad blockers emerged as a technology because the ad industry felt it had the right to “help itself” to audience data without having an honest conversation about what data was being captured and why. With ad blockers, website visitors are unilaterally withdrawing their data. The best solution we have to try and work towards, even if it might not be practical at this stage, is to have an honest conversation to find win-win solutions for consumers and the industry that relies on advertising and data.


#### Ensuring consistency in data tracking across platforms is critical. What are the best practices and exemplary resources out there on defining a good event tracking taxonomy/specifications template that can be applied across multiple app platforms?

Event tracking taxonomies and specifications are hard to standardize as the tracking plan should link very specifically to the type of experience you’re tracking for. A tracking plan for one application is going to look totally different to a tracking plan in another. However, we do see some commonalities, e.g. a tracking plan to capture an experience around vertical search is going to look the same for a travel company and an ecommerce business.

There are also pragmatic considerations: if you’re starting from scratch or have to work with an existing framework. As an example, if you’re just starting to set up Snowplow tracking in Google Tag Manager (GTM), and there’s already an existing setup it’s going to be a big ask to do a totally new implementation of the data there. You might have to make the best of what is available within GTM already while still trying to make the most out of Snowplow and its flexibility.

> **“If you have the opportunity to start from scratch, it can be beneficial to start small. Don't try to do everything at once.”** 
 
If you’re starting with Snowplow (if you’re a Snowplow customer we help you with tracking design as a part of our onboarding process), define a few events and entities and don't make them too complex. What are the first few questions you want answers to? Start using the data and let your learnings guide your further development. If you try to do everything upfront you may end up collecting data you won’t use, and other data you’d want to collect may be harder to track because you have prematurely constrained yourself in too complex of an event structure. 

The next Snowplow webinar (May 20th) will cover this topic in more detail, so be sure you sign up to [“The art and science of designing your tracking” here](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/).


#### Are there good examples of automated testing frameworks that help validate if our collectors within the application platforms (web, iOS, Android) are producing the data against the right spec we have defined beforehand (either in real time or DW)? This will help client engineering teams and data teams rally around a mutually beneficial tool/way of working.

We recommend using testing frameworks that simulate user journeys through your website and app, and using [Snowplow Micro](https://snowplowanalytics.com/blog/2019/07/17/introducing-snowplow-micro/) to test that the expected events were emitted as part of those journeys, the associated schemas passed validation and the values sent for each property are as expected.

On web we recommend [Webdriver](https://webdriver.io/), but [Nightwatch](https://nightwatchjs.org/) and [Cypress](https://www.cypress.io/) are other popular options to use in conjunction with Snowplow Micro. On mobile we’re currently exploring [Appium](https://appium.io/). 


#### From your experience with various customers, who is usually most suited to manage the events taxonomy? Is it the product or analytics team?

We’ve seen either team be successful (and less successful). It's very hard to find the right ownership structure and it’s dependent on so many variables; your organizational structure, culture and processes to name a few.

The benefit of having a product team own the events taxonomy is that the product team is well placed to keep evolving those definitions with the application – and it’s a big win if this becomes an integral part of the product development process rather than an additional, arduous set of steps.

However, if consistency of data across different products is key (e.g. because you have many different applications that support the same type of customer journey, and you want to collect consistent data across them) then having an analytics team own the definitions makes more sense, because they can drive the standardization.


> **“This reflects the pros and cons of centralized vs decentralized data governance models. The current best practice is for organizations to adopt mixed models: centralized governance for core data e.g. master data (customer records, product records) and looser models elsewhere.”** 

The thing that makes answering this question challenging is that, as more teams in a company start using web and mobile data, it makes more sense to govern that data centrally, rather than distribute it with the different teams responsible for generating it from different applications and touchpoints.


#### What would be your take on how to tackle journey tracking from campaign to web/mobile - provide quality in data collection, means manually setting up ids or fix this one after the fact?

It’s always better to fix data at the source rather than after the fact. This is especially true if you’re interested in tracking a customer journey from a user interacting with a campaign to them becoming a loyal customer. If you don’t capture the necessary data, you may never be able to stitch together the whole journey. Similarly, if campaigns are set up in a very messy way - e.g. without a proper taxonomy - it may be hard to derive useful insights from the data.

The mechanisms for stitching marketing campaign data to your web or mobile data depend on the exact platform mix. On web, we still need to rely on UTM parameters (or a click ID on the platforms that support it). On mobile, we have to use third party attribution providers such as [Adjust](https://www.adjust.com/) and [Appsflyer](https://www.appsflyer.com/) (as they are one of the few companies that are Facebook Measurement Partners).


#### How much does the quality of data depend on data modelling quality and what are key skills needed in analysts and engineers to deliver a high quality data pipeline?

Data modeling quality matters a great deal. You can start with a flawless dataset in your data warehouse but that won’t matter if you subsequently model it in a sloppy way. It’s during data modeling that you transform the source data into derived data sets that are purpose-built for specific use cases. 
> **“The same criteria you use to assess your source data can be used to assess your derived data, even though the process for generating that data is quite different from data collection.”** 


In terms of skills, the team at Fishtown has written a good blog post about [hiring analytics engineers](https://blog.getdbt.com/hiring-analytics-engineer/). The skills they have focused on in the post are the engineering skills that are sometimes lacking in candidates coming from more of a data analyst background. If you’re interviewing candidates with an engineering background you’d want to check that they have data analysis skills: they should be good at seeing the possibilities that different data sets provide, have a good mental model for how different sorts of transformations make certain types of analyses easier, and be good at working with lines of business to understand their questions and then bring the data to bear on those questions.


#### How do you handle expressing to your data team how important data quality at the source is? I find that there is a lot of pressure to catch everything and check for data quality issues within the data modelling stage. But I feel, quite often this is too late.

This is a really interesting question and one we find a bit surprising. We often find the opposite: data teams would love data quality issues to be solved upstream, so that they don’t have to spend so much time fixing it up after the fact, but don’t feel empowered to work with the different teams instrumenting tracking to ensure that that happens, so put up with focusing on the data modelling stage.

We would suggest focusing on empowering the data team to have the relevant conversations with the implementation teams, and equip them with the right tooling to ensure data is collected correctly at source.


#### The collection of behavioral data has an image problem and the value that it generates for customers seems to be ignored in some areas (ads), while in others it is acknowledged and appreciated (i.e. Spotify/Netflix recommendations). Are you noticing any trends in people's attitudes regarding this issue? If so, in which direction is it going?

People are right to be skeptical about the collection of their behavioural data: as with all technology, it can, unfortunately, be used both for good and bad and it’s hard to distinguish these use cases at the collection stage. As we touched upon earlier, explain in clear terms what data is collected, why it is collected, how it benefits them, and how long it is stored for.

In terms of the direction we’re going - we’re not so sure. We had hoped that the pendulum would start to swing back as consumers started to better understand the benefits of sharing their data with trusted providers, and started to enjoy greater control over their data after it was collected, thanks to legislation like GDPR.

From a data collection and utilization standpoint, new developments like edge analytics, on device machine learning, and differential privacy all make it possible to achieve a similar level of personalization without requiring extensive collection of behavioural data. 


## Snowplow specific questions


#### What are the common business use cases where Snowplow is better than Google Analytics for web analytics?

To start off, we don’t see Snowplow and Google Analytics as directly competing solutions and we have customers who use us both for different purposes. Google Analytics is a powerful reporting tool - integrated from collection to processing and visualization - and Snowplow is purely focused on data delivery (collection and processing), providing you with a high quality data set you can use for reporting, ML, real-time applications, etc..

We have highlighted some specific business use cases where Snowplow could be favorable and you can also find some more insights on how we compare ourselves more generally with Google Analytics [here](https://go.snowplowanalytics.com/snowplow-vs-enterprise_digital_analytics.pdf).



*   You’re in a business where the data does not easily fit into the Google Analytics data structure, e.g. a subscription business, two-sided marketplace or an online game
*   You have an experience that isn’t easily modelled by the Google Analytics data model e.g. a car configurator, virtual fitting room or an AR experience
*   You want to use the data to power a real-time application e.g. 
    *   Fraud detection on a credit card application form page (can you spot a user copy-pasting different social security numbers)
    *   A recommendation API (what to read next)
    *   Alerting on sudden changes to business KPI, e.g. sudden drop in checkouts or conversions
*   You want to use a combination of JavaScript and server-side tracking (e.g. because of ad blockers). We find it much easier to stitch client- and server-side data into sessions and user journeys with Snowplow than with GA
*   You want to employ more sophisticated analytical techniques like machine learning


#### How easy is it to install Snowplow on a website? Can we use tag manager tools for the implementation?

The [Snowplow JavaScript tracker](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/) is relatively straightforward to implement, especially in a tag manager like GTM:



*   It is initialised and exposes an API pretty similar to Google Analytics
*   In addition it supports the sending of self describing events and entities

We are working on an updated version of our JavaScript tracker that will be easier to implement in React and other single-page web application frameworks. This will be built to be imported and modular, so that only the JavaScript that’s required is loaded, making it easier for developers to keep the JavaScript lightweight.

That's it for the questions you asked and our answers. Thanks again to those who attended our first online event. To register for the second event in our series, click [here](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/).
