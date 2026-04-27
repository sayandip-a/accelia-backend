import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── FONTS ─────────────────────────────────────────────────────────────────── */
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');`;

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────────── */
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
  text1: "#e8edf5",
  text2: "#6b7fa3",
  text3: "#3a4a66",
  border: "rgba(79,156,249,0.10)",
  border2: "rgba(79,156,249,0.20)",
};

/* ─── CATEGORY CONFIG ────────────────────────────────────────────────────────── */
const CATEGORY_META = {
  "Trial Services": {
    color: "#4f9cf9",
    bg: "rgba(79,156,249,0.12)",
    dot: "#4f9cf9",
  },
  "Data Science": {
    color: "#7c6af7",
    bg: "rgba(124,106,247,0.12)",
    dot: "#7c6af7",
  },
  Regulatory: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", dot: "#f59e0b" },
  "Patient Services": {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.12)",
    dot: "#22d3a0",
  },
  Communications: {
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    dot: "#f43f5e",
  },
  Safety: { color: "#fb923c", bg: "rgba(251,146,60,0.12)", dot: "#fb923c" },
};

const CATEGORIES = Object.keys(CATEGORY_META);

const STATUS_META = {
  Active: {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.10)",
    border: "rgba(34,211,160,0.25)",
  },
  Draft: {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.25)",
  },
  Archived: {
    color: "#6b7fa3",
    bg: "rgba(107,127,163,0.10)",
    border: "rgba(107,127,163,0.25)",
  },
  "In Review": {
    color: "#7c6af7",
    bg: "rgba(124,106,247,0.10)",
    border: "rgba(124,106,247,0.25)",
  },
};

/* ─── UNSPLASH IMAGE SEEDS ───────────────────────────────────────────────────── */
const IMG_SEEDS = [
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=600&auto=format&fit=crop&q=80",
];

/* ─── INITIAL DATA ───────────────────────────────────────────────────────────── */
const INITIAL = [
  {
    id: 1,
    title: "Clinical Trial Management",
    category: "Trial Services",
    status: "Active",
    image: IMG_SEEDS[0],
    description:
      "End-to-end clinical trial management platform covering full protocol lifecycle, multi-site coordination, and real-time compliance tracking.",
    features: [
      "Protocol Design",
      "Site Management",
      "Data Collection",
      "Compliance",
    ],
    clients: 38,
    uptime: "99.9%",
    updated: "2 days ago",
  },
  {
    id: 2,
    title: "Advanced Data Analytics",
    category: "Data Science",
    status: "Active",
    image: IMG_SEEDS[1],
    description:
      "AI-driven analytics pipeline delivering predictive models, statistical analysis, and interactive insight dashboards for clinical data.",
    features: [
      "Machine Learning",
      "Statistical Analysis",
      "Dashboards",
      "Reporting",
    ],
    clients: 52,
    uptime: "99.7%",
    updated: "5 hours ago",
  },
  {
    id: 3,
    title: "Regulatory Submissions",
    category: "Regulatory",
    status: "In Review",
    image: IMG_SEEDS[2],
    description:
      "Streamlined regulatory document management and automated submission workflows for FDA, EMA, and global health authority filings.",
    features: [
      "Document Management",
      "eCTD Formatting",
      "Global Submissions",
      "Audit Trail",
    ],
    clients: 24,
    uptime: "99.5%",
    updated: "1 week ago",
  },
  {
    id: 4,
    title: "Patient Engagement Suite",
    category: "Patient Services",
    status: "Active",
    image: IMG_SEEDS[3],
    description:
      "Comprehensive patient recruitment, retention, and engagement tools including mobile ePRO, telehealth, and consent management.",
    features: ["ePRO", "eConsent", "Telehealth", "Recruitment"],
    clients: 61,
    uptime: "99.8%",
    updated: "Yesterday",
  },
  {
    id: 5,
    title: "Medical Communications",
    category: "Communications",
    status: "Draft",
    image: IMG_SEEDS[4],
    description:
      "Scientific publication services, medical writing, and stakeholder communication management across the full product lifecycle.",
    features: [
      "Medical Writing",
      "Publications",
      "KOL Management",
      "Presentations",
    ],
    clients: 17,
    uptime: "98.9%",
    updated: "3 weeks ago",
  },
  {
    id: 6,
    title: "Pharmacovigilance & Safety",
    category: "Safety",
    status: "Active",
    image: IMG_SEEDS[5],
    description:
      "Real-time adverse event monitoring, signal detection, and automated safety reporting integrated with global vigilance databases.",
    features: [
      "Adverse Events",
      "Signal Detection",
      "SUSAR Reporting",
      "Risk Management",
    ],
    clients: 43,
    uptime: "99.99%",
    updated: "1 day ago",
  },
];

const EMPTY_FORM = {
  title: "",
  category: "Trial Services",
  status: "Active",
  image: "",
  description: "",
  features: "",
  clients: "",
  uptime: "",
};

/* ─── SMALL COMPONENTS ───────────────────────────────────────────────────────── */

function CategoryBadge({ label }) {
  const m = CATEGORY_META[label] || {
    color: T.text2,
    bg: "rgba(107,127,163,0.1)",
  };
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 9px",
        borderRadius: 20,
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.color}30`,
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ label }) {
  const m = STATUS_META[label] || STATUS_META.Draft;
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 9px",
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
          background: m.color,
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}

function FeatureTag({ label }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 400,
        padding: "3px 10px",
        borderRadius: 6,
        background: T.bg4,
        color: T.text2,
        border: `1px solid ${T.border}`,
      }}
    >
      {label}
    </span>
  );
}

function StatChip({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontSize: 10,
          color: T.text3,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
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
        {value}
      </span>
    </div>
  );
}

/* ─── INPUT FIELD ────────────────────────────────────────────────────────────── */
function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 11.5,
          fontWeight: 500,
          color: T.text2,
          marginBottom: 6,
          letterSpacing: "0.04em",
        }}
      >
        {label}
        {required && <span style={{ color: T.rose, marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  background: T.bg,
  border: `1px solid ${T.border2}`,
  borderRadius: 8,
  color: T.text1,
  fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

/* ─── MODAL ──────────────────────────────────────────────────────────────────── */
function SolutionModal({ open, onClose, onSave, editData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (open) {
      if (editData) {
        setForm({
          ...editData,
          features: editData.features.join(", "),
          clients: String(editData.clients),
          uptime: editData.uptime,
        });
        setImgPreview(editData.image || "");
      } else {
        setForm(EMPTY_FORM);
        setImgPreview("");
      }
      setErrors({});
    }
  }, [open, editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      set("image", ev.target.result);
      setImgLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.features.trim()) e.features = "At least one feature required";
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
      image:
        imgPreview ||
        form.image ||
        IMG_SEEDS[Math.floor(Math.random() * IMG_SEEDS.length)],
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      clients: parseInt(form.clients) || 0,
    });
  };

  const focusBorder = (name) => (focusedField === name ? T.accent : T.border2);

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
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 16,
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {/* Modal Header */}
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
                    fontSize: 16,
                    fontWeight: 700,
                    color: T.text1,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {editData ? "Edit Solution" : "Add New Solution"}
                </div>
                <div style={{ fontSize: 12, color: T.text3, marginTop: 3 }}>
                  {editData
                    ? "Update solution details and configuration"
                    : "Create a new managed solution for your portal"}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: T.text2,
                  padding: 0,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ width: 14, height: 14 }}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div
              style={{
                padding: "20px 24px",
                overflowY: "auto",
                flex: 1,
                scrollbarWidth: "none",
              }}
            >
              {/* Image upload */}
              <Field label="Cover Image">
                <div
                  onClick={() => fileRef.current.click()}
                  style={{
                    height: 130,
                    borderRadius: 10,
                    border: `1.5px dashed ${T.border2}`,
                    background: T.bg3,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = T.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = T.border2)
                  }
                >
                  {imgLoading ? (
                    <div style={{ color: T.text2, fontSize: 13 }}>Loading…</div>
                  ) : imgPreview ? (
                    <>
                      <img
                        src={imgPreview}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(0,0,0,0.45)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = 1)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = 0)
                        }
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={T.text3}
                        strokeWidth="1.5"
                        style={{ width: 28, height: 28 }}
                      >
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div style={{ fontSize: 12, color: T.text3 }}>
                        Click to upload image
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {IMG_SEEDS.slice(0, 4).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      onClick={() => {
                        setImgPreview(src);
                        set("image", src);
                      }}
                      style={{
                        width: 44,
                        height: 32,
                        objectFit: "cover",
                        borderRadius: 6,
                        cursor: "pointer",
                        border: `2px solid ${imgPreview === src ? T.accent : "transparent"}`,
                        transition: "border-color 0.15s",
                      }}
                    />
                  ))}
                  <div
                    style={{
                      fontSize: 10.5,
                      color: T.text3,
                      alignSelf: "center",
                    }}
                  >
                    Quick picks
                  </div>
                </div>
              </Field>

              {/* Title */}
              <Field label="Solution Title" required>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="e.g. Clinical Data Management"
                  style={{
                    ...inputStyle,
                    borderColor: errors.title ? T.rose : focusBorder("title"),
                  }}
                />
                {errors.title && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4 }}>
                    {errors.title}
                  </div>
                )}
              </Field>

              {/* Category + Status row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: T.text2,
                      marginBottom: 6,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: T.text2,
                      marginBottom: 6,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {Object.keys(STATUS_META).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  onFocus={() => setFocusedField("desc")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Describe what this solution provides…"
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    borderColor: errors.description
                      ? T.rose
                      : focusBorder("desc"),
                  }}
                />
                {errors.description && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4 }}>
                    {errors.description}
                  </div>
                )}
              </Field>

              {/* Features */}
              <Field label="Key Features" required>
                <input
                  value={form.features}
                  onChange={(e) => set("features", e.target.value)}
                  onFocus={() => setFocusedField("feat")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Protocol Design, Site Management, Compliance…"
                  style={{
                    ...inputStyle,
                    borderColor: errors.features ? T.rose : focusBorder("feat"),
                  }}
                />
                {errors.features && (
                  <div style={{ fontSize: 11, color: T.rose, marginTop: 4 }}>
                    {errors.features}
                  </div>
                )}
                <div style={{ fontSize: 10.5, color: T.text3, marginTop: 4 }}>
                  Comma-separated list of features
                </div>
              </Field>

              {/* Clients + Uptime */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Field label="Active Clients">
                  <input
                    value={form.clients}
                    onChange={(e) => set("clients", e.target.value)}
                    placeholder="e.g. 42"
                    type="number"
                    min="0"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Uptime SLA">
                  <input
                    value={form.uptime}
                    onChange={(e) => set("uptime", e.target.value)}
                    placeholder="e.g. 99.9%"
                    style={inputStyle}
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
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = T.bg4;
                  e.currentTarget.style.color = T.text1;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.bg3;
                  e.currentTarget.style.color = T.text2;
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
                {editData ? "Save Changes" : "Create Solution"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── DELETE CONFIRM ─────────────────────────────────────────────────────────── */
function DeleteConfirm({ open, onClose, onConfirm, title }) {
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
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            style={{
              background: T.bg2,
              border: `1px solid rgba(244,63,94,0.25)`,
              borderRadius: 14,
              padding: "28px 28px 22px",
              width: 340,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(244,63,94,0.12)",
                border: "1px solid rgba(244,63,94,0.22)",
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
              Delete Solution
            </div>
            <div
              style={{
                fontSize: 13,
                color: T.text2,
                lineHeight: 1.6,
                marginBottom: 22,
              }}
            >
              Are you sure you want to delete{" "}
              <strong style={{ color: T.text1 }}>{title}</strong>? This action
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
                  fontWeight: 500,
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
                  background: "rgba(244,63,94,0.15)",
                  border: "1px solid rgba(244,63,94,0.3)",
                  color: T.rose,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(244,63,94,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(244,63,94,0.15)")
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

/* ─── SOLUTION CARD ──────────────────────────────────────────────────────────── */
function SolutionCard({ sol, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: T.bg2,
        border: `1px solid ${hovered ? T.border2 : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Image */}
      <div
        style={{
          height: 160,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <motion.img
          src={sol.image}
          alt={sol.title}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(7,13,26,0.85) 0%, transparent 55%)",
          }}
        />
        {/* Badges on image */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
          }}
        >
          <CategoryBadge label={sol.category} />
          <StatusBadge label={sol.status} />
        </div>
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 6,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(sol);
            }}
            title="Edit"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(15,23,42,0.8)",
              border: `1px solid ${T.border2}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.accent,
              padding: 0,
              backdropFilter: "blur(4px)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `rgba(79,156,249,0.2)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(15,23,42,0.8)")
            }
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete(sol);
            }}
            title="Delete"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(15,23,42,0.8)",
              border: `1px solid rgba(244,63,94,0.25)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.rose,
              padding: 0,
              backdropFilter: "blur(4px)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `rgba(244,63,94,0.18)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(15,23,42,0.8)")
            }
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

      {/* Body */}
      <div
        style={{
          padding: "16px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: T.text1,
            fontFamily: "'Syne', sans-serif",
            marginBottom: 6,
            lineHeight: 1.3,
          }}
        >
          {sol.title}
        </h3>
        <p
          style={{
            fontSize: 12.5,
            color: T.text2,
            lineHeight: 1.6,
            marginBottom: 14,
            flex: 1,
          }}
        >
          {sol.description}
        </p>

        {/* Features */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            marginBottom: 16,
          }}
        >
          {sol.features.map((f, i) => (
            <FeatureTag key={i} label={f} />
          ))}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            paddingTop: 14,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <StatChip label="Clients" value={sol.clients} />
          <StatChip label="Uptime" value={sol.uptime} />
          <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
            <span style={{ fontSize: 10.5, color: T.text3 }}>
              Updated {sol.updated}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── EMPTY STATE ────────────────────────────────────────────────────────────── */
function EmptyState({ onAdd }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        gridColumn: "1 / -1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        background: T.bg2,
        border: `1.5px dashed ${T.border2}`,
        borderRadius: 16,
        textAlign: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: T.bg3,
          border: `1px solid ${T.border2}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.text3}
          strokeWidth="1.5"
          style={{ width: 28, height: 28 }}
        >
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
        No solutions found
      </div>
      <div
        style={{
          fontSize: 13,
          color: T.text2,
          marginBottom: 24,
          maxWidth: 300,
        }}
      >
        No solutions match your current filters. Try adjusting your search or
        add a new one.
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
        + Add Solution
      </button>
    </motion.div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────────────── */
export default function Solutions() {
  const [solutions, setSolutions] = useState(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchFocus, setSearchFocus] = useState(false);

  const openAdd = () => {
    setEditData(null);
    setShowModal(true);
  };
  const openEdit = (s) => {
    setEditData(s);
    setShowModal(true);
  };

  const handleSave = (form) => {
    if (editData) {
      setSolutions((s) =>
        s.map((x) =>
          x.id === editData.id ? { ...x, ...form, updated: "Just now" } : x,
        ),
      );
    } else {
      setSolutions((s) => [
        ...s,
        { ...form, id: Date.now(), updated: "Just now" },
      ]);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setSolutions((s) => s.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const filtered = solutions.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || s.category === filterCat;
    const matchStatus = filterStatus === "All" || s.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalActive = solutions.filter((s) => s.status === "Active").length;
  const totalClients = solutions.reduce(
    (a, s) => a + (parseInt(s.clients) || 0),
    0,
  );

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
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        ::placeholder { color: ${T.text3}; }
        select option { background: ${T.bg2}; color: ${T.text1}; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border2}; border-radius: 10px; }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.accent,
                  boxShadow: `0 0 0 3px rgba(79,156,249,0.2)`,
                }}
              />
              <span
                style={{
                  fontSize: 11.5,
                  color: T.text2,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Solutions Management
              </span>
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: T.text1,
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Solutions
            </h1>
            <p style={{ fontSize: 13, color: T.text2, marginTop: 6 }}>
              Manage and monitor all clinical solutions across your organization
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
              background: `linear-gradient(135deg, ${T.accent} 0%, ${T.accent2} 100%)`,
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
            Add Solution
          </button>
        </motion.div>

        {/* ── KPI Strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total Solutions",
              value: solutions.length,
              color: T.accent,
            },
            { label: "Active", value: totalActive, color: T.green },
            { label: "Total Clients", value: totalClients, color: T.accent2 },
            {
              label: "Categories",
              value: new Set(solutions.map((s) => s.category)).size,
              color: T.amber,
            },
          ].map((k, i) => (
            <div
              key={i}
              style={{
                background: T.bg2,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  fontSize: 10.5,
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
                  fontSize: 22,
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

        {/* ── Filters Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 24,
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
              flex: "1 1 200px",
              minWidth: 180,
              transition: "border-color 0.2s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke={T.text3}
              strokeWidth="2"
              style={{ width: 14, height: 14, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search solutions…"
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

          {/* Category filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 9,
              padding: "9px 12px",
              color: filterCat !== "All" ? T.accent : T.text2,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border2}`,
              borderRadius: 9,
              padding: "9px 12px",
              color: filterStatus !== "All" ? T.accent : T.text2,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              outline: "none",
            }}
          >
            <option value="All">All Statuses</option>
            {Object.keys(STATUS_META).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Count chip */}
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
            of {solutions.length}
          </div>
        </motion.div>

        {/* ── Cards Grid ── */}
        <motion.div
          layout
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" onAdd={openAdd} />
            ) : (
              filtered.map((sol, i) => (
                <SolutionCard
                  key={sol.id}
                  sol={sol}
                  index={i}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Modals ── */}
      <SolutionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editData={editData}
      />
      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.title}
      />
    </div>
  );
}
