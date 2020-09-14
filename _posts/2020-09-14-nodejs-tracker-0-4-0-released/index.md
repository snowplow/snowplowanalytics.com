---
layout: post
title: "Snowplow NodeJS Tracker 0.4.0 released"
title-short: Snowplow NodeJs Tracker 0.4.0
tags: [snowplow, nodejs, tracker]
author: Paul
category: Releases
permalink: /blog/2020/09/14/snowplow-nodejs-tracker-0.4.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow NodeJS Tracker](https://github.com/snowplow/snowplow-nodejs-tracker).

[Version 0.4.0](https://github.com/snowplow/snowplow-nodejs-tracker/releases/tag/0.4.0) adds support for the `dvce_created_tstamp` as well as the setting of the `domain_userid` and the `network_userid` (Snowplow's client- and server-side cookie IDs). It also switches the `emitter` from 'request' to 'got', bumps the `snowplow-tracker-core` library and adds TypeScript support alongside further under the hood improvements and bugfixes. All of these updates mean there are two breaking API changes:

* The `emitter` has been replaced with the `gotEmitter`, which continues to offer the same functionality but also includes a number of new features.
* If you are using `trackEcommerceTransaction` and passing in an array of items, you should now switch to using `trackEcommerceTransactionWithItems`.

Read on below for more detail on:

1. [Adding the domain_userid and the network_userid](#add-ids)
2. [Support for the dvce_created_tstamp](#support-dvce-tstamp)
3. [Switching to the got Emitter](#got-emitter)
4. [Breaking changes](#breaking-changes)
5. [Other features and bug fixes](#features-and-bugfixes)
6. [Documentation and help](#documentation-and-help)

<!--more-->

<h2 id="add-ids">1. Adding the domain_userid and the network_userid</h2>

You are now able to set the `domain_userid` and the `network_userid` in the NodeJS tracker (GitHub issues [#23](https://github.com/snowplow/snowplow-nodejs-tracker/issues/23) and [#24](https://github.com/snowplow/snowplow-nodejs-tracker/issues/24)).

The `domain_userid` is Snowplow's first party client side cookie ID. The `network_userid` is Snowplow's server side cookie ID, and can be first or third party depending on how you [configure your collector](https://snowplowanalytics.com/blog/2020/09/07/pipeline-configuration-for-complete-and-accurate-data/). More information on the Snowplow cookie IDs can be found in the [technical documentation](https://github.com/snowplow/snowplow/wiki/Javascript-Tracker-Cookies-and-Local-Storage).

The methods are as follows:

```
setDomainUserId();
setNetworkUserId();
```

Examples of how to use these can be found in the [NodeJS tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/configuration/#set-domain-user-id).


<h2 id="support-dvce-tstamp">2. Support for the dvce_created_tstamp</h2>

The NodeJS tracker now also supports the `dvce_created_tstamp` ([GitHub issue #27](https://github.com/snowplow/snowplow-nodejs-tracker/issues/27)). This timestamp most precisely captures when the event occured on the device, and is used to calculate the `derived_tstamp` as follows:

```
derived_tstamp = collector_tstamp - (dvce_sent_tstamp - dvce_created_tstamp)
```

Specifically, the `derived_tstamp` adjusts the `dvce_created_tstamp` using the `collector_tstamp` to account for inaccurate device clocks. We recommend this is the timestamp you use in your analysis.


<h2 id="got-emitter">3. Switching to the got Emitter</h2>

This tracker version switches from using the deprecated 'request' library to the 'got' library ([GitHub issue #61](https://github.com/snowplow/snowplow-nodejs-tracker/issues/61)) for the emitter. This change comes with some additional emitter configuration options which you can find in the [NodeJS tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/initialization/#configure-emitter).

Please note that `got` only works on NodeJS applications and does not have browser support. If the `got` library isn’t suitable for your project you can create your own emitter. For moe information, please take a look at the documentation for [creating your own emitter](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/initialization/#create-your-own-emitter).


<h2 id="breaking-changes">4. Breaking changes</h2>

Version 0.4.0 has the following breaking API changes:

* `emitter` is no longer available. You should switch from `emitter` to `gotEmitter` which continues to offer the same functionality but also includes a number of new features. For more information, please take a look at the [gotEmitter documentation](https://snowplow.github.io/snowplow-nodejs-tracker/modules/_got_emitter_.html).
* If you are using `trackEcommerceTransaction` and passing in an array of items, you should now switch to using `trackEcommerceTransactionWithItems`. For more information, please take a look at the [technical documentation](https://snowplow.github.io/snowplow-nodejs-tracker/interfaces/_tracker_.tracker.html#trackecommercetransactionwithitems).


<h2 id="features-and-bugfixes">5. Other features and bug fixes</h2>

__Improvements__
* Bump snowplow-tracker-core to 0.9.1 ([GitHub issue #58](https://github.com/snowplow/snowplow-nodejs-tracker/issues/58))
* Add Typescript support ([GitHub issue #13](https://github.com/snowplow/snowplow-nodejs-tracker/issues/13))
* Switch to RollupJS for building ES Module and CJS versions ([GitHub issue #57](https://github.com/snowplow/snowplow-nodejs-tracker/issues/57))

__Bug Fixes__
* Update flush to not send a request if the buffer is empty ([GitHub issue #53](https://github.com/snowplow/snowplow-nodejs-tracker/issues/53))


<h2 id="documentation-and-help">6. Documentation and help</h2>

For help on integrating the tracker please have a look at the [setup guide](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/setup/). Information about how to use the tracker can be found in the [NodeJS Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/). If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). 

You can find the full release notes on GitHub as [Snowplow NodeJS Tracker v0.4.0 release](https://github.com/snowplow/snowplow-nodejs-tracker/releases/tag/0.4.0).

Please raise any bugs in the [NodeJS Tracker’s issues](https://github.com/snowplow/snowplow-nodejs-tracker/issues) on GitHub.
