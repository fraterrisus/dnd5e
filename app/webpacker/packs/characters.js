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
        editButton => editButton.addEventListener('click', openEditCharacterForm));
      Array.prototype.filter.call(document.getElementsByClassName('delete-button'),
        deleteButton => deleteButton.addEventListener('click', openDeleteCharacterDialog));
    });
}

function getMyCharacterId(ev) {
  const me = ev.currentTarget;
  const this_row = me.parentNode.parentNode;
  return this_row.getAttribute('data-char-id');
}

function openDeleteCharacterDialog(ev) {
  const charId = getMyCharacterId(ev);
  fetch('/characters/' + encodeURIComponent(charId) + '/confirm/delete')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const deleteModal = document.getElementById('char-delete-modal');
      deleteModal.innerHTML = ajaxBody;

      const myForm = document.getElementById('delete-char-form');
      const submitButton = document.getElementById('delete-char-ok');
      submitButton.addEventListener('click', _ =>
        Helpers.submitFormAndReloadPage(myForm, fetchCharacterList));

      new Modal(deleteModal).show();
    });
}

function openEditCharacterForm(ev) {
  const charId = getMyCharacterId(ev);
  fetch('/characters/' + encodeURIComponent(charId) + '/edit')
    .then(Helpers.extractResponseBody)
    .then(prepareCharacterForm);
}

function openNewCharacterForm() {
  fetch('/characters/new')
    .then(Helpers.extractResponseBody)
    .then(prepareCharacterForm);
}

function prepareCharacterForm(ajaxBody) {
  const myModal = document.getElementById('char-modal');
  myModal.innerHTML = ajaxBody;

  const myForm = document.getElementById('char-form');
  const submitButton = document.getElementById('char-modal-ok');
  submitButton.addEventListener('click', _ =>
    Helpers.submitFormAndReloadPage(myForm, fetchCharacterList));

  const formInputs = myForm.querySelectorAll('input.form-control');
  myModal.addEventListener('shown.bs.modal', _ => { formInputs[0].focus() });

  new Modal(myModal).show();
}

window.addEventListener('load', _ => {
  fetchCharacterList();

  document.getElementById('new-char-btn').addEventListener('click', openNewCharacterForm);
});
