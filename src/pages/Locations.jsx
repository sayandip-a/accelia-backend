import { useState, useRef, useEffect } from "react";
let _id = 8;
const INITIAL = [
  {
    _id: "1",
    city: "Kolkata",
    state: "West Bengal",
    tagline: "Headquarters – Strategic Hub",
    isHQ: true,
    status: "Active",
    icon: "building",
    order: 0,
    image: null,
  },
  {
    _id: "2",
    city: "West Bengal",
    state: "West Bengal",
    tagline: "All Regions Covered",
    isHQ: false,
    status: "Active",
    icon: "pin",
    order: 1,
    image: null,
  },
  {
    _id: "3",
    city: "Assam",
    state: "Assam",
    tagline: "North-East Presence",
    isHQ: false,
    status: "Active",
    icon: "pin",
    order: 2,
    image: null,
  },
  {
    _id: "4",
    city: "Bhubaneswar",
    state: "Odisha",
    tagline: "Odisha Operations",
    isHQ: false,
    status: "Active",
    icon: "pin",
    order: 3,
    image: null,
  },
  {
    _id: "5",
    city: "Bihar",
    state: "Bihar",
    tagline: "Eastern Zone Coverage",
    isHQ: false,
    status: "Active",
    icon: "pin",
    order: 4,
    image: null,
  },
  {
    _id: "6",
    city: "Uttar Pradesh",
    state: "Uttar Pradesh",
    tagline: "Northern Operations",
    isHQ: false,
    status: "Active",
    icon: "pin",
    order: 5,
    image: null,
  },
  {
    _id: "7",
    city: "Delhi NCR",
    state: "Delhi",
    tagline: "Capital Region Hub",
    isHQ: false,
    status: "Active",
    icon: "office",
    order: 6,
    image: null,
  },
  {
    _id: "8",
    city: "Mumbai",
    state: "Maharashtra",
    tagline: "Western Zone Presence",
    isHQ: false,
    status: "Coming Soon",
    icon: "pin",
    order: 7,
    image: null,
  },
];

const ICONS = {
  pin: (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <ellipse cx="20" cy="45" rx="8" ry="3" fill="rgba(229,57,53,0.2)" />
      <circle cx="20" cy="18" r="16" fill="#e53935" />
      <circle cx="20" cy="18" r="9" fill="white" fillOpacity=".12" />
      <circle cx="20" cy="18" r="5" fill="white" fillOpacity=".9" />
      <line
        x1="20"
        y1="34"
        x2="20"
        y2="43"
        stroke="#e53935"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  building: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect
        x="8"
        y="10"
        width="32"
        height="34"
        rx="3"
        fill="#0d9488"
        opacity=".2"
      />
      <rect
        x="10"
        y="12"
        width="28"
        height="30"
        rx="2"
        fill="#0d9488"
        opacity=".35"
      />
      <rect x="14" y="16" width="6" height="6" rx="1" fill="#5eead4" />
      <rect x="28" y="16" width="6" height="6" rx="1" fill="#5eead4" />
      <rect x="14" y="26" width="6" height="6" rx="1" fill="#5eead4" />
      <rect x="28" y="26" width="6" height="6" rx="1" fill="#5eead4" />
      <rect x="19" y="34" width="10" height="8" rx="1" fill="#5eead4" />
      <rect
        x="18"
        y="6"
        width="12"
        height="8"
        rx="2"
        fill="#0d9488"
        opacity=".6"
      />
    </svg>
  ),
  office: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect
        x="6"
        y="14"
        width="36"
        height="26"
        rx="3"
        fill="#3b82f6"
        opacity=".15"
      />
      <rect
        x="8"
        y="16"
        width="32"
        height="22"
        rx="2"
        fill="#3b82f6"
        opacity=".25"
      />
      <rect x="13" y="21" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="22" y="21" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="30" y="21" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="13" y="30" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="22" y="30" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect x="30" y="30" width="5" height="5" rx="1" fill="#93c5fd" />
      <rect
        x="12"
        y="10"
        width="24"
        height="8"
        rx="2"
        fill="#3b82f6"
        opacity=".5"
      />
    </svg>
  ),
  lab: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M18 8v16L9 36a5 5 0 004.5 7h21A5 5 0 0039 36L30 24V8"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="15"
        y1="8"
        x2="33"
        y2="8"
        stroke="#a78bfa"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="34" r="2.5" fill="#a78bfa" opacity=".8" />
      <circle cx="26" cy="38" r="1.5" fill="#a78bfa" opacity=".6" />
      <circle cx="32" cy="34" r="2" fill="#a78bfa" opacity=".7" />
    </svg>
  ),
};

const STATUS_STYLE = {
  Active: {
    bg: "rgba(16,185,129,0.15)",
    border: "rgba(16,185,129,0.35)",
    text: "#34d399",
    dot: "#10b981",
  },
  Inactive: {
    bg: "rgba(107,114,128,0.15)",
    border: "rgba(107,114,128,0.35)",
    text: "#9ca3af",
    dot: "#6b7280",
  },
  "Coming Soon": {
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.35)",
    text: "#fbbf24",
    dot: "#f59e0b",
  },
};

const Ic = ({ d, size = 16, sw = 1.7, style, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

/* ── Toast ── */
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
        maxWidth: "calc(100vw - 2rem)",
        pointerEvents: "none",
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
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            background:
              t.type === "err"
                ? "rgba(239,68,68,0.18)"
                : "rgba(16,185,129,0.18)",
            border: `1px solid ${t.type === "err" ? "rgba(239,68,68,0.4)" : "rgba(16,185,129,0.4)"}`,
            color: t.type === "err" ? "#f87171" : "#34d399",
            backdropFilter: "blur(16px)",
            animation: "slideInRight .35s cubic-bezier(.34,1.56,.64,1) both",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <Ic
            d={
              t.type === "err"
                ? ["M10 3l7 14H3L10 3z", "M10 9v4", "M10 15h.01"]
                : "M4 10l4 4 8-8"
            }
            size={14}
            sw={2}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Confirm Modal ── */
function ConfirmModal({ open, name, onConfirm, onClose }) {
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
          background: "#1a2235",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={22}
            sw={1.8}
            style={{ color: "#f87171" }}
          />
        </div>
        <h3
          style={{
            color: "#f1f5f9",
            fontSize: 18,
            fontWeight: 900,
            marginBottom: 8,
            fontFamily: "'Playfair Display',serif",
          }}
        >
          Remove Location?
        </h3>
        <p
          style={{
            color: "#64748b",
            fontSize: 13,
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#e2e8f0" }}>{name}</strong> will be
          permanently removed.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
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
              background: "rgba(239,68,68,0.75)",
              border: "1px solid rgba(239,68,68,0.5)",
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

/* ── Form Drawer ── */
const EMPTY = {
  city: "",
  state: "",
  tagline: "",
  isHQ: false,
  status: "Active",
  icon: "pin",
  address: "",
  phone: "",
  email: "",
  image: null,
};
const ICON_OPTIONS = ["pin", "building", "office", "lab"];
const STATUS_OPTIONS = ["Active", "Inactive", "Coming Soon"];

function Drawer({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState({});
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();
  const isEdit = !!initial?._id;

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...EMPTY, ...initial } : EMPTY);
      setErrs({});
      setImgPreview(initial?.image || null);
    }
  }, [open, initial]);

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      set("image")(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImgPreview(null);
    set("image")(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    setErrs(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (k) => ({
    width: "100%",
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    transition: "border-color .2s",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${errs[k] ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)"}`,
    color: "#e2e8f0",
    fontFamily: "'DM Sans',sans-serif",
  });

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "#475569",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .3s ease",
        }}
      />

      {/* Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          zIndex: 999,
          width: "min(500px,100vw)",
          background: "#131c2e",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .38s cubic-bezier(.32,.72,0,1)",
          boxShadow: "-24px 0 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0d9488",
                marginBottom: 4,
              }}
            >
              {isEdit ? "Edit" : "New"} Location
            </p>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#f1f5f9",
                fontFamily: "'Playfair Display',serif",
                margin: 0,
              }}
            >
              {isEdit ? `Editing ${initial?.city}` : "Add to India Map"}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.09)",
              background: "rgba(255,255,255,0.05)",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ic d="M5 5l10 10M15 5L5 15" size={15} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={submit}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Location Photo</label>
            {imgPreview ? (
              <div
                style={{
                  position: "relative",
                  borderRadius: 16,
                  overflow: "hidden",
                  height: 160,
                }}
              >
                <img
                  src={imgPreview}
                  alt="preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(13,148,136,0.85)",
                      border: "1px solid rgba(13,148,136,0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} sw={2} /> Change
                  </button>
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "white",
                      cursor: "pointer",
                      background: "rgba(239,68,68,0.85)",
                      border: "1px solid rgba(239,68,68,0.6)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ic
                      d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                      size={11}
                      sw={2}
                    />{" "}
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "100%",
                  borderRadius: 16,
                  padding: "28px 0",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.03)",
                  border: "2px dashed rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  color: "#475569",
                  transition: "border-color .2s",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: "rgba(13,148,136,0.15)",
                    border: "1px solid rgba(13,148,136,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ic
                    d={["M4 14l4-4 3 3 4-5 5 6H4z", "M3 3h14v14H3V3z"]}
                    size={20}
                    sw={1.5}
                    style={{ color: "#0d9488" }}
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
                    Upload photo
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
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImage}
            />
          </div>

          {/* Icon Picker */}
          <div>
            <label style={labelStyle}>Icon Style</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 8,
              }}
            >
              {ICON_OPTIONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => set("icon")(ic)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 8px",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all .2s",
                    background:
                      form.icon === ic
                        ? "rgba(13,148,136,0.2)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.icon === ic ? "rgba(13,148,136,0.5)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div style={{ width: 32, height: 32 }}>{ICONS[ic]}</div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "capitalize",
                      color: form.icon === ic ? "#5eead4" : "#475569",
                    }}
                  >
                    {ic}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0d9488",
                marginBottom: 14,
              }}
            >
              Location Details
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div>
                <label style={labelStyle}>
                  City / Area <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  placeholder="e.g. Kolkata"
                  style={inputStyle("city")}
                />
                {errs.city && (
                  <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>
                    {errs.city}
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>
                  State <span style={{ color: "#f87171" }}>*</span>
                </label>
                <input
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  placeholder="e.g. West Bengal"
                  style={inputStyle("state")}
                />
                {errs.state && (
                  <p style={{ color: "#f87171", fontSize: 11, marginTop: 4 }}>
                    {errs.state}
                  </p>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Tagline</label>
              <input
                value={form.tagline}
                onChange={(e) => set("tagline")(e.target.value)}
                placeholder="e.g. Headquarters – Strategic Hub"
                style={inputStyle()}
              />
            </div>
            <div>
              <label style={labelStyle}>Full Address</label>
              <input
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="123, Park Street, Kolkata"
                style={inputStyle()}
              />
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0d9488",
                marginBottom: 14,
              }}
            >
              Contact (optional)
            </p>
            <div style={{ marginBottom: 10 }}>
              <label style={labelStyle}>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+91 00000 00000"
                style={inputStyle()}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="kolkata@accelia.com"
                style={inputStyle()}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <div style={{ display: "flex", gap: 8 }}>
              {STATUS_OPTIONS.map((s) => {
                const sty = STATUS_STYLE[s];
                const active = form.status === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => set("status")(s)}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all .2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                      background: active ? sty.bg : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? sty.border : "rgba(255,255,255,0.08)"}`,
                      color: active ? sty.text : "#475569",
                    }}
                  >
                    {active && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: sty.dot,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HQ Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div>
              <p
                style={{
                  color: "#e2e8f0",
                  fontSize: 13,
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Mark as HQ
              </p>
              <p style={{ color: "#475569", fontSize: 11, margin: "2px 0 0" }}>
                Highlights this as the headquarters
              </p>
            </div>
            <button
              type="button"
              onClick={() => set("isHQ")(!form.isHQ)}
              style={{
                position: "relative",
                width: 44,
                height: 24,
                borderRadius: 12,
                flexShrink: 0,
                cursor: "pointer",
                background: form.isHQ ? "#0d9488" : "rgba(255,255,255,0.12)",
                border: "none",
                transition: "background .3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  left: form.isHQ ? "calc(100% - 21px)" : "3px",
                  transition: "left .3s cubic-bezier(.34,1.56,.64,1)",
                }}
              />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "16px 24px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
            }}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: "linear-gradient(135deg,#0d9488,#0891b2)",
              color: "white",
              border: "none",
              opacity: saving ? 0.75 : 1,
              boxShadow: "0 4px 20px rgba(13,148,136,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {saving ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  style={{ animation: "spin .7s linear infinite" }}
                >
                  <path d="M10 2v4M10 14v4M4 10H2M18 10h-2M5.64 5.64l-1.41-1.41M15.78 15.78l-1.42-1.42" />
                </svg>
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Location"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Location Card ── */
function LocationCard({ loc, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const sty = STATUS_STYLE[loc.status] || STATUS_STYLE["Active"];
  const isHQ = loc.isHQ;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: isHQ
          ? "linear-gradient(160deg,rgba(13,148,136,0.14),rgba(8,145,178,0.07))"
          : "rgba(255,255,255,0.04)",
        border: isHQ
          ? "1px solid rgba(13,148,136,0.4)"
          : hovered
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(13,148,136,0.1)"
          : isHQ
            ? "0 4px 20px rgba(13,148,136,0.12)"
            : "none",
        transition: "all .25s ease",
        animation: "cardUp .5s ease both",
        animationDelay: `${index * 50}ms`,
        position: "relative",
      }}
    >
      {/* Image or icon area */}
      {loc.image ? (
        <div style={{ height: 90, overflow: "hidden", position: "relative" }}>
          <img
            src={loc.image}
            alt={loc.city}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) saturate(1.2)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform .35s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom,transparent 40%,rgba(15,23,42,0.7))",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg,rgba(13,148,136,0.07),rgba(8,145,178,0.04))",
          }}
        >
          <div style={{ width: 40, height: 40, opacity: 0.85 }}>
            {ICONS[loc.icon] || ICONS.pin}
          </div>
        </div>
      )}

      {/* Badges */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {isHQ ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "2px 8px",
              borderRadius: 6,
              background: "#0d9488",
              color: "white",
            }}
          >
            HQ
          </span>
        ) : (
          <span />
        )}
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 20,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: sty.bg,
            border: `1px solid ${sty.border}`,
            color: sty.text,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: sty.dot,
            }}
          />
          {loc.status}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "10px 14px 14px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <h3
          style={{
            color: "#f1f5f9",
            fontWeight: 900,
            fontSize: 13,
            margin: "0 0 3px",
            fontFamily: "'Playfair Display',serif",
            lineHeight: 1.3,
          }}
        >
          {loc.city}
        </h3>
        <p
          style={{
            color: "#475569",
            fontSize: 11,
            margin: "0 0 12px",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {loc.tagline || "No description"}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => onEdit(loc)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "6px 0",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .2s",
              background: "rgba(13,148,136,0.15)",
              border: "1px solid rgba(13,148,136,0.3)",
              color: "#5eead4",
            }}
          >
            <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} sw={2} />
            Edit
          </button>
          <button
            onClick={() => onDelete(loc)}
            style={{
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all .2s",
              flexShrink: 0,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            <Ic
              d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
              size={12}
              sw={1.8}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Locations() {
  const [locs, setLocs] = useState(INITIAL);
  const [search, setSearch] = useState("");
  const [filterStat, setFilterStat] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  const toast = (msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const filtered = locs.filter((l) => {
    const q = search.toLowerCase();
    const mQ =
      !q ||
      l.city.toLowerCase().includes(q) ||
      l.state.toLowerCase().includes(q) ||
      (l.tagline || "").toLowerCase().includes(q);
    const mS = filterStat === "All" || l.status === filterStat;
    return mQ && mS;
  });

  const handleSave = async (payload) => {
    if (editTarget?._id) {
      let updated = locs.map((l) =>
        l._id === editTarget._id ? { ...l, ...payload } : l,
      );
      if (payload.isHQ)
        updated = updated.map((l) =>
          l._id === editTarget._id ? l : { ...l, isHQ: false },
        );
      setLocs(updated);
      toast("Location updated ✓");
    } else {
      let newList = [...locs];
      if (payload.isHQ) newList = newList.map((l) => ({ ...l, isHQ: false }));
      setLocs([
        ...newList,
        { ...payload, _id: String(++_id), order: locs.length },
      ]);
      toast("Location added ✓");
    }
  };

  const handleDelete = () => {
    setLocs((l) => l.filter((x) => x._id !== deleteTarget._id));
    toast(`${deleteTarget.city} removed`, "err");
    setDeleteTarget(null);
  };

  const counts = {
    total: locs.length,
    active: locs.filter((l) => l.status === "Active").length,
    soon: locs.filter((l) => l.status === "Coming Soon").length,
    inactive: locs.filter((l) => l.status === "Inactive").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #0f172a; }
        @keyframes cardUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(8px)}  to{opacity:1;transform:none} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:none} }
        @keyframes popIn        { from{opacity:0;transform:scale(.92)}       to{opacity:1;transform:none} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        input::placeholder { color: #334155 !important; }
        .filter-scroll { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .loc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media(min-width: 480px)  { .loc-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(min-width: 768px)  { .loc-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; } }
        @media(min-width: 1024px) { .loc-grid { grid-template-columns: repeat(5, 1fr); } }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        @media(min-width: 640px)  { .stat-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          fontFamily: "'DM Sans',sans-serif",
        }}
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
            padding: "14px 16px",
            background: "rgba(15,23,42,0.88)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            animation: "fadeUp .4s ease both",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#334155",
                  margin: 0,
                }}
              ></p>
              <p
                style={{
                  fontSize: 25,
                  fontWeight: 700,
                  color: "#e2e8f0",
                  margin: 0,
                  fontFamily: "'Playfair Display',serif",
                }}
              >
                Locations Manager
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditTarget(null);
              setDrawerOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              color: "white",
              cursor: "pointer",
              border: "none",
              background: "linear-gradient(135deg,#0d9488,#0891b2)",
              boxShadow: "0 4px 16px rgba(13,148,136,0.35)",
              transition: "transform .15s,box-shadow .15s",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>
              +
            </span>
            <span>Add Location</span>
          </button>
        </div>

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 16px 40px",
          }}
        >
          {/* ══ PAGE HEADER ══ */}
          <div style={{ marginBottom: 28, animation: "fadeUp .4s ease both" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
                background: "rgba(13,148,136,0.18)",
                border: "1px solid rgba(13,148,136,0.35)",
                color: "#5eead4",
              }}
            >
              India Operations
            </div>
            <h1
              style={{
                fontSize: "clamp(28px,5vw,48px)",
                fontWeight: 900,
                color: "#f1f5f9",
                margin: "0 0 10px",
                lineHeight: 1.15,
                fontFamily: "'Playfair Display',serif",
              }}
            >
              Where We Operate in India
            </h1>
            <p
              style={{
                color: "#475569",
                fontSize: 14,
                maxWidth: 480,
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Manage your India presence. Changes reflect immediately on the
              public website.
            </p>
          </div>

          {/* ══ STAT CARDS ══ */}
          <div
            className="stat-grid"
            style={{
              marginBottom: 24,
              animation: "fadeUp .45s ease .08s both",
            }}
          >
            {[
              { label: "Total", value: counts.total, color: "#5eead4" },
              { label: "Active", value: counts.active, color: "#34d399" },
              { label: "Coming Soon", value: counts.soon, color: "#fbbf24" },
              { label: "Inactive", value: counts.inactive, color: "#94a3b8" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  borderRadius: 16,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: s.color,
                    fontFamily: "'Playfair Display',serif",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#475569",
                    lineHeight: 1.3,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* ══ FILTERS ══ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 16,
              animation: "fadeUp .45s ease .12s both",
            }}
          >
            {/* Search */}
            <div style={{ position: "relative", maxWidth: 320 }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#334155",
                  display: "flex",
                }}
              >
                <Ic
                  d={["M9 4a5 5 0 100 10A5 5 0 009 4z", "M15 15l4 4"]}
                  size={14}
                />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, state…"
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: 14,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 12,
                  fontSize: 13,
                  outline: "none",
                  transition: "border-color .2s",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#e2e8f0",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              />
            </div>

            {/* Status filter pills */}
            <div className="filter-scroll" style={{ display: "flex", gap: 8 }}>
              {["All", "Active", "Coming Soon", "Inactive"].map((s) => {
                const active = filterStat === s;
                const sty = STATUS_STYLE[s];
                return (
                  <button
                    key={s}
                    onClick={() => setFilterStat(s)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 14px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all .2s",
                      background: active
                        ? sty
                          ? sty.bg
                          : "rgba(13,148,136,0.18)"
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? (sty ? sty.border : "rgba(13,148,136,0.4)") : "rgba(255,255,255,0.08)"}`,
                      color: active ? (sty ? sty.text : "#5eead4") : "#475569",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
              {(search || filterStat !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterStat("All");
                  }}
                  style={{
                    flexShrink: 0,
                    padding: "7px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(13,148,136,0.1)",
                    border: "1px solid rgba(13,148,136,0.2)",
                    color: "#0d9488",
                  }}
                >
                  <Ic d="M5 5l10 10M15 5L5 15" size={10} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* ══ RESULTS COUNT ══ */}
          <p
            style={{
              fontSize: 12,
              color: "#334155",
              marginBottom: 14,
              fontWeight: 500,
            }}
          >
            Showing{" "}
            <strong style={{ color: "#64748b" }}>{filtered.length}</strong> of{" "}
            <strong style={{ color: "#64748b" }}>{locs.length}</strong>{" "}
            locations
          </p>

          {/* ══ CARD GRID ══ */}
          {filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 0",
                animation: "fadeUp .4s ease both",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  marginBottom: 16,
                  opacity: 0.25,
                }}
              >
                {ICONS.pin}
              </div>
              <p
                style={{
                  color: "#334155",
                  fontSize: 14,
                  fontWeight: 600,
                  margin: "0 0 8px",
                }}
              >
                No locations match your search
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStat("All");
                }}
                style={{
                  color: "#0d9488",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="loc-grid">
              {filtered.map((loc, i) => (
                <LocationCard
                  key={loc._id}
                  loc={loc}
                  index={i}
                  onEdit={(l) => {
                    setEditTarget(l);
                    setDrawerOpen(true);
                  }}
                  onDelete={(l) => setDeleteTarget(l)}
                />
              ))}

              {/* Ghost add card */}
              <button
                onClick={() => {
                  setEditTarget(null);
                  setDrawerOpen(true);
                }}
                style={{
                  minHeight: 180,
                  borderRadius: 16,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  color: "#334155",
                  transition: "all .25s",
                  animation: `cardUp .5s ease both`,
                  animationDelay: `${filtered.length * 50}ms`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: "1px dashed currentColor",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 300,
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>
                  Add Location
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />
      <ConfirmModal
        open={!!deleteTarget}
        name={deleteTarget?.city}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
      <Toast items={toasts} />
    </>
  );
}
