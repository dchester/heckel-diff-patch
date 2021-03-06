function patch(o, diff, {boundary=/(?<=\n)/, fuzz=1}={}) {

  const ol = o.split(boundary).filter(x => x);
  const nl = [];

  const symbols = {};
  const OA = [];
  const NA = [];

  for (const [i, t] of ol.entries()) {
    if (!(t in symbols)) symbols[t] = { t: t, nc: 0, oc: 0 };
    symbols[t].oc += 1;
    symbols[t].olno = i;
    OA[i] = symbols[t];
  }

  for (const [i, d] of diff.entries()) {
    if (!d.op.match(/^(del|token)/)) continue;
    const t = d.text;
    if (!(t in symbols)) symbols[t] = { t: t, nc: 0, oc: 0 };
    symbols[t].nc += 1;
    NA[i] = symbols[t];
  }

  for (const [i] of NA.entries()) {
    if (NA[i] && NA[i].nc == 1 && NA[i].oc == 1) {
      OA[NA[i].olno] = i;
      NA[i] = NA[i].olno;
    }
  }

  for (const [i] of NA.entries()) {
    if (_number(NA[i]) && _object(NA[i+1]) && NA[i+1] == OA[NA[i]+1]) {
      OA[NA[i]+1] = i + 1;
      NA[i+1] = NA[i] + 1;
    }
  }

  for (let i = NA.length; i >= 0; --i) {
    if (_number(NA[i]) && _object(NA[i-1]) && NA[i-1] == OA[NA[i]-1]) {
      OA[NA[i]-1] = i - 1;
      NA[i-1] = NA[i] - 1;
    }
  }

  for (const [i, d] of diff.entries()) {
    const t = d.text;
    for (let f = 0; f < ol.length * fuzz; f++) {
      for (const sign of [1, -1]) {
        let j = d.olno + f * sign;
        if (!_number(NA[i]) && t == ol[j]) {
          NA[i] = j;
          OA[j] = i;
        }
      }
    }
  }

  let j = 0;
  let i = 0;
  let applied = {};

  OL: do {
    if (_object(OA[i])) {
      nl.push(ol[i]);
    } else {
      j = OA[i] || 0;
      while ((i <= NA[j] || NA[j] == undefined) && j < diff.length && !applied[j]) {
        applied[j] = true;
        const d = diff[j++];
        if (d.op == 'del') continue;
        if (d.op == 'ins') nl.push(d.text);
        if (d.op == 'token') nl.push(d.text);
      }
    }
  } while (i++ < ol.length);

  return nl.join``;
}

export { patch }

function _object(x) {
  return typeof x == 'object';
}

function _number(x) {
  return typeof x == 'number';
}

function dumpster(str) {
  let out = '';
  for (var c of str) {
    out += c.match(/[ -~]/) ? c : '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
  }
  return out;
}
