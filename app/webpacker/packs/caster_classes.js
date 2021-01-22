import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";
import {Toasts} from "../src/javascript/toasts";

function disableButtons() {
  document.getElementById('page-spinner').classList.remove('d-none');

  for (let button of document.querySelectorAll('.card-header .btn')) {
    button.setAttribute('disabled', 'true');
  }
  for (let editButton of document.getElementsByClassName('edit-button')) {
    editButton.classList.remove('text-primary');
    editButton.classList.add('text-muted');
  }
  for (let deleteButton of document.getElementsByClassName('delete-button')) {
    deleteButton.classList.remove('text-primary');
    deleteButton.classList.add('text-muted');
  }
}

function enableButtons() {
  document.getElementById('page-spinner').classList.add('d-none');

  for (let button of document.querySelectorAll('.card-header .btn')) {
    button.removeAttribute('disabled');
  }
  for (let editButton of document.getElementsByClassName('edit-button')) {
    editButton.classList.remove('text-muted');
    editButton.classList.add('text-primary');
  }
  for (let deleteButton of document.getElementsByClassName('delete-button')) {
    deleteButton.classList.remove('text-muted');
    deleteButton.classList.add('text-primary');
  }
}

function fetchResults() {
  disableButtons();
  fetch('/classes/list.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      document.querySelector('.results').innerHTML = ajaxBody;
      for (let editButton of document.getElementsByClassName('edit-button'))
        editButton.addEventListener('click', openEditModal);
      for (let deleteButton of document.getElementsByClassName('delete-button'))
        deleteButton.addEventListener('click', openDeleteModal);
      enableButtons();
    })
    .catch(_ => {
      Toasts.showToastWithText('Server Error', 'Unable to fetch class list.', 'danger');
      enableButtons();
    });
}

function getMyObjectId(ev) {
  return ev.currentTarget.parentNode.getAttribute('data-object-id');
}

function openDeleteModal(ev) {
  const objectId = getMyObjectId(ev);
  fetch('/classes/' + encodeURIComponent(objectId) + '/confirm/delete')
    .then(Helpers.extractResponseBody)
    .then(prepareDeleteForm)
    .catch(_ => Toasts.showToastWithText('Server Error', 'Unable to open form.', 'danger'));
}

function openEditModal(ev) {
  const objectId = getMyObjectId(ev);
  fetch('/classes/' + encodeURIComponent(objectId) + '/edit')
    .then(Helpers.extractResponseBody)
    .then(prepareEditForm)
    .catch(_ => Toasts.showToastWithText('Server Error', 'Unable to open form.', 'danger'));
}

function openNewModal() {
  fetch('/classes/new')
    .then(Helpers.extractResponseBody)
    .then(prepareEditForm)
    .catch(_ => Toasts.showToastWithText('Server Error', 'Unable to open form.', 'danger'));
}

function prepareDeleteForm(ajaxBody) {
  const myModal = document.getElementById('object-delete-modal');
  myModal.innerHTML = ajaxBody;

  const myForm = document.getElementById('delete-object-form');
  const submitButton = document.getElementById('delete-object-ok');
  submitButton.addEventListener('click', _ =>
    Helpers.submitFormAndReloadPage(myForm, fetchResults));

  new Modal(myModal).show();
}

function prepareEditForm(ajaxBody) {
  const myModal = document.getElementById('object-modal');
  myModal.innerHTML = ajaxBody;

  const myForm = document.getElementById('object-form');
  const submitButton = document.getElementById('object-modal-ok');
  submitButton.addEventListener('click', _ =>
    Helpers.submitFormAndReloadPage(myForm, fetchResults));

  const formInputs = myForm.querySelectorAll('input.form-control');
  myModal.addEventListener('shown.bs.modal', _ => { formInputs[0].focus() });

  new Modal(myModal).show();
}

window.addEventListener('load', _ => {
  fetchResults();
  document.querySelector('.new-button').addEventListener('click', openNewModal);
});
