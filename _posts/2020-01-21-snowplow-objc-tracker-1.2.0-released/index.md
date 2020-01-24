---
layout: post
title: "Snowplow Obj-C Tracker 1.2.0 released"
title-short: Snowplow Obj-C Tracker 0.9.0
tags: [snowplow, objc, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/01/21/snowplow-objc-tracker-1.2.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow Obj-C Tracker][objc-tracker].

On [Version 1.2.0][1.2.0-tag] the big news is the support for watchOS, as well as fixing a few rarely encountered bugs. It has been added with the contribution from [Leo Mehlig][leoasana] who updated the tracker with watchOS support, allowing it to track events from millions of Apple Watch devices.

Read on below for:

1. [watchOS support](#watchos)
2. [Overriding of the platform parameter](#platform)
3. [Removed Reachability.swift dependency](#reachability)
4. [Updates and bug fixes](#updates)
5. [Documentation](#documentation)
6. [Getting help](#help)

<!--more-->

<h2 id="watchos">1. watchOS support</h2>

The important news of this version is the support of the watchOS platform in our tracker ([#465][465]). A big thanks goes to [Leo Mehlig][leoasana] who has contributed updating the tracker so it works properly on the Apple Watch.
Since the day Apple Watch was released, it has firmly kept its leadership position within the smartwatch market. Its success forces developers who are building Apple Watch apps to understand how to best engage an audience that behaves so differently than on a classic smartphone app. The data tracked on the watch can provide a full picture about how the users use the watch, enabling developers and designers to do the hard job of extracting the full power from the watch apps. The watchOS was the missing platform in our tracker. We already support iOS, macOS and tvOS.

The tracker can be instanced and configured like the tracker in the iOS app. It can be done in the ExtensionDelegate of the watch app or in an InterfaceController if it's a single screen app. There are no differencies in the way you can use it.


<h2 id="platform">2. Overriding of the platform parameter</h2>

Events sent by the tracker are often associated to parameters that are common across different event types. Different from the Objc tracker, in the Android tracker the device platform parameter has always been overridable. Obj-C tracker sets the platform internally with no way to set it up upon tracker configuration. This version makes the behaviour of the device platform parameter between the two trackers more consistent ([#476][476]).

On Obj-C tracker the parameter 'p' (platform) is set to `mob` when running on a mobile phone and to `pc` when running on desktop. However, there are cases where the developer wants to specify the platform differently by the [default options][common_parameters].

On the tracker setup you can override the default device platform calling:

{% highlight objc %}
[tracker setDevicePlatform: SPDevicePlatformGameConsole];
{% endhighlight %}


It resets the parameter `p` (platform) to the new value.


<h2 id="reachability">3. Removed Reachability.swift dependency</h2>

We removed the Reachability.swift framework because it is a dependency that could cause issues during the integration of our tracker in an app with other third party libraries ([#437][437]).

If you use Carthage as dependency manager:

Remove the reference of the Reachability.framework if you linked it manually.
In case you used the suggested `copy-frameworks` script in _Build Phases_ (https://github.com/Carthage/Carthage#adding-frameworks-to-an-application), delete Reachability.framework dependency from `input.xcfilelist` and `output.xcfilelist`.

If you use Cocoapods as dependecy manager, just update the pods and the Reachability dependency will be removed.


<h2 id="updates">4. Updates and bug fixes</h2>

- If you use Cocoapods as dependency manager there is no need of declaring "_use_frameworks!_" in the Podfile.

By removing Reachability we simplified the configuration of the tracker solving various issues affecting our tracker when installed by Cocoapods. Now importing our tracker with Cocoapods is much easier and without restrictions: you are not constrained to import it with the "_use_frameworks!_" statement.

- Screen context not updated when autotracking is disabled ([#431][431]).
- Fixed valueForKey error in autotracking for screenviews ([#428][428]).

These two fixes have solved a long standing issue related to screen autotracking by improving the management of the snowplowId property in a ViewController.

- Ensured addDictionaryToPayload enumeration over immutable dictionary [#480][480]

Thanks to [Matt Robinson][mattrobmattrob] for his contribution in fixing this bug that was causing app crashes in particular circumstances.


<h2 id="documentation">5. Documentation</h2>

As always, information about how to use the tracker can be found in the [Obj-C Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Obj-C Tracker v1.2.0 release](https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.2.0).


<h2 id="help">6. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum][forums]. Please raise any bugs in the [Obj-C Tracker’s issues][issues] on GitHub.


[objc-tracker]: https://github.com/snowplow/snowplow-objc-tracker
[1.2.0-tag]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.2.0
[common-parameters]: https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#common

[issues]: https://github.com/snowplow/snowplow-objc-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://docs.snowplowanalytics.com/open-source/snowplow/trackers/objective-c-tracker/

[465]: https://github.com/snowplow/snowplow-objc-tracker/issues/465
[476]: https://github.com/snowplow/snowplow-objc-tracker/issues/476
[437]: https://github.com/snowplow/snowplow-objc-tracker/issues/437
[428]: https://github.com/snowplow/snowplow-objc-tracker/issues/428
[431]: https://github.com/snowplow/snowplow-objc-tracker/issues/431
[480]: https://github.com/snowplow/snowplow-objc-tracker/issues/480

[leoasana]: https://github.com/leoasana
[mattrobmattrob]: https://github.com/mattrobmattrob

