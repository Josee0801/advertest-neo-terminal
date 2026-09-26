import type { AttackSpec, ExperimentConfig, ExperimentRunner, RunEvent } from "./contracts";

function hash(value: string) { let result = 2166136261; for (const char of value) result = Math.imul(result ^ char.charCodeAt(0), 16777619); return result >>> 0; }
export function specHash(spec: AttackSpec) { return hash(JSON.stringify(spec)).toString(16).padStart(8, "0"); }
export function estimateExperiment(config: ExperimentConfig) {
  const variants = config.attacks.length; const rawGpuSeconds = Math.ceil(config.dataset.sampleLimit * variants * 0.42);
  const cacheFactor = config.budget.useCache ? 0.69 : 1; const gpuSeconds = Math.ceil(rawGpuSeconds * cacheFactor);
  return { variants, gpuSeconds, costUsd: +(gpuSeconds * 0.00067).toFixed(2) };
}
export function simulateMetric(spec: AttackSpec, cleanMap = 72.8) {
  const seeded = (hash(`${specHash(spec)}:${spec.seed}`) % 900) / 100;
  const familyPenalty = { corruption: 4.1, occlusion: 5.4, gradient: 6.9, patch: 7.7 }[spec.family];
  const attackedMap = Math.max(3, +(cleanMap - spec.severity * familyPenalty - seeded).toFixed(1));
  return { cleanMap, attackedMap, retention: +(attackedMap / cleanMap * 100).toFixed(1), asr: +Math.min(99, (cleanMap - attackedMap) / cleanMap * 120).toFixed(1), flipRate: +Math.min(80, spec.severity * 6.2 + seeded).toFixed(1) };
}
export class DeterministicRunner implements ExperimentRunner {
  async run(config: ExperimentConfig, onEvent: (event: RunEvent) => void, shouldRun = () => true) {
    const runId = `run-${hash(config.id).toString(16)}`; const selected = config.attacks.filter(shouldRun);
    selected.forEach((spec, index) => onEvent({ experimentId: config.id, runId, state: index === selected.length - 1 ? "complete" : "running", done: index + 1, total: selected.length, gpuSeconds: (index + 1) * 84, costUsd: +((index + 1) * 0.056).toFixed(2), message: `${spec.name} severity ${spec.severity} · ${specHash(spec)}`, timestamp: new Date(Date.UTC(2026, 8, 23, 13, 30, index)).toISOString() }));
  }
}
