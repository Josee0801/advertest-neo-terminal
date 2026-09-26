# AdverTest

AdverTest is an operational control plane for adversarial and corruption robustness testing of perception models. It combines experiment planning, deterministic worker execution, failure analysis, safety review, report sign-off, GPU budget control, and an immutable audit model.

The root route contains the product homepage. The interactive assurance console is available at `/console`.

## Product flows

- Dashboard with clean mAP, mPC, rPC, failure count, risk index, and run state.
- Experiment builder for YOLO-first model adapters, KITTI/COCO/nuScenes datasets, 15 common corruptions, FGSM, PGD, MI-FGSM, C&W, and adversarial patches.
- Deterministic worker simulator behind the same adapter contract expected by a real GPU runner.
- Live run monitor with cache accounting, early-stop planning, budget caps, and event stream.
- Clean/attacked sample comparison, perturbation overlays, robustness matrix, breaking point, and Top-K failures.
- Failure-case triage with verdict, mitigation, notes, and reviewer workflow.
- DRAFT to VALIDATED report gate, role checks, privacy-safe export policy, and audit events.
- Desktop-first responsive UI; mutating actions are guarded in mobile read-only mode.

## Architecture

```text
app/                  Vinext routes and JSON APIs
components/           Homepage and interactive AdverTest console
db/                   Drizzle D1 schema
drizzle/              Generated D1 migrations
lib/engine/           Model/attack contracts and deterministic runner
tests/                Simulator contract tests
```

The production integration seam is `lib/engine/contracts.ts`. A FastAPI/Celery/GPU service can implement the same `ExperimentRunner` and event contract without changing the UI workflow.

## Local development

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/` for the homepage or `http://localhost:5173/console` for the product console.

## Validation

```powershell
npm run lint
npm run build
node --experimental-strip-types --test tests/simulator.test.mjs
```

## API surface

- `GET|POST /api/experiments`
- `POST /api/experiments/:id/start`
- `POST /api/failure-cases/:id/verdict`
- `POST /api/reports/:id/sign`

## Research basis

The implementation follows the supplied brief, PRD, UI flow, team contract workbook, and the Robust Detection Benchmark paper. The paper's 15 corruptions across five severity levels, clean performance, mean performance under corruption (mPC), and relative performance under corruption (rPC) are first-class product concepts.
