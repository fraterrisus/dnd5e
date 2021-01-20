import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";
import {Toasts} from "../src/javascript/toasts";

function applyEditModalEventHandlers() {
  const editForm = document.getElementById('editspell-form');
  const submitButton = document.getElementById('editspell-ok');

  submitButton.addEventListener('click', _ =>
    Helpers.submitFormAndReloadPage(editForm, fetchResults));

  // If the unit ID is less than 10, it doesn't have a count, so disable that text box.
  ['edit_spell_cast_unit', 'edit_spell_range_unit', 'edit_spell_duration_unit'].forEach(id => {
    const element = document.getElementById(id);
    element.addEventListener('change', disableTextField);
    element.dispatchEvent(new Event('change'));
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

function fetchResults() {
  Helpers.disableUI();
  const pageBody = document.getElementById('spells-results');
  pageBody.innerHTML = '<h3>Loading...</h3>';
  fetch('spells/list.html' + Helpers.formToQuery('#narrow-select'))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      pageBody.innerHTML = ajaxResponseBody;
/*
      for (let editButton of document.getElementsByClassName('edit-button'))
        editButton.addEventListener('click', openEditModal);
      for (let deleteButton of document.getElementsByClassName('delete-button'))
        deleteButton.addEventListener('click', openDeleteModal);
*/
      pageBody.querySelectorAll('.view-btn').forEach(spellRow => {
        spellRow.addEventListener('click', spellIndexDetail)});
      pageBody.querySelectorAll('.edit-btn').forEach(spellRow => {
        spellRow.addEventListener('click', openEditModal)});
      Helpers.enableUI();
    })
    .catch(_ => {
      Toasts.showToastWithText('Server Error', 'Unable to fetch spell list.', 'danger');
      Helpers.enableUI();
    });
}

function disableTextField(ev) {
  const selectElement = ev.currentTarget;
  const textFieldElementId = selectElement.getAttribute('id').replace('unit', 'n');
  const textFieldElement = document.getElementById(textFieldElementId);
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
  fetchResults();
  document.getElementById('narrowing-ok').addEventListener('click', fetchResults);
});
