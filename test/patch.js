import assert from 'assert';
import fs from 'fs';
import { suite } from './index.js';

import path from 'path';
const __dirname = path.resolve();

import { patch } from '../index.js';

suite('patch', test => {

  test('insert middle', () => {
    assert.deepEqual(
      patch('one\nthree\n', [
        { op: 'ins', text: 'two\n', nlno: 1 },
      ]),
      'one\ntwo\nthree\n'
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

