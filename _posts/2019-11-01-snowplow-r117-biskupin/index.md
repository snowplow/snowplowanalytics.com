---
layout: post
title-short: "Snowplow R117 release"
title: "Snowplow R117 release"
tags: [snowplow, release]
author: Łukasz Indykiewicz
category: Releases
permalink: /blog/2019/11/01/snowplow-r117-biskupin/
---

Snowplow release R117 is named after [Biskupin](https://en.wikipedia.org/wiki/Biskupin), which is "an archaeological site and a life-size model of a late Bronze Age fortified settlement in north-central Poland that also serves as a archaeological open-air museum".

This release focuses on delivering small, but necessary improvements to Snowplow ecosystem:

1. [TLS port binding and certificate](#tls-port-binding-and-certificate)
2. [Referer parser refreshment](#referer-parser-refreshment)
3. [IPv6 anonymization](#ipv6-anonymization)
4. [Additional event fingerprint hashing methods (SHA1, SHA256, SHA384, SHA512)](#additional-event-fingerprint-hashing-methods)
5. [Support to the spot market for core instances](#support-to-the-spot-market-for-core-instances)

The `bad row` release has been renamed to R118 - check [roadmap](#roadmap) for more details.

## TLS port binding and certificate

> to be filled

## Referer parser refreshment

Referer parser is a library that contains list of possible referrer hosts. We keep maintenance of `0.3.x` branch with backporting new identified hosts into old `0.3.0` version. Several new hosts were identified and added to the [`referer.yml`](https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/referers-latest.yml)

## IPv6 anonymization

This release adds support for anonymization of IPv6 addresses. `anonSegments` parameter is added to enrichment configuration. It describes how many segments should be anonymized. Some examples might be found in our test scenarios in `AnonIpEnrichmentSpec` in `3-enrich/scala-common-enrich/src/test/scala/com.snowplowanalytics.snowplow.enrich.common/enrichments/registry/AnonIpEnrichmentSpec.scala`.

The schema has been updated to version `1-0-1`:

```json
{
	"schema": "iglu:com.snowplowanalytics.snowplow/anon_ip/jsonschema/1-0-1",
	"data": {
		"name": "anon_ip",
		"vendor": "com.snowplowanalytics.snowplow",
		"enabled": true,
		"parameters": {
			"anonOctets": 1,
			"anonSegments": 1
		}
	}
}
```

The IPv6 anonymization changes are backwards compatible. The `anonOctets` param will be read and useed also for IPv6 in case of missing `anonSegments`. To fully use IPv6 anonymization it's better to use the new schema (version `1-0-1`, which has `anonSegments` param). The new code can be used with `1-0-0` schema version also.

## Additional event fingerprint hashing methods

Credits for this contribution goes to [miike](https://github.com/miike).

From this version, besides `MD5`, new hashing algorithms are supported:

* SHA1
* SHA256
* SHA384
* SHA512

## Support to the spot market for core instances

Credits for this contribution goes to [miike](https://github.com/miike).

> to be filled

# Updated components:

## Scala Stream Collector
Includes changes: [TLS port binding](#tls-port-binding-and-certificate)

## Scala Common Enrich
Includes changes: [Referer-parser](#referer-parser-refreshment), [IPv6 anonymization](#ipv6-anonymization) and [additional fingerpring hashing methods](#additional-event-fingerprint-hashing-methods)

## EmrEtlRunner

Includes changes: [Support to the spot market for core instances](#support-to-the-spot-market-for-core-instances)

## Other components
`EmrEtlRunner`, `Beam Enrich` and `Stream Enrich` includes new `Scala Common Enrich`

## Roadmap

Snowplow releases on which we are currently working:

* [R118 Morgantina](https://github.com/snowplow/snowplow/milestone/154): this release will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

## Getting help

For more details on this release, please check out the [release notes](https://github.com/snowplow/snowplow/releases/r117-biskupin) on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum](https://discourse.snowplowanalytics.com/).
