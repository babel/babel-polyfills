"use strict";

const path = require("path");

const { generateData, environments, writeFile } = require("./utils-build-data");

const newData = generateData(environments, require(`./es-shims-features`));

// These features are missing from compat-table. Remove this from this list once they are added.
const missing = [
  "Array.prototype.toReversed",
  "Array.prototype.toSorted",
  "Array.prototype.toSpliced",
  "Array.prototype.with",
];
for (const name of missing) {
  if (newData[name]) throw new Error(`Missing feature is present: ${name}`);
  newData[name] = {};
}

const dataPath = path.join(
  __dirname,
  `../../packages/babel-plugin-polyfill-es-shims/data/polyfills.json`
);

if (!writeFile(newData, dataPath, "es-shims")) {
  process.exitCode = 1;
}
