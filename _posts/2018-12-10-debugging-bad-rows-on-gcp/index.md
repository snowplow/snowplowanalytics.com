---
layout: post
title-short: Debugging Bad Rows on GCP
title: "Debugging bad rows on GCP"
tags: [snowplow, real-time, GCP, bad-rows]
author: Colm
category:
permalink:
---


## Debugging bad rows on GCP

One of the key features to Snowplow pipeline is that it's architected to ensure data quality up front - rather than spending a lot of time cleaning and making sense of the data before using it, schemas are defined up front and used to validate data as it comes through the pipeline. Another key feature to Snowplow is that it's highly loss-averse - when data fails validation, those events are preserved as bad rows. [Read more about data quality][data-quality].

This post focuses on setting up Data Studio visualisations to monitor bad rows on the GCP version of the pipeline - for users on AWS, bad rows are stored in S3, Elasticsearch or both - you can read more about handling them in these other posts: [Elasticsearch][es], [S3 Athena (batch)][s3b], [S3 Athena (real-time)][s3rt].

On GCP, bad rows are streamed to Cloud Storage in real-time - open-source users should set up the [Cloud Storage Loader][csl], Snowplow Insights customers will have this set up as standard.

One of the great things about GCP is that BigQuery plays nicely with external data sources - so you can create tables from your data in Cloud Storage, without paying for data transfer (charging is based on the amount of data scanned). This guide will walk through the process of surfacing your bad rows in BigQuery and using SQL to investigate issues.

It's a good idea to set up some monitoring on Bad Rows - we have another post which focuses on doing so !!!!![LINK TO OTHER POST]!!!!!

---


### Dealing with Bad rows

Because validation happens early in the Enrich component of Snowplow, the data in bad rows is essentially a raw payload, and so accessing the values in the data involves effort - which means the best process for dealing with bad rows is best dealt with in two steps:

1. Diagnose the issue - First you'll want to know how many of each type of validation failure you're getting, in order to tell what should be investigated

2. Explore the causes and fix the issue - Once you know what the most common failures are, you should then go through the process of investigating the cause and fixing it.

Users familiar with bad rows on AWS will recognise this structure - the idea is to only dig into the payload when you know what you're looking for.

BigQuery offers two options for querying data from Cloud Storage - external and native tables.

[External tables][et] will take a little longer to query, but they scan the data in Cloud Storage itself without moving it - so you can use them for real-time diagnostics.

Native tables import the data into BigQuery - querying them will be faster, but you need to manually import the data to get the latest bad rows.

This guide focuses on step 2 of the process - investigating issues and finding the root cause.


---

#### 1. Create a native table

In another post, we focused on taking advantage of an external table to build real-time visualisations that let us easily monitor and investigate problems with bad rows. You could also use an external table to debug your bad rows, however external tables don't leverage caching - since we may need to run queries several times in this process, we'll use a native table.

There are no data transfer charges for importing data from Cloud Storage to BigQuery in order to build the native table, but you are charged per amount of data scanned. The data is partitioned by date using a file & foldername structure, so I'll create a native table with a sample of my bad rows data.

If you've followed the other guide and set up monitoring, you'll know what range of data you need to look at. If you haven't, and you've a high volume of data, just choose a sensible time range.

In the BigQuery UI, create a dataset to house your bad rows data - here I've named it `bad_rows`. Then create a table in that dataset, with the following options:

**Create table from** Google Cloud Storage

You'll want to point it to the root of your bad rows bucket with a sensible date range via the filenames the `/*` wildcard operator, to encapsulate all bad rows. File format is JSON.

**Table type** should be External table

Name the table something sensible - I've gone with bad_rows_native.

Finally, autodetect schema and input parameters.

![Create Native Table][ntbl]

Click create table and you're good to go. You can already start exploring your bad rows using SQL.

#### 2. Count bad rows per error message

**Note** If you already know what errors you're interested in, having already set up monitoring visualisations, you can skip this section and go straight to section 3.


If we run a `SELECT *` on the data we'll see that there are three fields in the data - `failure_tstamp`, a nested errors object, containing `message` and `level`, and `line` - which is the base64 encoded payload containing the data.

Importantly, bad rows don't just contain Snowplow events which have failed validation - every request that hits the collector but doesn't meet the structure dictated by the schema will land in bad rows.

So there are some error messages that can safely be ignored - for example:

> Querystring is empty: no raw event to process
> Unrecognized event [null]
> Payload with vendor [] and version [] not supported by this version of Scala Common Enrich

These errors can happen for a number of reasons - bots trawling the internet for vulnerabilities, or empty requests hitting the collector for various reasons.

Now, the `errors` field is a `STRUCT` nested inside an `ARRAY`, so you'll notice that the query:

```SQL
SELECT errors.message FROM bad_rows.bad_rows_native
```

will throw an error - in order to access the message we need to `UNNEST()` the errors field in order to filter out these errors, and count our rows per error message:

```SQL
SELECT
  e.message,
  count(*)
FROM bad_rows.bad_rows_native,
UNNEST(errors) e
WHERE e.message NOT LIKE 'Querystring is empty%'  
AND e.message NOT LIKE 'Payload with vendor%'

GROUP BY 1
ORDER BY 2 DESC
```

The `UNNEST()` function flattens data out of nested structures - to a one-row-per-value format. Since the message will only be one string value, we don't need to worry about duplication in this instance, but take care to account for multiple values in nested fields when using it in general.


#### 3. Investigating the issue

Now that we know what the most common error messages are, we can investigate and fix those issues. For some errors, it's simple to figure out what the issue is - for example `could not find schema with key` indicates that either the schema hasn't been uploaded to Iglu correctly - so either it's not there at all, or there's a mismatch between the schema path the tracking has pointed to and the location of the schema in Iglu.

For some errors, it will be necessary to look into the payload for the event - this can be found in base64 encoded fromat in the `line` field of the bad row.

We can decode the line and take a look at the payload with `SAFE_CONVERT_BYTES_TO_STRING` in BigQuery:

```SQL
SELECT
  e.message,
  SAFE_CONVERT_BYTES_TO_STRING(line) AS payload
FROM bad_rows.bad_rows_native,
UNNEST(errors) e
WHERE e.message LIKE 'error: instance type (object) does not match any allowed primitive type%'
```

**The structure of the line**

Because validation happens in the early stages of Stream Enrich, the structure of the line will be in Thrift message format - so there will be information about the http request involved, and the Snowplow event itself will be in a JSON object under the key `data`. You might notice some strange characters in the decoded line - this isn't anything to worry about as we don't need that information - what's important is that we have this `data` JSON object.

To make life easier in handling the bad row, we can filter the extraneous bits out with `SAFE.REGEXP_EXTRACT()`:

```SQL
SELECT
  e.message,
  SAFE.REGEXP_EXTRACT(SAFE_CONVERT_BYTES_TO_STRING(line), '{\"data.*}')
FROM bad_rows.bad_rows_native,
UNNEST(errors) e
WHERE e.message LIKE 'error: instance type (object) does not match any allowed primitive type%'
```

Now, within the `data:` key of that JSON object, we'll find the data for the events which have been sent. If you've set up your tracking to send a batch of events together as a `POST` request, then all of the events sent together will be in this payload - one or more of those will have caused the bad row (note that this doesn't mean that all of these events have failed validation, just that at least one of them did).

This will be an array of events comprised of key-value pairs that correspond to the [Snowplow tracker protocol][tp2]. There are two places we'll find our custom data - in the `cx` field (where custom entity/context data are found), or in the `ue_px` field (where custom event data are found). Both will again be base64 encoded strings.

The last step to debugging is to decode these fields, and find the one that has the mismatch indicated by the error message. Once you've decoded them you'll notice that this data is in [self-describing JSON form][sdj].

For custom events, the data will be a nested JSON:


```JSON
{
  "data": {
    "data": {
      "field_1": "value_1",
      "field_2": "value_2",
      "field_3": "value_3"
    },
    "schema": "iglu:com.example/example_event/jsonschema/1-0-1"
  },
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0"
}
```

The inner `schema` field is the schema against which the event was sent.


For custom entities/contexts, this will be a nested array of self-describing JSONs:

```JSON
{
  "data": [
    {
      "data": {
        "field_1": "value_1"
      },
      "schema": "iglu:com.example/example_context/jsonschema/1-0-1"
    }
  ],
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1"
}
```

The inner `schema` field contains the custom schema against which data was sent, and the inner `data` key contains the actual data sent. So now the task is to use the error message as a guide to what to look for, find the instance of data failing to match the schema and address the problem either in tracking or in the schemas themselves.

In the example we've found: `instance type (object) does not match any allowed primitive type (allowed: ["string"])` - it looks like some field which should be a string is being sent as a JSON or other object - so I need to find the field that has a `string` specified in the schema but has an object against it in the payload.

At this stage, I recommend simply copying the base64 strings and manually decoding to delve into the issue - I use a text editor plugin to do so, you could also use a command line tool or other option to decode the data.

---

#### 4. Moving on from here

There is more we could do in BigQuery to make our lives easier on debugging. For example, you could write a complicated SQL query to unnest, decode and extract all the data you're interested in, or define a Javascript UDF to handle extracting the relevant information from the line. Be warned that the amount of nesting and decoding in the data makes the SQL route quite tricky - and it's likely that you'll need to import an external library for the UDF portion.


[data-quality]: https://snowplowanalytics.com/blog/2016/01/07/we-need-to-talk-about-bad-data-architecting-data-pipelines-for-data-quality/

[es]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-elasticsearch-and-kibana-tutorial/28

[s3b]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-tutorial/948

[s3rt]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-real-time-tutorial/2189

[csl]: https://github.com/snowplow/snowplow/wiki/setting-up-snowplow-google-cloud-storage-loader

[et]: https://cloud.google.com/bigquery/external-data-sources

[tp2]: https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol

[sdj]: https://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/

[ntbl]: /assets/img/blog/2018/12/create-native-table.jpg
