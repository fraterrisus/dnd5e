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

function disableButtons() {
  document.getElementById('page-spinner').classList.remove('d-none');

  for (let button of document.querySelectorAll('.card-header .btn'))
    button.setAttribute('disabled', 'true');
  for (let viewButton of document.getElementsByClassName('view-button')) {
    viewButton.classList.remove('text-primary');
    viewButton.classList.add('text-muted');
  }
  for (let editButton of document.getElementsByClassName('edit-button')) {
    editButton.classList.remove('text-primary');
    editButton.classList.add('text-muted');
  }
}

function enableButtons() {
  document.getElementById('page-spinner').classList.add('d-none');

  for (let button of document.querySelectorAll('.card-header .btn'))
    button.removeAttribute('disabled');
  for (let viewButton of document.getElementsByClassName('view-button')) {
    viewButton.classList.remove('text-muted');
    viewButton.classList.add('text-primary');
  }
  for (let editButton of document.getElementsByClassName('edit-button')) {
    editButton.classList.remove('text-muted');
    editButton.classList.add('text-primary');
  }
}

function fetchResults() {
  disableButtons();

  fetch('spells/list.html' + Helpers.formToQuery('#filter-form'))
    .then(Helpers.extractResponseBody)
    .then(ajaxResponseBody => {
      const oldFiltersElement = document.querySelector('#active-filters')
      if (oldFiltersElement) { oldFiltersElement.remove(); }
      const oldCountElement = document.querySelector('#results-count')
      if (oldCountElement) { oldCountElement.remove(); }

      document.querySelector('.results').innerHTML = ajaxResponseBody;

      const parent = document.getElementById('spells-card');
      const newFiltersElement = parent.querySelector('#active-filters');
      newFiltersElement.remove();
      const newCountElement = parent.querySelector('#results-count');
      newCountElement.remove();
      parent.querySelector('.card-header').appendChild(newFiltersElement);
      parent.querySelector('.card-header').appendChild(newCountElement);

      for (let viewButton of document.getElementsByClassName('view-button'))
        viewButton.addEventListener('click', openViewModal);
      for (let editButton of document.getElementsByClassName('edit-button'))
        editButton.addEventListener('click', openEditModal);

      enableButtons();
    })
    .catch(_ => {
      Toasts.showToastWithText('Server Error', 'Unable to fetch spell list.', 'danger');
      enableButtons();
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
  disableButtons();

  const spellId = ev.currentTarget.getAttribute('data-spell-id');
  fetch('/spells/' + encodeURIComponent(spellId) + '/edit')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const modal = document.getElementById('editspell-modal');
      modal.innerHTML = ajaxBody;
      new Modal(modal).show();
      applyEditModalEventHandlers();
      enableButtons();
    })
    .catch(() => {
      Toasts.showToastWithText('Server Error', 'Unable to edit that spell.', 'warning');
      enableButtons();
    })
}

function openViewModal(ev) {
  disableButtons();

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
      enableButtons();
    })
    .catch(() => {
      Toasts.showToastWithText('Server Error', "Unable to view that spell's description.", 'warning');
      enableButtons();
    })
}

window.addEventListener('load', () => {
  fetchResults();

  document.getElementById('filter-button').addEventListener('click', _ => {
    const modal = document.getElementById('filter-modal');
    new Modal(modal).show();
  });

  const submitButton = document.getElementById('filter-modal-ok');
  submitButton.addEventListener('click', fetchResults);
});
