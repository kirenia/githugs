# githugs

## this website is githugs.lol

It's a growing personal collection of things I am building and reading and learning.

## stack

![Jekyll](https://img.shields.io/badge/Jekyll-ff5555?style=flat&logo=jekyll&logoColor=282a36)
![Ruby](https://img.shields.io/badge/Ruby-ff79c6?style=flat&logo=ruby&logoColor=282a36)
![HTML](https://img.shields.io/badge/HTML-ffb86c?style=flat&logo=html5&logoColor=282a36)
![CSS](https://img.shields.io/badge/CSS-8be9fd?style=flat&logo=css&logoColor=282a36)
![JavaScript](https://img.shields.io/badge/JavaScript-f1fa8c?style=flat&logo=javascript&logoColor=282a36)
![Markdown](https://img.shields.io/badge/Markdown-bd93f9?style=flat&logo=markdown&logoColor=282a36)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-50fa7b?style=flat&logo=githubpages&logoColor=282a36)

Built by hand. No framework, no build step I'd resent, no razzle-dazzle.

## running it

```bash
bundle install
bundle exec jekyll serve
```

localhost:4000. Add `--drafts` to see the unfinished stuff.

Jekyll reads `_config.yml` once at startup, so changes there need a restart. `_data/` reloads on save. That's why the fiddly bits live in `_data/`.

## writing a post

A file in `_posts/`, named `YYYY-MM-DD-some-title.markdown`.

```yaml
---
title: "Title In Normal Casing"
date: 2026-10-06 18:40:00 -0600
description: "One sentence. Shows on the home page and in link previews."
tags: [cyberdecks, guides]
image: /assets/img/posts/my-photo.jpg
image_alt: "what the picture shows"
sticker: dune
---
```

Only `title` and `date` are required.

Titles and headings get typed properly cased. The CSS lowercases them. That way the page looks the way I want and screen readers, search and anyone copying text still get real sentences.

## pictures

Post photos go in `assets/img/posts/`. 1600x1067 (3:2), JPEG, under about 300KB.

One `image:` line covers three spots: the photo at the top of the post, the small one on the home page, and the link preview. Both thumbnails crop 3:2 from the middle, so hand it a 3:2 photo and I pick the crop instead of the CSS. Link previews crop tighter, so keep anything important away from the top and bottom.

`image_alt` is for people who can't see the picture. Decoration gets no alt text, on purpose.

No `image:` and the post gets a colored block with a sticker on it. `thumb: dune` picks the sticker.

## stickers

Real things from my life, cut out and tilted. They live in `assets/img/stickers/` and each one is listed in `_data/stickers.yml` with its real pixel size, so the browser holds the space while it loads.

```yaml
sticker: dune          # floats right, next to the first paragraph
sticker_tilt: 5deg     # optional, overrides the data file
```

Ask for a sticker that isn't in the data file and nothing draws. Better than a broken image.

## the nav and the socials

`_data/nav.yml` is the top nav, in order. A full `https://` url goes off site, anything else is relative.

`_data/social.yml` is the footer row. Two kinds of entry:

```yaml
- field: instagram_username    # handle comes from _config.yml
  title: instagram
  icon: fa-brands fa-instagram
  url: https://instagram.com/

- title: rss                   # or just point it somewhere
  icon: fa-solid fa-rss
  href: /feed.xml
  label: rss
```

A `field` entry drops out if that key isn't in `_config.yml`. `icon` is a Font Awesome class.

## javascript

Barely any, and nothing breaks without it.

- `site.js` sends off-site links to a new tab and says hi in the console
- `jack.js` is the light/dark toggle. Half of it is inline in `_includes/head.html` because it has to run before the browser paints, or you get a white flash on the way into dark

A script that only one page needs goes in `assets/js/` and that page asks for it in front matter, so it loads there and nowhere else:

```yaml
scripts: [whatever]
```

## theme

Dracula, two ways. Light is an old science page: Georgia on off-white, justified copy, hard square edges, a flat band across the top. Dark is a terminal: Fira Sans, a `>` in front of the headings, a cursor blinking after my name. Monospace carries the small stuff in both, the nav and the dates and the tags. The palette is custom properties at the top of `style.css` and `light-dark()` picks the side, so every color is written once. Georgia ships on every machine, so light mode loads no font at all. There's a post about it.

## deploying

Push to `main`, GitHub Pages builds it. `CNAME` points githugs.lol here, which is why `baseurl` stays empty even though this is a project page now.

xo kire
