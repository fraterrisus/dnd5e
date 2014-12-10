$( function () {
  $( '#casterclass-edit-results' ).load( '/ajax/spells/caster_edit/' + $( '#caster_class_id' ).val() + '.html' )
});
