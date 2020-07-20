---
layout: post
title: "Snowplow iOS Tracker 1.4.0 released"
title-short: Snowplow iOS Tracker 1.4.0
tags: [snowplow, objc, ios, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/07/21/snowplow-ios-tracker-1.4.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-objc-tracker). [Version 1.4.0](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.4.0) introduces improvements to event management, avoiding duplication of the event ID when the same event object is reused multiple times. It also unifies the different methods for tracking events into a single `track` method (similar to the Snowplow Android tracker). Additionally, version 1.4.0 brings support for setting the `true_tstamp` as well as other updates and bug fixes.

Snowplow iOS Tracker Version 1.4.0 is available on [Cocoapods](https://cocoapods.org/pods/SnowplowTracker).

Read on below for:

1. [Avoid duplicate event IDs when reusing event objects](#duplicates)
2. [Support for single track method (similar to Android)](#singletrack)
3. [Support for setting the true timestamp](#timestamp)
4. [Updates and bug fixes](#updates)
5. [Documentation](#documentation)
6. [Getting help](#help)

<!--more-->

<h2 id="duplicates">1. Avoid duplicate event IDs when reusing event objects</h2>

In previous versions, the event objects created by the user already contained the `event_id`. If an event object is then tracked multiple times, i.e. 

{% highlight objc %}
SPScreenView *event = [SPScreenView build:^(id builder) {
    [builder setName:@"Home screen"];
    [builder setType:@"Navigation bar"];
    [builder setTransitionType:@"swipe"]
}];

[tracker track:event];
[tracker track:event];
{% endhighlight %}

this will lead to multiple events with the same event ID and device created timestamp being sent to the collector [GitHub issues #521](https://github.com/snowplow/snowplow-objc-tracker/issues/521). Furthermore, this can also lead to duplication of contexts in the same tracked event [GitHub issue #524](https://github.com/snowplow/snowplow-objc-tracker/issues/524). 

Version 1.4.0 moves the assignment of event ID into the event processing, so that the event object no longer contains it. This means you can now track the same event object multiple times, and each event will have a unique event ID and contexts will not be duplicated.

<h2 id="singletrack">2. Support for a single track method (similar to Android)</h2>

Snowplow's Android tracker uses a single `track` method for all the events tracked. To date, the iOS tracker has multiple specific track methods. However, as each event has a specific object type, sending each specific object type to a specific track method is redundant. Therefore we have simplified the tracker and it now uses a single `track` method for all events as well [GitHub issue #518](https://github.com/snowplow/snowplow-objc-tracker/issues/518).

For example, previously a screen view would need to be tracked manually like so:

{% highlight objc %}
SPScreenView *event = [SPScreenView build:^(id builder) {
    [builder setName:@"Home screen"];
    [builder setType:@"Navigation bar"];
    [builder setTransitionType:@"swipe"]
}];

[tracker trackScreenViewEvent:event];
{% endhighlight %}

Now, it can simply be tracked like this: 

{% highlight objc %}
SPScreenView *event = [SPScreenView build:^(id builder) {
    [builder setName:@"Home screen"];
    [builder setType:@"Navigation bar"];
    [builder setTransitionType:@"swipe"]
}];

[tracker track:event];
{% endhighlight %}

<h2 id="timestamp">3. Support for setting the true timestamp</h2>

Version 1.4.0 also comes with support for the `true_tstamp` [GitHub issue #276](https://github.com/snowplow/snowplow-objc-tracker/issues/276), an optional timestamp that can be manually set like so:  

{% highlight objc %}

{% endhighlight %}

This support was made possible by adding compatibility for the Snowplow `payload_data` schema [version 1.0.4](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4). 

<h2 id="updates">4. Updates and bug fixes</h2>

- Validate `eventData` in Self-Describing events [(#526)](https://github.com/snowplow/snowplow-objc-tracker/issues/526), checking it's a JSON serialisable dictionary.

- Fix a url percent escaping issue [(#525)](https://github.com/snowplow/snowplow-objc-tracker/issues/525) reported on [Discourse](https://discourse.snowplowanalytics.com/t/ios-objective-c-tracker-does-not-send-requests-with-error-unsupported-url/3976). 

- Move from Travis CI to GitHub Actions [(#517)](https://github.com/snowplow/snowplow-objc-tracker/issues/517).

<h2 id="documentation">5. Documentation</h2>

As always, information about how to use the tracker can be found in the [iOS Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/objective-c-tracker/ios-tracker-1-4-0/).

You can find the full release notes on GitHub as [Snowplow iOS Tracker v1.4.0 release](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.4.0).


<h2 id="help">6. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). 

Please raise any bugs in the [iOS Tracker’s issues](https://github.com/snowplow/snowplow-objc-tracker/issues) on GitHub.
