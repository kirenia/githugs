---
layout: post
title: "Why I Built My Site With Jekyll Instead of a Fancy Framework"
date: 2026-08-20 12:33:00 -0600
description: "I can do frameworks, but I want my personal site to be low maintenance."
tags: [jekyll, indieweb]
---

I've shipped MERN apps, iOS apps, WordPress rebuilds, and Docker setups that haunt my dreams (no joke). I can use frameworks, but I wanted something simpler for myself. This site is hand-written HTML, one CSS file, a little JavaScript, and Jekyll to stitch the pages together. Even the newest dev can understand every line in the source code.

## The Whole Stack Fits in a Sentence

- **Jekyll** for the templates and the blog
- **Semantic HTML** with the headings in order
- **Fira Code** for the dark console mode
- **Fira Sans** for light mode
- **The Dracula palette** my favorite colors
- **jack.js** a tiny JS file that toggles light/dark
- **GitHub Pages** for hosting

Total dependencies: Jekyll, a font, and Font Awesome for a handful of icons. Jekyll only gets a pass because it has one job: eats Markdown and spits out HTML; and if it was gone tomorrow, the output is still plain HTML sitting in a folder. Nothing about the site depends on Jekyll continuing to exist.

## The Case for "Boring"

Most frameworks have a shelf life, and it's frustrating when projects from 2019 don't build anymore because a dependency of a dependency changed its API. Meanwhile, [HTML from the 90s still renders](https://info.cern.ch/hypertext/WWW/TheProject.html). I kinda want this site to live forever-ish, so I picked the only stack that has already proven it can survive decades.

There's also a fairness thing I couldn't get past. Frameworks ships a runtime to the browser so that my developer experience is nicer. Nice to have for big projects, but this site is not that. My site's pages are just HTML and CSS, and they load instantly on the cheapest phone on the slowest connection. That matters to me because I test everything on a Raspberry Pi 3 and I want it to work there too.

I also just love that you can view source. I learned to code by right-clicking on websites and reading what was there, and frameworks kind of killed that. A modern site's source is a `<div id="root">` and a minified bundle or something. This one is readable top to bottom so if some kid in 2036 wants to know how it works, they can just look.

Writing it by hand also made me better at the part of web dev that frameworks let you skip. Anyone can drop a component, but knowing when to use `<section>` vs `<article>` or why heading order matters or how a table should be marked up so a screen reader can actually navigate it _is_ the craft. Building this site made me better at HTML than five years of frameworks did.

And, okay, it's a little bit political. The web was supposed to be a place you could build on not a place you rent. A hand-coded site on a domain you own is the smallest possible version of that idea. Every framework and platform adds a layer between you and the thing you made and I wanted zero layers.

## What I Gave Up, and When I Still Reach for a Framework

I'm not going to pretend it's free. There's no component reuse, so there's some copy-paste, but _Jekyll includes_ cover most of it. Without a hot-reload I have to save/refresh a lot, it's fine. No client-side routing means every page is a full load, but no page here breaks 40kb so nobody notices. And when I wanted a search box I had to actually think about it instead of just installing it, which is how it ended up being about ten lines that filter a list already sitting in the page. ALl in all I gave up some developer convenience for a site that will outlive every framework currently on npm, and I'll take that trade every time.

None of this means I'm anti-framework of course. If a client needs a CMS their team can edit, they get WordPress. If a job needs React, I write React. Skipping frameworks on my own site is a requirements decision, and this site's requirements are permanence, ownership, and simplicity. Right click & view source if you must. Happy coding!
