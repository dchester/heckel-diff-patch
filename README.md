# Heckel

Implementation of Paul Heckel's diff algorithm published in 1978


#### changes = diff(old, new[, {boundary}])

Computes changes required to turn the string `old` into the string `new`.  Optionally takes a `boundary` regular expression by which to tokenize.

```
diff('one\nthree\ntwo\n', 'one\ntwo\nthree\n');

// [
//  { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
//  { op: 'del_mv', text: 'three\n', nlno: 2, olno: 1 },
//  { op: 'token', text: 'two\n', nlno: 1, olno: 2 },
//  { op: 'ins_mv', text: 'three\n', nlno: 2, olno: 1 },
// ]
```

#### new = patch(old, changes[, {boundary, fuzz}])

Applies changes from `diff` to a string `old` to produce a `new` string. Optionally accepts a `boundary` regular expression by which to tokenize, and a `fuzz` factor indicating what percentage of the string may be traversed when finding matching context tokens.

```
patch(
  'one\nthree\ntwo\n',
  [
    { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
    { op: 'del_mv', text: 'three\n', nlno: 2, olno: 1 },
    { op: 'token', text: 'two\n', nlno: 1, olno: 2 },
    { op: 'ins_mv', text: 'three\n', nlno: 2, olno: 1 },
  ]
);

// "one\ntwo\nthree"
```

