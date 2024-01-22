const { execSync } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const COMPAT_TABLE_COMMIT = "459ee154ee35e1cf55fc9179178d072badf8c67d";
const COMPAT_TABLE_PATH = "build/compat-table";

if (existsSync(COMPAT_TABLE_PATH)) {
  const commit = execSync("git rev-parse HEAD", {
    cwd: COMPAT_TABLE_PATH,
    encoding: "utf8",
  }).trim();
  if (commit === COMPAT_TABLE_COMMIT) {
    process.exit(0);
  }
}

rimraf.sync(COMPAT_TABLE_PATH);
mkdirSync("build", { recursive: true });

execSync(
  "git clone --branch=gh-pages --single-branch --shallow-since=2022-05-15 https://github.com/kangax/compat-table.git " +
    COMPAT_TABLE_PATH
);
execSync("git checkout -qf " + COMPAT_TABLE_COMMIT, {
  cwd: COMPAT_TABLE_PATH,
});
