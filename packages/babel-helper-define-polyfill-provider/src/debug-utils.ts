import { prettifyTargets } from "@babel/helper-compilation-targets";

import type { Targets } from "./types";

export const presetEnvSilentDebugHeader =
  "#__secret_key__@babel/preset-env__don't_log_debug_header_and_resolved_targets";

export function stringifyTargetsMultiline(targets: Targets): string {
  return JSON.stringify(prettifyTargets(targets), null, 2);
}

export function stringifyTargets(targets: Targets): string {
  return JSON.stringify(targets)
    .replace(/,/g, ", ")
    .replace(/^\{"/, '{ "')
    .replace(/"\}$/, '" }');
}
