import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${((Math.sin(i * 97.3) * 0.5 + 0.5) * 100).toFixed(2)}%`,
  left: `${((Math.cos(i * 61.7) * 0.5 + 0.5) * 100).toFixed(2)}%`,
  size: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  opacity: 0.08 + (i % 6) * 0.04,
}));

function Stars() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: "#fff",
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ icon, title, subtitle, delay }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        borderRadius: 14,
        padding: "13px 16px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          borderRadius: 10,
          width: 36,
          height: 36,
          background: "rgba(139,92,246,0.18)",
          border: "1px solid rgba(139,92,246,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            color: "#e2e8f0",
            fontWeight: 600,
            fontSize: 13,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "rgba(148,163,184,0.7)",
            fontSize: 12,
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@accelia.in");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (admin) navigate("/dashboard", { replace: true });
  }, [admin, navigate]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result?.ok === false) {
        setError(result.error || "Invalid credentials.");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: "100%",
    padding: "13px 16px 13px 44px",
    fontSize: 14,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; }
        input::placeholder { color: rgba(148,163,184,0.5) !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #8b5cf6, 0 0 20px rgba(139,92,246,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 4px #8b5cf6, 0 0 10px rgba(139,92,246,0.2); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(139,92,246,0.45) !important; }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .stat-card:hover { background: rgba(139,92,246,0.08) !important; border-color: rgba(139,92,246,0.2) !important; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          minHeight: "100vh",
          width: "100%",
          fontFamily: "'Inter', sans-serif",
          background: "#0f1117",
          overflow: isMobile ? "auto" : "hidden",
        }}
      >
        {/* ── LEFT PANEL ── */}
        {(!isMobile || true) && (
          <div
            style={{
              flex: isMobile ? "none" : 1,
              background: "#0d1117",
              display: "flex",
              flexDirection: "column",
              justifyContent: isMobile ? "flex-start" : "space-between",
              padding: isMobile ? "32px 24px 28px" : "48px 52px",
              position: "relative",
              overflow: "hidden",
              borderRight: isMobile
                ? "none"
                : "1px solid rgba(255,255,255,0.06)",
              borderBottom: isMobile
                ? "1px solid rgba(255,255,255,0.06)"
                : "none",
              gap: isMobile ? 32 : 0,
              borderRight: isMobile ? "none" : "none",
            }}
          >
            {/* BG glow */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                left: "-10%",
                width: 500,
                height: 500,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                right: "5%",
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <Stars />

            {/* Logo */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                animation: "fadeUp 0.5s ease both",
                animationDelay: "0ms",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(139,92,246,0.18)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      color: "#f1f5f9",
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: "0.02em",
                      lineHeight: 1,
                    }}
                  >
                    Accelia
                  </p>
                  <p
                    style={{
                      color: "#8b5cf6",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginTop: 3,
                      lineHeight: 1,
                    }}
                  >
                    Clinical Solutions
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(148,163,184,0.5)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Admin Portal v2.4
                </span>
              </div>
            </div>

            {/* Headline */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                animation: "fadeUp 0.5s ease both",
                animationDelay: "100ms",
              }}
            >
              <h1
                style={{
                  fontWeight: 800,
                  lineHeight: 0.88,
                  margin: 0,
                  fontSize: isMobile ? 48 : 68,
                  letterSpacing: isMobile ? "-1.5px" : "-2.5px",
                }}
              >
                <span style={{ display: "block", color: "#f1f5f9" }}>
                  Admin
                </span>
                <span
                  style={{
                    display: "block",
                    background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Portal
                </span>
              </h1>
              <p
                style={{
                  marginTop: 16,
                  color: "rgba(148,163,184,0.65)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  maxWidth: 300,
                }}
              >
                Secure, centralized control for clinical operations, trial
                management, and advanced analytics.
              </p>
            </div>

            {/* Stats */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                  animation: "fadeUp 0.5s ease both",
                  animationDelay: "200ms",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                <p
                  style={{
                    color: "rgba(148,163,184,0.45)",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Enterprise Grade
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <StatCard
                  icon="👤"
                  title="250+ Clinicians"
                  subtitle="Active network"
                  delay={250}
                />
                <StatCard
                  icon="🧪"
                  title="30+ Clinical Trials"
                  subtitle="Across 6 states"
                  delay={300}
                />
                <StatCard
                  icon="⚡"
                  title="99.9% Uptime"
                  subtitle="Last 12 months"
                  delay={350}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── RIGHT PANEL — LOGIN FORM ── */}
        <div
          style={{
            flex: isMobile ? "none" : 1,
            background: "#0d1117",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? "36px 24px 52px" : "52px 60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20%",
              right: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "5%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <Stars />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 420,
              animation: "fadeUp 0.6s ease both",
              animationDelay: "150ms",
            }}
          >
            {/* Secure badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  color: "#8b5cf6",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Secure Access
              </span>
            </div>

            <h2
              style={{
                color: "#f1f5f9",
                fontSize: isMobile ? 30 : 38,
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: 8,
                letterSpacing: "-1px",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                color: "rgba(148,163,184,0.6)",
                fontSize: 14,
                marginBottom: 32,
              }}
            >
              Sign in to your administrator account
            </p>

            {/* Error */}
            {error && (
              <div
                style={{
                  marginBottom: 20,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#fca5a5",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  animation: "fadeUp 0.3s ease both",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* EMAIL */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    color: "rgba(148,163,184,0.7)",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      lineHeight: 0,
                      pointerEvents: "none",
                      color:
                        focusedField === "email"
                          ? "#8b5cf6"
                          : "rgba(148,163,184,0.5)",
                      transition: "color 0.2s",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin@accelia.in"
                    autoComplete="email"
                    style={{
                      ...inputBase,
                      borderColor:
                        focusedField === "email"
                          ? "rgba(139,92,246,0.5)"
                          : "rgba(255,255,255,0.08)",
                      boxShadow:
                        focusedField === "email"
                          ? "0 0 0 3px rgba(139,92,246,0.12)"
                          : "none",
                      background:
                        focusedField === "email"
                          ? "rgba(139,92,246,0.06)"
                          : "rgba(255,255,255,0.04)",
                    }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <label
                    style={{
                      color: "rgba(148,163,184,0.7)",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    style={{
                      color: "#8b5cf6",
                      fontSize: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      fontWeight: 500,
                      fontFamily: "inherit",
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 14,
                      lineHeight: 0,
                      pointerEvents: "none",
                      color:
                        focusedField === "password"
                          ? "#8b5cf6"
                          : "rgba(148,163,184,0.5)",
                      transition: "color 0.2s",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z" />
                    </svg>
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{
                      ...inputBase,
                      paddingRight: 46,
                      borderColor:
                        focusedField === "password"
                          ? "rgba(139,92,246,0.5)"
                          : "rgba(255,255,255,0.08)",
                      boxShadow:
                        focusedField === "password"
                          ? "0 0 0 3px rgba(139,92,246,0.12)"
                          : "none",
                      background:
                        focusedField === "password"
                          ? "rgba(139,92,246,0.06)"
                          : "rgba(255,255,255,0.04)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: "absolute",
                      right: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      lineHeight: 0,
                      padding: 6,
                      color: "rgba(148,163,184,0.5)",
                    }}
                  >
                    {showPw ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 5C7 5 2.7 8.1 1 12.5 2.7 16.9 7 20 12 20s9.3-3.1 11-7.5C21.3 8.1 17 5 12 5zm0 12.5a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                      </svg>
                    ) : (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.9 11.5C17 9.5 14.7 8 12 8c-.8 0-1.6.2-2.3.4L11 9.7c.3-.1.6-.2 1-.2 1.9 0 3.5 1.6 3.5 3.5 0 .4-.1.7-.2 1l1.3 1.3c.6-.7 1.1-1.5 1.3-2.8zm-5.9 4c-1.9 0-3.5-1.6-3.5-3.5 0-.4.1-.7.2-1L7.4 9.6C6.8 10.3 6.3 11.1 6 12c.9 2 3.2 3.5 6 3.5.8 0 1.6-.2 2.3-.4l-1.3-1.3c-.3.1-.6.2-1 .2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "none",
                  background: loading
                    ? "rgba(139,92,246,0.5)"
                    : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 4px 20px rgba(139,92,246,0.3)",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  letterSpacing: "0.01em",
                }}
              >
                {loading ? (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      style={{ animation: "spin 0.8s linear infinite" }}
                    >
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0110 10" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Trust badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
                marginTop: 28,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {["256-bit SSL", "HIPAA Compliant", "SOC 2"].map((b) => (
                <div
                  key={b}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="#8b5cf6"
                  >
                    <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-2 16l-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8z" />
                  </svg>
                  <span
                    style={{ color: "rgba(148,163,184,0.5)", fontSize: 12 }}
                  >
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
