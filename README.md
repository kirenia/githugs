# githugs

## this website lives at githugs.lol

It's a growing personal collection of things I am building and reading and learning.

## stack

![Jekyll](https://img.shields.io/badge/Jekyll-ff5555?style=flat&logo=jekyll&logoColor=282a36)
![Ruby](https://img.shields.io/badge/Ruby-ff79c6?style=flat&logo=ruby&logoColor=282a36)
![HTML](https://img.shields.io/badge/HTML-ffb86c?style=flat&logo=html5&logoColor=282a36)
![CSS](https://img.shields.io/badge/CSS-8be9fd?style=flat&logo=css&logoColor=282a36)
![JavaScript](https://img.shields.io/badge/JavaScript-f1fa8c?style=flat&logo=javascript&logoColor=282a36)
![Markdown](https://img.shields.io/badge/Markdown-bd93f9?style=flat&logo=markdown&logoColor=282a36)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-50fa7b?style=flat&logo=githubpages&logoColor=282a36)

## running it

```bash
bundle install
bundle exec jekyll serve
```

localhost:4000. Add `--drafts` to see what's in `_drafts/`. Restart it after touching `_config.yml`, Jekyll only reads that file once. Everything in `_data/` reloads on save.

## writing a post

A file in `_posts/`, named `YYYY-MM-DD-some-title.markdown`.

```yaml
---
title: "Title In Normal Casing"
date: 2026-10-06 18:40:00 -0600
description: "One sentence. This shows on the home page and in link previews."
tags: [cyberdecks, guides]
image: /assets/img/posts/my-photo.jpg
image_alt: "what the picture shows"
sticker: dune
---
```

Only `title` and `date` are required.

Titles and headings get written properly cased and the CSS lowercases them, so the markup stays readable to screen readers, search, and anyone copying text out of it.

## pictures

Post photos live in `assets/img/posts/`. Make them **1600x1067** (3:2), JPEG, under about 300KB.

`image:` does three jobs with one line: the big photo at the top of the post, the thumbnail beside it on the home page, and the preview card when someone shares the link. Both thumbnails crop 3:2 from the center, so shoot 3:2 and you pick the crop instead of the CSS picking it. Social cards crop a little tighter, so keep faces and text off the top and bottom edges.

`image_alt` describes the picture for people who can't see it. Leave it out when the picture is pure decoration.

No `image:` and the post gets a block in its own color with a sticker on it. `thumb: dune` picks which sticker.

## stickers

Real things from my life, cut out and tilted. They live in `assets/img/stickers/` and every one is listed in `_data/stickers.yml` with its real size, so the browser holds the space while it loads.

```yaml
sticker: dune          # floats right, next to the first paragraph
sticker_tilt: 5deg     # optional, overrides the angle in the data file
```

A name that isn't in the data file draws nothing, instead of a broken image.

## the nav and the socials

`_data/nav.yml` is the top nav, in order. A full `https://` url points off the site, anything else is relative.

`_data/social.yml` is the footer row. Each entry names the `_config.yml` key that holds the handle, so deleting the key here or there drops the link. The icon is a Font Awesome class.

## books

`/books/` reads `_data/books.yml`. Three lines per book:

```yaml
- title: "Neuromancer"
  author: "William Gibson"
  isbn: "9780441007462"
  amazon: ""
```

The Bookshop link is built from the ISBN plus my affiliate id in `_data/shop.yml`. `amazon` takes a full url, pasted in as is. Leave either one empty and that link just doesn't show. The search box filters on title and author, and the whole list still renders with JavaScript off.

## javascript

There is barely any, and nothing breaks without it.

- `site.js`: off-site links open in a new tab, plus a hello in the console
- `jack.js`: the light/dark toggle. Its pre-paint half is inline in `_includes/head.html`, because it has to run before the browser paints
- `booksearch.js`: the filter on `/books/`
- `reclist.js`: the sorter on the cyberpunk media list

The last two only load where they're used. A page asks for one in its front matter:

```yaml
scripts: [reclist]
```

## theme

Dracula, two ways. Light is paper. Dark is a terminal: monospace everything, a `>` before the headings, a blinking cursor after my name. The whole palette is custom properties at the top of `style.css`, and `light-dark()` does the switching.

## deploying

Push to `main`. GitHub Pages builds it. `CNAME` points githugs.lol at it, which is also why `baseurl` stays empty even though this is a project page now.

xo kire
