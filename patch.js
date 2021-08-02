function patch(o, diff, fuzz = 0.5) {

  const boundary = /(?<=\n)/;

  const ol = o.split(boundary).filter(x => x);
  const nl = [];

  let lwm = -Infinity;

  const deletes = diff.filter(c => c.op == 'del' || c.op == 'del_mv');

  DEL: for (const change of deletes) {

    for (let f = 0; f < ol.length * fuzz; f++) {
      for (const sign of [1, -1]) {
        let offset = f * sign;
        if (change.olno + offset <= lwm) continue;
        if (change.text == ol[change.olno + offset]) {
          ol[change.olno + offset] = null;
          lwm = change.olno + offset;
          continue DEL;
        }
      }
    }
    console.log("couldn't apply", change);
  }

  const inserts = diff.filter(c => c.op == 'ins' || c.op == 'ins_mv');

  let ins = inserts.shift();

  for (const [i, l] of ol.entries()) {

    while (ins && (ins.olno == i || ins.nlno == nl.length)) {
      nl.push(ins.text);
      ins = inserts.shift();
    }

    if (l !== null)  nl.push(l);
  }

  return nl.join('');
}

export { patch }
