import { piapiProvider } from "./piapi";
import { falProvider } from "./fal";
import type { VideoProvider } from "./types";

const registry: Record<string, VideoProvider> = {
  piapi: piapiProvider,
  fal: falProvider,
};

const failureCounts: Record<string, number> = {};
const FAILURE_THRESHOLD = 3;

export function getProvider(providerName: string): VideoProvider {
  const provider = registry[providerName];
  if (!provider) throw new Error(`Unknown provider: ${providerName}`);
  return provider;
}

export function recordFailure(providerName: string) {
  failureCounts[providerName] = (failureCounts[providerName] ?? 0) + 1;
}

export function recordSuccess(providerName: string) {
  failureCounts[providerName] = 0;
}

export function isDegraded(providerName: string) {
  return (failureCounts[providerName] ?? 0) >= FAILURE_THRESHOLD;
}

export function getFallbackProvider(primary: string): VideoProvider | null {
  const fallbacks = Object.keys(registry).filter((k) => k !== primary);
  for (const name of fallbacks) {
    if (!isDegraded(name)) return registry[name];
  }
  return null;
}

export * from "./types";
