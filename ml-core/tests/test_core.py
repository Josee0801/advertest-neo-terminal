import tempfile
import unittest
from pathlib import Path

from PIL import Image

from advertest_ml_core.adapters.yolo import KITTI_CLASS_ALIASES
from advertest_ml_core.attacks.corruption import apply_corruption
from advertest_ml_core.datasets.kitti import load_kitti, parse_kitti_labels, parse_yolo_kitti_labels
from advertest_ml_core.metrics.detection import evaluate_map50, find_failures, intersection_over_union
from advertest_ml_core.pipeline import evaluate_kitti
from advertest_ml_core.types import Detection, GroundTruth, KittiSample


class KittiReaderTests(unittest.TestCase):
    def test_yolo_class_names_normalize_to_kitti_labels(self) -> None:
        self.assertEqual(KITTI_CLASS_ALIASES["car"], "Car")
        self.assertEqual(KITTI_CLASS_ALIASES["pedestrian"], "Pedestrian")
        self.assertEqual(KITTI_CLASS_ALIASES["cyclist"], "Cyclist")

    def test_parses_supported_kitti_objects_and_ignores_other_classes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "000000.txt"
            path.write_text(
                "Car 0 0 0 10 20 50 80 1 1 1 0 0 0 0\n"
                "DontCare -1 -1 -10 0 0 5 5 0 0 0 0 0 0 0\n",
                encoding="utf-8",
            )
            labels = parse_kitti_labels(path)
        self.assertEqual(len(labels), 1)
        self.assertEqual(labels[0].class_name, "Car")
        self.assertEqual(labels[0].box, (10.0, 20.0, 50.0, 80.0))

    def test_loads_standard_image_and_label_layout(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "training/image_2").mkdir(parents=True)
            (root / "training/label_2").mkdir(parents=True)
            (root / "training/image_2/000001.png").touch()
            (root / "training/label_2/000001.txt").write_text("Pedestrian 0 0 0 1 2 8 12 1 1 1 0 0 0 0\n", encoding="utf-8")
            sample = next(load_kitti(root, limit=1))
        self.assertEqual(sample.image_id, "000001")
        self.assertEqual(sample.ground_truth[0].class_name, "Pedestrian")

    def test_loads_ultralytics_kitti_yolo_layout_and_converts_boxes(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "images/train").mkdir(parents=True)
            (root / "labels/train").mkdir(parents=True)
            Image.new("RGB", (20, 10)).save(root / "images/train/000001.png")
            (root / "labels/train/000001.txt").write_text(
                "0 0.5 0.5 0.5 0.5\n5 0.25 0.5 0.2 0.4\n1 0.5 0.5 0.2 0.2\n",
                encoding="utf-8",
            )
            sample = next(load_kitti(root, split="training", limit=1))
        self.assertEqual(sample.image_id, "000001")
        self.assertEqual([item.class_name for item in sample.ground_truth], ["Car", "Cyclist"])
        self.assertEqual(sample.ground_truth[0].box, (5.0, 2.5, 15.0, 7.5))
        self.assertEqual(sample.ground_truth[1].box, (3.0, 3.0, 7.0, 7.0))

    def test_yolo_label_parser_rejects_unknown_class_id(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "sample.txt"
            path.write_text("8 0.5 0.5 0.2 0.2\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "unknown KITTI class id"):
                parse_yolo_kitti_labels(path, (20, 10))


class DetectionMetricTests(unittest.TestCase):
    def test_iou_and_perfect_map(self) -> None:
        box = (0.0, 0.0, 10.0, 10.0)
        self.assertEqual(intersection_over_union(box, box), 1.0)
        metrics = evaluate_map50(
            {"one": [Detection(box, 0.9, "Car")]},
            {"one": [GroundTruth(box, "Car")]},
        )
        self.assertEqual(metrics["map50"], 1.0)
        self.assertEqual(metrics["per_class_ap50"], {"Car": 1.0})

    def test_missed_ground_truth_is_reported(self) -> None:
        failures = find_failures({}, {"one": [GroundTruth((0, 0, 2, 2), "Pedestrian")]})
        self.assertEqual(failures, [{"image_id": "one", "class_name": "Pedestrian", "failure": "missed_detection"}])

    def test_duplicate_prediction_is_false_positive(self) -> None:
        box = (0.0, 0.0, 10.0, 10.0)
        metrics = evaluate_map50(
            {"one": [Detection((20.0, 20.0, 30.0, 30.0), 0.95, "Car"), Detection(box, 0.9, "Car")]},
            {"one": [GroundTruth(box, "Car")]},
        )
        self.assertLess(metrics["map50"], 1.0)


class CorruptionAndPipelineTests(unittest.TestCase):
    def test_corruption_is_reproducible(self) -> None:
        image = Image.new("RGB", (32, 24), (100, 100, 100))
        first = apply_corruption(image, "gaussian_noise", severity=3, seed=7)
        second = apply_corruption(image, "gaussian_noise", severity=3, seed=7)
        self.assertEqual(first.tobytes(), second.tobytes())

    def test_pipeline_reports_clean_and_attacked_failure(self) -> None:
        class BrightnessSensitiveDetector:
            def predict(self, image: Image.Image, confidence: float = 0.25) -> list[Detection]:
                if image.getpixel((0, 0))[0] < 130:
                    return [Detection((1, 1, 15, 15), 0.9, "Car")]
                return []

        with tempfile.TemporaryDirectory() as directory:
            image_path = Path(directory) / "sample.png"
            Image.new("RGB", (20, 20), (100, 100, 100)).save(image_path)
            sample = KittiSample("sample", image_path, (GroundTruth((1, 1, 15, 15), "Car"),))
            result = evaluate_kitti(BrightnessSensitiveDetector(), [sample], corruption="fog", severity=5)

        self.assertEqual(result["metrics"]["clean_map50"], 1.0)
        self.assertEqual(result["metrics"]["attacked_map50"], 0.0)
        self.assertEqual(result["failure_cases"][0]["failure"], "missed_detection")


if __name__ == "__main__":
    unittest.main()
