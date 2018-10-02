---
layout: post
title-short: Snowplow R111 Clojure Collector bug fix
title: "Snowplow R111 Selinunte Clojure Collector bug fix"
tags: [snowplow, batch, clojure, collector]
author: Ben
category: Releases
permalink: /blog/2018/10/02/snowplow-r111-selinunte-clojure-collector-bug-fix/
---

[Snowplow 111 Selinunte][snowplow-release], named after
[the archeological site in Southwestern Sicily][snowplow-release], is a small release following up
on the bug fix for the Clojure Collector published in [Release 110][r110-cc].

Please read on after the fold for:

1. [Clojure Collector bug fix](#bug-fixes)
2. [Upgrading](#upgrading)
3. [Roadmap](#roadmap)
4. [Help](#help)

![selinunte][selinunte-img]
<br>
By AdiJapan ([GFDL](http://www.gnu.org/copyleft/fdl.html), [CC-BY-SA-3.0](http://creativecommons.org/licenses/by-sa/3.0/)), from Wikimedia Commons

<!--more-->

<h2 id="bug-fixes">1. Clojure Collector bug fix</h2>

Unfortunately, the bug fix for the Clojure Collector provided in [Release 110][r110-cc] was not
sufficient to complete the story around cross-origin resource sharing (CORS for short) for the
Clojure Collector.

Indeed, R110's bug fix ([issue #3875](https://github.com/snowplow/snowplow/issues/3875)) only targeted `OPTIONS` requests. In this
release, we are extending it to support `POST` requests.

As a result, we are now sending back a response containing the original value of the `Origin` header
as the `Access-Control-Allow-Origin` header and the `Access-Control-Allow-Credentials` header with
value `true` in response to `POST` requests as well.

<h2 id="upgrading">2. Upgrading</h2>

The new Clojure Collector incorporating the fix discussed above is available in S3 at:

{% highlight yaml %}
s3://snowplow-hosted-assets/2-collectors/clojure-collector/clojure-collector-2.1.2-standalone.war
{% endhighlight %}

<h2 id="roadmap">3. Roadmap</h2>

Upcoming Snowplow releases include:

* [R11x [BAT] Increased stability][r11x-stability], improving batch pipeline stability

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">4. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r111-selinunte

[selinunte]: https://en.wikipedia.org/wiki/Selinunte
[selinunte-img]: /assets/img/blog/2018/09/selinunte.jpg

[r110-cc]: https://snowplowanalytics.com/blog/2018/09/12/snowplow-r110-valle-dei-templi-introduces-real-time-enrichments-on-gcp/#cc

[discourse]: http://discourse.snowplowanalytics.com/

[r11x-stability]: https://github.com/snowplow/snowplow/milestone/162
