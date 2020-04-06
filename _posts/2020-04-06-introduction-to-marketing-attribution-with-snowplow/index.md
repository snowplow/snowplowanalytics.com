---
layout: post
title: "Introduction to marketing attribution with Snowplow"
description: "How you can start to use Snowplow for marketing attribution"
author: Cara Baestlein
category:  How to guides
permalink: /blog/2020/04/06/introduction-to-marketing-attribution-with-snowplow/
discourse: false
---


When you construct a marketing strategy and plan campaigns and tactics to fit within the strategy and achieve your goals, one of the biggest pain points you probably run into is properly accounting for how effective these efforts are. You've invested time and marketing budget into your strategy, but how can you optimize your marketing spend in a multi-touch world, with varied and increasingly complex user journeys, without understanding what works? Marketing attribution helps avoid wasted marketing budget and gets you back on track with properly optimizing marketing spend. 

Many commercial solutions exist that try to tell you how much value your marketing campaigns have created. Two issues that emerge with these solutions are: 



*   Siloed tools: These solutions are siloed. For example, Facebook gives you an overview of your performance, but it is only that channel in isolation
*   Holistic tools: These solutions are often one-size-fits-all black boxes that remove your flexibility and control

Snowplow's approach is about putting ownership of your attribution model in your hands, so you can decide your attribution logic and more accurately attribute spend and revenue across different touchpoints.

To get you started, we've put together a quick introduction to marketing attribution using Snowplow, focusing on: 



*   Capturing where users come from
*   Modeling sessions
*   Adding marketing costs (with a Google ads example)


# Capturing where users come from

Out of the box, the Snowplow JavaScript tracker captures both the page URL and the referrer URL. The [campaign attribution enrichment](https://docs.snowplowanalytics.com/snowplow-insights/enrichments/campaign-attribution-enrichment/) can then parse out any marketing parameters that are present in the page URL, as well as click IDs from Google or other search engines. By default, it looks for the `utm_` fields, but other marketing parameters can be specified as well. The[ referrer parser enrichment](https://docs.snowplowanalytics.com/snowplow-insights/enrichments/referrer-parser-enrichment/) will also classify the referrer. Together, these two enrichments populate the following fields in atomic.events: 


|      **Marketing fields** | **Referred fields** | 
|--------------:|:----------------------------|
| mkt_medium    | refr_medium   |
| mkt_source    | refr_source   |
| mkt_term    | refr_term   |
| mkt_content    |  |
| mkt_campaign    |   |
| mkt_network    |    |
| mkt_clickid    |    |


More information on these fields can be found in Snowplow’s [canonical event model](https://github.com/snowplow/snowplow/wiki/canonical-event-model#221-web-specific-fields). 


# Modeling sessions

The Snowplow JavaScript tracker also captures a session ID with each event, the `domain_sessionid`, as well as a session index. The session cookie is set against the same domain as the `domain_userid` cookie (a first-party cookie set against the domain the tracking is on). By default, it expires after 30 minutes of inactivity, but a different interval can be picked in the [tracker initialization](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#session-cookie-duration) (i.e. `sessionCookieTimeout: 3600` ).

The session ID is used to model sessions in Snowplow’s [web data model](https://github.com/snowplow/snowplow-web-data-model#web-data-model). This SQL model aggregates out-of-the-box page views and page pings into a set of derived tables: page_views, sessions and users. These tables have one row per page view ID (as captured in the [web page context](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#webPage)), session ID (i.e. the `domain_sessionid`) or user ID (i.e. the `domain_userid`). 



![Model Structure](/assets/img/blog/2020/04/model-structure.png)

In the session table, the marketing and referrer information of the first page view in that session is saved. This can be used to attribute conversions in a given session to a specific marketing channel. 


# Adding marketing costs (Google Ads example)

If marketing costs are pulled into the data warehouse (using an ETL tool such as [Stitch](https://www.stitchdata.com/)), they can be added to the sessions table based on the marketing parameters. For example, if the Google click and keyword performance reports are available, the average cost per click can be added to sessions that originated from a paid Google search using the marketing click ID: 


{% highlight SQL %}
CREATE TABLE {{.scratch_schema}}.adwords_keyword_click_performance
  DISTKEY(aw_googleclickid)
  SORTKEY(aw_googleclickid)
AS(
  WITH click_performance AS(
    SELECT
      cpr.googleclickid AS googleclickid,
      cpr.day::date as date_day,
      cpr.adgroupid AS adgroupid,
      cpr.keywordid AS keywordid
    FROM {{.adwords_schema}}.click_performance_report AS cpr
    WHERE cpr.googleclickid IS NOT NULL
    GROUP BY 1,2,3,4
  )
  SELECT
    cp.googleclickid as aw_googleclickid,
    kpr.keywordid as aw_keyword_id,
    kpr.keyword as aw_keyword,
    kpr.adgroup as aw_ad_group,
    kpr.adgroupid as aw_ad_group_id,
    kpr.adgroupstate as aw_ad_group_state,
    kpr.campaign as aw_campaign,
    kpr.campaignid as campaign_id,
    kpr.campaignstate as aw_campaign_state,
    kpr.customerid as aw_customer_id,
    kpr.clicks as aw_clicks,
    kpr.impressions as aw_impressions,
    cast((kpr.cost::float/1000000::float) as numeric(38,6)) as 
aw_total_cost,
    cast((kpr.avgcpc::float/1000000::float) as numeric(38,6)) as 
aw_avg_cpc,
    kpr.day::date as date_day
  FROM {{.adwords_schema}}.keywords_performance_report AS kpr
    INNER JOIN click_performance AS cp
    ON kpr.keywordid = cp.keywordid
    AND kpr.day::date = cp.date_day
    AND kpr.adgroupid = cp.adgroupid
  GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
);
{% endhighlight %}



## Marketing attribution with Snowplow

Data is driving more high-stakes decisions across companies and industries, and marketing attribution is no exception. As your user journeys grow more complex, it becomes less likely that siloed or one-size-fits-all commercial tools will deliver what you need to attribute and optimize your marketing spend accurately. Attributing credit to different events in the journey provides evidence of what is and isn't working, but without being able to take charge of your data to choose the attribution model(s) that reflect your customers' journeys (and their touchpoints), you cannot truly understand the real return on your investment. With Snowplow, you have that flexibility.







