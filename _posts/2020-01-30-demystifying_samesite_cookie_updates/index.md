---
layout: post
title-short: Understanding the SameSite Cookie update
title: "Understanding the SameSite Cookie update: what the SameSite cookie update means and how it will affect you"
description: "What the SameSite Cookie update entails and what you need to do about it"
author: Paul
category: Data insights
permalink: /blog/2020/01/30/understanding-the-samesite-cookie-update/
---

## What the SameSite Cookie update entails

You may have heard about the upcoming changes that are being made to how cookies are going to work in Chrome starting from 17th February 2020 and that these changes have the potential to cause issues for your analytics. In September 2019, the [Chromium team announced](https://www.chromium.org/updates/same-site) that starting in Chrome 80 any cookies that do not specify the SameSite attribute will be treated as if they were `SameSite=Lax` (Except for POST requests where the cookies will still be included to reduce the chance of sites breaking). Changing the default behaviour of a cookie that does not specify the SameSite attribute has the potential to break both fundamental aspects of a website as well as any third party tracking that may be in place. In addition to this change, any cookies which specify `SameSite=None` so they can be transmitted cross-site, must also specify the `Secure` attribute or they will be ignored. In this post we're going to see how these changes could affect your site and what you can do about it.

If you are already familiar with the SameSite cookies and the update, you can jump straight to [what this means for your tracking and your Snowplow collector](#what-it-means).

<!--more-->

### Secure cookies

Cookies are a mechanism that allows a website's state or data to be stored in a user's browser. However, in their current implementation they are often implemented in a way that has the potential to leak information. Browsers are starting to change their defaults to ensure privacy first cookies.

A Secure cookie is one which can only be transmitted over a secure connection (HTTPS). This helps to ensure that the cookie is transmitted in a secure manner when requests are being made to the web server, this is particularly important when storing sensitive, authenticate or identification data inside cookies.

To ensure a cookie is only availble to be sent over secure connections, the 'Secure' attribute should be specified on the cookie, like so:

```http
sp=1234; Max-Age=31557600; Secure
```

### SameSite cookies

SameSite is a new(-ish) cookie attribute that browsers understand but what do we mean when we say SameSite? Let's first consider the `Site` part. A site is defined as the domain suffix (e.g. .com, .co.uk, .net, etc) and the section before it. So in the case of this page, the full domain is `www.snowplowanalytics.com` but the site is `snowplowanalytics.com`. Now for the `Same` part; any domain that is on the `snowplowanalytics.com` site will be classed as on the same site.

When a cookie is referred to SameSite, this means the SameSite attribute is speficied on the cookie. If we consider the two concepts in the previous paragraph, we can start to understand that the `SameSite` attribute represents a method of controlling whether a cookie is sent with requests to the site or not. Lets take a look at an example:

If a server sets the following cookie on `collector.snowplowanalytics.com`:

```http
sp=1234; Domain=snowplowanalytics.com; Max-Age=31557600; Secure
```

Then all requests that are made to `snowplowanalytics.com` will have this cookie attached. So if you are on `blog.snowplowanalytics.com` then this cookie will be sent to all requests to a `snowplowanalytics.com` domain. However, currently this cookie will also be sent if requests are made from another site entirely to a `snowplowanalytics.com` domain, perhaps they are running some software that makes requests to something hosted on the `snowplowanalytics.com` site.

To restrict the sites which the cookie can be sent to there are three options for the SameSite attribute: `None`, `Lax` and `Strict`. To keep things simple, lets focus on the values related to this change: `None` and `Lax`.

```http
sp=1234; Domain=snowplowanalytics.com; Max-Age=31557600; Secure; SameSite=None
```

`SameSite=None` will allow the cookie to be sent with all requests to `snowplowanalytics.com` no matter what the parent domain is (the url in the address bar).

```http
sp=1234; Domain=snowplowanalytics.com; Max-Age=31557600; Secure; SameSite=Lax
```

`SameSite=Lax` is the new default that this update brings and will prevent the cookie being sent with requests to `snowplowanalytics.com` if they are not from a `snowplowanalytics.com` domain.

### What this change means for your website

Setting a cookie's `SameSite` attribute to `Lax` by default has a couple of consequences:

- Requests that are sent to domains that are not the same as the parent domain (the one in the address bar) will not have these cookies included in requests (cross-site requests).
- A substantial amount of cookies that are out there do not specify the SameSite attribute at all so they will suddenly start behaving differently.

It is quite likely that this isn't an issue for many sites, as a sites backend services will operate on the same domain as the front end; meaning the cookies will continue to be sent with the new `SameSite=Lax` default. However, if you are sending requests to a different domain and these cookies are important then this is where your issues will begin. For instance, some third party login services or embedded content may be setting cookies that are required for authentication. Later in this post we will describe how you can check if your site is affected.

Requiring `SameSite=None` cookies to require `Secure` also has a couple of consequences:

- If the cookie is being transmitted cross-site and the server does not accept secure connections (HTTPS) then the cookie can no longer be sent.
- There are some old browsers which are not compatible with `SameSite=None; Secure` cookies, the Chromium team have [published a list](https://www.chromium.org/updates/same-site/incompatible-clients).

Most websites are already operating on secure (HTTPS) connections which means that the `Secure` attribute doesn't pose much worry, but it is worth ensuring communication with any third party servers is being done securely if the site is still accessible on insecure (HTTP) connections. Due to the older, incompatible browsers you may experience data usually contained within cookies from these browsers not working as expected. In the case of Snowplow, this will mean new `network_userid`s will be generated for requests from these incompatible browsers and will skew user counts that are relying solely on the `network_userid`.

One type of request that is likely going to be affected by these two changes are third party tracking provider requests. The providers will often be running on a different domain and may not be including the `SameSite` attribute on cookies. This means any tracking that relies on these cookies has the potential to stop working. _You may need to take action to ensure cross-site tracking continues to work in Chrome 80._

### Why it is happening now

The new default is designed to better protect everyone's privacy online, as well as offering sites that are delivering cookies an avenue to explicitly label them so that they are never sent in any cross-site requests. By changing the `SameSite` attribute to `Lax` by default, the Chromium team are ensuring that third party services must label their cookies in a way that will allow them to be sent cross-site.

There has been a proposal which is refered to as [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) that was published last year and this is one of the first steps towards that. It is expected that other browsers will also take this, or similar, steps toward handling cookies in this way.

<h3 id="what-it-means">What it means for your tracking</h3>

If you are relying on cookies to identify users then this may stop working for users who browse sites with Chrome (and other Chromium based browsers). If the cookie that has been stored does not contain the `SameSite=None` attribute then the cookie will not be sent in any requests to the third party server.

### How to check if you are affected

There are two types of requests that we generally talk about, first party and third party. A first party request is one that is sent to the same domain that the website is being served from (i.e. the same as the domain visible in the browsers address bar). Whereas a third party request is one which is sent to a domain that is different from the one visible in the browsers address bar.

Many analytics tools will send events to a third party domain. However there are some analytics tools, such as Snowplow, that allow you to track events to the same top level domain that the site is being served from. This has the benefit that any cookies that are sent from the server to be stored on in the browser will be deemed as first party cookies.

#### Tracking with first party cookies

The SameSite cookie updates doesn't have any effect if you are tracking users via a first party domain, as this means the cookies are stored in a first party context too. The new default of SameSite=Lax will have no effect on the first party cookies and they will continue to be sent.

In a Snowplow context, this means that your `network_userid` will work as it has always done. Tracking with first party cookies is our recommended practice, particularly as the end of the road is in sight for third party cookies in light of ITP changes in Safari and further restrictions by other browsers.

#### Tracking with third party cookies

Chrome 79 contains a number two flags which can be toggled to see if the SameSite updates will cause issues for a site. With Chrome 79, navigate to `chrome://flags` and enable `#same-site-by-default-cookies` and `#cookies-without-same-site-must-be-secure`. Restart the browser.

Test your sites, with a focus on anything involving multiple domains or cross-site content. In particular you will want to pay attention to any analytics that involves tracking data stored inside cookies. If your site or tracking stops working as expected, turn each of the flags off one at a time (restarting the browser each time) to find out with setting is causing the issue.

In a Snowplow context, you will want to check if your `network_userid` is tracking as expected. If the SameSite updates are causing issues for your configuratino, you should notice `network_userid`s being regenerated on every event that tracks for the same user (identified by `domain_userid` or `user_id`).

### What you need to do about it

For any cookies that need to be sent to a third party domain, you need to ensure that the cookie contains the `SameSite=None` and `Secure` attributes. This is going to depend on the vendor or software you are using that is making use of these cookies. In the case of Snowplow, the Snowplow Collector can be configured to return the cookie containing the `network_userid` field with the `SameSite=None` and `Secure` attribtues.

Before thinking about taking steps to fix any third party cookies, it is worth considering if there is the option of moving to first party cookies by utilising running the vendor services on the same domain as your site. Where this is possible, it will not only solve any issues faced by the `SameSite` changes but will also ensure cookies will continue to work further into the future. Many browser vendors are also taking steps to prevent third party cookies working at all, see our [blog posts about ITP in Safari](https://snowplowanalytics.com/blog/2019/12/16/how-itp-2.3-expands-on-itp-2.1-and-2.2-and-what-it-means-for-your-web-analytics/) for more information.

#### As a Snowplow Insights customer

Snowplow Insights customers don't need to do anything with their collector configuration. The Snowplow team has already configured collectors to return the `network_userid` cookie with the `SameSite=None` and `Secure` attributes. It is worth checking that your tracking is being sent to a secure (HTTPS) endpoint as the new `Secure` attribute will lead to the cookie not being sent with insecure requests.

Where possible, running the Snowplow collector on the same domain as the site allows for the `network_userid` cookie to be set as a first party cookie. With the release of R116, the Snowplow collector allows for multiple domains to be configured which we discuss in more detail in our [R116 release post](https://snowplowanalytics.com/blog/2019/09/12/snowplow-r116-madara-rider/#cookies). Please contact Support if you wish to configure this for your collector.

#### As a Snowplow Open Source user

The Scala Stream Collector can be configured to return the `network_userid` with the `SameSite=None` and `Secure` attributes by modifying the collector configuration. This feature was released in R116 and was announced in our [R116 release post](https://snowplowanalytics.com/blog/2019/09/12/snowplow-r116-madara-rider/#cookie-attr). The steps required to upgrade and the new configuration settings can also be found in the same [release post](https://snowplowanalytics.com/blog/2019/09/12/snowplow-r116-madara-rider/#upgrading). As mentioned above, running the collector on the same domain as the site allows for the `network_userid` cookie to be set as a first party cookie. Our [R116 release post](https://snowplowanalytics.com/blog/2019/09/12/snowplow-r116-madara-rider/#cookies) details how to achieve this.

For Open Source users of the Clojure or Cloudfront collectors, these have been deprecated and are not capable of setting the `SameSite` or `Secure` attributes. You should look into our [Upgrade guide](https://discourse.snowplowanalytics.com/t/aws-batch-pipeline-to-real-time-pipeline-upgrade-guide/3470) to find out how to move from a Batch to a Realtime pipeline.

### Useful links

- [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
- [How to implement SameSite cookies](https://web.dev/samesite-cookie-recipes/)
- [Chromium progress on SameSite updates](https://www.chromium.org/updates/same-site)
