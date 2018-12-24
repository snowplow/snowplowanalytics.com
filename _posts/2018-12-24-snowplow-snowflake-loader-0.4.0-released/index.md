---
layout: post
title: Snowplow Snowflake Loader 0.4.0 released
title-short: Snowflake Loader 0.4.0
tags: [snowflake, storage, relational databases]
author: Rostyslav
category: Releases
permalink: /blog/2018/12/24/snowplow-snowflake-loader-0.4.0-released/
---

We are pleased to announce version 0.4.0 of the [Snowplow Snowflake Loader][snowflake-loader-repo]! This release introduces optional cross-batch natural deduplication, as well as several other updates and bugfixes.

Read on below the fold for:

1. [Cross-batch deduplication](#crossbatch-dedupe)
2. [New configuration options](#new-config)
3. [Other changes](#other-changes)
4. [Upgrading](#upgrading)
5. [Getting help](#help)

<!--more-->

<h2 id="crossbatch-dedupe">1. Cross-batch deduplication</h2>

Version 0.4.0 introduces [DynamoDB][dynamodb]-powered cross-batch natural deduplication, which works by extracting two identifier properties from an event (`event_id` and `event_fingerprint`), as well as `etl_tstamp` which identifies a single batch, then storing these properties in a DynamoDB table. Duplicate events with the same `event_id` and `event_fingerprint`, but a different `etl_tstamp`, found in storage are silently dropped from the Snowflake Transformer output.

Cross-batch deduplication can be enabled by creating an additional config file with the following properties:

* `name` - Required human-readable configuration name, e.g. `Snowflake deduplication config`
* `id` - Required machine-readable configuration id, e.g. UUID
* `auth` - An object containing information about authentication use to read and write data to DynamoDB. Similar to the `auth` object in the main Snowflake config, this can use a `accessKeyId`/`secretAccessKey` pair or be set to `null`, in which case default credentials will be retrieved.
* `awsRegion` - AWS Region used by Transformer to access DynamoDB
* `dynamodbTable` - DynamoDB table used to store information about duplicate events
* `purpose` - Always `EVENTS_MANIFEST`

+An example of this auxiliary configuration is as follows:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/amazon_dynamodb_config/jsonschema/2-0-0",
  "data": {
    "name": "eventsManifest",
    "auth": {
      "accessKeyId": "fakeAccessKeyId",
      "secretAccessKey": "fakeSecretAccessKey"
    },
    "awsRegion": "us-east-1",
    "dynamodbTable": "acme-crossbatch-dedupe",
    "id": "ce6c3ff2-8a05-4b70-bbaa-830c163527da",
    "purpose": "EVENTS_MANIFEST"
  }
}
{% endhighlight %}

This configuration can be passed to Transformer using the optional `--events-manifest` flag, either as a file path or as a base64-encoded string if the `--base64` flag is also set.

<h2 id="new-config">2. New configuration options</h2>

Version 0.4.0 introduces two new configuration options to the Snowflake Loader config:
* `maxError` - An optional setting used when writing to Snowflake - a table copy statement will skip an input file when the number of errors in it exceeds the specified number. This can be used to process runs with a certain number of expected bad rows without immediately failing.
* `jdbcHost` - An optional host for the JDBC driver that has priority over automatically derived hosts.

<h2 id="other-changes">3. Other changes</h2>

This release introduces plenty of other updates:

* The Snowflake Transformer now uses a [custom staging committer][s3committer] which accelerates writing to S3 from Spark by writing task outputs to a temporary directory on the local FS rather than S3. This represents a significant performance improvement by avoiding expensive S3 renaming operations.
* Newly created Snowflake warehouses are now created with `AUTO_SUSPEND` set to 5 mins and `AUTO_RESUME` set to `TRUE`, and will be suspended after inactivity to prevent incurring unnecessary costs.
* Text strings are now automatically truncated to their target lengths instead of producing an error if a loaded string exceeds the target length.
* Sensitive columns in `atomic.events` have been widened to support pseudonymization, and the `geo_region` column has been bumped to 3 characters due to changes in MaxMind regional codes. Thanks to community member [miike][miike] for contributing the latter feature!
* A DynamoDB client will now attempt recovery if its temporary session credentials have expired, preventing critical run failures.
* The Snowflake Loader will now correctly fail if no data is located in the specified staging folder, preventing "blank loads" for complex recovery/historical load scenarios.
* The JDBC useragent has been updated to self-identify the Snowflake loader.

<h2 id="upgrading">4. Upgrading</h2>

Due to several columns in atomic.events being widened to support pseudonymization and MaxMind changes, the table schema on Snowflake will need to be migrated. In order to automatically update the relevant column definitions in Snowflake, use the new `migrate` command and specify the loader's version:

`java -jar snowplow-snowflake-loader-0.4.0.jar migrate --loader-version 0.4.0`

<h2 id="help">5. Getting help</h2>

For more details on this release, check out the [0.4.0 release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowflake-loader-repo]: https://github.com/snowplow-incubator/snowplow-snowflake-loader
[dynamodb]: https://aws.amazon.com/dynamodb/
[s3committer]: https://github.com/rdblue/s3committer
[miike]: https://github.com/miike
[release-notes]: https://github.com/snowplow/snowplow-snowflake-loader/releases/tag/0.4.0
[discourse]: http://discourse.snowplowanalytics.com/
