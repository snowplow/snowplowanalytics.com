---
layout: post
title-short: Right to be Forgotten Spark job
title: "Right to be Forgotten Spark job released for meeting GDPR requirements"
tags: [snowplow, gdpr, pii, r2f]
author: Kostas
category: Releases
permalink: /blog/2018/10/29/right-to-be-forgotten-spark-job-released-for-meeting-gdpr-requirements/
---

We are pleased to announce the release of our [R2F (Right to be Forgotten)][r2f-release] Spark job.

This is a stand-alone Spark job that removes rows from your Snowplow enriched events archive in Amazon S3, based on specific PII identifiers. It lets Snowplow users easily remove data about a specific user, when the data subject has requested it when exercising his or her "right to be forgotten" under Article 17 of the [GDPR][eugdpr].

For those deploying Snowplow, the R2F job falls under the new category of "housekeeping" jobs which are background tasks meant to optimize or clean up data (as in this case).

Please read on for:

1. [The GDPR's Right to be Forgotten](#right-to-be-forgotten)
2. [Running the R2F Spark job](#running)
3. [Further considerations](#considerations)
4. [Help](#help)

<!--more-->

<h2 id="right-to-be-forgotten">1. The GDPR's Right to be Forgotten</h2>

Even before [GDPR][eugdpr], many users of information services were concerned that their actions and behavior would be recorded and be available to the data controller, long after the consent or interaction that justified the data to be recorded and processed had ceased.

Under the [GDPR][eugdpr], the EU created a clear regulation describing the obligations of data controllers with specific attention being paid to a data subject's right to be forgotten.

While the regulation has special provisions for freedom of expression, in general, maintaining and processing personally identifiable information is now [conditional][ico-basis] and [time-limited][commission-time-limit], thus addressing a significant policy gap between individual rights and commercial interests.

To help Snowplow users along the path of responsible data processing, we have included a number of features to help pseudonymize data in the main Snowplow pipeline under releases [R100][r100-blog] and [R106][r106-blog]. Alongside these efforts, we also released [Piinguin][piinguin-blog] in order to better manage re-identification, should that be necessary.

Under GDPR's [Article 17 - Right to erasure ('right to be forgotten')][eurlex], the data subject can request the erasure and the data controller, usually, is obliged to act (see also [this example from the EU Commission][commission]).

As the operator of a Snowplow pipeline, you will want to remove data from a Snowplow event archive in Amazon S3 following an R2F request in a reliable and timely ("without undue delay") fashion. To address this need, we created the Right to be Forgotten Spark job; this complements our existing tutorials for removing R2F data from [Redshift][r2f-redshift] and [Snowflake][r2f-snowflake].

<h2 id="running">2. Running the R2F Spark job</h2>

Running the R2F Spark job requires a "removal criteria" file in order to match the events to be erased.

The file consists of rows of a single JSON self-describing datum which conforms to the [JSON Schema here][removal-criteria-iglu-schema]. As can be seen from the schema, it expects a single criterion of either `json` or `pojo` fields.

Special care needs to be taken that the value uniquely identifies a single individual, as there is a chance (e.g. when using an IP address) that it does not and more events than intended could be erased.

To avoid that, an argument should be provided to the Spark job that specifies the maximum proportion of rows from the archive that you expect to be matched in that execution (e.g. 0.01 for 1%), as a safeguard. The job will fail if that number is exceeded.

Here is an example of running the R2F job against Elastic MapReduce:

{% highlight bash %}
spark-submit \
    --master yarn \
    --deploy-mode client ./snowplow-right-to-be-forgotten-job-0.1.0.jar \
    --removal-criteria s3://snowplow-data-<mycompany>/config/to_be_forgotten.json \
    --input-directory s3://snowplow-data-<mycompany>/enriched/archive/ \
    --non-matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --maximum-matching-proportion 0.01
{% endhighlight %}

The R2F arguments are:

* `--removal-criteria` (in this example `s3://snowplow-data-<mycompany>/config/to_be_forgotten.json`): this is the URL of the removal criteria file containing the criteria for which events will be removed from the archive
* `--input-directory` (in this example `s3://snowplow-data-<mycompany>/enriched/archive/`): the directory that contains the Snowplow event archive
* `--non-matching-output-directory` (in this example `s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS>`): the directory to write out allevents that do **not** match the criteria
* `--matching-output-directory` (in this example `s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS>`): the directory that contains the matching output. Optional
* `--maximum-matching-proportion` (in this example `0.01`): the maximum proportion of the input events that are allowed to match. If the actual proportion is higher the job will fail

**Note:** when writing out the filtered output, the R2F Spark job does not preserve the directory structure found within the enriched archive, specifically the `run=<runid>` subfolders.

<h2 id="considerations">3. Further considerations</h2>

<h3>Overzealous deletion of data</h3>

As you can see in the [running](#running) section, there is an argument called `maximum-matching-proportion` which is a safeguard in case that you have provided a value as removal criterion that corresponds to many events across many users.

This is a very coarse filter that will only catch the worst cases of excessive deletion; we have yet to identify a generic enough solution to reliably catch all cases where the user has mistakenly selected an overly-wide removal criterion. However, we continue to explore alternative safeguards - and of course new ideas are always welcome, so please submit a [new issue on GitHub][repo-issues] if you have one.

Until other measures are implemented in the R2F Spark job, it is sensible to have some other measures in place to catch issues downstream, for instance a weekly or monthly sanity check in the target database.

Of course, in order to recover from such an issue, you need a backup of the data, which is hard to do while also meeting the requirement to erase all such data. One solution could be to keep the old archive in another bucket or prefix (in the case of S3), eventually automatically expiring through some sort of object life cycle policy and/or versioning.

Whichever solution to this problem you choose, we would like to hear about your experiences on [Discourse][discourse].

<h3>Size of removal criteria file</h3>

It is assumed that the file is small enough to fit in memory in each executor. Back of the envelope calculations show that this is a reasonable assumption; this approach simplifies the code and also makes execution very fast.

If you find that your removal criteria file size breaks the Spark job, please submit a [new issue on GitHub][repo-issues] or even better a PR.

<h2 id="help">4. Help</h2>

For more details on this release, as always do check out the [release notes][r2f-release] and the [wiki page][r2f-wiki] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[r2f-release]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/releases/tag/0.1.0
[eugdpr]: https://www.eugdpr.org/
[eurlex]: https://eur-lex.europa.eu/legal-content/EN/TXT/?qid=1528874672298&uri=CELEX%3A32016R0679
[commission]: https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/dealing-citizens/do-we-always-have-delete-personal-data-if-person-asks_en
[ico-basis]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/
[commission-time-limit]: https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/principles-gdpr/how-long-can-data-be-kept-and-it-necessary-update-it_en
[r100-blog]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[r106-blog]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/
[piinguin-blog]: https://snowplowanalytics.com/blog/2018/08/08/piinguin-snowplow-pii-usage-management-service-released/
[removal-criteria-iglu-schema]: https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow.r2f/removal_criteria/jsonschema/1-0-0
[repo-issues]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/issues
[discourse]: https://discourse.snowplowanalytics.com/
[r2f-wiki]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/wiki

[r2f-redshift]: https://discourse.snowplowanalytics.com/t/gdpr-deleting-customer-data-from-redshift-tutorial/1815
[r2f-snowflake]: https://discourse.snowplowanalytics.com/t/gdpr-deleting-customer-data-from-snowflake-tutorial/1848
