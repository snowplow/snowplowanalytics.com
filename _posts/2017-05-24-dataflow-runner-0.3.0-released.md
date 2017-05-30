---
layout: post
title: "Dataflow Runner 0.3.0 released"
title-short: Dataflow Runner 0.3.0
tags: [snowplow, golang, orchestration, emr, hadoop]
author: Ben
category: Releases
---

We are pleased to announce [version 0.3.0][release-030] of Dataflow Runner, our cloud-agnostic tool
to create clusters and run jobflows. This release is centered around new features and usability
improvements.

In this post, we will cover:

1. [Preventing overlapping job runs through locks](/blog/2017/05/24/dataflow-runner-0.3.0-released#locks)
2. [Tagging playbooks](/blog/2017/05/24/dataflow-runner-0.3.0-released#tags)
3. [New template functions](/blog/2017/05/24/dataflow-runner-0.3.0-released#templates)
4. [Other updates](/blog/2017/05/24/dataflow-runner-0.3.0-released#updates)
5. [Roadmap](/blog/2017/05/24/dataflow-runner-0.3.0-released#roadmap)
6. [Contributing](/blog/2017/05/24/dataflow-runner-0.3.0-released#contributing)

<!--more-->

<h2 id="locks">1. Preventing overlapping job runs through locks</h2>

This release introduces a mechanism to prevent two jobs from running at the same time. This is great
if you have for example an ETL process that needs to run as a singleton, or you have multiple jobs
that each need exclusive access to the same database.

With this feature, Dataflow Runner will acquire a lock before starting the job. Its release will
happen when:

- the job has terminated (whether successfully or with failure) with the `--softLock` flag
- the job has succeeded with the `--lock` flag ("hard lock")

As the above implies, if a job were to fail and the `--lock` flag was used, manual cleaning of the
lock will be required.

Two strategies for storing the lock have been made available: local and distributed.

<h3 id="local-lock">1.1 Local lock</h3>

You can leverage a local lock when launching your playbook with `./dataflow-runner run` using:

{% highlight bash %}
./dataflow-runner run            \
  --emr-playbook playbook.json   \
  --emr-cluster  j-21V4W2CSLYUCU \
  --lock         path/to/lock
{% endhighlight %}

This prevents anyone on this machine from running another playbook using `path/to/lock` as lock.

For example, launching the following while the steps above are running:

{% highlight bash %}
./dataflow-runner run           \
  --emr-playbook playbook.json  \
  --emr-cluster  j-KJC0LSX73BSF \
  --lock         path/to/lock
{% endhighlight %}

fails with:

{% highlight bash %}
WARN[0000] Locked already held
{% endhighlight %}

You can set the lock name as appropriate to setup locks across different playbooks, job names and/or cluster IDs.

In a local context, the lock will be materialized by a file at the specified path.

<h3 id="distributed-lock">1.2 Distributed lock</h3>

Anoter strategy is to leverage [Consul][consul] to enforce a distributed lock:

{% highlight bash %}
./dataflow-runner run            \
  --emr-playbook playbook.json   \
  --emr-cluster  j-21V4W2CSLYUCU \
  --lock         path/to/lock    \
  --consul       127.0.0.1:8500
{% endhighlight %}

That way, anyone using `path/to/lock` as lock and this Consul server will have to respect the lock.

In a distributed context, the lock will be materialized by a key-value pair in Consul, the key being
at the specified path.

<h2 id="tags">2. Tagging playbooks</h2>

Much like cluster configurations which can be tagged, versions 0.3.0 introduces the ability to
tag playbooks.

As an example, we could have the following `playbook.json` file:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1",
  "data": {
    "region": "us-east-1",
    "credentials": {
      "accessKeyId": "env",
      "secretAccessKey": "env"
    },
    "steps": [
      {
        "type": "CUSTOM_JAR",
        "name": "Combine Months",
        "actionOnFailure": "CANCEL_AND_WAIT",
        "jar": "/usr/share/aws/emr/s3-dist-cp/lib/s3-dist-cp.jar",
        "arguments": [
          "--src",
          "s3n://my-output-bucket/enriched/bad/",
          "--dest",
          "hdfs:///local/monthly/"
        ]
      }
    ],
    "tags": [
      {
        "key": "environment",
        "value": "production"
      }
    ]
  }
}
{% endhighlight %}

However, unlike the cluster configuration tags which actually tag the EMR cluster, playbook tags don't
have any effect in EMR.

Note that, compared with version 0.2.0 of Dataflow Runner, the playbook schema version has
changed to 1-0-1. 1-0-1 is fully backward compatible, so if you do not wish to use the tags
introduced in this release you do not have to change anything.

The up-to-date playbook schema can be found on [GitHub][avro-schema].

<h2 id="templates">3. New template functions</h2>

In addition to the already existing `nowWithFormat` and `systemEnv`, the 0.3.0 release brings
three new template functions: `timeWithFormat`, `base64`, and `base64File`.

<h3 id="time-with-format">3.1 timeWithFormat</h3>

Similarly to `nowWithFormat`, `timeWithFormat [time] [format]` will format the specified unix time
thanks to the format argument.

As an example, if we have the following in our `cluster.json`:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "dataflow-runner {% raw %}{{timeWithFormat "1495622024" "Mon Jan _2 15:04:05 2006"}}{% endraw %}",
    // omitted for brevity
  }
}
{% endhighlight %}

it results in:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "dataflow-runner Wed May 24 10:33:44 2017",
    // omitted for brevity
  }
}
{% endhighlight %}

<h3 id="base64">3.2 base64</h3>

As its name implies, the `base64` template function will encode the argument using base 64 encoding.

For example:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "{% raw %}{{base64 "dataflow-runner"}}{% endraw %}",
    // omitted for brevity
  }
}
{% endhighlight %}

results in:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "ZGF0YWZsb3ctcnVubmVy",
    // omitted for brevity
  }
}
{% endhighlight %}

<h3 id="base64-file">3.3 base64File</h3>

Buidling on `base64`, `base64File` will encode the contents of the file passed as argument.

Let's say we have a `playbook-name.txt` file containing:

{% highlight bash %}
dataflow-runner
{% endhighlight %}

The following `cluster.json`:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "{% raw %}{{base64File "playbook-name.txt"}}{% endraw %}",
    // omitted for brevity
  }
}
{% endhighlight %}

results in:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "ZGF0YWZsb3ctcnVubmVyCg==",
    // omitted for brevity
  }
}
{% endhighlight %}

<h2 id="updates">4. Other updates</h2>

Some changes have been made to improve usability regarding missing template variables:

<h3 id="unset-var">4.1 Short-circuit execution on unset template variable</h3>

Prior to 0.3.0, if you forgot to specify a template variable, then the string `<no value>` would be filled into the template.

For example, launching an EMR cluster with the following `cluster.json` configuration:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "{% raw %}{{.name}} - {{.owner}}{% endraw %}",
    // omitted for brevity
  }
}
{% endhighlight %}

with:

{% highlight bash %}
./dataflow-runner up         \
  --emr-config config.json   \
  --vars       name,snowplow
{% endhighlight %}

would have resulted in an EMR cluster named: `snowplow - <no value>`.

With 0.3.0, forgetting a template variable is not allowed, and the following error will be
generated:

{% highlight bash %}
FATA[0000] template: cluster.json: executing "cluster.json" at <.owner>: map has no entry for key "owner"
{% endhighlight %}

<h3 id="unset-env-var">4.2 Short-circuit execution on unset environment variable</h3>

In the same vein, referring to an unset environment variable in a template through `systemEnv` will
result in an error instead of an empty string.

Let's say that we have the following `cluster.json`:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.dataflowrunner/ClusterConfig/avro/1-0-1",
  "data": {
    "name": "{% raw %}{{systemEnv "CLUSTER_NAME"}}{% endraw %}",
    // omitted for brevity
  }
}
{% endhighlight %}

Before 0.3.0, launching the cluster with the `CLUSTER_NAME` enviroment variable unset would have
resulted in an EMR cluster with no name. Now, it will result in the following error:

{% highlight bash %}
FATA[0000] template: cluster.json: executing "cluster.json" at <systemEnv "CLUSTER_NAME">: error calling systemEnv: environment variable CLUSTER_NAME not set
{% endhighlight %}

<h2 id="roadmap">5. Roadmap</h2>

As we stated in [the blog post for the previous release][release-020-post],
we are committed to supporting other clouds such as Azure HDInsight (see [issue #22][issue-22]) and
Google Cloud Dataproc.

If you have other features in mind, feel free to log an issue in
[the GitHub repository][df-runner-issues].

<h2 id="contributing">6. Contributing</h2>

You can check out the [repository][df-runner-repo] if you'd like to get involved! In particular, any
preparatory work getting other cloud providers integrated would be much appreciated.

[release-030]: https://github.com/snowplow/dataflow-runner/releases/tag/0.3.0
[release-020-post]: /blog/2017/03/31/dataflow-runner-0.2.0-released#roadmap

[consul]: https://www.consul.io
[avro-schema]: http://iglucentral.com/schemas/com.snowplowanalytics.dataflowrunner/PlaybookConfig/avro/1-0-1

[df-runner-repo]: https://github.com/snowplow/dataflow-runner/
[df-runner-issues]: https://github.com/snowplow/dataflow-runner/issues/
[issue-22]: https://github.com/snowplow/dataflow-runner/issues/22
[issue-15]: https://github.com/snowplow/dataflow-runner/issues/15
