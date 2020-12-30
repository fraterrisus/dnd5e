import "bootstrap";
import {Helpers} from "../src/javascript/ajax_helpers";

let lastupdate = 0;
let autoupdate;
let auth_token;

function start_auto_update () {
  // autoupdate = setInterval( run_auto_update, 5000 );
}

function stop_auto_update () {
  // clearInterval(autoupdate);
}

function run_auto_update () {
  // Skip this update if the autoupdate button is off
  // or if any modal dialog is currently visible
  if ( ( $( '#autoupdate' ).prop( 'checked' ) )
      && ( "true" === $( '#editcomb-modal' ).attr( 'aria-hidden' ) )
      && ( "true" === $( '#newcomb-modal' ).attr( 'aria-hidden' ) ) )
    run_update();
}

function run_update () {
  $( '.panel-body .btn' ).attr( 'disabled', true );

  $.getJSON( '/combatants/last_update.json', function (data) {
    let then = new Date(data.last_update * 1000);
    if ((data.last_update == 0) || (then > lastupdate)) {
      load_combatants();
      lastupdate = then;
    }
    $( '.panel-body .btn' ).removeAttr( 'disabled' );
    $( '#nextturn' ).attr( 'disabled', ( $( '#initiative-list .list-group' ).children().length == 0 ) );
  } );
}

function load_combatants () {
  $.ajax({
    url: '/combatants',
    method: 'GET',
    success: function (data) {
      data = data.sort( function (a,b) { return b.count - a.count; } );
      let c_group = $( '<div class="list-group">' );
      for (let i=0; i<data.length; i++) {
        let c_item = $( '<div class="list-group-item">' );
        if ( data[i].active ) { c_item.addClass( 'active' ); }
        c_item.on( 'click', open_edit_form );
        let c_id = $( '<span class="init-id">' ).text( data[i].id ).hide();
        let c_count = $( '<span class="init-count">' ).text( data[i].count );
        let c_name = $( '<span class="init-name">' ).text( data[i].name );
        let eff = '';
        if ( data[i].effect !== null ) { eff = data[i].effect; }
        let c_badge = $( '<span class="badge">' ).text( eff );
        c_item.append( c_id, c_count, c_name, c_badge );
        c_group.append( c_item );
      }
      let $par = $( '#initiative-list' );
      $( '.list-group', $par ).empty().remove();
      $par.append( c_group );
    }
  });
}

function update_combatant(id, vals) {
  $.ajax({
    url: '/combatants/' + id,
    method: 'POST',
    data: {
      '_method': 'PATCH',
      'utf8': '✓',
      'authenticity_token': auth_token,
      'id': id,
      'combatant': vals
    }
  });
}

function next_turn () {
  let $list = $( '#initiative-list' );
  let $cur = $( '.list-group-item.active', $list );
  if ($cur.length === 0) {
    $nxt = $( '.list-group-item', $list ).eq(0);
  } else {
    $nxt = $cur.next();
    if ($nxt.length === 0) {
      $nxt = $( '.list-group-item', $list ).eq(0);
    }
  }
  stop_auto_update();
  if ($cur.length !== 0) {
    $cur.removeClass('active');
    update_combatant( $( '.init-id', $cur ).text(), { active: false } );
  }
  if ($nxt.length !== 0) {
    $nxt.addClass('active');
    update_combatant( $( '.init-id', $nxt ).text(), { active: true } );
  }
  start_auto_update();
}

function open_edit_form ( ev ) {
  let $modal = $( '#editcomb-modal' ).modal( 'show' );
  let $form = $( 'form', $modal );
  let $me = $( ev.currentTarget );
  $form.attr( 'action', '/combatants/' + $( '.init-id', $me ).text() );
  $( 'input[name="combatant[name]"]', $form ).val( $( '.init-name', $me ).text() );
  $( 'input[name="combatant[count]"]', $form ).val( $( '.init-count', $me ).text() );
  $( 'input[name="combatant[effect]"]', $form ).val( $( '.badge', $me ).text() );
}

$( function () {
  auth_token = $('form input[name="authenticity_token"]').val();

  lastupdate = 0;
  run_update();

  $( '#nextturn' ).on( 'click', next_turn );

  $( '#clear-btn' ).on( 'click', function () {
    $.get( '/combatants/clear' );
    run_update();
  } );

  $( '#autoupdate' ).on( 'change', function (ev) {
    if ( $( ev.currentTarget ).prop( 'checked' ) ) {
      start_auto_update();
    } else {
      stop_auto_update();
    }
  });

  start_auto_update();

  // --------------------------------------------

  let $editcomb_form = $( '#editcomb-form' );
  let $editcomb_inputs = $( 'input.form-control', $editcomb_form );

  $( '#editcomb-modal' ).on( 'shown.bs.modal', function () {
    //$editcomb_form.bootstrapValidator( 'validate' );
    $editcomb_inputs.eq(0).focus();
  } );

/*
  $editcomb_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'fas fas-check-circle',
      invalid: 'fas fas-minus-circle',
      validating: 'fas fas-sync',
    },
    fields: {
      'combatant[name]': {
        message: 'Not valid',
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      'combatant[count]': {
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
    $( '#editcomb-ok' ).removeAttr( 'disabled' );
  });
*/

  $editcomb_form.on( 'submit', function (ev) {
    ev.preventDefault();
    Helpers.submit_form_via_ajax($editcomb_form,
      function () {
        $('#editcomb-modal').modal('hide');
        run_update();
      },
      function () {
        alert("Error: Couldn't submit form");
      }
    );
  });

  // --------------------------------------------

  let $newcomb_form = $( '#newcomb-form' );
  let $newcomb_inputs = $( 'input.form-control', $newcomb_form );

  $( '#newcomb-modal' ).on( 'show.bs.modal', function () {
    $newcomb_inputs.val( '' );
  } );
  $( '#newcomb-modal' ).on( 'shown.bs.modal', function () {
    // $newcomb_form.bootstrapValidator( 'resetForm' );
    $newcomb_inputs.eq(0).focus();
  } );

/*
  $newcomb_form.bootstrapValidator({
    feedbackIcons: {
      valid: 'fas fas-check-circle',
      invalid: 'fas fas-minus-circle',
      validating: 'fas fas-sync',
    },
    fields: {
      'combatant[name]': {
        message: 'Not valid',
        validators: {
          notEmpty: {
            message: 'Required'
          }
        }
      },
      'combatant[count]': {
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
    $( '#newcomb-ok' ).removeAttr( 'disabled' );
  });
*/

/*
  $newcomb_form.on( 'submit', function (ev) {
    ev.preventDefault();
    Helpers.submit_form_via_ajax($newcomb_form,
      function () {
        $('#newcomb-modal')
        run_update();
      },
      function () {
        alert( "Error: Couldn't submit form" );
      }
    );
  });
*/
} );
