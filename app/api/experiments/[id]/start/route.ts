import { NextResponse } from "next/server";
import { DeterministicRunner } from "@/lib/engine/simulator";
import type { ExperimentConfig, RunEvent } from "@/lib/engine/contracts";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const input = await request.json().catch(() => ({})) as Partial<ExperimentConfig>;
  const config: ExperimentConfig = {
    id, name: input.name ?? "KITTI Weather Sweep", model: input.model ?? { adapter: "yolo", weights: "yolov8n.pt" },
    dataset: input.dataset ?? { adapter: "kitti", split: "val", sampleLimit: 2000 },
    attacks: input.attacks ?? [
      { family: "corruption", name: "snow", params: {}, severity: 4, seed: 42 },
      { family: "gradient", name: "pgd", params: { epsilon: "8/255", steps: 40 }, severity: 4, seed: 42 },
    ],
    budget: input.budget ?? { hardCapUsd: 48, earlyStop: true, useCache: true },
  };
  const events: RunEvent[] = [];
  await new DeterministicRunner().run(config, (event) => events.push(event));
  return NextResponse.json({ runId: events[0]?.runId, state: "complete", events });
}
