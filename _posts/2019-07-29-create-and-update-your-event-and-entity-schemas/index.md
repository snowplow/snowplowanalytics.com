---
layout: post
title-short: Create and update your event and entity schemas
title: "Create and update your event and entity schemas quickly and easily in the Snowplow UI"
description: "With Snowplow, you can easily publish, update and validate your tracking so your data collection evolves with your business"
author: Yali
category: Releases
permalink: /blog/2019/07/29/create-and-update-your-event-and-entity-schemas/
discourse: true
---

![Schema UI][schema-ui]


Schemas are one of the most powerful Snowplow Insights features. To date they have been hard to create and update. Now this can be done easily, directly in the Snowplow UI.


## Overview

One of the most powerful features in Snowplow are schemas. Schemas make it possible for:



1. Each Snowplow user to define their own events and entities, so that their Snowplow data presents a clear and easy-to-understand record of what has happened.
2. Each Snowplow user can evolve their event and entity definitions over time by updating those schemas, enabling companies to [evolve their data collection with their business](https://snowplowanalytics.com/blog/2019/07/23/how-to-ensure-your-data-collection-evolves-alongside-your-business/). Schemas can be updated to reflect changes to the design of websites, mobile apps and server-side applications. They can also be expanded to include more data as Snowplow users become more data sophisticated and need to collect more granular data.

Until now, creating and updating schemas in Snowplow has been very difficult. Snowplow users have had to:



*   Create schemas in their own text editors
*   Use command line tools (igluctl) to lint and publish schemas
*   Manually publish schemas to test environments (e.g. Snowplow Minis) to check that they are fit for purpose
*   Manually publish schemas to production environments in order to go live

Now schemas can be created, tested and published directly in the Snowplow UI, with no requirement for using any command line tools.


## Benefits



*   Easily create new schemas directly in the Snowplow UI. New schemas come templated, so that they are easy to update and build out.
*   Check that schemas are valid directly from the UI. No need to manually lint using a command line tool.
*   Structured workflow makes it easy to test schemas. They are published to a Snowplow Mini for testing directly from the UI, as part of the standard workflow.
*   Publish schemas to production with the touch of a button. 


## Get started



*   We will be rolling out this functionality for all Snowplow Insights users in the UI
*   However, if you’d like early access to this functionality, contact us at [support@snowplowanalytics.com](mailto:support@snowplowanalytics.com) and we’ll get you up and running, including walking you through the new functionality.
*   Not a Snowplow Insights customer yet? [Get in touch with us here to learn more](https://snowplowanalytics.com/request-demo/).


## Additional references

Documentation can be found [here](https://docs.snowplowanalytics.com/snowplow-insights/schemas/).



[schema-ui]: /assets/img/blog/2019/07/Schema-UI.png