import "core-js/modules/es.map.js";
import "core-js/modules/esnext.array.unique-by.js";
// https://github.com/babel/babel/issues/15392

const data = [{
  id: 1,
  uid: 10000
}, {
  id: 2,
  uid: 10000
}, {
  id: 3,
  uid: 10001
}];
const final_data = data.uniqueBy(it => it.uid);
