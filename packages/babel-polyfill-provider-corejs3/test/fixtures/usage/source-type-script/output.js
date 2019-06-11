require("core-js/modules/es.promise");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.array.includes");

require("foo");

const x = new Promise(resolve => {
  const p = [];

  if (p.includes("a")) {}
});
