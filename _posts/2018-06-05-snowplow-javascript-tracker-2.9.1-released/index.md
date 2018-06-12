---
layout: post
title: Snowplow Javascript Tracker 2.9.1 released
title-short: Snowplow Javascript Tracker 2.9.1
tags: [snowplow, analytics, js, javascript, web]
author: Mike
category: Releases
permalink: /blog/2018/06/05/snowplow-javascript-tracker-2.9.1-released/
---

We are pleased to release version 2.9.1 of the [Snowplow Javascript Tracker][js-tracker]. This release fixes several bugs.

In the rest of this post we will cover:

1. [Bugfixes](#bugfixes)
2. [Upgrading](#upgrading)
3. [Getting help](#help)

<!--more-->

<h2><a name="bugfixes">1. Bugfixes</a></h2>

This release introduces support for passive event listeners for mouse wheel events, which may improve performance significantly.

Bugfixes include:

* Keep node type definitions at version 9.6.7 ([issue #649][649])
* Update page ping context on every call to trackPageView ([issue #612][612])
* Core: fix type incompatibility in consent methods ([issue #652][652])
* Added src/js/lib_managed to .gitignore ([issue #650][650])
* Use passive event listeners for mouse wheel event ([issue #478][478])
* Check if browser has full support of Performance Timing API ([issue #539][539])

Many thanks to [Todd Bluhm][toddbluhm] for contributing on [issue #612][612]!

<h2 id="upgrade">2. Upgrading</h2>

The tracker is available to use here:

```
http(s)://d1fc8wv8zag5ca.cloudfront.net/2.9.1/sp.js
```

As always, we encourage you to self-host your own copy of the tracker.

There are no breaking API changes introduced with this release.

<h2 id="doc">3. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.9.1 release page][2.9.1-tag] on GitHub has the full list of changes made
in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.9.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.9.1
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[toddbluhm]: https://github.com/toddbluhm
[649]: https://github.com/snowplow/snowplow-javascript-tracker/issues/649
[612]: https://github.com/snowplow/snowplow-javascript-tracker/issues/612
[652]: https://github.com/snowplow/snowplow-javascript-tracker/issues/652
[650]: https://github.com/snowplow/snowplow-javascript-tracker/issues/650
[478]: https://github.com/snowplow/snowplow-javascript-tracker/issues/478
[539]: https://github.com/snowplow/snowplow-javascript-tracker/issues/539