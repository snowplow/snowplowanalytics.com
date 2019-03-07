## Real-Time Applications with Snowplow - A code walkthrough

In two previous blogs we walked through the process of defining a use case for a real-time application [!!! LINK TO BLOG !!!], and designing for success from a proof of concept through to production build [!!! LINK TO BLOG !!!]. We're dealing with engineering here, and many of the ideas are fluid and complex - so it's a difficult topic to discuss in generalities. In this blog we'll walk through the code build of a simple example proof-of-concept use case - hopefully this will help to illustrate how powerful and straightforward building an application can be, as long as we've done a good job of designing our application and logic to suit Snowplow data.

### Recap of our example

In the first blog on defining our use case, the example we used was of a retailer who wants to retarget customers with offers on their remove from cart items. The path to value was broadly described as follows:

- Purchases are the outcome I'm driving towards.
- Users who demonstrate appetite to purchase, but have removed items from cart are likely to purchase if they have a discount.
- This application will target users who demonstrate appetite to spend, but remove items from cart, and incentivise purchasing by offering discounts on those items.
- This will lead to more purchases because those users will return to spend on the discounted items.

In the second blog on designing for success, we outlined the process of starting with a POC and iterating, decided that the simplest approach for a POC is to boil down 'appetite to purchase' to mean 'has purchased' - this is not the logic our production application would use, but is a simple way of proving that our above logic and assumptions prove to match reality. We arrived at the following POC design:

![poc-design]

The one piece I'll add to this is that we'll include the value of a purchase, and only target users who have made a purchase with a value of over £50.

Do note that in order to make this blog easy to follow I've deliberately decided to use a very simple logic and use case - hopefully it will be obvious that this same structure suits more complicated ideas too.


### Building the POC

For this walkthrough I have chosen to provide an example of building on the AWS platform - however each component has a parallel in GCP. If we were to build on GCP we could follow the exact same structure, or we could design slightly differently to suit the specifics of how that platform would best interact with our application (for example we could use App Engine to host the app and serve a widget directly on-page if we wanted).

On AWS then, the components we are dealing with are:

- An AWS Lambda as our input filter (uses DynamoDB API for the action of updating state storage)
- A DynamoDB table as state storage
- An AWS Lambda as our output filter (uses third party APIs for the actions of generating discount codes and serving the offers)

I've chosen Python as the language of choice for two reasons - it's widely used (so more people reading this will find it easier to follow), and it's also available using GCP's Cloud Functions.

For this example  POC I've simulated a simple tracking setup which uses standard Snwoplow events - remove from carts and transactions specifically.

#### State Storage - DynamoDB table

The first step to building is to create our DynamoDB state storage table. This is straightforward - we define a primary key using `user_id`. We'll also need a string set field, `removed_items`, which is an array of skus removed from cart, a boolean `purchase` flag, a numeric `purchase_value` and finally a boolean `offer_sent` - which we'll use to avoid sending multiple offers.

It's often easiest to manually create all the columns at the start, but not necessary - when we send data via the `boto3` API a field will be created if it doesn't exist yet.

[!!  LINK TO DDB TABLE SETUP !!]

#### Input - Filter and update State storage

The first component of our application will be a Lambda function which consumes the Enrich Kinesis stream that the Enrich component of Snowplow outputs. The event format in this stream is a base64-encoded TSV, so we first upload the [Python Snowplow Analytics SDK][python-sdk] library, which contains a `transform` function turns the event into a dict object.

The purpose of this function is to filter the data for only the values we're interested in, and update our DynamoDB state storage with the relevant information as follows:

`if event_name = remove_from_cart then update state storage with the removed item sku`

`if event_name = purchase then update state storage with purchase flag = true and the purchase value`

Our function's code is as follows:

```python
import base64
import snowplow_analytics_sdk.event_transformer
import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('rt-demo')

# Function to get Snowplow enriched events from Kinesis stream
def get_records(event):
  data = []
  if "Records" in event:
    for record in event["Records"]:
      if "kinesis" in record and "data" in record['kinesis']:
        decoded_data = base64.b64decode(record['kinesis']['data']).decode('utf-8')
        data.append(decoded_data)
  return data

# Function to get values from unstruct data fields
def get_unstruct(input, name, value):
  if input.get(name):
    return input.get(name).get(value)
  else:
    return None

# Function to execute
def lambda_handler(event, context):

  records = get_records(event)

  for record in records:

    # Use snowplow sdk to transform event to JSON
    try:
      event_data = snowplow_analytics_sdk.event_transformer.transform(record)

    except:
      print('Could not transform event: {}'.format(record))
      continue

    # Get the user_id
    user_id = event_data.get("user_id")

    # If the event is a remove from cart, get the sku of the item removed, and update the table only if we haven't yet sent an offer
    if event_data["event_name"] == "remove_from_cart":
    sku = get_unstruct(event_data, "unstruct_event_com_snowplowanalytics_snowplow_remove_from_cart_1", "sku")

    # boto3 API update to DynamoDB
    try:
      response = table.update_item(
          Key={
            'user_id': user_id
          },
          UpdateExpression="ADD removed_items :sku",
          ConditionExpression="attribute_not_exists(user_id) OR attribute_not_exists(offer_sent)",
          ExpressionAttributeValues={
            ':sku': set([sku])
          },
          ReturnValues="UPDATED_NEW")
    except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
          print("Activity ignored - offer already sent to user")
        else:
          raise

    # If the event is a transaction, get the total value and populate the purchase and purchase_value fields, only if the offer has not yet been sent
    if event_data["event_name"] == "transaction":
      trans_value = event_data.get("tr_total")
      purchase_flag = True

      # boto3 API update to DynamoDB
      try:
        response = table.update_item(
            Key={
              'user_id': user_id
            },
            UpdateExpression="SET purchase = :purchase_flag, purchase_value = :trans_value",
            ConditionExpression="attribute_not_exists(user_id) OR attribute_not_exists(offer_sent)",
            ExpressionAttributeValues={
              ':trans_value': trans_value,
              ':purchase_flag': purchase_flag
            },
            ReturnValues="UPDATED_NEW")
      except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
          print("Activity ignored - offer already sent to user")
        else:
          raise
```

I've delivered similar functions for customers who are near Snowplow, and their response can be paraphrased as  'this is great I need to understand how we manage the input types', or 'show me where we manage breaks due to faulty data'. The simple answer is that we don't need to worry about that - the Snowplow pipeline does it for us. We are guaranteed that anything output to the Kinesis Enriched stream conforms to the schema, so our code doesn't have to allow for breakages due to poor quality input.

#### Output - Filter for conditions and carry out action

DynamoDB has a nice feature which allows us to configure another AWS Lambda function to consume from the change stream of the table. This means that any time a value is input in our table, that triggers another function which can carry out our action. If we're not using DynamoDB for state storage, we can just build a mechanism to do this kind of thing. But for a POC we're looking for minimum effort to deliver the functionality, so using the change stream is ideal.

This output lambda is really simple - we want to find the relevant values if they exist, then execute the logic:

`if purchase is True, and purcase_value > 50 then execute API calls to generate offer codes and to send emails`

(Obviously how we serve the offers doesn't need to be email - it's just an easy example.)

I don't have an actual transactions system or email application, but these parts are just a matter of using your providers' APIs to carry out these actions.


```python
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('rt-demo')

def lambda_handler(event, context):

  for record in event["Records"]:
    print(record)

    data = record["dynamodb"]["NewImage"]

    user_id = data["user_id"]["S"]

    items = []
    if data.get("removed_items"):
      items = data["removed_items"]["SS"]

    purchase = None
    if data.get("purchase"):
      purchase = data["purchase"]["BOOL"]

    value = 0
    if data.get("purchase_value"):
      value = float(data["purchase_value"]["N"])

    offer_sent = False
    if data.get("offer_sent"):
      offer_sent = data["offer_sent"]["BOOL"]

    if purchase == True and value > 50 and offer_sent == False and len(items) > 0:

      """
      #
      # API CALL TO TRANSACTIONS SYSTEM
      #
      # API CALL TO EMAIL SYSTEM
      #
      """

      # Update state storage to flag that an offer has been sent
      sent = True

      try:
        response = table.update_item(
          Key={
            'user_id': user_id
          },
          UpdateExpression="SET offer_sent = :sent",
          ExpressionAttributeValues={
            ':sent': sent
          },
          ReturnValues="UPDATED_NEW")
      except ClientError as e:
        if e.response['Error']['Code'] == "ConditionalCheckFailedException":
          print("Activity ignored - offer already sent to user")
        else:
          raise

```

Once we have sent an offer we update dynamoDB with a flag to prevent spamming customers with many offers.

![ddb-sample-run]

### Further problems to solve

As I mentioned, this illustration is quite simplistic, and should be better for an actual live build - for starters the code was thrown together to provide an illustration of building a POC - we would want something cleaner in a real-life case. Leaving that aside, there are still some problems that remain to be solved, either at POC stage or in a production build:

**Consideration for how users behave in the real world**

This demonstration doesn't account for the fact that users will purchase multiple times, or that they'll remove items from cart but purchase those items. A real-world case would account for these factors in our code.

**User identity**

For simplicity, this example assumes that we always have a `user_id` (ie an id associated with a specific user account) attached to our data. In the real world, we often won't have that for everything - and user identity is often complex. Users will be active across multiple devices, have multiple accounts, and there will be cases of multiple users per device. Snowplow offers an unparalleled range of user identifiers to handle this, but delivering a logic to stitch them together in a real-time architecture is complicated and will require a strong understanding of the data.

**Building for production**

Finally, a production build of this kind of application will likely require consolidation of components and will likely require a more nuanced logic. We'd also want a more robust instrumentation of the application to account for potential downtime and maintenance.

While the above example is quite simplistic, I hope that it demonstrates the power of Snowplow in building these applications. We don't need to do any work to ensure that our application will run stably, and instrumenting a logic is just matter of using highly structured structured data to its potential. These factors remain the same for more complex cases - so we need only concern ourselves with designing and building the functionality we want to deliver.

[poc-design]: /assets/img/blog/2019/03/poc-design.png

[python-sdk]: https://github.com/snowplow/snowplow-python-analytics-sdk

[ddb-sample-run]: /assets/img/blog/2019/03/ddb-w-sample.png
