import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const PHASE_META = {
  "Phase I": {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.25)",
  },
  "Phase II": {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.25)",
  },
  "Phase III": {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.25)",
  },
  "Phase IV": {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.12)",
    border: "rgba(34,211,160,0.25)",
  },
};

const STATUS_META = {
  Active: {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.10)",
    border: "rgba(34,211,160,0.25)",
    dot: "#22d3a0",
  },
  Recruiting: {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.10)",
    border: "rgba(56,189,248,0.25)",
    dot: "#38bdf8",
  },
  Completed: {
    color: "#6b7fa3",
    bg: "rgba(107,127,163,0.10)",
    border: "rgba(107,127,163,0.25)",
    dot: "#6b7fa3",
  },
  Pending: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
    dot: "#f59e0b",
  },
  Suspended: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.10)",
    border: "rgba(244,63,94,0.25)",
    dot: "#f43f5e",
  },
};

const INITIAL_TRIALS = [
  {
    id: 1,
    trialId: "CT-2024-001",
    name: "Phase III Oncology Study",
    phase: "Phase III",
    status: "Active",
    indication: "Lung Cancer",
    sponsor: "Clinix Medical",
    patients: 120,
    target: 200,
    lead: "Dr. Sarah Chen",
    startDate: "Jan 2024",
    endDate: "Dec 2025",
    sites: 6,
    country: "USA",
    description:
      "A randomized double-blind study evaluating novel immunotherapy combinations in advanced lung cancer patients.",
  },
  {
    id: 2,
    trialId: "CT-2024-002",
    name: "Cardiovascular Prevention Trial",
    phase: "Phase II",
    status: "Recruiting",
    indication: "Hypertension",
    sponsor: "HeartCare Inc.",
    patients: 85,
    target: 150,
    lead: "Dr. Mark Williams",
    startDate: "Mar 2024",
    endDate: "Mar 2026",
    sites: 4,
    country: "UK",
    description:
      "Multi-center trial investigating new antihypertensive agents with reduced side-effect profiles.",
  },
  {
    id: 3,
    trialId: "CT-2024-003",
    name: "Neurological Disorder Study",
    phase: "Phase I",
    status: "Completed",
    indication: "Alzheimer's",
    sponsor: "Clinix Medical",
    patients: 45,
    target: 45,
    lead: "Dr. Priya Mehta",
    startDate: "Sep 2023",
    endDate: "Feb 2024",
    sites: 2,
    country: "India",
    description:
      "First-in-human study assessing safety and tolerability of a novel amyloid-targeting compound.",
  },
  {
    id: 4,
    trialId: "CT-2024-004",
    name: "Immunotherapy Research",
    phase: "Phase II",
    status: "Active",
    indication: "Melanoma",
    sponsor: "BioPharm Ltd",
    patients: 210,
    target: 250,
    lead: "Dr. James Ford",
    startDate: "Feb 2024",
    endDate: "Aug 2025",
    sites: 8,
    country: "Germany",
    description:
      "Combination checkpoint inhibitor therapy evaluated against standard of care in stage III/IV melanoma.",
  },
  {
    id: 5,
    trialId: "CT-2024-005",
    name: "Diabetes Management Protocol",
    phase: "Phase III",
    status: "Pending",
    indication: "Type 2 Diabetes",
    sponsor: "Clinix Medical",
    patients: 0,
    target: 300,
    lead: "Dr. Emily Ross",
    startDate: "May 2024",
    endDate: "May 2027",
    sites: 5,
    country: "Canada",
    description:
      "Evaluating a novel GLP-1 agonist for glycemic control and cardiovascular risk reduction in T2DM patients.",
  },
  {
    id: 6,
    trialId: "CT-2024-006",
    name: "Rare Disease Genomics Study",
    phase: "Phase I",
    status: "Recruiting",
    indication: "Cystic Fibrosis",
    sponsor: "GenCore Therapeutics",
    patients: 18,
    target: 60,
    lead: "Dr. Lena Vogel",
    startDate: "Jun 2024",
    endDate: "Jun 2026",
    sites: 3,
    country: "France",
    description:
      "Gene-therapy-based interventional study targeting CFTR mutations in pediatric and adult CF patients.",
  },
];

const EMPTY_FORM = {
  trialId: "",
  name: "",
  phase: "Phase II",
  status: "Pending",
  indication: "",
  sponsor: "",
  target: "",
  lead: "",
  startDate: "",
  endDate: "",
  sites: "",
  country: "",
  description: "",
};

/* ─── SMALL COMPONENTS ────────────────────────────────────────────────────────── */
function PhaseBadge({ label }) {
  const m = PHASE_META[label] || {};
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: "0.05em",
        padding: "3px 10px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const m = STATUS_META[label] || STATUS_META.Pending;
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 10px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: m.dot,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}

function MetaChip({ label, value, icon }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 80 }}
    >
      <span
        style={{
          fontSize: 10,
          color: T.text3,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        {icon && <span>{icon}</span>}
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.text1,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/* ─── FORM FIELD ─────────────────────────────────────────────────────────────── */
const iStyle = (focused) => ({
  width: "100%",
  padding: "9px 12px",
  background: T.bg,
  border: `1px solid ${focused ? T.accent : T.border2}`,
  borderRadius: 8,
  color: T.text1,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  boxShadow: focused ? `0 0 0 3px rgba(79,156,249,0.08)` : "none",
});

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 600,
          color: T.text2,
          marginBottom: 6,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
        {required && <span style={{ color: T.rose, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── MODAL ──────────────────────────────────────────────────────────────────── */
function TrialModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(
        editData
          ? {
              ...editData,
              target: String(editData.target),
              sites: String(editData.sites),
            }
          : EMPTY_FORM,
      );
      setErrors({});
    }
  }, [open, editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.trialId.trim()) e.trialId = "Required";
    if (!form.lead.trim()) e.lead = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      ...form,
      target: parseInt(form.target) || 0,
      sites: parseInt(form.sites) || 0,
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 16,
              width: "100%",
              maxWidth: 600,
              maxHeight: "92vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      style={{ width: 15, height: 15 }}
                    >
                      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: T.text1,
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {editData ? "Edit Clinical Trial" : "New Clinical Trial"}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: T.text3, marginLeft: 42 }}>
                  {editData
                    ? "Update trial details and configuration"
                    : "Register a new clinical trial to the portal"}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: T.text2,
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 13, height: 13 }}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                flex: 1,
                scrollbarWidth: "none",
              }}
            >
              {/* Section: Identity */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.text3,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />{" "}
                Identity{" "}
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <Field label="Trial ID" required>
                  <input
                    value={form.trialId}
                    onChange={(e) => set("trialId", e.target.value)}
                    onFocus={() => setFocused("tid")}
                    onBlur={() => setFocused(null)}
                    placeholder="CT-2024-XXX"
                    style={{
                      ...iStyle(focused === "tid"),
                      borderColor: errors.trialId
                        ? T.rose
                        : focused === "tid"
                          ? T.accent
                          : T.border2,
                    }}
                  />
                  {errors.trialId && (
                    <div
                      style={{ fontSize: 10.5, color: T.rose, marginTop: 3 }}
                    >
                      {errors.trialId}
                    </div>
                  )}
                </Field>
                <Field label="Phase">
                  <select
                    value={form.phase}
                    onChange={(e) => set("phase", e.target.value)}
                    style={{ ...iStyle(false), cursor: "pointer" }}
                  >
                    {["Phase I", "Phase II", "Phase III", "Phase IV"].map(
                      (p) => (
                        <option key={p}>{p}</option>
                      ),
                    )}
                  </select>
                </Field>
              </div>
              <Field label="Trial Name" required>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="Full official trial name"
                  style={{
                    ...iStyle(focused === "name"),
                    borderColor: errors.name
                      ? T.rose
                      : focused === "name"
                        ? T.accent
                        : T.border2,
                  }}
                />
                {errors.name && (
                  <div style={{ fontSize: 10.5, color: T.rose, marginTop: 3 }}>
                    {errors.name}
                  </div>
                )}
              </Field>

              {/* Section: Medical */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.text3,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "16px 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />{" "}
                Medical Details{" "}
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <Field label="Indication">
                  <input
                    value={form.indication}
                    onChange={(e) => set("indication", e.target.value)}
                    onFocus={() => setFocused("ind")}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. Lung Cancer"
                    style={iStyle(focused === "ind")}
                  />
                </Field>
                <Field label="Sponsor">
                  <input
                    value={form.sponsor}
                    onChange={(e) => set("sponsor", e.target.value)}
                    onFocus={() => setFocused("spon")}
                    onBlur={() => setFocused(null)}
                    placeholder="Sponsor organization"
                    style={iStyle(focused === "spon")}
                  />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  onFocus={() => setFocused("desc")}
                  onBlur={() => setFocused(null)}
                  placeholder="Brief description of the trial objectives and methodology…"
                  rows={3}
                  style={{ ...iStyle(focused === "desc"), resize: "vertical" }}
                />
              </Field>

              {/* Section: Operations */}
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.text3,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "16px 0 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, height: 1, background: T.border }} />{" "}
                Operations{" "}
                <div style={{ flex: 1, height: 1, background: T.border }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                    style={{ ...iStyle(false), cursor: "pointer" }}
                  >
                    {[
                      "Pending",
                      "Recruiting",
                      "Active",
                      "Completed",
                      "Suspended",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Target Patients">
                  <input
                    type="number"
                    value={form.target}
                    onChange={(e) => set("target", e.target.value)}
                    onFocus={() => setFocused("tgt")}
                    onBlur={() => setFocused(null)}
                    min="0"
                    placeholder="0"
                    style={iStyle(focused === "tgt")}
                  />
                </Field>
                <Field label="Sites">
                  <input
                    type="number"
                    value={form.sites}
                    onChange={(e) => set("sites", e.target.value)}
                    onFocus={() => setFocused("sit")}
                    onBlur={() => setFocused(null)}
                    min="0"
                    placeholder="0"
                    style={iStyle(focused === "sit")}
                  />
                </Field>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <Field label="Lead Researcher" required>
                  <input
                    value={form.lead}
                    onChange={(e) => set("lead", e.target.value)}
                    onFocus={() => setFocused("lead")}
                    onBlur={() => setFocused(null)}
                    placeholder="Dr. Full Name"
                    style={{
                      ...iStyle(focused === "lead"),
                      borderColor: errors.lead
                        ? T.rose
                        : focused === "lead"
                          ? T.accent
                          : T.border2,
                    }}
                  />
                  {errors.lead && (
                    <div
                      style={{ fontSize: 10.5, color: T.rose, marginTop: 3 }}
                    >
                      {errors.lead}
                    </div>
                  )}
                </Field>
                <Field label="Country">
                  <input
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    onFocus={() => setFocused("cou")}
                    onBlur={() => setFocused(null)}
                    placeholder="e.g. USA"
                    style={iStyle(focused === "cou")}
                  />
                </Field>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Field label="Start Date">
                  <input
                    value={form.startDate}
                    onChange={(e) => set("startDate", e.target.value)}
                    onFocus={() => setFocused("sd")}
                    onBlur={() => setFocused(null)}
                    placeholder="Jan 2024"
                    style={iStyle(focused === "sd")}
                  />
                </Field>
                <Field label="End Date">
                  <input
                    value={form.endDate}
                    onChange={(e) => set("endDate", e.target.value)}
                    onFocus={() => setFocused("ed")}
                    onBlur={() => setFocused(null)}
                    placeholder="Dec 2025"
                    style={iStyle(focused === "ed")}
                  />
                </Field>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: `1px solid ${T.border}`,
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "9px 20px",
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border2}`,
                  color: T.text2,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = T.text1;
                  e.currentTarget.style.background = T.bg4;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.text2;
                  e.currentTarget.style.background = T.bg3;
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: "9px 24px",
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
                  border: "none",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  style={{ width: 13, height: 13 }}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                {editData ? "Save Changes" : "Create Trial"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────────────────────── */
function DeleteConfirm({ open, onClose, onConfirm, name }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            style={{
              background: T.bg2,
              border: "1px solid rgba(244,63,94,0.25)",
              borderRadius: 14,
              padding: "28px",
              width: 340,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={T.rose}
                strokeWidth="2"
                style={{ width: 20, height: 20 }}
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6M9 6V4h6v2" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                marginBottom: 8,
              }}
            >
              Delete Trial
            </div>
            <div
              style={{
                fontSize: 13,
                color: T.text2,
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Delete <strong style={{ color: T.text1 }}>{name}</strong>? This
              cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  color: T.text2,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: "9px 0",
                  borderRadius: 8,
                  background: "rgba(244,63,94,0.14)",
                  border: "1px solid rgba(244,63,94,0.28)",
                  color: T.rose,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(244,63,94,0.24)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(244,63,94,0.14)")
                }
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── TRIAL CARD ─────────────────────────────────────────────────────────────── */
function TrialCard({ trial, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const sm = STATUS_META[trial.status] || STATUS_META.Pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{
        duration: 0.3,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: T.bg2,
        border: `1px solid ${hovered ? T.border2 : T.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        cursor: "default",
        fontFamily: "'DM Sans', sans-serif",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 6px 28px rgba(0,0,0,0.3)" : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Status left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "15%",
          bottom: "15%",
          width: 3,
          background: sm.dot,
          borderRadius: "0 3px 3px 0",
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.2s",
        }}
      />

      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: T.accent,
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              {trial.trialId}
            </span>
            <PhaseBadge label={trial.phase} />
            <StatusBadge label={trial.status} />
          </div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: T.text1,
              fontFamily: "'Syne', sans-serif",
              margin: 0,
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            {trial.name}
          </h3>
          <p style={{ fontSize: 12.5, color: T.text2, margin: 0 }}>
            {trial.indication}
            {trial.sponsor ? ` · ${trial.sponsor}` : ""}
          </p>
        </div>
        {/* Actions */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ display: "flex", gap: 6, flexShrink: 0 }}
        >
          <button
            onClick={() => onEdit(trial)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.bg3,
              border: `1px solid ${T.border2}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.accent,
              padding: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(79,156,249,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = T.bg3)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 12, height: 12 }}
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(trial)}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: T.bg3,
              border: "1px solid rgba(244,63,94,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.rose,
              padding: 0,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(244,63,94,0.15)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = T.bg3)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ width: 12, height: 12 }}
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Description */}
      {trial.description && (
        <p
          style={{
            fontSize: 12,
            color: T.text3,
            lineHeight: 1.6,
            margin: "0 0 14px",
            borderLeft: `2px solid ${T.border2}`,
            paddingLeft: 10,
          }}
        >
          {trial.description.length > 120
            ? trial.description.slice(0, 120) + "…"
            : trial.description}
        </p>
      )}

      {/* Meta grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: "10px 16px",
          paddingTop: 14,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <MetaChip label="Lead" value={trial.lead} />
        <MetaChip
          label="Enrolled"
          value={`${trial.patients} / ${trial.target}`}
        />
        <MetaChip label="Sites" value={trial.sites} />
        <MetaChip label="Country" value={trial.country} />
        <MetaChip label="Start" value={trial.startDate} />
        <MetaChip label="End" value={trial.endDate} />
      </div>
    </motion.div>
  );
}

/* ─── EMPTY STATE ─────────────────────────────────────────────────────────────── */
function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "72px 20px",
        background: T.bg2,
        border: `1.5px dashed ${T.border2}`,
        borderRadius: 16,
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: T.bg3,
          border: `1px solid ${T.border2}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.text3}
          strokeWidth="1.5"
          style={{ width: 24, height: 24 }}
        >
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: T.text1,
          fontFamily: "'Syne', sans-serif",
          marginBottom: 8,
        }}
      >
        No trials found
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.text2,
          marginBottom: 22,
          maxWidth: 280,
        }}
      >
        No trials match your filters. Adjust your search or add a new trial.
      </div>
      <button
        onClick={onAdd}
        style={{
          padding: "9px 22px",
          borderRadius: 9,
          background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
          border: "none",
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        + New Trial
      </button>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────────── */
export default function Trials() {
  const [trials, setTrials] = useState(INITIAL_TRIALS);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);

  const openAdd = () => {
    setEditData(null);
    setShowModal(true);
  };
  const openEdit = (t) => {
    setEditData(t);
    setShowModal(true);
  };

  const handleSave = (form) => {
    if (editData)
      setTrials((ts) =>
        ts.map((t) => (t.id === editData.id ? { ...t, ...form } : t)),
      );
    else setTrials((ts) => [...ts, { ...form, id: Date.now(), patients: 0 }]);
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setTrials((ts) => ts.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered = trials.filter((t) => {
    const matchFilter = filter === "All" || t.status === filter;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.trialId.toLowerCase().includes(search.toLowerCase()) ||
      (t.indication || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    All: trials.length,
    Active: trials.filter((t) => t.status === "Active").length,
    Recruiting: trials.filter((t) => t.status === "Recruiting").length,
    Pending: trials.filter((t) => t.status === "Pending").length,
    Completed: trials.filter((t) => t.status === "Completed").length,
  };

  const totalEnrolled = trials.reduce((a, t) => a + (t.patients || 0), 0);
  const totalTarget = trials.reduce((a, t) => a + (t.target || 0), 0);

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
        ::placeholder { color: ${T.text3}; }
        select option { background: ${T.bg2}; color: ${T.text1}; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 10px; }
        @media (max-width: 640px) { .kpi-grid { grid-template-columns: repeat(2,1fr) !important; } .filter-row { flex-wrap: wrap !important; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
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
            marginBottom: 24,
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
                Clinical Trial Management
              </span>
            </div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              Clinical Trials
            </h1>
            <p style={{ fontSize: 13, color: T.text2, marginTop: 5 }}>
              Monitor and manage all active clinical research programs
            </p>
          </div>
          <button
            onClick={openAdd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 10,
              background: `linear-gradient(135deg, ${T.accent}, ${T.accent2})`,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: `0 4px 18px rgba(79,156,249,0.25)`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 6px 24px rgba(79,156,249,0.35)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = `0 4px 18px rgba(79,156,249,0.25)`;
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              style={{ width: 14, height: 14 }}
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Trial
          </button>
        </motion.div>

        {/* ── KPI Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="kpi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Total Trials", value: trials.length, color: T.accent },
            { label: "Active", value: counts.Active, color: T.green },
            {
              label: "Total Enrolled",
              value: `${totalEnrolled} / ${totalTarget}`,
              color: T.accent2,
            },
            {
              label: "Sites",
              value: trials.reduce((a, t) => a + (t.sites || 0), 0),
              color: T.amber,
            },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: T.bg2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "13px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: T.text3,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {k.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: k.color,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {k.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12 }}
          className="filter-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: T.bg2,
              border: `1px solid ${searchFocus ? T.accent : T.border2}`,
              borderRadius: 9,
              padding: "8px 12px",
              flex: "1 1 180px",
              minWidth: 160,
              transition: "border-color 0.2s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.text3}
              strokeWidth="2"
              style={{ width: 13, height: 13, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search trials…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text1,
                fontSize: 13,
                flex: 1,
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            {search && (
              <span
                onClick={() => setSearch("")}
                style={{ cursor: "pointer", color: T.text2, fontSize: 12 }}
              >
                ✕
              </span>
            )}
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", "Active", "Recruiting", "Pending", "Completed"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.18s",
                    background: filter === f ? T.accent : T.bg2,
                    color: filter === f ? "#fff" : T.text2,
                    border: filter === f ? "none" : `1px solid ${T.border}`,
                  }}
                >
                  {f}{" "}
                  <span style={{ fontSize: 10, opacity: 0.75 }}>
                    {counts[f]}
                  </span>
                </button>
              ),
            )}
          </div>

          {/* Count */}
          <div
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: T.text2,
              background: T.bg2,
              border: `1px solid ${T.border}`,
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            <span style={{ color: T.text1, fontWeight: 600 }}>
              {filtered.length}
            </span>{" "}
            of {trials.length}
          </div>
        </motion.div>

        {/* ── Cards ── */}
        <motion.div
          layout
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" onAdd={openAdd} />
            ) : (
              filtered.map((trial, i) => (
                <TrialCard
                  key={trial.id}
                  trial={trial}
                  index={i}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <TrialModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editData={editData}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        name={deleteTarget?.name}
      />
    </div>
  );
}
