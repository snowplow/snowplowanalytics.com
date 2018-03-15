---
layout: post
title: Snowplow Objective-C Tracker 0.8.0 released
title-short: Snowplow Objective-C Tracker 0.8.0
tags: [snowplow, analytics, ios, osx, objc, objectivec, tvos]
author: Mike
category: Releases
permalink: /blog/2018/xx/xx/snowplow-objective-c-tracker-0.8.0-released/
---

We are pleased to release version 0.8.0 of the [Snowplow Objective-C Tracker][objc-repo]. This release introduces data consent tracking, push notification tracking, a Swift demonstration app, and several updates and bug fixes.

In the rest of this post we will cover:

1. [Data consent tracking](#data-consent)
2. [Push notification tracking](#notification-tracking)
3. [Swift demonstration app](#swift-demo)
4. [XCode 9 bugfixes](#xcode9)
5. [Other changes](#changes)
6. [Upgrading](#upgrading)
7. [Getting help](/blog/2018/02/19/snowplow-objective-c-tracker-0.8.0-released/#help)

<!--more-->

<h2><a name="data-consent">1. Data consent tracking</a></h2>

Against the backdrop of the incoming GDPR and ePrivacy regulations, this release adds new events to track when users give their consent to, and withdraw their consent from, various forms of data collection.

We envision that many digital businesses will want to track the consent of their users against relatively finegrained "bundles" of specific data usecases, which we model in Snowplow as [consent documents][cds].

The two new consent tracking methods are:

1. [`trackConsentGranted`][tcg] for the giving of consent
2. [`trackConsentWithdrawn`][tcw] for the removal of consent

Each consent event will be associated to one or more consent documents, attached to the event as contexts.

Here is an example of a user opted out of data collection per a specific consent document `1234`:

{% highlight objective-c %}
SPConsentWithdrawnEvent *event = [SPConsentWithdrawnEvent build:^(id<SPConsentWithdrawnBuilder> builder) {
  [builder setDocumentId:@"1234"]; // Set the document ID
  [builder setVersion:@"version"]; // Set the document version
  [builder setName:@"name"]; // Set the document name
  [builder setDescription:@"description"]; // Set the document description
  [builder setAll:false]; // Do not withdraw all consent
}];

[tracker trackConsentWithdrawnEvent:event];
{% endhighlight %}


<h2><a name="notification-tracking">2. Push notification tracking</a></h2>

The tracker now has support for tracking push notifications! `trackPushNotificationEvent` can be called on the `tracker` instance from inside any of the push notification methods implemented in `AppDelegate`. An [example][push-example] can be found in the Swift demo app - implemented using the notification API in iOS 11.2 ([UserNotifications][usernotifications]).

{% highlight objective-c %}
// Populate the information found in the notification content, i.e. UNNotificationContent or userInfo in 
SPNotificationContent *content = [SPNotificationContent build:^(id<SPNotificationContent> builder) {
  [builder setTitle:@"Example title"];
  [builder setSubtitle:@"Example subtitle"];
  [builder setBody:@"Example body"];
  ...
}];

SPPushNotification *event = [SPPushNotification build:^(id<SPPushNotificationBuilder> builder) {
  [builder setAction:@"1234"]; // Set the action selected by user
  [builder setEventType:@"version"]; // Set the event type e.g. "open", when the user opens the app
  [builder setCategoryIdentifier:@"name"]; // Set the category identifier of the notification
  [builder setThreadIdentifier:@"description"]; // Set the thread identifier of the notification
  [builder setNotification:notification]; // Set the notification content
}];

[tracker trackPushNotificationEvent:event];
{% endhighlight %}

<h2><a name="swift-demo">3. Swift demonstration app</a></h2>

To provide an example of how the tracker integrates into a Swift project, we've added a Swift demonstration app.

Helpful points are addressed: [exception catching, and importing][swift-docs].

Also take note of [how to view generated interfaces][swift-interfaces] which are essential for finding the type signatures of the methods translated from Objective-C to Swift.

<h2><a name="xcode9">4. XCode 9 bugfixes</a></h2>

To improve compatibility with XCode 9 we have updated the Tracker as follows:

* Fix a naming conflict in the SnowplowTests bundle ([#343][343])

This fixes a compile-time error also found in the [Obj-C Client for Iglu][iglu-client], a dependency of the Tracker.

<h2><a name="changes">5. Other changes</a></h2>

Other updates include:

* Add trackSelfDescribingEvent method as alias for trackUnstructEvent ([#272][272])
* Replace NSGregorianCalendar with NSCalendarIdentifierGregorian ([#329][329])
* Extend copyright notice in all files to 2018 ([#331][331])
* Add preprocessor flags to disable OpenIDFA or IDFV ([#334][334])
* Remove "close" from CHANGELOG for issue #333 ([#338][338])
* Add identifyUser as alias for setUserId ([#341][341])
* Drop iOS 8 test target, add iOS 10 and 11 ([#344][344])

Many thanks to [Josh Sklar][jrmsklar] for contributing on issue [#341][341]!

<h2><a name="upgrading">6. Upgrading</a></h2>

To add the Snowplow Objective-C Tracker as a dependency to your own app, add the following into your Podfile:

{% highlight python %}
pod 'SnowplowTracker', '~> 0.8'
{% endhighlight %}

If you prefer, you can manually add the tracker's source code and dependencies into your project's codebase, or use the [Static Framework for iOS][lib-dl].

<h2><a name="help">7. Getting help</a></h2>

Useful links:

* The [technical documentation][tech-docs]
* The [setup guide][setup-guide]
* The [0.8.0 release notes][tracker-080]

If you have an idea for a new feature or want help getting things set up, please [get in touch][talk-to-us]. And [raise an issue][issues] if you spot any bugs!

[objc-repo]: https://github.com/snowplow/snowplow-objc-tracker
[tech-docs]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker
[setup-guide]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup
[tracker-080]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/0.8.0
[usernotifcations]: https://developer.apple.com/documentation/usernotifications

[jrmsklar]: https://github.com/jrmsklar

[push-example]: https://github.com/snowplow/snowplow-objc-tracker/tree/master/SnowplowSwiftDemo/SnowplowSwiftDemo/AppDelegate.swift
[tcg]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-granted
[tcw]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-withdrawn
[cds]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-documents

[272]: https://github.com/snowplow/snowplow-objc-tracker/issues/272
[341]: https://github.com/snowplow/snowplow-objc-tracker/issues/341
[338]: https://github.com/snowplow/snowplow-objc-tracker/issues/338
[331]: https://github.com/snowplow/snowplow-objc-tracker/issues/331
[329]: https://github.com/snowplow/snowplow-objc-tracker/issues/329
[334]: https://github.com/snowplow/snowplow-objc-tracker/issues/334
[lib-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_objc_tracker_0.8.0.zip
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[issues]: https://github.com/snowplow/snowplow/issues
