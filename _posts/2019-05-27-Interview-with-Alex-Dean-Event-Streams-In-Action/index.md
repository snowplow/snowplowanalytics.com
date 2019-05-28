---
layout: post
title: "Interview with the author: Alex Dean on writing Event Streams in Action"
tags: [analytics, data, big data, data science, business intelligence, machine learning, AI, data team]
author: Lyuba
image: /assets/img/blog/2019/05/Event-Streams-Action.png
category: Other
permalink: /blog/2019/05/28/interview-with-the-author-event-streams-in-action/
discourse: true
published: true
---
![Event Streams in Action][Event Streams]

Snowplow’s Co-Founder and CEO Alex Dean recently completed his book Event Streams in Action. The book takes an in-depth look at techniques for aggregating, storing, and processing event streams using the unified log processing pattern. In this interview, Alex shares his insights on how businesses can benefit from ‘event centric’ data processing, his motivation behind writing the book, and more.

*You can get your copy of [Event Streams in Action](https://www.manning.com/books/event-streams-in-action) and 40% off any Manning book by using the code **blsnowplow40.***

## Tell me about your new book!

[Event Streams in Action](https://www.manning.com/books/event-streams-in-action) is a new book I’ve co-authored with Valentin Crettaz, and published by Manning Publications. We’ve just finished writing it, and it’s now going into print after a very long development time - I started sketching out the idea for the book at the end of 2013!

The book is all about events: how to define events, how to send streams of events into unified log technologies like Apache Kafka and Amazon Kinesis, and how to write applications that process those event streams.

There are plenty of books out there now about Kafka and AWS data services - but to me most of those books seem anchored to regular software engineering, for example using Kafka to build asynchronous microservices. By contrast, Event Streams in Action focuses more on data-driven use cases, data engineering and even performing data analytics on event streams.

The target audience has stayed constant throughout the book’s long gestation: software engineers and data professionals who want to understand these event-oriented approaches and prefer to “learn through doing”: the book is filled with practical tutorials which step through some of the core aspects of data engineering, as well as giving a taste of data analytics.

## What made you decide to write Event Streams in Action?

The idea for the book started gestating way back in late 2013, emerging from some wide-ranging discussions with Frank Pohlmann, commissioning editor at Manning. The Snowplow open source project was then still quite young - less than two years old.

Snowplow had been designed from the ground-up around events, but back at that point our technology was still batch-based - it felt quite “ETL-ish”. By December 2013, it was becoming clear that the future of technologies like Snowplow would be real-time event streams. Jay Kreps, creator of Apache Kafka and now CEO of Confluent, had just published his monograph [The Log](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying), which really set out the blueprint for redesigning your organisation around a centralised stream (or streams) of events. Meanwhile, we had access to the private beta of Amazon Kinesis, and had a superstar intern, Brandon Amos, [prototyping a Snowplow port running on Kinesis](https://snowplowanalytics.com/blog/2013/12/20/introducing-our-snowplow-winterns/).

In this environment, writing a book about this emerging event stream-based future seemed like a good idea. I hoped that writing the book would help me to learn about the unified log pattern pioneered at LinkedIn, and that I could communicate this understanding to a wide audience, as well as inform our thinking at Snowplow Analytics.

## What is an event and what are continuous event streams?

That’s a fairly easy one - an event is a factual record of a single action that occurred at a point in time. So, Player 1 killed Player 2 at 11:12 is an event. Shopper 123 added PS4 Pro to their basket at 18:23 is another event. We can build up individual events into a detailed understanding of behavior - for example a videogamer’s experience in a game, or a shopper’s interaction with your online store.

Continuous event streams are endless flows of all these individual granular events. As the book explains, these event streams now typically live inside a technology like Apache Kafka or Amazon Kinesis. You can think of these services as a very peculiar type of database - a database where each table (called a stream) tells a never-ending story made up of millions or billions of individual events (called records).

The book works closely with both Kafka and Kinesis, as well as introducing plenty of complementary technologies and patterns for working with event streams. I hope that the book demystifies these technologies - by the end, Kafka or Kinesis should seem as familiar and intuitive as working with a MySQL or SQL Server database.

## What are some reasons why businesses should make their data processing architecture more ‘event centric’?

That’s a great question. By way of context: the book states that data-driven businesses should be re-structured around a process which: a) accretes events from disparate source systems b) stores them in what we call a “unified log” and c) enables data processing applications to operate on these event streams.

These are not novel ideas - readers have spotted the echoes of the earlier enterprise service bus and notions of [event sourcing](https://www.martinfowler.com/eaaDev/EventSourcing.html). I think what is new is the idea of applying these ideas much more broadly within an organisation, particularly in support of decision-making: using events as a lingua franca across the company, and coming up with a unified architecture to collect, process and disseminate these events.

Events are a really powerful “unit of record”. The fact that they are detailed, unbiased observations, that you can keep coming back to, makes them incredibly useful for decision-making. It’s like that Mushashi quote: “Observation and perception are two separate things; the observing eye is stronger, the perceiving eye is weaker” [editor: swordsman and author Miyamoto Musashi wrote on [observation versus perception](https://alyjuma.com/miyamoto-observing-eye/)].

The real-time potential of event streams for decision-making is really important too. John Boyd’s OODA loop (Observe-Orient-Decide-Act) emphasizes “speed through the loop” as a key part of decision-making. Systems thinkers like Donella Meadows stress how information delays can make complex systems much harder to manage - or even unmanageable. So the potential for using event data in near-real-time to drive sophisticated decision-making is really appealing.

## What kind of businesses/industries would benefit most from this approach? What are some indicators that it’s the right ‘move’ for your company?

Honestly, I think the patterns in the book are very widely applicable now. When I started writing Event Streams in Action back in 2014, I was writing for technologists at early-adopting businesses, typically high-growth startups and scale-ups, who wanted to follow the lead of data-sophisticated Silicon Valley companies like Amazon and LinkedIn.

It’s a statement of the obvious to say that since then, the patterns and technologies in the book, such as the unified log, data schemas, Kafka and Redshift have become much more mainstream and almost all companies are somewhere on a kind of data maturity scale. I think the interesting question is, why have these approaches broken into the technology mainstream?

My personal view is that it relates to the changing business landscape. Every industry now has its “Amazon” or “Uber” or “Airbnb”: a determined tech or product-led challenger that is using data to drive insights and outcompete incumbents. In that world, at least a part of your business (and maybe all of it) needs to become much more data-driven. Placed in this context, the approaches set out in Event Streams in Action and embodied in the products we have built at Snowplow Analytics are a great way to step up to this escalating data competition.

## How should a data team decide between Apache Kafka vs. Amazon Kinesis? What are the key differences to keep in mind?

Since I started the book back in 2014, we’ve seen plenty of progress in the space of unified log technologies. Apache Kafka and Amazon Kinesis have gone from strength to strength, we have seen the emergence of Confluent as a major commercial force backing Kafka, and Azure and Google Cloud Platform have released their own equivalent event stream services.

But really my point of using both Kafka and Kinesis in the book was to show that these technologies are broadly interchangeable. I am not saying they are fully commoditised - they continue to evolve, and each has its own strengths and weaknesses - but the really interesting work is happening at the technology layers above.

If we accept that we are going to adopt a technology like Kafka or Kinesis or Azure Event Hubs or Google Cloud Pub/Sub, we can move on to figuring out how we are going to structure our events, design complex pipelines of event streams, and even re-organise our companies to make best use of these new approaches. And that’s the really exciting part.

## The themes of data quality and embracing the “unhappy path” come through strongly in the book. What lies behind those themes?

Dealing with failure is hard! But seriously, data quality and data integrity have always been important themes to me and have run through everything we’ve done at Snowplow Analytics.

One of the original frustrations with black-box analytics packages like Google Analytics that led us to create Snowplow related to accountability: how can you stand behind the numbers in a Google Analytics report when some unknown portion of the data isn’t there, because the events failed processing and were silently discarded?

And as we started to encounter more homebrew or DIY event data pipelines running inside of individual companies, we started seeing the same problem: dealing with the failure path, bad data, schema violations were being filed in the “too hard” section, or being left to data consumers like business analytics or data scientists to confront.

Pulling all this together, I felt like it was important for Event Streams in Action to focus in on data quality and how to deal with events that have to leave the “happy path”. And as I was writing about it, I found this awesome blog post on [Railway Oriented Programming in F#](https://fsharpforfunandprofit.com/rop/), which really endorsed a lot of our design decisions in Snowplow, and gave me a language I could use in the book to talk about this difficult - but important - topic.

## How has Event Streams in Action influenced your work at Snowplow, and vice versa?

Another great question. I would say that the initial work I did on the book in 2014-2015 was really helpful for me in deeply understanding these event-based architectures, not least by getting to experiment with Apache Kafka and Amazon Kinesis without constraints. I was able to feed that understanding back quite directly into the port of our Snowplow technology from batch to real-time processing.

The next big crossover was really around the impact on a business from these new stream-based approaches and the unified log idea. We were starting to see that Snowplow technology was having a deep and wide-ranging impact on lots of our open-source users and customers. Especially with real-time, use cases breaking out of the more traditional “business intelligence”-style applications and becoming more strategic and operational. Based on that, I restructured the book so the first and third sections followed a fictitious company adopting the unified log [editor: Nile, an online retailer, for Part One and OOPS, a parcel delivery company, for Part Three]. I think that that narrative flow is the aspect of the book I am most proud of; I wish I had time to restructure part two around another fictitious company!

I think if I were to do another edition of Event Streams in Action, or another book altogether, the aspect from today’s Snowplow Analytics that I would want to bring back to the writing would be the emerging questions around data-driven organisational design. We have all the technologies, patterns and products now - but how do we [ensure that a given data team is successful?](https://snowplowanalytics.com/blog/2019/04/24/data-science-festival-what-makes-an-effective-data-team/)

## Writing a full-length book can’t have been easy. Do you have anyone you’d like to call out?
Yes indeed - I found starting to write a book easy, but finishing a book fiendishly difficult. I’d like to thank my wife Charis for her support throughout the whole long process. And many thanks to Yali and the whole team at Snowplow Analytics for giving me the "air cover" to work on Event Streams in Action even while we were trying to push forward the Snowplow open-source project and business.

The book wouldn’t be where it is today without its dedicated readership - data professionals and data-curious technologists who bought early copies on the Manning Early Access Program. Thanks for your support, your feedback and of course your patience over the years!

On the Manning Publications side, I am grateful to Frank Pohlmann, Cynthia Kane, Jennifer Stout and Rebecca Rinehart for their patience and support through the difficult and lengthy gestation. Huge thanks to my co-author, Valentin Crettaz, for his contributions and his laser-focus on getting this book completed.

And finally, I'd like to thank Jay Kreps for his pioneering work on Apache Kafka and the unified log pattern more broadly, which started me on the journey of writing this book, as well as informing lots of work at Snowplow.

## If there is one central message you want a reader to take away from the book, what would it be?

There are really two key messages to Event Streams in Action. The first is an explicit message: event stream-based approaches can radically transform your organisation if you are willing to explore and embrace them. I believe that the idea of event streams as a central digital nervous system for your business isn’t just marketing hype - certainly we are at an early stage on this journey but it will come to dominate thinking around data capability and even organisational design in the future.

The second message is an implicit or subliminal one: I wanted to make it clear to software engineers and data professionals that data engineering is not some closed guild or mysterious cult. It’s really just a philosophy applied to general software engineering - once you “get” the philosophy and master the associated tools, technologies and patterns, you can start to be productive as a data engineer. I hope that Event Streams in Action helps inspire data-curious technologists and maybe encourages them into the data engineering profession and related data fields.


[Event Streams]:/assets/img/blog/2019/05/Event-Streams-Action.png
