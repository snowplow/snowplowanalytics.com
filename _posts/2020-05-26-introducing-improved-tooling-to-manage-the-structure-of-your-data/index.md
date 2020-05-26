---
layout: post
title: "Introducing improved tooling to manage the structure of your data"
description: "We’re releasing functionality to help you manage data structures more easily, a new API to provide more flexibility, and a Continuous Integration tool to improve data quality."
author: Mike J
category: Releases
permalink: /blog/2020/05/26/introducing-improved-tooling-to-manage-the-structure-of-your-data/
---


![data_structures_main.png](/assets/img/blog/2020/05/data_structures_main.png)

### Overview

As your business evolves and changes, so does your data strategy, which means updating your tracking should be easy and straightforward. 

Event and entity definitions are at the core of your tracking, and last year Snowplow launched tooling to make creating, testing, publishing and updating those definitions easier to help you get more value from your data.

Since then, we’ve been gathering feedback to better understand how you use the tools, and have uncovered opportunities to further improve your experience. 

In this release, we’re introducing updates to the way you manage the structure of your data in console, a new API to provide more flexibility, and a Continuous Integration tool to improve data quality.


### Introducing Data Structures

We’re excited to announce the release of a new set of tooling to help you manage your data structures more easily within the Snowplow Insights console. 

This release brings a number of significant improvements and benefits to Snowplow Insights customers: 



*   Improved functionality making it more intuitive for Snowplow Insights customers to edit data structures (schemas) and view descriptive information about each data structure. 

![improved-functionality](/assets/img/blog/2020/05/improved-functionality.png)


*   You can now specify whether each structure describes an event or entity, search for data structures by name, and filter by event or entity for improved findability.


![change_type.png](/assets/img/blog/2020/05/change_type.png)


_Now you can specify if your data structure describes an event or entity, and filter by type of data structure._

*   It is now possible to hide data structures you are no longer using, making it easier to manage and organize your interface. If necessary, you can view a list of hidden data structures and reinstate them as needed.

     
![hide_schema.png](/assets/img/blog/2020/05/hide_schema.png)



_You can now keep your interface tidy by hiding data structures you no longer require._

*   An improved and more structured workflow for versioning. When you publish edits to a data structure, you can now select the version from a list of options to help you maintain consistency within your data structure versioning. 

![data_structures_main.png](/assets/img/blog/2020/05/versioning.png)



_The workflow for versioning your data structures is now more structured and helps prevent errors._



*   When making edits and deploying changes to Production you can now add change notes to help your team keep track of changes (enterprise customers only). 

![change_notes](/assets/img/blog/2020/05/change_notes.png)


_Keep your team on the same page with change notes._

[You can find more information on how to manage your data structures in the console here.](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/managing-data-structures/)


### Data Structures API

While being able to manage data structures in the console offers a simple and easy experience, sometimes there are use cases that require a more programmatic approach.

This release also introduces an officially supported Data Structures API. Now your team has the flexibility to manage your data structures programmatically and integrate workflows with other systems. The API is designed to provide the same workflow points as the console around getting, editing, validating and publishing schema.



### Continuous Integration tool

Have you ever rolled out a new release only to realize you’ve forgotten to publish the relevant schema dependencies for your tracking? 

The new CI tool helps your teams prevent tracking failures from “Schema Not Found” errors by ensuring the required data structures are published as part of the deployment process and warning you if they are not so it’s easier for your team to maintain data quality. 

This is published as a Github action, and available as a JDK install for other CI providers.



## Get started

All Snowplow Insights customers running Schema UI will automatically receive this upgrade. 

Insights customers who do not yet have access can request priority access to this functionality by contacting success@snowplowanalytics.com and we’ll get you up and running.

 

Not a Snowplow Insights customer yet?[ Get in touch with us here](https://snowplowanalytics.com/get-started/) to learn more.