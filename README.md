|  **Branch**                | **Link**                                  | **Build Status**                                |
|:--------------------------:|:-----------------------------------------:|:-----------------------------------------------:|
|  [Master][branch-master]   | https://snowplowanalytics.com             | [![Build Status][travis-image-master]][travis]  |
|  [Develop][branch-develop] | https://next.snowplowanalytics.com        | [![Build Status][travis-image-develop]][travis] |

## What is *snowplowanalytics.com*?

This repo contains the source code and content for the [Snowplow](https://snowplowanalytics.com) website. The site is built with [Jekyll](https://github.com/mojombo/jekyll) and published to Amazon S3 where it is then served by CloudFront.

|  **[Contributors Guide][contributors-guide]**    |
|:------------------------------------------------:|
|  [![i3][contributors-image]][contributors-guide] |

## Quickstart

Assuming git, **[Vagrant][vagrant-install]** and **[VirtualBox][virtualbox-install]** installed:

```bash
 host> git clone https://github.com/snowplow/snowplowanalytics.com
 host> cd snowplowanalytics.com
 host> vagrant up && vagrant ssh
guest> cd /vagrant
guest> bundle exec jekyll serve
```

### Copyright and license

All content is Copyright © 2012-2017 Snowplow Analytics Ltd and not to be reused without permission.

[branch-master]: https://github.com/snowplow/snowplowanalytics.com
[branch-develop]: https://github.com/snowplow/snowplowanalytics.com/tree/develop

[travis]: https://travis-ci.org/snowplow/snowplowanalytics.com
[travis-image-master]: https://travis-ci.org/snowplow/snowplowanalytics.com.svg?branch=master
[travis-image-develop]: https://travis-ci.org/snowplow/snowplowanalytics.com.svg?branch=develop

[contributors-guide]: https://github.com/snowplow-devops/deploy-managed-service/wiki/Guide-for-contributors
[contributors-image]: http://sauna-github-static.s3-website-us-east-1.amazonaws.com/developer.svg

[vagrant-install]: http://docs.vagrantup.com/v2/installation/index.html
[virtualbox-install]: https://www.virtualbox.org/wiki/Downloads
