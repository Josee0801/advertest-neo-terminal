from collections.abc import Mapping, Sequence

from advertest_ml_core.types import Detection, GroundTruth


def intersection_over_union(left: tuple[float, float, float, float], right: tuple[float, float, float, float]) -> float:
    x1 = max(left[0], right[0])
    y1 = max(left[1], right[1])
    x2 = min(left[2], right[2])
    y2 = min(left[3], right[3])
    intersection = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    left_area = max(0.0, left[2] - left[0]) * max(0.0, left[3] - left[1])
    right_area = max(0.0, right[2] - right[0]) * max(0.0, right[3] - right[1])
    union = left_area + right_area - intersection
    return intersection / union if union else 0.0


def _average_precision(true_positives: list[int], false_positives: list[int], ground_truth_count: int) -> float:
    if ground_truth_count == 0:
        return 0.0
    cumulative_tp: list[int] = []
    cumulative_fp: list[int] = []
    total_tp = total_fp = 0
    for true_positive, false_positive in zip(true_positives, false_positives):
        total_tp += true_positive
        total_fp += false_positive
        cumulative_tp.append(total_tp)
        cumulative_fp.append(total_fp)
    recalls = [value / ground_truth_count for value in cumulative_tp]
    precisions = [tp / (tp + fp) for tp, fp in zip(cumulative_tp, cumulative_fp)]
    return sum(max((p for p, r in zip(precisions, recalls) if r >= threshold), default=0.0)
               for threshold in (step / 100 for step in range(101))) / 101


def evaluate_map50(
    predictions: Mapping[str, Sequence[Detection]],
    ground_truth: Mapping[str, Sequence[GroundTruth]],
    iou_threshold: float = 0.5,
) -> dict[str, object]:
    """Compute class-wise AP@IoU 0.50 with 101-point interpolated precision."""
    if not 0 < iou_threshold <= 1:
        raise ValueError("iou_threshold must be in (0, 1]")
    classes = sorted({item.class_name for items in ground_truth.values() for item in items})
    per_class: dict[str, float] = {}
    for class_name in classes:
        gt_by_image = {
            image_id: [item for item in items if item.class_name == class_name]
            for image_id, items in ground_truth.items()
        }
        matched = {image_id: [False] * len(items) for image_id, items in gt_by_image.items()}
        ranked = sorted(
            ((item.score, image_id, item) for image_id, items in predictions.items()
             for item in items if item.class_name == class_name),
            key=lambda row: row[0], reverse=True,
        )
        true_positives: list[int] = []
        false_positives: list[int] = []
        for _, image_id, prediction in ranked:
            candidates = gt_by_image.get(image_id, [])
            overlaps = [intersection_over_union(prediction.box, target.box) for target in candidates]
            best_index = max(range(len(overlaps)), key=overlaps.__getitem__, default=-1)
            if best_index >= 0 and overlaps[best_index] >= iou_threshold and not matched[image_id][best_index]:
                matched[image_id][best_index] = True
                true_positives.append(1)
                false_positives.append(0)
            else:
                true_positives.append(0)
                false_positives.append(1)
        count = sum(len(items) for items in gt_by_image.values())
        per_class[class_name] = _average_precision(true_positives, false_positives, count)
    mean_ap = sum(per_class.values()) / len(per_class) if per_class else 0.0
    return {"map50": mean_ap, "per_class_ap50": per_class, "class_count": len(per_class)}


def find_failures(
    predictions: Mapping[str, Sequence[Detection]],
    ground_truth: Mapping[str, Sequence[GroundTruth]],
    iou_threshold: float = 0.5,
) -> list[dict[str, str]]:
    """Return unmatched ground-truth objects, ordered by image and label order."""
    failures: list[dict[str, str]] = []
    for image_id, targets in ground_truth.items():
        for target in targets:
            candidates = [item for item in predictions.get(image_id, ()) if item.class_name == target.class_name]
            if not any(intersection_over_union(item.box, target.box) >= iou_threshold for item in candidates):
                failures.append({"image_id": image_id, "class_name": target.class_name, "failure": "missed_detection"})
    return failures
