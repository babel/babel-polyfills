require("es-aggregate-error/auto");

require("array-includes/auto");

require("foo");

const x = new AggregateError(x => {
  const p = [];

  if (p.includes("a")) {}
});
