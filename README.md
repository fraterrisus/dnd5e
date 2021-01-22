## dnd5e: utilities for running a D&D 5th edition game

I started this project as a way to organize the spell data in the D&D 5e Player's Handbook.
Naturally, the source material is under strict commercial license, which is why there's no
`db/seeds` file in this repository any more. If you put Markdown files in `public/spells` with a
downcased spell name (*Conjure Animals* becomes `public/spells/conjure_animals.md`) then the page
will display the full text when you click on the 'view' button.

You're welcome to use the code that is here under GPL v2; see LICENSE.

Current utilities:
* dice roller (can apply dis/advantage)
* spell list (with filtering and full text in Markdown)
* character list
* initiative tracker (with "rotate turn" button)

### Tech
* Ruby 2.7
* Rails 6.1 (with `redcarpet` for Markdown support)
* Bootstrap 5.0.0b1 (with `popper.js` 2.6)

### Installation
Install ruby 2.7 via the package manager of your choice; I use `rvm`.

`bundle install` to install ruby libraries.

`yarn install` to install javascript libraries.

`rake db:setup` should produce at least `db/development.sqlite3` which is probably all you need.

`rails server` should present a page at `http://localhost:3000`, although you won't have any spells
visible on the default page.

**Note** that there is no authentication anywhere, so you probably should not deploy this outside of
a private home network.
