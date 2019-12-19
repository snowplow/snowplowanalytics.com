---
layout: post
title: "Long sales cycles don't have to be trouble"
description: Making long sales cycles work to your advantage
image: /assets/img/blog/2018/11/shopping.jpg
title-short: Understanding long sales cycles
tags: [analytics, retail, customer analytics, sales cycle, cro]
author: Anthony
category: Data insights
permalink: /blog/2018/11/14/long-sales-cycles-dont-have-to-be-trouble/
discourse: true
---

Retailers know that understanding the way customers behave during the sales cycle is the key to optimizing this process so it’s enjoyable, rewarding, and painless for the customer and efficient for the retailer. Marketers want to connect activities like advertising campaigns to downstream activities like making a purchase. While this process might be straightforward for many companies, it can be quite convoluted for retailers with longer sales cycles such as high value goods like cars, bicycles, or electronic gadgets (though this is by no means an exhaustive list).

These businesses have a prolonged sales cycle during which customers will typically be involved in lots of online research around the product in question. This creates opportunities and challenges for digital marketers and analysts at companies that sell these types of products. There are more opportunities to understand what happens in that prolonged sales cycle, but it can be harder to attribute the impact of marketing because the gap between that first marketing touch and the purchase is so long.

We’ve seen retailers use data to successfully understand their longer sales cycles and we want to share what they all have in common so you can start understanding your sales cycle better.

<h2 id="join data sources">Join as much of your data as you can</h2>

As marketers we bring people into our sales cycles and show them products and services we hope they’ll love. We try to identify what will be most relevant to each customer so they can make their buying decision quickly and with as much confidence as possible. With a longer sales cycle, we can spend more time educating and empowering our customers, helping them reach that level of confidence. This way they’ll leave happy and be more likely to shop with us again, leading to more sales and happier customers.

The first step is to join together as much data as you have available about your customers and the journeys they are on. For existing buyers, you should already know a fair bit about them, revealed by joining your digital  data (with [Snowplow Insights][sp-insights] or an equivalent solution) with the CRM data you already have. The more data sources you can join together, the more accurately you can recreate a customer’s journey from the first marketing touch to the most recent purchase.

![Connect as many data sources as possible][cross-channel]

Connecting these sources of data, though, isn’t always easy (or possible). A simple example to illustrate this point is looking at two data sources that play a huge role in the customer journey: email marketing and web traffic. Many retailers will have a CRM platform configured to handle deploying email marketing campaigns and measuring performance metrics like the open and click-through rates, and a platform for measuring their web analytics, things like daily visitors and transactions.

Often these CRM platforms have built in page builders that allow marketing teams to quickly build and publish landing pages for different marketing campaigns. These are great tools as long as you anticipate and account for relying on the CRM’s native analytics to collect data on the pages, taking it away from your overall web data. Without good, clean ways to join these two customer data sets, there’s a huge gap in your reporting ability leaving you unable to answer important questions like how much should you invest in email marketing.

<h2 id="identity stitching">Piece together multichannel customer journeys</h2>

Mobile ecommerce sales accounted for 34.5% of total ecommerce sales in 2017, [according to Bigcommerce.][bigcommerce] Retailers can’t afford to not connect their customers’ desktop behavior with their mobile behavior. Without joining these two data sources, customers will have incongruous experiences that cause frustration and put up barriers to purchasing.

Customers might be doing their purchasing research on multiple devices, including their phones, tablets, and home and office computers. If you want to understand that journey, you need to be able to stitch user behavior across those devices to get a complete picture. For marketers with long sales cycles, picking out each touch point on the path to purchase becomes even more important.

One Snowplow user, a marketer for a flooring company, was struggling to attribute sales to his different marketing campaigns; because of a long gap in the sales cycle, he was only able to connect campaigns to purchasing a sample, which cost less than $10. With complete purchases valued over $10,000, determining which ads drove the most sales and which only lead to buying a sample was a high priority.

Using Snowplow to join his data together, the marketer was able to describe what a typical sales process looks like. Customers, he discovered, will typically follow the same progression:


1. Web ad (Google AdWords or Bing)
2. Visit the website
3. Order a sample from the website
4. Review samples
5. Receive drip email marketing campaign
6. Purchase flooring (through the web or on the phone)

This customer journey typically takes 53 days, and because it crossed so many channels the company struggled with attributing their web ad campaigns to the sales occurring nearly two months later.  With all of their data joined, however, they could look at how their customers engaged with their advertising, website, and email marketing, and tie that behavior to future purchases. Having unified data helped the marketer piece together the company’s customer journey, giving them a clear picture of which campaigns drove the most sales, where their most valuable customers came from, and what point in the sales cycle saw the highest drop-off.

<h2 id="customer journey">Identify key stages between unknown and customer</h2>

At a certain stage in a customer’s journey, that person becomes a “known” customer- they’ve given you their name or email address or created a user account, something to identify themselves to you. This might only happen after making a purchase and entering their name and delivery address as part of checking out, but it could occur much, much earlier.

Many marketing campaigns are designed to get pieces of this information much earlier, allowing retailers to build a relationship with their customers well before they make a purchase. The earlier in the process retailers can connect with their customers, through means like good experiences or high quality product recommendations, the greater the ability to guide those customers through the buying process towards making a purchase.

That information is only useful, though, if we can stitch it all together. A user might visit your website several times before they decide to sign up for your email newsletter. We want to be able to tie that identity to the data describing that person’s journey when they were unknown up until that point in time when they become a known user.

<h2 id="key customer activities">Identify key activities in the customer journey</h2>

Each customer will follow their own path to purchase, researching a company, its products, and its competition. Some customers will do all of these things, some will do none.  When you join your different customer data sources together, you get increased visibility on your customers’ journeys at an individual level and in aggregate. At this point, you can identify the key activities that are recurring in most customer journeys, like reading a blog post or clicking on an Instagram ad.

With a complete picture of your customer buying process, you can answer important questions about how people go about purchasing your products:

- What research do customers do before making a purchase?
- How do customer reviews influence the decision to buy?
- Who has expert opinions on your product that users are likely to consult?
- Do customers need to consider future releases of a product?
- How do these behaviors change at different points in a product’s life cycle?
- How difficult is it for potential customers to identify the **right** product from your catalogue?
- What key bits of information are customers looking for before making a purchase?
- How long do customers typically have to think after researching but before purchasing? Does this vary by type of customer, product, or price point?

![Understand what people experience when buying your product][shopping]

Cleverly analyzing your unified customer data might not answer all of your questions outright, but will give you enough material to start forming hypotheses that can be tested and measured. Doing so will help you identify how prominently each activity features in the journey of a particular customer or segment and pick out any activities that are strongly indicative of a purchase.

<h2 id="compare product purchasing behavior">Compare the key activities across different products</h2>

For most retailers, who offer a selection of products, not all purchases are equal. This seems obvious- more expensive purchases are worth more. But, as you join your customer data together to get a clearer picture of your customers’ buying behavior, you’ll realize that’s not necessarily true. Single, high-value purchases might look great, but you may discover that it’s the smaller repeat customers who drive your business.

If you sell athletic equipment, how do people buying bicycles behave different from people buying tennis rackets? Which type of purchase is more valuable to your business? Looking at how certain products sell compared to others can help you plan what kinds of customers and transactions you want to drive more of. Understanding how different products or services you sell can help you optimize your customer mix.

Comparing your different products to see what key activities take place in each buying process is a great way to find any gaps where a customer might be taking longer to purchase because they’re missing essential information, or to spot opportunities to reduce the sales cycle by testing out new interventions like sending limited-time offers product recommendations.

<h2 id="using data in retail">Using data right is good for retailers and customers</h2>

If you use data effectively, you’ll better understand your customers and be able to use that information to support and empower them throughout the buying process, making it rewarding for them and increasing the likelihood they’ll buy from you. A long sales cycle can feel like a burden: without proper data collection in place and the ability to put that data together in a meaningful way, marketing to customers can seem like aiming in the dark. But, with the right tools, your data can help take the mystery out of figuring out what your customers want so you can deliver brilliant shopping experiences.

We’ll be covering each of the elements of understanding your sales cycle in greater depth in upcoming posts. To get notified of our new content and learn other ways retailers can be transformative with data, [sign up for our newsletter.][newsletter]




[sp-insights]: https://snowplowanalytics.com/products/snowplow-insights/?utm_source=snp-blog&utm_medium=text-link&utm_campaign=getninjas-blogs&utm_content=snowplow-insights


[cross-channel]: /assets/img/blog/2018/11/cross-platform.jpg

[bigcommerce]: https://www.bigcommerce.com/blog/mobile-commerce/#why-does-mobile-commerce-matter

[shopping]: /assets/img/blog/2018/11/shopping.jpg

[newsletter]: https://go.snowplowanalytics.com/l/571483/2018-06-21/2yvms68?utm_source=snp-blog&utm_medium=text-link&utm_content=newsletter
