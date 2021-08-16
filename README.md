# heckel-diff-patch

Implementation of Paul Heckel's diff algorithm published in 1978


#### changes = diff(old, new[, {boundary}])

Computes changes required to turn the string `old` into the string `new`.  Optionally takes a `boundary` regular expression by which to tokenize.

```javascript
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

```javascript
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

### License

Copyright (c) 2021 David Chester <david@chester.cx>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
