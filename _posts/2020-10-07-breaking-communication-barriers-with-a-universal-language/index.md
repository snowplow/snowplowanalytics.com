---
layout: post
title: "Breaking communication barriers with a universal language"
description: "Taking data informed actions that drive business value is the ultimate goal of building your data capability, yet communication barriers are the biggest reason data doesn’t get actioned. You can overcome these barriers by validating data up front, enforcing workflows around the ruleset of definitions." 
author: Archit
category: Data insights
permalink: /blog/2020/10/07/breaking-communication-barriers-with-a-universal-language/
discourse: false
---


As companies increasingly invest in building out their data capability, it’s important to keep the ultimate goal of collecting and analyzing data front of mind: to take data-informed actions that drive business value. 

However, communication barriers are the single biggest reason data doesn’t get actioned in the real world. Several such barriers exist but let’s focus on two of the most important ones:



1. Front-end developers send non-uniform tracking diluting the quality, and therefore the value of the data making it hard to consume
2. Data doesn’t get actioned because data consumers don’t know what fields in the warehouse mean, this eventually leads to the organization losing trust in their insights


## The status quo: unenforced event dictionaries

To explore why these two issues occur, it’s important to look at how most companies implement tracking. Often, an unenforced event dictionary created by the tracking designer is at the center of the tracking implementation. 



<img style="max-width:600px !important" src="{{ BASE_PATH }}/assets/img/blog/2020/10/event-dictionary.png" alt="event-dictionary"/>



For this to work well, the creator/owner of the unenforced event dictionary must clearly communicate the design intent. For example, that a search event should fire with these properties on search results being displayed - rather than the search button being clicked. The design intent must be made clear to both key stakeholders: the front-end developers and the data consumers.

This approach does sometimes work, particularly when the dictionary owner is invested in its long term success, perhaps as one of the data consumers. However, the dictionary is often created by a specialist consultant and ongoing ownership is unclear. 

This results in long Slack threads with both sets of stakeholders asking what rows in the sprawling event dictionary mean:



1. Devs can’t interpret the event dictionary and their goals and incentives often don’t line up with ensuring tracking matches intent exactly, instead they are focused on getting “good-enough” live on time.
2. Data consumers either can’t interpret the event dictionary or aren’t sure if the values loading in the database match the data dictionary intent. 


## The solution: a source of truth in a universal language

Create one central source of truth – a ruleset for what data is allowed to load to the warehouse. This ruleset is created by a designer in a standard format (e.g. JSON schema) and can therefore be universally interpreted (human and machine readable) and maintained long after their departure. 


<img style="max-width:600px !important" src="{{ BASE_PATH }}/assets/img/blog/2020/10/central-source-of-truth.png" alt="central-source-of-truth"/>


Going back to the two sets of stakeholders:



1. A dev needs to set up tracking to conform to the ruleset because if they don’t the data fails validation so they can be held accountable by viewing the failed event logs. 
2. This shifts the power to the consumers of the data as they can collaborate to create the ruleset in a universal language (e.g. JSON schema). They then control the structure of the data in the warehouse (and other targets) and therefore have confidence in what the input of their models will look like. Furthermore all new-joiners to the data team know exactly what each field means.

No one needs to communicate design intent using their own tracking conventions and no one is left to interpret this intent. As a result, no two humans need to communicate directly – this breaks down communication barriers to data being actioned.



 {% include shortcodes/ebook.html background_class="data-privacy-landingpage" layout="blog" title="SNOWPLOW WEBINAR" description="Watch a recording of the complete webinar on how to break down communication barriers with a universal language: The art and science of designing your tracking" btnText="Watch now" link="https://snowplowanalytics.com/webinars/the-art-and-science-of-designing-your-tracking/" %}


## What this could look like in practice

We can define what the events coming to your data warehouse look like before they are even sent by writing a set of rules. For example, the ruleset for a click event:



```json
{
    "element_name": {
        "enum": [
            "share",
            "like",
            "submit_email",
            "rate",
            ...
            "close_popup”
        ],
        "description": "The name of the element that is clicked"
    },
    "value": {
        "type": ["string", "null"],
        "description": "What is the value associated with the click"
    },
    "element_location": {
        "type": ["string", "null"],
        "description": "Where on the screen is the button shown eg. Top, left"
    },
    "click_error_reason": {
        "type": ["string", "null"],
        "description": "If the click resulted in an error, what was the reason eg. Invalid character in text field"
    }
}
```

Prior to loading the data to your warehouse, each event is checked to see if it conforms to the rules laid out. There are two ways of doing this:



*   If you are using a 3<sup>rd</sup> party data collection vendor such as GA – validate client side
*   If you have 1<sup>st</sup> party data collection such as a home-built pipeline or Snowplow – validate in the data collection pipeline, prior to warehouse loading

Either method means the structure of data in the warehouse is controlled strictly by those consuming it.

![properties-table](/assets/img/blog/2020/10/properties-table.png)


With this simple change to the setup of introducing an enforced ruleset, your front-end devs can finally QA your analytics in the same way as they would QA the rest of any build, by adding to their integrated testing suite using something like the open-source tool Micro.


## How Snowplow approaches enforced workflows

Validating data up front enforces workflows around the ruleset of definitions. At Snowplow, we have done some thinking around these workflows.

Snowplow is a first-party data delivery platform that validates events in the pipeline prior to loading to targets. Good events load to the warehouse (and other targets) while bad events are stored for debugging and reprocessing. 

Snowplow tracking can also be versioned – definitions can be updated according to semantic versioning with all changes automatically manifesting in the warehouse table structure.

Typical tracking workflow:



1. Collaborate in a tracking design workbook
2. Upload the rules (event and entity definitions) to the pipeline
3. Test tracking against these rules in a sandbox environment
4. Set up integrated tests to ensure each code push takes analytics into account
5. Set up alerting for any spike in events failing validation


## Summary

The case for enforced rulesets:



*   Front-end devs don’t need to interpret an unenforced event dictionary packed full of naming conventions
*   Consumers of the raw data don’t need to guess what keys and values mean
*   High quality analytics in every code push given the wealth of QA tooling that exists when working with machine readable rulesets
*   Far less data cleaning required since data is validated up-front

To learn more about how Snowplow can help you stay on top of your tracking strategy, [please get in touch.](https://snowplowanalytics.com/get-started/)