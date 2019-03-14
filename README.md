|  **Branch**                | **Link**                                  | **Build Status**                                |
|:--------------------------:|:-----------------------------------------:|:-----------------------------------------------:|
|  [Master][branch-master]   | https://snowplowanalytics.com             | [![Build Status][travis-image-master]][travis]  |
|  [Develop][branch-develop] | https://next.snowplowanalytics.com        | [![Build Status][travis-image-develop]][travis] |
|  [QA][branch-qa]           | https://qa.snowplowanalytics.com          | [![Build Status][travis-image-qa]][travis]      |

## What is *snowplowanalytics.com*?

This repo contains the source code and content for the [Snowplow](https://snowplowanalytics.com) website. The site is built with [Jekyll](https://github.com/mojombo/jekyll) and published to Amazon S3 where it is then served by CloudFront.

## Quickstart

Assuming git and **[rbenv][rbenv-install]** installed:

```bash
 host> git clone https://github.com/snowplow/snowplowanalytics.com
 host> cd snowplowanalytics.com
 host> make install
```

This will install the required Ruby environment into `rbenv` as well as the required Gems stored within the Gemfile.

__WARNING__: The installation can take up to 10 minutes.

Once installed you are ready to `serve` on your host:

```bash
 host> make serve
```

To use the incremental `serve` mode:

```bash
 host> make serve-incremental
```

You can then view the website on a browser on your host machine, by navigating to [localhost:4000](localhost:4000)

## Website management rules

There are three places to publish the website / any branches on this repo to:

1. https://snowplowanalytics.com (Production)
2. https://next.snowplowanalytics.com (Staging)
3. https://qa.snowplowanalytics.com (QA and testing)

Please see the instructions below to understand and follow the commit flow for new features and content through QA, Staging and production to ensure a smooth release process.

### Working on new features?

All new features **must** be worked on in individual branches that are branched from **master**.  This rule is important to avoid:

1. Mega branches that cannot be reviewed due to hundreds of changes.
2. Features than cannot be reviewed as they conflict or are altered by other features that have been committed to the same branch.
3. Inability to merge any new features to production if one part of the mega branch is non-functional.

The workflow for beginning a new feature should be as follows:

1. Create new branch from master called: `feature/logical-feature-name`. Please make sure to work on a dedicated branch for each new feature. **Do not** combine multiple new features in a single branch.
2. Work on feature in this branch and ensure it passes all local QA.
3. When ready for online QA replace the current `qa.snowplowanalytics.com` branch with your feature branch:
  * **TODO**: best strategy for replacing a branch (merge, delete / recreate?)
4. If this QA process validates open a Pull Request for your feature branch into **staging** i.e. the branch named `next.snowplowanalytics.com`.

NOTE: If your feature does not pass QA or extends over multiple updates to master you will need to fast-forward your feature branch to be up-to-date with master before it will be allowed into staging for the next sprint.

### Working on blog posts?

All new blogs to be added to the website must also be branched from master.  The workflow should be as follows:

1. Create new branch from master called: `blog/name-of-your-blog-post`
2. Work on blog post and ensure it compiles correctly locally
3. When ready submit a Pull Request for your feature branch into staging or the `next.snowplowanalytics.com` branch

Blog posts should not need to go into the QA website as they are no working on site changing features.

### QA website

To allow Monarqa to test and work on new features in a live environment they can use a QA website.  This website is decoupled from the actual release process and will be subject to frequent destruction and rebuilding.

The terms of use are as follows:

1. Check with your team that no one is actively using the `qa.snowplowanalytics.com` branch
2. If you have the go-ahead replace this branch with your feature branch:
  * See section “Working on new features?” for guidance on replacing branches.
3. You will then be able to test your feature online at https://qa.snowplowanalytics.com

**NOTE**: Commits to this branch are subject to deletion.  If you need to make further changes to your feature make these in your feature branch and repeat steps 1 through 3.  This ensures your feature branch remains valid with the staging and master branches.

### Staging website

Every Thursday morning all pending Pull Requests from feature and blog post branches will be cherry-picked into the staging branch `next.snowplowanalytics.com`.  

The staging website will then be run through a rigorous QA process.

Any features that are seen to be broken or needing more work will be removed from staging until the next week and the QA process will be repeated until all new features and blog posts have been validated.

### Production website

Once QA on staging has been completed we will merge the staging branch to master.  After this point we can begin the next sprint.

Any features that did not make the cut will need to be reset so that they are up-to-date with the latest master.

## Copyright and license

All content is Copyright © 2012-2017 Snowplow Analytics Ltd and not to be reused without permission.

[branch-master]: https://github.com/snowplow/snowplowanalytics.com
[branch-develop]: https://github.com/snowplow/snowplowanalytics.com/tree/next.snowplowanalytics.com
[branch-qa]: https://github.com/snowplow/snowplowanalytics.com/tree/qa.snowplowanalytics.com

[travis]: https://travis-ci.org/snowplow/snowplowanalytics.com
[travis-image-master]: https://travis-ci.org/snowplow/snowplowanalytics.com.svg?branch=master
[travis-image-develop]: https://travis-ci.org/snowplow/snowplowanalytics.com.svg?branch=next.snowplowanalytics.com
[travis-image-qa]: https://travis-ci.org/snowplow/snowplowanalytics.com.svg?branch=qa.snowplowanalytics.com

[rbenv-install]: https://github.com/rbenv/rbenv#homebrew-on-macos
