---
layout: post
title: "Cyberdeck Build Guide"
date: 2026-08-18 10:00:00 -0600
description: "The base build every cyberdeck here starts from. What to buy, how to flash it, and common troubleshooting steps."
tags: [cyberdecks, guides]
sticker: lucky
redirect_from:
  - /cyberdecks/guide.html
  # the old /scripts/ pages are gone, so their links land here
  - /scripts/
  - /scripts/writerdeck/
---

Free guide (woohoo). Takes about an hour if nothing fights you.

<div class="note" markdown="1">
You'll need the hardware from the [parts list]({% post_url 2026-08-16-cyberdeck-parts %}) and a laptop on the same wifi. This page is the hardware; the software that makes it a *deck* is the last step. No coding experience needed - you'll be copying and pasting.
</div>

1. [Flash the OS](#flash)
2. [First Boot](#first-boot)
3. [The Screen](#screen)
4. [Troubleshooting](#trouble)
5. [Pick a Soul](#software)

## 1. Flash the OS

{: #flash}

Put the operating system on the memory card.

Grab [Raspberry Pi Imager](https://www.raspberrypi.com/software/) and flash **Raspberry Pi OS Lite (64-bit)** to your microSD card. It hides under "Raspberry Pi OS (other)" in the OS list; everyone misses it the first time.

<div class="note" markdown="1">
Heads up: flashing **erases the card**, so use a blank one or copy anything off it first.
</div>

Before you hit write, click the settings gear (the cog icon, sometimes labelled "Edit Settings") and set:

- a **username** - lowercase, no spaces (like `kire`)
- a **hostname** you'll remember - mine is the deck's name (like `writerdeck`). You'll use this to connect in the next step.
- your **wifi** network and password
- tick the box to **enable SSH**
- leave **Enable Raspberry Pi Connect** switched off - it's a remote-access service you'd sign into, and you don't need it when you're reaching the Pi over SSH on your own wifi

Setting all this now is why you never have to plug the Pi into a monitor or keyboard to get started.

## 2. First Boot

{: #first-boot}

Card in, power on, give it a few minutes.

The first boot does two or three minutes of invisible setup work. Then, from your laptop, open a terminal and connect using the **username** and **hostname** you set in step 1 (so if your hostname was `writerdeck`, that's `writerdeck.local`):

```
ssh username@hostname.local
```

The first time, it'll ask if you're sure you want to connect - type `yes`. Then it asks for the password you set. If you see a terminal prompt afterwards, you're in. You now own a computer you can talk to.

<div class="note" markdown="1">
**"Connection refused"?** Good news, weirdly. That means the Pi is on the network and just isn't done setting up. Wait another minute and try again. If the name won't resolve at all, find the Pi's IP address in your router's device list and use that instead: `ssh username@192.168.1.xxx`.
</div>

## 3. The Screen

{: #screen}

Two kinds of small screen, two paths.

**HDMI screens just work.** Plug it in before you power on and the Pi finds it - nothing to install or configure. This is the path I recommend for every new build.

**SPI screens** (the ones that mount on the GPIO pins, like the Hosyond 3.5") are slower and need a driver installed once. Paste these lines one at a time:

```
git clone https://github.com/goodtft/LCD-show.git
cd LCD-show
chmod +x LCD35-show
sudo ./LCD35-show
```

The Pi reboots and the little screen comes alive. Under the hood a helper called `fbcp` mirrors the main framebuffer (`fb0`) onto the SPI panel. You don't need to touch it, but knowing it exists saves you a confused hour later.

<div class="note" markdown="1">
SPI quirks, so you don't debug them for nothing: video playback needs `mplayer -vo fbdev2` (`mpv` can't render to the framebuffer, hard limit, not your config), and a faint blue tint is a known `fbcp` thing. Cosmetic, harmless, weirdly grows on you. Fast-redraw stuff like video is where SPI suffers; for text it's completely fine.
</div>

## 4. Troubleshooting

{: #trouble}

{% include sticker.html name="duck" class="sticker--right" %}

The stuff no tutorial warned me about.

- **Scary SSH warning after reflashing.** "REMOTE HOST IDENTIFICATION HAS CHANGED" in all-caps is your laptop remembering the old card's identity, not an attack. Run `ssh-keygen -R yourdeck.local`, reconnect, accept the new fingerprint. Only worry if you see this when you _haven't_ reflashed.
- **404 Not Found during an install.** The package mirror moved things mid-sync. Run `sudo apt update` and re-run whatever failed. Fixes it basically every time.
- **YouTube tools broken.** Install `yt-dlp` through pip, not apt. The apt version is ancient and YouTube breaks it monthly.
- **Old tutorials disagree with what you see.** Pi OS moves fast: menus get reorganized, config files move. Trust the error message and the current docs over a 2022 blog post. This guide gets re-tested every time I build a new deck.

## 5. Pick a Soul

{: #software}

The deck is the hardware, but the soul lives on the SD card. Everything above is the same for every deck here; the software you install last is what decides what it becomes.

**You're not done yet - this is the fun part.** Pick one below and follow its instructions; that's where your deck actually comes to life.

<div class="note" markdown="1">
These are other people's projects, and their own sites have the install steps and the source. Read what you're about to run before you run it - that's the whole point of it not being a mystery binary.
</div>

- [FocusWriter](https://gottcode.org/focuswriter/) by Graeme Gott - focused writing app, no cloud
- **focusdeck** - coming soon
- **stellardeck** - coming soon

Before the software goes on, set up the rest of the hardware: to start, plug in a normal USB keyboard (Bluetooth pairing comes later, on the deck's own page). [Add the PiSugar battery](https://docs.pisugar.com/docs/product-wiki/battery/pisugar3/pisugar-3-series) to cut the cord, swap in your own colors, put it in a cool case. It's your deck now. Share your build with me if you'd like!
