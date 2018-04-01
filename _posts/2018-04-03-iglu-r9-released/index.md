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

1. [Switch from spray to akka-http](#akka-http)
2. [Allow super user to upload schemas](#super-user)
3. [A new command line interface](#new-cli)
4. [A new user interface](#new-ui)
5. [Add metadata to schemas optionally](#metadata)
6. [Other updates](#other-updates)
7. [Getting help](#help)

Read on for more information about Release 9 Bull's Eye, named after [the first Brazilian postage stamp][bulls-eye] - having face values of 30, 60 and 90 réis.

![bulls-eye-img][bulls-eye-img]

<!--more-->

<h2 id="akka-http">1. Switch from spray to Akka HTTP</h2>

Iglu Server was developed by Spray, a well-known HTTP library in Scala ecosystem. However, spray is no longer maintained and has been superseded by Akka HTTP. To stay up to date with modern web development techniques, we are changing underlying HTTP server from Spray to Akka HTTP.

From a user perspective, the important takeaway from this migration is that one endpoint's path changed as following.

Below was the endpoint to be used if you want to delete all schemas belonging to a specific vendor prefix;

{% highlight bash %}
DELETE /api/auth/keygen?vendor_prefix=<a_vendor_prefix>
{% endhighlight %}

With R9 Bull's Eye, that changed to;

{% highlight bash %}
DELETE /api/auth/vendor?vendor_prefix=<a_vendor_prefix>
{% endhighlight %}

As seen, only change happened in last section of path.

<h2 id="super-user">2. Allow super user to upload schemas</h2>

While an API key with `write` permission is enough to be able to upload schemas to a registry, same operation couldn't be performed with another API key with `super` permission. R9 enables API keys with `super` permission to upload schemas as well.

<h2 id="new-cli">3. A new command line interface</h2>

Up to date, if necessary, Java system properties were being used to provide a custom configuration for server, database etc.

A sample usage would be;

{% highlight bash %}
java -Dconfig.file=<path_to_custom_configuration> -jar <path_to_server_jar>
{% endhighlight %}

With R9 Bull's Eye, a new command line interface is being introduced.

{% highlight bash %}
$ java -jar <path_to_server_jar> --help
iglu-server 0.3.0
Usage: iglu-server [options]

  --help               Print this help message
  --version            Print version info

  --config <filename>  Path to custom config file. It is required and can not be empty.
{% endhighlight %}

Running Iglu Server with a custom configuration would look like;

{% highlight bash %}
java -jar <path_to_server_jar> --config <path_to_custom_configuration>
{% endhighlight %}

<h2 id="new-ui">4. A new user interface</h2>

Our user interface is happening by Swagger UI. Migration of HTTP server from spray to Akka HTTP resulted in migrating Swagger too, since Swagger is released library-specific. With Swagger for Spray, we were making use of top input box to add `apikey` header to HTTP requests for authorization. As of R9 Bull's Eye, with Swagger for Akka HTTP, `Authorization` button at the right top of endpoint list should be used. Clicking on that button will open a popup box with an input box to enter API key to be used as `apikey` HTTP header. Click `Authorize` and `Close` to make sure entered value will be added to requests made from Swagger UI. To edit/remove a previously entered API key, click on `Authorize` button again and then `Logout` to find yourself with a clear input field.

Browse `<host>:<port>` per your configuration to check it out!


<h2 id="metadata">5. Add metadata to schemas optionally</h2>

So far, all endpoints returning JSON schemas would include metadata of each schema too and we didn't provide an option to enable or disable it. R9 Bull's Eye introduces a new query parameter `metadata` to all endpoints with method `GET` and under path `/api/schemas/` so that metadata will be included only if `?metadata=1`. By default, metadata isn't included.

<h2 id="other-updates">6. Other updates</h2>

Release 9 Bull's Eye brings some good other stuff too.

As part of our efforts on modernizing Iglu Server, we are dockerizing Iglu Server. If you are interested in running Iglu Server in a docker container, please take a look at [our docker repository][docker-iglu-registry] to see details.

Bull's Eye also fixes two important bugs in igluctl.

[First][issue-340], `lint` command checks if there is any missing schema version in input. In case input is the full path to schema and schema's version isn't `1-0-0`, it should give a warning. However, igluctl `0.4.0` produces failure message instead of warning.

[Second][issue-300] bug happens when you use igluctl with Java 9. JAXB APIs aren't resolved by default as of Java 9 and users get following.

{% highlight bash %}
Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/JAXBException
{% endhighlight %}

<h2 id="help">7. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[release-notes]: https://github.com/snowplow/iglu/releases/tag/r9-bulls-eye
[discourse]: http://discourse.snowplowanalytics.com/

[bulls-eye]: https://en.wikipedia.org/wiki/Bull%27s_Eye_(postage_stamp)
[bulls-eye-img]: /assets/img/blog/2018/04/bulls_eye.jpg

[issue-300]: https://github.com/snowplow/iglu/issues/300
[issue-340]: https://github.com/snowplow/iglu/issues/340
[docker-iglu-registry]: https://github.com/snowplow/snowplow-docker/tree/master/iglu-registry
