require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("foo");
const x = new Promise(resolve => {
  const p = [];
  if (p.includes("a")) {}
});
