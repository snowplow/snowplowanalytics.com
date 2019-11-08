---
layout: post
title: "Snowplow JavaScript Tracker 2.12.0 released"
title-short: Snowplow JavaScript Tracker 2.12.0
tags: [snowplow, javascript, micro, tracker]
author: Paul
category: Releases
permalink: /blog/2019/11/07/snowplow-javascript-tracker-2.12.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker]. [Version 2.12.0][2.12.0-tag] introduces a brand new test suite powered by Snowplow Micro, giving us even more confidence as we continue to release updates to the Snowplow JavaScript Tracker and serving as an example of how Snowplow Micro can be integrated into a testing environment.

NB. This release continues with the change we introduced with v2.11.0 to how assets are hosted - rather than hosting the tracker on CloudFront, we now publish the asset to the GitHub release. Users who have previously relied on the CloudFront hosted asset must host the tracker on their own CDN, as is recommended practice. More detail can be found in our [v2.11.0 release post][js-tracker-2.11.0-post].

Read on below the fold for:

1. [New test suite powered by Snowplow Micro](#micro-tests)
2. [Local Storage improvements](#local-storage)
3. [Updates and bug fixes](#updates)
4. [Upgrading](#upgrade)
5. [Documentation and help](#doc)

<!--more-->

<h2 id="micro-tests">1. New test suite powered by Snowplow Micro</h2>

This release introduces a new test suite into the Snowplow JavaScript Tracker which is powered by Snowplow Micro. The new tests will automatically fail a build if a test fails, this allows us to prevent builds of the JavaScript Tracker from being published if any test from the test suite fails.

Snowplow Micro is a very small Snowplow Pipeline which can be initialised before running tests and then used to validate that data collection has occurred correctly. You can read more about Snowplow Micro in our earlier [blog post][snowplow-micro-post].

In version 2.12.0 we have leveraged the capabilities of Snowplow Micro to build our own test suite which allows us to verify that the latest release of the Snowplow JavaScript Tracker is behaving as we expect. This gives us increased confidence in future releases of the Snowplow JavaScript Tracker.

Not only that, as we recommend using Snowplow Micro to build your own test suite, this release is a an example of how to include Snowplow Micro as one part of your testing strategy. The code changes that power our new test suite can be found [here][js-tracker-tests] and will hopefully prove to be inspiration for your own Snowplow Micro powered test suite!

<h2 id="local-storage">2. Local Storage improvements</h2>

In this release we also focused on ensuring our use of Local Storage is robust and as reliable as our cookie storage strategy. With that in mind, we have fixed two issues that have affected use of Local Storage.

1. When using the `localStorage` option of `stateStorageStrategy`, any state that was stored had no expiration time. Unlike Cookie storage which have expiry dates built in, Local Storage has no such mechanism. This effected functionality that incremented session counters, as the stored session id never expired when using Local Storage. This has now been solved by implementing expiration functionality on our local storage entries (Github [#718][718]). You can read more about the stateStorageStrategy options in our [docs][stateStorageStrategy-docs]

2. We also fixed an issue in the local storage queue that the Snowplow JavaScript Tracker utilises to cache events before they are sent to the collector in a batch or to be queued if the event fails to send (for example, due to connectivity issues). Before this release, there was no upper limit on the size of the queue and this could impact the performance of the web application if it also relies on Local Storage. Most browsers only allow 5MB of Local Storage per site, so allowing control of limiting the Snowplow JavaScript Tracker use of local storage allows web developers to better decide how they wish to utilise their Local Storage limits (Github [#764][764]).

    NB. In the event the queue becomes full (due to connectivity issues, ad blockers or collector outages) events will be dropped. This is a change in behvaiour from previous releases, which would have only dropped events when Local Storage was full for a site, however we expect with the default value of 1000 that dropped events are unlikely to occur.

The default limit is set to 1000 events in the queue, but it can be configured with the `maxLocalStorageQueueSize` argument when initialising the tracker. This functionality can be disabled by setting the `maxLocalStorageQueueSize` to `0`, however this is not recommended if the site containing the Snowplow JavaScript Tracker also relies on Local Storage.

It can be changed at initialisation as follows:

{% highlight javascript %}
snowplow("newTracker", "sp", "<collector-url>", {
    appId: "<app-id>",
    eventMethod: "post",
    maxLocalStorageQueueSize: 500,
    contexts: {
        webPage: true,
        performanceTiming: true
    }
});
{% endhighlight %}

<h2 id="updates">3. Updates and bug fixes</h2>

A big thank you to our community for the following contributions:

- [@jethron][jethron]: Fix OptimizelyX context collecting ([#730][730])
- [@miike][miike]: Core: Add function to allow setting Useragent ([#744][744])
- [@max-tgam][max-tgam]: Fix dynamic context callbacks sometimes returning null ([#743][743])

Other updates and bugfixes include:

- Update packages and test harness ([#756][756])
- Fix osx+safari testing setup issues ([#760][760])

<h2 id="upgrade">4. Upgrading</h2>

The tracker is available as a published asset in the [2.12.0 Github release][2.12.0-tag]:

To upgrade, host the `sp.js` asset in a CDN, and call the tracker from there.

There are no breaking API changes introduced with this release.

<h2 id="doc">5. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.12.0 release page][2.12.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].


[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[js-tracker-tests]: https://github.com/snowplow/snowplow-javascript-tracker/tree/master/tests
[2.12.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.12.0
[js-tracker-2.11.0-post]: /blog/2019/09/13/snowplow-javascript-tracker-2.11.0-released-with-gdpr-context/#deployment
[snowplow-micro-post]: /blog/2019/07/17/introducing-snowplow-micro/
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker
[max-local-storage-docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#localStorageQueueSize
[stateStorageStrategy-docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#2214-configuring-the-storage-strategy

[755]: https://github.com/snowplow/snowplow-javascript-tracker/issues/755
[718]: https://github.com/snowplow/snowplow-javascript-tracker/issues/718
[764]: https://github.com/snowplow/snowplow-javascript-tracker/issues/764
[744]: https://github.com/snowplow/snowplow-javascript-tracker/issues/744
[730]: https://github.com/snowplow/snowplow-javascript-tracker/issues/730
[760]: https://github.com/snowplow/snowplow-javascript-tracker/issues/760
[743]: https://github.com/snowplow/snowplow-javascript-tracker/issues/743
[756]: https://github.com/snowplow/snowplow-javascript-tracker/issues/756

[max-tgam]: https://github.com/max-tgam
[jethron]: https://github.com/jethron
[miike]: https://github.com/miike
