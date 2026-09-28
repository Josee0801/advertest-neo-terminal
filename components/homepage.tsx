"use client";

import { useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Drawer,
  IconButton,
  Slider,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  ArrowForwardRounded,
  ArrowOutwardRounded,
  CheckRounded,
  CloseRounded,
  DataObjectRounded,
  FactCheckRounded,
  GridViewRounded,
  MenuRounded,
  MemoryRounded,
  RadarRounded,
  SecurityRounded,
  SpeedRounded,
  VerifiedUserRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { InteractiveBackground } from "@/components/interactive-background";

const palette = {
  ink: "#11100f",
  panel: "#211e1b",
  bone: "#f2ecdf",
  muted: "#aaa298",
  orange: "#f36a2d",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: palette.orange, contrastText: palette.ink },
    secondary: { main: palette.bone, contrastText: palette.ink },
    background: { default: palette.ink, paper: palette.panel },
    text: { primary: palette.bone, secondary: palette.muted },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Manrope Variable", sans-serif',
    button: { textTransform: "none", fontWeight: 750 },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: "none", backgroundImage: "none" } } },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          border: 0,
          borderRadius: 999,
          paddingInline: 22,
          boxShadow: "none",
          transition: "transform 180ms ease, background-color 180ms ease, color 180ms ease",
          "&:hover": { border: 0, boxShadow: "none", transform: "translateY(-2px)" },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { border: 0, fontWeight: 750 } } },
    MuiDrawer: { styleOverrides: { paper: { border: 0, backgroundImage: "none" } } },
    MuiIconButton: { styleOverrides: { root: { border: 0 } } },
  },
});

const navItems = [
  ["Nền tảng", "#platform"],
  ["Failure intelligence", "#failures"],
  ["Governance", "#governance"],
  ["Kiến trúc", "#architecture"],
] as const;

const workflow = [
  { number: "01", icon: <DataObjectRounded />, title: "Lock the evidence", body: "Đóng dấu model, dataset slice, seed, adapter và clean baseline trước khi cấp GPU.", meta: "CONFIG HASH" },
  { number: "02", icon: <RadarRounded />, title: "Stress the perception", body: "Quét corruption, gradient attack và patch theo severity với budget-aware planner.", meta: "ATTACK SPEC" },
  { number: "03", icon: <VisibilityRounded />, title: "Explain the break", body: "Drill-down clean/attacked, retention curve và Top-K failure ở cấp sample.", meta: "FAILURE CASE" },
  { number: "04", icon: <FactCheckRounded />, title: "Sign the decision", body: "Reviewer triage, mitigation và sign-off tạo report VALIDATED có audit trail.", meta: "ASSURANCE GATE" },
];

const failureModes = [
  { id: "snow", label: "Snow / S4", object: "Pedestrian disappearance", confidence: 18, map: 40.2, risk: "Critical", tint: "#d9e4e9" },
  { id: "pgd", label: "PGD / 8/255", object: "Car → Cyclist flip", confidence: 31, map: 44.8, risk: "High", tint: "#d3c1b3" },
  { id: "fog", label: "Fog / S5", object: "False negative cluster", confidence: 24, map: 37.6, risk: "Critical", tint: "#b7c4be" },
] as const;

const roles = [
  { role: "Test Engineer", prepare: true, run: true, triage: false, sign: false },
  { role: "Safety Reviewer", prepare: false, run: false, triage: true, sign: true },
  { role: "Admin", prepare: true, run: true, triage: true, sign: true },
];

function Logo() {
  return (
    <Box component="a" href="#top" className="flex items-center gap-3 no-underline">
      <Box className="home-logo grid h-10 w-10 place-items-center rounded-[14px] bg-[#f36a2d] text-[#11100f]"><SecurityRounded className="!text-[21px]" /></Box>
      <Box>
        <Typography component="span" className="!block !text-[14px] !font-extrabold !tracking-[-0.04em] !text-[#f2ecdf]">ADVERTEST</Typography>
        <Typography component="span" className="!block !text-[8px] !font-bold !tracking-[0.19em] !text-[#aaa298]">PERCEPTION ASSURANCE</Typography>
      </Box>
    </Box>
  );
}

function Eyebrow({ children, tone = "orange", inverse = false }: { children: React.ReactNode; tone?: "orange" | "blue" | "green"; inverse?: boolean }) {
  const color = tone === "blue" ? "#6ba9ff" : tone === "green" ? "#76d49b" : "#f36a2d";
  return (
    <Box className={`inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 ${inverse ? "bg-black/[0.065]" : "bg-white/[0.055]"}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 14px ${color}` }} />
      <Typography className={`!text-[10px] !font-extrabold !uppercase !tracking-[0.16em] ${inverse ? "!text-black/60" : "!text-white/65"}`}>{children}</Typography>
    </Box>
  );
}

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <Box className="max-w-[820px]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography component="h2" className="!mt-6 !text-[clamp(2.4rem,5.4vw,5.8rem)] !font-[680] !leading-[0.94] !tracking-[-0.072em] !text-[#f2ecdf]">{title}</Typography>
      <Typography className="!mt-6 !max-w-2xl !text-[16px] !leading-7 !text-[#aaa298] md:!text-[18px] md:!leading-8">{body}</Typography>
    </Box>
  );
}

function PerceptionScene({ severity }: { severity: number }) {
  const confidence = Math.max(12, 96 - severity * 15);
  return (
    <Box className="perception-scene relative min-h-[310px] overflow-hidden rounded-[24px] bg-[#c8d0ce]">
      <Box className="absolute inset-x-0 top-0 h-[52%] bg-[linear-gradient(180deg,#697b7f,#bac3c0)]" />
      <Box className="scene-mountain absolute bottom-[39%] left-[-8%] h-[46%] w-[62%] bg-[#596461]" />
      <Box className="scene-mountain absolute bottom-[39%] right-[-10%] h-[38%] w-[58%] bg-[#707a76]" />
      <Box className="scene-road absolute inset-x-0 bottom-0 h-[56%] bg-[#242523]" />
      <span className="scene-lane absolute bottom-0 left-[44%] h-[53%] w-[3px] origin-bottom rotate-[7deg]" />
      <span className="scene-lane absolute bottom-0 right-[44%] h-[53%] w-[3px] origin-bottom rotate-[-7deg]" />
      <span className="scene-car absolute bottom-[18%] left-[24%] h-8 w-16 bg-[#181918]" />
      <span className="scene-car absolute bottom-[31%] right-[19%] h-6 w-12 bg-[#2f3331]" />
      <span className="scene-person absolute bottom-[35%] left-[61%] h-11 w-3 rounded-full bg-[#181918]" />
      <Box className="bbox absolute bottom-[31%] left-[58%] h-[74px] w-[42px] border-2 border-[#ff6f72] text-[#ff6f72]"><span>MISS</span></Box>
      <Box className="bbox absolute bottom-[14%] left-[21%] h-[55px] w-[82px] border-2 border-[#76d49b] text-[#76d49b]"><span>car 0.94</span></Box>
      <Box className="absolute left-4 top-4 rounded-full bg-[#11100f]/85 px-3 py-2 backdrop-blur-lg"><Typography className="!text-[10px] !font-extrabold !tracking-[0.12em] !text-white/70">ATTACKED / SNOW S{severity}</Typography></Box>
      <Box className="absolute bottom-4 right-4 rounded-2xl bg-[#11100f]/90 px-4 py-3 text-right backdrop-blur-xl"><Typography className="!text-[9px] !font-bold !tracking-[0.12em] !text-white/40">PEDESTRIAN CONF.</Typography><Typography className="!text-2xl !font-extrabold !tracking-[-0.05em] !text-[#ff6f72]">{confidence}%</Typography></Box>
      <Box className="weather-layer absolute inset-0" style={{ opacity: severity * 0.13 }} aria-hidden="true" />
    </Box>
  );
}

function DemoPanel() {
  const [severity, setSeverity] = useState(4);
  const metrics = useMemo(() => ({ map: Math.max(22, 74 - severity * 8.4).toFixed(1), retention: Math.max(31, 100 - severity * 12), cost: (4.2 + severity * 3.55).toFixed(2) }), [severity]);
  return (
    <Box className="demo-panel overflow-hidden rounded-[30px] bg-[#191715] p-3 shadow-[0_50px_140px_rgba(0,0,0,.44)] sm:p-4">
      <Box className="flex items-center justify-between px-2 pb-3 pt-1 sm:px-3"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#ff6f72]" /><span className="h-2.5 w-2.5 rounded-full bg-[#f5bd66]" /><span className="h-2.5 w-2.5 rounded-full bg-[#76d49b]" /></div><Typography className="!text-[9px] !font-extrabold !tracking-[0.15em] !text-white/36">LIVE FAILURE LAB / SEED 42</Typography></Box>
      <PerceptionScene severity={severity} />
      <Box className="grid grid-cols-3 gap-2 py-3 sm:gap-3">{[["mAP50", metrics.map, "#f2ecdf"], ["RETENTION", `${metrics.retention}%`, "#6ba9ff"], ["GPU COST", `$${metrics.cost}`, "#f36a2d"]].map(([label, value, color]) => <Box key={label} className="rounded-[18px] bg-white/[0.055] px-3 py-3 sm:px-4"><Typography className="!text-[8px] !font-extrabold !tracking-[0.13em] !text-white/35">{label}</Typography><Typography className="!mt-1 !text-[clamp(1.15rem,3vw,1.65rem)] !font-extrabold !tracking-[-0.05em]" style={{ color }}>{value}</Typography></Box>)}</Box>
      <Box className="rounded-[20px] bg-[#11100f] px-4 py-4 sm:px-5"><div className="mb-1 flex items-center justify-between"><Typography className="!text-[11px] !font-bold !text-white/58">Attack severity</Typography><Chip label={`S${severity}`} className="!h-7 !bg-[#f36a2d] !text-[11px] !text-[#11100f]" /></div><Slider value={severity} min={1} max={5} step={1} onChange={(_, value) => setSeverity(value as number)} aria-label="Attack severity" /><div className="flex justify-between text-[9px] font-bold tracking-[0.12em] text-white/25"><span>VISIBLE</span><span>BREAKING POINT</span></div></Box>
    </Box>
  );
}

function FailureExplorer() {
  const [active, setActive] = useState(0);
  const item = failureModes[active];
  return (
    <Box className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
      <Box className="space-y-2">{failureModes.map((failure, index) => <Button key={failure.id} fullWidth aria-pressed={active === index} onClick={() => setActive(index)} className={`failure-select !min-h-[92px] !justify-start !rounded-[20px] !px-5 !text-left ${active === index ? "is-active" : ""}`}><Box component="span" className="block w-full"><Box component="span" className="flex items-center justify-between gap-4"><Typography component="span" className="!text-[13px] !font-extrabold !text-[#f2ecdf]">{failure.label}</Typography><Typography component="span" className="!text-[10px] !font-extrabold !uppercase !tracking-[0.12em] !text-[#ff8d8f]">{failure.risk}</Typography></Box><Typography component="span" className="!mt-2 !block !text-[13px] !text-[#aaa298]">{failure.object}</Typography></Box></Button>)}</Box>
      <Box aria-live="polite" className="failure-detail overflow-hidden rounded-[28px] bg-[#211e1b] p-4 sm:p-6">
        <Box className="grid gap-4 md:grid-cols-[1.2fr_.8fr]">
          <Box className="relative min-h-[310px] overflow-hidden rounded-[22px]" style={{ background: item.tint }}><PerceptionScene severity={active + 3} /></Box>
          <Box className="flex flex-col rounded-[22px] bg-[#151311] p-5"><Eyebrow tone="blue">Failure case FC-03{8 - active}</Eyebrow><Typography component="h3" className="!mt-7 !text-[30px] !font-[680] !leading-[1.02] !tracking-[-0.055em] !text-[#f2ecdf]">{item.object}</Typography><Typography className="!mt-4 !text-[14px] !leading-6 !text-[#aaa298]">Clean prediction ổn định, nhưng mất safety-critical object khi perturbation vượt ngưỡng đã chọn.</Typography><Box className="mt-7 grid grid-cols-2 gap-2"><Box className="rounded-2xl bg-white/[0.05] p-3"><Typography className="!text-[9px] !font-bold !text-white/35">CONFIDENCE</Typography><Typography className="!mt-1 !text-xl !font-extrabold !text-[#ff6f72]">{item.confidence}%</Typography></Box><Box className="rounded-2xl bg-white/[0.05] p-3"><Typography className="!text-[9px] !font-bold !text-white/35">mAP50</Typography><Typography className="!mt-1 !text-xl !font-extrabold !text-[#f2ecdf]">{item.map}</Typography></Box></Box><Button href="/console" endIcon={<ArrowForwardRounded />} className="!mt-auto !justify-between !bg-[#f2ecdf] !text-[#11100f]">Mở triage case</Button></Box>
        </Box>
      </Box>
    </Box>
  );
}

function PermissionMark({ enabled }: { enabled: boolean }) {
  return enabled ? <CheckRounded className="!text-[18px] !text-[#76d49b]" /> : <span className="text-white/18">—</span>;
}

export function Homepage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box id="top" className="homepage-v2 min-h-screen overflow-hidden bg-[#11100f] text-[#f2ecdf]">
        <InteractiveBackground />
        <a href="#main-content" className="skip-link">Bỏ qua điều hướng</a>
        <AppBar position="fixed" color="transparent" className="home-header !bg-[#11100f]/78 backdrop-blur-2xl"><Toolbar className="mx-auto flex min-h-[78px] w-full max-w-[1440px] !px-5 md:!px-8 xl:!px-12"><Logo /><Box component="nav" aria-label="Điều hướng landing page" className="ml-auto hidden items-center gap-1 lg:flex">{navItems.map(([label, href]) => <Button key={href} href={href} className="!min-h-10 !px-4 !text-[12px] !text-white/55 hover:!bg-white/[0.055] hover:!text-white">{label}</Button>)}</Box><Button href="/console" variant="contained" endIcon={<ArrowOutwardRounded />} className="!ml-4 !hidden !bg-[#f36a2d] !text-[#11100f] md:!inline-flex">Mở console</Button><IconButton onClick={() => setDrawerOpen(true)} aria-label="Mở menu" className="!ml-auto !h-12 !w-12 !bg-white/[0.055] !text-white lg:!hidden"><MenuRounded /></IconButton></Toolbar></AppBar>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ className: "!w-[min(86vw,380px)] !bg-[#171513] !p-5 !text-[#f2ecdf]" }}><div className="flex items-center justify-between"><Logo /><IconButton onClick={() => setDrawerOpen(false)} aria-label="Đóng menu" className="!text-white"><CloseRounded /></IconButton></div><Box className="mt-12 grid gap-2">{navItems.map(([label, href]) => <Button key={href} href={href} onClick={() => setDrawerOpen(false)} endIcon={<ArrowForwardRounded />} className="!min-h-14 !justify-between !rounded-2xl !bg-white/[0.045] !px-5 !text-white">{label}</Button>)}</Box><Button href="/console" variant="contained" className="!mt-auto !bg-[#f36a2d] !text-[#11100f]">Mở console</Button></Drawer>

        <Box component="main" id="main-content">
          <Box component="section" className="hero-grid relative mx-auto grid min-h-[900px] max-w-[1440px] items-center gap-14 px-5 pb-20 pt-32 md:px-8 lg:grid-cols-[.9fr_1.1fr] xl:px-12"><Box className="hero-copy relative z-10 max-w-[720px]"><Eyebrow>Perception assurance control plane</Eyebrow><Typography component="h1" className="!mt-7 !text-[clamp(3.6rem,7.7vw,8.5rem)] !font-[690] !leading-[0.84] !tracking-[-0.082em] !text-[#f2ecdf]">Biết model sẽ <span className="text-[#f36a2d]">gãy ở đâu.</span></Typography><Typography className="!mt-8 !max-w-[650px] !text-[17px] !leading-8 !text-[#aaa298] md:!text-[20px]">AdverTest biến adversarial testing, corruption benchmark, GPU budget và reviewer sign-off thành một luồng assurance có thể tái lập.</Typography><Box className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/console" variant="contained" endIcon={<ArrowForwardRounded />} className="!bg-[#f36a2d] !text-[#11100f]">Khởi chạy workspace</Button><Button href="#platform" variant="text" startIcon={<VisibilityRounded />} className="!bg-white/[0.055] !text-[#f2ecdf]">Xem cách hoạt động</Button></Box><Box className="mt-12 grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-7">{[["20+", "attack & corruption"], ["31%", "cache saving"], ["38/38", "reviewed cases"]].map(([value, label]) => <Box key={label}><Typography className="!text-[clamp(1.5rem,3vw,2.35rem)] !font-extrabold !tracking-[-0.06em] !text-[#f2ecdf]">{value}</Typography><Typography className="!mt-1 !text-[10px] !font-bold !uppercase !tracking-[0.11em] !text-white/32">{label}</Typography></Box>)}</Box></Box><Box className="relative z-10 lg:pl-4"><DemoPanel /></Box><Box className="hero-orbit absolute right-[-16rem] top-[6rem] h-[52rem] w-[52rem] rounded-full border border-[#f36a2d]/15" aria-hidden="true" /></Box>
          <Box className="signal-strip border-y border-white/[0.075] bg-[#171513] py-4"><Box className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 md:justify-between md:px-8 xl:px-12">{["DETERMINISTIC RUNS", "OBJECT DETECTION", "BUDGET-AWARE SWEEPS", "HUMAN-IN-THE-LOOP", "AUDIT-READY EXPORT"].map((item, index) => <Box key={item} className="flex items-center gap-3"><span className={`h-1.5 w-1.5 rounded-full ${index === 4 ? "bg-[#76d49b]" : "bg-[#f36a2d]"}`} /><Typography className="!text-[9px] !font-extrabold !tracking-[0.16em] !text-white/38">{item}</Typography></Box>)}</Box></Box>

          <Box component="section" id="platform" className="mx-auto max-w-[1440px] px-5 py-28 md:px-8 md:py-40 xl:px-12"><SectionTitle eyebrow="One evidence chain" title="Từ perturbation đến quyết định release." body="Không ghép nhiều tool rời rạc. Mỗi attack, metric, failure case và chữ ký reviewer nằm trong cùng một evidence chain." /><Box className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{workflow.map((item, index) => <Box key={item.number} className={`workflow-tile group flex min-h-[330px] flex-col rounded-[26px] p-6 ${index === 1 ? "bg-[#f36a2d] text-[#11100f]" : "bg-[#211e1b] text-[#f2ecdf]"}`}><div className="flex items-center justify-between"><Typography className={`!text-[11px] !font-extrabold !tracking-[0.16em] ${index === 1 ? "!text-black/48" : "!text-white/30"}`}>{item.number}</Typography><Box className={`grid h-11 w-11 place-items-center rounded-[14px] ${index === 1 ? "bg-black/10" : "bg-white/[0.06] text-[#f36a2d]"}`}>{item.icon}</Box></div><Typography component="h3" className="!mt-16 !text-[26px] !font-[680] !leading-[1.02] !tracking-[-0.05em]">{item.title}</Typography><Typography className={`!mt-4 !text-[14px] !leading-6 ${index === 1 ? "!text-black/65" : "!text-[#aaa298]"}`}>{item.body}</Typography><Typography className={`!mt-auto !pt-8 !text-[9px] !font-extrabold !tracking-[0.16em] ${index === 1 ? "!text-black/45" : "!text-white/28"}`}>{item.meta}</Typography></Box>)}</Box></Box>

          <Box component="section" id="failures" className="bg-[#171513] py-28 md:py-40"><Box className="mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12"><div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><SectionTitle eyebrow="Failure intelligence" title="Một con số không đủ để sửa model." body="Triage bắt đầu từ sample cụ thể: object nào biến mất, ở severity nào, reviewer kết luận gì và mitigation thuộc về ai." /><Button href="/console" endIcon={<ArrowOutwardRounded />} className="!self-start !bg-[#f2ecdf] !text-[#11100f] lg:!self-end">Mở failure queue</Button></div><Box className="mt-16"><FailureExplorer /></Box></Box></Box>

          <Box component="section" id="governance" className="mx-auto max-w-[1440px] px-5 py-28 md:px-8 md:py-40 xl:px-12"><Box className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><Box className="lg:sticky lg:top-28"><SectionTitle eyebrow="Governance by design" title="Người chạy test không tự ký kết quả." body="Separation of duties được phản ánh trực tiếp trong UI, API route và audit trail — không phải một dòng policy nằm ngoài sản phẩm." /><Box className="mt-9 flex flex-wrap gap-2"><Chip icon={<VerifiedUserRounded />} label="Role-aware UI" className="!bg-[#6ba9ff]/12 !text-[#9fc4ff]" /><Chip icon={<SecurityRounded />} label="Immutable sign-off" className="!bg-[#76d49b]/12 !text-[#96e1b2]" /><Chip icon={<MemoryRounded />} label="Cost hard cap" className="!bg-[#f36a2d]/12 !text-[#ffad88]" /></Box></Box><Box className="overflow-hidden rounded-[28px] bg-[#211e1b] p-3 sm:p-5"><Box className="grid grid-cols-[1.35fr_repeat(4,.65fr)] gap-2 px-3 py-4 text-center text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/30"><span className="text-left">Role</span><span>Prepare</span><span>Run</span><span>Triage</span><span>Sign</span></Box>{roles.map((row, index) => <Box key={row.role} className={`grid min-h-[76px] grid-cols-[1.35fr_repeat(4,.65fr)] items-center gap-2 rounded-[18px] px-3 text-center ${index === 1 ? "bg-[#6ba9ff]/10" : "bg-white/[0.035]"} ${index > 0 ? "mt-2" : ""}`}><Typography className="!text-left !text-[13px] !font-extrabold !text-[#f2ecdf]">{row.role}</Typography><PermissionMark enabled={row.prepare} /><PermissionMark enabled={row.run} /><PermissionMark enabled={row.triage} /><PermissionMark enabled={row.sign} /></Box>)}<Box className="mt-4 rounded-[20px] bg-[#11100f] p-5"><div className="flex items-center gap-3"><Box className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#76d49b]/12 text-[#76d49b]"><VerifiedUserRounded /></Box><div><Typography className="!text-[12px] !font-extrabold !text-[#f2ecdf]">Report RPT-2026-091</Typography><Typography className="!mt-1 !text-[11px] !text-white/38">VALIDATED · immutable audit event #418</Typography></div><Chip label="SIGNED" className="!ml-auto !bg-[#76d49b] !text-[#11100f]" /></div></Box></Box></Box></Box>

          <Box component="section" id="architecture" className="mx-auto max-w-[1440px] px-5 pb-28 md:px-8 md:pb-40 xl:px-12"><Box className="architecture-card relative overflow-hidden rounded-[34px] bg-[#f2ecdf] px-6 py-12 text-[#11100f] sm:px-10 md:px-16 md:py-20"><Box className="relative z-10 grid gap-12 lg:grid-cols-[1fr_.8fr] lg:items-end"><Box><Eyebrow tone="green" inverse>Open engine, product workflow</Eyebrow><Typography component="h2" className="!mt-7 !max-w-4xl !text-[clamp(2.8rem,6vw,6.5rem)] !font-[690] !leading-[0.9] !tracking-[-0.075em] !text-[#11100f]">Armory-grade testing. Product-grade decisions.</Typography></Box><Box><Typography className="!text-[16px] !leading-7 !text-black/58">ART/Armory attack ideas, FiftyOne-style failure analysis và governance riêng cho perception safety — đóng gói thành một workspace có thể vận hành.</Typography><Button href="/console" variant="contained" endIcon={<ArrowForwardRounded />} className="!mt-8 !bg-[#11100f] !text-[#f2ecdf]">Trải nghiệm console</Button></Box></Box><GridViewRounded className="!absolute !-bottom-20 !-right-16 !text-[24rem] !text-black/[0.035]" aria-hidden="true" /></Box></Box>
        </Box>

        <Box component="footer" className="border-t border-white/[0.075] bg-[#0d0c0b]"><Box className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8 xl:px-12"><Logo /><Typography className="!max-w-md !text-[12px] !leading-5 !text-white/34">Adversarial and corruption testing for safety-critical perception systems.</Typography><Box className="flex gap-2"><IconButton aria-label="System status" className="!bg-white/[0.05] !text-[#76d49b]"><SpeedRounded /></IconButton><IconButton aria-label="Architecture" className="!bg-white/[0.05] !text-[#6ba9ff]"><DataObjectRounded /></IconButton></Box></Box></Box>
      </Box>
    </ThemeProvider>
  );
}
