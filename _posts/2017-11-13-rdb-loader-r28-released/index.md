---
layout: post
title: "RDB Loader R28 released"
title-short: RDB Loader Loader R28
tags: [redshift, postgres, shred, relational databases, storage, security]
author: Anton
category: Releases
permalink: /blog/2017/11/13/rdb-loader-r28-released/
---

This release concentrated around improving security and stability of RDB Loader as well as addressing an important [AWS SSL update][aws-ssl-update], previously flagged in this [Discourse post][aws-ssl-alert].
Starting with this release, both RDB Loader and RDB Shredder versions will have same umbrella-release number.

<!--more-->

In this post, we will cover:

1. [SSH tunnels](#ssh-tunnel)
2. [The AWS SSL update](#ssl-update)
3. [Other changes](#other)
4. [RDB Shredder updates](#shredder)
5. [Upgrading](#upgrading)
6. [Contributing](#contributing)

<h2 id="ssh-tunnel">1. SSH tunnels</h2>

<h3 id="ssh-tunnel-intro">1.1 SSH tunnels 101</h3>

SSH tunnels are often used as an additional security layer around accessing Redshift. These tunnels involve a highly restricted [AWC Virtual Private Cloud][aws-vpc] containing the Redshift cluster and one "[bastion host][bastion-article]" with its SSH port open to the outside world.

There's no way to access Redshift cluster or any other host inside this VPC except by routing through the bastion host. 
And to access the cluster through the bastion host, users need to have an approved SSH identity (and optionally reside in a white-listed subnet).

Before 0.14.0 this architecture was not supported by RDB Loader, and our most security-conscious users had to keep using StorageLoader, where an SSH tunnel could be easily established outside of StorageLoader itself. This setup is much more challenging with RDB Loader, which runs on transient EMR clusters, making it very difficult to bring up an SSH tunnel.

For this reason, in this release we have embedded SSH tunnel functionality directly into RDB Loader.

<h3 id="configuring-rdb">1.2 Configuring RDB Loader to work with an SSH tunnel</h3>

As of this release, RDB Loader supports a new version of the configuration files for Redshift ([`2-1-0`][new-redshift-config]) and for Postgres ([`1-1-0`][new-postgres-config]); this new format can optionally include an `sshTunnel` property:

{% highlight json %}
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0",
  "data": {
    "name": "AWS Redshift enriched events storage",
    "host": "localhost",
    "database": "snowplow",
    "port": 15151,
    "sslMode": "DISABLE",
    "username": "loader",
    "password": "secret",
    "roleArn": "arn:aws:iam::719197435995:role/RedshiftLoadRole",
    "schema": "atomic",
    "maxError": 1,
    "compRows": 20000,
    "purpose": "ENRICHED_EVENTS",
    "sshTunnel": {
      "bastion": {
        "host": "bastion.acme.com",
        "port": 22,
        "user": "snowplow-loader",
        "key": {
          "ec2ParameterStore": {
            "parameterName": "snowplow.rdbloader.redshift.key"
          }
        }
      },
      "destination": {
        "host": "10.0.0.11",
        "port": 5439
      },
      "localPort": 15151
    }
  }
}
{% endhighlight %}

This configuration tells RDB Loader to open a temporary SSH tunnel on the EMR master node from `localhost:15151` (an arbitrary port can be chosen, but `sshTunnel.localPort` and `port` must be the same) to `10.0.0.11:5439`, which is the Redshift socket *inside* the VPC network.

When RDB Loader attempts to open a JDBC connection to `localhost:15151` (as specified in the configuration root), it will actually connect to the Redshift cluster via an encrypted EMR-to-bastion SSH tunnel.

Security would be at risk if we had needed to store the private bastion SSH key in plain text. So, we have embraced [AWS Key Management Service][aws-kms] and [AWS EC2 Parameter Store][aws-parameter-store], services which let users store highly secure data, such as passwords and SSH keys in encrypted form, specifically:

* AWS KMS lets you create a master key to encrypt and decrypt arbitrary data. Decryption is only allowed for IAM roles that were specified in the key configuration
* AWS EC2 Parameter Store lets you store short pieces of data in either encrypted or plain-text form and then retrieve them if the IAM role (assigned to EMR in our case) has the necessary permissions

This is a huge step forwards for the security and integrity of the RDB Loader. It means that you can audit when a particular AWS role used a particular master key, and even setup fine-grained access to third-party AWS accounts.

<h2 id="ssl-update">2. AWS SSL Update</h2>

On September 19, Amazon emailed Redshift users that all certificates currently installed on Redshift clusters [will be replaced][aws-ssl-update] with ACM issued ones.

As a consequence, all clients using SSL **and** outdated/non-native JDBC drivers were not be able to connect to Redshift after October 23, 2017. Unfortunately, all releases of StorageLoader and the 0.12.x and 0.13.x versions of RDB Loader fall into this category.

In this release of RDB Loader, we have updated the native Redshift JDBC driver bundled with RDB Loader to the latest version; this version can connect to Redshift via SSL and *also* fixes the previously observed issues with SSL connections to Redshift.

If you are a Snowplow user and have a requirement to use Redshift via a secure connection only, then upgrading to RDB Loader 0.14.0 is the recommended way of doing this.

<h2 id="other">3. Other changes</h2>

RDB Loader now also provides the ability not to store your Redshift password in plain text in storage configurations.

Your password can now be stored in the same way as private SSH keys, above, namely in EC2 Parameter Store and encrypted via master key. This approach has the same benefits as a KMS-stored SSH key, and means that you no longer have to have the Redshift password stored in plaintext anywhere.

To enable retrieving password from EC2 parameter store, just replace `password` string with object similar to `sshTunnel.bastion.key`: 

{% highlight json %}
{
  "password": {
    "ec2ParameterStore": {
      "parameterName": "snowplow.rdbloader.redshift.password"
    }
  }
}
{% endhighlight %}

Version 0.14.0 also includes the latest AWS SDK, which makes it possible to use it from previously unavailable AWS Regions such as ca-central-1 and eu-west-2.

<h2 id="shredder">4. RDB Shredder update</h2>

We've taken advantage of this RDB Loader release to slightly update the RDB Shredder.

We have upgraded the Spark version on which RDB Shredder runs to 2.2.0, and we have made the Shred job more
more robust, by allowing overwrites of output data for a particular run. This last change means that
the `yarn.resourcemanager.am.max-attempts: "1"` configuration is no longer mandatory - 
particularly useful if the job fails because of some transient issue.

<h2 id="upgrading">5. Upgrading</h2>

The primary way to run RDB Loader is still via Snowplow's own EmrEtlRunner, Release 90 and above. You will need to update your `config.yml`:

{% highlight yaml %}
aws:
  emr:
    ami_version: 5.9.0        # WAS 0.
storage:
  versions:
    rdb_shredder: 0.13.0      # WAS 0.12.0
    rdb_loader: 0.14.0        # WAS 0.13.0
{% endhighlight %}

Also, the schema in storage target configuration need to be updated.

For Redshift, change to `iglu:com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0` (was `2-0-0`).

For Postgres, change to `iglu:com.snowplowanalytics.snowplow.storage/postgresql_config/jsonschema/1-1-0` (was `1-0-1`).

Make sure EMR allows outbound connections on bastion's SSH port and EMR cluster has access to bastion.

To allow EMR clusters to decrypt and use an SSH key from EC2 Parameter Store, you must:

1. Add your `jobflow_role` (`EMR_EC2_DefaultRole` by default) to the key users in IAM encryption keys
2. Add `AmazonSSMReadOnlyAccess` policty to this role

<h2 id="contributing">6. Contributing</h2>

You can check out the [repository][repo] and the [open issues](https://github.com/snowplow/snowplow-rdb-loader/issues?utf8=✓&q=is%3Aissue%20is%3Aopen%20) if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[repo]: https://github.com/snowplow/snowplow-rdb-loader
[release-0140]: https://github.com/snowplow/snowplow-rdb-loader/releases/tag/0.14.0

[discourse]: http://discourse.snowplowanalytics.com/

[aws-ssl-alert]: https://discourse.snowplowanalytics.com/t/important-alert-aws-is-replacing-the-ssl-certificates-for-connecting-to-redshift-on-23rd-october/1552
[aws-ssl-update]: https://docs.aws.amazon.com/redshift/latest/mgmt/connecting-transitioning-to-acm-certs.html
[bastion-article]: https://en.wikipedia.org/wiki/Bastion_host

[new-postgres-config]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.storage/postgresql_config/jsonschema/1-1-0
[new-redshift-config]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0

[aws-kms]: https://aws.amazon.com/kms/
[aws-parameter-store]: https://aws.amazon.com/ec2/systems-manager/parameter-store/
[aws-vpc]: https://aws.amazon.com/vpc/
