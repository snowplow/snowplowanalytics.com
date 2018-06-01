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

This release brings some important improvements to the PII Enrichment first released in [R100 Epidaurus][r100-post].

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

With this current release, users of Snowplow real-time now have the capacity to configure a stream of events which contain the hashed values, alongside their original values. You can think of these pairs as conceptually similar to:

{% highlight bash %}
"d4bd092ce3df26df6f492296ef8e4daf71be4ac9" -> "10.0.2.1"
{% endhighlight %}

This stream of PII transformation events can then be used with the new Snowplow Piinguin project, which we also briefly introduce in this blog post.

Although the new PII transformation event stream is only available for Snowplow real-time pipeline users, this release also heralds two PII-related updates which are available for both batch and real-time users:

* [Adding a salt for hashing](#salt)

Let's discuss each of the new capabilities in turn.

<h2 id="pii-events">2. Emitting a stream of PII transformation events</h2>

The PII event stream is a configurable, optional stream of events from the PII enrichment that contain the original hashed and original values. When enabled and configured, it emits a pii event for each event that was pseudonymized in the PII enrichment, containing the original and hashed values. The emitted event is a standard *Enriched Event* formatted event (i.e. TSV) as described in [Canonical event model][canonical-event-model] so that it can be used with the [snowplow analytics SDK][analytics-sdk]. For the implementation details please look at the source code [here][stream-enrich-pii-emit], however there are a couple of fields of particular interest, namely the `contexts` and `unstruct_event`:

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

This event simply contains the UUID of the parent event where the PII enrichment was applied, giving one the opportunity to verify the enrichment.

The second field of note is the `unstruct_event` field that follows the new [pii-transformation event schema][pii-transformation-schema]. An instance of that event could look like this (depending on the fields configured):

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0",
  "data": {
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
}
{% endhighlight %}

In this example there are a few things going on. The PII enrichment was configured to pseudonymize the canonical fields: `user_fingerprint`, `user_ipaddress` and `user_id` and the event contains their original and modified values. In addition, it was configured to pseudonymize fields from the `unstruct_event` and `contexts` fields which are JSON formatted strings. As in the canonical case the event contains the original and modified values, but in addition it contains the schema iglu URL and the JSON path corresponding to it as in the case of `contexts` there could be any number of substitutions depending on the path and schema matches. Finally the strategy and in this case the hashing algorithm version is also given. What is not emitted is the `salt` that was used in the hashing (see [salt][#salt] below).

In order to emit a stream of PII events the stream needs to exist for some configurations (e.g. Kinesis) and you will need to configure it in two places. You will need to configure `emit` in the pii enrichment configuration, but you will also need to configure the `pii` field in the `stream-enrich` configurations. The two configuration fragments follow, however see [upgrading][#upgrading] for a complete example.

In the PII enrichment configuration [version 2-0-0][pii-config-2-schema] you will need to setup:

```json
...
"emitEvent": true
...
```

In addition in the [stream enrich configuration][stream-enrich-config] you will need to set the name of the stream or topic:

```bash
pii = <name-of-the-stream-or-topic>
```

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

There was a known issue in one of the underlying libraries that we believed to be harmless, but turned out to cause problems downstream in the pipeline. 

The problem can cause good events to end up in the bad bucket under certain conditions explained below.

The issue as described [here][issue3636] was that
when the user has configured PII to hash a JSON type field with a json path containing an array of fields like so:

```json
...
{
  "json": {
    "field": "unstruct_event",
    "schemaCriterion": "iglu:com.acme/event/jsonschema/1-0-0",
    "jsonPath": "$.['email', 'username']"
  }
}
...
```

in events that did not contain both fields, the hashed output would correctly hash the existent one, but it would also create the one that did not exist as an empty object, so the enriched event would contain an output like so

```json
{
  "schema": "iglu:com.acme/event/jsonschema/1-0-0",
  "data": {
    ... non-hashed fields unaffected
    "email": "764e2b5c4da5267efd84ab24a86539dfc85031c4",
    "username": {}
  }
}

```

The problem with that event is that it can fail validation downstream depending on the schema `iglu:com.acme/event/jsonschema/1-0-0`.

Concretely, if the fields `email` and `username` in the schema `iglu:com.acme/event/jsonschema/1-0-0` are both optional and only allowed to be strings, then in the case that one of the fields is not there in one event,
the event will end up in the `bad` bucket during shredding.

In order to get this bug fix, if you are a Stream Enrich user you need to upgrade `stream-enrich` as explained in [upgrading][#upgrading].

For batch pipeline users you can upgrade by updating your EmrEtlRunner configuration
to the following:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.14.0 # WAS 1.13.0
{% endhighlight %}

or directly making use of the new Spark Enrich available at:

`s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.14.0.jar`

<h2 id="other">5. Other changes</h2>

Other improvements that have been added to this release are:

* Automated code formatting for `stream-enrich` and
* Kafka integration test

Automated code formatting further improves the code quality of the repo and makes it easier for new contributors to adhere to the quality standards for Snowplow code.

The kafka integration test uses the example configuration that is included with `stream-enrich` and uses the excellent [kafka-testkit][kafka-testkit] to bring up a kafka broker to run the enrichment, thus extending test coverage and further improving the quality of the codebase.

<h2 id="upgrading">6. Upgrading</h2>

The latest version of Stream Enrich is available from our Bintray *UPDATE URL AFTER RELEASE* [here][stream-enrich-bintray].

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

```hocon
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
[issue3636]: https://github.com/snowplow/snowplow/issues/3636
