import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   AVATAR COLORS — cycling per member
───────────────────────────────────────────── */
const AVATAR_PALETTES = [
  { bg: "from-violet-500 to-indigo-600", ring: "#7c3aed" },
  { bg: "from-cyan-400 to-teal-600", ring: "#0891b2" },
  { bg: "from-rose-400 to-pink-600", ring: "#e11d48" },
  { bg: "from-amber-400 to-orange-500", ring: "#d97706" },
  { bg: "from-emerald-400 to-green-600", ring: "#059669" },
  { bg: "from-sky-400 to-blue-600", ring: "#0284c7" },
];

const initialTeamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Principal Investigator",
    department: "Oncology Research",
    status: "Active",
    email: "s.chen@clinix.com",
    joined: "Jan 2021",
    projects: 12,
    avatar: null,
  },
  {
    id: 2,
    name: "Marcus Webb",
    role: "Clinical Data Scientist",
    department: "Data Science",
    status: "Active",
    email: "m.webb@clinix.com",
    joined: "Mar 2022",
    projects: 8,
    avatar: null,
  },
  {
    id: 3,
    name: "Dr. Priya Nair",
    role: "Cardiologist",
    department: "Cardiovascular",
    status: "Active",
    email: "p.nair@clinix.com",
    joined: "Jul 2020",
    projects: 15,
    avatar: null,
  },
  {
    id: 4,
    name: "James Okafor",
    role: "Regulatory Specialist",
    department: "Regulatory Affairs",
    status: "On Leave",
    email: "j.okafor@clinix.com",
    joined: "Sep 2021",
    projects: 6,
    avatar: null,
  },
  {
    id: 5,
    name: "Dr. Elena Vasquez",
    role: "Neurologist",
    department: "Neurology",
    status: "Active",
    email: "e.vasquez@clinix.com",
    joined: "Feb 2023",
    projects: 4,
    avatar: null,
  },
  {
    id: 6,
    name: "Tom Hartley",
    role: "Medical Affairs Lead",
    department: "Medical Affairs",
    status: "Active",
    email: "t.hartley@clinix.com",
    joined: "Nov 2019",
    projects: 19,
    avatar: null,
  },
];

const DEPARTMENTS = [
  "All",
  "Oncology Research",
  "Cardiovascular",
  "Neurology",
  "Medical Affairs",
  "Data Science",
  "Regulatory Affairs",
];

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getPalette(id) {
  return AVATAR_PALETTES[(id - 1) % AVATAR_PALETTES.length];
}

/* ── Avatar with optional image upload ── */
function Avatar({ member, size = "lg", onImageChange }) {
  const ref = useRef();
  const palette = getPalette(member.id);
  const sz = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm";

  return (
    <div className={`relative ${sz} flex-shrink-0`}>
      <div
        className={`${sz} rounded-2xl bg-gradient-to-br ${palette.bg} flex items-center justify-center font-bold text-white shadow-lg overflow-hidden`}
        style={{ boxShadow: `0 0 0 2px ${palette.ring}44` }}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(member.name)}</span>
        )}
      </div>
      {onImageChange && (
        <>
          <button
            type="button"
            onClick={() => ref.current.click()}
            className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
            title="Upload photo"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => onImageChange(ev.target.result);
              reader.readAsDataURL(file);
            }}
          />
        </>
      )}
    </div>
  );
}

/* ── Member Card ── */
function MemberCard({ member, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false);
  const palette = getPalette(member.id);

  return (
    <div
      className="member-card group relative bg-[#0f1623] border border-white/[0.06] rounded-2xl p-5 overflow-hidden"
      style={{
        animation: `cardIn 0.5s ease both`,
        animationDelay: `${index * 60}ms`,
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        ...(hovered
          ? {
              transform: "translateY(-3px)",
              boxShadow: `0 12px 32px -8px ${palette.ring}22`,
              borderColor: `${palette.ring}33`,
            }
          : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row: avatar + info */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar member={member} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate leading-tight">
            {member.name}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 truncate">{member.role}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background:
                  member.status === "Active" ? "#05966918" : "#d9770618",
                color: member.status === "Active" ? "#34d399" : "#fbbf24",
                border: `1px solid ${member.status === "Active" ? "#05966930" : "#d9770630"}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    member.status === "Active" ? "#34d399" : "#fbbf24",
                }}
              />
              {member.status}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.05] mb-3" />

      {/* Info row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] px-2 py-1 rounded-lg bg-white/[0.05] text-gray-400 border border-white/[0.04]">
          {member.department}
        </span>
        <span className="text-[11px] text-gray-500">
          {member.projects} projects
        </span>
      </div>

      {/* Email */}
      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 truncate mb-4">
        <svg
          width="11"
          height="11"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="flex-shrink-0"
        >
          <rect x="1" y="3" width="12" height="9" rx="1.5" />
          <path d="M1 5l6 4 6-4" strokeLinecap="round" />
        </svg>
        {member.email}
      </p>

      {/* ── Always-visible action buttons ── */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(member)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-all"
          style={{
            background: "#ffffff08",
            color: "#94a3b8",
            border: "1px solid #ffffff0d",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0891b215";
            e.currentTarget.style.color = "#67e8f9";
            e.currentTarget.style.borderColor = "#0891b230";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff08";
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "#ffffff0d";
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" strokeLinejoin="round" />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-all"
          style={{
            background: "#ffffff08",
            color: "#94a3b8",
            border: "1px solid #ffffff0d",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e1183615";
            e.currentTarget.style.color = "#fb7185";
            e.currentTarget.style.borderColor = "#e1183630";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff08";
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "#ffffff0d";
          }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path
              d="M2 3.5h10M5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M11.5 3.5l-.8 8.5H3.3l-.8-8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}

/* ── Modal ── */
function Modal({
  show,
  isEdit,
  form,
  setForm,
  onConfirm,
  onClose,
  onAvatarChange,
}) {
  if (!show) return null;

  const inputCls =
    "w-full bg-[#0b1019] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative bg-[#0f1623] border border-white/[0.08] rounded-3xl p-7 w-full max-w-md shadow-2xl"
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-lg font-semibold tracking-tight">
              {isEdit ? "Edit Member" : "Add Team Member"}
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              {isEdit
                ? "Update member details below"
                : "Fill in the details to add a new member"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/10 text-gray-400 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Avatar upload area */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg"
              style={{ boxShadow: "0 0 0 3px #0891b255" }}
            >
              {form.avatar ? (
                <img
                  src={form.avatar}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{form.name ? getInitials(form.name) : "?"}</span>
              )}
            </div>
            <label className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer transition-opacity">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => onAvatarChange(ev.target.result);
                  reader.readAsDataURL(file);
                }}
              />
              <span className="flex flex-col items-center gap-0.5">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 16s0-4 6-4 6 4 6 4" strokeLinecap="round" />
                  <circle cx="10" cy="8" r="3" />
                </svg>
                Photo
              </span>
            </label>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input
                className={inputCls}
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <input
              className={inputCls}
              placeholder="Role / Title"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className={inputCls}
            style={{ color: form.department ? "white" : "#4b5563" }}
          >
            {DEPARTMENTS.slice(1).map((d) => (
              <option key={d} value={d} className="bg-[#0b1019]">
                {d}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {["Active", "On Leave"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, status: s })}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all border"
                style={{
                  background:
                    form.status === s
                      ? s === "Active"
                        ? "#05966920"
                        : "#d9770620"
                      : "transparent",
                  color:
                    form.status === s
                      ? s === "Active"
                        ? "#34d399"
                        : "#fbbf24"
                      : "#6b7280",
                  borderColor:
                    form.status === s
                      ? s === "Active"
                        ? "#05966960"
                        : "#d9770660"
                      : "#ffffff10",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-gray-400 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0891b2, #6366f1)",
              color: "white",
              boxShadow: "0 4px 14px #0891b222",
            }}
          >
            {isEdit ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Team() {
  const [members, setMembers] = useState(initialTeamMembers);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    department: "Oncology Research",
    status: "Active",
    avatar: null,
  });

  const filtered = members.filter((m) => {
    const matchDept = filter === "All" || m.department === filter;
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleAddOrEdit = () => {
    if (!form.name || !form.email) return;
    if (isEdit) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === currentId
            ? {
                ...m,
                name: form.name,
                role: form.role,
                email: form.email,
                department: form.department,
                status: form.status,
                avatar: form.avatar ?? m.avatar,
              }
            : m,
        ),
      );
    } else {
      setMembers((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          role: form.role,
          email: form.email,
          department: form.department,
          status: form.status,
          avatar: form.avatar,
          joined: new Date().toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          projects: 0,
        },
      ]);
    }
    closeModal();
  };

  const handleEdit = (member) => {
    setIsEdit(true);
    setCurrentId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      department: member.department,
      status: member.status,
      avatar: member.avatar,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setCurrentId(null);
    setForm({
      name: "",
      role: "",
      email: "",
      department: "Oncology Research",
      status: "Active",
      avatar: null,
    });
  };

  const activeCount = members.filter((m) => m.status === "Active").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .member-card { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .stat-pill { animation: fadeSlide 0.4s ease both; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: #ffffff25; }
      `}</style>

      <div
        className="min-h-screen text-white"
        style={{ background: "#080c14", fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-cyan-500/70 mb-2 uppercase font-medium">
                Clinix Research Platform
              </p>
              <h1
                className="text-4xl font-bold tracking-tight text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Team
              </h1>
              {/* Stats */}
              <div className="flex items-center gap-5 mt-3">
                <div
                  className="stat-pill flex items-center gap-2"
                  style={{ animationDelay: "0.1s" }}
                >
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {members.length}
                  </span>
                  <span className="text-xs text-gray-500">Total</span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div
                  className="stat-pill flex items-center gap-2"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: "#34d399",
                      animation: "pulse-soft 2s infinite",
                    }}
                  />
                  <span className="text-sm text-gray-400">
                    {activeCount} Active
                  </span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div
                  className="stat-pill flex items-center gap-2"
                  style={{ animationDelay: "0.3s" }}
                >
                  <span className="text-sm text-gray-400">
                    {DEPARTMENTS.length - 1} Depts
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowModal(true);
                setIsEdit(false);
              }}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #0891b2, #6366f1)",
                boxShadow: "0 4px 14px #0891b222",
              }}
            >
              <span className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-base leading-none transition-transform group-hover:rotate-90 duration-300">
                +
              </span>
              Add Member
            </button>
          </div>

          {/* ── Filters + Search ── */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Department filters */}
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setFilter(dept)}
                  className="text-xs px-3.5 py-1.5 rounded-xl transition-all font-medium border"
                  style={
                    filter === dept
                      ? {
                          background:
                            "linear-gradient(135deg, #0891b220, #6366f120)",
                          color: "#67e8f9",
                          borderColor: "#0891b250",
                        }
                      : {
                          background: "transparent",
                          color: "#6b7280",
                          borderColor: "#ffffff0f",
                        }
                  }
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="7" cy="7" r="5" />
                <path d="M11 11l3 3" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
              />
            </div>
          </div>

          {/* ── Grid ── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-600">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="mb-4 opacity-40"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              <p className="text-sm">No members found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Modal ── */}
        <Modal
          show={showModal}
          isEdit={isEdit}
          form={form}
          setForm={setForm}
          onConfirm={handleAddOrEdit}
          onClose={closeModal}
          onAvatarChange={(url) => setForm((f) => ({ ...f, avatar: url }))}
        />
      </div>
    </>
  );
}
