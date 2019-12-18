---
layout: post
title: "How ITP 2.1 works and what it means for your web analytics"
tags: [ITP 2.1, analytics, data, data collection, intelligent tracking, web data]
author: Lyuba
image:
category: Data Insights
permalink: /blog/2019/06/17/how-ITP2.1-works-what-it-means-for-web-analytics/
discourse: true
published: true
featured: true
featured-image: /assets/img/blog/featured/SP-Blog-Post-How_ITP_Works.jpg
thumbnail-image: /assets/img/blog/featured/SP-Blog-Post-How_ITP_Works-mini.jpg
---
Big changes are coming to the way businesses collect web data. Browser manufacturers, led by Safari, continue to introduce privacy updates to prevent third parties from tracking users across websites. Although these measures target advertising companies that track users across different websites, they also impact businesses using web analytics to optimize their websites and provide visitors with the best possible experience: especially businesses relying on third-party web analytics tools, including Google Analytics.

In this article, the first in a two-part series, we'll review some of the browser privacy updates in detail and explain why and how they impact companies doing web analytics. In the [second article of the series](https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/), we will cover how using first-party rather than third-party data collection tools can insulate companies doing legitimate web data collection from these types of browser-based measures.

## How does Intelligent Tracking Prevention work?

Apple introduced [Intelligent Tracking Prevention](https://webkit.org/blog/7675/intelligent-tracking-prevention/) (ITP) in 2017 as an effort to restrict third parties with no direct relationship to a website’s visitors from tracking those visitors across different websites. To better understand how ITP works, it is helpful to first take a look at the difference between first-party and third-party tracking.

### First-party vs. third-party tracking

Say you own a company called Brilliant Clothing and you have a website, brilliantclothing.com. If you track visitors on brilliantclothing.com this tracking is called "first party", because you (the owner of the website) track users on your own site.

If, on the other hand, you add a tracking snippet from "Advertising Technology Company", who own the website advertisingtechonlogy.com, to your website brilliantclothing.com, so the team at Advertising Technology Company now tracks your users, that tracking is called third party, because a third party (not you, the first party, and not your visitors, the second party) does the tracking.

### First-party vs. third-party cookies

Cookies are simple stores of information kept in a user's browser. Websites use cookies to store information so that it can be persisted across different web pages. This is very useful: if a user logs in to your website, for example, you do not want to have to ask the user to log in again every time they load a new page. Instead, a cookie is set with the user ID, and each time a new web page is loaded, it checks for the existence of the cookie and sees from the cookie whether the user has already logged in (and who the user is).

Cookies are also essential for user tracking; a new user to your website can be assigned a unique user ID. This value gets stored in a cookie that is recorded with every web page the user loads. It is then easy when looking at the web data to identify all the different web pages the user has looked at (they will all be stored against the user cookie ID) and build an understanding of what this user was doing.

When a cookie is set by the website owner, such as Brilliant Clothing in our example, it is called a "first party cookie". If the cookie is set by Advertising Technology company, then it is a "third-party cookie". When cookies are stored, they are stored against the domain that sets them - so cookies set by brilliantclothing.com can only be read by brilliantclothing.com, and cookies set by advertisingtechnology.com can only be read by advertisingtechnology.com.

Because cookies are set against the domain that set them, it is easy to inspect a list of cookies that have been set and categorize them into first party rather than third party based on the domain.

This helps explain why Apple’s measures to prevent third-party advertising companies from tracking users across websites targeted the setting and storage of cookies used by those third parties. Read on to find out how Apple’s ITP has evolved since its original version and the impact it has had on ad tech companies and web analytics.


## From ITP 1.0 to ITP 2.2: Changing approaches to web analytics tracking

The first version of ITP ([ITP1.0](https://webkit.org/blog/7675/intelligent-tracking-prevention/)) targeted cookies set by third parties that the user did not interact with. For example, if a user on the Safari browser visited brilliantclothing.com and had a cookie set by advertisingtechnology.com, Safari monitored to see if the visitor had any kind of relationship with advertisingtechnology.com, e.g., does the user visit advertisingtechnology.com? If not, then advertisingtechnology.com was classified as a domain performing cross-site tracking, and the cookies set on advertisingtechnology.com got "partitioned", so that values set on one website would not be readable on another. This means advertisingtechnology.com could no longer use these cookies to consistently track Safari users across different websites. Since these measures targeted third-party cookies a website visitor had no relationship with, they did not impact web analytics tracking.

There were multiple subsequent versions of ITP ([ITP 1.1](https://webkit.org/blog/8142/intelligent-tracking-prevention-1-1/), [ITP 2.0](https://www.tune.com/blog/what-apples-intelligent-tracking-prevention-2-0-itp-means-for-performance-marketing/)) that updated the treatment of third-party cookies, but none of which interfered with the cookies set by third-party web analytics providers. However, the ITP 2.1 and 2.2 updates now limit the use of first-party cookies as well. Let’s take a closer look at the recent releases and the changes they introduce.

### ITP 2.1

In contrast with earlier updates, [ITP 2.1](https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/), which was announced in February 2019, did have a significant impact on web analytics tracking. With ITP 2.1, Apple started purging first-party cookies set via JavaScript via JavaScript with a 7-day expiration, which is problematic because these types of cookies are the principal user identifier used by web analytics systems.

Let's explore why Apple introduced this measure and what impact it has on web analytics data collection.

It’s important to remember that cookies can either be set client-side, by code running in a user's browser, or server-side, by a web server somewhere out on the internet. If a cookie is set server-side, the domain associated with the cookie is the domain of the web server that sets the cookie. However, if the cookie is set client-side by JavaScript executing in the visitor’s browser, the domain is always the domain of the website that the user is currently visiting. For this reason, cookies set client-side are always "first party": they are stored against the domain of the website themselves. They can be read by any JavaScript running on that website.

As it turns out, several advertising technology companies were tracking users using first-party cookies set by JavaScript, then accessing these cookies so they could advertise to those users. While it is unclear how this was accomplished technically, from an advertiser's perspective the advantage of this approach was that the cookie identifying the user was first rather than third party, and therefore not subject to the same restrictions, which made it more reliable. By introducing ITP 2.1, Apple has attempted to clamp down on this practice.

The problem for web analytics solutions? They typically use first-party cookies set via JavaScript. This makes a lot of sense: Google Analytics (and other web analytics vendors) can provide their users with a JavaScript file to load if they want to perform tracking. That JavaScript file can set cookies on each website the Google Analytics user wants to track. Since the cookie is set on a first-party domain, it is reliable (unlike third-party cookies, which are often blocked). The IDs are only used to report on visitor activity for the website in question, so the use of the data is strictly first party. And setting the cookie via JavaScript means the team at Google Analytics does not need to setup multiple web servers, one for each client domain, to set cookies server-side: the same JavaScript will set the right cookie on the right domain for millions of Google Analytics users around the world.

However, one of the unintended consequences of ITP 2.1, is that first-party cookies set via JavaScript (i.e. the cookies used by web analytics vendors like Google Analytics) will be deleted after seven days.

### ITP 2.2

[ITP 2.2](https://webkit.org/blog/8828/intelligent-tracking-prevention-2-2/) builds on ITP 2.1, and addresses tracking via link decoration, another strategy companies came up with to bypass previous ITP restrictions. Most importantly, ITP 2.2 makes it so that in some cases, cookies set by JavaScript are removed after just one day instead of seven days. In this way, ITP 2.2 presents an even bigger problem for cookies set by web analytics systems because a user returning to a website after 25 hours would already be treated as a new user, rather than as a returning user. You can find out more details about [ITP 2.2 in John Wilander’s webkit article here](https://webkit.org/blog/8828/intelligent-tracking-prevention-2-2/).

Since many web analytics platforms use first-party cookies, ITP 2.1 and ITP 2.2 are likely to impact the quality of data they collect, creating unintended consequences for businesses that rely on third-party web analytics solutions.

## What ITP means for businesses using third-party data collection

To recap, many third-party web analytics solutions use first-party cookies set by JavaScript to identify users. These third-party data collection solutions collect data on behalf of a business using first-party cookies, which makes them subject to removal after seven days.

Needless to say, this presents a huge challenge for any business relying on a third-party web analytics solution for user data they need to make decisions around marketing, product and business intelligence.

For example, say a retailer uses a marketing attribution tool to track and report on advertising campaigns:

*If the user clicks an ad, and makes a purchase within seven days, the web analytics system will be able to spot that it is the same user who clicked the ad and then made the purchase, and correctly attribute the transaction to that ad campaign.

*On the other hand, say the user clicks on the ad and makes the purchase after eight days. Since the cookie was purged the day before, the user will look like a new user, and the web analytics system will not be able to spot that it is the same user who clicked the ad eight days ago. This means the ad campaign will not be correctly attributed to the transaction.

Here are a few additional ways ITP 2.1 impacts a business’s web analytics strategy by significantly decreasing the effectiveness of third-party data collection solutions:

1.Returning users become “new” again after seven days, making data less reliable and user journey mapping more difficult

2.Businesses lose insight into user behavior over an extended period of time

3.With only a seven-day window for A/B testing, results might be inconclusive or inaccurate

Understandably, data-driven companies relying on analytics will struggle the most since nearly all web analytics depend on cookies set by JavaScript, including Google Analytics, Heap and Segment. Even though a [number of technical workarounds to ITP already exist](https://www.simoahava.com/analytics/itp-2-1-and-web-analytics/), browsers, including Safari, Chrome and Firefox, will continue to patch loopholes, making any third-party data collection platforms unreliable as a long-term solution.

The good news? Long-term solutions exist that enable businesses to collect customer data without having to worry about future ITP updates. [The next blog post in this series](https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/) will dive into how you can reliably collect web analytics data in an increasingly secure and privacy-aware, ITP world.
