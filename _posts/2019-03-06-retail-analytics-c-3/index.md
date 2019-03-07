---
layout: post
title-short: Snowplow for retail 3
title: "Snowplow for retail part 3: what can we do with data when we're getting started?"
tags: [analytics, data, insights, retail, retail analytics, ecommerce]
author: Archit
image: /assets/img/blog/2019/03/example.jpg
category: Analytics
permalink: /blog/2019/03/06/snowplow-for-retail-part-3-what-can-we-do-with-data-when-were-getting-started/
discourse: true
---

We recommend you you have read the [first post in this series][part-1] before diving into this one to ensure you have all the context you need!

<h2>What can we do with the data, we’re getting the data team started?</h2>

Five example of what you can do with a treasure trove of Snowplow data and 1 analyst are as follows:

1. [Look at user engagement on the website](#web)
2. [Look at user engagement on mobile apps](#mobile)
3. [Understand offline conversions](#offline)
4. [Join data from web, mobile and offline](#join)
5. [Create a marketing attribution model](#model)

Let’s look at each in turn. This is a non-technical run through, for more information on how to implement each of these ideas, please contact us or refer to relevant articles linked in each section.

<h2 id="web">1. User engagement on the website</h2>

The tracking was set up by your front end developers and Snowplow’s tech has delivered structured, clean data into your data warehouse. You, as the analyst, can now begin to query that data and build models to output relevant reports.

All the data that Snowplow delivers is in one table, one row per event (as in Joe’s example in the main post).

A useful first step is to build a model that extracts relevant information to you from the event table and aggregates the event level data to the session and user level as shown in the diagram below.


![example][example]

As a Snowplow Insights customer, we will be happy to enable an example data model that we have built that does a simple version of this for you. Note that every web event is collected with a session ID (you can configure what the definition of a session is at the tracker level) and a host of user IDs. This makes rolling events up into sessions and users quite simple.

The simplest data model built using tables created by our example model will allow you to answer important questions like:

- Which pages and products are the most popular?
- What type of user looks at what type of product?
- Which users bring the most value?
- Are users engaging with the site? Are they engaging with some features more than others?
- If there are multiple sites/brands, are users active across multiple sites/brands? (all events are sent with a 3rd party cookie that allows to identify a user across multiple domains)
- Are we getting repeat users?

Answering these questions with event level data means you have full confidence in the results - the whole process is transparent as you know exactly what assumptions have been made, because you explicitly made them in your model. Raw Snowplow data is almost entirely unopinionated, save for variables like the session ID whose definition you have the full power to configure.

To make all this easier, Snowplow Insights customers can be set up for free with Redash, a BI tool. This will allow you to build compelling dashboards from the tables you create.

<h2 id="mobile">2. User engagement on mobile</h2>

All the data collected from your native mobile app is in the same format as the web data, which means we can take the same steps as for the web data in the section above.

Mobile events are also collected with a session ID (definition of a mobile session can be configured independently of the web session definition) and a user ID.

<h2 id="offline">3. Offline conversions</h2>

Offline conversions can be tracked in the following ways using Snowplow:

- Purchases made over the phone using Snowplow server side tracking in your CRM software
- In store purchases that are logged in your CRM software using one of our server side trackers (note if user information is taken at purchase or a loyalty card is used then attribution is made simple)
- A native or web app that is used in store for processing requests can have our web/mobile trackers
- Confirmation emails can be sent to customers who purchase, when this email is opened our pixel tracker will capture their 3rd party cookie

Events sent with our pixel tracker and server side trackers are all also in the same format as web and mobile events. Therefore similar workflows can be used to analyze this data.

You now have rich, granular data on conversions. This sets you up nicely for the next step.


<h2 id="join">4. Join web, mobile and offline data</h2>

A reminder that all the data from the various sources is in the same table in the same format from our earlier example:

![user][cookie]

All that is needed now is to connect the events that occur on the different platforms by the same user.

Starting with Web data:

![web data][web]

App data (note app installs can be tracked as Snowplow events using Adjust):

![app data][app]

Web and app data can be joined on the internal user ID. Note that since you have access to all the underlying data, you can write your model such that it populates past events where the user had not yet identified themselves (eg an ad impression), with an internal identifier.

To join web and app usage to offline conversion data the following can be used:
- Internal user identifier
- 3rd party cookie on confirmation email open
- Email address
- Phone number

Yali has covered the Snowplow approach to user stitching more thoroughly in [this blog post][stitching]. He then dives into the deeper “how-to” in [this follow-up post][identity].

<h2 id="model">5. Marketing attribution model</h2>

Working off the assumption that you have now stitched users so that you know what the web and mobile behaviour of a user was prior to purchase, you can build an attribution model allowing you optimise your marketing spend and conversion rates.

Having access to the underlying data means that you can assess which attribution model would work best for you by exploring your data. You don’t have to rely on out of the box, one-size-fits-all models, you can build a custom one.

Some commonly used examples are as follows:

![marketing attribution model][model]

Remember, the model can include micro-conversions, too, such as add-to-basket.

You are now empowered to design an attribution model that best suits your business, which may well be a combination of these.

The great thing about having the underlying data is that with time, you can update and refine this model as more and more data comes in.

Read part 4 next: [What can we do with data when we're growing?][part-4]








[part-1]: /blog/2019/03/06/snowplow-for-retail-part-1-how-can-I-use-snowplow/

[part-4]: /blog/2019/03/06/snowplow-for-retail-part-5-what-can-we-do-with-data-when-were-well-established/

[example]: /assets/img/blog/2019/03/example.jpg

[cookie]: /assets/img/blog/2019/03/cookie.png

[web]: /assets/img/blog/2019/03/web-data.png

[app]: /assets/img/blog/2019/03/app-data.png

[stitching]: https://snowplowanalytics.com/blog/2014/04/16/identity-stitching-snowplow-vs-google-universal-analytics-kissmetrics-and-mixpanel/

[identity]: https://discourse.snowplowanalytics.com/t/identifying-users-identity-stitching/31

[model]: /assets/img/blog/2019/03/model.png
