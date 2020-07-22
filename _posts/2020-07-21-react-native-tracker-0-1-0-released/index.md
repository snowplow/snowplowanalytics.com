---
layout: post
title: "Snowplow React Native Tracker 0.1.0 released"
title-short: Snowplow React Native Tracker 0.1.0
tags: [snowplow, react-native, tracker]
author: Colm
category: Releases
permalink: /blog/2020/07/21/snowplow-react-native-tracker-0.1.0-released/
discourse: false
---

We are pleased to announce the first production-ready release of the [Snowplow React Native Tracker](https://github.com/snowplow-incubator/snowplow-react-native-tracker), version 0.1.0. The React Native tracker imports the native Snowplow iOS and Android trackers to React Native, as Native Modules. Much of the functionality of the native versions of the tracker is available.

Read on below for:

1. [Key features](#features)
2. [Quickstart guide](#quickstart)
3. [Feedback and next steps](#feedback)
4. [Changes since the alpha release](#alpha)
5. [Documentation](#documentation)
6. [Getting help](#help)

<!--more-->

<h2 id="features">1. Key features</h2>

This first production-ready release of the Snowplow React Native tracker has the following key features, closely in line with the existing functionality of our iOS and Android trackers:

- Automatic tracking: The tracker includes automatic tracking of the mobile context, screen context and session context, as well as installs and lifecycle events. All are configurable on tracker initialisation.

- Standard events: Screen View, Page View, and Structured events are available.

- Custom tracking: Custom Self-Describing events and contexts are available.

- Setting subject data: The subject can be set using the `setSubjectData()` method.


<h2 id="quickstart">2. Quickstart guide</h2>

To install the tracker: 

{% highlight console %}
npm install @snowplow/react-native-tracker
{% endhighlight %}

To initialize the tracker and track a screen view:

{% highlight javascript %}
import Tracker from '@snowplow/react-native-tracker';

initialize({
  endpoint: 'my-endpoint.com',
  namespace: 'namespace',
  appId: 'my-app-id'
});

trackScreenViewEvent({screenName: 'myScreenName'})
{% endhighlight %}

For a full list of all the tracker initialization options, including automatic sessionization and lifecycle events, please see the [Snowplow React Native Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/react-native-tracker/#configuration). 


<h2 id="feedback">3. Feedback and next steps</h2>

As this is an early release tracker, we welcome feedback and of course contributions! Please feel free to open topics with ideas in our [Discourse forum](https://discourse.snowplowanalytics.com/), and add issues and bug reports to the [repository](https://github.com/snowplow-incubator/snowplow-react-native-tracker/issues). 

For contributions, check out our guidelines [here](https://github.com/snowplow-incubator/snowplow-react-native-tracker/blob/master/CONTRIBUTING.md). Our next release will likely focus on additional testing capabilities over new features, however important contributions, especially bugfixes, will be prioritised. If in doubt, open an issue or a discourse post to ask about your contribution.

<h2 id="alpha">4. Changes since the alpha release</h2>

We released an initial alpha version of this tracker back in August 2019, and with the help from our customers and community (providing their feedback, issues and contributions) have not only improved the alpha since then, but have now been able to release this production-ready version. We look forward to continued customer and community engagement on this tracker, see the previous section on feedback and next steps for more information on how to get involved!

Version 0.1.0 contains some breaking changes compared to the alpha release, specifically:

- All track methods now take only two arguments: a JSON of key-value pairs, and an optional array of context SD-JSONs.

- Several parameters of the `initialize()` method have been renamed to avoid the prefix `‘set’`. This is an established convention in the native trackers and normally indicates a standalone method rather than a configuration option.

- The defaults for `initialize()` parameters have changed to reflect the minimal recommended configuration.

- The `autoScreenView` option has been removed from the `initialize()` method. This feature was experimental and does not behave consistently. We are keen to scope out how to instrument this kind of feature in a way that is more React Native friendly. Ideas are welcome - feel free to open a discourse topic on the subject.

- Parameters have been removed from the `trackScreenView()` method. Specifically, the option to manually set the screen ID and previous screen information have been removed. These are automatically managed internally by the tracker, and manually setting them can lead to inconsistent behaviour.

<h2 id="documentation">5. Documentation</h2>

As always, information about how to use the tracker can be found in the [React Native Tracker documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/react-native-tracker/). 

You can find the full CHANGELOG on GitHub as [Snowplow React Native Tracker CHANGELOG](https://github.com/snowplow-incubator/snowplow-react-native-tracker/blob/master/CHANGELOG).

<h2 id="help">6. Getting help</h2>

If you have any questions or run into any problems, please visit our [Discourse forum](https://discourse.snowplowanalytics.com/). Please raise any bugs in the [React Native Tracker’s issues](https://github.com/snowplow-incubator/snowplow-react-native-tracker/issues) on GitHub.
