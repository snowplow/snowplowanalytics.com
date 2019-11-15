---
layout: post
title: "Don't be a hammer"
title-short: Hammer
tags: [data analytics, data management]
author: Anthony
category: Other
permalink: /blog/2017/12/01/dont-be-a-hammer/
description: "Reframing your thinking to be a data-driven marketing professional"
---

I had a professor back in college who started class with an exercise that forever altered my way of thinking. The class was on design thinking and how we could apply it to creative problem solving (and vice versa). The first day we met, the students trickled into the classroom and selected seats at round tables, each with a pile of blank name tags and a rainbow of colored markers. It was all very standard: arrive, sit down, put your name on a sticker, and wait for class to start. Like perfectly programmed robots, we arrived, settled in, and labeled ourselves. The professor arrived and introduced himself before diving in.

He asked each of us who considered ourselves to be creative to stand at the front of the room. Once there, he asked, “If you’re creative, why did you only write your names on your name tags?” While we didn’t have an answer for him, he had one for us. We (humans, not just students) are creatures of patterns, the professor explained, and the patterns that we recognize and understand are how we see the world. Because of this, our thoughts and actions are defined by these patterns. Regardless of how creative we were, we were operating on auto-pilot: walk into classroom, pick a seat, see name tag, write name. The process was so automatic, we didn't even realize we weren't thinking about what we were (or weren't) doing.

Several years later, as a member of the Snowplow Analytics team, I find myself in a similar situation where my thinking is being constrained by pre established patterns. I’ve come to the conclusion that in order to truly understand what we do here at Snowplow, and how event data modeling differs from traditional analytics, I need to take a step back and realize what I’m not thinking about.

<h2 id="analytics has changed">Analytics has changed</h2>

The digital marketing landscape has shifted, consistently, towards being data driven as a direct result of the advances in analytic technology. As marketing professionals, we now have access to exponentially more tools to track the performance of our campaigns, how much referral traffic we’re generating, conversion rates for landing pages, and more. But for all of these tools, our thinking has largely remained the same. What makes an email successful? High open and click-through rates. Kissmetrics, in a [blog post on email marketing][kiss], discusses open rate and click-through rate, the two golden metrics for email performance. The post identifies these as “process metrics” and goes on to say “they shouldn’t be goals in and of themselves.”

![digital-data][digital]

This is sound, strategic thinking, unless the primary goal of the email is to generate traffic to a specific page of your website. In that case, a high click through rate would signify that the email campaign was largely successful in delivering an increase in visitors to the page. But, if you’re hoping to use an email campaign to inform customers of a special sale with the objective of driving purchases, a high click through rate doesn’t tell you much, whereas percentage of email recipients who actually made a purchase is an accurate measure of success. The challenge, and the trap that many marketing professionals fall into (myself included), is that we have several go-to metrics in our analytics toolkit. But, as the saying goes, when all you have is a hammer, every problem looks like a nail.

<h2 id="be a toolbox not a tool">Be a toolbox, not a tool</h2>

I recently wrote a blog post that will never be published. The focus was on using better data to make better marketing decisions, but in true hammer-like fashion, I limited all of my examples to predefined patterns I had developed throughout my career. Snowplow cofounder Yali Sassoon, in reviewing this piece with me, described the core mental concept behind why Snowplow was developed and our data philosophy. “You need to make your analytics fit your questions,” he explained, “not have your questions fit your analytics.” This was the aha! moment that brought me back to the name tags in that classroom all those years ago. I had fallen into a pattern, along with many of my peers, of looking at the analytics a platform offered me and then asking, “what can I learn from this?” What Yali was telling me, and what Snowplow offers, is the opportunity to say, “what do I want to learn?” and to tailor your data analytics around answering that question.

While the talented team at Kissmetrics insightfully identified open and click through rates as ‘process metrics’ that shouldn’t be standalone goals, there is still a limitation to this line of thinking. It’s impossible to say what should or should not be a marketing campaign goal in a vacuum, but that’s what most out of the box analytics solutions are asking their users to do. Integrating an analytics platform may present you with dozens or even hundreds of different metrics measured, all in the hopes that some combination of the information presented will be meaningful for your business. Then, it becomes your job as the user, to retroactively gerrymander the data you have at your disposal to answer business questions.

The process is a bit like taking a biology exam where, instead of reading the questions to know what information you’re going to need, you write down everything you know about biology hoping that you cover everything that will be asked of you. When you have control over your data collection and have complete access to your raw data, however, it’s closer to taking the same biology exam with a stack of textbooks at the ready, but first you must create the questions yourself: you must first identify and understand what questions you need to answer to demonstrate specific comprehension or insight, and then you have every possible resource available to answer them correctly and thoroughly. Following this analogy, the role of the digital analyst, then, becomes that of test maker who must not only create the questions, but provide all of the answers, a multi-faceted approach many analysts are not accustomed to taking.

![reframing-thinking][thinking]

So here I am, reframing my thinking and doing my best to leave my hammer in its place until I need it. Data collection, storage, and analytics platforms are becoming smarter and more sophisticated, but the skill that we as professionals need to develop to continue to get the most value from these tools is to be asking the right questions because data, after all, is a set of answers.

I'd love to hear about your journey with digital analytics, whether you use Snowplow or a different platform. Reach out to us on [social media][twitter] or head to our [Discourse forum][discourse] to continue the conversation.





[kiss]: https://blog.kissmetrics.com/win-at-email-marketing/ "Using Marketing Analytics to Win at Email Marketing"

[twitter]: https://twitter.com/snowplowdata "Snowplow Analytics on Twitter"

[discourse]: http://discourse.snowplowanalytics.com/


[hammer]: /assets/img/blog/2017/12/hammer.jpg

[digital]: /assets/img/blog/2017/12/digital_analytics.jpg

[thinking]: /assets/img/blog/2017/12/monkey.jpg



[chart]: /assets/img/blog/2017/10/data_chart.jpg
