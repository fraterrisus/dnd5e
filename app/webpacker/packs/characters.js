import {Helpers} from "../src/javascript/ajax_helpers";
import {Modal} from "bootstrap";

function getChildrenOfElement(element, type) {
  const children = element.childNodes;
  let selected = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i].nodeName === type) {
      selected.push(children[i]);
    }
  }
  return selected;
}

function characters_open_edit_form(ev) {
  const editModal = document.getElementById('editchar-modal')
  new Modal(editModal).show();

  const editForm = editModal.querySelector('form');
  const me = ev.currentTarget;
  const this_row = me.parentNode.parentNode;
  const these_data = getChildrenOfElement(this_row, 'TD');

  const char_id = this_row.getAttribute('data-char-id');
  editForm.setAttribute('action', '/characters/' + char_id);

  const fields = [ "name", "str", "dex", "con", "int", "wis", "chr",
    "perception", "initiative", "speed", "ac" ];
  for (let i = 0; i < fields.length; i++) {
    const objName = 'input[name="character[' + fields[i] + ']"]';
    editForm.querySelector(objName).value = these_data[i+1].innerText;
  }

  const notesRow = this_row.nextElementSibling;
  const notesData = getChildrenOfElement(notesRow, 'TD');
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

function characters_fetch() {
  fetch('/ajax/characters/index.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      document.getElementById('char-results').innerHTML = ajaxBody;
      Array.prototype.filter.call(document.getElementsByClassName('edit-button'),
        editButton => $(editButton).on('click', characters_open_edit_form));
    });
}

window.addEventListener('load', _ => {
  // let character_auth_token = $( 'form input[name="authenticity_token"]', '#editchar-form' ).val();
  characters_fetch();

  const editModal = document.getElementById('editchar-modal');
  const editForm = editModal.querySelector('form');
  const editFormInputs = editForm.querySelectorAll('input.form-control');

  $(editModal).on('shown.bs.modal', _ => { editFormInputs[0].focus() });

  $('button#editchar-ok').on('click', ev => {
    fetch(editForm.getAttribute('action'), {
      method: editForm.getAttribute('method'),
      body: new FormData(editForm)
    }).then(response => {
      characters_fetch();
      if (!response.ok) {
        // Replace this with a Toast?
        alert("Error: Unable to submit form");
      }
    });
  });

  // --------------------------------------------

  let $newchar_form = $( '#newchar-modal form' );
  let $newchar_inputs = $( 'input.form-control', $newchar_form );

  $( '#newchar-modal' ).on( 'show.bs.modal', function () {
    $newchar_inputs.val( '' );
  } );
  $( '#newchar-modal' ).on( 'shown.bs.modal', function () {
    // $newchar_form.bootstrapValidator( 'resetForm' );
    $newchar_inputs.eq(0).focus();
  } );

});
