$( function () {
  $( '#spell-narrow-fetch' ).on( 'click', function () {
    $( '#spells-results' ).load( 'ajax/spells/spell_index', $( '#narrow-select' ).serialize() );
  } ).trigger( 'click' );
});
