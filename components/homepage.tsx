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
  ink: "#111512",
  paper: "#f4f1e8",
  cream: "#e7e0d2",
  orange: "#f4511e",
  orangeDark: "#bd3210",
  acid: "#c7f36b",
  green: "#39a96b",
  slate: "#667068",
  panel: "#171c18",
  panelSoft: "#202721",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: colors.orange, contrastText: "#fffaf2" },
    secondary: { main: colors.ink },
    success: { main: colors.green },
    background: { default: colors.paper, paper: "#fffdf7" },
    text: { primary: colors.ink, secondary: colors.slate },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Manrope Variable", sans-serif',
    button: { fontWeight: 750, textTransform: "none", letterSpacing: "-0.01em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, boxShadow: "none", paddingInline: 22, minHeight: 46 },
        contained: { boxShadow: "none", "&:hover": { boxShadow: "none" } },
      },
    },
    MuiCard: { styleOverrides: { root: { border: 0, backgroundImage: "none" } } },
    MuiChip: { styleOverrides: { root: { border: 0, fontWeight: 700 } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: "none", border: 0 } } },
    MuiDrawer: { styleOverrides: { paper: { border: 0 } } },
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
  {
    icon: <ScienceRounded />,
    kicker: "ATTACK ENGINE",
    title: "Một catalog kiểm thử, nhiều kiểu thất bại",
    body: "Corruption, occlusion, FGSM, PGD và adversarial patch cùng dùng một AttackSpec có version và spec_hash tái lập.",
    meta: "20+ attack & corruption",
  },
  {
    icon: <AutoGraphRounded />,
    kicker: "FAILURE ANALYSIS",
    title: "Nhìn thấy điểm gãy, không chỉ một con số mAP",
    body: "So sánh clean/attacked, đường cong retention, robustness matrix và Top-K failure để drill-down tới từng sample.",
    meta: "mAP · IoU · ASR · rPC",
  },
  {
    icon: <MemoryRounded />,
    kicker: "BUDGET CONTROL",
    title: "GPU budget là một phần của thiết kế thí nghiệm",
    body: "Ước tính trước khi chạy, hard cap theo USD/GPU-minute, cache baseline và successive halving để dừng nhánh kém giá trị.",
    meta: "31% cache saving",
  },
  {
    icon: <FactCheckRounded />,
    kicker: "HUMAN REVIEW",
    title: "Reviewer biến failure case thành quyết định",
    body: "Triage theo mức nghiêm trọng, verdict và mitigation có người chịu trách nhiệm; người chạy không thể tự ký kết quả.",
    meta: "Separation of duties",
  },
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
    <Box component="a" href="#top" className="flex items-center gap-3 no-underline">
      <Box className="grid h-10 w-10 place-items-center rounded-full bg-[#111512] text-[#c7f36b]">
        <FingerprintRounded fontSize="small" />
      </Box>
      <Typography component="span" className="!text-[15px] !font-extrabold !tracking-[-0.03em] !text-[#111512]">
        ADVER<span className="text-[#f4511e]">TEST</span>
      </Typography>
    </Box>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="reveal max-w-3xl">
      <Typography className="!mb-4 !text-[11px] !font-extrabold !uppercase !tracking-[0.18em] !text-[#bd3210]">
        {eyebrow}
      </Typography>
      <Typography component="h2" className="!text-[clamp(2.15rem,5vw,4.9rem)] !font-[760] !leading-[0.98] !tracking-[-0.055em] !text-[#111512]">
        {title}
      </Typography>
      <Typography className="!mt-6 !max-w-2xl !text-[16px] !leading-7 !text-[#667068] md:!text-[18px]">
        {copy}
      </Typography>
    </div>
  );
}

function MetricPill({ label, value, tone = "light" }: { label: string; value: string; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <Box className={`rounded-2xl px-4 py-3 ${dark ? "bg-white/8" : "bg-[#fffdf7]"}`}>
      <Typography className={`!text-[10px] !font-bold !uppercase !tracking-[0.14em] ${dark ? "!text-white/45" : "!text-[#7a817b]"}`}>
        {label}
      </Typography>
      <Typography className={`!mt-1 !text-xl !font-extrabold !tracking-[-0.04em] ${dark ? "!text-white" : "!text-[#111512]"}`}>
        {value}
      </Typography>
    </Box>
  );
}

function PerceptionPreview({ attacked, severity }: { attacked?: boolean; severity: number }) {
  const snow = Array.from({ length: attacked ? severity * 9 : 0 }, (_, index) => index);
  return (
    <Box className={`relative h-48 overflow-hidden rounded-[22px] ${attacked ? "bg-[#b8c1b9]" : "bg-[#a9c8d0]"}`}>
      <Box className="absolute inset-x-0 bottom-0 h-[58%] bg-[#4a504b]" sx={{ clipPath: "polygon(34% 0,66% 0,100% 100%,0 100%)" }} />
      <Box className="absolute bottom-0 left-1/2 h-[56%] w-2 -translate-x-1/2 bg-[#e8e1bd]/80" sx={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} />
      <Box className="absolute bottom-[27%] left-[18%] h-9 w-16 rounded-lg bg-[#202722] shadow-[0_10px_18px_rgba(0,0,0,.25)]" />
      <Box className="absolute bottom-[30%] right-[18%] h-7 w-12 rounded-md bg-[#e6d8b4] shadow-[0_10px_18px_rgba(0,0,0,.22)]" />
      <Box className={`absolute bottom-[31%] left-[54%] h-10 w-3 rounded-full ${attacked && severity >= 4 ? "opacity-15" : "bg-[#f4511e]"}`} />
      <Chip size="small" label="car · .94" className="!absolute !bottom-[43%] !left-[14%] !h-6 !bg-[#c7f36b] !text-[9px] !font-extrabold !text-[#111512]" />
      {!attacked || severity < 4 ? (
        <Chip size="small" label={attacked ? "person · .41" : "person · .91"} className="!absolute !bottom-[50%] !left-[49%] !h-6 !bg-[#f4511e] !text-[9px] !font-extrabold !text-white" />
      ) : (
        <Chip size="small" label="MISSED GT" className="!absolute !bottom-[50%] !left-[47%] !h-6 !bg-[#111512] !text-[9px] !font-extrabold !text-[#ffb097]" />
      )}
      {snow.map((index) => (
        <Box
          key={index}
          className="absolute h-1 w-1 rounded-full bg-white/80"
          sx={{ left: `${(index * 37) % 100}%`, top: `${(index * 61) % 88}%`, opacity: 0.35 + ((index * 13) % 60) / 100 }}
        />
      ))}
    </Box>
  );
}

function HeroConsole() {
  const [severity, setSeverity] = useState(4);
  const data = severityData[severity - 1];

  return (
    <Card className="hero-console !overflow-visible !rounded-[32px] !bg-[#171c18] !text-white shadow-[0_28px_80px_rgba(17,21,18,.28)]">
      <CardContent className="!p-5 sm:!p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Typography className="!text-[10px] !font-extrabold !tracking-[0.16em] !text-[#c7f36b]">LIVE FAILURE PREVIEW</Typography>
            <Typography className="!mt-1 !text-sm !font-bold !text-white/70">YOLOv8n · KITTI val · seed 42</Typography>
          </div>
          <Chip icon={<BoltRounded />} label="GPU $18.42" className="!bg-[#2b332c] !text-[#ffd4c7] [&_.MuiChip-icon]:!text-[#f4511e]" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div>
            <Typography className="!mb-2 !text-[10px] !font-bold !uppercase !tracking-[0.12em] !text-white/45">Clean / ground truth</Typography>
            <PerceptionPreview severity={severity} />
          </div>
          <div>
            <Typography className="!mb-2 !text-[10px] !font-bold !uppercase !tracking-[0.12em] !text-white/45">Attacked / {data.label}</Typography>
            <PerceptionPreview attacked severity={severity} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2">
          <MetricPill label="Clean mAP" value="72.8" tone="dark" />
          <MetricPill label="Attacked" value={data.map.toFixed(1)} tone="dark" />
          <MetricPill label="Retention" value={`${data.retention}%`} tone="dark" />
        </div>

        <div className="mt-6 rounded-[22px] bg-[#202721] px-5 py-4">
          <div className="flex items-center justify-between">
            <Typography className="!text-xs !font-bold !text-white/65">Attack severity</Typography>
            <Typography className="!text-xs !font-extrabold !text-[#ff9d7c]">S{severity} · ${data.cost}</Typography>
          </div>
          <Slider
            aria-label="Attack severity"
            min={1}
            max={5}
            step={1}
            value={severity}
            marks
            onChange={(_, value) => setSeverity(value as number)}
            sx={{
              mt: 1,
              color: colors.orange,
              "& .MuiSlider-rail": { backgroundColor: "rgba(255,255,255,.18)" },
              "& .MuiSlider-thumb": { width: 18, height: 18, boxShadow: "0 0 0 7px rgba(244,81,30,.17)" },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Homepage() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          desktop: "(min-width: 900px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as { desktop: boolean; reduceMotion: boolean };
          if (reduceMotion) {
            gsap.set([".hero-copy > *", ".hero-console", ".reveal"], { autoAlpha: 1, y: 0, x: 0 });
            return;
          }

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-copy > *", { autoAlpha: 0, y: 28, duration: 0.72, stagger: 0.09 })
            .from(".hero-console", { autoAlpha: 0, x: desktop ? 54 : 0, y: desktop ? 0 : 30, duration: 0.9 }, "<0.16");

          ScrollTrigger.batch(".reveal", {
            start: "top 86%",
            once: true,
            interval: 0.08,
            batchMax: desktop ? 4 : 2,
            onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.1, ease: "power3.out", overwrite: true }),
          });

          gsap.fromTo(
            ".pipeline-progress",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: ".workflow-track", start: "top 72%", end: "bottom 62%", scrub: 0.7 },
            },
          );
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box ref={root} component="main" id="top" className="homepage min-h-screen overflow-hidden bg-[#f4f1e8] text-[#111512]">
        <AppBar position="sticky" color="transparent" className="!top-0 !z-50 !bg-[#f4f1e8]/90 backdrop-blur-xl">
          <Toolbar className="mx-auto flex !min-h-[76px] w-full max-w-[1480px] justify-between !px-5 lg:!px-10">
            <Brand />
            <nav className="hidden items-center gap-2 lg:flex" aria-label="Điều hướng chính">
              {navItems.map(([label, href]) => (
                <Button key={href} href={href} color="secondary" className="!min-h-10 !px-4 !text-sm !font-bold !text-[#4e574f]">
                  {label}
                </Button>
              ))}
            </nav>
            <div className="hidden items-center gap-2 sm:flex">
              <Button href="/console" color="secondary" endIcon={<ChevronRightRounded />} className="!hidden md:!inline-flex">
                Xem console
              </Button>
              <Button href="#contact" variant="contained" endIcon={<ArrowForwardRounded />}>
                Chạy benchmark
              </Button>
            </div>
            <IconButton aria-label="Mở menu" onClick={() => setMenuOpen(true)} className="!bg-[#111512] !text-white sm:!hidden">
              <MenuRounded />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
          <Box className="h-full w-[86vw] max-w-sm bg-[#f4f1e8] p-5">
            <div className="flex items-center justify-between">
              <Brand />
              <IconButton aria-label="Đóng menu" onClick={() => setMenuOpen(false)}><CloseRounded /></IconButton>
            </div>
            <List className="!mt-8">
              {navItems.map(([label, href]) => (
                <ListItemButton component="a" href={href} key={href} onClick={() => setMenuOpen(false)} className="!rounded-2xl !py-3">
                  <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 750 }} />
                  <ChevronRightRounded />
                </ListItemButton>
              ))}
            </List>
            <Button href="/console" fullWidth variant="contained" className="!mt-6">Mở product console</Button>
          </Box>
        </Drawer>

        <section className="relative px-5 pb-24 pt-16 sm:pt-20 lg:px-10 lg:pb-32 lg:pt-28">
          <Box className="pointer-events-none absolute left-[-12%] top-[-16%] h-[540px] w-[540px] rounded-full bg-[#f4511e]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-[1480px] items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
            <div className="hero-copy">
              <Chip icon={<SecurityRounded />} label="PERCEPTION ASSURANCE CONTROL PLANE" className="!bg-[#e9e1d2] !text-[#3f493f] [&_.MuiChip-icon]:!text-[#f4511e]" />
              <Typography component="h1" className="!mt-7 !max-w-4xl !text-[clamp(3.35rem,7.6vw,7.7rem)] !font-[780] !leading-[0.86] !tracking-[-0.075em] !text-[#111512]">
                Biết model sẽ <span className="text-[#f4511e]">gãy ở đâu</span> trước khi ra đường.
              </Typography>
              <Typography className="!mt-8 !max-w-2xl !text-[17px] !leading-8 !text-[#5f685f] md:!text-xl">
                AdverTest hợp nhất adversarial testing, corruption benchmark, GPU budget và reviewer sign-off thành một workflow dành riêng cho perception safety.
              </Typography>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href="/console" variant="contained" size="large" endIcon={<PlayArrowRounded />}>
                  Khám phá console
                </Button>
                <Button href="#workflow" color="secondary" size="large" endIcon={<ArrowForwardRounded />} className="!bg-[#ded7ca]">
                  Xem workflow
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#69716a]">
                <span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#39a96b]" /> Clean → attack → defense</span>
                <span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#39a96b]" /> Object detection first</span>
                <span className="flex items-center gap-2"><CheckCircleRounded className="!text-lg !text-[#39a96b]" /> Audit-ready</span>
              </div>
            </div>
            <HeroConsole />
          </div>
        </section>

        <section className="bg-[#111512] px-5 py-7 text-white lg:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-5 md:flex-row md:items-center">
            <Typography className="!text-sm !font-bold !text-white/55">Được thiết kế quanh stack perception thực tế</Typography>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-extrabold tracking-[-0.02em] text-white/80">
              <span>YOLO</span><span>KITTI</span><span>nuScenes</span><span>PyTorch</span><span>W&amp;B</span><span>COCO metrics</span>
            </div>
          </div>
        </section>

        <section id="platform" className="px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1480px]">
            <SectionHeading
              eyebrow="01 / THE GAP"
              title="Accuracy sạch không phải là assurance."
              copy="Các tool hiện tại giải quyết từng lát cắt: engine attack, benchmark hoặc sample explorer. AdverTest nối các lát cắt đó thành một quy trình có ngân sách, người review và bằng chứng ký duyệt."
            />
            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {capabilityCards.map((card, index) => (
                <Card key={card.title} className={`reveal group !rounded-[28px] ${index === 0 ? "!bg-[#f4511e] !text-white" : "!bg-[#fffdf7]"} transition-transform duration-300 hover:-translate-y-2`}>
                  <CardContent className="flex h-full min-h-[350px] flex-col !p-7">
                    <Box className={`grid h-12 w-12 place-items-center rounded-full ${index === 0 ? "bg-white/15 text-white" : "bg-[#ece5d7] text-[#bd3210]"}`}>
                      {card.icon}
                    </Box>
                    <Typography className={`!mt-8 !text-[10px] !font-extrabold !tracking-[0.18em] ${index === 0 ? "!text-white/65" : "!text-[#9a4a31]"}`}>{card.kicker}</Typography>
                    <Typography component="h3" className="!mt-3 !text-[25px] !font-[760] !leading-[1.08] !tracking-[-0.045em]">{card.title}</Typography>
                    <Typography className={`!mt-4 !text-sm !leading-6 ${index === 0 ? "!text-white/75" : "!text-[#667068]"}`}>{card.body}</Typography>
                    <Chip label={card.meta} className={`!mt-auto !w-fit ${index === 0 ? "!bg-[#111512] !text-[#c7f36b]" : "!bg-[#e9e2d5] !text-[#465047]"}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-[#e5ddcf] px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-14 xl:grid-cols-[0.72fr_1.28fr] xl:gap-24">
              <div className="xl:sticky xl:top-32 xl:self-start">
                <SectionHeading
                  eyebrow="02 / CONTROLLED WORKFLOW"
                  title="Từ benchmark tới quyết định release."
                  copy="Mỗi bước tạo ra một artifact có thể truy vết. Không có nút tắt để đi vòng qua triage hoặc chữ ký của Safety Reviewer."
                />
                <Button href="/console" variant="contained" className="reveal !mt-8" endIcon={<ArrowForwardRounded />}>Mở workflow demo</Button>
              </div>
              <div className="workflow-track relative">
                <Box className="absolute bottom-8 left-[31px] top-8 w-1 origin-top rounded-full bg-[#c7bfb2] md:left-[39px]" />
                <Box className="pipeline-progress absolute bottom-8 left-[31px] top-8 w-1 origin-top rounded-full bg-[#f4511e] md:left-[39px]" sx={{ transformOrigin: "top" }} />
                <div className="space-y-4">
                  {workflow.map(([number, title, copy], index) => (
                    <Card key={number} className={`reveal relative ml-20 !rounded-[26px] ${index === 4 ? "!bg-[#111512] !text-white" : "!bg-[#f8f5ed]"} transition-transform duration-300 hover:translate-x-2`}>
                      <Box className={`absolute left-[-80px] top-7 grid h-16 w-16 place-items-center rounded-full text-sm font-extrabold shadow-[0_10px_30px_rgba(17,21,18,.12)] ${index === 4 ? "bg-[#c7f36b] text-[#111512]" : "bg-[#fffdf7] text-[#bd3210]"}`}>{number}</Box>
                      <CardContent className="!p-7 md:!p-9">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                          <div>
                            <Typography component="h3" className="!text-2xl !font-extrabold !tracking-[-0.04em]">{title}</Typography>
                            <Typography className={`!mt-2 !max-w-xl !text-sm !leading-6 ${index === 4 ? "!text-white/60" : "!text-[#697069]"}`}>{copy}</Typography>
                          </div>
                          {index === 4 ? <Chip icon={<LockRounded />} label="REVIEWER ONLY" className="!w-fit !bg-white/10 !text-[#c7f36b] [&_.MuiChip-icon]:!text-[#c7f36b]" /> : <ChevronRightRounded className="!text-[#a59c8d]" />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="governance" className="px-5 py-24 lg:px-10 lg:py-36">
          <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-2 lg:items-center">
            <div className="reveal order-2 lg:order-1">
              <Card className="!rounded-[34px] !bg-[#171c18] !text-white shadow-[0_28px_80px_rgba(17,21,18,.22)]">
                <CardContent className="!p-6 md:!p-9">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Typography className="!text-[10px] !font-extrabold !tracking-[0.17em] !text-[#c7f36b]">ASSURANCE REPORT / RPT-091</Typography>
                      <Typography className="!mt-2 !text-2xl !font-extrabold !tracking-[-0.04em]">Release gate</Typography>
                    </div>
                    <Chip label="VALIDATED" icon={<CheckCircleRounded />} className="!bg-[#173b28] !text-[#8ef0b5] [&_.MuiChip-icon]:!text-[#8ef0b5]" />
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <MetricPill label="Cases reviewed" value="38 / 38" tone="dark" />
                    <MetricPill label="Critical closed" value="12 / 12" tone="dark" />
                    <MetricPill label="Budget" value="$31.80" tone="dark" />
                  </div>
                  <div className="mt-8 space-y-3">
                    {["Config hash và metric version hợp lệ", "Failure case nghiêm trọng đã có mitigation", "Budget không vượt hard cap", "Artifact đã ẩn danh mặc định"].map((item) => (
                      <Box key={item} className="flex items-center gap-3 rounded-2xl bg-white/6 px-4 py-3">
                        <CheckCircleRounded className="!text-xl !text-[#8ef0b5]" />
                        <Typography className="!text-sm !font-bold !text-white/78">{item}</Typography>
                      </Box>
                    ))}
                  </div>
                  <Box className="mt-8 rounded-[22px] bg-[#f4f1e8] p-5 text-[#111512]">
                    <div className="flex items-center gap-4">
                      <Box className="grid h-11 w-11 place-items-center rounded-full bg-[#f4511e] text-white"><FingerprintRounded /></Box>
                      <div>
                        <Typography className="!text-sm !font-extrabold">Linh Nguyễn · Safety Reviewer</Typography>
                        <Typography className="!text-xs !text-[#667068]">Signed 23 Sep 2026 · audit event #418</Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeading
                eyebrow="03 / GOVERNANCE BY DESIGN"
                title="Không có chữ ký, không có kết luận."
                copy="AdverTest tách vai trò người chạy và người duyệt, khóa audit trail và watermark mọi report DRAFT. Privacy và dual-use controls nằm trong workflow, không phải checklist sau cùng."
              />
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {[
                  [<FingerprintRounded key="a" />, "Immutable audit trail"],
                  [<LockRounded key="b" />, "Reviewer-only sign-off"],
                  [<VisibilityRounded key="c" />, "Anonymized by default"],
                  [<SecurityRounded key="d" />, "Restricted artifacts"],
                ].map(([icon, label]) => (
                  <Box key={label as string} className="reveal flex items-center gap-3 rounded-2xl bg-[#e8e1d4] px-4 py-4">
                    <Box className="grid h-10 w-10 place-items-center rounded-full bg-[#fffdf7] text-[#bd3210]">{icon}</Box>
                    <Typography className="!text-sm !font-extrabold">{label}</Typography>
                  </Box>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="architecture" className="bg-[#111512] px-5 py-24 text-white lg:px-10 lg:py-36">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <Typography className="reveal !mb-4 !text-[11px] !font-extrabold !uppercase !tracking-[0.18em] !text-[#ff8d69]">04 / SELECTED PATTERNS</Typography>
                <Typography component="h2" className="reveal !text-[clamp(2.4rem,5vw,5.2rem)] !font-[760] !leading-[0.95] !tracking-[-0.06em]">Không phát minh lại engine. Tập trung vào control plane.</Typography>
              </div>
              <Typography className="reveal !max-w-2xl !text-base !leading-7 !text-white/55 lg:justify-self-end">
                Kiến trúc chọn lọc pattern mạnh nhất từ hệ sinh thái hiện có, rồi bổ sung phần còn thiếu: budget-aware orchestration, reviewer queue và assurance gate dành cho perception.
              </Typography>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {sourcePatterns.map(([name, pattern, tag]) => (
                <Card key={name} className="reveal !rounded-[26px] !bg-[#202721] !text-white transition-colors duration-300 hover:!bg-[#293229]">
                  <CardContent className="!p-7">
                    <Chip label={tag} className="!bg-[#303a31] !text-[#c7f36b]" />
                    <Typography component="h3" className="!mt-12 !text-2xl !font-extrabold !tracking-[-0.04em]">{name}</Typography>
                    <Typography className="!mt-2 !text-sm !leading-6 !text-white/52">{pattern}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="reveal !mt-4 !rounded-[30px] !bg-[#f4511e] !text-white">
              <CardContent className="grid gap-8 !p-8 md:grid-cols-[1fr_auto] md:items-center md:!p-10">
                <div>
                  <Typography className="!text-[10px] !font-extrabold !tracking-[0.18em] !text-white/60">ADVERTEST CONTROL PLANE</Typography>
                  <Typography className="!mt-3 !max-w-4xl !text-[clamp(1.9rem,4vw,3.8rem)] !font-[760] !leading-[1] !tracking-[-0.055em]">
                    Attack engine + failure analysis + GPU economics + human assurance.
                  </Typography>
                </div>
                <HubRounded className="!hidden !text-[92px] !text-white/25 md:!block" />
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="contact" className="relative px-5 py-24 lg:px-10 lg:py-36">
          <Box className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full bg-[#c7f36b]/35 blur-3xl" />
          <div className="relative mx-auto max-w-[1480px]">
            <Card className="reveal !rounded-[36px] !bg-[#ddd5c7]">
              <CardContent className="grid gap-10 !p-8 md:!p-14 lg:grid-cols-[1fr_auto] lg:items-end lg:!p-20">
                <div>
                  <Chip icon={<SpeedRounded />} label="MVP READY TO EXPLORE" className="!bg-[#fffdf7] !text-[#465047] [&_.MuiChip-icon]:!text-[#f4511e]" />
                  <Typography component="h2" className="!mt-7 !max-w-5xl !text-[clamp(2.7rem,6vw,6.6rem)] !font-[780] !leading-[0.9] !tracking-[-0.07em]">
                    Đưa perception qua một release gate đáng tin.
                  </Typography>
                  <Typography className="!mt-6 !max-w-2xl !text-base !leading-7 !text-[#606960]">
                    Bắt đầu với YOLO + KITTI/COCO, chạy benchmark có budget, triage các failure quan trọng và khóa report bằng reviewer sign-off.
                  </Typography>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button href="/console" variant="contained" size="large" endIcon={<ArrowForwardRounded />}>Mở console demo</Button>
                  <Button href="mailto:team@advertest.dev" color="secondary" size="large" className="!bg-[#fffdf7]">Trao đổi về pilot</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer className="px-5 pb-10 pt-4 lg:px-10">
          <div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-5 text-sm text-[#6b736c] sm:flex-row sm:items-center">
            <Brand />
            <Typography className="!text-xs !font-semibold !text-[#777e78]">Perception robustness testing · Human-reviewed assurance · 2026</Typography>
            <div className="flex gap-4">
              <Button href="#platform" color="secondary" size="small">Nền tảng</Button>
              <Button href="/console" color="secondary" size="small">Console</Button>
            </div>
          </div>
        </footer>
      </Box>
    </ThemeProvider>
  );
}
