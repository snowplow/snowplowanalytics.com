---
layout: post
title: "Piinguin released"
title-short: Piinguin released
tags: [pii, piinguin]
author: Kostas
category: Releases
permalink: /blog/2018/05/10/piinguin-released/
---

We are pleased to announce the first release of [Piinguin][release-notes] and the complementary [Piinguin relay][relay-release-notes].

This initial release brings the basic capabilities to handle PII data use management for Snowplow.

Read on for more information on Piinguin, which follows the polar naming theme in Snowplow projects.

<!--more-->

1. [Overview](#overview)
2. [Piinguin](#piinguin)
3. [Piinguin Relay](#piinguin-relay)
4. [Deploying](#deploying)
5. [Help](#help)



<h2 id="#overview"> 1. Overview </h2>

Following the release of [R106][acropolis-blog-post] which adds the capability to emit a stream of PII events, Snowplow wanted to continue leading the pack in terms of responsible PII management.

If you want to learn more about PII and how they are managed during Snowplow PII enrichment, you can read more in the release post for [R100][epidaurus-blog-post] and [R106][acropolis-blog-post].

Piinguin aims to complete the PII management system which starts with the PII enrichment in snowplow, by providing a service which stores PII and helps control access by requiring that anyone who reads PII data, provides a justification in the form of a [lawful basis for processing PII][lawful-basis-ico] specified under [GDPR][gdpr-eu].

The two components sit beside snowplow ans store and serve PII data. Here is a component overview:

![Components][components-overview]

The first component that receives that data out of the stream is the Piinguin Relay. That is simply an AWS Lambda function which uses the piinguin-client artifact from piinguin to send data to piinguin. You can read more details about this project [below][#piinguin-relay] and detailed instructions on how to install and run it under [deploying][#deploying].

The second component is the piinguin-server itself which has to be in the same secure VPC as the Lambda function. In addition it needs to have access to an AWS Dynamo DB table to store the data. You can read more details about this project [below][#piinguin] and detailed instructions on how to install and run it under [deploying][#deploying].

There is also another component name "piinguin-client" this refers to your own code in which you have made use of either the piinguin-client artifact or another implementation based on the GRPC protocol provided in piinguin. More detail on that under [piinguin][#piinguin].


<h2 id="#piinguin"> 2. Piinguin </h2>

The Piinguin project consists of three parts. Those are the:

* Protocol
* Server
* Client


Piinguin is based on GRPC [grpc] which is a protobuf based RPC framework. The protocol in the project specifies the interface between the client and server. There is a `.proto` file which describes the interactions between the client and the server for reading, writing and deleting records. That file is used with the excellent [scalapb][scalapb] scala compiler plug-in to generate `Java` code stubs for both the server and the client. These can then be used to implement any behavior based on that interface. 

The server implements the behavior of the server according to the interface, which in this particular case means writing to and reading from Dynamo DB using the excellent [scanamo][scanamo] library. In the highly unlikely event (as unlikely as a hash collision) that a hash coincides for two values, the last seen original value will be kept (there are thoughts of keeping all values in that case, although their utility is dubious. Feel free to discuss in the [relevant issue][collision-issue] on GitHub).

Finally the client artifact provides a client API for use from `Scala`. There are three main ways to use the client API, which are the Scala Futures, [FS2][fs2] IO and [FS2][fs2] Streaming. The streaming implementation is *highly experimental* and is use is currently discouraged as it is likely to change completely (but all comments and PRs are welcome).

<h2 id="#piinguin-relay"> 3. Piinguin Relay </h2>

The piinguin relay is using the above mentioned Piinguin Client, in an AWS Lambda to forward all PII messages to the Piinguin Server. It uses the [Analytics SDK][analytics-sdk] to read the Enriched Events that are contained in the stream and extract the relevant fields (currently modified and original value only), and perform a `createRecord` operation.

<h2 id="#deploying"> 4. Deploying </h2>

Both the Piinguin Server and the Piinguin Relay are currently only targeting AWS and they should be deployed in the same VPC.

<h3 id="#deploying-relay"> Piinguin Relay </h3>
You can obtain the relay artifact from [Snowplow Bintray][snowplow-bintray]. In order for you to create an AWS Lambda function, please follow the detailed [developer guide][aws-developer-guide]. When you are creating the Lambda, you will need to specify as trigger the AWS Kinesis stream that contains your PII data. In addition you will need to have the VPC id where you are running the Piinguin Server and provide that in the form too. Finally in the `Environment variables` section you will need to add the PIINGUIN_HOST, PIINGUIN_PORT and PIINGUIN_TIMEOUT_SEC. The PIINGUIN_TIMEOUT_SEC value should be lower than the AWS Lambda timeout in order to get a meaningful error message if the client times out while communicating with the server. Here is an example of that configuration:
```
PIINGUIN_HOST        = ec2-1-2-3-4.eu-west-1.compute.amazonaws.com
PIINGUIN_PORT        = 8080
PIINGUIN_TIMEOUT_SEC = 10
```

<h3 id="#relay-iam-policy"> Piinguin Relay IAM/VPC </h3>

As stated before, both the Relay and the Server need to reside in the same VPC. in addition the lambda needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide][role-creation]. As all Lambda functions it needs to have permission to send its output to CloudWatch Logs so and example IAM policy that permits that is:
```json
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
```

As the Lambda will be reading its data form Kinesis it will also need to have permissions to do that with a policy document such as:
```json
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
```

<h3 id="#deploying-piinguin"> Piinguin Server </h3>
The simplest way to deploy Piinguin Server is to obtain the docker image by running the following on your docker host:
`docker run snowplow-docker-registry.bintray.io/snowplow/piinguin-server:0.1.0`
This will run the server on the default port `8080` and will use the default DynamoDB table `piinguin`. Both are configurable to other values using `PIINGUIN_PORT` and `PIINGUIN_DYNAMODB_TABLE`, if needed.

<h3 id="#piinguin-iam-policy"> Piinguin Server IAM/VPC </h3>

As stated before, both the Relay and the Server need to reside in the same VPC. in addition the docker host needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide][role-creation].

As the server writes its data to DynamoDB its will need to have access to it with a policy document such as:
```json
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
```

<h2 id="#help"> 5. Getting help </h2>


For more details on this release, please check out the release notes on [Piinguin][release-notes] and [Piinguin relay][relay-release-notes] on GitHub.

If you have any questions or run into any problems, please visit [our Discourse forum][discourse].

[release-notes]: https://github.com/snowplow-incubator/piinguin/releases/tag/0.1.0
[relay-release-notes]: https://github.com/snowplow-incubator/snowplow-piinguin-relay/releases/tag/0.1.0
[epidaurus-blog-post]: https://snowplowanalytics.com/blog/2018/02/27/snowplow-r100-epidaurus-released-with-pii-pseudonymization-support/
[lawful-basis-ico]: https://ico.org.uk/for-organisations/guide-to-the-general-data-protection-regulation-gdpr/lawful-basis-for-processing/#ib3
[gdpr-eu]: https://www.eugdpr.org/
[components-overview]: /assets/img/blog/2018/05/diagram.png
[grpc]: https://grpc.io/
[scalapb]: https://github.com/thesamet/sbt-protoc
[scanamo]: https://www.scanamo.org/
[fs2]: https://github.com/functional-streams-for-scala/fs2
[analytics-sdk]: https://github.com/snowplow/snowplow/wiki/Snowplow-Analytics-SDK
[collision-issue]: https://github.com/snowplow-incubator/piinguin/issues/8
[aws-developer-guide]: https://docs.aws.amazon.com/lambda/latest/dg/welcome.html
[role-creation]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html

<!--*UPDATE ME*-->
[acropolis-blog-post]: https://snowplowanalytics.com/blog/2018/05/10/snowplow-r106-acropolis
[snowplow-bintray]: https://bintray.com/snowplow/snowplow-generic/snowplow-piinguin-relay
