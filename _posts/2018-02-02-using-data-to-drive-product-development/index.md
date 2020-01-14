---
layout: post
title: "Data-driven product development is more about process, culture, and people than technology"
title-short: Snowplow product analytics part three
description: How people and company culture play a bigger role than technology in being data-driven
image: /assets/img/blog/2018/02/development_loop.jpg
tags: [analytics, product analytics, digital products]
author: Yali
category: Data insights
permalink: /blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/
---

*Part three of our series on product analytics. Read: [Part 1][product1], [Part 2][product2], [Part 4][product4], [Part 5][product5], [Part 6][product6], [Part 7][product7], [Part 8][product8]*

---

<h2 id="more about process">What does successful use of data to drive the product development process look like? It’s much more about process and culture than it is about technology.</h2>

There’s no getting around it - product analytics matters. As we’ve [already explored][product1], [intelligent use of data as an integral part of the product development process is often the differentiator between successful and unsuccessful products][product2]. Unfortunately, putting data at the heart of the product development process is hard and the obstacles are not always what you might think.

We’ve been privileged to work with some brilliant product development teams across our customer base. In this post we’ll outline how companies that successfully use data in the product development process do so. Hopefully, this will prove useful for product teams that want to be more data-driven by providing a clear picture of what successful use of data in the product development process looks like in practice. Though technology does have a role to play, it’s a means to an end and process and culture are much more important than technology for reaching that end.

These insights were not formed in a vacuum but come from perspective based on our experience with our own clients, and countless conversations with product managers across different industries and geographies. But this is an ongoing conversation and we’d love to hear from across the product analytics community whether their experience chimes with ours, and particularly if they’ve seen differences. Comments and counter opinions are very welcome in the accompanying [discourse thread][discourse-thread].

<h2 id="best practices">What best practices around using data mark out successful product development teams?</h2>

Product development is an iterative process, organic and consistently flowing. Product teams aim to understand their users and the role the product plays in their users’ lives: this might be measured in value (e.g. for a trading application that is literally being used to generate profit for traders), time spent being entertained or informed (in the case of media or games companies, for example), or some other measure tied closely to the purpose of the product. As their users’ needs change and evolve, sometimes in drastic new directions, product teams are constantly looking for opportunities to improve their product so that it better serves existing use cases or can start to serve new, potentially adjacent use cases. Early on in the product lifecycle, product teams focus on finding product-market fit. Once that fit is established the focus switches to improving the user experience, driving more value, for users or the business or both. Updates are proposed, prioritised, developed and launched and rolled out:


![product development loop][loop]

Data has an important role to play in a number of the stages identified above.

<h2 id="generating ideas">The role of data in generating ideas for improvement</h2>

There is a wide misconception that data is reactive and is only useful for looking at the past. The truth is that data can play a significant role in getting product teams to be forward thinking by helping identify opportunities to improve a product. Quantitative data describing how users actually engage with products might be used to uncover if the product is being used in a way that hasn’t been anticipated, or if particular workflows are cumbersome and awkward. Qualitative feedback can be used to identify how users feel about different aspects of the product, potentially highlighting areas that frustrate users, even if the quantitative data suggests that users still successfully navigate those parts of the product.

Product teams that are good at data use it as part of the creative process for identifying opportunities to improve a product by using it to highlight parts of the user experience that are suboptimal.

<h2 id="role of data">The role of data in specifying updates to the product</h2>

When it comes to specifying updates to products, we see a big difference between those product teams that are good at using data and those that are not. When an update is specified to a product, data-sophisticated product teams will include, as part of the specification:
1. Any updates that are required to the tracking of users through any new or adjusted workflows. This is important to maintain data accuracy, that the data that describes users’ interactions with the product represents their journeys, and there is not a lag between updates being rolled out to the product and the data reflecting the updates to the user journeys that those updates enable. It is also essential to ensure that the impact of those new developments can be quickly measured prior to full roll out.
2. The “hoped for” impact of the update is specified in a quantitative way e.g. this update should increase time in game by x%, or we expect this new recommendation module to increase the % of baskets with multiple items by y%. This forces the product team to be crystal clear when specifying what the update is supposed to achieve, useful going into the sprint planning process to enable product teams to effectively prioritize the development of one feature over another. In addition, these metrics will provide firm criteria for determining whether or not the update should be rolled out across the entire user base, once it has been A/B tested with a subset of users.

The above two steps are essential for any product development teams that want to be data driven and they can be as challenging as they are useful. Unfortunately, the majority of product teams do not go through this rigorous exercise - limiting their ability to use data to effectively inform the product development process.

<h2 id="prioritizing">The role of data in prioritizing different proposed updates to the product</h2>

As part of the regular sprint planning process, product managers will be forced to choose how to prioritize different potential updates to the product. This decision can be informed by the clear, quantitative benefit that the team hopes to derive from the update, specified as part of the overall specification process.

<h2 id="deciding">The role of data in deciding whether or not to roll an update out across the user base</h2>

Good data-driven product development teams will have a formal process for A/B testing any new features with a subset of users prior to any rollout of that feature. Remember that the product team will, as part of specifying an update, already have specified the impact that that update should have. A/B testing provides a formal mechanism for measuring if the update has that desired effect.

With each new release of a product, therefore, a new set of A/B tests will be launched to test the latest batch of features. At the end of the test period the results of those tests will be assessed. Only then will product teams that are serious about data roll out those features where the A/B test showed that the update had the desired effect to the rest of the user base. Otherwise the feature will be canned.

Having the discipline to stick to this formal process is the only way product teams can ensure that over time successive releases drive significant incremental improvements to the products.



{% include shortcodes/ebook.html layout="blog" title="Using data to develop killer products" description="A comprehensive look at the tools, technology, and culture companies need to effectively use data" btnText="Download eBook" link="https://go.snowplowanalytics.com/l/571483/2018-06-26/2z9m4gd?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-series-3" %}




<h2 id="process">Process matters</h2>

As should be clear from the description above, data-driven product teams follow a very formal, detail-oriented process, where data plays a role in:
1. The specification of any update to the product
2. The specification of the impact the update should have on the product
3. The measurement of the impact of the update on the product
4. The decision whether or not to proceed with the rollout of the update

This is not easy: it requires a huge amount of discipline from the product team. It requires additional overhead in terms of upfront work in specifying the update. It means that every update has to be A/B tested, which itself has an overhead. And it means product managers have to be open to canning features they may have strong emotional attachments to, because the data tells them otherwise. The return on that extra effort and discipline however is enormous, especially when measured over time. It drives a deep understanding of how user behaviour shifts with each product update across all members of the product team, and means product teams can be very confident that over time they will drive systematic improvements in the performance of the product.

<h2 id="culture">Culture matters, too</h2>

In practice, adherence to this strict process for managing the role of data in the product development process is only possible given the right company culture, one where:
* Arguments evidenced by data hold weight (especially with senior management who often have their own ideas about how a product develops)
* Experimentation is encouraged
* Failures are treated as learning experiences

Organisations differ in the extent to which they value both data and experimentation. Too many organisations only pay lip service to the value of data. (Data is quoted in arguments, but often is not decisive.) Too many organisations are not committed to experimentation. Committing the resources necessary to run all the different experiments a process like this requires necessitates a very high level of organizational commitment. Only those organisations that really value the solid insight that derives from that experimentation will make that commitment. For those organisations that do commit the resources, that commitment, to both data and experimentation, will be an important part of the organization's culture.

Product teams in organisations that do not have that deep cultural commitment to data and experimentation will constantly be under pressure to cut corners, making it very hard for those team members, however committed they are to data and experimentation, to do data right.

<h2 id="technology">Technology matters, but less so</h2>

Technology is important: as we’ll describe in a later post, it plays an essential enabling role in making this process possible and not unnecessarily onerous. However, the value that technology can unlock will be contingent on the product team, and the organization that operates it, having the right culture and process. Without those, the best new product analytics solution in the world will not help that product team use data to drive that competitive advantage. A data-driven product development process is the only way to understand your users deeply enough to build the best product for them, and if you don’t, someone else will.

To learn more about product development with us, make sure you [subscribe to our newsletter][subscribe] for all of the latest entries in our product analytics series.


[product1]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[product2]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[product4]: https://snowplowanalytics.com/blog/2018/02/09/the-product-analyst-toolkit/

[product5]: https://snowplowanalytics.com/blog/2018/02/23/creative-experiments-and-ab-tests-produce-the-best-results/

[product6]: https://snowplowanalytics.com/blog/2018/04/27/getting-the-most-out-of-product-analytics-with-intelligent-questions/

[product7]: https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/

[product8]: https://snowplowanalytics.com/blog/2018/06/01/the-right-data-infrastructure-to-support-successful-squads/

[discourse-thread]: https://discourse.snowplowanalytics.com/t/habits-of-successful-data-driven-product-teams/1775

[loop]: /assets/img/blog/2018/02/development_loop.jpg

[subscribe]: http://snowplowanalytics.us11.list-manage.com/subscribe?u=10bb4a6f31d5f19e0d0b54476&id=bb28c7d30d
