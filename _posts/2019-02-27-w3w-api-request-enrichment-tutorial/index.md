---
layout: post
title-short: W3W API request enrichment
title: "[Tutorial] Adding what3words reverse geocoding data to Snowplow enriched events"
tags: [analytics, enrichments, api, custom api, web data modeling, data modeling, web analytics]
author: Dilyan
image: /assets/img/blog/2019/02/kibana-screenshot.png
category: How to Guides
permalink: /blog/2019/02/27/w3w-api-request-enrichment/
discourse: true
---

Snowplow’s [API Request Enrichment ][api-request-enrichment] lets us add dimensions to an incoming Snowplow event using an internal or external HTTP-based API.

In this tutorial, we'll look at how you can use the enrichment to add a 'reverse geocoding context' by doing a lookup against what3words.com's API.

## What is what3words?

[what3words][what3words] has divided the world into a grid of 3m x 3m squares and assigned each one a unique 3 word address. (The main Snowplow London offices for example are at [rise.heavy.last][rise.heavy.last].) The service is especially useful in regions with less well developed postal and addressing systems, as it allows locations to be identified and shared precisely and easily. There's a free mobile app and an online map, and w3w can also be built into any other app, platform, or website.

The [reverse geocoding API][reverse-geocoding-api] resolves coordinates, expressed as latitude and longitude, to a 3 word address.

## Design considerations

Let's start by considering what inputs we'll need, what the API call needs to look like, and what the expected output from it will be.

### Inputs

The reverse geocoding API expects to receive coordinates (a comma separated string of latitude and longitude), as well as an API key for authentication. Those are required parameters.

We will get the latitude and longitude data from the enriched event POJO. You will have to sign up with what3words for an API key.

Additionally, there are some optional requirements, some of which affect the format of the response. The enrichment assumes that the API returns a JSON, so we need to ensure that we set these appropriately. We should set `format=json` and not use the `callback` parameter.

It's up to you if you want to use the `full` or `terse` display option. The schemas in this tutorial assume we're using `display=full`.

The optional `lang` parameter does not affect the format of the response.

### API call

We need to construct an API call that looks something like this:

```
GET https://api.what3words.com/v2/reverse?coords=51.521251,-0.203586&display=full&format=json&key=[API-KEY]
```

### Outputs

The example JSON output looks like this:

```JSON
{
    "crs": {
        "type": "link",
        "properties": {
            "href": "http://spatialreference.org/ref/epsg/4326/ogcwkt/",
            "type": "ogcwkt"
        }
    },
    "words": "index.home.raft",
    "bounds": {
        "southwest": {
            "lng": -0.203607,
            "lat": 51.521238
        },
        "northeast": {
            "lng": -0.203564,
            "lat": 51.521265
        }
    },
    "geometry": {
        "lng": -0.203586,
        "lat": 51.521251
    },
    "language": "en",
    "map": "http://w3w.co/index.home.raft",
    "status": {
        "code": 200,
        "message": "OK"
    },
    "thanks": "Thanks from all of us at index.home.raft for using a what3words API"
}
```

## Implementation

### Step 1: Sign up for a what3words API key

Head over to the [what3words signup form][what3words-signup-form] and register for a Developer account. (It's free.)

Once you log in, go to Developer API Keys > Manage Applications > Create New. Fill in a few details about how you're going to use the API key and generate it.

### Step 2: Write the schema for the new context

Will be adding a new context to our Snowplow events and we'll need a [self-describing JSON][self-describing-json] schema for that new context: `com.what3words/reverse_geocoding_context/jsonschema/1-0-0`.

We can use [Schema Guru][schema-guru] to generate a first draft of the schema from the example response provided by the w3w documentation. Save the example JSON output in a file (let's call it `response.json`) and then generate the schema:

```bash
$ ./schema-guru-0.6.1 schema path/to/response.json --vendor com.what3words \
$ --name reverse_geocoding_context --no-length \
$ --output schemas/com.what3words/reverse_geocoding_context/jsonschema/1-0-0
```

Schemas derived from a single JSON instance can be too restrictive, which is why we're using the `--no-length` option to remove min and max bounds for strings. After the schema has been generated, you may want to make it even more permissive. Some common changes include making all string fields nullable (in case there are missing values) and setting `additionalProperties` to `true`, to ensure the events will pass validation if w3w adds new fields to the response.

Here's an example draft created with Schema Guru and then modified by hand:

```JSON
{
  "$schema" : "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self" : {
    "vendor" : "com.what3words",
    "name" : "reverse_geocoding_context",
    "version" : "1-0-0",
    "format" : "jsonschema"
  },
  "type" : "object",
  "properties" : {
    "map" : {
      "type" : "string",
      "format" : "uri"
    },
    "thanks" : {
      "type" : "string"
    },
    "bounds" : {
      "type" : "object",
      "properties" : {
        "southwest" : {
          "type" : "object",
          "properties" : {
            "lng" : {
              "type" : "number"
            },
            "lat" : {
              "type" : "number"
            }
          },
          "additionalProperties" : true
        },
        "northeast" : {
          "type" : "object",
          "properties" : {
            "lng" : {
              "type" : "number"
            },
            "lat" : {
              "type" : "number"
            }
          },
          "additionalProperties" : true
        }
      },
      "additionalProperties" : true
    },
    "language" : {
      "type" : "string"
    },
    "status" : {
      "type" : "object",
      "properties" : {
        "code" : {
          "type" : "integer"
        },
        "message" : {
          "type" : "string"
        }
      },
      "additionalProperties" : true
    },
    "words" : {
      "type" : "string"
    },
    "geometry" : {
      "type" : "object",
      "properties" : {
        "lng" : {
          "type" : "number"
        },
        "lat" : {
          "type" : "number"
        }
      },
      "additionalProperties" : true
    },
    "crs" : {
      "type" : "object",
      "properties" : {
        "type" : {
          "type" : "string"
        },
        "properties" : {
          "type" : "object",
          "properties" : {
            "href" : {
              "type" : "string",
              "format" : "uri"
            },
            "type" : {
              "type" : "string"
            }
          },
          "additionalProperties" : true
        }
      },
      "additionalProperties" : true
    }
  },
  "additionalProperties" : true
}
```

You can also use Schema Guru to generate Redshift DDLs and JSONpath files, or -- if you're more familiar with it and / or are working off a schema you wrote from scratch -- you can use [Igluctl][igluctl] to do the same. If you're using a different storage target, such as BigQuery or Snowflake, you don't need to worry about the DDL: the respective loader apps in the pipeline will figure it out.

### Step 3: Write the enrichment configuration

Next up, we need to write the JSON config file for the enrichment. This file should be called `api_request_enrichment_config.json` and it should be placed in the folder where all the rest of your enrichment configurations live, so it's accessible to the pipeline. The [API Request Enrichment documentation page][api-request-enrichment] has a link to the JSON schema for the enrichment config file, a detailed example, and more information on how things work under the hood.

We ultimately want to end up with a file that looks like this:

```JSON
{
  "schema": "iglu:com.snowplowanalytics.snowplow.enrichments/api_request_enrichment_config/jsonschema/1-0-0",
  "data": {
    "vendor": "com.snowplowanalytics.snowplow.enrichments",
    "name": "api_request_enrichment_config",
    "enabled": true,
    "parameters": {
      "inputs": [
        {
          "key": "lat",
          "pojo": {
            "field": "geo_latitude"
          }
        },
        {
          "key": "lng",
          "pojo": {
            "field": "geo_longitude"
          }
        }
      ],
      "api": {
        "http": {
          "method": "GET",
          "uri": "https://api.what3words.com/v2/reverse?coords={{lat}},{{lng}}&display=full&format=json&key=API-KEY",
          "timeout": 2000,
          "authentication": {
            "httpBasic": {
              "username": "",
              "password": ""
            }
          }
        }
      },
      "outputs": [
        {
          "schema": "iglu:com.what3words/reverse_geocoding_context/jsonschema/1-0-0" ,
          "json": {
            "jsonPath": "$"
          }
        }
      ],
      "cache": {
        "size": 3000,
        "ttl": 60
      }
    }
  }
}
```

Let's look at the different parameters in turn.

#### inputs
We need two data points from the raw event POJO: `geo_latitude` and `geo_longitude`. We assign the values found there to the `lat` and `lng` keys, respectively.

#### api
We then use the `lat` and `lng` keys to refer to the `geo_latitude` and `geo_longitude` values in the API call. The values extracted from the raw event will be substituted in the URI before the `GET` request is submitted.

#### outputs
The API responds with JSON, which matches out custom `reverse_geocoding_context` schema, so we take on all of the data from the response, by specifying `"jsonPath": "$"`.

#### cache
A heavy-traffic pipeline might generate millions of calls to the specified API endpoint in a very short period of time. We can use this section to set some reasonable limits  for the cache size and 'time to live'.

### Step 4: Test and deploy

We can now use [Snowplow Mini][snowplow-mini] to test our new enrichment setup. Refer to the [Setup Guide][setup-guide] for details on how to set up Snowplow Mini on AWS or GCP. The [Usage Guide][usage-guide] is the best resource on how it works once set up. We have to [add the enrichment][uploading-custom-enrichments] as well as [upload the custom schema][adding-a-custom-schema] for it. We can also do the latter with Igluctl:

```bash
$ ./igluctl static push ./schemas/com.what3words/reverse_geocoding_context/jsonschema/1-0-0  $SNOWPLOW_MINI_IP/iglu-server/ $IGLU_REGISTRY_MASTER_KEY --public
```

When uploading new schemas and enrichment configurations, you might need to restart all services from the Control Plane of the Snowplow Mini console, to ensure cache is flushed. Then, we can test if the enrichment is working by sending some [test events][example-events].

Finally, we can use the Kibana dashboard that comes bundled with Snowplow Mini to inspect the data and verify that the new context is being successfully attached:

![kibana-screenshot][kibana-screenshot]

## What else is possible with the API request enrichment?

This tutorial is an adaptation of the [Integrating Clearbit data into Snowplow][clearbit-tutorial] tutorial. We're always interested to hear what other ways people have been using it in, so please share if you have a cool use case.

[api-request-enrichment]: https://github.com/snowplow/snowplow/wiki/API-Request-enrichment
[what3words]: https://what3words.com/
[rise.heavy.last]: https://w3w.co/rise.heavy.last
[reverse-geocoding-api]: https://docs.what3words.com/api/v2/#reverse
[what3words-signup-form]: https://accounts.what3words.com/register
[self-describing-json]: https://github.com/snowplow/iglu/wiki/Self-describing-JSONs
[schema-guru]: https://github.com/snowplow/schema-guru
[igluctl]: https://docs.snowplowanalytics.com/open-source/iglu/igluctl/
[snowplow-mini]: https://github.com/snowplow/snowplow-mini
[setup-guide]: https://github.com/snowplow/snowplow-mini/wiki/Setup-guide
[usage-guide]: https://github.com/snowplow/snowplow-mini/wiki/Usage-guide
[uploading-custom-enrichments]: https://github.com/snowplow/snowplow-mini/wiki/Usage-guide#6-uploading-custom-enrichments
[adding-a-custom-schema]: https://github.com/snowplow/snowplow-mini/wiki/Usage-guide#7-adding-a-custom-schema
[example-events]: https://github.com/snowplow/snowplow-mini/wiki/Usage-guide#31-example-events
[clearbit-tutorial]: https://discourse.snowplowanalytics.com/t/integrating-clearbit-data-into-snowplow-using-the-api-request-enrichment-tutorial/210

[kibana-screenshot]: /assets/img/blog/2019/02/kibana-screenshot.png
