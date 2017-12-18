---
layout: post
title-short: Snowplow R97 Knossos
title: "Snowplow R97 Knossos released with support for four new webhooks"
tags: [webhook, mailgun, unbounce, olark, statusgator]
author: Kostas
category: Releases
permalink: /blog/2017/12/18/snowplow-r97-knsossos-released/
---

We are excited to announce the release of [Snowplow R97 Knossos][snowplow-release], named [Knossos][knossos] (Greek: Κνωσός) after the palace at the nexus of the Minoan civilization, which was one of the earliest major Grecian civilizations (17th century BCE).

This release is primarily about supporting four new webhook sources, but it also contains other small improvements for the Snowplow batch pipeline. We are initially adding support for these webhooks to the batch pipeline; support for these webhooks in the real-time pipeline will follow shortly.

Specifically, the four new services from which Snowplow can now receive events are:

- **Mailgun** - for tracking email and email-related events delivered by [Mailgun][mailgun-website]
- **Olark** - for chat transcript events from [Olark][olark-website]
- **StatusGator** - for cloud service availability events from hundreds of services from [StatusGator][statusgator-website]
- **Unbounce** - for lead generation events from [Unbounce][unbounce-website]

Many thanks to previous Snowplow intern [Ronny Yabar][ronnyml] for breaking ground on these webhooks for us!

Read on for more information:

1. [Mailgun webhook support](#mailgun)
2. [Olark webhook support](#olark)
3. [StatusGator webhook support](#statusgator)
4. [Unbounce webhook support](#unbounce)
5. [EmrEtlRunner improvements](#eer)
6. [Other changes](#other)
7. [Upgrading](#upgrading)
8. [Roadmap](#roadmap)
9. [Help](#help)

<!--more-->

![Knossos][minoan-horns]

<h2 id="mailgun">1. Mailgun webhook support</h2>

The Mailgun webhook adapter lets you track email and email-related events delivered by [Mailgun][mailgun-website]. Using this functionality, you can warehouse all email-related events alongside your existing Snowplow events.

For help setting up the Mailgun webhook, check out the [Mailgun webhook setup][mailgun-setup] page.

All the currently documented Mailgun events are supported by this release: bounce, deliver, drop, spam, unsubscribe, click, and open events.

For technical details, see the [Mailgun webhook documentation][mailgun-techdoc] page.

<h2 id="olark">2. Olark webhook support</h2>

The Olark webhook adapter lets you receive the transcripts of chats on you website, including messages that you received when a support representative was not online, using [Olark][olark-website]. Using this functionality, you can track and analyse chat activity alongside your other Snowplow data.

For help setting up the Olark webhook, see the [Olark webhook setup][olark-setup] page.

<h2 id="statusgator">3. StatusGator webhook support</h2>

StatusGator lets you track the availability of hundreds of SaaS and other cloud services that you may be relying on. Using the webhook integration with [StatusGator][statusgator-website], you can collect availability events and use them to find correlations with other activity in your Snowplow data (e.g. elevated error rates in your website).

You could also use this webhook to provide alerts to your operations team, writing an AWS Lambda function or similar to emit alerts if specific cloud services experience outages.

For help setting up the StatusGator webhook, refer to [StatusGator webhook guide][statusgator-setup].

<h2 id="unbounce">4. Unbounce webhook support</h2>

Using the [Unbounce][unbounce-website] service you can experiment with different landing pages and variants thereof; Unbounce is a popular tool for lead generation and conversion rate optimization (CRO). Using the Unbounce webhook you can now integrate your lead generation data with the rest of the Snowplow data.

For help setting up the Unbounce webhook, refer to [Unbounce webhook guide][unbounce-setup].

<h2 id="eer">5. EmrEtlRunner improvements</h2>

<h3 id="gzip">5.1 Uncompressing raw gzipped files</h3>

We have modified [the S3DistCp EMR step][s3-dist-cp] which copies the raw gzipped log files produced by the
Clojure Collector from S3 to HDFS - this step will now uncompress the files in transit. This modification
greatly improves performance of the Spark Enrich job as gzipped files are not splittable and are
consequently processed on the same core in their entirety.

This change represents a significant speedup in the performance of our Spark Enrich job when working with large gzipped files emitted by the Clojure Collector. This optimization is only enabled for the specific pairing of Spark Enrich (not Hadoop Enrich) and the Clojure Collector (not our other collectors).

<h3 id="consistency">5.2 Skipping RDB Loader consistency checks</h3>

By default, RDB Loader performs S3-level consistency checks, checking the files for atomic events and shredded types
over time, to ensure that Amazon S3's infamous eventual consistency issue is not going to confound the load.

The problem is that these checks are linearly correlated with the cardinality of shredded types; as a result, pipelines with a wide array of shredded types are disproportionately affected by this check.

To reduce friction for such pipelines, it is now possible to skip the S3 consistency checks performed by RDB Loader, using a new EmrEtlRunner `--skip` option:

{% highlight bash %}
./snowplow-emr-etl-runner run -c config config.yml -r resolver.json --skip consistency_check
{% endhighlight %}

Be aware that this option requires a RDB Loader version greater or equal to 0.13.0.

<h2 id="upgrading">6. Other changes</h2>

In addition to the above we have made the following changes:

* Adding functionality to default the port to 443 when reading a log line with HTTPS scheme. Many thanks to [Mike Robins][miike] for this contribution ([#3483][issue-3483])
* Tolerating a content-type being set for GET requests sent to Clojure Collector (where previously the content-type had to be empty) ([#2743][issue-2743])
* Upgrading the dependency on user-agent-utils to version 1.20 ([#2930][issue-2930])
* Plus a host of updates to our Spark Enrich and Scala Common Enrich test suites to make running these tests easier and more predictable

<h2 id="upgrading">7. Upgrading</h2>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

To benefit from the new webhook integrations, you'll need to bump the Spark Enrich version used in
the EmrEtlRunner configuration file:

{% highlight yaml %}
enrich:
  version:
    spark_enrich: 1.11.0      # WAS 1.10.0
{% endhighlight %}

For a complete example, see our sample [`config.yml`][config-yml] template.

<h2 id="roadmap">8. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R98 Argentomagus][r9x-str-quality], improving security and data resilience for the real-time pipeline. This release will also add R97's new webhooks to the RT pipeline
* [R9x [BAT] Priority fixes][r9x-bat-quality], which will include resilience, security and data-quality fixes for the AWS batch pipeline
* [GDPR support part 1][gdpr-support], which will include data privacy features as mandated by the new [EU General Data Protection Regulation][eugdpr-website].

<h2 id="help">9. Getting Help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r97-knossos

[discourse]: http://discourse.snowplowanalytics.com/

[knossos]: https://en.wikipedia.org/wiki/Knossos
[minoan-horns]: /assets/img/blog/2017/11/Minoan_Horns_of_Consecration_Restoration_Knossos.jpg

[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[gdpr-support]: https://github.com/snowplow/snowplow/milestone/149
[eugdpr-website]: http://www.eugdpr.org/

[ronnyml]: https://github.com/ronnyml
[miike]: https://github.com/miike

[issue-2743]: https://github.com/snowplow/snowplow/issues/2743
[issue-2930]: https://github.com/snowplow/snowplow/issues/2930
[issue-3483]: https://github.com/snowplow/snowplow/issues/3483

[mailgun-website]: https://www.mailgun.com
[mailgun-setup]: https://www.mailgun.com/your-guide-to-webhooks
[mailgun-techdoc]: https://documentation.mailgun.com/en/latest/api-webhooks.html

[olark-website]: https://www.olark.com/
[olark-setup]: https://www.olark.com/integrations/webhooks

[statusgator-website]: https://statusgator.com/
[statusgator-setup]: https://blog.statusgator.com/introducing-web-hooks/

[unbounce-website]: https://unbounce.com
[unbounce-setup]: https://documentation.unbounce.com/hc/en-us/articles/203510044-Using-a-Webhook

[s3-dist-cp]: http://docs.aws.amazon.com/emr/latest/ReleaseGuide/UsingEMR_s3distcp.html
[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r97_knossos.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r90-lascaux/3-enrich/emr-etl-runner/config/config.yml.sample
