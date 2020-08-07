---
layout: post
title: "Creating end-to-end automated testing for your tracking with Snowplow Micro and Cypress"
description: " Events seem to fire and everything looks good. But is it? Are there really no bad events and, consequently, gaps in your analytics"
author: Ada Tzereme
category: How to guides
permalink: /blog/2020/08/07/testing-tracking-with-micro-and-cypress/
discourse: false
---

So, you've designed your tracking, defined the schemas for custom events and entities and set it all up. Events seem to fire and everything looks good. But is it? Are there really no bad events and, consequently, gaps in your analytics? Are the correct entities attached to the appropriate events? Are the values sent with specific events correct? Could this lately added feature have broken your data collection setup? And how can you know in advance?

At Snowplow, we would argue that having working tracking in place is an important part of shipping any new feature. It is crucial to include its testing in your test suites, in order to ensure that your data collection is functioning in the expected way, evolving together with new versions of your digital products.

Snowplow Micro enables you to embed the validation of your data collection setup in your automated test suites. In the subsequent sections we will describe one possible way to do so, using Snowplow Micro together with Cypress to create an automated testing workflow on GitHub Actions.

### Getting started

In this post we already assume that you know what [Snowplow](https://snowplowanalytics.com/) does, what events and entities are and how to initialize your [tracker](https://github.com/snowplow/snowplow/wiki/trackers), but you can also read more following the links below:

*   [Understanding tracking design](https://docs.snowplowanalytics.com/docs/understanding-tracking-design/) 
*   [Snowplow technical documentation](https://github.com/snowplow/snowplow/wiki/Snowplow-technical-documentation) 
*   [Snowplow Tracker Protocol](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol) 
*   [JavaScript tracker parameters](https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker)

### Snowplow Micro

[Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) is a version of a full Snowplow data collection pipeline, small enough that can be launched as part of an automated test suite. It can connect to schema registries, collect and validate events and it also exposes an API. It enables Snowplow users to test their tracking and so ensure that any new version of their websites or mobile apps will not in any way break their tracking setup.

For an introduction to [Snowplow Micro](https://docs.snowplowanalytics.com/docs/understanding-your-pipeline/what-is-snowplow-micro/) and the importance of validating your tracking setup, you can read [Introducing Snowplow Micro](https://snowplowanalytics.com/blog/2019/07/17/introducing-snowplow-micro/). 

Getting Snowplow Micro to collect and validate your events consists of:

1. [Launching Micro](https://github.com/snowplow-incubator/snowplow-micro#2-how-do-i-run-snowplow-micro):
1. Provide the configuration files for Micro and for Iglu resolvers
2. Run the Docker container image
2. Pointing your tracker to Micro’s collector; for example, to initialize the JavaScript tracker to point to Micro’s collector url on port 9090:

{% highlight javascript %}
  snowplow('newTracker', 'sp', '0.0.0.0:9090');
{% endhighlight %}

### Iglu setup

Once you decide to define your custom events and entities that correspond to your business or use case, you will need [Iglu](https://github.com/snowplow/iglu), which is a data schema repository, supporting self-describing JSON schemas. You can read more in its [wiki](https://github.com/snowplow/iglu/wiki).

In order for Snowplow Micro to find and resolve the schemas in your private Iglu repository, you will need to update Micro’s Iglu client configuration by adding your remote repository into the configuration file. Detailed information on how to do so can be found in this [example](https://github.com/snowplow/iglu/wiki/Iglu-client-configuration).

## Embedding Micro in your automated testing

How confident do you feel about your next release? Testing, like data quality, is a growing business demand. Snowplow Micro was created to provide a stable, production-like environment to test your tracking. By embedding it into your automated test suites, it enables you to diminish the business risks of breaking your data collection setup as your digital products evolve.

Embedding Snowplow Micro to your test suites simply consists of configuring your test tools to access Micro's API endpoints and then make assertions on the events. More specifically, your web test automation tool will just need methods or custom commands to first request the bad and good events that Micro collected and then assert that:

*   The expected number of events fire
*   The events do pass validation against their corresponding schemas (i.e. no bad events)
*   The events are indeed sent with the right event data, the right values for specific fields and with the right entities attached
*   The events are of the expected event type and have the right parameter values

![data quality](/assets/img/blog/2020/08/sp-micro.png)

To show all these in practice we created the [snowplow-micro-examples](https://github.com/snowplow-incubator/snowplow-micro-examples) repository, where a tracking setup on a demo app is being tested with Snowplow Micro and popular web test tools, like Nightwatch and Cypress, in automated GitHub Actions workflows. The rest of this blogpost describes using Snowplow Micro with Cypress. 

### Cypress

[Cypress](https://www.cypress.io/ ) is an open source JavaScript End-to-End testing framework with extensive [documentation](https://docs.cypress.io/). Generally, Cypress runs either by launching its Test Runner with `npx cypress open` or from the command line with `npx cypress run`.

Cypress has some features (requests, custom commands’ API) that make it really easy to integrate with Micro and in the end, with the exact same command (e.g. `npm test`), you can also have your data collection setup validated and confidently deploy your app to production. And this can be done inline with any of your software development workflow automation tools, like [GitHub Actions](https://docs.github.com/en/actions).

### GitHub Actions

[GitHub Actions](https://github.com/features/actions) makes it easy to automate software workflows. Launching Snowplow Micro to use in your automated testing jobs or workflow runs consists of adding just an extra step, that could be as simple as:

{% highlight javascript %}
  - name: Start Micro
      run: docker-compose up -d micro
      working-directory: snowplow-micro-examples
{% endhighlight %}

The example step above is being used in the [snowplow-micro-examples](https://github.com/snowplow-incubator/snowplow-micro) workflow, but you can adjust it to your needs, taking into account that:

1. Your working-directory should contain what Micro needs to mount, and
2. Starting the Micro docker container, can be done either with the standard `docker run` command as shown in the [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) GitHub repository, or with the `docker-compose` command we used above, that needs a corresponding  `docker-compose.yml` file.

## An end-to-end example

The example's setup can be vaguely depicted as:

![data quality](/assets/img/blog/2020/08/cypress.png)

The root directory of the [repository](https://github.com/snowplow-incubator/snowplow-micro-examples) contains the subdirectories:

1. `app/`: Represents your company’s Snowplow-enabled web app, whose tracking setup we need to test. As an example, our app uses the [JavaScript Tracker](https://github.com/snowplow/snowplow/wiki/javascript-tracker) hosted by a Django web server.
2. `micro/`: Contains the configurations for Snowplow Micro and Iglu resolvers. It gets mounted onto the Snowplow Micro container.
3. `iglu/`: Represents your company’s private Iglu repository containing the schemas for the custom events and entities. In this example, we use this directory as a static repo, which is simply an Iglu repository server structured as a static website.
4. `testing/`: Contains the configuration files for the test tools, the spec files and a helper functions module, which you can use independently with your test tool of choice.

Once everything is up and running, Cypress will interact with the app according to a spec file and then will send requests to Micro's API endpoints, receive the response and assert on the events. 

For example, in order to assert that there were no bad events, Cypress will send a request to `/micro/bad` API endpoint, receive the response, parse its body as JSON and assert whether it is an empty array. In other words:

{% highlight javascript %}
describe('the first test', () => {
    it('asserts no bad events', () => {
        cy.noBadEvents();
    });
});
{% endhighlight %}

And that is the first test with Micro and Cypress.

Even if you stop here and all you take away and implement is just this simple test at the end of your test suites, you are already a whole order of magnitude better. With this test you can ensure that there are no events failing validation, no missing data from your warehouse and no gaps in your analytics.

### Organizing the spec files

In its simplest form adding the `noBadEvents` test at the end of your test files is all it takes. 

However, if you want to validate your tracking setup to the full extent that Snowplow Micro gives you the power to, depending on the internals of your test tool, it may be necessary to adjust the organization of your spec files accordingly. 

In this case, Cypress has some architectural differences with Selenium-based web testing tools. For example, it runs in the same run-loop with your application, which, even though it makes tests run very fast, it also presented a challenge: the controlled browser was too fast with window unload events too, meaning that it was cancelling the xhr requests of the tracker to the collector in a unusual way. In order to work around this, we chose to move the tracking tests in their own spec files and organize them in pairs with the corresponding spec files that test the app itself. A full description of the matter and the rationale behind the chosen workaround, can be found in the readme file of the [repository](https://github.com/snowplow-incubator/snowplow-micro-examples).

### Describing the app

The app we are using as an example to test its tracking setup is a very simple e-commerce app consisting of three pages, each of which includes different ways a user's behavior can be tracked. It is important to remember that any feature in this app is there just to demonstrate how its tracking could be tested.

If you want to actually see the app in your browser, you just need Git, Docker-compose and Npm. Once you have these:

1. clone the repository
2. move into its directory
3. `npm install`
4. `docker-compose up`

If you now visit `http://localhost:8000` in your browser you will see Snowplow welcoming you to the demo!

The pages:

1. The welcome page, which includes a "login" form. As an important note, this form is not a real login form. There is no authentication involved. You can type and submit anything and move on to the next page. Just before, imagine that you needed to ensure that a sensitive data field is never being tracked (e.g. passwords, credit card details, etc). This can be tested as well.
2. The shop page, which includes some items and a same-page cart, with the options to add or remove from cart, change quantities and eventually complete the purchase.
3. The success page, that just confirms the purchase was successful.

### Tracking setup

The tracking setup implemented for this demo app simply consists of:

1. PageView tracking.
2. Activity tracking.
3. Form tracking with blocklisting.
4. Tracking of the custom events `cart_action` and` purchase`.
5. Custom `product_entity`. Product entities will be attached to the appropriate custom events.
6. Adding the predefined webPage context to all events.

More information on how to implement the tracking of specific events using the JavaScript tracker can be found in the [Snowplow Technical Documentation](https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#tracking-specific-events).

### Custom test commands for Micro

The `cy.noBadEvents()` command used in the first test above is a custom command that abstracts away the request to Micro, the access to the body property of the response and its JSON parsing. Cypress makes it easy to create [custom commands](https://docs.cypress.io/api/cypress-api/custom-commands.html) by providing an API. The custom commands created for testing a tracking setup with Snowplow Micro can be found in the `commands.js` file of the [snowplow-micro-examples](https://github.com/snowplow-incubator/snowplow-micro-examples) repository, and are:

1. `resetMicro()`: A command to clear Micro's cache.
2. `noBadEvents()`: Asserts that there are no events failing validation.
3. `numGoodEvents(n)`: Asserts that the number of good events is equal to n.

  _Example:_ `cy.numGoodEvents(17);`

4. `eventsWithEventType(eventType, n)`: Asserts that the number of events with matching eventType is equal to n.

  _Example:_  `cy.eventsWithEventType("ue", 10);`

5. `eventsWithSchema(schema, n)`: Asserts that the number of unstructured events having that schema is equal to n.

  _Example:_ 


{% highlight javascript %}
  cy.eventsWithSchema("iglu:test.example.iglu/purchase_event/jsonschema/1-0-0", 1);
{% endhighlight %}


6. `eventsWithParams(parameters, n)`: Asserts that the number of events with matching parameters is equal to n.

  _Example:_


{% highlight javascript %}
  cy.eventsWithParams({
    "e": "se",
    "se_ca": "Mixes",
    "se_ac": "Play"
  }, 3);
{% endhighlight %}


7. `eventsWithContexts(contexts, n)`: Asserts that the number of events with those contexts attached is equal to n.

  _Example:_


{% highlight javascript %}
  cy.eventsWithContexts([{
    "schema": "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
    "data": {
    "sku": "hh123"
    }
  },{
  "schema": "iglu:test.example.iglu/product_entity/jsonschema/1-0-0",
  "data": {
    "sku": "bb123",
    "quantity": 1
  }
  }], 3);
{% endhighlight %}


8. `eventsWithProperties(properties, n)`: Asserts that the matching number of events is equal to n. This command is an intersection of the previous 3 commands providing also the option to assert on specific data values of unstructured events.

  _Example:_


{% highlight javascript %}
  cy.eventsWithProperties({ 
  "schema":"iglu:test.example.iglu/cart_action_event/jsonschema/1-0-0",
  "values": {
    "type": "remove"
  }
  }, 2);
{% endhighlight %}


9. `eventsWithOrder(events)`: Given an array of properties that uniquely specify events, this command asserts that the matching events fired in the given order. 

  _Example:_

{% highlight javascript %}
  cy.eventsWithOrder([
      { "schema":"iglu:com.snowplowanalytics.snowplow/focus_form/jsonschema/1-0-0"},
      { "schema":"iglu:com.snowplowanalytics.snowplow/change_form/jsonschema/1-0-0"}
  ]);
{% endhighlight %}

_Extra example:_

How to ensure that blocklisted form fields are not being tracked: We need to assert for all form tracking events (`focus_form`, `change_form` and `submit_form`).

1. For `focus_form` and `change_form` events

{% highlight javascript %}
  cy.eventsWithProperties({
    "values": {"name": "sensitive_data"}
  }, 0);
{% endhighlight %}

2. For `submit_form` events

{% highlight javascript %}
  cy.eventsWithProperty({
    "values": {
    "elements": [{"name": "sensitive_data"}]
  }, 0);
{% endhighlight %}

## Start testing your tracking with Snowplow Micro

Snowplow Micro makes it possible to test your data collection setup as part of an automated test suite and thus confidently deploy your websites, services or mobile apps. In this blogpost we presented an example of how to use Snowplow Micro with Cypress and eventually embed it in an automated testing workflow with GitHub Actions. For an example of using Snowplow Micro with Nightwatch, [click here](https://snowplowanalytics.com/blog/2020/08/07/testing-tracking-with-micro-and-nightwatch/).

If you are interested in using [Snowplow Micro](https://github.com/snowplow-incubator/snowplow-micro) with your test tool of choice or learning more about how to validate your data collection setup, feel free to reach out via [Twitter (@snowplowlabs)](https://twitter.com/snowplowlabs?lang=en) or our [Discourse](https://discourse.snowplowanalytics.com/) forum. For bugs or specific feature requests, you can create an issue in the GitHub repository. As a Snowplow Insights customer you can of course also reach out to Support. 

If you are not yet using Snowplow and would like to learn more, [get in touch with us today](https://snowplowanalytics.com/get-started/)! 
