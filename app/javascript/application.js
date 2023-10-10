// Entry point for the build script in your package.json

import Rails from "@rails/ujs";

Rails.start()

import "bootstrap"
//import * as bootstrap from "bootstrap"

// There seems to be some sort of bug with Bootstrap 4 and JQuery 3.5 that prevents the toggle
// handler from *hiding* something. The only reported solutions include "oh, hey, I forgot to
// actually include all the Bootstrap JS files" :unimpressed:

function toggleButtonHandler(ev) {
  const thisButton = ev.currentTarget;
  const targetElement = document.getElementById(thisButton.getAttribute('aria-controls'));
  const isExpanded = thisButton.getAttribute('aria-expanded');
  if (isExpanded === 'true') {
    targetElement.classList.add('collapse');
    thisButton.setAttribute('aria-expanded', 'false');
    thisButton.classList.remove('btn-primary');
  } else {
    targetElement.classList.remove('collapse');
    thisButton.setAttribute('aria-expanded', 'true');
    thisButton.classList.add('btn-primary');
  }
}

window.addEventListener('load', () => {
  document.getElementById('dice-toggler').addEventListener('click', toggleButtonHandler);
});
