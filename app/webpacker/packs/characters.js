import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function openCharacterEditForm(ev) {
  const editModal = document.getElementById('editchar-modal')
  new Modal(editModal).show();

  const editForm = editModal.querySelector('form');
  const me = ev.currentTarget;
  const this_row = me.parentNode.parentNode;
  const these_data = Helpers.getChildrenOfElement(this_row, 'TD');

  const char_id = this_row.getAttribute('data-char-id');
  editForm.setAttribute('action', '/characters/' + char_id);

  const fields = [ "name", "str", "dex", "con", "int", "wis", "chr",
    "perception", "initiative", "speed", "ac" ];
  for (let i = 0; i < fields.length; i++) {
    const objName = 'input[name="character[' + fields[i] + ']"]';
    editForm.querySelector(objName).value = these_data[i+1].innerText;
  }

  const notesRow = this_row.nextElementSibling;
  const notesData = Helpers.getChildrenOfElement(notesRow, 'TD');
  const notesFormField = editForm.querySelector('input[name="character[notes]"]');
  if (notesRow.getAttribute('data-notes-id') === char_id) {
    notesFormField.value = notesData[0].innerText;
  } else {
    notesFormField.value = '';
  }

  const isHighlighted = this_row.getAttribute('data-char-highlight') === 'true';
  const highlightFormField = editForm.querySelector('input[name="character[highlight]"]');

  highlightFormField.setAttribute('checked', String(isHighlighted));
  //$( 'input[name="character[highlight]"]', $(editForm) )
  //  .prop( 'checked', ( this_row.getAttribute('data-char-highlight') === "true" ) );
}

function fetchCharacterList() {
  fetch('/ajax/characters/index.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      document.getElementById('char-results').innerHTML = ajaxBody;
      Array.prototype.filter.call(document.getElementsByClassName('edit-button'),
        editButton => $(editButton).on('click', openCharacterEditForm));
    });
}

window.addEventListener('load', _ => {
  fetchCharacterList();

  const editModal = document.getElementById('editchar-modal');
  const editForm = editModal.querySelector('form');
  const editFormInputs = editForm.querySelectorAll('input.form-control');

  $(editModal).on('shown.bs.modal', _ => { editFormInputs[0].focus() });

  $('button#editchar-ok').on('click', ev => {
    fetch(editForm.getAttribute('action'), {
      method: editForm.getAttribute('method'),
      body: new FormData(editForm)
    }).then(response => {
      fetchCharacterList();
      if (!response.ok) {
        // Replace this with a Toast?
        alert("Error: Unable to submit form");
      }
    });
  });

  const newModal = document.getElementById('newchar-modal');
  const newForm = newModal.querySelector('form');
  const newFormInputs = newForm.querySelectorAll('input.form-control');

  $(newModal).on('show.bs.modal', _ => {
    Array.prototype.filter.call(newFormInputs, control => control.value = '') });

  $(newModal).on('shown.bs.modal', _ => { newFormInputs[0].focus() });

  $('button#newchar-ok').on('click', ev => {
    fetch(newForm.getAttribute('action'), {
      method: newForm.getAttribute('method'),
      body: new FormData(newForm)
    }).then(response => {
      fetchCharacterList();
      if (!response.ok) {
        // Replace this with a Toast?
        alert("Error: Unable to submit form");
      }
    });
  });
});
