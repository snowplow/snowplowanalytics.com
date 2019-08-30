---
layout: post
title: "Snowplow JavaScript Tracker 2.11.0 released with GDPR context"
title-short: Snowplow JavaScript Tracker 2.11.0
tags: [snowplow, javascript, gdpr, data rights]
author: Colm
category: Releases
permalink: /blog/2019/08/28/snowplow-javascript-tracker-2.11.0-released-with-gdpr-context/
discourse: true
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker]. [Version 2.11.0][2.11.0-tag] introduces a method for attaching information about the GDPR basis for processing to all events tracked, as well as changes to the test and deployment process and a bugfix for form focus events.

NB. This release introduces a change to how assets are hosted - rather than hosting the tracker on cloudfront, we now publish the asset to the GitHub release. Users who have previously relied on the cloudfront hosted asset must host the tracker on their own CDN, as is recommended practice. More detail in the [New deployment process](#deployment) and [Upgrading](#upgrade) sections.

Read on below the fold for:

1. [Tracking GDPR basis for processing with the GDPR context](#gdpr-context)
2. [New deployment process](#deployment)
3. [Updates and bug fixes](#updates)
4. [Upgrading](#upgrade)
5. [Documentation and help](#doc)

<!--more-->

<h2 id="gdpr-context">1. Tracking GDPR basis for processing with the GDPR context</h2>

This release introduces the `enableGdprContext` method, which once enabled appends a GDPR context to all events. This allows users to easily record the basis for data collection and relevant documentation, and enables a straightforward audit flow for all events.

`enableGdprContext` takes four arguments:

- GdprBasis (required string enum, must be one of the following values consent, contract, legalObligation, vitalInterests, publicTask, legitimateInterests)
- documentId (string)
- documentVersion (string, max 16 charas)
- documentDescription (string)

It is called as follows:

{% highlight javascript %}
window.snowplow('enableGdprContext',
  'consent',
  'abc1234',
  '0.1.0',
  'this document describes consent basis for processing'
);
{% endhighlight %}

Documentation can be found [here][LINK TO DOCS HERE!!!]


<h2 id="deployment">2. New deployment process</h2>

Previously to this release, the javascript tracker was published to a public cloudfront asset which could be called from anywhere - this made it simpler for new users to get started with snowplow tracking. However, this represents an inherent security risk if the hosted asset is called directly in third party web pages/applications. For this reason we have always recommended that users host the tracker on their own CDN for production usage. With this release we have decided to establish a new process which enforces this as policy.

The tracker asset is now published as a [Github Release][2.11.0-tag] (the `sp.js` file) - which can be hosted on your own CDN - we recommend that it is hosted on the same domain in which the tracker is called. Snowplow Insights customers will have the asset deployed to the CDN within their AWS or GCP account by default, but we encourage self-management of the process also for those interested in more control.

There are additional advantages to doing this:

- Upgrading tracker versions can now more easily be managed by rotating the hosted asset rather than changing client-side tracking code.
- Some Adblockers designed to block third-party tracking won't allow the javascript to load from an external domain even if it's used for first party tracking - hosting on your own domain resolves this problem.

<h2 id="passwords">3. Updates and bug fixes</h2>

Other updates and bugfixes include:

- Core: Send focus_form 'type' field as 'elementType' ([#731][731])
- Update Sauce Connect version ([#735][735])
- Ensure that the intended version is deployed ([#739][739])

<h2 id="upgrade">4. Upgrading</h2>

The tracker is available as a published asset in the [2.11.0 Github release][2.11.0-tag]:

To upgrade, host the `sp.js` asset in a CDN, and call the tracker from there.

There are no breaking API changes introduced with this release.

<h2 id="doc">5. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.11.0 release page][2.11.0-tag] on GitHub has the full list of changes made
in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].


[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.11.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.11.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[731]: https://github.com/snowplow/snowplow-javascript-tracker/issues/731
[735]: https://github.com/snowplow/snowplow-javascript-tracker/issues/735
[739]: https://github.com/snowplow/snowplow-javascript-tracker/issues/739
