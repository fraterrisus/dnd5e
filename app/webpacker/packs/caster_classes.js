import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";
import {AbstractMethods} from "../src/javascript/abstract_methods";

function fetchResults() {
  fetch('/classes/list.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      document.querySelector('.results').innerHTML = ajaxBody;
      Array.prototype.filter.call(document.getElementsByClassName('edit-button'),
        editButton => editButton.addEventListener('click', openEditModal));
      Array.prototype.filter.call(document.getElementsByClassName('delete-button'),
        deleteButton => deleteButton.addEventListener('click', openDeleteModal));
    })
}

function getMyObjectId(ev) {
  return ev.currentTarget.parentNode.getAttribute('data-object-id');
}

function openDeleteModal(ev) {
  const objectId = getMyObjectId(ev);
  fetch('/classes/' + encodeURIComponent(objectId) + '/confirm/delete')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      const deleteModal = document.getElementById('object-delete-modal');
      deleteModal.innerHTML = ajaxBody;

      const myForm = document.getElementById('delete-object-form');
      const submitButton = document.getElementById('delete-object-ok');
      submitButton.addEventListener('click', _ =>
        Helpers.submitFormAndReloadPage(myForm, fetchResults));

      new Modal(deleteModal).show();
    });
}

function openEditModal(ev) {
  const objectId = getMyObjectId(ev);
  fetch('/classes/' + encodeURIComponent(objectId) + '/edit')
    .then(Helpers.extractResponseBody)
    .then(prepareEditForm);
}

function openNewModal() {
  fetch('/classes/new')
    .then(Helpers.extractResponseBody)
    .then(prepareEditForm);
}

const prepareEditForm = AbstractMethods.prepareEditForm(fetchResults);

window.addEventListener('load', () => {
  fetchResults();
  document.querySelector('.new-button').addEventListener('click', openNewModal);
});
