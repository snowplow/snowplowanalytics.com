---
layout: post
title: "How to manage consent for GDPR, a nuanced approach"
title-short: Consent management under GDPR
description: The finer points of collecting data under consent management
image: /assets/img/blog/2018/03/choice.jpg
tags: [analytics, consent, GDPR]
author: Anthony
category: Data Governance
permalink: /blog/2018/03/09/how-to-manage-consent-for-gdpr-a-nuanced-approach/
discourse: true
---

The ongoing conversation around GDPR centers around compliance. Naturally, as data controllers and processors, making sure the way that we’re using data is compliant with the GDPR is a high priority. But the discussion is often oversimplified: does this comply or not? Though the regulations themselves may be straightforward, there are several vectors which make compliance challenging. GDPR requires the collection and processing of data to be tied to specific uses; the way clever analysts and data scientists use and think about data, however, is inherently creative and data collected for one purpose can often be used to serve a different, but related, need. As companies collect more data, the value of the data grows as it is joined with other growing data sets. So, under GDPR, we have to somehow manage the fact that different “pots” of data might be collected for different purposes and ensure that, if combined, the use of the combined data is still consistent with the specific purpose initially consented to during collection.

<h2 id="lawfully collecting data">Lawfully collecting data</h2>

Much of this is subject to interpretation: when interpreting the purpose with which the data is collected, explaining how the data is used, and understanding what consents data subjects have and have not given. For marketing professionals in particular, consent is likely to be the most important basis for data collection out of the lawful reasons outlined by GDPR, as it is hard to see how using personal data for marketing can be justified under any of the others. As described on the [EU GDPR website][lawful], lawfully collecting data under the auspices of consent requires that, “the data subject has given consent to the processing of his or her personal data for one or more specific purposes.”

The idea of consent equivocating to a specific purpose is one of the new changes that come along with GDPR. Today, it is common for cookie tracking notices to be very general:


![HSBC cookie policy][hsbc]
![Tesco cookie policy][tesco]
![Santander cookie policy][santander]


Under GDPR, companies need to be more specific, although as with much of GDPR it’s not clear exactly how specific constitutes “specific” under the new regulations.

Companies that use consent as the basis for collecting data will need to be as specific and precise as possible when asking for user consent. They will need to explain to data subjects: what data they want to collect, how they will process it, and how it will be used. This presents challenges in persuading users to give consent along with being as specific as possible while not ruling out the opportunity to use the data to meet closely related use cases that don’t fall narrowly in the definition provided, e.g. collecting “data that describes how you engage with our website to tailor our communication with you via email and other channels.” If a company does identify new use cases later, they will have to re-ask for consent, a pain for both the company and the data subjects in question.

We’ve been surprised when talking to a number of companies that they’ve implicitly been dividing their user base into two distinct buckets: those that consent and those that do not. They have said that they will collect data from users who do consent and not collecting from users who don’t consent. While this looks like it makes compliance straightforward, we think it is flawed for a number of reasons.

<h2 id="consent is not black and white">Consent to data tracking is not black and white. It is multiple choice.</h2>


![Many options of consent][choice]


The all-or-nothing, consented-or-not-consented method seems to be an elegant solution to managing tracking user data under GDPR, so why is this not ideal? There are two major factors that prevent this method from aligning with how most companies conduct their digital analytics:

- Data can be used for many different purposes
- Consent has to be specific

So, if consent is binary (meaning you have users who do consent and those who don’t), then for your users who consent, you’re either limited to only using their data for a single purpose or you have to make sure that they’ve consented to having their data used any way you want. The first is very limiting; the second is unrealistic and counter to the GDPR specificity requirement.

Realistically, you’re going to find that you have more than one specific use case. You will end up having almost as many different variations of tracking consent as you have customers, and the use cases will be equally diverse. In parallel to the many different user consents, as a company the way you use data continues to evolve. Sometimes, even, in surprising ways. Today, you can gain unexpected insight from a data set by modeling it in a new way and immediately act on it. Under consent tracking as outlined by GDPR, if the user has not explicitly consented to that use of their data, it can’t be done.

We shouldn’t be surprised by this. One feature of data that makes it so magical is that the same set of data can be used to answer multiple questions, make multiple decisions, and fulfill multiple goals. Like modern art, interpretations of data can be both varied and valid.

<h2 id="example of consent tracking">Example of consent tracking in practice</h2>


![Consent tracking for eCommerce][ecommerce]


Consider an online retailer. This eCommerce merchant collects data on how users engage with their online clothing store, data which describes how their users shop including when they shop, what products they view, which they end up buying, and which they end up talking about (sharing on social media). All of this data can be collected and used to improve the customer experience in a number of ways.

The online retailer can use the data to improve the product in general ways, such as improving the checkout flow for all users, as well as better understand individual user preferences, like brands and styles. The understanding around user preferences can then be used to:

1. Personalize a user’s online shopping experience by promoting relevant products on the homepage or prioritizing search results.
2. Personalize marketing communication to them, like email messaging.
Segment the user base and sell those segments to interested third parties.

Different users will consent to having their data used in different ways. Some users won’t consent to having their data used for any of the above reasons; other users will only consent to having their data used to improve the product; others still will be happy to do that as well as personalize their shopping experience but won’t consent to having their data sold to third parties.

<h2 id="consent changes over time">Consent is not static. It evolves over time.</h2>

Getting consent means having honest and frank conversations with your users about what you want to do with their data and why those use cases are for their benefit as well as yours. The companies that have the most honest, transparent relationships with their users are the ones that will be able to most successfully elicit consent, enabling them to use data to drive competitive advantage over their competitors who lack those relationships. These conversations will likely evolve over time as companies get more sophisticated in their use of data and consumers build more trust that their data is being used for good.

GDPR also grants users the right to be forgotten, so it’s important to note that if the conversation doesn’t go well, users will be able to [withdraw consent without difficulty][withdraw]. Companies will have to make it convenient for users to manage their consent so that they can easily withdraw it over time or otherwise change it. By making it convenient, it is more likely that data subjects will grant consent in the first place, safe in the knowledge they can withdraw without difficulty at a later date if they’re unsatisfied.

<h2 id="what companies need to do when managing consent">What companies need to do when managing consent</h2>

There will be many kinds of consent and these will change over time. Companies need to be good at knowing exactly who has consented to what and ensuring that any use of the data relies on that consent, limiting it to only users who have granted consent. This is going to be technically challenging.

Consent becomes another activity that needs to be tracked, a functionality we’ve enabled with the [JavaScript tracker 2.9.0 release][js]. This should make it possible for data controllers to record exactly what a user has consented to, and when. That consent information then lives as part of the event data set which the consent governs. This, in turn, makes it more convenient for people using the data to check that their usage is consistent with user consent. Before launching a campaign, a marketer, for example, can run a query to evaluate if all the users in a given target group have given the relevant consents and remove them if not.

While this new feature makes managing consent easier, it is still difficult. That is why this feature, along with our [PII Enrichment][r100], are just the start of the functionality we’re building to help our users comply with GDPR.

[Sign up for our mailing list][subscribe] to stay up to date with all of our new GDPR related upgrades and leave a comment below to join in the debate on GDPR on our Discourse channel.


[lawful]: https://gdpr-info.eu/art-6-gdpr/

[withdraw]: https://gdpr-info.eu/art-7-gdpr/

[js]: https://snowplowanalytics.com/blog/2018/02/28/snowplow-javascript-tracker-2.9.0-released-with-consent-tracking/

[r100]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/

[subscribe]: http://snowplowanalytics.us11.list-manage.com/subscribe?u=10bb4a6f31d5f19e0d0b54476&id=bb28c7d30d&utm_source=blog%20subscribe&utm_medium=post%20cta&utm_campaign=gdpr&utm_content=subscribe

[hsbc]: /assets/img/blog/2018/03/hsbc-cookie.jpg

[tesco]: /assets/img/blog/2018/03/Tesco-cookie.jpg

[santander]: /assets/img/blog/2018/03/santander-cookie.jpg

[choice]: /assets/img/blog/2018/03/choice.jpg

[ecommerce]: /assets/img/blog/2018/03/ecommerce.jpg
