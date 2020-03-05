---
layout: post
title: "Snowplow Android Tracker 1.4.0 released"
title-short: Snowplow Android Tracker 1.4.0
tags: [snowplow, android, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/03/05/snowplow-android-tracker-1.4.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow Android Tracker][android-tracker].
[Version 1.4.0][1.4.0-tag] introduces support for GDPR contexts and tracker diagnostics, useful for troubleshooting cases of unexpected tracker behaviour.

Also included in this release, a fix to stop the IAB enrichment from considering Android tracker events as spider-generated events.

Read on below for:

1. [Tracking GDPR basis for processing with the GDPR context](#gdpr)
2. [Diagnostic feature for internal error tracking](#diagnostic)
3. [Fix for IAB enrichment filtering](#iab)
4. [Make POST path of Emitter configurable](#custompath)
5. [Updates and bug fixes](#updates)
6. [Documentation](#documentation)
7. [Getting help](#help)

<!--more-->

<h2 id="gdpr">1. Tracking GDPR basis for processing with the GDPR context</h2>

This release introduces the `gdprContext` and the `enableGdprContext` methods, which append a GDPR context to all events once enabled ([#312][312]).
This allows users to easily record the basis for data collection and relevant documentation, and enables a straightforward audit flow for all events.

It takes the following arguments:

|      **Name** | **Description**             | **Required?** | **Type** |
|--------------:|:----------------------------|:--------------|:---------|
|`basisForProcessing` | GDPR Basis for processing | Yes           | Enum String   |
|     `documentId` | ID of a GDPR basis document     | No           | String   |
|        `documentVersion` | Version of the document        | No            | String   |
| `documentDescription` | Description of the document | No            | String   |

The required basisForProcessing accepts only the following literals: `consent`, `contract`, `legal_obligation`, `vital_interests`, `public_task`, `legitimate_interests` - in accordance with the [five legal bases for processing](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/)

The GDPR context is enabled by calling the `gdprContext` method of the tracker builder or by calling the `enableGdprContext` method once the tracker has been initialised.

It is called as follows:

{% highlight java %}
Tracker.instance().enableGdprContext(
    Gdpr.Basis.CONSENT,
    "someId",
    "0.1.0",
    "a demo document description"
);
{% endhighlight %}


<h2 id="diagnostic">2. Diagnostic feature for internal error tracking</h2>

The tracker is constantly tested with different platforms and versions but there are rare situations where an error can be reported. The tracker manages errors internally, avoiding crashes of the app and assuring that the events are not lost. However, it can now report errors to a Snowplow collector as `diagnostic_error` events.

To activate this feature you only need to enable `trackerDiagnostic` ([#343][343]):

{% highlight java %}
TrackerBuilder trackerBuilder =
    new TrackerBuilder(emitter, namespace, appId, appContext)
        .trackerDiagnostic(true)
        ...
        .build();
Tracker.init(trackerBuilder);
{% endhighlight %}

It will automatically report any internal tracker error to the configured Snowplow collector. These will be fundamental for the troubleshooting unexpected behaviour of the tracker.
For Snowplow Insights customers, the sequence of tracker diagnostic events can be sent to the Snowplow support team for analysis in order to spot tracker issues or the source of unexpected behaviour.

“unstruct_event_com_snowplowanalytics_snowplow_diagnostic_error_1”: {
      “className”: “Tracker”,
      “message”: “pool-1-thread-2|Error tracker message”
}


<h2 id="iab">3. Fix for IAB enrichment filtering</h2>

As reported [here](https://discourse.snowplowanalytics.com/t/warning-iab-enrichment-treats-android-tracker-events-as-spider-generated/2482) the IAB enrichment incorrectly treats events sent by the Android tracker as spider-generated. This is due to the fact that the default User Agent used by the Android tracker, which is the one of the underlying library used to make HTTP calls (okHttp), is part of the IAB blacklist.

The new Android tracker set a different default User Agent that is not filtered out by the IAB enrichment ([#359][359]). It's always possible to customize the User Agent used by the Android tracker setting the User Agent of the tracker's Subject: `setUserAgent`.

{% highlight java %}
Subject subject =
	new Subject.SubjectBuilder()
        ...
        .setUserAgent("my-custom-user-agent")
        ...
        .build();
TrackerBuilder trackerBuilder =
    new TrackerBuilder(emitter, namespace, appId, appContext)
        ...
        .subject(subject)
        ...
        .build();
Tracker.init(trackerBuilder);
{% endhighlight %}


<h2 id="custompath">4. Make POST path of Emitter configurable</h2>

This is a feature already introduced in the Obj-C tracker as of version 1.1.0, and is now available in the Android tracker ([#319][319]).
With the new version there is a new `customPostPath` parameter that makes the Emitter configurable.
It allows specifying a custom path for POST requests, this is useful when the user wants to use a proxy for receiving the events.

{% highlight java %}
Emitter emitter =
    new Emitter.EmitterBuilder(uri, context)
        ...
        .method(HttpMethod.POST)
        .customPostPath("com.acme.company/tpx")
        ...
        .build();
TrackerBuilder trackerBuilder =
    new TrackerBuilder(emitter, namespace, appId, appContext)
        ...
        .build();
Tracker.init(trackerBuilder);
{% endhighlight %}


<h2 id="updates">5. Updates and bug fixes</h2>

- Bump target Android API to 29 ([#357][357])

We updated the library and the demo app to be fully compatible with Android 10 (API 29). It doesn't introduce any incompatibility with old versions and minimum Android OS version supported still Android 4.0 (API 14).

- Cannot unset user id from subject ([#353][353])

This bug causes issues when a parameter that is not required is set to null. In particular it has been reported that the `uid` parameter couldn't be cleared from the Subject once it was set the first time. Now, setting it to `null` clears the parameter.

- The method `Util.getEventId` is deprecated

It is a utility function in the `Util` class able to generate random UUID. It has been renamed to `getUUIDString`.
The method `getEventId` will be removed in the future v2.0 release.



<h2 id="documentation">6. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Android Tracker v1.4.0 release][1.4.0-tag].


<h2 id="help">7. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum][forums]. Please raise any bugs in the [Android Tracker’s issues][issues] on GitHub.


[android-tracker]: https://github.com/snowplow/snowplow-android-tracker
[1.4.0-tag]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.4.0

[issues]: https://github.com/snowplow/snowplow-android-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/android-tracker/

[343]: https://github.com/snowplow/snowplow-android-tracker/issues/343
[312]: https://github.com/snowplow/snowplow-android-tracker/issues/312
[359]: https://github.com/snowplow/snowplow-android-tracker/issues/359
[357]: https://github.com/snowplow/snowplow-android-tracker/issues/357
[319]: https://github.com/snowplow/snowplow-android-tracker/issues/319
[353]: https://github.com/snowplow/snowplow-android-tracker/issues/353
