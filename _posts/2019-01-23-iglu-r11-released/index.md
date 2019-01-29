---
layout: post
title: Iglu R11 Capul de bour released
title-short: Iglu R11 Capul de bour
tags: [iglu, json, json schema, registry, schema registry]
author: Anton
category: Releases
permalink: /blog/2019/01/23/iglu-r11-capul-de-bour-released/
---

We are excited to announce the release of Iglu R11 Capul de bour, with more helpful linter messages and improved functionality in both Iglu Server and the core libraries.

1. [Improved linter messages](#schema-workflow-simplified)
2. [Improvements to Iglu Server](#server-improvements)
3. [Improvements to the core libraries](#core-improvements)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Getting help](#help)

Read on for more information about Release 11 Capul de bour, named after [the series of first postage stamps of Romania][capul-de-bour].

![capul-de-bour-img][capul-de-bour-img]

<!--more-->

<h2 id="schema-workflow-simplified">1. Improved linter messages</h2>

Since its inception, it has been possible to use `igluctl` to check a static schema registry for many kinds of inconsistencies in JSON schemas that cannot be handled by [JSON meta schema][json-metaschema], such as `minimum` value greater than `maximum` or a set of string-specific properties in a field with non-string type.

However, when users were presented with error messages from the linter, they often found it hard to identify the source fo the error, because messages produced by `igluctl` did not contain any references to the field in the JSON schema, or the line number.
Now `igluctl` groups problematic issues by their types and adds corresponding [JSON Pointers][json-pointers] to facilitate localization of problematic property.

Here's an example output for problematic schema with three discovered issues:

```
WARNING: Schema [com.apple/notification_event/jsonschema/1-0-0] contains 3 following issues:
1. Following numeric properties are unbounded (add --skip-checks numericMinMax to omit this check):
 - /properties/notification
 - /properties/notification/properties/badge
2. Following optional properties don't allow null type (add --skip-checks optionalNull to omit this check):
 - /properties/notification     Use "type: null" to indicate a field as optional for properties subtitle,launchImageName,userInfo,sound,badge,attachments
threadId
3. Following string properties provide no clues about maximum length (add --skip-checks stringLength to omit this check):
 - /properties/notification/properties/userInfo/properties/aps/properties/alert
```

As well as introducing JSON Pointers, we have also improved the issue descriptions provided to hopefully make it easier to understand what they mean and how to fix them.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

The most significant update to Iglu Server in this release is the introduction of new validation semantics. These are exactly the same as those provided in `igluctl`: they both use the same Schema DDL library to power them.

Iglu Server exposes a new `validate` API:

{% highlight bash %}
$ curl -X POST "http://iglu.acme.com/api/validate/jsonschema"
    \ -H  "accept: application/json"
    \ -H  "Content-Type: application/json" \
    -d '{"type": "object", "additionalProperties": true}'
{% endhighlight %}

This should produce a detailed linting output in JSON format, preserving JSON Pointers already mentioned in `igluctl` section and corresponding messages.

In addition, we have improved all output messages by removing the redundant `status` property from response's body and standardizing all dates outputed on [ISO 8601][iso-8601].

From infrastructure point of view, we embedded building a docker image into release process, so the `snowplow-docker-registry.bintray.io/snowplow/iglu-server` image should be available immediately after release.

<h2 id="core-improvements">3. Improvements to the core libraries</h2>

Both core libraries, Schema DDL and Iglu Core, have received updates as well.

Among many dependency bumps (such as [circe][circe] to 0.10.1 and Scala to 2.12.8) Schema DDL got new functionality that supports JSON Pointers in `igluctl` along with more type-safe and lossless API for AST generation.

Also as our company-wide effort, we've finished the internal migrations from [scalaz][scalaz] to [cats][cats] and from [json4s][json4s] to [circe][circe].

<h2 id="upgrading">4. Upgrading</h2>

<h3 id="upgrade-iglu-server">4.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [Bintray][iglu-server-download].

Unzip the compressed file and you can launch the server with the following command:

{% highlight bash %}
$ java -jar $JAR_PATH --config $CONFIG_PATH
{% endhighlight %}

<h3 id="upgrade-igluctl">4.2 igluctl</h3>

The latest igluctl, version 0.6.0, can be downloaded [from Bintray here][igluctl-download].

This new version doesn't deprecate any behaviors from the previous version, 0.5.0.

<h2 id="roadmap">5. Roadmap</h2>

Our biggest priority for Iglu R12 is functionality to support our upcoming Redshift table automigration process as per our recently [published RFC][migrations-rfc].

This will include a lot new functionality in core library as well as in Scala Iglu Client.

<h2 id="help">6. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the relevant documentation pages:

* [Iglu Server][iglu-server-wiki]
* [Igluctl][igluctl-wiki]

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[igluctl-wiki]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.6.0.zip

[json-metaschema]: https://tools.ietf.org/html/draft-wright-json-schema-00#section-6
[json-pointers]: https://tools.ietf.org/html/rfc6901

[iso-8601]: https://en.wikipedia.org/wiki/ISO_8601

[circe]: https://circe.github.io/circe/
[cats]: https://typelevel.org/cats/
[scalaz]: https://scalaz.github.io/7/
[json4s]: http://json4s.org/

[draft-schemas-wiki]: https://github.com/snowplow/iglu/wiki/The-draft-schema-service

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r11-capul-de-bour
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.5.0.zip

[migrations-rfc]: https://discourse.snowplowanalytics.com/t/redshift-automatic-table-migrations-rfc/2555

[capul-de-bour]: https://en.wikipedia.org/wiki/Moldavian_Bull%27s_Heads
[capul-de-bour-img]: /assets/img/blog/2018/12/iglu-r11-stamp.jpg
