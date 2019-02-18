---
layout: post
title: "A misconception about how retail personalization drives sales"
description: how retail personalization drives sales
image:
title-short: Announcing Snowplow for GCP
tags: [analytics, retail analytics, retail personalization, personalization, sales]
author: Anthony
category: Analytics
permalink: /blog/2019/01/23/a-misconception-about-how-retail-personalization-drives-sales/
discourse: true
---

When retailers are looking for a way to drive sales, personalization can look like a quick win: buy a recommendation engine and put more products a customer is likely to buy in front of them, then watch the sales come in. Unfortunately, it’s not quite that easy. When you implement a personalization strategy, you need to do it in the context of the overall customer experience you’re trying to create. You need to be clear what value personalization is supposed to add for your customers, and then test to make sure it’s having the intended effect.

That’s not to downplay what retail personalization can do; retailers face many challenges that can be overcome through personalization:

* Ace Hardware saw a huge jump  in revenue the month they targeted customers interested in birding, a small group who shopped with Ace four times as frequently as other segments
* Lifestyle brand Zumiez generated 55% more email addresses after switching to a more targeted collection campaign
* Cadbury saw a 33% conversion rate on a personalized video campaign in a region where chocolate wasn’t a popular gift.

Each retailer used personalization to solve a different problem. Each was successful because they were clear what problem they were tackling and employed personalization very specifically to solve that problem. Because they were solving different problems, these three retailers ended up doing very different things. If you want your personalization efforts to be that successful, you need to first figure out what stage of the buying cycle or aspect of your customer experience you want to change.

<h2 id="solving problems with personalization">What’s your problem?</h2>

![retail personalization][shop]

Most often, personalization is used to solve the problem of showing visitors the most relevant items from a very large selection, saving them the time and effort of browsing. Snowplow user Picnic, for example, has thousands of SKUs in their inventory but can only show 12 on a mobile screen at any one time. They use a personalization engine powered by Snowplow data to make sure that those items are most likely what a customer wants to purchase. Another Snowplow user, Gousto, discovered that their conversion rates went up when the number of choices they offered customers went down, a number they continue to test in order to keep it in the sweet spot to maximize conversions. Nordstrom wants its customers to feel like they’re in expert hands inside their stores; the company empowers its store associates to make better product recommendations by giving them access to data like customers’ most viewed products online.

Gousto, Picnic, and Nordstrom are all successful in personalizing their customers’ experiences because they identified a specific point where personal data can offer an improvement, and continually benchmark that data to make sure customers are still benefiting from the personalization and are having a good experience. For these retailers, when someone has a good shopping experience, they can find what they’re looking for quickly and are happy with their purchase. They recognize that online shopping can be frustrating when dealing with large inventories, so they offer the right balance of variety and personalized suggestions to help their customers shop confidently, leading to more purchases.

Online retailers can use personalization to solve problems beyond item discoverability: driving up shopping cart value by showing customers other products that make sense purchased together, showing customers relevant suggestions based on their most recent behavior, knowing what kind of special offers customers are most likely to take advantage of, or using the right email marketing to get customers to return to abandoned carts.

<h2 id="is personalization the answer">Is personalization right?</h2>

Personalization can drive an increase in sales in a lot of scenarios, but that doesn’t mean it’s a catch-all solution that’s guaranteed to work in every situation. The problem of item discoverability, for example, isn’t limited to being solved by personalization. Internal search, for example, is a staple of retail websites with large inventories to help customers find the right products, including Amazon. Search generally better for your customers when they know what products they want and want to buy them quickly.

![online shopping][shopping]

Whether your customers typically come to your website with a product in mind or tend to browse before buying, however, is a distinction only you can make based on your customer data and knowledge of your business. There’s a lot of nuance to how you use personalization to actually increase your sales. Knowing how your customers like to shop with you, their relevant experiences, and what kind of experience you want them to have gives you the context to know where personalization will be most effective, if at all.

<h2 id="making personalization work">Personalization is an ongoing effort</h2>

Once you’re clear on what problem you’re trying to solve and you’ve implemented a personalization strategy, you need to measure how effectively it’s working. The point of personalization is to make your customers feel like you know them. You’re acknowledging their loyalty by paying attention to the information they give you and using it in a way that they enjoy.

If your personalization efforts don’t work as theorized, understanding what went wrong from the customer’s perspective can lead to fruitful ideas about how you can do it right. This customer-experience centered approach is very different to those taken by companies who focus solely on the personalization algorithm rather than looking holistically at how personalized information is surfaced. With the proper data collection in place, you can track every stage of the customer journey, for each customer, to know where in the buying process they are and how you can engage with them in a meaningful way. When you understand behavior at the individual level, you can do different things for different people so that every customer has a unique experience with your brand.

What kind of experience are you trying to create for your customers? What does their journey look like? Think about what's on a person's mind when they shop with you. Tracking customer behavior across different channels, like web, email, and transaction history, gives you a high level, omnichannel picture of your customer journey so you can identify where and how to personalize experiences so they work best for your customers:

* How do personalized special offers based on behavior perform when they’re personalized versus sent at random?
* Can you adjust your digital ad spend based on real-time data to only target the most interested users?
* What kind of messages would re-engage customers at risk of churn?
* Can you tie data from in-store experiences to a customer’s online account to give them a seamless, consistent personalized experience?
* How much scrolling and searching do users do to complete their purchase? Is this faster or slower than for an unpersonalized experience?
* Does showing customers a personalized set of items to add to their cart after they’ve added their first one drive a higher rate of products added compared to showing an unpersonalized list?

<h2 id="using data to drive personalization">Compelling personalization is data-driven</h2>

An effective personalization strategy, one that produces results like Ace Hardware, Coca Cola, and Cadbury saw, comes from taking the time to figure out a specific element of your customer experience that you want to improve, and then being realistic about you want to use personalization to accomplish that goal. Identifying specific areas of the customer experience, however, requires robust, detailed data that you can creatively slice and dice like Ace Hardware did to discover that 14% of their customers, the birders, accounted for up to 27% of their monthly sales. You need to have good data so you can see who your customers are and what they like, and treat them accordingly.

When you can leverage robust customer data with industry-specific knowledge, you get the context necessary to build a successful personalization strategy that surprises and delights customers while driving more sales. Most companies already have the customer data to do this (and yours probably does, too), but without proper collection in place, can't put it all together to see the big picture necessary for finding the most impactful ways to use personalization.


[shop]: /assets/img/blog/2019/01/store.jpg
[shopping]: /assets/img/blog/2019/01/online-shopping.jpg
