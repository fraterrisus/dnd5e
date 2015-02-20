$( function () {
  var $newchar_form = $( '#newchar-modal form' );
  var $newchar_inputs = $( 'input.form-control', $newchar_form );

  $( '#newchar-modal' ).on( 'show.bs.modal', function () {
    $newchar_inputs.val( '' );
  } );
  $( '#newchar-modal' ).on( 'shown.bs.modal', function () {
    $newchar_form.bootstrapValidator( 'resetForm' );
    $newchar_inputs.eq(0).focus();
  } );

  $newchar_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh',
    },
    fields: {
      'chars[name]': {
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
    submit_form_via_ajax( $newchar_form,
      function () {
        $( '#newchar-modal' ).modal( 'hide' );
        $( '#char-results' ).load( '/ajax/characters/index.html');
      },
      function () { 
        alert( "Error: Couldn't submit form" ); 
      }
    );
  });

  $( '#char-results' ).load( '/ajax/characters/index.html');
});
