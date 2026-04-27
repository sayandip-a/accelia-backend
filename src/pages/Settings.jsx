import { useState, useEffect } from "react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const tabs = [
  { id: "profile", label: "Profile", icon: "👤", color: "#5eead4" },
  { id: "notifications", label: "Notifications", icon: "🔔", color: "#fbbf24" },
  { id: "security", label: "Security", icon: "🔒", color: "#818cf8" },
  { id: "portal", label: "Portal", icon: "🌐", color: "#34d399" },
  { id: "danger", label: "Danger Zone", icon: "⚠️", color: "#f87171" },
];

function Toggle({ value, onChange, accent = "#5eead4" }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        border: "none",
        cursor: "pointer",
        background: value ? accent : "rgba(255,255,255,0.1)",
        position: "relative",
        transition: "background 0.25s",
        flexShrink: 0,
        boxShadow: value ? `0 0 10px ${accent}55` : "none",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
        }}
      />
    </button>
  );
}

function SettingRow({ label, desc, children, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        gap: 16,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: hov ? "#f1f5f9" : "#94a3b8",
            margin: 0,
            transition: "color 0.2s",
          }}
        >
          {label}
        </p>
        {desc && (
          <p
            style={{
              fontSize: 12,
              color: "#334155",
              margin: "3px 0 0",
              lineHeight: 1.5,
            }}
          >
            {desc}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Card({ title, accent = "#5eead4", children, delay = 0 }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        background: "#0d1526",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.07)",
        marginBottom: 18,
        overflow: "hidden",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {title && (
        <div
          style={{
            padding: "13px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            fontSize: 11,
            fontWeight: 700,
            color: accent,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "0 22px" }}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  accent = "#5eead4",
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          display: "block",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: focused ? accent : "#334155",
          transition: "color 0.2s",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: 14,
          border: `1px solid ${focused ? accent + "44" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          color: "#e2e8f0",
          outline: "none",
          boxSizing: "border-box",
          boxShadow: focused ? `0 0 0 3px ${accent}14` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
    </div>
  );
}

function DangerBtn({ label, desc, btnLabel, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 0",
        borderBottom: "1px solid rgba(248,113,113,0.07)",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <p
          style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", margin: 0 }}
        >
          {label}
        </p>
        {desc && (
          <p style={{ fontSize: 12, color: "#334155", margin: "3px 0 0" }}>
            {desc}
          </p>
        )}
      </div>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          flexShrink: 0,
          padding: "7px 16px",
          borderRadius: 9,
          border: "1px solid rgba(248,113,113,0.25)",
          background: hov ? "rgba(248,113,113,0.14)" : "rgba(248,113,113,0.06)",
          color: "#f87171",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {btnLabel}
      </button>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    orgName: "Accelia Clinical Solutions",
    email: "admin@accelia.in",
    phone: "+91 98300 00000",
    website: "https://accelia.in",
  });
  const [notifs, setNotifs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    trialAlerts: true,
    jobAlerts: true,
    weeklyDigest: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: true,
    loginAlerts: true,
    apiAccess: false,
  });
  const [portal, setPortal] = useState({
    publicPortal: true,
    allowRegistration: true,
    autoPublish: false,
    seoEnabled: true,
    maintenanceMode: false,
  });

  const setN = (k) => (v) => setNotifs((s) => ({ ...s, [k]: v }));
  const setSec = (k) => (v) => setSecurity((s) => ({ ...s, [k]: v }));
  const setP = (k) => (v) => setPortal((s) => ({ ...s, [k]: v }));
  const setProf = (k) => (v) => setProfile((s) => ({ ...s, [k]: v }));

  const tab = tabs.find((t) => t.id === activeTab);
  const accent = tab?.color || "#5eead4";

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sr { display: flex; flex-direction: column; min-height: 100vh; background: #080f1e; font-family: 'DM Sans', sans-serif; color: #e2e8f0; }

        .sr-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }

        .sr-content { flex: 1; padding: 36px 40px 100px; max-width: 860px; width: 100%; margin: 0 auto; }

        /* Top tab bar */
        .sr-tabbar {
          background: #0b1120;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 40px;
          display: flex; gap: 4px; overflow-x: auto;
          scrollbar-width: none;
        }
        .sr-tabbar::-webkit-scrollbar { display: none; }

        .sr-tab {
          display: flex; align-items: center; gap: 8px; padding: 14px 16px;
          border: none; cursor: pointer; font-size: 13.5px; font-weight: 500;
          background: transparent; color: #475569; transition: all 0.18s;
          font-family: 'DM Sans', sans-serif; white-space: nowrap;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
        }
        .sr-tab:hover { color: #94a3b8; }
        .sr-tab.on { font-weight: 700; border-bottom-color: currentColor; }

        .sr-savebar {
          position: fixed; bottom: 0; right: 0; left: 0;
          padding: 14px 40px;
          background: rgba(8,15,30,0.97);
          border-top: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: flex-end; gap: 14px; z-index: 50;
        }

        .sr-savebtn {
          padding: 10px 26px; border-radius: 11px; border: none;
          font-size: 14px; font-weight: 700; min-width: 140px;
          transition: all 0.2s; font-family: 'DM Sans', sans-serif; cursor: pointer;
        }

        .fadeup { animation: fu 0.35s ease forwards; }
        @keyframes fu { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

        @media (max-width: 700px) {
          .sr-content { padding: 22px 18px 100px; }
          .sr-tabbar { padding: 0 12px; }
          .sr-savebar { padding: 14px 18px; }
        }
        @media (max-width: 500px) { .twocol { grid-template-columns: 1fr !important; } }
      `}</style>

      <div className="sr">
        <div className="sr-body">
          {/* ── Top Tab Bar ── */}
          <div className="sr-tabbar">
            {tabs.map((t) => {
              const on = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  className={`sr-tab${on ? " on" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                  style={{ color: on ? t.color : undefined }}
                >
                  <span style={{ fontSize: 15 }}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="sr-content">
            <div key={activeTab} className="fadeup">
              {/* Page header */}
              <div
                style={{
                  marginBottom: 28,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: accent,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    CLINIX RESEARCH PLATFORM
                  </p>
                  <h1
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 30,
                      fontWeight: 800,
                      color: "#f1f5f9",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {tab?.label}
                  </h1>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ dot: true, label: "Live" }, { label: "v2.4.1" }].map(
                    (chip, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "7px 14px",
                          borderRadius: 20,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          fontSize: 12,
                          color: "#475569",
                        }}
                      >
                        {chip.dot && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: accent,
                              boxShadow: `0 0 6px ${accent}`,
                            }}
                          />
                        )}
                        {chip.label}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: 24,
                }}
              />

              {/* PROFILE */}
              {activeTab === "profile" && (
                <>
                  <Card title="Organization Info" accent={accent} delay={0}>
                    <div style={{ paddingTop: 20 }}>
                      <div
                        className="twocol"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0 20px",
                        }}
                      >
                        <div style={{ gridColumn: "1/-1" }}>
                          <Field
                            label="Organization Name"
                            value={profile.orgName}
                            onChange={setProf("orgName")}
                            accent={accent}
                          />
                        </div>
                        <Field
                          label="Admin Email"
                          value={profile.email}
                          onChange={setProf("email")}
                          type="email"
                          accent={accent}
                        />
                        <Field
                          label="Phone"
                          value={profile.phone}
                          onChange={setProf("phone")}
                          accent={accent}
                        />
                        <div style={{ gridColumn: "1/-1" }}>
                          <Field
                            label="Website"
                            value={profile.website}
                            onChange={setProf("website")}
                            accent={accent}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                  <Card title="Organization Logo" accent={accent} delay={80}>
                    <div
                      style={{
                        padding: "20px 0",
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 16,
                          flexShrink: 0,
                          background: `linear-gradient(135deg,${accent},${accent}88)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#080f1e",
                          fontFamily: "'Syne',sans-serif",
                          transition: "transform 0.3s",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform =
                            "scale(1.06) rotate(2deg)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        {profile.orgName?.slice(0, 2).toUpperCase() || "AC"}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#e2e8f0",
                            marginBottom: 4,
                          }}
                        >
                          Upload Logo
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#334155",
                            marginBottom: 12,
                          }}
                        >
                          PNG or SVG · max 2MB
                        </p>
                        <button
                          style={{
                            padding: "7px 16px",
                            borderRadius: 9,
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.05)",
                            color: "#94a3b8",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                          }}
                        >
                          Choose File
                        </button>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <Card title="Notification Preferences" accent={accent}>
                  <SettingRow
                    label="Email Notifications"
                    desc="Receive updates and alerts via email"
                    accent={accent}
                  >
                    <Toggle
                      value={notifs.emailNotifs}
                      onChange={setN("emailNotifs")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="SMS Notifications"
                    desc="Critical alerts sent to your registered phone"
                    accent={accent}
                  >
                    <Toggle
                      value={notifs.smsNotifs}
                      onChange={setN("smsNotifs")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Clinical Trial Alerts"
                    desc="Notify when trial status changes or milestones are reached"
                    accent={accent}
                  >
                    <Toggle
                      value={notifs.trialAlerts}
                      onChange={setN("trialAlerts")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Job Application Alerts"
                    desc="Get notified when new applications are submitted"
                    accent={accent}
                  >
                    <Toggle
                      value={notifs.jobAlerts}
                      onChange={setN("jobAlerts")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Weekly Digest"
                    desc="Summary email every Monday with key metrics"
                    accent={accent}
                  >
                    <Toggle
                      value={notifs.weeklyDigest}
                      onChange={setN("weeklyDigest")}
                      accent={accent}
                    />
                  </SettingRow>
                </Card>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <>
                  <Card title="Authentication" accent={accent} delay={0}>
                    <SettingRow
                      label="Two-Factor Authentication"
                      desc="Require a verification code on every login"
                      accent={accent}
                    >
                      <Toggle
                        value={security.twoFactor}
                        onChange={setSec("twoFactor")}
                        accent={accent}
                      />
                    </SettingRow>
                    <SettingRow
                      label="Login Alerts"
                      desc="Email me when a new device logs in"
                      accent={accent}
                    >
                      <Toggle
                        value={security.loginAlerts}
                        onChange={setSec("loginAlerts")}
                        accent={accent}
                      />
                    </SettingRow>
                    <SettingRow
                      label="Session Timeout"
                      desc="Auto-logout after 30 minutes of inactivity"
                      accent={accent}
                    >
                      <Toggle
                        value={security.sessionTimeout}
                        onChange={setSec("sessionTimeout")}
                        accent={accent}
                      />
                    </SettingRow>
                    <SettingRow
                      label="Enable API Access"
                      desc="Allow external integrations via REST API"
                      accent={accent}
                    >
                      <Toggle
                        value={security.apiAccess}
                        onChange={setSec("apiAccess")}
                        accent={accent}
                      />
                    </SettingRow>
                  </Card>
                  <Card title="Change Password" accent={accent} delay={100}>
                    <div style={{ paddingTop: 20 }}>
                      <Field
                        label="Current Password"
                        value=""
                        onChange={() => {}}
                        type="password"
                        placeholder="••••••••"
                        accent={accent}
                      />
                      <Field
                        label="New Password"
                        value=""
                        onChange={() => {}}
                        type="password"
                        placeholder="••••••••"
                        accent={accent}
                      />
                      <Field
                        label="Confirm New Password"
                        value=""
                        onChange={() => {}}
                        type="password"
                        placeholder="••••••••"
                        accent={accent}
                      />
                      <button
                        style={{
                          padding: "10px 22px",
                          borderRadius: 11,
                          border: "none",
                          background: `linear-gradient(135deg,${accent},${accent}bb)`,
                          color: "#080f1e",
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          marginBottom: 22,
                        }}
                      >
                        Update Password
                      </button>
                    </div>
                  </Card>
                </>
              )}

              {/* PORTAL */}
              {activeTab === "portal" && (
                <Card title="Portal Configuration" accent={accent}>
                  <SettingRow
                    label="Public Portal"
                    desc="Make your research portal publicly accessible"
                    accent={accent}
                  >
                    <Toggle
                      value={portal.publicPortal}
                      onChange={setP("publicPortal")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Allow Public Registration"
                    desc="Let visitors create accounts on the portal"
                    accent={accent}
                  >
                    <Toggle
                      value={portal.allowRegistration}
                      onChange={setP("allowRegistration")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Auto-Publish Jobs"
                    desc="Automatically publish approved job listings"
                    accent={accent}
                  >
                    <Toggle
                      value={portal.autoPublish}
                      onChange={setP("autoPublish")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="SEO Optimization"
                    desc="Enable meta tags and structured data for search engines"
                    accent={accent}
                  >
                    <Toggle
                      value={portal.seoEnabled}
                      onChange={setP("seoEnabled")}
                      accent={accent}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Maintenance Mode"
                    desc="Take the portal offline for scheduled maintenance"
                    accent="#f87171"
                  >
                    <Toggle
                      value={portal.maintenanceMode}
                      onChange={setP("maintenanceMode")}
                      accent="#f87171"
                    />
                  </SettingRow>
                  {portal.maintenanceMode && (
                    <div
                      className="fadeup"
                      style={{
                        margin: "10px 0 14px",
                        padding: "12px 16px",
                        borderRadius: 10,
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        fontSize: 13,
                        color: "#fca5a5",
                      }}
                    >
                      ⚠️ Maintenance mode is active. Portal is offline for
                      visitors.
                    </div>
                  )}
                </Card>
              )}

              {/* DANGER */}
              {activeTab === "danger" && (
                <div
                  style={{
                    background: "#0d1120",
                    borderRadius: 16,
                    border: "1px solid rgba(248,113,113,0.18)",
                    overflow: "hidden",
                    boxShadow: "0 4px 30px rgba(248,113,113,0.07)",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 22px",
                      borderBottom: "1px solid rgba(248,113,113,0.1)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#f87171",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: "rgba(248,113,113,0.04)",
                    }}
                  >
                    ⚠️ Danger Zone
                  </div>
                  <div style={{ padding: "0 22px" }}>
                    <DangerBtn
                      label="Clear All Cache"
                      desc="Flush platform cache — may cause brief slowdowns"
                      btnLabel="Clear Cache"
                      onClick={() => alert("Cache cleared")}
                    />
                    <DangerBtn
                      label="Export All Data"
                      desc="Download a full JSON export of your platform data"
                      btnLabel="Export"
                      onClick={() => alert("Export started")}
                    />
                    <DangerBtn
                      label="Reset Portal Settings"
                      desc="Restore all portal settings to factory defaults"
                      btnLabel="Reset"
                      onClick={() => {
                        if (window.confirm("Reset all portal settings?"))
                          alert("Reset done");
                      }}
                    />
                    <DangerBtn
                      label="Delete Organization"
                      desc="Permanently delete this organization and all data. Cannot be undone."
                      btnLabel="Delete Org"
                      onClick={() => {
                        if (window.confirm("Permanently delete organization?"))
                          alert("Deleted");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save bar */}
          {activeTab !== "danger" && (
            <div className="sr-savebar">
              {saved && (
                <span
                  className="fadeup"
                  style={{
                    fontSize: 13,
                    color: accent,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: `${accent}18`,
                      border: `1px solid ${accent}40`,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                    }}
                  >
                    ✓
                  </span>
                  Saved successfully
                </span>
              )}
              <button
                className="sr-savebtn"
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving
                    ? "rgba(255,255,255,0.06)"
                    : `linear-gradient(135deg,${accent},${accent}bb)`,
                  color: saving ? "#475569" : "#080f1e",
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: saving ? "none" : `0 4px 18px ${accent}38`,
                }}
              >
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
