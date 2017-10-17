---
layout: post
title: "Snowplow Scala Tracker released"
title-short: Snowplow Scala tracker
tags: [snowplow, scala, trackers]
author: Anton
category: Releases
permalink: /blog/2017/10/17/snowplow-scala-tracker-released/
---

We are delighted to release version 0.4.0 of the [Snowplow Scala Tracker][scala-tracker], for tracking events from your Scala apps and services. 
This refreshment release adds Scala 2.12 support, significantly improves performance and completely removes outdated Akka and Spray dependencies.

<!--more-->

Read on for:

1. [Performance improvements](#performance)
2. [Scala 2.12 and dependency cleanup](#scala-212)
5. [Contributing](#contributing)

<h2 id="performance">1. Performance improvements</h2>

Historically, Snowplow Scala Tracker was used primairly in our own applications and libraries, where we were not particularly concerned about high performance and multithreading environment.
However, as Scala becomes more mainstream language and more users want to use it as main language, Scala tracker meets new requirements, including best practices for high-load and parallel applications.
In 0.4.0 release we made several changes making Scala tracker obey these requirements.

As first step, we removed all calls that potentially can block a thread inside asynchronous emitters.
Blocking calls now remain only in places, that are explicitly marked as blocking.

Also it is now possible for users to pass their own `ExecutionContext` to asynchronous emitters. 
With explicit execution context (aka thread pool) it is possible to take control over level of concurrency and such valueable resource as threads.
Custom execution context requires from users slight API change. For example, to use async emitters with global execution context (as it was in previous version) you just need to bring it into implicit scope:

{% highlight bash %}
// Or other available execution context
import scala.concurrent.ExecutionContext.Implicits.global

// ExecutionContext will be passed as implicit value
com.snowplowanalytics.snowplow.scalatracker.emitters.AsyncEmitter.createAndStart("collector.acme.com")
{% endhighlight %}

And last - as part of dependency cleanup we removed Akka dependency, which has notable startup time delay for any app used Scala tracker.

According to our benchmark, above changes allowed Scala tracker to improve performance up to 10 times when tracker object used in single thread.
Numbers can be much higher with multi-threading environment which tracker now can be safely used with, as we also thoughtfully eliminated all possible race conditions.


<h2 id="scala-212">2. Scala 2.12 and dependency cleanup</h2>

Another big update for tracker is its availability for Scala 2.12.
Right now tracker is available on three major Scala versions: 2.10, 2.11 and 2.12, which makes it suitable for any modern Scala application.
Unfortunately, support of Scala 2.12 required from us to drop Java 7 support and target at least JRE8.

Along with these upgrades we also significantly removed dependency footprint, including already mentioned removing of Akka and Spray.
These two dependencies were essentially making impossible to use Snowplow Scala tracker in application with another version of Akka installed.
Now, there's only two transitive dependencies: [json4s][json4s] and [scalaj-http][scalaj-http].

<h2 id="contributing">3. Contributing</h2>

Please check out the [repository][repo] and the [open issues][issues] if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[repo]: https://github.com/snowplow/snowplow-scala-tracker
[release-1]: https://github.com/snowplow/snowplow-docker/releases/tag/r1

[issues]: https://github.com/snowplow/snowplow-scala-tracker/issues

[discourse]: http://discourse.snowplowanalytics.com/

[json4s]: https://github.com/json4s/json4s
[scalaj-http]: https://github.com/scalaj/scalaj-http

