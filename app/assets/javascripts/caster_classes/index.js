$( function () {
  var $newclass_form = $( '#newclass-modal form' );
  var $newclass_inputs = $( 'input.form-control', $newclass_form );

  $( '#newclass-modal' ).on( 'show.bs.modal', function () {
    $newclass_inputs.val( '' );
  } );
  $( '#newclass-modal' ).on( 'shown.bs.modal', function () {
    $newclass_form.bootstrapValidator( 'resetForm' );
    $newclass_inputs.eq(0).focus();
  } );

  $newclass_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh',
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
        $( '#cclass-results' ).load( '/ajax/classes/class_index.html');
      },
      function () { 
        alert( "Error: Couldn't submit form" ); 
      }
    );
  });

  $( '#cclass-results' ).load( '/ajax/classes/class_index.html');
});
