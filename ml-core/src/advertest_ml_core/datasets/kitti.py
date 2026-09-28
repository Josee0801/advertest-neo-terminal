from pathlib import Path
from collections.abc import Iterator

from advertest_ml_core.types import GroundTruth, KittiSample

SUPPORTED_CLASSES = frozenset({"Car", "Pedestrian", "Cyclist"})


def parse_kitti_labels(label_path: Path, classes: frozenset[str] = SUPPORTED_CLASSES) -> tuple[GroundTruth, ...]:
    """Parse KITTI object labels, retaining only classes used by the MVP."""
    ground_truth: list[GroundTruth] = []
    with label_path.open(encoding="utf-8") as labels:
        for line_number, line in enumerate(labels, start=1):
            fields = line.split()
            if not fields:
                continue
            if len(fields) < 8:
                raise ValueError(f"{label_path}:{line_number}: expected at least 8 KITTI fields")
            class_name = fields[0]
            if class_name not in classes:
                continue
            try:
                box = tuple(float(value) for value in fields[4:8])
            except ValueError as error:
                raise ValueError(f"{label_path}:{line_number}: invalid bounding box") from error
            x1, y1, x2, y2 = box
            if x2 <= x1 or y2 <= y1:
                raise ValueError(f"{label_path}:{line_number}: bounding box must have positive area")
            ground_truth.append(GroundTruth(box=box, class_name=class_name))
    return tuple(ground_truth)


def load_kitti(root: Path, split: str = "training", limit: int | None = None) -> Iterator[KittiSample]:
    """Iterate KITTI object-detection samples from a standard dataset directory."""
    image_dir = root / split / "image_2"
    label_dir = root / split / "label_2"
    if not image_dir.is_dir():
        raise FileNotFoundError(f"KITTI image directory not found: {image_dir}")
    if not label_dir.is_dir():
        raise FileNotFoundError(f"KITTI label directory not found: {label_dir}")
    if limit is not None and limit < 1:
        raise ValueError("limit must be at least 1")

    paths = sorted(image_dir.glob("*.png"))
    if limit is not None:
        paths = paths[:limit]
    if not paths:
        raise ValueError(f"No PNG images found in {image_dir}")

    for image_path in paths:
        label_path = label_dir / f"{image_path.stem}.txt"
        if not label_path.is_file():
            raise FileNotFoundError(f"KITTI label file not found: {label_path}")
        yield KittiSample(
            image_id=image_path.stem,
            image_path=image_path,
            ground_truth=parse_kitti_labels(label_path),
        )
