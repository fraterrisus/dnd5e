import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function deleteCharacter(ev) {
  const char_id = getMyCharacterId(ev);
  const csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  fetch('/characters/' + char_id, {
    headers: {"Content-Type": "application/json; charset=utf-8"},
    method: 'DELETE',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓'
    })
  }).then(fetchCharacterList)
    .catch(_ => alert('Failed to delete the requested character.'));
}

function fetchCharacterList() {
  fetch('/ajax/characters/index.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      document.getElementById('char-results').innerHTML = ajaxBody;
      Array.prototype.filter.call(document.getElementsByClassName('edit-button'),
        editButton => $(editButton).on('click', openEditCharacterForm));
      Array.prototype.filter.call(document.getElementsByClassName('delete-button'),
        deleteButton => $(deleteButton).on('click', deleteCharacter));
    });
}

function getMyCharacterId(ev) {
  const me = ev.currentTarget;
  const this_row = me.parentNode.parentNode;
  return this_row.getAttribute('data-char-id');
}

function openEditCharacterForm(ev) {
  const char_id = getMyCharacterId(ev);
  fetch('/characters/' + char_id + '/edit')
    .then(Helpers.extractResponseBody)
    .then(prepareCharacterForm);
}

function openNewCharacterForm() {
  fetch('/characters/new')
    .then(Helpers.extractResponseBody)
    .then(prepareCharacterForm);
}

function prepareCharacterForm(ajaxBody) {
  const charModal = document.getElementById('char-modal');
  charModal.innerHTML = ajaxBody;

  const charForm = document.getElementById('char-form');
  const submitButton = document.getElementById('char-modal-ok');
  $(submitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(charForm, fetchCharacterList));

  const formInputs = charForm.querySelectorAll('input.form-control');
  $(charModal).on('shown.bs.modal', _ => { formInputs[0].focus() });

  new Modal(charModal).show();
}

window.addEventListener('load', _ => {
  fetchCharacterList();

  const newButton = document.getElementById('new-char-btn')
  $(newButton).on('click', openNewCharacterForm);
});
