# tom.bio

This website is my personal website.

I use it primarily to:

- Write blog posts on tech, and ideas and thoughts I have that I'd like to document somewhere
- list my web freelancing services
- show my CV
- show some previous things I've built
- play host to some little interactive experiments I've built

## The tech stack

From back to front:

- The content is dynamic and stored in a headless CMS called DatoCMS. I use this CMS to change the navigation, posts, pages and any related images
- The client builds are hosted on Vercel
- I'm using Next.js as my front-end toolchain
- The front-end is built with React and TypeScript
- The styles are written in plain hand written SCSS

Most of these bullets have changed over time through rewrites but I'm pretty happy with where the architectural decisions are.

I did attempt to rewrite the website in Astro, but Astro had some dealbreaker bugs at the time, so that may well come later.

## Mobile responsiveness

One aim of this website is that everything is mobile responsive.

Not everything is perfect on mobile or desktop, but everything is easy to use on any device.

Some notable challenges for this aim:

- Pretty much all of the experiments section
- Getting the mobile nav to work with Next.js automatic static site generation
- The CV is responsive, which is actually useful as I can print it in either A4 or Letter size paper!

## Typography

The fonts used for the website is Manrope as sans-serif, Literata as serif and Fantasque Sans Mono as monospace.

Manrope and Literata are both variable fonts which reduces the net file size when using multiple weights.

My CV uses different fonts (Inter and Heuristica) as they look more appropriate for a CV.
