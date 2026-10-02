from pathlib import Path
from collections.abc import Iterator
from math import isfinite

from PIL import Image

from advertest_ml_core.types import GroundTruth, KittiSample

SUPPORTED_CLASSES = frozenset({
    "Car",
    "Van",
    "Truck",
    "Pedestrian",
    "Person_sitting",
    "Cyclist",
    "Tram",
    "Misc",
})
YOLO_KITTI_CLASS_NAMES = (
    "Car",
    "Van",
    "Truck",
    "Pedestrian",
    "Person_sitting",
    "Cyclist",
    "Tram",
    "Misc",
)


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


def parse_yolo_kitti_labels(
    label_path: Path,
    image_size: tuple[int, int],
    classes: frozenset[str] = SUPPORTED_CLASSES,
) -> tuple[GroundTruth, ...]:
    """Parse Ultralytics KITTI labels and convert normalized xywh boxes to pixel xyxy."""
    image_width, image_height = image_size
    ground_truth: list[GroundTruth] = []
    with label_path.open(encoding="utf-8") as labels:
        for line_number, line in enumerate(labels, start=1):
            fields = line.split()
            if not fields:
                continue
            if len(fields) != 5:
                raise ValueError(f"{label_path}:{line_number}: expected class and normalized xywh")
            try:
                class_id = int(fields[0])
                center_x, center_y, width, height = (float(value) for value in fields[1:])
            except ValueError as error:
                raise ValueError(f"{label_path}:{line_number}: invalid YOLO label") from error
            if not 0 <= class_id < len(YOLO_KITTI_CLASS_NAMES):
                raise ValueError(f"{label_path}:{line_number}: unknown KITTI class id {class_id}")
            class_name = YOLO_KITTI_CLASS_NAMES[class_id]
            if class_name not in classes:
                continue
            if not all(isfinite(value) for value in (center_x, center_y, width, height)):
                raise ValueError(f"{label_path}:{line_number}: box values must be finite")
            if width <= 0 or height <= 0:
                raise ValueError(f"{label_path}:{line_number}: box dimensions must be positive")
            box = (
                (center_x - width / 2) * image_width,
                (center_y - height / 2) * image_height,
                (center_x + width / 2) * image_width,
                (center_y + height / 2) * image_height,
            )
            ground_truth.append(GroundTruth(box=box, class_name=class_name))
    return tuple(ground_truth)


def load_kitti(root: Path, split: str = "training", limit: int | None = None) -> Iterator[KittiSample]:
    """Iterate samples from original KITTI or Ultralytics KITTI directory layouts."""
    if limit is not None and limit < 1:
        raise ValueError("limit must be at least 1")

    yolo_split = {"training": "train", "validation": "val"}.get(split, split)
    yolo_image_dir = root / "images" / yolo_split
    yolo_label_dir = root / "labels" / yolo_split
    if yolo_image_dir.is_dir() and yolo_label_dir.is_dir():
        image_paths = sorted(
            path for path in yolo_image_dir.iterdir()
            if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png"}
        )
        if limit is not None:
            image_paths = image_paths[:limit]
        if not image_paths:
            raise ValueError(f"No supported images found in {yolo_image_dir}")

        for image_path in image_paths:
            label_path = yolo_label_dir / f"{image_path.stem}.txt"
            if not label_path.is_file():
                raise FileNotFoundError(f"YOLO KITTI label file not found: {label_path}")
            with Image.open(image_path) as image:
                image_size = image.size
            yield KittiSample(
                image_id=image_path.stem,
                image_path=image_path,
                ground_truth=parse_yolo_kitti_labels(label_path, image_size),
            )
        return

    image_dir = root / split / "image_2"
    label_dir = root / split / "label_2"
    if not image_dir.is_dir():
        raise FileNotFoundError(f"KITTI image directory not found: {image_dir}")
    if not label_dir.is_dir():
        raise FileNotFoundError(f"KITTI label directory not found: {label_dir}")
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
