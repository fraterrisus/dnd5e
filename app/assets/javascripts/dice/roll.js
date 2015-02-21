function roll_dice(sides) {
  var numdice = Number( $( '#numdice' ).val() );
  var advantage = $( '#dicebar input[name="adv"]:checked' ).val();
  var d1 = 0, d2 = 0, r1 = [], r2 = [];
  for (var i=0; i<numdice; i++) {
    var t1 = Math.ceil( Math.random() * sides );
    var t2 = Math.ceil( Math.random() * sides );
    r1[r1.length] = t1;
    r2[r2.length] = t2;
    d1 += t1;
    d2 += t2;
  }
  var s1 = '&nbsp;Result: ' + d1;
  var s2 = '&nbsp;Result: ' + d2;
  //r1.sortNumbers().reverse();
  //r2.sortNumbers().reverse();
  if (numdice > 1) {
    s1 += '&nbsp;&nbsp;(' + r1.join(",") + ')';
    s2 += '&nbsp;&nbsp;(' + r2.join(",") + ')';
  }
  s1 += '&nbsp;';
  s2 += '&nbsp;';
  if (advantage === "1") { 
    if (d2 > d1) {
      s = '<strike>' + s1 + '</strike>' + '<br/>' + s2;
    } else {
      s = s1 + '<br/>' + '<strike>' + s2 + '</strike>';
    }
  } else if (advantage === "-1") { 
    if (d2 < d1) {
      s = '<strike>' + s1 + '</strike>' + '<br/>' + s2;
    } else {
      s = s1 + '<br/>' + '<strike>' + s2 + '</strike>';
    }
  } else { s = s1; }
  $('#dicebar-result').html(s);
}

$( function () {
  $( '#roll-4' ).on( 'click', function () { roll_dice(4); } );
  $( '#roll-6' ).on( 'click', function () { roll_dice(6); } );
  $( '#roll-8' ).on( 'click', function () { roll_dice(8); } );
  $( '#roll-10' ).on( 'click', function () { roll_dice(10); } );
  $( '#roll-12' ).on( 'click', function () { roll_dice(12); } );
  $( '#roll-20' ).on( 'click', function () { roll_dice(20); } );

  $( '#numdice-minone' ).on( 'click', function () {
    var nd = Number( $( '#numdice' ).val() );
    nd = nd - 1;
    if (nd < 1) { nd = 1; }
    $( '#numdice' ).val(nd);
  } );
  $( '#numdice-plsone' ).on( 'click', function () {
    var nd = Number( $( '#numdice' ).val() );
    nd = nd + 1;
    $( '#numdice' ).val(nd);
  } );
});
