CREATE INDEX `idx_audit_entity` ON `audit_logs` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `idx_failure_cases_run_verdict` ON `failure_cases` (`run_id`,`verdict`);--> statement-breakpoint
CREATE INDEX `idx_metrics_run` ON `metrics` (`run_id`);--> statement-breakpoint
CREATE INDEX `idx_reports_experiment` ON `reports` (`experiment_id`);--> statement-breakpoint
CREATE INDEX `idx_runs_experiment_state` ON `runs` (`experiment_id`,`state`);--> statement-breakpoint
PRAGMA optimize;
