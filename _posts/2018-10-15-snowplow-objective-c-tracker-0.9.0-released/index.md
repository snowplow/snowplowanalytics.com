---
layout: post
title: "Snowplow Objective-C Tracker 0.9.0 released"
title-short: Snowplow Objective-C Tracker 0.9.0
tags: [snowplow, ios, objc, contexts, objectivec, lifecycle]
author: Mike
category: Releases
permalink: /blog/2018/10/15/snowplow-objective-c-tracker-0.9.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Objective-C Tracker][repo].

[Version 0.9.0][release-notes] introduces an application context, and lifecycle event tracking.

Read on below the fold for:

1. [Application context](#appcontext)
2. [Lifecycle tracking](#lifecycle)
3. [Updates and bug fixes](#updates)
4. [Documentation](#docs)
5. [Getting help](#help)

<!--more-->

<h2 id="appcontext">1. Application context</h2>

In this release we introduce an application context. This feature allows one to determine which version of an app sent a particular event.

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

Documentation can be found [here][app-context-doc].

<h2 id="lifecycle">2. Introducing lifecycle tracking</h2>

App lifecycle tracking is a powerful auto-tracking capability. Events are automatically sent whenever the app is backgrounded or foregrounded.

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

* Updating CocoaPods in the Travis build ([issue #359][359])
* Commiting the `IDEWorkspaceChecks.plist` file to the repository ([issue #354][354])
* Fixing the `ConsentGranted` builder argument type in tests ([issue #361][361])
* Updating the pods committed to repo ([issue #360][360])
* Adding `SRCROOT` to the project header search path ([issue #362][362])

<h2 id="docs">4. Documentation</h2>

You can find the latest [Obj-C Tracker documentation][objc-manual] on our wiki.

For more details on this release, please check out the [Snowplow Obj-C Tracker v0.9.0 release notes][release-notes] on GitHub.

<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][objc-setup] guide.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Obj-C Tracker's issues][objc-issues] on GitHub.

[repo]: https://github.com/snowplow/snowplow-objc-tracker
[release-notes]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/0.9.0

[objc-issues]: https://github.com/snowplow/snowplow-objc-tracker/issues
[359]: https://github.com/snowplow/snowplow-objc-tracker/issues/359
[354]: https://github.com/snowplow/snowplow-objc-tracker/issues/354
[361]: https://github.com/snowplow/snowplow-objc-tracker/issues/361
[360]: https://github.com/snowplow/snowplow-objc-tracker/issues/360
[362]: https://github.com/snowplow/snowplow-objc-tracker/issues/362

[objc-manual]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker
[objc-setup]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup
[app-context-doc]: xxx
[lifecycle-doc]: xxx

[discourse]: http://discourse.snowplowanalytics.com/
