---
layout: post
title: "Self-describing data becomes self-policing data"
description: Understanding how to manage data usage with Snowplow post-GDPR
image:
title-short: Working with PII and Snowplow
tags: [analytics, GDPR, data governance]
author: Anthony
category: Data governance
permalink: /blog/2018/08/08/self-describing-data-becomes-self-policing-data/
discourse: true
---

*This is an introduction to a new Snowplow technology; see the [official developer release][piinguin] for a detailed technical walkthrough.*

---

>Personal data shall be:
<br>
<br>
: (a) processed lawfully, fairly and in a transparent manner in relation to the data subject (‘lawfulness, fairness and transparency’);
<br>
<br>
: (b) collected for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes
<br>
<br>
-General Data Protection Regulations, Chapter II Article 5


At the heart of [GDPR][gdpr] is this idea, that personal data is collected for a specific purpose. Companies that collect personal data identify what this purpose is and make it clear to the data subjects whose data is being collected. It is then a legal requirement that the company only uses that data for that purpose.

This is a **very** difficult requirement to fulfill.

![GDPR is complex][pii-sources]

One of the things that makes data analysis so interesting and rewarding is that all great analysis starts with asking good questions of the data: a new analyst asking a fresh question of an old data set might reveal something new and transformative. For that reason, there's been a strong trend for companies to democratize data - to give many more people access to large, centralized data stores, so you have many more smart people asking many more questions of the data and getting much more insight. The trouble is, this makes it much more likely the data will be used in a way that is not consistent with the purpose for which it was originally intended. Worse still, how do you ensure that all those smart people know what for what purpose the data has been collected and ensure their use of it is consistent with that?


<h2 id="data industry">The changing data industry landscape</h2>

Society at large is becoming more data sophisticated, with more people being willing to scrutinize and ask what data of theirs is out there, who has it, and how is it being used. Companies like Google, Amazon, and Facebook have unprecedented stores of data about their users, and we’re starting to see what happens when that amount of control goes unchecked. GDPR is a deliberate effort to codify what responsible use of data looks like and take direct action to hold companies that collect data accountable for being responsible.

The reasoning behind GDPR is simple and straightforward: as organizations collect more data and people become more concerned about how their data is used, measures must be put in place to prevent abuse. If an individual is told their data is being collected for one purpose, it’s not fair to the individual to use their data for something else without informing them (and potentially asking for consent). A user who shares health data with a fitness app to improve the app’s recommendation engine wouldn’t want that company to turn around and sell their data to gyms, diet pill manufacturers, or insurance companies.

<h2 id="data governance">Data governance is challenging</h2>

The conversation around GDPR has focused primarily on a data subject’s right to be forgotten and handling consent. Though significant as parts of a legal framework, from a technical perspective deleting data and tracking consent are fundamentally not challenging tasks. But, nobody wants to talk about what is arguably GDPR’s most significant stipulation, that *data must be collected and used only for an explicit purpose.*

![Getting data governance right can be overwhelming][overwhelmed]

Controlling how data is used presents a lot of challenges. As we’ve said, much of the magic of data analysis comes from being able to explore data in new ways, which appears to be diametrically opposed to one of GDPR’s core principles. When speaking about GDPR and analytics in a post-GDPR world, collectively as an industry we acknowledge that data governance is really hard, which, more often than not, means that piece is left out of the conversation. It’s the naked emperor; the hardest aspect of GDPR to comply with is this one, and it’s not talked about because it’s awkward admitting we don’t have a feasible way to comply.  This situation is hard to handle while still protecting the data subject’s rights and using data according to GDPR while still exploring it in new, exciting ways. Companies have to balance collecting enough data to be useful and insightful while still respecting a data subject’s rights.

As a result, the burden of responsibility is placed on the data controller to have mechanisms in place to ensure data usage is lawful and compliant - and how to do so is left to the legal experts who are trying to navigate the language of the regulations.

<h2 id="maintaining balance">Maintaining the right balance is hard</h2>

1. Looking at your average data set, you don’t know on what basis it was collected and how that was communicated to the data subject.
  - Data is, generally, descriptive: a data set describes something e.g. a customer journey, set of experimental readings or customer state. How the data is used is a function of the question that the analyst asks of the data. Given that, how is a data analyst who picks up a data set going to be able to understand what is OK to do with the data, and what is not?
  - The basis on, and purpose for which, data is collected is metadata that needs to be tied to the data itself. TO date, this is metadata that companies are **not** collecting. Many companies that have learned to successfully derive value from their data, however, find it hard to manage metadata associated with governance.


2. The best data analysts are the ones that ask new, creative questions of the data
  - The most effective data analysts are typically those that ask new, interesting questions of the data: people who are able to spot opportunities to use existing data sets to shine a light on new, pressing questions.


3. Years of democratizing data means that a typical data set is now accessible to a much larger group of analysts than before
  - In today’s world everyone is an analyst. Data warehouses, data lakes, BI tools- we’ve been furiously making data accessible to everyone within an organization and giving them ever more powerful tools to interact with any and every bit of data available.

It is likely then that that those organizations blessed with the best data analysts will be those that struggle the most to constrain the use of that data to just that that is consistent with the basis on which the data was collected. Worse, organizations will have to manage the tension between empowering clever analysts and stifling them do use data to drive value.

<h2 id="resolving tension">How do we resolve this tension?</h2>

Wanting to ensure that data is only used in a prescribed set of ways while also democratizing that data so it can be used intelligently creates a great deal of friction.

The solution we’ve built at Snowplow starts by [pseudonymizing the data][pseudo]. This effectively “removes” the personal elements from it. Even without the personal elements, the data is still enormously valuable and can be used for a wide variety of analytics. Pseudonymized data, though, can’t be used for any targeted marketing purposes because **we don’t know who each line of data relates to.**

Analysts can still creatively explore pseudonymized data and it can still be democratized throughout an organization because it doesn’t contain personally identifiable information. This means it can be used to measure things like the effectiveness of a marketing campaign or how users are engaging with a product’s latest new feature, the data simply won’t tell *who* was acquired from the campaign or specifically which users engaged with the feature.  


<h2 id="pseudonymized data">Working with pseudonymized data</h2>

The next part of the solution we’ve built at Snowplow provides the opportunity for companies to unanonymize the data in a controlled way. The idea is that in certain cases, stakeholders may want to use the personal data. For example, a marketer may identify a segment of interesting users in the data warehouse that they wish to target with a campaign. They’ve checked the data set to confirm that all the users in the segment have consented to being marketed to, and so believe they are in their rights to target them. They cannot, however, do so because the user’s personal identifiers (such as their cookie IDs or their email addresses) have been pseudonymized. So the marketer submits a request to the data protection officer who logs the request, reviews it, and signs off on it. The DPO then uses our new functionality, [which we’ve called “Piinguin,”][piinguin] to unanonymize just that specific list of user IDs the marketer requested and pass them back to the marketer to use to execute her campaign.

This means that we can still use the pseudonymized data for personalized use cases (with caution). With the introduction of Piinguin, the Snowplow platform now has functionality that enables users to, in a controlled environment, un-anonymize the data. This is a process that is owned by the Data Protection Officer so she or he can ensure that each time, for example, a marketer wants to use the data to target a set of users, that marketer is only using the data in a way that is compatible with the reasons it was collected and in accordance with the preferences of the individual users (when necessary).

Even under the auspices of GDPR, it’s not immediately clear what responsibly using data in such a way that it is mutually beneficial to both customer and company looks like in practice. GDPR is meant to establish and protect the rights of data subjects, but it’s also a turning point in how organizations think about and treat the data they collect on their users.

<h2 id="good governance">Data governance you can trust</h2>

Data governance is challenging, and controlling usage to make sure it’s only used for the appropriate reasons, while still being interesting and valuable, is even more challenging. Analytics technology, as it stands, does not have the capacity to handle this challenge, and analytics providers have been content to push the responsibility of managing data usage onto the data controllers. Data governance, however, is not a purely operational or legal challenge- it’s a technical one as well.

Pseudonymization offers two powerful features: it renders the data “safe” for democratizing to derive value, and provides a formal control point (the de-anonymization step) where the use of personal data can be policed to ensure it is consistent with the basis on which the personal data has been collected.

Piinguin lets you work with pseudonymized data, enabling companies to effectively manage the tension between ensuring that the use of personal data is consistent with the purpose for which it has been collected and unlocking the value of exploring democratized data.





[gdpr]: https://gdpr-info.eu/art-5-gdpr/

[pii-sources]: /assets/img/blog/2018/07/gdpr.jpg

[pseudo]: https://snowplowanalytics.com/blog/2018/03/02/understanding-the-role-of-anonymization-and-pseudonymization-in-gdpr/

[overwhelmed]: /assets/img/blog/2018/07/overwhelmed.jpg

[piinguin]: https://snowplowanalytics.com/blog/2018/08/08/piinguin-snowplow-pii-usage-management-service-released/
