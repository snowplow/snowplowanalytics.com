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

You may have heard about the upcoming changes that are being made to how cookies are going to work in Chrome in February 2020. In September 2019, the Chromium project announced that starting in Chrome 80 any cookies that do not specific the SameSite attribute will be treated as if they were SameSite=Lax (Except for POST requests where the cookies will still be included).

### What a SameSite cookie is



### What it means for your website

Setting a cookies SameSite property to Lax by default has a couple of consequences:-

- Requests that are sent to domains that are not the same as the parent domain (the one in the address bar) will not have these cookies included in requests.
- A substantial amount of cookies that are out there do not specify the SameSite attribute at all so they will suddenly start behaving differently.

On the surface this isn't an issue for many sites, as a sites backend services will operate on the same domain as the front end. However, if you are sending requests to a different domain and these cookies are important then this is where your issues might begin. For instance, some login services or embedded content may be setting cookies that are required for authentication. Later in this post we will describe how you can check if your site is affected.

One type of request that is going to be affected by this are third party tracking provider requests. The providers will often be running on a different domain and may not be including the SameSite atribute on cookies. This means any tracking that relies on these cookies has the potential to stop working. You may need to take action to ensure cross site tracking contains to work in Chrome 80.

### Why it is happening now

The new default is designed to better protect everyones privacy online, as well as giving sites that are delivering cookies an avenue to explicitly label them so that they are never sent in any cross-site requests. By changing the SameSite attribute to Lax by default, we are ensuring that third party services must label their cookies in a way that will allow them to be sent cross-site.

There has been a proposal which is refered to as Incrementally Better Cookies that was published last year and this is one of the first steps towards that. It is expected that other browsers will also take this step towards handling cookies in this way.

### What is means for your tracking



### How to check if you are affected

#### Tracking with first party cookies

#### Tracking with third party cookies

### What you need to do about it

For any cookies that need to be sent to a third party domain, you need to ensure that the cookie contains the `SameSite=None` and `Secure` attributes.

### Useful liks

- [SameSite cookies explained](https://web.dev/samesite-cookies-explained/)
- [How to implement SameSite cookies](https://web.dev/samesite-cookie-recipes/)
- [Chromium progress on SameSite updates](https://www.chromium.org/updates/same-site)

## Summary
