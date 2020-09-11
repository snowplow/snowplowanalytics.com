---
layout: post
title: "Snowplow Micro 1.0.0 released"
title-short: Snowplow Micro 1.0.0
tags: [snowplow, micro]
author: Ian
category: Releases
permalink: /blog/2020/09/11/snowplow-micro-1-0-0-released/
discourse: false
---

We are pleased to announce the v1.0.0 release of [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro#snowplow-micro).

__Please note:__ If you are still using version Snowplow Micro 0.1.0 then you need to update your scripts to use the `snowplow/snowplow-micro:0.1.0` docker image, not the `latest` image. Existing users might notice their tests will fail if they are still using the `latest` tag. More information on the breaking changes in version 1.0.0 can be found below.

Snowplow Micro is built to enable companies running Snowplow to build automated test suites to ensure that new releases of their websites, mobile apps and server-side applications do not break tracking / Snowplow data collection.

Snowplow Micro is a very small version of a full Snowplow data collection pipeline: small enough that it can be launched by a test suite. Events can be recorded into Snowplow Micro just as they can a full Snowplow pipeline. Micro then exposes an API that can be queried to understand:

* How many events have been received?
* How many of them were successfully processed vs ended up as "bad" (e.g. because the events failed validation against the corresponding schemas in the Iglu Schema Registry)
* For any events that have been successfully processed, what type of events they are, what fields have been recorded etc.
* For any events that have not been successfully processed, what errors were generated on processing the events. (So these can be surfaced back via the test suite.)
* This means companies can build automated test suites to ensure that specific events in an application generate specific events that are successfully processed by Snowplow.

For examples of how to use Snowplow Micro, take a look at the 'How to' guides for [Cypress](https://snowplowanalytics.com/blog/2020/08/07/testing-tracking-with-micro-and-cypress/) and [Nightwatch](https://snowplowanalytics.com/blog/2020/08/07/testing-tracking-with-micro-and-nightwatch/) as well as the [examples repository](https://github.com/snowplow-incubator/snowplow-micro-examples#snowplow-micro-examples). 


Read on below for:

1. [Updates to the validation logic](#validation)
2. [Breaking changes since version 0.1.0](#breaking-changes)
3. [Other updates and bug fixes](#updates)
4. [Documentation and help](#documentation-and-help)

<!--more-->


<h2 id="validation">1. Updates to the validation logic</h2>

In version 1.0.0, Snowplow Micro now uses the exact same validation the production Snowplow pipeline uses. Specifically, it uses `EnrichmentManager.enrichEvent` to validate events ([GitHub issue #23](https://github.com/snowplow-incubator/snowplow-micro/issues/23)) and outputs the post-enrichment canonical event (but with all enrichments deactivated).

This effectively makes the validation in Micro even stricter. In version 0.1.0, an event validated by Micro could fail during enrichment due to an invalid input field (such as a timestamp). In version 1.0.0, using `EnrichmentManager.enrichEvent` to validate the event, we can ensure an event that is validated by Micro will not unexpectedly fail in the enrichment process.


<h2 id="breaking-changes">2. Breaking changes since version 0.1.0</h2>

__The good event format has changed__

The `/micro/good` endpoint returns a JSON array of good events. The structure of the JSON objects in this array has changed ([GitHub issue #28](https://github.com/snowplow-incubator/snowplow-micro/issues/28)) due to the improvements in the validation logic. 

In version 0.1.0, each `GoodEvent` used to contain the following four fields:

* `event`: the `RawEvent`, in the format of a validated event before enrichment
* `eventType`: the type of the event
* `schema`: the schema of the event in the case of an unstructured event
* `contexts`: the contexts attached to the event

In version 1.0.0, each `GoodEvent` now contains the following four fields:

* `rawEvent`: the `RawEvent`, in the format of a validated event before enrichment (previously `event`)
* `event`: the Canonical Snowplow Event, in the format of a validated event after enrichment (with all the enrichments deactivated)
* `eventType`: the type of the event
* `schema`: the schema of the event in the case of an unstructured event
* `contexts`: the contexts attached to the event

__The format of the configuration file has changed__

In the configuration file, variables that were previously camel case now use hyphens. For example, `crossDomain` [here](https://github.com/snowplow-incubator/snowplow-micro/blob/micro-0.1.0/example/micro.conf#L34) has become `cross-domain` [here](https://github.com/snowplow-incubator/snowplow-micro/blob/master/example/micro.conf#L41). Therefore, when switching from Snowplow Micro version 0.1.0 to 1.0.0 we recommend you copy the latest example config from the GitHub repository.


<h2 id="updates">3. Other updates and bug fixes</h2>

- Fix filtering on `event_type` and `schema` ([GitHub issue #24](https://github.com/snowplow-incubator/snowplow-micro/issues/24))
- Add Snowplow Bintray and Snowplow Maven to resolvers ([GitHub issue #26](https://github.com/snowplow-incubator/snowplow-micro/issues/26))
- Bump sbt to 1.3.12 ([GitHub issue #25](https://github.com/snowplow-incubator/snowplow-micro/issues/25))
- Bump snowplow-stream-collector-core to 1.0.1 ([GitHub issue #22](https://github.com/snowplow-incubator/snowplow-micro/issues/22))
- Bump circe to 0.13.0 ([GitHub issue #21](https://github.com/snowplow-incubator/snowplow-micro/issues/21))
- Bump specs2-core to 4.9.4 ([GitHub issue #20](https://github.com/snowplow-incubator/snowplow-micro/issues/20))
- Bump Scala version to 2.12.11 ([GitHub issue #10](https://github.com/snowplow-incubator/snowplow-micro/issues/10))


<h2 id="documentation-and-help">4. Documentation and help</h2>

For more information on Snowplow Micro, please take a look at the [technical documentation](https://github.com/snowplow-incubator/snowplow-micro#snowplow-micro).

For help with getting started, check out the [Snowplow Micro examples repo](https://github.com/snowplow-incubator/snowplow-micro-examples#snowplow-micro-examples).

If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). 

Please raise any bugs in [Snowplow Micro’s issues](https://github.com/snowplow-incubator/snowplow-micro/issues) on GitHub.
