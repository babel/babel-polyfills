// @flow

// NOTE: This code is mostly copied from packages/babel-core/src/config/files/plugins.js
// I want to implement this plugin without modifying @babel/core since it is experimental,
// but when it will become "stable" this code should be deduped.

import typeof * as loaderType from "./loader";
import typeof * as loaderBrowserType from "./loader-browser";

// NOTE: Copied from packages/babel-core/src/config/files/index.js
// Kind of gross, but essentially asserting that the exports of this module are the same as the
// exports of index-browser, since this file may be replaced at bundle time with index-browser.
((({}: any): $Exact<loaderBrowserType>): $Exact<loaderType>);

/**
 * This file handles all logic for converting string-based configuration references into loaded objects.
 */

import buildDebug from "debug";
import resolve from "resolve";
import path from "path";

const debug = buildDebug("babel:config:loading:files:polyfill-providers");

const EXACT_RE = /^module:/;
const PREFIX_RE = /^(?!@|module:|[^/]+\/|babel-polyfill-provider-)/;
const ORG_RE = /^(@[^/]+\/)(?![^/]*babel-polyfill-provider(?:-|\/|$)|[^/]+\/)/;
const ORG_DEFAULT_RE = /^(@[^/]+)$/;

export function loadProvider(
  name: string,
  dirname?: string,
): { filepath: string, value: mixed } {
  const filepath = resolveProvider(name, dirname);
  const value = requireModule(filepath);

  debug("Loaded polyfill provider %o from %o.", name, dirname);

  return { filepath, value };
}

function standardizeName(name: string) {
  // Let absolute and relative paths through.
  if (path.isAbsolute(name)) return name;

  return (
    name
      // foo -> babel-polyfill-provider-foo
      .replace(PREFIX_RE, `babel-polyfill-provider-`)
      // @foo/mypolyfill -> @foo/babel-polyfill-provider-mypolyfill
      .replace(ORG_RE, `$1babel-polyfill-provider-`)
      // @foo -> @foo/babel-polyfill-provider
      .replace(ORG_DEFAULT_RE, `$1/babel-polyfill-provider`)
      // module:mypolyfill -> mypolyfill
      .replace(EXACT_RE, "")
  );
}

export function resolveProvider(
  name: string,
  dirname?: string = process.cwd(),
) {
  const standardizedName = standardizeName(name);

  try {
    return resolve.sync(standardizedName, { basedir: dirname });
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;

    if (standardizedName !== name) {
      let resolvedOriginal = false;
      try {
        resolve.sync(name, { basedir: dirname });
        resolvedOriginal = true;
      } catch (e2) {}

      if (resolvedOriginal) {
        e.message += `\n- If you want to resolve "${name}", use "module:${name}"`;
      }
    }

    throw e;
  }
}

const LOADING_MODULES = new Set();
function requireModule(name: string): mixed {
  if (LOADING_MODULES.has(name)) {
    throw new Error(
      `Reentrant polyfill provider detected trying to load "${name}". ` +
        "This module is not ignored and is trying to load itself while compiling " +
        "itself, leading to a dependency cycle. We recommend adding it to your " +
        '"ignore" list in your babelrc, or to a .babelignore.',
    );
  }

  try {
    LOADING_MODULES.add(name);
    // $FlowIgnore
    return require(name);
  } finally {
    LOADING_MODULES.delete(name);
  }
}
