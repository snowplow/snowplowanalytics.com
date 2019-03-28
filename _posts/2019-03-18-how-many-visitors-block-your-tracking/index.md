---
layout: post
title-short: Quantifying the Impact of Privacy Tech
title: "How many of your visitors block your Snowplow tracking?"
tags: [analytics,privacy, adblock, server-side, tracking, ITP2.1]
author: Mike N
category: Analytics
permalink: /blog/2019/03/18/how-many-visitors-block-your-tracking/
discourse: true
published: true
---

<h2 id="tldr">tl;dr</h2>

As a company that focuses on helping businesses collect data in order to better serve their customers, we inevitably get asked about what happens when those customers don’t want to be tracked.

With the usage of Ad-blockers, and in particular privacy filters, on the rise, some of our customers are seeing the effect on their data. This effect is at times perceived as a problem or a threat towards the quality of data collection.

In this post I’d like to discuss the nature and scope of how privacy technology impacts data collection as well as propose a couple of options of how to quantify the impact.


<h2 id="what exactly are we dealing with here">What Exactly are we Dealing with Here?</h2>

To begin I’d like to take a little bit of time to clarify the different types of privacy tech and how they impact data collection.

When talking about privacy software in relation to Snowplow tracking, we are almost always talking about a user’s browser suppressing the data collection by Snowplow’s JavaScript tracker. One way would be by restricting the Snowplow JavaScript tracker from loading. Sometimes JavaScript is allowed to load, but requests sent by the tracker to Snowplow data collection servers are blocked. Another case might be a browser enforcing an opt-out of any tracking,often referred to as “do-not-track” where a cookie is used to identify that the particular browser should not send analytics data.

All of these cases may also be referred to as client-side tracking suppression. The underlying premise being that all of this suppression or blocking is occuring in an environment that a web application or site owner does not control.

It’s important to note here that _not all_ configurations of AdBlock software will block analytics tracking.

For the most part, the main goal of ad blockers is to suppress adware. Adware is any software that is designed to display advertisements, and is often also used to track visitors across different advertiser domains.

Some ad blockers however do extend their functionality to give users more control over privacy. As adware became increasingly more sophisticated and began tracking users across multiple websites, the response from ad blockers and browsers was to start helping their users better control what data is captured by whom.


<h3 id="privacy filters">Privacy Filters</h3>

Privacy filters typically operate based on lists of known data collection scripts and endpoints.

[AdBlock][adblock] and [uBlock][ublock] Origin are two of the most popular ad blocking plugins, which both use a privacy filter called [EasyPrivacy][easyprivacy]. For AdBlock, it doesn’t seem to be turned on by default, whereas for uBlock it does. The full list of “general tracking systems” that this privacy filter suppresses can be found here: [https://easylist-downloads.adblockplus.org/easyprivacy.txt][easyprivacylist]. Indeed Snowplow’s JavaScript is on the list as well as an entry for common Snowplow collector endpoints.

When a user decides to turn EasyPrivacy on, most standard implementations of the Snowplow JavaScript tracker will no longer send data.

<h3 id="do-not-track">Do-Not-Track</h3>

Most modern browsers now have a “do not track” feature. This is something that is normally not turned on by default unless in “private browsing mode”.

This feature is also one that requires you as the website owner to **voluntarily** respect. This feature does not work like the privacy filters explained above, but rather is a choice you need to make for any or all of the data collection you do on your site.

For Snowplow for example it is as simple as setting the ~~~respectDoNotTrack~~~ field of the argument map in your JavaScript initialization to `true`.

Closely related to the do not track feature in browsers is the concept of an “opt-out” cookie.

This again is something that site owners voluntarily provide through some type of pop up when a user visits their site. By selecting to “opt-out” the visitor expresses that they would not like to be tracked and a cookie is placed on their browser so that every time they visit, data is not collected.

Recently, it seems that Safari (and maybe others) are [giving up on do not track][donottrack].


<h3 id="do-not-track">Third Party Cookies and Third Party Contexts</h3>

One other common topic in the discussion of what users/browsers may typically block is the concern over 3rd party cookies.

Although it’s less of an issue for most Snowplow users since tracking users via 1st party cookies is the norm, this may come up if you are trying to track users across multiple domains. For example you may have different domains for different geographical regions and you’d like to track users that go from the .co.uk to the .de site as the same user.

There is a thread on this [here][discourse], which talks about measuring the number of users who block 3rd party cookies.

While writing this post, [WebKit][webkit] announced the release of the latest iteration of Safari’s Intelligent Tracking Prevention (ITP), known as ITP 2.1. This will have a big impact on cookies set by JavaScript in the Safari Browser. For a detailed breakdown on ITP 2.1’s impact on analytics I recommend reading Simo Ahava’s [post][simo].

<h3 id="block all the scripts">Block All the Scripts!</h3>

There is of course the potential that you might have traffic coming to your site that has disabled the use of any scripts and therefore will obviously not load the Snowplow JavaScript. In this case, neither will any other script and the user experience would likely suffer on most modern web pages.

![allthescripts-img]

<h3 id="how common is all of this">How common is all of this?</h3>

Although there are articles with stats out there on the rise in adoption of ad blockers [New York Times _2017_][NYT], there aren’t so many on the use of privacy filters.

According to Chrome’s web store uBlock (which turns on EasyPrivacy by default) has 10,000,000+ users.

With legislative initiatives like GDPR last summer and others gaining momentum around the world, privacy is likely not going to go away or reduce in size as an issue for both internet users and site owners.

Privacy software will likely continue to expand its scope and capability, and perhaps its popularity as well.

While writing this blog post a colleague of mine pointed out a [tweet][tweet] by Jen Simmons, Designer Advocate at Mozilla that claims by summer this year Firefox will by default block “cross-site third-party trackers”.

Per the list Firefox uses for this, which is maintained by [Disconnect][disconnect], Snowplow is not listed. Maybe because the definition they have as trackers is as such:

“Tracking is the collection of data regarding a particular user's activity across multiple websites or applications that aren’t owned by the data collector, and the retention, use or sharing of that data.”

From that definition it is clear that the focus is not on tracking done by a site or app owner for purposes of internal analytics.

So all though privacy concerns and protection may be on the rise, legitimate use of analytics data collection should be something that site owners can be transparent to their users about. After all, both AdBlock and Mozilla use Google Analytics on their sites.

**A quick refresher on 1st vs 3rd party cookies**:

1st party cookies are set by web servers serving the website therefore on the same domain and therefore considered 1st party. When the domain of a server is different to that of the website, any cookie set by that server is considered 3rd party. Snowplow, like other analytics providers can use 3rd party cookies to help companies set cookies across multiple domains. For example, if you have multiple regional domains or different brands that you would like to track users across, you would need a 3rd party cookie to help set a user identifier generated by Snowplow, to then “stitch together” the events across domains.

<h2 id="how to quantify">How to Quantify that which does not want to be Quantified</h2>

Given all the examples above of how data might not get collected, the next part of this post will focus on how you can try to quantify the amount of traffic you don’t see come through.

There are many ways to go about the examples I will share in this post, and there are also likely plenty of other ways to quantify the missing data. I encourage you to share your thoughts in the comments or reach out directly if you’d like to discuss any options not expressed here.

<h3 id="Good Old Pixel Tracking to the Rescue">Good Old Pixel Tracking to the Rescue</h3>

One way to collect data even if the JavaScript tracker is blocked would be to use the [Snowplow pixel tracker][pixel]. I’d like to outline a particular approach that couples checking to see if the Snowplow JavaScript has loaded with sending static analytics information worth collecting (e.g. page title, url, etc.).

The approach here is somewhat similar to what many sites, particularly in media, have done to “detect” ad blocking plugins. However, this approach focuses on the Snowplow JavaScript rather than on using fake ad scripts or other methods that suggest an ad block plugin is enabled.

The concept behind it is pretty simple: test if the the sp.js file is accessible, if not then write the tracking pixel html to the document.

Here’s an example of the code, which is a modified version of some script written by [JonathanMH][jonathan]:


~~~
<!-- Check if our script is blocked from being loaded and send pixel if so -->
 <script>
   document.addEventListener('DOMContentLoaded', init, false);

   function init() {
     adsBlocked(function (blocked) {
       if (blocked) {
         document.getElementById('result').innerHTML = "<div style=\"display: none; visibility: hidden;\"><img src=\"http://{{collector-path}}/i?e=se&aid=console&se_ca=javascript_not_loaded&se_ac=else&se_pr=different&se_la=entirely&p=web&tv=no-js-0.1.0\"></img></div>";
       } else {
         document.getElementById('result').innerHTML = '<div style=\"display: none; visibility: hidden;\">ads are not blocked</div>';
       }
     })
   }

   function adsBlocked(callback) {
     var testURL = 'http://d1fc8wv8zag5ca.cloudfront.net/2.8.1-rc1/sp.js'

     var myInit = {
       method: 'HEAD',
       mode: 'no-cors'
     };

     var myRequest = new Request(testURL, myInit);

     fetch(myRequest).then(function (response) {
       return response;
     }).then(function (response) {
       console.log(response);
       callback(false)
     }).catch(function (e) {
       console.log(e)
       callback(true)
     });
   }

 </script>

 <!-- End blocked script pixel tracking -->
~~~

Here the script checks if it can access sp.js and if not writes the following into the document:

~~~
    if (blocked) {document.getElementById('result').innerHTML = "<div style=\"display: none; visibility: hidden;\"><img src=\"http://{{collector-path}}/i?e=se&aid=console&se_ca=javascript_not_loaded&se_ac=else&se_pr=different&se_la=entirely&p=web&tv=no-js-0.1.0\"></img></div>";
~~~


That’s the pixel tracker. I’ve chosen to use some [custom structured event parameters][cses] to send across a category of “javascript_not_loaded” as an example. Of course you could phrase that however you’d like or use different parameters to send in the query string with these page load events.

These will then land in your data warehouse for you to query and get a sense of how many events came through without the JavaScript tracker.

<h3 id="Have you met our friend Server-side tracking?">Have you met our friend Server-side tracking?</h3>

Another very useful approach would be to use one of [Snowplow’s server-side trackers][serverside] in conjunction with your JavaScript tracking. My colleague Rebecca has written a great [blog post][blog] talking about server-side tracking. Have a read to learn more about some examples of the advantages of collecting data in this way.

Combining client and server-side tracking is another way to help quantify how many users might be blocking your script. More importantly though, you can significantly decrease any gaps in your data.

To help with our goal of quantifying blocked script, it is possible to write server-side code to read (rather than set) the domain_userid and network_userid cookies that are set by the Snowplow JS tracker and collector respectively. Then it’s possible to see in the data if a particular user:

* Doesn't have one or both of those cookies set (If the sp.js script is prevented from loading then the domain_userid value will not be set).
* Has those values set, but those values appear to be reset with each page load e.g. for a user on a particular IP / useragent string. (In which case the cookies are not being successfully persisted between pages, suggesting the cookies themselves are being blocked.)
* Has those values set, but no corresponding events for those devices are received from the Javascript tracker - suggesting that the actual requests made by the JS tracker have been blocked.

<h3 id="DNT">Quantify DNT</h3>

If you’d like to detect how many of your visitors are using do not track, that is also something that can be done. While the Snowplow JavaScript tracker does this when setting the respect do-not-track argument to true, you can also decide to send a custom context when that happens. Here’s an example:

~~~
// "1" or "unspecified"
if(navigator.doNotTrack == 1) {
    // Do (or don't do) stuff.
}
~~~

<h2 id="wrapping it all up">Wrapping it All Up</h2>

There is a host of privacy technology out in the world today, and it looks as if it continues to develop. Understanding the current landscape is certainly an important ongoing task. I hope that this blog post has outlined how some of the more common privacy technologies that may affect the way in which data is collected with Snowplow. I also hope that I’ve provided a couple of ideas in how to quantify the volume of traffic that is impacted by privacy tech.

At Snowplow we are here to help people take control of their data in order to differentiate in their market. As a data collection platform that focuses on data ownership by our customers, we will continue to look at product developments that give our customers flexibility in tracking technology. Empowering our customers to collect data through various sources in a manner that allows them to give their users choice in how and what data is collected, is where we look to innovate.

If you would like to discuss how you can better quantify the impact of ad blockers and related technology to your data; or if you’d like to learn more about server side tracking please do get in touch.



[adblock]:https://www.getadblock.com/
[ublock]:https://github.com/gorhill/uBlock
[easyprivacy]:https://easylist.to/
[easyprivacylist]:https://easylist-downloads.adblockplus.org/easyprivacy.txt
[donottrack]:https://webkit.org/blog/8613/intelligent-tracking-prevention-2-1
[allthescripts-img]: /assets/img/blog/2019/03/allthescripts.png
[NYT]:https://www.nytimes.com/2017/01/31/technology/ad-blocking-internet.html
[tweet]:https://twitter.com/jensimmons/status/1098335173089873920
[disconnect]:https://disconnect.me/trackerprotection#trackers-we-block
[pixel]:https://github.com/snowplow/snowplow/wiki/Pixel-tracker
[jonathan]:https://jonathanmh.com/how-to-detect-ad-blockers-adblock-ublock-etc/
[cses]:https://github.com/snowplow/snowplow/wiki/Pixel-tracker
[serverside]:https://github.com/snowplow/snowplow/wiki/trackers
[blog]:https://snowplowanalytics.com/blog/2019/02/05/how-server-side-tracking-fills-holes-in-your-data-and-improves-your-analytics/
[discourse]:https://discourse.snowplowanalytics.com/t/measuring-what-fraction-of-your-visitors-have-third-party-cookies-blocked/190
[webkit]:https://webkit.org/
[simo]:https://www.simoahava.com/analytics/itp-2-1-and-web-analytics/
