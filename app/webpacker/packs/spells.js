import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function applySpellFilters() {
  const pageBody = document.getElementById('spells-results');
  pageBody.innerHTML = '<h3>Loading...</h3>';
  fetch('ajax/spells/index/' + Helpers.formToQuery('#narrow-select'))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      pageBody.innerHTML = ajaxResponseBody;
      pageBody.querySelectorAll('.fa-eye')
        .forEach(spellRow => {
          spellRow.addEventListener('click', spellIndexDetail)
        });
    })
    .catch(() => {
      pageBody.innerHTML = '<p>There was an error fetching spell data from the server.</p>';
    });
}

function spellIndexDetail(ev) {
  const $me = ev.currentTarget;
  const filename = $me.getAttribute('data-spell-file');

  fetch('/ajax/spells/detail?name=' + encodeURIComponent(filename))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      const modalBody = document.getElementById('detail-body');
      modalBody.innerHTML = ajaxResponseBody;
      const modalTitle = modalBody.querySelector('h1');
      const headerText = modalTitle.innerHTML;
      modalBody.removeChild(modalTitle);
      document.getElementById('detail-label').innerHTML = headerText;
      new Modal(document.getElementById('detail-modal')).show();
    })
    .catch(() => {
      document.getElementById('detail-label').innerHTML = 'Error';
      document.getElementById('detail-body').innerHTML =
        "<p>There was an error loading that spell's description file.</p>";
      new Modal(document.getElementById('detail-modal')).show();
    });
}

window.addEventListener('load', () => {
  $(document.getElementById('narrowing-ok')).on('click', applySpellFilters);

  applySpellFilters();
});
