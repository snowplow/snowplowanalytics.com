---
layout: post
title: "Introducing a better way to measure the latency of your data in BigQuery"
description: "Version 0.5.1 of BigQuery loader introduces an improved metric for measuring latency, capturing the time it takes for your data to get from the collector to the point of ingestion to BigQuery."
author: Dilyan
category: Releases
permalink: /blog/2020/07/14/introducing-a-better-way-to-measure-the-latency-of-your-data-in-bigquery/
discourse: false
---


Version 0.5.1 of BigQuery loader introduces an improved metric for measuring latency, capturing the time it takes for your data to get from the collector to the point of ingestion to BigQuery. By leveraging GCPs Logging service, this data can be accessed directly via Google Cloud Console’s Operations (formerly Stackdriver), or surfaced in third party monitoring tools such as Prometheus or Grafana via the API. 

## How are the latency metrics calculated? 

BigQuery Loader samples the data every second at the point of loading to BigQuery and writes the latency value to GCP’s Logging service. For each sampled event, we calculate the latency by taking the difference between the collector timestamp and the timestamp at the point before loading to BigQuery. A custom logs-based metric can then be configured to expose the data in Google Cloud Console’s Monitoring UI.   

## Consuming the metric within Google Cloud’s Monitoring UI

As an Insights Customer, the metric will be pre-configured and available in Metrics Explorer under the name `bq_loader_latency_prod1`.  Therefore you will be able to skip directly to the section ‘Applying the aggregation settings’. 

As an open source user, you will need to create the metric yourself by following the steps below. 

### Creating the custom logs-based metric

For an overview of logs-based metrics, you can refer to the GCP documentation [here](https://cloud.google.com/logging/docs/logs-based-metrics). We suggest creating a [distribution metric](https://cloud.google.com/logging/docs/logs-based-metrics/distribution-metrics) as follows: 


<ol>
    <li>
        <p>Navigate to the Logs Viewer section on Google Cloud Console, and enter your query (as demonstrated below) to return the log entries that you want to create a metric from: </p>
        <img src="{{ BASE_PATH }}/assets/img/blog/2020/07/gcp.png" />
    </li>
    <li>
        <p>You will then be able to create your custom metric by clicking on ‘Create metric’.  This will bring up a Metrics Editor where you will need to enter the field name and an ‘Extraction regular expression’ as below in order to extract the value of the metric from the logs:</p>
        <p style="text-align:center;"><img style="width:500px;" src="{{ BASE_PATH }}/assets/img/blog/2020/07/metric-editor.png" /></p> 
    </li>
    <li>
        <p>This metric can then be consumed from the Metrics Explorer section and fine tuned via the Aggregation settings</p>
    </li>
</ol>


### Applying the aggregation settings

Since the purpose of Google Clouds Operations is to report on high volumes of data that come in at unpredictable intervals, you will need to choose how to display the data by setting the aggregation fields. A more detailed description of these settings can be found [here](https://cloud.google.com/monitoring/api/v3/aggregation), but we recommend the following: 



*   Alignment period: There are multiple alignment period options, but depending on your use case, we suggest aligning to 1 minute intervals (the lowest interval available) 
*   Aggregator: This step combines all measures into one point per time interval, and for this we recommend using the mean.  


![metric-explorer](/assets/img/blog/2020/07/metric-explorer.png)


The combination of these aggregation settings provides more granularity for analytical purposes and gives the truest representation of latency from the underlying logs. 

## Consuming the measures in Grafana

As an alternative to Google Cloud Console, you can surface these metrics in an external monitoring tool such as Grafana. 

When creating a new chart in Grafana, you will need to input the same settings as described above.  As an Insights Customers, the metric name will need to be set to <code>logging.googleapis.com/user/bq_loader_latency_prod1<strong>,</strong></code> whereas for open source users, this will need to be set to whatever was specified when creating your custom logs-based metric in Google Cloud’s Logging UI.



![dashboard](/assets/img/blog/2020/07/dashboard.png)


## Upgrading & help

The [0.5.0](https://github.com/snowplow-incubator/snowplow-bigquery-loader/releases/tag/0.5.0) and [0.5.1](https://github.com/snowplow-incubator/snowplow-bigquery-loader/releases/tag/0.5.1) release pages on GitHub have the full list of changes made in this version of BigQuery Loader. 

As an Insights Customer, we have automatically upgraded you to the latest version.  If you have any issues or questions, please feel free to reach out to your Customer Success Manager. 

As an open source user, please note that no changes in configuration are required to upgrade from version 0.4.2. If you are upgrading from version 0.2.0 or lower, then you can refer to the upgrade notes in the [0.2.0 release post ](https://discourse.snowplowanalytics.com/t/bigquery-loader-0-2-0-released/3563)for some potential pitfalls.  Finally, if you run into any issues or have any questions, please get in touch with us via<span style="text-decoration:underline;"> [our Discourse forums](https://discourse.snowplowanalytics.com/)</span>. 
