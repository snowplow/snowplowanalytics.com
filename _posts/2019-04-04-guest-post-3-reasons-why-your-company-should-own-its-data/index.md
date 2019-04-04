layout: post
title-short: "Why your company should own its data"
title: Guest post: 3 reasons why your company should own its data
tags: [analytics, data, big data, data science, business intelligence, data for business, data ownership]
author: Jacob Thomas
image:
category: Analytics
permalink: /blog/2019/04/04/guest-post-3-reasons-why-your-company-should-own-its-data
discourse: true



*This is a guest post by Jacob Thomas, Lead Data Engineer at CarGurus. You can find the original article and read more from Jacob on [Bostata]. [own your data]*

When it comes to your company’s software and infrastructure, it often makes sense to buy vs. build. However, it will benefit you in the long-term to thoroughly understand and own your data management and collection. Here's why.
When it comes to software and related infrastructure, businesses get caught in a never-ending cycle of "build vs. buy". Many third-party companies successfully solve challenges such as [managing sales pipelines](https://www.salesforce.com/), [accounting automation](http://www.netsuite.com/), [payment processing](https://stripe.com/), and [internal communication](https://slack.com/). These alternatives to "building it yourself" empower companies to operate faster or more efficiently, and the overall benefit to the customer is net-positive.
However, there is one critical component of your business you should reconsider leaving with third parties: **your data and supporting data infrastructure.**

In fact, the world’s most progressive companies have this in common: *an obsession with data collection and in-house data ownership*. Why do they invest in building their own data infrastructure to ensure in-house data governance? Simply put, it adds long-term value, offers positive financial implications, and creates competitive advantages.
Let's take a closer look at the first advantage of data ownership.

##1. Add long-term business value through data ownership.

Imagine you're an investor evaluating two functionally-equivalent companies. Both have similar technology, a large customer base, provide real value and have been in business for about five years. Now let's say Company 1 has four years worth of site traffic and customer behavior data, application performance metrics, clean financial data, git (code change) history, and a number of external datasets relevant to its core competencies. On the other hand, Company 2 simply has its co-founders and a small subset of the engineering it has employed along the way.

*Which one would you invest in?*
*Probably not the one with minimal data to back up their claims.*

When a company has full ownership of data, it's easy to track unsampled site performance over time. On the other hand, a product like Google Analytics makes this impossible unless your company is willing to pay more than $150,000 annually.
So what should you do if you want to prove important business growth, product efficacy and show that technical competence has increased throughout your company's existence? The answer is to instrument your systems and warehouse your own enterprise data.
***Only in-house data ownership makes this possible.***

##2. Data ownership has important financial implications -  now and in the future.

Let's consider the widely-used system for site instrumentation and analytics previously mentioned: [Google Analytics](https://analytics.google.com/). If you want a "pure", unsampled view of your site traffic you will need to become a Google Analytics Premium customer (now branded "360") at an annual cost of over $150,000.
What happens when you become a paying customer, only to decide five years down the road that you need to cut costs and downgrade the service? The historical data you have been collecting would be sampled leaving you with only a rough estimate of site traffic over time. And since you most likely wouldn't want to lose the insights and data access you once had, you are *therefore held hostage by your own data*.

Let's consider another commonly-used platform for application instrumentation: [Mixpanel](https://mixpanel.com/). Mixpanel is incredibly easy to set up, initially inexpensive, and adding custom instrumentation is straight-forward. But as your site scales, or you want to add additional features, the cost of service gets rapidly more expensive. Typically, it increases faster than your business revenue. And once again since you won't want to lose a historical set of data about your business by downgrading your service, you are *held hostage by the very data your application generated*.

##3. Ownership of data gives you competitive advantages you cannot achieve in any other way.

Think about it this way: who has the advantage when your site scales, but the data collection pipeline is owned by another company (and rented by yours)? The answer is simple: not you!
What happens when you stop paying a third-party service provider?
***You lose access, and they keep your data. If they're lucky, you might even forget about the tracking code placed on your site, and continue to ship them data for an extended period of time.***

What happens when Google decides to launch a product that directly competes with yours?
***They have years of your site traffic data, and probably your closest competitors' data as well.***

What happens when the data your systems produce has valuable insights that can be monetized? Or the activity can be aggregated, enriched, and sold to a partner?
***Your company won't be seeing any of those financial benefits, sorry!***

What happens when a nation starts enforcing [new rights for personal data and data privacy, such as the General Data Protection Regulation?](https://www.wired.co.uk/article/what-is-gdpr-uk-eu-legislation-compliance-summary-fines-2018), and you must comply or risk enormous fines?
***[You shut off that line of business](https://adexchanger.com/mobile/verve-closes-european-business-thanks-to-gdpr/.***
Alternatively...
If you own your data, you have full control. Which is why your company should be responsible for its own intellectual property, data collection, and data management systems. What's more, you will be able to track activity at a finer granularity, because you own the data!

Want to ensure you comply with General Data Protection Regulation? It's much easier when you control the collection and persistence of personal data, and simply issue a `DELETE FROM some_table WHERE id = 10;` sql statement!

Want to persist terabytes of data in a [99.999999999% durable](https://aws.amazon.com/s3/faqs/) location that is accessible at any time? You can do so with AWS S3 at a whopping price of [$0.023 per GB, per month](https://aws.amazon.com/s3/pricing/). Have more data than that, and want to roll it into long-term cold storage? AWS Glacier exists for exactly that reason, and is priced at a convenient [$0.004 per GB, per month](https://aws.amazon.com/glacier/pricing/). Thanks to Moore's law, data storage gets *less expensive over time*, unlike any third-party data service provider on the market.

##In Conclusion

To build the most value possible for your organization, realize maximum financial benefits, and retain your competitive advantage, *you need to own your data*. While many third-party data services might be easier to set up initially, your business will ultimately find itself with higher expenditures, less flexibility, a flawed data ownership model and a lot of hassle along the way. To sum up, [*own and manage your own data*.](https://bostata.com/post/why_your_company_should_own_its_own_data/)




[own your data]: https://bostata.com/post/why_your_company_should_own_its_own_data/
