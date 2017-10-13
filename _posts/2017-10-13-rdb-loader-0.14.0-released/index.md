---
layout: post
title: "RDB Loader 0.14.0 released"
title-short: RDB Loader Loader 0.14.0
tags: [redshift, postgres, shred, relational databases, storage, security]
author: Anton
category: Releases
permalink: /blog/2017/10/13/rdb-loader-0.14.0-released/
---

This release concentrated around improving security and stability of RDB Loader as well as addressing important [AWS security update][aws-ssl-update].

<!--more-->

In this post, we will cover:

1. [SSH Tunnels](#ssh-tunnel)
2. [AWS SSL Update](#ssl-update)
3. [Other changes](#other)
4. [RDB Shredder update](#shredder)
5. [Upgrading](#upgrading)
6. [Contributing](#contributing)

<h2 id="ssh-tunnel">1. SSH Tunnels</h2>

<h3 id="ssh-tunnel-intro">1.1 SSH Tunnels 101</h3>

SSH tunnels are often used as an additional security layer in Redshift access policy.
These tunnels include highly restricted [AWC Virtual Private Cloud][aws-vpc] containing Redshift cluster and one host (typically called "[the bastion host][bastion-article]") with the SSH port open to the outside world.
There's no way to access Redshift cluster or any other host inside this VPC bypassing the bastion host. 
And to access the cluster through the bastion host, users need to have an approved SSH identity and optionally reside in a white-listed subnet.

Before 0.14.0 such architecture was not possible with RDB Loader and our most security-concerned users had to keep using StorageLoader, where an SSH tunnel could be established as a component entirely detached from StorageLoader itself.
And unlike StorageLoader, RDB Loader runs on transient EMR clusters, which makes it extremely difficult to make node-alterations allowing to establish SSH tunnel.
That's why we embedded an SSH tunnel functionality straight into RDB Loader.

<h3 id="configuring-rdb">1.2 Configuring RDB Loader to work with SSH tunnel</h3>

Since 0.14.0, RDB Loader can consume new storage configurations ([`2-1-0`][new-redshift-config] for Redshift and [`1-1-0`][new-postgres-config]) which can optionally include an `sshTunnel` property:

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

This configuration tells RDB Loader to open a temporary SSH tunnel on the EMR master node from `localhost:15151` (an arbitrary port can be choosen, but `sshTunnel.localPort` and `port` must be the same) to `10.0.0.11:5439` which is the Redshift socket *inside* the VPC network.
When RDB Loader attempts to open a JDBC connection to `localhost:15151` (as specified in root) it will actually connect to Redshift cluster via an encrypted EMR-to-bastion SSH tunnel.

SSH tunnels would not be so secure and therefore useful if we had decided to store the private bastion SSH key in plain text.
That's why we embraced [AWS Key Management Service][aws-kms] and [AWS EC2 Parameter Store][aws-parameter-store], those services enable users to store highly secure data, such as passwords and SSH keys in encrypted form.
AWS KMS allows to create a master key that can be used to encrypt and decrypt arbitrary data. 
But decryption is only allowed for IAM roles that were specified in the key configuration.
AWS EC2 Parameter Store allows to store short pieces of data in either encrypted or plain-text form and then retrieve them if the IAM role (assigned to EMR in our case) has necessary permissions.

Apart from the obvious necessity of this mechanism - it also provides some additional benefits and flexibility from a security point of view.
Namely, it's now possible to audit when a particular AWS role used a particular master key and even provide fine-grained access to third-party AWS accounts to build multi-tenancy Snowplow orchestration clusters.

To allow EMR clusters to decrypt and use SSH key from EC2 Parameter Store, you need to add your `jobflow_role` (`EMR_EC2_DefaultRole` by default) to key users in IAM encryption keys and add `AmazonSSMReadOnlyAccess` policty to this role.

<h2 id="ssl-update">2. AWS SSL Update</h2>

On September 19, Amazon emailed Redshift users that all certificates currently installed on Redshift clusters [will be replaced][aws-ssl-update] with ACM issued ones.
As a consequence all clients using SSL **and** outdated/non-native JDBC drivers will not be able to connect to Redshift after October 23, 2017.
Unfortunately, all releases of StorageLoader and 0.12.0 and 0.13.0 versions of RDB Loader fall into this category.

In this release of RDB Loader we updated the native Redshift JDBC driver bundled with RDB Loader to the latest version which allows one to connect to Redshift via SSL and apparently fixes previously observed issues with SSL connections to Redshift.

It also means that if you're a Snowplow user and have a requirement to use Redshift only via a secure connection - upgrading to RDB Loader 0.14.0 is the only way to continue to load data into Redshift.

<h2 id="other">3. Other changes</h2>

Among onther important security updates in this release, RDB Loader now also provides the ability not to store your Redshift password in plain text in storage configurations.
Instead, it can be stored in the same way than private SSH key for bastion host - namely in EC2 Parameter Store and encrypted via master key.
It has the same benefits as KMS-stored SSH key, for example it is possible not to have plain Redshift password saved anywhere, even on the orchestration cluster.

To enable retrieving password from EC2 parameter store - just replace `password` string with object similar to `sshTunnel.bastion.key`: 

{% highlight json %}
{
    "password": {
        "ec2ParameterStore": {
            "parameterName": "snowplow.rdbloader.redshift.password"
        }
    }
}
{% endhighlight %}


Version 0.14.0 includes the newest AWS SDK, which makes it possible to use it from previously unavailable AWS Regions such as ca-central-1 and eu-west-2.

<h2 id="shredder">4. RDB Shredder update</h2>

We've taken advantage of this RDB Loader release to slightly update the RDB Shredder. Namely, we've
upgraded the Spark version on which RDB Shredder runs to 2.2.0 and we've made the Shred job a bit
more robust by allowing overwrites of output data for a particular run. This last change makes
the `yarn.resourcemanager.am.max-attempts: "1"` configuration not mandatory anymore. This is
particularly useful if the job fails because of some transient issue.

<h2 id="upgrading">5. Upgrading</h2>

The primary way to run RDB Loader is still via Snowplow's own EmrEtlRunner, Release 90 and above. You will need to update your `config.yml`:

{% highlight yaml %}
storage:
  versions:
    rdb_shredder: 0.13.0      # WAS 0.12.0
    rdb_loader: 0.14.0        # WAS 0.13.0
{% endhighlight %}

Also schema in storage target configuration need to be updated.

For Redshift to `iglu:com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0` (was `2-0-0`)
For Postgres to `iglu:com.snowplowanalytics.snowplow.storage/postgresql_config/jsonschema/1-1-0` (was `1-0-1`)

<h2 id="contributing">6. Contributing</h2>

You can check out the [repository][repo] and the [open issues](https://github.com/snowplow/snowplow-rdb-loader/issues?utf8=✓&q=is%3Aissue%20is%3Aopen%20) if you'd like to get involved!

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[repo]: https://github.com/snowplow/snowplow-rdb-loader
[release-0140]: https://github.com/snowplow/snowplow-rdb-loader/releases/tag/0.14.0

[discourse]: http://discourse.snowplowanalytics.com/

[aws-ssl-update]: https://docs.aws.amazon.com/redshift/latest/mgmt/connecting-transitioning-to-acm-certs.html
[bastion-article]: https://en.wikipedia.org/wiki/Bastion_host

[new-postgres-config]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.storage/postgresql_config/jsonschema/1-1-0
[new-redshift-config]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0

[aws-kms]: https://aws.amazon.com/kms/
[aws-parameter-store]: https://aws.amazon.com/ec2/systems-manager/parameter-store/
[aws-vpc]: https://aws.amazon.com/vpc/
