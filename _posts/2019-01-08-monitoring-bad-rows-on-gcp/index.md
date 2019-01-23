---
layout: post
title-short: Real-time Bad row Monitoring in Data Studio (GCP)
title: "Monitoring Bad Rows on GCP Using BigQuery and Data Studio"
tags: [snowplow, real-time, GCP, bad-rows]
author: Colm
category: Analytics
image: /assets/img/blog/2019/01/dashboard.jpg
permalink: /blog/2019/01/23/monitoring-bad-rows-on-gcp-using-bigquery-and-data-studio/
---

One of the key features to Snowplow pipeline is that it's architected to ensure data quality up front - rather than spending a lot of time cleaning and making sense of the data before using it, schemas are defined up front and used to validate all data types as they come through the pipeline. Another key feature to Snowplow is that it's highly loss-averse - when data fails validation, those events are preserved as bad rows. [Read more about data quality][data-quality].


This post focuses on setting up Data Studio visualizations to monitor bad rows on the Google Cloud Platform version of the pipeline using Google BigQuery as the data warehouse. GCP users might also be interested in [this guide to dealing with bad rows on GCP][gcp-bad-debugging]. For users on AWS, bad rows are stored in S3, Elasticsearch, or both - you can read more about handling them here: [Elasticsearch][esdebugging], [S3 Athena (batch)][athena-batch], [S3 Athena (real-time)][athena-rt].


On GCP, bad rows are streamed to Cloud Storage in real-time - open-source users should set up the [Cloud Storage Loader][cloud-storage-loader], Snowplow Insights customers will have this datastore set up as standard.
Note that creating a Data Studio dashboard will incur cost as you run queries against Google BigQuery - which charges per amount of data scanned after the first TB. [BigQuery Pricing information can be found here](https://cloud.google.com/bigquery/pricing).

For most Snowplow users this won't be much of an issue as we don't expect a lot of data to go to bad rows, as long as the tracking setup has been set up and debugged properly. We will also cover strategies to limit table scans in section 2.1 below.


### 1. Setup - create an external bad rows table
If you've already followed the [guide to debugging bad rows in GCP][gcp-bad-debugging], you'll remember that external tables run queries against data directly from Cloud Storage, so your query results will always return the latest available data. For this reason, we'll use an external table to create our monitoring dashboard. If you have already set up an external table you can jump to section 2. Otherwise, follow the below steps to create a new table.


In the Google BigQuery UI, create a dataset to house your bad rows data - here I've named it `bad_rows`. Then build a BigQuery table in that dataset, with the following options:

**Create table from** Google Cloud Storage
You'll want to point it to the root of your bad rows bucket with the `/*` operator, to encapsulate all bad rows (this will be a JSON file).

**Table type** should be External table
Name the new table something sensible - I've gone with bad_rows_external as the table name.


Finally, autodetect schema and input parameters.


![Create external Table][create-external]


Click create table and you're good to go.

### 2. Create a Data Source
Our dashboard will query the external table whenever we refresh. Since BigQuery charges per amount of data scanned, the next steps are to make sure we're limiting our data appropriately and creating a custom query. In this section we'll first briefly cover how that's done (again you may have read this section of the last blog, in which case you can skip to 2.2), then we'll create our data source using a custom query which limits the amount of BigQUery data scanned per refresh appropriately.

#### 2.1 Limiting external table scans
The bad rows data in Cloud Storage is partitioned with a folder and filename structure which corresponds to the date and time at which the data was loaded to Cloud Storage. If we use the special `_FILE_NAME` pseudo-column in a `WHERE` clause, BigQuery will only scan those files in Cloud Storage which correspond to our limiting clause.

This can be done using a REGEX and parsing along the lines of:


`DATE(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%S', LTRIM(REGEXP_EXTRACT(_FILE_NAME, 'output-[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+'), 'output-')))`

Resulting in the query:

`SELECT *FROM bad_rows.bad_rows_external,UNNEST(errors) eWHERE DATE(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%S', LTRIM(REGEXP_EXTRACT(_FILE_NAME, 'output-[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+'), 'output-'))) >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY)GROUP BY 1,2ORDER BY 1,3 DESC`

This will only scan the last week's data, and the query results will contain all bad row data which was loaded to Cloud Storage in the last week (note that this won't exactly correspond to the `failure_tstamp` but is a good enough proxy for any practical use case - unless there's been a failure in loading the bad rows data at some point).


#### 2.2 Creating a Custom Query Data Source
Navigate to Data Studio, go to the data sources tab and click the `+` button to add a BigQuery connector for the data warehouse. From here, you want to choose the custom query tab on the left, find the `bad_rows` BigQuery dataset, and select the `bad_rows_external` table.


The below query results will be limited to data scanned into Cloud Storage from the last 14 days' bad rows - for most use cases volumes will be low enough per day that this won't make a material impact on your bill, but do be aware that if a lot of data is failing validation this may not be the case - it's best to either run queries in BigQuery to check how many bad rows per day are coming in, or take a look at the file sizes in the bad rows bucket to manually do a sense-check on them (Anything above a few MB per file is starting to look abnormally large, assuming they load every 5 mins).


`SELECT e.message, failure_tstampFROM bad_rows.bad_rows_external,UNNEST(errors) eWHERE DATE(PARSE_TIMESTAMP('%Y-%m-%dT%H:%M:%S', LTRIM(REGEXP_EXTRACT(_FILE_NAME, 'output-[0-9]+-[0-9]+-[0-9]+T[0-9]+:[0-9]+:[0-9]+'), 'output-'))) >= DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)`


This query also unnests and extracts the error message. We're ignoring the line here since it's very laborious and time consuming to decode it in SQL, and for the purposes of monitoring all we really need to do is count rows per error over time.


Once you've clicked the connect button, your data source should now be available in the Data Sources tab in Data Studio. Click on it and choose 'Generate Report' to get started on visualizing your bad rows. You'll be prompted to add the new data source to your report - accept that and you're ready to build your dashboard.

### 3. Build visualizations of your bad rows in Data Studio
Data studio is an amazing visualization tool - just choose the chart you're looking to build, drag and drop it in the size you want onto the canvas, and choose the measures and dimensions you're interested in.

**Bad row counts per error**
First, let's create a table which displays error messages and a count of rows. Choose the table option from the toolbar, drag it to the size you want, and choose errors.message as a dimension, and record count as a metric.
You'll notice that there are a lot of errors we can safely disregard in there (as explained above) - scroll to the bottom of the data tab to add a filter which excludes `message` values starting with the offending errors.

![Create Filter][create-filter]

**Bad rows over time**
For this visualization I chose a bar chart, sorted by `failure_tstamp`, and again applied the filter we created in the last step. Now we can easily see if there's a spike in bad rows over time - which would suggest that some tracking or schema change has caused issues. By choosing `message` as a dimension, and selecting Stacked Bar chart in the Style tab, we can also easily see how big of a problem each error is.

**Bad rows per error over time**
Choosing a line chart with the same dimensions and metrics as above, and adding `errors.message` as a breakdown dimension allows us to see bad rows per error message over time - spikes in all errors at once suggests a significant uptick in traffic, unless someone has made a global change to all tracking or all schemas. A spike in just one suggests an issue with a particular event. A new line appearing suggests an issue with a newly set up event.


![Data Studio Dashboard][dashboard]

The end result is a Data Studio report which can be used to identify problems with validation in real-time. Every time you refresh the report, Data Studio will query the external table, and update the visualizations with the latest data.

[data-quality]: https://snowplowanalytics.com/blog/2016/01/07/we-need-to-talk-about-bad-data-architecting-data-pipelines-for-data-quality/

[gcp-bad-debugging]: https://snowplowanalytics.com/blog/2018/12/19/debugging-bad-data-in-gcp-with-bigquery/

[esdebugging]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-elasticsearch-and-kibana-tutorial/28

[athena-batch]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-tutorial/948

[athena-rt]: https://discourse.snowplowanalytics.com/t/debugging-bad-rows-in-athena-real-time-tutorial/2189

[create-external]: /assets/img/blog/2018/12/create-external.jpg

[cloud-storage-loader]: https://github.com/snowplow/snowplow/wiki/setting-up-snowplow-google-cloud-storage-loader

[create-filter]: /assets/img/blog/2019/01/create-filter.jpg

[dashboard]: /assets/img/blog/2019/01/dashboard.jpg
