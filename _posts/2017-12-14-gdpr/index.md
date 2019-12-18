---
layout: post
title: "GDPR compliance in digital analytics and how we want to help"
title-short: GDPR compliance
tags: [company culture, management]
author: Anthony
category: Data governance
permalink: /blog/2017/12/14/gdpr-compliance-in-digital-analytics-and-how-we-want-to-help/
description: "How we want to help companies navigate GDPR compliance in digital analytics"
discourse: true
---
![privacy][lock]


In May of 2018, the General Data Protection Regulation, widely known as GDPR, officially goes into effect. For those unfamiliar, GDPR is a set of European regulations that builds on the Data Protection Act, designed specifically to empower ‘data subjects’ with new rights over their data. The pervasiveness of digital advertising and data collection have led to a feeling of unease among many individuals. When browsing the internet, users often have little to no idea what data on them is being collected (and when), with whom that data is shared (often companies the individual has never heard of and has no relationship with), or how their data is being used.

Some of that discomfort arises from knowing their data is “out there” and may be used in totally different, unforeseen ways in the future, and that discomfort is furthered by knowing the data might be used against a user’s interests. Dynamic pricing is a perfect example: a merchant knows a customer has clearly expressed desire in a product and is committed to making the purchase, so the merchant raises the price. Given that, GDPR can hardly be considered out of the blue. GDPR is the most recent in a string of attempts to prevent data collectors and data consumers from using and selling personal data without any oversight for the data subjects that the data describes. There are three things, however, that make this latest legislation stand out from previous efforts:

1. Data subjects are given extensive new rights over their personal data, resulting in corresponding onerous obligations on companies who use that data.
2. The scope of “personal data” as described within the regulations is very broad and can include ‘anonymous’ identifiers like IP addresses and cookie IDs.
3. Potentially very high fines levied against data processors and controllers found in violation of GDPR.

According to GDPR, these obligations and potential fines apply to any company identified as a data processor or a data controller. Data processors are companies who manage, manipulate, or process data on behalf of data controllers (such as analytic platforms); data controllers are the companies who collect and store personal data to be analyzed or otherwise used. This legislation enshrines a set of principles, but at this point we don’t know how the courts will enforce them. There’s still a level of uncertainty in how we interpret those principles, which presents a significant challenge for those trying to prepare to be GDPR compliant.

Despite being vague enough to be robust, these obligations for those who collect and use data are still detailed enough to require significant thought and planning by companies under GDPR’s jurisdiction. Unlike previous attempts to regulate personal data use by the European Union, GDPR protects the rights of citizens of the EU, wherever they are in the world, which means it applies to companies that collect data from EU citizens wherever in the world they are based. Any company that has European visitors or customers needs to be compliant. And while many companies who use data for their business, and those who develop the analytic tools that make data consumption possible, find preparing for GDPR tough, at Snowplow we’re actively working very hard to make it easy for our clients and users. We support the General Data Protection Regulations, and we have a strong moral imperative to help our users comply. We’re data optimists and believe that data can be used for the good of our clients and in turn, their users, the data subjects. GDPR can help with that, so our aim is to provide tools and technology for our clients to comply with GDPR and still empowering them to derive real value out of their data.

<h2 id="a personal matter">A personal matter</h2>

![personal-data][personal]

The major point of focus for GDPR is ‘data subjects,’ the individuals who are described by the data being collected. The methods used to collect this data have become more advanced, and general regulation around how companies can collect and use data has been slow compared to the Mooreian rate at which collection technology is evolving. Historically, digital companies have collected whatever data they’ve wanted on individual users, the “data subjects.” This data was used for for many different things, such as selling on to advertisers through data marketplaces.

The previous notable attempt to give data subjects more control over what personal data was collected, the 2011 ePrivacy Directive, proved ineffective. By pushing website owners to serve intrusive pop ups asking for user tracking consent, they created “pop up fatigue” and encouraged a culture of visitors shutting down pop ups as fast as possible and thereby implicitly consenting to being tracked. Though much of this data is used, ultimately, to create a more personalized online experience for the individual, many users are uncomfortable as evident by the rise of ad blockers and anonymous browsers.

In order to address this imbalance and lack of transparency and control around what is arguably highly sensitive personal data, GDPR seeks to establish certain rights for the individuals who generate the data. Rights that, when exercised, allow for the user, not the businesses, to have final say in how their data is used.

<h2 id="rights">The right place at the right time</h2>

Here are the new rights created for data subjects, as provisioned in the General Data Protection Regulation:
Right to be informed: Users have a right to know what data is being collected and how it’s being used.
+ Right of access: Users have a right to view data associated with them.
+ Right to data portability: Users have a right to request ownership of the data a company possesses associated with them.
+ Right to restrict processing: Users have the right to request specific actions not be taken using their data.
+ Right of erasure: Users have the right to request all data associated with them be purged.
+ Right of rectification: Users have the right to challenge the accuracy of data associated with them and demand fixes.
+ Right to object: Users have the right to opt out of any data collection or associated actions, such as data-based marketing.
+ Rights around automated decision making and profiling: Users have the right to understand the algorithms and processes used to manipulate their data as well as request human intervention in the event of gross miscalculations.


<h2 id="obligatory section about obligations">Obligatory section about obligations</h2>

To comply with these regulations and be prepared for users to exercise their new rights under GDPR, companies need to review both their data architecture and data governance systems and processes to make sure that not only do they have the technical ability to comply with new varieties of user requests, but that the proper internal mechanisms are in place to deliver what the users have the right to request. Complying with GDPR is challenging and means that when requested by a user, a data processor or controller must be able to explain to that user exactly what data on him or her has been collected and how that data has been used. It also means having to stop using that data if requested, as well as remove that data. This is easier said than done.

Being able to comply with these obligations means knowing, on an individual level, exactly what data you have and for what purpose it was collected which is not always straightforward across a big organization with lots of teams working with multiple solutions or SaaS platforms. On top of that knowledge, companies must also know exactly how that data is being used as well as have control mechanisms in place to stop data from being used in particular ways in accordance with a user’s wishes. These processes and mechanisms, demanding in their own right, are only half the battle: in addition to complying with user data requests, companies must also be able to demonstrate to an individual or auditor that reasonable measures are in place to ensure adherence to the obligations outlined in GDPR.

To fulfill their legal obligations, companies must have certain technical and governance capabilities. In order to adequately explain, share, restrict, and erase user data in accordance with GDPR, organizations must establish a level of visibility and exert a degree of control not typical of today’s data infrastructures. Companies must increase the visibility of their data both internally and publicly. They need to know and clearly demonstrate what personal data they possess, and how it is being used, at the individual level or specific to each data subject. For example, a company’s data professionals must be able to determine which users have opted out of targeted marketing and which have not. Along with the self-awareness around their user data, companies must also be able to take actions with that data that align with the rights of their data subjects. Simply put, a company must be able to alter how personal data is used again specific to each data subject. At any given point, a user can request access to all of their data and it must be delivered, or opt out of a specific type of marketing activity.

Thinking of the current state of their databases and infrastructure, complying with these new regulations gives many data professionals nightmares.


<h2 id="how we learned to stop worrying and love GDPR">How we learned to stop worrying and love GDPR</h2>

Technology plays a role in enabling that visibility and control. Snowplow currently provides helpful control: you’re able to use a single technology stack to track user-level and event-level data across multiple different sources through a single pipeline and into a single, consolidated data warehouse. Having data distributed across multiple different silos, esp. in third party SaaS solutions where you don’t necessarily have full visibility and control of that data, is not good, because it’s harder to manage and control.  Data warehouses, it turns out, are great places to consolidate data for GDPR, because you can query data down to the user level, download it (to serve to the user) and remove it if requested. In a self-contained, internal analytics system, you control exactly what’s being collected because you have final say in what data points are collected with complete visibility over what’s being tracked- all down to the individual user.

![data-code][code]

Today Snowplow does give you the ability to control exactly what data you collect and delivers that data in a place that does give you user-level visibility. However, Snowplow doesn’t yet give you control over how that data is used. This is a difficult problem to solve and much of our forthcoming development will be around developing tools that enable our users, and the Data Protection Officers who work at those companies, to exert that control.

With GDPR enforcement barely six months away, we feel optimistic about the changes it will bring to the data analytics landscape. We believe in the motivations behind the legislation and the rights of data subjects over their data. A big part of our motivation for building Snowplow in the first place was to give companies the ability to collect their own data without relying on third parties, and to give them full ownership and control of that data. That control and ownership, it turns out, is really useful when you need to comply with GDPR because compliance requires a very high degree of visibility and control.

Though there will no doubt be a shift in methodology and mindset when it comes to collecting and using personal data, the end result is that GDPR will force institutions, especially those with legacy systems, to retool how they use data and become more sophisticated and improve the overall analytics industry benefiting the users and their privacy. And, knowing that their data and privacy are more strictly protected will inspire confidence and lead to users sharing more data, which is better for the companies who need the data to make business decisions. A single piece of data can be used in a nearly unlimited number of ways. That’s what makes data so special, what makes being a data analyst so awesome, and what makes GDPR compliance so difficult.

For a deeper dive into GDPR and its impact, check out [this talk][youtube] Yali Sassoon gave at the Berlin Meetup. This is an important topic for us in the analytics industry, and we would love to continue this conversation. Reach out to us on [social media][twitter] or visit our dedicated [Discourse thread][thread] to share your stories.


[thread]: https://discourse.snowplowanalytics.com/t/gdpr-challenges-and-compliance-discussion/1681

[youtube]: https://youtu.be/cqsTfri-HnI

[twitter]: https://twitter.com/snowplowdata

[lock]: /assets/img/blog/2017/12/lock.jpg

[personal]: /assets/img/blog/2017/12/personal.jpg

[code]: /assets/img/blog/2017/12/code.jpg
