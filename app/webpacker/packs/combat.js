import {Modal} from "bootstrap";
import {Helpers} from "../src/javascript/ajax_helpers";

let charactersToImport = [];
let csrfParam;
let csrfToken;

// -------------------------------

function hideSpinner() {
  const spinner = document.getElementById('initiative-spinner');
  spinner.classList.add('d-none');
}

function showSpinner() {
  const spinner = document.getElementById('initiative-spinner');
  spinner.classList.remove('d-none');
}

function disableButtons() {
  const pageButtons = document.querySelectorAll('.card-body .btn');
  Array.prototype.filter.call(pageButtons, button => button.setAttribute('disabled', true));
}

function enableButtons() {
  const pageButtons = document.querySelectorAll('.card-body .btn');
  Array.prototype.filter.call(pageButtons, button => button.removeAttribute('disabled'));
}

// -------------------------------

function activateCombatant(nextCombId) {
  showSpinner();
  disableButtons();

  fetch('/combatants/' + nextCombId + '/activate', {
    headers: {"Content-Type": "application/json; charset=utf-8"},
    method: 'POST',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓',
      id: nextCombId,
    })
  }).then(_ => { hideSpinner(); enableButtons(); })
    .catch(_ => alert('Unable to activate combatant.'));
}

function clearCombatantList() {
  showSpinner();
  disableButtons();

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

function createNextCombatant() {
  const data = charactersToImport.pop();
  if (data) {
    fetch('/combatants', {
      headers: {"Content-Type": "application/json; charset=utf-8"},
      method: 'POST',
      body: JSON.stringify({
        [csrfParam]: csrfToken,
        utf8: '✓',
        combatant: data
      })
    }).then(createNextCombatant)
      .catch(_ => alert('Failed to reset the combatants list.'));
  } else {
    fetchCombatantsList();
  }
}

function deleteCombatant(ev) {
  showSpinner();
  disableButtons();

  const combId = getMyCombatantId(ev);
  fetch('/combatants/' + combId , {
    headers: {"Content-Type": "application/json; charset=utf-8"},
    method: 'DELETE',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓',
      id: combId,
    })
  }).then(fetchCombatantsList)
    .catch(_ => alert('Unable to delete combatant.'));
}

function fetchCombatantsList() {
  showSpinner();
  disableButtons();

  const listBody = document.getElementById('initiative-list');

  fetch('/combatants.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      listBody.innerHTML = ajaxBody;

      const editButtons = document.querySelectorAll('.edit-btn');
      Array.prototype.filter.call(editButtons, btn => $(btn).on('click', openEditCombatantForm));

      const deleteButtons = document.querySelectorAll('.delete-btn');
      Array.prototype.filter.call(deleteButtons, btn => $(btn).on('click', deleteCombatant));

      hideSpinner();
      enableButtons();
    });
}

function getMyCombatantId(ev) {
  const me = ev.currentTarget;
  return Helpers.getChildrenOfElement(me.parentNode, 'span')[0].textContent;
}

function importCharacters() {
  showSpinner();
  disableButtons();

  fetch('/characters.json')
    .then(Helpers.extractResponseJson)
    .then(characters => {
      Array.prototype.filter.call(characters, character => {
        charactersToImport.push({name: character.name, time: 0, active: 0})
      });
      createNextCombatant();
    });
}

function openEditCombatantForm(ev) {
  const comb_id = getMyCombatantId(ev);
  fetch('/combatants/' + comb_id + '/edit')
    .then(Helpers.extractResponseBody)
    .then(prepareCombatantForm);
}

function openNewCombatantForm() {
  fetch('/combatants/new')
    .then(Helpers.extractResponseBody)
    .then(prepareCombatantForm);
}

function prepareCombatantForm(ajaxBody) {
  const myModal = document.getElementById('comb-modal');
  myModal.innerHTML = ajaxBody;

  const myForm = document.getElementById('comb-form');
  const submitButton = document.getElementById('comb-modal-ok');
  $(submitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(myForm, fetchCombatantsList));

  const formInputs = myForm.querySelectorAll('input.form-control');
  $(myModal).on('shown.bs.modal', _ => { formInputs[0].focus() });

  new Modal(myModal).show();
}

function rotateTurn() {
  const combList = document.getElementById('initiative-list');
  const activeComb = combList.querySelector('.list-group-item.list-group-item-info');
  let nextComb;
  if (activeComb !== undefined && activeComb !== null) {
    activeComb.classList.remove('list-group-item-info');
    nextComb = activeComb.nextElementSibling;
  }
  if (nextComb === undefined || nextComb === null) {
    nextComb = combList.querySelectorAll('.list-group-item')[0]
  }
  if (nextComb !== undefined && nextComb !== null) {
    const nextCombId = nextComb.querySelector('.init-id').textContent;
    activateCombatant(nextCombId);
    nextComb.classList.add('list-group-item-info');
  }
}

window.addEventListener('load', _ => {
  csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  const newButton = document.getElementById('new-btn');
  $(newButton).on('click', openNewCombatantForm);

  const nextTurnButton = document.getElementById('next-turn-btn');
  $(nextTurnButton).on('click', rotateTurn);

  const clearButton = document.getElementById('clear-btn');
  $(clearButton).on('click', clearCombatantList);

  const importButton = document.getElementById('import-btn');
  $(importButton).on('click', importCharacters);

  fetchCombatantsList();
});
