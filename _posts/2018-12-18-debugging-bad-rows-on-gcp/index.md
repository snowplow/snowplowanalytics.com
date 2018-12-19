---
layout: post
title-short: Debugging bad rows on GCP
title: "Debugging bad rows on GCP"
tags: [snowplow, real-time, GCP, bad-rows]
author: Colm
category:
permalink:
---

One of the key features to Snowplow pipeline is that it's architected to ensure data quality up front - rather than spending a lot of time cleaning and making sense of the data before using it, schemas are defined up front and used to validate data as it comes through the pipeline. Another key feature to Snowplow is that it's highly loss-averse - when data fails validation, those events are preserved as bad rows. [Read more about data quality][data-quality].

This post focuses on debugging bad rows for the GCP pipeline. We have similar guides to doing this in an AWS landscape here: [Elasticsearch][esdebugging], [S3 Athena (batch)][athena-batch], [S3 Athena (real-time)][athena-rt].

On GCP, bad rows are streamed to Cloud Storage in real-time - open-source users should set up the [Cloud Storage Loader][cloud-storage-loader], Snowplow Insights customers will have this set up as standard.

### Dealing with Bad Rows

When data hits the collector but fails the validation step of the Snowplow Pipeline, those events are dumped into 'bad rows'. Since validation happens early in the Enrich process, the actual payload of the data hasn't yet been put into a nice easy-to-use format. Getting at the actual values in the payload requires some effort, but bad rows do give us easier access to information which allows us to diagnose why the event failed validation.

The best process for handling bad rows is to evaluate what the causes of validation failure (and scale of the issue) are, narrow it down as much as possible, then dig in to find and fix the source of the failure.

Bad rows are caused by one of two things:

1. non-snowplow traffic hitting the collector (eg. web crawlers or empty events sent from a monitoring process). These can be ignored.

2. A value in the data doesn't match its schema. (eg. a custom event value sent as the wrong type). Typically these are fixed with either a schema change or a tracking change.


### External vs Native tables

BigQuery allows us to query data from Cloud Storage in one of two ways:

1. External tables scan the data from Cloud Storage - this has the advantage of always querying the latest data. However, while it's possible to limit the amount of data scanned, external tables don't take advantage caching, and queries can be slower.


2. Native tables import the data into BigQuery and allow you to query from there. There are no data transfer charges from Cloud Storage but the normal charges per scanned data apply. With native tables, you can only see the data you imported when you created the table - which is a manual process. Queries will likely be faster than for external tables.

In this guide we're going to use an external table for monitoring/diagnosis of the problem, and simply use a `CREATE TABLE AS` statement to generate a smaller native table and dig into the specifics. That way we create the external table once, and our volume management strategy is to simply use partitions and subset that table when we need a native one.

### 1. Create an external table and diagnose

In the BigQuery UI, create a dataset to house your bad rows data - here I've named it `bad_rows`. Then create a table in that dataset, with the following options:

**Create table from** Google Cloud Storage

You'll want to point it to the root of your bad rows bucket with the `/*` operator, to encapsulate all bad rows. File format is JSON.

**Table type** should be External table

Name the table something sensible - I've gone with bad_rows_external.

Finally, autodetect schema and input parameters.

![Create external Table][create-external]

Click create table and you're good to go. You can already start exploring your bad rows using SQL.

If we take a look at the table schema, we'll see that there are three fields in the data - `failure_tstamp`, a nested errors object, containing `message` and `level`, and `line` - which is the base64 encoded payload containing the data.

![Table Schema][table-schema]

#### 1.1 Limiting Queries:

Since our external table is built off the set of all of our bad data, we should take care to limit our queries appropriately when using it.

**Note that with external tables, the BigQuery UI's validator isn't guaranteed to accurately reflect the amount of data your query scans - so vigilance is advised.**

Bad rows are stored at time-partitioned filepaths, so we can trim the `_FILE_NAME` pseudo-column to a timestamp-format string and convert it to limit our queries. In standardSQL, this is done as follows:

```SQL
DATE(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%S', LTRIM(REGEXP_EXTRACT(_FILE_NAME, 'output-[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+'), 'output-')))
```

Using this in a `WHERE` clause will result in only the files with relevant dates are scanned.

#### 1.2 Counting bad rows per error:

With the below SQL we can count how many bad rows per day we get for each error message:

```SQL
SELECT
  TIMESTAMP_TRUNC(failure_tstamp, DAY),
  e.message,
  count(*) AS bad_row_count
FROM bad_rows.bad_rows_external,
UNNEST(errors) e
WHERE DATE(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%S', LTRIM(REGEXP_EXTRACT(_FILE_NAME, 'output-[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+'), 'output-'))) >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)
GROUP BY 1,2
ORDER BY 1,3 DESC
```

The `UNNEST` function is used because the errors object contains an array of `STRUCT` objects - so do note that rows with more than one error message will be counted against both messages.

The output of this query looks something like this:

![counts per message][counts-per-message]

Some error messages will already give you an indication of what to fix - for example a schema path issue indicate that either the schema wasn't correctly uploaded to Iglu, or the tracker references the wrong path.

At this point, it's a good idea to set up some monitoring dashboards for bad rows. [You can find a guide to doing this using Data Studio here][Data Studio guide]

#### 2. Subset the data and dig into the issue

The above allows us to count bad rows over time - so we can see what errors we saw, when we had bad rows, and how many of them we had. There are some rows we can safely ignore, with messages like:

> Querystring is empty: no raw event to process
> Unrecognized event [null]
> Payload with vendor [] and version [] not supported by this version of Scala Common Enrich

These aren't Snowplow events - they're mostly caused by requests hitting the Snwoplow collector, which didn't come from a Snowplow tracker.

The other bad rows mean the data sent didn't match our schemas:

> error: instance type (boolean) does not match any allowed primitive type (allowed: ["null","object","string"])
> error: instance type (object) does not match any allowed primitive type (allowed: ["string"])

Now, we'd like to investigate the issue and find the route cause. We're going to be digging into the data here, and we should be wary of cost - since we're likely to run multiple queries over the data several times, we should take advantage of caching and create a native table with a sample of the data from the external table.

The output of my counts above tell me that the last day or so of data contains at least some instances of the same error messages - now, when we're digging into the data we'll likely be running queries a few times and we'd like a fast feedback loop. So we'll create a native table with just a sample of the data to take advantage of query caching. This is done by following the same process as we did for the external table, but this time specifying the path for only a day's data, and specifying a native table.

![native-table][native-table]

The `line` column in our bad rows data is a base-64 encoded collector payload, we can decode it using: `SAFE_CONVERT_BYTES_TO_STRING(line)`. This will be thrift-encoded, and depending on what's happened upstream may be of different formats. Within the decoded line object, we have a JSON object which contains Snowplow data. This is where we'll find the custom data we're looking for.

For each particular error, we can get at the data with a query like:

```SQL
SELECT
  e.message,
  SAFE.REGEXP_EXTRACT(SAFE_CONVERT_BYTES_TO_STRING(line), '{\"data.*}') AS tracker_data
FROM bad_rows.bad_sample_dec_18,
UNNEST(errors) e
WHERE e.message LIKE 'error: instance type (boolean) does not match any allowed primitive type%'
```

Now the `tracker_data` field here will look something like this (if you're sending POST requests):

```JSON
{
  "data": [
    {
      "aid": "prod", ...
    },
    {
      "aid": "prod", ...
    }
  ]
}
```

That is to say, the "data" key in this output contains an array of Snowplow event data. Custom data will be base64-encoded strings within certain fields of this JSON object. You might want to try to decode it using SQL, but the simplest thing to do is to manually decode the base64 and take a look.

Within the event data, there are two places we'll find custom data:

The `ue_px` field will be present if the event is a custom event. This is base64 encoded, which when decoded contains a JSON object:

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

The `cx` field will be present if the event has any entities attached. Again this is base64 encoded, which when decoded contains an array JSON objects:

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

The task now is to find the offending data which caused the failure, and address the problem.


#### Exploring further

I've already mentioned our guide to setting up a bad rows monitoring dashboard in Data Studio. As I mentioned, using SQL to get at the data is an option, but not likely a fruitful one. Another option is to define a JavaScript User-Defined Function to extract and output the relevant data from the line.



[data-quality]: https://snowplowanalytics.com/blog/2016/01/07/we-need-to-talk-about-bad-data-architecting-data-pipelines-for-data-quality/


[esdebugging]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-elasticsearch-and-kibana-tutorial/28

[athena-batch]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-tutorial/948

[athena-rt]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-real-time-tutorial/2189

[cloud-storage-loader]: https://github.com/snowplow/snowplow/wiki/setting-up-snowplow-google-cloud-storage-loader

[create-external]: /assets/img/blog/2018/12/create-external.jpg

[table-schema]: /assets/img/blog/2018/12/table-schema.jpg

[counts-per-message]: /assets/img/blog/2018/12/count-messages.jpg

[native-table]: /assets/img/blog/2018/12/native-table.jpg

[Data Studio Guide]:
