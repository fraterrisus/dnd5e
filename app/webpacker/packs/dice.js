function roll_dice(sides) {
  let numdice = Number(document.querySelector('#numdice').value);
  let advantage = document.querySelector('#dicebar input[name="adv"]:checked').value;
  let d1 = 0, d2 = 0, r1 = [], r2 = [];
  for (let i = 0; i<numdice; i++) {
    let t1 = Math.ceil( Math.random() * sides );
    let t2 = Math.ceil( Math.random() * sides );
    r1[r1.length] = t1;
    r2[r2.length] = t2;
    d1 += t1;
    d2 += t2;
  }
  let result;
  let s1 = '&nbsp;Result: ' + d1;
  let s2 = '&nbsp;Result: ' + d2;
  if (numdice > 1) {
    s1 += '&nbsp;&nbsp;(' + r1.join(",") + ')';
    s2 += '&nbsp;&nbsp;(' + r2.join(",") + ')';
  }
  s1 += '&nbsp;';
  s2 += '&nbsp;';
  if (advantage === "1") {
    if (d2 > d1) {
      result = '<strike>' + s1 + '</strike>' + '<br/>' + s2;
    } else {
      result = s1 + '<br/>' + '<strike>' + s2 + '</strike>';
    }
  } else if (advantage === "-1") {
    if (d2 < d1) {
      result = '<strike>' + s1 + '</strike>' + '<br/>' + s2;
    } else {
      result = s1 + '<br/>' + '<strike>' + s2 + '</strike>';
    }
  } else { result = s1; }
  document.querySelector('#dicebar-result').innerHTML = result;
}

function increment_numdice(amount) {
  let numdice_box = document.querySelector('#numdice');
  let nd = Number(numdice_box.value);
  nd = nd + amount;
  if (nd < 1) { nd = 1; }
  numdice_box.value = nd.toString();
}

window.addEventListener('load', () => {
  document.querySelector('#roll-4').addEventListener('click',
      function () { roll_dice(4); } );
  document.querySelector('#roll-6').addEventListener('click',
      function () { roll_dice(6); } );
  document.querySelector('#roll-8').addEventListener('click',
      function () { roll_dice(8); } );
  document.querySelector('#roll-10').addEventListener('click',
      function () { roll_dice(10); } );
  document.querySelector('#roll-12').addEventListener('click',
      function () { roll_dice(12); } );
  document.querySelector('#roll-20').addEventListener('click',
      function () { roll_dice(20); } );
  document.querySelector('#numdice-minone').addEventListener('click',
      function () { increment_numdice(1); });
  document.querySelector( '#numdice-plsone').addEventListener( 'click',
      function () { increment_numdice(-1) });
});
