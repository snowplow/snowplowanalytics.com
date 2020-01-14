---
layout: post
title: "Resolving entities with graph databases using Neo4j"
title-short: Entity resolution with graphs
tags: [analytics, graph database, neo4j, data modeling]
image: /assets/img/blog/2019/02/neo4j_logo.jpg
author: Dilyan
category: How to guides
permalink: /blog/2019/02/13/resolving-entities-with-graph-databases-using-neo4j/
discourse: true
---

In the [previous post in this series][modelling-page-view-events-as-a-graph], we looked at how we can model the canonical Snowplow `page_view` events as a graph. We identified the various entities that make up the event and assigned each dimension of the event as a property on one of those entity nodes. We then used composable schemas to piece together a JSON schema for the event, composed of the individual schemas for each node and relationship.

In the meantime, we have come up with other ways we could schema the granular behavioral data and we will return to the topic in future posts. For now, we'd like to focus on a specific use case for using graph technology: entity resolution.

## What is entity resolution?

In previous posts we've talked in detail about the concept of an [event grammar][modeling-events-through-entity-snapshotting]. In that model, an event is made up of entities that are connected to each other with various relationships. The event itself is a snapshot of the state of those entities and their relations at a specific point in time.

These entities are things that exists in the real world, for example a user, a website, or the device through which the user is accessing the site. In all cases, there is only one real instance of those entities. However, in our event data, we have multiple, potentially varying, records for them. A user's username might be attached to all of their events; and the same person might appear in the data under different usernames. A device, identified by a first-party cookie, might appear under different cookie values.

All these various records of the entity refer to the same instance of it in the real world. Entity resolution (ER) is the process of disambiguating the links between digital records and real-word instances. This not only reduces complexity and deduplicates the data set, but can also yield insight about how records match on to entity instances. We might, for example, discover that what we thought were different users are actually the same person using their personal and business account.

As the examples above suggest, entity resolution has direct application in efforts to stitch together the full identity of a user. This is also sometimes referred to as creating a 360 degree view of the customer.

Entity resolution can be done in traditional RDBMS systems, but it is hard to frequently update the resolved data. By contrast, in a graph database, relationships and nodes can be easily added, deleted or changed.

## Components of an ER solution

A practical ER implementation must be built on the following components:
- *A taxonomy of identifiers.* Which of our collected data points are references to real-world entity instances?
- *A data model.* How are entities modeled? This could be a RDBMS schema, describing the tables in which resolved entities will be stored and the relationships (foreign keys) between them. Or, when using a graph database, this is a schema describing the graph of resolved entities.
- *A logical model.* How entities are created in the data model and their relationships resolved? On a high level, this includes the algorithms and rule sets that implement the ER solution. This also includes any specific applications that implement the logical model, eg a Neo4j loader app or a scheduled process to update the graph.

Let's take a look at each of these components in turn.

### Taxonomy of identifiers

The two main questions we have to answer are:
- What are our available data points that identify entities in the real world?
- What entities do they identify?

For the purposes of this blog post, we'll limit the discussion to just three types of entities: users, devices, and networks. A user is a person who is using a device to visit a website or use an app. That might seem quite obvious, but we'll see in a bit why being so formal in the definition is important. A network is -- in this case -- a LAN or WAN used by the device to connect to the internet.

Here are all the identifiers that we have in Snowplow out of the box, grouped by the entity to which they refer. Depending on your own pipeline setup, you might have custom identifiers, such as `client_id`, `email`, `tv_id` etc. The below is what comes with Snowplow when implementing the default web and mobile tracking. (If you're interested in more detailed information about each of identifiers, check out the Snowplow [canonical event model][canonical-event-model-wiki], the mobile context sections of the [Android tracker][android-tracker-docs] and the [iOS tracker documentation][ios-tracker-docs], and the [mobile context schema][mobile-context-schema]. For more on the difference between `events.user_id` and `client_session.user_id`, see [this post on Discourse][understanding-the-client-session-context] and the comments underneath it.)

**User**
- `events.user_id`

**Device**
- `domain_userid`
- `refr_domain_userid`
- `network_userid`
- `client_session.user_id`
- `android_idfa`
- `apple_idfa`
- `apple_idfv`
- `useragent`
- `user_fingerprint`

**Network**
- `user_ipaddress`
- `geo_lattitude`
- `geo_longitude`

When all the data points are grouped by the entity they refer to, it quickly becomes apparent that their names might be confusing and misleading. Whenever possible, we've always made an effort to keep the Snowplow terminology accurate but close to popular usage. We have been more successful on some occasions than others. It's important to keep in mind that, e.g. the 'user' in `useragent` is not a person, but a machine; and this data point refers to a Device, not a User, in our taxonomy.

Another thing that becomes apparent almost immediately is that while some identifiers can pinpoint a specific instance of an entity on their own, others can only do so when combined. For example, an Android IDFA refers to a unique instance of the Device entity. But none of the identifiers for the Network entity can properly identify a network instance on its own: all three must be combined.

### Data model

By grouping all of our identifiers by the entity to which they refer, we've taken a big step towards fleshing out the data model for our graph as well. It now looks obvious that we will have three node labels: `User`, `Device` and `Network`; and each node will have a set of properties, based on its label. For example, a user node might look like this:

```
(n:User { user_id: 'ali@myemail.com' })
```

We can specify that some properties are required, if we formalize the structure of the nodes as a JSON schema. For instance, the schema for the `Network` node might look like this:

{% highlight json %}
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a Network node",
  "self": {
    "vendor": "com.example",
    "name": "network",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "userIpaddress": {
      "description": "IP address.",
      "type": "string"
    },
    "geoLatitude": {
      "description": "Visitor location latitude.",
      "type": "string"
    },
    "geoLongitude": {
      "description": "Visitor location longitude.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": ["userIpaddress", "geoLatitude", "geoLongitude"]
}
{% endhighlight %}

Once we've figured out the node types, we can match each pair and think about an appropriate name for the relationship that exists between them, as well as how that relationship should be directed. Here's a non-exhaustive starting point:

```
(User)-[:USES]->(Device)
(User)-[:WITHIN]->(Network)
(Device)-[:VIA]->(Network)
```

We can also think about how different instances of the same entity relate to each other:

```
(User)-[:SHARES_DEVICE_WITH]-(User)
(Device)-[:SHARES_USER_WITH]-(Device)
(Network)-[:HAS_SAME_IP_AS]-(Network)
```

A major part of the ER exercise is to disambiguate all the different mentions of the same instance, which we can do with an `[:ALIAS]` relationship:

```
(User)-[:ALIAS]-(User)
(Device)-[:ALIAS]-(Device)
(Network)-[:ALIAS]-(Network)
```

Because, we're modeling the data as a graph, we can easily extend our model as our solution matures, for instance if we add more identifiers to our taxonomy or figure out new relationships between the entities.

### Logical model

There are many instances of each of these entities in the real world, but each instance is unique. However, at the level of an individual event, the data we have on two separate instances of an entity might look the same. For example, we may have two events, attributed to the same cookie ID, but those events might represent two separate users on the same device. Or, we might have two events with different cookie IDs, that belong to the same user on different devices.

In fact, the mentions of all three entities have these potentially many-to-many relationships between each other, but on the level of the individual event the relationship is always one-to-one. The logical model of our ER solution is what enables us to figure out which record refers to which entity instance. It's a set of rules, or algorithms, that make inferences based on the data we have and create or update nodes and relationships in the graph.

Some relatively simple if-this-then-that rules can take us a long way to start with. Later on, we can upgrade to more sophisticate algorithms and machine learning.

Here are some examples in pseudocode:

```
# Assuming events are being read line by line,
# either from batch storage or in real time

# Create a Network node
IF network(user_ipaddress, location(geo_longitude, geo_lattitude))
AND network NOT EXISTS:
  CREATE network
  SET PROPERTY user_ipaddress
  SET PROPERTY (geo_lattitude, geo_longitude)

# Create a USES relationship
IF user AND device
AND user-USES->device NOT EXISTS:
  CREATE user-USES->device

# Assuming we're reading data that's
# already in the graph

# Infer a SHARES_USER_WITH relationship
IF device_1.user_id == device_2.user_id
AND device_1-SHARES_USER_WITH->device_2 NOT EXISTS:
  CREATE device_1-SHARES_USER_WITH->device_2

# Infer that two records refer to the same device instance based on shared network_userid
IF device_1.network_userid == device_2.network_userid
AND device_1-ALIAS-device_2 NOT EXISTS:
  CREATE device_1-ALIAS-device_2

# Add USES relationship based on two devices being ALIASes of each other
IF user-USES->device_1 AND device_1-ALIAS-device_2
AND user-USES->device_2 NOT EXISTS:
  CREATE user-USES->device_2
```

### A note on input sources and storage

If you are using Snowplow, the source data might be coming from your data warehouse in Redshift, BigQuery, or Snowflake; or else (for real-time pipelines), it might be coming from the enriched events Kinesis stream or Pub/Sub topic.

In the examples above, we've assumed using Neo4j for storing the entities graph, but of course any graph database will do.

Whatever the case, your processing application, which implements the logical model, will have to support two ways of working with the data. It will have to be able to process events line by line and update the graph. And it will also have to be able to looks for patterns in the graph and infer relationships from them.

## Next up in the series

We return to the topic of schema'ing our chosen denormalized graph model.

[modelling-page-view-events-as-a-graph]: https://snowplowanalytics.com/blog/2018/08/13/modelling-page-view-events-as-a-graph
[modeling-events-through-entity-snapshotting]: https://snowplowanalytics.com/blog/2015/01/18/modeling-events-through-entity-snapshotting
[canonical-event-model-wiki]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[android-tracker-docs]: https://github.com/snowplow/snowplow/wiki/Android-Tracker#mobile-context
[ios-tracker-docs]: https://github.com/snowplow/snowplow/wiki/iOS-Tracker#mobile-context
[mobile-context-schema]: https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow/mobile_context/jsonschema
[understanding-the-client-session-context]: https://discourse.snowplowanalytics.com/t/understanding-the-client-session-context/368
