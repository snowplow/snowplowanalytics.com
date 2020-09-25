---
layout: post
title: "How to build a future proof approach to data collection"
description: "Why an explicit tracking strategy is preferable to automatic event capture when building your data asset"
author: Franciska
category: Data governance
permalink: /blog/2020/09/15/future-proof-approach-to-data-collection/
discourse: false
---

## Why an explicit tracking strategy is preferable to automatic event capture when building your data asset

Recently [a member of our community asked ](https://discourse.snowplowanalytics.com/t/snowplow-capturing-all-events-automatically/3866)about whether it would be feasible to modify our JavaScript tracker to capture all events automatically, much like [Heap’s Autocapture](https://heap.io/product/autocapture) feature. This sparked an interesting conversation internally and externally at Snowplow. It even led us to hosting a joint webinar with Heap and Iteratively to [debate the pros and cons of implicit and explicit event capture, when to use and why](https://snowplowanalytics.com/webinars/explicit-vs-implicit-tracking/watch/). 

Today, Snowplow “only” [tracks certain events out-of-the-box](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/) (such as click events, page views, page pings and form fills). Anything beyond that is down to users to define and implement with additional code. This means it’s up to you and your team to decide what makes sense for your business by looking at the questions you want to answer with data. The drawbacks here are:



*   You might not know initially what business questions you’d like to answer,
*   The time it takes to [define your tracking strategy](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/) with all the relevant stakeholders will delay data exploration,
*   You're reliant on developer resources to implement your tracking and they might be busy with other projects.

Facing these setbacks, it might be tempting to opt for the ‘track everything now’ approach. When we speak to Snowplow customers and prospects, some bring forward the same concern as our community member did: “We know I want to answer these 10 key questions right now, but I don’t necessarily know what I need to answer in a year’s time when our team is bigger and we’re getting more sophisticated with our analytics.” 

At Snowplow we believe in capturing data once and focusing on building a high quality data asset. We believe in investing time upfront in defining your tracking strategy and evolving that with your business as you grow. The ‘capture everything approach’ might make it easy to get started, but we would argue you end up with a low quality data asset down the line that is more challenging to leverage in the long run and will consume more of your time in the future.

In this article I’ve tried to outline some of the reasons in favor of taking a long-term view to data collection, specifically with a focus on the benefit of building a strategic data capability or asset. 

What do we mean by that? It deserves it’s own blog post, but in short, it means that you treat your data as a valuable business asset. It usually means moving from a tool based approach where different teams leverage different solutions for collecting, processing and acting on their data to a strategic solution, managed by a data team or teams. The data moves from being a by-product to an asset that can be leveraged across the business for any and all data use cases, today and in the future - and the data infrastructure should be built out and managed in a way to support that.   



 {% include shortcodes/ebook.html background_class="explicit-vs-implicit-landingpage" layout="blog" title="Watch webinar" description="Pros and cons of implicit and explicit event capture with Heap and Snowplow" btnText="Watch now" link="https://snowplowanalytics.com/webinars/explicit-vs-implicit-tracking/" %}


### Automatic event capture: the good, the bad and the ugly

As a marketer, my idea of data nirvana is the scenario where my team wouldn’t have to rely on engineering resources to get the data we need.

Auto-event capture makes this possible. A clear benefit of this approach is that a marketer or product manager can start capturing and get insights from their data by inserting a single snippet of code and leveraging a plug and play UI to build reports and explore their data.  

I mentioned Heap before, but this is not the only tool offering autocapture; Mixpanel launched an [Autotrack feature](https://mixpanel.com/blog/2018/02/05/update-autotrack-data-collection/) which they later deprecated and recently Segment introduced their version, [Visual Tagger](https://segment.com/blog/visual-tagger/). While Segment offers to give non-technical people a way to collect web data in minutes, Heap makes it possible to capture everything “all the time”. Regardless of the autotrack origins, there are reasons why the autotrack route is not for everyone. 

Without laboring on all the reasons (Iteratively did a great job outlining the pros and cons of both implicit and explicit tracking [on their blog](https://iterative.ly/blog/implicit-vs-explicit-event-tracking-hits-and-misses/)), in this post I will focus on highlighting some of the potential pitfalls of automatic event capture – if you’re serious about building a strategic data asset.

**You’ll end up with messy data**

While auto-capture is fast and convenient, it does not allow you to control the quality of your data. In particular, your data and naming conventions will not follow a consistent structure. And if you’re looking to capture data that can be leveraged across your organization in the long term, there are multiple reasons why it makes sense to follow consistent naming conventions and a predefined data structure.  

A key reason well-structured data is preferable for data consumers is because it arrives in an _expected _format. Defining a [clear event data structure](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) (and investing in the processes to uphold that structure) means data is delivered to your stakeholders in a consistent format that analysts can work with right away. With auto-capture you might have several button CTAs across your site that are named differently but are effectively the same action. Imagine you have “Add to basket” on some pages and “Purchase now” on others. With the auto capture approach, the burden falls on the data consumer to explore and map the data before it can be loaded into a relational database or visualised. This reduces time to value and creates extra work for colleagues. 

It will be difficult for data consumers to explore the data outside of the auto track tool. Often the data gets “dumped” in a data lake for future use cases and when someone wants to put it to use, they’ll first have to spend countless hours cleaning and structuring the data – or worse still, start from scratch because it’s impossible to salvage. 

**More data doesn’t mean complete data**

With auto-capture, you’ll most likely capture more data than you would with explicit tracking. 

On the surface, this sounds like a good thing, but unfortunately the end result is usually generic, catch-all events that are disparate and hard to analyze. You also won’t benefit from any of the rewards of custom tracking, such as custom [entities](https://snowplowanalytics.com/blog/2020/03/25/what-are-snowplow-events-and-entities-and-what-makes-them-so-powerful/) or properties for different buttons and sections of your website. In fact, to get the full picture of what’s happening from your data, you will have to capture some events explicitly anyway (and that’s why all auto capture tools support explicit event tracking). 

To take one ecommerce example, if you’re an online bedding store, implicit event capture would not enable you to see how many pillows were purchased on a given day. All you’d be able to track is the number of users clicking the checkout button. Furthermore, If you’re solely relying on auto-capture for web data collection, you aren’t tracking [mission critical events server-side](https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/) which will leave increasingly big holes in your analytics (think ad blockers, ITP, ETP, etc.). 

This is another reason why taking a long-term view to data collection is worthwhile, and it pays off to be [explicit with your tracking design](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/). With explicit tracking you’re able to structure your data around your business, saving a lot of time and effort for data consumers downstream. Although this approach requires more upfront investment, it pays dividends when sharing high-quality, actionable data across the business. 

**There’s a cost to capturing everything** 

In the long term, capturing, processing and storing “everything” becomes unsustainable and costly (and bad for the environment!). There are significant costs associated with processing and storing huge volumes of data. For this reason, as you’re building your data asset, it makes sense to take a practical approach to data capture, and ask yourself _what’s most important to our business? What key questions are we trying to answer?_

Even for companies with unlimited resources, weeding through mountains of messy data quickly becomes infeasible.  As Mike Robins, CTO of [Poplin Data](https://poplindata.com/) put it:



> **“I’ve found that the track everything philosophy leads to finding a needle in a haystack, with the caveat that you’ve now made the haystack larger - the needle is still the same size.”** - **_Mike Robins, CTO, Poplin Data_**

**Autocapture encourages the wrong kind of data culture**

Data culture isn’t affected by one tool or practice. A company’s data culture depends on a plethora of factors and there are plenty of companies that maintain a strong data culture while making use of auto-capture solutions. 

However, in many cases auto-capture doesn’t encourage the behavior you’d like to instill in your teams and across the company as a whole. For one, it encourages front-end developers not to care about data collection or analytics. It can also lead to individual teams becoming data silos (e.g. marketing or product teams) and it’s hard to blame them. Objectively it’s easier to adopt an auto-track solution without inviting in the wider business and the relevant stakeholders. 

This siloing of data tooling and processes can cause rifts in the business. Product teams who want to leverage solutions like Heap or Mixpanel for their analytics clash with data/engineering teams who are either discouraged from or unable to leverage this data for the wider business. In the long run, a unified approach to tracking and a shared single source of truth is far more conducive to a successful data culture in the organization.


### When it makes sense to use auto capture features

There are times when auto-capture makes sense. One example benefit is reduced time to value, compared with explicit event capture. For short-term projects and POCs where teams need to move fast to prove ROI, using a tool like Heap or Segment’s Virtual Tagger is a practical choice. It would allow a non-technical marketing or product team to set up and show initial results quickly, giving them the ammunition they need when asking for additional resources to expand the project. 

If you’re just getting started on your data journey and you’re looking to move up the data maturity curve and don’t have access to engineering resources or have C-level buy-in to build a strategic data capability, tools like Heap or Segment make a lot of sense. For example, within the Heap UI you’re able to get the insights you need to start taking data informed decisions and with Heap’s continuous release of data quality features like their [Heap Data Engine](https://heap.io/blog/product/introducing-the-heap-data-engine) their tool can take you far.  

In the long term however, thinking holistically about your tracking strategy and not just as an individual team will be detrimental to your company’s success. Even Heap agrees that relying completely on auto captured events does not make sense and according to them [about 10% of the data used in Heap Reports](https://heap.io/wp-content/uploads/2020/04/Heap_Autocapture_Whitepaper_V6.pdf) is manually tagged. 

At Snowplow we ask our customers to think about tracking upfront and we help them design a tracking plan that fits their use case(s) and business questions. This can take time and effort, and the results don’t always appear right away. Our customers also require engineering resources to help implement their tracking plan and so proving the value of a data project can take longer than desired. These obstacles are not insignificant, but we think the long-term payoff of a high-quality, rich data asset justifies the investment. 


### Building a future-proof data asset with Snowplow

Ultimately, investing the time to think about your tracking design leads to a high quality data asset that can move the dial across the whole business. While auto-capture tools offer quick wins, we often see our customers having to start collecting data from scratch because their existing data is just too messy or of low quality. 

As more and more teams rely on data to inform their decisions, the data team plays a critical role in building out and maintaining a data asset. Instead of relying on an array of point solutions that solve specific use cases, we believe that data teams should centralize this effort and build a single source of truth for the company. In doing so, they will empower business functions to leverage the tools of their choosing that can “sit above” the data asset. They can work collaboratively, while keeping their autonomy.  

This is no easy feat. It requires the data team to bring all the relevant stakeholders together and to understand multiple business requirements. It requires being responsive to change – these requirements will likely evolve as the business grows. 

And while an explicit tracking approach will enhance data quality and improve central data governance, keeping the data asset valuable, high quality and actionable in the long term is a continuous effort. There are no shortcuts, but if there were – we’d let you know!

At Snowplow, we help data teams with exactly that – building a high-quality data capability that can drive the whole business forward. [Get in touch](https://snowplowanalytics.com/get-started/) to learn more.