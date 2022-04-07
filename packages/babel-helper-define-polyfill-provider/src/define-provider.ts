import type { PolyfillProviderInternal, PolyfillProvider } from "./types";

export function defineProvider<Options>(
  factory: PolyfillProvider<Options>,
): PolyfillProviderInternal<Options> {
  // This will allow us to do some things

  return factory as any;
}
