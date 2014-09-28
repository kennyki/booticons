BootIcons
============

A portal to search web icons (glyphicons and fontawesome) easily.

Vist http://kennyki.github.io/booticons/

Introduction
============
To find suitable glyphicons/fontawesome icons, I often need to guess-search icon name alternatives in their individual pages. That's quite tedious and I think I'm not alone. So I've created this simple portal by pulling YAML files of [glyphicons](https://raw.githubusercontent.com/twbs/bootstrap/master/docs/_data/glyphicons.yml) and [fontawesome](https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/src/icons.yml), process them and created my own index where there's keywords stored for each icon.

I've intended to build this as a front-end-only solution and find the chance to play with Backbone JS (as oppose to AngularJS - time to learn something new). Code's ugly and should be refactored in the future, but hey it's working and should start providing values!

Contribute
============
There are nearly 700 icons at the moment and it's going to take time to add/update keywords for each.

You can help by:

1. Fork and start editing the index file: `./web/icons.yaml`
1. Create a pull request

Upon merging I'll push the changes to gh-pages. Thanks!

**Have great ideas to improve this? Just do it or email me: knyki.12@gmail.com**