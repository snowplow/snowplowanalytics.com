---
layout: post
title-short: Glue and Athena with Snowplow
title: "HOWTO setup AWS Glue and AWS Athena with Snowplow archive data"
tags: [snowplow, glue, athena, parquet]
author: Kostas
category: Other
permalink: /blog/2018/07/30/use-glue-and-athena-with-snowplow-data/
---

This is a HOWTO on how to use Snowplow archive data with AWS Glue. 

The objective is to use AWS Glue to find new snowplow data and how to use that data in AWS Athena and AWS Redshift Spectrum.

It simplifies and follows [a similar guide][best-practices-athena-glue] from Amazon and specializes to the Snowplow data, but does not go into using Quicksight.

![Glue crawler (source: https://docs.aws.amazon.com/athena/latest/ug/glue-best-practices.html)][glue-crawler]

The HOWTO consists of three parts:

1. [Setting up AWS Glue crawler](#setting-up-aws-glue-crawler).
2. (optional) [Format shift to parquet using Glue](#format-shift-to-parquet-using-glue).
3. [Use AWS Athena to access the data](#use-aws-athena-to-access-the-data).
4. [Use AWS Redshift Spectrum to access the data](#use-aws-redshift-spectrum-to-access-the-data).

## Setting up AWS Glue crawler

In order to set up the AWS Glue crawler, login to the AWS console as normal and click on the AWS Glue service (you may have to type the first few letters in the search field).

![console glue search][console-glue-search]

Create database

```bash
aws glue create-database --database-input '{"Name": "snowplow-data", "Description": "Snowplow Data"}'
```

Update columns (TODO: manage viewport or create gist)

```bash
aws glue create-table --database-name snowplow-data --table-input '
{
  "Name": "archive",
  "Owner": "owner",
  "Retention": 0,
  "StorageDescriptor": {
    "Columns": [
      {
        "Name": "app_id",
        "Type": "string"
      },
      {
        "Name": "platform",
        "Type": "string"
      },
      {
        "Name": "etl_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "collector_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "dvce_created_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "event",
        "Type": "string"
      },
      {
        "Name": "event_id",
        "Type": "string"
      },
      {
        "Name": "txn_id",
        "Type": "int"
      },
      {
        "Name": "name_tracker",
        "Type": "string"
      },
      {
        "Name": "v_tracker",
        "Type": "string"
      },
      {
        "Name": "v_collector",
        "Type": "string"
      },
      {
        "Name": "v_etl",
        "Type": "string"
      },
      {
        "Name": "user_id",
        "Type": "string"
      },
      {
        "Name": "user_ipaddress",
        "Type": "string"
      },
      {
        "Name": "user_fingerprint",
        "Type": "string"
      },
      {
        "Name": "domain_userid",
        "Type": "string"
      },
      {
        "Name": "domain_sessionidx",
        "Type": "int"
      },
      {
        "Name": "network_userid",
        "Type": "string"
      },
      {
        "Name": "geo_country",
        "Type": "string"
      },
      {
        "Name": "geo_region",
        "Type": "string"
      },
      {
        "Name": "geo_city",
        "Type": "string"
      },
      {
        "Name": "geo_zipcode",
        "Type": "string"
      },
      {
        "Name": "geo_latitude",
        "Type": "double"
      },
      {
        "Name": "geo_longitude",
        "Type": "double"
      },
      {
        "Name": "geo_region_name",
        "Type": "string"
      },
      {
        "Name": "ip_isp",
        "Type": "string"
      },
      {
        "Name": "ip_organization",
        "Type": "string"
      },
      {
        "Name": "ip_domain",
        "Type": "string"
      },
      {
        "Name": "ip_netspeed",
        "Type": "string"
      },
      {
        "Name": "page_url",
        "Type": "string"
      },
      {
        "Name": "page_title",
        "Type": "string"
      },
      {
        "Name": "page_referrer",
        "Type": "string"
      },
      {
        "Name": "page_urlscheme",
        "Type": "string"
      },
      {
        "Name": "page_urlhost",
        "Type": "string"
      },
      {
        "Name": "page_urlport",
        "Type": "int"
      },
      {
        "Name": "page_urlpath",
        "Type": "string"
      },
      {
        "Name": "page_urlquery",
        "Type": "string"
      },
      {
        "Name": "page_urlfragment",
        "Type": "string"
      },
      {
        "Name": "refr_urlscheme",
        "Type": "string"
      },
      {
        "Name": "refr_urlhost",
        "Type": "string"
      },
      {
        "Name": "refr_urlport",
        "Type": "int"
      },
      {
        "Name": "refr_urlpath",
        "Type": "string"
      },
      {
        "Name": "refr_urlquery",
        "Type": "string"
      },
      {
        "Name": "refr_urlfragment",
        "Type": "string"
      },
      {
        "Name": "refr_medium",
        "Type": "string"
      },
      {
        "Name": "refr_source",
        "Type": "string"
      },
      {
        "Name": "refr_term",
        "Type": "string"
      },
      {
        "Name": "mkt_medium",
        "Type": "string"
      },
      {
        "Name": "mkt_source",
        "Type": "string"
      },
      {
        "Name": "mkt_term",
        "Type": "string"
      },
      {
        "Name": "mkt_content",
        "Type": "string"
      },
      {
        "Name": "mkt_campaign",
        "Type": "string"
      },
      {
        "Name": "contexts",
        "Type": "string"
      },
      {
        "Name": "se_category",
        "Type": "string"
      },
      {
        "Name": "se_action",
        "Type": "string"
      },
      {
        "Name": "se_label",
        "Type": "string"
      },
      {
        "Name": "se_property",
        "Type": "string"
      },
      {
        "Name": "se_value",
        "Type": "double"
      },
      {
        "Name": "unstruct_event",
        "Type": "string"
      },
      {
        "Name": "tr_orderid",
        "Type": "string"
      },
      {
        "Name": "tr_affiliation",
        "Type": "string"
      },
      {
        "Name": "tr_total",
        "Type": "double"
      },
      {
        "Name": "tr_tax",
        "Type": "double"
      },
      {
        "Name": "tr_shipping",
        "Type": "double"
      },
      {
        "Name": "tr_city",
        "Type": "string"
      },
      {
        "Name": "tr_state",
        "Type": "string"
      },
      {
        "Name": "tr_country",
        "Type": "string"
      },
      {
        "Name": "ti_orderid",
        "Type": "string"
      },
      {
        "Name": "ti_sku",
        "Type": "string"
      },
      {
        "Name": "ti_name",
        "Type": "string"
      },
      {
        "Name": "ti_category",
        "Type": "string"
      },
      {
        "Name": "ti_price",
        "Type": "double"
      },
      {
        "Name": "ti_quantity",
        "Type": "int"
      },
      {
        "Name": "pp_xoffset_min",
        "Type": "int"
      },
      {
        "Name": "pp_xoffset_max",
        "Type": "int"
      },
      {
        "Name": "pp_yoffset_min",
        "Type": "int"
      },
      {
        "Name": "pp_yoffset_max",
        "Type": "int"
      },
      {
        "Name": "useragent",
        "Type": "string"
      },
      {
        "Name": "br_name",
        "Type": "string"
      },
      {
        "Name": "br_family",
        "Type": "string"
      },
      {
        "Name": "br_version",
        "Type": "string"
      },
      {
        "Name": "br_type",
        "Type": "string"
      },
      {
        "Name": "br_renderengine",
        "Type": "string"
      },
      {
        "Name": "br_lang",
        "Type": "string"
      },
      {
        "Name": "br_features_pdf",
        "Type": "boolean"
      },
      {
        "Name": "br_features_flash",
        "Type": "boolean"
      },
      {
        "Name": "br_features_java",
        "Type": "boolean"
      },
      {
        "Name": "br_features_director",
        "Type": "boolean"
      },
      {
        "Name": "br_features_quicktime",
        "Type": "boolean"
      },
      {
        "Name": "br_features_realplayer",
        "Type": "boolean"
      },
      {
        "Name": "br_features_windowsmedia",
        "Type": "boolean"
      },
      {
        "Name": "br_features_gears",
        "Type": "boolean"
      },
      {
        "Name": "br_features_silverlight",
        "Type": "boolean"
      },
      {
        "Name": "br_cookies",
        "Type": "boolean"
      },
      {
        "Name": "br_colordepth",
        "Type": "string"
      },
      {
        "Name": "br_viewwidth",
        "Type": "int"
      },
      {
        "Name": "br_viewheight",
        "Type": "int"
      },
      {
        "Name": "os_name",
        "Type": "string"
      },
      {
        "Name": "os_family",
        "Type": "string"
      },
      {
        "Name": "os_manufacturer",
        "Type": "string"
      },
      {
        "Name": "os_timezone",
        "Type": "string"
      },
      {
        "Name": "dvce_type",
        "Type": "string"
      },
      {
        "Name": "dvce_ismobile",
        "Type": "boolean"
      },
      {
        "Name": "dvce_screenwidth",
        "Type": "int"
      },
      {
        "Name": "dvce_screenheight",
        "Type": "int"
      },
      {
        "Name": "doc_charset",
        "Type": "string"
      },
      {
        "Name": "doc_width",
        "Type": "int"
      },
      {
        "Name": "doc_height",
        "Type": "int"
      },
      {
        "Name": "tr_currency",
        "Type": "string"
      },
      {
        "Name": "tr_total_base",
        "Type": "double"
      },
      {
        "Name": "tr_tax_base",
        "Type": "double"
      },
      {
        "Name": "tr_shipping_base",
        "Type": "double"
      },
      {
        "Name": "ti_currency",
        "Type": "string"
      },
      {
        "Name": "ti_price_base",
        "Type": "double"
      },
      {
        "Name": "base_currency",
        "Type": "string"
      },
      {
        "Name": "geo_timezone",
        "Type": "string"
      },
      {
        "Name": "mkt_clickid",
        "Type": "string"
      },
      {
        "Name": "mkt_network",
        "Type": "string"
      },
      {
        "Name": "etl_tags",
        "Type": "string"
      },
      {
        "Name": "dvce_sent_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "refr_domain_userid",
        "Type": "string"
      },
      {
        "Name": "refr_device_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "derived_contexts",
        "Type": "string"
      },
      {
        "Name": "domain_sessionid",
        "Type": "string"
      },
      {
        "Name": "derived_tstamp",
        "Type": "timestamp"
      },
      {
        "Name": "event_vendor",
        "Type": "string"
      },
      {
        "Name": "event_name",
        "Type": "string"
      },
      {
        "Name": "event_format",
        "Type": "string"
      },
      {
        "Name": "event_version",
        "Type": "string"
      },
      {
        "Name": "event_fingerprint",
        "Type": "string"
      },
      {
        "Name": "true_tstamp",
        "Type": "timestamp"
      }
    ],
    "Location": "s3://knservis-snpl-workspace/r106-test/enriched/archive/",
    "InputFormat": "org.apache.hadoop.mapred.TextInputFormat",
    "OutputFormat": "org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat",
    "Compressed": false,
    "NumberOfBuckets": -1,
    "SerdeInfo": {
      "SerializationLibrary": "org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe",
      "Parameters": {
        "field.delim": "\t"
      }
    },
    "BucketColumns": [],
    "SortColumns": [],
    "StoredAsSubDirectories": false
  },
  "PartitionKeys": [],
  "TableType": "EXTERNAL_TABLE"
}
'
```

## 3. Use AWS Athena to access the data

Use performance event fields

```sql
SELECT 
json_extract(performance_events[1], '$.data.navigationStart') AS navigationStart,
json_extract(performance_events[1], '$.data.unloadEventStart') AS unloadEventStart,
json_extract(performance_events[1], '$.data.unloadEventEnd') AS unloadEventEnd,
json_extract(performance_events[1], '$.data.redirectStart') AS redirectStart,
json_extract(performance_events[1], '$.data.redirectEnd') AS redirectEnd,
json_extract(performance_events[1], '$.data.fetchStart') AS fetchStart,
json_extract(performance_events[1], '$.data.domainLookupStart') AS domainLookupStart,
json_extract(performance_events[1], '$.data.domainLookupEnd') AS domainLookupEnd,
json_extract(performance_events[1], '$.data.connectStart') AS connectStart,
json_extract(performance_events[1], '$.data.connectEnd') AS connectEnd,
json_extract(performance_events[1], '$.data.secureConnectionStart') AS secureConnectionStart,
json_extract(performance_events[1], '$.data.requestStart') AS requestStart,
json_extract(performance_events[1], '$.data.responseStart') AS responseStart,
json_extract(performance_events[1], '$.data.responseEnd') AS responseEnd,
json_extract(performance_events[1], '$.data.domLoading') AS domLoading,
json_extract(performance_events[1], '$.data.domInteractive') AS domInteractive,
json_extract(performance_events[1], '$.data.domContentLoadedEventStart') AS domContentLoadedEventStart,
json_extract(performance_events[1], '$.data.domContentLoadedEventEnd') AS domContentLoadedEventEnd,
json_extract(performance_events[1], '$.data.domComplete') AS domComplete,
json_extract(performance_events[1], '$.data.loadEventStart') AS loadEventStart,
json_extract(performance_events[1], '$.data.loadEventEnd') AS loadEventEnd,
json_extract(performance_events[1], '$.data.chromeFirstPaint') AS chromeFirstPaint
FROM
( SELECT
    FILTER(CAST(json_extract(contexts, '$.data') AS ARRAY(JSON)), x -> regexp_like(json_extract_scalar(x, '$.schema'), 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0')) AS performance_events
  FROM archive
)
WHERE cardinality(performance_events) = 1
;
```

(View not supported due to `ARRAY(JSON)` but it probably should be)

Unsupported DDL in Athena: 
https://docs.aws.amazon.com/athena/latest/ug/unsupported-ddl.html



## 4. Redshift

(inline arn:aws:iam::719197435995:role/konstantinos-RS-load ?)

Getting started:
IAM Role
https://docs.aws.amazon.com/redshift/latest/dg/c-getting-started-using-spectrum-create-role.html

Associate role with cluster

External schema
https://docs.aws.amazon.com/redshift/latest/dg/c-getting-started-using-spectrum-create-external-table.html


```sql
create external schema glue_schema from data catalog 
database 'snplow-enriched-archive'
iam_role 'arn:aws:iam::719197435995:role/konstantinos-RS-load';
```

```sql
CREATE OR REPLACE VIEW performanceEvents AS 
SELECT 
    navigationStart, 
    unloadEventStart, 
    unloadEventEnd, 
    redirectStart, 
    redirectEnd, 
    fetchStart, 
    domainLookupStart, 
    domainLookupEnd, 
    connectStart, 
    connectEnd, 
    secureConnectionStart, 
    requestStart, 
    responseStart, 
    responseEnd, 
    domLoading, 
    domInteractive, 
    domContentLoadedEventStart, 
    domContentLoadedEventEnd, 
    domComplete, 
    loadEventStart, 
    loadEventEnd, 
    chromeFirstPaint
FROM
(SELECT
    json_extract_path_text(contexts, 'data') AS data,
    json_extract_array_element_text(data,0) AS elem_0,
    json_extract_array_element_text(data,1) AS elem_1,
    json_extract_array_element_text(data,2) AS elem_2,
    json_extract_array_element_text(data,3) AS elem_3,
    json_extract_array_element_text(data,4) AS elem_4,
    json_extract_array_element_text(data,5) AS elem_5,
    CASE
            WHEN REGEXP_INSTR(elem_0, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_0
        WHEN REGEXP_INSTR(elem_1, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_1
        WHEN REGEXP_INSTR(elem_2, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_2
        WHEN REGEXP_INSTR(elem_3, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_3
        WHEN REGEXP_INSTR(elem_4, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_4
        WHEN REGEXP_INSTR(elem_5, 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0') > 0 THEN elem_5
        ELSE NULL
    END AS performance_event,
    json_extract_path_text(performance_event, 'data') AS performance_event_data,
    json_extract_path_text(performance_event_data, 'navigationStart') AS navigationStart,
    json_extract_path_text(performance_event_data, 'unloadEventStart') AS unloadEventStart,
    json_extract_path_text(performance_event_data, 'unloadEventEnd') AS unloadEventEnd,
    json_extract_path_text(performance_event_data, 'redirectStart') AS redirectStart,
    json_extract_path_text(performance_event_data, 'redirectEnd') AS redirectEnd,
    json_extract_path_text(performance_event_data, 'fetchStart') AS fetchStart,
    json_extract_path_text(performance_event_data, 'domainLookupStart') AS domainLookupStart,
    json_extract_path_text(performance_event_data, 'domainLookupEnd') AS domainLookupEnd,
    json_extract_path_text(performance_event_data, 'connectStart') AS connectStart,
    json_extract_path_text(performance_event_data, 'connectEnd') AS connectEnd,
    json_extract_path_text(performance_event_data, 'secureConnectionStart') AS secureConnectionStart,
    json_extract_path_text(performance_event_data, 'requestStart') AS requestStart,
    json_extract_path_text(performance_event_data, 'responseStart') AS responseStart,
    json_extract_path_text(performance_event_data, 'responseEnd') AS responseEnd,
    json_extract_path_text(performance_event_data, 'domLoading') AS domLoading,
    json_extract_path_text(performance_event_data, 'domInteractive') AS domInteractive,
    json_extract_path_text(performance_event_data, 'domContentLoadedEventStart') AS domContentLoadedEventStart,
    json_extract_path_text(performance_event_data, 'domContentLoadedEventEnd') AS domContentLoadedEventEnd,
    json_extract_path_text(performance_event_data, 'domComplete') AS domComplete,
    json_extract_path_text(performance_event_data, 'loadEventStart') AS loadEventStart,
    json_extract_path_text(performance_event_data, 'loadEventEnd') AS loadEventEnd,
    json_extract_path_text(performance_event_data, 'chromeFirstPaint') AS chromeFirstPaint
FROM glue_schema.archive
WHERE performance_event IS NOT NULL)
WITH NO SCHEMA BINDING;
 ```

[best-practices-athena-glue]: https://docs.aws.amazon.com/athena/latest/ug/glue-best-practices.html
[glue-crawler]: /assets/img/blog/2018/07/glue_crawler.png
[console-glue-search]: /assets/img/blog/2018/07/console-glue-search.png