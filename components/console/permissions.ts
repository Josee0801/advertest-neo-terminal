import type { Role, View } from "./types";

const roleViews: Record<Role, readonly View[]> = {
  "Test Engineer": ["dashboard", "experiments", "monitor", "compare", "matrix", "reports"],
  "Safety Reviewer": ["dashboard", "monitor", "compare", "matrix", "triage", "reports"],
  Admin: ["dashboard", "experiments", "monitor", "compare", "matrix", "triage", "reports", "admin"],
};

export function canAccessView(role: Role, view: View) {
  return roleViews[role].includes(view);
}

export const permissions = {
  canCreateExperiment: (role: Role) => role === "Test Engineer" || role === "Admin",
  canControlRun: (role: Role) => role === "Test Engineer" || role === "Admin",
  canTriage: (role: Role) => role === "Safety Reviewer" || role === "Admin",
  canSignReport: (role: Role) => role === "Safety Reviewer" || role === "Admin",
  canAdminister: (role: Role) => role === "Admin",
};

export function firstAllowedView(role: Role): View {
  return roleViews[role][0] ?? "dashboard";
}
