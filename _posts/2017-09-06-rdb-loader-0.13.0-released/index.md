---
layout: post
title: "RDB Loader 0.13.0 released"
title-short: RDB Loader Loader 0.13.0
tags: [redshift, postgres, shred, relational databases, storage]
author: Anton
category: Releases
permalink: /blog/2017/09/06/rdb-loader-0.13.0-released/
---

We are thrilled to announce [version 0.13.0][release-0130] of Relational Database Loader, 
our Snowplow component that lets you load your data into relational databases such as Redshift and PostgreSQL.

This release marks the migration of our RDB Loader and RDB Shredder apps from part of the `snowplow/snowplow` "mono-repo" into an independent project with its own release cadence.

<!--more-->

In this post, we will cover:

1. [Dedicated repository](/blog/2017/09/06/rdb-loader-0.13.0-released#separate-project)
2. [Single folder load](/blog/2017/09/06/rdb-loader-0.13.0-released#folder)
3. [Dry run](/blog/2017/09/06/rdb-loader-0.13.0-released#dry-run)
4. [Other changes](/blog/2017/09/06/rdb-loader-0.13.0-released#other)
5. [Upgrading](/blog/2017/09/06/rdb-loader-0.13.0-released#upgrading)
6. [Contributing](/blog/2017/09/06/rdb-loader-0.13.0-released#contributing)

<h2 id="separate-project">1. Dedicated repository</h2>

Historically, the main [snowplow/snowplow repository][snowplow-repo] contained all components required to load Snowplow enriched events into different databases.

This approach worked relatively well while Amazon Redshift was our primary storage target, but we're steadily moving towards supporting multiple databases as first-class citizens in the Snowplow pipeline.

As a result, we are starting to publish new standalone Snowplow loaders in their own repositories: the first was [Elasticsearch Loader][es-loader-090], we are adding RDB Loader, and there are more to come!

The dedicated repositories have a few advantages:

1. De-couple loader releases from the "full-fat" Snowplow release
2. Emphasize the loosely-coupled architecture of Snowplow, encouraging a clear separation of concerns
3. Faster to review and accept community contributions
4. Easier to track the Git history of the component

Note that, alongside the RDB Loader itself, the RDB Shredder (written as a Spark job), now also resides in the new repository. The two apps were always tightly coupled, sharing a lot of logic.

<h2 id="folder">2. Single folder load</h2>

It's sometimes useful for a Snowplow pipeline operator to load a single archived directory of enriched events into a Redshift database - for example as part of a pipeline recovery process.

Before 0.13.0, the only way to do this was to copy or move the directory from the archive to `shredded.good`, and then launch the pipeline without the Spark Enrich and RDB Shredder jobs, pretending that they're already completed. But file moves like these are slow and error-prone, so we are now introducing a new `--folder` option, which allows you to load exactly one directory using only RDB Loader.

This is not yet supported from within EmrEtlRunner, so you have to either run it locally using a helper script, or write a Dataflow Runner playbook with Base64-encoded config files instead of file paths.

Here is an invocation example:

{% highlight bash %}
$ java -jar $JARFILE \
  --config $BASE64_CONFIG \
  --target $BASE64_TARGET \
  --resolver $BASE64_RESOLVER \
  --folder s3://com-acme-snowplow/archive/shredded/run=2017-09-05-13-30-22 \
  --logkey s3//com-acme-snowplow/log/rdb-loader/$(uuid) 
{% endhighlight %}

You can find a full wrapper Bash script in our recent [discourse post][discourse-r90-alert].

Note that RDB Loader uses the [AWS Credential Provider Chain][aws-credentials-chain], which means RDB Loader will use credentials provided at user-level (such as `~/.aws/credentials` file of environment variables) credentials, not the ones in `config.yml`.

<h2 id="dry-run">3. Dry run</h2>

Another new feature, especially useful for pipeline recovery, is the new `--dry-run` option. This will provide you with a full list of all the SQL statements that would be executed to perform the load, were dry run mode *not* enabled.

Statements will be printed to standard output along with other important debug information.

You can use this to inspect these statements, or potentially to tweak them and execute them manually, if you need to work around a load issue.

<h2 id="other">4. Other changes</h2>

As part of a regular run, RDB Loader performs data discovery at least twice to make sure that S3 provides consistent results, and no "ghost files" are lingering which will break the `COPY` statements.

If you don't need this (for example when performing a single folder load), you can skip this now, along with other steps, by adding the `--skip consistency_check` option:

{% highlight bash %}
$ java -jar $JARFILE \
  --skip consistency_check \
  --config $BASE64_CONFIG \
  --target $BASE64_TARGET \
  --resolver $BASE64_RESOLVER \
  --folder s3://com-acme-snowplow/archive/shredded/run=2017-09-05-13-30-22 \
  --logkey s3//com-acme-snowplow/log/rdb-loader/$(uuid) 
{% endhighlight %}

Finally, one important [bug][issue-3] was fixed. This flaw in the way that JSON Paths files were cached lead to excessive S3 requests, which could significantly slow down the shredded-type discovery process.

<h2 id="upgrading">5. Upgrading</h2>

The primary way to run RDB Loader is still via Snowplow's own EmrEtlRunner, Release 90 and above. You will need to update your `config.yml`:

{% highlight yaml %}
storage:
  versions:
    rdb_loader: 0.13.0        # WAS 0.12.0
{% endhighlight %}

<h2 id="contributing">6. Contributing</h2>

You can check out the [repository][repo] and the [open issues](https://github.com/snowplow/snowplow-rdb-loader/issues?utf8=✓&q=is%3Aissue%20is%3Aopen%20) if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[repo]: https://github.com/snowplow/snowplow-rdb-loader
[release-0130]: https://github.com/snowplow/snowplow-rdb-loader/releases/tag/0.13.0

[issue-3]: https://github.com/snowplow/snowplow-rdb-loader/issues/3

[snowplow-repo]: https://github.com/snowplow/snowplow
[es-loader-090]: https://snowplowanalytics.com/blog/2017/07/21/elasticsearch-loader-0.9.0-released/

[aws-credentials-chain]: http://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/credentials.html#credentials-default

[discourse-r90-alert]: https://discourse.snowplowanalytics.com/t/important-alert-r90-r91-bug-may-result-in-shredded-types-not-loading-into-redshift-after-recovery/1422

[discourse]: http://discourse.snowplowanalytics.com/
