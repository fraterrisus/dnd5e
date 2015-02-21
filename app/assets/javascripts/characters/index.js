function characters_open_edit_form(ev) {
  var $modal = $( '#editchar-modal' ).modal( 'show' );
  var $form = $( 'form', $modal );
  var $me = $( ev.currentTarget );
  var $this_row = $me.parents( 'tr' );
  var char_id = $this_row.attr( 'data-char-id' );
  var $these_data = $this_row.children( 'td' );
  $form.attr( 'action', '/characters/' + char_id );
  var fields = [ "name", "str", "dex", "con", "int", "wis", "chr", 
      "perception", "initiative", "speed", "ac" ];
  for (var i = 0; i < fields.length; i++) {
    objname = 'input[name="character[' + fields[i] + ']"]';
    $( objname, $form ).val( $these_data.eq(i+1).text() );
  }
  var $notes_row = $this_row.next();
  if ( $notes_row.attr( 'data-notes-id' ) == char_id ) {
    $( 'input[name="character[notes]"]', $form ).val( $notes_row.find( 'td' ).eq(0).text() );
  }
  $( 'input[name="character[highlight]"]', $form ).prop( 'checked', ( $this_row.attr( 'data-char-highlight' ) == "true" ) );
}

function characters_fetch() {
  $.ajax({
    url: '/ajax/characters/index.html',
    method: 'GET',
    success: function(data) {
      $( '#char-results' ).html( data );
      $( '.glyphicon-pencil', '#character-table' ).on( 'click', characters_open_edit_form );
    }
  })
}

$( function () {
  character_auth_token = $( 'form input[name="authenticity_token"]', '#editchar-form' ).val();
  if ( $('#char-results').length > 0 ) { characters_fetch(); }

  // --------------------------------------------
  
  var $editchar_form = $( '#editchar-form' );
  var $editchar_inputs = $( 'input.form-control', $editchar_form );

  $( '#editchar-modal' ).on( 'shown.bs.modal', function () {
    $editchar_form.bootstrapValidator( 'validate' );
    $editchar_inputs.eq(0).focus();
  } );
  
  $editchar_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh',
    },
    fields: {
      'character[name]': {
        message: 'Not valid',
        validators: {
          notEmpty: { message: 'Required' }
        }
      }
    }
  }).on( 'success.form.bv', function (ev) {
    ev.preventDefault();
    $( '#editchar-ok' ).removeAttr( 'disabled' );
  });

  $editchar_form.on( 'submit', function (ev) {
    submit_form_via_ajax( $editchar_form,
      function () { 
        characters_fetch();
        $( '#editchar-modal' ).modal( 'hide' ); 
      },
      function () { 
        alert( "Error: Couldn't submit form" ); 
      }
    );
  });

  // --------------------------------------------
  
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

});
