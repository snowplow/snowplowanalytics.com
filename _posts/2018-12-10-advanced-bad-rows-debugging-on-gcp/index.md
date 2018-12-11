## Advanced bad rows debugging in BigQuery

In previous posts, we provided a walkthrough of monitoring bad rows using DataStudio !!!!!LINK here!!!! , and debugging bad rows in BigQuery !!!!LINK HERE!!!! . There are two nice things about the GCP ecosystem that allow us go a step further than this - because BigQuery plays nicely with external data sources, and it offers a range of functions for handling nested data, it's possible get over the hurdle of bad rows format and remove some of the manual work in this process.

In general, bad rows are still not straightforward, because we're dealing with pre-enrichment payloads, the pipeline hasn't had a chance to work its magic and make the data user-friendly yet - so we're still dealing with highly nested data and base64 encoded payloads. However if we do a good job of creating a safe User-Defined Function (UDF), then we can provide something quite valuable to the debugging process: counts of schemas involved in each error. For advanced users, and those with a lot of schemas and a lot of bad rows, the below approach will take some of the work out of the process. For those that aren't burdened with volume and complexity, the below is probably more effort than it's worth.

#### Why counts of schemas are useful

As mentioned in a previous post, if you're sending events in batches, then all the events in that payload will land in the bad row, regardless of which one failed validation. So decoding the line and looking at the schemas present in the line is often a manually-intensive route to the solution. However, the schema that causes the validation issue must be in every payload that fails validation with that error type. So if we can count how many times a payload contains at least one instance of a schema, we can narrow down the search to only those schemas that are there every time.

We will do this by:

- Using SQL to extract the part of the line we're interested in
- Defining a UDF to extract unique schemas per line
- Using SQL to count rows grouped by error message and schema

---

### Upload a library to decode base64

The Bigquery Javascript environment doesn't come with a native means of decoding base64, so in order to define a UDF which gets to the data we want, we'll need to upload a library. This done by uploading the relevant file to a bucket in CloudStorage, then referencing that location in the UDF.

I chose to use the `atob_btoa.js` library as outlined in [this stackoverflow post](https://stackoverflow.com/questions/44836246/base64-encoding-in-a-bigquery-user-defined-function).


### Getting to input data

As we discussed in our previous post on debugging bad rows, the format of the line once decoded isn't very friendly. However, there's a nice Javascript-friendly JSON object sitting in there, so we can use a REGEX to get to it:

```SQL
SELECT
  e.message,
  SAFE.REGEXP_EXTRACT(SAFE_CONVERT_BYTES_TO_STRING(line), '{\"data.*}') AS input
FROM bad_rows.bad_rows_native,
UNNEST(errors) e
WHERE e.message NOT LIKE 'Querystring is empty%'
AND e.message NOT LIKE 'Payload with vendor%'
```

The data in the input field will be a JSON object, which we'll pass into our function. We could pass the whole line, and do this decode and cleanup work from there if we wanted to as well - the logic is the same in SQL or Javascript.


### Defining the User-Defined Function

Now, our input is a JSON-format string. The JSON object it represents has a top-level key 'data', whose value is an array of Snowplow events. So the first thing we need to do is parse the string into JSON, and loop through the array. We also want to define the parameters of our function and allow it access to the library we've just uploaded:

```SQL
CREATE TEMP FUNCTION ListSchemas(b STRING) RETURNS ARRAY<STRING> LANGUAGE js AS"""

var result = []
var data = JSON.parse(b).data

 for (var i in data) {
   // Do something
 }
 """
OPTIONS (library='gs://javascript_libraries/btoa_atob.js');
```

Within each Snowplow event, there one or more custom event, one or more custom context, both, or neither. Because events and contexts have a different structure, we'll need to handle them differently within the loop.

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
        "example_context": "{}"
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
