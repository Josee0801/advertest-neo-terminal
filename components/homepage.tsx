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
  List,
  ListItemButton,
  ListItemText,
  Slider,
  ThemeProvider,
  Toolbar,
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
  HubRounded,
  LockRounded,
  MenuRounded,
  MemoryRounded,
  PlayArrowRounded,
  ScienceRounded,
  SecurityRounded,
  SpeedRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const colors = {
  ink: "#070908",
  surface: "#101310",
  paper: "#f4f4ed",
  acid: "##5B1D28",
  mint: "#73f7cf",
  coral: "#ff6b45",
  slate: "#a7afa5",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.acid, contrastText: colors.ink },
    secondary: { main: colors.paper, contrastText: colors.ink },
    success: { main: colors.mint },
    background: { default: colors.ink, paper: colors.surface },
    text: { primary: colors.paper, secondary: colors.slate },
  },
  shape: { borderRadius: 22 },
  typography: {
    fontFamily: '"Manrope Variable", sans-serif',
    button: { fontWeight: 750, textTransform: "none", letterSpacing: "-0.02em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
          boxShadow: "none",
          minHeight: 46,
          paddingInline: 22,
          transition: "transform .25s ease, background-color .25s ease, color .25s ease",
          "&:hover": { border: 0, boxShadow: "none", transform: "translateY(-2px)" },
        },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiCard: { styleOverrides: { root: { border: 0, backgroundImage: "none", boxShadow: "none" } } },
    MuiChip: { styleOverrides: { root: { border: 0, fontWeight: 750 } } },
    MuiAppBar: { styleOverrides: { root: { border: 0, boxShadow: "none", backgroundImage: "none" } } },
    MuiDrawer: { styleOverrides: { paper: { border: 0, backgroundImage: "none" } } },
    MuiIconButton: { styleOverrides: { root: { border: 0 } } },
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

function Brand({ dark = true }: { dark?: boolean }) {
  return (
    <Box component="a" href="#top" className="flex items-center gap-3 no-underline">
      <Box className={`grid h-9 w-9 place-items-center rounded-full ${dark ? "bg-[#d8ff68] text-[#070908]" : "bg-[#070908] text-[#d8ff68]"}`}><FingerprintRounded className="!text-[19px]" /></Box>
      <Typography component="span" className={`!text-[14px] !font-extrabold !tracking-[-0.04em] ${dark ? "!text-[#f4f4ed]" : "!text-[#070908]"}`}>ADVER<span className={dark ? "text-[#d8ff68]" : "text-[#ff6b45]"}>TEST</span></Typography>
    </Box>
  );
}

function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy: string; light?: boolean }) {
  return (
    <Box className="reveal max-w-4xl">
      <Chip label={eyebrow} className={`!h-8 !px-1 !text-[10px] !tracking-[0.15em] ${light ? "!bg-[#070908]/8 !text-[#343933]" : "!bg-white/7 !text-[#d8ff68]"}`} />
      <Typography component="h2" className={`!mt-6 !text-[clamp(2.45rem,5.6vw,5.8rem)] !font-[720] !leading-[0.94] !tracking-[-0.065em] ${light ? "!text-[#070908]" : "!text-[#f4f4ed]"}`}>{title}</Typography>
      <Typography className={`!mt-7 !max-w-2xl !text-[16px] !leading-7 md:!text-[18px] ${light ? "!text-[#555c54]" : "!text-white/52"}`}>{copy}</Typography>
    </Box>
  );
}

function MetricPill({ label, value, light = false }: { label: string; value: string; light?: boolean }) {
  return (
    <Box className={`rounded-[18px] px-4 py-3 ${light ? "bg-[#070908]/6" : "bg-white/[0.055]"}`}>
      <Typography className={`!text-[9px] !font-extrabold !uppercase !tracking-[0.14em] ${light ? "!text-[#697068]" : "!text-white/38"}`}>{label}</Typography>
      <Typography className={`!mt-1 !text-xl !font-extrabold !tracking-[-0.045em] ${light ? "!text-[#070908]" : "!text-white"}`}>{value}</Typography>
    </Box>
  );
}

function PerceptionPreview({ attacked, severity }: { attacked?: boolean; severity: number }) {
  const particles = Array.from({ length: attacked ? severity * 9 : 0 }, (_, index) => index);
  return (
    <Box className={`relative h-48 overflow-hidden rounded-[22px] ${attacked ? "bg-[#93a39a]" : "bg-[#9cc2c8]"}`}>
      <Box className="absolute inset-x-0 bottom-0 h-[58%] bg-[#424843]" sx={{ clipPath: "polygon(34% 0,66% 0,100% 100%,0 100%)" }} />
      <Box className="absolute bottom-0 left-1/2 h-[56%] w-2 -translate-x-1/2 bg-[#e8e1bd]/80" sx={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} />
      <Box className="absolute bottom-[27%] left-[18%] h-9 w-16 rounded-lg bg-[#161b18] shadow-[0_10px_18px_rgba(0,0,0,.25)]" />
      <Box className="absolute bottom-[30%] right-[18%] h-7 w-12 rounded-md bg-[#e6d8b4] shadow-[0_10px_18px_rgba(0,0,0,.22)]" />
      <Box className={`absolute bottom-[31%] left-[54%] h-10 w-3 rounded-full ${attacked && severity >= 4 ? "opacity-15" : "bg-[#ff6b45]"}`} />
      <Chip size="small" label="car · .94" className="!absolute !bottom-[43%] !left-[14%] !h-6 !bg-[#d8ff68] !text-[9px] !font-extrabold !text-[#070908]" />
      {!attacked || severity < 4 ? <Chip size="small" label={attacked ? "person · .41" : "person · .91"} className="!absolute !bottom-[50%] !left-[49%] !h-6 !bg-[#ff6b45] !text-[9px] !font-extrabold !text-white" /> : <Chip size="small" label="MISSED GT" className="!absolute !bottom-[50%] !left-[47%] !h-6 !bg-[#070908] !text-[9px] !font-extrabold !text-[#ff9c82]" />}
      {particles.map((index) => <Box key={index} className="absolute h-1 w-1 rounded-full bg-white/80" sx={{ left: `${(index * 37) % 100}%`, top: `${(index * 61) % 88}%`, opacity: 0.35 + ((index * 13) % 60) / 100 }} />)}
    </Box>
  );
}

function HeroConsole() {
  const [severity, setSeverity] = useState(4);
  const data = severityData[severity - 1];
  return (
    <Box className="hero-stage relative mx-auto w-full max-w-[1180px]">
      <Box className="hero-glow pointer-events-none absolute inset-x-[12%] -top-20 h-72 rounded-full bg-[#d8ff68]/20 blur-[90px]" />
      <Card className="hero-console relative !overflow-hidden !rounded-[32px] !bg-[#111411]/88 !text-white backdrop-blur-2xl md:!rounded-[40px]">
        <Box className="flex items-center justify-between bg-white/[0.045] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#ff6b45]" /><i className="h-2.5 w-2.5 rounded-full bg-[#f6cd5d]" /><i className="h-2.5 w-2.5 rounded-full bg-[#73f7cf]" /></div>
          <Typography className="!text-[9px] !font-extrabold !tracking-[0.16em] !text-white/32">RUN / PRT-2026-091</Typography>
          <Chip icon={<BoltRounded />} label="GPU $18.42" className="!h-8 !bg-[#d8ff68] !text-[10px] !text-[#070908] [&_.MuiChip-icon]:!text-[#070908]" />
        </Box>
        <CardContent className="grid gap-5 !p-4 sm:!p-6 lg:grid-cols-[190px_1fr] lg:!p-7">
          <Box className="hidden rounded-[22px] bg-white/[0.045] p-4 lg:flex lg:flex-col">
            <Typography className="!text-[9px] !font-extrabold !tracking-[0.16em] !text-[#d8ff68]">LIVE FAILURE PREVIEW</Typography>
            <Typography className="!mt-2 !text-sm !font-bold !text-white/72">YOLOv8n</Typography>
            <Typography className="!mt-1 !text-[10px] !text-white/35">KITTI val · seed 42</Typography>
            <div className="mt-8 space-y-2">
              {["Baseline", "Corruptions", "Adversarial", "Review queue"].map((item, index) => <Box key={item} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${index === 2 ? "bg-[#d8ff68] text-[#070908]" : "text-white/42"}`}><span className={`h-1.5 w-1.5 rounded-full ${index === 2 ? "bg-[#070908]" : "bg-white/24"}`} /><Typography className="!text-[10px] !font-bold">{item}</Typography></Box>)}
            </div>
            <Box className="mt-auto rounded-[18px] bg-[#73f7cf]/10 p-3"><Typography className="!text-[9px] !font-bold !text-[#73f7cf]">BUDGET HEALTHY</Typography><Typography className="!mt-1 !text-2xl !font-extrabold !tracking-[-0.05em]">69%</Typography><Typography className="!text-[9px] !text-white/32">remaining capacity</Typography></Box>
          </Box>
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><Typography className="!text-[10px] !font-extrabold !tracking-[0.16em] !text-[#d8ff68] lg:!hidden">LIVE FAILURE PREVIEW</Typography><Typography className="!mt-1 !text-xl !font-extrabold !tracking-[-0.04em] sm:!text-2xl">Breaking-point explorer</Typography></div>
              <Typography className="!hidden !text-[10px] !font-bold !text-white/35 sm:!block">Object detection · real-time</Typography>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Typography className="!mb-2 !text-[9px] !font-bold !uppercase !tracking-[0.12em] !text-white/38">Clean / ground truth</Typography><PerceptionPreview severity={severity} /></div>
              <div><Typography className="!mb-2 !text-[9px] !font-bold !uppercase !tracking-[0.12em] !text-white/38">Attacked / {data.label}</Typography><PerceptionPreview attacked severity={severity} /></div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2"><MetricPill label="Clean mAP" value="72.8" /><MetricPill label="Attacked" value={data.map.toFixed(1)} /><MetricPill label="Retention" value={`${data.retention}%`} /></div>
            <Box className="mt-3 rounded-[20px] bg-white/[0.045] px-5 py-4">
              <div className="flex items-center justify-between"><Typography className="!text-xs !font-bold !text-white/55">Attack severity</Typography><Typography className="!text-xs !font-extrabold !text-[#d8ff68]">S{severity} · ${data.cost}</Typography></div>
              <Slider aria-label="Attack severity" min={1} max={5} step={1} value={severity} marks onChange={(_, value) => setSeverity(value as number)} sx={{ mt: 1, color: colors.acid, "& .MuiSlider-rail": { backgroundColor: "rgba(255,255,255,.14)" }, "& .MuiSlider-thumb": { width: 18, height: 18, boxShadow: "0 0 0 7px rgba(216,255,104,.12)" } }} />
            </Box>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}

export function Homepage() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 900px)", reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const { desktop, reduceMotion } = context.conditions as { desktop: boolean; reduceMotion: boolean };
      if (reduceMotion) {
        gsap.set([".hero-copy > *", ".hero-stage", ".reveal", ".marquee-track"], { autoAlpha: 1, y: 0, x: 0 });
        return;
      }
      gsap.timeline({ defaults: { ease: "power3.out" } }).from(".hero-copy > *", { autoAlpha: 0, y: 30, duration: 0.78, stagger: 0.08 }).from(".hero-stage", { autoAlpha: 0, y: 64, scale: 0.97, duration: 1.05 }, "<0.18");
      ScrollTrigger.batch(".reveal", { start: "top 88%", once: true, interval: 0.08, batchMax: desktop ? 4 : 2, onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, y: 38 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", overwrite: true }) });
      gsap.to(".hero-glow", { xPercent: 16, scale: 1.18, ease: "none", scrollTrigger: { trigger: ".hero-stage", start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.fromTo(".pipeline-progress", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".workflow-track", start: "top 72%", end: "bottom 62%", scrub: 0.7 } });
      if (desktop) gsap.to(".workflow-card", { yPercent: (index) => index * -3, ease: "none", scrollTrigger: { trigger: ".workflow-track", start: "top bottom", end: "bottom top", scrub: 0.8 } });
    });
    return () => media.revert();
  }, { scope: root });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box ref={root} component="main" id="top" className="homepage min-h-screen overflow-hidden bg-[#070908] text-[#f4f4ed]">
        <AppBar position="sticky" color="transparent" className="!top-0 !z-50 !bg-transparent !px-3 !pt-3 md:!px-6 md:!pt-5">
          <Toolbar className="nav-shell mx-auto flex !min-h-[62px] w-full max-w-[1180px] justify-between !rounded-full !bg-[#171b17]/80 !px-3 backdrop-blur-2xl sm:!px-5">
            <Brand />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">{navItems.map(([label, href]) => <Button key={href} href={href} color="secondary" className="!min-h-9 !px-4 !text-xs !font-bold !text-white/58 hover:!bg-white/7 hover:!text-white">{label}</Button>)}</nav>
            <div className="hidden items-center gap-2 sm:flex"><Button href="/console" color="secondary" className="!hidden !min-h-9 !px-4 !text-xs !text-white/68 md:!inline-flex">Xem console</Button><Button href="#contact" variant="contained" endIcon={<ArrowForwardRounded />} className="!min-h-10 !bg-[#d8ff68] !text-xs !text-[#070908]">Chạy benchmark</Button></div>
            <IconButton aria-label="Mở menu" onClick={() => setMenuOpen(true)} className="!bg-[#d8ff68] !text-[#070908] sm:!hidden"><MenuRounded /></IconButton>
          </Toolbar>
        </AppBar>

        <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
          <Box className="h-full w-[86vw] max-w-sm bg-[#111411] p-5 text-white">
            <div className="flex items-center justify-between"><Brand /><IconButton aria-label="Đóng menu" onClick={() => setMenuOpen(false)} className="!bg-white/7 !text-white"><CloseRounded /></IconButton></div>
            <List className="!mt-8">{navItems.map(([label, href]) => <ListItemButton component="a" href={href} key={href} onClick={() => setMenuOpen(false)} className="!mb-2 !rounded-2xl !bg-white/[0.045] !py-3"><ListItemText primary={<Typography className="!font-bold">{label}</Typography>} /><ChevronRightRounded className="!text-[#d8ff68]" /></ListItemButton>)}</List>
            <Button href="/console" fullWidth variant="contained" className="!mt-6 !bg-[#d8ff68] !text-[#070908]">Mở product console</Button>
          </Box>
        </Drawer>

        <section className="relative px-5 pb-24 pt-20 sm:pt-24 lg:px-10 lg:pb-36 lg:pt-32">
          <Box className="pointer-events-none absolute left-1/2 top-[-24rem] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#d8ff68]/10 blur-[120px]" />
          <div className="hero-copy relative mx-auto flex max-w-[1180px] flex-col items-center text-center">
            <Chip icon={<SecurityRounded />} label="PERCEPTION ASSURANCE CONTROL PLANE" className="!bg-white/[0.065] !text-[#d8ff68] [&_.MuiChip-icon]:!text-[#d8ff68]" />
            <Typography component="h1" className="!mt-8 !max-w-[1100px] !text-[clamp(3.7rem,9.4vw,9.2rem)] !font-[720] !leading-[0.82] !tracking-[-0.085em] !text-[#f4f4ed]">Biết model sẽ <span className="hero-accent">gãy ở đâu</span> trước khi ra đường.</Typography>
            <Typography className="!mt-9 !max-w-2xl !text-[17px] !leading-8 !text-white/52 md:!text-xl">AdverTest hợp nhất adversarial testing, corruption benchmark, GPU budget và reviewer sign-off thành một workflow dành riêng cho perception safety.</Typography>
            <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"><Button href="/console" variant="contained" size="large" endIcon={<PlayArrowRounded />} className="!bg-[#d8ff68] !text-[#070908]">Khám phá console</Button><Button href="#workflow" size="large" endIcon={<ArrowForwardRounded />} className="!bg-white/[0.065] !text-white hover:!bg-white/10">Xem workflow</Button></div>
            <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-bold text-white/40 sm:text-sm"><span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#73f7cf]" /> Clean → attack → defense</span><span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#73f7cf]" /> Object detection first</span><span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#73f7cf]" /> Audit-ready</span></div>
          </div>
          <div className="relative mx-auto mt-20 max-w-[1280px] lg:mt-28"><HeroConsole /></div>
        </section>

        <section className="overflow-hidden bg-[#d8ff68] py-5 text-[#070908]"><div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap px-5 text-sm font-extrabold tracking-[-0.03em] md:gap-16 md:text-base">{["Được thiết kế quanh stack perception thực tế", "YOLO", "KITTI", "nuScenes", "PyTorch", "W&B", "COCO metrics", "Được thiết kế quanh stack perception thực tế", "YOLO", "KITTI", "nuScenes", "PyTorch", "W&B", "COCO metrics"].map((item, index) => <span key={`${item}-${index}`} className={item.startsWith("Được") ? "text-[#070908]/45" : "text-[#070908]"}>{item}</span>)}</div></section>

        <section id="platform" className="relative px-5 py-24 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading eyebrow="01 / THE GAP" title="Accuracy sạch không phải là assurance." copy="Các tool hiện tại giải quyết từng lát cắt: engine attack, benchmark hoặc sample explorer. AdverTest nối các lát cắt đó thành một quy trình có ngân sách, người review và bằng chứng ký duyệt." />
            <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-12">{capabilityCards.map((card, index) => <Card key={card.title} className={`capability-card reveal group !rounded-[30px] ${index === 0 ? "!bg-[#d8ff68] !text-[#070908] lg:col-span-7" : index === 1 ? "!bg-[#171b17] !text-white lg:col-span-5" : index === 2 ? "!bg-[#f4f4ed] !text-[#070908] lg:col-span-5" : "!bg-[#ff6b45] !text-white lg:col-span-7"}`}><CardContent className="flex h-full min-h-[360px] flex-col !p-7 md:!p-9"><div className="flex items-start justify-between gap-4"><Box className={`grid h-12 w-12 place-items-center rounded-full ${index === 0 || index === 2 ? "bg-[#070908] text-[#d8ff68]" : "bg-white/12 text-white"}`}>{card.icon}</Box><Typography className={`!text-[11px] !font-extrabold !tracking-[0.12em] ${index === 0 || index === 2 ? "!text-[#070908]/45" : "!text-white/50"}`}>0{index + 1}</Typography></div><Typography className={`!mt-12 !text-[10px] !font-extrabold !tracking-[0.17em] ${index === 0 || index === 2 ? "!text-[#070908]/50" : "!text-white/52"}`}>{card.kicker}</Typography><Typography component="h3" className="!mt-3 !max-w-xl !text-[clamp(1.75rem,3vw,3rem)] !font-[720] !leading-[1] !tracking-[-0.055em]">{card.title}</Typography><Typography className={`!mt-5 !max-w-xl !text-sm !leading-6 ${index === 0 || index === 2 ? "!text-[#333832]" : "!text-white/65"}`}>{card.body}</Typography><Chip label={card.meta} className={`!mt-auto !w-fit ${index === 0 || index === 2 ? "!bg-[#070908]/8 !text-[#070908]" : "!bg-white/10 !text-white"}`} /></CardContent></Card>)}</div>
          </div>
        </section>

        <section id="workflow" className="bg-[#f4f4ed] px-5 py-24 text-[#070908] lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading eyebrow="02 / CONTROLLED WORKFLOW" title="Từ benchmark tới quyết định release." copy="Mỗi bước tạo ra một artifact có thể truy vết. Không có nút tắt để đi vòng qua triage hoặc chữ ký của Safety Reviewer." light />
            <div className="workflow-track relative mt-16">
              <Box className="absolute left-0 right-0 top-[31px] hidden h-1 origin-left rounded-full bg-[#070908]/8 md:block" /><Box className="pipeline-progress absolute left-0 right-0 top-[31px] hidden h-1 origin-left rounded-full bg-[#ff6b45] md:block" sx={{ transformOrigin: "left" }} />
              <div className="grid gap-4 md:grid-cols-5">{workflow.map(([number, title, copy], index) => <Card key={number} className={`workflow-card reveal relative !rounded-[26px] ${index === 4 ? "!bg-[#070908] !text-white" : "!bg-[#e7e8df] !text-[#070908]"}`}><CardContent className="flex min-h-[310px] flex-col !p-6"><Box className={`relative z-10 grid h-16 w-16 place-items-center rounded-full text-sm font-extrabold ${index === 4 ? "bg-[#d8ff68] text-[#070908]" : "bg-[#f4f4ed] text-[#ff6b45]"}`}>{number}</Box><Typography component="h3" className="!mt-10 !text-2xl !font-extrabold !tracking-[-0.045em]">{title}</Typography><Typography className={`!mt-3 !text-sm !leading-6 ${index === 4 ? "!text-white/55" : "!text-[#60665f]"}`}>{copy}</Typography>{index === 4 ? <Chip icon={<LockRounded />} label="REVIEWER ONLY" className="!mt-auto !w-fit !bg-white/8 !text-[#d8ff68] [&_.MuiChip-icon]:!text-[#d8ff68]" /> : <ChevronRightRounded className="!mt-auto !text-[#070908]/30" />}</CardContent></Card>)}</div>
            </div>
            <Button href="/console" variant="contained" className="reveal !mt-10 !bg-[#070908] !text-white" endIcon={<ArrowForwardRounded />}>Mở workflow demo</Button>
          </div>
        </section>

        <section id="governance" className="relative px-5 py-24 lg:px-10 lg:py-40">
          <Box className="pointer-events-none absolute -right-48 top-20 h-[540px] w-[540px] rounded-full bg-[#73f7cf]/10 blur-[110px]" />
          <div className="relative mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div><SectionHeading eyebrow="03 / GOVERNANCE BY DESIGN" title="Không có chữ ký, không có kết luận." copy="AdverTest tách vai trò người chạy và người duyệt, khóa audit trail và watermark mọi report DRAFT. Privacy và dual-use controls nằm trong workflow, không phải checklist sau cùng." /><div className="mt-10 grid gap-3 sm:grid-cols-2">{[[<FingerprintRounded key="a" />, "Immutable audit trail"], [<LockRounded key="b" />, "Reviewer-only sign-off"], [<VisibilityRounded key="c" />, "Anonymized by default"], [<SecurityRounded key="d" />, "Restricted artifacts"]].map(([icon, label]) => <Box key={label as string} className="reveal flex items-center gap-3 rounded-[18px] bg-white/[0.055] px-4 py-4"><Box className="grid h-10 w-10 place-items-center rounded-full bg-[#d8ff68] text-[#070908]">{icon}</Box><Typography className="!text-sm !font-extrabold !text-white/78">{label}</Typography></Box>)}</div></div>
            <div className="reveal"><Card className="report-card !rounded-[34px] !bg-[#f4f4ed] !text-[#070908] md:!rounded-[40px]"><CardContent className="!p-6 md:!p-10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><Typography className="!text-[10px] !font-extrabold !tracking-[0.17em] !text-[#687067]">ASSURANCE REPORT / RPT-091</Typography><Typography className="!mt-3 !text-[32px] !font-[720] !tracking-[-0.055em]">Release gate</Typography></div><Chip label="VALIDATED" icon={<CheckCircleRounded />} className="!w-fit !bg-[#ccefd8] !text-[#155d34] [&_.MuiChip-icon]:!text-[#155d34]" /></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><MetricPill label="Cases reviewed" value="38 / 38" light /><MetricPill label="Critical closed" value="12 / 12" light /><MetricPill label="Budget" value="$31.80" light /></div><div className="mt-8 space-y-2">{["Config hash và metric version hợp lệ", "Failure case nghiêm trọng đã có mitigation", "Budget không vượt hard cap", "Artifact đã ẩn danh mặc định"].map((item) => <Box key={item} className="flex items-center gap-3 rounded-2xl bg-[#070908]/[0.055] px-4 py-3"><CheckCircleRounded className="!text-xl !text-[#16854a]" /><Typography className="!text-sm !font-bold !text-[#30352f]">{item}</Typography></Box>)}</div><Box className="mt-8 rounded-[22px] bg-[#070908] p-5 text-white"><div className="flex items-center gap-4"><Box className="grid h-11 w-11 place-items-center rounded-full bg-[#d8ff68] text-[#070908]"><FingerprintRounded /></Box><div><Typography className="!text-sm !font-extrabold">Linh Nguyễn · Safety Reviewer</Typography><Typography className="!mt-1 !text-xs !text-white/42">Signed 23 Sep 2026 · audit event #418</Typography></div></div></Box></CardContent></Card></div>
          </div>
        </section>

        <section id="architecture" className="bg-[#101310] px-5 py-24 text-white lg:px-10 lg:py-40">
          <div className="mx-auto max-w-[1280px]">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"><SectionHeading eyebrow="04 / SELECTED PATTERNS" title="Không phát minh lại engine. Tập trung vào control plane." copy="Kiến trúc chọn lọc pattern mạnh nhất từ hệ sinh thái hiện có, rồi bổ sung phần còn thiếu: budget-aware orchestration, reviewer queue và assurance gate dành cho perception." /><Box className="reveal hidden justify-self-end lg:block"><HubRounded className="!text-[150px] !text-[#d8ff68]/12" /></Box></div>
            <div className="mt-16 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{sourcePatterns.map(([name, pattern, tag], index) => <Card key={name} className="source-card reveal !rounded-[26px] !bg-white/[0.055] !text-white"><CardContent className="flex min-h-[270px] flex-col !p-7"><div className="flex items-center justify-between"><Chip label={tag} className="!bg-[#d8ff68] !text-[#070908]" /><Typography className="!text-[10px] !font-bold !text-white/25">0{index + 1}</Typography></div><Typography component="h3" className="!mt-auto !text-2xl !font-extrabold !tracking-[-0.045em]">{name}</Typography><Typography className="!mt-2 !text-sm !leading-6 !text-white/45">{pattern}</Typography></CardContent></Card>)}</div>
            <Card className="reveal !mt-4 !overflow-hidden !rounded-[30px] !bg-[#d8ff68] !text-[#070908]"><CardContent className="relative grid gap-8 !p-8 md:grid-cols-[1fr_auto] md:items-center md:!p-12"><Box className="absolute -right-16 -top-28 h-80 w-80 rounded-full bg-[#73f7cf]/55 blur-[60px]" /><div className="relative"><Typography className="!text-[10px] !font-extrabold !tracking-[0.18em] !text-[#070908]/48">ADVERTEST CONTROL PLANE</Typography><Typography className="!mt-4 !max-w-4xl !text-[clamp(2rem,4.5vw,4.5rem)] !font-[720] !leading-[0.94] !tracking-[-0.065em]">Attack engine + failure analysis + GPU economics + human assurance.</Typography></div><HubRounded className="relative !hidden !text-[96px] !text-[#070908]/22 md:!block" /></CardContent></Card>
          </div>
        </section>

        <section id="contact" className="relative px-5 py-24 lg:px-10 lg:py-40">
          <div className="relative mx-auto max-w-[1280px]"><Card className="cta-card reveal !overflow-hidden !rounded-[34px] !bg-[#f4f4ed] !text-[#070908] md:!rounded-[42px]"><CardContent className="relative grid gap-12 !p-8 md:!p-14 lg:grid-cols-[1fr_auto] lg:items-end lg:!p-20"><Box className="pointer-events-none absolute -right-32 -top-48 h-[520px] w-[520px] rounded-full bg-[#d8ff68] blur-[60px]" /><div className="relative"><Chip icon={<SpeedRounded />} label="MVP READY TO EXPLORE" className="!bg-[#070908] !text-[#d8ff68] [&_.MuiChip-icon]:!text-[#d8ff68]" /><Typography component="h2" className="!mt-8 !max-w-5xl !text-[clamp(3rem,7vw,7.4rem)] !font-[720] !leading-[0.84] !tracking-[-0.08em]">Đưa perception qua một release gate đáng tin.</Typography><Typography className="!mt-7 !max-w-2xl !text-base !leading-7 !text-[#555c54]">Bắt đầu với YOLO + KITTI/COCO, chạy benchmark có budget, triage các failure quan trọng và khóa report bằng reviewer sign-off.</Typography></div><div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col"><Button href="/console" variant="contained" size="large" endIcon={<ArrowForwardRounded />} className="!bg-[#070908] !text-white">Mở console demo</Button><Button href="mailto:team@advertest.dev" size="large" className="!bg-[#dedfd6] !text-[#070908]">Trao đổi về pilot</Button></div></CardContent></Card></div>
        </section>

        <footer className="px-5 pb-10 pt-3 lg:px-10"><div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-5 rounded-[26px] bg-white/[0.045] px-6 py-5 text-sm text-white/38 sm:flex-row sm:items-center"><Brand /><Typography className="!text-xs !font-semibold !text-white/35">Perception robustness testing · Human-reviewed assurance · 2026</Typography><div className="flex gap-2"><Button href="#platform" size="small" className="!text-white/52">Nền tảng</Button><Button href="/console" size="small" className="!text-white/52">Console</Button></div></div></footer>
      </Box>
    </ThemeProvider>
  );
}
