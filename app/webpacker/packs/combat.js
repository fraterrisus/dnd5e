import {Modal} from "bootstrap";
import {Helpers} from "../src/javascript/ajax_helpers";

let csrfParam;
let csrfToken;

function activateCombatant(nextCharId) {
  fetch('/combatants/' + nextCharId + '/activate', {
    headers: {"Content-Type": "application/json; charset=utf-8"},
    method: 'POST',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓',
      id: nextCharId,
    })
  }).catch(_ => alert('Unable to activate combatant.'));
}

function clearCombatantList() {
  fetch('/combatants/clear', {
    headers: {"Content-Type": "application/json; charset=utf-8"},
    method: 'POST',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓'
    })
  }).then(_ => fetchCombatantsList())
    .catch(_ => alert('Failed to reset the combatants list.'));
}

function fetchCombatantsList() {
  const spinner = document.getElementById('initiative-spinner');
  spinner.classList.remove('d-none');

  const pageButtons = document.querySelectorAll('.card-body .btn');
  Array.prototype.filter.call(pageButtons, button => button.setAttribute('disabled', true));

  const listBody = document.getElementById('initiative-list');

  fetch('/combatants.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      listBody.innerHTML = ajaxBody;
      const listRows = listBody.querySelectorAll('.list-group-item');
      Array.prototype.filter.call(listRows, row => $(row).on('click', openEditModal));
      Array.prototype.filter.call(pageButtons, button => button.removeAttribute('disabled'));
      spinner.classList.add('d-none');
    });
}

function openEditModal(ev) {
  const editModal = document.getElementById('editcomb-modal');
  new Modal(editModal).show();

  const editForm = editModal.querySelector('form');
  const target = ev.currentTarget;
  const combatantId = target.querySelector('.init-id').textContent;

  editForm.setAttribute('action', '/combatants/' + combatantId);
  editForm.querySelector('input[name="combatant[name]"]').value =
    target.querySelector('.init-name').textContent;
  editForm.querySelector('input[name="combatant[count]"]').value =
    target.querySelector('.init-count').textContent;
  editForm.querySelector('input[name="combatant[effect]"]').value =
    target.querySelector('.badge').textContent;
}

function rotateTurn() {
  const charList = document.getElementById('initiative-list');
  const activeChar = charList.querySelector('.list-group-item.active');
  let nextChar;
  if (activeChar !== undefined && activeChar !== null) {
    activeChar.classList.remove('active');
    nextChar = activeChar.nextElementSibling;
  }
  if (nextChar === undefined || nextChar === null) {
    nextChar = charList.querySelectorAll('.list-group-item')[0]
  }
  if (nextChar !== undefined && nextChar !== null) {
    const nextCharId = nextChar.querySelector('.init-id').textContent;
    activateCombatant(nextCharId);
    nextChar.classList.add('active');
  }
}

window.addEventListener('load', _ => {
  csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  fetchCombatantsList();

  const nextTurnButton = document.getElementById('next-turn-btn');
  $(nextTurnButton).on('click', rotateTurn);

  const clearButton = document.getElementById('clear-btn');
  $(clearButton).on('click', clearCombatantList);

  const editModal = document.getElementById('editcomb-modal');
  const editForm = editModal.querySelector('form');
  const editFormInputs = editForm.querySelectorAll('input.form-control');

  $(editModal).on('shown.bs.modal', _ => { editFormInputs[0].focus() });

  const editSubmitButton = document.getElementById('editcomb-ok');
  $(editSubmitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(editForm, fetchCombatantsList));

  const newModal = document.getElementById('newcomb-modal');
  const newForm = newModal.querySelector('form');
  const newFormInputs = newForm.querySelectorAll('input.form-control');

  $(newModal).on('show.bs.modal', _ => {
    Array.prototype.filter.call(newFormInputs, control => control.value = '') });

  $(newModal).on('shown.bs.modal', _ => { newFormInputs[0].focus() });

  const newSubmitButton = document.getElementById('newcomb-ok');
  $(newSubmitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(newForm, fetchCombatantsList));
});
