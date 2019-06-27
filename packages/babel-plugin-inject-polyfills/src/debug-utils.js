// @flow

import semver from "semver";
import {
  semverify,
  isUnreleasedVersion,
  prettifyVersion,
  prettifyTargets,
} from "@babel/preset-env/lib/utils";

import type { Targets } from "./types";

export const presetEnvSilentDebugHeader =
  "#__secret_key__@babel/preset-env__don't_log_debug_header_and_resolved_targets";

export function filterTargets(targets: Targets, support: Targets) {
  const result = {};

  for (const env of Object.keys(targets)) {
    const minVersion = support[env];
    const targetVersion = targets[env];

    if (!minVersion) {
      result[env] = prettifyVersion(targetVersion);
    } else {
      const minIsUnreleased = isUnreleasedVersion(minVersion, env);
      const targetIsUnreleased = isUnreleasedVersion(targetVersion, env);

      if (
        !targetIsUnreleased &&
        (minIsUnreleased ||
          semver.lt(targetVersion.toString(), semverify(minVersion)))
      ) {
        result[env] = prettifyVersion(targetVersion);
      }
    }
  }

  return result;
}

export function stringifyTargetsMultiline(targets: Targets): string {
  return JSON.stringify(prettifyTargets(targets), null, 2);
}

export function stringifyTargets(targets: Targets): string {
  return JSON.stringify(targets)
    .replace(/,/g, ", ")
    .replace(/^\{"/, '{ "')
    .replace(/"\}$/, '" }');
}
