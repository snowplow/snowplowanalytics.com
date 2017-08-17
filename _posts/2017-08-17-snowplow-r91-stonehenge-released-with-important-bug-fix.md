---
layout: post
title-short: Snowplow 91 Stonehenge
title: "Snowplow 91 Stonehenge released with important bug fix"
tags: [snowplow, emr]
author: Ben
category: Releases
---

We are pleased to announce the release of [Snowplow 91 Stonehenge][snowplow-release].

This release revolves around making EmrEtlRunner, the component launching the EMR steps for the batch pipeline,
significantly more robust. Most notably, this release fixes a long-standing bug in the way the staging step was
performed, which affected all users of the Clojure Collector.

This release also lays important groundwork for our planned migration away from EmrEtlRunner towards separate snowplowctl and Dataflow Runner tools, per [our RFC][eer-rfc]. 

If you'd like to know more about R91 Stonehenge, named after
[the prehistoric monument in England][stonehenge], please read on:

1. [Moving the staging step to S3DistCp](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#staging)
2. [New EmrEtlRunner commands](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#commands)
3. [New EmrEtlRunner CLI options](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#cli-options)
4. [Upgrading](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#upgrading)
5. [Roadmap](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#roadmap)
6. [Help](/blog/2017/08/17/snowplow-r91-stonehenge-released-with-important-bug-fix#help)

![stonehenge][stonehenge-img]

<!--more-->

<h2 id="staging">1. Moving the staging step to S3DistCp</h2>

This release overhauls the initial staging step which moves data from the raw input bucket(s) in S3
to a processing bucket for further processing.

Before this release, this step was run on the EmrEtlRunner host machine, using our [Sluice][sluice] library for S3 operations. From this release, this step is run as an EMR step using [S3DistCp][s3-dist-cp].

The main reason for the change is that the staging step used to rename Clojure log files by
transforming timestamps from a format to another. This renaming step produced duplicates in a
multi-threaded environment which would result in files overwriting each other and would cause data
loss.

In our experiments, less than 1% of the total number of files were lost due to this issue.

The fix introduced in this release delegates the staging step to S3DistCp and doesn't do any
renaming.

To illustrate the previous point, let's take the example of having a couple of Clojure instances
and log files according to the following folder structure in your input bucket:

{% highlight bash %}
$ aws s3 ls --recursive s3://raw/in/
i-1/
  _var_log_tomcat8_rotated_localhost_access_log.txt1502463662.gz
i-2/
  _var_log_tomcat8_rotated_localhost_access_log.txt1502467262.gz
{% endhighlight %}

Previously, once the staging step took place, these files would end up as shown below:

{% highlight bash %}
$ aws s3 ls --recursive s3://raw/processing/
var_log_tomcat8_rotated_localhost_access_log.2017-08-11-15.eu-west-1.i-1.txt.raw.gz
var_log_tomcat8_rotated_localhost_access_log.2017-08-11-16.eu-west-1.i-2.txt.raw.gz
{% endhighlight %}

From now on, they will be kept as is except for the leading underscores which will be removed:

{% highlight bash %}
$ aws s3 ls --recursive s3://raw/processing/
i-1/
  var_log_tomcat8_rotated_localhost_access_log.txt1502463662.gz
i-2/
  var_log_tomcat8_rotated_localhost_access_log.txt1502467262.gz
{% endhighlight %}

<h2 id="commands">2. New EmrEtlRunner commands</h2>

We've decided to refactor EmrEtlRunner into different subcommands in order to improve its
modularity. The following subsections detail those new commands.

<h3 id="run">2.1 Run command</h3>

The previous EmrEtlRunner behavior has been incorporated into a `run` command. Because of this, an
old EmrEtlRunner launch which looked like this:

{% highlight bash %}
./snowplow-emr-etl-runner -c config.yml -r resolver.json
{% endhighlight %}

will now look like the following:

{% highlight bash %}
./snowplow-emr-etl-runner run -c config.yml -r resolver.json
{% endhighlight %}

<h3 id="lint">2.2 Lint command</h3>

You can now lint you resolver file as well as your enrichments thanks to a `lint` command:

{% highlight bash %}
./snowplow-emr-etl-runner lint resolver    -r resolver.json
./snowplow-emr-etl-runner lint enrichments -r resolver.json -n enrichments/directory/
{% endhighlight %}

Those commands will check that the provided files are valid with respect to their schemas.

There are plans to support linting for storage targets in [issue #3364][i3364].

<h3 id="generate">2.3 Backend for a generate command</h3>

This release also introduces a backend for a `generate` command which will be able to
generate the necessary [Dataflow Runner][df-runner] configuration files.

This command will be formally introduced in a subsequent release when we start to smoothly
transition away from EmrEtlRunner, read [our RFC on splitting EmrEtlRunner][eer-rfc] for more
background.

<h2 id="cli-options">3. New and retired EmrEtlRunner CLI options</h2>

This release also introduces and retires a few options to the `run` command.

<h3 id="lock">3.1 Lock</h3>

In order to prevent overlapping job runs, this release introduces a locking mechanism. This
translates into a `--lock` flag to the `run` command. When specifying this flag, a lock will
be acquired at the start of the job and released upon its successful completion.

This is much more robust than our previous approach, which involved checking folder contents in S3 to attempt to determine if a previous run was ongoing (or had failed partway through).

There are two strategies for storing the lock: local and distributed.

<h4 id="local-lock">3.1.1 Local lock</h4>

You can leverage a local lock when launching EmrEtlRunner with:

{% highlight bash %}
./snowplow-emr-etl-runner run \
  -c     config.yml \
  -r     resolver.json \
  --lock path/to/lock
{% endhighlight %}

This prevents anyone on this machine from launching another run of EmrEtlRunner with `path/to/lock` as
lock. The lock will be represented by a file on a disk at the specifed path.

<h4 id="distributed-lock">3.1.2 Distributed lock</h4>

Anoter strategy is to leverage [Consul][consul] to enforce a distributed lock:

{% highlight bash %}
./snowplow-emr-etl-runner run \
  -c       config.yml \
  -r       resolver.json \
  --lock   path/to/lock \
  --consul http://127.0.0.1:8500
{% endhighlight %}

That way, anyone using `path/to/lock` as lock and this Consul server will have to respect the lock.

In this case, the lock will be materialized by a key-value pair in Consul, the key being at the
specified path.

<h3 id="resume-from">3.2 Resume from step</h3>

This release introduces a `--resume-from` flag to be able to resume the EMR job from a particular
step, it's particularly useful when recovering from a failed step.

The steps you can resume from are, in order:

* `enrich`
* `shred`
* `elasticsearch`
* `archive_raw`
* `rdb_load`
* `analyze`
* `archive_enriched`

For example if your Redshift load failed due to a maintenance window, you might want to relaunch EmrEtlRunner with:

{% highlight bash %}
./snowplow-emr-etl-runner run \
  -c            config.yml \
  -r            resolver.json \
  --resume-from rdb_load
{% endhighlight %}

<h3 id="start-end">3.3 Removal of the start and end flags</h3>

The `--start` and `--end` flags, which used to allow you to process files for a specific time period
have been removed. This is because the new S3DistCp-based staging process doesn't inspect the timestamps in the filenames.

<h3 id="enrich-shred">3.4 Removal of the process-enrich and process-shred flags</h3>

The `--process-enrich` and `--process-shred` options, which let you run only the `enrich` step, and `shred` step
respectively, have also been retired, to simplify the EmrEtlRunner.

<h2 id="upgrading">4. Upgrading</h2>

The latest version of EmrEtlRunner is available from our [Bintray][app-dl].

Upgrading is fairly straightforward, you'll just need to make use of the new `run` command when launching EmrEtlRunner - no other changes are necessary.

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases include:

* [R92 [STR] Virunum][r92], a general upgrade of the apps constituting our stream processing pipeline
* [R9x [BAT] 4 webhooks][r9x-webhooks], which will add support for 4 new webhooks (Mailgun, Olark, Unbounce, StatusGator)

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on Github.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r91-stonehenge

[stonehenge]: https://en.wikipedia.org/wiki/Stonehenge
[stonehenge-img]: /assets/img/blog/2017/08/stonehenge.jpg

[sluice]: https://github.com/snowplow/sluice
[df-runner]: https://github.com/snowplow/dataflow-runner

[eer-rfc]: http://discourse.snowplowanalytics.com/t/splitting-emretlrunner-into-snowplowctl-and-dataflow-runner/350
[discourse]: http://discourse.snowplowanalytics.com/

[app-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r91_stonehenge.zip

[i3364]: https://github.com/snowplow/snowplow/issues/3364

[r92]: https://github.com/snowplow/snowplow/milestone/135
[r9x-webhooks]: https://github.com/snowplow/snowplow/milestone/129

[s3-dist-cp]: http://docs.aws.amazon.com/emr/latest/ReleaseGuide/UsingEMR_s3distcp.html
[consul]: https://www.consul.io
