"use strict";

const path = require("path");

const { generateData, environments, writeFile } = require("./utils-build-data");

const features = require(`./es-shims-features`);
const missing = [];
for (const name of Object.keys(features)) {
  if (features[name] === "@@MISSING@@") {
    missing.push(name);
    delete features[name];
  }
}

const newData = generateData(environments, features);

for (const name of missing) newData[name] = {};

const dataPath = path.join(
  __dirname,
  `../../packages/babel-plugin-polyfill-es-shims/data/polyfills.json`
);

if (!writeFile(newData, dataPath, "es-shims")) {
  process.exitCode = 1;
}
