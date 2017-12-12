---
layout: post
title: "Snowplow Mini 0.4.0 released"
title-short: Snowplow Mini 0.4.0
tags: [snowplow-mini, nsq]
author: Enes
category: Releases
permalink: /blog/2017/12/15/snowplow-mini-0.4.0-released/
---

We are pleased to announce the 0.4.0 release of Snowplow Mini, our accessible "Snowplow in a box"
distribution.

Snowplow Mini is the complete Snowplow real-time pipeline running on a single instance, available
for easy deployment as a pre-built AMI. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release focuses on addressing the long-standing [NSQ migration][nsq-migration-issue].
It also adds new features to the control plane and makes it much more functional. As a reminder,
the control plane, which was introduced in [release 0.3.0][mini-0.3-control-plane], aims at
controlling Snowplow Mini through its interface.

Read on for:

<!--more-->

1. [New control plane features](/blog/2017/10/04/snowplow-mini-0.4.0-released#control-plane)
2. [NSQ migration](/blog/2017/10/04/snowplow-mini-0.4.0-released#nsq-migration)
3. [Creating index mappings](/blog/2017/10/04/snowplow-mini-0.4.0-released#index-mappings)
4. [Other updates](/blog/2017/10/04/snowplow-mini-0.4.0-released#other-changes)
5. [Documentation and getting help](/blog/2017/10/04/snowplow-mini-0.4.0-released#help)


<h2 id="control-plane">1. New Control Plane Features</h2>

In order to make Snowplow Mini easier to use and more accessible, plenty of features have been added
to the control plane in this release. In this post, only new control plane features are explained.
If you want to learn more about the control plane API, you can visit
[the documentation page for Control Plane API][control-plane-doc].

<h3>1.1. Adding external Iglu schema registry</h3>

One of our goals for Snowplow Mini is making it stateless. Stateless in the fact that
all the internal services such as Iglu Server, Elasticsearch, Postgres etc are outside the actual
box running Snowplow Mini.
Adding an external Iglu schema registry is one of the milestone for this goal.

The only thing you need to do is to submit a vendor prefix, URI, apikey, name and priority of the
external Iglu server through the control plane.

![external-iglu][external-iglu-img]

After that, you can start to use external this external Iglu server in your Snowplow Mini instance.

<h3>1.2. Uploading custom enrichments</h3>

As you know, one of the distinguished feature of Snowplow is
[configurable enrichments][enrichments-info]. We added custom enrichments to Snowplow Mini in
[the previous release][mini-0.3-enrichments]. With this release, we're adding the ability to upload
custom enrichments directly through the control plane.

![enrichments][enrichments-img]

<h3>1.3. Adding an api key for the local Iglu Server</h3>

Another shortcoming we're addressing with this release is the ability to add or change the internal
Iglu server's API key through the control plane. This replaces the cumbersome process of having
to specify the initial API key through the user data script or changing it by SSHing into the box.

![api-key][api-key-img]

<h3>1.4. Changing the username and password for basic HTTP authentication</h3>

In 0.3.0, we made [HTTP basic authentication for Snowplow Mini mandatory][mini-0.3-auth]. We're
making changing those credentials available in the control plane with this release.

![credentials][credentials-img]

<h3>1.5. Adding a domain name for automatic TLS</h3>

Lastly, we're improving on [the TLS support introduced in 0.3.0][mini-0.3-tls] by making providing
the domain name which resolves to the IP of the Snowplow Mini instance available in the control
plane.

![tls][tls-img]

<h2 id="nsq-migration">2. NSQ migration</h2>

Up until this release, we were using Unix named pipes for inter process communication. Even though
they are easy and straightforward to use, they were causing unexpected behaviours. Therefore, we
decided to use NSQ instead of named pipes. This migration will make the pipeline more robust. This
change has not caused any user-visible changes.

<h2 id="index-mappings">3. Creating index mappings</h2>

Before this release, Snowplow Mini users had to create index mappings manually in Kibana. Creating
those index mapping is now handled during the Snowplow Mini setup. Users can now start to see events
directly in Kibana.

<h2 id="other-changes">4. Other Updates</h2>

Version 0.4.0 also includes some internal changes and minor enhancements under the hood, including:

* Updating Javascript tracker ([#71][71])
* Ensure UI links adhere to the current protocol being used ([#127][127])
* Use caddy server instead of nginx for serving Snowplow Mini dashboard ([#130][130])
* Updating build process to build Caddy from source ([#132][132])
* Add libffi-dev, libssl-dev, python-dev and markupsafe as dependency ([#133][133])

<h2 id="help">5. Documentation and getting help</h2>

To learn more about getting started with Snowplow Mini, check out the [Quickstart guide][quickstart].

If you run into any problems, please [raise a bug][issues] or get in touch with us through [the usual channels][talk-to-us].

[nsq-migration-issue]: https://github.com/snowplow/snowplow-mini/issues/24
[control-plane-doc]: https://github.com/snowplow/snowplow-mini/wiki/Control-Plane-API
[enrichments-info]: https://github.com/snowplow/snowplow/wiki/Configurable-enrichments

[71]: https://github.com/snowplow/snowplow-mini/issues/71
[127]: https://github.com/snowplow/snowplow-mini/issues/127
[130]: https://github.com/snowplow/snowplow-mini/issues/130
[132]: https://github.com/snowplow/snowplow-mini/issues/132
[133]: https://github.com/snowplow/snowplow-mini/issues/133

[quickstart]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide
[issues]: https://github.com/snowplow/snowplow-mini/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us

[mini-0.3-enrichments]: https://snowplowanalytics.com/blog/2017/08/30/snowplow-mini-0.3.0-released/#basic-enrichments
[mini-0.3-tls]: https://snowplowanalytics.com/blog/2017/08/30/snowplow-mini-0.3.0-released/#out-of-the-box-ssl
[mini-0.3-auth]: https://snowplowanalytics.com/blog/2017/08/30/snowplow-mini-0.3.0-released/#http-auth
[mini-0.3-control-plane]: https://snowplowanalytics.com/blog/2017/08/30/snowplow-mini-0.3.0-released/#control-plane

[external-iglu-img]: /assets/img/blog/2017/12/mini_iglu_external_server.png
[enrichments-img]: /assets/img/blog/2017/12/mini_enrichments.png
[api-key-img]: /assets/img/blog/2017/12/mini_api_key.png
[tls-img]: /assets/img/blog/2017/12/mini_tls.png
[credentials-img]: /assets/img/blog/2017/12/mini_credentials.png
