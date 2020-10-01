---
layout: post
title: "Snowplow iOS Tracker 1.6.0 released"
title-short: Snowplow iOS Tracker 1.6.0
tags: [snowplow, objc, ios, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/10/01/snowplow-ios-tracker-1.6.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow iOS Tracker](https://github.com/snowplow/snowplow-objc-tracker). [Version 1.6.0](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.6.0) refactors the session management to make it more resilient, and also fixes an issue with Swift Package Manager to meet the stricter requirements of Xcode 12. Thanks to `KelvinJin` for raising the issue and `lunij` for contributing the fix!

Snowplow iOS Tracker Version 1.6.0 is available on [Cocoapods](https://cocoapods.org/pods/SnowplowTracker).

Read on below for:

1. [Updating session management](#session-management)
2. [Updates and bug fixes](#updates)
3. [Documentation](#documentation)
4. [Getting help](#help)

<!--more-->

<h2 id="session-management">1. Updating session management</h2>

Sessions expire when no events have been tracked for the amount of time defined in the timeout. When a session expires, the session ID is updated and the session index is incremented. There are two possibilities for timeouts since a session can timeout in the foreground (while the app is visible) or in the background (when the app has been suspended, but not closed). Furthermore, when the app crashes or is killed by the user the session also always resets.

Before v1.6.0 the session was configured using three parameters:

* `foregroundTimeout`: number of seconds of inactivity needed to reset the session (while the app is visible)
* `backgroundTimeout`: number of seconds of inactivity needed to reset the session (when the app has been suspended)
* `checkInterval`: number of seconds between a session checking

However, there was an issue where a short session timeout could cause more sessions to expire more than once. Version 1.6.0 updates the session management as follows:

* We have removed the `checkInterval` parameter as the session checking is no longer based on a timer.
* The session expiration is checked only when an event reaches the tracker. Doing that ensures new sessions are always caused by events being tracked, and they can't be renewed without being associated to a specific event. Also, the events are always associated to the correct session as the session is checked event by event.

More information can be found in [GitHub issue #497](https://github.com/snowplow/snowplow-objc-tracker/issues/497).


<h2 id="updates">2. Updates and bug fixes</h2>

* Enable Xcode 12 support for Swift Package Manager ([GitHub issue #544](https://github.com/snowplow/snowplow-objc-tracker/issues/544)) -> Thanks to `KelvinJin` for raising the issue and `lunij` for contributing the fix!
* Session `storageMechanism` is marked `SQLITE` but it's not ([GitHub issue #482](https://github.com/snowplow/snowplow-objc-tracker/issues/482))
* Update GitHub Actions to test on iOS 14 ([GitHub issue #545](https://github.com/snowplow/snowplow-objc-tracker/issues/545))


<h2 id="documentation">3. Documentation</h2>

As always, information about how to use the tracker can be found in the [iOS Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/objective-c-tracker/ios-tracker-1-6-0/).

You can find the full release notes on GitHub as [Snowplow iOS Tracker v1.6.0 release](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.6.0).


<h2 id="help">4. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). Please raise any bugs in the [iOS Tracker’s issues](https://github.com/snowplow/snowplow-objc-tracker/issues) on GitHub.
