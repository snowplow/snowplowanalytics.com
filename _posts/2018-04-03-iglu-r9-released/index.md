---
layout: post
title: Iglu R9 Bull's Eye released
title-short: Iglu R9 Bull's Eye
tags: [iglu, json, json schema, registry]
author: Oguzhan
category: Releases
permalink: /blog/2018/04/03/iglu-r9-bulls-eye-released/
---

We are excited to announce a new Iglu release, introducing a good number of improvements focused on our Iglu Server.

1. [Iglu Server reload](#server-reload)
2. [Updated Iglu Server dependencies](#server-bumps)
3. [Iglu Server improvements](#server-improvements)
4. [Igluctl improvements](#igluctl)
5. [Getting help](#help)

Read on for more information about Release 9 Bull's Eye, named after [the first Brazilian postage stamp][bulls-eye] - having face values of 30, 60 and 90 réis.

![bulls-eye-img][bulls-eye-img]

<!--more-->

<h2 id="server-reload">1. Iglu Server reload</h2>

Last version of Scala Repo Server was [released][r3-blog-post] more than two years ago along with Iglu R3 Penny Black.
Since then we were mainly focused on tools like [igluctl][igluctl] that supposed to improve Static Registry experience.
This was a deliberate decision as Static Registry over time has proven its robustness and sufficient enough flexibility.

However, it became clear that in order to keep up with ambitious Iglu roadmap we need a more powerful alternative.
Hence, we've dusted-off the old Scala Repo Server project, which now becomes just Iglu Server.

<h2 id="server-bumps">2. Updated Iglu Server dependencies</h2>

As part of the reload, first of all we've brought internal dependencies, such as [Akka][akka], [Akka HTTP][akka-http] and many others up-to-date with modern Scala ecosystem.
Most of these updated dependencies do not directly impact user experience, instead just fixing subtle bugs in REST interface and improving performance.

Still, some upgrades do have significant impact. Particularly, updated [Swagger UI][swagger-ui] brings massive overhaul into Iglu Server's UI and implicitly fixes several UI issues existing in all previous versions.

<h2 id="super-user">3. Iglu Server improvements</h2>

Beside of internal improvements, this release also brings multiple user-facing enhancements.

In order to reduce steps required for getting started with Iglu Server, we've made `super` API keys allowed to be used for writing and reading schemas, not only creating new keys.
Hence, since this release most of our users can save only single API key for all interactions with Iglu Server.
For more granular access control, separate `read` and `write` keys still can be used.

Before this release, Server by defaulted always attached metadata to all schemas, which made its interface incompatible with more widely used Static Registry.
Now, by default all schemas returned without any additional information, but you can add a special `metadata` query parameter to any `/api/schemas/` endpoint in order to restore old behavior.

Last user-facing addition is a new CLI interface, with single `--config` option so far, that can be used to provide config file with DB and server settings.
Now you can launch server with following interface: `java -jar $JAR_PATH --config $CONFIG_PATH`.

<h2 id="igluctl">4. Igluctl improvements</h2>

Bull's Eye also fixes two important bugs in igluctl, bringing new path 0.4.1 release:

* We've fixed a bug introduced in `0.4.0`, where if `lint` input is the full path to schema and schema's version isn't `1-0-0`, igluctl produced a failure message instead of warning [(#340)][issue-340], 
* Igluctl now is able to work on top of JRE9 [(#300)][issue-300] 

<h2 id="help">5. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[r3-blog-post]: https://snowplowanalytics.com/blog/2016/03/04/iglu-r3-penny-black-released/
[igluctl]: https://github.com/snowplow/iglu/wiki/Igluctl

[swagger-ui]: https://swagger.io/swagger-ui/

[akka]: https://akka.io/
[akka-http]: https://doc.akka.io/docs/akka-http/current/

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r9-bulls-eye
[discourse]: http://discourse.snowplowanalytics.com/

[bulls-eye]: https://en.wikipedia.org/wiki/Bull%27s_Eye_(postage_stamp)
[bulls-eye-img]: /assets/img/blog/2018/04/bulls_eye.jpg

[issue-300]: https://github.com/snowplow/iglu/issues/300
[issue-340]: https://github.com/snowplow/iglu/issues/340
