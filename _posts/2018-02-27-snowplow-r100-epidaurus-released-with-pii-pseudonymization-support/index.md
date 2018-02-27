---
layout: post
title: "Snowplow R100 Epidaurus released with PII pseudonymization support"
title-short: Snowplow R100 Epidaurus
tags: [pii, pseudonymization]
author: Kostas
category: Releases
permalink: /blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
---

We are pleased to announce the release of [Snowplow R100 Epidaurus](https://github.com/snowplow/snowplow/releases/tag/r100-epidaurus). This streaming pipeline
release adds support for pseudonomizing user PII (Personally Identifiable Information) through a new Snowplow enrichment.

We are initially adding this new PII Enrichment to the Snowplow streaming pipeline; extending this support to the batch pipeline will follow in due course.

Read on for more information on R100 Epidaurus, named after [an ancient city in Argolida, Greece][epidaurus] that features a magnificent theater with excellent acoustics:

<!--more-->
1. [What are PII, GDPR, and pseudonymization, and why they are important?](#pii-define)
2. [PII Enrichment](#pii-enrichment)
3. [Pseudonymizing your Snowplow events](#pii-configure)
4. [Other changes](#other)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Help](#help)

![epidaurus][epidaurus-img]

<h2 id="pii-define">1. What are PII, GDPR, and pseudonymization, and why they are important?</h2>

<h3>PII</h3>

The term [Personally identifiable information][pii-def] originated in the context of healthcare record keeping. It soon became evident that the accumulation of healthcare records had huge potential to promote population-level measures, and very often there was public and research interest in such data. At the same time, researchers had to be careful to avoid releasing data that could uniquely identify an individual, hence the emergence of various strategies for *PII anonymization*.

Nowadays, collecting and processing large amounts of PII is increasingly within reach of even small organizations across every sector, thanks to powerful platforms such as Snowplow. Naturally, citizens and in turn governments have become concerned that this information can be misused, and opted to give back some control to the people whose records were being kept ("data subjects" in EU law terms).

Just as the healthcare records were useful for population-level health studies, so is tracking user behavior down to the level of the individual event useful for any data-driven organization. And just as health records need to be used and disseminated responsibly, so data scientists and analysts need to use event- and customer-level data in a way that protects the rights and identities of data subjects.

<h3>GDPR</h3>

The European Union, often a pioneer in the field of human rights protection, has decided to enact a far-reaching regulation to replace previous digital privacy directives. In terms of EU law, a regulation is much more specific and prescriptive than a directive, and does not leave the implementation of that law up to the member states.

The official name is the General Data Protection Regulation (GDPR), and you'll find plenty of information about it on a [dedicated EU website][gdpr-web]. It is noteworthy that the regulation applies to entities operating outside the EU, if the data collected concerns the activities of an EU citizen or resident which have taken place in the EU. The regulation also provides for hefty fines, and will become law in the EU after the 25th of May 2018.

<h3>Pseudonymization</h3>

To help you meet your obligations under GDPR, in this release we are providing a *pseudonymization* facility, implemented as a Snowplow pipeline enrichment. This is only the first of many features planned to help Snowplow users meet their obligations under GDPR. Pseudonymization essentially means that a datum which can uniquely identify an individual, or betray sensitive information about that individual, is substituted by an alias.

Concretely, the Snowplow operator is able to configure any and all of the fields whose values they wish to have hashed by Snowplow. Through hashing all the PII fields found within Snowplow events, you can minimize the risk of identification of a data subject - an important step towards meeting your obligations as data handlers.

<h2 id="pii-enrichment">2. PII Enrichment</h2>

This Snowplow release introduces the *PII Enrichment*, which provides capabilities for Snowplow operators to better protect the privacy rights of data subjects. The obligations of handlers of Personally Identifiable Information (PII) data under GDPR have been outlined on the [EU GDPR website][gdpr-web].

This initial release of the PII Enrichment provides a way to *pseudonymize* fields within Snowplow enriched events. You can configure the  enrichment to pseudonymize any of the following datapoints:

1. Any of the "first-class" fields which are part of the [Canonical event model][canonical-event-model], are scalar fields containing a single string and have been identified as being potentially sensitive
2. Any of the properties within the JSON instance of a Snowplow self-describing event or context (wherever that context originated). You simply specify the Iglu schema to target and a [JSON Path][json-path] to identify the property or properties within to pseudonomize

In addition, you must specify the "strategy" that will be used in the pseudonymization. Currently the available strategies involve *hashing* the PII, using one of the following algorithms:

* `MD2`, the 128-bit algorithm [MD2][md2] (not-recommended due to performance reasons see [RFC6149][rfc6149])
* `MD5`, the 128-bit algorithm [MD5][md5]
* `SHA-1`, the 160-bit algorithm [SHA-1][sha-1]
* `SHA-256`, 256-bit variant of the [SHA-2][sha-2] algorithm
* `SHA-384`, 384-bit variant of the [SHA-2][sha-2] algorithm
* `SHA-512`, 512-bit variant of the [SHA-2][sha-2] algorithm

There is [a new Iglu schema][pii-config-schema] that specifies the configuration format for the PII Enrichment.

Further capabilities for the PII Enrichment, including the ability to reverse pseudonymization in a controlled way, are planned for the [second phase of this PII Enrichment][r10x-pii2].

<h2 id="pii-configure">3. Pseudonymizing your Snowplow events</h2>

<h3>Before you start</h3>

This brief tutorial assumes that you have gone through the [upgrading](#upgrading) section below, [deploying the latest version of Stream Enrich][setup-stream-enrich] and upgrading your Redshift `events` table definition.

<h3>Configuring the PII Enrichment</h3>

Like all Snowplow enrichments, the PII Enrichment is configured using a JSON document which conforms to a JSON Schema, the [pii_enrichment_config][pii-config-schema], available in Iglu Central.

Here is an example configuration:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/1-0-0",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "pii_enrichment_config",
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
            "field": "user_fingerprint"
          }
        },
        {
          "json": {
            "field": "unstruct_event",
            "schemaCriterion": "iglu:com.mailchimp/subscribe/jsonschema/1-0-*",
            "jsonPath": "$.data.['email', 'ip_opt']"
          }
        }
      ],
      "strategy": {
        "pseudonymize": {
          "hashFunction": "SHA-256"
        }
      }
    }
  }
}
{% endhighlight %}

You should add that configuration to a directory with the other enrichment configurations. In this example it was added to `se/enrichments` and it was called `pii_enrichment_config.json`. The above example and other enrichment configurations can be found as always in the [example configurations][gh-example-configs] on github.

The configuration above is for a Snowplow pipeline that is receiving events from the Snowplow JavaScript Tracker, plus a Mailchimp webhook integration:

* The Snowplow JavaScript Tracker has been configured to emit events which includes the `user_id` and `user_fingerprint` fields
* The Mailchimp webhook (available since [release 0.9.11][release-0.9.11]) is emitting `subscribe` events (among other events, ignored for the purpose of this example)

With the above PII Enrichment configuration, then, you are specifying that:

* You wish for the `user_id` and `user_fingerprint` from the Snowplow Canonical event model fields to be hashed (the full list of supported fields for pseudonymization is viewable [in the enrichment configuration schema][pii-config-schema])
* You wish for the `data.email` and `data.ip_opt` fields from the Mailchimp `subscribe` event to be hashed, but only if the schema version begins with `1-0-`
* You wish to use the `SHA-256` variant of the algorithm for the pseudonymization

You can easily check whether your own configuration instance conforms to the schema by using this [tool][schema-validator] alongside the [schema][pii-config-schema].

<h3>Execution</h3>

As usual, you would run Stream Enrich like so:

{% highlight bash %}
java -jar se/snowplow-stream-enrich-0.14.0.jar --config se/config.hocon --resolver file:se/resolver.json --enrichments file:se/enrichments
{% endhighlight %}

Where your `pii_enrichment_config.json` configuration JSON is found in the `se/enrichments` folder.

The enriched events emitted by Stream Enrich will then have the values corresponding to the above PII pseudonymized using SHA-256.


<h3>A warning about JSON Schema validation of pseudonymized values</h3>


One note of caution: always check the underlying JSON Schema to avoid accidentally invalidating an entire event using the PII Enrichment. Specifically, you should check the field definitions of the fields for any constraints that hold under plaintext but not when the field is hashed, such as field length and format.

The scenario to avoid is as follows:

* You have a `customerEmail` property in a JSON Schema which must validate with `format: email`
* You apply the PII Enrichment to hash that field
* The enriched event *is* successfully emitted from Stream Enrich...
* **However**, a downstream process (e.g. RDB Shredder) which validates the now-pseudonymized event will **reject** the event, as the hashed value is no longer in an email format

The same issue can happen with properties with enforced string lengths - note that all of the currently supported pseudonymization functions  will generate hashes of up to **128 characters** (in the case of SHA-512); be careful if the JSON Schema enforces a shorter length, as again the event will fail downstream validation.

We are exploring ways of avoiding this issue, potentially via a dedicated "pii" annotation within JSON Schema (see [issue #860][issue-860] for more details).

<h2 id="other">4. Other changes</h2>

In order to support the replacing of original field values with pseudonymization hashes, we have had to widen various columns in the Redshift `atomic.events` table ([issue #3528][issue-3528]). At the same time, we also widened the "se_label" field in Redshift to support URLs.

Finally, we continue to improve the quality of our codebase by using [scalafmt][scalafmt] automated code formatting, which will greatly help new contributors to the project meet our high quality standards. You can see the standards we applied in [issue #3496][issue-3496].

<h2 id="upgrading">5. Upgrading</h2>

<h3>Stream Enrich</h3>

The updated Stream Enrich artifact for R100 Epidaurus is available at the following location:

{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.14.0.zip
{% endhighlight %}

Docker images for this new artifact will follow shortly; the instructions for using them can be found [here][docker-instructions].

<h3>Redshift</h3>

If you were already using Snowplow with Redshift as a storage target, the existing columns need to be widened as discussed above. We have created a [migration script][rs-migration] for this purpose.

To use it you simply run it with psql like so:

{% highlight bash %}
psql -h <host_enpoint> -p 5439 -d <name_of_the_database> -U <username> -f migrate_0.9.0_to_0.10.0.sql
{% endhighlight %}

<h2 id="roadmap">6. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R10x [BAT] Priority fixes, part 1][r10x-bat-prio1], various stability, security and data quality improvements for the batch pipeline
* [R10x [STR] GCP support, part 1][r10x-gcp], our first release towards letting you run the Snowplow realtime pipeline on Google Cloud Platform per our [GCP RFC][gcp-rfc]
* [R10x [BAT] Priority fixes, part 2][r10x-bat-prio2], further stability, security and data quality improvements for the batch pipeline

We are also hard at work on a [second phase of this PII Enrichment][r10x-pii2], which will allow you to safely capture the original PII values which have been pseudonomized, ready for secure and audited de-anonymization on a case-by-case basis.

<h2 id="help">7. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].


[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r100-epidaurus






[gdpr-web]: https://www.eugdpr.org/
[pii-config-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/1-0-0
[json-path]: https://github.com/json-path/JsonPath

[md2]: https://en.wikipedia.org/wiki/MD2_(cryptography)#MD2_hashes
[md5]: https://en.wikipedia.org/wiki/MD5#MD5_hashes
[sha-1]: https://en.wikipedia.org/wiki/SHA-1#Example_hashes
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions
[rfc6149]: https://tools.ietf.org/html/rfc6149



[pii-def]: https://en.wikipedia.org/wiki/Personally_identifiable_information

[epidaurus]: https://en.wikipedia.org/wiki/Epidaurus
[epidaurus-img]: /assets/img/blog/2018/02/epidaurus.jpg
[rs-migration]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.9.0_to_0.10.0.sql

[gcp-rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-google-cloud-platform/1505

[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model

[scalafmt]: http://scalameta.org/scalafmt/
[issue-860]: https://github.com/snowplow/snowplow/issues/860
[issue-3528]: https://github.com/snowplow/snowplow/issues/3528
[issue-3496]: https://github.com/snowplow/snowplow/issues/3496

[r10x-gcp]: https://github.com/snowplow/snowplow/milestone/138
[r10x-bat-prio1]: https://github.com/snowplow/snowplow/milestone/155
[r10x-bat-prio2]: https://github.com/snowplow/snowplow/milestone/145
[r10x-pii2]: https://github.com/snowplow/snowplow/milestone/153

[discourse]: http://discourse.snowplowanalytics.com/
[docker-instructions]: https://github.com/snowplow/snowplow/wiki/snowplow-docker-setup
[stream-collector-setting-up]: https://github.com/snowplow/snowplow/wiki/Setting-up-the-Scala-Stream-Collector
[sample-collector-config]: https://raw.githubusercontent.com/snowplow/snowplow/master/2-collectors/scala-stream-collector/examples/config.hocon.sample
[sample-enrich-config]: https://raw.githubusercontent.com/snowplow/snowplow/master/3-enrich/stream-enrich/examples/config.hocon.sample
[setup-stream-enrich]: https://github.com/snowplow/snowplow/wiki/setting-up-stream-enrich
[tracker-setup]: https://github.com/snowplow/snowplow/wiki/Setting-up-a-Tracker
[schema-validator]: https://json-schema-validator.herokuapp.com

[release-0.9.11]: https://snowplowanalytics.com/blog/2014/11/10/snowplow-0.9.11-released-with-webhook-support/#mailchimp
[gh-example-configs]: https://github.com/snowplow/snowplow/blob/master/3-enrich/config/enrichments/
