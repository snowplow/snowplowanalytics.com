---
layout: post
title: "Snowplow Android Tracker 1.6.0 released"
title-short: Snowplow Android Tracker 1.6.0
tags: [snowplow, android, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/09/11/snowplow-android-tracker-1.6.0-released/
discourse: false
---

We are pleased to announce [Snowplow Android Tracker](https://github.com/snowplow/snowplow-android-tracker) 1.6.0. [Version 1.6.0]((https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.6.0)) introduces the ability for the tracker to report tracker errors to the main app. It also comes with a refactor of the `Emitter`.

Read on below for:

1. [Tracker diagnostics](#diagnostics)
2. [Refactoring the Emitter](#emitter)
3. [Documentation](#documentation)
4. [Getting help](#help)

<!--more-->

<h2 id="diagnostics">1. Tracker diagnostics</h2>

The tracker diagnostics feature adds the ability for the tracker to report logs to the main app ([GitHub issue #407](https://github.com/snowplow/snowplow-android-tracker/issues/407)).

The tracker already managed errors internally, avoiding crashes of the app and assuring that no events are lost. The tracker could also report the errors to a configured Snowplow collector as `diagnostic_error` events (this was introduced in version 1.4.0).

This new feature allows the app to get the tracker logs, and you can decide which log level you want to filter logs to when you configure the tracker:

{% highlight java %}
TrackerBuilder trackerBuilder =
    new TrackerBuilder(emitter, namespace, appId, appContext)
        ...
        .level(LogLevel.VERBOSE)
        ...
        .build();
Tracker.init(trackerBuilder);
{% endhighlight %}

There are four levels of logging: off (log disabled), error, debug, verbose. More information on this can be found in the [technical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/android-tracker/android-1-6-0/#troubleshooting).


<h2 id="emitter">2. Rectoring the Emitter</h2>

The Emitter is now split it into three parts ([GitHub issue #409](https://github.com/snowplow/snowplow-android-tracker/issues/409)):

* the `EventStore`: handles the persistence of tracked events not yet sent to the collector
* the `NetworkConnection`: establishes the connection with the collector and performs the requests
* the `Emitter`: handles dispatching, i.e. aggregation of events into a single request and backoff and retry of failed requests

The Emitter API is still the same, so the `EventStore` and the `NetworkConnection` can be configured automatically by the Emitter from the `Emitter` configuration. However, this setup improves testing and makes it easier to add new functionality in the future.


<h2 id="documentation">3. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/android-tracker/android-1-6-0/).

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.6.0 release](https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.6.0).


<h2 id="help">4. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). Please raise any bugs in the [Android Tracker’s issues](https://github.com/snowplow/snowplow-android-tracker/issues) on GitHub.
