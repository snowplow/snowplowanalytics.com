---
layout: post
title: "Configure your Snowplow pipeline to collect complete and accurate data"
description: "Learn how to maximise the accuracy and completeness of your tracking by configuring your Snowplow pipeline."
author: Mike J
category: Product features
permalink: /blog/2020/09/07/pipeline-configuration-for-complete-and-accurate-data/
discourse: false
---


In recent years, major browsers have released multiple changes that affect how cookies and event-tracking on the web work.

This post is about understanding the [potential impact of these changes](#impact) and the different [configuration options available to you](#config) for your Snowplow pipeline, that will help you maximize the accuracy and completeness of your web tracking.

Examples of such changes are:

*   Safari Intelligent Tracking Prevention (ITP) blocks all third-party cookies and expires first-party cookies after a maximum of seven days
*   Firefox Enhanced Tracking Protection (ETP), now enabled by default, blocks all third party trackers based on the [disconnect.me list](https://disconnect.me/trackerprotection)
*   Chromium browsers have introduced rules about how they treat cookies based on the attributes of those cookies

These changes, alongside the [increasing use of Ad Blockers](https://www.statista.com/statistics/804008/ad-blocking-reach-usage-us/#:~:text=In%202019%2C%20roughly%2025.8%20percent,will%20never%20reach%20their%20audiences.), mean the data you collect about your users behavior on your site may be impacted in ways such as:


*   Your tracking could be significantly impacted for a large portion of users due to tracking blockers
*   New user numbers may rise and returning visitor numbers may fall as returning visitors whose cookies have expired will be counted as new
*   Longer-tail attribution will become increasingly difficult as attributing interactions over a longer period of time to the same user becomes more difficult


<h2 id="impact"> How might my tracking be affected? </h2>

If you are collecting data through event tracking on the web there are a number of ways that these changes could affect your data collection:


### Default instrumentations of Snowplow could be blocked by AdBlock and tracking prevention

The Snowplow pipeline makes an endpoint available that your data is streamed into and we know that this endpoint, along with other aspects of default Snowplow tracking instrumentations, is targeted by some ad-blocking providers, including the [disconnect.me list](https://disconnect.me/trackerprotection) which Firefox ETP uses to block tracking.

Ad-blockers primarily try to target third party tracking, e.g. Facebook spying on users across other sites, instead of legitimate tracking from companies who are looking to learn from data and improve the experience they offer. However, data collection for both purposes happens with similar technologies and so all approaches get blocked.


### The usefulness of client-side cookies is limited

With the increasingly short expiration windows on third-party and first-party cookies that are set on the client-side, analysing user journeys across any significant time window becomes challenging. Setting cookies on the client-side will deliver data that offers limited insight.

Cookies that are set on the server-side, in a first-party context, aren’t governed by these short-expiration windows and allow a much longer timeframe to stitch user-journeys together and better understand behaviour.

For example, understanding that a user first visited your site from a social campaign 55 days ago, and then went through a series of interactions with your brand, before finally purchasing; this kind of analysis is impossible using client-side cookies.

The Snowplow collector sets a server-side cookie with a set of associated attributes which can provide you the benefits of first-party, server-side tracking if your pipeline is correctly configured.


### Cookie attributes will impact the reliability of tracking

Browsers are introducing rules about how they treat cookies based on the attributes of those cookies, Chromium-based browsers are paving the way with this effort.

This means that the values of attributes like sameSite, httpOnly and secure have to be set correctly to ensure that cookies are set properly on different browsers: an incorrect setting may result in cookies not being set on one or more browsers, resulting in misleading data. For example, two actions performed by the same user will be reported as if they were performed by two separate users.

We go into detail on [what each attribute means in a previous post](https://snowplowanalytics.com/blog/2020/02/17/understanding-the-samesite-cookie-update/). 


## How can I collect more accurate and complete data?

Snowplow has configuration options that help you to collect complete and accurate behavioral data. 


<h3 id="config">Firstly, here's how you can check your current configuration </h3>

Insights Console gives you a quick and easy way to review how your pipeline is configured. Simply [login to console](https://console.snowplowanalytics.com/), find the pipeline you'd like to check the configuration for and navigate to Pipeline configuration.

![Pipeline configuration screenshot](/assets/img/blog/2020/09/pipelineconfig.png)


### Configure custom collector endpoints to track first-party

We recommend setting your collector to track from a first-party domain so it can set a first-party server-side cookie; these cookies are unaffected by prevention methods such as ITP and ETP.

Ideally, you want your collector endpoint to be on the same root domain as the site you are tracking from. (e.g. if you are tracking on acme.com, then a good example endpoint would be spc.acme.com).

For first-party tracking to work, you’ll also need to set a cookie domain for the primary domain of your collector.

You can check how your domains are configured by visiting _Pipeline Configuration_ in Insights Console and checking the settings for _Domains_.

![Config screen domains](/assets/img/blog/2020/09/config-screen-domains.png)

If you need to set up a new collector domain, you will need to:



*   Set up a CNAME record on the domain on which you are tracking to point to your collector e.g. spc.acme.com
*   Ensure the domain has an SSL certificate attached to it
*   Ensure you have a cookie domain that matches the primary domain of your collector endpoint e.g. acme.com




### Configure custom collector paths to avoid tracking being blocked

You'll want to set custom request paths to avoid your tracking being blocked by tracking prevention measures and ad-blockers.

You can check whether you have set custom POST paths by visiting _Pipeline configuration_ and checking the settings for _Tracking request paths_.

![Custom collector paths](/assets/img/blog/2020/09/config-screen-paths.png)

If you need to set up a new request path, you will need to:



*   set up custom POST paths on your collector
*   once the collector is updated, update your Javascript tracker initialization to [use your custom POST path](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#POST_path)

If you are using the Iglu webhook to track events, you can also set a custom path for this tracking.


### Configure your cookie attributes to meet privacy standards 

To ensure cookies are set properly on different browsers you'll want to set the right attributes against your cookies.

You can check how your cookies attributes are currently set by visiting _Pipeline configuration_ and checking the settings for _Cookie attributes_.

![Configure cookie](/assets/img/blog/2020/09/config-screen-cookies.png)

If you need to set up a change your cookie attributes, you will need to:



*   work out what settings you'd like for each attribute - you can refer to our step-by-step decision guides to help make these decisions ([guide for Snowplow Insights customers](https://docs.snowplowanalytics.com/wp-content/uploads/2020/09/Cookie-config-calculator-Insights.pdf) / [guide for Open Source users](https://docs.snowplowanalytics.com/wp-content/uploads/2020/09/Cookie-config-calculator-Open-Source.pdf))
*   update your cookie attribute settings in the collector configuration
*   update your cookie attribute settings in the Javascript Tracker initialization


## In conclusion...

For companies that want to perform reliable first party tracking on their own websites, reliable tracking is possible, but it requires more work to setup your Snowplow infrastructure, especially with respect to cookies. 

This post helps Snowplow users understand the options and the implications of different settings, so you can set your pipeline up to collect the most accurate and complete data set from the web.

**If you are already using Snowplow Insights** check your configuration in the Insights Console and speak to your Customer Service Manager if you have any questions. 

**If you are not yet using Snowplow** and are interested in finding out more about how you can increase the completeness and quality of the data you collect from your digital products, [reach out today](https://snowplowanalytics.com/get-started/).


