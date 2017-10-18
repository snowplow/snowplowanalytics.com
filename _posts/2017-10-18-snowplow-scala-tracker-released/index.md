---
layout: post
title: "Snowplow Scala Tracker released"
title-short: Snowplow Scala tracker
tags: [snowplow, scala, trackers]
author: Anton
category: Releases
permalink: /blog/2017/10/18/snowplow-scala-tracker-released/
---

We are delighted to release version 0.4.0 of the [Snowplow Scala Tracker][scala-tracker], for tracking events from your Scala apps and services.

This refreshment release adds Scala 2.12 support, significantly improves performance and completely removes the outdated Akka and Spray dependencies.

<!--more-->

Read on for:

1. [Performance improvements](#performance)
2. [Removal of Spray and Akka dependencies](#akka)
3. [Scala 2.12](#scala-212)
4. [Contributing](#contributing)

<h2 id="performance">1. Performance improvements</h2>

Historically, we have used the Snowplow Scala Tracker primarily for telemetry in our own applications and libraries, with few concerns about high performance and multi-threading environments. However, as Scala grows in popularity, we are seeing the Scala Tracker used in increasingly demanding high-load and parallel environments. This 0.4.0 release makes various improvements to the tracker to ready it for such use cases.

As first step, we removed all calls that potentially can block a thread inside the tracker's asynchronous emitter.
We left optional blocking calls that are explicitly marked as blocking.

Also, it is now possible for users to pass their own `ExecutionContext` to asynchronous emitters. With an explicit execution context, aka thread pool, it is possible to control the level of concurrency and indeed thread resourcing.

The custom execution context requires a slight API change. For example, to reproduce the default behavior of previous versions and use the global execution context, you now need to bring it into implicit scope:

{% highlight scala %}
// Or other available execution context
import scala.concurrent.ExecutionContext.Implicits.global

// ExecutionContext will be passed as implicit value
com.snowplowanalytics.snowplow.scalatracker.emitters.AsyncEmitter.createAndStart("collector.acme.com")
{% endhighlight %}

<h2 id="akka">2. Removal of Spray and Akka dependencies</h2>

As part of this release we have removed Spray and Akka for event sending over HTTP(S), replacing it with the much simpler [scalaj-http][scalaj-http].

Akka caused us a few headaches. First of all, Akka imposed a notable startup time on any app using the Scala Tracker; we also saw some issues (such as unexplained hangs) around the shutdown of the tracker's Akka actor system when the host app exited.

Secondly, bundling Spray and Akka with our tracker caused a lot of dependency conflicts with users' own apps. Spray and particularly Akka are very common project dependencies in Scala projects, and it was easy for our chosen version of Akka to conflict with the project's existing version, blocking the tracker's integration.

Finally, we encountered some significant performance issues using Spray and Akka. According to our benchmark, switching to scalaj-http has driven a performance improvement of up to 10x, when the tracker object is used from a single thread.

With Spray and Akka gone, the Scala Tracker now has only two transitive dependencies: [json4s][json4s] and [scalaj-http][scalaj-http].

<h2 id="scala-212">3. Scala 2.12</h2>

Another big update for tracker is its availability for Scala 2.12.

As of this release, the Snowplow Scala Tracker is now available for all three major Scala versions: 2.10, 2.11 and 2.12.
Unfortunately, supporting Scala 2.12 required us to drop Java 7 support and target at least JRE8.

<h2 id="contributing">4. Contributing</h2>

Please check out the [repository][repo] and the [open issues][issues] if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[scala-tracker]: https://github.com/snowplow/snowplow-scala-tracker
[repo]: https://github.com/snowplow/snowplow-scala-tracker
[release-1]: https://github.com/snowplow/snowplow-docker/releases/tag/r1

[issues]: https://github.com/snowplow/snowplow-scala-tracker/issues

[discourse]: http://discourse.snowplowanalytics.com/

[json4s]: https://github.com/json4s/json4s
[scalaj-http]: https://github.com/scalaj/scalaj-http
