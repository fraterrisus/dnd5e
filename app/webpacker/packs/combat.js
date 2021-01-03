import "bootstrap";
import {Helpers} from "../src/javascript/ajax_helpers";

let lastUpdate = 0;
let csrfParam;
let csrfToken;

function runUpdate () {
  $( '.panel-body .btn' ).attr( 'disabled', true );

  $.getJSON( '/combatants/last_update.json', function (data) {
    let then = new Date(data.last_update * 1000);
    if ((data.last_update == 0) || (then > lastUpdate)) {
      loadCombatants();
      lastUpdate = then;
    }
    $( '#initiative-control .btn' ).removeAttribute( 'disabled' );
    $( '#next-turn-btn' ).attr( 'disabled', ( $( '#initiative-list .list-group' ).children().length == 0 ) );
  } );
}

function loadCombatants() {
  loadCombatantsViaHtml();
}

function loadCombatantsViaHtml() {
  const listBody = document.getElementById('initiative-list');
  fetch('/combatants.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => listBody.innerHTML = ajaxBody);
}

function loadCombatantsViaJson() {
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
  fetch('/combatants/' + id, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'PATCH',
    body: JSON.stringify({
      [csrfParam]: csrfToken,
      utf8: '✓',
      id: id,
      combatant: vals
    })
  }).catch(_ => alert('Unable to load combatants list'));
}

/*
  $.ajax({
    url: '/combatants/' + id,
    method: 'POST',
    data: {
      '_method': 'PATCH',
      'utf8': '✓',
      [csrfParam]: csrfToken,
      'id': id,
      'combatant': vals
    }
  });
*/

function rotateTurn () {
  let $list = $( '#initiative-list' );
  let $cur = $( '.list-group-item.active', $list );
  let $nxt;
  if ($cur.length === 0) {
    $nxt = $( '.list-group-item', $list ).eq(0);
  } else {
    $nxt = $cur.next();
    if ($nxt.length === 0) {
      $nxt = $( '.list-group-item', $list ).eq(0);
    }
  }
  if ($cur[0] !== $nxt[0]) {
    // FIXME: these two calls overlap each other, and sqlite isn't threaded so the second
    //  transaction fails.
    if ($cur.length !== 0) {
      $cur.removeClass('active');
      update_combatant($('.init-id', $cur).text(), {active: false});
    }
    if ($nxt.length !== 0) {
      $nxt.addClass('active');
      update_combatant($('.init-id', $nxt).text(), {active: true});
    }
  }
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
  csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  lastUpdate = 0;
  runUpdate();

  $( '#next-turn-btn' ).on( 'click', rotateTurn );

  $( '#clear-btn' ).on( 'click', function () {
    // FIXME: this should be a POST, it has effects
    fetch('/combatants/clear')
      .then(_ => runUpdate())
      .catch(_ => alert('Failed to reset the combatants list.'));
  } );

  // --------------------------------------------

  let $editcomb_form = $( '#editcomb-form' );
  let $editcomb_inputs = $( 'input.form-control', $editcomb_form );

  $( '#editcomb-modal' ).on( 'shown.bs.modal', function () {
    //$editcomb_form.bootstrapValidator( 'validate' );
    $editcomb_inputs.eq(0).focus();
  } );

  $editcomb_form.on( 'submit', function (ev) {
    ev.preventDefault();
    Helpers.submit_form_via_ajax($editcomb_form,
      function () {
        $('#editcomb-modal').modal('hide');
        runUpdate();
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
} );
