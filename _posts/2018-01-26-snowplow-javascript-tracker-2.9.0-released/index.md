---
layout: post
title: "Snowplow JavaScript Tracker 2.9.0 released"
title-short: Snowplow JavaScript Tracker 2.9.0
tags: [snowplow, javascript, privacy, optout, data rights]
author: Mike
category: Releases
permalink: /blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/
---

We are pleased to announce a new release of the
[Snowplow JavaScript Tracker][js-tracker]. [Version 2.9.0][2.9.0-tag] introduces data rights event tracking, as
well as new and improved form tracking and the ability to make new tracker sessions client-side.

Read on below the fold for:

1. [Data rights event tracking](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#data-rights)
2. [Form tracking with more control](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#form-tracking)
3. [Start new sessions client-side](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#sessions)
4. [Updates and bug fixes](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#updates)
4. [Upgrading](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#upgrade)
5. [Documentation and help](/blog/2018/01/26/snowplow-javascript-tracker-2.9.0-released/#doc)

<!--more-->

<h2 id="data-rights">1. Data rights event tracking</h2>

This release adds new events to track when users opt in and out of data collection. The release includes two new tracking methods: [`trackConsentGranted`][tcg] and [`trackConsentWithdrawn`][tcw].

Each consent event will be associated to one or more [consent documents][cds] that are attached as contexts.

When a user opts into data collection, the consent event can be tracked like this:

{% highlight javascript %}
window.snowplow('trackConsentGranted',
  1234,                          // Id
  5,                             // Version
  'consent_document',            // Name
  'a document granting consent', // Description
  '2020-11-21T08:00:00.000Z'     // Expiry
);
{% endhighlight %}

<h2 id="opt-out">2. Form tracking with more control</h2>

Form tracking now offers the ability to transform form field data with a callback function.

For example, this facilitates hashing the field data before sending it for collection:

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

Documentation is found [here][transforms].

<h2 id="passwords">3. Start new sessions client-side</h2>

The tracker uses a session cookie to determine a session. So when a session cookie expires, a new session starts. With this release, a new session can be started at any time by calling the `newSession` function:

{% highlight javascript %}
window.snowplow('newSession');
{% endhighlight %}

Documentation is found [here][ns].

<h2 id="updates">4. Updates and bug fixes</h2>

Other updates and fixes include:

* Make newDocumentTitle variable local ([#580][580])
* Enforce that geolocation.timestamp is an integer ([#602][602]) 
* Remove respectOptOutCookie configuration from the comments ([#605][605])
* Add identifyUser as alias for setUserId ([#621][621])
* Bump semver to 4.3.2 ([#625][625])

<h2 id="upgrade">5. Upgrading</h2>

The tracker is available to use here:

```
http(s)://d1fc8wv8zag5ca.cloudfront.net/2.9.0/sp.js
```

There are no breaking API changes introduced with this release.

<h2 id="doc">6. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.9.0 release page][2.9.0-tag] on GitHub has the full list of changes made
in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [the usual channels][talk].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.9.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.9.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[talk]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker
[tcg]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentGranted
[tcw]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentWithdrawn
[ns]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#state
[transforms]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#custom-form-tracking
[580]: https://github.com/snowplow/snowplow-javascript-tracker/issues/580
[602]: https://github.com/snowplow/snowplow-javascript-tracker/issues/602
[605]: https://github.com/snowplow/snowplow-javascript-tracker/issues/605
[621]: https://github.com/snowplow/snowplow-javascript-tracker/issues/621
[625]: https://github.com/snowplow/snowplow-javascript-tracker/issues/625