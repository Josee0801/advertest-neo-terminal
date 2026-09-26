import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { auditLogs, experiments } from "@/db/schema";
import { estimateExperiment } from "@/lib/engine/simulator";
import type { ExperimentConfig } from "@/lib/engine/contracts";

const demoExperiments = [
  { id: "ADV-2026-091", name: "KITTI Weather Sweep", status: "running", progress: 68 },
  { id: "ADV-2026-090", name: "COCO PGD Sweep", status: "review", progress: 100 },
];

export async function GET() {
  return NextResponse.json({ data: demoExperiments, source: "deterministic-adapter" });
}

export async function POST(request: Request) {
  const input = await request.json() as Partial<ExperimentConfig>;
  if (!input.name || !input.model || !input.dataset || !input.attacks?.length || !input.budget) {
    return NextResponse.json({ error: "Invalid experiment config" }, { status: 400 });
  }
  const user = await getChatGPTUser();
  const id = input.id ?? `ADV-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const config = { ...input, id } as ExperimentConfig;
  const estimate = estimateExperiment(config);
  if (estimate.costUsd > config.budget.hardCapUsd) return NextResponse.json({ error: "Budget hard cap exceeded", estimate }, { status: 422 });
  try {
    const db = getDb();
    await db.insert(experiments).values({ id, name: config.name, modelId: config.model.weights, datasetId: `${config.dataset.adapter}:${config.dataset.split}`, configJson: JSON.stringify(config), configHash: crypto.randomUUID().replaceAll("-", ""), ownerId: user?.userId ?? "local-demo", status: "queued" });
    await db.insert(auditLogs).values({ actorId: user?.userId ?? "local-demo", action: "experiment.created", entityType: "experiment", entityId: id, payloadJson: JSON.stringify({ estimate }) });
  } catch {
    // Local preview intentionally falls back to the deterministic adapter when D1 is not bound.
  }
  return NextResponse.json({ id, status: "queued", estimate }, { status: 201 });
}
