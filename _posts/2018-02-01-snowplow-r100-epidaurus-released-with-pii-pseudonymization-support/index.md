---
layout: post
title: "Snowplow R100 Epidaurus released with PII pseudonymization support"
title-short: Snowplow R100 Epidaurus
tags: [pii, pseudonymization]
author: Kostas
category: Releases
permalink: /blog/2018/02/01/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
---

We are pleased to announce the release of [Snowplow R100 Epidaurus][release-notes]. This streaming pipeline
release adds support for pseudonomizing user PII (Personally Identifiable Information) through a new Snowplow enrichment.

We are initially adding this new PII Enrichment to the Snowplow streaming pipeline; extending this support to the batch pipeline will follow in due course.

Read on for more information on R100 Epidaurus, named after [an ancient city in Argolida, Greece][epidaurus] that features a magnificent theater with excellent acoustics:

<!--more-->
1. [What is PII, GDPR, pseudonymization, and why they are important?](#pii-define)
2. [PII Enrichment](#pii)
3. [How do I configure pseudonymization for my Snowplow data?](#pii-configure)
4. [Other changes](#other)
5. [New Iglu Central schemas](#schemas)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Help](#help)

![epidaurus][epidaurus-img]


<h2 id="pii-define">1. What is PII, GDPR, pseudonymization, and why they are important?</h2>

<h3>PII</h3>

The term PII originally appeared in the context of healthcare records since the early days of healthcare record keeping. It soon became evident that the accumulation of healthcare records had huge potential to promote population-level measures and very often there was public and research interest in such data. At the same time researches had to be careful to avoid releasing data that could uniquely identify an individual, hence the beginning of anonymization.

Nowadays, collecting and processing large amounts of information is increasingly within reach of even small organizations, with excellent tools, such as Snowplow supporting that process. Naturally, citizens and in turn governments became concerned that this information can be misused, and decided to give back some control to the subjects whose records were being kept (data subjects in EU law terms).

Just as the healthcare records were useful for population-level health studies, so is tracking behavior down to the individual event for any data-driven organization. In addition, just as health records need to be used an disseminated responsibly, analytics collected data need to also be used in a way that protects the identities of the data subjects.

<h3>GDPR</h3>

In the case of the European Union, which is usually a pioneer in the field of human rights protection, it was decided to enact a far-reaching regulation to replace previous directives. In terms of EU law, a regulation is much more specific and prescriptive and does not leave the implementation of that law up to the member states.

The official name of that regulation is the General Data Protection Regulation (GDPR) and there is a special EU site dedicated to informing citizens about it [here][gdpr-web]. It is noteworthy that the regulation applies to entities operating outside the EU under certain conditions as long as the data collected concerns the activities of an EU citizen or resident which have taken place in the EU. The regulation also provides for hefty fines and will become law in the EU after the 25th of May 2018.

<h3>Pseudonymization</h3>

Snowplow in order to help its clients and the open-source users to meet their obligations under GDPR, is providing a pseudonymization facility implemented as an enrichment. This is only the first of the features planned, to help Snowplow users meet their obligations under GDPR. Pseudonymization essentially means that the datum which can uniquely identify an individual is substituted by an alias.

Concretely, the user is able to configure any and all of the fields that they wish their values hashed within Snowplow. This is only an initial capability to help out users meet the requirements. Through hashing all the identifying fields the user can minimize the risk of identification of a data subject, and should therefore be a good way towards meeting their obligation as data handlers.

<h2 id="pii">2. PII Enrichment</h2>

This Snowplow release introduces the *PII Enrichment*, which provides capabilities for better handling the Personally Identifiable Information (PII) of end-users interacting with a Snowplow pipeline.

The PII pseudonymizer is intended to help our users better protect
the privacy rights of data subjects. Obligations of handlers of PII data have been outlined in the [EU General Data Protection Regulation site][gdpr-web].
This release is providing our users with a way to pseudonymize fields in either the built in Snowplow data structures,
or the user's custom structures.

In detail, the user can declare any of the Snowplow "POJO" fields (scalar fields that contain a single string value) from the [configuration schema][igc-schema] or any "JSON" path in the fields that contain a JSON string ("contexts", "derived_contexts" or "unstruct_event") as PII and have Snowplow pseudonymize them. In addition, the user needs to specify the "strategy" that will be used in the pseudonymization.

Currently the strategy that is implemented is hashing using one of the following algorithms:

* `MD2`, the 128-bit algorithm [MD2][md2] (not-recommended due to performance see [RFC6149][rfc6149])
* `MD5`, the 128-bit algorithm [MD5][md5]
* `SHA-1`, the 160-bit algorithm [SHA-1][sha-1]
* `SHA-256`, 256-bit variant of the [SHA-2][sha-2] algorithm
* `SHA-384`, 384-bit variant of the [SHA-2][sha-2] algorithm
* `SHA-512`, 512-bit variant of the [SHA-2][sha-2] algorithm

Further capabilities for the PII Enrichment are planned in the [second phase of this PII Enrichment][r10x-pii2].

<h2 id="pii-configure">3. How do I configure pseudonymization for my Snowplow data?</h2>

<h3>TL;DR</h3>

If you are familiar with Snowplow, you can simply skip ahead to the new iglu schema which specifies the configuration format (including all the fields) [here](#schemas) and onwards to the [upgrading](#upgrading) section where you can get the latest standalone, and docker artifacts and the Redshift migration schema.

<h3>Configuring the streaming pipeline</h3>

We will assume that you have already set-up a tracker as described [here][tracker-setup], and skip ahead to setting up a collector. If you haven't and you are comfortable with using the shell you could simply use curl to try out you your collector (next step).

<h4>Stream collector</h4>
One simple way of trialling the PII enrichment up and running is to setup a streaming pipeline. That consists of a stream collector, kinesis and stream enrich. Detailed instructions on how to setup the stream collector can be found [here][stream-collector-setting-up]. In short, you will need to run the newest stream collector using the latest collector artifact:
{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.12.0.zip
{% endhighlight %}

In order to run it you will need to:

<ol type="a">
<li>Have set-up the appropriate kinesis (kafka and NSQ are also supported) stream.</li>
<li>Obtain a sample configuration file from [here][sample-collector-config] and fill it in.</li>
<li>Finally run the collector using:</li>
</ol>

{% highlight bash %}
java -jar snowplow-stream-collector-0.12.0.jar --config my.conf
{% endhighlight %}


<h4>Stream enrich</h4>

Detailed instructions on how to setup stream enrich can be found as always in the [wiki][setup-stream-enrich]. If you have used Snowplow before, a new configuration file is needed which will follow the corresponding [iglu schema][igc-schema]. A sample instance is given below.

To setup stream enrich you will need:

<ol type="a">
<li>The name of the "good" stream that you configured above, which you will fill in:</li>
<li>The sample configuration file [here][sample-enrich-config]. You have to fill in all the relevant values there.</li>
<li>An instance of the PII enrichment configuration, conformant to the configuration schema [here][igc-schema].</li>
</ol>

<h5>Example configuration</h5>

You should add that configuration to a directory with the other enrichment configurations. In this example it was added to `se/enrichments` and it was called `pii.json`.

Example contents of `pii.json`:
```
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
        }
        {
          "json": {
            "field": "contexts",
            "schemaCriterion": "iglu:com.mailgun/message_clicked/jsonschema/1-0-*",
            "jsonPath": "$['ip','recipient']"
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

```

The above configuration is pertinent to a hypothetical pipeline that both tracks usage through both tracker protocol and a Mailgun webhook integration. In that hypothetical scenario that you have setup your tracker to send data to snowplow which includes the `user_id` and `user_fingerprint` fields, and in addition you have set-up the mailgun webhook integration (recently released [here][r97-knossos]); with the above configuration you are specifying that:

<ol type="a">
  <li>You wish for the `user_id` and `user_fingerprint` from the standard fields to be hashed (full list of fields [here][tracker-protocol] and supported fields for anonymization are [here][igc-schema]).</li>
  <li>You wish for the `ip` and `recipient` fields from the mailgun message clicked event to be hashed, but only if the schema version begins with `1-0-`</li>
  <li>You wish to use the `SHA-256` variant of the algorithm (see [PII Enrichment](#pii) and the [schema][igc-schema] for a full list of options)</li>
</ol>

You can easily check whether your own configuration instance conforms to the schema by using this [tool][schema-validator] and the [schema][igc-schema].

<h5>Execution</h5>

Finally you will have to run enrich like so:

{% highlight bash %}

java -jar se/snowplow-stream-enrich-0.14.0-rc1.jar --config se/config.hocon --resolver file:se/resolver.json --enrichments file:se/enrichments

{% endhighlight %}

<h4>Redshift</h4>

If you were already using Snowplow with Redshift as a storage target the existing columns need to be widened and we have created a [migration script][rs-migration] for that purpose.

To use it you simply run it with psql like so:

{% highlight bahs %}
psql -h <host_enpoint> -p 5439 -d <name_of_the_database> -U <username> -f migrate_0.9.0_to_0.10.0.sql
{% endhighlight %}


<h2 id="other">4. Other changes</h2>

Other changes include widening the labels in Redshift to support the pseudonymization hashes where that was needed to support pseudonymization. We also widened the "se_label" field in Redshift to support URLs. 

Finally, we continued improving the quality of our codebase by using automated code formatting, which will greatly help new contributors to the project meet our high quality standards.

<h2 id="schemas">5. New Iglu Central schemas</h2>

There is [a new Iglu schema][igc-schema] that specifies the configuration format for PII enrichment.

<h2 id="upgrading">6. Upgrading</h2>

The updated Stream Enrich artifact for R100 Epidaurus is available at the following location:

{% highlight bash %}
http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.14.0.zip
{% endhighlight %}

Docker images for this new artifact will follow shortly, and the instructions for using them can be found [here][docker-instructions].

If you are using Redshift as a storage target, it is important to update the `atomic.events` table, so that the new fields will fit using:
[a migration script][rs-migration].

<h2 id="roadmap">7. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R10x [BAT] Priority fixes, part 1][r10x-bat-prio1], various stability, security and data quality improvements for the batch pipeline
* [R10x [STR] GCP support, part 1][r10x-gcp], our first release towards letting you run the Snowplow realtime pipeline on Google Cloud Platform per our [GCP RFC][gcp-rfc]
* [R10x [BAT] Priority fixes, part 2][r10x-bat-prio2], further stability, security and data quality improvements for the batch pipeline

We are also hard at work on a [second phase of this PII Enrichment][r10x-pii2], which will allow you to safely capture the original PII values which have been pseudonomized, ready for secure and audited de-anonymization on a case-by-case basis.

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[gdpr-web]: https://www.eugdpr.org/
[igc-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.enrichments/pii_enrichment_config/jsonschema/1-0-0

[md2]: https://en.wikipedia.org/wiki/MD2_(cryptography)#MD2_hashes
[md5]: https://en.wikipedia.org/wiki/MD5#MD5_hashes
[sha-1]: https://en.wikipedia.org/wiki/SHA-1#Example_hashes
[sha-2]: https://en.wikipedia.org/wiki/SHA-2#Comparison_of_SHA_functions
[rfc6149]: https://tools.ietf.org/html/rfc6149

[epidaurus]: https://en.wikipedia.org/wiki/Epidaurus
[epidaurus-img]: /assets/img/blog/2018/02/epidaurus.jpg
[rs-migration]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.9.0_to_0.10.0.sql

[gcp-rfc]: https://discourse.snowplowanalytics.com/t/porting-snowplow-to-google-cloud-platform/1505

[r10x-gcp]: https://github.com/snowplow/snowplow/milestone/138
[r10x-bat-prio1]: https://github.com/snowplow/snowplow/milestone/155
[r10x-bat-prio2]: https://github.com/snowplow/snowplow/milestone/145
[r10x-pii2]: https://github.com/snowplow/snowplow/milestone/153

[release-notes]: https://github.com/snowplow/snowplow/releases/tag/r100-epidaurus
[discourse]: http://discourse.snowplowanalytics.com/
[docker-instructions]: https://github.com/snowplow/snowplow/wiki/snowplow-docker-setup
[stream-collector-setting-up]: https://github.com/snowplow/snowplow/wiki/Setting-up-the-Scala-Stream-Collector
[sample-collector-config]: https://raw.githubusercontent.com/snowplow/snowplow/master/2-collectors/scala-stream-collector/examples/config.hocon.sample
[sample-enrich-config]: https://raw.githubusercontent.com/snowplow/snowplow/master/3-enrich/stream-enrich/examples/config.hocon.sample
[setup-stream-enrich]: https://github.com/snowplow/snowplow/wiki/setting-up-stream-enrich
[tracker-setup]: https://github.com/snowplow/snowplow/wiki/Setting-up-a-Tracker
[schema-validator]: https://json-schema-validator.herokuapp.com
[r97-knossos]: https://snowplowanalytics.com/blog/2017/12/18/snowplow-r97-knsossos-released/#mailgun
[tracker-protocol]: https://snowplowanalytics.com/blog/2017/12/18/snowplow-r97-knsossos-released/#mailgun
