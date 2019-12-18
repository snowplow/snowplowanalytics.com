---
layout: post
title: "Creative experiments and A/B tests produce the best results"
title-short: Creative experiments are better
tags: [analytics, product analytics, digital products]
author: Anthony
category: Data Insights
permalink: /blog/2018/02/23/creative-experiments-and-ab-tests-produce-the-best-results/
---

*Part five of our series on product analytics. Read: [Part 1][product1], [Part 2][product2], [Part 3][product3], [Part 4][product4], [Part 6][product6], [Part 7][product7], [Part 8][product8]*

---

As [our last post on product analytics][product4] demonstrated, there’s no shortage of tools and platforms for product analysts to help them more effectively do their job. With so many solutions available, it’s no surprise that many product teams invest significant amounts of time, effort, and money into analytics. What is surprising, though, is how many teams end up disappointed in their analytics because the insights they were expecting (or hoping for) never materialized. That’s because the typical event-stream data at the heart of product analytics only provides a description of what has happened.

Luke Muscat, previously of Half Brick Studios, said [in his 2016 talk at the Game Developers Conference][gdc], “analytics are great at comparing things and exposing some problems,” but, as he rightly pointed out, “analytics are terrible at telling you the real problem and giving you solutions.” Data by itself won’t point you to specific problems or solutions; at best, data will hint at specific issues. As a result, successful use of data in the product development process depends on the product team being really good at using data to spot issues, asking why and developing hypotheses, and investing the time a resources in testing those hypotheses. This is hard: as we’ve discussed, successfully using product analytics requires [adeptness to explore the data and identify issues][product2], as well as a [process and culture][product3] that not only allows for the resources required to rigorously test hypotheses but also that adheres to the results of those tests moving forward. However, the most important piece of the successful product analytics process is the ability to creatively develop hypotheses.

![Bears vs Art][bva]

<h2 id="data">When data can't save you</h2>

Luke’s team at Half Brick, responsible for the smash hit mobile games Fruit Ninja and Jetpack Joy Ride, among others, began to worry when the soft launch of their latest game, Bears vs Art, failed to meet their one and seven day retention targets. They thought, “that’s okay, we have analytics- the data will save us!” According to Luke, they looked at the levels where people were quitting and made them easier and added features like daily spins and sign-in bonuses, all classical retention boosters. Even though Luke and his team felt that they were informed, that their data was giving them the right ideas for how to keep users coming back to Bears vs Art day after day, weeks passed without any improvements.

![overwhelmed by data][frustration]

“Analytics shows you a level where tons of people are quitting the game and never coming back, but it doesn’t show you the underlying problems,” Luke explained to the audience at GDC, and he’s absolutely right. While they could look at their player progression charts and see which level has the steepest drop off, their data could not tell them if the level was too difficult based on the control scheme or if some other factor was causing people to give up, like background scenery that obscured the player’s avatar, for example. It wasn’t until Luke and his team decided to challenge every assumption they made when designing the game, down to the deepest fundamental aspects, and systematically testing the variations, that they were able to hit the sweet spot on new features that made the game a success.

<h2 id="analytics leads to success">But analytics can help you find success</h2>

The story that played out during the development of Bears vs Art is all too common- product analytics, in a vacuum, can be widely disregarded as meaningless. Without a clear process for including data in your development process, one that clearly states what questions you hope to answer, how you’ll test those questions, and what metrics will indicate success or failure, all of the analytics in the world won’t help you, but will in fact actively mislead you. “It sounds pretty simple in theory, but it’s actually pretty complicated,” explained Emily Robinson. A data analyst at Etsy, Emily was [recently a guest on Dataframed][dataframed], Data Camp’s new podcast, where she went on to say, “you can’t just watch your conversion rate, then introduce a new feature, and then watch your conversion rate again.” A/B testing helped Luke to discover features his users loved that the team never considered from the beginning, but thanks to creatively testing, they could easily see what behaviors users preferred and how players engaged with their game.

A/B testing is one of the product analytic tools that is not just useful throughout a product’s lifecycle, but is integral to each step of the process. While something like retention analysis becomes more significant as a product matures, A/B testing is highly relevant early in a product’s life and continues to be a major component around improving a product moving forward. Andrea Burbank, [in a talk at the Crunch Data Conference in 2016][andrea], discussed the experimentation culture at Pinterest and how it developed to where it is now. What’s clear from Andrea’s talk is that experimentation done right doesn’t come easy, but it gets better as you practice and mature. New features, changes to core components, and alterations to the user experience all drive user acquisition and A/B testing is how companies determine which new features to roll out:

> We’ve invested six months in this [new website], there is absolutely no way we’re not going to roll it out- there’s no point in running an A/B test. What I said was, “hey, even if we’re going to roll it out, by testing it we’ll know what to expect when we do so." And in fact, what we did was detect a bunch of things that we thought weren’t important, that we removed as features, actually were tremendously important, so we avoided that failure.  
-Andrea Burbank


<h2 id="creative testing">A/B testing is inherently creative</h2>

What separates Luke, Emily, Andrea, and other designers and analysts who use A/B testing right from those who don’t is the creativity baked into the hypotheses they form and prove (or disprove) through testing. Creative questioning, along with the right experiments, turns event-stream data into something that can identify underlying problems and solutions. As Yali told me, “When we run an experiment, something magical happens. We suddenly create the conditions in which we can isolate the impact of something specific and see how varying it changes a particular metric.” For a product analyst, this is immensely powerful because now a data set that was previously only suggestive becomes something that can be used to draw strong conclusions about how to maximize what is going right and fix what is going wrong.

![selecting what to test][elements]

When Luke and his team started systematically testing Bears vs Art, a cornerstone of their mission was to challenge all assumptions. In the initial design of the game, levels were organized in a saga-style map where completing one level moved the player on to the next (think Candy Crush). But, alternatives were never even discussed during the design process. The willingness to accept that even these basic decisions about the design of the game could be wrong, and aggressively test the validity of those decisions, helped the Bears vs Art team move beyond classical retention tactics and create a game that was truly compelling for their players, organically drawing them back day after day. “Online experimenting gives us a way to confidently say your change made a difference,” explained Emily, and that level of confidence is what allowed the Bears vs Art team to move forward. We shouldn’t be surprised, then, that experiments are such a fundamental and powerful tool when drawing insights from data. After all, the advancing of science generation after generation comes from the breakthroughs born of experiments.



{% include shortcodes/ebook.html layout="blog" title="Get creative with your analytics" description="Take your product analytics to the next level with our ebook." btnText="Download now" link="https://go.snowplowanalytics.com/l/571483/2018-06-26/2z9m4gd?utm_source=snp-ebook&utm_medium=cta-button-blog&utm_content=product-analytics-series-5" %}



<h2 id="astrophysics">An aside about science</h2>

One of the things that makes astrophysics such a unique and difficult science to make breakthroughs in is that the scope for experimentation is extremely limited as most stellar objects can’t be squeezed into a lab. This leaves astrophysicists constantly looking for opportunities to observe very specific phenomena that would prove or disprove a given theory. Doing analytics on a product without experimentations is like doing astrophysics: you’re stuck passively watching and waiting, hoping to observe exactly the right event that will support your hypothesis or not.

While scientists studying the stars have become remarkably adept at collecting and analyzing large data sets as a means of testing hypotheses, product analysts have the luxury of ease of experimentation, allowing for a much more rapid cycle of hypothesis - proof - new hypothesis.

<h2 id="asking creative questions">Using A/B testing to ask creative questions is hard</h2>

If this were easy, everyone would do it. Asking the right, creative questions of your product analytics is difficult because it requires several elements to align, elements that are not always under the analyst’s control:
- Creativity: the “magic” Yali spoke of behind many experiments is the imagination and outside of the box thinking around what features are to be experimented on and why
- An openness to challenge all of your assumptions about what’s good, bad, and neutral like the Bears vs Art team
- A company culture that values experimentation and is comfortable both dedicating the relevant resources and accepting the outcomes for better or for worse
- Discipline in the experimentation process and statistical rigor

This means that A/B testing is much bigger than many people, especially many of us from a web analytics background, imagine. As a web and social data analyst, my A/B tests were previously limited to simple experiments around the color or placement of buttons or use of hashtags and were associated with simple metrics like button click through rates or social impressions. The Bears vs Art example shows, in a product analytics context, A/B testing is much more expansive and the results, therefore, can be much more dramatic.

<h2 id="results">Test results</h2>

Looking at a data set alone can’t tell you if a given behavior is happening or not, or the why behind that behavior, so an analyst can’t determine what effect something might have had. This is why many analysts or product teams find themselves spending large amounts of money on analytics platforms and, after months of collecting and examining data, feel like they haven’t learned anything. They might feel like they’re banging their heads against the wall trying to find some value in their data, and frustrated with themselves, their data, or the platform that they can’t, when in reality the root cause of the issue is a flaw in their experimentation process. As Andrea said, “No matter how good your product is, it doesn’t actually speak for itself.”

If you want to learn more about how to do A/B testing right as part of using analytics to drive competitive advantage, make sure you read the rest of our series on product analytics and [subscribe to our newsletter][subscribe] to be notified when the next piece is published. Or, if you’re eager to get started, why not [have a chat with us][contact] about how you can start using A/B testing in your product development process today.




[product1]: https://snowplowanalytics.com/blog/2018/01/19/product-analytics-part-one-data-and-digital-products/

[product2]: https://snowplowanalytics.com/blog/2018/01/26/intelligent-use-of-data-in-product-development-differentiates-successful-companies/

[product3]: https://snowplowanalytics.com/blog/2018/02/02/data-driven-product-development-is-more-about-process-culture-and-people-than-technology/

[product4]: https://snowplowanalytics.com/blog/2018/02/09/the-product-analyst-toolkit/

[product6]: https://snowplowanalytics.com/blog/2018/04/27/getting-the-most-out-of-product-analytics-with-intelligent-questions/

[product7]: https://snowplowanalytics.com/blog/2018/05/25/improving-ab-testing-with-event-data-modeling/

[product8]: https://snowplowanalytics.com/blog/2018/06/01/the-right-data-infrastructure-to-support-successful-squads/

[bva]: /assets/img/blog/2018/02/bva.jpg

[frustration]: /assets/img/blog/2018/02/frustration.jpg

[gdc]: https://www.youtube.com/watch?v=4w6LohQ0-wk&t=1761s

[dataframed]: https://www.datacamp.com/community/podcast/data-science-experiments-etsy

[andrea]: http://www.ustream.tv/recorded/76523152

[elements]: /assets/img/blog/2018/02/elements.jpg

[subscribe]: http://snowplowanalytics.us11.list-manage.com/subscribe?u=10bb4a6f31d5f19e0d0b54476&id=bb28c7d30d&utm_source=product%20analytics%20pt5&utm_medium=blog%20cta&utm_campaign=product%20analytics&utm_content=subscription

[contact]: https://snowplowanalytics.com/company/contact-us/
