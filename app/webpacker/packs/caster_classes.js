import {Helpers} from "../src/javascript/ajax_helpers";

function onload_index() {
  const newClassDialog = document.getElementById('newclass-modal');
  const formInputs = newClassDialog.querySelectorAll('form input.form-control');

  // While jQuery is loaded, BS4 uses jQuery's events model, so this doesn't work...
  // newClassDialog.addEventListener('show.bs.modal', _ => {

  $(newClassDialog).on('show.bs.modal', _ => {
    formInputs.forEach(element => element.value = '');
  })
  $(newClassDialog).on('shown.bs.modal', _ => {
    formInputs[0].focus();
  });

  /* Add validation code here;
     See https://getbootstrap.com/docs/4.5/components/forms/#validation
     And https://getbootstrap.com/docs/5.0/forms/validation/ */

  fetch('/ajax/classes/index.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => { document.querySelector('#cclass-results').innerHTML = ajaxBody });
}

function onload_edit() {
  const button = document.querySelector('#casterclass-edit-results');
  const casterClassId = document.querySelector('#caster_class_id').value;
  fetch('/ajax/spells/caster_edit/' + casterClassId + '.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => { button.innerHTML = ajaxBody });
}

window.addEventListener('load', () => {
  if (document.querySelector('#cclass-results')) { onload_index() }
  if (document.querySelector('form#edit-caster-class')) { onload_edit() }
});

/*
  $newclass_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'fas fas-check-circle',
      invalid: 'fas fas-minus-circle',
      validating: 'fas fas-sync',
    },
    fields: {
      'caster_classs[name]': {
        message: 'Not valid',
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      }
    }
  }).on( 'success.form.bv', function (ev) {
    ev.preventDefault();
    submit_form_via_ajax( $newclass_form,
      function () {
        $( '#newclass-modal' ).modal( 'hide' );
        $( '#cclass-results' ).load( '/ajax/classes/index.html');
      },
      function () {
        alert( "Error: Couldn't submit form" );
      }
    );
  });
*/
