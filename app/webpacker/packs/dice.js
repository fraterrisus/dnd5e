function rollDice(sides) {
  const numDice = Number(document.getElementById('numdice').value);
  const advantage = document.querySelector('#dicebar-adv .form-check-input:checked').value;
  let d1 = 0, d2 = 0, r1 = [], r2 = [];
  for (let i = 0; i<numDice; i++) {
    const t1 = Math.ceil( Math.random() * sides );
    const t2 = Math.ceil( Math.random() * sides );
    r1[r1.length] = t1;
    r2[r2.length] = t2;
    d1 += t1;
    d2 += t2;
  }
  let result;
  let s1 = '&nbsp;Result: ' + d1;
  let s2 = '&nbsp;Result: ' + d2;
  if (numDice > 1) {
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
  document.getElementById('dicebar-result').innerHTML = result;
}

function incrementNumDice(amount) {
  const numdice_box = document.getElementById('numdice');
  let nd = Number(numdice_box.value);
  nd = nd + amount;
  if (nd < 1) { nd = 1; }
  numdice_box.value = nd.toString();
}

window.addEventListener('load', () => {
  $(document.getElementById('roll-4')).on('click', _ => { rollDice(4); } );
  $(document.getElementById('roll-6')).on('click', _ => { rollDice(6); } );
  $(document.getElementById('roll-8')).on('click', _ => { rollDice(8); } );
  $(document.getElementById('roll-10')).on('click', _ => { rollDice(10); } );
  $(document.getElementById('roll-12')).on('click', _ => { rollDice(12); } );
  $(document.getElementById('roll-20')).on('click', _ => { rollDice(20); } );
  $(document.getElementById('numdice-minone')).on('click', _ => { incrementNumDice(-1); });
  $(document.getElementById('numdice-plsone')).on('click', _ => { incrementNumDice(1) });
});
