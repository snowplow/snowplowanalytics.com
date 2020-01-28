---
layout: post
title: "Snowplow JS Analytics SDK 0.3.0 released"
title-short: Snowplow JS Analytics SDK 0.3.0
tags: [snowplow, javascript, typescript, analytics, lambda, sdk, tracker]
author: Paul
category: Releases
permalink: /blog/2020/01/28/snowplow-js-analytics-sdk-0.3.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow Javascript and Typescript Analytics SDK][js-analytics-sdk]. [Version 0.3.0][0.3.0-tag] brings some major improvements to the build process, support for ECMAScript Modules and a couple of bug fixes!

The Snowplow Analytics SDKs provide the ability to work with Snowplow Enriched events. They are particularly well suited to use in AWS Lambdas or with Apache Spark. We currently offer the JavaScript and TypeScript SDK as well as Scala, Python and .NET Analytics SDKs. You can read more about the Analytics SDKs along with more use cases for them [here on our Wiki][docs].

We have to thank [Michael Dokolin][dokmic] for this huge contribution! All of the changes you see below have been done by Michael and we're extremely grateful for his hard work.

Read on below for:

1. [Support for ECMAScript Modules](#modules)
2. [Build Improvements](#build)
3. [Updates and bug fixes](#updates)
4. [Upgrading](#upgrade)
5. [Documentation and help](#doc)

<!--more-->

<h2 id="modules">1. Support for ECMAScript Modules</h2>

Due to the build improvements made in this release, we are now able to offer this SDK in both UMD and ES module formats. When installing the SDKs via NPM, you will now be able to utilise either version depending on your applications configuration. The two options are defined in [package.json][packagejson-module] so this will work automatically in your application after upgrading.

<h2 id="build">2. Build Improvements</h2>

To achieve support for ECMAScript Modules as well as improving the general development experience within this SDK, a number of updates have been made. This SDK has been migrated to [rollupjs][rollupjs] for module bundling as well as having eslint and prettier added. The full list of new improvements are:

- Upgrade development dependencies ([#23][23]).
- Migrate to rollup ([#22][22]).
- Migrate to the Airbnb style guide ([#21][21]).
- Add code linting as a build step ([#27][27]).
- Migrate to the automated builds ([#20][20]).
- Refactor unit-tests ([#28][28]).
- Remove non-LTS Node.js versions from Travis CI configuration ([#19][19]).
- Enable TypeScript strict mode ([#15][15]).
- Migrate to eslint ([#18][18]).
- Migrate to prettier ([#17][17]).

<h2 id="updates">3. Updates and bug fixes</h2>

In addition to the build updates, two outstanding issues have been solved:

- Add dashes support in the schema organization name ([#12][12]).
- Rename refr_device_tstamp to refr_dvce_tstamp ([#13][13]).

<h2 id="upgrade">4. Upgrading</h2>

The Snowplow JavaScript and TypeScript Analytics SDK is available on NPM and can be installed with NPM:

`npm install --save snowplow-analytics-sdk`

If you think you might be using an earlier version, you can check with:

`npm outdated`

If you are already using an earlier version, you can update your package.json to the latest version with:

`npm install --save snowplow-analytics-sdk@latest`

<h2 id="doc">5. Documentation and help</h2>

Check out the JavaScript and TypeScript Analytics SDK's documentation:

* The [setup guide][setup]
* The [API][api]
* The [Snowplow Analytics SDK documentation][docs]

The [v0.3.0 release page][0.3.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-analytics-sdk]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk
[0.3.0-tag]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/releases/tag/0.3.0
[packagejson-module]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/blob/master/package.json#L20
[rollupjs]: https://rollupjs.org/
[setup]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/tree/0.3.0#install
[api]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk#api
[issues]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK

[12]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/12
[13]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/13
[15]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/15
[17]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/17
[18]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/18
[19]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/19
[20]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/20
[21]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/21
[22]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/22
[23]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/23
[27]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/27
[28]: https://github.com/snowplow-incubator/snowplow-js-analytics-sdk/issues/28

[dokmic]: https://github.com/dokmic
