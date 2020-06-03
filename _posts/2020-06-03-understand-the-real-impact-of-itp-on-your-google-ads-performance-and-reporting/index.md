---
layout: post
title: "Understand the real impact of ITP on your Google Ads performance and reporting"
description: "Quit relying on bad web analytics data from Google to run your business and discover how to take control of your data to make informed marketing decisions."
author: Mitra, Big Tree
category: Data insights
permalink: /blog/2020/06/03/understand-the-real-impact-of-itp-on-your-google-ads-performance-and-reporting/
---

_This is a guest post by Mitra Muehlman who works on the web conversion and data science team at Big Tree, a Snowplow implementation partner. You can find the original post and more content from Big Tree on [their blog](https://www.bigtreeonline.com/blog/)._

End to end attribution is the ultimate goal for any marketer. The ability to accurately attribute revenue to specific campaigns, and to do so well, is a vital component of your ability to efficiently deploy capital in the most effective areas. The more revenue you can accurately tie to specific efforts, the more confident you can be when deciding how much and where to place your marketing budget.

The foundation of accurate revenue attribution is true data, but sometimes true data is hard to come by. It became harder when Apple released iOS 13 and Safari 13 during the fall of 2019. With that came their latest roll-out of Intelligent Tracking Prevention (ITP), which has had drastic effects on cookie lifespan, reducing most to just 24 hours, including those from ad clicks. And with that came a significant negative impact on companies’ ability to easily and accurately attribute revenue to digital ad spend. 

The reasoning for increased restrictions on cookies are, in large part, a noble one. Preventing cookies from tracking users across multiple websites, over long periods of time, provides more security and privacy to everyone. But there were plenty of consequences that came from this implementation, one of which is less-true data for you and your business. 

Every successful e-commerce business relies on web analytics to track sales, measure KPIs, and effectively market to the correct audience. Most successful e-commerce businesses rely on [Google Analytics](https://analytics.google.com/) for this data, and Google Analytics relies on JavaScript cookies to remember what users have previously done online. When ITP introduced 24 hour cookies, Google Analytics became unable to track longer customer journeys. The result is inaccurate data on your end.

## The practical implications of ITP

You might be wondering just how much these changes affect you. The answer will depend on how much of your revenue comes from Safari users. Either way, we want to give one real-world example from an e-commerce client of ours who utilizes both Google Analytics and a custom solution of ITP compliant, first-party cookies + their own Snowplow web analytics data pipeline. We compare the two methods in hopes of providing the practical implications of ITP.

Creating your own web analytics implementation involves a few steps and some time, but will result in a more robust data solution as well as owning your company’s data. Implementing ITP compliant cookies is step one in enabling your business to circumvent the newest ITP restrictions. If you couple that with your own web analytics data pipeline (like Snowplow), then you will be the master of your own revenue attribution universe (not to mention the master of all your data). Additionally, for this scenario, we joined the data from the sources mentioned above to the internal sales data of the company. 

It should be noted, the largest number of devices upgrading to ITP 2.3 occurred in late November 2019, right around Black Friday. This caused significant turbulence for many marketing departments, who were in the midst of their busiest weeks of the entire year. Every indicator our client was getting from Google Analytics was telling them to reduce ad spend because attributable revenue was decreasing. This was the same week they ditched Google Analytics and relied on the data from their ITP compliant solution, which was giving the indicator to increase ad spend. Not to ruin the punchline to this article, but they turned up the dial on ad spend, and it resulted in their biggest season on record.

## The method 

The first thing we need to decide upon when comparing the two methods is a set of rules to ensure we are fighting on a level playing field. For us, those rules were: each method’s revenue attributed to Google ad campaigns, last touch non-direct, across the same time period, across all browser types.

The second thing we need when comparing the two methods is data. After a quick export of a custom report from Google Analytics, and a few lines of SQL pulling rows from the ITP compliant solution, we were ready to compare. 

The results were striking. After graphing each method’s daily ad revenue, it is clear when Google Analytics began to miss attributable revenue events. And therefore, it is clear when ITP 2.3 was rolled out en masse. 

## The results: Divergence in reported attributable daily ad revenue

In the graph below, the blue dotted line represents daily attributable revenue from our client’s custom Snowplow web analytics solution, and the red dotted line represents daily attributable revenue from Google Analytics. Because the daily numbers are noisy, we applied centered, moving-average trendlines to the data to gain clarity, which are represented by the solid blue and red lines. 





![chart1](/assets/img/blog/2020/06/chart1.png)


Generally, the graph shows the rise in daily attributable revenue as we move towards the Christmas holiday, and the fall-off afterward (as would be expected). But specifically, it displays the divergence in reported attributable daily ad revenue, between the two methods, beginning late-November / early-December. 

Up until Thanksgiving, the two methods moved hand in hand, and in actuality, Google Analytics was reporting slightly more attributable revenue than our method. This is because the internal sales data we use, excludes canceled orders, fraud, and chargebacks. 

When looking at the graph, it’s important to understand that Google Analytics began to miss attributable revenue, not that our method began to attribute more revenue. In other words, some customers who previously interacted with our client’s advertisements were later miscategorized by Google Analytics because the usual method of first-party cookie tracking was insufficient.

## The results: Quantifying the impact that ITP has on your marketing

We thought it necessary to display the comparison in another way, which we hope will bring home the argument that Google Analytics is providing your business with insufficient data. The two lines in the graph above obviously diverge, but it may not appear like that matters, because they are still reasonably close together. If instead, we graph the running-total difference between the two methods, in real dollars, it becomes easier to quantify the impact ITP 2.3 is having on your marketing.

In the graph below, the yellow line is the daily percentage difference of attributable revenue between the two methods, where a positive value implies that Google Analytics is attributing more, and a negative value implies that it is attributing less. The green line is a running total of the dollar difference between the two methods, where a positive dollar value means Google Analytics has been attributing more, and a negative dollar value means that has been attributing less.






![chart2](/assets/img/blog/2020/06/chart2.png)


This graph unmistakably conveys the impact that ITP 2.3 is having on marketing revenue data. 

For the yellow line (daily difference, as a percentage), it begins by showing Google Analytics attributing more than the ITP compliant solution, but that flips as users start upgrading to the new Safari. By mid-February, Google Analytics is reporting 12% less than it should be. 

For the green line (running total difference, in USD), during the first two months of data, Google Analytics attributed about 50,000 USD more in ad revenue than the custom solution. After that time, and through the next two and a half months, Google Analytics attributed around 430,000 USD less in ad revenue than the custom solution.

Just the numbers: 



*   Before Thanksgiving, Google Analytics was attributing 1.90% more revenue from our client’s Google ads than was our custom method. 
*   Between Thanksgiving and Christmas, Google Analytics was attributing 6.49% less than our custom method. 
*   Since Christmas, Google Analytics has been attributing 12.38% less than our custom method.

To make these numbers even more astonishing, Safari users accounted for about 50% of our client’s online revenue, so the impact would be roughly double if we only look at Safari. Even if Safari users don’t make up 50% of your customer base, in general, Safari users spend more than their Chrome or Firefox counterparts per capita, making them a valuable subsection, and one that you can’t afford to have bad data on.

## Conquer Safari’s ITP and take control of your data

A 12% decrease in ad revenue would undoubtedly impact decision making at your business. But if you saw a dip from your projections beginning late 2019, it might just be because Google Analytics is no longer reporting using good data.

It is clear that the combination of 1) using your companies internal sales reporting data, plus 2) an ITP compliant cookie implementation, plus 3) Snowplow’s more robust web analytics data, plus 4) your efforts to join these sets of data together, results in a far more accurate revenue attribution model for your company’s digital marketing efforts than is provided by Google Analytics. 

What isn’t as clear, but is equally as important to understand, is how the difference between the model mentioned above and the model provided by Google Analytics affects your business moving forward. From daily tasks like making bid adjustments on your digital advertisements, to big picture decisions like how much budget to put towards digital efforts, the importance of having true and accurate numbers cannot be overstated.

To learn more about [Big Tree](https://www.bigtreeonline.com/), what they think about ITP, and their solutions, check out this [blog post](https://www.bigtreeonline.com/blog/itp-competitive-advantage).

