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

[Version 0.4.0](https://github.com/snowplow/snowplow-nodejs-tracker/releases/tag/0.4.0) significantly improves the developer experience through various updates and XXX. It also adds support for the `dvce_sent_tstamp` as well as the setting of the `domain_userid` and the `network_userid` (Snowplow's client- and server-side cookie IDs). Finally, it switches the `emitter` from 'request' to 'got' alongside a bugfix. All of these updates mean there are two breaking API changes:

* The `emitter` has been replaced with the `gotEmitter`, which continues to offer the same functionality but also includes a number of new features.
* If you are using `trackEcommerceTransaction` and passing in an array of items, you should now switch to using `trackEcommerceTransactionWithItems`.

Read on below for more detail on:

1. [Improving the developer experience](#dev-experience)
2. [Adding the domain_userid and the network_userid](#add-ids)
3. [Support for the dvce_sent_tstamp](#support-dvce-tstamp)
4. [Switching to the got Emitter](#got-emitter)
5. [Breaking changes](#breaking-changes)
6. [Bug fixes](#bugfixes)
7. [Installation and upgrading](#upgrading)
8. [Documentation and help](#documentation-and-help)

<!--more-->

<h2 id="add-ids">1. Improving the developer experience</h2>

NodeJS tracker v0.4.0 improves the developer experience when using the NodeJS tracker and Snowplow Tracker Core functions in both JavaScript and TypeScript applications. Specifically, the following updates have been made:

* Bump `snowplow-tracker-core` to 0.9.1 ([GitHub issue #58](https://github.com/snowplow/snowplow-nodejs-tracker/issues/58))
* Switch to RollupJS for building ES Module and CJS versions ([GitHub issue #57](https://github.com/snowplow/snowplow-nodejs-tracker/issues/57))
* Add Typescript support ([GitHub issue #13](https://github.com/snowplow/snowplow-nodejs-tracker/issues/13))

The [types are bundled](https://github.com/snowplow/snowplow-nodejs-tracker/blob/master/package.json#L6) into the module available on NPM, so they should be available to you immediately.


<h2 id="add-ids">2. Adding the domain_userid and the network_userid</h2>

You are now able to set the `domain_userid` and the `network_userid` in the NodeJS tracker (GitHub issues [#23](https://github.com/snowplow/snowplow-nodejs-tracker/issues/23) and [#24](https://github.com/snowplow/snowplow-nodejs-tracker/issues/24)).

The `domain_userid` is Snowplow's first party client side cookie ID. The `network_userid` is Snowplow's server side cookie ID, and can be first or third party depending on how you [configure your collector](https://snowplowanalytics.com/blog/2020/09/07/pipeline-configuration-for-complete-and-accurate-data/). More information on the Snowplow cookie IDs can be found in the [technical documentation](https://github.com/snowplow/snowplow/wiki/Javascript-Tracker-Cookies-and-Local-Storage).

The methods are as follows:

```
setDomainUserId();
setNetworkUserId();
```

Examples of how to use these can be found in the [NodeJS tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/configuration/#set-domain-user-id).


<h2 id="support-dvce-tstamp">3. Support for the dvce_sent_tstamp</h2>

The NodeJS tracker now also supports the `dvce_sent_tstamp` ([GitHub issue #27](https://github.com/snowplow/snowplow-nodejs-tracker/issues/27)). This timestamp most precisely captures when the event occured on the device, and is used to calculate the `derived_tstamp` as follows:

```
derived_tstamp = collector_tstamp - (dvce_sent_tstamp - dvce_created_tstamp)
```

Specifically, the `derived_tstamp` adjusts the `dvce_sent_tstamp` using the `collector_tstamp` to account for inaccurate device clocks. We recommend this is the timestamp you use in your analysis.


<h2 id="got-emitter">4. Switching to the got Emitter</h2>

This tracker version switches from using the deprecated 'request' library to the 'got' library ([GitHub issue #61](https://github.com/snowplow/snowplow-nodejs-tracker/issues/61)) for the emitter. This change comes with some additional emitter configuration options which you can find in the [NodeJS tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/initialization/#configure-emitter).

Please note that `got` only works on NodeJS applications and does not have browser support. If the `got` library isn’t suitable for your project you can create your own emitter. For moe information, please take a look at the documentation for [creating your own emitter](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/initialization/#create-your-own-emitter).


<h2 id="breaking-changes">5. Breaking changes</h2>

Version 0.4.0 has the following breaking API changes:

* `emitter` is no longer available. You should switch from `emitter` to `gotEmitter` which continues to offer the same functionality but also includes a number of new features. For more information, please take a look at the [gotEmitter documentation](https://snowplow.github.io/snowplow-nodejs-tracker/modules/_got_emitter_.html).
* If you are using `trackEcommerceTransaction` and passing in an array of items, you should now switch to using `trackEcommerceTransactionWithItems`. For more information, please take a look at the [technical documentation](https://snowplow.github.io/snowplow-nodejs-tracker/interfaces/_tracker_.tracker.html#trackecommercetransactionwithitems).


<h2 id="bugfixes">6. Bug fixes</h2>

* Update flush to not send a request if the buffer is empty ([GitHub issue #53](https://github.com/snowplow/snowplow-nodejs-tracker/issues/53))


<h2 id="upgrading">7. Installation and upgrading</h2>

You can install the Snowplow Node.js Tracker with NPM or Yarn:

```
npm install snowplow-tracker
```

or

```
yarn add snowplow-tracker
```

If you are already using the snowplow-tracker library, and wish to upgrade, then as this is a pre-1.0.0 release you will need to force installation to the latest or specific version rather than using npm update.

```
npm install snowplow-tracker@latest
```

To help with installation and/or upgrading, new API Documentation is also now available from this release [here](https://snowplow.github.io/snowplow-nodejs-tracker/). 


<h2 id="documentation-and-help">8. Documentation and help</h2>

For help on integrating the tracker please have a look at the [setup guide](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/setup/). Information about how to use the tracker can be found in the [NodeJS Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/node-js-tracker/node-js-tracker-0-4-0/). If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). 

You can find the full release notes on GitHub as [Snowplow NodeJS Tracker v0.4.0 release](https://github.com/snowplow/snowplow-nodejs-tracker/releases/tag/0.4.0).

Please raise any bugs in the [NodeJS Tracker’s issues](https://github.com/snowplow/snowplow-nodejs-tracker/issues) on GitHub.
