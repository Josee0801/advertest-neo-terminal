import argparse
import json
from dataclasses import asdict
from pathlib import Path
from typing import Sequence

from PIL import Image

from advertest_ml_core.adapters.yolo import YoloAdapter
from advertest_ml_core.attacks.corruption import CORRUPTIONS
from advertest_ml_core.datasets.kitti import load_kitti
from advertest_ml_core.pipeline import evaluate_kitti


def _write_json(payload: object, output: Path | None) -> None:
    rendered = json.dumps(payload, indent=2, ensure_ascii=False)
    if output is None:
        print(rendered)
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")
        print(f"Wrote results to {output}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="advertest-ml", description="AdverTest perception ML Core")
    commands = parser.add_subparsers(dest="command", required=True)

    infer = commands.add_parser("infer", help="Run YOLO inference on a single image")
    infer.add_argument("--image", type=Path, required=True)
    infer.add_argument("--weights", default="yolov8n.pt")
    infer.add_argument("--device", default="cpu")
    infer.add_argument("--confidence", type=float, default=0.25)
    infer.add_argument("--output", type=Path)

    evaluate = commands.add_parser("evaluate-kitti", help="Compare clean and corrupted KITTI detections")
    evaluate.add_argument("--dataset-root", type=Path, required=True)
    evaluate.add_argument("--split", default="training")
    evaluate.add_argument("--limit", type=int, default=100)
    evaluate.add_argument("--weights", default="yolov8n.pt")
    evaluate.add_argument("--device", default="cpu")
    evaluate.add_argument("--confidence", type=float, default=0.25)
    evaluate.add_argument("--corruption", choices=CORRUPTIONS, default="snow")
    evaluate.add_argument("--severity", type=int, choices=range(1, 6), default=3)
    evaluate.add_argument("--seed", type=int, default=42)
    evaluate.add_argument("--output", type=Path, default=Path("outputs/kitti-evaluation.json"))
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if not 0 < args.confidence <= 1:
        raise SystemExit("--confidence must be in (0, 1]")
    adapter = YoloAdapter(args.weights, args.device)
    if args.command == "infer":
        if not args.image.is_file():
            raise SystemExit(f"Image does not exist: {args.image}")
        with Image.open(args.image) as opened:
            detections = adapter.predict(opened.convert("RGB"), args.confidence)
        _write_json({"image": str(args.image), "detections": [asdict(item) for item in detections]}, args.output)
        return 0

    samples = load_kitti(args.dataset_root, args.split, args.limit)
    result = evaluate_kitti(
        adapter,
        samples,
        corruption=args.corruption,
        severity=args.severity,
        seed=args.seed,
        confidence=args.confidence,
    )
    result["model"] = {"adapter": "ultralytics-yolo", "weights": args.weights, "device": args.device}
    result["dataset"] = {"adapter": "kitti", "split": args.split, "limit": args.limit}
    _write_json(result, args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
