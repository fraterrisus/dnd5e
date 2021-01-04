import {Modal} from "bootstrap";
import {Helpers} from "../src/javascript/ajax_helpers";

let lastUpdate = 0;
let csrfParam;
let csrfToken;

function runUpdate () {
  $( '.panel-body .btn' ).attr( 'disabled', true );

  $.getJSON( '/combatants/last_update.json', function (data) {
    let then = new Date(data.last_update * 1000);
    if ((data.last_update == 0) || (then > lastUpdate)) {
      fetchCombatantsList();
      lastUpdate = then;
    }
    $( '#initiative-control .btn' ).removeAttribute( 'disabled' );
    $( '#next-turn-btn' ).attr( 'disabled', ( $( '#initiative-list .list-group' ).children().length == 0 ) );
  } );
}

function fetchCombatantsList() {
  loadCombatantsViaHtml();
}

function loadCombatantsViaHtml() {
  const listBody = document.getElementById('initiative-list');
  fetch('/combatants.html')
    .then(Helpers.extractResponseBody)
    .then(ajaxBody => {
      listBody.innerHTML = ajaxBody;
      const listRows = listBody.querySelectorAll('.list-group-item');
      Array.prototype.filter.call(listRows, row => $(row).on('click', openEditModal));
    });
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
        c_item.on( 'click', openEditModal );
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

function updateCombatant(id, vals) {
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
      updateCombatant($('.init-id', $cur).text(), {active: false});
    }
    if ($nxt.length !== 0) {
      $nxt.addClass('active');
      updateCombatant($('.init-id', $nxt).text(), {active: true});
    }
  }
}

function openEditModal(ev) {
  const editModal = document.getElementById('editcomb-modal');
  new Modal(editModal).show();

  const editForm = editModal.querySelector('form');
  const target = ev.currentTarget;
  const combatantId = target.querySelector('.init-id').textContent;

  editForm.setAttribute('action', '/combatants/' + combatantId);
  editForm.querySelector('input[name="combatant[name]"]').value =
    target.querySelector('.init-name').textContent;
  editForm.querySelector('input[name="combatant[count]"]').value =
    target.querySelector('.init-count').textContent;
  editForm.querySelector('input[name="combatant[effect]"]').value =
    target.querySelector('.badge').textContent;
}

window.addEventListener('load', _ => {
  csrfParam = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
  csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  lastUpdate = 0;
  fetchCombatantsList();

  $( '#next-turn-btn' ).on( 'click', rotateTurn );

  $( '#clear-btn' ).on( 'click', function () {
    // FIXME: this should be a POST, it has effects
    fetch('/combatants/clear')
      .then(_ => fetchCombatantsList())
      .catch(_ => alert('Failed to reset the combatants list.'));
  } );

  // --------------------------------------------

  const editModal = document.getElementById('editcomb-modal');
  const editForm = editModal.querySelector('form');
  const editFormInputs = editModal.querySelectorAll('input.form-control');

  $(editModal).on('shown.bs.modal', _ => { editFormInputs[0].focus() });

  const editSubmitButton = document.getElementById('editcomb-ok');
  $(editSubmitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(editForm, fetchCombatantsList));

  const newModal = document.getElementById('newcomb-modal');
  const newForm = newModal.querySelector('form');
  const newFormInputs = newModal.querySelectorAll('input.form-control');

  $(newModal).on('show.bs.modal', _ => {
    Array.prototype.filter.call(newFormInputs, control => control.value = '') });

  $(newModal).on('shown.bs.modal', _ => { newFormInputs[0].focus() });

  const newSubmitButton = document.getElementById('newcomb-ok');
  $(newSubmitButton).on('click', _ =>
    Helpers.submitFormAndReloadPage(newForm, fetchCombatantsList));
});
