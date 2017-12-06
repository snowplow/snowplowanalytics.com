---
layout: post
title: "Snowplow Mini 0.4.0 released"
title-short: Snowplow Mini 0.4.0
tags: [Snowplow Mini, ControlPlane, nsq]
author: Enes
category: Releases
permalink: /blog/2017/10/04/snowplow-mini-0.4.0-released/
---

We are pleased to announce the 0.4.0 release of Snowplow Mini, our accessible "Snowplow in a box" distribution.

Snowplow Mini is the complete Snowplow real-time pipeline running on a single instance, available for easy deployment as a pre-built AMI. Use it to:

1. Set up an inexpensive and easily discardable Snowplow stack for testing your tracker and schema changes
2. Learn about Snowplow without having to set up a horizontally-scalable, highly-available production-grade pipeline

This release focuses on adding new features to Control Plane and making it much more functional. Also, one of the long standing issues, [NSQ migration][nsq-migration-issue], is resolved with this release.

Read on for:

<!--more-->

1. [New Control Plane Features](/blog/2017/10/04/snowplow-mini-0.4.0-released#control-plane)
2. [NSQ migration](/blog/2017/10/04/snowplow-mini-0.4.0-released#nsq-migration)
3. [Creating index mappings](/blog/2017/10/04/snowplow-mini-0.4.0-released#index-mappings)
4. [Other updates](/blog/2017/10/04/snowplow-mini-0.4.0-released#other-changes)
5. [Documentation and getting help](/blog/2017/10/04/snowplow-mini-0.4.0-released#help)


<h2 id="control-plane">1. New Control Plane Features</h2>

In order to make Snowplow Mini more easy to use and accessible, plenty of features is added to Control Plane in this release. In this post, only usages of new features from the Control Plane is explained. If you want to learn more about Control Plane API usage, you can visit [the documentation page for Control Plane API][control-plane-doc].

<h3>1.1. Adding external Iglu schema registry</h3>

One of the our goals for Snowplow Mini is making it stateless. What we mean by stateless is that running all the internal services such as Iglu Server, Elasticsearch, Postgres etc at the outside. New feature for adding external Iglu schema registry is one of the milestone for this goal.

Only thing you need to do is submitting vendor prefix, URI, apikey, name and priority of the external iglu server through Control Plane. After that, you can start to use external Iglu Server in your Snowplow Mini instance.

<h3>1.2. Uploading custom enrichments</h3>

As you know, one of the distinguish feature of the Snowplow is [configurable enrichments][enrichments-info]. We added custom enrichments to Snowplow Mini in previous release. However, as its name hint, custom enrichments are "configurable" and this means that users should be able to change and tweak them as they want. But there is no way uploading these custom configured enrichments to Snowplow Mini without SSHing until these release. With the new control plane feature, users can upload their custom enrichment to Snowplow Mini through Control Plane.

<h3>1.3. Adding apikey for local Iglu Server</h3>

As mentioned before, there is a running Iglu instance on the Snowplow Mini right now. You can make schemas public or private in the Iglu as you know. However, in order to access private schemas in the local Iglu, you have to create apikey for local Iglu. In the previous versions of the Snowplow Mini, this apikey was taken from user with user_data.sh script which was provided by user in the beginning of the AMI setup. As you can see, this was not very elegant solution. Also in order to change apikey, you have to go through cumbersome process of the SSHing. With the new control plane feature, users can add or change apikey of the local Iglu Server through Control Plane.

<h3>1.4. Changing username and password for basic HTTP authentication</h3>

We made the accessing to Snowplow Mini authenticated in the previous version. However, credentials could be changed only with user_data.sh script which is mentioned before. If you want to change the credentials of the Snowplow Mini later on, you have to SSH to Snowplow Mini instance. After adding the new feature to Control Plane, user can change credentials easily through Control Plane whenever they want.

<h3>1.5. Adding domain name for automatic TLS</h3>

One of the features which we added in the previous version of the Snowplow Mini is that automatic TLS. In order to activate automatic TLS, only thing you have to do is that providing domain name which resolves to IP of the Snowplow Mini instance. User was providing domain name with user_data.sh scripts in the previous version. After adding this new feature to Control Plane, user can add domain name through Control Plane.

<h2 id="nsq-migration">2. NSQ migration</h2>

As you know, we were using Unix named pipes for inter process communication until this release. Even though they are easy and straight to use, they were causing unexpected behaviours. Therefore, we decided to use NSQ instead of named pipes. This migration will make the pipeline more robust. This change have not caused any user visible changes. You don't need to do anything for this migration.

<h2 id="index-mappings">3. Creating index mappings</h2>

Until this release, user had to add index mappings manually in Kibana. After this release, creating index mapping is handled in the setup of the Snowplow Mini. User can start to see events directly in the Kibana without adding the index mappings manually.


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