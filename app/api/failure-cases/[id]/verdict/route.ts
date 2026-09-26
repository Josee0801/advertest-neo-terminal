import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { auditLogs, failureCases } from "@/db/schema";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const body = await request.json() as { verdict?: string; mitigation?: string; note?: string };
  if (!body.verdict || !body.mitigation) return NextResponse.json({ error: "verdict and mitigation are required" }, { status: 400 });
  const user = await getChatGPTUser(); const reviewerId = user?.userId ?? "local-reviewer"; const reviewedAt = new Date().toISOString();
  try { const db = getDb(); await db.update(failureCases).set({ verdict: body.verdict, mitigation: body.mitigation, reviewNote: body.note ?? "", reviewerId, reviewedAt }).where(eq(failureCases.id, id)); await db.insert(auditLogs).values({ actorId: reviewerId, action: "failure.verdict_assigned", entityType: "failure_case", entityId: id, payloadJson: JSON.stringify(body) }); } catch {}
  return NextResponse.json({ id, ...body, reviewerId, reviewedAt });
}
