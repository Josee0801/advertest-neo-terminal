from dataclasses import dataclass
from pathlib import Path
from typing import TypeAlias

Box: TypeAlias = tuple[float, float, float, float]


@dataclass(frozen=True)
class Detection:
    box: Box
    score: float
    class_name: str


@dataclass(frozen=True)
class GroundTruth:
    box: Box
    class_name: str


@dataclass(frozen=True)
class KittiSample:
    image_id: str
    image_path: Path
    ground_truth: tuple[GroundTruth, ...]
