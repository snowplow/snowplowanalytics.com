---
layout: post
title: "Tracking consent on mobile is just as important as web for GDPR"
title-short: Mobile consent tracking for GDPR
tags: [analytics, consent, GDPR]
description: Why you need to consider mobile when thinking about GDPR
image: /assets/img/blog/2018/05/cross-platform-market.png
author: Anthony
category: GDPR
permalink: /blog/2018/05/04/tracking-consent-on-mobile-is-just-as-important-as-web-for-gdpr/
discourse: true
---


![Mobile has become the dominant web browsing method][users]


Mobile has become a significant channel for user engagement to the point where it needs to be treated with at least equal importance as traditional web. With GDPR enforcement set to go live on May 25, 2018, at the time of writing the fervor of conversation around compliance is steadily growing. However, much of that conversation is focused around web analytics. Given that web-based digital platforms, specifically websites, will potentially be the most significantly impacted, this makes sense. Cursory research will bring up a handful of quality articles and think pieces around preparing a mobile app for GDPR compliance, but there are only a few pieces of content tackling a major area of overlap: web traffic from mobile devices. Because of how prevalent mobile browsing has become, consent tracking through mobile channels is a necessary consideration in planning a GDPR compliance strategy.

<h2 id="your gdpr plan needs mobile">Your GDPR plan needs to include mobile</h2>

Smartphone adoption and usage has been on a meteoric rise over the past few years. As mobile technology becomes better and better at reproducing the desktop web experience, people are spending more time on the mobile devices doing the browsing they would have previously only done at a computer. That means your users are visiting your website from their computers and their smartphones, and there’s a high likelihood that more often than not, they’re using their phone.

There’s no shortage of statistics to support this idea. In 2016, internet monitoring firm StatCounter identified that [worldwide mobile web browsing surpassed desktop browsing for the first time][statcounter]. Looking at the market share over the last twelve months, mobile has eked out an advantage and is maintaining its dominance over desktop browsing:

![Global market share of internet consumption by device][market-share]

<h2 id="popularity of mobile and gdpr">What does the popularity of mobile mean for GDPR?</h2>

One of the most important factors that companies need to consider in the wake of GDPR is tracking consent. As we discussed in [a previous post specifically on consent management][consent], an individual user’s consent is one of the primary mechanisms for lawfully collecting data and will be the crux of many companies’ data policy. Making sure that an individual user’s data rights are being upheld is challenging enough already given the spectrum of possible consents and a company’s ability to manage those consents on an individual level. When you consider how many of those users are also very likely web browsing on multiple devices, it’s very clear that being able to track consent across these different devices is crucial for remaining compliant.

![multi-device users are the majority][multi-platform]

As of October, 2017, the majority of users across global markets identified as multi-platform, meaning they access and engage with online content using a desktop in addition to a smartphone or tablet. With as much as 45% of your audience likely to be visiting your website on multiple devices, not creating consistency cross-platform is at least a customer experience mistake and at worst causes a GDPR compliance violation.

<h2 id="mobile consent tracking">Solving for mobile consent tracking</h2>

Snowplow has always taken cross-platform data integrity very seriously. We understand the need for, and the benefits of, a single source of truth that is reliable and consistent. To that end, in addition to the latest release of our [JavaScript tracker][js-tracker] allowing for consent tracking on both desktop and mobile versions of websites, we're working towards comprehensive event tracking in mobile ecosystems, not limited to web browsing.

The most recent update of our [Objective C tracker for iOS][ios] includes the ability to track consent events within iOS, so users with digital products available for iPhones can pair product engagement with web activity and keep all of a user’s consent events, and their associated context, in one place. The Objective C tracker update with consent tracking, and its soon to be released Android companion, are the first steps in making sure that you can easily see and manage consent across multiple devices.

With the forthcoming release of our Android consent tracker, the Snowplow consent tracking functionality will be available across the three major digital channels: web, iOS, and Android. While this list is far from exhaustive (more trackers coming soon), this covers a wide swath of the environments where companies will need to collect and manage user consent. This multi-ecosystem approach is a cornerstone of Snowplow’s GDPR functionality, letting you manage consent at the individual level across all of a user’s devices.

<br>
{% include shortcodes/subscribe.html layout="blog" %}





[users]: /assets/img/blog/2018/05/mobile-users.jpg

[statcounter]: http://gs.statcounter.com/press/mobile-and-tablet-internet-usage-exceeds-desktop-for-first-time-worldwide

[market-share]: /assets/img/blog/2018/05/cross-platform-market.png

[consent]: https://snowplowanalytics.com/blog/2018/03/09/how-to-manage-consent-for-gdpr-a-nuanced-approach/

[multi-platform]: /assets/img/blog/2018/05/multi-platform-users.png

[js-tracker]: https://snowplowanalytics.com/blog/2018/02/28/snowplow-javascript-tracker-2.9.0-released-with-consent-tracking/

[ios]: https://snowplowanalytics.com/blog/2018/04/06/snowplow-objective-c-tracker-0.8.0-released/
