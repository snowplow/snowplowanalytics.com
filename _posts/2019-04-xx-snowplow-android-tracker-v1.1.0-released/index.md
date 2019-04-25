---
layout: post
title: "Snowplow Android Tracker 1.1.0 released"
title-short: Snowplow Android Tracker 1.1.0
tags: [snowplow, android, java, mobile]
author: Mike
category: Releases
permalink: /blog/2019/04/xx/snowplow-android-tracker-1.1.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Android Tracker][repo].

[Version 1.1.0][release-notes] introduces a host of new tracking features including screen events and entities, install events and exception events.

Read on below the fold for:

1. [Screen tracking](#screens)
2. [Install tracking](#installs)
3. [Application context](#application)
4. [Updates](#updates)
5. [Documentation](#docs)
6. [Getting help](#help)

<!--more-->

<h2 id="screens">1. Screen tracking</h2>

A major new feature in this release is the ability to automatically track screenviews.

When enabled, the tracker sends screenview events populated with the relevant data whenever a new screen is viewed in the app.

Additionally, we've introduced a screen context that adds the current screen information to every event. This allows for powerful, convenient analytics that aggregates events by their associated screen.

These features can be easily enabled by setting the following options:

{% highlight java %}
Tracker.init(new Tracker.TrackerBuilder(...)
  ...
  .screenviewEvents(true)
  .screenContext(true)
  .build()
);
{% endhighlight %}


<h2 id="installs">2. Install tracking</h2>

Install tracking can be used to automatically send install events whenever the tracker detects that an app is being used for the first time.

In order to enable this feature, set the following option:

{% highlight java %}
Tracker.init(new Tracker.TrackerBuilder(...)
  ...
  .installTracking(true)
  .build()
);
{% endhighlight %}

<h2 id="application">3. Application context</h2>

This release introduces the application context. The tracker fills the application context with the mobile application build and version. When application contexts are enabled, the tracker will attach an application context to every event. Application contexts allow analytics that show how events change as mobile apps change across their releases and updates.

In order to enable this feature, set the following option:

{% highlight java %}
Tracker.init(new Tracker.TrackerBuilder(...)
  ...
  .applicationContext(true)
  .build()
);
{% endhighlight %}

<h2 id="updates">4. Other changes</h2>

Other updates and fixes include:

* Add instrumented tests to debug coverage ([#302][302])

<h2 id="docs">5. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.1.0 release][release-notes].

<h2 id="help">6. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][android-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/android-tracker/1.1.0/
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.1.0
[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues

[302]: https://github.com/snowplow/snowplow-android-tracker/issues/302

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
