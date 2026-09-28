export type View =
  | "dashboard"
  | "experiments"
  | "monitor"
  | "compare"
  | "matrix"
  | "triage"
  | "reports"
  | "admin";

export type Role = "Test Engineer" | "Safety Reviewer" | "Admin";
export type Locale = "vi" | "en";
export type ConsoleTheme = "dark" | "light";

export type RunState = {
  progress: number;
  status: "queued" | "running" | "paused" | "complete";
  cost: number;
  cached: number;
};
