import assert from "node:assert/strict";
import test from "node:test";

import { DeterministicRunner, estimateExperiment, simulateMetric, specHash } from "../lib/engine/simulator.ts";

const attack = { family: "corruption", name: "snow", params: {}, severity: 4, seed: 42 };
const config = {
  id: "ADV-TEST", name: "determinism", model: { adapter: "yolo", weights: "yolov8n.pt" },
  dataset: { adapter: "kitti", split: "val", sampleLimit: 2000 }, attacks: [attack],
  budget: { hardCapUsd: 48, earlyStop: true, useCache: true },
};

test("attack spec hashes and metrics are deterministic", () => {
  assert.equal(specHash(attack), specHash({ ...attack }));
  assert.deepEqual(simulateMetric(attack), simulateMetric({ ...attack }));
});

test("cache lowers the estimate", () => {
  const cached = estimateExperiment(config);
  const uncached = estimateExperiment({ ...config, budget: { ...config.budget, useCache: false } });
  assert.ok(cached.gpuSeconds < uncached.gpuSeconds);
  assert.ok(cached.costUsd < uncached.costUsd);
});

test("runner emits a terminal event", async () => {
  const events = [];
  await new DeterministicRunner().run(config, (event) => events.push(event));
  assert.equal(events.at(-1).state, "complete");
  assert.equal(events.at(-1).done, events.at(-1).total);
});
