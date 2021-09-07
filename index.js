import { diff } from './diff.js';
import { patch } from './patch.js';
import { reverse } from './reverse.js';

class Heckel {

  constructor(d=line) {
    this.boundary =
      d == 'word' ? /(?<=\s)/ :
      d == 'line' ? /(?<=\n)/ : '';
  }

  diff() {
    return diff(...arguments, this.boundary);
  }

  patch() {
    return patch(...arguments, this.boundary);
  }

  reverse() {
    return reverse(...arguments);
  }
}


export {
  Heckel,
  diff,
  patch,
  reverse,
}
