function diff(o, n) {

  const ctx = 3;
  const boundary = /(?<=\n)/;

  const nl = n.split(boundary).filter(x => x);
  const ol = o.split(boundary).filter(x => x);

  const patch = [];
  const symbols = {};
  const NA = [];
  const OA = [];

  for (const [i, t] of nl.entries()) {
    if (!(t in symbols)) symbols[t] = { t: t, nc: 0, oc: 0 };
    symbols[t].nc += 1;
    NA[i] = symbols[t];
  }

  for (const [i, t] of ol.entries()) {
    if (!(t in symbols)) symbols[t] = { t: t, nc: 0, oc: 0 };
    symbols[t].oc += 1;
    symbols[t].olno = i;
    OA[i] = symbols[t];
  }

  for (const [i] of NA.entries()) {
    if (NA[i].nc == 1 && NA[i].oc == 1) {
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

  {
    let i = 0;
    let j = 0;

    while (i < NA.length || j < OA.length) {
      if (_object(OA[j]) && j < OA.length) {
        patch.push({ op: 'del', text: OA[j].t, olno: j });
        j += 1;
      }
      else if (_object(NA[i])) {
        patch.push({ op: 'ins', text: NA[i].t, nlno: i });
        i += 1;
      }
      else if (_number(NA[i]) && NA[i] < j) {
        patch.push({ op: 'ins_mv', text: ol[NA[i]], nlno: i, olno: NA[i] });
        i += 1;
      }
      else if (_number(OA[j]) && j < OA.length && OA[j] > i) {
        patch.push({ op: 'del_mv', text: nl[OA[j]], nlno: OA[j], olno: j });
        j += 1;
      }
      else if (_number(NA[i]) && _number(OA[j]) && ol[NA[i]] == nl[OA[j]]) {
        patch.push({ op: 'token', text: ol[NA[i]], nlno: i, olno: NA[i] });
        i += 1;
        j += 1;
      }
    }
  }

  let run = 0;

  for (let i = patch.length + ctx - 1; i >= -ctx - 1; i--) {
    if ((!patch[i] || patch[i].op == 'token') && i > -ctx - 1) {
      run++;
    } else {
      patch.splice(i + ctx + 1, run - ctx * 2);
      run = 0;
    }
  }

  return patch;
}

function _object(x) {
  return typeof x == 'object';
}

function _number(x) {
  return typeof x == 'number';
}

export { diff }
