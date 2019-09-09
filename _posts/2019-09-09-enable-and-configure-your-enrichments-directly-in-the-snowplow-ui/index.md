---
layout: post
title: Enable and configure your enrichments directly in the Snowplow UI
title-short: Enable and configure enrichments in the Snowplow UI
author: Lyuba
category: Releases
permalink: /blog/2019/09/09/enable-and-configure-your-enrichments-directly-in-the-snowplow-ui
---


## Overview

![Enrichments](/assets/img/blog/2019/09/snowplow-ui.png) 

Enrichments are one of Snowplow’s most powerful features. Not all the data that describes an event is available at the place that event is tracked. Enrichments make it possible to enhance your dataset with additional details by adding first and third-party data points to each event, in real-time, further down the data collection pipeline. 

For example, imagine you are an e-commerce site selling a green dress internationally. The same green dress will be sold in different currencies across countries, so as each purchase takes place, you’ll want to convert local currencies into your base currency using up-to-date exchange rates. The fastest and easiest way to join converted currency values to each purchase event, is to use the Currency Conversion Enrichment, which will join the converted currency to each event as it happens. This way, you will be able to avoid the extra step of joining separate tables later on in your warehouse. 

Up until now, setting up an enrichment meant Snowplow Insights customers had to:



1. Create configuration JSONs
2. Upload them to Github
3. Deploy them

     


Now, users can view all available enrichments, configure, enable and disable them directly from the UI without using any command line tools.


## Benefits

With Snowplow, you can now easily find and enable any of the [15 available enrichment modules ](https://docs.snowplowanalytics.com/snowplow-insights/enrichments/)directly from the Snowplow UI.

Using the Snowplow UI, Snowplow Insights customers can:



*   Monitor which enrichments are currently running
*   Easily switch on new enrichments or disable existing enrichments
*   See which additional enrichments are available 
*   View the configuration of each enrichment

This new functionality makes setting up enrichments easier and faster, so you can customize and keep track of the enrichments you add to your data.


## Get Started



*   This functionality will be automatically rolled out for all Snowplow Insights customers  
*   If you would like early access to this functionality, contact us at product-team@snowplowanalytics.com and we’ll get you up and running
*   Not a Snowplow Insights customer yet?[ Get in touch with us here to le