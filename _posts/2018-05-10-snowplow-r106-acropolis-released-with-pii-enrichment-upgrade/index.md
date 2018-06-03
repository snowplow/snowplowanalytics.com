---
layout: post
title: "Snowplow 106 Acropolis released with PII Enrichment upgrade"
title-short: Snowplow 106 Acropolis
tags: [pii, streaming, pseudonymization]
author: Kostas
category: Releases
permalink: /blog/2018/05/10/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/
---

We are pleased to announce the release of [Snowplow R106 Acropolis][release-notes].

This release brings some important improvements to the [PII Enrichment][pii-enrichment] first released in [R100 Epidaurus][r100-post].

Read on for more information on R106 Acropolis, named after [the acropolis of Athens][acropolis]:

<!--more-->

1. [Overview of the new PII-related capabilities](#pii-capabilities)
2. [Emitting a stream of PII transformation events](#pii-events)
3. [Adding a salt for hashing](#pii-salt)
4. [An important bug fix](pii-bugfix)
5. [Other changes](#other)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Help](#help)

![Acropolis][acropolis-img]

<h2 id="pii-capabilities">1. Overview of the new PII-related capabilities</h2>

In our recent [R100 Epidaurus][r100-post] release, we introduced the capability to pseudonymize Snowplow PII data to help our users meet the [GDPR regulations][gdpr-web].

In brief, that release let you configure Snowplow to hash any PII-containing fields, be they a [Canonical event model][canonical-event-model] field, or a property within a self-describing event or context.

With this new release, users of Snowplow real-time now have the option to configure a stream of events which contain the hashed values, alongside their original values. You can think of these pairs as similar to:

{% highlight %}
"d4bd092ce3df26df6f492296ef8e4daf71be4ac9" -> "10.0.2.1"
{% endhighlight %}

This stream of PII Transformation events can then be used with the new Snowplow Piinguin project, which we will also briefly introduce in this blog post.

Although the new PII Transformation event stream is only available for Snowplow real-time pipeline users, this release also brings two other PII-related updates which are available for both batch and real-time users:

* [Adding a salt for hashing](#pii-salt)
* [An important bug fix](#pii-bugfix)

Let's discuss each of the new PII-related capabilities in turn, starting with the new emitted stream.

<h2 id="pii-events">2. Emitting a stream of PII transformation events</h2>

This release adds a configurable, optional stream of events from the PII Enrichment that contain the original hashed and original values.

When enabled and configured, Stream Enrich will emit into this new stream a "PII Transformation" event for each event that was pseudonymized in the PII enrichment, containing the original and hashed values.

<h3>Anatomy of a PII Transformation event</h3>

The emitted event is a standard Snowplow enriched event as described in the [Canonical event model][canonical-event-model], and as such it can be easily consumed via our [analytics SDKs][analytics-sdk].

The event follows the new [PII Transformation event JSON schema][pii-transformation-schema]. An instance of that event could look like this (depending on the fields configured):

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/pii_transformation/jsonschema/1-0-0",
  "data": {
    "pii": {
      "pojo": [
        {
          "fieldName": "user_fingerprint",
          "originalValue": "its_you_again!",
          "modifiedValue": "27abac60dff12792c6088b8d00ce7f25c86b396b8c3740480cd18e21068ecff4"
        },
        {
          "fieldName": "user_ipaddress",
          "originalValue": "70.46.123.145",
          "modifiedValue": "dd9720903c89ae891ed5c74bb7a9f2f90f6487927ac99afe73b096ad0287f3f5"
        },
        {
          "fieldName": "user_id",
          "originalValue": "john@acme.com",
          "modifiedValue": "7d8a4beae5bc9d314600667d2f410918f9af265017a6ade99f60a9c8f3aac6e9"
        }
      ],
      "json": [
        {
          "fieldName": "unstruct_event",
          "originalValue": "50.56.129.169",
          "modifiedValue": "269c433d0cc00395e3bc5fe7f06c5ad822096a38bec2d8a005367b52c0dfb428",
          "jsonPath": "$.ip",
          "schema": "iglu:com.mailgun/message_clicked/jsonschema/1-0-0"
        },
        {
          "fieldName": "contexts",
          "originalValue": "bob@acme.com",
          "modifiedValue": "1c6660411341411d5431669699149283d10e070224be4339d52bbc4b007e78c5",
          "jsonPath": "$.data.emailAddress2",
          "schema": "iglu:com.acme/email_sent/jsonschema/1-1-0"
        },
        {
          "fieldName": "contexts",
          "originalValue": "jim@acme.com",
          "modifiedValue": "72f323d5359eabefc69836369e4cabc6257c43ab6419b05dfb2211d0e44284c6",
          "jsonPath": "$.emailAddress",
          "schema": "iglu:com.acme/email_sent/jsonschema/1-0-0"
        }
      ]
    },
    "strategy": {
      "pseudonymize": {
        "hashFunction": "SHA-256"
      }
    }
  }
}
{% endhighlight %}

In this example there are a few things going on. The PII Enrichment was configured to pseudonymize the canonical fields `user_fingerprint`, `user_ipaddress` and `user_id`, and as such the emitted event contains their original and modified values.

In addition, the enrichment was configured to pseudonymize properties from the `unstruct_event` and `contexts` fields. As before, the event contains the original and modified values, but it also contains:

1. The `schema` property, identifying the Iglu URI for the related and the 
2. The `jsonPath` property, corresponding to it as in the case of `contexts` there could be any number of substitutions depending on the path and schema matches

Finally the PII Transformation event strategy and in this case the hashing algorithm version is also given. What is not emitted is the `salt` that was used in the hashing (see [salt](#pii-salt) below)

Let's look at the here are a couple of fields of particular interest, namely the `contexts` and `unstruct_event`:

<h3>The PII Transformation event's parent event</h3>

The `contexts` field in the new PII Transformation event contains a new context called `parent_event` with a new [schema][parent-event-schema]. Here is an example of such an event:

{% highlight json %}
{
  "schema": "com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0",
  "data": {
    "parentEventId": "a0f0213e-d514-44e5-8c3d-b1fba8c54f0f"
  }
}
{% endhighlight %}

This context simply contains the Event ID, a UUID, of the parent event for which the PII Enrichment was applied. This can be useful for reconciling the emitted PII Transformation events back to the events which caused them to be generated.

<h3>Enabling the new event stream</h3>

In order to emit a stream of PII events the stream needs to exist for some configurations (e.g. Kinesis), and you will need to configure the stream in two separate places.

This is all covered in detail in the [upgrading](#upgrading) section below.

<h3>Using the new event stream</h3>

This new event stream is intended to be used by downstream processes which want to track the pseudonymization process and make it possible for Snowplow operators to recover the original PII values, if and only if the operator has the appropriate authorization under the conditions required for [lawful basis for processing][ico-lawful-basis].

That capability is now being served by our new [Piinguin][piinguin] project, which we are releasing in concert with this release. Please read the [Piinguin and Snowplow Piinguin Relay release blog post][piinguin-relay-post] for more information.

<h2 id="pii-salt">3. Adding a salt for hashing</h2>

In order to make it harder for the hashed data to be identified we have responded to community feedback and have added salt to the hashing pseudonymization as standard (thank you [falshparker82][issue-3648]). Salt is simply a string that is appended to the end of the string that is going to be hashed, that makes it a lot harder, if not impossible, for someone to simply hash all the possible values of a field and try to match the hash to the pseudonymized values, thus providing an additional layer of protection for PII data.
The new setting is simply a new field in the configuration for the enrichment (see [adding salt][#pii-salt] and [upgrading][#upgrading]). The salt should remain secret in order to ensure that protection against brute-forcing the hashed values is achieved.

As mentioned above adding salt is simply achieved by adding a new field to the updated pii enrichment configuration. A fragment of that configuration would then look like this (see [upgrading][#upgrading] for a full example):

{% highlight json %}
"strategy": {
  "pseudonymize": {
    "hashFunction": "SHA-1",
    "salt": "pepper123"
  }
}
{% endhighlight %}

In this case the salt is simply set to the string `pepper123` which is the appended to every string before hashing.

*IMPORTANT* Please note that changing the salt will change the hash of the same value and joining with fields in the event store will become *much more* complicated.

<h2 id="pii-bugfix">4. An important bug fix</h2>

With our R100 introduction of the PII Enrichment, there was a known issue in one of the underlying libraries that we believed to be harmless; unfortunately we have since identified that it *can* cause problems downstream in the pipeline.

The problem can cause good events to end up in the bad bucket under certain conditions explained below.

As described in [issue #3636][issue-3636], the bug occurs when the user has configured the PII Enrichment to hash a JSON type field with a JSON Path containing an array of fields like so:

{% highlight json %}
{
  "json": {
    "field": "unstruct_event",
    "schemaCriterion": "iglu:com.acme/event/jsonschema/1-0-0",
    "jsonPath": "$.['email', 'username']"
  }
}
{% endhighlight %}

In events that did *not* contain both fields, the hashed output would correctly hash the existent one, but it would also create the one that did not exist as an empty object, so the enriched event would contain an output like so:

{% highlight json %}
{
  "schema": "iglu:com.acme/event/jsonschema/1-0-0",
  "data": {
    "email": "764e2b5c4da5267efd84ab24a86539dfc85031c4",
    "username": {}
  }
}
{% endhighlight %}

The problem with that event is that it can fail validation downstream depending on the schema `iglu:com.acme/event/jsonschema/1-0-0`. For example, if the field `username` in the schema is only allowed to be a string, then the event will fail validation and end up in the `bad` bucket during shredding (not during enrichment).

<h2 id="other">5. Other changes</h2>

Two other improvements included in this release are:

1. Automated code formatting for Stream Enrich
2. An integration test for Stream Enrich's Apache Kafka support

Automated code formatting further improves the code quality of the `snowplow/snowplow` repo and makes it easier for new contributors to meet the expected quality standards for Snowplow code.

The Kafka integration test uses the excellent [Kafka Testkit][kafka-testkit] to bring up a Kafka broker for Stream Enrich to interact with, thus extending test coverage and further improving the maintainability of the codebase.

<h2 id="upgrading">6. Upgrading</h2>

R106 Acropolis is slightly unusual in being a simultaneous release for the Snowplow batch and real-time pipelines.

This upgrading section is broken down as follows:

1. Batch pipeline upgrade instructions
2. Real-time pipeline upgrade instructions
3. Full example for the new PII Enrichment configuration

Please make sure to read section 3 alongside either section 1 or 2.

<h3>Batch pipeline upgrade instructions</h3>

To upgrade, update your EmrEtlRunner configuration to the following:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.14.0 # WAS 1.13.0
{% endhighlight %}

Now review the [Full example for the new PII Enrichment configuration](#pii-config) below.

<h3>Real-time pipeline upgrade instructions</h3>

The latest version of Stream Enrich is available from our Bintray *UPDATE URL AFTER RELEASE* [here][stream-enrich-bintray].

There are a few steps to using the new capabilities:

1. Create your Kinesis stream or equivalent for the PII Transformation events stream
2. Update your PII Enrichment configuration (using [version 2-0-0][pii-config-2-schema])
3. Update your Stream Enrich app configuration

<h4>Create your Kinesis stream or equivalent</h4>

Make sure to create a dedicated Kinesis stream, Apache Kafka topic or equivalent to hold the PII Transformation events - otherwise Stream Enrich will fail.

Do not attempt to re-use your enriched event stream, as then you will be co-mingling sensitive PII data with safely pseudonymized enriched events.

<h4>Update your PII Enrichment configuration</h4>

In the PII Enrichment configuration [version 2-0-0][pii-config-2-schema] you will need to add:

{% highlight json %}
...
"emitEvent": true
...
{% endhighlight %}

The complete configuration file, including salt configuration, can be found in the [Full example for the new PII Enrichment configuration](#pii-config) below.

<h4>Update your Stream Enrich app configuration</h4>

In the [Stream Enrich configuration][stream-enrich-config] you will need to add a new property, `pii`, and set it to the stream or topic which should hold the PII Transformation events:

{% highlight json %}
enrich {
  streams {
    ...

    out {
      enriched = my-enriched-events-stream
      bad = my-events-that-failed-validation-during-enrichment
      pii = my-pii-transformation-events-stream
      partitionKey = ""
    }

    ...
  }
}
{% endhighlight %}

Most of the above configuration should be familiar for Stream Enrich users - if not, you can find more information on the [Stream Enrich configuration wiki page][config-stream-enrich].

<h3 id="pii-config">Full example for the new PII Enrichment configuration</h3>

Here is a full example PII enrichment configuration:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "pii_enrichment_config",
    "emitEvent": true,
    "enabled": true,
    "parameters": {
      "pii": [
        {
          "pojo": {
            "field": "user_id"
          }
        },
        {
          "pojo": {
            "field": "user_ipaddress"
          }
        },
        {
          "json": {
            "field": "unstruct_event",
            "schemaCriterion": "iglu:com.mailchimp/subscribe/jsonschema/1-*-*",
            "jsonPath": "$.data.['email', 'ip_opt']"
          }
        }
      ],
      "strategy": {
        "pseudonymize": {
          "hashFunction": "SHA-1",
          "salt": "pepper123"
        }
      }
    }
  }
}
{% endhighlight %}

Most properties will be familiar from the [R100 Epidaurus configuration][r100-config], which used the 1-0-0 version of the configuration schema, per the [relevant wiki page][pii-enrich-wiki].

The new items are:

1. `emitEvent` which configures whether an event will be emitted or not
2. `salt` which as [explained above](#pii-salt) sets up the salt that will be used

Setting `emitEvent` to true is only relevant for the real-time pipeline; `salt` is applicable to both pipelines.

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R106 [STR & BAT] New webhooks and enrichment][r106-ms], featuring Marketo and Vero webhook adapters from our partners at [Snowflake Analytics][snowflake-analytics], plus a new enrichment for detecting bots and spiders using [data from the IAB][iab-data]
* [R10x Vallei dei Templi][r10x-str], porting our streaming enrichment process to
  [Google Cloud Dataflow][dataflow], leveraging the [Apache Beam APIs][beam]

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r106-acropolis
[acropolis]: https://en.wikipedia.org/wiki/Acropolis_of_Athens
[r100-post]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[acropolis-img]: /assets/img/blog/2018/05/Acropolis_of_Athens.jpg

[piinguin]: https://github.com/snowplow-incubator/piinguin
[piinguin-relay-post]: UPDATE-THIS-LINK
[ico-lawful-basis]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/

[pii-enrichment]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment

[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[analytics-sdk]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK

[stream-enrich-pii-emit]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich/core/src/main/scala/com.snowplowanalytics.snowplow.enrich.stream/sources/Source.scala
[parent-event-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0
[pii-transformation-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/pii_enrichment/jsonschema/1-0-0

[kafka-testkit]: https://github.com/bfil/kafka-testkit
[pii-config-2-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0
[stream-enrich-config]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich/examples/config.hocon.sample
[r100-config]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/#pii-configure
[pii-enrich-wiki]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment
[config-stream-enrich]: https://github.com/snowplow/snowplow/wiki/Configure-Stream-Enrich

[issue-3648]: https://github.com/snowplow/snowplow/issues/3648
[issue-3636]: https://github.com/snowplow/snowplow/issues/3636

[stream-enrich-bintray]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.17.0#files

[r106-ms]: https://github.com/snowplow/snowplow/milestone/158
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151

[discourse]: http://discourse.snowplowanalytics.com/
