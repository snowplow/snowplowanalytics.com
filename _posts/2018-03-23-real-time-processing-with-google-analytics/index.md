---
layout: post
title: "Real-time data processing with Google Analytics using Snowplow"
title-short: Google Analytics data in real-time
tags: [analytics, Google Analytics, real-time data processing]
author: Anthony
category: Data Insights
permalink: /blog/2018/03/23/real-time-data-processing-with-google-analytics-using-snowplow/
discourse: true
---

It’s been almost a full eight weeks since we released support for ingesting your complete Google Analytics, hit level data into Snowplow with [R99 Carnac][r99]. Shortly thereafter, we made that support available in our real-time stack. This now means that if you’re a Google Analytics user, using Snowplow you can now process your complete event stream in real-time. Currently, this is not even possible for Google Analytics 360 users. In this post, we’re going to explore some examples of how having real-time processing live on your Google Analytics can unlock new ways to model, consume, and act on your data.

<h2 id="personalization">Personalize the customer experience</h2>

In the world of eCommerce, Amazon reigns as king not only because of the sheer scope of products offered, but because when a user logs on to Amazon, they are served an experience unique to them. They can easily view past purchases (and order again), view product recommendations based on their purchase history, and even receive special, dynamic pricing on items tailored to their browsing interests. Amazon goes through great lengths to collect all of the data their customers generate and use it to create a frictionless shopping experience on their website and mobile app. Sometimes it even feels like Amazon knows a customer better than they know themselves.

![online shopping][customer]

Amazon’s style of personalizing the customer experience, however, is based entirely on the user’s past actions, making many assumptions about the correlation and causation between browsing behaviors and purchase outcomes. If you’ve ever shopped on Amazon and viewed the recommended products, you know the suggestions are mostly accurate, but spend an afternoon shopping for a gift for a newborn or a gag-gift for a coworker and for weeks you’ll be bombarded by ads for pacifiers or novelty cutting boards.

Instead of looking at the past, real-time data processing offers an alternative for personalizing a customer’s experience in a more impactful, relevant way. An online retailer using Google Tag Manager’s enhanced eCommerce features can see every product that a user has viewed, added to a cart, and purchased in real-time. These features also record loads of metadata about those product SKUs, such as category, price, brand, and more. Using Snowplow, you can in real-time use this data to feed a personalization engine and use it to personalize the on-site or in-app experience. This means you’ll show users only the products that they are most likely to be interested in or likely to buy *in that moment.*

<h2 id="attribution modeling">Real-time attribution modeling</h2>

Among the [many websites and digital products][users] that use Snowplow, one of the primary use cases is the ability to develop and run your own attribution models on your data. With user engagement coming from such a wide range of sources, from email, social media, social advertising, paid and organic search, and more, understanding which channels and activities produce the highest results, and generate the most return on investment, is an invaluable practice that helps companies save money and optimize using their marketing resources. Attribution models, like Snowplow users, are snowflakes: unique from business to business.

Google Analytics data can be used to create an attribution model, just as Snowplow data can, and now users can take advantage of our Google Analytics integration into our real-time stack to make more sophisticated models. Modeling attribution in real-time allows businesses to be faster in responding to campaign performance or changes in audience behavior. If, for example, you can spot after just a couple of hours that a marketing campaign is performing poorly, such as driving lots of low quality traffic to your website at a high price, you can cut the budget of that campaign.

<h2 id="qualifying leads">Qualify leads in real-time</h2>

Of course, driving traffic to your website is just the first part of growing a business. Once you’ve set up your real-time attribution modeling and are running highly targeted and optimized marketing campaigns based on the insights from your model, the next step is to understand the quality of those leads. Qualifying, or scoring, leads helps a business identify hot leads that look ready to purchase, those that need more time and nurturing, or those that might never convert to customers. Traditionally, lead scoring is conducted in a CRM and can be a very batch-based process with account executives or sales development representatives pulling daily lists of leads that meet a certain score threshold and moving them into some form of sales cadence.

![email marketing][email]

New marketing technology, specifically around email deployment, have made automation a mainstay of the marketer’s toolkit. With the communication tools allowing for nearly instantaneous interaction with your audience, a scoring system that operates at the same speed is necessary to ensure that leads are engaged at the appropriate time. Using Snowplow data, you can calculate a lead score, in real-time, based on user engagement. Because Snowplow data is so granular, you can be hyper-specific in how you score different engagements or even different user journeys, giving a higher score to visitors who start on a landing page then navigate to a pricing page than those who hit the landing page then move to your blog (or vice versa, depending on what your attribution model indicates).

<h2 id="time">Time is money</h2>

These are just a few of the ways Google Analytics users can use Snowplow to work with their data in real-time. As businesses continue to compete more and more around the capacity to work with data, any improvement in your ability to act on data can drive competitive advantage and yield significant benefits. Learn more about [how Snowplow integrates with Google Analytics][r99] or [get in touch][contact] to see how real-time processing of your Google Analytics data can help your business grow.







[r99]: https://snowplowanalytics.com/blog/2018/01/25/snowplow-r99-carnac-with-google-analytics-support/

[customer]: /assets/img/blog/2018/03/online-shopping.jpg

[email]: /assets/img/blog/2018/03/email.jpg

[users]: https://snowplowanalytics.com/customers/trusted-by/?utm_source=blogs&utm_campaign=ga-integration&utm_content=trusted%20by

[contact]: https://snowplowanalytics.com/company/contact-us/?utm_source=blogs&utm_medium=body&utm_campaign=ga-integration&utm_content=contact-us
