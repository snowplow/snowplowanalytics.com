---
layout: post
title: "Snowplow JavaScript Tracker 2.9.0 released with consent tracking"
title-short: Snowplow JavaScript Tracker 2.9.0
tags: [snowplow, javascript, privacy, optout, gdpr, eprivacy, data rights]
author: Mike
category: Releases
permalink: /blog/2018/02/28/snowplow-javascript-tracker-2.9.0-released-with-consent-tracking/
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker]. [Version 2.9.0][2.9.0-tag] introduces first class methods for tracking when users grant or withdraw consent for their personal data to be processed for specific purposes, as well as new and improved form tracking and the ability to make new tracker sessions client-side.

Read on below the fold for:

1. [Tracking users granting, and withdrawing, consent to have their personal data processed for specific purposes](#data-rights)
2. [Form tracking with more control](#opt-out)
3. [Start new sessions client-side](#passwords)
4. [Updates and bug fixes](#updates)
5. [Upgrading](#upgrade)
6. [Documentation and help](#doc)

<!--more-->

<h2 id="data-rights">1. Tracking users granting, and withdrawing, consent to have their personal data processed for specific purposes</h2>

Against the backdrop of the incoming GDPR and ePrivacy regulations, this release adds new events to track when users give their consent to, and withdraw their consent from, having their personal data processed for specific purposes.

We envision that many digital businesses will want to track the consent of their users against relatively fine-grained "bundles" of specific data usecases, which we model in Snowplow as [consent documents][cds].

The two new consent tracking methods are:

1. [`trackConsentGranted`][tcg] for the giving of consent
2. [`trackConsentWithdrawn`][tcw] for the removal of consent

Each consent event will be associated to one or more consent documents, attached to the event as contexts.

Here is an example of a user opted into data collection per a specific consent document `1234`:

{% highlight javascript %}
window.snowplow('trackConsentGranted',
  1234,                          // Consent document id
  5,                             // Consent document version
  'consent_document',            // Consent document name
  'a document granting consent', // Consent document description
  '2020-11-21T08:00:00.000Z'     // Expiry of consent
);
{% endhighlight %}

<h2 id="opt-out">2. Form tracking with more control</h2>

Form tracking now offers the ability to transform form field data with a callback function, `transform()`.

For example, use this to hash the field data before sending it for collection:

{% highlight javascript %}
var config = {
  forms: {
    whitelist: ["tracked"]
  },
  fields: {
    filter: function (elt) {
      return elt.id !== "private";
    },
    transform: function (elt) {
      return MD5(elt);
    }
  }
};

window.snowplow('enableFormTracking', config);
{% endhighlight %}

Documentation can be found [here][transforms].

<h2 id="passwords">3. Start new sessions client-side</h2>

The Snowplow JavaScript Tracker uses a session cookie to determine a session - when the session cookie expires, a new session starts. With this release, a new session can instead be started at any time by calling the `newSession` function:

{% highlight javascript %}
window.snowplow('newSession');
{% endhighlight %}

Documentation is found [here][new-session].

<h2 id="updates">4. Updates and bug fixes</h2>

Other updates and fixes include:

* Add `identifyUser` as an alias for `setUserId` ([#621][621])
* Make the `newDocumentTitle` variable local ([#580][580])
* Enforce that `geolocation.timestamp` is an integer ([#602][602])
* Bump the `semver` dependency to 4.3.2 ([#625][625])
* Remove `respectOptOutCookie` from the Tracker function comments ([#605][605])

<h2 id="upgrade">5. Upgrading</h2>

The tracker is available to use here:

```
http(s)://d1fc8wv8zag5ca.cloudfront.net/2.9.0/sp.js
```

As always, we encourage you to self-host your own copy of the tracker.

There are no breaking API changes introduced with this release.

<h2 id="doc">6. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.9.0 release page][2.9.0-tag] on GitHub has the full list of changes made
in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.9.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.9.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[cds]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#consent-documents
[tcg]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentGranted
[tcw]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentWithdrawn

[new-session]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#state
[transforms]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#custom-form-tracking

[580]: https://github.com/snowplow/snowplow-javascript-tracker/issues/580
[602]: https://github.com/snowplow/snowplow-javascript-tracker/issues/602
[605]: https://github.com/snowplow/snowplow-javascript-tracker/issues/605
[621]: https://github.com/snowplow/snowplow-javascript-tracker/issues/621
[625]: https://github.com/snowplow/snowplow-javascript-tracker/issues/625
