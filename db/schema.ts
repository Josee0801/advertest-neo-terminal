import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const experiments = sqliteTable("experiments", {
  id: text("id").primaryKey(), name: text("name").notNull(), modelId: text("model_id").notNull(),
  datasetId: text("dataset_id").notNull(), configJson: text("config_json").notNull(),
  configHash: text("config_hash").notNull(), ownerId: text("owner_id").notNull(),
  status: text("status").notNull().default("draft"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const runs = sqliteTable("runs", {
  id: text("id").primaryKey(), experimentId: text("experiment_id").notNull().references(() => experiments.id),
  state: text("state").notNull().default("queued"), progress: integer("progress").notNull().default(0),
  gpuSeconds: integer("gpu_seconds").notNull().default(0), costUsd: real("cost_usd").notNull().default(0),
  cacheHits: integer("cache_hits").notNull().default(0), workerId: text("worker_id"), startedAt: text("started_at"), completedAt: text("completed_at"),
}, (table) => [index("idx_runs_experiment_state").on(table.experimentId, table.state)]);
export const metrics = sqliteTable("metrics", {
  id: integer("id").primaryKey({ autoIncrement: true }), runId: text("run_id").notNull().references(() => runs.id),
  corruption: text("corruption").notNull(), severity: integer("severity").notNull(), cleanMap: real("clean_map").notNull(),
  attackedMap: real("attacked_map").notNull(), asr: real("asr").notNull(), retention: real("retention").notNull(), flipRate: real("flip_rate").notNull(),
}, (table) => [index("idx_metrics_run").on(table.runId)]);
export const failureCases = sqliteTable("failure_cases", {
  id: text("id").primaryKey(), runId: text("run_id").notNull().references(() => runs.id), sampleId: text("sample_id").notNull(),
  attackSpecHash: text("attack_spec_hash").notNull(), category: text("category").notNull(), severityScore: integer("severity_score").notNull(),
  verdict: text("verdict"), mitigation: text("mitigation"), reviewNote: text("review_note"), reviewerId: text("reviewer_id"), reviewedAt: text("reviewed_at"),
}, (table) => [index("idx_failure_cases_run_verdict").on(table.runId, table.verdict)]);
export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(), experimentId: text("experiment_id").notNull().references(() => experiments.id),
  status: text("status").notNull().default("DRAFT"), bundleJson: text("bundle_json").notNull(), signedBy: text("signed_by"), signedAt: text("signed_at"),
}, (table) => [index("idx_reports_experiment").on(table.experimentId)]);
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }), actorId: text("actor_id").notNull(), action: text("action").notNull(),
  entityType: text("entity_type").notNull(), entityId: text("entity_id").notNull(), payloadJson: text("payload_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_audit_entity").on(table.entityType, table.entityId)]);
