import "promise.prototype.finally/auto.js";
var p = Promise.resolve(0);
p.finally(() => {
  alert("OK");
});
