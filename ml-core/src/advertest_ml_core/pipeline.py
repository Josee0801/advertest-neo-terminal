from collections.abc import Iterable
from pathlib import Path
from typing import Any, Protocol

from PIL import Image

from advertest_ml_core.attacks.corruption import CorruptionName, apply_corruption
from advertest_ml_core.metrics.detection import evaluate_map50, find_failures
from advertest_ml_core.types import Detection, KittiSample


class ImageDetector(Protocol):
    def predict(self, image: Image.Image | Path, confidence: float = 0.25) -> list[Detection]: ...


def evaluate_kitti(
    detector: ImageDetector,
    samples: Iterable[KittiSample],
    *,
    corruption: CorruptionName = "snow",
    severity: int = 3,
    seed: int = 42,
    confidence: float = 0.25,
) -> dict[str, Any]:
    """Evaluate clean and corrupted KITTI images and return JSON-compatible results."""
    clean_predictions: dict[str, list[Detection]] = {}
    attacked_predictions: dict[str, list[Detection]] = {}
    ground_truth: dict[str, tuple] = {}
    sample_count = 0
    for sample in samples:
        with Image.open(sample.image_path) as opened:
            image = opened.convert("RGB")
        clean_predictions[sample.image_id] = detector.predict(image, confidence)
        attacked = apply_corruption(image, corruption, severity, seed + sample_count)
        attacked_predictions[sample.image_id] = detector.predict(attacked, confidence)
        ground_truth[sample.image_id] = sample.ground_truth
        sample_count += 1
    if sample_count == 0:
        raise ValueError("No KITTI samples were provided")

    clean_metrics = evaluate_map50(clean_predictions, ground_truth)
    attacked_metrics = evaluate_map50(attacked_predictions, ground_truth)
    clean_map = float(clean_metrics["map50"])
    attacked_map = float(attacked_metrics["map50"])
    return {
        "schema_version": 1,
        "samples": sample_count,
        "attack": {"family": "corruption", "name": corruption, "severity": severity, "seed": seed},
        "metrics": {
            "clean_map50": clean_map,
            "attacked_map50": attacked_map,
            "retention_percent": attacked_map / clean_map * 100 if clean_map else 0.0,
            "clean_per_class_ap50": clean_metrics["per_class_ap50"],
            "attacked_per_class_ap50": attacked_metrics["per_class_ap50"],
        },
        "failure_cases": find_failures(attacked_predictions, ground_truth),
    }
