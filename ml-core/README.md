# AdverTest ML Core

Standalone Python package for real YOLO inference and a first KITTI robustness-evaluation loop. It stays separate from the Next.js/Cloudflare runtime.

## MVP scope

- Ultralytics YOLO image inference with CPU as the default device.
- KITTI Object Detection reader for both original `training/image_2` + `training/label_2` and Ultralytics `images/{train,val}` + `labels/{train,val}` layouts, evaluating all 8 KITTI classes.
- Reproducible fog, snow, Gaussian-noise, and blur corruptions at severity 1-5.
- Clean and attacked mAP@IoU 0.50, retention, and missed-object failure cases in JSON.

The Ultralytics KITTI label IDs use this order: Car, Van, Truck, Pedestrian, Person_sitting, Cyclist, Tram, Misc. The evaluator includes all 8 classes. The pretrained `yolov8n.pt` weights use COCO classes. The adapter maps COCO `person` to KITTI `Pedestrian`; it deliberately does not map `bicycle` to `Cyclist`, because those labels are not equivalent. Use the committed KITTI-fine-tuned checkpoint for evaluation across all 8 classes. These corruption transforms are weather/image corruptions, not gradient-based adversarial attacks such as FGSM or PGD.

## Install on Windows PowerShell

From the repository root:

```powershell
py -3.13 -m venv .venv-ml
.\.venv-ml\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e ".\ml-core[yolo]"
```

The first YOLO invocation downloads the selected model weights if they are not already available. An internet connection is needed for this first download. CPU inference is the default; GPU support depends on installing a compatible PyTorch/CUDA build for the machine.

## Run one-image inference

```powershell
advertest-ml infer --image .\path\to\image.png --weights yolov8n.pt --device cpu --output .\outputs\prediction.json
```

## Evaluate a labeled KITTI subset

Extract KITTI Object Detection so the root contains `training/image_2` and `training/label_2`, or use the Ultralytics export with `images/train`, `images/val`, `labels/train`, and `labels/val`. For the Ultralytics layout extracted at `D:\build phase`, run:

```powershell
advertest-ml evaluate-kitti --dataset-root "D:\build phase" --split train --limit 100 --weights yolov8n.pt --corruption snow --severity 3 --seed 42 --output .\outputs\kitti-snow-s3.json
```

The command runs clean and corrupted inference on the same subset. KITTI test images do not provide public labels, so use the labeled training set (or a properly held-out labeled subset) for metrics. Do not use the same images for tuning and final evaluation.

## Tests

From `ml-core` after installation:

```powershell
python -m unittest discover -s tests -v
```

The data reader, IoU, AP calculation, and failure reporting tests do not download weights or require a GPU.
