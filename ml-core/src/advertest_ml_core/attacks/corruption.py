from typing import Literal

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

CorruptionName = Literal["fog", "snow", "gaussian_noise", "blur"]
CORRUPTIONS: tuple[CorruptionName, ...] = ("fog", "snow", "gaussian_noise", "blur")


def apply_corruption(image: Image.Image, name: CorruptionName, severity: int, seed: int = 42) -> Image.Image:
    """Apply a deterministic, severity-scaled image corruption (severity 1..5)."""
    if severity not in range(1, 6):
        raise ValueError("severity must be between 1 and 5")
    source = image.convert("RGB")
    strength = severity / 5
    if name == "fog":
        haze = Image.new("RGB", source.size, (224, 228, 230))
        return Image.blend(source, haze, 0.12 + 0.48 * strength)
    if name == "blur":
        return source.filter(ImageFilter.GaussianBlur(radius=0.5 + 2.5 * strength))
    if name == "gaussian_noise":
        pixels = np.asarray(source, dtype=np.float32)
        rng = np.random.default_rng(seed)
        noise = rng.normal(0, 4 + 24 * strength, pixels.shape)
        return Image.fromarray(np.clip(pixels + noise, 0, 255).astype(np.uint8))
    if name == "snow":
        overlay = Image.new("RGBA", source.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        rng = np.random.default_rng(seed)
        width, height = source.size
        count = int(width * height * (0.0004 + 0.002 * strength))
        for _ in range(count):
            x = int(rng.integers(0, width))
            y = int(rng.integers(0, height))
            radius = int(rng.integers(1, 2 + severity))
            alpha = int(rng.integers(100, 230))
            draw.ellipse((x, y, x + radius, y + radius), fill=(255, 255, 255, alpha))
        snowy = Image.alpha_composite(source.convert("RGBA"), overlay).convert("RGB")
        return ImageEnhance.Brightness(snowy).enhance(1 + 0.08 * strength)
    raise ValueError(f"unsupported corruption: {name}")
