---
layout: post
title: "Dataflow Runner 0.4.0 released"
title-short: Dataflow Runner 0.4.0
tags: [snowplow, golang, orchestration, emr, hadoop]
author: Ben
category: Releases
permalink: /blog/2018/02/15/dataflow-runner-0.4.0-released/
---

We are pleased to announce [version 0.4.0][release-040] of Dataflow Runner, our cloud-agnostic tool
to create batch-processing clusters and run jobflows. This small release is centered around usability improvements.

In this post, we will cover:

1. [Fetching logs for failed steps](#logs)
2. [Reducing logging noise](#noise)
3. [Roadmap](#roadmap)
4. [Contributing](#contributing)

<!--more-->

<h2 id="locks">1. Fetching logs for failed steps</h2>

When leveraging the `run-transient` or `run` commands, it is now possible to access the logs
produced by any failed steps through the `--log-failed-steps` flag.

In the following example, we launch a cluster to performing a couple of [S3DistCp][s3-dist-cp]
steps with the following command:

{% highlight bash %}
./dataflow-runner run --emr-playbook playbook.json --emr-cluster j-123 --log-failed-steps
{% endhighlight %}

Unfortunately, one of the steps failed to complete successfully. However, thanks to the `--log-failed-steps` flag, we'll be
able to review its logs without having to access the S3 bucket which contains the logs:

{% highlight bash %}
ERRO[0004] Step 'step' with id 'step-id' was FAILED
ERRO[0004] Content of log file 'stderr.gz':
ERRO[0004] Exception in thread "main" java.lang.RuntimeException: Error running job
    at com.amazon.elasticmapreduce.s3distcp.S3DistCp.run(S3DistCp.java:927)
    at com.amazon.elasticmapreduce.s3distcp.S3DistCp.run(S3DistCp.java:705)
    ...
{% endhighlight %}

Note that all log files for all the steps which ended up in the `FAILED` state will be printed out.
Usually, those log files can be located in a bucket conforming to the following pattern
`s3://my-bucket/emr-logs/j-123/steps/s-123/` where:

- `s3://my-bucket/emr-logs` is the log URI you filled out when launching the cluster
- `j-123` is the cluster ID
- `s-123` is the failed step ID

<h2 id="tags">2. Reducing logging noise</h2>

We have also reduced the "noisiness" of our logging, with each jobflow step now producing only one
informational line throughout the lifetime of the cluster by specifying its output status, e.g.
whether it completed successfully, was cancelled or failed.

This is in contrast with the previous approach which consisted of outputting every completed,
successfully or not, step's state every fifteen seconds.

<h2 id="roadmap">3. Roadmap</h2>

Dataflow Runner continues to evolve at Snowplow.

As we stated in [the blog post for the previous release][release-030-post], we are committed to supporting other cloud "big data services" such as Azure HDInsight (see [issue #22][issue-22]) and Google Cloud Dataproc (see [issue #33][issue-33]).

If you have other features in mind, feel free to log an issue in [the GitHub repository][df-runner-issues].

<h2 id="contributing">4. Contributing</h2>

You can check out the [repository][df-runner-repo] if you'd like to get involved!

In particular, any help integrating other big data services such as HDInsight or Cloud Dataproc would be much appreciated.

[release-040]: https://github.com/snowplow/dataflow-runner/releases/tag/0.4.0
[release-030-post]: /blog/2017/05/30/dataflow-runner-0.3.0-released#roadmap

[df-runner-repo]: https://github.com/snowplow/dataflow-runner/
[df-runner-issues]: https://github.com/snowplow/dataflow-runner/issues/
[issue-22]: https://github.com/snowplow/dataflow-runner/issues/22
[issue-33]: https://github.com/snowplow/dataflow-runner/issues/15

[s3-dist-cp]: https://docs.aws.amazon.com/emr/latest/ReleaseGuide/UsingEMR_s3distcp.html
