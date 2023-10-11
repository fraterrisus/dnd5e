## dnd5e: utilities for running a D&D 5th edition game

I started this project as a way to organize the spell data in the D&D 5e Player's Handbook.
The source material is mostly under commercial license, although things like spell names and 
descriptions are available under the Open Game License (OGL); see SPELLS, below.

You're welcome to use the code that is here under GPL v2; see LICENSE.

Current utilities:
* dice roller
  * multiple dice
  * apply advantage / disadvantage
* spell list
  * filter on any attribute
  * full spell text in Markdown or HTML
* character list
  * freeform notes
  * highlight individual characters
* initiative tracker
  * add combatants or import from the characters list
  * assign initative count, auto-sort, tracks whose turn it is
* caster class list
  * create, edit
  * assign spells to classes

### Tech
* Ruby 3.1
* Rails 7.1 (with `redcarpet` for Markdown support)
* Bootstrap 5.3.2 (with `popper.js` 2.6)
* FontAwesome 6.4.2

### Installation
**Note** that there is no authentication anywhere, so you probably should not deploy this outside of
a private home network.

Install ruby 3.1 via the package manager of your choice; I use `rvm`.

`bundle install` to install ruby libraries.

`rake javascript:build css:build` to install node libraries and compile assets.

`rake db:setup` should produce at least `db/development.sqlite3` which is probably all you need.

At this point, `rails server` should present a page at `http://localhost:3000`, although you won't
have any spells visible on the default page.

### Spells
Technical details first: the Spells page will look for data in `public/spells` to display when you
click on the eye icon, and if it finds it, will pop a dialog so you can read the spell description.
You can put either HTML or Markdown files in that directory with a downcased spell name (*Conjure
Animals* becomes `public/spells/conjure_animals.md` or `.html`).

Now, where do you get those spell descriptions, you ask? Well, I'm not distributing WOTC's 
intellectual property as part of this codebase. However, you can find that data distributed under
the terms of the OGL on [the 5THSRD website](https://5thsrd.org), and I've written a script that
should download the HTML spell descriptions and load `/public/spells` with the results. I believe
this is in compliance with the license (see [the SRD license terms](https://5thsrd.org/license/)).

If everything [still] works, you should be able to just run `bin/download-spells.rb` and watch it
populate `public/spells` with a bunch of HTML files.

Unfortunately, I haven't added the ability to Add Spells to the database, so you'll have to do that
by hand for now. It's on the [TODO list](https://github.com/fraterrisus/dnd5e/issues), I swear.
