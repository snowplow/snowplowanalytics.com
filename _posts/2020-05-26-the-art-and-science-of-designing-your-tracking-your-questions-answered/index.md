---
layout: post
title: "The art and science of designing your tracking - your questions answered"
description: "We spoke to Archit and Paul to get all your great questions answered"
author: Franciska
category: Data insights
permalink: /blog/2020/05/26/the-art-and-science-of-designing-your-tracking-your-questions-answered/
---

At the latest event in our [Doing Data Right series](https://snowplowanalytics.com/events/), Solutions Architecture Lead Archit Goyal and Software Engineer Paul Boocock spoke to us about _[The art and science of designing your tracking](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/)_. They looked at how controlling event definitions, and using a universal language to do so, can help prevent the creation of sprawling event dictionaries and confused Slack threads. They went into technical detail with examples of modular tracking strategies our customers use to give their teams control, and they elaborated on how this can help businesses understand how their users interact with content and products.

We have made the webinar [available online](https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/) and you can also [access the presentation](https://go.snowplowanalytics.com/snowplow-webinar-the-art-and-science-of-designing-your-tracking) Archit and Paul took us through. There were some great questions from the audience that Archit and Paul didn’t have the time to answer, so we’ve asked them to help us cover them here as a follow up.  


<br>
{% include shortcodes/ebook.html background_class="multi-cloud-landingpage" layout="blog" title="The art and science of <br> designing your tracking:" description=" " btnText="Watch recording" link="https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/" %}  

<br>

## Questions & Answers

What follows are the questions posed by the audience and answers from Archit, Paul and others from the Snowplow team.


#### What are your thoughts on how to effectively work with engineering teams to rapidly converge to the 'right' schema, given that the data team might not know which properties are available and the engineering team might not know which properties are meaningful?

One thing we recommend is assigning an owner to the process and giving them the remit to make the design decisions while taking input from all the relevant stakeholders. It usually doesn't work well if someone just sits and designs in isolation. We recommend the owner to be a consumer of the raw data or closely linked to one, and that person should ensure they involve all the relevant people and host some brainstorming sessions to understand the feasibility of what can and should be tracked. 

At Snowplow we start a lot of our tracking design workshops by asking our customers to come up with the 10 most important business questions they want to answer and that tends to get all the relevant business and technical stakeholders involved. 


#### A concern which we hear internally about schemas is that they are not fool-proof: e.g. you could still put the wrong date in a date field. How do you recommend that QA for tracking is done in a scalable and future proof way?

Putting the wrong date in the date field is often an implementation issue. At Snowplow we have built [Snowplow Micro](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-micro/), which is a small Snowplow pipeline that can be spun up as a part of an automated test suite. It allows you to inspect the data that is collected and you can build that into your unit tests to ensure your events include the expected information.

Snowplow has a validation step upfront in the pipeline that ensures only data that conforms to your event definitions will pass through the pipeline. Any data that fails validation will be stored separately and can be monitored and reprocessed. 

An important step in designing tracking is to configure the strictness of the schemas. You can go very strict, but more importance has to be given to QA processes - this will mean, however, that the data in the storage targets will be of very high quality. We recommend using more lenient schemas in products that evolve more frequently to make it easier to ensure new products features can be easily shipped with analytics tracking.


#### Do you see a need to distinguish major and minor changes in the schema version? Would it be sufficient to use a timestamp of the last change as a version number or is there a downside?

This could work, but we see a major downside around flexibility. If you just use the timestamp of the last change that effectively makes every change a major change in a Snowplow context, and you don't necessarily know the difference. At Snowplow we’re leveraging the concept of semantic versioning and differentiate between major, minor and patch changes and they have different implications for how we load the data into the warehouse. A major change effectively denotes an entirely new schema that's incompatible with a previous version, whereas minor and patch changes don’t. So if all you had was a timestamp you wouldn’t be able to know if the schema change requires a new schema or not and so you lose that flexibility. 


#### Have you seen techniques such as schema validation deployed across other tools or services such as GA? Have you seen techniques built to validate hits to other platforms to ensure data quality?

We have seen companies build client-side validation using JSON schemas (which would work with any analytics solution) so it is certainly possible. However, this increases the burden on client-side processes and does require some engineering effort to implement the tracking validation client-side.

Another option to leverage schemas with other tools, is to build validation of tracking into a continuous integration or continuous delivery part of your build process. That is to take your schemas and verify the tracking that is implemented in the site conforms to the schemas before the tracking is published to the production site. In fact, we often recommend users of Snowplow do this too as they already have the schemas but this technique could be applied to any tool in theory.


#### Do you believe that schemas/governance make the data readily consumable by analytics, data science, and product managers when stored in the warehouse? Or do you suggest a data processing layer after the data is stored in the warehouse to better make events consumable rather than raw events?

While the raw data is powerful for a business to own so that they can impose their own business opinion rather than making do with the business opinion imposed by a third-party vendor, it is difficult to derive insight directly from raw data without first imposing that core business opinion. We co-develop SQL data models with our customers to prepare the data for use by the rest of the business. Our next online event will be a [deep dive into data modeling](https://snowplowanalytics.com/webinars/data-modeling-mini-series/) and will cover this question in detail.

Schemas do create some immediate structure in the raw data and allow for some queries to be run against the contextual information to gain initial insights, but the real opportunity is to leverage this additional contextual information in your data modelling processes. The concepts of schemas don’t necessarily make working with the raw data easier but they do offer an opportunity to think differently about how we model that raw data. 


#### Any good resources / guides for what a good set of ‘tablestakes’ tracking broadly applicable across internet consumer products looks like? User, device etc..

We don’t know of any good external resources on this, but since this question continues to pop up, we’ll be sure to produce some more content around this. 

You might find our [web event model](https://github.com/snowplow/snowplow/wiki/canonical-event-model) relevant and although it’s specific to Snowplow we’ve also made public a [more complete list](https://docs.google.com/spreadsheets/d/1dkWs6khZPi5xnCr-YJ-VonoAwJ8F0LWhjYDxYCx8U5w/edit?usp=sharing) that includes mobile, webhooks and enrichments. 


#### How do you deal with schema evolution (i.e these few properties are not relevant any more or aren’t actually useful, or we need to track additional info)? How do you deal with these changes and how your users consume the events when things change?

At Snowplow we automatically mutate the tables in the data warehouse when a schema is evolved and we treat breaking changes differently to non-breaking changes as explained earlier. The mutations are also different depending on which warehouse our customers load to given the different architectures of the warehouses (Snowplow Insights customers can find more around exactly how the changes manifest in the data warehouse on [Snowplow Academy](https://snowplowacademy.bugle.app/learn/consuming-snowplow-data-snowplowacademy/chapters/14490)).


#### What is the best way to design an event dictionary and maintain it along with the JSON schema?

The great thing about using JSON schemas is that they have description properties at the schema and property level, which means they can self contain all the information that would normally be in an event dictionary. These description properties can be quite detailed, and we’ve included a simple example below:

{% highlight JSON %}
{
   "description": "Schema for a checkout flow event. Trigger on completion of any step described in the 'step_name' property.",
   "self": {
      "vendor": "com.acme.event",
      "name": "checkout_flow",
      "format": "jsonschema",
      "version": "1-0-0"
   },
   "type": "object",
   "properties": {
      "step_name": {
         "type": "string",
         "enum": ["add_cart","remove_cart",...,"checkout"],
         "description": "The step in the checkout process that was just completed."
      },
      "step_value": {
         "type": ["string", "null"],
         "maxLength": 1024,
         "description": "The value associated with the step eg 'step_name'='enter_email', 'step_value'='{{hashed email}}'."
      }
      "failure_reason": {
         "type": ["string", "null"],
         "maxLength": 3000,
         "description": "If the step failed, what was the reason."
      }
   },
   "required": ["step_name"],
   "additionalProperties": false
}
{% endhighlight %}


We would also suggest leveraging the [Iglu Schema Repository](https://docs.snowplowanalytics.com/docs/open-source-components-and-applications/iglu/) to build the event dictionary from the source of truth that is your schema registry. That means any schema updates, or new schemas, are automatically visible in the event dictionary. You no longer need to worry about drift or errors in your event dictionary as it is automatically generated by consuming the APIs available from the Iglu Schema Repository (or another similar repository).


#### How involved should product designers or managers be in the maintenance of the hypothetical schema registry? Oftentimes ‘meaning’ is attached to data not via textual descriptions but some kind of visual depiction of how the product interaction looks like.

Product teams have a crucial role in the schema design but are typically (not exclusively) advisors to the owner of the schemas. The owner is in a position to collate opinions from around the business, as explained earlier, and assess the feasibility of a design. And product teams should be treated as important advisors here. JSON schemas are great for being central sources of truth specifically because they are concise. If visual depictions are important, a complementary resource may be kept which gives additional information about the event triggers. At Snowplow we have seen this done with e.g. [Airtable](https://airtable.com/) quite well.


#### Do you have any recommendations on analytics tools beyond Snowplow? I’m curious if you've seen any great setups for providing best-in-class observability and analytics support.

There are a number of great tools that are very complimentary to Snowplow. Many of our customers leverage [Looker](https://looker.com/) for business intelligence which works well alongside Snowplow as the concept of schemas integrates nicely with Looker’s LookML product. Internally Snowplow uses the open source version of [Redash](https://redash.io/) which offers an easy to use SQL editor and a range of simple visualization types. [Datadog](https://www.datadoghq.com/) is a great tool for monitoring your applications, and in a similar fashion [Sentry](https://sentry.io/welcome/) does an amazing job at monitoring application errors.


## Snowplow specific questions & answers


#### What are your thoughts in regards to handling tracking on Single Page Applications (SPA) developed on e.g. AngularJS? How to overcome these challenges with the new features from tracker v2.13.0?

We recently built and released [an example Angular application](https://github.com/snowplow-incubator/snowplow-javascript-tracker-examples/tree/master/angular/ngSnowplow) that demonstrates how to wrap up the JavaScript tracker in an Angular service.

With 2.13.0 virtual page views now reset the page ping activity tracking so you should automatically see this improvement when it comes to modelling your data.


#### Do you need to send user entity values to all the events?

You absolutely don’t need to send all user properties in the entity with each event. The general recommendation is to only send a unique identifier that you can use to join back all other entity properties, and only track stateful properties client-side if they exist, e.g. logged in state. A good example is to have price in a product entity so you can be sure what the user saw when they interacted with it. Good entity design often has lots of optional properties so you may have a central definition of what a user is but the properties don’t have to be filled for each event - perhaps only ID is filled for most events and the entity is still very valuable. The idea is that if the properties need to be tracked, the business has thought about the structure and format upfront.


#### Is there a particular reason that Snowplow generally recommends to impose a maximum length on strings (as in the Igluctl tool for linting schemas)?

We often recommend being deliberate about data capture. This extends to declaring minimum and maximum lengths and values in schema validation, even if they are far greater than what you might expect. This means that the business has made these assumptions explicit and paves the road for tweaking validation strictness over time. For example, a first version of your tracking implementation may have very lenient schemas as the team gets used to the workflow but then version two may see a tightening in validation strictness once the business has built up the QA workflows we recommend (we use [Snowplow Mini](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-mini/) and [Micro](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-micro/) to debug tracker and schema changes).


#### Is it possible to try out Snowplow Analytics for free?

Yes! There are a few ways to go about trying out Snowplow. All our tech is open source and you can [setup and run a Snowplow pipeline](https://docs.snowplowanalytics.com/open-source-docs/) within your AWS or GCP infrastructure. 

If you’re interested in learning more about our technology without going through the effort of setting up a fully fleshed pipeline, we recommend looking into [Snowplow Mini](https://docs.snowplowanalytics.com/docs/open-source-components-and-applications/snowplow-mini/), which is an easily-deployable, single instance version of Snowplow. It’s a quick way to understand what Snowplow “does”.

We’ve also created an easy way for you to explore Snowplow data and you can view and download examples of [raw](https://snowplowanalytics.com/explore-snowplow-data-part-1/) and [modeled](https://snowplowanalytics.com/explore-snowplow-data-part-2/) Snowplow data on our website.