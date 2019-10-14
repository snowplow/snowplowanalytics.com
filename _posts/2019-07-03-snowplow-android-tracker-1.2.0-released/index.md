---
layout: post
title: "Snowplow Android Tracker 1.2.0 released with global contexts"
title-short: Snowplow Android Tracker 1.2.0
tags: [snowplow, android, java, mobile]
author: Oguzhan
category: Releases
permalink: /blog/2019/07/03/snowplow-android-tracker-1.2.0-released-with-global-contexts/
discourse: true
---

**IMPORTANT NOTE: 1.2.0 has a critical bug which causes duplication of natively supported contexts. 1.2.1 release is published to patch this bug. Thanks for the understanding.**

We are pleased to announce the `1.2.0` release of the [Snowplow Android Tracker][repo].

[1.2.0][release-notes] introduces support for global contexts: introducing a set of new functions enabling users to send custom contexts with every event or a subset of events based on user provided criteria.

Read on for:

1. [Global Contexts](#global-contexts)
2. [Customizable Emitter timeout](#customizable-emitter-timeout)
3. [Other updates](#updates)
4. [Documentation](#docs)
5. [Getting help](#help)

<!--more-->

<h2 id="global-contexts">1. Global Contexts</h2>

<h3>1.1 A quick recap on contexts</h3>

One of the most powerful features in Snowplow is support for contexts. Contexts are entities that are tracked across multiple events. Examples of contexts include:

* Users
* Products
* Screens
* Applications
* Devices
* Location
* Weather

Contexts have a few features: 

* They typically include a number of data points: for example, a user context might contain data points for the user's name, ID, membership type, Twitter handle etc. The location context might include longitude, latitude, country, region, postcode.
* They are tracked across multiple events. For example, we might record a user context, screen context, application context, device context, location context or weather context with _every_ event recorded from a mobile application, for example.

With Snowplow:

* There are multiple contexts that are tracked out-of-the-box.
* Users can define their own contexts. There is no limit to the number of contexts that can be defined, or the number that are attached to every event. This means Snowplow users can track very rich data.
* Context data is loaded in a consistent way in the data warehouse, making it easy to query. So all the user-level data will be in the same user table, regardless of which event is fired.

<h3>1.2 Introducing "global contexts"</h3>

Until recently devleopers integrating Snowplow tracking had to attach contexts to each event.

With "global contexts", it is now possible for developers to ensure that contexts are automatically attached to all events, or a subset. This presents a number of benefits:

1. It makes it easier for developers to implement Snowplow to track very rich data in an easy way.
2. It makes the tracking less error-prone - it is not significantly less likely that an event will accidentally be sent without a required context attached.
3. That in turn makes it easier for analysts and developers consuming the data, because they can be confident to expect certain events from particular platforms to always have the required contexts attached.

Global contexts were introduced in the Javascript tracker in [version 2.10.0][js-tracker-2.10.0-blog-post]. This release of the Android tracker adds Global contexts to Android. We plan to release similar functionality for iOS apps in a forthcoming release of our Objective-C Tracker.

<h3>1.3 Getting started with global contexts</h3>

#### 1.3.1 Context Primitives

Context primitives are simplest forms to represent global contexts and there are 2 forms: Self describing JSON & Context Generator.

##### 1.3.1.1 Self Describing JSON

Custom contexts have been represented as self describing JSONs so far and they can be used directly as a global context when you’d like a context to be attached to every event.

{% highlight java %}

Map<String, String> attributes = new HashMap<>();
attributes.put("test-key-1", "test-value-1");
GlobalContext testCtx = new SelfDescribingJson("sdjExample", "iglu:com.snowplowanalytics.snowplow/test_event/jsonschema/1-0-1", attributes);
tracker.addGlobalContext(testCtx);

{% endhighlight %}

Have you noticed the first argument of `SelfDescribingJson` above? With this release `SelfDescribingJson` class offers new constructors with a new parameter, `tag`, to be used to identify global contexts. All existing constructors of the class are kept to stay backward compatible.

##### 1.3.1.2 Context Generator

A context generator is a callback that returns a self describing JSON, representing a context. They are evaluated each time an event is sent, hence they meet the case where we would like to send a context based on event payload.

{% highlight java %}

GlobalContext testCtx = new ContextGenerator() {
    @Override
    public SelfDescribingJson generate(TrackerPayload payload, String eventType, String eventSchema) {
        if (payload.getMap().get("aid").equals("web_app")) {
            return new SelfDescribingJson("iglu:com.acme/web_example/jsonschema/1-0-0");
        } else {
            return new SelfDescribingJson("iglu:com.acme/generic_example/jsonschema/1-0-0");
        }
    }

    @Override
    public String tag() {
        return "testCtx";
    }
};
tracker.addGlobalContext(testCtx);

{% endhighlight %}

Callbacks are represented as interfaces in Java, hence `ContextGenerator` is an interface and it is required to implement `ContextGenerator` interface by defining `generate` and `tag` methods. `generate` function will be evaluated for each event sent from tracker and the returned Self Describing JSON will be attached to the event. `tag` is the identifier of this global context.

Let us explain the `generate` method in detail. Signature is `SelfDescribingJson generate(TrackerPayload payload, String eventType, String eventSchema)`.
- `payload` :  the payload of the event per [Snowplow Tracker Protocol][tracker-protocol]
- `eventType` : a two letter code that describes the event type, this value is equal to the Snowplow tracker protocol's [field "e"][tracker-protocol-event-type]
- `eventSchema` : if the event is a self describing event, it is the schema of the event, otherwise it is [the payload data schema][payload-data-schema]

#### 1.3.2 Conditional Context Providers

While Context Generator is technically capable of handling what Conditional Context Providers can offer, we want to ease the handling of conditional cases as following.

##### 1.3.2.1 Filter Provider

A Filter Provider is used to discriminate between events so we can attach global contexts only to certain events.

{% highlight java %}

ContextPrimitive primitive = new SelfDescribingJson("iglu:com.acme/test_event/jsonschema/1-0-0");
GlobalContext testCtx = new FilterProvider("test-tag", new ContextFilter() {
    @Override
    public boolean filter(TrackerPayload payload, String eventType, String eventSchema) {
        return eventType.equals("se");
    }
}, primitive);

tracker.addGlobalContext(testCtx);

{% endhighlight %}

Here is the constructor signature: `FilterProvider(String tag, ContextFilter contextFilter, ContextPrimitive contextPrimitive)`
- `tag` : the identifier of this context
- `contextFilter` : A callback, similar to `ContextGenerator`, which returns boolean so that tracker can decide to attach the context specified in 3rd parameter `contextPrimitive`
- `contextPrimitive` : the context primitive to be attached to the events in case `contextFilter`'s `filter` method returns `true`

Let's look at the signature of `ContextFilter`'s `filter`, `boolean filter(TrackerPayload payload, String eventType, String eventSchema)`.
- `payload` :  the payload of the event per [Snowplow Tracker Protocol][tracker-protocol]
- `eventType` : a two letter code that describes the event type, this value is equal to the Snowplow tracker protocol's [field "e"][tracker-protocol-event-type]
- `eventSchema` : if the event is a self describing event, it is the schema of the event, otherwise it is [the payload data schema][payload-data-schema]

`FilterProvider` also offers another constructor with only difference in the 3rd parameter as following; `List<ContextPrimitive> contextPrimitives`.

##### 1.3.2.2 RuleSet Provider

A Ruleset Provider is used when you want to attach a global context to certain events based on the schema URI.

Here is the constructor signature: `RuleSetProvider(String tag, RuleSet ruleSet, ContextPrimitive contextPrimitive)`
- `tag` : the identifier of this context
- `ruleSet` : A `RuleSet` object
- `contextPrimitive` : the context primitive to be attached in case event schema is allowed per `ruleSet`

`RuleSet` stores allowed and rejected URIs. Here is the signature of its' constructor: `RuleSet(String accept, String reject)` . Plural version is also available.

`accept` and `reject` are strings very similar to Iglu URIs with the exception that a wildcard can be used in an allowed fashion to refer to all applying cases.

The parts of a rule are wildcarded with certain guidelines:

- Two parts are invariant: protocol and format. They are always `iglu` and `jsonschema` respectively. Wildcards can therefore be used only in `vendor`, `event_name` and `version`
- Only sequential parts are to be wildcarded in version & no number after the first wildcard. e.g. `*-*-*`, `1-*-*` and `2-0-*` are valid, `1-*-1` and `*-*-1` are invalid
- Vendors require the leftmost two parts: : `com.acme.*` is valid, while `com.*` is not
- Vendors cannot be defined with non-wildcarded parts between wildcarded parts: `com.acme.*.marketing.*` is invalid, while `com.acme.*.*` is valid

<h2 id="customizable-emitter-timeout">2. Customizable Emitter timeout</h2>

The emitter timeout now can be customized thanks to the contribution by [@antonkazakov][antonkazakov]!

{% highlight java %}
Emitter e2 = new Emitter
        .EmitterBuilder("com.collector.acme", context)
        .emitTimeout(5)
        .build();
{% endhighlight %}

<h2 id="updates">3. Other updates</h2>

Other updates and fixes include:

* Set emitter status when event store not instantiated ([#306][306])

<h2 id="docs">4. Documentation</h2>

As always, information about how to use the tracker can be found in the [Android Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow Android Tracker 1.2.0 release][release-notes].

<h2 id="help">5. Getting help</h2>

For help on integrating the tracker please have a look at the [documentation][docs].

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[docs]: http://docs.snowplowanalytics.com/open-source/snowplow/trackers/android-tracker/1.2.1/
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/1.2.1
[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues

[global-contexts-rfc]: https://discourse.snowplowanalytics.com/t/global-contexts-rfc/2340
[js-tracker-2.10.0-blog-post]: https://snowplowanalytics.com/blog/2019/01/23/snowplow-javascript-tracker-2.10.0-released-with-global-contexts/

[tracker-protocol-event-type]: https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#3-snowplow-events
[payload-data-schema]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4
[tracker-protocol]: https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol

[antonkazakov]: https://github.com/antonkazakov
[306]: https://github.com/snowplow/snowplow-android-tracker/issues/306

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
