$( function () {
  $( '#narrowing-ok' ).on( 'click', function () {
    var res = $( '#spells-results' );
    res.empty();
    res.html( '<h3>Loading...</h3>' );
    res.load( 'ajax/spells/spell_index', $( '#narrow-select' ).serialize() );
  } ).trigger( 'click' );
});
