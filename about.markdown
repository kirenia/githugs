---
layout: page
title: About
permalink: /about/
description: "Kire Góngora, software engineer, podcast host and book club runner. What I do, and what I use to do it."
sticker: overalls
redirect_from:
  - /uses/
---

<p class="subtitle">build. break. fix. repeat.</p>

Hola! I'm Kire. I'm a software engineer and I've been building for the web professionally since 2015, with a few stops and restarts in between, which I think is the normal shape of a career and not a flaw in mine.

I write React and TypeScript and a lot of plain JavaScript, and I'm just as happy in a WordPress theme as in a framework. I care about things loading fast and being usable by everyone, which is why I've spent years deep in WCAG. Right now I'm a contract developer in a newsroom. Before that I spent two years as a dev at a national lab, and before that I was a helicopter mechanic in the Marine Corps, which explains more about how I debug than any of the rest of it.

My full [work history is on LinkedIn](https://www.linkedin.com/in/kirenia/), if you'd like to connect.

Away from the keyboard I host [A (slightly) Better Tomorrow](https://aslightlybetterpod.com/), a podcast about futures worth wanting, and I run a free cyberpunk book club on Patreon. I have two kids, two cats, and a library card I use constantly.

<h2 class="section-title" id="uses">What I use</h2>

<p>all the things i use daily</p>

<div class="uses">
  {%- for group in site.data.uses %}
  <section class="uses-group">
    <h3 class="uses-group__title" id="{{ group.title | slugify }}">{{ group.title }}</h3>
    <ul class="uses-list">
      {%- for item in group.items %}
      <li class="uses-item">{% if item.url %}<a href="{{ item.url }}">{{ item.name | escape }}</a>{% else %}{{ item.name | escape }}{% endif %}{% if item.note %} <span class="uses-item__note">{{ item.note | markdownify | remove: "<p>" | remove: "</p>" | strip }}</span>{% endif %}</li>
      {%- endfor %}
    </ul>
  </section>
  {%- endfor %}
</div>

<div class="note" markdown="1">
Nothing here is sponsored and none of the links pay me. Want to build something together, or just say hi? I'm [githugs@proton.me](mailto:githugs@proton.me), and I read everything.
</div>
