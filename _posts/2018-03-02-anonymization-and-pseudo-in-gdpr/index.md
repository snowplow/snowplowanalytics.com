---
layout: post
title: "Understanding the role of anonymization and pseudonymization in GDPR compliance"
title-short: Anonymization in GDPR compliance
tags: [analytics, personal identifiable data, GDPR]
author: Anthony
category: Data Governance
permalink: /blog/2018/03/02/understanding-the-role-of-anonymization-and-pseudonymization-in-gdpr/
discourse: true
redirect_from: /blog/2018/03/02/understanding-the-role-of-anonymization-and-pseudo-anonymization-in-gdpr/
---

If you visit the [European Union homepage for GDPR][eugdpr], one of the first things you’ll notice is a timer (assuming you read this before enforcement begins). Clearly displayed down to the second, at any given time you can check to see how much time you have left. Considering all of the complexities that come with compliance, problems that must be solved at the technological, procedural, and governance levels, there are many of us who will need to use as much of the remaining days and hours as possible to prepare our organizations for this new set of data protection regulations.

![GDPR homepage][flag]


<h2 id="gdpr recap">GDPR Recap</h2>

The General Data Protection Regulation gives new rights to data subjects, the individual users about whom data describes (a list can be found [in this post][gdpr-help]). These new rights are meant to shift control over how personal data is used into the hands of the individuals, meaning data controllers, like Snowplow users who collect personal data, are facing new obligations for how their data must be handled from end to end. Because these regulations are onerous, companies need to challenge themselves whenever they’re collecting personal data to be clear on why they’re doing it. In situations where the same impact can be achieved with data that is not personal, for instance, these obligations do not apply.

However, GDPR massively expands the scope of what constitutes personal data. To quote the Information Commissioner’s Office, “GDPR applies to ‘personal data’ meaning any information related to an identifiable person who can be directly or indirectly identified in particular by reference to an identifier. **This definition provides for a wide range of personal identifiers to constitute personal data** including name, identification number, location data, or online identifier, reflecting changes in technology and the way organisations collect information about people.” While this clearly categorizes IP addresses, cookie IDs, and other device identifiers like IDFVs and IDFAs constitute personal data, the deliberately vague nature of the definition presents a moving target for companies as more data is collected on individual users and additional legal precedent is set.


![data subjects][subject]


<h2 id="anonymization and gdpr">Why anonymization matters in a GDPR world</h2>

“Anonymization” is a technique for taking personal data and rendering it non-personal by making it impossible for a user with the data to identify *which* individual the data describes. With digital data, we can distinguish two distinct uses:


1. We use data to build insight in an attempt to better understand how users are engaging with our products and websites. This insight can be used to optimize marketing spend or support the product development process (as we explored in our [product analytics series][product-analytics]).
2. We use data to better understand individual users and better communicate with and engage those users to, hopefully, improve their experience


We can use anonymized data for (1) but not for (2). When we’re collecting data for the purpose of insight, it doesn’t matter who the individuals are, just what they do. This means that we can still collect and use digital data to do things like optimize marketing campaigns and support product development without collecting personal identifiable information (PII) and incurring the obligations associated with doing so.

<h2 id="anonymization and pseudonymization">Anonymization and Pseudonymization</h2>

When data is fully anonymized, the link between the data and the personal identifiers is completely severed: all data collected is decoupled from any sort of personal information. Pseudonymized data, conversely, retains a slight tether between the data and the PII, meaning the data is, on the surface, anonymous but when it comes time, special measures can be taken to restore the connection, allowing a company to act. In practice, fully anonymizing data is very difficult. Even if we anonymize a data subject’s name, knowing other pieces of information about the subject, such as date of birth or location, can allow us to narrow down the potential identity of an “anonymous” user or even pinpoint the specific individual if the data set is small enough.

Though pseudonymized data seems to present the opportunity to retain as much user data as possible while circumventing the obligations GDPR requires, the regulation explicitly states that [pseudonymized data can fall within its scope, depending on how difficult it is to attribute the pseudonym to a particular individual][ico]. Pseudonymized data remains very valuable from a GDPR perspective, however. If, for example, a company collects digital data to support product development but does not engage in targeted marketing, a marketer cannot accidentally use the data to target an individual user. In light of what companies must do in order to demonstrate compliance, making sure only authorized activities are carried out is a powerful control.


![authorized users only][authorized]


<h2 id="gdpr tools by snowplow">GDPR tools and the Snowplow pipeline</h2>

Because of the high value of anonymization as a tool for data controllers to help them comply with GDPR, we recently released [R100, Epidaurus][r100] which builds this functionality into our data processing pipeline. Snowplow is a data collection platform, used by companies to collect data across multiple platforms and channels. On each platform, we expect there to be at least one user-level or device-level identifier to enable analysts to stitch together user journeys on those channels, and then join them together to create a single-customer view, an essential element in many types of analysis.

By enabling data controllers to pseudonymize *all* of those identifiers while retaining the ability for data consumers to understand an individual’s complete user journey across platforms and channels (simply removing the fact of *who* went through the journey), Snowplow users are better able to use data to power insight and better respect the rights of data subjects whose journey that data describes.

Data consumers have to take as many measures as possible to ensure their use of their data is lawful and that everyone within the organization complies as well. Epidaurus, along with the update of our [JavaScript tracker][javascript], are the first of many layers of protection we’re building to both make it easier to comply with GDPR as well as make it more difficult to break regulation.




[flag]: /assets/img/blog/2018/03/gdpr-flag.jpg

[subject]: /assets/img/blog/2018/03/data-subject.jpg

[authorized]: /assets/img/blog/2018/03/authorized.jpg

[eugdpr]: https://www.eugdpr.org/

[r100]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/


[gdpr-help]: https://snowplowanalytics.com/blog/2017/12/14/gdpr-compliance-in-digital-analytics-and-how-we-want-to-help/

[javascript]: https://snowplowanalytics.com/blog/2018/02/28/snowplow-javascript-tracker-2.9.0-released-with-consent-tracking/

[product-analytics]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[ico]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/key-definitions/
