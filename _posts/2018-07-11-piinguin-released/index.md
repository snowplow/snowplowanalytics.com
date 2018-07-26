---
layout: post
title: "Piinguin, Snowplow PII usage management service, released"
title-short: Piinguin released
tags: [pii, piinguin]
author: Kostas
category: Releases
permalink: /blog/2018/07/11/piinguin-snowplow-pii-usage-management-service-released/
---

We are pleased to announce the first release of [Piinguin][release-notes] and the associated [Snowplow Piinguin Relay][relay-release-notes]. This initial release introduces basic capabilities for managing the usage of personally identifiable information data from Snowplow.

Read on for more information on Piinguin and the Snowplow Piinguin Relay:

1. [Overview](#overview)
2. [Piinguin](#piinguin)
3. [Snowplow Piinguin Relay](#piinguin-relay)
4. [Deploying](#deploying)
5. [Help](#help)

<!--more-->

<h2 id="overview">1. Overview</h2>

Following the release of [Snowplow R106 Acropolis][acropolis-blog-post], which added the capability to emit a stream of PII transformation events, we have continued to develop tools to support the responsible management of personally identifiable information.

If you want to learn more about PII and how it is managed by the Snowplow PII enrichment, you can read more in the release posts for [Snowplow R100 Epidaurus][r100-blog-post] and [R106 Acropolis][r106-blog-post].

Piinguin aims to round out our approach to PII management, by providing a service which stores PII and helps control access by requiring that anyone who reads PII data provides a justification based on the [lawful basis for processing PII][lawful-basis-ico] specified under [GDPR][gdpr-eu].

Piinguin consists of several elements that sit alongside Snowplow to store and serve PII data. Here is an overview of the architecture:

![Components][components-overview]

The first component that receives data out of Snowplow's stream of PII transformation events is the Snowplow Piinguin Relay, an AWS Lambda function which uses the piinguin-client artifact to send data to Piinguin. You can read more details about this relay [below](#piinguin-relay), and detailed instructions on how to install and run it in the [deploying](#deploying) section.

The second component is the piinguin-server itself which has to be in the same secure VPC as the Lambda function. In addition it needs to have access to an AWS Dynamo DB table to store the data. You can read more details about Piinguin [below](#piinguin), along with detailed instructions on how to install and run it under [deploying](#deploying).

The final component is the aforementioned piinguin-client, potentially running embedded in your own code to manage your interactions with the PII stored in Piinguin. This client library is discussed in more detail in the upcoming [Piinguin](#piinguin) section.

<h2 id="piinguin">2. Piinguin</h2>

The Piinguin project consists of three parts. These are the:

* Protocol
* Server
* Client

Piinguin is based on [GRPC][grpc] which is a Protocol Buffer-based RPC framework. The protocol in the Piinguin project specifies the interface between the client and server. There is a `.proto` file which describes the interactions between the client and the server for reading, writing and deleting PII records. That file is used with the excellent [scalapb][scalapb] Scala compiler plug-in to generate `Java` code stubs for both the server and the client. These can then be used to implement any behavior based on that interface.

The piinguin-server implements the behavior of the server according to the interface, which in this case means writing to and reading from DynamoDB using another excellent library, [scanamo][scanamo]. In the highly unlikely event (as unlikely as a hash collision) that a hash coincides for two values, the last seen original value will be kept. (There are thoughts of keeping all values in that case, although their utility is dubious - feel free to discuss in the [relevant issue][collision-issue] on GitHub.)

Finally, the piinguin-client artifact provides a client API for use from `Scala`. There are three ways to use the client API: with plain Scala Futures, [FS2][fs2] IO, and [FS2][fs2] Streaming. Please note that the FS2 Streaming implementation remains *highly experimental* and its use is currently discouraged as it is likely to change significantly; any and all comments and PRs are of course welcome.

<h2 id="piinguin-relay">3. Snowplow Piinguin Relay</h2>

The Snowplow Piinguin Relay uses the aforementioned piinguin-cient in an AWS Lambda function to forward all PII transformation events to the piinguin-server.

The relay uses the [Snowplow Analytics SDK][analytics-sdk] to read the PII transformation enriched events that are contained in the Kinesis stream and extract the relevant fields (currently, the modified and original value only), and perform a `createRecord` operation against piinguin-server.

<h2 id="deploying">4. Deploying</h2>

Both the Piinguin Server and the Piinguin Relay currently support AWS only, and they should be deployed to the same VPC.

<h3 id="#deploying-relay">4.1 Configuring the Snowplow Piinguin Relay</h3>

You can obtain the relay artifact from [our Bintray account][snowplow-bintray].

In order for you to create an AWS Lambda function, please follow the detailed [developer guide][aws-developer-guide]. When creating the Lambda, make sure to:

* Specify as trigger the AWS Kinesis stream that contains your PII transformation events, as produced by Snowplow
* Provide the ID of the VPC where you are running the Piinguin Server
* In the `Environment variables` section, you will need to add the `PIINGUIN_HOST`, `PIINGUIN_PORT` and `PIINGUIN_TIMEOUT_SEC`

The `PIINGUIN_TIMEOUT_SEC` value should be lower than the AWS Lambda timeout in order to get a meaningful error message if the client times out while communicating with the server. Here is an example of that configuration:

{% highlight bash %}
PIINGUIN_HOST        = ec2-1-2-3-4.eu-west-1.compute.amazonaws.com
PIINGUIN_PORT        = 8080
PIINGUIN_TIMEOUT_SEC = 10
{% endhighlight %}

<h3 id="relay-iam-policy">4.2 Setting up relay permissions to the VPC</h3>

As stated before, both the relay and the Piinguin Server need to reside in the same VPC. In addition, the Lambda function needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide][role-creation]. Like many Lambda functions, this one also needs permission to send its output to CloudWatch Logs - this IAM policy should cover that:

{% highlight json %}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "logs:CreateLogGroup",
      "Resource": "arn:aws:logs:<region>:<account-id>:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": [
        "arn:aws:logs:<region>:<account-id>:log-group:/aws/lambda/piinguin-relay:*"
      ]
    }
  ]
}
{% endhighlight %}

As the Lambda will be reading its PII transformation events from Kinesis, it will also need to have permissions to do that, with a policy document such as:

{% highlight json %}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "kinesis:*",
      "Resource": [
        "arn:aws:kinesis:<region>:<account-id>:stream/<pii-events-stream-name>"
      ]
    }
  ]
}
{% endhighlight %}

<h3 id="deploying-piinguin">4.3 Deploying the Piinguin Server</h3>

The simplest way to deploy Piinguin Server is to obtain the Docker image by running the following on your Docker host:

{% highlight bash %}
$ docker run snowplow-docker-registry.bintray.io/snowplow/piinguin-server:0.1.0
{% endhighlight %}

This will run the server on the default port `8080` and will use the default DynamoDB table `piinguin`. Both are configurable to other values using `PIINGUIN_PORT` and `PIINGUIN_DYNAMODB_TABLE`, if needed.

<h3 id="piinguin-iam-policy">4.4 Setting up server permissions to the VPC</h3>

As stated before, both the Relay and the Server need to reside in the same VPC. In addition, the Docker host needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide][role-creation].

As the server writes its data to DynamoDB it will need to have access to it with a policy document such as:

{% highlight json %}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:DeleteItem",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Scan",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:<region>:<account-id>:table/<table-name>"
    }
  ]
}
{% endhighlight %}

<h3 id="piinguin-dynamodb-table">4.5 Setting up DynamoDB table</h3>

The DyanamoDB table will need to be created before Piinguin can be used. 

In order to create a DynamoDb table log-in as normal to the AWS console and start typing `DynamoDB` to the services field:

![List of services][list-of-services]

Then click on DynamoDB from the list of services.

In the DynamoDB page click `create table`:

![create table][create-table]

Finally, specify the desired `table name`, set the `primary key` to **modifiedValue** and its type to **String** and click `Create`.

![create table details][create-table-details]

If you are comfortable with the CLI the quickest way to do the same is:

```bash
aws dynamodb create-table --table-name piinguin-prod --attribute-definitions AttributeName=modifiedValue,AttributeType=S --key-schema AttributeName=modifiedValue,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

And that completes the setup.

<h2 id="help">5. Getting help</h2>

For more details on working with Piinguin and the Snowplow Piinguin Relay, please check out the documentation here:

* xxx 
* xxx
* xxx

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[release-notes]: https://github.com/snowplow-incubator/piinguin/releases/tag/0.1.0
[relay-release-notes]: https://github.com/snowplow-incubator/snowplow-piinguin-relay/releases/tag/0.1.0

[r100-blog-post]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[r106-blog-post]: https://snowplowanalytics.com/blog/2018/06/14/snowplow-r106-acropolis-released-with-pii-enrichment-upgrade/

[lawful-basis-ico]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/#ib3
[gdpr-eu]: https://www.eugdpr.org/
[components-overview]: /assets/img/blog/2018/07/piinguin-diagram.png
[grpc]: https://grpc.io/
[scalapb]: https://github.com/thesamet/sbt-protoc
[scanamo]: https://www.scanamo.org/
[fs2]: https://github.com/functional-streams-for-scala/fs2
[analytics-sdk]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK
[collision-issue]: https://github.com/snowplow-incubator/piinguin/issues/8
[aws-developer-guide]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[role-creation]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html
[snowplow-bintray]: https://bintray.com/snowplow/snowplow-generic/snowplow-piinguin-relay#files

[discourse]: https://discourse.snowplowanalytics.com/
[list-of-services]: /assets/img/blog/2018/07/list-of-services.png
[create-table]: /assets/img/blog/2018/07/create-table.png
[create-table-details]: /assets/img/blog/2018/07/create-table-details.png