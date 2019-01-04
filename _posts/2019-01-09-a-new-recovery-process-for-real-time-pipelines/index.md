---
layout: post
title-short: Snowplow Event Recovery 0.1.0 released
title: "Snowplow Event Recovery 0.1.0 released"
tags: [snowplow, real-time, GCP, AWS, recovery, bad-rows]
author: Ben
category: releases
permalink: /blog/2019/01/09/snowplow-event-recovery-0.1.0-released/
---

We are excited to announce the release of [Snowplow Event Recovery][ser].

The different Snowplow pipelines being all non-lossy, if something goes wrong during, for example,
schema validation or enrichment the payloads (alongside the errors that happened) are stored into a
bad rows storage solution, be it a data stream or object storage, instead of being discarded.

The goal of recovery is to fix the payloads contained in these bad rows so that they are ready to be
processed successfully by a Snowplow enrichment platform.

Snowplow Event Recovery lets you run data recoveries on data emitted by real-time Snowplow pipelines
on AWS and GCP.

Please read on after the fold for:

1. [Overview](#overview)
2. [Recovery scenarios](#csl)
3. [Snowplow Event Recovery on AWS](#aws)
4. [Snowplow Event Recovery on GCP](#gcp)
5. [Roadmpa](#roadmap)
6. [Getting help](#help)

<!--more-->

<h2 id="overview">1. Overview</h2>

Our current approach to data recovery, [Hadoop Event Recovery][hadoop-recovery], suffers from a few
issues:

- it's limited to data produced by the batch pipeline
- you need to code your own recovery almost from scratch in JavaScript
- you cannot test this JavaScript except by running an actual recovery
- it doesn't promote reuse: if you run the same recovery twice, you'll need to copy/paste your
recovery code from one recovery to another

Snowplow Event Recovery aims to tackle most of these issues and make the data recovery process:

- not require any coding for the most common cases
- extensible when outside the most common cases
- testable
- unified across the real-time pipelines (AWS and GCP) and, in the future across all pipelines
(real-time and batch)

<h2 id="csl">2. Recovery scenarios</h2>

Keeping these goals in mind, we started by thinking about what a recovery is, in essence. For us,
it is a collection of what we've come to call a recovery scenario.

So, what are recovery scenarios? They are modular and composable processing units that will deal
with a specific case you want to recover from.

As such, recovery scenarios are, at their essence, made up of two things:

- an error filter, which will serve as a router between bad rows and their appropriate recovery
scenario(s)
- a mutation function, which will actually "fix" the payload

For example, if we wanted to recover a set of bad rows consisting of:

- Bad rows that were created due to a missing schema
- Bad rows that were created due to the payload not conforming to its schema
- Bad rows that were created due to an enrichment failing

We would use a different recovery scenario for each of them, so three in total:

- a first recovery scenario consisting of:
  - an error filter checking for missing schema errors
  - a mutate function which does nothing (assuming the schema has been added since the bad rows
occurred)
- a second recovery scenario consisting of:
  - an error filter checking for payloads not conforming to their schema errors
  - a mutate function which makes the payloads fit their schema
- a third recovery scenario consisting of:
  - an error filter checking for a particular enrichment failing errors
  - a mutate function which does nothing (assuming the enrichment was misconfigured and we just want
to rerun it)

<h3 id="out-of-the-box">2.1 Out of the box recovery scenarios</h3>

For the most common recovery scenarios, it makes sense to support them out of the box and not
require any coding. From the recoveries we've run in the past, we've compiled a list of recovery
scenarios that are supported out of the box by Snowplow Event Recovery.

In the table below, you can find what this list is made of, it contains:

- the name of the recovery scenario
- what the mutation function will do
- an example use case
- the parameters to this recovery scenario

| Name | Mutation | Example use case | Parameters |
|:----:|:--------:|:----------------:|:----------:|
| `PassThrough` | Does not mutate the payload in any way | A missing schema that was added after the fact | `error` |
| `ReplaceInQueryString` | Replaces part of the query string according to a regex | Misspecified a schema when using the Iglu webhook | `error`, `toReplace`, `replacement` |
| `RemoveFromQueryString` | Removes part of the query string according to a regex | Property was wrongfully tracked and is not part of the schema | `error`, `toRemove` |
| `ReplaceInBase64FieldInQueryString` | Replaces part of a base64 field in the query string according to a regex | Property was sent as a string but should be an numeric | `error`, `base64Field` (`cx` or `ue_px`), `toReplace`, `replacement` |
| `ReplaceInBody` | Replaces part of the body according to a regex | Misspecified a schema when using the Iglu webhook | `error`, `toReplace`, `replacement` |
| `RemoveFromBody` | Removes part of the body according to a regex | Property was wrongfully tracked and is not part of the schema | `error`, `toRemove` |
| `ReplaceInBase64FieldInBody` | Replaces part of a base64 field in the body according to a regex | Property was sent as a string but should be an numeric | `error`, `base64Field` (`cx` or `ue_px`), `toReplace`, `replacement` |

Note that, for every recovery scenario leveraging a regex, it's possible to use capture groups. For
example, to remove brackets but keep their content we would have a `toReplace` argument containing
`\\{(.*)\\}` and a `replacement` argument containing `$1` (capture groups are one-based numbered).

<h3 id="custom">2.2 Custom recovery scenarios</h3>

In addition to these recovery scenarios, we still wanted to make the idea of recovery scenario
extensible. As such, if the recovery you want to perform is not is not covered by the ones listed
above, you can define your own by following [the guide in the repository][custom-recovery-scenario].

If you think your recovery scenario will be useful to others, please consider opening a pull
request!

<h3 id="config">2.3 Configuration</h3>

Once you have identified the different recovery scenarios you will want to run, you can combine
them in the configuration that we will feed to the recovery job. Here, we make use of each and every
one of them as a showcase.

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/recoveries/jsonschema/1-0-0",
  "data": [
    # Schema com.acme/my_schema/jsonschema/1-0-0 was added after the fact
    {
      "name": "PassThrough",
      "error": "Could not find schema with key iglu:com.acme/my_schema/jsonschema/1-0-0 in any repository"
    },
    # Typo in the schema name when using the Iglu webhook
    {
      "name": "ReplaceInQueryString",
      "error": "Could not find schema with key iglu:com.snowplowanalytics.snowplow/screen_vie/jsonschema/1-0-0 in any repository",
      "toReplace": "schema=iglu%3Acom.snowplowanalytics.snowplow%2Fscreen_vie%2Fjsonschema%2F1-0-0",
      "replacement": "schema=iglu%3Acom.snowplowanalytics.snowplow%2Fscreen_view%2Fjsonschema%2F1-0-0"
    },
    # Removes illegal curlies in query strings (e.g. templates that haven't been filled)
    {
      "name": "RemoveFromQueryString",
      "error": "Exception extracting name-value pairs from querystring",
      "toRemove": "\\{.*\\}"
    },
    # Replaces a string by an integer in ue_px, it can be reused for ReplaceInBase64FieldInBody
    {
      "name": "ReplaceInBase64FieldInQueryString",
      "error": "instance type (string) does not match any allowed primitive type (allowed: [\"integer\"])\n    level: \"error\"\n    schema: {\"loadingURI\":\"#\",\"pointer\":\"/properties/sessionIndex\"",
      "base64Field": "ue_px",
      "toReplace": "\"sessionIndex\":\"(\\d+)\"",
      # $1 refers to the first capture group
      "replacement": "\"sessionIndex\":$1"
    },
    # Replaces the device created timestamp by a string
    {
      "name": "ReplaceInBody",
      "error": "instance type (integer) does not match any allowed primitive type (allowed: [\"string\"])\n    level: \"error\"\n    schema: {\"loadingURI\":\"#\",\"pointer\":\"/items/properties/dtm\"",
      "toReplace": "\"dtm\":(\\d+)",
      "replacement": "\"dtm\":\"$1\""
    },
    # Removes a field which shouldn't be there
    {
      "name": "RemoveFromBody",
      "error": "object instance has properties which are not allowed by the schema: [\"test\"]",
      "toRemove": "\"test\":\".*\",?"
    },
    # Same as ReplaceInBase64FieldInQueryString
    {
      "name": "ReplaceInBase64FieldInBody",
      "error": "instance type (string) does not match any allowed primitive type (allowed: [\"integer\"])\n    level: \"error\"\n    schema: {\"loadingURI\":\"#\",\"pointer\":\"/properties/sessionIndex\"",
      "base64Field": "ue_px",
      "toReplace": "\"sessionIndex\":\"(\\d+)\"",
      # $1 refers to the first capture group
      "replacement": "\"sessionIndex\":$1"
    },
    # Our custom recovery scenario, replaces a wrong Iglu webhook path
    {
      "name": "ReplaceInPath",
      "error": "Payload with vendor com.iglu and version v1 not supported",
      "toReplace": "com.iglu/v1",
      "replacement": "com.snowplowanalytics.iglu/v1"
    }
  ]
}
{% endhighlight %}

<h3 id="config">2.4 Testing</h3>

It's possible to test an entire recovery without running it or a custom recovery scenario by
following [the dedicated guide in our repository][recovery-testing].

<h2 id="aws">3. Snowplow Event Recovery on AWS</h2>

<h2 id="gcp">4. Snowplow Event Recovery on GCP</h2>

<h2 id="roadmap">5. Roadmap</h2>

Continuing our data quality journey, we will next work towards 

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[release]: https://github.com/snowplow-incubator/snowplow-event-recovery/releases/0.1.0
[ser]: https://github.com/snowplow-incubator/snowplow-event-recovery/

[discourse]: https://discourse.snowplowanalytics.com/

[hadoop-recovery]: https://github.com/snowplow/snowplow/wiki/Hadoop-Event-Recovery
[custom-recovery-scenario]: https://github.com/snowplow-incubator/snowplow-event-recovery#custom-recovery-scenario
[recovery-testing]: https://github.com/snowplow-incubator/snowplow-event-recovery#testing
[sgcsl]: https://snowplowanalytics.com/blog/2018/11/13/snowplow-google-cloud-storage-loader-0.1.0-released/
