---
layout: post
title: Iglu R8 Basel Dove released
title-short: Iglu R8 Basel Dove
tags: [iglu, json, json schema, redshift]
author: Oguzhan
category: Releases
permalink: /blog/2018/02/06/iglu-r8-basel-dove-released/
---

We are excited to announce a new Iglu release, introducing a good number of improvements focused on our igluctl CLI tool.

1. [Switch from severity levels to granular linting](#skip-checks)
2. [Dealing with inconsistent schema versions](#missing-schema-versions)
3. [ZSTD encoding support for Redshift](#zstd)
4. [New linters](#new-linters)
5. [Setting ownership of Redshift tables](#set-owner)
6. [Other updates](#other-updates)
7. [Getting help](#help)

Read on for more information about Release 8 Basel Dove, named after [a Swiss postage stamp][basel-dove] - the first tricolor stamp in the world.

![basel-dove-img][basel-dove-img]

<!--more-->

<h2 id="skip-checks">1. Switch from severity levels to granular linting</h2>

In [igluctl 0.2.0][iglu-r6-release] we introduced the concept of severity levels for our schema linting, to help schemas meet higher standards during the authoring process. However, time has shown that different use cases imply different ideas of "higher standards", and the lint levels approach lacks the flexibility required to cover all these use cases.

As of this release, igluctl 0.4.0 always defaults to our previous strictest level (known before as `severityLevel 3`), but you can then explicitly switch off certain bundles of *checks* or *linters*.

To reduce the linting strictness, the `--skip-checks` accepts a list of comma-separated pre-defined linter names, for example:

{% highlight bash %}
$ igluctl lint --skip-checks descriptionPresent,optionalFields $SCHEMAS_PATH
{% endhighlight %}

The above linting will not notify user that some fields miss `description` property, and it will ignore that some fields are only implicitly optional (missing the `null` type that makes them explitly optional).

For the full list of available checks, their descriptions and their use cases, please see the [igluctl wiki page][igluctl-lint].

<h2 id="missing-schema-versions">2. Dealing with inconsistent schema versions</h2>

Each schema format has its own primary use case, leading to certain design choices that in turn can bring particular features as well as limitations.
Very different use cases and design choices can make it hard to convert one format into another, especially if we want to keep using advantages of both formats and have working migrations.
Schema DDL, an underlying Iglu library responsible for format-transformations solves this problem by applying a predefined and strict set of rules during the transformation.

Redshift DDL and JSON Schema, two most popular formats among Iglu users form exactly this loose connection, where among many inconsistencies column order becomes one of the most important.
Specifically, JSON does not preserve order of keys, but for Redshift which is a relational columnar data storage, columns order is crucial - it is worth nothing to append new column to the end of the table, but very troublesome to insert one into the middle.
In a slightly oversimplified fashion, Schema DDL applies two rules here: lexicographical and "required-columns-first".

This simple rule works very well until user doesn't create 


TODO THIS SECTION DOESN'T MAKE SENSE. RE-WRITE IT TO EXPLAIN THE ACTUAL PROBLEM:

* JSON Schema is un-ordered
* Redshift tables are ordered, therefore
* we need to come up with an ordering system,
* we chose this ordering system: foobar
* This is great, but it means that a schema 1-0-5 is not sufficient to know what the column order should be,
* you need to know which columns were introduced by which schema
* therefore to generate Redshift DDL, you must have access to all the tables
* otherwise you will generate incorrect tables
* Then discuss the actual changes in R8.

TODO ENDS 

All schemas in Iglu registries within a single `MODEL` version (e.g. `1-x-x`) are expected to relate to each other in a specific way, and this relationship is very important for proper DDL derivation, especially when it comes to column-oriented storage such as Amazon Redshift.

This means that, in order to generate consistent and correct Redshift DDL, igluctl *must* be aware of all previously available schemas within the `MODEL` version.

Until this Iglu release, it was possible to specify a folder containing **only** a `1-0-1` schema, and the `static generate` command would output DDL file treating this as the initial and sole available schema. At the same time, if the initial and "lost" `1-0-0` schema didn't have some new columns added in `1-0-1` - these new columns will be mixed into the middle of DDL, effectively making DDL corrupted and migration impossible.

Starting from Basel Dove, it is almost impossible to generate this corrupted DDL by mistake.
New igluctl adds following additional checks and associated alerts to prevent it:

* If user specified folder as input and among schemas there's no 1-0-0 or any other schemas in between - refuse to do anything (but proceed with `--force` option at your own risk)
* If user specified full path to file with schema and this file is not 1-0-0 - print a warning
* In all other cases - proceed as usual

This also can be considered as one more step towards consistent registries and therefore proper DDL migrations.

<h2 id="zstd">3. ZSTD encoding support for Redshift</h2>

In [Snowplow R95 Ellora][snowplow-r95] we migrated our [atomic.events][atomic-events] table to the much-anticipated [ZSTD encoding][zstd], which had a large positive impact on the storage space required in Redshift.

As of Basel Dove, ZSTD is now the default encoding in DDL files generated by igluctl - many thanks to [Mike Robbins][miike] of Snowflake Analytics for propelling this support forwards.

This isn't a breaking change in any way - all existing tables with LZO encoding will work as before. If you want to migrate existing tables to ZSTD, you will have to write and execute a migration script; an example `atomic.events` migration can be found in the [snowplow/snowplow repository][atomic-events-migration].

Updating the tables in Iglu Central to use ZSTS is something we are also considering - see [issue #720][iglu-central-zstd-issue] in that repo for details.

<h2 id="new-linters">4. New linters</h2>

Some more work has been done in igluctl 0.4.0 to improve litning mechanism, including the addition of two new linters.

<h3 id="missing-linter">4.1 Linting missing schema versions</h3>

The `lint` command will now also warn about missing schema versions TODO (inside schemas? somewhere else?) TODO ENDS. This new linting feature is considered essential and cannot be excluded through `--skip-checks`.

<h3 id="description-linter-2">4.2 Linting description</h3>

[Mike Robbins][miike] of Snowflake Analytics came up with the proposal and PR for making sure fields have a human-readable `description` property in order to make schemas more maintainable.

TODO ADD SENTENCE TO EXPLAIN HOW THIS INTERACTS WITH `--skip-checks` TODO ENDS.

<h2 id="set-owner">5. Setting ownership of Redshift tables</h2>

A common problem we hear is that Iglu users forget to set the owner of their Redshift tables after generating and applying their DDL scripts.

With this release, we are introducing a `--set-owner` parameter to igluctl's `static generate` command. It expects the new table owner as its argument, and causes igluctl append an `ALTER TABLE` statement at the end of DDL; when applied this will ensure that the Redshift table has the correct owner.

<h2 id="other-updates">6. Other updates</h2>

R8 Basel Dove brings a few small adjustments too.

The header part of igluctl-generated Redshift DDLs contains an auto-generated comment section with project-related information. As of this release, it will contain the DDL generation time in UTC, instead of local time.

Basel Dove also fixes [an important bug][issue-313] in igluctl, which could, confusingly, generate incorrect failure messages even though the `static push` command had in fact executed successfully.

<h2 id="help">7. Getting help</h2>

For more details on this release, as always do check out the [release notes][release-notes] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[release-notes]: https://github.com/snowplow/iglu/releases/r8-basel-dove
[discourse]: http://discourse.snowplowanalytics.com/

[basel-dove]: https://en.wikipedia.org/wiki/Basel_Dove
[basel-dove-img]: /assets/img/blog/2018/02/Basel_Dove.jpg
[zstd]: https://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html

[snowplow-r95]: https://snowplowanalytics.com/blog/2017/11/13/snowplow-r95-ellora-released-with-zstd-support/
[atomic-events]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/atomic-def.sql
[atomic-events-migration]: https://github.com/snowplow/snowplow/blob/master/4-storage/redshift-storage/sql/migrate_0.8.0_to_0.9.0.sql

[iglu-r6-release]: https://snowplowanalytics.com/blog/2016/10/07/iglu-r6-ceres-released/#severity
[igluctl-lint]: https://github.com/snowplow/iglu/wiki/Igluctl#lint

[miike]: https://github.com/miike

[issue-313]: https://github.com/snowplow/iglu/issues/313
[iglu-central-zstd-issue]: https://github.com/snowplow/iglu-central/issues/720
