---
layout: post
title: "How we think about user identification and user privacy at Snowplow"
description: "Find out how to deliver highly personalized and relevant experiences to your customers while ensuring user privacy by taking control of your behavioral data."
author: Cara Baestlein
category: Data governance
permalink: /blog/2020/09/07/2020/user-identification-and-privacy/
discourse: false
---
As our world shifts online, individuals are bombarded with an ever increasing amount of information across the internet. This means having meaningful and mutually beneficial relationships with your customers and users is critical in building a successful business. However, with increasing public awareness of data privacy, and the commercial and regulatory risks involved, it is also becoming more challenging to deliver highly personalized and relevant experiences. It is crucial to tackle these challenges head on, and more specifically to think about:



*   What information do you want to collect about your users, and how much information are your users willing to share with you?
*   How much of this information are you prepared to share with third parties?
*   What changes do you need to make, both from an organisational and technology perspective, to set your business up for success?

Thinking about these challenges proactively ensures your data collection is set up so that you capture only the minimum amount of information on your users while satisfying all your business requirements.


# Take control of your user data

__At Snowplow, we believe the first step is taking control.__ You have the opportunity to define what data you want to capture about your users and the responsibility to ensure that that data is only used in ways that are clearly understood by your organisation as well as your users. 

__The key aspect of taking control is owning your data.__ By sending raw behavioural data to third parties, for example by adding an ad vendor’s pixel to your website, you are allowing third parties to derive insights from your user behavior. While those insights might benefit you (for example through better targeted ads on those platforms), they might also benefit your competition and erode your users’ trust in you.

__You want to be in control of where the data is stored, who has access to the data and what it is being used for.__ For example, you might decide that your customer support team can have access to data for a specific customer if that enables them to resolve the customer’s support request faster. On the other hand, you might decide that your product team does not need to be able to look at individual user data, but rather look at cohorts, when analysing the effectiveness of a new feature.

__You should be able to tailor what data you collect, and how you collect it, to your business.__ How much PII do you actually need from your users to derive valuable insights about your product(s)? Do you care more about identifying users reliably on a given website (or mobile app), or across sites and even platforms? How much information can you capture about users that do not consent to tracking?

The remainder of this blog post will review the options you have with Snowplow around identifying and capturing information about your users. Regardless of which technology you use to collect behavioural data from your digital products, we encourage you to think about these options and what they mean for your business!


## Do you want to identify users over time?


### No, I don’t need to identify users over time.

__On web__, we have recently released anonymous tracking capabilities. Specifically,  JavaScript tracker version 2.15.0 introduces two flavours of anonymous user tracking: fully anonymous tracking, and anonymous session tracking. Fully anonymous tracking does not capture any client-side user or session identifiers. Please note that the IP address and the collector-set cookie will still be captured. You can anonymise these in the enrichment process later in the pipeline, and we are working on tracker and collector releases that will allow you to toggle those off too. Anonymous session tracking stores the session information in a cookie or local storage, depending on the storage strategy, but no user identifiers are captured that exist beyond the user’s current session. More information about how to use this functionality can be found in the [release post](https://snowplowanalytics.com/blog/2020/08/20/snowplow-javascript-tracker-2.15.0-released/#1-anonymous-tracking).


__On mobile__, you have the choice of not enabling the `mobile_context` and `session_context`. In that case, you will not be tracking any device identifiers, or Snowplow-set user and session identifiers. The same goes for all other platforms: you are not required to specify any persistent user identifiers with any of the server side trackers.


### Yes, I want to identify users over time.

Snowplow collects various platform-specific user identifiers out of the box, and enables you to capture any custom user identifiers you wish to.

__On web__, we set a user identifier against the collector domain (the `network_userid`) and one against the domain the tracking is on (the `domain_userid`). You can decide on the storage strategy of these user identifiers, cookies or local storage, in the tracker initialisation (more information on this can be found in the [documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/cookies-local-storage/)). Given the `network_userd` is set against the collector domain, and you have the freedom to set your collector CNAME as a subdomain of your domain, this identifier will be a first party server side cookie, unaffected by ITP and other browser tracking prevention measures. The `domain_userid` is a first party client side cookie that comes with the `domain_sessionid`, a client-side session identifier that expires after a custom-defined period of inactivity (the default is 30 minutes).

Not all of users might consent to tracking on your website(s). By combining anonymous and identified tracking you are able to maximise the data you can collect across all users. Specifically, you can toggle the fully anonymous tracking functionality introduced in JavaScript tracker 2.15.0 off and on as users opt in and out of tracking. This toggle will respect the anonymity of the user up until they consent to tracking, i.e. you will not be able to stitch a previously fully anonymous user to a then identified user, but you'll still be able to use their behavioural data to understand how your users are engaging with your digital products overall. More information on this can be found in the [documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#Anonymous_Tracking_2150).  Additionally, you can track consent using [a dedicated GDPR context](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/tracking-specific-events/#GDPR_context) that will be attached to all events.

__On mobile__, we capture the device identifiers (`IDFV` on iOS and `AAID` on Android) via the mobile context. You can also enable a session context that captures the `sessionId` as well as the `previousSessionId`. It also captures the `user_id`, a UUID that is generated by the tracker, stored on the device and should persist until the app is uninstalled. The `sessionId` and `user_id` in the `session_context` are conceptually similar to the `domain_sessionid` and  `domain_userid` on web.

__Across all platforms__, including server-side, you are able to set a custom user identifier as well as send any additional information via a custom entity. More information on this can be found in the [documentation](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/understanding-events-entities/#what-is-an-entity). 

For more information on how to identify users over time, as well as across platforms and channels, check out [our post on building a Single Customer View with Snowplow](https://snowplowanalytics.com/blog/2020/06/11/single-customer-view/).


## What information do you want to collect about your users?


### Do you want to capture the user’s IP address?

If you do not require this, Snowplow provides you with an [IP anonymization enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/ip-anonymization-enrichment/) that allows you to replace any number of octets with `x`s in real time, so that the data you store in your warehouse does not contain this PII.


### Do you want to collect location information about your users?

Out of the box, Snowplow comes with the [IP lookups enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/) that adds location information to each event based on the user’s IP address and the MaxMind geo database. This enrichment runs before the IP anonymization enrichment so you can make full use of it even if you wish to anonymize the IP address. If you do not require location information, you can disable this enrichment.


### What do you want to know about a user’s device, operating system and browser?

By default, all client-side Snowplow trackers collect the user agent string. Snowplow then has multiple user agent parsing enrichments available that provide the user agent data in a more usable format: the [user agent parser](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/) and the [YAUAA enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/yauaa-enrichment/). Chrome recently announced that it will be freezing the user agent string from Chromium 85 onwards to provide users with more privacy, and instead will make use of Client Hints. We have released support for these Client Hints in JavaScript tracker version 2.15.0, you can read more about it in the [release post](https://snowplowanalytics.com/blog/2020/08/20/snowplow-javascript-tracker-2.15.0-released/#2-client-hints).


## What else should you consider?


### Pseudonymization


With regards to all the different data points discussed up to now, it is also worth thinking about whether you need the actual values (i.e. of the cookie identifier, IP address or email) or whether it is enough to have a hashed value that is consistent over time. If the latter is sufficient, you may want to consider pseudonymizing your data. This means you’ll still be able to analyze user behaviour, but you will no longer have the liability of storing their PII. Snowplow enables you to do this for any number of fields in your Snowplow data that contain PII using our [PII enrichment](https://docs.snowplowanalytics.com/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/). 


### Tackling ad-blockers

Originally ad blockers were designed to do exactly what their name suggests, i.e. to block advertising. However, because many third party analytics vendors use similar technologies to advertising networks (such as third party cookies), they are increasingly being blocked as well.

At Snowplow we believe there is a fundamental difference between a third party collecting information about your users to serve them advertising and you wanting to understand your user behaviour to improve their experience. Snowplow enables companies to customize their request paths such that the Snowplow requests sent to a company’s collector cannot be identified as tracking requests by ad-blocker.


### Client-side versus server-side tracking

Client-side tracking allows you to capture granular detail about who your users are, where they came from and exactly how they interacted with your digital products. However, its accuracy and completeness can be limited by browser tracking prevention measures, ad-blockers and other third party JavaScript running in users’ browsers. 

Server-side tracking on the other hand can be a great option if you do not need much information about your users, but want an accurate and robust data set on the activity that is happening on your digital products. 

If you would like to learn more about the benefits and drawbacks of client- versus server-side tracking, check out [our blog post on filling holes in your data and improving your analytics with server-side tracking](https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/).


## Better understand your users

At Snowplow, we believe building excellent relationships with your users demands high quality data you can trust. We encourage you to evaluate what information you need to capture about your users, and how you will use that information. At the same time, you need to have a clear understanding of your users’ expectations of your service (i.e. the level of personalisation you provide for them) and their level of comfort with your data collection (so you don't collect data they are not happy to share with you, or use it in a way that they have not consented to).

If you want to learn more about collecting behavioural data from your digital products with Snowplow, [get in touch today!](https://snowplowanalytics.com/get-started/)