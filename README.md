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

### Copyright and license

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
