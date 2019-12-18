---
layout: post
title: "Modelling page view events as a graph"
title-short: Page views as a graph
tags: [analytics, graph database, data modeling]
image: /assets/img/blog/2018/07/page_view_series.png
author: Dilyan
category: How to Guides
permalink: /blog/2018/08/13/modelling-page-view-events-as-a-graph/
discourse: true
---

In the [previous post in this series][building-a-model-for-atomic-event-data-as-a-graph] we started exploring options for modelling event data as a graph in general. We looked at three ways of modelling atomic event data:

1. The event grammar approach.
2. The event graph approach.
3. The denormalised graph approach.

Ultimately we [chose][building-a-model-for-atomic-event-data-as-a-graph] to model events as a denormalised graph, where the same things are represented multiple times in different ways (eg as both a node and a relationship). That adds redundancy to the model but makes querying it easier.

In our chosen model, we also made use of *reification*, or the turning of relationships into things. In our [event grammar][modeling-events-through-entity-snapshotting], events naturally exist in the relationships between entities. However, in the graph model, each event will be its own node with outgoing `HAS` relationships to its properties, for instance `(event)-[:HAS]->(user)`. Events will be connected to each other by a `NEXT` relationship. There will also be relationships between the various properties of the event, such as `(user)-[:VIEWS]->(page)`.

In this post, we will explore how we could model a `page_view` event with all its expected properties for the Snowplow pipeline. We'll discuss creating the necessary schemas and implementing them in code.

In this post we'll cover:

1. [Self-describing events](#self-describing-events)
2. [Custom contexts](#custom-contexts)
3. [Composable schemas](#composable-schemas)
4. [Identifying entities for the `page_view` event](#identifying-entities-for-the-page_view-event)
5. [Drawing the relationships](#drawing-the-relationships)
6. [Composing the `page_view` schema](#composing-the-page_view-schema)
7. [Implementing the contract in code](#implementing-the-contract-in-code)

### Self-describing events

In Neo4j and other graph databases, nodes, relationships and patterns are schemaless. This means the database does not distinguish between different types of nodes, relationships or patterns. It's up to developers to enforce any types.

At Snowplow Analytics, our preferred way of establishing the contract between the app sending the events and any process that consumes them (for validation, enrichment, loading, modelling, etc) is through schemas. However, typically, a Snowplow-authored self-describing JSON Schema will not describe an entire event. A couple of examples illustrate this point.

Here is the JSON schema for a `submit_form` event from Iglu Central:

```JSON
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a form submission event",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "submit_form",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "formId": {
      "type": "string"
    },
    "formClasses": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "elements": {
      "type": "array",
      "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "value": {
          "type": ["string", "null"]
        },
        "nodeName": {
          "enum": ["INPUT", "TEXTAREA", "SELECT"]
        },
        "type": {
          "enum": ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"]
        }
      },
      "required": ["name", "value", "nodeName"],
      "additionalProperties": false
      }
    }
  },
  "required": ["formId"],
  "additionalProperties": false
}
```

This schema only covers some of the entities and relationships that constitute the `submit_form` event. The data that matches this schema will end up as just one of many fields in the enriched event.

### Custom contexts

It's a similar story with any of our custom entity context schemas. In fact, all contexts sent with the event only populate a single `contexts` field in the enriched event; and the event transformer then parses out each context into its own column or table (depending on where the data will be stored).

```JSON
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for custom contexts",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "contexts",
    "format": "jsonschema",
    "version": "1-0-1"
  },

  "type": "array",

  "items": {
    "type": "object",
    "properties": {
      "schema": {
        "type": "string",
        "pattern": "^iglu:[a-zA-Z0-9-_.]+/[a-zA-Z0-9-_]+/[a-zA-Z0-9-_]+/[0-9]+-[0-9]+-[0-9]+$"
      },
      "data": {}
    },

    "required": ["schema", "data"],
    "additionalProperties": false
  }
}
```

And for some events, such as `page_view`, there isn't a specific JSON schema. The [Elasticsearch enriched event schema][elasticsearch_enriched_event] probably comes closest, being a projection of the [canonical event model][canonical-event-model] (of which the `atomic.events` [table in Redshift][redshift-storage] is another projection). But that schema also applies to the other events in the canonical model.

### Composable schemas

For this project we'd like to explore a new approach to building schemas, based on individual schemas for each of the event's components, be they nodes or relationships. The schema for the event itself will then reference those building blocks through [JSON pointers][json-pointer]. This will allow us to reuse entities and relationships across all events they are part of. It will also make maintaining the schemas much easier. For example, if an entity such as a user is part of many events and we want to add a new property to the `User` node, we'll only have to make one change: in the `user` schema. (Currently our self-describing JSON schemas do not support JSON pointers, so this functionality will have to be [added][issue-370] if we decide to go with this approach.)

To illustrate how this could work, let's look at a simplified `page_view` definition, consisting of two nodes -- `User` and `Page` -- connected by a `VISITED` relationship.

We start by defining the schemas for each of the two nodes and the relationship:

```JSON
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a User node",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "user",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "email": {
      "type": "string"
    }
  },

  "additionalProperties": false
},

{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a Page node",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "page",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "pageUrl": {
      "type": "string"
    }
  },

  "additionalProperties": false
},

{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for a VISITED relationship",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "visited",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",
  "properties": {
    "derivedTstamp": {
      "type": "string",
      "format": "date-time"
    },
    "startNode": {
      "$ref": "iglu:com.snowplowanalytics.graph/user/jsonschema/1-0-0"
    },
    "endNode": {
      "$ref": "iglu:com.snowplowanalytics.graph/page/jsonschema/1-0-0"
    }
  },

  "additionalProperties": false
}
```

We can then use these schemas to compose a schema for the `page_view` event:

```JSON
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",

  "description": "Schema for a page view event",

  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "page_view",
    "format": "jsonschema",
    "version": "1-0-0"
  },

  "type": "object",

  "properties": {

    "nodes": {
      "type": "object",
      "properties": {
        "user": {
          "$ref": "iglu:com.snowplowanalytics.graph/user/jsonschema/1-0-0"
        },
        "page": {
          "$ref": "iglu:com.snowplowanalytics.graph/page/jsonschema/1-0-0"
        }
      }
    },

    "relationships": {
      "type": "object",
      "properties": {
        "visited": {
          "$ref": "iglu:com.snowplowanalytics.graph/visited/jsonschema/1-0-0"
        }
      }
    }
  },

  "additionalProperties": false
}
```

### Identifying entities for the `page_view` event

Let's figure out which `atomic` properties should go into the `page_view` event. The `atomic.events` table is pretty wide but all fields are not required for a `page_view`. For example, all fields that start with the `tr_` prefix only apply to `transaction` events.

After removing all the irrelevant fields, we end up with this list of properties. I've broken them down into rough categories for ease of reading:

**Application**
- app_id
- platform

**Browser**
- br_colordepth
- br_cookies
- br_family
- br_features_director
- br_features_flash
- br_features_gears
- br_features_java
- br_features_pdf
- br_features_quicktime
- br_features_realplayer
- br_features_silverlight
- br_features_windowsmedia
- br_lang
- br_name
- br_renderengine
- br_type
- br_version
- br_viewheight
- br_viewwidth
- user_fingerprint

**Timestamps**
- collector_tstamp
- derived_tstamp
- dvce_created_tstamp
- dvce_sent_tstamp
- etl_tstamp
- true_tstamp

**Document**
- doc_charset
- doc_height
- doc_width

**Session**
- domain_sessionid
- domain_sessionidx

**Device**
- domain_userid
- dvce_ismobile
- dvce_screenheight
- dvce_screenwidth
- dvce_type
- network_userid
- refr_domain_userid
- useragent
- refr_dvce_tstamp

**OS**
- os_family
- os_manufacturer
- os_name
- os_timezone

**Infrastructure metadata**
- etl_tags
- name_tracker
- v_collector
- v_etl
- v_tracker

**Event metadata**
- event_fingerprint
- event_format
- event_id
- event
- event_name
- event_vendor
- event_version

**Geo**
- geo_city
- geo_country
- geo_latitude
- geo_longitude
- geo_region
- geo_region_name
- geo_timezone
- geo_zipcode

**Network**
- user_ipaddress
- ip_domain
- ip_isp
- ip_netspeed
- ip_organization

**Traffic source**

*Campaign attribution*
- mkt_campaign
- mkt_clickid
- mkt_content
- mkt_medium
- mkt_network
- mkt_source
- mkt_term

*Referrer*
- page_referrer
- refr_medium
- refr_source
- refr_term
- refr_urlfragment
- refr_urlhost
- refr_urlpath
- refr_urlport
- refr_urlquery
- refr_urlscheme

**Page**
- page_title
- page_url
- page_urlfragment
- page_urlhost
- page_urlpath
- page_urlport
- page_urlquery
- page_urlscheme

**User**
- user_id

That's a lot of properties! To make the graph a bit simpler and more manageable, it's best to model most of them as properties of the nodes and relationships that constitute the `page_view` event, rather than as nodes in their own right. To help us decide which fields should be nodes and which ones should be node properties, we'll fall back on another idea from our event grammar.

> In the real world as in software, entities change over time. If we can view our entities as consisting of properties, we can divide these properties into three approximate buckets:
>
> - **Permanent** or **static properties**: properties that don’t change over the lifetime of the entity. For example, my first language;
> - **Infrequently changing properties**: properties that change infrequently, for instance my email address;
> - **Frequently changing properties**: properties that frequently change. For example, my geographical location.
>
> The exact taxonomy is not set in stone. For example, a person’s height will start as a frequently changing property, become a static property in adulthood, and then switch to an infrequently changing property as she grows older. Nor do these properties necessarily change in particularly directional or meaningful ways over time: my geographical location has patterns in it (such as my daily commute), but there’s no overarching trend across all the data.

Which bucket a property falls into also depends on which we node we choose to assign it to. For example, the geographical location is a frequently changing property if it's assigned to me, the user; but it's a static or infrequently changing property if it's assigned to the network that I'm using.

Let's try to model frequently changing properties as nodes; and static / stable properties as node properties. Also, we can use the categories outlined above as a broad indication of what should be a node, eg we'll have an `Application` node with all the associated properties, etc:

| Node        | Categories                                          |
| :--         | :--                                                 |
| Application | Application                                         |
| Browser     | Browser                                             |
| Device      | Device, OS                                          |
| Session     | Session                                             |
| Page        | Page, Document                                      |
| User        | User                                                |
| Network     | Network, Geo                                        |
| Source      | Traffic source                                      |
| Event       | Event metadata, Infrastructure metadata, Timestamps |

We'll model the different timestamps as properties of the `Event` node. We can also model them as properties on the relationships within the event.

You can find all of our proposed node schemas in [this GitHub repo][node-schemas].

### Drawing the relationships

The next step is to figure out all the relationships between our nodes. We already know what two of them will be:

- `(Event)-[:NEXT]->(Event)`
- `(Event)-[:HAS]->(Non-event node)`.

We can consider all possible combinations of two nodes from the list above and see if any "natural" relationships exist between them. In that way, we can expand the list of relationships. To keep things simple for now, let's assume all constituent nodes are linked by a `[:WITH]` relationship, eg `(Application)<-[:WITH]-(Browser)`, `(Browser)<-[:WITH]-(Session)`. Admittedly, this is not very insightful for the casual observer. We will revisit relationships in a future post to expand on that. For now, we're just using the `[:WITH]` relationship to denormalise the graph, so we can easily run queries on it.

The proposed schemas for these relationships are in [this repo][relationship-schemas].

### Composing the `page_view` schema

We now have all the building blocks to compose a schema for the `page_view` event. You can find the schema [here][page-view-schema].

If we use this model to represent a series of `page_view` events, we end up with a graph that looks something like this (most nodes are omitted, for clarity):

![page-view-series][page-view-series]

Event nodes (in grey) are connected via `NEXT` relationships. Each one of them has outgoing `HAS` relationships to constituent nodes, such as `Page` (magenta) and `User` (blue). In turn, the constituent nodes are linked via `WITH` relationships.

Now we can easily query all the pages visited by a user, without having to go via the event node thanks to the `[:WITH]` relationships:

```
MATCH (u:User)-[:WITH]-(p:Page)
WHERE u.user_id = 'someone@mail.com'
RETURN p.page_url;
```

And we can also easily query the path a user has taken through the website:

```
MATCH p1 = (u:User)<-[:HAS]-(e:Event)
WHERE u.user_id = 'someone@mail.com'
WITH p1
MATCH path = (e)-[:NEXT*1..5]-()
RETURN path;
```

### Implementing the contract in code

Now that we've schemaed everything, we can think about how we can implement this in actual code.

A great thing about schemas is that the code falls naturally out of them. For example, here's how we might represent the `Application` node in Scala, along with a method that will create the node in the database in pseudocode:

```
class Node:
  def create(**options)

class Application(Node):
  def create(app_id, platform):
    statement = "MERGE (application:Application {app_id: $app_id, platform: $platform})"
    neo4j.execute(statement, {'platform': platform, 'app_id': app_id})
```

### Next up in the series

We take a break from trying to model events as a graph and explore another use case for graphs in event analytics -- identity resolution.

[building-a-model-for-atomic-event-data-as-a-graph]: https://snowplowanalytics.com/blog/2018/03/26/building-a-model-for-atomic-event-data-as-a-graph/
[modeling-events-through-entity-snapshotting]: https://snowplowanalytics.com/blog/2015/01/18/modeling-events-through-entity-snapshotting/
[elasticsearch_enriched_event]: https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/elasticsearch_enriched_event/jsonschema/2-0-0
[canonical-event-model]: https://github.com/snowplow/snowplow/wiki/canonical-event-model
[redshift-storage]: https://github.com/snowplow/snowplow/tree/master/4-storage/redshift-storage/sql
[json-pointer]: https://tools.ietf.org/html/rfc6901
[issue-370]: https://github.com/snowplow/iglu/issues/370
[node-schemas]: https://github.com/snowplow-incubator/graph-event-data-model/tree/master/schemas/com.snowplowanalytics.graph/nodes
[relationship-schemas]: https://github.com/snowplow-incubator/graph-event-data-model/tree/master/schemas/com.snowplowanalytics.graph/relationships
[page-view-schema]: https://github.com/snowplow-incubator/graph-event-data-model/blob/master/schemas/com.snowplowanalytics.graph/events/page_view/jsonschema/1-0-0

[page-view-series]: /assets/img/blog/2018/07/page_view_series.png
