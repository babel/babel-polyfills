export { default as usage } from "./usage";
export { default as entry } from "./entry";

import type { NodePath } from "@babel/traverse";
import type { MetaDescriptor } from "../types";

export type CallProvider = (payload: MetaDescriptor, path: NodePath) => boolean;
