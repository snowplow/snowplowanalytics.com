---
layout: post
title: Loading and analyzing Snowplow event data in Neo4j
tags: [snowplow, neo4j, graph database, path analysis, cypher]
author: Dilyan
category: Analytics
---

Back in 2014 we published a series of blog post on using Snowplow event data in the graph database [Neo4j] [neo4j]. Three years on, they're still among our most popular blog posts. (See below for links to the original posts.)

A lot has changed since then. Neo4j has strengthened its position as a leading graph database solution. Its query language, Cypher, has grown with the platform. It has changed to the point where some of the queries from the original posts no longer work verbatim. We've come up with a more straightforward model to fit Snowplow data in a graph environment.

At a recent hackathon in Vienna we had a chance to dive back into the topic. We discovered our old blog posts could do with an update. This is it.

With Snowplow, we want to empower our users to get the most out of their data. Where your data lives has big implications for the types of query and analyses you can run on it.

Most of the time, we're analyzing data with SQL. This is great for a whole class of OLAP style analytics. It enables us to slice and dice different combinations of dimensions and metrics. We can aggregate to the level of the user, session, page or other entity that we care about.

Yet, when we're doing event analytics, we often want to understand the sequence of events. We want to know, for example:

* How long does it take users to get from point A to point B on our website or mobile app?
* What are the different paths that people take to get to point C?
* What are the different paths that people take from point D?

This type of *path analysis* is not well supported by traditional SQL databases. It results in many table scans. The window functions we use to first order events and then sequence them are expensive.

Graph databases represent a new approach to storing and querying data. We've started experimenting with using them to try and answer some of the questions above. In this blog post, we'll cover the basics of graph databases. We'll share some of the experimentation we've done with Neo4j. Then we'll show how to load event-level Snowplow data into Neo4j. Finally, we'll demonstrate how to perform the path analysis mentioned above.

<!--more-->

## Modeling event data in graph databases

Social networks use graph databases to model data where relationships are important. (Facebook has a search tool called 'Graph Search'.) A graph database consists of:

-  *nodes*, which we can consider to be objects,
- and directed *edges* or *relationships*, which connect nodes.

So on Facebook, both you and your friends are nodes; photos are nodes as well. Various relationships connect all these objects to each other. Adding a photo is a relationship between a user node and a photo node. So is liking a photo. And friendship is a relationship between two user nodes.

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-fb-example.png"></p>

To find out who liked a particular photo, we first need to identify the node representing that photo. Then we follow its incoming `[:LIKED]` relationships and see where they end up. By contrast, in Redshift we would need to do a full table scan of all photos to identify the one that interests us. Then we would have to scan another table of likes to identify the users linked to the photo. Finally, we would have to scan the full users table to identify details about the user that liked the photo.

For our needs, we want to describe a user's journey through a website. We need to decide how to model that journey as a graph. To start off, we want to model `page_view` events. For this we will need some `User` nodes (`domain_userid`) and some `Page` nodes (`page_urlpath`, let's say). We can add a simple `(User)-[:VIEWS]->(Page)` relationship between them. But that will not let us track the order of the events. Pages do not 'happen' one after another. They all exist at the same time. For path analysis, we need the actual `page_view` event to be the `Page` node.

In the example below there are two nodes: a `User` node and a `Page` node. The `Page` node has been passed the additional property `{url: "Page 1"}`, which allows us to see on which page the event happened.

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-basic-page-view.png"></p>

(This is a departure from how we did things last time around. Then, the `page view` event was a node that sat in-between the `User` node and the `Page` node. Using the concept of [event grammars] [event-grammars], we set up a generalizable relationship: `(User)-[:VERB]->[View]-[:OBJECT]->(Page)`.)

We can link the `Page` nodes together to put these events in order. The diagram below shows a user who has visited Page 1, then Page 2, then Page 1 again, and finally Page 3. And we are not limited to page views. We can model page pings, link clicks, add to basket events and so on by adding extra nodes and relationships.

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-next-relationships.png"></p>

We will be using Neo4j for our experiments because it has two features in particular that stand out:

1. It has a browser-based interface which automatically creates visualizations of the graph like the ones in this post. This is a real help in building our initial graphs and developing queries against them.
2. We get to use Cypher, Neo4j's expressive query language, to ask questions of our data. By way of example, to create the relationships between the user and the first two page views above, we first `CREATE` the nodes we're interested in and then *draw* the relationships between them:

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-code-snippet.png"></p>

## Loading Snowplow data into Neo4j

Let's now walk through taking Snowplow data from Redshift and loading it into Neo4j.

We'll start by figuring out how to transform and fetch the data out of our Snowplow Redshift database. Then, we'll look at how to import it into Neo4j.

Our graph data model (visualized above) contains two types of nodes:

1. `User` nodes
2. `Page` nodes (for now our interest is in page views; but that can be any event)

and two types of relationships:

1. `VIEWS` relationships that link users to the events that they have performed
2. `NEXT` relationships that order the events that have occurred for a specific user. They run from each event to the next event for that user.

Nodes and relationships can also have properties. For our experiment, the relationships don't need any properties. We'll assign the `User` nodes their unique `domain_userid`. The `Page` nodes will need a bit more detail:

- `event_id` - to identify each event
- `page_urlhost` and `page_urlpath` combined into a single property - to identify the page
- `derived_tstamp` - so we know when it occurred
- `domain_sessionidx` - to distinguish sequences of events for a specific user between sessions
- `refr_urlhost` and `refr_urlpath` combined into a single property - to infer *how* users move from one page to the next
- `domain_userid` - as a shortcut so we can identify which user an event belongs to, without walking the graph

### Getting the data out of Redshift

The following SQL query fetches one year’s worth of data for our `Page` nodes:

{% highlight sql%}
WITH step1 AS
(
  -- Select the data for the properties we want to populate

  SELECT
    event_id                           AS event_id,
    CONCAT(page_urlhost, page_urlpath) AS page_url,
    derived_tstamp                     AS derived_tstamp,
    domain_sessionidx                  AS domain_sessionidx,
    CONCAT(refr_urlhost, refr_urlpath) AS refr_url,
    domain_userid                      AS domain_userid

  FROM atomic.events

  WHERE derived_tstamp :: DATE BETWEEN '2016-07-02' AND '2017-07-02'
    AND page_urlpath IS NOT NULL
    AND domain_userid IS NOT NULL
    AND event_name = 'page_view'

  GROUP BY 1, 2, 3, 4, 5, 6
),

  -- Deduplicate the events

  step2 AS
(
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY derived_tstamp) AS n

  FROM step1
)

  -- Only select the fields from step 1

SELECT
  event_id, page_url,
  derived_tstamp, domain_sessionidx,
  refr_url, domain_userid

FROM step2

WHERE n = 1;
{% endhighlight %}

This query gives us one line per `page_view` event. We also have all the `domain_userid` that we need for the `User` nodes. However, in many cases there are many events for each `domain_userid`. To speed up the process, it's better to give Neo4j a deduplicated list of users so it does not have to check for duplicates when adding the nodes.

To fetch a unique list of users, run this query:

{% highlight sql%}
SELECT
  domain_userid

FROM atomic.events

WHERE derived_tstamp :: DATE BETWEEN '2016-07-02' AND '2017-07-02'
  AND page_urlpath IS NOT NULL
  AND domain_userid IS NOT NULL
  AND event  = 'page_view'

GROUP BY 1;
{% endhighlight %}

You could also include any extra information you want to capture about users, eg location or email. The fastest way to do this is while you build the database, but you can still add properties to nodes later.

We'll also need to pull some data to help us build the `NEXT` relationships between the different page view events. To do this, we can use a window function to identify each event's follow-up page view. We need to partition our data by `domain_userid` and `domain_sessionidx`. We also need to order it by a timestamp that preserves the original order of events, such as the `dvce_created_tstamp` or the `derived_tstamp` (not the `collector_tstamp`!):

{% highlight sql%}
WITH step1 AS
(
  SELECT
    event_id,
    LEAD(event_id, 1) OVER (PARTITION BY domain_userid, domain_sessionidx ORDER BY derived_tstamp ) AS next_event_id,
    derived_tstamp -- to deduplicate

  FROM atomic.events

  WHERE derived_tstamp :: DATE BETWEEN '2016-07-02' AND '2017-07-02'
    AND page_urlpath IS NOT NULL
    AND domain_userid IS NOT NULL
    AND event = 'page_view'
),

  --deduplicate the events

  step2 AS
(
  SELECT
    *,
    ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY derived_tstamp) AS n

  FROM step1
),

  step3 AS

  -- only select relevant fields
(
  SELECT
    event_id,
    next_event_id

  FROM step2

  WHERE n = 1
)

SELECT *

FROM step3

WHERE next_event_id IS NOT NULL; -- filter out events that have no followup page view (because they are the last event in the session)
{% endhighlight %}

(A side note. In step2 in the above query we're deduplicating the results to ensure that we end up with a list of unique `page_view` events and their follow-up events if any. We do this to make the query universally applicable. However, it's much better if there are no duplicates in your `atomic` tables to begin with. Since Snowplow R88 we are taking care of almost all duplicates during processing, so they don't ever make it into Redshift -- but you have to have cross-batch natural deduplication turned on, which is something we do by request as it has an associated cost. For historical, pre-R88 duplicates, you can use the [deduplication queries] [deduplication-queries] that we released in R72.)

Let's save the results from the above queries as three `.csv` files: `page_nodes.csv`, `user_nodes.csv` and `next_relationships.csv`.

### Getting the nodes and relationships into Neo4j

Previously, we got data into Neo4j by writing `CREATE` statements directly in the browser console. This was fine for a few nodes, but doing it for hundreds of thousands of nodes is somewhat unwieldy. Now that we have our data in `.csv` format, there is a better option: Cypher's `LOAD CSV` [clause] [load-csv].

If you are loading the `.csv` files from your local machine (as we are), make sure they are in the `Neo4j/default.graphdb/import` folder (or its equivalent on your computer).

Let's start by loading the `User` nodes. We can do it by running the following Cypher query:

<pre>
LOAD CSV WITH HEADERS FROM "file:///user_nodes.csv" AS line
CREATE (u:User {id: line.domain_userid});
</pre>

Then, let's load our `Page` nodes:

<pre>
LOAD CSV WITH HEADERS FROM "file:///view_nodes.csv" AS line
CREATE (p:Page {id: line.event_id, user: line.domain_userid, page: line.page_url,
        tstamp: line.derived_tstamp, referrer: line.refr_url, session: line.domain_sessionidx});
</pre>

Before we go on, let's also create a uniqueness constraint on the two labels we already have: `User` and `Page`. That will serve as a check to ensure that all nodes have unique `id` properties -- if they don't Neo4j won't let us create the constraint. (In this case, the `id` property in Neo4j corresponds to `domain_userid` or `event_id` from Redshift -- depending on the type of node.) More importantly, the constraint will ensure that we won't be able to accidentally introduces duplicates if we decide to add more nodes.

<pre>
CREATE CONSTRAINT ON (user:User) ASSERT user.id IS UNIQUE;
CREATE CONSTRAINT ON (page:Page) ASSERT page.id IS UNIQUE;
</pre>

Next up, let's link our `User` nodes to our `Page` nodes by creating the relationships between them. We don't need to use the `LOAD CSV` clause, since all the data we need has already been loaded into Neo4j:

<pre>
MATCH (u:User), (p:Page) WHERE u.id = p.user
CREATE (u)-[:VIEWS]->(p);
</pre>

If you open up the Database Information tab (top left on your screen), you can see lists of all the node labels, relationship types and property keys in your database. Clicking on the `VIEWS` relationship type will autoexecute a query that will show you 25 such relationships. The results will look similar to this:

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-users-linked-to-views.png"></p>

Finally, let's create the relationships between the different page view events that belong to the same user:

<pre>
LOAD CSV WITH HEADERS FROM "file:///next_relationships.csv" AS line
MATCH (current:Page), (next:Page) WHERE line.event_id = current.id AND line.next_event_id = next.id
CREATE (current)-[:NEXT]->(next);
</pre>

Now all our page views are linked to the user who visited the page and also between each other if they were part of a series of visits.

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-user-history.png"></p>

On the left above we can see the history of a user who visited 5 pages during their first session. On the right, another user is seen visiting 4 pages and then hitting the refresh button on the last one. (We've chosen to visualize the session index in this case, but any of the node's properties could be surfaced, such as page URL, referrer, etc.)

### Visualizing the data

The Neo4j browser console does a great job of visualizing the data in the database. We can use it to search for some patterns that we expect to find, using the LIMIT command to avoid being inundated. For example:

<pre>
MATCH (u:User)-[:VIEWS]->(p:Page)
RETURN u, p
LIMIT 10;
</pre>

shows us some 'user views page' relationships:

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-user-views-page.png"></p>

And we can check that our `NEXT` relationships are doing what we expect with:

<pre>
MATCH p = (:Page)-[:NEXT*1..5]->(:Page)
RETURN p
LIMIT 10;
</pre>

`[:NEXT*1..5]` tells Neo4j to follow between 1 and 5 relationships when walking the graph. This results in:

<p style="text-align:center"><img src="/assets/img/blog/2017/07/Neo4j-page-next-page.png"></p>

## Using Neo4j to perform path analysis

In this section, we’ll answer some questions on the journeys that users take through our own website. We’ll start by answering some easy questions to get used to working with Cypher. Some of these simpler queries could be easily written in SQL. We’re just interested in checking out how Cypher works at this stage. Later on, we’ll move on to answering questions that cannot be easily answered using SQL.

We’ll answer the following questions:
1. How many visits were there to our homepage?
2. What page were users on before arriving at the 'About' page?
3. What journeys do users take from the homepage?
4. What are the most common journeys that end on a particular page?
5. How long does it take users to get from one page to another?
6. What are some common user journeys?

### How many visits were there to our homepage?

We start by finding the type of journey we are interested in ('user views homepage') in the `MATCH` clause. We've named our variables `user`, `r` (short for 'relationship') and `home`. We don't end up using the `user` variable, but it's in the query just to make it friendlier.

Then, we return the `page` attribute for the nodes that match the `home` variable (in this case it always has the same value: `snowplowanalytics.com/`), and a count of the incoming relationships from among the matching patterns.

<pre>
MATCH (user:User)-[r:VIEWS]->(home:Page {page: "snowplowanalytics.com/"})
RETURN home.page AS url, count(r) AS visits;
</pre>

This returns a table that tells us the number of views of the home page:


<pre>
╒════════════════════════╤════════╕
│"url"                   │"visits"│
╞════════════════════════╪════════╡
│"snowplowanalytics.com/"│82026   │
└────────────────────────┴────────┘
</pre>

Now we can look for ‘bounces’ -- visitors who only went to the homepage and then left the site. For this, we start by matching the same patterns, but then limit them with a `WHERE` clause and the `NOT` operator.

<pre>
MATCH (user:User)-[r:VIEWS]->(home:Page {page: "snowplowanalytics.com/"})
WHERE NOT (home)-[:NEXT]->()
RETURN home.page AS url, count(r) AS visits;
</pre>

<pre>
╒════════════════════════╤════════╕
│"url"                   │"visits"│
╞════════════════════════╪════════╡
│"snowplowanalytics.com/"│31116   │
└────────────────────────┴────────┘
</pre>

So, of the 82,026 homepage views in that period, 31,116 were not followed by another page view within the same session.

Now let’s consider a more interesting question...

### What page were users on before arriving at the 'About' page?

Let’s say that we’re interested in our ‘About’ page because this has our contact details. We want to find out how users arrive at this page. That means we need to follow the `NEXT` relationships backwards from the events in our `Page` nodes to identify the pages that were viewed before the ‘About’ page.

We start by specifying a pattern that ends in the ‘About’ page. Then we aggregate the results:

<pre>
MATCH (about:Page {page: "snowplowanalytics.com/company/"})<-[:NEXT]-(prev:Page)
RETURN prev.page AS previous_page, count(prev) AS visits
ORDER BY count(prev) DESC
LIMIT 10;
</pre>

This time, we’ve asked Neo4j to order the results in descending order, and limit them to the top 10.

<pre>
╒══════════════════════════════════════════════════════╤════════╕
│"previous_page"                                       │"visits"│
╞══════════════════════════════════════════════════════╪════════╡
│"snowplowanalytics.com/"                              │358     │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/company/"                      │77      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-insights/"   │76      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/services/"                     │73      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-open-source/"│47      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-react/"      │45      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/trusted-by/"         │42      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/"                     │42      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/company/contact-us/"           │39      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/"                    │20      │
└──────────────────────────────────────────────────────┴────────┘
</pre>

You will notice that a lot of people seem to have visited the 'About' page two times in a row. In fact, more people have done so than come from any other page on the website apart from the homepage. These cases can be explained as page refreshes. Since they don't tell us a lot about the user's behavior, let's exclude them from the results:

<pre>
MATCH path = (about:Page {page: "snowplowanalytics.com/company/"})<-[:NEXT]-(prev:Page)
WHERE NOT prev.page = about.page
RETURN prev.page AS previous_page, count(prev) AS visits
ORDER BY count(prev) DESC
LIMIT 10;
</pre>

<pre>
╒══════════════════════════════════════════════════════╤════════╕
│"previous_page"                                       │"visits"│
╞══════════════════════════════════════════════════════╪════════╡
│"snowplowanalytics.com/"                              │358     │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-insights/"   │76      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/services/"                     │73      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-open-source/"│47      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-react/"      │45      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/trusted-by/"         │42      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/"                     │42      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/company/contact-us/"           │39      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/"                    │20      │
├──────────────────────────────────────────────────────┼────────┤
│"discourse.snowplowanalytics.com/"                    │16      │
└──────────────────────────────────────────────────────┴────────┘
</pre>

It is easy to amend our query so it finds the page users were on two steps before they got to the 'About' page. We just have to add an extra `NEXT` relationship in the `MATCH` clause:

<pre>
MATCH (about:Page {page: "snowplowanalytics.com/company/"})<-[:NEXT]-()<-[:NEXT]-(prev:Page)
WHERE NOT prev.page = about.page
RETURN prev.page AS previous_page, count(prev) AS visits
ORDER BY count(prev) DESC
LIMIT 10;
</pre>

As a shortcut, we can instruct Neo4j to follow two relationships by writing `[:NEXT*2]`:

<pre>
MATCH (about:Page {page: "snowplowanalytics.com/company/"})<-[:NEXT*2]-(prev:Page)
WHERE NOT prev.page = about.page
RETURN prev.page AS previous_page, count(prev) AS visits
ORDER BY count(prev) DESC
LIMIT 10;
</pre>

In either case the result is the same:

<pre>
╒══════════════════════════════════════════════════════╤════════╕
│"previous_page"                                       │"visits"│
╞══════════════════════════════════════════════════════╪════════╡
│"snowplowanalytics.com/"                              │182     │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-insights/"   │48      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/services/"                     │44      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-react/"      │36      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/snowplow-open-source/"│31      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/products/"                     │27      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/trusted-by/"         │23      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/company/careers/"              │20      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/customers/"                    │14      │
├──────────────────────────────────────────────────────┼────────┤
│"snowplowanalytics.com/blog/"                         │13      │
└──────────────────────────────────────────────────────┴────────┘
</pre>

We can go back even further and find the page users were on 5 steps before the ‘About’ page:

<pre>
MATCH (about:Page {page: "snowplowanalytics.com/company/"})<-[:NEXT*5]-(prev:Page)
WHERE NOT prev.page = about.page
RETURN prev.page AS previous_page, count(prev) AS visits
ORDER BY count(prev) DESC
LIMIT 10;
</pre>

This is the kind of search that would be difficult in SQL because it would involve a full table scan for every step back we want to take from our destination page. Neo4j handles this type of query very comfortably, because executing it is simply a matter of identifying journeys that end on the page and then walking the graphs *just* for those journeys. It returned the results of this particular query in 812ms.

### What journeys do users take from the homepage?

In the last section we identified journeys that lead to a particular page. Now let’s take a page as a starting point, and see how journeys progress from that.

For this example, we’ll start on our homepage. Let’s identify the three steps that a user takes from the homepage, as a sequence (rather than individual steps as we did in the previous example). We’ll use the EXTRACT command to return just the URL attached to the events in the path, rather than the nodes themselves. That’s because we’re not looking for user IDs, timestamps, etc, so this will give us some cleaner results.

<pre>
MATCH path = (home:Page {page: "snowplowanalytics.com/"})-[:NEXT*3]->(:Page)
RETURN EXTRACT(p IN NODES(path)[1..LENGTH(path)+1] | p.page) AS path, COUNT(path) AS users
ORDER BY COUNT(path) DESC
LIMIT 10;
</pre>

This query gives us the 10 most common paths from the homepage:

<pre>
╒══════════════════════════════════════════════════════════════════════╤═══════╕
│"path"                                                                │"users"│
╞══════════════════════════════════════════════════════════════════════╪═══════╡
│["snowplowanalytics.com/product/","snowplowanalytics.com/services/","s│1025   │
│nowplowanalytics.com/guides/"]                                        │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/product/","sn│698    │
│owplowanalytics.com/services/"]                                       │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/services/","s│676    │
│nowplowanalytics.com/product/"]                                       │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/","snowplowanalytics.│542    │
│com/"]                                                                │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/","snowplowan│526    │
│alytics.com/product/"]                                                │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/product/","sn│464    │
│owplowanalytics.com/product/"]                                        │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/trial/","snow│429    │
│plowanalytics.com/product/"]                                          │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/trial/","snow│288    │
│plowanalytics.com/guides/"]                                           │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/guides/","sno│288    │
│wplowanalytics.com/guides/"]                                          │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/product/","snowplowanalytics.com/","snowplowan│240    │
│alytics.com/"]                                                        │       │
└──────────────────────────────────────────────────────────────────────┴───────┘
</pre>

(A quick side note to explain what `NODES(path)[1..LENGTH(path)+1]` does.

`NODES(path)` produces a list of all nodes that are part of the pattern we called `path`. `[1..LENGTH(path)+1]` then only selects the certain elements from that list: everything from the 1st element to the LENGTH(path)+1th element. The index is 0-based. Since we do not want to include the starting page (the homepage) in the results, we want to exclude the 0th element and start with the 1st one. On the other end, we want to see the final page in the pattern, so we do not want to exclude anything. Furthermore, the square brackets notation in Cypher will extract from the start index and up to but not including the end index. So if we want to see the last node, we must add 1 to the end index.

The `LENGTH()` function counts the number of relationships in the pattern. In this case we're following up to 3 relationships so the result of the `LENGTH()` function will be in the range from 1 to 3. A pattern with length 3 has 4 nodes: `(n1)-[r1]->(n2)-[r2]->(n3)-[r3]->(n4)`. If we want to see `(n4)` in the results of the `NODES()` function, the end index must then be `LENGTH(path)+1`.)

### What are the most common journeys that end on a particular page?

This time we’ll look at paths that lead to the ‘About’ page. The only changes we need to make from our previous example is to change the target page and reverse the path order. But just to keep things varied, let’s also exclude paths that include the ‘About’ page before the end.

<pre>
MATCH path = (:Page)-[:NEXT*3]->(about:Page {page: "snowplowanalytics.com/company/"})
WHERE NONE(visit IN NODES(path)[0..LENGTH(path)] WHERE visit.page = about.page)
RETURN EXTRACT(p IN NODES(path)[0..LENGTH(path)] | p.page) AS path, COUNT(path) AS users
ORDER BY COUNT(path) DESC
LIMIT 10;
</pre>

<pre>
╒══════════════════════════════════════════════════════════════════════╤═══════╕
│"path"                                                                │"users"│
╞══════════════════════════════════════════════════════════════════════╪═══════╡
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ins│7      │
│ights/","snowplowanalytics.com/services/"]                            │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/","snowplowanalytics.│5      │
│com/"]                                                                │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/products/snowplow-insights/","snowplowanalytic│5      │
│s.com/products/snowplow-react/","snowplowanalytics.com/products/snowpl│       │
│ow-open-source/"]                                                     │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ins│4      │
│ights/","snowplowanalytics.com/products/snowplow-open-source/"]       │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/products/snowplow-insights/","snowplowanalytic│3      │
│s.com/services/","snowplowanalytics.com/products/snowplow-insights/"] │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ins│3      │
│ights/","snowplowanalytics.com/request-demo/"]                        │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/services/","snowplowa│3      │
│nalytics.com/products/"]                                              │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/products/snowplow-react/","snowplowanalytics.c│3      │
│om/products/snowplow-insights/","snowplowanalytics.com/products/snowpl│       │
│ow-open-source/"]                                                     │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ope│3      │
│n-source/","snowplowanalytics.com/services/"]                         │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-rea│3      │
│ct/","snowplowanalytics.com/products/snowplow-insights/"]             │       │
└──────────────────────────────────────────────────────────────────────┴───────┘
</pre>

### How many pages do users visit to get from one specific page to another?

In order to understand how users are using a website, we may want to measure how many pages they viewed to get from one specified page to another specified page.

First, we need to match the pages we’re interested in, as well as the pattern that joins them.

Then, we’ll want to exclude journeys that have either the start or end page as intermediate steps. There are two good reasons for doing this. Consider a user who arrives at the homepage, reads some of the pages in the ‘Services’ section of the site, and then returns to the homepage and goes directly to the blog. According to our matching rules, this user would be counted twice: once from his first visit to the homepage, and again for his second visit. It also seems reasonable to rule out the longer journey: after all, maybe they weren’t looking for the blog when they first arrived at the home page.

<pre>
MATCH path = (home:Page {page: "snowplowanalytics.com/"})-[:NEXT*..10]->(blog:Page {page: "snowplowanalytics.com/blog/"})
WHERE NONE(visit IN NODES(path)[1..LENGTH(path)] WHERE visit.page = home.page OR visit.page = blog.page)
RETURN LENGTH(path) AS steps_from_homepage_to_blog, COUNT(LENGTH(path)) AS users
ORDER BY LENGTH(path)
LIMIT 10;
</pre>

<pre>
╒═════════════════════════════╤═══════╕
│"steps_from_homepage_to_blog"│"users"│
╞═════════════════════════════╪═══════╡
│1                            │2012   │
├─────────────────────────────┼───────┤
│2                            │635    │
├─────────────────────────────┼───────┤
│3                            │443    │
├─────────────────────────────┼───────┤
│4                            │312    │
├─────────────────────────────┼───────┤
│5                            │273    │
├─────────────────────────────┼───────┤
│6                            │145    │
├─────────────────────────────┼───────┤
│7                            │129    │
├─────────────────────────────┼───────┤
│8                            │67     │
├─────────────────────────────┼───────┤
│9                            │42     │
├─────────────────────────────┼───────┤
│10                           │24     │
└─────────────────────────────┴───────┘
</pre>

The above table shows that the most common route to get from the homepage to the blog page is directly, but that it is not uncommon to do this journey in 2, 3, 4 and 5 steps.

### What are some common user journeys?

So far, we’ve been specifying pages to start or end at. But we can also ask Neo4j to find common journeys of a given length from anywhere and to anywhere on the website. Let's look for journeys of up to three steps, excluding repeat visits to the same page. Let's also make sure that we only count journeys from a page where a visit actually started to a page where a visit actually ended, ie not count partial journeys.

<pre>
MATCH (start:Page), (end:Page),
path = (start)-[:NEXT*..3]->(end)
WHERE
  NOT (:Page)-[:NEXT]->(start) AND
  NOT (end)-[:NEXT]->(:Page) AND
  NONE(p IN NODES(path)[1..LENGTH(path)+1] WHERE p.page = start.page) AND
  NONE(p IN NODES(path)[0..LENGTH(path)] WHERE p.page = end.page)
RETURN EXTRACT(p IN NODES(path)[0..LENGTH(path)+1] | p.page) AS path, COUNT(path) AS users
ORDER BY COUNT(path) DESC
LIMIT 10;
</pre>

<pre>
╒══════════════════════════════════════════════════════════════════════╤═══════╕
│"path"                                                                │"users"│
╞══════════════════════════════════════════════════════════════════════╪═══════╡
│["snowplowanalytics.com/","snowplowanalytics.com/product/"]           │6117   │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/guides/"]            │952    │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/services/"]          │883    │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/product/","snowplowan│743    │
│alytics.com/services/"]                                               │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ins│599    │
│ights/"]                                                              │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/product/","snowplowan│580    │
│alytics.com/trial/"]                                                  │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/trial/"]             │522    │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/products/snowplow-ope│506    │
│n-source/"]                                                           │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/product/","snowplowan│436    │
│alytics.com/guides/"]                                                 │       │
├──────────────────────────────────────────────────────────────────────┼───────┤
│["snowplowanalytics.com/","snowplowanalytics.com/blog/"]              │345    │
└──────────────────────────────────────────────────────────────────────┴───────┘
</pre>

Since we were only interested in journeys of up to 3 steps, it was easy to exclude paths where the start or end page were not repeated and that meant that no other pages were repeated as well. For longer journeys though, we need a different approach. Nicole White's [GraphGist] [graphgist] explains how we can use the `UNWIND` clause to count the number of distinct pages visited. By comparing the number of distinct pages to the length of the path, we can exclude paths that have loops. (Nicole's example is based on the older version of this blog post.)

Now we can find the 10 most common journeys of between 5 and 6 steps without repetitions:

<pre>
MATCH (start:Page), (end:Page),
path = (start)-[:NEXT*5..6]->(end)
WHERE
  NOT (:Page)-[:NEXT]->(start) AND
  NOT (end)-[:NEXT]->(:Page)
WITH path, EXTRACT(p IN NODES(path) | p.page) AS pages
UNWIND pages AS views
WITH path, COUNT(DISTINCT views) AS distinct_views
WHERE distinct_views = LENGTH(NODES(path))
RETURN EXTRACT(p IN NODES(path)[0..LENGTH(path)+1] | p.page) AS path, COUNT(path) AS users
ORDER BY COUNT(path) DESC
LIMIT 10;
</pre>

## Summary

In this post, we experimented with using Neo4j to answer increasingly open-ended questions about how users travel through our website. This is very different from the traditional web analytics approach of defining a particular funnel and then seeing how many people make it through that funnel. Instead, we’re exploring how people actually behave, in a way that doesn’t limit our analysis with our own preconceptions about how people should behave.

The results of these experiments have been very promising. We’ve seen how we can use Neo4j to perform open-ended path analysis on our granular, event-level Snowplow data. Such analysis would be impossible or very hard in SQL.

[image1]: /assets/img/blog/2017/07/Neo4j-fb-example.png
[image2]: /assets/img/blog/2017/07/Neo4j-basic-page-view.png
[image3]: /assets/img/blog/2017/07/Neo4j-next-relationships.png
[image4]: /assets/img/blog/2017/07/Neo4j-code-snippet.png
[image5]: /assets/img/blog/2017/07/Neo4j-users-linked-to-views.png
[image6]: /assets/img/blog/2017/07/Neo4j-user-history.png
[image7]: /assets/img/blog/2017/07/Neo4j-user-views-page.png
[image8]: /assets/img/blog/2017/07/Neo4j-page-next-page.png
[neo4j]: https://neo4j.com/
[event-grammars]: /blog/2013/08/12/towards-universal-event-analytics-building-an-event-grammar/
[deduplication-queries]: https://github.com/snowplow/snowplow/tree/master/5-data-modeling/deduplication-queries
[load-csv]: https://neo4j.com/docs/developer-manual/3.2/cypher/clauses/load-csv/
[graphgist]: http://neo4j.com/graphgist/c21486f569df546769a7/
