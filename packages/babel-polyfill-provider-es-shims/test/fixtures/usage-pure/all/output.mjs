import _globalThis from "globalThis/implementation";
import _NumberIsNaN from "is-nan/implementation";
var a = new _globalThis.Promise(resolve => {
  resolve(_NumberIsNaN(2));
}).finally(x => {
  console.log(x);
});
