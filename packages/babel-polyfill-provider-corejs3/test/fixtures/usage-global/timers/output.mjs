import "core-js/modules/es.promise";
import "core-js/modules/es.object.to-string";
import "core-js/modules/web.timers";
import "core-js/modules/web.immediate";
Promise.resolve().then(it => {
  setTimeout(foo, 1, 2);
  setInterval(foo, 1, 2);
  setImmediate(foo, 1, 2);
});
