---
layout: post
title: "Interview with the author: Zuora’s Chief Data Scientist, Carl Gold, on churn, behavioral data and the importance of good metrics"
title-short: "Interview with the author: Zuora’s Chief Data Scientist, Carl Gold, on churn, behavioral data and the importance of good metrics"
description: "Zuora's Chief Data Scientist, Carl Gold, talked with Snowplow’s CEO and Co-Founder, Alex Dean, about Carl’s new book on using behavioral data to derive good customer metrics and defeat churn"
author: Erika
category:  Data insights
permalink: /blog/2020/03/26/interview-with-the-author-zuora-chief-data-scientist-carl-gold-on-churn-behavioral-data-and-the-importance-of-good-metrics/
discourse: false
---


## An interview with Carl Gold, Chief Data Scientist at Zuora, and author of “Fighting Churn with Data”


At Snowplow we think a lot about how we define and solve problems with data -- in particular, behavioral data. It's a big, nebulous issue that hasn't really been described clearly and fully, and in truth, goes beyond the analytics domain. Looking at existing literature, we hadn't seen anything that quite defined or touched on the importance of identifying customer metrics from behavioral data - until now. Carl Gold's upcoming book, _Fighting Churn with Data_ from [Manning](https://www.manning.com/) Publications, starts to define what good customer metrics are. 

Snowplow's CEO and co-founder, Alex Dean, recently had a conversation with Zuora's Chief Data Scientist, Carl Gold, a fellow Manning author, to find out more about Carl’s new book and learn how good customer metrics predict churn and retention. 


## The Wall Street origins of “Fighting Churn with Data”


### Alex: You write a lot in your new book, “Fighting Churn with Data”, about how to wrangle behavioral data. As I was reading, I was thinking, "I've never read about this in a book before." Where did this idea come from?

Carl: I did a PhD that included some machine learning before it was trendy, and more tangibly, I have a Wall Street background where people think a lot about metric design and parsimonious modeling. They were geniuses at regression; they absolutely used statistics, math, regression and very clever design of metrics. Because of course once you're doing regression - you're very concerned about whether your metrics are correlated with each other or not. It relates to the diversification of portfolio risk, which is the area I worked in. 

I transitioned into being a data scientist (and I use "data scientist" in quotes because I still wonder what exactly that means). Much of what I gained with my Wall Street experience, prepared me for looking at customer retention and churn problems through the lens of real, applicable metrics. I thought a lot about how to tackle these problems systematically - a cookie-cutter production process. When I was working on one of these analyses with another data scientist, I heard myself saying, "Yeah _we have seen this before_". It became clear that we had experience people could benefit from, and that informed my motivation for writing and the content of the book. 


## Getting business value from data 


### Your book's "here's the business value in the technology" theme stood out as a big differentiator from the standard "here's something hot and new in tech" theme. How did you decide that this was the perspective you'd take?

No one had written the data science book I wish I had learned from, so I set out to write it.

About the topic itself, if we start from the most important theme of this book, it's **how to make really effective customer metrics**. You need these metrics to make data-driven decisions about churn as well as customer engagement. And the data team **_has to_** deliver good metrics into the hands of the business people to help them make those decisions. An important point to note here is that it isn't about hot, new technology. Great customer metrics are available using tools we have, like Python and a bit of SQL, and diving into data with the right questions. 

I'd like people to understand that good customer metrics are important because, for example, the problems we need to solve are multifaceted and can be approached from many directions. For example, when you look at an issue like churn, it isn't solved in one single, easy way. There are many different ways to approach churn, and you're probably going to use most of them. It's not the usual data science approach where you "deliver a predictive algorithm and walk away". This yes/no model does not deliver value to the business people who need to take action on churn. 

In fact, that was my first mistake when I started to do churn analyses. The people tasked with working on churn need to know what factors put customers at risk of churning in the first place. This could be because they're paying too much, they are not using certain features, etc. All of these reasons are a part of the information that feeds into good customer metrics. 


## Customer metrics: A common language to work from?


### Do these customer metrics become a common language for the business to work from? Are these metrics useful not only for churn and retention but for other purposes? 

In the ideal scenario, your business comes up with a common set of customer metrics that are then usable across many different parts of the business. For example, the marketing department is going to use these metrics to choose customers to target with different kinds of emails, like pointing people toward great features they are missing out on.

The same metrics can be used by customer support or customer success teams. If they have dashboards that present individual customer-level data, they have a lot of information at their fingertips to understand the customer. For example, when a customer contacts the company, the representative can look at the dashboard metrics and see that they are strong in feature X, not using feature Y, they subscribe to the premium plan, but maybe they are not getting good value. 


## The hard-won experience of data scientists


### You mention in the foreword to “Fighting Churn with Data” about wanting to save data professionals from making all the mistakes about churn that you made. Can you elaborate a little on these mistakes and anchor them in your experience?

My first mistake - trying to rely on predictive models. **Don't just deliver a prediction**.

The second area I really struggled with is what we call **dimension reduction**, which is when you have a lot of metrics that are highly correlated. How do you summarize that? There are a few ways to do this, and the traditional technique for this - principal component analysis (PCA) - is pretty well known but is unbearably uninterpretable. it is impossible to put it in front of a business audience. I also tried models where I didn't do any dimension reduction, and it works all right when you have fewer than 20 customer metrics, but it completely fails when you have dozens and dozens of metrics. 

I hope these insights are a novel contribution that the book makes - the somewhat lesser-known techniques like **hierarchical clustering**, which is basically a simple way to do dimension reduction, which is much easier to explain to business people. It is not as statistically optimal as PCA so some people might have a problem with it, but it gets the job done. You lose the business people when you take uninterpretable approaches. 

Usually in a financial problem you pick your metrics more carefully, but the problem with churn use cases is that there is so much noise, so much going on, and products are instrumented for a lot of different purposes. The typical SaaS product is over-instrumented for the purpose of customer retention and engagement. You will really be tracking a lot of things that are not giving the customer value.

You need a way to just cut it down: dimension reduction.


## What you can observe with data


### Near the end of the book you discuss multi-user accounts, which seems like a really tough problem in terms of understanding churn-relevant behavior. What are some tricks to doing this without losing the very granular understanding of per-user behavior?

Remember when you're talking about churn, it is always at the account level. You definitely want to calculate your number of active users and percentage of active users. Any behavior you can count, you can count by the behavior per active user, which can be really valuable. But I haven't gone into an analysis of the users individually. In principle, you can do a user churn analysis where you look at what behaviors precede a user dropping off, but people are mostly concerned with the churn of the account that holds the contract. For churn we have handled it mostly with this aggregate-user metrics, so we use the user data, but we roll it up to the account level. 

I know a lot of companies place emphasis on learning about who is using the product and their job titles. This is legitimate but might be over-emphasized. There can be a lot of politics involved. But I'm the data guy, right? I focus on what we can observe with data. And you can observe the value that customers get and don't get. You can prove that customers who don't get value tend to churn more. The hypotheses around individual decision-making and churn are a lot harder to substantiate with data. For every case where you could tell me it was a political decision, I could answer you and say, "If they were getting value, why would they have churned?" Maybe a new person in the role _noticed_ that they were not getting value whereas the previous person didn't, or the appearance of a new person reopened the conversation about value. Data indicates that if the value were being provided, then the chances of churn go down.

A related example - people often ask, "Can we study different sequences of events that lead to churn?" It's reasonable in purchasing and retail settings, but it does not make much sense in a recurring subscription product to focus on the last action. It's kind of like the straw that broke the camel's back... That last bad thing was probably not that different from the other bad things that happened. The sequence isn't as important as things that they do that give value and things that frustrate them. Paying is probably one of those annoying things. In the end it's a question of balance between the value gained and pain from using. I don't think the sequence determines anything.


### At Snowplow we tend to think about modeling the job that needs to be done. If you can roll those sequences or workflows up, are there enough of those that they make sense?

In the book, I advocate that if you have flows of events in your data - for example, the customer signs up, customer does X, does Y - you should look at the **ratios of those events**. For a given customer, as an example, what is the ratio of edits per save? If you have a lot of edits and not that many saves, is that good or bad?

There are ways you can look at the end point of the process and different medium points, and without really modeling the fact that there is a sequence there, if you look at the ratio of some of those events you can see the value-generating pattern without getting into the sequence, which is a very thorny problem in feature engineering. As soon as you start doing sequences, you have an explosion of sequences of events. How do you manage that?


## It's hard to sell a solution for a problem no one knows they have


### Changing tack a little: anomaly detection to maintain event data quality is a really interesting topic for us at Snowplow - our customers often have hundreds of event types, and lots of organizational complexity that could impact on those events at any time. I know it's out of scope of the book, but have you got any suggestions around automatic anomaly detection?

Ha, I totally dodged that in the book! I have done the basic things like looking at how many standard deviations is an outlier from the norm and things like that. Missing data is always something you can detect by hopefully just eyeballing that it's missing. I haven't really dealt with it too much because most of the companies I have worked with had a relatively low number of events, i.e., the 50-75 range, where we could still just visually scan through the data.

Here's a story I will tell you, though. A VC emailed me the other day and said, "What do you think of this product? They are going to do automatic anomaly detection." I told him that it would be hard to sell because most companies don't realize how hard it is. **They don't yet understand how bad anomalies are going to be for their data pipeline**, and they don't realize how much of a problem they have until they are pretty sophisticated analytically. To survive that process most companies that reach that stage have built a homegrown system. **It is hard to go to someone who has never felt the pain to convince someone to buy something**.


## The key takeaway


### If there is one central message you want a reader to take away from the book, what would it be?

Carl: The importance of using your data to make great customer metrics. The business will actually use the metrics. Those metrics can absolutely predict churn and retention. Any good metric is very predictive of churn. In the book I state that if it is not predictive of churn then that is not the metric you should be looking at!  



### Alex: Huge thanks for taking the time, Carl. I am excited to see more business problem-oriented books like “Fighting Churn with Data” coming out of Manning, and I’d encourage our readers to grab a copy. Find out more at Carl’s website, [https://fightchurnwithdata.com/](https://fightchurnwithdata.com/)  



![Carl Gold](/assets/img/blog/2020/03/carlgold.png)  
_Carl Gold is the Chief Data Scientist at Zuora and the author of "Fighting Churn with Data"_, a book that directly speaks to how behavioral data can be turned into meaningful customer metrics in support of improving retention. Carl writes about using data science techniques for reducing churn in both his new book (hot off the presses in June) and at his website, [https://fightchurnwithdata.com/](https://fightchurnwithdata.com/)  