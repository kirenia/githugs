---
layout: page
title: Now
permalink: /now/
description: "What Kire is reading, building, playing and looking forward to right now."
sticker: star
updated: 2026-10-29
---

<p class="subtitle">what i'm up to lately</p>

<p class="now-updated">Last updated <time datetime="{{ page.updated | date_to_xmlschema }}">{{ page.updated | date: "%-d %B %Y" }}</time>.</p>

<div class="uses">
  {%- for group in site.data.now %}
  <section class="uses-group">
    <h2 class="uses-group__title" id="{{ group.title | slugify }}">{{ group.title }}</h2>
    <ul class="uses-list">
      {%- for item in group.items %}
      <li class="uses-item">{% if item.url %}<a href="{{ item.url }}">{{ item.name | escape }}</a>{% else %}{{ item.name | escape }}{% endif %}{% if item.note %} <span class="uses-item__note">{{ item.note | markdownify | remove: "<p>" | remove: "</p>" | strip }}</span>{% endif %}</li>
      {%- endfor %}
    </ul>
  </section>
  {%- endfor %}
</div>

<div class="note" markdown="1">
This is a [now page](https://nownownow.com/about). If you have one, [tell me about it](mailto:githugs@proton.me).
</div>
