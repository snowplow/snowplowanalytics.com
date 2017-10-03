---
layout: post
title-short: Snowplow 93 Virunum
title: "Snowplow 93 Virunum released"
tags: [snowplow, kinesis, kafka, realtime]
author: Ben
category: Releases
permalink: /blog/2017/10/03/snowplow-r93-virunum-released-realtime-pipeline-refresh/
---

We are tremendously excited to announce the release of [Snowplow 93 Virunum][snowplow-release].

This release focuses on a much needed refresh of the real-time pipeline components: the Scala
Stream Collector as well as Stream Enrich. It also fixes some long-standing annoyances regarding
the Scala Stream Collector.

<!--more-->

If you'd like to know more about R93 Virunum, named after [the ancient Roman city in
Austria][virunum], please read on after the fold:

1. [Scala Stream Collector: detecting blocked third-party cookies through cookie bounce](#cookie-bounce)
2. [Scala Stream Collector: relaxing the parsing of HTTP request components](#parsing)
3. [Stream Enrich: enriching events from a certain point in time with `AT_TIMESTAMP`](#at-ts)
4. [Stream Enrich: forcing the download of the ip lookup database](#force-dl)
5. [Stream Enrich: partitionining the output stream according to event properties](#partitioning)
6. [Kafka improvements](#kafka)
7. [Under the hood](#misc)
8. [Upgrading](#upgrading)
9. [Roadmap](#roadmap)
10. [Help](#help)

![virunum][virunum-img]

<h2 id="cookie-bounce">1. Scala Stream Collector: detecting blocked third-party cookies through cookie bounce</h2>

Following on from [Christoph Buente's RFC][rfc-cookie-bounce], the Scala Stream Collector now
provides a mechanism to test if third-party cookies are blocked and reacts appropriately. Huge thanks to Christoph and the team at LiveIntent for contributing this sophisticated new feature.

Simply put, the new "cookie bounce" mechanism:

- Checks if the cookie named according to the value of the `cookie.name` configuration is present
  - if it is present, uses it and processes the request
  - if not, issues a redirect to itself with a `Set-Cookie` header
    - if the cookie is still missing, then we infer that third-party cookies are not allowed, and the Scala Stream Collector processes the request with the placeholder network user id defined in `cookieBounce.fallbackNetworkUserId`
    - if the cookie is now present, third-party cookies are allowed, and the Scala Stream Collector processes the request with the cookie value

To enable this feature, you can change the `cookieBounce.enabled` configuration to `true`.

Be careful though: the redirects mentioned above can significantly increase the number of requests that your collectors have to handle.

<h2 id="parsing">2. Scala Stream Collector: relaxing the parsing of HTTP request components</h2>

The Scala Stream Collector was previously too restrictive when it came to parsing elements of an HTTP request, and would reject certain events despite their intrinsic correctness, most notably due to:

- Query string parameters with non-url-encoded reserved characters in their values ([#3272][i3272])
- Useragents not conforming to [RFC 2616][rfc-2616] ([#2970][i2970])

Those shortcomings have been fixed in the new version of the collector as part of our ongoing focus on removing any possible data loss scenarios across the pipeline.

Additionally, the enrich stream processing application won't reject events for which `page_url` contains more than one # characters ([#2893][i2893]).

<h2 id="at-ts">3. Stream Enrich: enriching events from a certain point in time with `AT_TIMESTAMP`</h2>

If you are using Kinesis with Stream Enrich, you previously had two choices when it came to enriching your raw event stream:

- Starting from the beginning through `TRIM_HORIZON`
- Starting from the latest message with `LATEST`

With R93, you are now able to consume your raw event stream from an arbitrary point in time by
specifying `AT_TIMESTAMP` as the `streams.kinesis.initialPosition` configuration setting.
Additionally, you'll need to specify an actual timestamp in `streams.kinesis.initialTimestamp`.

<h2 id="force-dl">4. Stream Enrich: forcing the download of the MaxMind IP lookups database</h2>

Before R93, when you launched Stream Enrich with the [IP lookups enrichment][ip-lookups-enrichment], the MaxMind IP lookups database
was downloaded locally and, if you were to launch it later it would reuse this local cache of the database.

R93 introduces a command line argument `--force-ip-lookups-download` to download a new version of
the ip lookup database every time that Stream Enrich is launched.

There are plans to introduce a time-to-live for this database and re-download it while Stream Enrich
is running in issue [#3407][i3407].

<h2 id="partitioning">5. Stream Enrich: partitioning the output stream according to event properties</h2>

Before R93, it was only possible to use `user_ipaddress` as a partition key for the enriched event stream emitted by Stream Enrich. This release extends the realm of possibilities by introducing the`streams.out.partitionKey` configuration setting, which lets you specify which event property to use to partition the output stream of Stream Enrich.

The available properties have been selected based on their fitness as a partition key (i.e.
good distribution and usefulness):

- `domain_userid`
- `network_userid`
- `domain_sessionid`
- `user_ipaddress`
- `event_id`
- `event_fingerprint`
- `user_fingerprint`

If none of these are used, a random UUID will be generated for each event as partition key.

As a reminder, in Kinesis and Kafka, two events having the same partition key are guaranteed to
end up in the same shard or partition respectively.

<h2 id="kafka">6. Kafka improvements</h2>

Improvements have also been made regarding how both the Scala Stream Collector and Stream Enrich
interact with Kafka. In particular:

- This release exposes the `streams.kafka.retries` configuration for both the Scala Stream Collector and Stream
Enrich, allowing the Kafka producer to resend any record which failed being sent the specified
number of times
- Prior to this release, the `streams.buffer.byteLimit` setting was used as the size of the batch
being sent to Kafka, which didn't make a lot of sense. It now corresponds to the quantity of memory
the Kafka producer can use to buffer records before sending them
- Finally, this release makes use of [the callback-based API][kafka-doc] to notify of errors when
producing messages to a Kafka topic

<h2 id="misc">7. Under the hood</h2>

This release also includes a big set of other updates which are part of the modernization effort
around the realtime pipeline, most notably:

- The Scala Stream Collector and Stream Enrich use Java 8 ([#3328][i3328] and [#3392][i3392])
- They run on Scala 2.11 ([#3311][i3311] and [#3388][i3388])
- Akka HTTP has replaced Spray for the Scala Stream Collector ([#3299][i3299])
- A flurry of [other library updates](https://github.com/snowplow/snowplow/issues?utf8=✓&q=is%3Aissue%20milestone%3A"R93%20Virunum%20(Stream%20refresh)"%20bump)

<h2 id="upgrading">8. Upgrading</h2>

<h3 id="upg-ssc">8.1 Scala Stream Collector</h3>

The latest version of the Scala Stream Collector is available from our Bintray [here][ssc-dl].

<h4 id="upg-ssc-conf">8.1.1 Updating the configuration</h4>

{% highlight conf %}
collector {
  cookieBounce {                                                   # NEW
    enabled = false
    name = "n3pc"
    fallbackNetworkUserId = "00000000-0000-4000-A000-000000000000"
  }

  sink = kinesis                                                   # WAS sink.enabled

  streams {                                                        # REORGANIZED
    good = good-stream
    bad = bad-stream

    kinesis {
      // ...
    }

    kafka {
      // ...
      retries = 0                                                  # NEW
    }
  }
}

akka {
  http.server {                                                    # WAS spray.can.server
    // ...
  }
}
{% endhighlight %}

For a complete example, see our sample [`config.hocon`][ssc-conf] template.

<h4 id="upg-ssc-launch">8.1.2 Launching</h4>

The Scala Stream Collector is no longer an executable JAR file. As a result, it has to be launched as:

{% highlight bash %}
java -jar snowplow-stream-collector-0.10.0.jar --config config.hocon
{% endhighlight %}

<h3 id="upg-se">8.2 Stream Enrich</h3>

The latest version of Stream Enrich is available from our Bintray [here][se-dl].

<h4 id="upg-se-conf">8.2.1 Updating the configuration</h4>

{% highlight conf %}
enrich {
  // ...
  streams {
    // ...
    out {
      // ...
      partitionKey = user_ipaddress             # NEW
    }

    kinesis {                                   # REORGANIZED
      // ...
      initialTimestamp = "2017-05-17T10:00:00Z" # NEW but optional
      backoffPolicy {                           # MOVED
        // ...
      }
    }

    kafka {
      // ...
      retries = 0                               # NEW
    }
  }
}
{% endhighlight %}

For a complete example, see our sample [`config.hocon`][se-conf] template.

<h4 id="upg-se-launch">8.2.2 Launching</h4>

Stream Enrich is no longer an executable JAR file. As a result, it will have to be launched as:

{% highlight bash %}
java -jar snowplow-stream-enrich-0.11.0.jar --config config.hocon --resolver file:resolver.json
{% endhighlight %}

Additionally, [a new `--force-ip-lookups-download` flag has been introduced](#force-dl) as
mentioned above.

<h2 id="roadmap">9. Roadmap</h2>

Upcoming Snowplow releases will include:

* [R94 [BAT] Ellora][r94], enhancing our Redshift event storage with ZSTD encoding, plus various bug fixes for the batch pipeline
* [R95 [STR] Zeugma][r95], which will add support for NSQ to the stream processing pipeline, ready for adoption in Snowplow Mini
* [R9x [STR] Priority fixes][r9x-str-quality], removing the potential for data loss in the stream processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark,
Unbounce, StatusGator)

<h2 id="help">10. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r93-virunum

[virunum]: https://en.wikipedia.org/wiki/Virunum
[virunum-img]: /assets/img/blog/2017/09/virunum.jpg

[r94]: https://github.com/snowplow/snowplow/milestone/147
[r95]: https://github.com/snowplow/snowplow/milestone/103
[r9x-bat-quality]: https://github.com/snowplow/snowplow/milestone/145
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129
[r9x-str-quality]: https://github.com/snowplow/snowplow/milestone/144

[discourse]: http://discourse.snowplowanalytics.com/

[ip-lookups-enrichment]: https://github.com/snowplow/snowplow/wiki/IP-lookups-enrichment

[ssc-conf]: https://github.com/snowplow/snowplow/blob/r93-virunum/2-collectors/scala-stream-collector/examples/config.hocon.sample
[se-conf]: https://github.com/snowplow/snowplow/blob/r93-virunum/3-enrich/stream-enrich/examples/config.hocon.sample

[ssc-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_scala_stream_collector_0.10.0.zip
[se-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_stream_enrich_0.11.0.zip

[i3328]: https://github.com/snowplow/snowplow/issues/3328
[i3392]: https://github.com/snowplow/snowplow/issues/3392
[i3311]: https://github.com/snowplow/snowplow/issues/3311
[i3388]: https://github.com/snowplow/snowplow/issues/3388
[i3299]: https://github.com/snowplow/snowplow/issues/3299
[i3407]: https://github.com/snowplow/snowplow/issues/3407
[i3272]: https://github.com/snowplow/snowplow/issues/3272
[i2970]: https://github.com/snowplow/snowplow/issues/2970
[i2893]: https://github.com/snowplow/snowplow/issues/2893

[kafka-doc]: http://kafka.apache.org/0110/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html#send(org.apache.kafka.clients.producer.ProducerRecord,%20org.apache.kafka.clients.producer.Callback)
[rfc-2616]: https://tools.ietf.org/html/rfc2616#section-14.43
[rfc-cookie-bounce]: http://discourse.snowplowanalytics.com/t/scala-stream-collector-add-support-for-cookie-bounce/306
