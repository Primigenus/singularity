# Singularity: Build your app using isomorphic components with Blaze

A really nice feature of both Web Components and React is the ability to see all
of your code for a certain component or chunk of code in the same place. I
worked on an IDE years ago where you could write HTML, CSS and Javascript
templates in the same file, and more recently a colleague of mine,
@sjoerd_visscher, contributed [a package for Vue.js][1] that enables the same
things there.

Separately, sometimes people complain that when writing Blaze, your code ends
up spread out all over the place and it's hard to get an overview of what code
is related to certain templates. So here's an approach that might make that a
bit easier.

The goal here was to imagine a way to represent a blaze template's HTML, CSS
and Javascript dependencies in one place without changing the existing API. I
really like that with Meteor, you can have a component that manages its own
database and connection to the server (if that's how you choose to model your
app). Obviously this example only works for simple cases like the one described
and I haven't thought about what happens in the context of a real app, so
curious to hear what everyone thinks.

- Singularity helps you structure your Meteor app by focusing your code around
  individual templates.
- Not only are HTML templates and client-side JS included in a single
  "singularity" template, but server-side JS related to the template, CSS, and
  database declarations are described here too.
- With the singularity-routing package, you can add `route="/"` to each
  singularity element to give that code its own URL!

  [1]: https://www.npmjs.com/package/vue-multi-loader
