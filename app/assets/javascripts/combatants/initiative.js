var lastupdate = 0;
var autoupdate;
var auth_token;

function start_auto_update () {
  autoupdate = setInterval( run_auto_update, 5000 );
}

function stop_auto_update () {
  clearInterval(autoupdate);
}

function run_auto_update () {
  // Skip this update if the autoupdate button is off
  // or if any modal dialog is currently visible
  if ( ( ! $( '#autoupdate' ).prop( 'checked' ) )
      || ( "false" === $( '#newcomb-modal' ).attr( 'aria-hidden' ) ) )
    return;

  $( '.panel-body .btn' ).attr( 'disabled', 'disabled' );

  $.getJSON( '/combatants/last_update.json', function (data) {
    var then = new Date(data.last_update * 1000);
    if (then > lastupdate) {
      load_combatants();
      lastupdate = then;
    }
    $( '.panel-body .btn' ).removeAttr( 'disabled' );
  } );
}

function load_combatants () {
  $.getJSON( '/combatants', function (data) {
    data = data.sort( function (a,b) { return b.count - a.count; } );
    var c_group = $( '<div class="list-group">' );
    for (var i=0; i<data.length; i++) {
      var c_item = $( '<div class="list-group-item">' );
      if ( data[i].active ) { c_item.addClass( 'active' ); }
      var c_id = $( '<span class="init-id">' ).text( data[i].id ).hide();
      var c_count = $( '<span class="init-count">' ).text( data[i].count );
      var c_name = $( '<span class="init-name">' ).text( data[i].name );
      var eff = '';
      if (data[i].effect !== null) { eff = data[i].effect; }
      var c_badge = $( '<span class="badge">' ).text( eff );
      c_item.append( c_id, c_count, c_name, c_badge );
      c_group.append( c_item );
    }
    var $par = $( '#initiative-list' );
    $( '.list-group', $par ).empty().remove();
    $par.append( c_group );
  } );
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
    },
    async: false
  });
}

function next_turn () {
  var $list = $( '#initiative-list' );
  var $cur = $( '.list-group-item.active', $list );
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

$( function () {
  auth_token = $('form input[name="authenticity_token"]').val();

  lastupdate = new Date();
  load_combatants();

  $( '#nextturn' ).on( 'click', next_turn );

  $( '#autoupdate' ).on( 'change', function (ev) {
    if ( $( ev.currentTarget ).prop( 'checked' ) ) {
      start_auto_update();
    } else {
      stop_auto_update();
    }
  });

  start_auto_update();
} );
