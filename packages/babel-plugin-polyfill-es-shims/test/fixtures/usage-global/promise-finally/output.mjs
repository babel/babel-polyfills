import "promise.prototype.finally/auto";
var p = Promise.resolve(0);
p.finally(() => {
  alert("OK");
});
