export type Detection = { boxes: Array<[number, number, number, number]>; scores: number[]; labels: number[] };
export interface ModelAdapter {
  readonly classNames: string[];
  load(weights: string, device: string): Promise<void>;
  predict(input: Float32Array, shape: [number, number, number, number]): Promise<Detection>;
  attackLoss(input: Float32Array, targets: Detection): Promise<number>;
}
export type AttackSpec = { family: "corruption" | "occlusion" | "gradient" | "patch"; name: string; params: Record<string, number | string | boolean>; severity: 1 | 2 | 3 | 4 | 5; seed: number };
export type RunEvent = { experimentId: string; runId: string; state: "queued" | "running" | "paused" | "complete" | "failed"; done: number; total: number; gpuSeconds: number; costUsd: number; message: string; timestamp: string };
export type ExperimentConfig = {
  id: string; name: string;
  model: { adapter: "yolo" | "sam2" | "mmdetection3d"; weights: string };
  dataset: { adapter: "kitti" | "nuscenes" | "coco"; split: string; sampleLimit: number };
  attacks: AttackSpec[]; budget: { hardCapUsd: number; earlyStop: boolean; useCache: boolean };
};
export interface ExperimentRunner { run(config: ExperimentConfig, onEvent: (event: RunEvent) => void, shouldRun?: (spec: AttackSpec) => boolean): Promise<void> }
