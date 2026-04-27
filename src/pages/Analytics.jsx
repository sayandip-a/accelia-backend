import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ─── TOKENS ─────────────────────────────────────────────────────────────────── */
const T = {
  bg: "#070d1a",
  bg2: "#0c1525",
  bg3: "#111d30",
  bg4: "#162038",
  accent: "#4f9cf9",
  accent2: "#7c6af7",
  green: "#22d3a0",
  amber: "#f59e0b",
  rose: "#f43f5e",
  sky: "#38bdf8",
  purple: "#a78bfa",
  text1: "#e8edf5",
  text2: "#6b7fa3",
  text3: "#3a4a66",
  border: "rgba(79,156,249,0.10)",
  border2: "rgba(79,156,249,0.20)",
};

/* ─── DATA ────────────────────────────────────────────────────────────────────── */
const monthlyData = [
  {
    month: "Jan",
    trials: 8,
    patients: 312,
    jobs: 5,
    solutions: 3,
    revenue: 142,
  },
  {
    month: "Feb",
    trials: 11,
    patients: 428,
    jobs: 7,
    solutions: 4,
    revenue: 198,
  },
  {
    month: "Mar",
    trials: 9,
    patients: 389,
    jobs: 6,
    solutions: 5,
    revenue: 175,
  },
  {
    month: "Apr",
    trials: 14,
    patients: 521,
    jobs: 11,
    solutions: 6,
    revenue: 234,
  },
  {
    month: "May",
    trials: 13,
    patients: 487,
    jobs: 9,
    solutions: 5,
    revenue: 218,
  },
  {
    month: "Jun",
    trials: 17,
    patients: 634,
    jobs: 14,
    solutions: 8,
    revenue: 289,
  },
  {
    month: "Jul",
    trials: 16,
    patients: 598,
    jobs: 12,
    solutions: 7,
    revenue: 267,
  },
  {
    month: "Aug",
    trials: 21,
    patients: 743,
    jobs: 18,
    solutions: 9,
    revenue: 342,
  },
  {
    month: "Sep",
    trials: 19,
    patients: 682,
    jobs: 15,
    solutions: 10,
    revenue: 318,
  },
  {
    month: "Oct",
    trials: 24,
    patients: 891,
    jobs: 21,
    solutions: 12,
    revenue: 412,
  },
  {
    month: "Nov",
    trials: 22,
    patients: 834,
    jobs: 19,
    solutions: 11,
    revenue: 387,
  },
  {
    month: "Dec",
    trials: 28,
    patients: 1024,
    jobs: 24,
    solutions: 14,
    revenue: 456,
  },
];

const trialStatusData = [
  { name: "Active", value: 42, color: "#22d3a0" },
  { name: "Recruiting", value: 28, color: "#38bdf8" },
  { name: "Pending", value: 18, color: "#f59e0b" },
  { name: "Completed", value: 35, color: "#6b7fa3" },
  { name: "Suspended", value: 7, color: "#f43f5e" },
];

const phaseData = [
  { phase: "Phase I", trials: 24, patients: 480 },
  { phase: "Phase II", trials: 38, patients: 1140 },
  { phase: "Phase III", trials: 52, patients: 5200 },
  { phase: "Phase IV", trials: 16, patients: 3200 },
];

const jobsData = [
  { month: "Jan", open: 12, filled: 8, applications: 45 },
  { month: "Feb", open: 15, filled: 11, applications: 62 },
  { month: "Mar", open: 10, filled: 9, applications: 38 },
  { month: "Apr", open: 18, filled: 13, applications: 74 },
  { month: "May", open: 14, filled: 12, applications: 58 },
  { month: "Jun", open: 22, filled: 16, applications: 91 },
  { month: "Jul", open: 19, filled: 15, applications: 78 },
  { month: "Aug", open: 25, filled: 20, applications: 104 },
  { month: "Sep", open: 21, filled: 17, applications: 86 },
  { month: "Oct", open: 28, filled: 22, applications: 118 },
  { month: "Nov", open: 24, filled: 19, applications: 97 },
  { month: "Dec", open: 31, filled: 25, applications: 132 },
];

const radarData = [
  { subject: "Trials", A: 85, fullMark: 100 },
  { subject: "Patients", A: 72, fullMark: 100 },
  { subject: "Solutions", A: 90, fullMark: 100 },
  { subject: "Jobs", A: 68, fullMark: 100 },
  { subject: "Events", A: 78, fullMark: 100 },
  { subject: "Contacts", A: 94, fullMark: 100 },
];

const solutionsByCategory = [
  { name: "Trial Services", count: 8, color: "#4f9cf9" },
  { name: "Data Science", count: 6, color: "#7c6af7" },
  { name: "Regulatory", count: 4, color: "#f59e0b" },
  { name: "Patient Services", count: 7, color: "#22d3a0" },
  { name: "Communications", count: 3, color: "#f43f5e" },
  { name: "Safety", count: 5, color: "#fb923c" },
];

const KPIS = [
  {
    label: "Total Trials",
    value: 130,
    change: "+18%",
    up: true,
    color: T.accent,
    icon: "🧬",
  },
  {
    label: "Total Patients",
    value: "6.8K",
    change: "+24%",
    up: true,
    color: T.green,
    icon: "👥",
  },
  {
    label: "Open Jobs",
    value: 31,
    change: "+12%",
    up: true,
    color: T.amber,
    icon: "💼",
  },
  {
    label: "Active Solutions",
    value: 33,
    change: "+8%",
    up: true,
    color: T.accent2,
    icon: "💡",
  },
  {
    label: "News & Events",
    value: 48,
    change: "-3%",
    up: false,
    color: T.sky,
    icon: "📰",
  },
  {
    label: "Site Locations",
    value: 24,
    change: "+5%",
    up: true,
    color: T.rose,
    icon: "📍",
  },
];

const RANGES = ["6M", "1Y", "ALL"];

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.bg3,
        border: `1px solid ${T.border2}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: T.text2,
          marginBottom: 6,
          fontWeight: 600,
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            color: T.text1,
            marginBottom: 3,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color || p.fill,
            }}
          />
          <span style={{ color: T.text2 }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── CHART CARD ─────────────────────────────────────────────────────────────── */
function ChartCard({ title, subtitle, children, delay = 0, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: T.bg2,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: T.text1,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 11.5, color: T.text2, marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

/* ─── KPI CARD ────────────────────────────────────────────────────────────────── */
function KpiCard({ kpi, index }) {
  const [count, setCount] = useState(0);
  const numVal = parseInt(String(kpi.value).replace(/[^0-9]/g, ""));

  useEffect(() => {
    let start = 0;
    const end = numVal;
    if (!end) return;
    const step = Math.ceil(end / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [numVal]);

  const displayVal =
    typeof kpi.value === "string" && kpi.value.includes("K")
      ? (count / 1000).toFixed(1) + "K"
      : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        background: T.bg2,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
    >
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${kpi.color}15, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: `${kpi.color}18`,
            border: `1px solid ${kpi.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {kpi.icon}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 20,
            background: kpi.up ? "rgba(34,211,160,0.1)" : "rgba(244,63,94,0.1)",
            color: kpi.up ? T.green : T.rose,
            border: `1px solid ${kpi.up ? "rgba(34,211,160,0.2)" : "rgba(244,63,94,0.2)"}`,
          }}
        >
          {kpi.up ? "↑" : "↓"} {kpi.change}
        </span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: kpi.color,
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1,
        }}
      >
        {displayVal}
      </div>
      <div style={{ fontSize: 11.5, color: T.text2, marginTop: 5 }}>
        {kpi.label}
      </div>
    </motion.div>
  );
}

/* ─── RANGE PICKER ───────────────────────────────────────────────────────────── */
function RangePicker({ value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: T.bg3,
        borderRadius: 8,
        padding: 3,
      }}
    >
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.18s",
            background: value === r ? T.accent : "transparent",
            color: value === r ? "#fff" : T.text2,
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

/* ─── PIE LEGEND ─────────────────────────────────────────────────────────────── */
function PieLegend({ data }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        justifyContent: "center",
      }}
    >
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: d.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: T.text2, flex: 1 }}>
            {d.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.text1 }}>
            {d.value}
          </span>
          <span
            style={{
              fontSize: 10,
              color: T.text3,
              width: 36,
              textAlign: "right",
            }}
          >
            {Math.round((d.value / total) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────────── */
export default function Analytics() {
  const [range, setRange] = useState("1Y");
  const [activeTab, setActiveTab] = useState("overview");

  const slicedData = range === "6M" ? monthlyData.slice(6) : monthlyData;
  const slicedJobs = range === "6M" ? jobsData.slice(6) : jobsData;

  const tabs = ["overview", "trials", "patients", "jobs"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: T.text1,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 10px; }
        .recharts-cartesian-axis-tick text { fill: ${T.text3} !important; font-size: 11px; }
        .recharts-legend-item-text { color: ${T.text2} !important; font-size: 12px; }
        @media (max-width:768px) {
          .kpi-grid { grid-template-columns: repeat(2,1fr) !important; }
          .chart-row-2 { grid-template-columns: 1fr !important; }
          .chart-row-3 { grid-template-columns: 1fr !important; }
          .pie-inner { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px" }}>
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 26,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: T.accent,
                  boxShadow: `0 0 0 3px rgba(79,156,249,0.2)`,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: T.text2,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Analytics & Insights
              </span>
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                margin: 0,
              }}
            >
              Analytics
            </h1>
            <p style={{ fontSize: 13, color: T.text2, marginTop: 5 }}>
              Real-time overview of all clinical operations and portal activity
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <RangePicker value={range} onChange={setRange} />
            <div
              style={{
                fontSize: 11,
                color: T.text2,
                background: T.bg2,
                border: `1px solid ${T.border}`,
                padding: "6px 12px",
                borderRadius: 8,
              }}
            >
              Last updated: <span style={{ color: T.green }}>Just now</span>
            </div>
          </div>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "flex",
            gap: 4,
            background: T.bg2,
            borderRadius: 10,
            padding: 4,
            marginBottom: 24,
            width: "fit-content",
            border: `1px solid ${T.border}`,
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "7px 18px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
                textTransform: "capitalize",
                background: activeTab === t ? T.accent : "transparent",
                color: activeTab === t ? "#fff" : T.text2,
                boxShadow:
                  activeTab === t ? `0 2px 10px rgba(79,156,249,0.25)` : "none",
              }}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* ── KPI Grid ── */}
        <div
          className="kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {KPIS.map((k, i) => (
            <KpiCard key={i} kpi={k} index={i} />
          ))}
        </div>

        {/* ── Main Area + Pie ── */}
        <div
          className="chart-row-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Enrollment trend */}
          <ChartCard
            title="Enrollment Trend"
            subtitle="Monthly patient enrollment vs trial count"
            delay={0.1}
            action={
              <div style={{ fontSize: 11, color: T.text3 }}>12-month view</div>
            }
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={slicedData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.accent} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTrials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.green} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="patients"
                  name="Patients"
                  stroke={T.accent}
                  strokeWidth={2}
                  fill="url(#gPatients)"
                  dot={false}
                  activeDot={{ r: 5, fill: T.accent }}
                />
                <Area
                  type="monotone"
                  dataKey="trials"
                  name="Trials"
                  stroke={T.green}
                  strokeWidth={2}
                  fill="url(#gTrials)"
                  dot={false}
                  activeDot={{ r: 5, fill: T.green }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Trial Status Pie */}
          <ChartCard
            title="Trial Status"
            subtitle="Distribution by status"
            delay={0.15}
          >
            <div
              className="pie-inner"
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie
                    data={trialStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trialStatusData.map((e, i) => (
                      <Cell key={i} fill={e.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <PieLegend data={trialStatusData} />
            </div>
          </ChartCard>
        </div>

        {/* ── Middle Row ── */}
        <div
          className="chart-row-3"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {/* Jobs bar */}
          <ChartCard
            title="Jobs Overview"
            subtitle="Open vs filled positions"
            delay={0.18}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={slicedJobs}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={10}
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={T.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="open"
                  name="Open"
                  fill={T.amber}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="filled"
                  name="Filled"
                  fill={T.green}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Phase distribution */}
          <ChartCard
            title="Trials by Phase"
            subtitle="Patient enrollment per phase"
            delay={0.22}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={phaseData}
                layout="vertical"
                margin={{ top: 4, right: 4, left: 10, bottom: 0 }}
                barSize={10}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={T.border}
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: T.text3, fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="phase"
                  tick={{ fill: T.text2, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="trials"
                  name="Trials"
                  fill={T.accent2}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="patients"
                  name="Patients"
                  fill={T.sky}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Radar */}
          <ChartCard
            title="Portal Performance"
            subtitle="Across all modules"
            delay={0.26}
          >
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart
                data={radarData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <PolarGrid stroke={T.border2} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: T.text2, fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke={T.accent}
                  fill={T.accent}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ fill: T.accent, r: 3 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Bottom Row ── */}
        <div
          className="chart-row-2"
          style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}
        >
          {/* Revenue / solutions line */}
          <ChartCard
            title="Solutions Activity & Revenue"
            subtitle="Monthly revenue (K) and new solutions deployed"
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={slicedData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (K)"
                  stroke={T.amber}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="solutions"
                  name="Solutions"
                  stroke={T.accent2}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                  strokeDasharray="5 3"
                />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  name="Jobs"
                  stroke={T.rose}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeOpacity={0.6}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Solutions by category */}
          <ChartCard
            title="Solutions by Category"
            subtitle="Current portfolio breakdown"
            delay={0.34}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 9,
                marginTop: 4,
              }}
            >
              {solutionsByCategory.map((s, i) => {
                const max = Math.max(
                  ...solutionsByCategory.map((x) => x.count),
                );
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.34 + i * 0.05 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 12, color: T.text2 }}>
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: s.color,
                        }}
                      >
                        {s.count}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 10,
                        background: T.bg3,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.count / max) * 100}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.4 + i * 0.07,
                          ease: "easeOut",
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 10,
                          background: `linear-gradient(90deg, ${s.color}cc, ${s.color})`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ChartCard>
        </div>

        {/* ── Applications line ── */}
        <div style={{ marginTop: 16 }}>
          <ChartCard
            title="Job Applications Over Time"
            subtitle="Monthly application volume trends"
            delay={0.38}
          >
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={slicedJobs}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={T.sky} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={T.sky} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: T.text3, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke={T.sky}
                  strokeWidth={2.5}
                  fill="url(#gApps)"
                  dot={false}
                  activeDot={{ r: 5, fill: T.sky }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
