---
layout: post
title: "Snowplow Mini 0.8.0 Release"
title-short: "Introducing a new failed event format in the latest Snowplow Mini release: 0.8.0"
tags: [snowplow, mini, failed events]
description: "This release of Snowplow mini comes with the latest onboard components that emit failed events by type of error."
author: MikeN
category: Releases
permalink: /blog/2020/04/06/snowplow-mini-0-8-0-release/
discourse: false
---

We are very excited to announce the release of the latest version of Snowplow Mini.

Version 0.8.0 is a particularly important release as it introduces the new failed event format! With this release, any “bad rows” that fail to process will now be in a structured format that makes understanding the cause of an issue much easier. 

Read on below for:



1. [Overview of the change](#1-Overview-of-the-change)
2. [New failed event format error types](#2-The-new-failed-events-format)
3. [Using the new format in Mini](#3-Using-the-new-format-in-Snowplow-Mini)
4. [Additional changes](#4-Additional-changes-in-this-release)]
5. [Upgrading](#5-Upgrading)


## 1. Overview of the change

Snowplow Minis are smaller versions of a full Snowplow pipeline. Typically used for testing changes to your data collection and processing in a safe ‘staging’ environment before making changes to your production pipeline. 

For example, you may want to test an update to your tracking, to track more data points or additional entities with an event". Or, you might want to configure an additional enrichment to e.g. attach product metadata to cart events.

 

In both cases, Snowplow Mini enables you to test the update in a sandbox environment and ensure it is fit for process before publishing those changes to your production pipeline. With Mini, you can send individual or groups of events, and inspect the data processed line by line, to check that the data has been processed successfully, and if all the fields are set correctly, or if not, inspect the "bad row" to understand what went wrong. (E.g. an event failed to process because the enrichment failed or an event or entity failed validation against its associated schema.)

You can then see the events land in either a ‘good’ or a ‘bad’ index on the onboard Elasticsearch instance via the Kibana dashboard:

![alt_text](/assets/img/blog/2020/04/kibana-index.png "Choosing an index in Kibana")


Events that land in the good index in Elasticsearch represent the events that would move on to being loaded into your storage target of choice (i.e. your data warehouse like Redshift or BigQuery) on a production pipeline. Conversely, events that land in the bad index would load into storage such as Amazon S3 or Google Cloud Storage. The aim of course is to address any errors that are causing events to land in the bad index.

"Bad rows", or "failed events", are valuable tools for enabling Snowplow users to build assurance in the quality of their data: the presence of failed events indicates that a % of data has failed to be processed successfully, and therefore the resulting data set is potentially incomplete. With the old format of bad rows, it was difficult to answer questions like:



*   What type of error is occurring?
*   Where in the pipeline is the error occurring?
*   Which application or tracker was responsible for the event that is erroring? 
*   Which specific event or property was causing the error?
*   How many failed events are accounted for by each error type?

The new format for failed events has been designed to make answering the above questions easy.


### 2. The new failed events format

With the new format, errors are split out into type (Collector Payload Format, Adaptor, Tracker Protocol, Size Violation, Validation, Enrichment). These types follow along the main “stages” of data processing in Snowplow pipelines, namely: collection, validation and enrichment.


#### Error types

By separating failed events into type, it is possible to narrow down where in the pipeline an issue is occurring. For further documentation on each error type see [here](https://docs.snowplowanalytics.com/docs/managing-data-quality/understanding-failed-events/). Below are brief descriptions:

**Schema Violation **- likely the most common for purposes of debugging tracking issues, this event failure will occur if a schema can not be found or if the event or entity does not conform to the schema definition.

**Collector Payload Format **- when the payload sent to the collector is not formatted as expected.

**Adaptor** - mostly associated with events sent from Webhooks, an adapter failure is emitted. If there is an unexpected change in the format like a missing field for example.

**Tracker Protocol** - any deviation from an expected event protocol for a given tracker will emit a failure.

**Size Violation** - emitted when the size of the enriched event is too big.

**Enrichment failure **- these failures would occur due to improper configuration of an enrichment.


## 3. Using the new format in Snowplow Mini

To bring to life how different the new format is, let's look at a common example: an event failing validation against its schema. The old format looks as follows: 

Here’s what a failed event looks like in Kibana in the old format:

![alt_text](/assets/img/blog/2020/04/old-format.png "Old format of failed events")


Note that:



*   The error message is clear that the issue is a schema violation - two fields (datetime and id) are missing.
*   However, it is not clear what schema this refers to
*   It is not clear where the event originated from
*   To find out both of the above, we'll have to base64decode the raw payload, and then parse it out.
*   We cannot aggregate our data to find out how many errors are of this type.

In contrast, below is an example of a schema validation error in the Kibana Discover view with the new structured format:

![alt_text](/assets/img/blog/2020/04/new-format.png "Highly structured new format of failed events")


Looking at the failure messages, the structured `data.failure.messages` gives us the `schemaKey` so we know which schema the event is trying to validate against, in this case the `call_complete` schema. Below that in the `dataReports` object we can see specific validation failure messages like missing but required properties and type errors.

Additionally with the availability of properties such as app_id (application ID) or v_tracker (tracker version) it would be possible to create real-time dashboards in Kibana of failed events by application: \

![alt_text](/assets/img/blog/2020/04/kibana-dash.png "Example of a Kibana dashboard")



## Additional changes in this release

In this release we've not just updated the format of the failed events. We have also updated the SameSite cookie setting.



*   The collector has been configured to default the SameSite cookie setting to `SameSite=none; Secure` which is in line with the IETF proposal, [Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) in regards to cookies for cross-site usage. 
*   There is also a resolved issue of Postgres not starting after a breaking change was released in a patch of a docker library used to create the Sn. 


## 5. Upgrading

For Snowplow Insights customers we will update your mini automatically and let you know when it’s ready. 

For Snowplow Open Source users you can find the setup guides [here](https://docs.snowplowanalytics.com/docs/open-source-components-and-applications/snowplow-mini/snowplow-mini-0-8-0/). 

***nb** - IgluCtl 0.7.0 is required for migrating schema to this new version of Mini. Also, the swagger UI has been removed from this release. 

While the [full pipeline release](https://snowplowanalytics.com/blog/2020/01/16/snowplow-release-r118-badrows/) with this new format is currently in Beta, this new mini release gives a significant preview ahead of the production release.