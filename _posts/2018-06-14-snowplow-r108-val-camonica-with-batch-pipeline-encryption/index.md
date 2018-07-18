---
layout: post
title-short: Snowplow 108 Val Camonica
title: "Snowplow 108 Val Camonica released"
tags: [snowplow, encryption, batch, clojure, collector]
author: Ben
category: Releases
permalink: /blog/2018/06/14/snowplow-r108-val-camonica-with-batch-pipeline-encryption/
---

We are pleased to announce the release of [Snowplow 108 Val Camonica][snowplow-release], named
after [the collection of stone carvings in northern Italy][val-camonica].

This release enables the Snowplow batch pipeline to operate fully encrypted. This effort builds upon what is already possible "out of the box" regarding encryption in the Snowplow pipeline, namely:

- Encrypting Kinesis streams at rest
- Encrypting Elasticsearch data at rest
- Encrypting Redshift data at rest

This release brings the ability to have end-to-end encryption for the batch pipeline by making it
possible to:

- Encrypt data at rest on S3
- Encrypt data at rest on the local disks in your EMR cluster
- Encrypt data in-transit in your EMR cluster

This release also makes some minor - but important - improvements to the batch pipeline's Clojure Collector.

Please read on after the fold for:

1. [Enabling end-to-end encryption for the batch pipeline](#encryption)
2. [Additional EmrEtlRunner features](#eer)
3. [Revamping the Clojure Collector cookie path handling](#cc)
4. [Upgrading](#upgrading)
5. [Roadmap](#roadmap)
6. [Help](#help)

![val-camonica][val-camonica-img]
The Camunian Rose - Luca Giarelli / CC-BY-SA 3.0

<h2 id="encryption">1. Enabling end-to-end encryption for the batch pipeline</h2>

It is possible to setup end-to-end encryption for the batch pipeline running in Elastic MapReduce. For context, we recommend checking out Amazon's [dedicated guide to EMR data encryption][emr-data-encryption].

In order to set up end-to-end encryption, you will need a couple of things:

- Encryption of your S3 buckets
- An appropriate EMR security configuration

<h3 id="s3">1.1 Encrypting S3 buckets</h3>

For at rest encryption on S3, the buckets with which EmrEtlRunner will interact must have SSE-S3
encryption enabled - this is the only mode we currently support. For reference, you can look at
Amazon's [dedicated guide to S3 encryption][s3-encryption].

Keep in mind that switching on this setting is **not** retroactive. If you want
to have only encrypted data in your bucket, you will need to go through the existing data and copy it
in place.

Also, if you are using the Clojure Collector, SSE-S3 encryption needs to be set up at the bucket
level in order to take effect.

<h3 id="emr-sec-conf">1.2 Setting up an appropriate EMR security configuration</h3>

Elastic MapReduce offers EMR security configurations, which let you enforce encryption for various aspects of your job. The options are:

- Encrypt data at rest on S3 through EMRFS
- Encrypt data at rest on local disks
- Encrypt data in-transit

For a complete guide on setting up a EMR security configuration, you can refer to
Amazon's [dedicated guide to EMR security][emr-sec-conf].

Once you've performed this setup, you can specify which security configuration EmrEtlRunner should
use through the `aws:emr:security_configuration` EmrEtlRunner configuration option, which we will cover in the Upgrading section below.

Let's review each of these three EMR encryption options to understand their impact on our Snowplow batch pipeline.

<h4 id="at-rest-s3">1.2.1 At rest encryption on S3</h4>

This specifies the strategy to encrypt data when EMR interacts with S3 through EMRFS. Note that, by default, even without encryption setup, data is encrypted while in transit from EMR to S3.

Once this is done, you will need to tell EmrEtlRunner that it will have to interact with encrypted
buckets through the `aws:s3:buckets:encrypted: true` configuration setting.

<h4 id="at-rest-local">1.2.2 At rest encryption on local disks</h4>

When running the Snowplow pipeline in EMR, an HDFS cluster is setup on the different nodes of your cluster.
Enabling encryption for the local disks on those nodes will have the following effects:

- HDFS RPC, e.g. between name node and data node, uses SASL
- HDFS block transfers (e.g. replication) are encrypted using AES 256
- Attached EBS volumes are encrypted using [LUKS][luks]

When enabling this option, please keep the following drawbacks in mind:

- EBS root volumes are not encrypted, you need to use a custom AMI for that: https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-custom-ami.html
- KMS key usage is subject to pricing: https://aws.amazon.com/kms/pricing/
- It has a performance impact, e.g. when writing your enriched data to HDFS

To setup this type of encryption you will need to create an appropriate KMS key, refer to
Amazon's [KMS guide][kms-create] for more information.

It is important to note that the role used in `aws:emr:jobflow_role` in the EmrEtlRunner
configuration needs to have the `kms:GenerateDataKey` policy for this setting to work.

<h4 id="in-transit">1.2.3 In-transit encryption (Spark and MapReduce)</h4>

When running the Spark jobs of the Snowplow pipeline (Enrich and Shred), and running some S3DistCp
steps (e.g. using `--groupBy` or `--targetSize`), data is shuffled around the different nodes in
your EMR cluster. Enabling encryption for those data movements will have the following effects:

- MapReduce shuffles use TLS
- RPC and data transfers in Spark are encrypted using AES 256 if emr >= 5.9.0, otherwise RPC is
encrypted using SASL
- SSL is enabled for all things HTTP in Spark (e.g. history server and UI)

Be aware that this type of encryption also has a performance impact as data needs to be encrypted
when sent over the network (e.g. when running deduplication in the Shred job).

To set up this type of encryption, you will need to create certificates per Amazon's [PEM certificates for EMR guidance][emr-pem-cert].

Please note: for this type of encryption to work, you will need to be in a VPC and the domain name
specified in the certificates needs to be `*.ec2.internal` if in us-east-1 or
`*.region.compute.internal` otherwise.

<h2 id="eer">2. Additional EmrEtlRunner features</h2>

We've also taken advantage of this release to bring a couple of ergonomy features to EmrEtlRunner:

- There is a new `--ignore-lock-on-start` option which lets you ignore a possibly already in place
lock. Note that, the lock will still be cleaned up if the run ends successfully.
- It is now possible to specify which port and protocol you would like to use when monitoring
EmrEtlRunner through `monitoring:snowplow:{port, protocol}`.
- Under the hood, EmrEtlRunner now uses the official Ruby AWS SDK instead of our now-retired
[Sluice][sluice] library which should greatly help with memory consumption.

<h2 id="cc">3. Revamping the Clojure Collector cookie path handling</h2>

Up until this release, the Clojure Collector defaulted to having the parent path of the page the
cookie was requested from as cookie path. For example, if reaching the collector from
`http://acme.com/data/profiles/my-profile.html`, the cookie path would be `data/profiles`.

With this release, the cookie path will always default to `/`. Additionally, it is now customizable
through the `SP_PATH` Elastic Beanstalk environment property.

Finally, we've also taken advantage of this release to update a good number of dependencies.

<h2 id="upgrading">4. Upgrading</h2>

This release applies only to our AWS batch pipeline - if you are running any other flavor of Snowplow, there is no upgrade necessary.

<h3 id="upg-eer">4.1 Upgrading EmrEtlRunner</h3>

The latest version of EmrEtlRunner is available from our Bintray [here][eer-dl].

To use the latest EmrEtlRunner features, you will need to make the following changes to your
EmrEtlRunner configuration:

{% highlight yaml %}
aws:
  s3:
    bucket:
      encrypted: true            # Depends on whether your buckets are SSE-S3 encrypted
  emr:
    security_configuration: name # Leave blank if you don't use a security configuration
    jobflow_role: role           # Needs to have kms:GenerateDataKey when using at rest local disks encryption
monitoring:
  snowplow:
    port: 8080                   # New and optional
    protocol: http               # New and optional
{% endhighlight %}

For a complete example, see our sample [`config.yml`][config-yml] template.

<h3 id="upg-cc">4.2 Upgrading the Clojure Collector</h3>

The new Clojure Collector is available in S3 at:

`s3://snowplow-hosted-assets/2-collectors/clojure-collector/clojure-collector-2.1.0-standalone.war`

To customize your cookie path to **not** default to `/`, make sure to specify the `SP_PATH` Elastic
Beanstalk environment property as described above.

<h2 id="roadmap">5. Roadmap</h2>

Upcoming Snowplow releases are:

xxx

<h2 id="help">6. Getting help</h2>

For more details on this release, please check out the [release notes][snowplow-release] on GitHub.

If you have any questions or run into any problem, please visit [our Discourse forum][discourse].

[snowplow-release]: https://github.com/snowplow/snowplow/releases/r108-val-camonica

[val-camonica]: https://en.wikipedia.org/wiki/Rock_Drawings_in_Valcamonica
[val-camonica-img]: /assets/img/blog/2018/06/val_camonica.jpg

[discourse]: http://discourse.snowplowanalytics.com/

[luks]: ttps://guardianproject.info/code/luks/
[emr-data-encryption]: https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-data-encryption-options.html
[s3-encryption]: https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html
[emr-sec-conf]: https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-create-security-configuration.html
[kms-create]: https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html
[emr-pem-cert]: https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-encryption-enable.html#emr-encryption-pem-certificate

xxx

[sluice]: https://github.com/snowplow-archive/sluice
[eer-dl]: http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r108_val_camonica.zip
[config-yml]: https://github.com/snowplow/snowplow/blob/r108-val-camonica/3-enrich/emr-etl-runner/config/config.yml.sample
