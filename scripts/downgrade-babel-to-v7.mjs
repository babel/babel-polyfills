import { readFileSync, writeFileSync, readdirSync } from "fs";

const root = new URL("../", import.meta.url).pathname;

// Read root package.json
const pkgPath = root + "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

// Collect all workspace package names to exclude them from resolutions
const workspacePackages = new Set();
for (const dir of readdirSync(root + "packages")) {
  try {
    const subPkg = JSON.parse(
      readFileSync(root + "packages/" + dir + "/package.json", "utf8"),
    );
    workspacePackages.add(subPkg.name);
  } catch {}
}

// Collect all @babel/* package names from the dependency tree
const babelPackages = new Set();

function collectBabelDeps(obj) {
  if (!obj) return;
  for (const name of Object.keys(obj)) {
    if (name.startsWith("@babel/") && !workspacePackages.has(name)) {
      babelPackages.add(name);
    }
  }
}

collectBabelDeps(pkg.devDependencies);
collectBabelDeps(pkg.dependencies);

for (const dir of readdirSync(root + "packages")) {
  try {
    const subPkg = JSON.parse(
      readFileSync(root + "packages/" + dir + "/package.json", "utf8"),
    );
    collectBabelDeps(subPkg.dependencies);
    collectBabelDeps(subPkg.devDependencies);
  } catch {}
}

// test/esm
try {
  const esmPkg = JSON.parse(
    readFileSync(root + "test/esm/package.json", "utf8"),
  );
  collectBabelDeps(esmPkg.devDependencies);
} catch {}

// Add resolutions to force Babel 7
if (!pkg.resolutions) pkg.resolutions = {};
for (const name of babelPackages) {
  pkg.resolutions[name] = "^7.0.0";
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(
  "Added Babel 7 resolutions for:",
  [...babelPackages].sort().join(", "),
);
