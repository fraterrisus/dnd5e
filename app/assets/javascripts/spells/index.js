$( function () {
  $( '#spell-narrow-fetch' ).on( 'click', function () {
    $( '#results' ).load( 'spells/ajax', $( '#narrow-select' ).serialize() );
  } );
});
