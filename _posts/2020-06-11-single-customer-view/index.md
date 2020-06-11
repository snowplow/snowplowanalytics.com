---
layout: post
title: "Developing a single customer view with Snowplow"
description: "How to identify users across platforms and channels, and develop a single customer view."
author: Cara Baestlein
category: How to guides
permalink: /blog/2020/06/11/single-customer-view/
---
Developing a single customer view and effectively identifying users has become a hot topic in the analytics community for two main reasons:



*   Users demand excellent user experience on digital platforms, increasingly expecting personalized experiences for example, or expecting marketing and recommendations to be highly relevant. This requires effective user identification across platforms and over time.
*   Users demand more control over how their data is used. Privacy regulation, browser tracking preventions and ad blockers make it difficult to effectively identify users. 

These challenges require companies to rethink how they collect and use data, and how they want to establish a mutually beneficial relationship with their users. 


### First-party versus third-party data collection

A number of browsers (most prominently Safari, but also Firefox and Edge) are restricting the use of cookies with the aim of protecting users’ privacy. Their measures target third-party data collection, as is done by ad tech companies as well as multi-tenanted analytics solutions such as Google Analytics. Specifically, these measures aim to stop companies from tracking data about users they have no direct relationship with. The strictest of these measures (at the time of writing), Apple’s ITP 2.3 (announced in September 2019), limits first-party client-set cookies (and the equivalent use of local storage) to a single day. In response, many companies tracking user behaviour for internal purposes have switched to first-party data collection.


### User stitching

The key steps in developing a single customer view are: 



*   Capturing first-party user identifiers across all your platforms and products. 
*   Developing an understanding of the relationships between those user identifiers (this generally means developing a hierarchy of identifiers and a mapping table).
*   Using these relationships to link together all events from a single user.

This process is often referred to as user stitching. For example, user stitching can involve connecting events from users before and after they log in (or identify in some other way), or mapping together the same user across different devices.

The remainder of this blog post focuses on how to get started with user stitching if you use Snowplow to collect behavioural data from your digital products. 


## Capturing user identifiers


### Out of the box identifiers on web

The Snowplow JavaScript tracker sets two cookies by default, containing user identifiers and a session identifier. These UUIDs are tracked with all web events. 



*   The `network_userid`: This cookie is set against the collector domain (i.e. server side). If tracking is only deployed on one root domain, and the collector CNAME is a subdomain of that one domain, this cookie is first party. If the collector domain and the domain(s) tracking is deployed to are different, this will be a third party cookie. This cookie expires after 1 year.
*   The `domain_userid`: This cookie is set against the domain the tracking is on (i.e. client side). It can be set against the full domain or the root domain (by specifying `discoverRootDomain: true` in the tracker initialisation). This cookie expires after 2 years. 
*   The `domain_sessionid`: The session identifier is set as part of the `domain_userid` cookie. By default, it expires after 30 minutes of inactivity, but a different interval can be picked in the tracker initialisation (i.e. `sessionCookieTimeout: 3600`).

If tracking is deployed to multiple root domains, a function called `crossDomainLinker` can be used to pass the `domain_userid` on one domain through a link click across to another domain, where it will be captured alongside that domain’s `domain_userid`, in the `refr_domainuserid` field. Aside from the `network_userid` this can provide an additional method for linking together `domain_userid`s across domains. More information on this link decoration method can be found in [the Snowplow docs](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#Configuring_cross-domain_tracking).


### A note on ITP and other browser privacy measures

If you are tracking only one domain, and you set your Snowplow collector to have a CNAME that is a subdomain of that domain, the `network_userid` cookie becomes a first-party, server-side cookie, entirely unaffected by the browser measures discussed above. If you are tracking multiple domains, Snowplow supports setting up multiple CNAMEs for your collector such that each domain can have its own first-party, server-side cookie set against its collector domain. However, this approach means that you lose the ability to stitch users across domains using the `network_userid`, as this ID is now no longer a third-party ID shared across all the domains you are tracking. 

Either way, if a significant portion of your users are affected by ITP and other browser privacy measures, you might want to move to using the `network_userid` as your primary user identifier, rather than the `domain_userid`. If your collector CNAME is already a subdomain of (one of) your domain(s), you can check whether the `network_userid` is working as expected by checking the number `network_userid`s where there is more than one `domain_userid` per `network_userid` (for a given root domain as captured in the `page_urlhost`). Please note that if you switch to the `network_userid` as your primary user identifier, you will also want to re-index your sessions based on that ID (i.e. correct the `domain_sessionidx`). 


### Out of the box identifiers on mobile 

Snowplow’s iOS and Android SDKs can send a context containing a few mobile-specific user identifiers with all mobile events (called `mobile_context`). Additionally, the `session_context` allows you to configure client side sessionization and then capture it with all mobile events.



*   The `mobile_context`: On iOS, it captures `appleIdfa` and `appleIdfv`. On Android, it captures the `androidIdfa `or `aaid` (Android’s IDs are used interchangeably).
*   The `session_context`: This captures the `sessionId` as well as the `previousSessionId`. It also captures the `user_id`, a UUID that is generated by the tracker and stored on the device. It should persist until the app is uninstalled, and is very similar to the `domain_userid` that is generated by the Javascript tracker.


### Setting a custom user ID (all platforms)

All Snowplow trackers allow you to set a custom user ID to be sent with all subsequent events. This will be stored in the` user_id` field in the main events table. 

In certain cases there might be more than just a single custom user ID available for identifying a user, such as a name, email, or additional IDs from different systems. [Custom contexts](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/tracking-specific-events/#Custom_contexts) can be defined and sent with all events to capture these, and are also supported on all platforms.

In some cases, events themselves are centered around user identifiers, for example when ingesting email activity from an emailing service (like Mailchimp or Sendgrid) via webhook, or collecting ad impressions via the pixel tracker. In those cases, [custom (self-describing) events](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/tracking-specific-events/#Tracking_custom_self-describing_unstructured_events) can be defined to capture this information.


## Enriching data with further identifiers

There are two points in the Snowplow pipeline you can add information to the data collected via the Snowplow trackers and webhooks: during enrichment (in real time) and in the data warehouse (hourly or daily).


### Adding user information during enrichment

Snowplow offers two ways to add additional information to the data in real-time:



*   The [API enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/custom-api-request-enrichment/): you can ping your own or a third party API to add additional information into a custom context. For example, you could look up a user identifier based on the IP address. 
*   The [SQL enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/custom-sql-enrichment/): you can query a relational database optimised for fast reading and writing (MySQL or PostgreSQL) to add additional information into a custom context. For example, you could add a user’s name, email, and subscription plan based on their user ID. 

We recommend adding information in real time when it is either likely to change frequently and therefore needs to be added the moment the event occurs, or the data will be used in real time. For all other use cases, we recommend adding additional information to events in the data warehouse (as described in the next section).


### Adding user information in the data warehouse

Once your event data is in your data warehouse, you can join it with data from other internal and external systems, such as your CRM, ESP or transactional database. For this purpose, it may be useful to capture at least one internal user identifier with your Snowplow events. 


## Developing a hierarchy of identifiers

The hierarchy of user identifiers will reflect their availability (how many are captured across the different instrumented platforms) and reliability (internal IDs versus cookies or mobile device identifiers). 

Let’s consider the following example: a company runs a website ([www.example.com](http://www.example.com)) and a mobile app. It’s collector CNAME is [analytics.example.com](http://analytics.example.com). Users can perform some actions on the website without identifying, such as reading articles, but need to register / login to perform others, such as watching videos. They can also sign up for a newsletter to be notified when new content is available. The mobile app is for registered / logged in users only, i.e. users are prompted to login on the homescreen of the app when they open it. This company can therefore capture the following user identifiers with events: 



*   `user_id`: available on web and mobile if a user is logged in
*   `domain_userid`: always available on web (but maybe unreliable for users using Safari, Firefox or Edge)
*   `network_userid`: always available on web, and reliable across all browsers
*   `email` (captured in the newsletter signup custom event): available on web when users sign up for the newsletter
*   `appleIdfa` and `appleIdfv` on iOS, `androidIdfa` on Android: always available on mobile

Based on these identifiers, it could define the following hierarchy: 



![hierarchy](/assets/img/blog/2020/06/hierarchy.png)



### Building the mapping table

Once the hierarchy of user identifiers has been established, a model needs to be developed to create and update the mapping table based on the events collected. This is most commonly done in the data warehouse (using SQL), but can also be achieved in real time (for example using Spark and a database optimized for fast reading and writing). Continuing with the example from the previous section, and assuming this table is built in the data warehouse where the entire history of events is available, one might develop the following logic: 

As soon as a user identifies on web, we want to map their (internal) `user_id` to their `network_userid` (our reliable first party server side cookie). Same goes for mobile: we want to match their `apple_idfv` and all known `apple_idfa` (or `android_idfa`) with their `user_id`. Additionally, we might want to capture all associated `domain_userid`s, and their `email` in case they ever signed up for an email newsletter. If a user has identified across web and mobile, we can also map all of these identifiers together based on the `user_id`.

In our mapping table, we don’t really need to capture users that have not yet identified themselves. Stitching together user activity from before and after they register, and across platforms, happens when the mapping table is integrated into the data models. 


## Applying user stitching to your data models

While the user mapping table constitutes the source of truth for user identification, only when combining it with the continuous stream of information about user behaviour does it lead to a single customer view. Let’s consider the following series of events, based on the setup described in section 2.1: 



*   A so far anonymous user comes to your website via a Facebook ad, and after browsing a few pages, signs up for the newsletter, providing their email. 
*   A few days later, they receive an email as part of one of your email marketing campaigns. You track them opening their email via your email service provider (meaning that this event will not contain any of the Snowplow user identifiers). 
*   Instead of clicking on the link in the email, they return to your website by typing the URL directly into the browser. After browsing a while longer, they register and are now assigned an internal `user_id`. 

Let’s now suppose the marketing team would like to attribute any new registrations to previous marketing touches. This obviously cannot be done based on the `user_id`, as this ID is only assigned right at the end of the journey under consideration. It also cannot be done by using the `network_userid` alone, as the email marketing campaign would not be included. However, as each of the events described above have at least one user identifier available, and each identifier overlaps with at least one other identifier, the user mapping table will contain the following mapping: 


```
user_id <> network_userid <> email
```


Based on this, both the email marketing campaign and the Facebook ad can be linked to the user registration. 


## Start building your single customer view 

As the example above shows, often data collected from digital products only becomes insightful or actionable when joined with other data sources, and when user identifiers across platforms and channels are stitched together. Therefore, developing a single customer view is crucial in effectively utilizing your data asset. 

If you are interested in learning more about how you can develop a unified view of your customers, [get in touch with us today](https://snowplowanalytics.com/get-started/). As a Snowplow Insights customer, you can reach out directly to your Customer Success Manager. 