// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs";
//import Turbolinks from "turbolinks";
import * as ActiveStorage from "@rails/activestorage";
import "channels";

Rails.start()
//Turbolinks.start()
ActiveStorage.start()

import "bootstrap";

// https://medium.com/@coorasse/goodbye-sprockets-welcome-webpacker-3-0-ff877fb8fa79
// https://medium.com/@adrian_teh/ruby-on-rails-6-with-webpacker-and-bootstrap-step-by-step-guide-41b52ef4081f
// To build a new pack:
// 1. create app/webpacker/packs/model.rb
// 2. add <%= javascript_pack_tag 'model' %> to app/views/models.html.erb

// Files can be included one of three ways:
// 1. Add an import statement here
//   import "../src/javascript/attribute_translators.js";
// 2. Build a new pack by creating a file in app/webpacker/packs/foo.js
//    Then add the following incantation to the head of a view:
//   <% content_for :head do %>
//   <%= javascript_pack_tag 'foo' %>
//   <% end %>

Array.prototype.sortNumbers = function() {
    return this.sort( function (a,b) { return a-b; } );
}
