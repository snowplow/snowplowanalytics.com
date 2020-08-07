---
layout: post
title: "Creating end-to-end automated testing for your tracking with Snowplow Micro and Nightwatch"
description: "In this article, we will review why we believe it is important to include tracking in your automated testing, and show you how you can get started with testing your Snowplow tracking with Micro and Nightwatch. "
author: Emily Youngs
category: How to guides
permalink: /blog/2020/08/07/testing-tracking-with-micro-and-nightwatch/
discourse: false
---



At Snowplow, we believe that testing the tracking you have in your applications is just as important as testing the applications themselves. For this purpose, we have created Snowplow Micro, a small version of the Snowplow pipeline, specifically only the collector and validation components, that can be spun up as part of your automated testing suite. You can find a general introduction to Snowplow Micro [here](https://snowplowanalytics.com/blog/2019/07/17/introducing-snowplow-micro/).

In this article, we will review why we believe it is important to include tracking in your automated testing, and show you how you can get started with testing your Snowplow tracking with Micro and Nightwatch. We also have a [guide for Cypress](https://snowplowanalytics.com/blog/2020/08/07/testing-tracking-with-micro-and-cypress/). if that is what you are using! Specifically, we have built a little demo application to show how you can set up a variety of tests with Micro in Nightwatch.

![data quality](/assets/img/blog/2020/08/sp-micro.png)

Why you should include tracking in your automated testing

“Tracking is as important as the feature you’re shipping. So test it.” 

Our VP of Engineering, Steve Coppin-Smith, recently presented a talk in which he discussed the importance of end-to-end testing including tracking, and how this can be done with an automated testing framework such as Nightwatch.js. In his talk, he emphasised how using a testing tool like Nightwatch goes beyond building assurance around the feature you are shipping; in combination with Micro it allows you make sure your data collection will be in place as well. You can watch the full talk here:

[Issue with tracking? Fail that build!](https://www.datacouncil.ai/talks/issue-with-tracking-fail-that-build)


# How to get set up with Snowplow Micro and Nightwatch

Powered by Node.js, [Nightwatch.js](https://nightwatchjs.org/) is an open-source automated testing framework that provides complete end-to-end solutions to automate testing with Selenium Javascript for web-based applications, browser applications, and websites. This framework relies on Selenium and provides several commands and assertions within the framework to perform operations on the DOM elements.



*   Nightwatch.js facilitates an end to end functional browser testing in a pure Node.js environment which enables testing of web applications independent from third party software.
*   The key purpose of lightweight and robust automated testing frameworks such as Nightwatch.js is to enable a single integrated solution for application testing. 


### How does Nightwatch work?

Nightwatch communicates over a restful API protocol that is defined by the W3C WebDriver API. It needs a restful HTTP API with a Selenium JavaScript WebDriver server. In order to perform any operation i.e. either a command or assertion, Nightwatch usually requires sending a minimum of two requests. It works as follows:



*   The first request locates the required element with the given XPath expression or CSS selector.
*   The second request takes the element and performs the actual operation of command or assertion.

To find out more you can follow this [beginners guide to automated testing with Nightwatch](https://www.lambdatest.com/blog/nightwatch-js-tutorial-for-test-automation-beginners/) and read the [Nightwatch JS Developer Guide](https://nightwatchjs.org/guide/).


# The demo application 

In order to demonstrate how you can implement Micro into your automated testing, we have created a simple demo app and demo tests. Specifically, we show how you can start by using the `noBadEvents()` assertion, and then also how to do more advanced tests. All of this can be found in the [Micro examples repository on Github](https://github.com/snowplow-incubator/snowplow-micro-examples).

The demo app is a simple e-commerce application using Django as the server, Nightwatch (and Cypress) as our testing frameworks, and Github Actions to automate our testing.


![data quality](/assets/img/blog/2020/08/micro-demo.png)



In the application we set up the following tracking using our JavaScript tracker:



1. Automatic page view tracking (on all pages);
2. Automatic link click tracking for the link from the first welcome page to move to the shopping page;
3. Automatic form tracking for the ‘login’, with blocklisting to avoid tracking passwords;
4. Custom `cart_action` and `purchase` events;
5. Custom product_entity, attached to the appropriate custom events (`cart_cation` and `purchase`).

More information on how to implement the tracking of specific events using the JavaScript tracker can be found in the [Snowplow Technical Documentation](https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#tracking-specific-events).


# Testing methods


### No bad events

When you are setting up your automated tests with Snowplow Micro, the most important test you should get started with is `noBadEvents()`. This test ensures that every event you send is received successfully and passes validation. Therefore, this is a key test to ensure your tracking will work as expected in production, and any changes you have made (whether its to the tracking or to your application) will not break your data collection!

However, if you want to do a more detailed inspection of your tracking, there are lots of ways to do that with Micro. We provide some examples in the repository, outlined below.


### Further tests

Tests within Nightwatch are split into assertions and commands. Assertions ensure that something holds true, such as no bad events ensuring that all events pass validation, i.e. that all events that are received by Micro are good events. In our demo application we implemented the following assertions and commands:


### Assertions



1. No bad events ensuring every event passes validation: `noBadEvents()`
2. Number of good events = number of expected good events: `noOfGoodEvents()`
3. Ensuring that total number of events is right, i.e. expected number of good events + bad events: `noBadEvents()` and `noOfTotalEvents()`
    1. An extension of `noOfGoodEvents()` as it ensures that both the number of good events sent is as expected, and that no bad events are sent 

Note: These 3 assertions should be used consecutively when testing an event like this:


{% highlight javascript %}
  browser.assert.noOfGoodEvents();
  browser.assert.noBadEvents();
  browser.assert.noOfTotalEvents();
{% endhighlight %}



4. Checking the correct values are being sent for specific properties of custom events and entities; specifically, the user puts in an event and we match by all 3 conditions (contexts, properties and schema). This determines whether or not the fake test event is equal to the one in Micro:


{% highlight javascript %}
  browser.assert.successfulEvent({
    "eventType": "ue",
    "schema": "iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0",
    "values": {
        "type": "add"
    },
    "contexts": [{
        "schema": "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
        "data": {
            "sku": "hh123",
            "name": "One-size summer hat",
            "price": 15.5,
            "quantity": 1
        }
        }
    ]
  });
{% endhighlight %}



5. Form testing, this incorporates two separate tests:
    2. Ensuring that the blocklisted form field is not being tracked by setting the number of form tracking events with field password to 0. This is done by creating a test event and using the `browser.assert.successfulEvent()` with parameter `number_of_occurences = 0`. 
    3. Assigning a value to all form tracking event fields in a test event, and then check them against the `browser.assert.successfulEvent()` function to ensure all parameters are parsed correctly when being sent to Micro:


{% highlight javascript %}
  browser.assert.successfulEvent({
  "schema": "iglu:com.snowplowanalytics.snowplow/submit_form/ 
      jsonschema/1-0-0",
  "values": {
      "elements": [{
          "name": "user_email",
          "value": "fake@email.com",
  }
  });
  browser.assert.successfulEvent({
  "schema": "iglu:com.snowplowanalytics.snowplow/submit_form/ 
      jsonschema/1-0-0",
  "values": {
      "elements": [{
          "name": "user_password"
      }]
  }
  }, 0);
{% endhighlight %}



### Commands

`ResetMicro()`: clears the Micro cache and is used before each test is run.


{% highlight javascript %}
  module.exports = {
    beforeEach: function(browser) {
        browser
            .resetMicro();
    }
{% endhighlight %}



### Possible extension test

If you do not have a production Iglu server, or your automated tests do not have access to it, you can also use a local Iglu server (as we do in our demo app). This local Iglu server can be used in one of two ways:



1. Using it as we did in our example application, creating a custom event with a specified schema and testing to ensure the event and schema works as expected
2. Purposely creating bad events to examine how and when micro would break, so you can avoid these situations. Examples of bad events we tested are:
    1. Referencing a schema that does not exist
    2. Using a predefined schema, trying to break and create a bad event by sending the wrong property formats


### Creating an iglu

If you want to create an [iglu](https://github.com/snowplow/iglu), you’ll need to follow the same directory structure as used in production, i.e.


{% highlight javascript %}
  iglu/schemas/test.example.iglu/cart_action_event/jsonschema/1-0-0
{% endhighlight %}


Then you can call these schemas in the same way you would call schemas from a production Iglu server or from [Iglu central](https://github.com/snowplow/iglu-central#iglu-central):


{% highlight javascript %}
  "schema": 
  "iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0"
{% endhighlight %}


More information on Iglu can be found on our [wiki](https://github.com/snowplow/iglu/wiki).


# Get started with integrating Snowplow Micro

Snowplow Micro is available from Dockerhub [here](https://hub.docker.com/r/snowplow/snowplow-micro).

If you currently do not include your tracking in your automated testing, we would strongly recommend you get started by adding `noBadEvents()`. This will ensure you catch any issues with your tracking early and can fix them before they impact your reporting or downstream applications. If you are already running automated tests with `noBadEvents()` and would like to extend your tests, we hope our examples will help you get started on that as well!

If you are already using Snowplow and have any questions about Snowplow Micro, feel free to reach out via Twitter (@snowplowlabs) or our [Discourse](https://discourse.snowplowanalytics.com/) forum. As a Snowplow Insights customer you can of course also reach out to Support. If you are not yet using Snowplow and would like to learn more, please get in touch with us [here](https://snowplowanalytics.com/get-started/).
