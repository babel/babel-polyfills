require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.promise");

require("core-js/modules/es7.array.includes");

require("foo");

const x = new Promise(resolve => {
  const p = [];

  if (p.includes("a")) {}
});
