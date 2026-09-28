from pathlib import Path
from typing import Any

from PIL import Image

from advertest_ml_core.types import Detection

KITTI_CLASS_ALIASES = {
    "car": "Car",
    "person": "Pedestrian",
    "truck": "Truck",
    "bus": "Bus",
}


class YoloAdapter:
    """Ultralytics YOLO adapter; imports the heavyweight runtime only when loaded."""

    def __init__(self, weights: str, device: str = "cpu") -> None:
        self.weights = weights
        self.device = device
        self._model: Any | None = None

    def load(self) -> None:
        try:
            from ultralytics import YOLO
        except ImportError as error:
            raise RuntimeError(
                "YOLO dependencies are missing. Install with: pip install -e '.[yolo]'"
            ) from error
        self._model = YOLO(self.weights)

    def predict(self, image: Image.Image | Path, confidence: float = 0.25) -> list[Detection]:
        if self._model is None:
            self.load()
        source: Image.Image | str = image if isinstance(image, Image.Image) else str(image)
        result = self._model.predict(source=source, device=self.device, conf=confidence, verbose=False)[0]
        if result.boxes is None:
            return []
        names = result.names
        detections: list[Detection] = []
        for box in result.boxes:
            class_id = int(box.cls.item())
            raw_name = str(names[class_id])
            class_name = KITTI_CLASS_ALIASES.get(raw_name.casefold(), raw_name)
            coordinates = tuple(float(value) for value in box.xyxy[0].tolist())
            detections.append(
                Detection(
                    box=coordinates,
                    score=float(box.conf.item()),
                    class_name=class_name,
                )
            )
        return detections
