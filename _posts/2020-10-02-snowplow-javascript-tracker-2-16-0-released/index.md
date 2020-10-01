---
layout: post
title: "Snowplow JavaScript Tracker 2.16.0 released"
title-short: Snowplow JavaScript Tracker 2.16.0
tags: [snowplow, javascript, tracker]
author: Paul
category: Releases
permalink: /blog/2020/10/02/snowplow-javascript-tracker-2.16.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker].

[Version 2.16.0][2.16.0-tag] comes with a 30% file size reduction as we improve our build tooling in preparation for the upcoming major release v3.0.0. Specifically, v2.15.0 was 111KB (34KB when gzipped). The new v2.16.0 is a much improved 77KB (27KB when gzipped) while maintaining exactly the same functionality.

Read on below for:

1. [Switching build tooling](#1-switching-build-tooling)
2. [Other features and bug fixes](#2-other-features-and-bugfixes)
3. [Upgrading](#3-upgrading)
4. [Documentation and help](#4-documentation-and-help)

<!--more-->

## 1. Switching build tooling

As originally suggested by `bernardosrulzon`, we have switched to using the Closure Compiler ([GitHub issue #583](https://github.com/snowplow/snowplow-javascript-tracker/issues/583)). We have also switched to using rollup.js and gulp ([GitHub issue #752](https://github.com/snowplow/snowplow-javascript-tracker/issues/752)). Together, these two updates reduce the `sp.js` filesize by 30%. 

## 2. Other features and bug fixes

This tracker also comes with a few other under the hood improvements:

* Switch to Github Actions ([GitHub issue #844](https://github.com/snowplow/snowplow-javascript-tracker/issues/844))
* Add license banner to rollup builds ([GitHub issue #845](https://github.com/snowplow/snowplow-javascript-tracker/issues/845))
* Bump snowplow-tracker-core to 0.9.2 ([GitHub issue #841](https://github.com/snowplow/snowplow-javascript-tracker/issues/841))
* Update Snowplow Micro to v1 ([GitHub issue #837](https://github.com/snowplow/snowplow-javascript-tracker/issues/837))

## 3. Upgrading

The tracker is available as a published asset in the [2.16.0 Github release][2.16.0-tag]:

To upgrade, Snowplow Insights and Open Source users should host the 2.16.0 version of `sp.js` asset on a CDN, and load the tracker from there.

## 4. Documentation and help

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [quickstart guide][quickstart]
* The [full API documentation][docs]
* The documentation on the [Google Tag Manager custom template][gtm-template]
* The documentation on the [Analytics npm package][npm-package]

The [v2.16.0 release page][2.16.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please [raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.16.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.16.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[quickstart]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/web-quick-start-guide/
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker
[gtm-template]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/google-tag-manager-custom-template/
[npm-package]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/snowplow-plugin-for-analytics-npm-package/
