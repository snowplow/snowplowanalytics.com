---
layout: post
title-short: Demystifying the SameSite Cookie update
title: "Demystifying the SameSite Cookie update: Understand what the SameSite cookie update means and how it will affect you"
description: "What the SameSite Cookie update entail and what you need to do about it"
author: Paul
category: Data insights
permalink: /blog/2020/01/30/demystifying-samesite-cookie-update/
---

## What the SameSite Cookie update entails

You may have heard about the upcoming changes that are being made to how cookies are going to work in Chrome in February 2020 and that these changes have the potential to cause issues for your analytics. In September 2019, the Chromium project announced that starting in Chrome 80 any cookies that do not specify the SameSite attribute will be treated as if they were SameSite=Lax (Except for POST requests where the cookies will still be included). By changing the default behaviour when a cookie does not specify the SameSite attribute has the potential to break both fundamental aspects of a website but in particular any third party tracking that may be in place.

If you are already familiar with the SameSite update, you can jump straight to [what this means for your Snowplow collector][].

### What a SameSite cookie is

Cookies are a mechanism that allows a websites state or data to be stored in a users browsers. However, in their currently implementation they are often implemented in a way that has the potential to leak information. Browsers are starting to change their defaults to ensure privacy first cookies.

SameSite is a new cookie attribute that browsers understand but what do we mean when we say SameSite? Let's first consider the `Site` part. A site is defined as the domain suffix (e.g. .com, .co.uk, .net, etc) and the section before it. So in the case of this page, the full domain is `www.snowplowanalytics.com` but the site is `snowplowanalytics.com`. Now for the `Same` part. Any domain that is on the `snowplowanalytics.com` site will be classed as on the same site.

When a cookie is referred to SameSite, this means the SameSite attribute is speficied on the cookie. If we consider the two concepts in the previous paragraph, we can start to understand that the `SameSite` attribute represents a method of controlling whether a cookie is sent with requests to the site or not. Lets take a look at an example:

If a server sets the following cookie on `collector.snowplowanalytics.com`:

`sp=1234; Max-Age=31557600; Secure`

Then all requests that are made to `snowplowanalytics.com` will have this cookie attached. So if you are on `blog.snowplowanalytics.com` then this cookie will be sent to all requests to any `snowplowanalytics.com` domains. However, this cookie will also be sent if requests are made from another site entirely to a `snowplowanalytics.com` site.

### What this change means for your website

Setting a cookies SameSite property to Lax by default has a couple of consequences:-

- Requests that are sent to domains that are not the same as the parent domain (the one in the address bar) will not have these cookies included in requests.
- A substantial amount of cookies that are out there do not specify the SameSite attribute at all so they will suddenly start behaving differently.

On the surface this isn't an issue for many sites, as a sites backend services will operate on the same domain as the front end. However, if you are sending requests to a different domain and these cookies are important then this is where your issues might begin. For instance, some login services or embedded content may be setting cookies that are required for authentication. Later in this post we will describe how you can check if your site is affected.

One type of request that is likely going to be affected by this are third party tracking provider requests. The providers will often be running on a different domain and may not be including the SameSite atribute on cookies. This means any tracking that relies on these cookies has the potential to stop working. You may need to take action to ensure cross site tracking contains to work in Chrome 80.

### Why it is happening now

The new default is designed to better protect everyones privacy online, as well as giving sites that are delivering cookies an avenue to explicitly label them so that they are never sent in any cross-site requests. By changing the SameSite attribute to Lax by default, we are ensuring that third party services must label their cookies in a way that will allow them to be sent cross-site.

There has been a proposal which is refered to as Incrementally Better Cookies that was published last year and this is one of the first steps towards that. It is expected that other browsers will also take this step towards handling cookies in this way.

### What it means for your tracking

If you are relying on cookies to identify users then this may stop working for users who browse sites with Chrome. If the cookie that has been stored, does not contain the `SameSite=None` attribute then the cookie will not be sent in any requests to the third party server.

### How to check if you are affected

There are two types of requests that we generally talk about, first party and third party. A first party request is one that is sent to the same domain that the website is being served from (i.e. the same as the domain visible in the browsers address bar). Whereas a third party request is one which is sent to a domain that is different from the one visible in the browsers address bar.

Many analytics tools will send events to a third party domain. However there are some analytics tools, such as Snowplow, that allow you to track events to the same top level domain that the site is being served from. This has the benefit that any cookies that are sent from the server to be stored on in the browser will be deemed as first party cookies.

#### Tracking with first party cookies

The SameSite cookie updates doesn't have any effect if you are tracking users via a first party domain, as this means the cookies are stored in a first party context too. The new default of SameSite=Lax will have no effect on the first party cookies and they will continue to be sent. 

In a Snowplow context, this means that your network_userid will work as it has always done. Tracking with first party cookies is our recommended practice, particularly as the end of the road is in sight for third party cookies in light of ITP changes in Safari and further restrictions by other browsers.

#### Tracking with third party cookies



### What you need to do about it

For any cookies that need to be sent to a third party domain, you need to ensure that the cookie contains the `SameSite=None` and `Secure` attributes.

### Useful liks

- [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
- [How to implement SameSite cookies](https://web.dev/samesite-cookie-recipes/)
- [Chromium progress on SameSite updates](https://www.chromium.org/updates/same-site)

## Summary
