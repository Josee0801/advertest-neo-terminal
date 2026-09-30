"use client";

import { useEffect, useRef, useState } from "react";
import {
  CloseRounded,
  PauseRounded,
  PlayArrowRounded,
  RestartAltRounded,
  TuneRounded,
} from "@mui/icons-material";

type FilterId = "signal" | "thermal" | "radar" | "mono";
type FieldMode = "attract" | "repel" | "orbit";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  colorIndex: number;
};

const filters: Array<{ id: FilterId; label: string; colors: [string, string, string] }> = [
  { id: "signal", label: "Signal", colors: ["#f36a2d", "#6ba9ff", "#76d49b"] },
  { id: "thermal", label: "Thermal", colors: ["#ff6b45", "#ffb15c", "#ff5470"] },
  { id: "radar", label: "Radar", colors: ["#69d5ff", "#76d49b", "#e5f4ed"] },
  { id: "mono", label: "Mono", colors: ["#f2ecdf", "#aaa298", "#f36a2d"] },
];

const fieldModes: Array<{ id: FieldMode; label: string }> = [
  { id: "attract", label: "Hút" },
  { id: "repel", label: "Đẩy" },
  { id: "orbit", label: "Quỹ đạo" },
];

function hexToRgba(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<FilterId>("signal");
  const [fieldMode, setFieldMode] = useState<FieldMode>("attract");
  const [paused, setPaused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const palette = filters.find((item) => item.id === filter)?.colors ?? filters[0].colors;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.28, active: false, pulse: 0 };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameId = 0;
    let hidden = document.hidden;

    const seedParticles = () => {
      const count = Math.min(76, Math.max(30, Math.round((width * height) / 22000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: 0.8 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        colorIndex: index % palette.length,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      seedParticles();
    };

    const draw = (animate: boolean) => {
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, Math.max(320, width * 0.36));
      glow.addColorStop(0, hexToRgba(palette[0], pointer.active ? 0.16 : 0.09));
      glow.addColorStop(0.46, hexToRgba(palette[1], pointer.active ? 0.07 : 0.04));
      glow.addColorStop(1, "rgba(17, 16, 15, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (animate) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const influence = pointer.active && distance < 290 ? (1 - distance / 290) * 0.024 : 0;

          if (influence) {
            if (fieldMode === "orbit") {
              particle.vx += (-dy / distance) * influence;
              particle.vy += (dx / distance) * influence;
            } else {
              const direction = fieldMode === "repel" ? -1 : 1;
              particle.vx += (dx / distance) * influence * direction;
              particle.vy += (dy / distance) * influence * direction;
            }
          }

          particle.phase += 0.008;
          particle.vx += Math.cos(particle.phase) * 0.0018;
          particle.vy += Math.sin(particle.phase * 0.87) * 0.0018;
          particle.vx *= 0.986;
          particle.vy *= 0.986;
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < -20) particle.x = width + 20;
          if (particle.x > width + 20) particle.x = -20;
          if (particle.y < -20) particle.y = height + 20;
          if (particle.y > height + 20) particle.y = -20;
        }

        for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
          const other = particles[otherIndex];
          const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (distance > 138) continue;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = hexToRgba(palette[(particle.colorIndex + other.colorIndex) % palette.length], (1 - distance / 138) * 0.11);
          context.lineWidth = 0.7;
          context.stroke();
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = hexToRgba(palette[particle.colorIndex], 0.46 + Math.sin(particle.phase) * 0.12);
        context.fill();
      }

      if (pointer.pulse > 0.01) {
        const radius = 24 + (1 - pointer.pulse) * 190;
        context.beginPath();
        context.arc(pointer.x, pointer.y, radius, 0, Math.PI * 2);
        context.strokeStyle = hexToRgba(palette[0], pointer.pulse * 0.46);
        context.lineWidth = 1.5;
        context.stroke();
        if (animate) pointer.pulse *= 0.94;
      }
    };

    const tick = () => {
      draw(!paused && !reducedMotion.matches && !hidden);
      if (!paused && !reducedMotion.matches && !hidden) frameId = window.requestAnimationFrame(tick);
    };

    const restart = () => {
      window.cancelAnimationFrame(frameId);
      draw(false);
      if (!paused && !reducedMotion.matches && !hidden) frameId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      pointer.pulse = 1;
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) pointer.active = false;
    };

    const handleVisibility = () => {
      hidden = document.hidden;
      restart();
    };

    resize();
    restart();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reducedMotion.addEventListener("change", restart);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("visibilitychange", handleVisibility);
      reducedMotion.removeEventListener("change", restart);
    };
  }, [fieldMode, filter, paused, revision]);

  const activeFilter = filters.find((item) => item.id === filter) ?? filters[0];

  return (
    <>
      <div className="interactive-background-visual" data-filter={filter} aria-hidden="true">
        <canvas ref={canvasRef} />
        <span className="interactive-background-scanline" />
      </div>

      <button
        type="button"
        className="background-lab-trigger"
        aria-expanded={panelOpen}
        aria-controls="background-lab-panel"
        onClick={() => setPanelOpen((open) => !open)}
      >
        <TuneRounded aria-hidden="true" />
        <span>
          <b>Nền tương tác</b>
          <small>{activeFilter.label} · {fieldModes.find((item) => item.id === fieldMode)?.label}</small>
        </span>
      </button>

      {panelOpen ? (
        <section id="background-lab-panel" className="background-lab-panel" aria-label="Tùy chỉnh nền tương tác">
          <div className="background-lab-heading">
            <div>
              <span>BACKGROUND LAB</span>
              <strong>Signal field</strong>
            </div>
            <button type="button" aria-label="Đóng bảng tùy chỉnh nền" onClick={() => setPanelOpen(false)}>
              <CloseRounded aria-hidden="true" />
            </button>
          </div>

          <div className="background-lab-section" role="group" aria-label="Bộ lọc màu">
            <span>Bộ lọc</span>
            <div className="background-lab-options background-lab-options--filter">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={filter === item.id}
                  onClick={() => setFilter(item.id)}
                >
                  <i style={{ background: `linear-gradient(135deg, ${item.colors.join(", ")})` }} aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="background-lab-section" role="group" aria-label="Hiệu ứng trường lực">
            <span>Hiệu ứng con trỏ</span>
            <div className="background-lab-options">
              {fieldModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={fieldMode === item.id}
                  onClick={() => setFieldMode(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="background-lab-footer">
            <p>Di chuyển con trỏ để bẻ trường tín hiệu. Click hoặc chạm để tạo xung.</p>
            <div>
              <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
                {paused ? <PlayArrowRounded aria-hidden="true" /> : <PauseRounded aria-hidden="true" />}
                {paused ? "Tiếp tục" : "Tạm dừng"}
              </button>
              <button type="button" onClick={() => setRevision((value) => value + 1)}>
                <RestartAltRounded aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
