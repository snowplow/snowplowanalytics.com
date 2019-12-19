---
layout: post
title-short: "How ITP 2.3 expands on ITP 2.1 and 2.2"
title: "How ITP 2.3 expands on ITP 2.1 and 2.2 and what it means for your web analytics"
description: "ITP 2.3 closes tracking loopholes but first-party, server-side-set tracking is the light at the end of the tunnel"
author: Erika
category: Data insights
permalink: /blog/2019/12/16/how-itp-2.3-expands-on-itp-2.1-and-2.2-and-what-it-means-for-your-web-analytics/
---

Major web-browser privacy updates, in particular[ ITP 2.1 (and 2.2), which we’ve previously written about](https://snowplowanalytics.com/blog/2019/06/17/how-ITP2.1-works-what-it-means-for-web-analytics/), are negatively affecting companies’ ability to perform web analytics. ITP, or Intelligent Tracking Prevention, was originally introduced in 2017 in the Safari browser as a measure to restrict third-party ad tech companies from tracking visitors across different websites. Subsequent iterations, in ITP 2.1 and 2.2, have tightened restrictions to close tracking loopholes — these are primarily moves from third-party to first-party and client-side to server-side cookies (we’ll get into this later). Third-party web analytics companies are in the line of fire, meaning that companies relying on many of the major analytics solutions on the market will face setbacks in your data analytics, digital marketing, marketing attribution and personalization strategies. But all is not lost. You can do something about it, and it has everything to do with how you collect data.

We’ll dive a bit deeper into the details later in this article, but upfront it’s worth noting that Snowplow users don’t need to worry about ITP because ITP blocks tracking approaches employed by third-party technology stacks used to collect data. Snowplow technology is a first-party technology solution, helping companies collect their own, first-party data via their own, first-party Snowplow pipeline. As stated, it’s about who you are in relation to the data and how you collect it, and in this instance, Snowplow can help. 

Your data collection may be your saving grace in terms of having access to the data you need for your analytics use cases. Apple’s own approach is illustrative of their position: opportunistic third-party ad networks and ad tech companies have liberally leveraged tracking technology on sites that do not belong to them at the expense of user privacy and the user experience. ITP takes aim at these data collection practices.The shift – both in terms of the technology and the philosophy behind it – aims to stop this cross-domain tracking, primarily from ad networks that follow users from site to site trying to profile them. By looking at what you _can_ do rather than focusing on what you can’t, you can rebalance your data collection and tracking efforts to [ITP-proof your web data collection strategy](https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/). 


## The ITP timeline

Understanding the evolution of [ITP](https://webkit.org/blog/category/privacy/) requires a basic understanding of the difference between first and third-party tracking, keeping in mind that most analytics solutions are third party. 


### From third-party to first-party tracking

Let’s say you own a company called Company A with a website called companyA.com. Because it is your site, any tracking you do is “first party” because you are tracking movements on your own site and traffic. However, when Company A decides to use a data analytics solution called Company B, their tracking on your site is classified as third-party tracking. When ITP was first introduced, its earliest versions aimed to restrict tracking capabilities in a third-party cookies, such as for entities like ad tech companies. 

As a result, ad-tech vendors moved to first-party cookies set client-side and found ways to stitch the website data across domains. First-party, client-side cookies are the mechanism by which third-party web analytics systems identify users. ITP continued to build on the third-party cookie restrictions, but until ITP 2.1 and 2.2, ITP did not interfere with cookies set by third-party web analytics providers. ITP affects Safari users specifically (up to 20% of your traffic, depending on your user profile), but similar measures from other browser makers (Mozilla’s Enhanced Tracking Protection in Firefox and Google Chrome’s anti-tracking protections, for example) will create distortions and gaps in your analytics until you move to a first-party solution that lets you own your own data and how you collect it.


### ITP 2.1 and 2.2

In February 2019, ITP 2.1 changed the web analytics game. ITP 2.1 targeted these first-party, client-side-set cookies, which ended up “breaking” a lot of web analytics tracking. ITP 2.1 did not restrict the use of first-party, client-side cookies but did introduce a seven-day expiration period. This changed everything for web analytics providers because, as mentioned above, first-party cookies set by JavaScript are their primary means of identifying users. These solutions use first-party, client-side cookies to collect data _on behalf of_ a business rather than the business (and its domain) collecting the data itself, so these cookies fall under the seven-day expiration mandated by ITP 2.1. Under ITP 2.1 if a user visits your website, for example, and then returns after eight days, they will look like a “new” user rather than a “returning” user. 

Immediately, the challenges become obvious — from being able to accurately attribute user actions and marketing efforts to understanding user behavior over time to misidentifying existing users as new. 

Add to this ITP 2.2’s handling of [link decoration](https://webkit.org/blog/8828/intelligent-tracking-prevention-2-2/). Link decoration was one method by which cookies were synced between different domains, passing their values from one domain to another on the query string of a link click URL. ITP 2.2 effectively capped first-party, client-side-set cookies through `document.cookie` to just _one day_ of storage. Naturally, as with all such measures, various [workarounds](https://www.simoahava.com/analytics/itp-2-1-and-web-analytics/) were employed. A common route around ITP 2.1 and ITP 2.2 was to save the anonymous user identifiers in localStorage rather than cookies. This was an attractive, if limited, dodge because it was done directly in JavaScript (like setting a cookie) by persisting a user identity across webpages over time. While ITP 2.1 deleted cookies after seven days, it didn't touch localStorage, so this workaround proved effective until ITP 2.3.


### ITP 2.3

ITP 2.3 effectively shut down the local storage workaround. Why? Apple notes that: “Site owners have been convinced to deploy third-party scripts on their websites for years. Now those scripts are being repurposed to circumvent browsers’ protections against third-party tracking. By limiting the ability to use any script-writeable storage for cross-site tracking purposes, ITP 2.3 makes sure that third-party scripts cannot leverage the storage powers they have gained over all these websites.” With [ITP 2.3](https://webkit.org/blog/9521/intelligent-tracking-prevention-2-3/), localStorage is now cleared alongside cookies, closing this loophole.


## Adopting first-party, server-side tracking

As your own data use cases and analytics initiatives evolve, so too should your data collection. A more mature approach to data ownership and responsibility naturally lends itself to thinking seriously about your data collection strategy and its role in deriving value from data. In an anti-third-party tracking world, how you collect data is your way to overcome potential ITP-related roadblocks while continuing to advance and enrich your data analytics program.

With a first-party data collection pipeline, like Snowplow, you can set first-party cookies server-side rather than client-side on your own domain. Because _server-set_ cookies are not impacted by ITP, this is a solid solution: you can continue to do client-side tracking, i.e., tracking in JavaScript. For the time being, this is the most reliable way to track anonymous users on the web. More broadly, moving to a first-party data collection solution means just what it says: you run your own data collection to collect data from your own sites, which you are perfectly entitled to do -- these are your sites, web pages and traffic. You as the website owner own and control your data pipeline from end to end. 

Whether you build or buy your own data collection pipeline, you get full control and ownership of your data, flexibility and transparency and don’t end up locked into a specific data solution. Snowplow, as a flexible data pipeline you fully own, can help you steer clear of the increasingly onerous restrictions posed by ITP and similar privacy-related measures while being your ITP insurance policy against getting locked out of the insights you have come to rely on.