---
layout: post
title: "Rethinking your data collection strategy in a privacy conscious world"
description: "Rethinking your data collection strategy in a privacy conscious world"
author: Franciska
category: Data governance
permalink: /blog/2020/09/15/rethink-your-data-collection-strategy/
discourse: false
---

From web browser privacy upgrades to government regulations, the way in which we collect, process, store and use data is changing. These changes are increasingly affecting third-party web analytics solutions and the companies relying on those solutions will face setbacks in data analytics; their digital marketing, marketing attribution and personalization strategies are all directly or indirectly affected by these restrictions and regulations.

These changes are forcing data teams to rethink their data collection strategy. At Snowplow, we believe that companies have the opportunity to collect data fairly and use that data to do good for themselves and their users. And we understand the value of having personalized, relevant and mutually beneficial relationships with your customers and users is critical when building a successful business.

We have written a lot of content about how to address these challenges and what they mean for your analytics going forward (links at the end of the article). In this blog post we aim to focus on the higher level mindset changes companies should consider when it comes to increased tracking restrictions and public awareness of data privacy. If you don’t get this right it can have a fundamentally negative impact on your company’s growth, put you in legal jeopardy or worse still, affect your relationships with your customers.


### Be more intentional with your data collection

In recent years we have seen a shift towards the “track everything” approach where vendors let companies capture “everything” out of the box for easy and quick analytics in case the data will come in handy down the line (you might not know what questions you want to answer in a year’s time so why not capture everything now just in case?).

In this new privacy conscious environment you will need to be more deliberate about your tracking and take a more intentional approach to your data collection strategy. Consider answering the following questions within your business: 



*   Which teams want access to data about the behaviour of users on our website?
*   What questions do they want to answer with the data? 
*   What's the minimum amount of data that needs to be collected to answer them?
*   Does it require collecting personally identifiable information (PII)? 

Be transparent about exactly what data you capture about your users and why and explain that clearly in your privacy policy - and make sure your tracking implementation actually reflects those policies exactly. 


### Reassess your need to capture PII

As alluded to above, it’s a good time to reassess your data collection and reporting approach. Do you need to track PII or could you perhaps move some or most of your reporting to data based on anonymous users? How much PII do you actually need from your users to derive valuable insights about your product(s)? For example, data collected for product analytics use cases could be just as useful based on anonymous users. 

Be deliberate about whether or not you track PII, and if you do, whether you need consent. If you do want to track PII, you're likely to be in a situation where you're tracking different data from different users: PII from opted-in users, and anonymous data from users who do not opt-in.

Some users might accept your cookies because they value a personalized experience while others prefer to go unidentified. Others still will prefer you don’t track them at all. Educate your users and customers on their options and customize your data collection to match their preferences. While many might opt out of cookie tracking you’ll still have opportunities to track non-identifiable data from users who do not consent, which can be equally useful data informing e.g. your product roadmap or conversion rate optimization.


 {% include shortcodes/ebook.html background_class="data-privacy-landingpage" layout="blog" title="Free white paper" description="How to work with data privacy restrictions and still get high quality data" btnText="Download now" link="https://go.snowplowanalytics.com/white-paper-itp" %}





### Accept that (continued) work is needed 

With restrictions changing and continuously intensifying you will need to set aside more time and resources to keep up. And you will also need to put more work into setting up your tracking right. Cookie settings matter much more than they used to, and different browsers treat various browser settings differently. You will need to work out what your tracking requirements are, and instrument your cookie settings accordingly and correctly. Most analytics tools are taking steps to continue to support your data capturing needs but it’s up to you to figure out what’s right for your business and ensure you remain compliant. 

At Snowplow we’re working hard to adapt to the changes as they arise and we help our customers configure their pipeline to fit their specific tracking requirements. 


### Consider taking data collection and processing in-house

We believe that one of the most important things you can do to adapt is to take ownership of your data and data processing infrastructure. Ownership gives you  control over what data you want to capture about your users and the responsibility to ensure that your data is only used in ways that are clearly understood by you _and_ your users. As a part of that move you should consider what third parties you’re willing to share your data with - e.g. by having an ad vendor’s pixel on your website, you are allowing third parties to derive insights from your users’ behavior. While those insights might benefit you (for example through better targeted ads on those platforms), they might also benefit your competition and erode your users’ trust in you.

You would also want to ensure you’re in control of where your data is stored, who has access to it and what it’s being used for. Customer support teams require access to specific customer data so they’re able to serve your customers, while product teams do not necessarily need individual user data - they’ll be able to understand the effectiveness of a new feature by analyzing cohorts.


### Snowplow is here to help

As a first-party behavioral data delivery platform, Snowplow gives you the control and flexibility to carefully and specifically track exactly what you want from each of your users based on their consents. We enable you to meet your obligations to your data subjects and usefully capture data to derive real value for your business. We help you navigate the various privacy restrictions and remain compliant while continuing to capture the high-quality behavioral data you need to drive your business forward. 

If you’re interested in what actual changes you need to implement to remain compliant and continue to collect the behavioral data you need, check out [our white paper on this topic](https://go.snowplowanalytics.com/white-paper-itp), [listen to our webinar](https://snowplowanalytics.com/webinars/snowplow-and-poplin-identity-resolution/) with our partner Poplin Data or [read more about Snowplow’s approach](https://snowplowanalytics.com/blog/2020/09/07/2020/user-identification-and-privacy/).

If you’re interested in learning more about how Snowplow can help you rethink your data collection strategy, [get in touch](https://snowplowanalytics.com/get-started/). If you’re a Snowplow customer and have questions about your pipeline configuration or our latest features, get in touch with your Customer Success Manager or reach out to [support](mailto:support@snowplowanalytics.com).