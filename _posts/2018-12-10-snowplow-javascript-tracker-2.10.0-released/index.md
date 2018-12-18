---
layout: post
title: "Snowplow JavaScript Tracker 2.10.0 released with global contexts"
title-short: Snowplow JavaScript Tracker 2.10.0
tags: [snowplow, javascript, global, contexts, guard, error]
author: Mike
category: Releases
permalink: /blog/2018/12/10/snowplow-javascript-tracker-2.10.0-released-with-global-contexts/
discourse: true
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker]. [Version 2.10.0][2.10.0-tag] introduces global contexts, a set of powerful tools for working with contexts. Contexts are one of the most important features in Snowplow: they enable companies running Snowplow to track much rich, highly structured data that is easy to work with. In this post we'll quickly review what contexts are, before explaining why the "global contexts" functionality released is so powerful for companies that want to collect rich event-level data.

Also included in this release are:

* more context features for link and form tracking,
* a new option to prevent exceptions from surfacing, and
* many other under-the-hood improvements, updates, and bugfixes.

Read on below the fold for:

1. [Global contexts](#global-contexts)
2. [Error-handling](#error-supression)
3. [Dynamic contexts for link and form tracking](#link-form-tracking)
4. [Updates and bug fixes](#updates)
5. [Upgrading](#upgrade)
6. [Documentation and help](#doc)

<!--more-->

<h2 id="global-contexts">1. Global contexts</h2>

This release introduces a set of powerful tracker features for controlling when contexts are added to events. Before we go in and describe those features it is worth having a quick recap on what contexts are and why they are so important.

### 1.1 A quick recap on contexts

#### 1.1.1 What are contexts?

Snowplow is a data collection platform for recording events. Events can be very varied. To give just a handful of examples:

* Job seeker submits application for job  
* Shopper adds item to basket
* Visitor shares video on Twitter

Each of these events involves multiple different contexts or entities, where each context or entity can be described by multiple data points. To take the first example: "Job seeker submits application for job", this might involve the following contexts or entities:

* The job seeker
* The job applied for
* The application submitted
* The web page the application was submitted on
* The device that the user was on when he/ she submitted the application

Each of these contexts or entities might be described by multiple data points. For example, we might want to know the following about the job seeker:

* ID
* Gender
* Data of birth
* Qualification level
* Any specialisms
* Salary expectations
* Location

So when you record an event in Snowplow, you typically want to record data about all the entities or contexts involved in the event, and for each context, capture as much rich data as possible. Contexts make this possible: in the above example "job seeker submits application for job" you might track fire the following:

{% highlight javascript %}
window.snowplow("trackSelfDescribingEvent", {
    "schema": "iglu:com.jobsite/submit_application/jsonschema/1-0-0",
    "data": {
      "applicationId": "abc123"
    },
    [{
          "schema": "iglu:com.jobsite/job_seeker/jsonschema/1-0-0",
          "data": {
            "id": "jobseeker1",
            "gender": "female",
            "dateOfBirth": "2003-01-06",
            "qualification": "Masters",
            "specialisms": ["marketing", "digital"],
            "location": "London, UK"
        },
      },
      {
          "schema": "iglu:com.jobsite/job/jsonschema/1-0-0",
          "data": {
              "id": "job1",
              "title": "PPC Manager",
              "salary": 25000,
              "location": "London, UK",
              "employer": "The Big Cola Company"
          }
    },{
          "schema": "iglu:com.jobsite/application/jsonschema/1-0-0",
          "data": {
              "cv_uploaded": true,
              "cv_location": "https://uploads.jobsite.com/cvs/cv123"
          }
    }]
  })
{% endhighlight %}

It is possible for the company recording the event to send as many self-describing contexts with each event describing each of the contexts or entities involved in the event. (In the above example three contexts are sent with the event.) With each context it is possible to send as many data points as you wish. Typically, contexts will be common across multiple different event types. So the self-desribing JSON describing the job seeker would be sent with every event performed by that job seeker, including:

* searching for jobs
* viewing particular jobs
* favoriting particular jobs
* putting together an application
* submitting that application to a particular job
* any downstream events associated with interacting with the recruiter during the application process

#### 1.1.2 Predefined contexts

As the above example shows, with Snowplow it is possible to send as many contexts as you want with each event, with as many data points as you wish per context. In addition, Snowplow Trackers support sending "pre-defined" contexts with every event sent. For example, the Javascript Tracker supports automatically sending the following contexts:

* A [web page context][web-page-context], that identifies the web page on which an event occurs. This is useful if someone has got multiple tabs on a web site open at the same time and is flicking between them, so you can identify on which browser tab each event occurs in, and understand how the visitor is using each tab
* A [performance timing context][performance-timing-context], with data about how fast the web page loads
* A session context, that identifies which session an event occurred in, and what the cookie ID of the user is
* A [GA Cookies context][ga-cookies-context], that records the values in any Google Analytics cookies that have been set from the same domain
* A set of Optimizely contexts, that describe any experiments that are currently being run and if so, which

These are enabled when initializing the tracker. Once enabled, they are sent with every single event recorded.


## 1.2 Introducing Global Contexts

Up until now, Snowplow has offered users:

* The ability to send as many contexts as desired with each individual event
* The ability to automatically send some pre defined contexts with every single event

Global contexts provide the ability for end users to:

* Define their own contexts once (e.g. on tracker initialization) and then have this context sent with every single event subsequently recorded on the page. This saves developers having to manually build and send the context array with every single event fired.
* Define rules so that particular contexts are only sent with particular event types. This can be done in a number of ways:
  * based on the event schema URI
  * based on a user-supplied callback function that optionally accepts an argument containing the schema URI, event payload and event type

This puts an enormous amount of power in the hands of developers implementing Snowplow, to track a lot more rich data, conveniently, with each event.

## 1.3 Using the new Global context functionality

The following methods are added to the tracker:

1. [`addGlobalContexts`][add-global]
2. [`removeGlobalContexts`][remove-global]
3. [`clearGlobalContexts`][clear-global]

For a taste of the functionality, here we can define that a context is only sent for events with the schema vendor `com.acme`. Notice that `addGlobalContexts` must be supplied with an array of global contexts.

{% highlight javascript %}
let user_context = {
  schema: 'iglu:com.acme/user_context/jsonschema/1-0-0'
  data: {
    userid: 1234,
    name: 'john doe'
  }
};

// if a global context has a conditional component (in this case, a schema rule set)
// our global context must be supplied as an array, where the first element is
// the conditional part and the context is the second element
let global_context = [
  {accept: 'iglu:com.acme/\*/jsonschema/1-0-0'},
  user_context
]

window.snowplow('addGlobalContexts', [global_context]);
{% endhighlight %}

Full documentation can be found [here][global-contexts-docs].

<h2 id="error-supression">2. Error-handling</h2>

With this version, by default all exceptions generated by the tracker will not surface.

You can disable this by setting the following value:

{% highlight javascript %}
window.snowplow('addGlobalContexts', [global_context]);
{% endhighlight %}

<h2 id="link-form-tracking">3. Dynamic contexts for link and form tracking</h2>


The feature allows dynamic contexts to be passed in the `context` argument seen in the examples methods below for enabling link and form tracking. For form change events, context generators are passed `(elt, type, value)`, and form submission events are passed `(elt, innerElements)`. Link tracking events pass the source element to the context generator.

{% highlight javascript %}
window.snowplow('enableLinkClickTracking', criterion, pseudoClicks, trackContent, context);
window.snowplow('enableFormTracking', config, context);
{% endhighlight %}

<h2 id="beacon-api">4. Beacon API for event sending</h2>

This release allows you to send events to a collector using the Beacon API, in addition to the traditional `GET` and `POST` options.

This can be set in the argmap value, `beacon`.

{% highlight javascript %}
window.snowplow("newTracker", "cf", "d3rkrsqld9gmqf.cloudfront.net", {
  ...
  beacon: true,
  ...
});
{% endhighlight %}

<h2 id="updates">4. Updates and bug fixes</h2>

Other updates and fixes include:

* Transpile helpers.js and detectors.js ([#693][693])
* Fix default configOptOutCookie value ([#672][#672])
* Remove outdated addClickListener method ([#667][#667])
* Tracking click events on forms ([#579][#579])
* Update tracker script banner ([#684][#684])
* Add new local testing workflow ([#686][#686])
* Clean up indentation of integration test template ([#691][#691])
* Update outdated dependencies ([#685][#685])
* Fix typo in sesname variable ([#671][#671])
* Add Babel to build process ([#665][#665])
* Replace YUI Compressor with UglifyJS ([#687][#687])
* Refresh npm authentication token ([#688][#688])
* Fix log output for failed integration tests ([#689][#689])
* Use modularized imports for lodash ([#502][#502])
* Update npm steps in .travis.yml ([#690][#690])

<h2 id="upgrade">5. Upgrading</h2>

The tracker is available to use here:

```
http(s)://d1fc8wv8zag5ca.cloudfront.net/2.10.0/sp.js
```

As always, we encourage you to self-host your own copy of the tracker.

There are no breaking API changes introduced with this release.

<h2 id="doc">6. Documentation and help</h2>

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.10.0 release page][2.10.0-tag] on GitHub has the full list of changes made
in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.10.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.9.0
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker

[cds]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#consent-documents
[tcg]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentGranted
[tcw]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#trackConsentWithdrawn

[new-session]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#state
[transforms]: https://github.com/snowplow/snowplow/wiki/2-Specific-event-tracking-with-the-Javascript-tracker#custom-form-tracking

[web-page-context]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#webPage
[performance-timing-context]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#performanceTiming
[optimizely-context]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#optimizelyXSummary
[ga-cookies-context]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker#22154-geolocation-context


[580]: https://github.com/snowplow/snowplow-javascript-tracker/issues/580
[602]: https://github.com/snowplow/snowplow-javascript-tracker/issues/602
[605]: https://github.com/snowplow/snowplow-javascript-tracker/issues/605
[621]: https://github.com/snowplow/snowplow-javascript-tracker/issues/621
[625]: https://github.com/snowplow/snowplow-javascript-tracker/issues/625
