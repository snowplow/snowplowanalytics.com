---
layout: post
title: "Snowplow Android Tracker 1.0.0 released"
title-short: Snowplow Android Tracker 1.0.0
tags: [snowplow, android, java, mobile]
author: Mike
category: Releases
permalink: /blog/2018/02/20/snowplow-android-tracker-1.0.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Android Tracker][repo].

[Version 1.0.0][release-notes] introduces features to alleviate blocking issues on tracker instantiation and add control over sessions. The release also improves the robustness of foreground and background detection. You'll also notice the introduction of our [new documentation site][docs]!

Read on below the fold for:

1. [New documentation site](#new-docs)
2. [Async support](#async-support)
3. [Share `OkHttpClient` instance](#okhttp)
4. [Session transitions](#session-transitions)
5. [Updates](#updates)
6. [Documentation](#docs)
7. [Getting help](#help)

<!--more-->

<h2 id="new-docs">1. New documentation site</h2>

We've added our mobile trackers to our [new documentation site][docs]. The documentation is divided into easy parts that lay out:

* how to install the tracker
* quickly start tracking events
* an outline of how the tracker works
* details about both basic and advanced methods available on the tracker

<h2 id="async-support">2. Async support</h2>

There are new methods available for loading the tracker asynchronously (since session information is stored in a file, and must be loaded whenever the tracker starts):

* `waitForSessionFileLoad()`, a blocking call on the tracker to wait for the session file to load.

* `getHasLoadedFromFile()`, a non-blocking call to check whether the tracker has loaded the session file.

* `getLoadFromFileFuture()`, a `Future` that can be used to check the progress.

{% highlight java %}
// First initialize your tracker
Tracker.init(new Tracker
  .TrackerBuilder(e2, "myNamespace", "myAppId", getContext())
  .base64(false) // Optional - defines if we use base64 encoding
  .platform(DevicePlatforms.Mobile) // Optional - defines what platform the event will report to be on
  .subject(new Subject.SubjectBuilder().build()) // Optional - a subject which contains values appended to every event
  .build()
);

// Then this method will return a boolean representing if the tracker has loaded
Tracker.getHasLoadedFromFile()
{% endhighlight %}

<h2 id="okhttp">3. Share `OkHttpClient` instance</h2>

In this release, emitters can be created with a shared `OkHttpClient` instance.

This practice is intended to save resources, since it will allow sharing the `ConnectionPool` and `ThreadPool` of the client.

Here's an example of the new `Emitter` builder method `client()`:
{% highlight java %}
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .client(sharedOkHttpClient) // Use this for the shared OkHttpClient
        .build();
{% endhighlight %}

<h2 id="session-transitions">4. Session transitions</h2>

The tracker now has a builder method `sessionCallbacks()` for supplying session transition `Runnable` callbacks.

These are to be executed whenever there's a transition in the state of the app (from background to foreground or vice versa), as well as whenever there is a session timeout (in the background or foreground).

<h2 id="updates">5. Other changes</h2>

Other updates and fixes include:

* Fix Travis license issue ([#288][288])
* Update to Android Target API level 28 ([#287][287])
* Output maximum logging detail in demo app ([#279][279])
* Perform blocking operations in the background ([#159][159])
* Enforce strict mode for demo app ([#278][278])
* Bump versions in build.gradle for demo app ([#284][284])
* Bump Android Gradle to 3.2.1 ([#280][280])
* Bump versions of build tools in Travis ([#283][283])
* Add setter for session context boolean ([#282][282])
* Update to Android Target API level 26 ([#273][273])
* Add ability to momentarily suspend session checking ([#271][271])

Many thanks to [Ahmed Khalil][ahmed] for your contributions!

<h2 id="docs">6. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.0.0 release][release-notes].

<h2 id="help">7. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][android-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/android-tracker/1.0.0/
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.0.0
[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues

[288]: https://github.com/snowplow/snowplow-android-tracker/issues/288
[287]: https://github.com/snowplow/snowplow-android-tracker/issues/287
[285]: https://github.com/snowplow/snowplow-android-tracker/issues/285
[269]: https://github.com/snowplow/snowplow-android-tracker/issues/269
[279]: https://github.com/snowplow/snowplow-android-tracker/issues/279
[159]: https://github.com/snowplow/snowplow-android-tracker/issues/159
[278]: https://github.com/snowplow/snowplow-android-tracker/issues/278
[284]: https://github.com/snowplow/snowplow-android-tracker/issues/284
[280]: https://github.com/snowplow/snowplow-android-tracker/issues/280
[283]: https://github.com/snowplow/snowplow-android-tracker/issues/283
[281]: https://github.com/snowplow/snowplow-android-tracker/issues/281
[282]: https://github.com/snowplow/snowplow-android-tracker/issues/282
[272]: https://github.com/snowplow/snowplow-android-tracker/issues/272
[273]: https://github.com/snowplow/snowplow-android-tracker/issues/273
[271]: https://github.com/snowplow/snowplow-android-tracker/issues/271
[268]: https://github.com/snowplow/snowplow-android-tracker/issues/268

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[ahmed]: https://github.com/R4md4c

[discourse]: http://discourse.snowplowanalytics.com/
