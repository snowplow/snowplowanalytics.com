---
layout: post
title: "Snowplow Mini 0.3.0 released"
title-short: Snowplow Mini 0.3.0
tags: [snowplow, real-time, standalone, on-premise]
author: Enes
category: Releases
---

We are pleased to announce the 0.3.0 release of Snowplow Mini, our accessible "Snowplow in a box" distribution.

Snowplow Mini is the complete Snowplow real-time pipeline running on a single instance, available for easy deployment as a pre-built AMI. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release focuses on making Snowplow Mini much more ergonomic, with the newly bundled Control Plane, and much more secure, with built-in SSL support courtesy of [Caddy][caddy].

In the rest of this post we will cover new features which is coming with new version:

1. [Introducing the Control Plane](/blog/2017/07/25/snowplow-mini-0.3.0-released#control-plane)
2. [Built-in SSL via Caddy](/blog/2017/07/25/snowplow-mini-0.3.0-released#out-of-the-box-ssl)
3. [HTTP authentication while accessing internal application](/blog/2017/07/25/snowplow-mini-0.3.0-released#http-auth)
4. [Much more easier setup for local development](/blog/2017/07/25/snowplow-mini-0.3.0-released#easier-setup)
5. [Basic enrichments as standard](/blog/2017/07/25/snowplow-mini-0.3.0-released#basic-enrichments)
6. [Other Changes](/blog/2017/07/25/snowplow-mini-0.3.0-released#other-changes)
7. [Documentation and getting help](/blog/2017/07/25/snowplow-mini-0.3.0-released#help)


<!--more-->

<h2 id="control-plane">1. Control-Plane</h2>

In the Snowplow Mini v0.2.2,  every internal problem or updating schema registry requires restarting the machine or making SSH connection and restarting all the applications. We know that this is not a easy process. For solving this problem, with this release we are announcing Snowplow Mini Control Plane. First feature of the control plane is restarting the all the Snowplow Mini services with one button. With this button, you don't need to SSH to machine or restarting machine after every update to the schema registry. Only thing you need to do is clicking this button. 
Also, we are planning add [more features] [control-plane-issue] to the control-plane in the next releases.


<h2 id="out-of-the-box-ssl">2. Out-Of-The-Box SSL</h2>

Snowplow Mini is coming out-of-the-box SSL after [number of requests] [ssl-requests-issue] in this release. With out-of-the-box SSL, you can use Snowplow Mini as the collector for websites with SSL. Only thing you need to is submitting the domain name which redirects to the ip of the server Snowplow Mini will run and your SSL protected Snowplow Mini is ready. You can look at the [corresponding part] [submitting-domain-name] in the Quickstart Guide for learning how to submit domain name to Snowplow Mini.


<h2 id="http-auth">3. HTTP authentication while accessing internal application</h2>

With this release, you don't need to open the ports to the outside for accessing applications on the Snowplow Mini. Every applications have a unique url path and you can access these applications with username and password which you choose in the beginning of the Snowplow Mini setup.


<h2 id="easier-setup">4. Much more easier setup for local development</h2>

With this release, local setup of the Snowplow Mini is made much more easier for local development and testing. Only thing you need to do is fetching Snowplow Mini repository and calling 'vagrant up' in the main folder of the repository. Your running Snowplow-Mini instance is ready with only one command.


<h2 id="basic-enrichments">5. Basic enrichments as standard</h2>

One of the strong features of the Snowplow is enrichments. You can read more about enrichments in [here][enrichments-info]. With this release, Snowplow Mini is coming with 6 of these enrichments. These enrichments are: 

* IP lookups
* Campaign attribution enrichment
* Referer parser
* ua-parser
* user-agent-utils
* event fingerprint

We are planning to add new feature for adding enrichments from UI, stay tunned.

<h2 id="other-changes">6. Other changes</h2>

Version 0.3.0 also includes some internal changes and minor enhancements under the hood, including:

* Upgrading the various constituent Snowplow micro-services to Snowplow R85 Metamorphosis ([issue #81][81])
* Authenticating Iglu schema registry access from Stream Enrich ([issue #92][92])
* Converting Snowplow Mini's shell scripts to Ansible playbooks for easier provisioning ([issue #52][52])

<h2 id="roadmap">X. Roadmap</h2>

We have plenty planned for Snowplow Mini, and hope to increase the pace of development on this critical Snowplow project over the coming months.

Our first priority is around **robustness**. Currently under the hood Snowplow Mini uses *Unix named pipes* to communicate between the various bundled micro-services. These pipes are relatively fragile - and so we are embarking on a project to add [NSQ][nsq] to all of the relevant micro-services. NSQ will provide a much more robust queueing system for Snowplow Mini.

We are also excited about extending Snowplow Mini's new **Control Plane**. Through the Control Plane we can let non-technical users modify and tweak every aspect of their running pipeline. We are also considering whether Snowplow Mini's Control Plane could be the blueprint for a more generalized control plane for the wider Snowplow ecosystem - watch this space!

A final important philosophical change involves changing Snowplow Mini from *inherently stateful* to **stateless by default**. Currently, the Iglu schema registry and Elasticsearch instance live inside the Snowplow Mini; over time we want Snowplow Mini to default to having no such state inside it - instead you would use the Control Plane to connect Snowplow Mini to your external schema registries and storage targets. This should make Snowplow Mini more flexible and more robust. See the [Stateless Snowplow Mini milestone][stateless-milestone] for further details.

If you have other changes and suggestions for the roadmap, please let us know in our [forums][discourse].

<h2 id="getting-help">X. Documentation and getting help</h2>

To learn more about getting started with Snowplow Mini, check out the [Quickstart guide][quickstart].

If you run into any problems, please [raise a bug][issues] or get in touch with us through [the usual channels][talk-to-us].

[control-plane-issue]: https://github.com/snowplow/snowplow-mini/issues/56
[ssl-requests-issue]: https://github.com/snowplow/snowplow-mini/issues/48
[submitting-domain-name]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide#223-configure-instance
[enrichments-info]: https://github.com/snowplow/snowplow/wiki/Configurable-enrichments
[81]: https://github.com/snowplow/snowplow-mini/issues/81
[92]: https://github.com/snowplow/snowplow-mini/issues/92
[52]: https://github.com/snowplow/snowplow-mini/issues/52
[stateless-milestone]: https://github.com/snowplow/snowplow-mini/milestone/13

[caddy]: https://caddyserver.com/
[nsq]: http://nsq.io/

[quickstart]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide-v0.3.0
[issues]: https://github.com/snowplow/snowplow-mini/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com
