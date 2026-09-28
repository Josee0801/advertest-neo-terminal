"use client";

import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import {
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { AttackSelector } from "../attack-selector";
import { attackCatalog } from "../config";
import type { Locale } from "../types";

type ExperimentBuilderProps = {
  locale: Locale;
  onStart: () => void;
};

const builderCopy = {
  vi: {
    config: "Cấu hình benchmark",
    configDetail: "Cấu hình tái lập · seed 42",
    name: "TÊN THÍ NGHIỆM",
    model: "MODEL",
    dataset: "DATASET",
    profile: "METRIC PROFILE",
    attacks: "Danh mục tấn công",
    attackDetail: "Chọn hoặc bỏ chọn từng nhóm attack",
    budget: "Budget & stopping",
    budgetDetail: "Ước lượng theo đúng số attack đã chọn",
    severity: "Severity tối đa",
    samples: "Số sample",
    planner: "Two-stage planner + successive halving",
    plannerDetail: "Dừng sớm cấu hình không có tín hiệu sau 20% budget",
    cache: "Tái sử dụng cache theo spec_hash",
    cacheDetail: "Không chạy lại clean prediction và corruption trùng",
    estimate: "ƯỚC LƯỢNG RUN",
    variants: "Variants",
    inference: "Inference",
    gpuTime: "Thời gian A100",
    saving: "Tiết kiệm cache",
    total: "Dự toán tối đa",
    budgetOk: "Budget còn lại đủ. Hard cap: $48.00.",
    run: "Xác nhận & chạy",
    audit: "Config sẽ được đóng dấu SHA-256 và lưu audit log.",
    selectAttack: "Chọn ít nhất một attack để chạy.",
    hours: "giờ",
  },
  en: {
    config: "Benchmark configuration",
    configDetail: "Reproducible configuration · seed 42",
    name: "EXPERIMENT NAME",
    model: "MODEL",
    dataset: "DATASET",
    profile: "METRIC PROFILE",
    attacks: "Attack catalog",
    attackDetail: "Select or deselect each attack family",
    budget: "Budget & stopping",
    budgetDetail: "Estimate based on the attacks currently selected",
    severity: "Maximum severity",
    samples: "Samples",
    planner: "Two-stage planner + successive halving",
    plannerDetail: "Stop low-signal configurations after 20% of budget",
    cache: "Reuse cache by spec_hash",
    cacheDetail: "Avoid rerunning matching clean predictions and corruptions",
    estimate: "RUN ESTIMATE",
    variants: "Variants",
    inference: "Inference",
    gpuTime: "A100 time",
    saving: "Cache saving",
    total: "Maximum estimate",
    budgetOk: "Remaining budget is sufficient. Hard cap: $48.00.",
    run: "Confirm & run",
    audit: "The config is SHA-256 stamped and written to the audit log.",
    selectAttack: "Select at least one attack to start.",
    hours: "hours",
  },
} as const;

function BuilderSection({ index, title, detail }: { index: string; title: string; detail: string }) {
  return (
    <div className="section-title">
      <div>
        <span className="section-index">{index}</span>
        <h2>{title}</h2>
      </div>
      <p>{detail}</p>
    </div>
  );
}

export function ExperimentBuilder({ locale, onStart }: ExperimentBuilderProps) {
  const copy = builderCopy[locale];
  const [severity, setSeverity] = useState(5);
  const [samples, setSamples] = useState(2000);
  const [advanced, setAdvanced] = useState(true);
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [selectedAttacks, setSelectedAttacks] = useState<Set<string>>(
    () => new Set(["noise", "blur", "weather", "digital", "fgsm", "pgd"]),
  );

  const selectedVariants = useMemo(
    () => attackCatalog.reduce((total, attack) => total + (selectedAttacks.has(attack.id) ? attack.variants : 0), 0),
    [selectedAttacks],
  );
  const variantCount = severity * selectedVariants;
  const inferenceCount = samples * variantCount;
  const estimate = useMemo(
    () => +(samples * severity * selectedVariants * (advanced ? 0.000117 : 0.000067)).toFixed(2),
    [advanced, samples, selectedVariants, severity],
  );

  const toggleAttack = (id: string) => {
    setSelectedAttacks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="builder-layout">
      <section className="min-w-0">
        <BuilderSection index="01" title={copy.config} detail={copy.configDetail} />
        <div className="form-panel">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <label className="mui-field-label">
              {copy.name}
              <TextField fullWidth size="small" defaultValue="KITTI weather + adversarial sweep" variant="filled" />
            </label>
            <label className="mui-field-label">
              {copy.model}
              <FormControl fullWidth size="small" variant="filled">
                <Select defaultValue="yolov8n">
                  <MenuItem value="yolov8n">YOLOv8n · v8.2.14</MenuItem>
                  <MenuItem value="yolov8m">YOLOv8m · v8.2.14</MenuItem>
                  <MenuItem value="faster-rcnn">Faster R-CNN · R50-FPN</MenuItem>
                </Select>
              </FormControl>
            </label>
            <label className="mui-field-label">
              {copy.dataset}
              <FormControl fullWidth size="small" variant="filled">
                <Select defaultValue="kitti">
                  <MenuItem value="kitti">KITTI val · 7,481 images</MenuItem>
                  <MenuItem value="coco">COCO 2017 val · 5,000 images</MenuItem>
                  <MenuItem value="nuscenes">nuScenes mini · 6,019 frames</MenuItem>
                </Select>
              </FormControl>
            </label>
            <label className="mui-field-label">
              {copy.profile}
              <FormControl fullWidth size="small" variant="filled">
                <Select defaultValue="detection">
                  <MenuItem value="detection">Detection · mAP50 / mPC / rPC</MenuItem>
                  <MenuItem value="segmentation">Segmentation · mIoU / ASR</MenuItem>
                </Select>
              </FormControl>
            </label>
          </div>
        </div>

        <BuilderSection index="02" title={copy.attacks} detail={copy.attackDetail} />
        <AttackSelector selected={selectedAttacks} onToggle={toggleAttack} />

        <BuilderSection index="03" title={copy.budget} detail={copy.budgetDetail} />
        <div className="form-panel space-y-5">
          <div className="slider-row">
            <label>{copy.severity} <b>{severity}</b></label>
            <Slider min={1} max={5} value={severity} onChange={(_, value) => setSeverity(value as number)} />
          </div>
          <div className="slider-row">
            <label>{copy.samples} <b>{samples.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}</b></label>
            <Slider min={200} max={5000} step={200} value={samples} onChange={(_, value) => setSamples(value as number)} />
          </div>
          <FormControlLabel
            className="mui-switch-row"
            control={<Switch checked={advanced} onChange={(event) => setAdvanced(event.target.checked)} />}
            label={<span><b>{copy.planner}</b><small>{copy.plannerDetail}</small></span>}
          />
          <FormControlLabel
            className="mui-switch-row"
            control={<Switch checked={cacheEnabled} onChange={(event) => setCacheEnabled(event.target.checked)} />}
            label={<span><b>{copy.cache}</b><small>{copy.cacheDetail}</small></span>}
          />
        </div>
      </section>

      <aside className="estimate-card">
        <p>{copy.estimate}</p>
        <h3>ADV-2026-091</h3>
        <dl>
          <div><dt>{copy.variants}</dt><dd>{variantCount}</dd></div>
          <div><dt>{copy.inference}</dt><dd>{inferenceCount.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")}</dd></div>
          <div><dt>{copy.gpuTime}</dt><dd>{(estimate / 2.4).toFixed(1)} {copy.hours}</dd></div>
          <div><dt>{copy.saving}</dt><dd className="good">{cacheEnabled ? "-31%" : "0%"}</dd></div>
        </dl>
        <div className="cost-total"><span>{copy.total}</span><strong>${estimate}</strong></div>
        <p className="estimate-note"><VerifiedUserRounded fontSize="small" /> {selectedVariants ? copy.budgetOk : copy.selectAttack}</p>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowRounded />}
          disabled={selectedVariants === 0}
          onClick={onStart}
          className="builder-run-button"
        >
          {copy.run}
        </Button>
        <small>{copy.audit}</small>
      </aside>
    </div>
  );
}
