## Monitoring Bad Rows in GCP - Datastudio Monitoring

One of the key features to Snowplow pipeline is that it's architected to ensure data quality up front - rather than spending a lot of time cleaning and making sense of the data before using it, schemas are defined up front and used to validate data as it comes through the pipeline. Another key feature to Snowplow is that it's highly loss-averse - when data fails validation, those events are preserved as bad rows. [Read more about data quality]](https://snowplowanalytics.com/blog/2016/01/07/we-need-to-talk-about-bad-data-architecting-data-pipelines-for-data-quality/).

This post focuses on setting up Data Studio visualisations to monitor bad rows on the GCP version of the pipeline - for users on AWS, bad rows are stored in S3, Elasticsearch or both - you can read more about handling them in these other posts: [Elasticsearch](https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-elasticsearch-and-kibana-tutorial/28), [S3 Athena (batch)](https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-tutorial/948), [S3 Athena (real-time)](https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-real-time-tutorial/2189).

On GCP, bad rows are streamed to Cloud Storage in real-time - open-source users should set up the [Cloud Storage Loader](https://github.com/snowplow/snowplow/wiki/setting-up-snowplow-google-cloud-storage-loader), Snowplow Insights customers will have this set up as standard.

One of the great things about GCP is that BigQuery plays nicely with external data sources - so you can create tables from your data in Cloud Storage, without paying for data transfer (charging is based on the amount of data scanned). This guide will walk through the process of surfacing your bad rows in BigQuery and setting up visualisations to monitor volumes in real-time using Data Studio.

---

### Dealing with Bad rows

Because validation happens early in the Enrich component of Snowplow, the data in bad rows is essentially a raw payload, and so accessing the values in the data involves effort - which means the best process for dealing with bad rows is best dealt with in two steps:

1. Diagnose the issue - First you'll want to know how many of each type of validation failure you're getting, in order to tell what should be investigated

2. Explore the causes and fix the issue - Once you know what the most common failures are, you should then go through the process of investigating the cause and fixing it.

Users familiar with bad rows on AWS will recognise this structure - the idea is to only dig into the payload when you know what you're looking for.

BigQuery offers two options for querying data from Cloud Storage - external and native tables.

[External tables](https://cloud.google.com/bigquery/external-data-sources) will take a little longer to query, but they scan the data in Cloud Storage itself without moving it - so you can use them for real-time diagnostics.

Native tables import the data into BigQuery - querying them will be faster, but you need to manually import the data to get the latest bad rows.

This guide focuses on step 1 of the process - by setting up real-time monitoring of bad rows to easily identify and diagnose validation failures.

### Visualising bad rows in real-time

This is something which really demonstrates the power of GCP - monitoring bad rows has traditionally been a manual task, but because of the functionality I've described above, we can easily visualise bad rows in real-time by creating an external BigQuery table that reads from Cloud Storage, then visualising them in DataStudio.

#### 1. Create an external table

In the BigQuery UI, create a dataset to house your bad rows data - here I've named it `bad_rows`. Then create a table in that dataset, with the following options:

**Create table from** Google Cloud Storage

You'll want to point it to the root of your bad rows bucket with the `/*` operator, to encapsulate all bad rows. File format is JSON.

**Table type** should be External table

Name the table something sensible - I've gone with bad_rows_external.

Finally, autodetect schema and input parameters.

!!!!![SCREENSHOT]!!!!!


Click create table and you're good to go. You can already start exploring your bad rows using SQL.

!!!![SCREENSHOT OF TABLE SCHEMA]!!!!

We can already start to look into our bad rows using SQL. If we take a look at the table schema, we'll see that there are three fields in the data - `failure_tstamp`, a nested errors object, containing `message` and `level`, and `line` - which is the base64 encoded payload containing the data.

Importantly, bad rows don't just contain Snowplow events which have failed validation - every request that hits the collector but doesn't meet the structure dictated by the schema will land in bad rows.

So there are some error messages that can safely be ignored - for example:

> Querystring is empty: no raw event to process
> Unrecognized event [null]
> Payload with vendor [] and version [] not supported by this version of Scala Common Enrich

These errors can happen for a number of reasons - bots trawling the internet for vulnerabilities, or empty requests hitting the collector for various reasons. They can be filtered out by unnesting the errors field and using a `WHERE` clause.

We'll dive into investigating and debugging bad rows in BigQuery SQL in another post !!!!!!![REFERENCE TO WHEREVER THAT IS?]!!!!!! . First, we'll set up some visualisations to monitor bad row volumes in real-time.


#### 2. Connect Data Studio to your table as a data source

We're going to use Data Studio to visualise bad row volumes. Navigate to Data Studio, go to the data sources tab and click the `+` button to add a BigQuery connector.

Find the `bad_rows` dataset, select the `bad_rows_external` table and connect.


!!!!![SCREENSHOT]!!!! ???

You should now see `bad_rows_external` in your Data Sources tab. Click on it and choose 'Generate Report' to get started on visualising your bad rows. You'll be prompted to add the new data source to your report - accept that and you're ready to build your dashboard.


#### 3. Build visualisations of your bad rows in Data Studio

Data studio is an amazing visualisation tool - just choose the chart you're looking to build, drag and drop it in the size you want onto the canvas, and choose the measures and dimensions you're interested in.

**Bad row counts per error**

First, let's create a table which displays error messages and a count of rows. Choose the table option from the toolbar, drag it to the size you want, and choose errors.message as a dimension, and record count as a metric.

You'll notice that there are a lot of errors we can safely disregard in there (as explained above) - scroll to the bottom of the data tab to add a filter which excludes `errors.message` values starting with the offending errors.

**Bad rows over time**

For this visualisation I chose a bar chart, sorted by `failure_tstamp`, and again applied the filter we created in the last step. Now we can easily see if there's a spike in bad rows over time - which would suggest that some tracking or schema change has caused issues. By choosing `errors.message` as a dimension, and selecting Stacked Bar chart in the Style tab, we can also easily see how big of a problem each error is.

**Bad rows per error over time**

Choosing a line chart with the same dimensions and metrics as above, and adding `errors.message` as a breakdown dimension allows us to see bad rows per error message over time - spikes in all errors at once suggests a significant uptick in traffic, unless someone has made a global change to all tracking or all schemas. A spike in just one suggests an issue with a particular event. A new line appearing suggests an issue with a newly set up event.

**Global date range**

Finally, adding a date range box allows us to filter on date easily - so consumers of the dashboard can adjust the visualisation over time.

---

The end result is a Data Studio report which can be used to identify problems with validation in real-time. Every time you refresh the report, Data Studio will update the reports via a query on the External table we created in BigQuery:

!!!!! [SCREENSHOT OF OUTCOME] !!!!

Note that External tables don't utilise caching so every time you run your queries you'll be charged for the data scan - unless you have massive volume this won't be an issue. If you do have enough volume for this to be a consideration, note that the bad rows data is partitioned by date via filename.
