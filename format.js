function format(patch) {

  function _formatLine(t) {
    const symbol =
      t.op.match(/^del_mv/) ? '<' :
      t.op.match(/^ins_mv/) ? '>' :
      t.op.match(/^del/) ? '-' :
      t.op.match(/^ins/) ? '+' : ' ';
    return `${symbol}${t.text}`;
  }

  let output = '';
  let hunk = null;
  let trail = null;
  let context = 3;
  const hunks = [];

  for (const [i, t] of patch.entries()) {

    if (hunk) {
      hunk.lines.push(_formatLine(t));
    }

    if (t.op == 'token' && trail-- == 0) {
      if (patch.slice(i, i + context).every(t => t.op == 'token')) {
        hunk = null;
      }
    }
    else if (t.op !== 'token' && hunk) {
      trail = context;
    }
    else if (t.op !== 'token' && !hunk) {
      hunk = { lines: [], start: i };
      hunks.push(hunk);
      for (let j = Math.max(0, i - 2); j <= i; j++) {
        hunk.lines.push(_formatLine(patch[j]));
      }
    }
  }

  for (hunk of hunks) {
    output += `@@ -${hunk.start},${hunk.lines.length} @@\n`;
    output += hunk.lines.join('')
  }

  return output;
}

export { format }

