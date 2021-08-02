import assert from 'assert';
import fs from 'fs';
import { suite } from './index.js';

import path from 'path';
const __dirname = path.resolve();

import { diff, format } from '../index.js';

suite('diff', test => {

  test('all deletes', () => {
    assert.deepEqual(
      diff('one\ntwo\nthree\n', ''),
      [
        { op: 'del', text: 'one\n', olno: 0 },
        { op: 'del', text: 'two\n', olno: 1 },
        { op: 'del', text: 'three\n', olno: 2 },
      ]
    );
  });

  test('all inserts', () => {
    assert.deepEqual(
      diff('', 'one\ntwo\nthree\n'),
      [
        { op: 'ins', text: 'one\n', nlno: 0 },
        { op: 'ins', text: 'two\n', nlno: 1 },
        { op: 'ins', text: 'three\n', nlno: 2 },
      ]
    );
  });

  test('equal', () => {
    assert.deepEqual(
      diff('one\ntwo\nthree\n', 'one\ntwo\nthree\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'token', text: 'two\n', nlno: 1, olno: 1 },
        { op: 'token', text: 'three\n', nlno: 2, olno: 2 },
      ]
    );
  });

  test('insert beginning', () => {
    assert.deepEqual(
      diff('two\nthree\n', 'one\ntwo\nthree\n'),
      [
        { op: 'ins', text: 'one\n', nlno: 0 },
        { op: 'token', text: 'two\n', nlno: 1, olno: 0 },
        { op: 'token', text: 'three\n', nlno: 2, olno: 1 },
      ]
    );
  });

  test('insert end', () => {
    assert.deepEqual(
      diff('one\ntwo\n', 'one\ntwo\nthree\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'token', text: 'two\n', nlno: 1, olno: 1 },
        { op: 'ins', text: 'three\n', nlno: 2 },
      ]
    );
  });

  test('insert mid', () => {
    assert.deepEqual(
      diff('one\nthree\n', 'one\ntwo\nthree\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'ins', text: 'two\n', nlno: 1 },
        { op: 'token', text: 'three\n', nlno: 2, olno: 1 },
      ]
    );
  });

  test('delete beginning', () => {
    assert.deepEqual(
      diff('one\ntwo\nthree\n', 'two\nthree\n'),
      [
        { op: 'del', text: 'one\n', olno: 0 },
        { op: 'token', text: 'two\n', nlno: 0, olno: 1 },
        { op: 'token', text: 'three\n', nlno: 1, olno: 2 },
      ]
    );
  });

  test('delete end', () => {
    assert.deepEqual(
      diff('one\ntwo\nthree\n', 'one\ntwo\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'token', text: 'two\n', nlno: 1, olno: 1 },
        { op: 'del', text: 'three\n', olno: 2 },
      ]
    );
  });

  test('delete mid', () => {
    assert.deepEqual(
      diff('one\ntwo\nthree\n', 'one\nthree\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'del', text: 'two\n', olno: 1 },
        { op: 'token', text: 'three\n', nlno: 1, olno: 2 },
      ]
    );
  });

  test('reorder', () => {
    assert.deepEqual(
      diff('one\nthree\ntwo\n', 'one\ntwo\nthree\n'),
      [
        { op: 'token', text: 'one\n', nlno: 0, olno: 0 },
        { op: 'del_mv', text: 'three\n', nlno: 2, olno: 1 },
        { op: 'token', text: 'two\n', nlno: 1, olno: 2 },
        { op: 'ins_mv', text: 'three\n', nlno: 2, olno: 1 },
      ]
    );
  });

  test('paper example', () => {
    assert.deepEqual(
      diff(read("t1"), read("t2")),
      [
        { op: 'del', text: 'much\n', olno: 0 },
        { op: 'del', text: 'writing\n', olno: 1 },
        { op: 'del', text: 'is\n', olno: 2 },
        { op: 'del_mv', text: 'like\n', nlno: 10, olno: 3 },
        { op: 'del_mv', text: 'snow,\n', nlno: 12, olno: 4 },
        { op: 'token', text: 'a\n', nlno: 0, olno: 5 },
        { op: 'token', text: 'mass\n', nlno: 1, olno: 6 },
        { op: 'token', text: 'of\n', nlno: 2, olno: 7 },
        { op: 'del', text: 'long\n', olno: 8 },
        { op: 'ins', text: 'latin\n', nlno: 3 },
        { op: 'token', text: 'words\n', nlno: 4, olno: 9 },
        { op: 'del', text: 'and\n', olno: 10 },
        { op: 'del', text: 'phrases\n', olno: 11 },
        { op: 'token', text: 'falls\n', nlno: 5, olno: 12 },
        { op: 'token', text: 'upon\n', nlno: 6, olno: 13 },
        { op: 'token', text: 'the\n', nlno: 7, olno: 14 },
        { op: 'token', text: 'relevant\n', nlno: 8, olno: 15 },
        { op: 'token', text: 'facts\n', nlno: 9, olno: 16 },
        { op: 'ins_mv', text: 'like\n', nlno: 10, olno: 3 },
        { op: 'ins', text: 'soft\n', nlno: 11 },
        { op: 'ins_mv', text: 'snow,\n', nlno: 12, olno: 4 },
        { op: 'token', text: 'covering\n', nlno: 13, olno: 17 },
        { op: 'token', text: 'up\n', nlno: 14, olno: 18 },
        { op: 'token', text: 'the\n', nlno: 15, olno: 19 },
        { op: 'token', text: 'details\n', nlno: 16, olno: 20 }
      ]
    );
  });

});


function read(fn) {
  return fs.readFileSync(__dirname + "/test/data/" + fn).toString();
}
