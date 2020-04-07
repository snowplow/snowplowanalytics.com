---
layout: post
title: "Snowplow JavaScript Tracker 2.13.0 released"
title-short: Snowplow JavaScript Tracker 2.13.0
tags: [snowplow, javascript, tracker]
author: Paul
category: Releases
permalink: /blog/2020/02/10/snowplow-javascript-tracker-2.13.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker].

[Version 2.13.0][2.13.0-tag] introduces the first example of edge analytics within our JavaScript tracker. Through a new callback function it is now possible to recieve the activity tracking (page ping) events in the browser and perform analysis of them in the browser, for example aggregating them into a single event. You'll find an example of how do to this further down this post.

This release also improves support for Single Page Applications (SPA) by resetting the activity tracking timers when a page view event is fired. We've also improved Beacon API reliability, particularly within Safari, and added improved error handling in the tracker initialisation callback method. We've also taken the opportunity with this release to remove all user fingerprinting technology within the JavaScript tracker.

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

[Activity Tracking][activity-tracking] is a popular feature of the Snowplow JavaScript tracker, however to achieve accurate activity timing it is common to configure the JavaScript tracker to send page ping events to the Snowplow collector quite frequently. Often the tracker is configured to send an event every 10 seconds, allowing activity timing to be accurate to 10 seconds. The side effect of increased accuracy, and activity tracking in general, is potentially a significant increase in events being sent to the Snowplow collector.

Version 2.13.0 of the JavaScript tracker introduces a new edge analytics feature that will allow the page ping events to be collected and aggregated in the browser before being sent to the collector in a single event. This requires some additional work on the part of the site maintainer as there are many ways you may choose to aggregate and send this information to the Snowplow collector.

To achieve this, the JavaScript tracker now exposes a new function called `enableActivityTrackingCallback`. Using this callback means that each time a page ping event would normally be sent to the Snowplow collector instead your callback function will be executed with the page activity information.

Below is a complete example of utilising this new functionality to aggregate page activity information and send the event as the page unloads:

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

Note: For this technique of sending on page unload to work reliably, we recommend initialising the Snowplow tracker with `eventMethod: 'beacon'` and/or `stateStorageStrategy: 'cookieAndLocalStorage'` (if navigating to a page that also contains the JS Tracker). Using the page unload technique will not work for Single Page Applications (SPA), you would need to send the aggregated event to the Snowplow collector on navigation within your application.

<h2 id="activity-reset">2. Resetting page activity on page view event</h2>

In previous releases, the activity tracking feature begins timing page ping events when the first page view event is tracked. This works well if each new page reloads the Snowplow JavaScript tracker. Single Page Applications (SPA) are becoming more common which causes activity tracking to not fire at expected intervals as the timing doesn't reset on subsequent page views.

As an example of this behaviour, lets say you are using the JavaScript tracker on a Single Page Application and you have your activity tracking configured to send a page ping every 10 seconds. If a second page view event is created when you are 5 seconds into the first page view, then the activity tracking will still fire 10 seconds after the first page view rather than the expected 10 seconds after the second page view. This means you get a page ping event sent only 5 seconds into the second page view.

With version 2.13.0, when a second (or third, etc) page view is tracked, the activity tracking timing will reset as though this is a brand new reload of the tracker. Using the same example above, this means if a second page view event is created when you are 5 seconds into the first page view, then the activity tracking will fire 10 seconds after the second page view; 15 seconds after the first page view.

<h2 id="beacon-improvements">3. Improving Beacon API support</h2>

The Beacon API functionality that was fully introduced in [version 2.10.2][2.10.0-blog] of the JavaScript tracker has proved useful as a way of ensuring events are sent more reliably, as the sending of events is passed to the browser to handle asynchronously. This means events are sent even in the cases when the page is closed.

Unfortunately, this is quite an immature API and browser support has been hit and miss. We have received reports of the Beacon API not performing as expected on Chromium based browsers (Chrome, Opera, Edge) and Safari. With regards to Chromium browsers, this is a [known bug in Chromium][chrome-beacon-bug] that prevents Beacon from working however the JavaScript tracker successfully falls back to sending events as standard Post requests. This bug has very recently been fixed in Chromium and is now available in Chrome Canary, we expect to see this fix make it into Chrome Stable in a couple of months which will allow users to see the benefits of Beacon in Chrome too.

With this release we have taken the opportunity to improve the reliability of Beacon in Safari, where we have observed differences in events between Post and Beacon being around 6 to 10% less events when Beacon is used. With this release, we are now always sending the first event using Post. This ensures that Safari correctly sends the required preflight request to ensure that the Beacon API works. With this fix in place, we have seen the difference come down to around 0.5%, often seeing more events for implementations using Beacon as we would expect.

<h2 id="tracker-callback">4. Improved error handling in tracker callback</h2>

When initialising a tracker, there is an option to specify a callback function on tracker initialisation. If an error occurs in this function then it will prevent the tracker initialisation from completing, stopping any events from sending. We now gracefully handle exceptions that occur within this callback method and allow the tracker to continue to send events.

We will now handle errors such as the one in the example below:

{% highlight javascript %}
window.snowplow("newTracker", "sp", "<collector-url>", {
    appId: "<app-id>",
    eventMethod: "post",
    contexts: {
        webPage: true
    }
});

window.snowplow(function() {
    var sp = this.sp;
    sp.thisWillError(); //Function doesn't exist
});
{% endhighlight %}

<h2 id="user-fingerprint">5. Removing user fingerprinting</h2>

We have taken the decision to remove all fingerprinting functionality from the Javascript tracker. We have done this for a couple of reasons:

1. There are a growing number of tools that provide visitors on the web with more control of their privacy and what data they share. Today, fingerprinting technology is largely used as a way to circumvent these controls, which we do not believe is right.
2. The fingerprinting functionality that was offered in the Javascript tracker was never effective. It used a very naive approach that was contributed many years ago, and was not a robust way to identify individual devices, even when used in conjunction with other data points like IP address.
3. The presence of fingerprinting technology may lead to trackers being blocked, disadvantaging companies who are using the Snowplow technology who are being responsible and transparent with visitors to the website about what data they are collecting and how they are using it.

With this release all fingerprinting capabilities have been removed from the JavaScript tracker. The API methods still exist to ensure errors do not occur if upgrading but you will see warnings in the Developer Console of the browser and the User Fingerprint field of an event will no longer be populated. The fingerprinting API methods will be entirely removed in version 3.0.0.

As part of this effort we have removed the Augur Identity automatic context which utilised fingerprinting to identify users. If you were using this context and wish to continue, we suggest you manually attach the Augur Identity context using the trackers global contexts feature to maintain existing behaviour.

<h2 id="updates">6. Updates and bug fixes</h2>

Changelog of updates and bugfixes included in this release:

- Add activity tracking callback mechanism ([#765][765])
- Reset activity on page view ([#750][750])
- Remove user_fingerprint ([#549][549])
- Handle errors in tracker callback ([#784][784])
- Update beacon support to handle "gotchas" ([#716][716])
- Change setup process to use Docker ([#782][782])
- Fix al.optimizely.get is not a function error ([#619][619])
- Further harden the Optimizely integrations ([#654][654])
- Use local sp.js for example pages ([#790][790])
- Change deprecation strings to constants and reuse ([#791][791])

<h2 id="upgrade">7. Upgrading</h2>

The tracker is available as a published asset in the [2.13.0 Github release][2.13.0-tag]:

To upgrade, Snowplow Insights and Open Source users should host the 2.13.0 version of `sp.js` asset on a CDN, and load the tracker from there.

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
[2.10.0-blog]: https://snowplowanalytics.com/blog/2019/01/23/snowplow-javascript-tracker-2.10.0-released-with-global-contexts/#beacon-api
[activity-tracking]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#pagepings
[chrome-beacon-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=724929
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[765]: https://github.com/snowplow/snowplow-javascript-tracker/issues/765
[750]: https://github.com/snowplow/snowplow-javascript-tracker/issues/750
[549]: https://github.com/snowplow/snowplow-javascript-tracker/issues/549
[784]: https://github.com/snowplow/snowplow-javascript-tracker/issues/784
[716]: https://github.com/snowplow/snowplow-javascript-tracker/issues/716
[782]: https://github.com/snowplow/snowplow-javascript-tracker/issues/782
[619]: https://github.com/snowplow/snowplow-javascript-tracker/issues/619
[654]: https://github.com/snowplow/snowplow-javascript-tracker/issues/654
[790]: https://github.com/snowplow/snowplow-javascript-tracker/issues/790
[791]: https://github.com/snowplow/snowplow-javascript-tracker/issues/791
