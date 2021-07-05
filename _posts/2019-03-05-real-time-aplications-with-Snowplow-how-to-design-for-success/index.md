## Real-Time Applications with Snowplow - How to design for success

In a previous blog [!!LINK TO OTHER BLOG!!], I outlined how Snowplow offers up-front validation for data quality, modular and customisable tracking setup, enrichements and control over your data collection - which all converge to take a lot of the work out of building and maintaining real-time applications. I also discussed how in my experience of helping customers design and build these applications, nailing down a strong use case and path to value are keys to success, and outlined a simple way to go about that part of the process. In this post, I'd like to share more lessons learned from working with a range of customers on real-time applications - this time focusing on the design stage.

As I mentioned in the last post, one of the common pitfalls customers hit in attempting this on their own is to overcomplicate the design, fail to focus on the most direct path to value, or fail to use features of the pipeline to full effect to simplify the design. It's not possible to fully outline all of these things - it takes experience and knowledge of Snowplow data to marry the use case with the simplest design - but we can discuss some of the high level topics involved in getting application design right.

### Basic considerations in designing applications

There's a huge range of possibilities in what applications can do, and there are many different ways to instrument each, with lots of options as to what technology should be used. Design needs to take into account volume of data, instrumentation of logic, and how the components should interact with each other.

#### Real-time structures

The major difference between using data for real-time applications and using it for analysis is that in the real-time world, we generally handle data on a per-event basis on input. So some things are relatively easy to do using SQL, for example, aren't practical in this world. For example, iterating over a user's history in order to stitch identifiers together is a task that requires a lookback which isn't practical to run for every input event we get. However the problem of stitching identity can be solved by thinking in terms of structures which lend themselves to real-time use cases. Some of these common structures we need to think about are what I'll call filters, states, actions and historical information - a brief explanation of each, and some options for technologies used to instrument them can be found below, but keep in mind there's a range of options for how to instrument any combination of them.

**Filters**

This one is pretty straightforward - at input, we need to establish which events are relevant, and only process those, so we look for the relevant values in the data, filter for only the ones we're interested in, and deal with only those from this point on. At other places in our application, we'll want to filter for only cases which meet the conditions for the action we want to take.

Associated tech examples: Anything that executes code or querys on data. (Eg. An AWS Lambda function, a Google Cloud Function or a Spark job).

**States**

States essentially replace our ability to query across lots of data. Where possible, instead of looking back over a history of data via a query, we redefine that concept into specific values which should appear close to each other (eg. within a session). So instead of running a query to stitch across three identifiers across a batch of events, we operate on the first match of any two of those identifiers. Here, we're storing matches of values in short-term storage, and updating them when we have a change. Managing states is what allows us to operate identity stitching, or execute any cross-event logic - but it needs to be restricted to storing as little data at once as possible, and storing it on one row.

Associated tech examples: Any database mechanism, commonly NoSQl or Cache (eg. DynamoDB, Cloud Datastore or Redis).

**Actions**

I'm using the term 'actions' here to encapsulate both updating storage mechanisms, or carrying out actioning. This can consist of a database update, an API request to some third party mechanism which will execute an action (like an email tool), or any means of serving the output action for the application. This mechanism will live in the code for

Associated tech examples: API libraries plus custom code (Eg. AWS Lambda or Google Cloud Function + an email tool API library)

**Historical Information**

I'm using the term 'Historical Information' to refer to a scenario where we need some computation over historical data which cannot be instrumented using States. We might need to take some propensity score into account for a user, or our decisioning might depend on their account history, for example. Care needs to be taken to instrument this in a way that is both efficient and effective - typically the solution to this is some means of precomputing the data and make it available to the application for fast and frequent reading. This will often mean that the latest information isn't always accounted for, but that's typically not a major issue where historical information is involved.

Associated tech examples: In-DB SQL model plus batch-export job to state storage. (eg. BigQuery or Snowflake model + export to DynamoDB or Cloud Datastore).


Note that in dealing with these concepts I deliberately disassociate the technology from the concept - it is always a good idea to begin with conceptual design and move to technical instrumentation, rather than tying the design to technology. The technology we use to instrument the logic is a secondary concern to the logic we need to instrument.


#### Designing for success

While the above concepts are useful in navigating the world of real-time applications, there's a far more important consideration to designing and building applications like this - taking an approach which offers a testable framework and an iterative feedback loop. The idea behind this is similar to doing good analytics or data science - start as small as possible, test the assumptions, then iterate and build on top of a proven hypothesis. Ideally we'd start with a simple proof of concept which is aimed at quickly delivering the core functionality we need. This won't often be the most efficient or cost-effective instrumentation, but it offers a framework on which to base our production build which is optimised for these things.

There are a number of reasons this approach is preferable. Firstly it offers us an opportunity to test our assumptions about the path to value before we invest a lot of time in building a full-scale application. Secondly, no matter how well you design the logic and application structure, there are often unforeseen complications which need to be taken into account - if we start by building small, factoring those into our design isn't a problem, whereas discovering them mid way through a production build can require an overhaul of the design. Finally, this approach allows us to deliver value quickly, and to figure out the path of least resistance to delivering maximum value - for example often we discover that a complicated aspect of our application doesn't need to be built, because the simpler version already overperforms in delivering value.

To this end, if you've followed the process outlined in the previous blog on this topic [ !!! LINK TO OTHER BLOG !!!], you'll have arrived at a set of statements which encapsulate the simplest form of how the application is to work, and what the direct path to value is. The example we used in that blog is a retailer looking to encourage purchases by leveraging remove from cart data:

- Purchases are the outcome I'm driving towards.
- Users who demonstrate appetite to purchase, but have removed items from cart are likely to purchase if they have a discount.
- This application will target users who demonstrate appetite to spend, but remove items from cart, and incentivise purchasing by offering discounts on those items.
- This will lead to more purchases because those users will return to spend on the discounted items.

To build a proof of concept for an example like this, we're aiming to boil this down to the simplest implementation we can. There's one quite vague term involved - 'appetite to purchase'. For analytics, or for a full-scale application we might want some clever means of calculating this - for example, looking at a user's history of page views on product pages, engaged time, wishlisting, purchase history over time or other metrics which indicate purchasing propensity. However these all involve a Historical Information component, which adds to complexity and build time. Since our POC is aimed at proving our assumptions with minimal implementation, we can choose a much simpler means to this end - if a user has made a purchase in the same session as they've removed from cart, they have an appetite to purchase. The full-scale design can be built to add a more nuanced measure of this, once we're confident that our application works as intended on a basic level.

Our POC design, then would consist of a very simple logic and structure. The logic is:

- If a customer removes items from cart and purchases in the same session, trigger a discount offer on the removed items to that customer.

Depending on the use case, this discount offer could be served on-page, through the user's account (eg if there's a 'rewards' or messaging mechanism when signed in), or as an email. In the latter case the hope might be that they receive the offer as they check the confirmation email, and are incentivised to spend again straight away.

The design for this application might then look like this:

![poc-design]

The technology decisions in this POC design have all been made with simplicity of delivery in mind - The first serverless function filters for the values we're interested in and makes an API call action to update states in a NoSQL database. This is then consumed by another serverless function which filters for having removed from cart and purchased in the same session, then makes API call actions to generate discount codes and serve them back to the customer.

With a simple POC design like this, build time can be as little as a week of work - which puts us in a position to validate our assumptions, and also gives us a much stronger foundation on which to design our full-scale application with confidence. POC applications also serve the valuable purpose of demonstrating value to the business - which can be really helpful in attaining sponsorship for further innovation.

### Building to a full-scale design

Once we've designed and built a trimmed down implementation of our application, we're in a position to test our assumptions and make sure everything works as expected. We also have some solid data on how our application performs - we can extrapolate from the POC applications latency, numbers of requests made, and storage required, and use that information to make more informed decisions as to how we should instrument the full-scale version.

At this point, it becomes difficult to deal in specifics - there are a vast range of technology options or designs we could choose to utilise, and the decisions as to which to use should be strongly informed by the real-life data we have at this point on the POC. I can, however, briefly cover some of the common considerations at this point of the process.

#### Accounting for a more complex logic

Often a POC will demonstrate that we can be very effective at production scale with a simple logic. However we may still need to build in a more complex logic, or at least leave scope to do so in the future. Our full-scale design needs to consider these factors rather than simply choosing what's easiest to implement.

Most of the time making good decisions here requires a strong understanding of Snowplow data and how to handle complicated logic in a real-time architecture. To give an example on this - our above application design assumes that we already have an easy way to identify users - for example requiring sign-in for purchases. Even if we don't have this, at POC stage there's usually a way to identify enough users to prove our concept without an identity stitching process. However many use cases will need need this for production, so we need to account for which of the different Snowplow identifiers we need to deal with, and what the best way of structuring our tracking and stitching mechanisms to match user_ids (ie self-identification) with other ids (eg. cookie ids).

There are lots of different examples of this type of problem - and normally the simplest solution is founded in ensuring our Snowplow setup is structured to take the work out of the process, and ensuring that our application components are built to carry out logic efficiently.

#### Optimising for scale, efficiency and cost

There are normally several different ways to optimise the application. Sometimes it involves replacing one technology for a cheaper parallel alternative (for example replacing one NoSQL database for a cheaper but harder to use one), sometimes it's replacing technology with a non-parallel alternative (eg. using in-memory storage within a hosted environment rather than serverless code + storage), and sometimes it's concerned with finding more elegant ways to execute our logic and refactoring code (eg. changing our tracking setup to allow us to remove components/reduce API calls or storage, or moving conditional logic to another place which allows us to reduce the same things).

Normally arriving at the best options here requires a broad knowledge of the technologies concerned, and a good feedback mechanism involving people with experience in both Snowplow data and running cloud infrastructure.

#### Modular design

Finally, often our POC will be a simple straight-line logic, intended to serve a single purpose. However we might intend to pull several different levers, or build on top of our initial use case when we move to a production version. In that case we should design our production application to allow for components to change without having an impact on the rest of the code, and to allow for expanding on our initial use case without refactoring whole components.

The only strong requirement on this front is good software engineering practice.

### Summary

In the last blog we covered methods of arriving at strong use cases for real-time applications. Here we've discussed the process of designing and building for success, and briefly dug into some of the concepts we're dealing with. In both cases a strong knowledge of Snowplow data and pipeline features will remove a lot of the complexity from the process. We're always happy to hear about how people are using Snowplow data - if you're thinking of building a real-time application, in the middle of the process, or have built one (whether successfully or not), we'd love to hear from you and share experiences, so please get in touch!

[poc-design]: /assets/img/blog/2019/03/poc-design.png
