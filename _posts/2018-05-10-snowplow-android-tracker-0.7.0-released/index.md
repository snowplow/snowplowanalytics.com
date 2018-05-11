---
layout: post
title: "Snowplow Android Tracker 0.7.0 released with consent tracking"
title-short: Snowplow Android Tracker 0.7.0
tags: [snowplow, javascript, privacy, optout, gdpr, eprivacy, data rights]
author: Mike
category: Releases
permalink: /blog/2018/05/10/snowplow-android-tracker-0.7.0-released-with-consent-tracking/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Android Tracker][repo].

[Version 0.7.0][release-notes] introduces first-class methods for tracking when users grant or withdraw consent for their personal data to be processed for specific purposes, as well as new and improved form tracking and the ability to create new tracker sessions client-side.

Read on below the fold for:

1. [Consent tracking](#consent)
2. [More flexible lifecycle tracking](#lifecycle)
3. [Improved TLS configuration](#tls)
4. [New session convenience method](#session)
5. [Updates and bug fixes](#updates)
6. [Documentation](#docs)
7. [Getting help](#help)

<!--more-->

<h2 id="consent">1. Consent tracking</h2>

Against the backdrop of the incoming GDPR and ePrivacy regulations, this release adds new events to track when users give their consent to, and withdraw their consent from, having their personal data processed for specific purposes.

We envision that many digital businesses will want to track the consent of their users against relatively fine-grained "bundles" of specific use cases for data, which we model in Snowplow as [consent documents][cds].

The two new consent tracking methods are:

1. [`trackConsentGranted`][tcg] for the giving of consent by a data subject
2. [`trackConsentWithdrawn`][tcw] for the removal of consent by a data subject

Each consent event will be associated to one or more consent documents, attached to the event as contexts.

Here is an example of a user opting into data collection per a specific consent document `1234`:

{% highlight java %}
List<ConsentDocument> documents = new LinkedList<>();
        documents.add(ConsentDocument.builder()
                .documentDescription("an associated document")
                .documentId("1234")
                .documentName("test name")
                .documentVersion("3")
                .build());

t1.track(ConsentGranted.builder()
    .expiry("2020-11-21T08:00:00.000Z")
    .documentDescription("a document granting consent")
    .documentName("consent_document")
    .documentVersion("5")
    .documentId("1234")
    .consentDocuments(documents)
    .build());
{% endhighlight %}

<h2 id="lifecycle">2. More flexible lifecycle tracking</h2>

App lifecycle tracking is a powerful auto-tracking capability, introduced in [version 0.6.0][060-lifecycles]. In this release we add fine-tuned control of lifecycle tracking, with the functions `tracker.pauseLifecycleHandler()` and `tracker.resumeLifecycleHandler()`.

For example, this can be used to maintain a session uninterrupted when something momentarily backgrounds an activity:

{% highlight java %}
tracker.pauseLifecycleHandler()
// Call code that backgrounds the activity watched by the lifecycle handler
tracker.resumeLifecycleHandler()
{% endhighlight %}

The lifecycle handler can also now be constructed with a custom context, so that all `application_foreground` and `application_background` events will include the custom context:

{% highlight java %}
// Create a Map of the data you want to include...
Map<String, String> dataMap = new HashMap<>();
dataMap.put("deviceName", "Phone");
dataMap.put("OSVersion", "16");

// Now create your SelfDescribingJson object...
SelfDescribingJson context1 = new SelfDescribingJson("iglu:com.acme/device_info/jsonschema/2-1-1", dataMap);

// Now add this JSON into a list of SelfDescribingJsons...
List<SelfDescribingJson> contexts = new ArrayList<>();
contexts.add(context1);

Tracker.init(new Tracker.TrackerBuilder(emitter, namespace, appId, this.getApplicationContext())
       .level(LogLevel.DEBUG)
       .base64(false)
       .platform(DevicePlatforms.Mobile)
       .subject(subject)
       .threadCount(20)
       .sessionContext(true)
       .mobileContext(true)
       .geoLocationContext(true)
       .applicationCrash(true)
       .lifecycleEvents(true)
       .build())
       .setLifecycleHandler(this, contexts);
{% endhighlight %}

Documentation can be found [here][lifecycle-doc].

<h2 id="tls">3. Improved TLS configuration</h2>

With this release, the TLS version(s) used by the emitter can be specified in the builder:

{% highlight javascript %}
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", Context context) // Required
        .method(HttpMethod.GET) // Optional - Defines how we send the request
        .option(BufferOption.Single) // Optional - Defines how many events we bundle in a POST
        .security(RequestSecurity.HTTPS) // Optional - Defines what protocol used to send events
        .tls(EnumSet.of(TLSVersion.TLSv1_1, TLSVersion.TLSv1_2)) // Optional - Defines what TLS versions should be used
        .callback(new EmitterCallback() {...})
        .build();
{% endhighlight %}

Alternatively a single enum can be passed to the builder like so: `.tls(TLSVersion.TLSv1_2)`.

As always, documentation is found [here][tls-version].

<h2 id="session">4. New session convenience method</h2>

With this release, a new session can be started with the tracker method, `tracker.startNewSession()`.

<h2 id="updates">5. Updates and bug fixes</h2>

Other updates and fixes include:

* Fixing the bug where `firstId` was not reset if the app is in the foreground ([issue #257][257])
* Raising the minimum supported Android API to level 14 ([issue #262][262])
* Unregistering LifecycleHandler callbacks on activity destruction ([issue #259][259])
* Fixing our outdated and broken Travis configuration ([issue #258][258])
* Adding `identifyUser` as an alias for `setUserId` ([issue #254][254])
* Making `tracker.setLifecycleHandler` take a Context instead of an Activity ([issue #224][224])

<h2 id="docs">6. Documentation</h2>

You can find the updated [Android Tracker documentation][android-manual] on our wiki.

As part of this release we have updated our tutorials to help Android developers integrate the Tracker into their apps:

* [Guide to integrating the tracker][integration]
* [Guide to setting up a test environment][testing]
* [Walkthrough of our Android demo app][demo-walkthrough]

You can find the full release notes on GitHub as [Snowplow Android Tracker v0.7.0 release][release-notes].

<h2 id="help">7. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][android-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/0.7.0

[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues
[262]: https://github.com/snowplow/snowplow-android-tracker/issues/262
[259]: https://github.com/snowplow/snowplow-android-tracker/issues/259
[258]: https://github.com/snowplow/snowplow-android-tracker/issues/258
[257]: https://github.com/snowplow/snowplow-android-tracker/issues/257
[256]: https://github.com/snowplow/snowplow-android-tracker/issues/256
[254]: https://github.com/snowplow/snowplow-android-tracker/issues/254
[224]: https://github.com/snowplow/snowplow-android-tracker/issues/224

[060-lifecycles]: https://snowplowanalytics.com/blog/2016/08/29/snowplow-android-tracker-0.6.0-released-with-automatic-crash-tracking/#lifecycles

[tls-version]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#5-sending-event-emitter
[cds]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-document
[tcg]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-granted
[tcw]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#consent-withdrawn
[lifecycle-doc]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#set-lifecycle-handler

[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-manual]: https://github.com/snowplow/snowplow/wiki/Android-Tracker

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
