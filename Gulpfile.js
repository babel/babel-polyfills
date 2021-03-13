"use strict";

const plumber = require("gulp-plumber");
const through = require("through2");
const chalk = require("chalk");
const newer = require("gulp-newer");
const babel = require("gulp-babel");
const gulpWatch = require("gulp-watch");
const fancyLog = require("fancy-log");
const gulp = require("gulp");
const path = require("path");
const rollup = require("rollup").rollup;
const rollupBabel = require("@rollup/plugin-babel").babel;
const rollupNodeResolve = require("@rollup/plugin-node-resolve").nodeResolve;
const rollupJson = require("@rollup/plugin-json");

const packages = [
  "babel-helper-define-polyfill-provider",
  "babel-plugin-polyfill-corejs2",
  "babel-plugin-polyfill-corejs3",
  "babel-plugin-polyfill-es-shims",
  "babel-plugin-polyfill-regenerator",
];

function swapSrcWithLib(srcPath) {
  const parts = srcPath.split(path.sep);
  parts[1] = "lib";
  return parts.join(path.sep);
}

function compilationLogger() {
  return through.obj(function(file, enc, callback) {
    fancyLog(`Compiling '${chalk.cyan(file.relative)}'...`);
    callback(null, file);
  });
}

function errorsLogger() {
  return plumber({
    errorHandler(err) {
      fancyLog(err.stack);
    },
  });
}

function rename(fn) {
  return through.obj(function(file, enc, callback) {
    file.path = fn(file);
    callback(null, file);
  });
}

function build() {
  const base = path.join(__dirname, "packages");

  return gulp
    .src("./packages/*/src/**/*.js", { base: base })
    .pipe(errorsLogger())
    .pipe(newer({ dest: base, map: swapSrcWithLib }))
    .pipe(compilationLogger())
    .pipe(babel())
    .pipe(
      // Passing 'file.relative' because newer() above uses a relative
      // path and this keeps it consistent.
      rename(file => path.resolve(file.base, swapSrcWithLib(file.relative)))
    )
    .pipe(gulp.dest(base));
}

async function buildRollup() {
  const base = path.join(__dirname, "packages");

  return Promise.all(
    packages.map(async name => {
      const dir = `${base}/${name}`;
      const pkg = require(`${dir}/package.json`);
      const external = (specifier, x, skip) => {
        if (!skip && !external(specifier, x, true)) console.log(specifier);
        if (specifier.includes("/core-js-compat/")) return true;
        if (specifier.includes("/data/polyfills")) return true;
        if (specifier.startsWith("/")) return false;
        const name = /^(?:@[^/]+\/[^/]+|[^/]+)/.exec(specifier)?.[0];
        if (name === "@babel/core") return true;
        return Object.hasOwnProperty.call(pkg.dependencies || {}, name);
      };

      const bundle = await rollup({
        input: `${dir}/src/index.js`,
        external,
        plugins: [
          rollupJson(),
          rollupBabel({
            envName: "esm",
            babelrc: false,
            babelHelpers: "bundled",
            extends: "./babel.config.js",
            extensions: [".ts", ".js", ".mjs", ".cjs"],
          }),
          rollupNodeResolve({
            extensions: [".ts", ".js", ".mjs", ".cjs", ".json"],
            browser: true,
            preferBuiltins: true,
          }),
        ],
      });

      const outputFile = `${dir}/esm/index.mjs`;
      await bundle.write({
        file: outputFile,
        format: "es",
        sourcemap: true,
        exports: "named",
      });
    })
  );
}

gulp.task("build", () => build());

gulp.task("bundle", () => buildRollup());

gulp.task("default", gulp.series("build"));

gulp.task(
  "watch",
  gulp.series("build", function watch() {
    gulpWatch(
      "./packages/*/src/**/*.js",
      { debounceDelay: 200 },
      gulp.task("build")
    );
  })
);
