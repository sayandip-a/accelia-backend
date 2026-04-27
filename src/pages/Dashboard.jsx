/**
 * Dashboard.jsx — Drop-in replacement for the main content area.
 * Does NOT include a sidebar. Designed to render inside your existing
 * layout shell that already provides the sidebar + router.
 *
 * Usage (in your layout/router):
 *   import Dashboard from "./Dashboard";
 *   // render it wherever your <Outlet /> or page content goes.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

/* ─── data ─────────────────────────────────────────────────────── */

const STATS = [
  {
    label: "Total Patients",
    value: 1284,
    change: "+24 this week",
    up: true,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.1)",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z",
  },
  {
    label: "Active Trials",
    value: 12,
    change: "+3 new",
    up: true,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18",
  },
  {
    label: "Open Jobs",
    value: 8,
    change: "+2 new today",
    up: true,
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.1)",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2",
  },
  {
    label: "Pending Alerts",
    value: 5,
    change: "2 urgent",
    up: false,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.1)",
    icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  },
  {
    label: "Team Members",
    value: 34,
    change: "+6 joined",
    up: true,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "News Posts",
    value: 23,
    change: "+5 published",
    up: true,
    color: "#2dd4bf",
    bg: "rgba(45,212,191,0.1)",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
];

const TRIALS = [
  {
    name: "Neurological Disorder Study",
    phase: "Phase I",
    status: "Completed",
    pi: "Dr. A. Shah",
    enrolled: 48,
    color: "#22d3a0",
  },
  {
    name: "Immunotherapy Research",
    phase: "Phase II",
    status: "Active",
    pi: "Dr. R. Patel",
    enrolled: 112,
    color: "#38bdf8",
  },
  {
    name: "Diabetes Management Protocol",
    phase: "Phase III",
    status: "Pending",
    pi: "Dr. M. Verma",
    enrolled: 230,
    color: "#f59e0b",
  },
  {
    name: "Cardiovascular Prevention Trial",
    phase: "Phase II",
    status: "Active",
    pi: "Dr. L. Chen",
    enrolled: 89,
    color: "#a78bfa",
  },
  {
    name: "Oncology Biomarker Study",
    phase: "Phase I",
    status: "Recruiting",
    pi: "Dr. K. Iyer",
    enrolled: 21,
    color: "#f43f5e",
  },
];

const TEAM = [
  {
    name: "Dr. Priya Mehta",
    dept: "Neurology",
    status: "Online",
    color: "#a78bfa",
  },
  {
    name: "Dr. James Ford",
    dept: "Immunology",
    status: "In Meeting",
    color: "#38bdf8",
  },
  {
    name: "Dr. Emily Ross",
    dept: "Biostatistics",
    status: "Online",
    color: "#22d3a0",
  },
  {
    name: "Dr. Arjun Sharma",
    dept: "Oncology",
    status: "Away",
    color: "#f59e0b",
  },
];

const JOBS = [
  {
    title: "Senior Clinical Research Associate",
    dept: "Cardiology",
    type: "Full-time",
    apps: 14,
    posted: "2d ago",
    color: "#38bdf8",
  },
  {
    title: "Biostatistician",
    dept: "Data Science",
    type: "Full-time",
    apps: 9,
    posted: "4d ago",
    color: "#22d3a0",
  },
  {
    title: "Regulatory Affairs Specialist",
    dept: "Compliance",
    type: "Contract",
    apps: 6,
    posted: "1w ago",
    color: "#f59e0b",
  },
  {
    title: "Clinical Data Manager",
    dept: "IT / Data",
    type: "Full-time",
    apps: 11,
    posted: "3d ago",
    color: "#a78bfa",
  },
];

const STATUS_DOT = {
  Online: "#22d3a0",
  "In Meeting": "#f59e0b",
  Away: "#64748b",
};

/* ─── tiny helpers ─────────────────────────────────────────────── */

function Icon({ d, size = 15 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function useCountUp(target, go) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!go) return;
    let raf;
    const t0 = performance.now(),
      dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, go]);
  return n;
}

/* ─── StatCard ─────────────────────────────────────────────────── */

function StatCard({ s, idx, go }) {
  const [hov, setHov] = useState(false);
  const num = useCountUp(s.value, go);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#111e35",
        border: `1px solid ${hov ? s.color + "55" : "rgba(56,189,248,0.1)"}`,
        borderRadius: 16,
        padding: "18px 16px",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.32s cubic-bezier(.34,1.56,.64,1)",
        transform: hov
          ? "translateY(-5px) scale(1.03)"
          : "translateY(0) scale(1)",
        animation: `dashFadeUp 0.5s ease ${idx * 75}ms both`,
      }}
    >
      {/* glow orb */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: s.bg,
          opacity: hov ? 1 : 0.45,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }}
      />

      {/* icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: s.bg,
          color: s.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Icon d={s.icon} size={17} />
      </div>

      {/* number */}
      <div
        style={{
          fontFamily: "'Syne',sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: "#f1f5f9",
          lineHeight: 1,
        }}
      >
        {num.toLocaleString()}
      </div>

      {/* label */}
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          marginTop: 5,
          fontWeight: 500,
        }}
      >
        {s.label}
      </div>

      {/* change */}
      <div
        style={{
          fontSize: 11,
          marginTop: 8,
          color: s.up ? "#22d3a0" : "#f43f5e",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        {s.up ? "↑" : "↓"} {s.change}
      </div>
    </div>
  );
}

/* ─── AnalogClock ──────────────────────────────────────────────── */

function AnalogClock({ t }) {
  const h = t.getHours(),
    m = t.getMinutes(),
    s = t.getSeconds();
  const hDeg = (h % 12) * 30 + m * 0.5;
  const mDeg = m * 6 + s * 0.1;
  const sDeg = s * 6;
  const arm = (deg, len) => ({
    x: 20 + len * Math.cos(((deg - 90) * Math.PI) / 180),
    y: 20 + len * Math.sin(((deg - 90) * Math.PI) / 180),
  });
  return (
    <svg width="42" height="42" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="rgba(56,189,248,0.05)"
        stroke="rgba(56,189,248,0.2)"
        strokeWidth="1.2"
      />
      {[...Array(12)].map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 12 : 13;
        return (
          <line
            key={i}
            x1={20 + r1 * Math.cos(a)}
            y1={20 + r1 * Math.sin(a)}
            x2={20 + 15 * Math.cos(a)}
            y2={20 + 15 * Math.sin(a)}
            stroke={i % 3 === 0 ? "#38bdf8" : "rgba(56,189,248,0.3)"}
            strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
          />
        );
      })}
      <line
        x1="20"
        y1="20"
        x2={arm(hDeg, 7).x}
        y2={arm(hDeg, 7).y}
        stroke="#e2e8f0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2={arm(mDeg, 11).x}
        y2={arm(mDeg, 11).y}
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2={arm(sDeg, 12).x}
        y2={arm(sDeg, 12).y}
        stroke="#f43f5e"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="2" fill="#38bdf8" />
    </svg>
  );
}

/* ─── Dashboard ────────────────────────────────────────────────── */

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [time, setTime] = useState(new Date());
  const [go, setGo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [logoutHov, setLogoutHov] = useState(false);
  const [logoutAnim, setLogoutAnim] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMounted(true);
    const id = setTimeout(() => setGo(true), 300);
    return () => clearTimeout(id);
  }, []);

  const handleLogout = () => {
    setLogoutAnim(true);
    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
    }, 650);
  };

  const timeStr = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const dateStr = time.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const firstName = admin?.name?.split(" ")[0] || "Admin";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'DM Sans',sans-serif",
        background: "#080f1e",
        color: "#f1f5f9",
        minHeight: 0,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(56,189,248,0.18);border-radius:4px}
        @keyframes dashFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulseGreen{0%,100%{box-shadow:0 0 0 0 rgba(34,211,160,.5)}70%{box-shadow:0 0 0 6px rgba(34,211,160,0)}}
        @keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,.5)}70%{box-shadow:0 0 0 5px rgba(244,63,94,0)}}
        @keyframes logoutBounce{0%{transform:scale(1) rotate(0)}40%{transform:scale(.82) rotate(14deg)}100%{transform:scale(1) rotate(0)}}
        .dash-bell:hover{color:#e2e8f0!important;border-color:rgba(56,189,248,.3)!important}
        .dash-navbtn:hover{background:rgba(56,189,248,.07)!important}
        @media(max-width:700px){
          .dash-stats{grid-template-columns:repeat(2,1fr)!important}
          .dash-panels{grid-template-columns:1fr!important}
          .dash-clock-wrap{display:none!important}
        }
        @media(max-width:420px){
          .dash-stats{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      {/* ── TOP BAR ──────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 58,
          flexShrink: 0,
          borderBottom: "1px solid rgba(56,189,248,0.08)",
          background: "rgba(8,15,30,0.97)",
          backdropFilter: "blur(14px)",
          gap: 12,
          zIndex: 10,
        }}
      >
        {/* Left: title + date */}
        <div>
          <div
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 19,
              fontWeight: 800,
              color: "#f1f5f9",
              lineHeight: 1,
            }}
          >
            Dashboard
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
            {dateStr}
          </div>
        </div>

        {/* Centre: live clock */}
        <div
          className="dash-clock-wrap"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 17,
                fontWeight: 800,
                color: "#38bdf8",
                letterSpacing: 0.5,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {timeStr}
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
              {dateStr}
            </div>
          </div>
        </div>

        {/* Right: bell + admin + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* notification bell */}
          <div
            className="dash-bell"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.025)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            <Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            <div
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#f43f5e",
                border: "1.5px solid #080f1e",
                animation: "pulseRed 2s infinite",
              }}
            />
          </div>

          {/* admin pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 11px",
              borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.025)",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {(admin?.name || "AD").slice(0, 2).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500 }}>
              {admin?.name || "Admin"}
            </span>
          </div>

          {/* logout */}
          <button
            onMouseEnter={() => setLogoutHov(true)}
            onMouseLeave={() => setLogoutHov(false)}
            onClick={handleLogout}
            title="Logout"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              border: `1px solid ${logoutHov ? "rgba(244,63,94,0.4)" : "rgba(56,189,248,0.12)"}`,
              background: logoutHov ? "rgba(244,63,94,0.08)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: logoutHov ? "#f43f5e" : "#64748b",
              transition: "all 0.28s cubic-bezier(.34,1.56,.64,1)",
              transform: logoutHov ? "scale(1.12)" : "scale(1)",
              animation: logoutAnim
                ? "logoutBounce 0.65s ease forwards"
                : "none",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                width: 15,
                height: 15,
                transition: "transform 0.25s",
                transform: logoutHov ? "translateX(2px)" : "none",
              }}
            >
              <path
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
        {/* Welcome banner */}
        <div
          style={{
            marginBottom: 20,
            padding: "16px 20px",
            background:
              "linear-gradient(135deg,rgba(56,189,248,0.07) 0%,rgba(99,102,241,0.07) 100%)",
            border: "1px solid rgba(56,189,248,0.14)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            animation: mounted ? "dashFadeUp 0.5s ease both" : "none",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              Welcome back, {firstName} 👋
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
              Here's what's happening across your clinical network today.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              background: "rgba(34,211,160,0.1)",
              border: "1px solid rgba(34,211,160,0.2)",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22d3a0",
                animation: "pulseGreen 2s infinite",
              }}
            />
            <span style={{ fontSize: 11, color: "#22d3a0", fontWeight: 600 }}>
              All systems operational
            </span>
          </div>
        </div>

        {/* Stats */}
        <div
          className="dash-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))",
            gap: 12,
            marginBottom: 18,
          }}
        >
          {STATS.map((s, i) => (
            <StatCard key={s.label} s={s} idx={i} go={go} />
          ))}
        </div>

        {/* Bottom panels */}
        <div
          className="dash-panels"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {/* Recent Trials */}
          <div
            style={{
              background: "#0e1a2e",
              border: "1px solid rgba(56,189,248,0.09)",
              borderRadius: 16,
              padding: 18,
              animation: "dashFadeUp 0.5s ease 0.35s both",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#e2e8f0",
                }}
              >
                Recent Trials
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#38bdf8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                VIEW ALL →
              </span>
            </div>
            {TRIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom:
                    i < TRIALS.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: t.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#e2e8f0",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>
                    {t.phase} · {t.pi} · {t.enrolled} enrolled
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 9px",
                    borderRadius: 20,
                    flexShrink: 0,
                    color: t.color,
                    background: t.color + "1a",
                    border: `1px solid ${t.color}35`,
                  }}
                >
                  {t.status}
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Team */}
            <div
              style={{
                background: "#0e1a2e",
                border: "1px solid rgba(56,189,248,0.09)",
                borderRadius: 16,
                padding: 18,
                animation: "dashFadeUp 0.5s ease 0.45s both",
              }}
            >
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
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  Team Members
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "#38bdf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  VIEW ALL →
                </span>
              </div>
              {TEAM.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 0",
                    borderBottom:
                      i < TEAM.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: m.color + "1a",
                      border: `1px solid ${m.color}35`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      color: m.color,
                    }}
                  >
                    {m.name
                      .split(" ")
                      .slice(1)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#e2e8f0",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#475569" }}>
                      {m.dept}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: STATUS_DOT[m.status] || "#64748b",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: STATUS_DOT[m.status] || "#64748b",
                      }}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Open Jobs */}
            <div
              style={{
                background: "#0e1a2e",
                border: "1px solid rgba(56,189,248,0.09)",
                borderRadius: 16,
                padding: 18,
                animation: "dashFadeUp 0.5s ease 0.55s both",
              }}
            >
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
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  Open Job Posts
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: "#38bdf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  POST JOB →
                </span>
              </div>
              {JOBS.map((j, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 0",
                    borderBottom:
                      i < JOBS.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: j.color + "18",
                      border: `1px solid ${j.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: j.color,
                    }}
                  >
                    <Icon
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
                      size={13}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#e2e8f0",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {j.title}
                    </div>
                    <div style={{ fontSize: 10, color: "#475569" }}>
                      {j.dept} · {j.type} · {j.posted}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      flexShrink: 0,
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: j.color, fontWeight: 700 }}>
                      {j.apps}
                    </span>{" "}
                    apps
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
