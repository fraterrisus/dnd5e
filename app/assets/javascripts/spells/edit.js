function disable_dependent_textfield (ev) {
  var $target = $( ev.target );
  var $dep = $( '#' + $target.attr( 'data-dependent-textfield' ) );
  var v = $target.val();
  $dep.attr( 'disabled', (v < 10));
}

function spells_edit_disable_reaction_textfield (ev) {
  var $target = $( ev.target );
  var $dep = $( '#spell_reaction' );
  var v = $target.val();
  $dep.attr( 'disabled', (v != 3)); // TimeUnit::Reaction
}

function disable_dependent_checkbox (ev) {
  var $target = $( ev.target );
  var $dep = $( '#' + $target.attr( 'data-dependent-checkbox' ) );
  var $par = $dep.parent();
  if ($target.prop( 'checked' )) {
    $dep.attr( 'disabled', false );
    $par.removeClass( 'disabled' );
  } else {
    $dep.prop( 'checked', false );
    $dep.attr( 'disabled', true );
    $par.addClass( 'disabled' );
  }
}

function edit_mode_save (ev) {
  var $me = $( ev.currentTarget ) ;
  var $par = $me.parents( 'form' );
  var obj = $par.attr( 'data-dynamic-object' );
  $( '.edit-confirm', $par ).addClass( 'disabled' );
  var $fields = $( '[data-dynamic-attribute]', $par );
  post_data = $par.serializeArray();
  $.ajax({
    method: 'post',
    url: $par.attr( 'action' ) + '.json',
    data: post_data,
    success: function ( return_data ) {
      $fields.each( function (i) {
        k = $(this).attr( 'data-dynamic-attribute' );
        $( '[data-static-attribute=' + k + ']', $par ).text( return_data[k] ).trigger( 'poke' );
      } );
      switch_to_view_mode(ev);
    },
    error: function () { edit_mode_revert(ev); }
  })
}

function edit_mode_revert (ev) {
  var $me = $( ev.currentTarget ) ;
  var $par = $me.parents( 'form' );
  var $fields = $( '[data-dynamic-attribute]', $par );
  $fields.each( function (i) {
    k = $(this).attr( 'data-dynamic-attribute' );
    v = $( '[data-static-attribute=' + k + ']', $par ).text();
    $(this).val( v );
  } );
  //$par[0].reset();
  switch_to_view_mode(ev);
}

function switch_to_view_mode (ev) {
  $me = $( ev.currentTarget );
  $par = $me.parents( 'form' );
  $data = $( '.form-control-static', $par );
  $edit = $( '.edit-fields', $par );
  $conf = $( '.edit-confirm', $par );
  $edit.hide();
  $data.fadeIn();
  $conf.fadeOut();
  $conf.removeClass( 'disabled' );
}

function switch_to_edit_mode (ev) {
  $me = $( ev.currentTarget );
  $par = $me.parents( 'form' );
  $data = $( '.form-control-static', $par );
  $edit = $( '.edit-fields', $par );
  $conf = $( '.edit-confirm', $par );
  $data.hide();
  $edit.fadeIn();
  $conf.fadeIn();
  $edit.find( 'input[type=text]' ).focus();
}

function update_dependent_field ( ev ) {
  var $me = $( ev.currentTarget );
  //var attribute = $me.attr( 'data-static-attribute' );
  console.log('poked static field sibling');
  var $target = $( '[data-translate-attribute]', $me.parent() );
  $target.trigger( 'poke' );
}

function update_from_dependent_fields ( ev ) {
  var $me = $( ev.currentTarget );
  var $par = $me.parent();
  var attributes = $me.attr( 'data-translate-attribute' );
  console.log('updating dependent field for ' + attributes);
  attributes = attributes.split( ' ' );
  var parameters = [];
  for (var i=0; i<attributes.length; i++) {
    var $target = $( '[data-static-attribute=' + attributes[i] + ']', $par );
    parameters[i] = $target.text();
  }
  var method = window[ $me.attr( 'data-translate-method' ) ];
  $me.text( method.apply( $me, parameters ) );
}

$( function () {
  $( '#spell_cast_unit' ).on( 'change', spells_edit_disable_reaction_textfield );

  var $selects = $( 'select[data-dependent-textfield]' );
  $selects.on( 'change', disable_dependent_textfield );
  $selects.trigger( 'change' );

  var $depchecks = $( 'input[data-dependent-checkbox]' );
  $depchecks.on( 'change', disable_dependent_checkbox );
  $depchecks.trigger( 'change' );

  // When poked, read values from dependent fields and update
  var $dynfields = $( '[data-translate-attribute]' );
  $dynfields.on( 'poke', update_from_dependent_fields );
  $dynfields.trigger( 'poke' );
  
  // When poked, poke your dependent field
  var $statfields = $( '[data-static-attribute]' );
  $statfields.on( 'poke', update_dependent_field );

  $( '.edit-confirm' ).hide();
  $( '.form-control-static', 'form[data-dynamic-object]' ).on( 'click', switch_to_edit_mode );
  $( '.edit-ok' ).on( 'click', edit_mode_save );
  $( '.edit-nope' ).on( 'click', edit_mode_revert );
});

