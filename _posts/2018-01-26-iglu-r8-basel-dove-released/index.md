---
layout: post
title: Iglu R8 Basel Dove released
title-short: Iglu R8 Basel Dove
tags: [iglu, json, json schema, redshift]
author: Oguzhan
category: Releases
permalink: /blog/2018/01/26/iglu-r8-basel-dove-released/
---

We are excited to announce a new Iglu release, Basel Dove, introducing a good number of improvements focused on igluctl.

1. [Switch from severity levels to skipping linters](#skip-checks)
2. [Warning about missing schema versions](#missing-schema-versions)
3. [New linters](#new-linters)
4. [Setting owner of Redshift tables](#set-owner)
5. [Other updates](#other-updates)
6. [Getting Help](#help)

Read on for more information on Release 8 Basel Dove, named after [a Swiss postage stamp][basel-dove], the first tricolor stamp in the world.

![basel-dove-img] [basel-dove-img]

<!--more-->

<h2 id="skip-checks">1. Switch from severity levels to skipping linters</h2>

`SeverityLevel` concept was introduced with intention that higher the level, tougher the linting where each level is a set of pre-determined linters. However, most straightforward drawback with this approach is not letting igluctl users choose which linters to be used or not to be used. We've come to a point that we think it isn't about tougher/lighter set of linters but a set of wanted linters. As of this release, we decided to say goodbye to `--severity-level` and introduce `--skip-checks` optional parameter to igluctl's `lint` command. As the name indicates, `lint` command doesn't use user provided linters for validating schemas.

`--skip-checks` accepts comma separated linter names and currently available linters are as following; `rootType`, `minimumMaximum`, `minMaxLength`, `maxLengthRange`, `minMaxItems`, `numberProperties`, `stringProperties`, `objectProperties`, `arrayProperties`, `possibleKeys`, `unknownFormats`, `minMaxPresent`, `maxLength`, `optionalFields`, `descriptionPresent`. By default, all of them are included.

<h2 id="missing-schema-versions">2. Warning about missing schema versions</h2>

Assume that a user creates an ADDITION schema (1-0-1 with new fields) and then generates DDL through `igluctl static generate /path/to/schemas/file` command. Igluctl will output DDL where new columns will be added in the middle of the table, whereas new fields should always be in the end of table. With this release, we introduce a new alert mechanism as following;

<ul>
  <li>If user specified folder and one of schemas has no 1-0-0 or misses any other schemas in between (like it has 1-0-0 and 1-0-2) - refuse to do anything (but proceed with --force option)</li>
  <li>If user specified full path to file with schema and this file is not 1-0-0 - just print a warning</li>
  <li>If user specified full path to file with schema and it is 1-0-0 - all good</li>
</ul>

<h2 id="new-linters">3. New linters</h2>

Basel Dove adds some new linting features to igluctl's `lint` command, which should allow you to avoid subtle mistakes in your schema.

<h3 id="missing-linter">3.1 Linting missing schema versions</h3>

Beside igluctl's `static generate` command, `lint` command will also warn about missing schema versions. This new linting feature is used by default and can not be excluded through `--skip-checks`.

<h3 id="description-linter-2">3.2 Linting description</h3>

[Mike Robbins][miike] of Snowflake Analytics came up with the proposal and PR for making sure fields have a `description` in addition to `type` field. Huge thanks, Mike!

<h2 id="set-owner">4. Setting owner of Redshift tables</h2>

It is frequently forgotten to set owner of Redshift tables after generating DDLs. With this release, we are introducing `--set-owner` parameter to igluctl's `static generate` command. It is provided with a string and igluctl will append an ALTER statement at the end of DDL.

<h2 id="other-updates">5. Other updates</h2>

Basel Dove brings few small adjustments too.

Header part of DDLs contain an auto-generated comment section with project related information. As of now, it will also contain when that DDL was generated in UTC.

Another improvement is regarding compression type used in Redshift tables. [Mike Robbins][miike] of Snowflake Analytics suggested using [ZSTD] over [LZO] as default compression type by performing testing different datasets and implementation. He made it possible, thanks a lot Mike!

Basel Dove also fixes [an important bug][i-313] in igluctl, which could generate false failure messages even though `static push` command executed successfully.

<h2 id="help">6. Getting help</h2>

For more details on this release, as always do check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[iglu-release]: https://github.com/snowplow/iglu/releases/r8-basel-dove
[discourse]: http://discourse.snowplowanalytics.com/
[changelog]: https://github.com/snowplow/iglu/blob/master/CHANGELOG

[basel-dove]: https://en.wikipedia.org/wiki/Basel_Dove
[basel-dove-img]: /assets/img/blog/2018/01/Basel_Dove.jpg
[zstd]: https://docs.aws.amazon.com/redshift/latest/dg/zstd-encoding.html

[miike]: https://github.com/miike

[i-313]: https://github.com/snowplow/iglu/issues/313
