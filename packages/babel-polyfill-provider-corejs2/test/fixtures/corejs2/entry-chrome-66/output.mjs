import "es7.array.flat-map";
import "web.timers";
import "web.immediate";
import "web.dom.iterable";
const foo = {
  a: true
};
const bar = { ...foo,
  b: false
};

async function baz() {
  for await (const x of someAsyncThing()) {
    console.log(x);
  }
}
