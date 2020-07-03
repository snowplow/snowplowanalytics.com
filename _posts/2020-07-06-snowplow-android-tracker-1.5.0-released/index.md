---
layout: post
title: "Snowplow Android Tracker 1.5.0 released"
title-short: Snowplow Android Tracker 1.5.0
tags: [snowplow, android, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/07/06/snowplow-android-tracker-1.5.0-released/
discourse: false
---

We are pleased to announce [Snowplow Android Tracker](https://github.com/snowplow/snowplow-android-tracker) 1.5.0. [Version 1.5.0]((https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.5.0)) introduces improvements to event management, avoiding duplication of the event ID when the same event object is reused multiple times. Additionally, it includes reporting of processing errors in background threads so that they can be tracked using the diagnostics tracking introduced in version 1.4.0 as well.

Read on below for:

1. [Avoid duplicate event IDs when reusing event objects](#duplicates)
2. [Report errors in background threads](#diagnostic)
3. [Updates and bug fixes](#updates)
4. [Documentation](#documentation)
5. [Getting help](#help)

<!--more-->

<h2 id="duplicates">1. Avoid duplicate event IDs when reusing event objects</h2>

In previous versions, the event objects created by the user already contained the `event_id` and `dvce_created_tstamp`. If an event object is then tracked multiple times, i.e. 

{% highlight java %}
let e = SPScreenView.build {
                $0.setName("screen1")
                $0.setTransitionType("trans1")
}
tracker.track(e)
tracker.track(e)
{% endhighlight %}

this will lead to multiple events with the same event ID and device created timestamp being sent to the collector [GitHub issue #390](https://github.com/snowplow/snowplow-android-tracker/issues/390). Version 1.5.0 moves the assignment of event ID and device created timestamp into the event processing, so that the event object no longer contains them. This means you can now track the same event object multiple times, and each event will have a unique event ID. 


<h2 id="diagnostic">2. Report errors in background threads</h2>

In version 1.4.0, `trackerDiagnostic` events where introduced. While the tracker always manages errors internally (avoiding crashes of the app and assuring that no events are lost), this new method enables the tracker to report errors to a Snowplow collector as `diagnostic_error` events. From 1.5.0, we now also report errors that happen in background threads [GitHub issue #394](https://github.com/snowplow/snowplow-android-tracker/issues/394). Therefore, the tracker can now report errors that occur during tracking and sending of events to the collector.

As long as error tracking is enabled, the errors occuring in background threads will be sent: 

{% highlight java %}
TrackerBuilder trackerBuilder =
    new TrackerBuilder(emitter, namespace, appId, appContext)
        .trackerDiagnostic(true)
        ...
        .build();
Tracker.init(trackerBuilder);
{% endhighlight %}

However, we do not track `diagnostic_error`s if the error happens during the tracking of a `diagnostic_error` to avoid getting stuck in a loop.


<h2 id="updates">3. Updates and bug fixes</h2>

- Deprecate onlyTrackLabelledScreens option [#401](https://github.com/snowplow/snowplow-android-tracker/issues/401)

- Fix importing of Kotlin on Gradle [#396](https://github.com/snowplow/snowplow-android-tracker/issues/396)

- Fix duplication of contexts when the event is used multiple times [#397](https://github.com/snowplow/snowplow-android-tracker/issues/397)

- CI script improvements [#387](https://github.com/snowplow/snowplow-android-tracker/issues/387)

- Add snyk monitoring to repository [#388](https://github.com/snowplow/snowplow-android-tracker/issues/388)

- Events processing refactoring [#381](https://github.com/snowplow/snowplow-android-tracker/issues/381)

- Bump Gradle to 6.1.1 [#386](https://github.com/snowplow/snowplow-android-tracker/issues/386)

- Add code coverage setting on build script [#385](https://github.com/snowplow/snowplow-android-tracker/issues/385)

- Update all copyright notices to 2020 [#383](https://github.com/snowplow/snowplow-android-tracker/issues/383)

- Switch README badge to use Github Actions for build information [#380](https://github.com/snowplow/snowplow-android-tracker/issues/380)


<h2 id="documentation">4. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/android-tracker/).

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.5.0 release](https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.5.0).


<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). Please raise any bugs in the [Android Tracker’s issues](https://github.com/snowplow/snowplow-android-tracker/issues) on GitHub.
