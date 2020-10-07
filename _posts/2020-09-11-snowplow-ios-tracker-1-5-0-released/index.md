---
layout: post
title: "Snowplow iOS Tracker 1.5.0 released"
title-short: Snowplow iOS Tracker 1.5.0
tags: [snowplow, objc, ios, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/09/11/snowplow-ios-tracker-1.5.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-objc-tracker). [Version 1.5.0](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.5.0) introduces tracker diagnostics that make spotting and diagnosing tracker issues easier. It also comes with a refactor of the `Emitter` and bug fix related to the `writeSessionToFile` method.

Snowplow iOS Tracker Version 1.5.0 is available on [Cocoapods](https://cocoapods.org/pods/SnowplowTracker).

Read on below for:

1. [Tracker diagnostics](#diagnostics)
2. [Refactoring the Emitter](#emitter)
3. [Updates and bug fixes](#updates)
4. [Documentation](#documentation)
5. [Getting help](#help)

<!--more-->

<h2 id="diagnostics">1. Tracker diagnostics</h2>

The tracker diagnostics feature adds the ability for the tracker to report logs to the main app ([GitHub issue #534](https://github.com/snowplow/snowplow-objc-tracker/issues/534)) as well as to send them to a Snowplow collector ([GitHub issue #533](https://github.com/snowplow/snowplow-objc-tracker/issues/533)).

The tracker already managed errors internally, avoiding crashes of the app and assuring that no events are lost. Up to this point however, if an internal error compromises the behaviour of the tracker when the app is in production it is difficult to get information on what is going wrong inside the tracker.

This new feature allows the app to get the tracker logs, and you can decide which log level you want to filter logs to when you configure the tracker:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setLogLevel:SPLogLevelVerbose];
    ...
}];
{% endhighlight %}

There are four levels of logging: off (log disabled), error, debug, verbose.

The tracker can also report the errors to a configured Snowplow collector as `diagnostic_error` events. You can instrument this like so:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setDiagnosticLogger:self];
    ...
}];
{% endhighlight %}

More information on this can be found in the [technical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/objective-c-tracker/ios-tracker-1-5-0/#troubleshooting).


<h2 id="emitter">2. Refactoring the Emitter</h2>

The Emitter is now split it into three parts ([GitHub issue #540](https://github.com/snowplow/snowplow-objc-tracker/issues/540)):

* the `EventStore`: handles the persistence of tracked events not yet sent to the collector
* the `NetworkConnection`: establishes the connection with the collector and performs the requests
* the `Emitter`: handles dispatching, i.e. aggregation of events into a single request and backoff and retry of failed requests

The `SPEmitter` API is still the same, so the `EventStore` and the `NetworkConnection` can be configured automatically by the Emitter from the `SPEmitter` configuration. However, this setup improves testing and makes it easier to add new functionality in the future.


<h2 id="updates">3. Updates and bug fixes</h2>

- Crash connected with method writeSessionToFile in SPSession ([GitHub issue #515](https://github.com/snowplow/snowplow-objc-tracker/issues/515))

<h2 id="documentation">4. Documentation</h2>

As always, information about how to use the tracker can be found in the [iOS Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/objective-c-tracker/ios-tracker-1-5-0/).

You can find the full release notes on GitHub as [Snowplow iOS Tracker v1.5.0 release](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.5.0).


<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). Please raise any bugs in the [iOS Tracker’s issues](https://github.com/snowplow/snowplow-objc-tracker/issues) on GitHub.
