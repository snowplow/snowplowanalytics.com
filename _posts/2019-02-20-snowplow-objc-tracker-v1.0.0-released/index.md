---
layout: post
title: "Snowplow Objective-C Tracker 1.0.0 released"
title-short: Snowplow Objective-C Tracker 1.0.0
tags: [snowplow, mobile, obj-c, ios]
author: Mike
category: Releases
permalink: /blog/2019/02/27/snowplow-ios-tracker-1.0.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Objective-C Tracker][objc-repo]. [Version 1.0.0][tracker-100] brings dependency updates, bug fixes and support for integrating the tracker into your project with Carthage. You'll also notice our [new documentation site][docs]!

Read on below the fold for:

1. [New documentation site](#new-docs)
2. [Carthage support](#carthage-support)
3. [Other changes](#updates)
4. [Upgrading](#upgrading)
5. [Documentation and help](#help)

<!--more-->

<h2 id="new-docs">1. New documentation site</h2>

We've added our mobile trackers to our [new documentation site][docs]. The documentation is divided into easy parts that lay out:

* how to install the tracker
* quickly start tracking events
* an outline of how the tracker works
* details about both basic and advanced methods available on the tracker

<h2 id="carthage-support">2. Carthage support</h2>

If you are already using Carthage, just add this line to your `Cartfile`:

```
# Snowplow tracker
github "snowplow/snowplow-objc-tracker"
```

For more information on Carthage, see their website [here](https://github.com/Carthage/Carthage#quick-start).

<h2 id="updates">3. Other changes</h2>

Other updates and fixes include:

* Exposes session property in SPTracker ([#256][256])
* Fix parameter documentation ([#389][389])
* Make initializers unavailable in SPEmitter and SPTracker ([#255][255])
* Add OpenIdfa files to framework target ([#382][382])
* Resolve potential memory leaks from implicit retain of self ([#353][353])
* Embed Swift standard library for tests ([#388][388])
* Disable always embed Swift standard libraries ([#381][381])
* Remove exceptions ([#383][383])
* Explicitly close all statements in FMDB ([#384][384])
* Fix getDocuments function in consent events ([#386][386])
* Add support for Carthage ([#291][291])
* Replace Reachability with Reachability.swift ([#385][385])

Many thanks to [Kevin Malek][kevmalek], [Miguel Angel Quinones Garcia][DarthMike], [Sébastien Duperron][sduperron-viadeo], and [Stewart Gleadow][sgleadow] for their contributions!

<h2 id="upgrading">4. Upgrading</h2>

To add the Snowplow Objective-C Tracker as a dependency to your own app, add the following into your `Podfile`:

{% highlight ruby %}
pod 'SnowplowTracker', '~> 1.0'
{% endhighlight %}

If you are using Carthage, just add this line to your `Cartfile`:

{% highlight bash %}
# Snowplow tracker
github "snowplow/snowplow-objc-tracker"
{% endhighlight %}

<h2 id="help">5. Getting help</h2>

As always, please check out the following links:

* The [technical documentation][docs]
* The [1.0.0 release notes][tracker-100]

If you have an idea for a new feature or want help getting things set up, please visit [our Discourse forum][discourse]. And [raise an issue][issues] if you spot any bugs!

[objc-repo]: https://github.com/snowplow/snowplow-objc-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/objective-c-tracker/1.0.0/
[tracker-100]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.0.0
[issues]: https://github.com/snowplow/snowplow/issues
[discourse]: http://discourse.snowplowanalytics.com/

[256]: https://github.com/snowplow/snowplow-objc-tracker/issues/256
[389]: https://github.com/snowplow/snowplow-objc-tracker/issues/389
[255]: https://github.com/snowplow/snowplow-objc-tracker/issues/255
[382]: https://github.com/snowplow/snowplow-objc-tracker/issues/382
[353]: https://github.com/snowplow/snowplow-objc-tracker/issues/353
[388]: https://github.com/snowplow/snowplow-objc-tracker/issues/388
[381]: https://github.com/snowplow/snowplow-objc-tracker/issues/381
[383]: https://github.com/snowplow/snowplow-objc-tracker/issues/383
[384]: https://github.com/snowplow/snowplow-objc-tracker/issues/384
[386]: https://github.com/snowplow/snowplow-objc-tracker/issues/386
[291]: https://github.com/snowplow/snowplow-objc-tracker/issues/291
[385]: https://github.com/snowplow/snowplow-objc-tracker/issues/385

[kevmalek]: https://github.com/kevmalek
[DarthMike]: https://github.com/DarthMike
[sduperron-viadeo]: https://github.com/sduperron-viadeo
[sgleadow]: https://github.com/sgleadow
