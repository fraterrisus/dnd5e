function translate_spell_school(id) {
  if (id === "0") {
    return 'Abjuration';
  } else if (id === "1") {
    return 'Conjuration';
  } else if (id === "2") {
    return 'Divination';
  } else if (id === "3") {
    return 'Enchantment';
  } else if (id === "4") {
    return 'Evocation';
  } else if (id === "5") {
    return 'Illusion';
  } else if (id === "6") {
    return 'Necromancy';
  } else if (id === "7") {
    return 'Transmutation';
  } 
}

function translate_spell_level(id) {
  if (id === "0") {
    return 'Cantrip';
  } else {
    return 'Level ' + id;
  }
}

function translate_spell_distance(n, unit) {
  if (unit === "0") {
    return 'Self';
  } else if (unit === "1") {
    return 'Touch';
  } else if (unit === "2") {
    return 'Sight';
  } else if (unit === "3") {
    return 'Same plane';
  } else if (unit === "4") {
    return 'Unlimited';
  } else if (unit === "10") {
    if (n === "1") {
      return '1 foot';
    } else {
      return n + ' feet';
    }
  } else if (unit === "11") {
    if (n === "1") {
      return '1 mile';
    } else {
      return n + ' miles';
    }
  }
}

function translate_time(n, unit) {
  var x = '';
  if (unit === "0") {
    x = 'special';
  } else if (unit === "1") {
    x = '1 action';
  } else if (unit === "2") {
    x = 'bonus action';
  } else if (unit === "3") {
    x = 'reaction';
  } else if (unit === "4") {
    x = 'instantaneous';
  } else if (unit === "5") {
    x = 'until dispelled';
  } else if (unit === "10") {
    x = n + ' round';
    if (n != 1) { x = x + 's'; }
  } else if (unit === "11") {
    x = n + ' minute';
    if (n != 1) { x = x + 's'; }
  } else if (unit === "12") {
    x = n + ' hour';
    if (n != 1) { x = x + 's'; }
  } else if (unit === "13") {
    x = n + ' day';
    if (n != 1) { x = x + 's'; }
  }
  return x;
}

function translate_spell_casting_time(n, unit, ritual) {
  var x = uppercase_string( translate_time( n, unit ) );
  if (ritual === "true") {
    x = x + ' (ritual)';
  }
  return x;
}

function translate_spell_duration(n, unit, conc) {
  var x = translate_time(n, unit);
  if (conc === "true") {
    x = 'concentration, up to ' + x;
  }

  return uppercase_string( x );
}

function uppercase_string(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
