---
layout: post
title: Iglu R9 Bull's Eye released
title-short: Iglu R9 Bull's Eye
tags: [iglu, json, json schema, registry, docker]
author: Oguzhan
category: Releases
permalink: /blog/2018/04/03/iglu-r9-bulls-eye-released/
---

We are excited to announce a new Iglu release, introducing a good number of improvements focused on our Iglu Server.

1. [Iglu Server reload](#server-reload)
2. [Updated Iglu Server dependencies](#server-bumps)
3. [Iglu Server improvements](#server-improvements)
4. [Igluctl improvements](#igluctl)
5. [Other updates](#other-updates)
6. [Getting help](#help)

Read on for more information about Release 9 Bull's Eye, named after [the first Brazilian postage stamp][bulls-eye] - having face values of 30, 60 and 90 réis.

![bulls-eye-img][bulls-eye-img]

<!--more-->

<h2 id="server-reload">1. Iglu Server reload</h2>

Last version of Scala Repo Server was [released][r3-blog-post] more than two years ago along with Iglu R3 Penny Black.
Since then we were mainly focused on tools like [igluctl][igluctl] that supposed to improve Static Registry experience.
This was a deliverate decision as Static Registry over time has proven its robustness and sufficient enough flexibility.

However, it became clear that in order to keep up with ambitious Iglu roadmap we need a more powerful alternative.
Hence, we've dusted-off the old Scala Repo Server project, which now becomes just Iglu Server.

<h2 id="server-bumps">2. Updated Iglu Server dependencies</h2>

As part of reload, first of all we've brought most of internal dependencies, such as [Akka][akka], [Akka HTTP][akka-http] and others up-to-date with modern JVM ecosystem.
Most of these updated dependencies do not directly impact user experience, instead just fixing subtle bugs in REST interface and improve performance.

Still, some upgrades do have significant impact. Particularly, updated [Swagger UI][swagger-ui] brings massive overhaul into Iglu Server's UI.

<h2 id="super-user">3. Iglu Server improvements</h2>

Beside of internal improvements, this release also brings multiple user-facing enhancements.

* API key with `super` permissions now allowed to not only create new keys, but also to upload and read schemas
* You now can pass custom configuration file via convenient command line option: `java -jar <path_to_server_jar> --config <filename>`
* To make API more consistent with Static Registry, now to get schema metadata you need to provide special query parameter `metadata` to any `/api/schemas/` endpoint.

<h2 id="igluctl">4. Igluctl improvements</h2>

Bull's Eye also fixes two important bugs in igluctl.

[First][issue-340], `lint` command checks if there is any missing schema version in input. In case input is the full path to schema and schema's version isn't `1-0-0`, it should give a warning. However, igluctl `0.4.0` produces failure message instead of warning.

[Second][issue-300] bug happens when you use igluctl with Java 9. JAXB APIs aren't resolved by default as of Java 9 and users get following.


As part of our efforts on modernizing Iglu Server, we are dockerizing Iglu Server. If you are interested in running Iglu Server in a docker container, please take a look at [our docker repository][docker-iglu-registry] to see details.

<h2 id="help">7. Getting help</h2>

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
[docker-iglu-registry]: https://github.com/snowplow/snowplow-docker/tree/master/iglu-registry
