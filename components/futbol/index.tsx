import {bundleMDX} from 'mdx-bundler'

const result = await bundleMDX(`
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

import History from './history'

Here's a **neat** demo:

<History />
`)

export const { code, frontmatter } = result
