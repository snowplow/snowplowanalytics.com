---
layout: post
title: "Snowplow Obj-C Tracker 1.1.0 released"
title-short: Snowplow Obj-C Tracker 1.1.0
tags: [snowplow, objc, ios, mobile]
author: Mike
category: Releases
permalink: /blog/2019/04/xx/snowplow-android-tracker-1.0.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Obj-C Tracker][repo].

[Version 1.1.0][release-notes] introduces a host of new tracking features including screen events and entities, install events and exception events.

Read on below the fold for:

1. [Screen tracking](#screens)
2. [Exception tracking](#exceptions)
3. [Install tracking](#installs)
5. [Updates](#updates)
6. [Documentation](#docs)
7. [Getting help](#help)

<!--more-->

<h2 id="screens">1. Screen tracking</h2>

A major new feature in this release is the ability to automatically track screenviews.

When enabled, the tracker sends screenview events populated with the relevant data whenever a new screen is viewed in the app.

Additionally, we've introduced a screen context that adds the current screen information to every event. This allows for powerful, convenient analytics that aggregates events by their associated screen.

These features can be easily enabled by setting the following options:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setScreenViewEvents:YES];
    [builder setScreenContext:YES];
}];
{% endhighlight %}


<h2 id="exceptions">2. Exception tracking</h2>

Exception tracking can be used to automatically capture unhandled exceptions and send an `application_error` event.

In order to enable this feature, set the following option:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setExceptionEvents:YES];
}];
{% endhighlight %}


<h2 id="installs">3. </h2>

Install tracking can be used to automatically send install events whenever the tracker detects that an app is being used for the first time.

In order to enable this feature, set the following option:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    ...
    [builder setInstallEvents:YES];
}];
{% endhighlight %}


<h2 id="updates">5. Other changes</h2>

Other updates and fixes include:

* Allow configurable postPath parameter ([#409][409])
* Fix various build warnings ([#414][414])
* Fix warning about self references being retained in SPSession ([#412][412])
* Add tests for application context ([#410][410])

<h2 id="docs">6. Documentation</h2>

As always, information about how to use the tracker can be found in the [Obj-C Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Obj-C Tracker v1.1.0 release][release-notes].

<h2 id="help">7. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][ios-setup] guide.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Obj-C Tracker's issues][ios-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/ios-tracker/1.1.0/
[release-notes]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.1.0
[ios-setup]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/objective-c-tracker/1.1.0/objective-c-tracker/#installation
[ios-issues]: https://github.com/snowplow/snowplow-objc-tracker/issues

[409]: https://github.com/snowplow/snowplow-objc-tracker/issues/409
[414]: https://github.com/snowplow/snowplow-objc-tracker/issues/414
[412]: https://github.com/snowplow/snowplow-objc-tracker/issues/412
[410]: https://github.com/snowplow/snowplow-objc-tracker/issues/410

[discourse]: http://discourse.snowplowanalytics.com/
