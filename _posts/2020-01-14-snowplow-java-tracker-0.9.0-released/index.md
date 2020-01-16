---
layout: post
title: "Snowplow Java Tracker 0.9.0 released"
title-short: Snowplow Java Tracker 0.9.0
tags: [snowplow, java, tracker]
author: Paul
category: Releases
permalink: /blog/2020/01/14/snowplow-java-tracker-0.9.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow Java Tracker][java-tracker]. [Version 0.9.0][0.9.0-tag] brings some important updates including bumping OkHttp to OkHttp3 version 4 and improving support for a number of Snowplow event timestamps. We’ve also made improvements to the logging within the tracker and fixed a couple of outstanding bugs.

NB. With this release we’ve also moved to publishing our releases on Bintray ([snowplow-maven][bintray] or [jcenter][jcenter]). This will require updating the repository in your build configuration to get the latest releases. See the [Upgrading](#upgrade) section for more information.

Read on below the fold for:

1. [Support for further timestamp properties](#timestamps)
2. [Update OkHttp to OkHttp3 Version 4](#okhttp)
3. [Updates and bug fixes](#updates)
4. [Upgrading](#upgrade)
5. [Documentation and help](#doc)

<!--more-->

<h2 id="timestamps">1. Support for further timestamp properties</h2>

The Java Tracker now supports True Timestamp(ttm) ([#178][178]) and Device Sent Timestamp(stm) ([#169][169]) from the [Snowplow Tracker Protocol][snowplow-tracker-protocol].

The True Timestamp can be set when building an event:

{% highlight java %}
t1.track(PageView.builder().( ... ).trueTimestamp(1423583655000).build());
{% endhighlight %}

With this change, the previous `timestamp(long timestamp)` method which set the Device Created Timestamp has been deprecated in favour of `deviceCreatedTimestamp(long timestamp)` and `trueTimestamp(long timestamp)` methods.

Device Sent Timestamp will be automatically attached to each event that is sent using the Java Tracker.

<h2 id="okhttp">2. Update OkHttp to OkHttp3 Version 4</h2>

The previous version of the Java Tracker offered the capability to send events using the OkHttp library. As of 0.9.0 we have upgraded OkHttp to Version 4 of OkHttp3 ([#175][175]), which is the current version of the OkHttp3 library. This brings a number of improvements, particularly around security, that are described on the [okhttp site][okhttp-site].

Updating to OkHttp3 increases the Java minimum supported version to Java 8+. In addition, when creating the OkHttpClientAdapter there are some small differences to previous versions. To create the OkHttpClientAdapter with version 0.9.0 of the Java Tracker you are required to initialise it with an OkHttp3.OkHttpClient, such as below:

{% highlight javascript %}
import okhttp3.OkHttpClient;

...

// Make a new client
OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(5, TimeUnit.SECONDS)
      .readTimeout(5, TimeUnit.SECONDS)
      .writeTimeout(5, TimeUnit.SECONDS)
      .build();

// Build the adapter
HttpClientAdapter adapter = OkHttpClientAdapter.builder()
      .url("http://www.acme.com")
      .httpClient(client)
      .build();
{% endhighlight %}

<h2 id="updates">3. Updates and bug fixes</h2>

A big thank you to our community for the following contribution:

- [@gaelrenoux][gaelrenoux]: Add support for attaching true timestamp to events ([#178][178])

Other updates and bugfixes include:

- Update all non-static Loggers to static ([#213][213])
- Fix events sent by example simple-console ([#221][221])
- Alter logging for invalid keys only when adding to TrackerPayload ([#186][186])
- Fix Peru version so vagrant up succeeds ([#216][216])
- Fix Javadoc generation warnings ([#219][219])

<h2 id="upgrade">4. Upgrading</h2>

The tracker is available on [Snowplow's Bintray Maven Repository][bintray] and [jcenter][jcenter].

To upgrade, alter the repository url in your project to `https://bintray.com/snowplow/snowplow-maven/` and change the version to `0.9.0`.
Further details and examples for Maven, Gradle and sbt can be found in our [setup guide][setup-hosting].

This update increases the Java minimum supported version to Java 8+.

The upgrade to OkHttp3 in this release will break implementations that are upgrading from earlier releases. You will need to initialise an OkHttp3Client when creating an OkHttpClientAdapter. An example of this can be found [here][okhttp3client].

<h2 id="doc">5. Documentation and help</h2>

Check out the Java Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v0.9.0 release page][0.9.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[java-tracker]: https://github.com/snowplow/snowplow-java-tracker
[0.9.0-tag]: https://github.com/snowplow/snowplow-java-tracker/releases/tag/0.9.0
[setup]: https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup
[issues]: https://github.com/snowplow/snowplow-java-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/Java-Tracker
[snowplow-tracker-protocol]: https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol
[okhttp3client]: https://github.com/snowplow/snowplow/wiki/Java-Tracker#ok-http-adapter
[bintray]: https://bintray.com/snowplow/snowplow-maven/snowplow-java-tracker
[jcenter]: https://bintray.com/bintray/jcenter?filterByPkgName=snowplow-java-tracker
[setup-hosting]: https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup#3-setup
[okhttp-site]: https://square.github.io/okhttp/

[175]: https://github.com/snowplow/snowplow-java-tracker/issues/175
[169]: https://github.com/snowplow/snowplow-java-tracker/issues/169
[178]: https://github.com/snowplow/snowplow-java-tracker/issues/178
[213]: https://github.com/snowplow/snowplow-java-tracker/issues/213
[221]: https://github.com/snowplow/snowplow-java-tracker/issues/221
[186]: https://github.com/snowplow/snowplow-java-tracker/issues/186
[216]: https://github.com/snowplow/snowplow-java-tracker/issues/216
[219]: https://github.com/snowplow/snowplow-java-tracker/issues/219

[gaelrenoux]: https://github.com/gaelrenoux
