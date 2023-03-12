---
title: Cutting the Folder Structure
date: 2022-12-29
---

# Cutting the Folder Structure

<Badge type="info" text="published on 2022-12-29" />

::: info
Cross posted from the [Cloudflight engineering blog](https://engineering.cloudflight.io/cutting-the-folder-structure).
:::

How to organize the files can be quite confusing when starting in programming, especially when the code base grows and the existing structure cannot manage that much content anymore.

## Value of Having Structure

Why does it matter to us? Modern editors have file search implemented, and we can simply use that to find our files, no?

Let's assume we do not need folder structures. In that case, multiple thousands of files are in the root folder. The scroll bar has become very tiny. You are tasked with adding a new feature to this software. How would you do this? You can create your files here, only having them placed somewhere in the whole list of files due to the sorting. Finding out which files belonged to your feature? That will be quite an undertaking. Oh, you have written a small utility that can be helpful for other places in the code base? Nice. Time to tell our colleagues about it and… where is that file again? Wait, are we sure a similar utility did not already exist somewhere?

## Concept of a Folder

A folder is nothing but an abstraction to hide information you might not be interested in right now. The convention to put files into folders is to group them by some properties of the content of the file. With a proper folder structure, we can navigate the code base according to some characteristics of the file we know about. The file name is not always known, and searching by file name is also not the only search we need.

## Horizontal and Vertical Cutting

For a software project specifically, cutting the folder structure can be done horizontally or vertically.

Horizontal cutting is a flat structure, where each file is put into a folder according to the kind of file. This approach is straightforward but does not scale well. Why does it not scale? Because having files from multiple domains, which are not directly related, in the same folder leads to clutter.

```
src/
|- component/
|- model/
|- pages/
|- util/
```

Vertical cutting is domain-based, meaning the files are grouped based on the feature/business need. The benefit here is clear separation of pieces of code, which do not have much to do with each other anyway. Imagine we are building our own mini photoshop clone, and we might get a folder structure like below:

```
src/
|- color/
|- crop/
|- image/
|- text/
|- ...
```

These two techniques are not mutually exclusive. Since cutting horizontally can't scale by itself, we can cut the code base vertically first and then horizontally for the files inside to get the best out of both worlds. For commonly used code, creating a folder called `common` should suffice.

```
src/
|- color/
  |- component/
  |- model/
  |- page/
  |- util/
|- common/
  |- component/
  |- model/
  |- page/
  |- util/
|- crop/
  |- component/
  |- model/
  |- page/
  |- util/
|- image/
  |- component/
  |- model/
  |- page/
  |- util/
|- text/
  |- component/
  |- model/
  |- page/
  |- util/
```

## Scaling Up

For even bigger projects, one vertical layer might not be good enough. To address that, adding more vertical layers will simply solve the problem. There is, however, one potential caveat. Let's take a look at the following structure:

```
src/
|- color/
  |- rgb/
  |- hsl/
|- common/
|- crop/
|- image/
  |- editor/
  |- filter/
    |- blackwhite/
    |- sepia/
    |- contrast/
|- text/
  |- bitmap/
  |- parser/
  |- renderer/
  |- svg/
```

What problem do you see here?

There is too much nesting. Too much information has been hidden from us. Every folder only has a few folders, and those only have a few too. The investment of return for opening them is quite small. To combat that, we can reduce the nesting of some of them and use a prefix instead.

```
src/
|- color-rgb/
|- color-hsl/
|- common/
|- crop/
|- image-editor/
|- image-filter/
  |- blackwhite/
  |- sepia/
  |- contrast/
|- text-bitmap/
|- text-parser/
|- text-renderer/
|- text-svg/
```
