---
layout: post
title: Iglu R9 Bull's Eye released
title-short: Iglu R9 Bull's Eye
tags: [iglu, json, json schema, registry, schema registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/04/19/iglu-r9-bulls-eye-released/
---

We are excited to announce a new Iglu release, introducing a number of long-awaited improvements to our Iglu Server, our most advanced Iglu schema registry technology. This release also brings some small but powerful updates to igluctl, the command-line toolkit for Iglu.

1. [Iglu Server, reloaded](#server-reload)
2. [Improvements to Iglu Server](#server-improvements)
3. [Under the hood of Iglu Server](#server-bumps)
4. [igluctl updates](#igluctl)
5. [Upgrading](#upgrading)
6. [Getting help](#help)

Read on for more information about Release 9 Bull's Eye, named after [the first-ever Brazilian postage stamp][bulls-eye].

![bulls-eye-img][bulls-eye-img]

<!--more-->

<h2 id="server-reload">1. Iglu Server, reloaded</h2>

Our latest version of what was then-called the "Scala Repo Server" was [released][r3-blog-post] more than two years ago, as part of Iglu R3 Penny Black. That version is still bundled with Snowplow Mini and has proved its worth in that environment.

Since then, our Iglu product efforts have focused on tools like [igluctl][igluctl], focused on improving the static schema registry experience for Snowplow operators. This was a deliberate decision, and the Iglu static registry has over time proven its robustness - at the cost of some flexibility.

However, it has become clear that to deliver on our ambitious and exciting Iglu roadmap, we will need a more powerful schema registry engine. We will deliver this through our tried-and-tested Scala Repo Server project, now re-badged as simply Iglu Server.

<h2 id="server-improvements">2. Improvements to Iglu Server</h2>

In order to reduce setup time for Iglu Server, we have widened the scope of `super` API keys to the writing and reading of schemas - not only creating new keys. Thus as of R9, it is possible to use just a single API key for all interactions with Iglu Server.

For more granular access control, separate `read` and `write` keys still can be used.

Given that Iglu Server could be deployed behind a proxy or a load balancer, R9 extends the server configuration options with a new parameter, `repo-server.baseURL` - set this to the address that will be used to reach your Iglu Server.

Before this release, Iglu Server attached metadata to all schemas, which made its interface incompatible with more widely-used static schema registry. Now, by default all schemas are returned without any additional information, but you can add a special `metadata` query parameter with value `1` to any `/api/schemas/` endpoint in order to restore old behavior.

Finally, there is a new CLI interface to Iglu Server, so far offering just a single `--config` option. Use this to provide a configuration file for Iglu Server with DB and server settings.

<h2 id="server-bumps">3. Under the hood of Iglu Server</h2>

As part of the project reboot, we have brought internal dependencies, such as [Akka][akka], [Akka HTTP][akka-http] and others up-to-date with the modern Scala ecosystem.

These dependency updates have fixed some subtle bugs in Iglu Server's REST interface, and have also improved performance.

We are particularly pleased to have updated the registry's [Swagger UI][swagger-ui] - this represents a hugely beneficial to Iglu Server's built-in UI for interacting with schema endpoints.

<h2 id="igluctl">4. igluctl updates</h2>

R9 Bull's Eye also fixes two important bugs in igluctl, introducing a new 0.4.1 version:

* We've fixed a bug introduced in version 0.4.0, whereby if `lint` input is the full path to schema and the schema's version isn't `1-0-0`, then igluctl produced a failure message instead of warning ([issue #340][issue-340]),
* igluctl now works with JRE9 ([issue #300][issue-300])

<h2 id="upgrading">5. Upgrading</h2>

<h3 id="upgrade-iglu-server">5.1 Iglu Server</h3>

The new Iglu Server release can be downloaded from [here from Bintray][iglu-server-download] (download will start). Unzip the compressed file and then you can launch server with following interface: `java -jar $JAR_PATH --config $CONFIG_PATH`.

The switch from Spray to Akka HTTP has seen some major changes in the configuration file format. However the old format can be adapted by:

* Replacing or removing the Spray-specific server settings
* Adding `repo-server.baseURL`, making sure to omit the protocol (i.e. `http(s)://`), because Swagger UI will automatically prepend that

Another breaking change is related to endpoint paths. Previously, a DELETE request sent to `api/auth/keygen` was used to delete API keys of a specific vendor prefix. From now on, that same request should be sent to `api/auth/vendor`.

Finally, Iglu Server 0.3.0 now negotiates `Content-Type` with clients. Clients should specify either `Accept: application/json` header, or no `Accept` header at all; no other header values are supported.

<h3 id="upgrade-igluctl">5.2 igluctl</h3>

The latest igluctl can be downloaded from [here from Bintray][igluctl-download] (download will start).

The new version, igluctl 0.4.1, doesn't introduce any interface changes over 0.4.0.

<h2 id="help">6. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] and the [wiki page][iglu-server-wiki] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[r3-blog-post]: https://snowplowanalytics.com/blog/2016/03/04/iglu-r3-penny-black-released/
[igluctl]: https://github.com/snowplow/iglu/wiki/Igluctl
[igluctl-download]: http://dl.bintray.com/snowplow/snowplow-generic/igluctl_0.4.1.zip

[swagger-ui]: https://swagger.io/swagger-ui/

[akka]: https://akka.io/
[akka-http]: https://doc.akka.io/docs/akka-http/current/

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r9-bulls-eye
[discourse]: http://discourse.snowplowanalytics.com/
[iglu-server-wiki]: https://github.com/snowplow/iglu/wiki/Iglu-server-setup
[iglu-server-download]: http://dl.bintray.com/snowplow/snowplow-generic/iglu_server_0.3.0.zip

[bulls-eye]: https://en.wikipedia.org/wiki/Bull%27s_Eye_(postage_stamp)
[bulls-eye-img]: /assets/img/blog/2018/04/bulls_eye.jpg

[issue-300]: https://github.com/snowplow/iglu/issues/300
[issue-340]: https://github.com/snowplow/iglu/issues/340
