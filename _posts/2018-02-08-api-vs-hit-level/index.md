---
layout: post
title: "Warehousing Google Analytics data: API vs hit-level data"
title-short: Warehousing Google Analytics data
description: The different ways of interacting with Google Analytics data
tags: [analytics, Google Analytics, data warehousing]
author: Anthony
category: Analytics
permalink: /blog/2018/02/08/warehousing-google-analytics-data-api-vs-hit-level-data/
---

Recently, we very excitedly announced that Google Analytics users could use Snowplow to load their data into their own data warehouses in Redshift and Snowflake DB, a major milestone in making Snowplow available to as many data professionals as possible regardless of their infrastructure. We were humbled by how excited many of you were about this integration, though among the positive sentiment there was a recurring question: why? As we discussed [in the release post][r99], adding native support for Google Analytics gives users the benefits and opportunities of both platforms in a straightforward manner. Specifically, the integration allows for the warehousing of hit-level data collected by the Google Analytics Javascript trackers.

<h2 id="warehouse">Why warehouse your Google Analytics data at all?</h2>

Google Analytics is an amazingly powerful tool that has arguably set the standard for web analytics tools and was, for many professionals, the platform that introduced them to analytics. With its large variety of out-of-the-box reports and dashboards, it’s great for doing web analytics and the relatively frictionless setup process makes it the de facto tool for many organizations. Add to that the ability to build your own segments, funnels, and dashboards, and it’s clear why Google Analytics is the right choice for so many.

Just like any tool, however, there are certain limitations. If you want to combine behavioral data from the web with other data sets, such as customer data from a CRM system, product data from a merchandising system, or content data from a CMS, it can be incredibly difficult (if not impossible) without a highly experienced developer. But, by loading your Google Analytics data into a warehouse, such as Redshift or Snowflake, you can query that data in flexible ways across joined data sets, making the previous example feasible.

<h2 id="control">Taking control of your Google Analytics data</h2>

There are three ways to get your data out of Google Analytics. Each one has different benefits and use cases.

1. Via the Google Analytics API
2. By mirroring the Javascript HTTP requests that are made from the Google Analytics trackers to a new location
3. Accessing your data directly through BigQuery

Taking data and loading it via the GA API into a warehouse is the most common method of exporting Google Analytics data. Platforms like [XPlenty][xplenty], [Stitch Data][stitch], or [Treasure Data][treasure], for example, utilize this method to let users pump their GA data into their warehouse. While straightforward and accessible, Google Analytics only makes aggregated data available from the API: effectively you're downloading a report with each request. This makes actions like segmenting users by behavior using machine learning tools challenging because you’re limited by the granularity of the data you’re loading into your ML process.

The second method, mirroring the HTTP requests made by the Google Analytics Javascript on your website to another endpoint that you control, is the method we chose for our integration. Configuring Snowplow for Google Analytics might require front-loading more work (though thanks to Simo Ahava’s hard work, you can find a set of steps [on his website][simo]), but the end result is access to much more granular data. The data returned by this approach has many advantages, but also comes with some disadvantages. Google does a lot of post processing on the raw data before making it available via reports in the Analytics UI which won’t be applied to the mirrored data. This means, for example, that there are no session identifiers associated with each hit. You would also need to apply your own attribution model to the underlying data.

Looking at the Snowplow website, you can see how the Google Analytics Javascript tracker sends data:

![GA tracker on the Snowplow website][ga tracker]

Looking closer at the Request URL, you’ll notice data points like `v=1` noting this is the first visit, and `pageview&_s=1` noting the first pageview of the visit.

![mirrored GA tracker][sp mirror]

Now, looking at the Snowplow Javascript that mirrors the hit-level data, under Request Payload you can see the same parameters that were passed by the Google Analytics tracker. This means your data is still being sent to Google and loaded into your Analytics UI, but will also be sent to your selected warehousing target for further analysis.

These limitations do present challenges, but ones that our users are accustomed to overcoming. Snowplow users are familiar with event-level data and implementing data modeling processes that stitch user identities across different devices, platforms, and channels, divide each user’s stream into segments and units of work, and apply their own custom attribution models. Because of this, the mirroring the hit-level data was the obvious choice and is the method we recommend for anyone who wants to warehouse their Google Analytics data and prizes control, granularity, and flexibility over simplicity.

<h2 id="difference between api and hit level data">The difference between API and hit-level data</h2>

The hit-level data collected through Google Analytics is sent to their servers where it is sampled and returned to your dashboards, ready to be analyzed. When you move data into your warehouse through the API, you’re storing the sampled, pre-formatted data that’s returned to you and that you can view through the user interface. Hit-level data, on the other hand, is the Google terminology for event-level data, [a key ingredient in the type of sophisticated analytics we advocate for at Snowplow][intro]. The raw hit-level data, therefore, can answer much richer questions about your users and the activities they’re engaging in on your website like blogs read before submitting a lead form or time spent on each page in a given visit, all of which can be viewed at a user-by-user level.

<h2 id="examples">Examples</h2>

Let’s look at examples of what can be done with these two different data types. If you're accessing Google Analytics data through the API, Google does not provide an out of the box option for using cookie ID as a dimension or a filter, making it impossible to drill down to an individual or user level. In the absence of this, the GA API allows for pulling aggregate data that can be very useful in monitoring your web traffic.

Using Google Developer Tools Query Explorer, I attempted to run a query using as many metrics and dimensions as possible, looking to return the richest data possible. My first selection returned an error that these dimensions and metrics cannot be queried together- while Google Analytics has very detailed data, it needs to be combined in certain combinations. By modifying the dimensions and metrics in my query, I was able to generate results:

![initial GA query][ga query]

This returned the following table:

![GA query results][results]

Because the Google Analytics API only lets you fetch aggregate data, while you can find out the number of visitors in a particular segment on a particular day on your website, fetch a variety of metrics for those users (such as source/medium, browser, or session duration), you can’t get at the underlying, user-level data to follow an individual user’s journey. With the limits on API requests and inability to pull data in real-time, you need to be very strategic with your queries which could present a challenge for organizations with many users with their hands in working with the data. The result is that using the Query Explorer to recreate an individual user’s journey can be difficult and, requiring multiple queries which then must be connected, can be resource intensive.

Using this example, [Yali][author page] helped me pull an individual user’s journey from our Google Analytics data using Snowplow. To do that, we entered the following SQL query into [Redash][redash]:

```SQL
SELECT
  collector_tstamp,
  page_urlhost,
  page_urlpath,
  geo_country,
  geo_city
FROM atomic.events e
JOIN atomic.com_google_analytics_measurement_protocol_user_1 u
  ON u.root_id = event_id and u.root_tstamp = collector_tstamp
WHERE collector_tstamp > '2017-02-01'
  AND u.root_tstamp > '2017-02-01'
  AND u.client_id = '1639187844.1490602369'
ORDER BY 1;
```

This query collects the page URL, URL path, and geo-location for one given visitor to the website. The generated table gives you a breakdown of each page visited by that user within the given time frame.

![Snowplow queried data][snowplow results]


Clicking through the eight pages of results returned by the query will let you retrace the user’s steps as they navigated your website. Adding in additional metrics or dimensions is as straightforward as modifying the SQL query, though that’s easier for some than others. However, even with the extra energy required to have data agency using Snowplow with Google Analytics, the resulting data sets have the potential to be exponentially more specific to your use case and therefore more meaningful in many situations.

<h2 id="try hit-level data">Give hit-level data a try!</h2>

If you’re a Google Analytics user hitting the limits of what you can currently do with your data because of challenges posed by aggregate data or you want to join your Google Analytics data with other data sets in a warehouse for analysis, [contact us][contact] to learn more! We’re always excited to have a chat.



[r99]: https://snowplowanalytics.com/blog/2018/01/25/snowplow-r99-carnac-with-google-analytics-support/

[xplenty]: https://www.xplenty.com/

[stitch]: https://www.stitchdata.com/

[treasure]: https://www.treasuredata.com/

[simo]: https://www.simoahava.com/analytics/snowplow-full-setup-with-google-analytics-tracking/

[ga tracker]: /assets/img/blog/2018/02/ga-tracker.jpg

[sp mirror]: /assets/img/blog/2018/02/sp-ga-tracker.jpg

[intro]: https://snowplowanalytics.com/blog/2016/03/16/introduction-to-event-data-modeling/

[ga query]: /assets/img/blog/2018/02/ga-query.jpg

[results]: /assets/img/blog/2018/02/ga-query-results.jpg

[author page]: https://snowplowanalytics.com/blog/authors/yali/

[redash]: https://redash.io/

[snowplow results]: /assets/img/blog/2018/02/results-sp-ga-tracker.jpg

[contact]: https://snowplowanalytics.com/company/contact-us/
