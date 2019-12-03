---
layout: post
title-short: "Snowplow R117 release"
title: "Snowplow R117 release"
tags: [snowplow, release]
author: Łukasz Indykiewicz
category: Releases
permalink: /blog/2019/12/03/snowplow-r117-biskupin/
---

Snowplow release R117 is named after [Biskupin](https://en.wikipedia.org/wiki/Biskupin), which is "an archaeological site and a life-size model of a late Bronze Age fortified settlement in north-central Poland that also serves as a archaeological open-air museum".

This release focuses on delivering small, but important improvements to Snowplow ecosystem:

1. [TLS port binding and certificate](#tls-port-binding-and-certificate)
2. [Referer parser refreshment](#referer-parser-refreshment)
3. [IPv6 anonymization](#ipv6-anonymization)
4. [Additional event fingerprint hashing methods](#additional-event-fingerprint-hashing-methods)
5. [Support to the spot market for core instances](#support-to-the-spot-market-for-core-instances)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Getting help](#getting-help)

<!--more-->

## TLS port binding and certificate

### TLS/SSL Certificate termination
As an additional security measure it is now possible to terminate TLS/SSL connection directly within `scala-stream-collector` using a battle-tested [Lightbend SSL Config](https://lightbend.github.io/ssl-config/index.html).
We have introduced several new configuration parameters in order to accommodate different workflows and configurations.
There are two configuration sections that can be overriden in order to achieve the expected workflow: `collector.ssl` and `ssl-config`.

The former is a high-level section that allows:
- `collector.ssl.enable` - turn on ssl termination
- `collector.ssl.redirect` - whether automatic upgrade from http to https should be performed
- `collector.ssl.port` - port on which TLS/SSL server should be started

The latter allows for low-level TLS/SSL configuration exposed by [Lightbend SSL Config](https://lightbend.github.io/ssl-config/index.html).

### Default redirect endpoint disabling
Another simple, but important security improvement is a possibility to disable the default event submission redirect. This allows users to disable the default endpoint in favour of custom user-defined url. 
For example, following configuration will only allow redirects for custom-defined `/com.acme/redirect-me` endpoint, whereas the default `/r/tp2` will not be available.
```json
enableDefaultRedirect = false
paths {
  "/com.acme/redirect-me" = "/r/tp2"
}
```
Note, that for backwards-compatibility, the endpoint is still exposed by default.

## Referer parser refreshment

Referer parser is a library that contains a list of possible referer hosts. We keep maintenance of `0.3.x` branch with backporting new identified hosts into old `0.3.0` version. Several new hosts were identified and added to the [`referer.yml`](https://s3-eu-west-1.amazonaws.com/snowplow-hosted-assets/third-party/referer-parser/referers-latest.yml)

## IPv6 anonymization

This release adds support for anonymization of IPv6 addresses. `anonSegments` parameter is added to enrichment configuration. It describes how many segments should be anonymized.

The schema for the configuration of the enrichment has been updated to version `1-0-1`:

The IPv6 anonymization changes are backwards compatible. The `anonOctets` param will be read and useed also for IPv6 in case of missing `anonSegments`. To fully use IPv6 anonymization it's better to use the new schema (version `1-0-1`, which has `anonSegments` param). The new code can be used with `1-0-0` schema version also.

## Additional event fingerprint hashing methods

Credits for this contribution goes to [miike](https://github.com/miike).

From this version, besides MD5, new hashing algorithms are supported:

* SHA1
* SHA256
* SHA384
* SHA512

The schema for the configuration of the enrichment has been updated to version `1-0-1`.

## Support to the spot market for core instances

EmrEtlRunner now supports [EC2 spot instances][spot-instances], which can significantly reduce cost of EMR cluster by making sure the optimal instance is used.

In order to enable spot instances, add a `core_instance_bid` setting to your `config.yml` file. This setting specifies a bid for an hour of EC2 spot instance in USD.

```yaml
aws:
  emr:
    jobflow:
      core_instance_bid: 0.3
```


# Upgrading

## TLS port binding and certificate

A new version of the Scala Stream Collector can be found on [our Docker Hub repository](https://hub.docker.com/r/snowplow/scala-stream-collector-kinesis/tags) under `0.17.0` tag.

For example to start up an ssl-enabled, auto-upgrade server, following config can be used, collector configuration should contain:
```json
ssl {
  enable = true
  redirect = true
  port = 443
}
```
However, this configuration will use environment-defined JVM-attached certificates. In order to override the default behaviour and use a custom certificate, the low-level section can be defined as (akka config section):
```json
ssl-config {
  keyManager = {
    stores = [
      {type = "PKCS12", classpath = false, path = ${CERT_FILE}, password = "pass" }
    ]
  }
}
```

## IPv6 anonymization

A new version of the Snowplow Common Enrich can be found on [Maven repository](https://mvnrepository.com/artifact/com.snowplowanalytics/snowplow-common-enrich_2.11/0.38.0)

The schema for the configuration of the enrichment has been updated to version `1-0-1`:

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

## Additional event fingerprint hashing methods

The schema for the configuration of the enrichment has been updated to version `1-0-1`:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-0-1",
  "data": {
    "name": "event_fingerprint_config",
    "vendor": "com.snowplowanalytics.snowplow",
    "enabled": true,
    "parameters": {
      "excludeParameters": ["cv", "eid", "nuid", "stm"],
      "hashAlgorithm": "SHA1"
    }
  }
}
```

## Support to the spot market for core instances

A new version of the EmrEtlRunner can be found on [our Bintray repository](https://bintray.com/snowplow/snowplow-generic/snowplow) under `r117-biskupin` version.

In order to enable spot instances, add a `core_instance_bid` setting to your `config.yml` file. This setting specifies a bid for an hour of EC2 spot instance in USD.

```yaml
aws:
  emr:
    jobflow:
      core_instance_bid: 0.3
```

## Beam Enrich 

A new version of the Beam Enrich can be found on [our Docker Hub repository](https://hub.docker.com/r/snowplow/beam-enrich/tags) under `0.4.0` tag.

It contains the newest Snowplow Common Enrich.

## Stream Enrich 

A new version of the Stream Enrich can be found on [our Docker Hub repository](https://hub.docker.com/r/snowplow/stream-enrich-kinesis/tags) under `0.22.0` tag.

It contains the newest Snowplow Common Enrich.

## Spark Enrich

Batch pipelines hasn't been extensively tested as part of our plans to focus on real-time and deprecate batch processing. For more information check the [RFC](https://discourse.snowplowanalytics.com/t/rfc-making-the-snowplow-pipeline-real-time-end-to-end-and-deprecating-support-for-batch-processing-modules/3018)

A new version of the Spark Enrich can be used by setting it in your EmrEtlRunner configuration:

```yaml
enrich:
  version:
    spark_enrich: 1.19.0
```

or directly make use of the new Spark Enrich available at:

[s3://snowplow-hosted-assets/3-enrich/spark-enrich/snowplow-spark-enrich-1.18.0.jar](d2io1hx8u877l0.cloudfront.net/3-enrich/spark-enrich/snowplow-spark-enrich-1.19.0.jar).

It contains the newest Snowplow Common Enrich.

## Roadmap

Snowplow releases on which we are currently working:

* [R118 Morgantina](https://github.com/snowplow/snowplow/milestone/154): this release will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

## Getting help

For more details on this release, please check out the [release notes](https://github.com/snowplow/snowplow/releases/tag/r117-biskupin) on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum](https://discourse.snowplowanalytics.com/).

[spot-instances]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html
