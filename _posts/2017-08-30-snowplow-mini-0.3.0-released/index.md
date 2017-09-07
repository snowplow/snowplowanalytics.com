---
layout: post
title: "Snowplow Mini 0.3.0 released"
title-short: Snowplow Mini 0.3.0
tags: [snowplow, real-time, standalone, on-premise]
author: Enes
category: Releases
permalink: /blog/2017/08/30/snowplow-mini-0.3.0-released
---

We are pleased to announce the 0.3.0 release of Snowplow Mini, our accessible "Snowplow in a box" distribution.

Snowplow Mini is the complete Snowplow real-time pipeline running on a single instance, available for easy deployment as a pre-built AMI. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release focuses on making Snowplow Mini much more ergonomic, with the newly bundled Control Plane, and much more secure, with built-in SSL support, courtesy of [Caddy][caddy], plus HTTP authorization.

Read on for:

1. [Introducing the Control Plane](/blog/2017/08/30/snowplow-mini-0.3.0-released#control-plane)
2. [Built-in SSL via Caddy](/blog/2017/08/30/snowplow-mini-0.3.0-released#out-of-the-box-ssl)
3. [HTTP basic authentication](/blog/2017/08/30/snowplow-mini-0.3.0-released#http-auth)
4. [A simpler local setup via Vagrant](/blog/2017/08/30/snowplow-mini-0.3.0-released#easier-setup)
5. [Basic enrichments as standard](/blog/2017/08/30/snowplow-mini-0.3.0-released#basic-enrichments)
6. [Other updates](/blog/2017/08/30/snowplow-mini-0.3.0-released#other-changes)
7. [Roadmap](/blog/2017/08/10/snowplow-mini-0.3.0-released#roadmap)
8. [Documentation and getting help](/blog/2017/08/30/snowplow-mini-0.3.0-released#help)

<!--more-->

<h2 id="control-plane">1. Introducing the Control Plane</h2>

In our [last Snowplow Mini release][020-release], internal issues with the Snowplow Mini, or schema registry updates, required "bouncing" the EC2 instance, or SSHing in and restarting all the applications; not an easy process.

To make Snowplow Mini much easier to control remotely, this release introduces a new **Control Plane** for Snowplow Mini (see [issue 56][56]).

The Control Plane's first feature lets you restart all of the Snowplow Mini's internal services with a single command. This command (also added into the Snowplow Mini's UI as a button) makes it much easier to clear the internal schema registry's schema cache, among other uses.

We have lots of features planned for the Control Plane in future releases - see the [Roadmap](#roadmap) section below for details.

<h2 id="out-of-the-box-ssl">2. Build-in SSL via Caddy</h2>

Snowplow Mini users expect to be able to communicate with the instance over HTTPS for security. We have typically recommended putting an Amazon Elastic Load Balancer in front of the Snowplow Mini to achieve this, but this over-complicates our "single box" vision for Snowplow Mini.

In this release, we bundle [Caddy][caddy], the HTTPS-first webserver, and use this to provide out-of-the-box TLS support for Snowplow Mini (see [issue #48][48]).

To use this new functionality, you will need to provide a domain name for the Snowplow Mini instance - Caddy will handle the rest. The [Quickstart Guide][submitting-domain-name] has more details on how to submit domain name to Snowplow Mini.

<h2 id="http-auth">3. HTTP basic authentication</h2>

Previous releases of Snowplow Mini had no authentication of any sort, requiring you to resort to IP whitelisting of various ports to securely lock down the box.

Version 0.3.0 solves this problem - every service within the Snowplow Mini now has its own unique URL path, and you can lock down access to these services with [HTTP basic authentication][http-basic-auth]. Choose your own username and password at the start of the Snowplow Mini setup.

<h2 id="easier-setup">4. A simpler local setup via Vagrant</h2>

With this release, local setup of a Snowplow Mini for local development and testing is much more straightforward.

Simply `git clone` the Snowplow Mini repository and calling `vagrant up` in the main folder of the repository - this will bring up a full development environment, with all services running.

<h2 id="basic-enrichments">5. Basic enrichments as standard</h2>

Before this release, Snowplow Mini ran without any of the [Snowplow configurable enrichments][enrichments-info] - which is rarely how Snowplow is run in production. 

With this release, six of the most popular enrichments are enabled by default on Snowplow Mini. These enrichments are: 

* IP lookups enrichment
* Campaign attribution enrichment
* referer-parser enrichment
* ua-parser enrichment
* user-agent-utils enrichment
* Event fingerprint enrichment

For now, these enrichments have been configured with sensible defaults. In a future release, we plan on making the enrichments fully user-configurable via the new Control Plane - watch this space!

<h2 id="other-changes">6. Other updates</h2>

Version 0.3.0 also includes some internal changes and minor enhancements under the hood, including:

* Upgrading the various constituent Snowplow micro-services to Snowplow R85 Metamorphosis ([#81][81])
* Authenticating Iglu schema registry access from Stream Enrich ([#92][92])
* Converting Snowplow Mini's shell scripts to Ansible playbooks for easier provisioning ([#52][52])

<h2 id="roadmap">7. Roadmap</h2>

We have plenty planned for Snowplow Mini, and hope to increase the pace of development on this critical Snowplow project over the coming months.

<h3 id="roadmap-robustness">7.1 Robustness</h3>

Our first priority is around **robustness**. Currently under the hood Snowplow Mini uses *Unix named pipes* to communicate between the various bundled micro-services. These pipes are relatively fragile - and so we are embarking on a project to add [NSQ][nsq] to all of the relevant micro-services. NSQ will provide a much more robust queueing system for Snowplow Mini.

<h3 id="roadmap-control-plane">7.2 Extending the Control Plane</h3>

We are also excited about extending Snowplow Mini's new **Control Plane**. Through the Control Plane we can let non-technical users modify and tweak every aspect of their running pipeline. We are also considering whether Snowplow Mini's Control Plane could be the blueprint for a more generalized control plane for the wider Snowplow ecosystem - watch this space!

<h3 id="roadmap-stateless">7.3 Stateless by default</h3>

A final important philosophical change involves changing Snowplow Mini from *inherently stateful* to **stateless by default**. Currently, the Iglu schema registry and Elasticsearch instance live inside the Snowplow Mini; over time we want Snowplow Mini to default to having no such state inside it - instead you would use the Control Plane to connect Snowplow Mini to your external schema registries and storage targets. This should make Snowplow Mini more flexible and more robust. See the [Stateless Snowplow Mini milestone][stateless-milestone] for further details.

If you have other changes and suggestions for the roadmap, please let us know in our [forums][discourse].

<h2 id="getting-help">8. Documentation and getting help</h2>

To learn more about getting started with Snowplow Mini, check out the [Quickstart guide][quickstart].

If you run into any problems, please [raise a bug][issues] or get in touch with us through [the usual channels][talk-to-us].

[enrichments-info]: https://github.com/snowplow/snowplow/wiki/Configurable-enrichments

[48]: https://github.com/snowplow/snowplow-mini/issues/48
[52]: https://github.com/snowplow/snowplow-mini/issues/52
[56]: https://github.com/snowplow/snowplow-mini/issues/56
[81]: https://github.com/snowplow/snowplow-mini/issues/81
[92]: https://github.com/snowplow/snowplow-mini/issues/92
[stateless-milestone]: https://github.com/snowplow/snowplow-mini/milestone/13

[020-release]: /blog/2016/04/08/introducing-snowplow-mini/

[http-basic-auth]: https://en.wikipedia.org/wiki/Basic_access_authentication

[caddy]: https://caddyserver.com/
[nsq]: http://nsq.io/

[quickstart]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide
[submitting-domain-name]: https://github.com/snowplow/snowplow-mini/wiki/Quickstart-guide#223-configure-instance
[issues]: https://github.com/snowplow/snowplow-mini/issues/new
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
[discourse]: http://discourse.snowplowanalytics.com
