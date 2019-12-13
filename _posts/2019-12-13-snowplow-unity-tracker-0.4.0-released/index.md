---
layout: post
title: "Snowplow Unity Tracker 0.4.0 released"
title-short: Snowplow Unity Tracker 0.4.0
tags: [snowplow, unity, netstandard, tracker, gaming, games, dotnet]
author: Paul
category: Releases
permalink: /blog/2019/12/16/snowplow-unity-tracker-0.4.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow Unity Tracker][unity-tracker]. [Version 0.4.0][0.4.0-tag] brings a big update to the Unity Tracker by moving to .NET Standard 2.0 for Unity 2018.1+.
It also moves to using a new Event Storage system, powered by LiteDB, for better cross platform support (including Android arm64 devices) and lastly it also brings a new Demo game built in Unity 2018.4.

Read on below the fold for:

1. [Updates to .NET Standard 2.0](#update-netstandard)
2. [Improvements to Event Storage](#event-storage-improvements)
3. [New Demo Unity Game](#new-demo-app)
4. [Updates and bug fixes](#updates)
5. [Upgrading](#upgrade)
6. [Documentation and help](#doc)

<!--more-->

<h2 id="update-netstandard">1. Updates to .NET Standard 2.0</h2>
The release of Unity 2018.1 and beyond brought support for the new Stable Scripting Runtime which upgrades .NET support to .NET 4.x and .NET Standard 2.0 profiles. This new feature allows us to move to new frameworks, modern .NET libraries and a variety of improvements to our Tracker codebase by upgrading to a .NET Standard 2.0 library.

During this upgrade we have also placed considerable effort in ensuring our Tracker is capable of working on popular Unity platforms, both Mono and IL2CPP, including: Windows, macOS, Linux, iOS and Android. The Unity Tracker may also be compatible with other Unity platforms but they have not been tested as part of this release.

Our Test Framework has also been updated to run as a .NET Standard 2.0 Unity 2018.4 Project, allowing for integration testing of our Snowplow Tracker within the Unity environment. You can find our how to run the updated Test Suite on the Unity Tracker [README][readme-testing].

<h2 id="event-storage-improvements">2. Improvements to Event Storage</h2>
By moving to .NET Standard 2.0, this has allowed us to leverage a new storage technology that is 100% managed C# code, with no native library dependencies, called LiteDB. By doing so, we have been able to fix compatibility issues running the Unity Tracker on some Android devices (in particular on arm64 devices).

This change requires new dlls to be deployed along with version 0.4.0 of the Unity Tracker however they will automatically be included when importing the SnowplowTracker.unitypackage from our GitHub release. We advise dlls imported from previous Unity Tracker releases are deleted before importing version 0.4.0.

Additionally, we have also exposed a new IStore interface when initialising the Emitter object. This will allow users of the Unity Tracker to either alter the construction of the EventStore object, as shown below, or by creating an implementation of the IStore interface that fits the needs of the application.

{% highlight csharp %}
var emitter = new AsyncEmitter(collectorUrl, HttpProtocol.HTTPS, HttpMethod.POST, 1, 52000L, 52000L, new EventStore("filename.db", true));
{% endhighlight %}

<h2 id="new-demo-app">3. New Demo Unity Game</h2>
We've also created a new Demo Game that has been built with Unity 2018.4. This has allowed the new .NET Standard version of the Snowplow Unity Tracker to be included within the Demo Game as well as some aspects of the Demo game, such as the User Interface, to use the latest Unity features.

![demo](/assets/img/blog/2019/12/unitydemo.png)

You can open `SnowplowTracker.Demo` in Unity 2018.4 by cloning the Unity Tracker repository and then play and track events to your hearts content!

Start the game by opening the `MainMenuScene.scene` in the Unity Editor and press Play. You can enter your collector URL on the menu screen if you wish to track events into your collector. Alternatively, you can also build and run the game on Windows, macOS, Linux, iOS or Android with keyboard and touch controls.

The Demo Application also includes example code on how to set up the Unity Tracker, included within the `TrackerManager.cs` and `GameplayManager.cs` scripts.

<h2 id="updates">4. Updates and bug fixes</h2>

### New features

* Migrate SnowplowTracker to .NET Standard 2.0 ([#22](https://github.com/snowplow/snowplow-unity-tracker/issues/22))
* Switch to new Database library for better cross platform support ([#23](https://github.com/snowplow/snowplow-unity-tracker/issues/23))
* Migrate test suite to .NET Standard 2.0 ([#29](https://github.com/snowplow/snowplow-unity-tracker/issues/29))
* Expose EventStore Interface for easy extension ([#32](https://github.com/snowplow/snowplow-unity-tracker/issues/32))
* Port Snowplow Demo Game to Android/iOS ([#3](https://github.com/snowplow/snowplow-unity-tracker/issues/3))
* Automate build using Travis ([#24](https://github.com/snowplow/snowplow-unity-tracker/issues/24))

### Bug fixes

* Include link.xml and required DLLs in Resources folder for all platforms ([#30](https://github.com/snowplow/snowplow-unity-tracker/issues/30))
* Fix Mobile Paths to support Android ([#18](https://github.com/snowplow/snowplow-unity-tracker/issues/18))
* Fix Peru version so vagrant up succeeds ([#20](https://github.com/snowplow/snowplow-unity-tracker/issues/20))
* Update Copyright notices to 2019 ([#31](https://github.com/snowplow/snowplow-unity-tracker/issues/31))

<h2 id="upgrade">5. Upgrading</h2>

The tracker is available as a published asset in the [0.4.0 Github release][0.4.0-tag]:

To upgrade, please delete the existing SnowplowTracker dll files and then download and reimport SnowplowTracker.unitypackage into your Unity project.

Version 0.4.0 requires at least Unity 2018.1 as it is now built as a .NET Standard 2.0 library.

<h2 id="doc">6. Documentation and help</h2>

Check out the Unity Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v0.4.0 release page][0.4.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please [raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[unity-tracker]: https://github.com/snowplow/snowplow-untiy-tracker
[0.4.0-tag]: https://github.com/snowplow/snowplow-unity-tracker/releases/tag/0.4.0
[readme-testing]: https://github.com/snowplow/snowplow-unity-tracker#testing-framework
[setup]: https://github.com/snowplow/snowplow/wiki/Unity-Tracker-Setup
[issues]: https://github.com/snowplow/snowplow-unity-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/Unity-Tracker

[755]: https://github.com/snowplow/snowplow-unity-tracker/issues/755
