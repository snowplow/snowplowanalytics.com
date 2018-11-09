---
layout: post
title: SQL Runner 0.8.0 released
title-short: SQL Runner 0.8.0
tags: [sql, bigquery, gcp]
author: Rostyslav
category: Releases
permalink: /blog/2018/11/09/sql-runner-0.8.0-released/
---

We are pleased to announce [version 0.8.0][080-release] of [SQL Runner][repo]. With this release, we are adding support for running SQL queries on Google Cloud Platform's [BigQuery cloud data warehouse][bigquery].

1. [How to use](#usage)
2. [Upgrading](#upgrading)
3. [Getting help](#help)

<!--more-->

<h2 id="usage">1. How to use</h2>

To access BigQuery project, sql-runner will need some Google credentials. These can be set up by creating a new service account in the GCP console and downloading a JSON file that contains its key, then providing it to the application via a `GOOGLE_APPLICATION_CREDENTIALS` environment variable - a detailed walkthrough of this process is available on the [GCP documentation website][gcp-credentials].

After the credentials are set up, simply create a playbook with the following BigQuery-specific target configuration:

{% highlight yml %}
targets:
  - name: "My BigQuery database"
    type: bigquery
    project: ADD HERE # Project ID as shown in the GCP console's front page
variables:
  foo: bar
steps:
  - name: ADD HERE
    queries:
      - name: ADD HERE
        file: ADD REL/ABS PATH
        template: true
  - name: ADD HERE
    queries:
      - name: ADD HERE
        file: ADD REL/ABS PATH
        template: true
      - name: ADD HERE
        file: ADD REL/ABS PATH
        template: true
  - name: ADD HERE
    queries:
      - name: ADD HERE
        file: ADD REL/ABS PATH
        template: true
{% endhighlight %}

That's it - you're now ready to start running SQL against BigQuery.

<h2 id="upgrading">2. Upgrading</h2>

SQL Runner 0.8.0 is available as a standalone binary for 64-bit Linux, Windows and macOS on Bintray. Download them as follows:

{% highlight bash %}
# Linux
$ wget http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.8.0_linux_amd64.zip

# Windows
C:\> Invoke-WebRequest -OutFile sql_runner_0.8.0_windows_amd64.zip http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.8.0_windows_amd64.zip

# macOS
$ wget http://dl.bintray.com/snowplow/snowplow-generic/sql_runner_0.8.0_darwin_amd64.zip
{% endhighlight %}

Once downloaded, unzip it, for example with Linux:

{% highlight bash %}
$ unzip sql_runner_0.8.0_linux_amd64.zip
{% endhighlight %}

Run it like so:

{% highlight bash %}
$ ./sql-runner
sql-runner version: 0.8.0
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
  -showQueryOutput
      Will print all output from queries
  -softLock string
      Optional argument, like '-lock' but the lockfile will be deleted even if the run fails
  -sqlroot string
      Absolute path to SQL scripts. Use PLAYBOOK, BINARY and PLAYBOOK_CHILD for those respective paths (default "PLAYBOOK")
  -var value
      Variables to be passed to the playbook, in the key=value format
  -version
      Shows the program version
{% endhighlight %}

<h2 id="help">3. Getting help</h2>

For more details on this release, please check out the [SQL Runner 0.8.0 release notes][080-release] on GitHub.

If you have any questions or run into any problems, please [raise an issue][issues] or get in touch with us through [the usual channels][talk-to-us].

[bigquery]: https://cloud.google.com/bigquery/
[gcp-credentials]: https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually
[repo]: https://github.com/snowplow/sql-runner
[issues]: https://github.com/snowplow/sql-runner/issues
[080-release]: https://github.com/snowplow/sql-runner/releases/tag/0.8.0
[talk-to-us]: https://github.com/snowplow/snowplow/wiki/Talk-to-us
