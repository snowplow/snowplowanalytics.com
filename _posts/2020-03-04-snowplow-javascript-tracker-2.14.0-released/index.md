---
layout: post
title: "Snowplow JavaScript Tracker 2.14.0 released"
title-short: Snowplow JavaScript Tracker 2.14.0
tags: [snowplow, javascript, tracker]
author: Paul
category: Releases
permalink: /blog/2020/03/04/snowplow-javascript-tracker-2.14.0-released/
discourse: false
---

We are pleased to announce a new release of the [Snowplow JavaScript Tracker][js-tracker].

[Version 2.14.0][2.14.0-tag] introduces improvements to cookie handling in the JavaScript tracker. With this release, the SameSite and Secure attributes can now be configured when using cookies as a storage method and there are now default values set for these attributes.

Read on below for:

1. [Configuring SameSite and Secure cookies](#1.-configuring-samesite-and-secure-cookies)
2. [Upgrading](#2.-upgrading)
3. [Documentation and help](#3.-documentation-and-help)

<!--more-->

## 1. Configuring SameSite and Secure cookies

The JavaScript tracker will, by default, utilise cookies to store an identifer and corresponding session information for each visitor to your site. The data in these cookies is attached to the payload of each event, as the domain_userid and session fields.

Cookies are used in the default tracker configuration and are also used if `stateStorageStrategy` is set to `cookieAndLocalStorage` (default) or `cookie`. If using `localStorage` or `none` then this update has no impact.

With the recent changes in Chrome 80 with regards to the SameSite cookie attribute, [see our blog post][samesite-cookie-update], it has become important in certain scenarios to be able to control the attributes on your cookies that are set by the JavaScript tracker.

### New Default values

The new defaults attributes for cookies set by the Snowplow JavaScript Tracker are:

```text
SameSite=None; Secure
```

This change [#795][795] has no effect for the majority of Snowplow JavaScript Tracker use cases, your tracking will continue to work just as before. However, as cookies are now marked as `Secure` by default they will only work on HTTPS. If you wish to use the tracker on HTTP, you must disable `Secure` and set your `SameSite` policy to `Lax` or `null`. See the [new tracker initialisation options](#new-tracker-initialisation-options) for how to configure this.

### Tracking in third party iframes

Releases prior to 2.14.0 will no longer be able to use cookies with Chrome version 80 or above when tracking inside third party iframes, unless `SameSite=None; Secure` attributes are set on the cookie. The new defaults above have been selected to ensure that the JavaScript tracker will continue to work inside third party iframe applications.

### New tracker initialisation options

Two new initialisation options have been introduced to allow the cookie attributes to be controlled.

`cookieSameSite` allows for the SameSite attribute of the cookie to be set. This can be `Strict`, `Lax`, `None` or `null`. The default is `None`. Using `null` will not set the SameSite attribute.

`cookieSecure` allows for the Secure attribute to be toggled. This can be `true` or `false`. The default is `true`.

The default options will generate cookies with `SameSite=None; Secure` attributes. We believe this will fit the majority of cases.

You may wish to set `cookieSameSite` to `Lax` which will increase your users privacy. N.B This option will not work if using the tracker inside a third party iframe but should work in all other circumstances.
Additionally, as mentioned earlier, if you wish for the cookies to work on non-secure HTTP then you must set `cookieSecure` to `false` and `cookieSameSite` to `Lax` or `null`.

### Maintaining existing behaviour

To maintain the same behvaiour as releases prior to 2.14.0, you can set the following tracker initialisation arguments:

```json
{
    cookieSameSite: null,
    cookieSecure: false
}
```

N.B. Please be aware that using the above settings will produce warnings in Chrome's developer tools if using the JavaScript Tracker in a third party iframe and it is now advisable to set the SameSite and Secure attributes to sensible values for your site.

## 2. Upgrading

The tracker is available as a published asset in the [2.14.0 Github release][2.14.0-tag]:

To upgrade, Snowplow Insights and Open Source users should host the 2.14.0 version of `sp.js` asset on a CDN, and load the tracker from there.

There are no breaking API changes introduced with this release, although to comply with Chrome's latest SameSite update the defaults for cookies attributes set by the tracker are now different as mentioned [above](#1.-configuring-samesite-and-secure-cookies). Previous behaviour can be achieved by using the options specified in [Maintaining existing behaviour](#maintaining-existing-behaviour).

## 3. Documentation and help

Check out the JavaScript Tracker's documentation:

* The [setup guide][setup]
* The [full API documentation][docs]

The [v2.14.0 release page][2.14.0-tag] on GitHub has the full list of changes made in this version.

Finally, if you run into any issues or have any questions, please
[raise an issue][issues] or get in touch with us via [our Discourse forums][forums].

[js-tracker]: https://github.com/snowplow/snowplow-javascript-tracker
[2.14.0-tag]: https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.14.0
[samesite-cookie-update]: https://snowplowanalytics.com/blog/2020/02/17/understanding-the-samesite-cookie-update/
[setup]: https://github.com/snowplow/snowplow/wiki/Javascript-tracker-setup
[issues]: https://github.com/snowplow/snowplow-javascript-tracker/issues
[forums]: https://discourse.snowplowanalytics.com/
[docs]: https://github.com/snowplow/snowplow/wiki/1-General-parameters-for-the-Javascript-tracker
[795]: https://github.com/snowplow/snowplow-javascript-tracker/issues/795
