import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  FileCheck2,
  Grid3X3,
  LayoutDashboard,
  Microscope,
  TriangleAlert,
} from "lucide-react";
import type { View } from "./types";

export type NavigationItem = {
  view: View;
  icon: LucideIcon;
  labelKey: "dashboard" | "experiments" | "matrix" | "compare" | "triage" | "reports";
  count?: string;
};

export const navigation: NavigationItem[] = [
  { view: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { view: "experiments", icon: Microscope, labelKey: "experiments", count: "12" },
  { view: "matrix", icon: Grid3X3, labelKey: "matrix" },
  { view: "compare", icon: TriangleAlert, labelKey: "compare", count: "38" },
  { view: "triage", icon: ClipboardCheck, labelKey: "triage", count: "12" },
  { view: "reports", icon: FileCheck2, labelKey: "reports" },
];

export type AttackDefinition = {
  id: string;
  label: string;
  kind: "corruption" | "gradient";
  variants: number;
};

export const attackCatalog: AttackDefinition[] = [
  { id: "noise", label: "Noise · 3", kind: "corruption", variants: 3 },
  { id: "blur", label: "Blur · 4", kind: "corruption", variants: 4 },
  { id: "weather", label: "Weather · 3", kind: "corruption", variants: 3 },
  { id: "digital", label: "Digital · 5", kind: "corruption", variants: 5 },
  { id: "fgsm", label: "FGSM", kind: "gradient", variants: 1 },
  { id: "pgd", label: "PGD", kind: "gradient", variants: 1 },
  { id: "mi-fgsm", label: "MI-FGSM", kind: "gradient", variants: 1 },
  { id: "cw", label: "C&W", kind: "gradient", variants: 1 },
  { id: "patch", label: "Adversarial patch", kind: "gradient", variants: 1 },
];
