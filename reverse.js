function reverse(changes) {

  changes = clone(changes);

  const ops = {
    'del': 'ins',
    'ins': 'del',
    'del_mv': 'ins_mv',
    'ins_mv': 'del_mv',
  }

  for (const c of changes) {
    c.op = ops[c.op] || c.op;
  }

  return changes;

}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

export { reverse }
