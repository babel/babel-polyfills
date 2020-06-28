"use strict";

const path = require("path");

const { generateData, environments, writeFile } = require("./utils-build-data");

const newData = generateData(environments, require(`./es-shims-features`));
const dataPath = path.join(
  __dirname,
  `../../packages/babel-plugin-polyfill-es-shims/data/polyfills.json`
);

if (!writeFile(newData, dataPath, "es-shims")) {
  process.exitCode = 1;
}
