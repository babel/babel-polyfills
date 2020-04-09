require("es-aggregate-error/auto.js");

require("array-includes/auto.js");

require("foo");

const x = new AggregateError(x => {
  const p = [];

  if (p.includes("a")) {}
});
