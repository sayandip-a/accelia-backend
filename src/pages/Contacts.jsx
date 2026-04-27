/**
 * ContactAdmin.jsx
 * Admin-facing Contact Submissions Inbox
 * Dark theme · matches Clinix/Accelia admin portal aesthetic
 * Features: inbox list, detail drawer, status management,
 *           admin notes, search/filter, bulk delete, toasts
 *
 * Backend: POST /api/contacts  (user submits)
 *          GET  /api/admin/contacts  (admin reads)
 *          PATCH /api/admin/contacts/:id/status
 *          DELETE /api/admin/contacts/:id
 */

import { useState, useRef, useEffect } from "react";
// import { contactAdminApi } from "../api/contactApi";

/* ══ MOCK DATA ══ */
let _uid = 9;
const MOCK_DATA = [
  {
    _id: "1",
    name: "Rohan Sharma",
    email: "rohan.s@example.com",
    phone: "+91 98765 43210",
    company: "TechMed India",
    subject: "Partnership Inquiry",
    message:
      "We are a medical tech company based in Bengaluru and would like to explore a partnership for clinical trials. Could you share details on how you engage with industry partners? We have over 200 hospitals in our network and are keen to collaborate on multi-site studies.",
    status: "New",
    adminNote: "",
    createdAt: "2024-06-10T09:15:00Z",
  },
  {
    _id: "2",
    name: "Priya Nair",
    email: "priya.n@hospitalx.com",
    phone: "+91 80001 22334",
    company: "Hospital X",
    subject: "Clinical Trial Enrollment",
    message:
      "Our hospital is interested in enrolling patients for your upcoming oncology trial. Please send the inclusion criteria and site qualification requirements so we can assess feasibility from our end.",
    status: "Read",
    adminNote: "Follow up with trial coordinator next week",
    createdAt: "2024-06-09T14:30:00Z",
  },
  {
    _id: "3",
    name: "Amit Gupta",
    email: "amit.g@pharma.co",
    phone: "",
    company: "PharmaCore Ltd",
    subject: "Regulatory Submission Help",
    message:
      "We need expert assistance with CDSCO submission for our Phase 3 trial. Timeline is critical — targeting Q4. Can you share your team's experience with similar submissions and approximate timelines?",
    status: "Replied",
    adminNote: "Sent brochure and team CV on 8 Jun",
    createdAt: "2024-06-08T11:00:00Z",
  },
  {
    _id: "4",
    name: "Sunita Verma",
    email: "sunita@biotech.in",
    phone: "+91 70000 88812",
    company: "BioTech Solutions",
    subject: "Data Management Query",
    message:
      "We are looking for a CRO to handle data management for our multi-site study. How many sites can you manage simultaneously? What EDC platforms do you support? We are currently evaluating Medidata and Oracle Clinical.",
    status: "New",
    adminNote: "",
    createdAt: "2024-06-07T08:45:00Z",
  },
  {
    _id: "5",
    name: "Dr. Arjun Mehta",
    email: "arjun.m@aiims.edu",
    phone: "+91 91234 56789",
    company: "AIIMS Delhi",
    subject: "Research Collaboration",
    message:
      "I am a faculty member at AIIMS interested in collaborating on an investigator-initiated trial. Could we schedule a call to discuss the scope and potential funding mechanisms?",
    status: "Read",
    adminNote: "",
    createdAt: "2024-06-06T16:20:00Z",
  },
  {
    _id: "6",
    name: "Kavitha Rajan",
    email: "kavitha.r@consult.com",
    phone: "",
    company: "",
    subject: "General Enquiry",
    message:
      "I came across Accelia at a conference last week. Could you share your service portfolio and current project focus areas? We are a consulting firm looking to refer clients to reliable CROs.",
    status: "Archived",
    adminNote: "Added to newsletter list",
    createdAt: "2024-06-05T10:05:00Z",
  },
  {
    _id: "7",
    name: "Nikhil Bose",
    email: "nikhil.b@startup.io",
    phone: "+91 99887 76655",
    company: "MedStart",
    subject: "Startup Collaboration",
    message:
      "We are an early-stage health-tech startup working on an AI-driven patient screening tool. Would Accelia be open to a pilot collaboration to validate it in a real clinical environment?",
    status: "New",
    adminNote: "",
    createdAt: "2024-06-04T13:40:00Z",
  },
  {
    _id: "8",
    name: "Fatima Khan",
    email: "fatima.k@ngo.org",
    phone: "+91 88775 66443",
    company: "HealthForAll NGO",
    subject: "CSR / Community Health",
    message:
      "Our NGO runs primary health camps across rural Bengal. We would love to partner with Accelia for medical camps with proper clinical documentation. Please let us know if this aligns with your CSR goals.",
    status: "Replied",
    adminNote: "Connected to CSR team",
    createdAt: "2024-06-03T09:00:00Z",
  },
];

/* ══ HELPERS ══ */
const Ic = ({ d, size = 16, sw = 1.6, style: s }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={s}
  >
    {[].concat(d).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const STATUS = {
  New: {
    bg: "rgba(6,182,212,0.12)",
    border: "rgba(6,182,212,0.3)",
    text: "#22d3ee",
    dot: "#06b6d4",
  },
  Read: {
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
    text: "#94a3b8",
    dot: "#64748b",
  },
  Replied: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    text: "#34d399",
    dot: "#10b981",
  },
  Archived: {
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.2)",
    text: "#6b7280",
    dot: "#4b5563",
  },
};

const fmt = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ══ TOAST ══ */
function Toast({ items }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold"
          style={{
            background:
              t.type === "err"
                ? "rgba(239,68,68,0.12)"
                : "rgba(16,185,129,0.12)",
            border: `1px solid ${t.type === "err" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
            color: t.type === "err" ? "#f87171" : "#34d399",
            backdropFilter: "blur(12px)",
            animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1) both",
          }}
        >
          <Ic
            d={
              t.type === "err"
                ? ["M10 3l7 14H3L10 3z", "M10 8v4", "M10 14h.01"]
                : "M4 10l4 4 8-8"
            }
            size={14}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══ STATUS BADGE ══ */
function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.Read;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-xl"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: s.dot }}
      />
      {status}
    </span>
  );
}

/* ══ DETAIL DRAWER ══ */
function DetailDrawer({
  contact,
  open,
  onClose,
  onStatusChange,
  onNoteChange,
  onDelete,
}) {
  const [note, setNote] = useState("");
  const [noteEdit, setNoteEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setNote(contact.adminNote || "");
      setNoteEdit(false);
    }
  }, [contact]);

  if (!contact) return null;

  const saveNote = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    onNoteChange(contact._id, note);
    setSaving(false);
    setNoteEdit(false);
  };

  const STATUSES = ["New", "Read", "Replied", "Archived"];

  return (
    <>
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(5px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      <aside
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(560px,100vw)",
          background: "#0d1420",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .36s cubic-bezier(.32,.72,0,1)",
          boxShadow: "-32px 0 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-7 py-5 border-b border-white/[0.06]"
          style={{
            background:
              "linear-gradient(90deg,rgba(6,182,212,0.06),transparent)",
          }}
        >
          <div className="min-w-0 flex-1 pr-4">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <StatusBadge status={contact.status} />
              <span className="text-gray-600 text-xs">
                {fmt(contact.createdAt)}
              </span>
            </div>
            <h2
              className="text-white font-extrabold text-lg leading-tight truncate"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              {contact.name}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5 truncate">
              {contact.email}
              {contact.company ? ` · ${contact.company}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-colors flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Ic d="M5 5l10 10M15 5L5 15" size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Email",
                value: contact.email,
                icon: ["M2 4h16v12H2z", "M2 4l8 7 8-7"],
              },
              {
                label: "Phone",
                value: contact.phone || "—",
                icon: "M4 2h4l1.5 4L7 7.5a11 11 0 005.5 5.5L15 11l4 1.5V16a2 2 0 01-2 2C6 18 2 10 2 4a2 2 0 012-2z",
              },
              {
                label: "Company",
                value: contact.company || "—",
                icon: ["M2 12l8-8 8 8", "M4 10v8h5v-5h2v5h5v-8"],
              },
              {
                label: "Subject",
                value: contact.subject || "—",
                icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-3.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-gray-600">
                    <Ic d={f.icon} size={12} />
                  </span>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600">
                    {f.label}
                  </p>
                </div>
                <p className="text-white/80 text-xs font-medium leading-relaxed truncate">
                  {f.value}
                </p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-cyan-500/70 mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-cyan-500/40 inline-block" /> Message
            </p>
            <div
              className="rounded-2xl p-5 text-white/80 text-sm leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "'Outfit',sans-serif",
              }}
            >
              {contact.message}
            </div>
          </div>

          {/* Status changer */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-cyan-500/70 mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-cyan-500/40 inline-block" /> Update
              Status
            </p>
            <div className="grid grid-cols-4 gap-2">
              {["New", "Read", "Replied", "Archived"].map((s) => {
                const sty = STATUS[s];
                const active = contact.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(contact._id, s)}
                    className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
                    style={{
                      background: active ? sty.bg : "transparent",
                      borderColor: active
                        ? sty.border
                        : "rgba(255,255,255,0.07)",
                      color: active ? sty.text : "#4b5563",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin note */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold tracking-widest uppercase text-cyan-500/70 flex items-center gap-2">
                <span className="w-4 h-px bg-cyan-500/40 inline-block" /> Admin
                Note
              </p>
              {!noteEdit && (
                <button
                  onClick={() => setNoteEdit(true)}
                  className="text-xs text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
                >
                  <Ic d="M13 3l4 4-8 8H5v-4l8-8z" size={11} /> Edit
                </button>
              )}
            </div>
            {noteEdit ? (
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Add an internal note…"
                  className="w-full rounded-xl border px-4 py-3 text-sm text-white/90 outline-none resize-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(6,182,212,0.3)",
                    fontFamily: "'Outfit',sans-serif",
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setNote(contact.adminNote || "");
                      setNoteEdit(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNote}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-1.5"
                    style={{
                      background: "linear-gradient(135deg,#06b6d4,#6366f1)",
                      opacity: saving ? 0.8 : 1,
                    }}
                  >
                    {saving ? "Saving…" : "Save Note"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl p-4 min-h-[56px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="text-gray-500 text-sm italic">
                  {contact.adminNote || "No note added yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-7 py-5 border-t border-white/[0.05] flex justify-between items-center"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          <button
            onClick={() => onDelete(contact._id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.18)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.18)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
            }
          >
            <Ic d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]} size={14} />
            Delete
          </button>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg,#06b6d4,#6366f1)",
              boxShadow: "0 4px 14px rgba(6,182,212,0.2)",
            }}
          >
            <Ic d={["M2 4h16v12H2z", "M2 4l8 7 8-7"]} size={14} />
            Reply via Email
          </a>
        </div>
      </aside>
    </>
  );
}

/* ══ CONFIRM DELETE ══ */
function ConfirmModal({ open, count, onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="rounded-3xl p-8 w-full max-w-sm text-center flex flex-col items-center"
        style={{
          background: "#0d1420",
          border: "1px solid rgba(239,68,68,0.2)",
          animation: "popIn .3s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
        >
          <Ic
            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
            size={22}
            sw={1.8}
          />
        </div>
        <h3
          className="text-white text-lg font-extrabold mb-2"
          style={{ fontFamily: "'Syne',sans-serif" }}
        >
          Delete {count > 1 ? `${count} Messages` : "Message"}?
        </h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          This action is permanent and cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-400"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN ADMIN PAGE
════════════════════════════════════════ */
export default function ContactAdmin() {
  const [messages, setMessages] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]); // bulk select ids
  const [active, setActive] = useState(null); // open in drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  const toast = (msg, type = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  /* ── filter ── */
  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    const mQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.company || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q);
    const mF = filter === "All" || m.status === filter;
    return mQ && mF;
  });

  /* ── stats ── */
  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === "New").length,
    replied: messages.filter((m) => m.status === "Replied").length,
    archived: messages.filter((m) => m.status === "Archived").length,
  };

  /* ── open detail ── */
  const openDetail = (msg) => {
    // auto-mark as Read
    if (msg.status === "New") {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: "Read" } : m)),
      );
      msg = { ...msg, status: "Read" };
    }
    setActive(msg);
    setDrawerOpen(true);
  };

  /* ── status change ── */
  const handleStatusChange = (id, status) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, status } : m)),
    );
    setActive((prev) => (prev?._id === id ? { ...prev, status } : prev));
    toast(`Marked as ${status}`);
  };

  /* ── note change ── */
  const handleNoteChange = (id, note) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === id ? { ...m, adminNote: note } : m)),
    );
    setActive((prev) =>
      prev?._id === id ? { ...prev, adminNote: note } : prev,
    );
    toast("Note saved");
  };

  /* ── delete (single or bulk) ── */
  const triggerDelete = (ids) => {
    setDeletingIds(ids);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    const ids = deletingIds;
    setMessages((prev) => prev.filter((m) => !ids.includes(m._id)));
    if (active && ids.includes(active._id)) {
      setDrawerOpen(false);
      setActive(null);
    }
    setSelected([]);
    setConfirmOpen(false);
    toast(`${ids.length} message${ids.length > 1 ? "s" : ""} deleted`, "err");
  };

  /* ── bulk select ── */
  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((m) => m._id),
    );

  /* ── stat cards ── */
  const STAT_CARDS = [
    {
      label: "Total",
      value: stats.total,
      color: "#06b6d4",
      icon: ["M2 4h16v12H2z", "M2 4l8 7 8-7"],
    },
    {
      label: "New",
      value: stats.new,
      color: "#22d3ee",
      icon: "M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2",
    },
    {
      label: "Replied",
      value: stats.replied,
      color: "#10b981",
      icon: "M4 10l4 4 8-8",
    },
    {
      label: "Archived",
      value: stats.archived,
      color: "#6b7280",
      icon: [
        "M5 3h10a2 2 0 012 2v1H3V5a2 2 0 012-2z",
        "M3 6h14v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6z",
        "M9 11h2",
      ],
    },
  ];

  const FILTER_TABS = ["All", "New", "Read", "Replied", "Archived"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; font-family:'Outfit',sans-serif; }
        @keyframes up      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#ffffff12;border-radius:4px}
      `}</style>

      <div
        className="min-h-screen text-white"
        style={{ background: "#080d17" }}
      >
        {/* ══ HEADER ══ */}
        <div
          className="sticky top-0 z-30 px-5 md:px-10 py-4 flex items-center justify-between"
          style={{
            background: "rgba(8,13,23,0.9)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ animation: "up .4s ease both" }}>
            <p
              className="text-[10px] tracking-[.2em] font-semibold uppercase"
              style={{ color: "rgba(6,182,212,0.6)" }}
            >
              Clinix Admin
            </p>
            <h1
              className="text-2xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Syne',sans-serif" }}
            >
              Contact Inbox
            </h1>
          </div>

          {/* New badge */}
          {stats.new > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.25)",
                animation: "up .4s ease .1s both",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#06b6d4", boxShadow: "0 0 6px #06b6d4" }}
              />
              <span className="text-cyan-300 text-sm font-bold">
                {stats.new} new
              </span>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
          {/* ══ STAT CARDS ══ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 flex items-center gap-4"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animation: `up .5s ease both`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}18`, color: s.color }}
                >
                  <Ic d={s.icon} size={18} />
                </div>
                <div>
                  <p
                    className="text-3xl font-extrabold text-white leading-none"
                    style={{ fontFamily: "'Syne',sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-gray-500 text-xs font-medium mt-1">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ══ TOOLBAR ══ */}
          <div
            className="flex flex-col sm:flex-row gap-3 mb-5"
            style={{ animation: "up .5s ease .15s both" }}
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                <Ic
                  d={["M9 4a5 5 0 100 10A5 5 0 009 4z", "M15 15l4 4"]}
                  size={14}
                />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, subject…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-white/90 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              />
            </div>

            {/* Status filter pills */}
            <div className="flex gap-2 flex-wrap">
              {FILTER_TABS.map((tab) => {
                const sty = STATUS[tab];
                const active = filter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className="text-xs px-3.5 py-2 rounded-xl font-semibold border transition-all"
                    style={{
                      background: active
                        ? sty
                          ? sty.bg
                          : "rgba(6,182,212,0.1)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: active
                        ? sty
                          ? sty.border
                          : "rgba(6,182,212,0.3)"
                        : "rgba(255,255,255,0.07)",
                      color: active ? (sty ? sty.text : "#22d3ee") : "#4b5563",
                    }}
                  >
                    {tab}
                    {tab !== "All" && (
                      <span className="ml-1.5 text-[10px] opacity-70">
                        {messages.filter((m) => m.status === tab).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bulk delete */}
            {selected.length > 0 && (
              <button
                onClick={() => triggerDelete(selected)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ml-auto"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.22)",
                }}
              >
                <Ic
                  d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                  size={14}
                />
                Delete {selected.length}
              </button>
            )}
          </div>

          {/* ══ RESULTS INFO ══ */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-600 text-xs">
              <span className="text-white font-semibold">
                {filtered.length}
              </span>{" "}
              messages
              {(search || filter !== "All") && ` · filtered`}
            </p>
            {(search || filter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="text-xs text-cyan-500 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Ic d="M5 5l10 10M15 5L5 15" size={11} /> Clear
              </button>
            )}
          </div>

          {/* ══ TABLE ══ */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.018)",
            }}
          >
            {/* Table head */}
            <div
              className="grid items-center px-5 py-3 border-b border-white/[0.05]"
              style={{ gridTemplateColumns: "2rem 2fr 1.4fr 1.4fr 1fr 7rem" }}
            >
              {/* Select all */}
              <button
                onClick={toggleAll}
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                style={{
                  borderColor:
                    selected.length === filtered.length && filtered.length > 0
                      ? "#06b6d4"
                      : "rgba(255,255,255,0.12)",
                  background:
                    selected.length === filtered.length && filtered.length > 0
                      ? "rgba(6,182,212,0.2)"
                      : "transparent",
                }}
              >
                {selected.length === filtered.length && filtered.length > 0 && (
                  <Ic
                    d="M4 10l4 4 8-8"
                    size={11}
                    sw={2.5}
                    style={{ color: "#06b6d4" }}
                  />
                )}
              </button>
              {["Sender", "Subject", "Company", "Status", "Received"].map(
                (h) => (
                  <p
                    key={h}
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-600"
                  >
                    {h}
                  </p>
                ),
              )}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                <Ic d={["M2 4h16v12H2z", "M2 4l8 7 8-7"]} size={36} />
                <p className="mt-3 text-sm">No messages match your filters</p>
              </div>
            ) : (
              filtered.map((msg, i) => {
                const isNew = msg.status === "New";
                const isSel = selected.includes(msg._id);
                const isOpen = active?._id === msg._id && drawerOpen;

                return (
                  <div
                    key={msg._id}
                    className="grid items-center px-5 py-4 border-b border-white/[0.04] last:border-0 cursor-pointer transition-all group"
                    style={{
                      gridTemplateColumns: "2rem 2fr 1.4fr 1.4fr 1fr 7rem",
                      background: isOpen
                        ? "rgba(6,182,212,0.06)"
                        : isSel
                          ? "rgba(6,182,212,0.04)"
                          : "transparent",
                      animation: "rowIn .4s ease both",
                      animationDelay: `${i * 40}ms`,
                    }}
                    onMouseEnter={(e) => {
                      if (!isOpen)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.025)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpen)
                        e.currentTarget.style.background = isSel
                          ? "rgba(6,182,212,0.04)"
                          : "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(msg._id);
                      }}
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                      style={{
                        borderColor: isSel
                          ? "#06b6d4"
                          : "rgba(255,255,255,0.1)",
                        background: isSel
                          ? "rgba(6,182,212,0.2)"
                          : "transparent",
                      }}
                    >
                      {isSel && (
                        <Ic
                          d="M4 10l4 4 8-8"
                          size={11}
                          sw={2.5}
                          style={{ color: "#06b6d4" }}
                        />
                      )}
                    </div>

                    {/* Sender */}
                    <div
                      className="min-w-0 pr-4"
                      onClick={() => openDetail(msg)}
                    >
                      <p
                        className="text-sm font-bold truncate"
                        style={{
                          color: isNew ? "white" : "rgba(255,255,255,0.7)",
                        }}
                      >
                        {isNew && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2 -translate-y-px" />
                        )}
                        {msg.name}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {msg.email}
                      </p>
                    </div>

                    {/* Subject */}
                    <div
                      className="min-w-0 pr-4"
                      onClick={() => openDetail(msg)}
                    >
                      <p
                        className="text-sm truncate"
                        style={{
                          color: isNew
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(255,255,255,0.5)",
                          fontWeight: isNew ? 600 : 400,
                        }}
                      >
                        {msg.subject || (
                          <span className="italic text-gray-600">
                            No subject
                          </span>
                        )}
                      </p>
                      <p className="text-gray-600 text-xs truncate mt-0.5">
                        {msg.message.slice(0, 55)}…
                      </p>
                    </div>

                    {/* Company */}
                    <div
                      className="min-w-0 pr-4"
                      onClick={() => openDetail(msg)}
                    >
                      <p className="text-sm text-gray-400 truncate">
                        {msg.company || "—"}
                      </p>
                    </div>

                    {/* Status */}
                    <div onClick={() => openDetail(msg)}>
                      <StatusBadge status={msg.status} />
                    </div>

                    {/* Time + quick actions */}
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-gray-600 text-xs whitespace-nowrap hidden sm:block">
                        {fmt(msg.createdAt)}
                      </span>
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(msg);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: "rgba(6,182,212,0.1)",
                            color: "#22d3ee",
                          }}
                          title="View"
                        >
                          <Ic
                            d="M1 10s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM10 10a1 1 0 100-2 1 1 0 000 2z"
                            size={12}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerDelete([msg._id]);
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            color: "#f87171",
                          }}
                          title="Delete"
                        >
                          <Ic
                            d={["M3 5h14", "M8 5V3h4v2", "M6 5l1 13h6l1-13"]}
                            size={12}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Row count */}
          <p className="text-gray-700 text-xs text-center mt-4">
            {filtered.length} of {messages.length} messages
          </p>
        </div>
      </div>

      {/* ══ DETAIL DRAWER ══ */}
      <DetailDrawer
        contact={active}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        onNoteChange={handleNoteChange}
        onDelete={(id) => triggerDelete([id])}
      />

      {/* ══ CONFIRM MODAL ══ */}
      <ConfirmModal
        open={confirmOpen}
        count={deletingIds.length}
        onConfirm={confirmDelete}
        onClose={() => {
          setConfirmOpen(false);
          setDeletingIds([]);
        }}
      />

      {/* ══ TOASTS ══ */}
      <Toast items={toasts} />
    </>
  );
}
