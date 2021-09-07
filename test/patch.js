import assert from 'assert';
import fs from 'fs';
import { suite } from './index.js';

import path from 'path';
const __dirname = path.resolve();

import { patch } from '../index.js';

suite('patch', test => {

  test('insert empty', () => {
    assert.deepEqual(
      patch('', [{ op: "ins", text: "one\n", nlno: 0 }]),
      'one\n',
    );
  });

  test('replace first line', () => {
    assert.deepEqual(
      patch('abc', [
       { op: "del", text: "abc", olno: 0 },
       { op: "ins", text: "abcde", nlno: 0 }
      ]),
      'abcde'
    )
  });

  test('insert middle', () => {
    assert.deepEqual(
      patch('one\nthree\n', [
        { op: 'token', text: 'one\n', nlno: 0 },
        { op: 'ins', text: 'two\n', nlno: 1 },
        { op: 'token', text: 'three\n', nlno: 2 },
      ]),
      'one\ntwo\nthree\n'
    );
  });

  test('insert middle fuzz', () => {
    assert.deepEqual(
      patch('zero\none\nthree\n', [
        { op: 'token', text: 'one\n', nlno: 0 },
        { op: 'ins', text: 'two\n', nlno: 1 },
        { op: 'token', text: 'three\n', nlno: 2 },
      ]),
      'zero\none\ntwo\nthree\n'
    );
  });

  test('insert order swap fuzz', () => {
    assert.deepEqual(
      patch('zero\none\nthree\nten\nthirty\n', [
        { op: 'token', text: 'ten\n', nlno: 0 },
        { op: 'ins', text: 'twenty\n', nlno: 1 },
        { op: 'token', text: 'thirty\n', nlno: 2 },
        { op: 'token', text: 'one\n', nlno: 4 },
        { op: 'ins', text: 'two\n', nlno: 5 },
        { op: 'token', text: 'three\n', nlno: 6 },
      ]),
      'zero\none\ntwo\nthree\nten\ntwenty\nthirty\n'
    );
  });

  test('duplicate lines', () => {
    assert.deepEqual(
      patch('one\nthree\none\nthree\n', [
        { op: 'token', text: 'one\n', olno: 2 },
        { op: 'ins', text: 'two\n', nlno: 3 },
        { op: 'token', text: 'three\n', olno: 3 },
      ]),
      'one\nthree\none\ntwo\nthree\n'
    );
  });

  test('delete middle', () => {
    assert.deepEqual(
      patch('one\ntwo\nthree\n', [
        { op: 'del', text: 'two\n', olno: 1 },
      ]),
      'one\nthree\n'
    );
  });

  test('delete beginning', () => {
    assert.deepEqual(
      patch('one\ntwo\nthree\n', [
        { op: 'del', text: 'one\n', olno: 0 },
      ]),
      'two\nthree\n'
    );
  });

  test('delete middle fuzz', () => {
    assert.deepEqual(
      patch('one\ntwo\nthree\nfour\nfive\n', [
        { op: 'del', text: 'three\n', olno: 3 },
      ]),
      'one\ntwo\nfour\nfive\n'
    );
  });


});

