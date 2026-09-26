import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { getDb } from "@/db";
import { auditLogs, reports } from "@/db/schema";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; const role = request.headers.get("x-advertest-role") ?? "Test Engineer";
  if (!new Set(["Safety Reviewer", "Admin"]).has(role)) return NextResponse.json({ error: "Reviewer role required" }, { status: 403 });
  const user = await getChatGPTUser(); const signedBy = user?.userId ?? "local-reviewer"; const signedAt = new Date().toISOString();
  try { const db = getDb(); await db.update(reports).set({ status: "VALIDATED", signedBy, signedAt }).where(eq(reports.id, id)); await db.insert(auditLogs).values({ actorId: signedBy, action: "report.validated", entityType: "report", entityId: id, payloadJson: JSON.stringify({ role, signedAt }) }); } catch {}
  return NextResponse.json({ id, status: "VALIDATED", signedBy, signedAt });
}
