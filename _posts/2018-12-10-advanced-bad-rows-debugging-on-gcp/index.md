## Advanced bad rows debugging in BigQuery

In previous posts, we provided a walkthrough of monitoring bad rows using DataStudio !!!!!LINK here!!!! , and debugging bad rows in BigQuery !!!!LINK HERE!!!! . There are two nice things about the GCP ecosystem that allow us go a step further than this - because BigQuery plays nicely with external data sources, and it offers a range of functions for handling nested data, it's possible get over the hurdle of bad rows format and remove some of the manual work in this process.

In this guide we'll leverage some of the great work Snowflake Analytics have done and

#### Why counts of schemas are useful

As mentioned in a previous post, if you're sending events in batches, then all the events in that payload will land in the bad row, regardless of which one failed validation. So decoding the line and looking at the schemas present in the line is often a manually-intensive route to the solution. However, the schema that causes the validation issue must be in every payload that fails validation with that error type. So if we can count how many times a payload contains at least one instance of a schema, we can narrow down the search to only those schemas that are there every time.

We will do this by:

- Using SQL to extract the part of the line we're interested in
- Defining a UDF to extract unique schemas per line
- Using SQL to count rows grouped by error message and schema


### Upload some libraries

Two libraries must be in Cloud Storage for this function once only: the `atob_btoa` `thrift_codec`.

### Our UDFS

Bad data is in Thrift and base64 encoded format. We're going to use our UDF to get at the values, and spit out as much useful information as we can from it:

The function returns much of the useful data in a bad row, including an array of unique schemas found in the payload (the `schemas` field), and a dump of all custom event JSON found (matched to its schema - the `custom_data` field), and app_id, platform, etc.

```
CREATE TEMP FUNCTION GetData(b BYTES)
  RETURNS STRUCT<
    appid STRING, -- as set in tracker
    platform STRING, -- as set in tracker
    tracker STRING, -- tracker name & version
    querystring STRING, -- querytring for the event (relevant to things like the pixel tracker or redirects)
    network_userid STRING,
    ipAddress STRING,
    refererUri STRING,  
    hostname STRING,
    timestamp INT64, -- Epoch timestamp (ms)
    schemas ARRAY<STRING>,
    custom_data ARRAY<STRUCT<schema STRING, data STRING>>> LANGUAGE js AS """

schema_array = []
data_array = []
custom_data_array = []
custom_data_struct = []
test_array = []

try {
decoded = decodeB64Thrift(b)
}
catch {schema_array = 'error in decoding raw line'}

if(decoded.hasOwnProperty("body")) {

 var data = JSON.parse(decoded['body']).data

 for (var i in data) {

   // Get custom event schemas safely

   if(data[i].hasOwnProperty("ue_px")) {
     if(JSON.parse(atob(data[i].ue_px)).hasOwnProperty('data')){
       if(JSON.parse(atob(data[i].ue_px)).data.hasOwnProperty('schema')){

          schema = JSON.parse(atob(data[i].ue_px)).data.schema
          schema_array.push(schema)

          data_string = JSON.stringify(JSON.parse(atob(data[i].ue_px)).data)

         data_array.push(data_string)
         custom_data_array.push(data_string)


         data1 = JSON.parse(data_string)
         data1.data = JSON.stringify(data1.data)

         custom_data_struct.push(data1)

       }
       else{schema_array.push('value not found - key error')
       }

     }
     else{schema_array.push('value not found - key error')
     }

   }

    else {schema_array.push('value not found - no custom event found')}

   //Get custom context schemas safely

   if(data[i].hasOwnProperty("cx")){
    all_entities = JSON.parse(atob(data[i].cx))

    for (var j in all_entities){

        for (var k in all_entities[j]){
        entity_struct = {}

        var entity_data = all_entities[j][k]

        if (entity_data.hasOwnProperty("schema")){
          entity_schema = entity_data.schema

          entity_struct.schema = entity_schema
          schema_array.push(entity_schema)
        }

        if (entity_data.hasOwnProperty("data")){
          entity_string = JSON.stringify(entity_data.data)
          entity_struct.data = entity_string

        }

        if (entity_struct.hasOwnProperty("schema") | entity_struct.hasOwnProperty("data")) {
          test_array.push(JSON.stringify(entity_struct))

          custom_data_struct.push(entity_struct)
          }
        }
    }


    }

 }

 schema_array = schema_array.filter(function(item, pos) {
   return schema_array.indexOf(item) == pos;
 })

 }

   var appid = ''
   if(data[0].hasOwnProperty("aid")){
   appid = data[0].aid
   }

   var platform = ''
   if(data[0].hasOwnProperty("p")){
   platform = data[0].p
   }

   var tracker = ''
   if(data[0].hasOwnProperty("tv")){
   tracker = data[0].tv
   }

   var querystring = ''
   if(decoded.hasOwnProperty("querystring")) {
   querystring = decoded.querystring
   }
   var network_userid = ''
   if(decoded.hasOwnProperty("network_userid")){
   network_userid = decoded.network_userid
   }

   var ipAddress = ''
   if(decoded.hasOwnProperty("ipAddress")){
   ipAddress = decoded.ipAddress
   }

  var timestamp = ''
  if(decoded.hasOwnProperty("timestamp")){
  timestamp = decoded.timestamp
  }

  var collector = ''
  if(decoded.hasOwnProperty("collector")){
  collector = decoded.collector
    }

   var refererUri = ''
   if(decoded.hasOwnProperty("refererUri")){
   refererUri = decoded.refererUri
   }

   var contentType = ''
   if(decoded.hasOwnProperty("contentType")){
   contentType = decoded.contentType
   }

   var hostname = ''
   if(decoded.hasOwnProperty("hostname")){
   hostname = decoded.hostname
   }

return {
        "appid": appid,
        "platform": platform,
        "tracker": tracker,
        "timestamp": timestamp,
        "collector": collector,
        "contentType": contentType,
        "hostname": hostname,
        "querystring": querystring,
        "refererUri": refererUri,
        "network_userid": network_userid,
        "ipAddress": ipAddress,
        "hostname": hostname,
        "schemas": schema_array,
        "custom_data": custom_data_struct};
"""
OPTIONS (library=['gs://javascript_libraries/thrift_codec2.js', 'gs://javascript_libraries/btoa_atob.js']);

SELECT
  e.message,
  GetData(line),
  TIMESTAMP_MILLIS(GetData(line).timestamp)

FROM bad_rows.bad_rows_native,
UNNEST(errors) e
WHERE e.message NOT LIKE 'Querystring is empty%'
AND e.message NOT LIKE 'Payload with vendor%'
```








#### Custom events

Custom events are found under the `ue_px` key of the payload, in base64-encoded format. Once decoded, the data will look something like this:

```JSON
{
  "data": {
    "data": {
      "field_1": "value_1",
      "field_2": "value_2",
      "field_3": "value_3"
    },
    "schema": "iglu:com.example/example_event/jsonschema/1-0-1"
  },
  "schema": "iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0"
}
```

So we can get retrieve the schema with:

```SQL
// Get custom event schemas safely

if(data[i].hasOwnProperty("ue_px")) {
  if(JSON.parse(atob(data[i].ue_px)).hasOwnProperty('data')){
    if(JSON.parse(atob(data[i].ue_px)).data.hasOwnProperty('schema')){


      result.push(JSON.parse(atob(data[i].ue_px)).data.schema)
    }
    else{result.push('key_error_events')}
  }
  else{result.push('key_error_events')}
}
```

Note that I've chosen to return 'ket_error_events' in instances where we have a `ue_px` field, but something's gone wrong in getting at the 'schema' field. This is perhaps an abundance of caution, but this way if something in the UDF has gone awry but there is legitimately a custom event in the payload, we'll at least see that there's some schema we can't find via the UDF, and can debug that error manually.


#### Custom schemas:

Custom schemas are found under the `cx` key, and once base64 Decoded will have the format:

```JSON
{
  "data": [
    {
      "data": {
        "field_1": "value_1"
      },
      "schema": "iglu:com.example/example_context/jsonschema/1-0-1"
    }
  ],
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1"
}
```

Note that this time it's an array of custom data - because you can attach an arbitrary number of schemas to each event. The Javascript to decode the data, and loop through this array to retrieve schemas is as follows:

```javascript

    //Get custom context schemas safely
if(data[i].hasOwnProperty("cx")){

 if(JSON.parse(atob(data[i].cx)).hasOwnProperty("data")){

    for (var j in JSON.parse(atob(data[i].cx)).data){
      if(JSON.parse(atob(data[i].cx)).data[j].hasOwnProperty('schema')){

        result.push(JSON.parse(atob(data[i].cx)).data[j].schema)
      }
      else {result.push('key_error_contexts')}
    }
  }
  else {result.push('key_error_contexts')}
}
```


#### Putting that together and returning unique values

Now we have functions which return an array of every reference to a schema featured in each payload for either an event or a context. Putting them each into our loop, and adding a function to return only unique schemas results in our complete UDF:

```SQL
CREATE TEMP FUNCTION ListSchemas(b STRING) RETURNS ARRAY<STRING> LANGUAGE js AS """

  var result = []

  var data = JSON.parse(b).data

  for (var i in data) {

    // Get custom event schemas safely

    if(data[i].hasOwnProperty("ue_px")) {
      if(JSON.parse(atob(data[i].ue_px)).hasOwnProperty('data')){
        if(JSON.parse(atob(data[i].ue_px)).data.hasOwnProperty('schema')){


          result.push(JSON.parse(atob(data[i].ue_px)).data.schema)
        }
        else{result.push('key_error_events')}
      }
      else{result.push('key_error_events')}
    }

    // else{result.push('no_custom_event')} //do I need this?

    //Get custom context schemas safely
    if(data[i].hasOwnProperty("cx")){

     if(JSON.parse(atob(data[i].cx)).hasOwnProperty("data")){

        for (var j in JSON.parse(atob(data[i].cx)).data){
          if(JSON.parse(atob(data[i].cx)).data[j].hasOwnProperty('schema')){

            result.push(JSON.parse(atob(data[i].cx)).data[j].schema)
          }
          else {result.push('key_error_contexts')}
        }
      }
      else {result.push('key_error_contexts')}
    }
    // else {result.push('no_custom_context')}

  }

  result = result.filter(function(item, pos) {
    return result.indexOf(item) == pos;
  })

return result;
"""
OPTIONS (library='gs://javascript_libraries/btoa_atob.js');
```

### Counting unique schemas per error

Now that we have a function which returns the list of unique schemas in a `line` payload, we can see the most common schemas per error by flattening the array that our UDF produces, and counting rows grouped by error and schema:

```SQL
CREATE TEMP FUNCTION ListSchemas(b STRING) RETURNS ARRAY<STRING> LANGUAGE js AS """

  var result = []

  var data = JSON.parse(b).data

  for (var i in data) {

    // Get custom event schemas safely

    if(data[i].hasOwnProperty("ue_px")) {
      if(JSON.parse(atob(data[i].ue_px)).hasOwnProperty('data')){
        if(JSON.parse(atob(data[i].ue_px)).data.hasOwnProperty('schema')){


          result.push(JSON.parse(atob(data[i].ue_px)).data.schema)
        }
        else{result.push('key_error_events')}
      }
      else{result.push('key_error_events')}
    }

    // else{result.push('no_custom_event')} //do I need this?

    //Get custom context schemas safely

    if(data[i].hasOwnProperty("cx")){

     if(JSON.parse(atob(data[i].cx)).hasOwnProperty("data")){

        for (var j in JSON.parse(atob(data[i].cx)).data){
          if(JSON.parse(atob(data[i].cx)).data[j].hasOwnProperty('schema')){

            result.push(JSON.parse(atob(data[i].cx)).data[j].schema)
          }
          else {result.push('key_error_contexts')}
        }
      }
      else {result.push('key_error_contexts')}
    }
    // else {result.push('no_custom_context')}

  }

  result = result.filter(function(item, pos) {
    return result.indexOf(item) == pos;
  })

return result;
"""
OPTIONS (library='gs://javascript_libraries/btoa_atob.js');

SELECT
  e.message,
  func_output,
  count(*)


FROM bad_rows.bad_rows_native,
UNNEST(errors) e,
UNNEST(ListSchemas(SAFE.REGEXP_EXTRACT(SAFE_CONVERT_BYTES_TO_STRING(line), '{\"data.*}'))) AS func_output
WHERE e.message NOT LIKE 'Querystring is empty%'
AND e.message NOT LIKE 'Payload with vendor%'

GROUP BY 1,2
ORDER BY 3 DESC
```

For each error, we should expect the offending schema to be present in every payload. We can use the output of the above query to reduce our workload by starting with the schemas with the highest occurrences per error. Some work is still needed to find the offending data and fix the issue, but for users with high volume and a lot of schemas, a lot of the manual work is taken out of the process - in theory, for each error message, only schemas with the highest count of occurrences should be candidates as the cause of the issue.

Unfortunately UDFs aren't supported for runnnig custom queries via DataStudio, so adding these schema aggregates to the monitoring dashboard we created in our previous post is still a challenge - we could create a table using this query and build a report from that, but that removes the possibility of real-time updates, since we'd need to build the table every time we wanted to see the report (and so defeats the purpose of a dashboard). We'd love to hear ideas on how we might solve that problem on our Discourse forum.
