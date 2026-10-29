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
image: /assets/img/posts/cyberdeck-build-guide.jpg
image_alt: "A small Raspberry Pi screen full of red error messages and scrolling terminal text in the middle of a reboot."
---

Free guide (woohoo). This gets you from a blank memory card to a Pi you can talk to, in about half an hour if nothing fights you. Everything after that is linked out to the people who actually maintain it.

<div class="note" markdown="1">
You'll need the hardware from the [parts list]({% post_url 2026-08-16-cyberdeck-parts %}) and a laptop on the same wifi. This page is the hardware; the software that makes it a *deck* is the last step. No coding experience needed - you'll be copying and pasting.
</div>

1. [Flash the OS](#flash)
2. [First Boot](#first-boot)
3. [Where to go next](#next)

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

## 3. Where to go next

{: #next}

{% include sticker.html name="duck" class="sticker--right" %}

You have a working computer on your wifi. What it becomes next is up to the software and the hardware you bolt on, and all of that is better documented by the people who build it than it would be by me.

**The screen.** HDMI screens need nothing, plug them in before you power on and the Pi finds them. SPI screens (the ones that sit on the GPIO pins) need a driver once: [goodtft/LCD-show](https://github.com/goodtft/LCD-show) covers the Hosyond and most clones, and [Waveshare's wiki](https://www.waveshare.com/wiki/Main_Page) covers theirs.

**The battery.** [PiSugar's docs](https://docs.pisugar.com/) walk through mounting it and the power management, which is fiddly enough that you want their version and not mine.

**The soul.** The deck is the hardware, but what it does comes from what you install last. These are other people's projects, with their own install steps and their own source. Read what you are about to run before you run it, that is the whole point of it not being a mystery binary.

- [FocusWriter](https://gottcode.org/focuswriter/) by Graeme Gott, a focused writing app with no cloud in it
- **focusdeck** - coming soon
- **stellardeck** - coming soon

**The case.** Swap in your own colors, print or build something, make it ugly in a way you like. It's your deck now.

<div class="note" markdown="1">
Every deck I build throws something new at me, and I write all of it down: the troubleshooting I've collected, the stuff no tutorial warns you about, and the full build for each deck as I finish it. That goes to the [book club and the cyberdeck folks on Patreon](https://joy.githugs.lol), which is free to join. Come hang out, and show me what you built.
</div>
