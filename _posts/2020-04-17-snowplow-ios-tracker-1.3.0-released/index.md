---
layout: post
title: "Snowplow iOS Tracker 1.3.0 released"
title-short: Snowplow iOS Tracker 1.3.0
tags: [snowplow, objc, ios, tracker]
author: Alex Benini
category: Releases
permalink: /blog/2020/04/17/snowplow-ios-tracker-1.3.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow iOS Tracker][objc-tracker].
[Version 1.3.0][1.3.0-tag] it's an important release that introduces Global Contexts, GDPR contexts and support of Swift Package Manager thanks to the contribute of [@vauxhall][contributor]. Swift Package Maanger completes the list of supported dependency managers, which already includes Cocoapods and Carthage. 

Read on below for:

1. [Global Contexts](#gc)
2. [Tracking GDPR basis for processing with the GDPR context](#gdpr)
3. [Swift Package Manager support](#spm)
4. [Deprecated methods](#deprecated)
5. [Updates and bug fixes](#updates)
6. [Documentation](#documentation)
7. [Getting help](#help)

<!--more-->

<h2 id="gc">1. Global Contexts</h2>

We are happy to announce the integration of Global Contexts feature in the iOS tracker ([#357][357]).

<h3>1.1 A quick recap on contexts</h3>

Contexts are entities tracked across multiple events. They are particularly important as they can add value to the event tracking multiple informations accordingly with a related schema. The schema can specify the kind of data tracked with the context. Tipical contexts are: session, geolocation, page and screen views, device informations, user details.

Some of the contexts are tracked out-of-the-box but it's possible to add some custom contexts tracking other domain specific data. There is no limit to the number of contexts attached to the events.
Obviously, not all the contexts suit every event. Some of the contexts can make sense only on specific events and it's up to the developer handling these cases.

<h3>1.2 Introducing Global Contexts</h3>

Until now the developer needed to programmatically attach custom contexts to each specific event. The _global contexts_ feature helps the developer making this operation declarative.
The developer can declare which contexts have to be attached to which events and the tracker will take care to attach the contexts to the events when needed as declared by the developer.

* It makes it easier for developers to implement Snowplow to track very rich data in an easy way.
* It makes the tracking less error-prone - it is not significantly less likely that an event will accidentally be sent without a required context attached.
* That in turn makes it easier for analysts and developers consuming the data, because they can be confident to expect certain events from particular platforms to always have the required contexts attached.

<h3>1.3 Getting started with Global Contexts</h3>

As explained above, the _global contexts_ are particularly helpful when the developer wants to associated specific contexts to all the events or a subset of them, rather than adding the contexts manually to each event tracked.
This can be done at tracker setup declaring the contexts generator and the suitable subset of events.

{% highlight objc %}
// Instance a global contexts generator
SPGlobalContext *globalContext1 = [[SPGlobalContext alloc] initWithStaticContexts:@[[[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}]]];

...

SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    ...
    [builder setGlobalContextGenerators:@{
        @"tag1": globalContext1,
        @"tag2": globalContext2,
        ...
    }];
}];
{% endhighlight %}

The methods `setGlobalContextGenerators:` can be used to set up the generators able to create contexts. For each context generator is associated a tag string.
The tag string can be used to remove a generator at runtime using the method `removeGlobalContext`.

{% highlight objc %}
SPGlobalContext *globalContext = [tracker removeGlobalContext:@"tag1"];
{% endhighlight %}

It returns `nil` in case the there aren't global contexts stored with the specified tag, otherwise it returns the removed SPGlobalContext instance.

It's possible to add global contexts at runtime with the method `addGlobalContext`.

{% highlight objc %}
BOOL isAdded = [tracker addGlobalContext:globalContext tag:@"tag1"];
{% endhighlight %}

<h4>1.3.1 Context primitives</h4>

Context primitive is a term for anything that can be used as a context. A context primitive is a self-describing JSON, or a callback that creates a self-describing JSON.

<h5>Self-describing JSON</h5>

This is useful in cases where the context is static and it's always the same.

{% highlight objc %}
SPGlobalContext *staticGC = [[SPGlobalContext alloc] initWithStaticContexts:@[
    [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}]
]];
[tracker addGlobalContext:staticGC tag:@"tag1"];
{% endhighlight %}

<h5>Context Generator Callback</h5>

A context generator callback returns an array of self describing JSONs, representing contexts.
They are evaluated each time an event is sent, hence they meet the case where we would like to send a context based on event informations.
`SPInspectableEvent` is an interface that expose internal data of the event processed: event name, schema and payload.

{% highlight objc %}
SPGlobalContext *blockGC = [[SPGlobalContext alloc] initWithGenerator:^NSArray<SPSelfDescribingJson *> *(id<SPInspectableEvent> event) {
    ... Computing using event informations ...
    return @[
        [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}],
    ];
}];
[tracker addGlobalContext:blockGC tag:@"tag1"];
{% endhighlight %}

<h4>1.3.2 Conditional Context Providers</h4>

The previous approaches considered the generation of contexts associated to every events.
However, there are cases where the contexts have to be applied to certain events only. 

<h5>Filter Callback</h5>

A filter callback is used to discriminate between events so we can attach global contexts only to certain events.

{% highlight objc %}
SPGlobalContext *filteredGC = [[SPGlobalContext alloc] initWithStaticContexts:@[[[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}]]
    filter:^BOOL(id<SPInspectableEvent> event) {
        return ["se" isEqualToString:event.name];
    }
];
[tracker addGlobalContext:filteredGC tag:@"tag1"];
{% endhighlight %}

<h5>Ruleset Provider</h5>

A ruleset provider is used when you want to attach a global context to certain events based on the schema URI.

A ruleset provider has a ruleset which has a list of allowed schemas and a list of denied schemas. Both lists contain Iglu URIs which can be modified based on some syntactic rules.

In this example, the ruleset provider will attach the generated contexts (as described in the previous section) to events with the schema `iglu:com.acme.*/*/jsonschema/*-*-*`, but not to `iglu:com.acme.marketing/*/jsonschema/*-*-*`.

{% highlight objc %}
NSString *allowed = @"iglu:com.snowplowanalytics.*/*/jsonschema/*-*-*";
NSString *denied = @"iglu:com.snowplowanalytics.mobile/*/jsonschema/*-*-*";

SPSchemaRuleset *ruleset = [SPSchemaRuleset rulesetWithAllowedList:@[allowed] andDeniedList:@[denied]];
SPGlobalContext *rulesetGC =
    [[SPGlobalContext alloc] initWithStaticContexts:@[[[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}]] ruleset:ruleset];
[tracker addGlobalContext:rulesetGC tag:@"tag1"];
{% endhighlight %}

<h5>Ruleset format</h5>

RuleSet's rules are the strings used to match against certain schemas, such as `iglu:com.acme/*/jsonschema/*-*-*`.

They follow the same five-part format as an Iglu URI:

{% highlight objc %}
protocol:vendor/event_name/format/version
{% endhighlight %}

with the exception that a wildcard can be used in an allowed fashion to refer to all applying cases.

The parts of a rule are wildcarded with certain guidelines:

* asterisks cannot be used for the protocol (i.e. schemas always start with `iglu:`).

* version matching must be specified like so: *-*-*, where any part of the versioning can be defined, e.g. 1-*-*, but only sequential parts are to be wildcarded, e.g. 1-*-1 is invalid but 1-*-* is valid.</li><li>at least two parts parts: `com.acme.*` is valid, while `com.*` is not.

* vendors cannot be defined with non-wildcarded parts between wildcarded parts: com.acme.*.marketing.* is invalid, while com.acme.*.\https://zoom.us/j/779696786* is valid.

<h5>Context Generator</h5>

In case the logic for filter and generator callbacks are too complex, it's possible to specify them in a class that implements `SPContextGenerator` protocol.

{% highlight objc %}
@protocol SPContextGenerator <NSObject>

/*!
 @brief Takes event information and decide if the context needs to be generated.
 @param event informations about the event to process.
 @return weather the context has to be generated.
 */
- (BOOL)filterFromEvent:(id<SPInspectableEvent>)event;

/*!
 @brief Takes event information and generates a context.
 @param event informations about the event to process.
 @return a user-generated self-describing JSON.
 */
- (nullable NSArray<SPSelfDescribingJson *> *)generatorFromEvent:(id<SPInspectableEvent>)event;

@end
{% endhighlight %}

In this case the logic about filtering and generation is encapsulated behind a context generator class.

{% highlight objc %}
@interface GlobalContextGenerator: NSObject <SPContextGenerator>
@end

@implementation GlobalContextGenerator

- (BOOL)filterFromEvent:(id<SPInspectableEvent>)event {
    return YES;
}

- (NSArray<SPSelfDescribingJson *> *)generatorFromEvent:(id<SPInspectableEvent>)event {
    return @[
        [[SPSelfDescribingJson alloc] initWithSchema:@"iglu:com.snowplowanalytics.snowplow/test_sdj/jsonschema/1-0-1" andData:@{@"key": @"value"}],
    ];
}

@end
{% endhighlight %}

It can be passed to the tracker as usual:

{% highlight objc %}
SPGlobalContext *contextGeneratorGC = [[SPGlobalContext alloc] initWithContextGenerator:[GlobalContextGenerator new]];
[tracker addGlobalContext:rulesetGC tag:@"tag1"];
{% endhighlight %}

<h2 id="gdpr">2. Tracking GDPR basis for processing with the GDPR context</h2>

This release introduces the `gdprContext` and the `enableGdprContext` methods, which append a GDPR context to all events once enabled ([#425][425]).
This allows users to easily record the basis for data collection and relevant documentation, and enables a straightforward audit flow for all events.

It takes the following arguments:

|      **Name** | **Description**             | **Required?** | **Type** |
|--------------:|:----------------------------|:--------------|:---------|
|       `basis` | GDPR Basis for processing | Yes           | Enum String   |
|     `documentId` | ID of a GDPR basis document     | No           | String   |
|        `documentVersion` | Version of the document        | No            | String   |
| `documentDescription` | Description of the document | No            | String   |

The required basisForProcessing accepts only the following literals: `consent`, `contract`, `legal_obligation`, `vital_interests`, `public_task`, `legitimate_interests` - in accordance with the [five legal bases for processing](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/)

The GDPR context is enabled by calling the `setGdprContextWithBasis:documentId:documentVersion:documentDescription:` method of the tracker builder or by calling the `enableGdprContextWithBasis:documentId:documentVersion:documentDescription:` method once the tracker has been initialised.

It is called as follows:

{% highlight objc %}
SPTracker *tracker = [SPTracker build:^(id<SPTrackerBuilder> builder) {
    [builder setEmitter:emitter];
    ...
    [builder setGdprContextWithBasis:SPGdprProcessingBasisConsent
                          documentId:@"someId"
                     documentVersion:@"0.1.0"
                 documentDescription:@"a demo document description"];
}];
{% endhighlight %}

<h2 id="spm">3. Swift Package Manager support</h2>

The Swift Package Manager is the official Apple's dependency manager designed for Swift libraries. Since Xcode 11 SPM is compatible with the iOS build system contributing to enlarge the mobile developers interst around this new dependency manager that will compete against the largely longtime used Cocoapods and Carthage.
Thanks to the important contribute of [@vauxall][contributor] we have introduced the support of Swift Package Manager for our iOS tracker ([#474][474]). At the moment it supports only the iOS platform due to some limitations that we will resolve in the future releases, but it still is a great adding for our mobile tracker and a great contribute from our active community.

To install Snowplow Tracker with SPM:
1. in your Xcode select File > Swift Packages > Add Package Dependency
2. set the repository: https://github.com/snowplow/snowplow-objc-tracker
3. add the modules to your project's targets on General tab > _Frameworks, Libraries & Embedded Content_ section
 
<h2 id="deprecated">4. Deprecated methods</h2>

On this release we marked few methods as deprecated:

- SPEvent - `eventId`: This shouldn't be used as it can cause ambiguity about event duplication. That will be set only by the tracker. If your code set its own eventId we suggest to record your custom event ID in a custom context associated to all the events.

- SPEvent - `timestamp`: In future major versions we will remove the ability to override the timestamp of the event. That will be set only by the tracker. A custom timestamp can be eventually added using a different method or parameter in a future release.

- SPEvent - `addDefaultParamsToPayload:`: This shouldn't be used as it's an internal method used by the tracker and it can be subject of future changes. 

Other few methods can be set as deprecated because mostly related to internal logic of the tracker. We strongly suggest to avoid use of methods marked deprecated as they will be substituted or removed in the next major version.


<h2 id="updates">5. Updates and bug fixes</h2>

- Fixed some warnings due to deprecated methods on last iOS versions ([#493][493], [#492][492], [#479][479]).

- Internal events refactoring ([#489][489]).

<h2 id="documentation">6. Documentation</h2>

As always, information about how to use the tracker can be found in the [iOS Tracker documentation][docs].

You can find the full release notes on GitHub as [Snowplow iOS Tracker v1.3.0 release][1.3.0-tag].


<h2 id="help">7. Getting help</h2>

For help on integrating the tracker please have a look at the setup guide. If you have any questions or run into any problems, please visit our [Discourse forum][forums]. Please raise any bugs in the [iOS Tracker’s issues][issues] on GitHub.


[objc-tracker]: https://github.com/snowplow/snowplow-objc-tracker
[1.3.0-tag]: https://github.com/snowplow/snowplow-objc-tracker/releases/tag/1.3.0
[contributor]: https://github.com/vauxhall

[issues]: https://github.com/snowplow/snowplow-objc-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/objc-tracker/

[357]: https://github.com/snowplow/snowplow-objc-tracker/issues/357
[425]: https://github.com/snowplow/snowplow-objc-tracker/issues/425
[474]: https://github.com/snowplow/snowplow-objc-tracker/issues/474
[479]: https://github.com/snowplow/snowplow-objc-tracker/issues/479
[489]: https://github.com/snowplow/snowplow-objc-tracker/issues/489
[492]: https://github.com/snowplow/snowplow-objc-tracker/issues/492
[493]: https://github.com/snowplow/snowplow-objc-tracker/issues/493
