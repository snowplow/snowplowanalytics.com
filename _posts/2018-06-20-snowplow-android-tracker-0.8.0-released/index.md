---
layout: post
title: "Snowplow Android Tracker 0.8.0 released"
title-short: Snowplow Android Tracker 0.8.0
tags: [snowplow, android, lifecycle]
author: Mike
category: Releases
permalink: /blog/2018/06/20/snowplow-android-tracker-0.8.0-released/
discourse: true
---

We are pleased to announce a new release of the [Snowplow Android Tracker][repo].

[Version 0.8.0][release-notes] fixes a bug that stops Android lifecycle tracking whenever an activity is destroyed. The release also adds methods to set and view the custom contexts sent with lifecycle events.

Read on below the fold for:

1. [Adding contexts to the lifecycle tracking](#lifecycle-contexts)
2. [Fixing a bug in the lifecycle tracking](#lifecycle-bug)
3. [Documentation](#docs)
4. [Getting help](#help)

<!--more-->

<h2 id="lifecycle-contexts">1. Adding contexts to the lifecycle tracking</h2>

The new methods in the tracker are: `setLifecycleCustomContexts` and `getLifecycleCustomContexts`.

Here is an example of how `getLifecycleCustomContexts` can be used to add a new custom context to be sent with lifecycle events:

{% highlight java %}
// Create a Map of the data you want to include...
Map<String, String> dataMap = new HashMap<>();
dataMap.put("movie_name", "solaris");
dataMap.put("poster_country", "JP");
dataMap.put("poster_year", "1978");

// Now create your SelfDescribingJson object...
SelfDescribingJson context1 = new SelfDescribingJson("iglu:com.acme/movie_poster/jsonschema/2-1-1", dataMap);

// Now add this JSON into a list of SelfDescribingJsons...
List<SelfDescribingJson> contexts = tracker.getLifecycleCustomContexts();
contexts.add(context1);
{% endhighlight %}

<h2 id="lifecycle-bug">2. Fixing a bug in the lifecycle tracking</h2>

This release fixes a bug that stopped Android lifecycle tracking whenever an activity is destroyed, due to the LifecycleHandler callbacks being unregistered on activity destruction.

For more information on this, please see [issue #266][266].

<h2 id="docs">3. Documentation</h2>

You can find the updated [Android Tracker documentation][android-manual] on our wiki.

You can find the full release notes on GitHub as [Snowplow Android Tracker v0.8.0 release][release-notes].

<h2 id="help">4. Getting help</h2>

For help on integrating the tracker please have a look at the [setup][android-setup] and [integration][integration] guides.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse]. As always, do raise any bugs in the [Android Tracker's issues][android-issues] on GitHub.

For more details on this release, please check out the [release notes][release-notes] on GitHub.

[repo]: https://github.com/snowplow/snowplow-android-tracker
[release-notes]: https://github.com/snowplow/snowplow-android-tracker/releases/tag/0.8.0

[android-issues]: https://github.com/snowplow/snowplow-android-tracker/issues
[266]: https://github.com/snowplow/snowplow-android-tracker/issues/266

[android-setup]: https://github.com/snowplow/snowplow/wiki/Android-Tracker-Setup
[android-manual]: https://github.com/snowplow/snowplow/wiki/Android-Tracker

[demo-walkthrough]: https://github.com/snowplow/snowplow/wiki/Android-app-walkthrough#walkthrough
[integration]: https://github.com/snowplow/snowplow/wiki/Android-Integration
[testing]: https://github.com/snowplow/snowplow/wiki/Android-Testing-locally-and-Debugging

[discourse]: http://discourse.snowplowanalytics.com/
