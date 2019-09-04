---
layout: post
title-short: "Snowplow R116 adds new features to the Scala Stream Collector"
title: "Snowplow R116 adds new features to the Scala Stream Collector"
tags: [snowplow, scalastreamcollector, release]
author: Dilyan Damyanov
category: Releases
permalink: /blog/2019/09/12/snowplow-r116-madara-rider/
---

[Snowplow R116 Madara Rider][snowplow-release], named after
[the early medieval rock relief carved on the Madara Plateau in Bulgaria][madara-rider], adds new features to the Scala Stream Collector that will help users struggling with overzealous ad-blocking and the implications of WebKit's recent ITP changes.

Please read on after the fold for:

1. [Setting first-party cookies server-side against multiple domains on the same collector](#cookies)
2. [Configuring `Secure`, `HttpOnly` and `SameSite` attributes for the cookie](#cookie-attr)
3. [Custom request paths](#paths)
4. [`Cache-Control` headers](#cache)
5. [Other changes](#other)
6. [Upgrading](#upgrading)
7. [Roadmap](#roadmap)
8. [Getting help](#help)

![madara-rider][madara-rider-img]
<br>
Feradz [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0)

<!--more-->

<h2 id="cookies">1. Setting first-party cookies server-side against multiple domains on the same collector</h2>

By default, no domain is specified for the cookie set by the Scala Stream Collector. That means the cookie is set against the full collector domain, for example `c.example.com`. That way, applications running elsewhere on `*.example.com` are not able to access it.

In earlier versions, users could specify a `domain` in the collector configuration file to which to tie the cookie. For example, if set to `.example.com`, the cookie would have been accessible to other applications running on `*.example.com`. From version `0.16.0` on, to achieve that, users will have to use the new `fallbackDomain` setting in the configuration file.

The cookie set by the Scala Stream Collector might be treated by browsers as a third-party cookie or a first-party cookie, depending on the context. To illustrate, let's assume that a collector is configured with an endpoint like `c.example.com`. A Snowplow JavaScript tracker, `sp1`, is set up to track events on www.example.com; and another tracker, `sp2`, is set up on www.example.net. The cookie domain can also be specified in the configuration file: `fallbackDomain = "example.com"` (**note** the lack of a leading dot).

A user visits www.example.com, and `sp1` sends a request to the collector. The collector responds with a `Set-Cookie` header that specifies the domain for the cookie as `.example.com`. This cookie is considered a first-party cookie.

Another user visits www.example.net, where `sp2` sends a request to the collector. The collector sends the same `Set-Cookie` response but the cookie is now considered to be third-party, because its domain (`.example.com`) doesn't match the domain of the website.

Both cookies are considered to be set server-side, as opposed to client-side cookies, like the ones set by the trackers, `sp1` and `sp2`.

The difference between first-party and third-party cookies and between cookies set client-side or server-side is becoming increasingly important. This is evident, for example, in the latest round of ITP changes, known as [ITP2.1][itp], that WebKit has announced. ITP has been going after third-party cookies in earlier versions, but 2.1 introduced limitations to first-party cookies as well, if they are set client-side (ie, via `document.cookie`). Those cookies now expire in 7 days.

Following suit, Firefox also announced that it will expire cookies set via JavaScript in 7 days by default.

In effect, this means that Snowplow users can no longer rely on `domain_userid` (set via the first-party client-side cookie dropped by the tracker) as a long-term identifier. Our advice is to instead leverage the `network_userid`, which is set via the server-side cookie dropped by the collector. You'll just have to make sure that this cookie is considered to be first-party.

As explained in the example above, with a single collector endpoint and multiple domains, the collector cookie can only be considered first-party for one of the domains. However, it is possible to set up a collector with multiple valid endpoints. And the Scala Stream Collector now gives you the option to specify a list of domains that will be used for setting the cookie (as opposed to just one before).

Which domain will be used in the `Set-Cookie` header is determined by matching the domains from the `Origin` header of the request to the specified list. The first match is used. If no matches are found, the fallback domain is used, if configured. If no `fallbackDomain` is configured, the cookie will be tied to the full collector domain.

If you specify a main domain in the list, all subdomains on it will be matched. If you specify a subdomain, only that subdomain will be matched. For example:
- `example.com` will match `Origin` headers like `example.com`, `www.example.com` and `secure.client.example.com`
- `client.example.com` will match an `Origin` header like `secure.client.example.com` but not `example.com` or `www.example.com`.

(We've written about the impact of ITP2.1 before: [here][itp-how] and [here][itp-why].)

<h2 id="cookie-attr">2. Configuring Secure, HttpOnly and SameSite attributes for the cookie</h2>

As well as ITP2.1 (Safari) and Firefox's new default expiration rules for client-side cookies, both browsers have been limiting the capabilities of cookies set in a third-party context. Most recently, Chrome stepped up its own effort in that direction, saying it will require websites to specify whether cookies are first or third-party.

From version `0.16.0` we are providing users with ways to control several additional attributes for the `Set-Cookie` response header sent by the collector: `Secure`, `HttpOnly` and `SameSite`. See below in the <a href="upgrading">Upgrading</a> section for details on how to configure them.

<h2 id="paths">3. Custom request paths</h2>

We have been aware for some time that the Snowplow JavaScript tracker has been targeted by some ad-blocking providers, whose software blocks traffic to the paths used by the HTTP requests the tracker sends to the collector.

We firmly believe that data subjects's rights must be protected and we are providing [tools and advice][gdpr] that makes that easy for Snowplow users. While we understand how ad-blockers might see a Snowplow tracker as a privacy invasion, we believe that is misguided. Snowplow enables event tracking and as such data flows through pipelines we've built. But we have no access to that data and no interest in it beyond ensuring that it is safely collected and stored in our users's own data warehouses. Blocking the Snowplow tracker is in effect preventing website owners from understanding their users and improving their service.

The request paths we use have traditionally been intrinsically tied to how the collector (and downstream processes) work. With version `0.16.0` we are giving users of the Scala Stream Collector the option to map their own custom paths to the ones used under the hood. That way, users will be able, for example, to send requests to a path like `/sp/track`.

The path can be changed when initialising the JavaScript tracker, as explained [here][post-path]. See below in the <a href="upgrading">Upgrading</a> section for details on how to configure the mappings in the collector.

<h2 id="cache">4. Cache-Control headers</h2>

To increase the likelihood that the Snowplow pixel will not be cached by a browser or proxy, we have added the following directives to the `Cache-Control` header of the collector's response: `no-cache`, `no-store`, `must-revalidate`.

<h2 id="other">5. Other changes</h2>

We have bumped the version of the `akka-http` library used by the Scala Stream Collector to `10.0.15`. This does away with the [DoS vulnerability][akka-dos] that was present in earlier versions.

The Scala Stream Collector now uses the `sbt-native-packager` to publish Docker images to our Docker repos: https://hub.docker.com/u/snowplow.

<h2 id="upgrading">6. Upgrading</h2>

A new version of the Scala Stream Collector can be found on [our Bintray](https://bintray.com/snowplow/snowplow-generic/snowplow-scala-stream-collector/0.16.0#files).

To make use of the new features, you'll need to update your configuration as follows:

- Add a `collector.paths` section if you want to provide custom path mappings:

```hocon
paths {
  "/com.acme/track" = "/com.snowplowanalytics.snowplow/tp2" # for tracker protocol 2 requests
  "/com.acme/redirect" = "/r/tp2"                           # for redirect requests
  "/com.acme/iglu" = "/com.snowplowanalytics.iglu/v1"       # for Iglu webhook requests
}
```

- In `collector.cookie` there is no longer a `domain` setting. Instead, you can provide a list of `domains` to be used and / or a `fallbackDomain` in case none of the origin domains matches the ones you specified:

```hocon
domains = [
  "acme.com"
  "acme.net"
]

fallbackDomain = "roadrunner.com"
```

If you don't wish to use multiple domains and want to preserve the previous behaviour, leave `domains` empty and specify a `fallbackDomain` with the same value as `collector.cookie.domain` from your previous configuration.

Both `domains` and `fallbackDomain` are optional settings, just like `domain` is an optional setting in earlier versions.

- Another addition to `collector.cookie` are controls for extra directives to be passed in the `Set-Cookie` response header.

```hocon
secure = false    # set to true if you want to enforce secure connections
httpOnly = false  # set to true if you want to make the cookie inaccessible to non-HTTP requests
sameSite = "None" # or "Lax", or "Strict"
```

The `sameSite` parameter is optional. If you omit it, the default value `None` will be assumed.

<h2 id="roadmap">7. Roadmap</h2>

Snowplow releases on which we are currently working:

* [R117 Morgantina](https://github.com/snowplow/snowplow/milestone/154): this release will incorporate the new bad row format discussed
in [the dedicated RFC](https://discourse.snowplowanalytics.com/t/a-new-bad-row-format/2558).

Stay tuned for announcements of more upcoming Snowplow releases soon!

<h2 id="help">8. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[madara-rider]: https://en.wikipedia.org/wiki/Madara_Rider
[madara-rider-img]: /assets/img/blog/2019/09/Madara_Rider.jpg
[itp]: https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1/
[itp-how]: https://snowplowanalytics.com/blog/2019/06/17/how-ITP2.1-works-what-it-means-for-web-analytics/
[itp-why]:https://snowplowanalytics.com/blog/2019/06/17/why-ITP2.1-affects-web-analytics-what-to-do-about-it/
[gdpr]: https://snowplowanalytics.com/blog/gdpr/
[post-path]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#post-path
[akka-dos]: https://doc.akka.io/docs/akka-http/current/security/2018-09-05-denial-of-service-via-decodeRequest.html
[snowplow-release]: https://github.com/snowplow/snowplow/releases/r116-madara-rider
[discourse]: http://discourse.snowplowanalytics.com/
