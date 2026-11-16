---
layout: page
title: About
permalink: /about/
description: "Kire Góngora, software engineer, podcast host and book club runner. What I do, what I'm up to now, and what I use to do it."
sticker: overalls
redirect_from:
  - /uses/
# the date on the now section. change it when _data/now.yml changes
now_updated: 2026-10-29
---

<p class="subtitle">build. break. fix. repeat.</p>

Hola! I'm Kire, mostly known as [githugs](https://instagram.com/githugs_) on the 'gram. I'm a software engineer and I've been building for the web professionally since 2015, with a few stops and restarts in between, which I think is the normal shape of a career and not a flaw in mine.

I write React and TypeScript and a lot of plain JavaScript, and I'm just as happy in a WordPress theme as in a framework. I care about things loading fast and being usable by everyone, which is why I've spent years deep in WCAG. Right now I'm a contract developer in a newsroom. Before that I spent two years as a dev at a national lab, and before that I was a helicopter mechanic in the Marine Corps, which explains more about how I debug than any of the rest of it.

My full [work history is on LinkedIn](https://www.linkedin.com/in/kirenia/), if you'd like to connect.

Away from the keyboard I host [A (slightly) Better Tomorrow](https://aslightlybetterpod.com/), a podcast about futures worth wanting, and I run a free cyberpunk book club on Patreon. I have two kids, two cats, and a library card I use constantly.

{% comment %}
  my last post on bluesky, no heading, just the embed. js fills it at load
  and it stays hidden if the call fails.
{% endcomment %}
{% if site.bluesky_username %}

<section class="skeet" hidden data-skeet data-skeet-actor="{{ site.bluesky_username }}" aria-label="My latest post on Bluesky"></section>

{% endif %}

{% comment %}
  the now page moved in here. the groups are in _data/now.yml and /now/
  still redirects to this heading.
{% endcomment %}
<h2 class="section-title" id="now">Now</h2>

<p class="now-updated">what I'm up to lately. last updated <time datetime="{{ page.now_updated | date_to_xmlschema }}">{{ page.now_updated | date: "%-d %B %Y" }}</time></p>

<ul class="now">
  {%- for group in site.data.now %}
  <li class="now__item">
    <h3 class="now__label">{{ group.title }}</h3>
    <ul class="now__list">
      {%- for item in group.items %}
      <li>{% if item.url %}<a href="{{ item.url }}">{{ item.name | escape }}</a>{% else %}{{ item.name | escape }}{% endif %}{% if item.note %} <span class="uses-item__note">{{ item.note | markdownify | remove: "<p>" | remove: "</p>" | strip }}</span>{% endif %}</li>
      {%- endfor %}
    </ul>
  </li>
  {%- endfor %}
</ul>

<h2 class="section-title" id="uses">What I use</h2>

<div class="uses">
  {%- for group in site.data.uses %}
  {%- comment -%} each group folds. a plain details so it works with no js and a keyboard opens it {%- endcomment %}
  <details class="uses-group">
    <summary><h3 class="uses-group__title" id="{{ group.title | slugify }}">{{ group.title }}</h3></summary>
    <ul class="uses-list">
      {%- for item in group.items %}
      <li class="uses-item">{% if item.url %}<a href="{{ item.url }}">{{ item.name | escape }}</a>{% else %}{{ item.name | escape }}{% endif %}{% if item.note %} <span class="uses-item__note">{{ item.note | markdownify | remove: "<p>" | remove: "</p>" | strip }}</span>{% endif %}</li>
      {%- endfor %}
    </ul>
  </details>
  {%- endfor %}
</div>

<div class="note" markdown="1">
Nothing here is sponsored and none of the links pay me. Want to build something together, or just say hi? I'm [githugs@proton.me](mailto:githugs@proton.me), and I read everything.
</div>

<h2 class="section-title" id="sites">Sites I love</h2>

<ul class="roll">
  {%- for site_ in site.data.blogroll %}
  <li><a href="{{ site_.url }}">{{ site_.name | escape }}</a>{% if site_.note %}<span class="roll__note">{{ site_.note | escape }}</span>{% endif %}</li>
  {%- endfor %}
</ul>

Want to support what I make? [I'm on Patreon](https://www.patreon.com/githugs). The book club is free and it stays free.
