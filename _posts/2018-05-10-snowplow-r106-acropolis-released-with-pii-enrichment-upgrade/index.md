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

TODO: UPDATE TOC WITH SECTION FOR THE IMPORTANT BUG FIX.

1. [Overview of the new PII-related capabilities](#pii-capabilities)
2. [Emitting a stream of PII transformation events](#pii-events)
3. [Adding a salt for hashing](#pii-salt)
4. [IMPORTANT BUG FIX](pii-bugfix)
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

This stream of PII transformation events can then be used with the new Snowplow Piinguin project, which we will also briefly introduce in this blog post.

Although the new PII transformation event stream is only available for Snowplow real-time pipeline users, this release also brings two other PII-related updates which are available for both batch and real-time users:

* [Adding a salt for hashing](#pii-salt)
* [FIXING AN IMPORTANT BUG](#pii-bug)

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

Firstly, the `contexts` field in this new event contains a new event type called `parent_event` with a new [schema][parent-event-schema]. Here is an example of such an event:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      "schema": "com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0",
      "data": {
        "parentEventId": "a0f0213e-d514-44e5-8c3d-b1fba8c54f0f"
      }
    }
  ]
}
{% endhighlight %}

This context simply contains the UUID of the parent event where the PII enrichment was applied, giving one the opportunity to verify the enrichment.

<h3>Enabling the new event stream</h3>

In order to emit a stream of PII events the stream needs to exist for some configurations (e.g. Kinesis) and you will need to configure it in two places. This is covered in detail in the [upgrading](#upgrading) section below.

<h3>Using the new event stream</h3>

That capability has been harnessed in the [piinguin][piinguin] and [piinguin relay][piinguin-relay] projects to provide access back to the original PII data under the conditions required for [lawful basis for processing][ico-lawful-basis].

<h2 id="pii-salt">3. Adding a salt for hashing</h2>

In order to make it harder for the hashed data to be identified we have responded to community feedback and have added salt to the hashing pseudonymization as standard (thank you [falshparker82][falshparker82-issue]). Salt is simply a string that is appended to the end of the string that is going to be hashed, that makes it a lot harder, if not impossible, for someone to simply hash all the possible values of a field and try to match the hash to the pseudonymized values, thus providing an additional layer of protection for PII data.
The new setting is simply a new field in the configuration for the enrichment (see [adding salt][#pii-salt] and [upgrading][#upgrading]). The salt should remain secret in order to ensure that protection against brute-forcing the hashed values is achieved.

As mentioned above adding salt is simply achieved by adding a new field to the updated pii enrichment configuration. A fragment of that configuration would then look like this (see [upgrading][#upgrading] for a full example):

```json
"strategy": {
  "pseudonymize": {
    "hashFunction": "SHA-1",
    "salt": "pepper123"
  }
}
```
In this case the salt is simply set to the string `pepper123` which is the appended to every string before hashing.

*IMPORTANT* Please note that changing the salt will change the hash of the same value and joining with fields in the event store will become *much more* complicated.

<h2 id="pii-bugfix">4. IMPORTANT BUG FIX</h2>

KOSTAS TO ADD IN THIS SECTION.

<h2 id="other">5. Other changes</h2>

Other improvements that have been added to this release are:

* Automated code formatting for `stream-enrich` and
* Kafka integration test

Automated code formatting further improves the code quality of the repo and makes it easier for new contributors to adhere to the quality standards for Snowplow code.

The kafka integration test uses the example configuration that is included with `stream-enrich` and uses the excellent [kafka-testkit][kafka-testkit] to bring up a kafka broker to run the enrichment, thus extending test coverage and further improving the quality of the codebase.

<h2 id="upgrading">6. Upgrading</h2>

The latest version of Stream Enrich is available from our Bintray *UPDATE URL AFTER RELEASE* [here][stream-enrich-bintray].

 You will need to configure `emit` in the pii enrichment configuration, but you will also need to configure the `pii` field in the `stream-enrich` configurations. The two configuration fragments follow, however see [upgrading][#upgrading] for a complete example.

In the PII enrichment configuration [version 2-0-0][pii-config-2-schema] you will need to setup:

```
...
"emitEvent": true
...
```

In addition in the [stream enrich configuration][stream-enrich-config] you will need to set the name of the stream or topic:
```
pii = <name-of-the-stream-or-topic>
```


There are a few items of configuration that need to be updated in order to use the new capabilities. Those are:

* PII enrichment configuration (using [version 2-0-0][pii-config-2-schema])
* Stream enrich configuration
* Output stream must exist (if you have configured it)

<h3>PII enrichment configuration</h3>

Here is an example PII enrichment configuration:

```json
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

```
In the above example many items are familiar from [R100 Epidaurus configuration][r100-config] that used the 1-0-0 version of the configuration schema described also in detail on our [relevant wiki page][pii-enrich-wiki].

in brief the above configuration sets up the enrichment to hash the canonical `user_id` and `user_ipaddress` fields, and the JSON fields `unstruct_event` which contains externally sourced `mailchimp` events of a specific version, and within that version the `$.data.email` and `$.data.ip_opt` fields.

The *new items* are `emitEvent` which configures whether an event will be emitted or not, and `salt` that as [explained above][#pii-salt] sets up the salt that will be used.

<h3>Stream enrich configuration</h3>

An example configuration for `stream-enrich` may be:
```
enrich {

  streams {

    in {
      raw = my-good-input-stream
    }

    out {
      enriched = my-enriched-output-event-without-pii

      bad = my-events-that-failed-validation-during-enrichment

      pii = my-output-event-that-contains-only-pii

      partitionKey = ""
    }

    sourceSink {

      type =  'kinesis'

      region = 'eu-west-1'

      aws {
        accessKey = 12345BEEF=
        secretKey = 12345BEEF=
      }

      maxRecords = 100

      initialPosition = TRIM_HORIZON

      backoffPolicy {
        minBackoff = 1000
        maxBackoff = 10000
      }

      retries = 0

    }

    buffer {
      byteLimit = 100000
      recordLimit = 1000
      timeLimit = 1000
    }

    appName = "snowplow-stream-enrich"
  }
}
```

Most of the above configuration should be familiar for stream enrich users, and if not you can find more information on our [relevant wiki page][config-stream-enrich]

The only (optional) new entry is `pii` where all the pii data will be sent in the format outlined [above][#pii-event-stream].

<h3>Output stream</h3>

Finally if you have configured `emitEvent` and a `pii` stream you will need to configure a new stream (or topic), otherwise `stream-enrich` will fail. 

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
[piinguin-relay]: https://github.com/snowplow-incubator/snowplow-piinguin-relay
[ico-lawful-basis]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/

[pii-enrichment]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment

[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[analytics-sdk]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK

[stream-enrich-pii-emit]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich/core/src/main/scala/com.snowplowanalytics.snowplow.enrich.stream/sources/Source.scala
[parent-event-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/parent_event/jsonschema/1-0-0
[pii-transformation-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/pii_enrichment/jsonschema/1-0-0
[falshparker82-issue]: https://github.com/snowplow/snowplow/issues/3648
[kafka-testkit]: https://github.com/bfil/kafka-testkit
[pii-config-2-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/2-0-0
[stream-enrich-config]: https://github.com/snowplow/snowplow/tree/master/3-enrich/stream-enrich/examples/config.hocon.sample
[r100-config]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/#pii-configure
[pii-enrich-wiki]: https://github.com/snowplow/snowplow/wiki/PII-pseudonymization-enrichment
[config-stream-enrich]: https://github.com/snowplow/snowplow/wiki/Configure-Stream-Enrich

[stream-enrich-bintray]: https://bintray.com/snowplow/snowplow-generic/snowplow-stream-enrich/0.17.0#files

[r106-ms]: https://github.com/snowplow/snowplow/milestone/158
[r10x-str]: https://github.com/snowplow/snowplow/milestone/151

[discourse]: http://discourse.snowplowanalytics.com/
