"use client";

import { useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Slider,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import {
  ArrowForwardRounded,
  AutoGraphRounded,
  BoltRounded,
  CheckCircleRounded,
  ChevronRightRounded,
  CloseRounded,
  FactCheckRounded,
  FingerprintRounded,
  GraphicEqRounded,
  HubRounded,
  LanguageRounded,
  LockRounded,
  MenuRounded,
  MemoryRounded,
  PlayArrowRounded,
  ScienceRounded,
  VolumeOffRounded,
} from "@mui/icons-material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const colors = {
  black: "#0a0a0b",
  surface: "#111214",
  surfaceSoft: "#17191b",
  white: "#f7f7f4",
  muted: "#9a9d9b",
  teal: "#00cc99",
  tealDark: "#0d9b8a",
  orange: "#fe4a22",
  amber: "#e8a317",
  lime: "#bdee63",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.orange, contrastText: colors.white },
    secondary: { main: colors.white, contrastText: colors.black },
    success: { main: colors.teal },
    warning: { main: colors.amber },
    background: { default: colors.black, paper: colors.surface },
    text: { primary: colors.white, secondary: colors.muted },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Manrope Variable", sans-serif',
    button: { fontWeight: 750, textTransform: "none", letterSpacing: "-0.02em" },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { border: 0, boxShadow: "none", backgroundImage: "none" } } },
    MuiButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
          boxShadow: "none",
          minHeight: 42,
          paddingInline: 20,
          transition: "transform .25s ease, background-color .25s ease, color .25s ease",
          "&:hover": { border: 0, boxShadow: "none", transform: "translateY(-2px)" },
        },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiCard: { styleOverrides: { root: { border: 0, boxShadow: "none", backgroundImage: "none" } } },
    MuiChip: { styleOverrides: { root: { border: 0, fontWeight: 750 } } },
    MuiDrawer: { styleOverrides: { paper: { border: 0, backgroundImage: "none" } } },
    MuiIconButton: { styleOverrides: { root: { border: 0 } } },
    MuiOutlinedInput: { styleOverrides: { notchedOutline: { border: 0 } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 12, background: "#202225", fontSize: 12 } } },
  },
});

const navItems = [
  ["Nền tảng", "#platform"],
  ["Workflow", "#workflow"],
  ["Governance", "#governance"],
  ["Kiến trúc", "#architecture"],
];

const severityData = [
  { map: 68.4, retention: 94, cost: 4.2, label: "Light fog" },
  { map: 61.9, retention: 85, cost: 7.8, label: "Rain + blur" },
  { map: 52.6, retention: 72, cost: 12.4, label: "Dense fog" },
  { map: 40.2, retention: 55, cost: 18.42, label: "Snow / S4" },
  { map: 27.3, retention: 38, cost: 24.7, label: "PGD + weather" },
];

const chartData = [72.8, 71.9, 70.8, 69.4, 67.7, 65.8, 63.1, 60.4, 57.8, 54.2, 49.8, 45.6, 40.2];

const capabilityCards = [
  { icon: <ScienceRounded />, kicker: "ATTACK ENGINE", title: "Một catalog kiểm thử, nhiều kiểu thất bại", body: "Corruption, occlusion, FGSM, PGD và adversarial patch cùng dùng một AttackSpec có version và spec_hash tái lập.", meta: "20+ attack & corruption" },
  { icon: <AutoGraphRounded />, kicker: "FAILURE ANALYSIS", title: "Nhìn thấy điểm gãy, không chỉ một con số mAP", body: "So sánh clean/attacked, đường cong retention, robustness matrix và Top-K failure để drill-down tới từng sample.", meta: "mAP · IoU · ASR · rPC" },
  { icon: <MemoryRounded />, kicker: "BUDGET CONTROL", title: "GPU budget là một phần của thiết kế thí nghiệm", body: "Ước tính trước khi chạy, hard cap theo USD/GPU-minute, cache baseline và successive halving để dừng nhánh kém giá trị.", meta: "31% cache saving" },
  { icon: <FactCheckRounded />, kicker: "HUMAN REVIEW", title: "Reviewer biến failure case thành quyết định", body: "Triage theo mức nghiêm trọng, verdict và mitigation có người chịu trách nhiệm; người chạy không thể tự ký kết quả.", meta: "Separation of duties" },
];

const workflow = [
  ["01", "Baseline", "Khóa model, dataset slice, seed và clean prediction."],
  ["02", "Stress", "Quét corruption/adversarial theo severity và budget."],
  ["03", "Measure", "Tính delta, retention, breaking point và failure cases."],
  ["04", "Triage", "Reviewer gán verdict, mitigation và ghi chú."],
  ["05", "Sign-off", "Chỉ report đủ gate mới chuyển sang VALIDATED."],
];

const sourcePatterns = [
  ["Armory / ART", "Attack orchestration", "Engine"],
  ["FiftyOne", "Sample-level failure UX", "Explore"],
  ["RobustBench", "Metric discipline", "Benchmark"],
  ["SafeBench / MetAdv", "Perception scenario thinking", "Safety"],
];

function Brand() {
  return (
    <Box component="a" href="#top" className="flex items-center gap-2.5 no-underline">
      <Box className="brand-mark grid h-8 w-8 place-items-center rounded-full bg-white text-[#0a0a0b]">
        <FingerprintRounded className="!text-[18px]" />
      </Box>
      <Typography component="span" className="!text-[13px] !font-extrabold !tracking-[-0.045em] !text-white">ADVERTEST</Typography>
    </Box>
  );
}

function StatusDot({ tone = "lime" }: { tone?: "lime" | "teal" | "orange" }) {
  const toneClass = tone === "teal" ? "bg-[#00cc99] shadow-[0_0_10px_#00cc99]" : tone === "orange" ? "bg-[#fe4a22] shadow-[0_0_10px_#fe4a22]" : "bg-[#bdee63] shadow-[0_0_10px_#bdee63]";
  return <span className={`status-dot inline-block h-2 w-2 rounded-full ${toneClass}`} />;
}

function SectionHeading({ eyebrow, title, copy, align = "left" }: { eyebrow: string; title: string; copy: string; align?: "left" | "center" }) {
  return (
    <Box className={`reveal ${align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}`}>
      <Chip icon={<StatusDot />} label={eyebrow} className="terminal-label !h-8 !bg-white/[0.045] !px-1 !text-[10px] !tracking-[0.15em] !text-white/62" />
      <Typography component="h2" className="!mt-6 !text-[clamp(2.5rem,5.6vw,5.9rem)] !font-[650] !leading-[0.92] !tracking-[-0.07em] !text-white">{title}</Typography>
      <Typography className={`!mt-7 !text-[16px] !leading-7 !text-white/48 md:!text-[18px] ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{copy}</Typography>
    </Box>
  );
}

function MetricTile({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "teal" | "orange" }) {
  const valueClass = tone === "teal" ? "!text-[#00cc99]" : tone === "orange" ? "!text-[#fe6b48]" : "!text-white";
  return (
    <Box className="metric-tile rounded-[14px] bg-white/[0.045] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.055)]">
      <Typography className="terminal-label !text-[9px] !font-extrabold !uppercase !tracking-[0.14em] !text-white/34">{label}</Typography>
      <Typography className={`metric-value !mt-1 !text-[22px] !font-extrabold !tracking-[-0.05em] ${valueClass}`}>{value}</Typography>
    </Box>
  );
}

function LiveChart({ severity }: { severity: number }) {
  const [hoverIndex, setHoverIndex] = useState(8);
  const width = 900;
  const height = 320;
  const points = chartData.map((value, index) => ({
    x: 26 + (index / (chartData.length - 1)) * (width - 52),
    y: 30 + ((75 - value) / 40) * (height - 72),
    value,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const areaPath = `${linePath} L${points.at(-1)?.x},${height - 22} L${points[0].x},${height - 22} Z`;
  const active = points[hoverIndex];

  return (
    <Box
      className="chart-stage relative min-h-[290px] overflow-hidden rounded-[18px] bg-[#0d1010]"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        setHoverIndex(Math.round(ratio * (points.length - 1)));
      }}
      onMouseLeave={() => setHoverIndex(Math.min(12, severity * 2 + 2))}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Đường cong robustness theo severity">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00cc99" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#00cc99" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-shimmer" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0d9b8a" />
            <stop offset="45%" stopColor="#00cc99" />
            <stop offset="56%" stopColor="#ffffff" />
            <stop offset="66%" stopColor="#00cc99" />
            <stop offset="100%" stopColor="#0d9b8a" />
            <animate attributeName="x1" values="-1;1" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="x2" values="0;2" dur="3.2s" repeatCount="indefinite" />
          </linearGradient>
          <pattern id="grid" width="74" height="54" patternUnits="userSpaceOnUse">
            <path d="M 74 0 L 0 0 0 54" fill="none" stroke="rgba(255,255,255,.055)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line x1="0" x2={width} y1="78" y2="78" stroke="#bdee63" strokeOpacity=".45" strokeDasharray="4 7" />
        <line x1="0" x2={width} y1="232" y2="232" stroke="#e8a317" strokeOpacity=".38" strokeDasharray="4 7" />
        <path d={areaPath} fill="url(#area-fill)" />
        <path d={linePath} fill="none" stroke="url(#line-shimmer)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={active.x} x2={active.x} y1="18" y2={height - 22} stroke="#ffffff" strokeOpacity=".34" strokeDasharray="3 6" />
        <circle cx={active.x} cy={active.y} r="7" fill="#00cc99" stroke="#ffffff" strokeWidth="3" />
      </svg>
      <Box className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#151818]/80 px-3 py-1.5 backdrop-blur-xl">
        <StatusDot tone="teal" />
        <Typography className="terminal-label !text-[9px] !font-bold !tracking-[0.12em] !text-white/58">ROBUSTNESS RETENTION</Typography>
      </Box>
      <Box className="absolute right-4 top-4 rounded-xl bg-[#191c1c]/90 px-3 py-2 text-right backdrop-blur-xl">
        <Typography className="terminal-label !text-[8px] !font-bold !tracking-[0.12em] !text-white/34">SEVERITY {hoverIndex}</Typography>
        <Typography className="!mt-0.5 !text-lg !font-extrabold !tracking-[-0.04em] !text-[#00cc99]">{active.value.toFixed(1)} mAP</Typography>
      </Box>
      <Typography className="terminal-label !absolute !left-3 !top-[67px] !text-[8px] !font-bold !text-[#bdee63]/65">GOAL 70%</Typography>
      <Typography className="terminal-label !absolute !bottom-[70px] !left-3 !text-[8px] !font-bold !text-[#e8a317]/65">WARN 45%</Typography>
    </Box>
  );
}

function OperationsConsole() {
  const [severity, setSeverity] = useState(4);
  const data = severityData[severity - 1];

  return (
    <Card className="morph-shell !overflow-hidden !rounded-[26px] !bg-[#101213]/95 !text-white shadow-[0_55px_160px_rgba(0,0,0,.72)] backdrop-blur-2xl">
      <Box className="console-chrome flex items-center justify-between bg-white/[0.035] px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#fe4a22]" /><i className="h-2.5 w-2.5 rounded-full bg-[#e8a317]" /><i className="h-2.5 w-2.5 rounded-full bg-[#00cc99]" /></div>
        <div className="flex items-center gap-3"><Typography className="terminal-label !hidden !text-[9px] !font-bold !tracking-[0.14em] !text-white/30 sm:!block">MAHJONGAI / OPERATIONS</Typography><Chip icon={<StatusDot />} label="PROD" className="terminal-label !h-7 !bg-white/[0.055] !text-[9px] !tracking-[0.12em] !text-white/62" /></div>
      </Box>
      <div className="grid lg:grid-cols-[190px_1fr]">
        <Box className="console-chrome hidden bg-[#0c0e0f] p-4 lg:flex lg:flex-col">
          <div className="flex items-center justify-between"><Typography className="terminal-label !text-[9px] !font-extrabold !tracking-[0.15em] !text-white/35">ADVERTEST</Typography><Chip label="SCOUT" className="!h-6 !bg-[#00cc99]/12 !text-[8px] !text-[#00cc99]" /></div>
          <div className="mt-8 space-y-1.5">
            {["Dashboard", "Experiments", "Failure cases", "Review queue", "Reports", "Alerts"].map((item, index) => (
              <Box key={item} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${index === 0 ? "bg-white/[0.075] text-white" : "text-white/34"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? "bg-[#00cc99]" : "bg-white/20"}`} />
                <Typography className="!text-[10px] !font-bold">{item}</Typography>
              </Box>
            ))}
          </div>
          <Box className="mt-auto rounded-[16px] bg-[#00cc99]/8 p-3">
            <div className="flex items-center gap-2"><StatusDot tone="teal" /><Typography className="terminal-label !text-[8px] !font-bold !tracking-[0.1em] !text-[#00cc99]">RUN HEALTHY</Typography></div>
            <Typography className="!mt-2 !text-2xl !font-extrabold !tracking-[-0.05em]">69%</Typography>
            <Typography className="!text-[9px] !text-white/28">GPU budget remaining</Typography>
          </Box>
        </Box>
        <CardContent className="!p-4 sm:!p-6 lg:!p-7">
          <div className="console-chrome mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><Typography className="terminal-label !text-[9px] !font-bold !tracking-[0.15em] !text-[#00cc99]">LIVE ROBUSTNESS CONSOLE</Typography><Typography className="!mt-2 !text-2xl !font-[720] !tracking-[-0.05em]">Breaking-point analysis</Typography></div>
            <Chip icon={<BoltRounded />} label={`GPU $${data.cost}`} className="!w-fit !bg-[#fe4a22]/12 !text-[#ff8b70] [&_.MuiChip-icon]:!text-[#fe4a22]" />
          </div>
          <LiveChart severity={severity} />
          <div className="console-chrome mt-3 grid grid-cols-3 gap-2"><MetricTile label="Clean mAP" value="72.8" /><MetricTile label="Attacked" value={data.map.toFixed(1)} tone="orange" /><MetricTile label="Retention" value={`${data.retention}%`} tone="teal" /></div>
          <Box className="console-chrome mt-3 rounded-[16px] bg-white/[0.035] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]">
            <div className="flex items-center justify-between"><Typography className="!text-xs !font-bold !text-white/52">Attack severity · {data.label}</Typography><Typography className="terminal-label !text-[10px] !font-extrabold !tracking-[0.1em] !text-[#fe7a5b]">S{severity}</Typography></div>
            <Slider aria-label="Attack severity" min={1} max={5} step={1} value={severity} marks onChange={(_, value) => setSeverity(value as number)} sx={{ mt: 1, color: colors.orange, "& .MuiSlider-rail": { backgroundColor: "rgba(255,255,255,.12)" }, "& .MuiSlider-thumb": { width: 17, height: 17, boxShadow: "0 0 0 7px rgba(254,74,34,.12)" } }} />
          </Box>
        </CardContent>
      </div>
    </Card>
  );
}

function ParticleGlobe() {
  const dots = Array.from({ length: 76 }, (_, index) => {
    const angle = (index * 137.5 * Math.PI) / 180;
    const radius = 18 + (index % 9) * 5.2;
    return {
      x: (100 + Math.cos(angle) * radius).toFixed(4),
      y: (100 + Math.sin(angle) * radius * 0.72).toFixed(4),
      size: index % 7 === 0 ? "2.8" : "1.7",
      opacity: (0.34 + (index % 5) * 0.13).toFixed(2),
    };
  });
  return (
    <Box className="globe-wrap relative mx-auto aspect-square w-full max-w-[520px]">
      <Box className="absolute inset-[10%] rounded-full bg-[#00cc99]/10 blur-[60px]" />
      <svg viewBox="0 0 200 200" className="globe-svg relative h-full w-full" role="img" aria-label="Coverage globe for robustness conditions">
        <ellipse cx="100" cy="100" rx="75" ry="54" fill="none" stroke="rgba(255,255,255,.07)" />
        <ellipse cx="100" cy="100" rx="44" ry="74" fill="none" stroke="rgba(255,255,255,.055)" />
        <ellipse cx="100" cy="100" rx="74" ry="24" fill="none" stroke="rgba(255,255,255,.055)" />
        {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.size} fill={index % 11 === 0 ? "#fe4a22" : index % 5 === 0 ? "#bdee63" : "#00cc99"} opacity={dot.opacity} />)}
      </svg>
    </Box>
  );
}

function FloatingTeaser() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <Card className="pip-card !fixed !bottom-5 !right-5 !z-40 !hidden !w-[270px] !overflow-hidden !rounded-[20px] !bg-[#17191b]/88 !text-white shadow-[0_22px_70px_rgba(0,0,0,.5)] backdrop-blur-2xl lg:!block">
      <Box className="relative h-32 overflow-hidden bg-[#0e1514]">
        <Box className="pip-grid absolute inset-0" />
        <svg viewBox="0 0 270 128" className="absolute inset-0 h-full w-full">
          <path d="M0 98 C42 92, 55 62, 92 70 S151 30, 190 49 S232 30, 270 18" fill="none" stroke="#00cc99" strokeWidth="3" />
          <path d="M0 98 C42 92, 55 62, 92 70 S151 30, 190 49 S232 30, 270 18 L270 128 L0 128Z" fill="url(#pip-fill)" opacity=".25" />
          <defs><linearGradient id="pip-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#00cc99" /><stop offset="1" stopColor="#00cc99" stopOpacity="0" /></linearGradient></defs>
        </svg>
        <IconButton aria-label="Đóng video demo" onClick={() => setOpen(false)} className="!absolute !right-2 !top-2 !h-8 !w-8 !bg-black/45 !text-white"><CloseRounded className="!text-base" /></IconButton>
        <Button href="/console" aria-label="Mở console demo" className="!absolute !bottom-3 !left-3 !min-h-9 !bg-white !px-3 !text-[#0a0a0b]" startIcon={<PlayArrowRounded />}>1:08</Button>
      </Box>
      <CardContent className="!p-4"><Typography className="terminal-label !text-[8px] !font-bold !tracking-[0.14em] !text-[#bdee63]">PRODUCT TOUR</Typography><Typography className="!mt-1 !text-sm !font-extrabold">Từ attack sweep tới VALIDATED.</Typography></CardContent>
    </Card>
  );
}

export function Homepage() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduceMotion } = context.conditions as { desktop: boolean; reduceMotion: boolean };
      if (reduceMotion) {
        gsap.set([".hero-copy > *", ".morph-shell", ".console-chrome", ".reveal"], { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }
      gsap.timeline({ defaults: { ease: "power3.out" } }).from(".hero-copy > *", { autoAlpha: 0, y: 28, duration: 0.72, stagger: 0.08 }).from(".morph-shell", { autoAlpha: 0, y: 70, scale: 1.06, duration: 1 }, "<0.2");
      ScrollTrigger.batch(".reveal", { start: "top 88%", once: true, interval: 0.08, batchMax: desktop ? 4 : 2, onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.1, ease: "power3.out", overwrite: true }) });
      if (desktop) {
        gsap.timeline({ scrollTrigger: { trigger: ".morph-section", start: "top top", end: "+=900", pin: true, scrub: 0.8, anticipatePin: 1 } })
          .to(".hero-copy", { y: -100, autoAlpha: 0.12, scale: 0.93, ease: "none" }, 0)
          .fromTo(".morph-shell", { scale: 1.09, borderRadius: 0 }, { scale: 0.82, borderRadius: 28, ease: "none" }, 0)
          .fromTo(".console-chrome", { autoAlpha: 0.2 }, { autoAlpha: 1, ease: "none" }, 0.15);
      }
      gsap.fromTo(".pipeline-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".workflow-track", start: "top 75%", end: "bottom 65%", scrub: 0.7 } });
      gsap.to(".globe-svg", { rotation: 360, transformOrigin: "50% 50%", duration: 48, repeat: -1, ease: "none" });
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box ref={root} component="main" id="top" className="homepage min-h-screen overflow-hidden bg-[#0a0a0b] text-white">
        <Box className="header-blur-mask pointer-events-none fixed inset-x-0 top-0 z-40 h-28" />
        <AppBar position="fixed" color="transparent" className="!z-50 !bg-transparent">
          <Toolbar className="mx-auto flex !min-h-[58px] w-full max-w-[1360px] justify-between !px-5 lg:!px-8">
            <Brand />
            <nav className="sibling-dim hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">{navItems.map(([label, href]) => <Button key={href} href={href} className="!min-h-9 !px-4 !text-xs !font-bold !text-white/52 hover:!bg-white/[0.045] hover:!text-white">{label}</Button>)}</nav>
            <div className="hidden items-center gap-2 sm:flex"><Button href="/console" className="!min-h-9 !px-4 !text-xs !text-white/56">Đăng nhập</Button><Button href="#contact" variant="contained" endIcon={<ArrowForwardRounded />} className="!min-h-10 !bg-white !text-xs !text-[#0a0a0b] hover:!bg-[#fe4a22] hover:!text-white">Xem demo</Button></div>
            <IconButton aria-label="Mở menu" onClick={() => setMenuOpen(true)} className="!bg-white !text-[#0a0a0b] sm:!hidden"><MenuRounded /></IconButton>
          </Toolbar>
        </AppBar>

        <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
          <Box className="h-full w-[86vw] max-w-sm bg-[#101213] p-5 text-white">
            <div className="flex items-center justify-between"><Brand /><IconButton aria-label="Đóng menu" onClick={() => setMenuOpen(false)} className="!bg-white/[0.06] !text-white"><CloseRounded /></IconButton></div>
            <List className="!mt-8">{navItems.map(([label, href]) => <ListItemButton component="a" href={href} key={href} onClick={() => setMenuOpen(false)} className="!mb-2 !rounded-2xl !bg-white/[0.035] !py-3"><ListItemText primary={<Typography className="!font-bold">{label}</Typography>} /><ChevronRightRounded className="!text-[#00cc99]" /></ListItemButton>)}</List>
            <Button href="/console" fullWidth variant="contained" className="!mt-6 !bg-white !text-[#0a0a0b]">Mở product console</Button>
          </Box>
        </Drawer>

        <FloatingTeaser />

        <section className="morph-section relative min-h-screen">
          <div className="morph-pin flex min-h-screen flex-col justify-center px-5 pb-10 pt-28 lg:px-10">
            <Box className="pointer-events-none absolute left-1/2 top-[-20rem] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#00cc99]/8 blur-[130px]" />
            <div className="hero-copy relative mx-auto flex max-w-[1180px] flex-col items-center text-center">
              <Chip icon={<StatusDot tone="teal" />} label="PERCEPTION ASSURANCE / LIVE" className="terminal-label !bg-white/[0.045] !text-[10px] !tracking-[0.15em] !text-white/58" />
              <Typography component="h1" className="!mt-7 !max-w-[1180px] !text-[clamp(3.4rem,8.4vw,8.3rem)] !font-[650] !leading-[0.84] !tracking-[-0.085em]">Biết model sẽ gãy ở đâu <span className="text-[#00cc99]">trước khi ra đường.</span></Typography>
              <Typography className="!mt-7 !max-w-3xl !text-[17px] !leading-8 !text-white/48 md:!text-xl">Class-leading perception assurance tự động cải thiện <span className="rotating-metric inline-grid h-[1.35em] overflow-hidden align-bottom !font-extrabold !text-white"><span>Robustness Retention</span><span>Failure Coverage</span><span>Release Confidence</span><span>Robustness Retention</span></span>.</Typography>
              <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"><Button href="/console" variant="contained" size="large" endIcon={<PlayArrowRounded />} className="!bg-white !text-[#0a0a0b] hover:!bg-[#fe4a22] hover:!text-white">Khám phá console</Button><Button href="#workflow" size="large" endIcon={<ArrowForwardRounded />} className="!bg-white/[0.045] !text-white">Xem workflow</Button></div>
            </div>
            <div className="relative mx-auto mt-12 w-full max-w-[1380px] lg:mt-16"><OperationsConsole /></div>
          </div>
          <div className="fold-blur pointer-events-none absolute inset-x-0 bottom-0 h-36" />
        </section>

        <section className="logo-marquee relative overflow-hidden py-7"><div className="marquee-track flex w-max items-center gap-14 whitespace-nowrap px-6 text-sm font-extrabold tracking-[-0.03em] text-white/38 md:gap-20 md:text-base">{["YOLO", "KITTI", "nuScenes", "PyTorch", "W&B", "COCO metrics", "Armory", "FiftyOne", "YOLO", "KITTI", "nuScenes", "PyTorch", "W&B", "COCO metrics", "Armory", "FiftyOne"].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></section>

        <section id="platform" className="px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading eyebrow="01 / THE GAP" title="Accuracy sạch không phải là assurance." copy="Các tool hiện tại giải quyết từng lát cắt: engine attack, benchmark hoặc sample explorer. AdverTest nối các lát cắt đó thành một quy trình có ngân sách, người review và bằng chứng ký duyệt." />
            <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-12">{capabilityCards.map((card, index) => <Card key={card.title} className={`glass-card reveal group !rounded-[26px] !text-white ${index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5"}`}><CardContent className="flex h-full min-h-[350px] flex-col !p-7 md:!p-9"><div className="flex items-start justify-between gap-4"><Box className={`grid h-12 w-12 place-items-center rounded-full ${index === 3 ? "bg-[#fe4a22] text-white" : "bg-white/[0.065] text-[#00cc99]"}`}>{card.icon}</Box><Typography className="terminal-label !text-[10px] !font-bold !tracking-[0.14em] !text-white/22">0{index + 1}</Typography></div><Typography className="terminal-label !mt-12 !text-[9px] !font-extrabold !tracking-[0.17em] !text-white/38">{card.kicker}</Typography><Typography component="h3" className="!mt-3 !max-w-xl !text-[clamp(1.75rem,3vw,3rem)] !font-[650] !leading-[1] !tracking-[-0.055em]">{card.title}</Typography><Typography className="!mt-5 !max-w-xl !text-sm !leading-6 !text-white/48">{card.body}</Typography><Chip label={card.meta} className="!mt-auto !w-fit !bg-white/[0.055] !text-white/62" /></CardContent></Card>)}</div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0d0f10] px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="reveal"><Chip icon={<LanguageRounded />} label="COVERAGE WITHOUT BLIND SPOTS" className="terminal-label !bg-[#fe4a22]/12 !text-[9px] !tracking-[0.14em] !text-[#ff8062] [&_.MuiChip-icon]:!text-[#fe4a22]" /><Typography component="h2" className="!mt-6 !text-[clamp(3rem,6vw,6.4rem)] !font-[650] !leading-[0.89] !tracking-[-0.075em]">Mọi điều kiện.<br />Mọi điểm gãy.</Typography><Typography className="!mt-7 !max-w-xl !text-base !leading-7 !text-white/46">Kiểm thử tự nhiên trên <span className="condition-rotator inline-grid h-[1.45em] overflow-hidden align-bottom !font-extrabold !text-[#00cc99]"><span>Fog & Rain</span><span>Snow & Blur</span><span>FGSM & PGD</span><span>Fog & Rain</span></span>, giữ cùng một metric contract và audit trail.</Typography><div className="mt-10 flex items-end gap-5"><Typography className="!text-[clamp(4rem,9vw,8rem)] !font-[650] !leading-none !tracking-[-0.08em]">20+</Typography><Typography className="terminal-label !pb-3 !text-[10px] !font-bold !uppercase !tracking-[0.14em] !text-white/35">attack & corruption<br />profiles</Typography></div><Button onClick={() => setSoundOn((value) => !value)} startIcon={soundOn ? <GraphicEqRounded /> : <VolumeOffRounded />} className="!mt-8 !bg-white/[0.055] !text-white/62">Sound {soundOn ? "on" : "off"}</Button></div>
            <div className="reveal"><ParticleGlobe /></div>
          </div>
        </section>

        <section id="workflow" className="px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading eyebrow="02 / CONTROLLED WORKFLOW" title="Từ benchmark tới quyết định release." copy="Mỗi bước tạo ra một artifact có thể truy vết. Không có nút tắt để đi vòng qua triage hoặc chữ ký của Safety Reviewer." />
            <div className="workflow-track relative mt-16"><Box className="absolute left-0 right-0 top-[31px] hidden h-0.5 origin-left bg-white/[0.055] md:block" /><Box className="pipeline-progress absolute left-0 right-0 top-[31px] hidden h-0.5 origin-left bg-[#00cc99] md:block" sx={{ transformOrigin: "left" }} /><div className="grid gap-3 md:grid-cols-5">{workflow.map(([number, title, copy], index) => <Card key={number} className={`workflow-card reveal !rounded-[22px] ${index === 4 ? "!bg-[#fe4a22] !text-white" : "glass-card !text-white"}`}><CardContent className="flex min-h-[300px] flex-col !p-6"><Box className={`relative z-10 grid h-16 w-16 place-items-center rounded-full text-xs font-extrabold ${index === 4 ? "bg-white text-[#0a0a0b]" : "bg-[#16191a] text-[#00cc99]"}`}>{number}</Box><Typography component="h3" className="!mt-10 !text-2xl !font-extrabold !tracking-[-0.045em]">{title}</Typography><Typography className={`!mt-3 !text-sm !leading-6 ${index === 4 ? "!text-white/70" : "!text-white/42"}`}>{copy}</Typography>{index === 4 ? <Chip icon={<LockRounded />} label="REVIEWER ONLY" className="!mt-auto !w-fit !bg-black/18 !text-white [&_.MuiChip-icon]:!text-white" /> : <ChevronRightRounded className="!mt-auto !text-white/22" />}</CardContent></Card>)}</div></div>
            <Button href="/console" variant="contained" className="reveal !mt-10 !bg-white !text-[#0a0a0b]" endIcon={<ArrowForwardRounded />}>Mở workflow demo</Button>
          </div>
        </section>

        <section id="governance" className="px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading eyebrow="03 / GOVERNANCE BY DESIGN" title="Không có chữ ký, không có kết luận." copy="AdverTest tách vai trò người chạy và người duyệt, khóa audit trail và watermark mọi report DRAFT. Privacy và dual-use controls nằm trong workflow, không phải checklist sau cùng." />
            <Card className="spotlight-card reveal !mt-16 !overflow-hidden !rounded-[28px] !bg-[#121416] !text-white"><div className="grid lg:grid-cols-[1.05fr_0.95fr]"><Box className="spotlight-visual relative min-h-[480px] overflow-hidden bg-[#fe4a22] p-8 md:p-12"><Box className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ffb19e]/35 blur-[60px]" /><Typography className="terminal-label relative !text-[10px] !font-bold !tracking-[0.16em] !text-white/66">RELEASE GATE / RPT-091</Typography><div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12"><Typography className="!text-[clamp(5rem,13vw,10rem)] !font-[650] !leading-[0.72] !tracking-[-0.1em]">12/12</Typography><Typography className="!mt-7 !text-xl !font-extrabold">Critical cases closed</Typography><Typography className="!mt-2 !max-w-md !text-sm !leading-6 !text-white/68">Mọi failure nghiêm trọng đều có verdict, owner và mitigation trước khi sign-off.</Typography></div></Box><CardContent className="flex flex-col !p-8 md:!p-12"><div className="flex items-start justify-between gap-4"><div><Typography className="terminal-label !text-[9px] !font-bold !tracking-[0.16em] !text-white/32">ASSURANCE REPORT</Typography><Typography className="!mt-3 !text-3xl !font-[650] !tracking-[-0.055em]">Release gate</Typography></div><Chip icon={<CheckCircleRounded />} label="VALIDATED" className="!bg-[#00cc99]/12 !text-[#00cc99] [&_.MuiChip-icon]:!text-[#00cc99]" /></div><div className="mt-10 grid grid-cols-3 gap-2"><MetricTile label="Reviewed" value="38/38" /><MetricTile label="Budget" value="$31.80" /><MetricTile label="Status" value="PASS" tone="teal" /></div><div className="mt-8 space-y-2">{["Config hash và metric version hợp lệ", "Failure case nghiêm trọng đã có mitigation", "Budget không vượt hard cap", "Artifact đã ẩn danh mặc định"].map((item) => <Box key={item} className="flex items-center gap-3 rounded-xl bg-white/[0.035] px-4 py-3"><CheckCircleRounded className="!text-lg !text-[#00cc99]" /><Typography className="!text-sm !font-bold !text-white/58">{item}</Typography></Box>)}</div><Box className="mt-auto flex items-center gap-4 pt-9"><Box className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0a0a0b]"><FingerprintRounded /></Box><div><Typography className="!text-sm !font-extrabold">Linh Nguyễn · Safety Reviewer</Typography><Typography className="terminal-label !mt-1 !text-[9px] !text-white/30">SIGNED 23 SEP 2026 · EVENT #418</Typography></div></Box></CardContent></div></Card>
          </div>
        </section>

        <section id="architecture" className="bg-[#0d0f10] px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"><SectionHeading eyebrow="04 / SELECTED PATTERNS" title="Không phát minh lại engine. Tập trung vào control plane." copy="Kiến trúc chọn lọc pattern mạnh nhất từ hệ sinh thái hiện có, rồi bổ sung phần còn thiếu: budget-aware orchestration, reviewer queue và assurance gate dành cho perception." /><HubRounded className="reveal !hidden !justify-self-end !text-[150px] !text-[#00cc99]/10 lg:!block" /></div>
            <div className="sibling-dim mt-16 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{sourcePatterns.map(([name, pattern, tag], index) => <Card key={name} className="source-card reveal glass-card !rounded-[22px] !text-white"><CardContent className="flex min-h-[250px] flex-col !p-7"><div className="flex items-center justify-between"><Chip label={tag} className="terminal-label !bg-white/[0.055] !text-[9px] !text-[#00cc99]" /><Typography className="terminal-label !text-[9px] !text-white/20">0{index + 1}</Typography></div><Typography component="h3" className="!mt-auto !text-2xl !font-extrabold !tracking-[-0.045em]">{name}</Typography><Typography className="!mt-2 !text-sm !text-white/38">{pattern}</Typography></CardContent></Card>)}</div>
            <Card className="reveal !mt-3 !overflow-hidden !rounded-[24px] !bg-[#00cc99] !text-[#07110e]"><CardContent className="relative grid gap-8 !p-8 md:grid-cols-[1fr_auto] md:items-center md:!p-12"><Box className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#bdee63]/55 blur-[60px]" /><div className="relative"><Typography className="terminal-label !text-[9px] !font-extrabold !tracking-[0.17em] !text-[#07110e]/52">ADVERTEST CONTROL PLANE</Typography><Typography className="!mt-4 !max-w-4xl !text-[clamp(2rem,4.5vw,4.5rem)] !font-[650] !leading-[0.94] !tracking-[-0.065em]">Attack engine + failure analysis + GPU economics + human assurance.</Typography></div><HubRounded className="relative !hidden !text-[92px] !text-[#07110e]/20 md:!block" /></CardContent></Card>
          </div>
        </section>

        <section id="contact" className="px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1100px] text-center"><SectionHeading eyebrow="MVP READY TO EXPLORE" title="Đưa perception qua một release gate đáng tin." copy="Bắt đầu với YOLO + KITTI/COCO, chạy benchmark có budget, triage các failure quan trọng và khóa report bằng reviewer sign-off." align="center" /><Box className="reveal mx-auto mt-10 flex max-w-xl items-center rounded-full bg-white/[0.055] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]"><OutlinedInput fullWidth placeholder="Email công việc của bạn" aria-label="Email công việc" className="!h-12 !rounded-full !px-3 !text-sm !text-white" endAdornment={<InputAdornment position="end"><IconButton component="a" href="mailto:team@advertest.dev" aria-label="Trao đổi về pilot" className="!h-10 !w-10 !bg-white !text-[#0a0a0b] hover:!bg-[#fe4a22] hover:!text-white"><ArrowForwardRounded /></IconButton></InputAdornment>} /></Box><Button href="/console" variant="contained" size="large" endIcon={<PlayArrowRounded />} className="reveal !mt-5 !bg-[#fe4a22] !text-white">Mở console demo</Button></div>
        </section>

        <footer className="px-5 pb-8 pt-12 lg:px-10">
          <div className="divider-fade mx-auto mb-10 h-px max-w-[1280px]" />
          <div className="mx-auto max-w-[1280px]"><div className="grid gap-10 md:grid-cols-[1.1fr_1.9fr]"><div><Brand /><Typography className="!mt-5 !max-w-sm !text-sm !leading-6 !text-white/34">Perception robustness testing · Human-reviewed assurance · 2026</Typography><div className="mt-7 flex flex-wrap gap-2">{[["SOC 2", "Audit controls and access logging"], ["ISO 42001", "AI management system aligned"], ["ISO 27001", "Information security controls"]].map(([label, tip]) => <Tooltip key={label} title={tip} arrow><Chip icon={<StatusDot />} label={label} className="terminal-label !bg-white/[0.04] !text-[9px] !tracking-[0.1em] !text-white/48" /></Tooltip>)}</div></div><div className="sibling-dim grid grid-cols-2 gap-8 sm:grid-cols-4">{[["Product", "Nền tảng", "Workflow", "Console"], ["Assurance", "Governance", "Audit trail", "Reports"], ["Resources", "Architecture", "Benchmarks", "Documentation"], ["Company", "Security", "Privacy", "Contact"]].map(([title, ...links]) => <div key={title}><Typography className="terminal-label !text-[9px] !font-bold !uppercase !tracking-[0.15em] !text-white/28">{title}</Typography><div className="mt-4 flex flex-col gap-3">{links.map((link) => <Button key={link} href={link === "Console" ? "/console" : "#platform"} className="!min-h-0 !justify-start !p-0 !text-sm !font-semibold !text-white/52">{link}</Button>)}</div></div>)}</div></div><div className="mt-12 flex flex-col justify-between gap-4 text-xs text-white/24 sm:flex-row"><span>© 2026 AdverTest</span><span>Built for perception safety teams.</span></div></div>
        </footer>
      </Box>
    </ThemeProvider>
  );
}
