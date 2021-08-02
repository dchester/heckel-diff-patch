import { patch, diff } from '../index.js';
import fs from 'fs';

const t1 = fs.readFileSync(process.argv[2]).toString();
const t2 = fs.readFileSync(process.argv[3]).toString();

const delta = diff(t1, t2);

const t3 = patch(t1, delta);

console.log(t3);




