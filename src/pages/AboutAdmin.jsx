/**
 * AboutAdmin.jsx
 * Admin page to manage the public "About" page content.
 * Dark theme · matches Accelia admin portal aesthetic
 * Sections: Hero, Story, Stats, Mission/Vision, Team Highlights, Values
 * Features: inline edit, add/delete stats & values, image upload, toast, animated
 */

import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════
   MOCK DATA — mirrors what the public About page shows
══════════════════════════════════════════════════════ */
const INITIAL_DATA = {
  hero: {
    badge: "About Accelia",
    heading: "Who We Are",
    subheading:
      "Accelia is a full-service Site Management Organization (SMO) offering tailored support for biotechnology and pharmaceutical companies across all phases of clinical trials.",
  },
  story: {
    badge: "Our Story",
    heading: "Benchmark in Speed, Precision & Site Excellence",
    body1:
      "Accelia Clinical Solutions was founded with a singular mission: to transform clinical trial execution across India through operational excellence, regulatory precision, and unwavering commitment to patient safety.",
    body2:
      "Headquartered in Kolkata, we operate across all regions of West Bengal and have established a strong footprint in Assam, Bhubaneswar, Bihar, and Uttar Pradesh.",
    image: null,
  },
  stats: [
    { _id: "s1", value: "30+", label: "Clinical Trials Completed" },
    { _id: "s2", value: "1.5 Yrs", label: "Company Age" },
    { _id: "s3", value: "250+", label: "Clinician Network" },
    { _id: "s4", value: "6+", label: "States Covered" },
    { _id: "s5", value: "15+", label: "Therapy Areas" },
    { _id: "s6", value: "100%", label: "GCP Compliant" },
  ],
  mission:
    "To accelerate life-saving research by delivering world-class clinical trial management services that empower sponsors, protect patients, and uphold the highest standards of scientific integrity.",
  vision:
    "To be India's most trusted SMO — known for speed, precision, and unwavering commitment to transforming patient outcomes through clinical excellence.",
  values: [
    {
      _id: "v1",
      icon: "🔬",
      title: "Scientific Rigour",
      desc: "Every protocol followed with precision and data integrity at the core.",
    },
    {
      _id: "v2",
      icon: "🤝",
      title: "Patient First",
      desc: "Safety, dignity and well-being of participants guide every decision.",
    },
    {
      _id: "v3",
      icon: "⚡",
      title: "Speed & Efficiency",
      desc: "Faster timelines without compromising quality — that is our edge.",
    },
    {
      _id: "v4",
      icon: "🌐",
      title: "Nationwide Reach",
      desc: "A growing network spanning 6+ states and 250+ clinical investigators.",
    },
    {
      _id: "v5",
      icon: "📋",
      title: "Regulatory Mastery",
      desc: "Deep CDSCO expertise ensures smooth submissions every time.",
    },
    {
      _id: "v6",
      icon: "💡",
      title: "Innovation",
      desc: "Embracing technology and new methodologies to stay ahead of the curve.",
    },
  ],
};

let _sid = 10,
  _vid = 10;

/* ── helpers ── */
const Ic = ({ d, size = 16, sw = 1.6, col }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke={col || "currentColor"}
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/* ══ TOAST ══ */
function Toast({ items }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
        maxWidth: "calc(100vw - 2rem)",
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            borderRadius: 14,
            fontSize: 13,
            fontWeight: 600,
            background:
              t.type === "err"
                ? "rgba(239,68,68,0.15)"
                : "rgba(16,185,129,0.15)",
            border: `1px solid ${t.type === "err" ? "rgba(239,68,68,0.35)" : "rgba(16,185,129,0.35)"}`,
            color: t.type === "err" ? "#f87171" : "#34d399",
            backdropFilter: "blur(12px)",
            animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <Ic
            d={
              t.type === "err"
                ? ["M10 3l7 14H3L10 3z", "M10 8v4", "M10 14h.01"]
                : "M4 10l4 4 8-8"
            }
            size={13}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ CONFIRM MODAL ══ */
function ConfirmModal({ open, label, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#0d1420",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={20}
            col="#f87171"
          />
        </div>
        <h3
          style={{
            color: "#f1f5f9",
            fontSize: 17,
            fontWeight: 800,
            marginBottom: 8,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Delete {label}?
        </h3>
        <p
          style={{
            color: "#64748b",
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          This will be permanently removed from the public site.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              background: "rgba(239,68,68,0.7)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ SECTION CARD WRAPPER ══ */
function SectionCard({ title, icon, children, delay = 0 }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        overflow: "hidden",
        animation: "fadeUp .5s ease both",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h2
          style={{
            color: "#e2e8f0",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Syne',sans-serif",
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}

/* ══ INLINE FIELD ══ */
function EditField({
  label,
  value,
  onChange,
  multiline = false,
  mono = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef();

  useEffect(() => {
    setDraft(value);
  }, [value]);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    onChange(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(6,182,212,0.06)",
    border: "1px solid rgba(6,182,212,0.3)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    fontSize: 13,
    fontFamily: mono ? "monospace" : "'Outfit',sans-serif",
    outline: "none",
    resize: "vertical",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#475569",
          }}
        >
          {label}
        </label>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "#06b6d4",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 6,
              transition: "background .2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(6,182,212,0.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <>
          {multiline ? (
            <textarea
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              style={inputStyle}
            />
          ) : (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{ ...inputStyle, resize: undefined }}
            />
          )}
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button
              onClick={cancel}
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 11,
                color: "#64748b",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            minHeight: 36,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              lineHeight: 1.6,
              margin: 0,
              whiteSpace: "pre-wrap",
            }}
          >
            {value || (
              <span style={{ color: "#475569", fontStyle: "italic" }}>
                Empty
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/* ══ STAT CARD EDIT ══ */
function StatItem({ stat, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ value: stat.value, label: stat.label });

  const save = () => {
    onEdit(stat._id, draft);
    setEditing(false);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 16,
        position: "relative",
        transition: "border-color .2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(6,182,212,0.25)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
      }
    >
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={draft.value}
            onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
            placeholder="Value (e.g. 30+)"
            style={{
              background: "rgba(6,182,212,0.07)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
            }}
          />
          <input
            value={draft.label}
            onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
            placeholder="Label"
            style={{
              background: "rgba(6,182,212,0.07)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 7,
                fontSize: 11,
                color: "#64748b",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              color: "#22d3ee",
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "'Syne',sans-serif",
              margin: "0 0 4px",
              lineHeight: 1,
            }}
          >
            {stat.value}
          </p>
          <p
            style={{
              color: "#64748b",
              fontSize: 11,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {stat.label}
          </p>
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 5,
            }}
          >
            <button
              onClick={() => setEditing(true)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#22d3ee",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} />
            </button>
            <button
              onClick={() => onDelete(stat._id)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══ VALUE CARD EDIT ══ */
function ValueItem({ val, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    icon: val.icon,
    title: val.title,
    desc: val.desc,
  });

  const save = () => {
    onEdit(val._id, draft);
    setEditing(false);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 18,
        position: "relative",
        transition: "border-color .2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(6,182,212,0.2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")
      }
    >
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={draft.icon}
            onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
            placeholder="Emoji icon"
            style={{
              background: "rgba(6,182,212,0.07)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e2e8f0",
              fontSize: 20,
              outline: "none",
              width: 60,
            }}
          />
          <input
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Title"
            style={{
              background: "rgba(6,182,212,0.07)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e2e8f0",
              fontSize: 13,
              outline: "none",
            }}
          />
          <textarea
            value={draft.desc}
            onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
            placeholder="Description"
            rows={3}
            style={{
              background: "rgba(6,182,212,0.07)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#e2e8f0",
              fontSize: 12,
              outline: "none",
              resize: "none",
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setEditing(false)}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 7,
                fontSize: 11,
                color: "#64748b",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={save}
              style={{
                flex: 1,
                padding: "5px 0",
                borderRadius: 7,
                fontSize: 11,
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 26, marginBottom: 8 }}>{val.icon}</div>
          <p
            style={{
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 700,
              margin: "0 0 5px",
              fontFamily: "'Syne',sans-serif",
            }}
          >
            {val.title}
          </p>
          <p
            style={{
              color: "#64748b",
              fontSize: 12,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {val.desc}
          </p>
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              display: "flex",
              gap: 5,
            }}
          >
            <button
              onClick={() => setEditing(true)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#22d3ee",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} />
            </button>
            <button
              onClick={() => onDelete(val._id)}
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══ ADD STAT MODAL ══ */
function AddStatModal({ open, onAdd, onClose }) {
  const [form, setForm] = useState({ value: "", label: "" });
  if (!open) return null;
  const submit = () => {
    if (!form.value.trim() || !form.label.trim()) return;
    onAdd(form);
    setForm({ value: "", label: "" });
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#0d1420",
          border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 340,
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <h3
          style={{
            color: "#e2e8f0",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 20,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Add Stat
        </h3>
        {[
          ["Value", "value", "e.g. 30+"],
          ["Label", "label", "e.g. Trials Completed"],
        ].map(([lbl, k, ph]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#475569",
                display: "block",
                marginBottom: 5,
              }}
            >
              {lbl}
            </label>
            <input
              value={form[k]}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
              placeholder={ph}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "8px 12px",
                color: "#e2e8f0",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              background: "linear-gradient(135deg,#06b6d4,#6366f1)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ ADD VALUE MODAL ══ */
function AddValueModal({ open, onAdd, onClose }) {
  const [form, setForm] = useState({ icon: "", title: "", desc: "" });
  if (!open) return null;
  const submit = () => {
    if (!form.title.trim()) return;
    onAdd(form);
    setForm({ icon: "", title: "", desc: "" });
    onClose();
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "#0d1420",
          border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: 20,
          padding: 28,
          width: "100%",
          maxWidth: 380,
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <h3
          style={{
            color: "#e2e8f0",
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 20,
            fontFamily: "'Syne',sans-serif",
          }}
        >
          Add Value
        </h3>
        {[
          ["Icon (emoji)", "icon", "🔬"],
          ["Title", "title", "e.g. Scientific Rigour"],
          ["Description", "desc", "Short description…"],
        ].map(([lbl, k, ph]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#475569",
                display: "block",
                marginBottom: 5,
              }}
            >
              {lbl}
            </label>
            {k === "desc" ? (
              <textarea
                value={form[k]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
                placeholder={ph}
                rows={3}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  outline: "none",
                  resize: "none",
                }}
              />
            ) : (
              <input
                value={form[k]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
                placeholder={ph}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  color: "#e2e8f0",
                  fontSize: k === "icon" ? 20 : 13,
                  outline: "none",
                }}
              />
            )}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              background: "linear-gradient(135deg,#06b6d4,#6366f1)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
export default function AboutAdmin() {
  const [data, setData] = useState(INITIAL_DATA);
  const [saved, setSaved] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmDel, setConfirmDel] = useState(null); // { type, id, label }
  const [addStatOpen, setAddStatOpen] = useState(false);
  const [addValOpen, setAddValOpen] = useState(false);
  const [storyImgPreview, setStoryImgPreview] = useState(null);
  const imgRef = useRef();
  const tid = useRef(0);

  const toast = (msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  /* ── hero ── */
  const updateHero = (key, val) => {
    setData((d) => ({ ...d, hero: { ...d.hero, [key]: val } }));
    toast("Hero updated ✓");
  };
  /* ── story ── */
  const updateStory = (key, val) => {
    setData((d) => ({ ...d, story: { ...d.story, [key]: val } }));
    toast("Story updated ✓");
  };
  /* ── story image ── */
  const handleStoryImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      setStoryImgPreview(ev.target.result);
      updateStory("image", ev.target.result);
    };
    r.readAsDataURL(file);
  };
  /* ── stats ── */
  const editStat = (id, patch) => {
    setData((d) => ({
      ...d,
      stats: d.stats.map((s) => (s._id === id ? { ...s, ...patch } : s)),
    }));
    toast("Stat updated ✓");
  };
  const deleteStat = (id) => setConfirmDel({ type: "stat", id, label: "Stat" });
  const addStat = (form) => {
    setData((d) => ({
      ...d,
      stats: [...d.stats, { _id: `s${++_sid}`, ...form }],
    }));
    toast("Stat added ✓");
  };
  /* ── mission/vision ── */
  const updateMission = (val) => {
    setData((d) => ({ ...d, mission: val }));
    toast("Mission updated ✓");
  };
  const updateVision = (val) => {
    setData((d) => ({ ...d, vision: val }));
    toast("Vision updated ✓");
  };
  /* ── values ── */
  const editValue = (id, patch) => {
    setData((d) => ({
      ...d,
      values: d.values.map((v) => (v._id === id ? { ...v, ...patch } : v)),
    }));
    toast("Value updated ✓");
  };
  const deleteValue = (id) =>
    setConfirmDel({ type: "value", id, label: "Value" });
  const addValue = (form) => {
    setData((d) => ({
      ...d,
      values: [...d.values, { _id: `v${++_vid}`, ...form }],
    }));
    toast("Value added ✓");
  };

  const confirmDelete = () => {
    const { type, id } = confirmDel;
    if (type === "stat")
      setData((d) => ({ ...d, stats: d.stats.filter((s) => s._id !== id) }));
    if (type === "value")
      setData((d) => ({ ...d, values: d.values.filter((v) => v._id !== id) }));
    toast("Deleted", "err");
    setConfirmDel(null);
  };

  const handlePublish = () => {
    setSaved(true);
    toast("Changes published to public site ✓");
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCss = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    fontSize: 13,
    outline: "none",
    fontFamily: "'Outfit',sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes popIn   { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:none} }
        @keyframes toastIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #334155 !important; }
        textarea { font-family: 'Outfit', sans-serif !important; }
        .ab-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ab-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        @media(max-width: 640px) {
          .ab-grid-2 { grid-template-columns: 1fr !important; }
          .ab-grid-3 { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width: 400px) {
          .ab-grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        style={{ minHeight: "100vh", background: "#080d17", color: "#e2e8f0" }}
      >
        {/* ══ TOP BAR ══ */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "rgba(8,13,23,0.92)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            animation: "fadeUp .4s ease both",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(6,182,212,0.6)",
                margin: 0,
              }}
            >
              Accelia Admin
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "white",
                margin: 0,
                fontFamily: "'Syne',sans-serif",
              }}
            >
              About Page Manager
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 600,
                color: "#94a3b8",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Ic
                d={[
                  "M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z",
                  "M10 10a1 1 0 100-2 1 1 0 000 2z",
                ]}
                size={13}
              />{" "}
              Preview
            </a>
            <button
              onClick={handlePublish}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 18px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
                border: "none",
                background: saved
                  ? "rgba(16,185,129,0.8)"
                  : "linear-gradient(135deg,#06b6d4,#6366f1)",
                boxShadow: "0 4px 18px rgba(6,182,212,0.3)",
                transition: "all .3s",
              }}
            >
              {saved ? (
                <>
                  <Ic d="M4 10l4 4 8-8" size={14} /> Published!
                </>
              ) : (
                <>
                  <Ic d={["M4 14l1-5 4 4 5-8", "M2 16h16"]} size={14} /> Publish
                  Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "28px 16px 60px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* ══ PREVIEW BANNER ══ */}
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              background:
                "linear-gradient(135deg, #0a1628 0%, #0d2040 50%, #081525 100%)",
              border: "1px solid rgba(6,182,212,0.15)",
              animation: "fadeUp .4s ease both",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 60% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                padding: "32px 28px",
                textAlign: "center",
                position: "relative",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 14px",
                  borderRadius: 20,
                  background: "rgba(6,182,212,0.12)",
                  border: "1px solid rgba(6,182,212,0.25)",
                  color: "#22d3ee",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                {data.hero.badge}
              </span>
              <h2
                style={{
                  fontSize: "clamp(26px,5vw,42px)",
                  fontWeight: 900,
                  color: "white",
                  fontFamily: "'Syne',sans-serif",
                  margin: "0 0 14px",
                  lineHeight: 1.15,
                }}
              >
                {data.hero.heading}
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  maxWidth: 560,
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                {data.hero.subheading}
              </p>
            </div>
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 14,
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: 8,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                color: "#22d3ee",
                letterSpacing: "0.08em",
              }}
            >
              LIVE PREVIEW
            </div>
          </div>

          {/* ══ HERO SECTION ══ */}
          <SectionCard title="Hero Section" icon="🎯" delay={60}>
            <EditField
              label="Badge Text"
              value={data.hero.badge}
              onChange={(v) => updateHero("badge", v)}
            />
            <EditField
              label="Main Heading"
              value={data.hero.heading}
              onChange={(v) => updateHero("heading", v)}
            />
            <EditField
              label="Subheading / Description"
              value={data.hero.subheading}
              onChange={(v) => updateHero("subheading", v)}
              multiline
            />
          </SectionCard>

          {/* ══ OUR STORY ══ */}
          <SectionCard title="Our Story Section" icon="📖" delay={100}>
            <div className="ab-grid-2" style={{ marginBottom: 16 }}>
              <div>
                <EditField
                  label="Section Badge"
                  value={data.story.badge}
                  onChange={(v) => updateStory("badge", v)}
                />
                <EditField
                  label="Heading"
                  value={data.story.heading}
                  onChange={(v) => updateStory("heading", v)}
                  multiline
                />
                <EditField
                  label="Paragraph 1"
                  value={data.story.body1}
                  onChange={(v) => updateStory("body1", v)}
                  multiline
                />
                <EditField
                  label="Paragraph 2"
                  value={data.story.body2}
                  onChange={(v) => updateStory("body2", v)}
                  multiline
                />
              </div>

              {/* Story Image */}
              <div>
                <label
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#475569",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Story Image
                </label>
                {storyImgPreview || data.story.image ? (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 14,
                      overflow: "hidden",
                      height: 200,
                    }}
                  >
                    <img
                      src={storyImgPreview || data.story.image}
                      alt=""
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
                        gap: 8,
                      }}
                    >
                      <button
                        onClick={() => imgRef.current?.click()}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 9,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          background: "rgba(6,182,212,0.85)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Change
                      </button>
                      <button
                        onClick={() => {
                          setStoryImgPreview(null);
                          updateStory("image", null);
                        }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 9,
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          background: "rgba(239,68,68,0.8)",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => imgRef.current?.click()}
                    style={{
                      width: "100%",
                      height: 160,
                      borderRadius: 14,
                      border: "2px dashed rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      color: "#334155",
                      transition: "border-color .2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(6,182,212,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ic
                        d={["M4 14l4-4 3 3 4-5 5 6H4z", "M3 3h14v14H3z"]}
                        size={20}
                        col="#06b6d4"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: "#94a3b8",
                          fontSize: 13,
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        Upload image
                      </p>
                      <p
                        style={{
                          color: "#475569",
                          fontSize: 11,
                          margin: "2px 0 0",
                        }}
                      >
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </button>
                )}
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleStoryImg}
                />
              </div>
            </div>
          </SectionCard>

          {/* ══ STATS ══ */}
          <SectionCard title="Stats / Numbers" icon="📊" delay={140}>
            <div className="ab-grid-3">
              {data.stats.map((s) => (
                <StatItem
                  key={s._id}
                  stat={s}
                  onEdit={editStat}
                  onDelete={deleteStat}
                />
              ))}
              {/* Add stat ghost */}
              <button
                onClick={() => setAddStatOpen(true)}
                style={{
                  borderRadius: 16,
                  border: "2px dashed rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#334155",
                  minHeight: 80,
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    border: "1px dashed currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: 11, fontWeight: 600 }}>Add Stat</span>
              </button>
            </div>
          </SectionCard>

          {/* ══ MISSION & VISION ══ */}
          <SectionCard title="Mission & Vision" icon="🎯" delay={180}>
            <div className="ab-grid-2">
              <div
                style={{
                  background: "rgba(6,182,212,0.04)",
                  border: "1px solid rgba(6,182,212,0.1)",
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 14 }}>🎯</span>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#06b6d4",
                      margin: 0,
                    }}
                  >
                    Mission
                  </p>
                </div>
                <EditField
                  label=""
                  value={data.mission}
                  onChange={updateMission}
                  multiline
                />
              </div>
              <div
                style={{
                  background: "rgba(99,102,241,0.04)",
                  border: "1px solid rgba(99,102,241,0.12)",
                  borderRadius: 14,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: 14 }}>🔭</span>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#818cf8",
                      margin: 0,
                    }}
                  >
                    Vision
                  </p>
                </div>
                <EditField
                  label=""
                  value={data.vision}
                  onChange={updateVision}
                  multiline
                />
              </div>
            </div>
          </SectionCard>

          {/* ══ VALUES ══ */}
          <SectionCard title="Core Values" icon="💎" delay={220}>
            <div className="ab-grid-3">
              {data.values.map((v) => (
                <ValueItem
                  key={v._id}
                  val={v}
                  onEdit={editValue}
                  onDelete={deleteValue}
                />
              ))}
              <button
                onClick={() => setAddValOpen(true)}
                style={{
                  borderRadius: 16,
                  border: "2px dashed rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#334155",
                  minHeight: 100,
                  transition: "border-color .2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "1px dashed currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: 11, fontWeight: 600 }}>Add Value</span>
              </button>
            </div>
          </SectionCard>

          {/* ══ JSON PREVIEW ══ */}
          <SectionCard title="Raw Data Preview" icon="⚙️" delay={260}>
            <div style={{ position: "relative" }}>
              <pre
                style={{
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 11,
                  color: "#64748b",
                  overflow: "auto",
                  maxHeight: 200,
                  border: "1px solid rgba(255,255,255,0.05)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {JSON.stringify(
                  {
                    hero: data.hero,
                    mission: data.mission,
                    vision: data.vision,
                    statsCount: data.stats.length,
                    valuesCount: data.values.length,
                  },
                  null,
                  2,
                )}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
                  toast("JSON copied ✓");
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: "4px 10px",
                  borderRadius: 7,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#94a3b8",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
              >
                Copy
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Modals */}
      <AddStatModal
        open={addStatOpen}
        onAdd={addStat}
        onClose={() => setAddStatOpen(false)}
      />
      <AddValueModal
        open={addValOpen}
        onAdd={addValue}
        onClose={() => setAddValOpen(false)}
      />
      <ConfirmModal
        open={!!confirmDel}
        label={confirmDel?.label}
        onConfirm={confirmDelete}
        onClose={() => setConfirmDel(null)}
      />
      <Toast items={toasts} />
    </>
  );
}
