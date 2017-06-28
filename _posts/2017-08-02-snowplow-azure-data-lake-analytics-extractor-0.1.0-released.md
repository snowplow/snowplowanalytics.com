---
layout: post
title: Snowplow Azure Data Lake Analytics Extractor 0.1.0 released
title-short: Snowplow Azure Data Lake Analytics Extractor 0.1.0
tags: [snowplow, enriched events, .NET, Microsoft Azure Data Lake Analytics]
author: Devesh
category: Releases
---

[Azure Data Lake][azure-data-lake] is a secure and scalable data storage and analytics service. Azure Data Lake provides [Azure Data Lake Analytics (ADLA)][azure-data-lake-analytics] service to simplify big data analytics and [Azure Data Lake Store (ADLS)][azure-data-lake-store] to store data.

This extractor has been developed as a second step towards our [RFC, Porting Snowplow to Microsoft Azure][azure-rfc].

![extractor-usage-img][extractor-usage-img]

Read on below the jump for:

1. [Overview](/blog/2017/08/02/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#overview)
2. [The ADLA Event Extractor](/blog/2017/08/02/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#adla-event-extractor)
3. [Installation](/blog/2017/08/02/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#installation)
4. [Usage](/blog/2017/08/02/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#usage)
5. [Getting help](/blog/2017/08/02/snowplow-azure-data-lake-analytics-extractor-0.1.0-released#help)

<h2 id="overview">1. Overview</h2>

Snowplow's enrichment process outputs [Snowplow enriched events][enriched-events] in a TSV format consisting of 131 fields.

[Snowplow Azure Data Lake Analytics Extractor][repo] is an ADLA custom extractor that allows you to parse Snowplow enriched events.

<h2 id="adla-event-extractor">2. The ADLA Event Extractor</h2>

The ADLA Event Extractor takes an input stream of Snowplow enriched events and empty row as inputs and it then fills the row with transformed event stream's data. It internally uses the [Snowplow .NET Analytics SDK][snowplow-dotnet-sdk] to transform the input stream of TSV.

<h2 id="installation">3. Installation</h2>

To add the Snowplow Azure Data Lake Analytics Extractor as a dependency to your U-SQL script, add references to dll files (Assembly Source can be a URI or file path to a DLL file in either an accessible Azure Data Lake Storage or Windows Azure Blob Storage):

{% highlight sql %}
DROP ASSEMBLY IF EXISTS [Newtonsoft.Json];
CREATE ASSEMBLY [Newtonsoft.Json] FROM #ASSEMBLY_SOURCE;

DROP ASSEMBLY IF EXISTS [Snowplow.Analytics];
CREATE ASSEMBLY [Snowplow.Analytics] FROM #ASSEMBLY_SOURCE;

DROP ASSEMBLY IF EXISTS [Snowplow.Analytics.Extractor];
CREATE ASSEMBLY [Snowplow.Analytics.Extractor] FROM #ASSEMBLY_SOURCE;

REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];
{% endhighlight %}

The ASSEMBLY_SOURCE in the above script refers to the .NET assembly DLL. We can upload the DLL's to our existing Azure Data Lake Store. We prefer uploading it to a separate Azure Blob Storage that acts as a centralised repository for all our DLL's.

For more information on installation check out the [Azure Data Lake Analytics Extractor setup guide][adla-extractor-setup-guide].

<h2 id="usage">4. Usage</h2>

Consider the sample tsv:
{% highlight json %}
angry-birds	web	2017-01-26 00:01:25.292	2013-11-26 00:02:05	2013-11-26 00:03:57.885	page_view	c6ef3124-b53a-4b13-a233-0088f79dcbcb	41828	cloudfront-1	js-2.1.0	clj-tomcat-0.1.0	serde-0.5.2	jon.doe@email.com	92.231.54.234	2161814971	bc2e92ec6c204a14	3	ecdff4d0-9175-40ac-a8bb-325c49733607	US	TX	New York	94109	37.443604	-122.4124	Florida	FDN Communications	Bouygues Telecom	nuvox.net	Cable/DSL	http://www.snowplowanalytics.com	On Analytics		http	www.snowplowanalytics.com	80	/product/index.html	id=GTM-DLRG	4-conclusion															{    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",    "data": [      {        "schema": "iglu:org.schema/WebPage/jsonschema/1-0-0",        "data": {          "genre": "blog",          "inLanguage": "en-US",          "datePublished": "2014-11-06T00:00:00Z",          "author": "Devesh Shetty",          "breadcrumb": [            "blog",            "releases"          ],          "keywords": [            "snowplow",            "javascript",            "tracker",            "event"          ]        }      },      {        "schema": "iglu:org.w3/PerformanceTiming/jsonschema/1-0-0",        "data": {          "navigationStart": 1415358089861,          "unloadEventStart": 1415358090270,          "unloadEventEnd": 1415358090287,          "redirectStart": 0,          "redirectEnd": 0,          "fetchStart": 1415358089870,          "domainLookupStart": 1415358090102,          "domainLookupEnd": 1415358090102,          "connectStart": 1415358090103,          "connectEnd": 1415358090183,          "requestStart": 1415358090183,          "responseStart": 1415358090265,          "responseEnd": 1415358090265,          "domLoading": 1415358090270,          "domInteractive": 1415358090886,          "domContentLoadedEventStart": 1415358090968,          "domContentLoadedEventEnd": 1415358091309,          "domComplete": 0,          "loadEventStart": 0,          "loadEventEnd": 0        }      }    ]  }						{    "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",    "data": {      "schema": "iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1",      "data": {        "targetUrl": "http://www.example.com",        "elementClasses": ["foreground"],        "elementId": "exampleLink"      }    }  }																										1	0																																					{    "schema": "iglu:com.snowplowanalytics.snowplow\/contexts\/jsonschema\/1-0-1",    "data": [      {        "schema": "iglu:com.snowplowanalytics.snowplow\/ua_parser_context\/jsonschema\/1-0-0",        "data": {          "useragentFamily": "IE",          "useragentMajor": "7",          "useragentMinor": "0",          "useragentPatch": null,          "useragentVersion": "IE 7.0",          "osFamily": "Windows XP",          "osMajor": null,          "osMinor": null,          "osPatch": null,          "osPatchMinor": null,          "osVersion": "Windows XP",          "deviceFamily": "Other"        }      }    ]  }	2b15e5c8-d3b1-11e4-b9d6-1681e6b88ec1	2013-11-26 00:03:57.886	com.snowplowanalytics.snowplow	link_click	jsonschema	1-0-0	e3dbfa9cca0412c3d4052863cefb547f	2013-11-26 00:03:57.886
{% endhighlight %}

- Following is a base U-SQL script that uses a Event Extractor:
{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];

DECLARE @input_file string = @"\enriched-event.tsv";

@rs0 =
    EXTRACT
        [event] string,
        app_id string,
        platform string,
        etl_tstamp DateTime?,
        collector_tstamp DateTime?,
        dvce_created_tstamp DateTime?,
        event_id string,
        txn_id int?,
        name_tracker string,
        v_tracker string,
        v_collector string,
        v_etl string,
        user_id string,
        user_ipaddress string,
        user_fingerprint string,
        domain_userid string,
        domain_sessionidx int?,
        network_userid string,
        geo_country string,
        geo_region string,
        geo_city string,
        geo_zipcode string,
        geo_location string,
        geo_latitude double?,
        geo_longitude double?,
        geo_region_name string,
        ip_isp string,
        ip_organization string,
        ip_domain string,
        ip_netspeed string,
        page_url string,
        page_title string,
        page_referrer string,
        page_urlscheme string,
        page_urlhost string,
        page_urlport int?,
        page_urlpath string,
        page_urlquery string,
        page_urlfragment string,
        refr_urlscheme string,
        refr_urlhost string,
        refr_urlport int?,
        refr_urlpath string,
        refr_urlquery string,
        refr_urlfragment string,
        refr_medium string,
        refr_source string,
        refr_term string,
        mkt_medium string,
        mkt_source string,
        mkt_term string,
        mkt_content string,
        mkt_campaign string,
        se_category string,
        se_action string,
        se_label string,
        se_property string,
        se_value string,
        tr_orderid string,
        tr_affiliation string,
        tr_total double?,
        tr_tax double?,
        tr_shipping double?,
        tr_city string,
        tr_state string,
        tr_country string,
        ti_orderid string,
        ti_sku string,
        ti_name string,
        ti_category string,
        ti_price double?,
        ti_quantity int?,
        pp_xoffset_min int?,
        pp_xoffset_max int?,
        pp_yoffset_min int?,
        pp_yoffset_max int?,
        useragent string,
        br_name string,
        br_family string,
        br_version string,
        br_type string,
        br_renderengine string,
        br_lang string,
        br_features_pdf bool?,
        br_features_flash bool?,
        br_features_java bool?,
        br_features_director bool?,
        br_features_quicktime bool?,
        br_features_realplayer bool?,
        br_features_windowsmedia bool?,
        br_features_gears bool?,
        br_features_silverlight bool?,
        br_cookies bool?,
        br_colordepth string,
        br_viewwidth int?,
        br_viewheight int?,
        os_name string,
        os_family string,
        os_manufacturer string,
        os_timezone string,
        dvce_type string,
        dvce_ismobile bool?,
        dvce_screenwidth int?,
        dvce_screenheight int?,
        doc_charset string,
        doc_width int?,
        doc_height int?,
        tr_currency string,
        tr_total_base double?,
        tr_tax_base double?,
        tr_shipping_base double?,
        ti_currency string,
        ti_price_base double?,
        base_currency string,
        geo_timezone string,
        mkt_clickid string,
        mkt_network string,
        etl_tags string,
        dvce_sent_tstamp DateTime?,
        refr_domain_userid string,
        refr_device_tstamp DateTime?,
        domain_sessionid string,
        derived_tstamp DateTime?,
        event_vendor string,
        event_name string,
        event_format string,
        event_version string,
        event_fingerprint string,
        true_tstamp DateTime?,
        contexts_org_schema_web_page_1 string,
        contexts_org_w3_performance_timing_1  string,
        unstruct_event_com_snowplowanalytics_snowplow_link_click_1  string
    FROM @input_file
    USING new Snowplow.Analytics.Extractor.Event.EventExtractor();
{% endhighlight %}
If there are any problems in the input TSV (such as unparseable fields or numeric fields) or in the schema (such as invalid columnTypes), the **Extract** method will throw a **SnowplowEventExtractionException**. This exception contains a list of error messages - one for every problematic field in the input or invalid columnType in the schema.

The most complex piece of processing is the handling of the self-describing JSONs found in the enriched event's unstruct_event, contexts and derived_contexts fields.

{% highlight sql %}
REFERENCE ASSEMBLY [Newtonsoft.Json];
REFERENCE ASSEMBLY [Snowplow.Analytics];
REFERENCE ASSEMBLY [Snowplow.Analytics.Extractor];

USING EventFunctions = Snowplow.Analytics.Extractor.Function.EventFunctions;
{% endhighlight %}
In the above script we are assigning Snowplow.Analytics.Extractor.Function.EventFunctions to EventFunctions.

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
@rs_context =
    SELECT
        EventFunctions.GetContext(contexts_org_schema_web_page_1) AS context_web
    FROM @rs0;

@rs_data =
    SELECT
      context_web[0]["genre"] AS genre,
      context_web[0]["inLanguage"] AS language,
      context_web[0]["datePublished"] AS date_published,
      context_web[0]["author"] AS author,
      EventFunctions.GetArray(context_web[0]["breadcrumb"]) AS breadcrumb
    FROM @rs_context;

@final_rs =
    SELECT
        genre,
        language,
        date_published,
        author,
        breadcrumb[0] AS crumb1,
        breadcrumb[1] AS crumb2
    FROM @rs_data;

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
@rs_unstruct =
    SELECT
        EventFunctions.GetUnstructuredEvent(unstruct_event_com_snowplowanalytics_snowplow_link_click_1) AS unstruct_event
    FROM @rs0;

@final_rs =
    SELECT
        unstruct_event["targetUrl"] AS target_url,
        unstruct_event["elementClasses"] AS element_class,
        unstruct_event["elementId"] AS element_id
    FROM @rs_unstruct;

{% endhighlight %}

For more information, please check out the [ADLA Extractor technical documentation][adla-extractor-tech-docs].

<h2 id="help">6. Getting help</h2>

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[repo]: https://github.com/snowplow/snowplow-azure-data-lake-analytics-extractor
[extractor-usage-img]: /assets/img/blog/2017/08/adla-extractor-usage.png
[adla-extractor-setup-guide]: https://github.com/snowplow/snowplow/wiki/Azure-Data-Lake-Analytics-Event-Extractor
[adla-extractor-tech-docs]: https://github.com/snowplow/snowplow/wiki/Azure-Data-Lake-Analytics-Extractor-Setup

[event-data-modeling]: http://snowplowanalytics.com/blog/2016/03/16/introduction-to-event-data-modeling/

[azure-data-lake-store]: https://azure.microsoft.com/en-in/services/data-lake-store/
[adls-pricing-details]: https://azure.microsoft.com/en-gb/pricing/details/data-lake-store/
[azure-data-lake]: https://azure.microsoft.com/en-in/solutions/data-lake/
[azure-data-lake-analytics]: https://azure.microsoft.com/en-in/services/data-lake-analytics/
[u-sql]: https://blogs.msdn.microsoft.com/visualstudio/2015/09/28/introducing-u-sql-a-language-that-makes-big-data-processing-easy/
[usql-extractor]: https://msdn.microsoft.com/en-us/library/azure/mt621320.aspx
[visual-studio-dev-essentials]: https://azure.microsoft.com/en-gb/pricing/member-offers/vs-dev-essentials/
[azure-resource-manager-overview]: https://docs.microsoft.com/en-gb/azure/azure-resource-manager/resource-group-overview

[enriched-events]: https://github.com/snowplow/snowplow/wiki/canonical-event-model

[azure-rfc]: http://discourse.snowplowanalytics.com/t/porting-snowplow-to-microsoft-azure/1178

[snowplow-dotnet-sdk]: https://github.com/snowplow/snowplow-dotnet-analytics-sdk
[issues]: https://github.com/snowplow/snowplow-azure-data-lake-analytics-extractor/issues
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com/
