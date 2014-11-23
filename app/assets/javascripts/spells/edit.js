function disable_dependent_textfield (ev) {
  $target = $( ev.target );
  $dep = $( $target.attr( 'data-dependent-textfield' ) );
  v = $target.val();
  $dep.attr( 'disabled', (v < 10));
}

function spells_edit_disable_reaction_textfield (ev) {
  $target = $( ev.target );
  $dep = $( '#spell_reaction' );
  v = $target.val();
  $dep.attr( 'disabled', (v != 3)); // TimeUnit::Reaction
}

function disable_dependent_checkbox (ev) {
  $target = $( ev.target );
  $dep = $( $target.attr( 'data-dependent-checkbox' ) );
  $par = $dep.parent();
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
  var post_data = { }, form_data = { };
  var k, v;
  $fields.each( function (i) {
    k = $(this).attr( 'data-dynamic-attribute' );
    v = $(this).val();
    form_data[k] = v;
  } );
  // Emulating a form submit as much as possible here, including by ripping out
  // hidden field data and including it with the POST...
  post_data = {
    'authenticity_token': $( 'input[name="authenticity_token"]', $par ).val(),
    'utf8': $( 'input[name="utf8"]', $par ).val(),
    '_method': $( 'input[name="_method"]', $par ).val()
  };
  post_data[obj] = form_data;
  $.ajax({
    method: 'post',
    url: $par.attr( 'action' ) + '.json',
    data: post_data,
    success: function ( return_data ) {
      $fields.each( function (i) {
        k = $(this).attr( 'data-dynamic-attribute' );
        $( '[data-static-attribute=' + k + ']', $par ).text( return_data[k] ).trigger( 'change' );
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

function update_dependent_textfield ( ev ) {
  var $me = $( ev.currentTarget );
  var attribute = $me.attr( 'data-static-attribute' );
  var $target = $( '[data-translate-attribute=' + attribute + ']', $me.parent() );
  var method = window[ $target.attr( 'data-translate-method' ) ];
  $target.text( method( $me.text() ) );
}

$( function () {
  $( '#spell_cast_unit' ).on( 'change', spells_edit_disable_reaction_textfield );

  var $selects = $( 'select[data-dependent-textfield]' );
  $selects.on( 'change', disable_dependent_textfield );
  $selects.trigger( 'change' );

  var $depchecks = $( 'input[data-dependent-checkbox]' );
  $depchecks.on( 'change', disable_dependent_checkbox );
  $depchecks.trigger( 'change' );

  var $translates = $( '[data-translate-attribute]' );
  $translates.each( function (idx) {
    var attribute = $( this ).attr( 'data-translate-attribute' );
    var $target = $( '[data-static-attribute=' + attribute + ']', $(this).parent() );
    $target.on( 'change', update_dependent_textfield );
    $target.trigger( 'change' );
  });

  $( '.edit-confirm' ).hide();
  $( '.form-control-static', 'form[data-dynamic-object]' ).on( 'click', switch_to_edit_mode );
  $( '.edit-ok' ).on( 'click', edit_mode_save );
  $( '.edit-nope' ).on( 'click', edit_mode_revert );
});

