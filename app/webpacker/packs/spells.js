import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function applySpellFilters() {
  const pageBody = document.getElementById('spells-results');
  pageBody.innerHTML = '<h3>Loading...</h3>';
  fetch('ajax/spells/index/' + Helpers.formToQuery('#narrow-select'))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      pageBody.innerHTML = ajaxResponseBody;
      pageBody.querySelectorAll('.fa-eye').forEach(spellRow => {
        spellRow.addEventListener('click', spellIndexDetail)});
      pageBody.querySelectorAll('.fa-edit').forEach(spellRow => {
        spellRow.addEventListener('click', openEditModal)});
    })
    .catch(() => {
      pageBody.innerHTML = '<p>There was an error fetching spell data from the server.</p>';
    });
}

function openEditModal(ev) {
  const spellId = ev.currentTarget.getAttribute('data-spell-id');

  fetch('/spells/' + encodeURIComponent(spellId))
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const modal = document.getElementById('editspell-modal');
      modal.innerHTML = ajaxBody;
      new Modal(modal).show();

      // TODO: disable _n textfields if the dropdown isn't a numerated value ('Feet', etc.)

      const form = document.getElementById('editspell-form');
      const submitButton = document.getElementById('editspell-ok');
      $(submitButton).on('click', _ =>
        Helpers.submitFormAndReloadPage(form, applySpellFilters));
    })
    .catch(() => {
      alert('There was an error editing that spell.');
    })
}

function spellIndexDetail(ev) {
  const filename = ev.currentTarget.getAttribute('data-spell-file');

  fetch('/ajax/spells/detail?name=' + encodeURIComponent(filename))
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const modalBody = document.getElementById('detail-body');
      modalBody.innerHTML = ajaxBody;
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
  applySpellFilters();

  $(document.getElementById('narrowing-ok')).on('click', applySpellFilters);
});
