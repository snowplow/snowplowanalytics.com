---
layout: post
title-short: Snowplow R97 Knossos
title: "Snowplow R97 Knossos released with support for new webhooks"
tags: [webhook, mailgun, unbounce, olark, statusgator]
author: Kosta
category: Releases
permalink: /blog/2017/11/16/snowplow-r97-knsossos-released/
---

We are excited to announce the release of [Snowplow R97 Knossos][snowplow-release] named [Knossos] [knossos] (Greek: Κνωσός) after the palace at the nexus of the Minoan civilisation, which was one of the earliest major Grecian civilisations (17th century BCE).

This release is primarily about supporting 4 new integrations via webhooks using the venerable clojure collector, but it also contains other small improvements. Initially these integrations concern the batch enrichments, but they will soon be adapted to the stream enrichments. Thank you to to [Mike Robins][miike] for his contribution fixing https defaults. Specifically, the four services from which Snowplow can now receive event from are:

- **Mailgun** - for tracking email and email-related events delivered by [Mailgun] [mailgun-website]
- **Olark** - for chat transcript events from [Olark] [olark-website]
- **StatusGator** for cloud service availability events from hundreds of services form [StatusGator] [statusgator-website]
- **Unbounce** - for lead generation and A/B testing events from [Unbounce]

Read on for more information:

1. [Mailgun webhook support](#mailgun)
2. [Olark webhook support](#olark)
3. [StatusGator](#statusgator)
4. [Unbounce](#unbounce)
5. [Roadmap](#roadmap)
6. [Help](#help)

<!--more-->

![Knossos][minoan-horns]

<h2 id="mailgun">1. Mailgun webhook support</h2>


The Mailgun webhook adapter lets you track email and email-related events delivered by [Mailgun] [mailgun-website]. Using this functionality, you can warehouse all email-related events alongside your existing Snowplow events.

For help setting up the Mailgun webhook, wee the [Mailgun webhook setup] [mailgun-setup] page.

All the currently documented events are supported (bounce, deliver, drop, spam, unsubscribe, click, open).

For technical details see the [Mailgun webhook documentation] [mailgun-techdoc] page.

<h2 id="olark">2. Olark webhook support</h2>


The Olark webhook adapter lets you receive the transcripts of chats on you website, including messages that you received when a support representative was not online, using [Olark] [olark-website]. Using this functionality, you can track and analyse chat activity alongside your other Snowplow data.

For help setting up the Olark webhook, see the [Olark webhook setup] [olark-setup] page.

<h2 id="statusgator">3. StatusGator webhook support</h2>


StatusGator lets you track the availability of hundreds of cloud services that your service may be relying on. Using the webhook integration with [StatusGator] [statusgator-website] you can collect availability events and use them to find correlations with other events in your Snowplow warehouse. 

For help setting up the StatusGator webhook, refer to [StatusGator webhook guide] [statusgator-setup].

<h2 id="unbounce">4. Unbounce webhook support</h2>

Using the [Unbounce] [unbounce-website] service you can experiment with different landing pages and variants thereof as a tool to increase your conversion rate. Using the Unbounce webhook you can now integrate your lead generation data with the rest of the Snowplow data.

For help setting up the Unbounce webhook, refer to [Unbounce webhook guide] [unbounce-setup].

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream
processing pipeline.
* [R9x [BAT] Priority fixes][r9x-bat-quality], which will include some security and data-quality fixes.
* [GDPR support][gdpr-support], which will include data privacy features as mandated by the new [EU General Data Protection Regulation] [eugdpr-website].

<h2 id="help">6. Getting Help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release]
on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r97-knossos

[discourse]: http://discourse.snowplowanalytics.com/

[knossos]: https://en.wikipedia.org/wiki/Knossos
[minoan-horns]: /assets/img/blog/2017/11/Minoan_Horns_of_Consecration_Restoration_Knossos.jpg

[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[gdpr-support]: https://github.com/snowplow/snowplow/milestone/149
[eugdpr-website]: http://www.eugdpr.org/

[miike]: https://github.com/miike

[mailgun-website]: https://www.mailgun.com
[mailgun-setup]: https://www.mailgun.com/your-guide-to-webhooks
[mailgun-techdoc]: https://documentation.mailgun.com/en/latest/api-webhooks.html

[olark-website]: https://www.olark.com/
[olark-setup]: https://www.olark.com/integrations/webhooks

[statusgator-website]: https://statusgator.com/
[statusgator-setup]: https://blog.statusgator.com/introducing-web-hooks/

[unbounce-website]: https://unbounce.com
[unbounce-setup]: https://documentation.unbounce.com/hc/en-us/articles/203510044-Using-a-Webhook

