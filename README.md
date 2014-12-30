Blox UI
======

HTML, CSS, and JavaScript components for building modern, browser-based user interfaces.

## Using Blox UI

Blox UI (blox) is pretty specific to the applications we are building here at Impact Marketing Specialists. However,
that doesn't mean you can't leverage what we've done with your own projects. There are two ways to leverage bloxui.

### Out of the B[l]ox

If you dig our theme(s?) and the way we are maturing our toolkit for applications, feel free to skip down to the [Getting Started](#Getting Started)
section and start using what we've built. This is how we use it internally.

### Hard Core Forking Action

You may not be into our style, choices of libraries, etc. But maybe you've been looking for something like this for your own projects.
Feel free to use blox as guide; it's all bower, npm, grunt goodness. If you're looking for deeper customizations yet, like custom jquery builds,
amd definitions and the like; they will be coming soon.

## Reasoning

Blox UI is about leveraging some common JS and CSS libraries that experienced developers are likely to have
some level of exposure to, extending/modifying attributes or features of those libraries and throwing in our own
batch of common components for building consistent web applications.

This is a common issue for many teams, who simply elect to include hosted versions of jQuery, jQueryUI, YUI and/or Bootstrap.
In some cases teams will go and use the online tools to customize a given library, download the package and include it with their
project sources. Some teams will even be as advanced as to fully customize and brand a library for their purposes.

This can often lead to various versions of libraries being used in various distict projects that are deployed together. "Ouch. Which
version does x project use? Did it get all the nice Bootstrap tweaks we made? No? Oh let's copy that over."

### Single Build

We'd like to provide all of our common libraries as a nicely bundled package; all at their specific version number - so there's never
any confusion which version of which libraries are being bundled.

### Customizations and Extensions

We like [Attribute Modules](https://amcss.github.io/). We also like Bootstrap. Blox is where we merge those worlds together. In addition,
we also bring over the glyph icons (in an AMCSS friendly way) and pile on new components of our own. Some of our extra components will have
further dependencies (table sorting, etc.) and we may bring jQuery UI and Bootstrap together.

Blox UI is our playground for integrating and introducing additions to our JS/CSS toolset. Versions are likely to match API changes from
dependent libraries. In the future, even lighter, more custom builds of libraries may be generated as well as proper source maps.

### Simple Versioning and Packaging

Versioning is critical. Teams may work on various projects and it is critical that each project can be safely upgraded to a newer version
of blox. Likely this may mean some API changes that break backwards compatibility or net new components. It is unsafe to wholesale publish
a new version of blox that all projects are linked against.

Projects should include and be built against a particular release of blox. As newer versions of blox are released, projects can safely be
upgraded and individually tested for API compatibility.

## Getting Started

To include blox in your project use one of the following options:

- Clone the repo: `git clone https://github.com/impactmarketingspecialists/bloxui.git`.
- Install with [Bower](http://bower.io): `bower install bloxui`.
- Install with [npm](https://www.npmjs.org): `npm install bloxui`. (not yet)

## Versioning

Blox UI is maintained under [the Semantic Versioning guidelines](http://semver.org/).

## Copyright and license

Code and documentation copyright 2011-2014 Impact Marketing Specialists, Inc. Code released under [the MIT license](https://github.com/impactmarketingspecialists/bloxui/blob/master/LICENSE). Docs released under [Creative Commons](https://github.com/impactmarketingspecialists/bloxui/blob/master/docs/LICENSE).