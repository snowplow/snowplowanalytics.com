---
layout: post
title-short: Introducing Snowplow Micro
title: "Introducing Snowplow Micro: Now you can validate your tracker setup as part of your automated test suite"
description: "What Snowplow Micro is and how you can get started."
author: Yali
category: Releases
permalink: /blog/2019/07/17/introducing-snowplow-micro/
discourse: true
---



_Jennifer was startled. The numbers did not make sense. Whilst transaction volumes and values looked stable over the last two weeks, the number of add-to-basket events recorded had declined dramatically six days ago. Jennifer quickly dove into the data to look at a transaction item level: for all the items that had been bought, could she identify corresponding add-to-basket events? After all, it was only possible to purchase an item that had previously been added to basket. The data told a different story: she identified a high proportion of sessions where items had been bought where no preceding add to basket event had been recorded. A further look back at the user level rather than session level data confirmed that these users had not purchased items that had been added to basket (and saved) on previous sessions either. The add to basket events were missing. Jennifer’s job was now to identify:_



*   _Why they were missing? Had the events successfully fired, but then failed to be processed? She would check the bad rows to see if this was the case._
*   _Identify the source of the issue and fix it in the tracker setup. This would involve either making a change to the tracking setup directly herself, via the tag manager, or working with one of the front-end engineers to fix this in the code._
*   _Then the hard bit: Jennifer would have to explain to the different stakeholders what had gone wrong, how it had been fixed, which reports were impacted, and why they should continue to have faith in the data collected._

The above scenario - where tracking that has been running successfully, breaks for some reason is sadly, not uncommon. Tracking SDKs are typically put live by companies that want to collect data in a range of different places: on their web front ends, on their server-side systems, in their mobile apps. All of the applications where tracking has been enabled will be constantly evolving as new versions are rolled out. With each new version there is a risk that an unintended consequence, or side effect, of one of those updates will be to break one aspect of the tracking setup.

In the example above, Jennifer is actually pretty lucky: she spotted the issue after just six days. If the missing data is in the bad rows, she will be able to recover it. If the error meant the data was never sent, she’s “only” got a six-day gap: sometimes companies discover breaks in data collection weeks or even months late. These issues can be a lot worse. If they cause the business to lose value in the data, all the painstaking work performed by the different members of the data team to build that data set and use it to drive insight and action will come to nought. The stakes couldn’t be higher.

The purpose of Snowplow Micro, an experimental new service which we have just released, is to prevent the above situation ever arising.


## Validating your tracker setup with automated testing

Modern, digital savvy businesses, are constantly evolving their websites, mobile apps and services. With any new release of any website, app or service, there is a risk that a new bug or issue will be introduced with a new release: that bug might impact anything - data collection is just one area where a bug might emerge.

Engineers have a very good solution to prevent this from happening: automated test suites. Whenever a new piece of functionality is built, a corresponding set of tests are written that validate that the new functionality works as expected. These are configured to automatically run every time a new version of the application is deployed and if any of them fail, the deployment process is halted until the issue is resolved. This means that by writing comprehensive sets of tests, engineers can release updates to digital products frequently with confidence that none of the updates have inadvertently broken anything.

Unfortunately, up until now it has not really been possible to write tests that validate that data collection has been setup properly. That is because to check data collection, it is necessary to fire a set of events, process them and see if the output of that processing is as expected, including for example that:



*   The expected number of events have fired
*   The events are of the expected type
*   The events successfully validate against any relevant schemas
*   The correct contexts / entities are sent with the appropriate events
*   The value of specific fields sent with specific events is as expected

With Snowplow Micro, all of that is now possible.You can make sure that new versions of your digital products do not break data collection.


## What is Snowplow Micro?

Snowplow Micro is a very small Snowplow pipeline, with a few added extras: 



*   It is small enough to be spun up as part of an automated test suite
*   It can be configured to connect to Iglu Servers, so that it can perform validation on any data that is sent into it
*   It exposes a REST API that means it can be queried to see:
    *   What events have been sent.
    *   How many of those events ended up being successfully processed, and for those that were successfully processed, what values they were recorded with
    *   How many events failed validation, and what error messages were generated

What does this mean?



*   Snowplow users can use Snowplow Micro to add tests to their automated test suites on any platform that:
    *   Simulate particular situations, and check that the data sent is as expected. 
    *   Validate that the right event data is sent with each event
    *   Validate that the right entities / contexts are attached to each event
    *   Validate that the right values are sent with each event
*   Snowplow users can then release new versions of their apps, websites and servers with confidence that new changes won’t break the tracking set up.


## How can I get started?

Snowplow Micro is available from Dockerhub [here](https://hub.docker.com/r/snowplow/snowplow-micro).


We are in the process of putting together some tutorials to show how to embed it in different test suites.

In the meantime, we’d love to see what you, our users, do with Snowplow Micro! [Check it out](https://github.com/snowplow-incubator/snowplow-micro/tree/master) today and let us know your feedback.
