function spell_index_detail (ev) {
  var $me = $( ev.currentTarget );
  var filename = $me.attr( 'data-spell-file' );
  console.debug( filename );
  $.ajax({
    url: '/ajax/spells/detail',
    method: 'GET',
    data: { name: filename },
    success: function (data) {
      $( '#detail-body' ).html( data );
      $h1 = $( '#detail-body' ).find( 'h1' );
      header = $h1.text();
      $h1.detach();
      $( '#detail-label' ).text( header );
      $( '#detail-modal' ).modal( 'show' );
    },
    error: function () {
      $( '#detail-label' ).text( 'Error' );
      $( '#detail-body' ).html( "<p>There was an error loading that spell's description file.</p>" );
      $( '#detail-modal' ).modal( 'show' );
    }
  });
}

$( function () {
  $( '#narrowing-ok' ).on( 'click', function () {
    var $res = $( '#spells-results' );
    $res.empty();
    $res.html( '<h3>Loading...</h3>' );
    $.ajax({
      url: 'ajax/spells/index',
      method: 'GET',
      data: $( '#narrow-select' ).serialize(),
      success: function (data) {
        $res.html( data );
        $( '.glyphicon-eye-open', $res ).on( 'click', spell_index_detail );
      }
    });
  } ).trigger( 'click' );
});
