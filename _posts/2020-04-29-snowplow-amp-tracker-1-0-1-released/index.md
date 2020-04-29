---
layout: post
title-short: Snowplow AMP tracker 1.0.1
title: "Snowplow AMP tracker 1.0.1 released: Significant upgrade including custom events and entities"
description: Significant upgrade of the AMP tracker, including lots of new features.
author: Colm
category: Releases
permalink: /blog/2020/04/29/snowplow-amp-tracker-1.0.1-released/
discourse: false
---

We are delighted to announce a new release of the [Snowplow AMP Tracker][amp-tracker-docs]. Version 1.0 of the tracker introduces a host of new functionality to Snowplow tracking on the AMP platform:

- Page ping tracking
- Custom events and entities
- The AMP web page standard entity
- The AMP ID standard entity for user identification
- Linking users across AMP and non-AMP pages

It also overhauls some of the existing functionality, to resolve some issues involved in the misalignment between the tracking on the AMP platform, and tracking in a traditional web page.

This release introduces breaking changes to how data is tracked - users are encouraged to migrate to the latest version of the AMP tracker as soon as possible.

Read on below the fold for:  

1. [Aggregating Page Views](#page-view-agg)
    * [Page Ping Tracking](#page-pings)
    * [Web Page Entity](#wp-entity)
    * [Modeling Considerations](#modeling-pvs)
2. [Mapping User Journeys](#user-journeys)
    * [AMP ID Entity](#amp-id-entity)
    * [AMP Linker](#amp-linker)
    * [Modeling Considerations](#modeling-users)
3. [Custom Events](#custom-events)
4. [Custom Entities](#custom-entities)
5. [Changes to existing behaviour](#change-existing)


<!--more-->

<h2 id="page-view-agg">1. Aggregating Page Views</h2>

Page ping tracking and the AMP web page context have now been added to the AMP tracker, to enable users to track and aggregate page views, along a similar vein to doing so using the Snowplow Javascript Tracker.

<h3 id="page-pings"> 1.1 Page Ping Tracking</h3>

Page ping tracking has now been introduced to the AMP tracker. These operate differently to those of the Javascript tracker, because of differences between the environments. Page pings may be enabled using the [ampPagePing][amp-ping-docs] request in your trigger.

Once enabled, page ping events will be sent as an AMP-specific page ping event, against the [AMP page ping schema][amp-ping-schema]. This will contain the following data, as defined in the [AMP documentation for variable substitutions][amp-var-subs]: scrollLeft, scrollWidth, viewportWidth, scrollTop, scrollHeight, viewportHeight, totalEngagedTime.

Scroll percentage and engaged time metrics can be calculated by aggregating on these values. Additionally, this method can be used in combination with the new AMP web page entity to aggregate to a page view level.

Documentation can be found [in the page ping section of the AMP tracker docs][amp-ping-docs]

<h3 id="wp-entity"> 1.2 Web Page Entity</h3>

The web page entity has been introduced, and is attached to every event by default. The AMP web page entity attaches an AMP-specific entity to all events, against the [AMP web page schema][amp-wp-schema]. This contains the ampPageViewId.

Note that the value provided is the AMP-provided [Page View ID 64](https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md#page-view-id-64):

> Provides a string that is intended to be random with a high entropy and likely to be unique per URL, user and day.

Since the javascript tracker's page view id is globally unique, aggregating on this value alone will not produce the same results - it must be combined with url, amp client id, and date for aggregation.

<h3 id="modeling-pvs"> 1.3 Modeling Considerations</h3>

The data provided on AMP differs from that of the Javascript tracker, and thus should be modeled differently.

The scrollLeft and scrollTop fields provide the amount of scroll from the leftmost and topmost point of the page, in pixels. The scrollWidth/Height and viewportWidth/Height fields provide the size of the page, and size of the viewport, again in pixels. These values can therefore be aggregated together to calculate page scroll ratios in a similar but slightly different way to how this is done traditionally.

The AMP Page View ID value provided is not unique to an instance of a page view, but rather is unique when combined with the URL, date, and AMP client ID, so data should be aggregated by the concatenation of these values, rather than the ID alone.


<h2 id="user-journeys">2. Mapping User Journeys</h2>

User identification using AMP is now significantly improved, and functionality has been introduced to allow easier identification of users across AMP and traditional web pages. The AMP ID entity facilitates identifying users who move from traditional pages to AMP, the AMP linker is now used to map users from AMP to traditional pages, and the AMP client ID is now attached to all events as distinct from other user ids.

<h3 id="amp-id-entity"> 2.1 AMP ID Entity</h3>

The AMP ID entity is a new feature to Snowplow tracking, with a specific purpose of making it easier to identify users on the AMP platform, and across AMP and non-AMP pages. By default, the AMP ID entity will be attached to all events, against the [AMP ID schema][amp-id-schema].

This will contain the ampClientId (the consistent identifier for users on the AMP platform), the `user_id` if set, and the `domain_userid`, if provided by the Javascript tracker's cross-domain linker. (The AMP tracker does not generate a `domain_userid`).

The `domain_userid` can be made available to the AMP tracker when a user moves from a javascript tracker page to an AMP page, by enabling the javascript tracker's [cross-domain tracking][cd-linker] feature. The javascript tracker will attach the `domain_userid` to the querystring, and the AMP tracker will automatically retrieve it and attempt to retain it across pages.

Note that while the AMP tracker attempts to retain the domain userid across pages and sessions, the AMP platform does not offer any means to guarantee that this can be done in all cases - so the user identification strategy here is based on having the value attached to at least one event, rather than all events.

<h3 id="amp-linker"> 2.2 AMP Linker</h3>

The AMP tracker now offers the ability to attach the AMP client ID to the querystring, in order to identify users moving from an AMP page to a non-AMP page. This is enabled by ensuring that the AMP linker is enabled for any destination domains required:

{% highlight html %}
...
"linkers": {
  "enabled": true,
  "proxyOnly": false,
  "destinationDomains": ["ampdomain"]
},
...
{% endhighlight %}

This will add a querystring parameter ‘linker=’ to the destination url, which contains the amp_id value, base-64 encoded.


<h3 id="modeling-users"> 2.3 Modeling Considerations</h3>

The value attached to the querystring by the AMP linker will look something like this:   `?linker=1*1c1wx43*amp_id*amp-a1b23cDEfGhIjkl4mnoPqr`. To extract the AMP ID, this must be parsed, and the value immediately following the `amp_id*` string must be extracted.

This value will only be present for the first page the user lands on after leaving the AMP page.

If a `domain_userid` is found by the AMP tracker, it is not guaranteed to be attached to every event. Therefore, a good strategy for modeling user identification on both sides is to create a mapping table of domain_userid to amp-id, and join this to the rest of the data to attribute users.


<h2 id="custom-events">3. Custom Events</h2>

Custom events and entities can now be tracked using the AMP tracker - read more about the general topic of custom tracking with Snowplow in [the documentation][cust-events-docs].

Custom events are sent by instrumenting the selfDescribingEvent request in a trigger, and passing customEventSchemaVendor, customEventSchemaName, customEventSchemaVersion, customEventSchemaData to it as variables - where customEventSchemaData is an escaped JSON string, as follows:

{% highlight html %}
<amp-analytics type="snowplow_v2" id="custEvent">
<script type="application/json">
{
  "vars": {
    "collectorHost": "snowplow-collector.acme.com",  // Replace with your collector host
    "appId": "campaign-microsite"                    // Replace with your app ID
  },
  "triggers": {
    "trackSelfDescribingEvent": {
      "on": "click",
      "selector": "a",
      "request": "selfDescribingEvent",
      "vars": {
        "customEventSchemaVendor": "com.snowplowanalytics.snowplow",
        "customEventSchemaName": "link_click",
        "customEventSchemaVersion": "1-0-1",
        "customEventSchemaData": "{\"targetUrl\":\"${targetUrl}\",\"elementId\":\"TEST\",\"elementContent\":\"${elementContent}\"}"
      }
    }
  }
}
</script>
</amp-analytics>
{% endhighlight %}

Documentation can be found [in the custom event section of the AMP tracker docs][cust-events-docs]

<h2 id="custom-entities">4. Custom Entities</h2>

Custom entities can be attached to any event by assigning a full self-describing json - as an escaped json string - to a variable named `customContexts`. A singular entity may be passed, or more than one may be used if separated by a comma. For example:

{% highlight JSON %}
"vars": {
  "customContexts":  "{\"schema\":\"iglu:com.acme/first_context/jsonschema/1-0-0\",\"data\":{\"someKey\":\"someValue\"}},{\"schema\":\"iglu:com.acme/second_context/jsonschema/1-0-0\",\"data\":{\"someOtherKey\":\"someOtherValue\"}}"
{% endhighlight %}

Note that custom entities may be assigned globally (ie, for the entire tracking configuration rather than per-trigger) - however once one is assigned globally, more may not be added individually per-trigger.


Documentation can be found [here][cust-entities]

<h2 id="change-existing">4. Changes to Existing Behaviour</h2>

The following design decisions have been made in this tracker, to resolve issues with the design of the previous version:

- The domain userid field is now not populated.

This field should be reserved for the javascript tracker, which generated these values. The previous instrumentation of the AMP tracker populated it with a domain Userid if one is passed, or the amp client ID if not - which leads to significant complications in modeling data downstream. User identification is now done using the AMP ID entity, which is wholly distinct from the domain userid.

- Page Urls are now full urls

The previous instrumentation used the canonical url, which didn't contain the querystring, and didn't denote the domain from which the page is served. v1.0 of the AMP tracker uses the full ampdoc url.


- Device Created timestamp is now set instead of Device Set timestamp

AMP offers only one means of recording a timestamp, which is not likely to conform to the time of sending events. The device created timestamp is now used instead of device sent.


[amp-tracker-docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/google-amp-1-0-0-2/
[amp-ping-docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/google-amp-1-0-0-2/#page-pings
[amp-ping-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_page_ping/jsonschema/1-0-0
[amp-var-subs]: https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md
[cust-events-docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/google-amp-1-0-0-2/#custom-events
[cust-entities]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/google-amp-1-0-0-2/#customcontextsgoogle-amp-tracker/google-amp-1-0-0-2/?preview_id=1788&preview_nonce=b0ddfb27ea&preview=true#customcontexts
[amp-wp-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_web_page/jsonschema/1-0-0
[amp-id-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_id/jsonschema/1-0-0
[cd-linker]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/
