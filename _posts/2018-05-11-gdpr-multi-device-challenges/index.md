---
layout: post
title: "GDPR challenges in a multi-platform, multi-device world"
description: Understand how GDPR impacts data collection in a multi-device world
image: /assets/img/blog/2018/05/devices.jpg
title-short: Compliant identity stitching with GDPR
tags: [analytics, consent, GDPR]
author: Anthony
category: Data Governance
permalink: /blog/2018/05/11/gdpr-challenges-in-a-multi-platform-multi-device-world/
discourse: true
---

As a company, you want to provide your users with a congruous experience across multiple platforms and devices including both web and mobile, with your data collection practices being consistent across each platform and device. To do that, you need to give users the opportunity to consent (or not) on each platform. It is nice if when a user grants or withdraws consent on one, it changes the way data is processed across all other devices and platforms. To do this identity stitch, you need to be able to collect the required data across all platforms and devices. But, if you need consent to collect the data to do the identity stitch, then this might be impossible.

Because the likelihood that [users are engaging with you using multiple devices is incredibly high][mobile], this situation can easily become frustratingly circular, resulting in you chasing down users for additional consents lest you be burdened with unidentifiable, unusable data and users exasperatedly granting (or withdrawing) their consent. In this post, we’ll identify in what situations it is and is not possible to enable a user consent on one platform to determine how that same user’s data is processed when collected from another platform.

![Most people have multiple devices to access the internet][devices]

<h2 id="multi-device">Where multiple devices intersect</h2>

Using traditional analytics tools, it can be challenging to understand when a single user visits your website from multiple devices. However, in light of GDPR enforcement, multi-channel user tracking becomes far more important. Ensuring the appropriate types of data collection are applied to a user based on their given consent and across their multiple devices is essential for honoring a data subject’s rights and requests around how their data should be treated. Doing this consistently across all platforms is uniquely challenging without the right internal mechanisms in place.

Consider the following: as analysts, we need to identify who a person is on a given device or channel, which we then need to match up with traffic from other devices or channels to see if it’s the same person. However, the data necessary to perform that identification may only be collected in the event a user has granted consent. If consent is to be delivered via one platform, without being able to identify that it’s the same user on another device, you might never be able to collect data from that user on their second device. This creates a Sisyphean catch-22 where you try to gain additional consents while fruitlessly attempting to connect users across devices.


<h2 id="lawful basis for processing">Working within the lawful bases for data processing</h2>

Within GDPR, there are [eight lawful bases for processing data:][ico]

1. Consent
2. Contract
3. Legal obligation
4. Vital interests
5. Public task
6. Legitimate interest
7. Special category data
8. Criminal offence data

In practice, most companies collecting web and mobile data will be doing so under the purview of either (1) or (6) i.e. consent or legitimate interest.

If consent is the basis for processing the data, then you will have to ask a user to consent on every single device a user engages with you on, because until you have that consent you have no lawful basis for collecting that user’s data. Without that, you can’t collect the data from the second (or third or fourth) platform or device that would reveal that this user is in fat the same who has already consented on the first.

Data that is being collected because of legitimate interest can be used, in conjunction with data given with consent, to perform the necessary identity stitch. For example, a company might be collecting data for two reasons:

1. To optimize their website to provide their users with the best possible experience. The company might classify this as a “legitimate interest”
2. To send personalized marketing to those users. To do this would require consent.

<br>
{% include shortcodes/dynamic.html layout="blog" title="Want the latest about GDPR?" description="Sign up for our newsletter for up to date information on GDPR and new features we're releasing to help you comply." btnText="Subscribe now" link="http://snowplowanalytics.us11.list-manage.com/subscribe?u=10bb4a6f31d5f19e0d0b54476&id=bb28c7d30d&utm_source=blog%20subscription&utm_medium=cta&utm_campaign=gdpr%20interest&utm_content=subscribe" %}
<br>

The company can use the data collected for reason (1) to figure out that a user who has consented on one device is the same as the user on another device, and then use the data collected on the second device as part of the input to provide that user with personalized marketing.

In the above situation, a Snowplow user might use the PII enrichment to pseudoanonymize the data collected for legitimate interests and only unanonymize it according to activities consented to, such as personalized marketing. Anonymized data is perfect for optimizing the website, and because the PII is obfuscated, a marketer is not in a position to accidentally send personalized marketing to a user who hasn't consented to that activity. Arguably the most important point: because the identity stitch can be performed with pseudoanonymized data, a user only needs to grant or remove consent on one device or platform for the company to successfully apply that consent across all platforms and devices.


<h2 id="GDPR focused solutions">Working towards a multi-platform, multi-device solution</h2>

The multi-platform, multi-device challenge is difficult, and, like most aspects of GDPR compliance, will not be solved with a silver bullet. However, we can identify several components that a solution will require.

Greater transparency around data collection is the first step. Though it might seem paradoxical, companies can actually do a better job respecting a data subject’s rights around data if they have a better idea who those users are across platforms and channels. Getting this data involves having an honest conversation with users, explaining that by giving up a bit more information, they can better protect and manage their data. The purpose of this conversation is to build a relationship between the data processor and the data subject, establishing trust and working towards mutually beneficial data processing.

![build trust with your visitors][browsing]

This kind of discourse will be more possible as companies move towards GDPR compliance, as it should be easy to disclose what data you’re collecting and why once your company is aligned with the lawful bases for data collection as outlined in the GDPR documents. A more transparent data collection process makes it easier to encourage users to self-identify, which will in turn make cross-device, cross-platform identification easier as well as resulting in broader, richer data sets.

Along with honest conversations with users around data collection, having tools to control how the data is used once it has been collected is a major element of creating an environment where users feel comfortable self-identifying. Pseudoanonymized data is one example of how you can exercise this level of control over user data. It’s very easy for someone to pull a data set and, without the appropriate context around what a user wants, accidentally use that data in a way that’s incompatible with a user’s wishes.


<h2 id="The future of data collection post-GDPR"> The future of data collection after GDPR</h2>

The world of GDPR is not black or white, with users happy to be tracked or not. There are levels and variations of consent, as GDPR requires each different purpose for data processing and data usage be clearly identified. Data subjects, in turn, have the right to consent to some activities and not others. Having users with varying levels of consent is challenging enough to manage without the right tools and processes; consistently doing this across multiple devices and platforms compounds that difficulty.

With things like IoT growing and wearable tech becoming more popular, soon new types of data consent management will become important, many of which we can’t imagine yet. A health and fitness app will have to make sure any data collected from a smartwatch is just as protected as browsing data. Smart home devices and AI assistants introduce additional layers of complexity as new sources of personal data. Regulations like GDPR are necessary to help protect individuals’ private data; GDPR is not the first attempt at data protection laws and it won’t be the last. As the laws evolve to better reflect the best interest of those whom data describes, the mechanisms by which we collect and process data must evolve, too.




[mobile]: https://snowplowanalytics.com/blog/2018/05/04/tracking-consent-on-mobile-is-just-as-important-as-web-for-gdpr/

[devices]: /assets/img/blog/2018/05/devices.jpg

[ico]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/#ib3

[browsing]: /assets/img/blog/2018/05/internet-browsing.jpg
