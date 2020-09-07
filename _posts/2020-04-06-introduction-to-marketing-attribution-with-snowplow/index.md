---
layout: post
title: "Introduction to marketing attribution with Snowplow"
description: "How you can start to use Snowplow for marketing attribution"
author: Cara Baestlein
category:  How to guides
permalink: /blog/2020/04/06/introduction-to-marketing-attribution-with-snowplow/
discourse: false
custom-cta-title: 'Explore Snowplow data'  
custom-cta-sub-title: 'Explore a sample of the granular event-level data Snowplow loads directly into your data warehouse, and see how it can be modeled to deliver actionable insights.'  
custom-cta-link: explore-snowplow-data-part-1/
custom-cta-link-text: Start now
---

Building out a comprehensive marketing strategy across all channels and platforms, each with varied and complex user journeys, is difficult. Evaluating the effectiveness of your marketing spend and calculating it’s ROI however should not be. 

Understanding how your marketing spend is contributing to conversions and sales is crucial in enabling you to continually adapt your strategy to changing customer preferences and the market environment. Many commercial solutions exist to help you understand how your marketing campaigns are performing. However, there are two main issues with many of these solutions: 



*   They are **silo-ed**. For example, Facebook gives you an overview of your performance on their platform, but it is difficult to compare that to performance of other channels.
*   They are **one-size-fits-all black boxes** that remove flexibility and control. For example, Google Analytics attribution can only attribute one channel to each session.

Snowplow puts you in control of how you attribute outcomes to marketing spend. You decide what data goes into your attribution model, you decide what counts as a marketing touch or a conversion across all your channels and platforms, you decide what attribution mechanism you want to use, and you decide how this information is displayed to the various stakeholders in your business.

To get you started, we've put together a quick introduction to marketing attribution on web using Snowplow, focusing on: 



*   Capturing where users come from
*   Modeling sessions
*   Adding marketing costs (with a Google ads example)


## Capturing where users come from

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


## Modeling sessions

The Snowplow JavaScript tracker also captures a session ID with each event, the `domain_sessionid`, as well as a session index. The session cookie is set against the same domain as the `domain_userid` cookie (a first-party cookie set against the domain the tracking is on). By default, it expires after 30 minutes of inactivity, but a different interval can be picked in the [tracker initialization](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#session-cookie-duration) (i.e. `sessionCookieTimeout: 3600` ).

The session ID is used to model sessions in Snowplow’s [web data model](https://github.com/snowplow/snowplow-web-data-model#web-data-model). This SQL model aggregates out-of-the-box page views and page pings into a set of derived tables: page_views, sessions and users. These tables have one row per page view ID (as captured in the [web page context](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#webPage)), session ID (i.e. the `domain_sessionid`) or user ID (i.e. the `domain_userid`). 



![Model Structure](/assets/img/blog/2020/04/model-structure.png)


In the session table, the marketing and referrer information of the first page view in that session is saved. This can be used to attribute conversions in a given session to a specific marketing channel.


## Adding marketing costs (Google Ads example)

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



## Next steps

Once you have developed an understanding of what channels drive customers to your digital products, you can proceed with defining what activities you want to attribute - whether its newsletter signups, pdf downloads, product purchases, subscriptions, etc. This information can also be added to sessions as additional metrics, or flags. The resulting table can then be used as the basis for your various attribution models.


## Marketing attribution with Snowplow

**Data is driving more high-stakes decisions across companies and industries, and marketing strategies are no exception. As your channel mix and user journeys grow more complex, it becomes less likely that silo-ed or one-size-fits-all commercial tools will deliver what you need to attribute and optimize your marketing spend accurately. Attributing credit to different events in the journey provides evidence of what is and isn't working, but without being able to take charge of your data to choose the attribution logic that reflects your customers' journeys (and their touchpoints), you cannot truly understand the real return on your investment. With Snowplow, you have that flexibility and control.**





