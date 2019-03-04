## Real-time applications with Snowplow - how to get started

Snowplow is an incredibly powerful data collection tool, which allows flexible, modular and custom tracking, carries out data quality work up front, enriches data and delivers highly structured, good quality and highly useful data. It's well known how useful this is for analytics - data is usable as soon as it reaches the warehouse, and fine-grain analysis is possible straight away. What's often overlooked, however, is how well Snowplow lends itself to building real-time applications. The focus of my team at Snowplow is in deriving value from Snowplow data, including designing and building these applications -  which involves scoping out the use case, finding where the best path to value is, designing applications and building them.

Through doing this, I've noticed that many Snowplow customers/users overlook some important things around two topics - how the pipeline can take work out of building applications, and how to go about arriving at a use case and design to deliver value with a real-time application. I'll try to shed some light on these topics below.

### Why Snowplow works so well for real-time

Many of the aspects of the Snowplow Pipeline that take the work out of building real-time use cases are the same well-known aspects that make for powerful, granular and fast analytics.

**Data Quality**
The pipeline's validation step ensures that only valid and good quality data is processed - which removes the need for a large scale data quality exercise later on when building a data model or embarking on analysis. This same feature ensures that real-time applications can be built without a worry that data quality will cause something to break. Because all data is validated against a schema, we are guaranteed that all data coming in to our application will be of the format specified in the schema. So no work needs to be done to account for anomalous data coming in, and we are guaranteed a consistent format.

**Data Structures**
Because Snowplow delivers highly structured data, it's easy to work with this data using code, and we can be guaranteed a consistent structure to the data. This means we spend very little time figuring out how to extract the values we need, and debugging these for anomalous structures. The one step we do need to take to make the data structure easy to work with in code is to transform the pipeline's output of an Enriched TSV format event into a structured object - this work is carried out by the [Snowplow Analytics SDKs](https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK) - and using these will also ensure that our application is compatible with any future changes to data structures.

**Modular, custom tracking**
Snowplow tracking design is modular (ie you can track events and attach entities as required), and custom (ie you can define any event as per your requirements), which makes for great analytics because you can define what you collect according to your own specific business requirements, rather than manipulating another structure to suit your needs. Equally, you can track events specifically as required for the input of your application. This allows you to remove a layer of complexity from the application design - rather than having to combine or interpret events in your code and extrapolate meaning, you can design your tracking setup to represent exactly what the simplest possible input to your application would require. Occasionally, this is slightly different from what you might use for analytics - but this is an easy barrier to circumvent by either using additional custom events or attaching additional custom contexts to your events.

**Enrichements**
Snowplow comes with a set of standard configurable enrichments, and a set of fully custom enrichments (a list of enrichments can be found [here](https://github.com/snowplow/snowplow/wiki/Configurable-enrichments)). Often these can be leveraged to again take a lot of the work out of the application. If sources of traffic are important to the application, the [Campaign Attribution enrichment](https://github.com/snowplow/snowplow/wiki/Campaign-attribution-enrichment) does that work for you. If values need reformatting or extraction from the data (for example where our tracking is restricted in doing so), or some low level computation needs to be done, you can write a custom [Javascript enrichment](https://github.com/snowplow/snowplow/wiki/JavaScript-script-enrichment) to do so. If we need to join data from another source, the [SQL Query](https://github.com/snowplow/snowplow/wiki/SQL-Query-enrichment) or [API Request](https://github.com/snowplow/snowplow/wiki/API-Request-enrichment) enrichments will be of use.

**Transparency and control over your data**
Finally, rather than restricting you to a predefined logic on their data, or identifying users, Snowplow exposes all of the available data for you to define your business logic and use as you see fit. This means we can build our application to suit the specific requirements we need. For example, if the timing or order of events occurence is important we have the `derived_tstamp`, `dvce_created_tstamp`, `dvce_sent_tstamp`, `collector_tstamp` and `etl_tstamp` - as well as any timestamps sent with custom events or contexts - we can choose any combination of these to suit the logic we need. Equally we have several different means of identifying users, which can be used across different devices and domains, so we can build the specific identity logic we need for the application to function well.

### Is it really that simple?

With all of the above aspects of the pipeline, you might be asking "what's the catch, is this really that easy?" - certainly given the above you'd be forgiven for assuming that it is. The answer is actually both yes and no - compared to what you would have to do without these features, the process of actually building the application is really straightforward. However it's not a matter of just sitting down and throwing it together - the hard part of the process is defining the use case, ensuring there's a strong and achievable path to value, and designing the simplest possible design to get the most value out of the use case. All of these things are best achieved with a combination experience with real-time applications, and a thorough understanding of Snowplow data and features of the pipeline. Don't let this put you off - below I'll cover the first step of this process, but if you're a Snowplow user and you're unsure about any of these things, reach out to us!


### Identifying and evaluating a great real-time use case

Real-time applications are all about decisioning and actioning. Typically, the best use cases are those that are founded in analysis of user behaviour, are based on a simple concept, and have a clear and direct path to value. The most common pitfall people fall into is to confuse sophistication with value - the sophisticated and complex ideas might be cutting edge, but if they haven't begun with a clear and direct path to value, they're often doomed to fail.

An example to illustrate this point: Let's say I want to build a content recommendation application, and I have come up with a cutting edge way to calculate with 80-90% accuracy what video a user will want to watch based on their viewing history on-site. I build my app to serve a 1 video recommendation to all users. This sounds great, but what I might have failed to realise is that the recommendation is only valuable if it keeps users engaged who otherwise wouldn't have been - and is most accurate for users with long histories and already high engagement. I might have delivered a simpler engine which makes three 50-60% accurate which is based on a generalised user profile. This less sophisticated application is more likely to capture less engaged users, and is more likely to deliver value.

Usually this kind of mistake happens when the starting point for the idea is already a solution - it's great to have enthusiasm for a solution and a desire to solve complicated problems, but the solution should always be driven by business value. Usually the best starting points for successful applications are founded in user experience - which can either be driven by some insights gained from analytics, or insights gained from understanding user experience or user feedback. It helps to begin by thinking about the outcomes you're looking for, then thinking about what kind of behaviours influence those outcomes. For example, if I'm a retailer, the outcome I want is obviously more purchases, or a higher purchase value. There are a lot of different behaviours I can think about that might drive these outcomes - time spent on product pages, wishlisting, add to carts, previous purchases, frequency of visits. These can each be a lever to pull or an input to our application, or they can combine to form the inputs and levers of an application which delivers value.

Usually, drawing up a list of outcomes you'd like to drive and drivers for these outcomes will lead to some inspiration on what kind of application it makes sense to build. At this stage, it helps to boil down the ideas into a set of statements which simply lay out the path to value and how that will be achieved, by stating:

- X is the outcome I'm driving towards
- Users who A are more likely to X if they B
- This application will target users who A and incentivise B by...
- This will lead to X because...

While this seems simplistic, it's a really valuable exercise, because it exposes our underlying assumptions and ensures that we have a direct path to value. If it's difficult to describe the path to value in this way, we should reconsider our approach - we may still decide that it's still worth pursuing, but we can do so in confidence that we've unearthed problems and given them proper considerations. To use our retail example:

- Purchases are the outcome I'm driving towards.
- Users who demonstrate appetite to purchase, but have removed items from cart are likely to purchase if they have a discount.
- This application will target users who demonstrate appetite to spend, but remove items from cart, and incentivise purchasing by offering discounts on those items.
- This will lead to more purchases because those users will return to spend on the discounted items.

Intuitively, it seems really obvious that users who receive a discount offer on removed items are more likely to make purchases, but exposing the reasoning in this way makes obvious what the assumptions we need to check are. We can validate this idea by:

- looking for evidence that these users wouldn't have gone on to buy those items at full price later on
- looking for evidence that a discount will lead to further purchases (eg. a/b test some discount offers, or find users who happen to have been targeted with discount offers shortly after removing from cart)
- looking for a way to define 'appetite to spend' better - does this mean they've previously purchased at some point? Does it mean they've purchased in the same session as the cart removal?

It's important to note that boiling things down to these simple core principles doesn't mean we can only deliver simple or basic applications, but the aim is to ensure there's a simple and direct path to value. Normally, the aim is to deliver on the simplest possible instrumentation which delivers value, then iterate on this to deliver more complicated aspects. If our application depends on complexity before it can deliver value, then the risk of failing to deliver that value is high - this process aims to expose that risk.

### What's next

Real-time actioning is a complicated business no matter how you look at it, and delivering valuable applications is a difficult task. However Snowplow makes building and maintaining applications themselves quite straightforward - essentially, the question of what's possible to build and maintain is removed from the equation - most use cases are possible and can be built and maintained in a straightforward way. The first step to producing applications which deliver real value is following the above steps to establish what the best thing to build is. Once that's done, the task is to ensure that Snowplow has been set up for success, and arrive at the simplest design possible to deliver the most value.

I hope to expand on the design process in a future post, but in the meantime, if you're a Snowplow user and you'd like to flesh out your ideas or want guidance on how to get there, reach out to us for a discussion - our experience in scoping, designing and building applications will likely prove valuable.
