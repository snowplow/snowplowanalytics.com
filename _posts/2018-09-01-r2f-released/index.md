---
layout: post
title-short: Right to be forgotten spark job released
title: "Right to be forgotten (R2F) spark job released"
tags: [snowplow, encryption, batch, clojure, collector]
author: Kostas
category: Releases
permalink: /blog/2018/09/01/r2-released/
---

We are pleased to announce the release of the [R2F (Right to be forgotten)][r2f-release] spark job.

This is a stand-alone spark job that removes rows which contain specific PII identifiers, to help Snowplow users remove data about a specific user, when that user has requested it.