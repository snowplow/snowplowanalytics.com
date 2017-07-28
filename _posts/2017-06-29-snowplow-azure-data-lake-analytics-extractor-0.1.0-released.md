---
layout: post
title: Snowplow Azure Data Lake Analytics Extractor 0.1.0 released
title-short: Snowplow Azure Data Lake Analytics Extractor 0.1.0
tags: [snowplow, enriched events, .NET, Microsoft Azure Data Lake Analytics]
author: Devesh
category: Releases
---

[Azure Data Lake][azure-data-lake] is a secure and scalable data storage and analytics service. Azure Data Lake provides [Azure Data Lake Analytics (ADLA)][data-lake-analytics] service to simplify big data analytics. ADLA includes [U-SQL][u-sql], a big-data query language for writing queries that analyze data.

This extractor has been developed as a second step towards our [RFC, Porting Snowplow to Microsoft Azure][azure-rfc].

![extractor-usage-img][extractor-usage-img]

Read on below the jump for:

1. [Overview](/blog/2017/06/29/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#overview)
2. [The ADLA Event Extractor](/blog/2017/06/29/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#adla-event-extractor)
3. [Installation](/blog/2017/06/29/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#installation)
4. [Usage](/blog/2017/06/29/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#usage)
5. [Getting help](/blog/2017/06/29/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#help)

<h2 id="overview">1. Overview</h2>

Snowplow's enrichment process outputs [Snowplow enriched events][enriched-events] in a TSV format consisting of 131 fields.

[Snowplow Azure Data Lake Analytics Extractor][repo] is an ADLA custom extractor that allows you to parse Snowplow enriched events.

<h2 id="adla-event-extractor">2. The ADLA Event Extractor</h2>

The ADLA Event Extractor takes an input stream of Snowplow enriched events and empty row as inputs and it then fills the row with transformed event stream's data. It internally uses the [Snowplow .NET Analytics SDK][snowplow-dotnet-sdk] to transform the input stream of TSV.

<h2 id="installation">3. Installation</h2>

To add the Snowplow Azure Data Lake Analytics Extractor as a dependency to your U-SQL script, add references to dll files (Assembly Source can be a URI or file path to a DLL file in either an accessible Azure Data Lake Storage or Windows Azure Blob Storage):

{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];
{% endhighlight %}

For more information on installation check out the [Azure Data Lake Analytics Extractor setup guide][adla-extractor-setup-guide].

<h2 id="usage">4. Usage</h2>

Consider the sample tsv:
{% highlight json %}
angry-birds	web	2017-01-26 00:01:25.292	2013-11-26 00:02:05	2013-11-26 00:03:57.885	page_view	c6ef3124-b53a-4b13-a233-0088f79dcbcb	41828	cloudfront-1	js-2.1.0	clj-tomcat-0.1.0	serde-0.5.2	jon.doe@email.com	92.231.54.234	2161814971	bc2e92ec6c204a14	3	ecdff4d0-9175-40ac-a8bb-325c49733607	US	TX	New York	94109	37.443604	-122.4124	Florida	FDN Communications	Bouygues Telecom	nuvox.net	Cable/DSL	http://www.snowplowanalytics.com	On Analytics		http	www.snowplowanalytics.com	80	/product/index.html	id=GTM-DLRG	4-conclusion															{    'schema': 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',    'data': [      {        'schema': 'iglu:org.schema/WebPage/jsonschema/1-0-0',        'data': {          'genre': 'blog',          'inLanguage': 'en-US',          'datePublished': '2014-11-06T00:00:00Z',          'author': 'Devesh Shetty',          'breadcrumb': [            'blog',            'releases'          ],          'keywords': [            'snowplow',            'javascript',            'tracker',            'event'          ]        }      },      {        'schema': 'iglu:org.w3/PerformanceTiming/jsonschema/1-0-0',        'data': {          'navigationStart': 1415358089861,          'unloadEventStart': 1415358090270,          'unloadEventEnd': 1415358090287,          'redirectStart': 0,          'redirectEnd': 0,          'fetchStart': 1415358089870,          'domainLookupStart': 1415358090102,          'domainLookupEnd': 1415358090102,          'connectStart': 1415358090103,          'connectEnd': 1415358090183,          'requestStart': 1415358090183,          'responseStart': 1415358090265,          'responseEnd': 1415358090265,          'domLoading': 1415358090270,          'domInteractive': 1415358090886,          'domContentLoadedEventStart': 1415358090968,          'domContentLoadedEventEnd': 1415358091309,          'domComplete': 0,          'loadEventStart': 0,          'loadEventEnd': 0        }      }    ]  }						{    'schema': 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0',    'data': {      'schema': 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',      'data': {        'targetUrl': 'http://www.example.com',        'elementClasses': ['foreground'],        'elementId': 'exampleLink'      }    }  }
{% endhighlight %}

- Following is a base U-SQL script that uses a Event Extractor:
{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];

DECLARE @input_file string = @"\snowplow\event.tsv";

@rs0 =
    EXTRACT
        app_id string,
        platform string,
        etl_tstamp DateTime?,
        collector_tstamp DateTime?,
        dvce_created_tstamp DateTime?,
        event string,
        event_id string,
        txn_id int?,
        tr_total_base double?,
        br_features_pdf bool?,
        v_collector string,
        domain_sessionidx int?,
        contexts_org_schema_web_page_1 SqlArray<SqlMap<string, object>>,
        unstruct_event_com_snowplowanalytics_snowplow_link_click_1 SqlMap<string, object>,
        event_version string
    FROM @input_file
    USING new Snowplow.EventExtractor();
{% endhighlight %}
If there are any problems in the input TSV (such as unparseable fields or numeric fields) or in the schema (such as invalid columnTypes), the **Extract** method will throw a **SnowplowEventExtractionException**. This exception contains a list of error messages - one for every problematic field in the input or invalid columnType in the schema.

The most complex piece of processing is the handling of the self-describing JSONs found in the enriched event's unstruct_event, contexts and derived_contexts fields.

<h3 id="extracting-contexts">4.1 Extracting contexts</h3>
Consider contexts found in the tsv:
{% highlight json %}
{
	"schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
	"data": [{
		"schema": "iglu:org.schema/WebPage/jsonschema/1-0-0",
		"data": {
			"genre": "blog",
			"inLanguage": "en-US",
			"datePublished": "2014-11-06T00:00:00Z",
			"author": "Devesh Shetty",
			"breadcrumb": ["blog", "releases"]
		}
	}, {
		"schema": "iglu:org.w3/PerformanceTiming/jsonschema/1-0-0",
		"data": {
			"navigationStart": 1415358089861,
			"unloadEventStart": 1415358090270,
			"unloadEventEnd": 1415358090287,
			"redirectStart": 0,
			"redirectEnd": 0
		}
	}]
}
{% endhighlight %}

Following is base U-SQL script that uses a Event Extractor to extract contexts:

{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];

DECLARE @input_file string = @"\snowplow\event.tsv";

/*
extract context
contexts_org_schema_web_page_1 is an instance of Microsoft.Analytics.Types.Sql.SqlArray which contains an array of Microsoft.Analytics.Types.Sql.SqlMap
*/
@rs_context =
    EXTRACT
        contexts_org_schema_web_page_1 SqlArray<SqlMap<string, object>> AS context_web,
        contexts_org_w3_performance_timing_1 SqlArray<SqlMap<string, object>> AS context_performance
    FROM @input_file
    USING new Snowplow.EventExtractor();

{% endhighlight %}

<h3 id="extracting-unstructured-event">4.2 Extracting unstructured event</h3>
Consider unstructured event found in the tsv:

{% highlight json %}
{
    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
    "data": {
      "schema": "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",
      "data": {
        "targetUrl": "http://www.example.com",
        "elementClasses": ["foreground"],
        "elementId": "exampleLink"
      }
    }
}
{% endhighlight %}

Following is base U-SQL script that uses a Event Extractor to extract unstructured event:

{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];

DECLARE @input_file string = @"\snowplow\event.tsv";

/*
extract unstructured event
unstruct_event_com_snowplowanalytics_snowplow_link_click_1 is an instance of Microsoft.Analytics.Types.Sql.SqlMap
*/
@rs_unstruct =
    EXTRACT
        unstruct_event_com_snowplowanalytics_snowplow_link_click_1 SqlMap<string, object> AS click_info
    FROM @input_file
    USING new Snowplow.EventExtractor();

{% endhighlight %}

For more information, please check out the [ADLA Extractor technical documentation][adla-extractor-tech-docs].

<h2 id="help">6. Getting help</h2>

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[repo]: https://github.com/snowplow/snowplow-azure-data-lake-analytics-extractor
[extractor-usage-img]: /assets/img/blog/2017/06/adla-extractor-usage.png
[adla-extractor-setup-guide]: https://github.com/snowplow/snowplow/wiki/Azure-Data-Lake-Analytics-Event-Extractor
[adla-extractor-tech-docs]: https://github.com/snowplow/snowplow/wiki/Azure-Data-Lake-Analytics-Extractor-Setup

[event-data-modeling]: http://snowplowanalytics.com/blog/2016/03/16/introduction-to-event-data-modeling/

[azure-data-lake]: https://azure.microsoft.com/en-in/solutions/data-lake/
[data-lake-analytics]: https://azure.microsoft.com/en-in/services/data-lake-analytics/
[u-sql]: https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/
[usql-extractor]: https://msdn.microsoft.com/en-us/library/azure/mt621320.aspx

[enriched-events]: https://github.com/snowplow/snowplow/wiki/canonical-event-model

[azure-rfc]: http://discourse.snowplowanalytics.com/t/porting-snowplow-to-microsoft-azure/1178

[snowplow-dotnet-sdk]: https://github.com/snowplow/snowplow-dotnet-analytics-sdk
[issues]: https://github.com/snowplow/snowplow-azure-data-lake-analytics-extractor/issues
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com/
