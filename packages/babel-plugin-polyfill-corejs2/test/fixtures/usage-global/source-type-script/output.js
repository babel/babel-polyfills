require("core-js/modules/es6.object.to-string.js");

require("core-js/modules/es6.promise.js");

require("core-js/modules/es7.array.includes.js");

require("foo");

const x = new Promise(resolve => {
  const p = [];

  if (p.includes("a")) {}
});
