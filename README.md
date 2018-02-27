|  **Branch**                | **Link**                                  | **Build Status**                                |
|:--------------------------:|:-----------------------------------------:|:-----------------------------------------------:|
|  [Master][branch-master]   | https://snowplowanalytics.com             | [![Build Status][travis-image-master]][travis]  |
|  [Develop][branch-develop] | https://next.snowplowanalytics.com        | [![Build Status][travis-image-develop]][travis] |
|  [QA][branch-qa]           | https://qa.snowplowanalytics.com          | [![Build Status][travis-image-qa]][travis]      |

## What is *snowplowanalytics.com*?

This repo contains the source code and content for the [Snowplow](https://snowplowanalytics.com) website. The site is built with [Jekyll](https://github.com/mojombo/jekyll) and published to Amazon S3 where it is then served by CloudFront.

## Quickstart

Assuming git, **[Vagrant][vagrant-install]** and **[VirtualBox][virtualbox-install]** installed:

```bash
 host> git clone https://github.com/snowplow/snowplowanalytics.com
 host> cd snowplowanalytics.com
 host> vagrant up && vagrant ssh
guest> cd /vagrant
guest> bundle exec jekyll serve --host 0.0.0.0
```

You can then view the website on a browser on your host machine, by navigating to [https://localhost:4001](https://localhost:4001)

## Website wont build?

Then from the repo:

```
 host> cd vagrant
 host> rm -rf .peru
 host> rm -rf .oss-playbooks
 host> cd ..
 host> vagrant provision
 host> vagrant ssh
guest> cd /vagrant
guest> bundle exec jekyll serve --host 0.0.0.0
```

## Still can't see you page?

One reason this can happen is that your post is future dated. Normally you can add ```future: true``` to ```_config.yaml```, but that may not be supported or work properly for you.

One solution to see a future dated post is to run the vagrant VirtualBox VM clock to the future, however don't overdo it as going to far into the future has caused connection errors. Here is how:

```
host> VBoxManage list vms  # THIS will show you a list of VMs from which you pick the one that you started
host> VBoxManage setextradata "snowplowanalytics.com-1517396887" "VBoxInternal/Devices/VMMDev/0/Config/GetHostTimeDisabled" 1 # replace snowplowanalytics.com-1517396887 with the VM name from step above. It should look similar
host> Vagrant reload
... make coffee...
host> vagrant ssh
guest> sudo date -s "2018-02-15 00:00:00" # Or whatever future date, but don't overdo it or you may get connection errors
```

You can check that it worked (and it didn't revert to the host clock) by running ```guest> date``` a few times. After that step, when you run ```jekyll serve``` as in the previous section. You should be able to see all posts dated previous to the date that you set the clock.

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

[vagrant-install]: http://docs.vagrantup.com/v2/installation/index.html
[virtualbox-install]: https://www.virtualbox.org/wiki/Downloads
