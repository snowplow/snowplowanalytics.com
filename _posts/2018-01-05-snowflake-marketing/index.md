--
layout: post
title: "Snowflake DB and the future of Snowplow storage targets"
title-short: Snowflake DB and more
tags: [company roadmap, databases]
author: Anthony
category: Releases
permalink: /blog/2018/01/05/snowflake-db-and-the-future-of-snowplow-storage-targets/
description: "The first additional storage target on our multi-cloud roadmap"
---

![databases][database]

Recently, we announced [one of our most major updates][snowflake-db] to the Snowplow platform- support for the Snowflake Computing database solution. The ability to load your Snowplow data directly into Snowflake DB has been a much requested feature, with many of our users either already utilizing Snowflake for part of their data stack or eager to migrate to this newly available database. Snowflake has, for a long time now, been growing in popularity for its rapid and flexible ability to scale compute and storage separately, making it a great choice for companies that want to make massive data sets (like those delivered by Snowplow, for example) accessible to a large number of business users, all in a cost-effective and convenient manner.

Our mission at Snowplow has always been to deliver to users event level data in a way that incorporates into their desired data infrastructure while remaining cutting-edge. The Snowflake DB is the most recent in a series of storage targets that have evolved with our users and the developing field of data analytics. In many ways, the history of Snowplow data storage targets closely parallels the advancements of data collection as a discipline.

<h2 id="changing with the times">Changing with the times</h2>

The original version of Snowplow, launched six years ago, was a far cry from the mature analytics platform we have today. Our collector was a simple pixel on Amazon Cloudfront. S3 was our primary storage target and our principle way of analyzing Snowplow data was to run Apache Hive on EMR on the log files in S3. Though it’s hard to remember today, there was a huge amount of excitement around Hive because it made running SQL statements of large data possible where previously this wasn’t possible. Just this gave our earliest users much more querying flexibility than any packaged web analytics solution was able to offer.

However, querying data using Hive on EMR was not an ideal setup: spinning up EMR clusters, connecting via SSH, and running Hive queries through the terminal was a cumbersome process and took many data analysts far out of their comfort zones. Initially, we were just delighted that it worked, that we were able to run a SQL query on a database with billions of rows, even if it took three hours to complete. But, soon that delight morphed into frustration as we began seeking ways to reduce that three hour run time.

You can imagine our excitement, therefore, to extend Snowplow so that we could load data into Infobright, a popular, open source columnar database. Columnar databases, like Infobright offered a different approach to enabling users to query big data sets in a performant way to Hive on Hadoop. Whilst this wasn’t as scalable as Hadoop, it was scalable enough for the vast majority of our users. It was significantly faster than EMR. Arguably the most important feature was Infobright’s MySQL API which allowed our users to plug in popular business intelligence tools directly on top of Snowplow data, freeing analysts from being forced to work with the data directly in SQL through the terminal, and making it possible to socialize the Snowplow data much more widely in an organization.

<h2 id="work hard have fun make data history">Work hard. Have fun. Make data history.</h2>

We were thrilled when, in November of 2012, AWS announced Redshift, their own “fully managed” columnar database. With just a few simple clicks in the AWS UI, you had a scalable, affordable columnar database. Within two weeks of Redshift’s launch we had built out support to load Snowplow data directly into Redshift. Nearly six years later, Redshift is still the primary storage target for Snowplow users.

At this time, you were hard pressed to find any alternative single-ecosystem data solutions similar to what Snowplow built with Amazon tech. This data architecture was often straightforward for our users to deploy and came with a certain degree of familiarity as many were already using AWS hosting. Redshift was a powerful entré into the database market that would really shine when users needed to scale their cluster with just a few simple clicks.

With the passing of time since we released our support for Redshift, people’s expectations of what they can and want to do with data have grown, leading to frustrations with some of Redshift’s limitations. Though Redshift was pliable, increasing your storage or computing power was possible at the click of a button, spinning up these newly resized clusters could sometimes take several hours, meaning it was not truly elastic. For users with high volumes of data, Redshift became costly: you would have to provision a permanent cluster to house your data and pay for it even when no one was computing on it and when you wanted to run big computations, everyone within an organization had to share a fixed set of resources. These limitations were challenging, particularly for organizations that had either access patterns (such as building out an analytics or data science team), or spikes in periods of intensive data computation, both of which are pretty common.

Though the AWS team handles much of the management on their end, as a database solution Redshift isn’t quite “fully managed.” Using Redshift efficiently and cost effectively typically requires active management - especially for large scale databases: monitoring the fragmentation levels and the regularly running vacuum and analyze statements. These processes may not be difficult to carry out but there is an overhead involved, and whilst they run they take away a nontrivial percentage of Redshift resources from data consumers that are working with the data.

<h2 id="snowflake computing">Snowflake Computing</h2>

The Snowflake DB solution has many features that get us excited here at Snowplow (and their thematically similar name is an added bonus). With support for Snowflake DB, we can now offer our users a database solution that scales much faster and can handle extremely high volumes of data collection with relative ease. The platform permits loading data formatted as nested JSON objects, and the robust support for nested data types means that we can load the data into a single, easy to query table in Snowflake. This makes the data set much easier to work with than it would be in Redshift, where we’re forced to “shred out” nested data into dedicated tables to prevent our users from having to rely on Redshift’s brittle JSON parsing.

Returning to the concept of active management, many of our users only keep a certain window of event data in Redshift as a means to keep cost down. However, this complicates your data workflow, requiring extra processes to clean up, archive, and remove data from your AWS cluster which all put significant strain on your leader node and in turn result in running expensive vacuum operations to clean up disk space. Because Snowflake scales storage and compute processes separately, you can map specifications to your specific workload and dynamically alter your cluster size to optimize it for current activity, avoiding taxing cleaning processes and unnecessary costs.


<h2 id="future targets">Future Targets</h2>

We don’t believe in there being any one “hero” data storage target. Where your data lives has important implications for what you can do with that data; our approach at Snowplow is to build our support for as many different storage targets as possible, making it easy for our users to load many different targets (in parallel) and derive value from their data. There is no good or bad choice, just different solutions for companies with different objectives (or even different teams within the same company).

The one thing all of our users have in common is a desire for high fidelity, event-level data loaded into their data stack. So we have been re-architecting our platform to make it less storage-target specific, enabling us to build out support for a host of new storage targets. We’re very interested in building out support for other SQL data warehouses like BigQuery and Vertica, graph databases like Neo4j and AWS Neptune, and real-time databases like Druid. Snowplow users can rest assured that choosing our solution does not commit them to any particular database technology choices: our users are diverse, and so are the tools that help them be successful. Snowflake was the first of many new supports as we continue to bring our users the best in analytics technology and we’re looking forward offering a range of integrations that reflect the changing needs of the analytics industry.

If you're currently using Snowflake DB, interested in switching over, or have any thoughts on storage targets you would like to see in the future, join the conversation in our [dedicated Discourse thread][thread]- we'd love to hear from you!

[database]: /assets/img/blog/2018/01/database.jpg

[snowflake-db]: https://snowplowanalytics.com/blog/2017/12/28/snowplow-snowflake-loader-0.3.0-released/

[thread]:https://discourse.snowplowanalytics.com/t/snowflake-db-other-storage-targets/1721
