---
layout: post
title: "Snowplow JavaScript Tracker 2.15.0 released"
title-short: Snowplow JavaScript Tracker 2.15.0
tags: [snowplow, javascript, tracker]
author: Paul
category: Releases
permalink: /blog/2020/08/20/snowplow-javascript-tracker-2.15.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker].

[Version 2.15.0][2.15.0-tag] introduces two key features around user identification: anonymous tracking capabilities and support for Chrome's Client Hints (that will replace the traditional useragent string). It also comes with some minor improvements and bug fixes.

Read on below for:

1. [Anonymous Tracking](#1-anonymous-tracking)
2. [Support for Chrome's Client Hints](#2-client-hints)
3. [Other features and bug fixes](#3-other-features-and-bugfixes)
4. [Upgrading](#4-upgrading)
5. [Documentation and help](#5-documentation-and-help)

<!--more-->

## 1. Anonymous Tracking

The Snowplow technology is built from the ground up for maximum flexibility and control. In an age of incerasing awareness of user privacy, this should include giving users the ability to decide whether or not they want to track persistent user identifiers with their Snowplow web events. Therefore, we are introducing anonymous tracking capabilities into the Snowplow JavaScript tracker ([Github issue](https://github.com/snowplow/snowplow-javascript-tracker/issues/793)). Specifically, we are providing two techniques, full anonymous tracking and anonymous session tracking. By default `anonymousTracking: false`.

Recommended configurations when using anonymousTracking:

```
anonymousTracking: true,
stateStorageStrategy: 'cookieAndLocalStorage'
```

or

```
anonymousTracking: { withSessionTracking: true },
stateStorageStrategy: 'cookieAndLocalStorage'
```

If using the anonymous session tracking, the session information is stored in a cookie or local storage, depending on the `stateStorageStrategy`, but no user identifiers are used that exist beyond the users current session.

More information on how to instrument anonymous tracking can be found in the [technical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#Anonymous_Tracking_2150). 

You may wish to toggle this functionality on or off during a page visit, for example when a user accepts a cookie banner you may not want to disable anonymous tracking, or when a user logs in to your site. Information on how to instrument this can be found in the [technical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/other-parameters-2/#Toggling_Anonymous_Tracking_2150).


## 2. Client Hints

Chrome announced that the User Agent will be frozen from Chromium 84 onwards, and will be replaced by "Client Hints" ([Github issue](https://github.com/snowplow/snowplow-javascript-tracker/issues/816)). Client Hints offer useful information to understand browser usage without the potential to infringe on a users privacy as is often the case with the User Agent string. 

Version 2.15.0 of the Snowplow JavaScript tracker comes with support for these Client Hints. If enabled in the tracker initialization, a custom context will be sent with each event.

Specifically, the context be enabled in two ways:

```
clientHints: true
```

This will capture the “basic” client hints.

```
clientHints: { includeHighEntropy: true }
```

This will capture the “basic” client hints as well as hints that are deemed “High Entropy” and could be used to fingerprint users. Browsers may choose to prompt the user before making this data available.

More information on Client Hints can be found in the [technical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#clientHints_context_2150).


## 3. Other features and bug fixes

This tracker also comes with a few other minor features and bug fixes:

* Support for callback after trackEvent ([Github issue #30](https://github.com/snowplow/snowplow-javascript-tracker/issues/30)).
* Return full element in transform function within form tracking ([Github issue #825](https://github.com/snowplow/snowplow-javascript-tracker/issues/825)).
* Make browser feature fields optional ([Github issue #810](https://github.com/snowplow/snowplow-javascript-tracker/issues/810)); more information can be found in the [techical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#Skip_tracking_browser_features_2150).
* Metric GET failure no longer blocks queue executing ([Github issue #769](https://github.com/snowplow/snowplow-javascript-tracker/issues/769)); this was an external contribution from `IArny`, thank you very much!
* Ability to set connection timeout (for slow 3G) ([Github issue #642](https://github.com/snowplow/snowplow-javascript-tracker/issues/642)); more information can be found in the [techical documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/general-parameters/initializing-a-tracker-2/#Set_connection_timeout_2150).
* Change initial page ping to fire at minimum visit length when less than heart beat delay ([Github issue #803](https://github.com/snowplow/snowplow-javascript-tracker/issues/803)); this was an external contribution from `abiswas-tgam`, thank you very much!


## 4. Upgrading

The tracker is available as a published asset in the [2.15.0 Github release][2.15.0-tag]:

To upgrade, Snowplow Insights and Open Source users should host the 2.15.0 version of `sp.js` asset on a CDN, and load the tracker from there.

## 5. Documentation and help

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [quickstart guide][quickstart]
* The [full API documentation][docs]
* The documentation on the [Google Tag Manager custom template][gtm-template]
* The documentation on the [Analytics npm package][npm-package]

The [v2.15.0 release page][2.15.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please [raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.15.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.15.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[quickstart]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/web-quick-start-guide/
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker
[gtm-template]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/google-tag-manager-custom-template/
[npm-package]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/snowplow-plugin-for-analytics-npm-package/
