---
layout: post
title: "Snowplow JavaScript Tracker 2.13.0 released"
title-short: Snowplow JavaScript Tracker 2.13.0
tags: [snowplow, javascript, tracker]
author: Paul
category: Releases
permalink: /blog/2019/11/07/snowplow-javascript-tracker-2.13.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker].

[Version 2.13.0][2.13.0-tag] introduces the first example of edge analytics within our JavaScript tracker, through a new callback function it is now possible to recieve the activity tracking (page ping) events in the browser and perform analysis of them in the browser, for example aggregating them into a single event. You'll find an example of how do to this further down this post.

This release also improves support for Single Page Applications (SPA) by resetting the activity tracking timers when a Page View event is fired. We've also improved Beacon API reliability, particularly within Safari, and added improved error handling in the tracker initialisation callback method. We've also taken the opportunity with this release to remove all user fingerprinting technology within the JavaScript tracker.

NB. This release continues with the change we introduced with v2.11.0 to how assets are hosted - rather than hosting the tracker on CloudFront, we now publish the asset to the GitHub release. Users who have previously relied on the CloudFront hosted asset must host the tracker on their own CDN, as is recommended practice. More detail can be found in our [v2.11.0 release post][js-tracker-2.11.0-post].

Read on below for:

1. [Edge Analytics with activity tracking callback](#edge-analytics)
2. [Resetting page activity on page view event](#activity-reset)
3. [Improving Beacon API support](#beacon-improvements)
4. [Improved error handling in tracker callback](#tracker-callback)
5. [Removing user fingerprinting](#user-fingerprint)
6. [Updates and bug fixes](#updates)
7. [Upgrading](#upgrade)
8. [Documentation and help](#doc)

<!--more-->

<h2 id="edge-analytics">1. Edge Analytics with activity tracking callback</h2>

[Activity Tracking][activity-tracking] is a popular feature of the Snowplow JavaScript tracker, however to achieve accurate page activity timing it is useful to configure the JavaScript tracker to send "Page Ping" events to the Snowplow collector quite frequently. Often the tracker is configured to send an event every 10 seconds allowing page acitivty timing to be accurate to 10 seconds. The side effect of increased accuracy is potentially a significant increase in activity related page ping events being tracked and sent to the Snowplow collector.

Version 2.13.0 of the JavaScript tracker introduces a new edge analytics feature that will allow the page ping events to be collected and aggregated in the browser before being sent to the collector in a single event. This requires some additional work on the part of the site maintainer as there are many ways you may choose to aggregate and send this information to the Snowplow collector.

To achieve this, the JavaScript tracker now exposes a new callback method called `enableActivityTrackingCallback`. This allows you to specify your own callback function, meaning that each time a page ping event would normally be sent to the Snowplow collector instead your callback function will be executed with the page activity information.

Below is a complete example of utilising this new functionality to aggregate page acitivty information and send the event just before the page unloads:

{% highlight javascript %}
window.snowplow('newTracker', 'sp', '<<collectorUrl>>', {
    appId: 'my-app-id',
    eventMethod: 'beacon',
    contexts: {
        webPage: true,
        performanceTiming: true
    }
});
var aggregatedEvent = {
    pageViewId: null,
    minXOffset: 0,
    maxXOffset: 0,
    minYOffset: 0,
    maxYOffset: 0,
    numEvents: 0
};
window.snowplow('enableActivityTrackingCallback', 10, 10, function (event) {
    aggregatedEvent = {
        pageViewId: event.pageViewId,
        minXOffset: aggregatedEvent.minXOffset < event.minXOffset ? aggregatedEvent.minXOffset : event.minXOffset,
        maxYOffset: aggregatedEvent.maxYOffset > event.maxYOffset ? aggregatedEvent.maxYOffset : event.maxYOffset,
        minYOffset: aggregatedEvent.minYOffset < event.minYOffset ? aggregatedEvent.minYOffset : event.minYOffset,
        maxYOffset: aggregatedEvent.maxYOffset > event.maxYOffset ? aggregatedEvent.maxYOffset : event.maxYOffset,
        numEvents: aggregatedEvent.numEvents + 1
    };
});
window.addEventListener('unload', function() {
    window.snowplow('trackSelfDescribingEvent', {
        schema: 'iglu:com.acme_company/page_unload/jsonschema/1-0-0',
        data: {
            minXOffset: aggregatedEvent.minXOffset,
            maxXOffset: aggregatedEvent.maxXOffset,
            minYOffset: aggregatedEvent.minYOffset,
            maxYOffset: aggregatedEvent.maxYOffset,
            activeSeconds: aggregatedEvent.numEvents * 10
        }
    });
});
window.snowplow('trackPageView');
{% endhighlight %}

Note: For this technique of sending on page unload to work reliably, we recommend initialising the Snowplow tracker with `eventMethod: 'beacon'` or `stateStorageStrategy: 'cookieAndLocalStorage'` (if navigating to a page that also contains the JS Tracker). This technique will not work for Single Page Applications (SPA), where you would need to send the aggregated event to the Snowplow collector on navigation within your application.

<h2 id="activity-reset">2. Resetting page activity on page view event</h2>

<h2 id="beacon-improvements">3. Improving Beacon API support</h2>

<h2 id="tracker-callback">4. Improved error handling in tracker callback</h2>

{% highlight javascript %}
snowplow("newTracker", "sp", "<collector-url>", {
    appId: "<app-id>",
    eventMethod: "post",
    contexts: {
        webPage: true,
        performanceTiming: true
    }
});
{% endhighlight %}

<h2 id="user-fingerprint">5. Removing user fingerprinting</h2>

<h2 id="updates">6. Updates and bug fixes</h2>

Other updates and bugfixes included in this release:

- Change setup process to use Docker ([#782][782])
- Fix al.optimizely.get is not a function error ([#619][619])
- Further harden the Optimizely integrations ([#654][654])
- Use local sp.js for example pages ([#790][790])
- Change deprecation strings to constants and reuse ([#791][791])

<h2 id="upgrade">7. Upgrading</h2>

The tracker is available as a published asset in the [2.13.0 Github release][2.13.0-tag]:

To upgrade, host the 2.13.0 version of `sp.js` asset on a CDN, and load the tracker from there.

There are no breaking API changes introduced with this release, although as mentioned above User Fingerprints will no longer track with any events and the default behaviour on Page View events has changed to reset activity timers.

<h2 id="doc">8. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.13.0 release page][2.13.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.13.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.13.0
[js-tracker-2.11.0-post]: /blog/2019/09/13/snowplow-javascript-tracker-2.11.0-released-with-gdpr-context/#deployment
[activity-tracking]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#pagepings
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[782]: https://github.com/snowplow/snowplow-javascript-tracker/issues/782
[619]: https://github.com/snowplow/snowplow-javascript-tracker/issues/619
[654]: https://github.com/snowplow/snowplow-javascript-tracker/issues/654
[790]: https://github.com/snowplow/snowplow-javascript-tracker/issues/790
[791]: https://github.com/snowplow/snowplow-javascript-tracker/issues/791
