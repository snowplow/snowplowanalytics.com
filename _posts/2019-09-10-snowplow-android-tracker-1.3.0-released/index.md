---
layout: post
title: "Snowplow Android Tracker 1.3.0 released"
title-short: Snowplow Android Tracker 1.3.0
tags: [snowplow, android, java, mobile]
author: Oguzhan
category: Releases
permalink: /blog/2019/09/10/snowplow-android-tracker-1.3.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Android Tracker][repo].

[Version 1.3.0][release-notes] introduces a Snowplow Micro powered test suite and compliance with targeted ads preference of Android users.

With this release, we're building assurance that engineers can set up their tracking more reliably and your data team can have uninterrupted access to valuable insights about your application.

Read on below the fold for:

1. [Integration of Snowplow Micro](#micro-integration)
2. [Compliance with targeted ads preference](#ad-tracking)
3. [Updates](#updates)
4. [Documentation](#docs)
5. [Getting help](#help)

<!--more-->

<h2 id="micro-integration">1. Integration of Snowplow Micro</h2>

Our recent tracker releases have shown that we need to increase confidence in new releases. The latest example was Android Tracker 1.2.0 where a small implementation mistake caused the duplication of natively supported contexts. A mistake that could be prevented if we had a more comprehensive test suite, which we can do with the newly arrived Snowplow Micro project.

In essence, Snowplow Micro is our smallest Snowplow pipeline, built specifically to be used in the automated test suite of any tracking setup to increase confidence in implementation. While users may use Micro to test their tracking strategies, at Snowplow we use Micro to test that we are releasing reliable trackers. We started writing integration tests on our demo app, to be extended for each new feature we'll introduce in our tracker. Please read [the blog post][micro-blog-post] to learn more about Snowplow Micro. 

<h2 id="targeted-ads-preference">2. Compliance with targeted ads preference</h2>

In late 2013, Google [introduced][google-play-services-4] a new approach for advertising, including a new Advertising ID, to give users greater control such as resetting their device's Ads ID or opt out of interest-based (a.k.a. targeted) ads.

As of this release, our tracker will respect Android users' preference and not fetch Ads ID if they opt out of targeted ads.

Thanks to [lisional][lisional] for this very important contribution!

<h2 id="updates">3. Updates</h2>

Other updates and fixes include:

* Fix database cursor usage ([#330][330]), thanks to [Max2817][Max2817] !
* Trim travis setup ([#324][324])
* Remove vagrant setup ([#317][317])

<h2 id="docs">4. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.3.0 release][release-notes].

<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][android-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/android-tracker/1.3.0/
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.3.0
[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues

[google-play-services-4]: https://android-developers.googleblog.com/2013/10/google-play-services-40.html
[micro-blog-post]: https://snowplowanalytics.com/blog/2019/07/17/introducing-snowplow-micro/
[lisional]: https://github.com/lisional
[Max2817]: https://github.com/Max2817

[330]: https://github.com/snowplow/snowplow-android-tracker/issues/330
[324]: https://github.com/snowplow/snowplow-android-tracker/issues/324
[317]: https://github.com/snowplow/snowplow-android-tracker/issues/317

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
