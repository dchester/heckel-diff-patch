import { diff, format } from '../index.js';
import fs from 'fs';


const t1 = fs.readFileSync(process.argv[2]).toString();
const t2 = fs.readFileSync(process.argv[3]).toString();

console.log(format(diff(t1, t2)));
