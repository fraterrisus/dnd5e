import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function applyEditModalEventHandlers() {
  const editForm = document.getElementById('editspell-form');
  const submitButton = document.getElementById('editspell-ok');

  submitButton.addEventListener('click', _ =>
    Helpers.submitFormAndReloadPage(editForm, applySpellFilters));

  // If the unit ID is less than 10, it doesn't have a count, so disable that text box.
  ['edit_spell_cast_unit', 'edit_spell_range_unit', 'edit_spell_duration_unit'].forEach(id => {
    const element = document.getElementById(id);
    element.addEventListener('change', disableTextField);
    element.change();
  })

  // If FOCUS is true, MATERIAL must also be true.
  const focusCheckBox = document.getElementById('edit_spell_focus');
  const materialCheckBox = document.getElementById('edit_spell_material');
  focusCheckBox.addEventListener('change', _ => {
    if (focusCheckBox.checked) { materialCheckBox.checked = true; }
  });
  materialCheckBox.addEventListener('change', _ => {
    if (focusCheckBox.checked) { materialCheckBox.checked = true; }
  })
}

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

function disableTextField(ev) {
  const selectElement = ev.currentTarget;
  const textFieldElement = selectElement.previousElementSibling;
  const val = Number(selectElement.value);
  if (val >= 10) {
    textFieldElement.removeAttribute('disabled');
  } else {
    textFieldElement.setAttribute('disabled', '');
  }
}

function openEditModal(ev) {
  const spellId = ev.currentTarget.getAttribute('data-spell-id');

  fetch('/spells/' + encodeURIComponent(spellId) + '/edit')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const modal = document.getElementById('editspell-modal');
      modal.innerHTML = ajaxBody;
      new Modal(modal).show();
      applyEditModalEventHandlers();
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

  document.getElementById('narrowing-ok').addEventListener('click', applySpellFilters);
});
