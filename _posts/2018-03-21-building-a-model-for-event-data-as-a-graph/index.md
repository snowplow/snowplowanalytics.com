---
layout: post
title: "Building a model for event data as a graph"
title-short: Event data as a graph
tags: []
author: Dilyan
category:
permalink: /blog/2018/03/21/building-a-model-for-atomic-event-data-as-a-graph/
discourse: true
---

In recent months we've been busy expanding the variety of storage targets available for Snowplow users to load [Snowplow enriched events][enriched-event]. We recently launched our Snowflake Loader, and work is underway to add support for Google's BigQuery. Thinking even further ahead, one intriguing option is to add a graph-based storage target for Snowplow.

DILYAN TO ADD REST OF INTRO/TOC FOR THIS POST.

DILYAN TO EXPLAIN THIS IS THE FIRST POST IN A SERIES (PERHAPS TITLE SHOULD MAKE THIS CLEAR TOO).

## Why graph databases?

Graph databases have some key advantages over relational and columnar-relational databases. The way people tend to visualise concepts (on a whiteboard, say) is often already a graph; a graph database can make it easier to map business thinking to the data structures that are expected to support and underpin that thinking. By contrast, relational databases (RDBMSes) introduce a great deal of accidental complexity when translating business concepts to their tabular structure. By shortening the distance between how strategic decision-makers think and how their data teams think, graph databases can help advance Snowplow's mission to aid companies in making better decisions.

Graph databases are also often designed for low-latency performance, even relative to query complexity. That can make them a better choice than relational databases for certain applications, such as recommendation engines, especially at scale.

There are some questions (for example path analysis) that are difficult to answer when using a relational database, but that are easy to answer with a graph. We've experimented with [path analysis in Neo4j][neo4j-pathing] before.

The structure of graph databases also means that datapoints are readily extensible through the addition of new nodes and edges. For example, you could add geolocation data modelled as a graph and link it to your Snowplow enriched events by relationships that do not otherwise interfere with the enriched event's data model. That would open up a whole new avenue for enriching the data in-database.

Adding support for a graph storage target to Snowplow could make a lot of sense. But while with RDBMSs the core data model is the same and we only have to account for the way different vendors implement that model, with graph databases there are some crucial questions that we still need to answer.

## How do we model event data as a graph?

In the Snowplow event data model, as currently implemented in Redshift, Snowflake and Elasticsearch, each event is a record in a table or index. The table has as many columns or properties as there are facets to that event, eg user, timestamp, URL, etc. In the case of Redshift, some of the nested data is shredded into separate tables, some of which may have a many-to-one relationship with the "parent" event record. But the underlying model is the same - there isn't much scope for deviation from it.

In graph databases, there are many ways event data can be modelled. One example would be to make all of the entities associated with the event nodes in the graph (user, geo-location etc), and then draw relationships between those nodes. A variant on this would be to make the event itself a node, and this "parent" node then has outgoing relationships to those same entities. It's not obvious which model is 'the right one', if there even is such a thing.

Graphs excel at modelling networks – everything from social networks and product preferences to supply-chains and data lineage. You can even model and link different types of networks in an overarching graph, which is very powerful. In that environment, events would perhaps be best represented by relationships between entities in those networks.

Since graphs are so flexible, the advice is usually to build a model that suits the queries you want to run. Snowplow users come from all sorts of industries and are trying to solve a great variety of challenges. Whatever our approach, it needs to be able to accommodate that diversity.

DILYAN TO ADD BRIEF INTRO INTO THE FOLLOWING SUB-SECTION OPTIONS

### Taking an event-grammar approach

We've already done some foundational work on developing a [generalised event grammar][entity-snapshotting] that goes some way towards a graph data model for event data. In that model, an event is a snapshot of set of entities in time, with a subject, an object, context and so on:

![event-grammar][event-grammar]

This model is already a graph, with nodes representing the various entities and relationships between the nodes.

In a relational database, the relationships between these entities are most often **implicit**: primary and foreign keys are never typed, rarely annotated and often not even enforced. A user with knowledge of the domain and the particular data model will be able to say what role each entity plays in the event and how the entities are related to each other. But in a graph, relationships are always must first-class constructs. And, because relationships in graph databases are always **directed**, the roles of the different entities must also be explicit.

In an RDBMS, a subject and an object will be related by virtue of belonging to the same row (event). It is up to the user to decide which entity plays what role; this can cause problems when an event contains multiple entities of the same type but very different significance (e.g. *player one kills player two*).

In a graph, the subject and the object of the event will have to be explicitly related by a directed relationship - one that clearly indicates what role each entity plays.

In order to construct a graph, we will have to choose how to represent events as nodes and edges. To do that, it's necessary to interpret the events. A pared-down interpretation of a Snowplow `page_view` event in the framework of our event grammar might look something like this:

![event-grammar-graph][event-grammar-graph]

with nodes:

```
(n:User)

{
  "user_id": "alice@mail.com",
  "domain_userid": "fde3285a-2067-4df7-836d-991432017864"
}

(n:Page)

{
  "page_url": "https://snowplowanalytics.com"
}

(n:Referrer)

{
  "page_referrer": "google.com"
}

(n:Browser)

{
  "br_name": "Chrome"
}
```

### Taking a time-series or event-graph approach

A popular option for modelling events in a graph is to make each event a node that is related to the event that happened immediately before it and after it through a `NEXT` / `PREVIOUS` relationship. The event node then has outgoing `HAS` relationships to all of its entities, such as user nodes, context nodes, etc.

![time-series][time-series]

Here are the nodes in this model:

```
(n:Event)

{
  "event_id": "9d718e6d-2037-41d5-82e6-4d3f73bccb81",
  "derived_tstamp": "2015-10-07 13:52:23.001",
  "event_name": "page_view"
},
{
  "event_id": "727ca64c-5ba7-4b4f-b27a-c652a86dd7e0",
  "derived_tstamp": "2015-10-07 13:52:44.045",
  "event_name": "page_view"
}

(n:User)

{
  "user_id": "alice@mail.com"
}

(n:Page)

{
  "page_url": "snowplowanalytics.com"
},
{
  "page_url": "snowplowanalytics.com/blog"
}
```

This is an easy model to abstract over event data but it makes querying the data harder, because entities are related to each other only through the event node they belong to.

A variation of this model is called an event graph. In it, each event is a node and the relationships between the events imply causality. Event graphs are useful for modelling sequences of related events, like the series of events that describe a process. For example, an `enter_pub` event is followed by a `queue` event, which is followed by `order_pint` event, and so on. This is useful for conceptualising and simulating processes, and could be applied in use cases where we want to build a predictive model.

### Events as nodes versus events as edges

The previous two examples represent two different ways of modeling an event in a graph environment. In the first case, the event is an edge (or, more correctly, an arc spanning many edges). In the second one, the event is a node.

Unlike columns, edges and relationships are created differently in the database at write time and they are also queried differently, so it's important to make the distinction in advance.

There is also the option to "denormalise" the data, ie represent the same data in different ways. This makes queries easier, but adds complexity and redundancy to the model. An example would be a model where each event is a node in a time series, with outgoing relationships to all its entities, but there are *also* relationships between the entities:

![denormalised-graph][denormalised-graph]

This last model combines the best of both worlds. It gives us the opportunity to perform various types of queries. For example, we can easily do path analysis by traversing the `NEXT` / `PREVIOUS` edges between the `Event` nodes, but we can also query relationships between the entities that constitute the event.

Over the following weeks and months we'll use this model to translate the canonical Snowplow event model (as currently used in relational databases) to a graph structure. We'll start by modeling a `page_view` event in its entirety in the next post in this series.

## Do we only want to load atomic event data in a graph database?

The model above provides a good framework for loading unopinionated atomic event data into a graph database - but we will also want to load modelled data.

DILYAN TO EXPLAIN WHAT WE MEAN BY MODELLED DATA.

Compared to the modelling of the events themselves, with modelled data the use cases should be clearer, and the structure of the model in a graph database *should* emerge naturally from those use cases. We will document those experiments as part of this series as well.

## What should be our pilot storage target?

While there are many exciting options in this space, such as Amazon's recent announcement of Neptune, its cloud-native graph solution, we will be starting with Neo4j for this research and development effort. Neo4j is already widely used and its intuitive query language Cypher makes it a great choice for open-ended exploration. Its visualisation layer will help us document the journey.

This said, our philosophy is always that when people chose to use Snowplow, they do not have to be bound to specific third-party database providers. Later in the blog post series, we hope to experiment with new, vendor-agnostic and potentially in-house formats for graph-structured events on disk.

## The next post in the series

DILYAN TO ADD

[neo4j-pathing]: https://snowplowanalytics.com/blog/2017/07/17/loading-and-analysing-snowplow-event-data-in-Neo4j/
[entity-snapshotting]: https://snowplowanalytics.com/blog/2015/01/18/modeling-events-through-entity-snapshotting/

[enriched-event]: https://github.com/snowplow/snowplow/wiki/canonical-event-model

[event-grammar]: /assets/img/blog/2018/03/revised-grammar.png
[event-grammar-graph]: /assets/img/blog/2018/03/event-grammar-graph.png
[time-series]: /assets/img/blog/2018/03/time-series.png
[denormalised-graph]: /assets/img/blog/2018/03/denormalised-graph.png
