---
layout: post
title: SQL Runner 0.7.0 released
title-short: SQL Runner 0.7.0
tags: [sql, postgres]
author: Mike
category: Releases
permalink: /blog/2018/08/15/sql-runner-0.7.0-released/
---

We are pleased to announce [version 0.7.0][070-release] of [SQL Runner][repo]. This release adds many new features including the printing out of query output, templated playbooks, the ability to view evaluated SQL file templates, and more:

1. [Viewing query output](#query-output)
2. [Templated playbooks](#templated-playbooks)
3. [Check SQL queries](#check-sql)
4. [Consul lock](#consul-lock)
5. [Other changes](#other-changes)
6. [Upgrading](#upgrading)
7. [Getting help](#help)

<!--more-->

<h2 id="query-output">1. Viewing query output</h2>

Version 0.7.0 introduces the ability to view output from queries. Using the `-showQueryOutput` flag will print all query results to the console formatted in a table, following each step.

{% highlight bash %}
$ ./sql-runner -showQueryOutput -playbook integration/resources/good-postgres.yml -var test_date=`date "+%Y_%m_%d"` -fromStep "Create schema and table"
...
2018/08/15 00:17:35 EXECUTING Output (in step Output @ My Postgres database 1): /opt/gopath/src/github.com/snowplow/sql-runner/integration/resources/postgres-sql/good/output.sql
2018/08/15 00:17:35 QUERY OUTPUT:
| AGE | FIRSTNAME |   CITY   | COUNTRY |
|-----|-----------|----------|---------|
|  18 | john      | new york | us      |
|  20 | ben       | london   | uk      |
|  32 |           |          |         |
...
{% endhighlight %}

<h2 id="templated-playbooks">2. Templated playbooks</h2>

The `-var` will now pass variables into playbooks, as it does with SQL files. This should be useful for treatment of secrets and credentials that you don't want to embed directly in playbooks.

Along with this, the `-var` flag also now permits multiple key-value pairs; the pairs must be comma separated (e.g. `key=value,key2=value2`), like so:

{% highlight bash %}
$ ./sql-runner -playbook integration/resources/good-postgres-with-template.yml -var password=,host=localhost
{% endhighlight %}

Many thanks to community member [dannymc129][dannymc129] for contributing these features!

<h2 id="check-sql">3. Check SQL queries</h2>

The new `-fillTemplates` flag will evaluate a SQL file, and print the query in the console, exactly how it would be run against the database. This can assist in debugging templated files, where it's useful to see the transformations around how variables are inserted into templates.

For example:

{% highlight bash %}
$ ./sql-runner -fillTemplates -playbook integration/resources/good-postgres-with-template.yml -var username=postgres,password=,host=localhost
{% endhighlight %}

Note that with the `-fillTemplates` flag, no SQL will actually be executed.

<h2 id="consul-lock">4. Consul locking</h2>

The new `-consulOnlyForLock` flag lets you run local playbooks, while using Consul for locking.

<h2 id="other-changes">5. Other changes</h2>

This release brings a whole host of other updates:

* A random number templating function has been added - use `randomInt` in your SQL templates. Thanks to community member [Tobi][tclass] for contributing this feature!
* SQL Runner now returns a dedicated exit code (8) if no queries are found to be run
* During dry run, SQL Runner will now attempt to connect to targets, printing corresponding `SUCCESS` and `ERROR` messages to the terminal
* Our Snowflake target configuration now lets you include `xxx`, the region variable for the default Snowflake region (previously this would error)
* Use of godep has been replaced with dep

<h2 id="upgrading">6. Upgrading</h2>

SQL Runner 0.7.0 is available as a standalone binary for 64-bit Linux, Windows and macOS on Bintray. Download them as follows:

{% highlight bash %}
# Linux
$ wget http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.7.0_linux_amd64.zip

# Windows
C:\> Invoke-WebRequest -OutFile sql_runner_0.7.0_windows_amd64.zip http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.7.0_windows_amd64.zip

# macOS
$ wget http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.7.0_darwin_amd64.zip
{% endhighlight %}

Once downloaded, unzip it, for example with Linux:

{% highlight bash %}
$ unzip sql_runner_0.7.0_linux_amd64.zip
{% endhighlight %}

Run it like so:

{% highlight bash %}
$ ./sql-runner
sql-runner version: 0.7.0
Run playbooks of SQL scripts in series and parallel on Redshift and Postgres
Usage:
  -checkLock string
      Checks whether the lockfile already exists
  -consul string
      The address of a consul server with playbooks and SQL files stored in KV pairs
  -consulOnlyForLock
      Will read playbooks locally, but use Consul for locking.
  -deleteLock string
      Will attempt to delete a lockfile if it exists
  -showQueryOutput
      Will print all output from queries
  -dryRun
      Runs through a playbook without executing any of the SQL
  -fillTemplates
      Will print all queries after templates are filled
  -fromStep string
      Starts from a given step defined in your playbook
  -help
      Shows this message
  -lock string
      Optional argument which checks and sets a lockfile to ensure this run is a singleton. Deletes lock on run completing successfully
  -playbook string
      Playbook of SQL scripts to execute
  -runQuery string
      Will run a single query in the playbook
  -softLock string
      Optional argument, like '-lock' but the lockfile will be deleted even if the run fails
  -sqlroot string
      Absolute path to SQL scripts. Use PLAYBOOK, BINARY and PLAYBOOK_CHILD for those respective paths (default "PLAYBOOK")
  -var value
      Variables to be passed to the playbook, in the key=value format
  -version
      Shows the program version
{% endhighlight %}

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [SQL Runner 0.7.0 release notes][070-release] on GitHub.

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[dannymc129]: https://github.com/dannymc129
[tclass]: https://github.com/tclass

[consul]: https://www.consul.io/
[repo]: https://github.com/snowplow/sql-runner
[issues]: https://github.com/snowplow/sql-runner/issues
[070-release]: https://github.com/snowplow/sql-runner/releases/tag/0.7.0
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us