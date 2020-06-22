---
layout: post
title: "Snowplow Java Tracker 0.10.1 (and 0.10.0) released"
title-short: Snowplow Java Tracker 0.10.1
tags: [snowplow, java, tracker]
author: Paul Boocock
category: Releases
permalink: /blog/2020/06/22/snowplow-java-tracker-0.10.1-released/
discourse: false
---

We’re pleased to announce the newest release of our [Java Tracker](https://github.com/snowplow/snowplow-java-tracker). Versions 0.10.1 and 0.10.0 are now available. This release includes significant performance improvements, based on a fork provided to us by [bbplanon](https://github.com/snowplow/snowplow-java-tracker/issues/222).

Firstly, payloads can now be created asynchronously, and the tracker will no longer block the thread that calls the `track()` methods. We have also made it easier to set up and configure the tracker by creating a default HttpClientAdapter and adding support for Gradle Feature Variants to pull in optional dependencies. Lastly, there have been a number of version bumps to existing dependencies bringing the Java Tracker up to date as well as adding a Snyk.io integration to keep on top of security vulnerabilities in the future.

Read on below for:

1. [Considerable performance improvements](#performance)
2. [Removal of need to create a HttpClientAdapter](#httpclientadapter)
3. [Support for Gradle Feature Variants](#gradle)
4. [Dependency updates](#updates)
5. [Breaking changes](#changes)
6. [Upgrading](#upgrade)
7. [Documentation and help](#doc)

<!--more-->

<h2 id="performance">1. Considerable performance improvements</h2>

We have moved the payload construction into background threads, and considerably reduced the work done on the thread which calls the `Tracker.track()` method. Specifically, the number of threads can be controlled when creating the Emitter. On top of the `threadCount`, this creates an additional thread which is for the consumer of the buffer.

{% highlight java %}
```
Emitter batch = BatchEmitter.builder()
        .threadCount(20) // Default is 50
        .build();
```
{% endhighlight %}

More information on this can be found in the [Emitter documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/java-tracker/emitter/).

<h2 id="httpclientadapter">2. Removal of need to create a HttpClientAdapter</h2>

You no longer need to create a `HttpClientAdapter` and inject it into the Emitter when using the Emitter builders. By default, the Java Tracker will create a `OkHttpClientAdapter` with the default `OkHttpClient` parameters. Of course, you can still pass in an `OkHttpClientAdapter` or `ApacheHttpClientAdapter` with custom settings if you wish to.

{% highlight java %}
```
Emitter batch = BatchEmitter.builder()
        .httpClientAdapter( {{ An Adapter }} )
        .build();
```
{% endhighlight %}

<h2 id="gradle">3. Support for Gradle Feature Variants</h2>

The Java Tracker has two optional dependencies, depending on the `HttpClientAdapter` you wish to use. Previously, you would have needed to include the correct version of the `OkHttp` or `ApacheHttp` libraries. Whilst this is still the case when using Maven, we have leveraged the Feature Variants support in Gradle so you now only need to specify the feature you wish to use rather than the specific library.

<h3>OkHttp Support</h3>

{% highlight java %}
```
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.10.1'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.10.1') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-okhttp-support:0.10.1'
        }
    }
}
```
{% endhighlight %}

<h3>ApacheHttp Support</h3>

{% highlight java %}
```
dependencies {
    implementation 'com.snowplowanalytics:snowplow-java-tracker:0.10.1'
    implementation ('com.snowplowanalytics:snowplow-java-tracker:0.10.1') {
        capabilities {
            requireCapability 'com.snowplowanalytics:snowplow-java-tracker-apachehttp-support:0.10.1'
        }
    }
}
```
{% endhighlight %}

More information on the Gradle setup can be found in the [documentation](https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/java-tracker/setup/#Gradle). You can also read more about Gradle Feature Gradients [here](https://docs.gradle.org/6.5/userguide/feature_variants.html).

<h2 id="updates">4. Dependency updates</h2>

We have also bumped a number of dependencies in the Java Tracker in this release, bringing all of its dependencies up to date.

Specifically, we have updated the following libraries:
* Upgrade to Gradle 6 ([#236](https://github.com/snowplow/snowplow-java-tracker/issues/236))
* Bump org.apache.httpcomponents:httpasyncclient to 4.1.4 ([#249](https://github.com/snowplow/snowplow-java-tracker/issues/249))
* Bump org.apache.httpcomponents:httpclient to 4.5.12 ([#248](https://github.com/snowplow/snowplow-java-tracker/issues/248))
* Bump mockito-core to 3.3.3 ([#247](https://github.com/snowplow/snowplow-java-tracker/issues/247))
* Bump slf4j-api to 1.7.30 ([#246](https://github.com/snowplow/snowplow-java-tracker/issues/246))
* Bump commons-net to 3.6 ([#245](https://github.com/snowplow/snowplow-java-tracker/issues/245))
* Bump commons-codec to 1.14 ([#241](https://github.com/snowplow/snowplow-java-tracker/issues/241))
* Bump mockwebserver to 4.7.2 ([#239](https://github.com/snowplow/snowplow-java-tracker/issues/239))
* Bump guava to 29.0 ([#238](https://github.com/snowplow/snowplow-java-tracker/issues/238))
* Bump wiremock to 2.26.3 ([#237](https://github.com/snowplow/snowplow-java-tracker/issues/237))
* Bump jackson-databind to 2.11.0 ([#235](https://github.com/snowplow/snowplow-java-tracker/issues/235))

<h2 id="changes">5. Breaking changes</h2>

By updating the Java Tracker to handle sending events asynchronously, we have also introduced some breaking changes in this release. While these provide a cleaner API, they will cause compilation errors if you have instrumented a previous version.
1. The signature on the callback for `requestCallback` on the Emitter has changed, so events which have failed to send return the `Event` object rather than the internal `TrackerPayload`. This allows you to easily resend them using the usual `Tracker.track(Event)` method.
2. Given the above, we have removed `Tracker.track(TrackerPayload)` as you should never need to send the raw payload. If you do need to, you should rather extend `AbstractEvent`.
3. Tracker parameters are now immutable once the Tracker has been constructed. This means functions such as `Tracker.setNamespace()` no longer exist. To set these parameters, you can utilize the `TrackerBuilder`. This change has been made as Payloads are now constructed asynchronously, so changing the Tracker parameters after initial construction may lead to unexpected results.

<h2 id="upgrade">6. Upgrading</h2>

The tracker is available on [Snowplow's Bintray Maven Repository](https://bintray.com/snowplow/snowplow-maven/snowplow-java-tracker) and [jcenter](https://bintray.com/bintray/jcenter?filterByPkgName=snowplow-java-tracker).

To upgrade, alter the repository url in your project to `https://bintray.com/snowplow/snowplow-maven/` and change the version to `0.10.1`.
Further details and examples for Maven, Gradle and sbt can be found in our [setup guide](https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup#3-setup).

<h2 id="doc">7. Documentation and help</h2>

Check out the Java Tracker's documentation:

* The [setup guide](https://github.com/snowplow/snowplow/wiki/Java-Tracker-Setup)
* The [full API documentation](https://github.com/snowplow/snowplow/wiki/Java-Tracker)

The [v0.10.1](https://github.com/snowplow/snowplow-java-tracker/releases/tag/0.10.1) and [v0.10.0](https://github.com/snowplow/snowplow-java-tracker/releases/tag/0.10.0) release pages on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue](https://github.com/snowplow/snowplow-java-tracker/issues) or get in touch with us via [our Discourse forums](https://discourse.snowplowanalytics.com/).

