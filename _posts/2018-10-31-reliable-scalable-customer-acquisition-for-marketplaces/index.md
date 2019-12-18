---
layout: post
title: "Building reliable, scalable customer acquisition for marketplaces"
description: Using data to optimize customer acquisition
image: /assets/img/blog/2018/10/balance.jpg
title-short: Customer acquisition for two-sided markets
tags: [analytics, marketplace, two sided market, customer acquisition, cro]
author: Anthony
category: Data insights
permalink: /blog/2018/10/31/building-reliable-scalable-customer-acquisition-for-marketplaces/
discourse: true
---

Two-sided marketplaces are environments where you primarily have two distinct user types: buyers and sellers. There are many different marketplaces out there: GetNinjas in Brazil, Fiverr in the United States, and OneFlare in Australia are all marketplaces where people can find professional service providers like plumbers, photographers, personal trainers, or more; jobs boards, like Indeed or ZipRecruiter, are marketplaces where job seekers can connect with prospective employers or recruiters; 99Designs and DesignCrowd are marketplaces connecting people with graphic designers; Upwork, freelancer.com, and Peopleperhour.com are marketplaces for freelancers. The list goes on.

![marketplace][marketplace]

Marketers at these businesses face unique challenges because of the added complexity of having two (possibly very different) user types that need to be acquired. Whereas a classic retail website is only concerned with acquiring buyers, marketplaces need both buyers and sellers to function. These users need to be carefully matched up so you end up with a mix of buyers who are interested in the products and services offered by your sellers- a  balance that is constantly changing.

Figuring out the right mix of buyers and sellers to acquire can be tricky, and getting it wrong results in time and marketing budget wasted: there’s no point in acquiring buyers for a product that doesn’t have any supply in your market. As a result, you **have** to use data to inform how you go about acquiring new customers. The best way to explain how to do this well is to look at a real-world scenario to demonstrate what’s possible when you intelligently use data to get the right mix of buyers and sellers.

GetNinjas, the marketplace for professional service providers in Brazil, is an ideal example. By relentlessly focusing on balancing supply and demand, GetNinjas increased the percentage of buyers on their website who were successfully matched with sellers, leading to a 33% boost in their overall conversion rates.

To achieve these results, the GetNinjas team followed a three step process:
1. Measure the current state of supply and demand by user segment
2. Infer the difference (i.e. the gap between supply and demand)
3. Use precise marketing channels like SEM to plug the difference.

<h2 id="measure supply and demand">1. Measure the current state of supply and demand by segment</h2>
When we try to balance supply and demand, we’re hoping to achieve a mix of buyers and sellers that ensures buyers can find the products and services they’re looking for, and sellers have a steady stream of business. To reach this balance, we need to start by understanding what the current state of supply and demand looks like.

Ask yourself: who are your buyers and who are your sellers? Then, think about what your relevant segments might be. If people use your marketplace through an app, you might want to look at buyers and sellers by desktop versus mobile, whereas a job board may be primarily interested in looking at job seekers and recruiters by industry.

For GetNinjas, the sellers are independent professional services providers (like electricians or photographers) who deliver their services to local buyers. An electrician in Sao Paolo, for example, is not going to service a customer in Rio. Naturally, the first step for the GetNinjas team was to be able to measure the number of people by city searching for particular categories of service providers, and compare that with the number of service providers by category by city.

With their users segmented by type and now able to be split by city, GetNinjas could closely monitor the supply and demand in each city, crucial information for the next step.

<h2 id="find the supply demand gap">2. Infer the difference- the gap between supply and demand</h2>
The first step is to understand the current state of supply and demand, for GetNinjas this meant the number of customers and professionals by category in each city. The next step is to compare those numbers to spot gaps.

Once we've measured the number of buyers and sellers by segment on our marketplace, we need to figure out if they're in balance. Matching buyers and sellers is tricky because the ideal ratio is not always clear and will vary from market to market and vertical to vertical. GetNinjas had to consider factors like how much business a language tutor is looking to attract each month compared to a plumber or a photographer; when their market is not balanced, clients can’t find the professionals they need and professionals have no leads, leaving both unhappy.

GetNinjas started by looking at the number of sellers by vertical and city. On GetNinjas, professionals are offered leads that they can purchase, after which they are provided with the prospective customer's contact details. GetNinjas ensures that each lead is only sold to three service providers, so each has a good shot at winning the work, but the buyer has a decent choice of provider. For each category, the GetNinjas team figured out the optimal number of leads that each service provider should be offered. Service providers who were being offered less than the optimal number represented a supply gap that GetNinjas needed to fill by acquiring more buyers for that category in that city. These gaps point out for GetNinjas exactly who they need to acquire down to the user type, user location, and how many of those users are missing from their marketplace.

Once the gaps are identified, the final step is to work on plugging them.

<h2 id="use marketing to fill supply demand gap">3. Use precise marketing channels like SEM to make up the difference</h2>
Having a thorough understanding of the gaps in your marketplace means you can work on filling them. You can use the data generated in identifying your supply and demand gaps to inform targeted marketing campaigns through channels like search engine marketing as GetNinjas did.

Search engine marketing (SEM) is precise and can be highly targeted thanks to the wide range of criteria you can select to bid on. If GetNinjas wants to acquire buyers of plumbing services in Fortaleza, they can bid for people looking for plumbers just in Fortaleza on Adwords. With SEM, by bidding on highly targeted keywords that map to the categories you want, you can acquire exactly those buyers you need to plug those gaps, like finding specific users in very specific locations. To make sure they were using SEM as effectively as possible, GetNinjas developed an algorithm to determine what they should bid for users in different categories and cities based on the amount of supply presently available in those cities.

![balance][balance]

Despite the complexities of getting the algorithm running and feeding it the right data, the principle behind the algorithm was relatively simple: when a prospective buyer posts a job on GetNinjas, GetNinjas will sell that lead to up to three eligible pros. The algorithm estimates how many (0-3) professionals would likely buy a lead in each city, and then sets a bid price based on the price of the lead multiplied by the number of pros who were likely to buy it. GetNinjas used this algorithm to ensure that they only bought users via SEM for services in cities where they had providers, and that the purchase of those leads was always profitable (or at least not loss-making).

GetNinjas did this in a very careful way - they identified network growth as a higher business priority than profit, so they were happy to break even on the cost of acquiring new users. Knowing this, the GetNinjas team developed their algorithm to take into account the optimal number of users along with how much they were willing to pay to acquire them.

Like GetNinjas did, if you can accurately value each buyer, you can use that value to fine tune what you pay to acquire those users to make sure you’re growing profitably. In markets where the supply or demand changes rapidly, like GetNinjas, the algorithm needs to be able to update as those changes are happening, otherwise you’re acquiring users unlikely to find what they’re looking for and even less likely to retain.

<h2 id="optimizing marketing budget with snowplow">Using Snowplow to optimize marketing budgets</h2>
If you’re a marketer at a company like GetNinjas, or other marketplaces, you know how challenging it is to acquire new users. Finding new buyers and sellers, and doing so in the appropriate amounts, is difficult to do systematically. With a detailed, granular data set that describes the behavior of each user on the marketplace, and a data modeling process that distinguishes buyers from sellers and makes it easy to segment by the dimensions that matter to you (like category and city for GetNinjas), you can following these three steps, measure supply and demand, infer the difference, plug the gaps, and acquire customers in an intelligent, repeatable way.

Many companies lack the ability to collect data that granular or work with it in meaningful ways. We’ve worked with many marketplaces like GetNinjas, 99designs, Carsguide, and more. If you’re a marketer at a company like this, take the first step toward owning your data and transforming your business, [get in touch.][demo]

To learn more about how GetNinjas used Snowplow, download the case study below:

{% include shortcodes/dynamic.html layout="blog" title="MAXIMIZING RETURN ON AD SPEND" description="Learn how GetNinjas used Snowplow data to analyze their users and optimize their marketing budget." btnText="Download case study" link="https://snowplowanalytics.com/customers/getninjas/?utm_source=snp-blog&utm_medium=cta&utm_campaign=getninjas-blogs&utm_content=getninjas-case-study" %}



[getninjas-case-study]: https://snowplowanalytics.com/customers/getninjas/?utm_source=snp-blog&utm_medium=cta&utm_campaign=getninjas-blogs&utm_content=getninjas-case-study

[demo]: https://snowplowanalytics.com/request-demo/?utm_source=snp-blog&utm_medium=text-link&utm_campaign=getninjas-blogs&utm_content=request-a-demo

[marketplace]: /assets/img/blog/2018/10/marketplace.jpg

[balance]: /assets/img/blog/2018/10/balance.jpg
