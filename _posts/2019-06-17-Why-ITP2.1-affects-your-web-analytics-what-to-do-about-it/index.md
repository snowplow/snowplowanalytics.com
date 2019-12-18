---
layout: post
title: "Why ITP 2.1 affects your web analytics and what to do about it"
tags: [ITP 2.1, analytics, data, data collection, intelligent tracking, web data]
author: Lyuba
image:
category: Data insights
permalink: /blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/
discourse: true
published: true
---
[In the first part of this article series](https://snowplowanalytics.com/blog/2019/06/17/how-ITP2.1-works-what-it-means-for-web-analytics/), we introduced Intelligent Tracking Prevention (ITP) and other browser-based privacy updates that have already begun to affect businesses relying on third-party data collection platforms to manage their web analytics activity. This second article addresses in detail what you can do to “ITP proof” your web data collection strategy.

As we’ve described, ITP presents a fundamental problem for third-party web analytics vendors and the companies that rely on these third parties. As a third-party vendor, you are likely to need to use the same technologies and approaches to providing data collection for your users as third-party advertising technology companies.

## How to reliably collect web analytics data in an ITP world

To recap, cookies can either be set in HTTP responses or through the document.cookie API (also referred to as client-side cookies). With [ITP 2.1](https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/), all persistent client-side cookies expire after 7 days.

Apple introduced ITP 2.1 because advertising technology companies were using the same technique: cookies set via JavaScript to track users to target them with advertising, as third-party web analytics companies use to track users, to provide website owners with reports and insight. As Apple and other browser manufacturers engage in an arms race with advertising technology companies to limit their ability to track users, third-party web analytics solutions are likely to be vulnerable to future measures, and customers end up at the mercy of shifting restrictions on such third parties.

For data-driven businesses that want to continue collecting accurate and reliable user data, including from users running Safari browsers, the one solution is to move to a first-party data collection solution so you can run your own data collection stack in your own environment and collect data as a first party, effectively “ITP-proofing” your web data collection.

## Benefits of first-party data collection

A first-party data collection solution is one in which the data collection pipeline is first party: the pipeline is owned and controlled end-to-end by the website owner, and is only used by the website owner. This contrasts with third-party data collection platforms like Google Analytics: Google processes data on its infrastructure on behalf of the millions of companies running Google Analytics. In contrast, a first-party data collection stack would be used only to collect data by the first party. The entire stack would run on the first party’s own infrastructure.

The key thing a first-party data collection stack can do that is difficult for a third party to do is set first-party cookies server-side. Apple rightly does not target first-party cookies set server-side because these can only be set by the website owner (rather than an ad tech provider).

Put simply, first-party data collection is not subject to the same restrictions as third-party data collection. When you collect data as a first party, cookies are set by a first-party server with its own certificate rather than client-side via JavaScript. This means Safari (and any other browser) recognizes the cookie as first rather than third party and does not apply the same limitations. As a result, any data models or analytics based on server-side set cookies will be much more reliable.

Let’s look at two first-party data collection solutions you can use:

* Snowplow: [Snowplow](https://snowplowanalytics.com/) is a first-party data collection platform that runs in your own cloud environment, which means you retain full control and ownership of the data you collect. Snowplow sets server-side cookies, which are not subject to the restrictions imposed by ITP 2.1 and 2.2.

* Build Your Own Pipeline: Building out and owning your own data pipeline has many benefits; you have full control and ownership of your data, you don’t have to rely on third parties, and you have a level of flexibility other tools can’t provide. Most importantly, you’ll be able to collect data using first-party tracking.

## What’s next?

With ITP, Apple is setting the highest bar in preventing third-party tracking of users on the web for Safari users. However, other browsers including Firefox and Google’s Chrome are following suit and also introducing new approaches to prevent cross-site tracking. In March 2019, Firefox announced the [7-day expiration of JavaScript cookies by default](https://support.mozilla.org/en-US/kb/content-blocking). Even Google Chrome recently announced they will [require websites to specify whether cookies are first or third-party.](https://martechtoday.com/safaris-itp-lead-on-chromes-tracking-prevention-it-has-a-long-way-to-go-233312)

Advertising companies will most likely continue to come up with ways to circumvent ITP, and browser manufacturers will keep coming up with solutions to block them, which means companies relying on web analytics risk getting caught in the crossfire. As a result, any solution relying on a third party will prove to be a short-term fix, so if you’re serious about data and the long-term applicability of your data analytics solution, consider moving to first-party data collection. You can get in touch with the team at Snowplow [here](https://snowplowanalytics.com/request-demo/) to learn more.
