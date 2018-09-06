---
layout: post
title-short: Right to be forgotten spark job released
title: "Right to be forgotten (R2F) spark job released"
tags: [snowplow, gdpr, pii]
author: Kostas
category: Releases
permalink: /blog/2018/09/01/r2-released/
---

We are pleased to announce the release of the [R2F (Right to be forgotten)][r2f-release] spark job.

This is a stand-alone spark job that removes rows from the enriched event archive which contain specific PII identifiers. It is intended for Snowplow users to easily remove data about a specific user, when the data subject has requested it under the "right to be forgotten" in GDPR.

From the point of view of a user deploying snowplow, this job falls under the new category of "housekeeping" jobs, which are background tasks, meant to optimise or, in this case, clean up data.

In terms of data protection this implements the right of data subjects to request erasure of their data, as it is specified under Article 17 of the [GDPR][eugdpr].

Please read on for:

1. [The Right to be Forgotten](#right-to-be-forgotten)
2. [Running R2F](#running)
3. [Further considerations](#considerations)
4. [Help](#help)

<h2 id="right-to-be-forgotten">1. The Right to be Forgotten</h2>

Even before [GDPR][eugdpr], many users of information services were concerned that their actions and behavior would be recorded and be available to the data controller, long after the consent or interaction that justified the data to be recorded and processed had ceased.

Under the [GDPR][eugdpr], the EU created a clear regulation describing the obligations of data controllers and specifically the data subject's right to be forgotten.
While the regulation has special provisions for freedom of expression, in general, maintaining and processing personally identifiable information is now [conditional][ico-basis] and [time-limited][commission-time-limit], thus addressing a significant policy gap between individual rights vs commercial interests.

To help our clients along the path of responsible data processing, we have included a number of features to help pseudonymize data in the main Snowplow pipeline under releases [R100][r100-blog] and [R106][r106-blog].
Alongside these efforts, we also released [Piinguin][piinguin-blog] in order to better manage the re-identification, should that be necessary. 

The current release of R2F addresses the requirement to remove archive data pertaining to a data subject. Under GDPR "[Article 17 - Right to erasure (‘right to be forgotten’)][eurlex]" the data subject can request the erasure and the controller, usually is obliged to act (see also [EU commission example][commission]).

Trying to come up with a way to remove data from the snowplow archive when that happens can lead to errors and possibly miss the "without undue delay" condition and to address that need we have created the R2F spark job.

<h2 id="#running">2. Running R2F</h2>

Running R2F requires a "removal criteria" file in order to match the rows to be erased. The file consists of rows of a single JSON self-describing datum which conforms to the [iglu schema here][removal-criteria-iglu-schema]. 
As can be seen from the schema, it expects a single criterion of either `json` or `pojo` fields. Special care needs to be taken that the value uniquely identifies an individual as there is a chance (e.g. when using an IP address) that it does not and more data than intended is erased.
To avoid that, an additional argument needs to be provided to the spark job that specifies the maximum proportion of rows from the archive that you expect to be matched in that execution (e.g. 0.5 for half), as a safeguard. The job will fail if that number is exceeded.

So in your spark installation (assumed to be EMR for this example) all you would need to do is:

```bash
spark-submit \
    --master yarn \
    --deploy-mode client ./snowplow-right-to-be-forgotten-job-0.1.0.jar \
    --removal-criteria s3://snowplow-data-<mycompany>/config/to_be_forgotten.json \
    --input-directory s3://snowplow-data-<mycompany>/enriched/archive/ \
    --non-matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --maximum-matching-proportion 0.01
```

The R2F arguments are:

* `--removal-criteria` (in this example `s3://snowplow-data-<mycompany>/config/to_be_forgotten.json`): 
        This is the URL of the removal criteria file containing the criteria for which an event will be removed form the archive.
* `--input-directory` (in this example `s3://snowplow-data-<mycompany>/enriched/archive/`):
        The directory that contains the snoplow data input
* `--non-matching-output-directory` (in this case `s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS>`):
        The directory that contains all data that do not match the criteria
* (Optional) `--matching-output-directory` (in this case `s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS>`):
        The directory that contains the matching output
* `--maximum-matching-proportion` (In this case `0.01`):
        The maximum proportion of the input events that are allowed to match. If the actual proportion is higher the job will fail.

This process does not preserve the directory structure under the `enrihed archive` (namely the `run=<runid>` subfolders).

<h2 id="#considerations">3. Further considerations</h2>

As you can see in the [running](#running) section, there is an argument called `maximum-matching-proportion` which is a safeguard for the case that you have chosen a value as removal criterion that corresponds to many rows.

This is a very coarse filter that will only catch the worst cases where that happens. 
So far we haven't identified a generic enough solution to catch for sure all cases where the user has made a mistake like that but there are some ideas about other safeguards (and of course new ideas are welcome, so please submit a [new issue on github][repo-issues] if you have).
Until other measures are implemented in R2F it is sensible to have some other measures in place to catch that issue downstream (for instance a weekly or monthly sanity check in the target database).
Of course in order to recover from such an issue you need to have a backup of the data which is hard to do while also meeting the requirement to erase all data for a certain client.
One solution is to keep the old archive in another bucket or prefix (in the case of S3) which will automatically expire through some sort of object life cycle policy and/or versioning.
Whichever solution to this problem you choose, we would like to hear about your experience on [discourse][discourse]

<h2 id="#help">4. Help</h2>

For more details on this release, as always do check out the [release notes][r2f-release] and the [wiki page][r2f-wiki] on GitHub.

If you have any questions or run into any problems, please raise a question in [our Discourse forum][discourse].

[r2f-release]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/releases/tag/0.1.0
[eugdpr]: https://www.eugdpr.org/
[eurlex]: https://eur-lex.europa.eu/legal-content/EN/TXT/?qid=1528874672298&uri=CELEX%3A32016R0679
[commission]: https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/dealing-citizens/do-we-always-have-delete-personal-data-if-person-asks_en
[ico-basis]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/
[commission]: https://ec.europa.eu/info/law/law-topic/data-protection/reform/rules-business-and-organisations/principles-gdpr/how-long-can-data-be-kept-and-it-necessary-update-it_en
[r100-blog]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[r106-blog]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/
[piinguin-blog]: https://snowplowanalytics.com/blog/2018/08/08/piinguin-snowplow-pii-usage-management-service-released/
[removal-criteria-iglu-schema]: https://raw.githubusercontent.com/snowplow/iglu-central/master/schemas/com.snowplowanalytics.snowplow.r2f/removal_criteria/jsonschema/1-0-0
[repo-issues]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/issues
[discourse]: https://discourse.snowplowanalytics.com/
[r2f-wiki]: https://github.com/snowplow-incubator/right-to-be-forgotten-spark-job/wiki