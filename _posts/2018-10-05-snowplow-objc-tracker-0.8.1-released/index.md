---
layout: post
title: "Snowplow Obj-C Tracker 0.8.1 released"
title-short: Snowplow Obj-C Tracker 0.8.1
tags: [snowplow, ios, objc, contexts, lifecycle]
author: Mike
category: Releases
permalink: /blog/2018/10/05/snowplow-objc-tracker-0.8.1-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Obj-C Tracker][repo].

[Version 0.8.1][release-notes] introduces application contexts, and lifecycle event tracking.

Read on below the fold for:

1. [Application context](#appcontext)
2. [Lifecycle tracking](#lifecycle)
3. [Updates and bug fixes](#updates)
4. [Documentation](#docs)
5. [Getting help](#help)

<!--more-->

<h2 id="appcontext">1. Application contexts</h2>

We introduce application contexts in this release, in order to attach information related to the application being tracked. Information like the application version will be included.

This can be enabled in the tracker initialization, and doing so will send an application context with every event.

Include the `setApplicationContext` method as found on the bottom of this tracker builder block:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter]; // Required
    [builder setSubject:subject]; // Optional
    [builder setAppId:_appId]; // Optional
    [builder setTrackerNamespace:_namespace]; // Optional
    [builder setBase64Encoded:YES]; // Optional
    [builder setSessionContext:YES]; // Optional
    [builder setForegroundTimeout:300]; // Optional
    [builder setBackgroundTimeout:150]; // Optional
    [builder setCheckInterval:10]; // Optional
    [builder setApplicationContext:YES]; // Optional
}];
{% endhighlight %}

<h2 id="lifecycle">2. Introducing lifecycle tracking</h2>

App lifecycle tracking is a powerful auto-tracking capability.

Events are automatically sent whenever the app is backgrounded or foregrounded.

Lifecycle tracking can be enabled through tracker initialization, see `setLifecycleEvents` below:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter]; // Required
    [builder setSubject:subject]; // Optional
    [builder setAppId:_appId]; // Optional
    [builder setTrackerNamespace:_namespace]; // Optional
    [builder setBase64Encoded:YES]; // Optional
    [builder setSessionContext:YES]; // Optional
    [builder setForegroundTimeout:300]; // Optional
    [builder setBackgroundTimeout:150]; // Optional
    [builder setCheckInterval:10]; // Optional
    [builder setLifecycleEvents:YES]; // Optional
}];
{% endhighlight %}

Documentation can be found [here][lifecycle-doc].

<h2 id="updates">3. Updates and bug fixes</h2>

Other updates and fixes include:

* Update CocoaPods in Travis build ([issue #359][359])
* Commit IDEWorkspaceChecks.plist to repo ([issue #354][354])
* Fix ConsentGranted builder argument type in tests ([issue #361][361])
* Update pods committed to repo ([issue #360][360])
* Add SRCROOT to project header search path ([issue #362][362])

<h2 id="docs">4. Documentation</h2>

You can find the updated [Obj-C Tracker documentation][objc-manual] on our wiki.

You can find the full release notes on GitHub as [Snowplow Obj-C Tracker v0.8.1 release][release-notes].

<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][objc-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Obj-C Tracker's issues][objc-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/0.7.0

[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues
[262]: https://github.com/snowplow/snowplow-android-tracker/issues/262
[259]: https://github.com/snowplow/snowplow-android-tracker/issues/259
[258]: https://github.com/snowplow/snowplow-android-tracker/issues/258
[257]: https://github.com/snowplow/snowplow-android-tracker/issues/257
[256]: https://github.com/snowplow/snowplow-android-tracker/issues/256
[254]: https://github.com/snowplow/snowplow-android-tracker/issues/254
[224]: https://github.com/snowplow/snowplow-android-tracker/issues/224

[060-lifecycles]: https://snowplowanalytics.com/blog/2016/08/29/snowplow-android-tracker-0.6.0-released-with-automatic-crash-tracking/#lifecycles

[tls-version]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#5-sending-event-emitter
[cds]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-document
[tcg]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-granted
[tcw]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-withdrawn
[lifecycle-doc]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#set-lifecycle-handler

[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-manual]: https://github.com/snowplow/snowplow/wiki/Android-Tracker

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
