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

On [Version 1.2.0][1.2.0-tag] we fixed few rare but annoying bugs but the big news is the support of WatchOS. Added with the contribution from [Leo Mehlig][leoasana] who updated the tracker for the watchOS. It's a great add to our tracker making it more complete and multipurpose.

Read on below for:

1. [watchOS support](#watchos)
2. [Overriding of the platform parameter](#platform)
3. [Removed Reachability.swift dependency](#reachability)
4. [Updates and bug fixes](#updates)
5. [Documentation](#documentation)
6. [Getting help](#help)

<!--more-->

<h2 id="watchos">1. watchOS support</h2>

The important news of this version is the support of watchOS ([#465][465]) as the new platform supported on our tracker. A big thanks goes to [Leo Mehlig][leoasana] who has contributed updating the tracker to work properly on Apple Watch.
Since the day Apple Watch has been released, it has gained importance firmly keeping the leadership of the smartwatch market. Its success forces the developers who are building Apple Watch apps to understand how to best engage the audience with apps so different from a classic smartphone app. The data tracked on the watch can provide a full picture about how the users use the watch, enabling developers and designers into the hard job of extracting the full power from the watch apps.
The watchOS was the missing platform in our tracker. We already support iOS, macOS and tvOS.

The tracker can be instanced and configured like the tracker in the iOS app. It can be done in the ExtensionDelegate of the watch app or in an InterfaceController if it's a single screen app. There are no differencies in the way you can use it.

Note: The current solution is in alpha version.


<h2 id="platform">2. Overriding of the platform parameter</h2>

Events sent by the tracker are often associates to parameters that are common across different event types.
Differently by the Objc tracker, in the Android tracker the device platform parameter has always been overridable. Obj-C tracker set the platform internally with no way to setup it on tracker configuration.
This version makes coherent the behaviour of the device platform parameter between the two trackers ([#476][476]).

On Obj-C tracker the parameter 'p' (platform) is set to `mob` when running on a mobile phone and to `pc` when running on desktop. However, there are cases where the developer wants to specify the platform differently by the [default options][common_parameters].

On the tracker setup you can override the default device platform calling:

{% highlight objc %}
[tracker setDevicePlatform: SPDevicePlatformGameConsole];
{% endhighlight %}


It resets the parameter `p` (platform) to the new value.


<h2 id="reachability">3. Removed Reachability.swift dependency</h2>

We removed Reachability.swift framework because it's a dependency that could be cause of issues during the integration of our tracker in an app with other third party libraries ([#437][437]).

If you use Carthage as dependency manager:

Remove the reference of the Reachability.framework if you linked it manually.
In case you used the suggested `copy-frameworks` script in _Build Phases_ (https://github.com/Carthage/Carthage#adding-frameworks-to-an-application), delete Reachability.framework dependency from `input.xcfilelist` and `output.xcfilelist`.

If you use Cocoapods as dependecy manager, just update the pods and the Reachability dependency will be removed.


<h2 id="updates">4. Updates and bug fixes</h2>

- If you use Cocoapods as dependency manager there is no need of declaring "_use_frameworks!_" in the Podfile.

Removing the Reachability we simplified the configuration of the tracker solving various issues affecting our tracker when installed by Cocoapods. Now importing our tracker with Cocoapods is much easier and without restrictions: you are not constrained to import it with the "_use_frameworks!_" statement.

- Screen context not updated when autotracking is disabled ([#431][431]).
- Fixed valueForKey error in autotracking for screenviews ([#428][428]).

Fix a longtime issues related to screen autotracking where we improved the management of the _snowplowId_ property in a ViewController.

- Ensured addDictionaryToPayload enumeration over immutable dictionary [#480][480]

Thanks to [Matt Robinson][mattrobmattrob] for his contribute into fixing this bug that was cause of crashes of the app on particular circumstances.


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

