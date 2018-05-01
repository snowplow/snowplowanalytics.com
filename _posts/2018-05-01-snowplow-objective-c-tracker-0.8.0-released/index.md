---
layout: post
title: Snowplow Objective-C Tracker 0.8.0 released
title-short: Snowplow Objective-C Tracker 0.8.0
tags: [snowplow, analytics, ios, osx, objc, objectivec, tvos]
author: Mike
category: Releases
permalink: /blog/2018/04/06/snowplow-objective-c-tracker-0.8.0-released/
---

We are pleased to release version 0.8.0 of the [Snowplow Objective-C Tracker][objc-repo]. This release introduces data consent tracking, push notification tracking, a Swift demonstration app, and several updates and bug fixes.

In the rest of this post we will cover:

1. [Data consent tracking](#data-consent)
2. [Push notification tracking](#notification-tracking)
3. [Swift demonstration app](#swift-demo)
4. [XCode 9 bugfixes](#xcode9)
5. [Other changes](#changes)
6. [Upgrading](#upgrading)
7. [Getting help](#help)

<!--more-->

<h2><a name="data-consent">1. Data consent tracking</a></h2>

Against the backdrop of the upcoming GDPR and ePrivacy regulations, this release adds new events to track when users give their consent to, and withdraw their consent from, various forms of data collection.

We envision that many digital businesses will want to track the consent of their users against relatively finegrained "bundles" of specific data usecases, which we model in Snowplow as [consent documents][cds].

The two new consent tracking methods are:

1. [`trackConsentGrantedEvent`][tcg], for the giving of consent
2. [`trackConsentWithdrawnEvent`][tcw], for the removal of consent

Each consent event will be associated to one or more consent documents, attached to the event as contexts.

Here is an example of a user opting out of data collection per a specific consent document `1234`:

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

The tracker now has support for tracking push notifications. `trackPushNotificationEvent` can be called on the `tracker` instance from inside any of the push notification methods implemented in `AppDelegate`.

An [example][push-example] can be found in the Swift demo app, implemented using the notification API in iOS 11.2 ([UserNotifications][usernotifications]). It looks likes this:

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
  [builder setTrigger:@"PUSH"]; // Set the push notification type
  [builder setEventType:@"version"]; // Set the event type e.g. "open", when the user opens the app
  [builder setCategoryIdentifier:@"name"]; // Set the category identifier of the notification
  [builder setThreadIdentifier:@"description"]; // Set the thread identifier of the notification
  [builder setNotification:notification]; // Set the notification content
}];

[tracker trackPushNotificationEvent:event];
{% endhighlight %}

Documentation can be found [here][push-docs].

<h2><a name="swift-demo">3. Swift demonstration app</a></h2>

To provide an example of how the tracker integrates into a Swift project, we've added a Swift demonstration app to the repo.

For additional information regarding integrating the tracker into a Swift project, the documentation has been updated to address common issues like [exception handling, and importing][swift-docs].

It's also important to familiarize yourself with [how to view generated interfaces][swift-interfaces] - essential for finding the type signatures of the tracker methods when translated from Objective-C to Swift.

<h2><a name="xcode9">4. XCode 9 bugfixes</a></h2>

To improve compatibility with XCode 9 we have fixed a naming conflict in the SnowplowTests bundle ([issue #343][343]).

<h2><a name="changes">5. Other changes</a></h2>

Other updates include:

* Adding `trackSelfDescribingEvent` method as an alias for `trackUnstructEvent` ([issue #272][272])
* Replacing `NSGregorianCalendar` with NSCalendarIdentifierGregorian ([issue #329][329])
* Adding preprocessor flags to disable OpenIDFA or IDFV as required ([issue #334][334])
* Adding `identifyUser` as an alias for `setUserId` ([issue #341][341])
* Dropping iOS 8 as a test target, and adding iOS 10 and 11 ([issue #344][344])
* Add method to `SPTracker` to get the session's `userId` ([issue #345][345])
* Fix truncation of structured event value to 6 digits ([issue #299][299])

Many thanks to [Josh Sklar][jrmsklar] for contributing on [issue #345][345], and [Gordon Childs][gchilds] for contributing on [issue #299][299]!

<h2><a name="upgrading">6. Upgrading</a></h2>

To add the Snowplow Objective-C Tracker as a dependency to your own app, add the following into your Podfile:

{% highlight python %}
pod 'SnowplowTracker', '~> 0.8'
{% endhighlight %}

If you prefer, you can manually add the tracker's source code and dependencies into your project's codebase, or use the [Static Framework for iOS][lib-dl].

<h2><a name="help">7. Getting help</a></h2>

As always, please check out the following links:

* The [technical documentation][tech-docs]
* The [setup guide][setup-guide]
* The [0.8.0 release notes][tracker-080]

If you have an idea for a new feature or want help getting things set up, please visit [our Discourse forum][discourse]. And [raise an issue][issues] if you spot any bugs!

[objc-repo]: https://github.com/snowplow/snowplow-objc-tracker
[tech-docs]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker
[setup-guide]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker-Setup
[tracker-080]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/0.8.0
[usernotifcations]: https://developer.apple.com/documentation/usernotifications

[jrmsklar]: https://github.com/jrmsklar
[gchilds]: https://github.com/gchilds

[swift-interfaces]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker#swift-interface
[swift-docs]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker#importing
[push-example]: https://github.com/snowplow/snowplow-objc-tracker/tree/master/SnowplowSwiftDemo/SnowplowSwiftDemo/AppDelegate.swift
[push-docs]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker#notification
[tcg]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-granted
[tcw]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-withdrawn
[cds]: https://github.com/mhadam/snowplow.wiki-fork/blob/master/technical-documentation/1a-trackers/ios-tracker/iOS-Tracker.md#consent-documents

[272]: https://github.com/snowplow/snowplow-objc-tracker/issues/272
[299]: https://github.com/snowplow/snowplow-objc-tracker/issues/299
[341]: https://github.com/snowplow/snowplow-objc-tracker/issues/341
[338]: https://github.com/snowplow/snowplow-objc-tracker/issues/338
[331]: https://github.com/snowplow/snowplow-objc-tracker/issues/331
[329]: https://github.com/snowplow/snowplow-objc-tracker/issues/329
[334]: https://github.com/snowplow/snowplow-objc-tracker/issues/334
[343]: https://github.com/snowplow/snowplow-objc-tracker/issues/343
[344]: https://github.com/snowplow/snowplow-objc-tracker/issues/344
[345]: https://github.com/snowplow/snowplow-objc-tracker/issues/345
[lib-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_objc_tracker_0.8.0.zip

[issues]: https://github.com/snowplow/snowplow/issues
[discourse]: http://discourse.snowplowanalytics.com/
