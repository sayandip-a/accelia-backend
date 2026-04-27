import { useEffect, useState, useRef } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/jobs`;

/* ─── tiny animation helper ─── */
const cls = (...args) => args.filter(Boolean).join(" ");

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const STATUSES = ["Active", "Closed"];
const EMPTY_FORM = {
  title: "",
  department: "",
  location: "",
  type: "Full-time",
  description: "",
  requirements: "",
  responsibilities: "",
  experience: "",
  salary: "",
  status: "Active",
};

/* ─── badge colours ─── */
const typeBadge = {
  "Full-time": "badge-blue",
  "Part-time": "badge-violet",
  Contract: "badge-amber",
  Internship: "badge-teal",
};
const statusBadge = { Active: "badge-green", Closed: "badge-red" };

export default function Jobs() {
  const token = localStorage.getItem("token");

  /* ── state ── */
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // job id to confirm
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  /* ── helpers ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}?admin=true`);
      const d = await r.json();
      setJobs(d.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ── open panel for create or edit ── */
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPanelOpen(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };
  const openEdit = (job) => {
    setForm({
      title: job.title || "",
      department: job.dept || "",
      location: job.location || "",
      type: job.type || "Full-time",
      description: job.description || "",
      requirements: (job.requirements || []).join(", "),
      responsibilities: (job.responsibilities || []).join(", "),
      experience: job.experience || "",
      salary: job.salary || "",
      status: job.isActive ? "Active" : "Closed",
    });
    setEditId(job._id);
    setPanelOpen(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      100,
    );
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  /* ── submit (create or update) ── */
  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.department ||
      !form.location ||
      !form.description
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }
    const payload = {
      title: form.title,
      dept: form.department,
      location: form.location,
      type: form.type,
      description: form.description,
      requirements: form.requirements
        ? form.requirements.split(",").map((s) => s.trim())
        : [],
      responsibilities: form.responsibilities
        ? form.responsibilities.split(",").map((s) => s.trim())
        : [],
      experience: form.experience,
      salary: form.salary,
      isActive: form.status === "Active",
    };
    try {
      setSaving(true);
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || "Error", "error");
        return;
      }
      showToast(
        editId ? "Job updated successfully" : "Job posted successfully",
      );
      closePanel();
      fetchJobs();
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── delete ── */
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const r = await fetch(`${API_URL}/${deleteConfirm}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) {
        showToast("Job deleted");
        fetchJobs();
      } else showToast("Delete failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  /* ── filter ── */
  const visible = jobs.filter((j) => {
    const matchSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.dept?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" ? j.isActive : !j.isActive);
    const matchType = filterType === "All" || j.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.isActive).length,
    closed: jobs.filter((j) => !j.isActive).length,
    depts: new Set(jobs.map((j) => j.dept)).size,
  };

  /* ─────────── RENDER ─────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0c10;
          --surface: #111318;
          --surface2: #181c24;
          --border: #232733;
          --border-hover: #3a4155;
          --text: #e8ecf4;
          --muted: #7a8099;
          --accent: #4f7cff;
          --accent-glow: rgba(79,124,255,.18);
          --green: #22c55e;
          --red: #f43f5e;
          --amber: #f59e0b;
          --violet: #8b5cf6;
          --teal: #14b8a6;
          --radius: 14px;
          --radius-sm: 8px;
          --shadow: 0 4px 24px rgba(0,0,0,.4);
          font-family: 'DM Sans', sans-serif;
        }

        body { background: var(--bg); color: var(--text); }

        /* ── layout ── */
        .jobs-wrap { min-height: 100vh; padding: 24px 16px 60px; max-width: 1100px; margin: 0 auto; }
        @media(min-width:768px){ .jobs-wrap{ padding: 36px 32px 80px; } }

        /* ── header ── */
        .jobs-header { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:28px; }
        .jobs-title { font-family:'Syne',sans-serif; font-size:clamp(20px,4vw,28px); font-weight:800; letter-spacing:-.5px; }
        .jobs-title span { color:var(--accent); }

        /* ── stat cards ── */
        .stats-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:28px; }
        @media(min-width:600px){ .stats-grid{ grid-template-columns:repeat(4,1fr); } }
        .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:16px 18px; transition:border-color .2s,transform .2s; }
        .stat-card:hover { border-color:var(--border-hover); transform:translateY(-2px); }
        .stat-label { font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
        .stat-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; line-height:1; }
        .stat-sub { font-size:11px; color:var(--muted); margin-top:4px; }
        .col-green { color:var(--green); } .col-red { color:var(--red); } .col-accent { color:var(--accent); } .col-violet { color:var(--violet); }

        /* ── post job btn ── */
        .btn-post { display:flex; align-items:center; gap:8px; background:var(--accent); color:#fff; border:none; border-radius:var(--radius-sm); padding:10px 20px; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:background .2s,transform .15s,box-shadow .2s; box-shadow:0 0 0 0 var(--accent-glow); }
        .btn-post:hover { background:#3a68e8; transform:translateY(-1px); box-shadow:0 0 0 6px var(--accent-glow); }
        .btn-post:active { transform:translateY(0); }

        /* ── panel (slide-down) ── */
        .panel-wrap { overflow:hidden; transition:max-height .45s cubic-bezier(.4,0,.2,1), opacity .35s ease; max-height:0; opacity:0; }
        .panel-wrap.open { max-height:2000px; opacity:1; }
        .panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; margin-bottom:28px; }
        .panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
        .panel-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; display:flex; align-items:center; gap:8px; }
        .panel-badge { background:var(--accent); color:#fff; border-radius:999px; padding:2px 10px; font-size:11px; font-weight:700; letter-spacing:.04em; }
        .panel-badge.edit { background:var(--violet); }
        .btn-close { background:var(--surface2); border:1px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:6px 12px; font-size:13px; cursor:pointer; transition:color .2s,border-color .2s; }
        .btn-close:hover { color:var(--text); border-color:var(--border-hover); }

        /* ── form grid ── */
        .form-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:640px){ .form-grid{ grid-template-columns:1fr 1fr; } }
        .field { display:flex; flex-direction:column; gap:6px; }
        .field.span2 { grid-column:1/-1; }
        .field label { font-size:12px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); }
        .field label span { color:var(--red); }
        .finput { background:var(--surface2); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; padding:11px 14px; outline:none; transition:border-color .2s,box-shadow .2s; width:100%; resize:vertical; }
        .finput::placeholder { color:#444c65; }
        .finput:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        textarea.finput { min-height:90px; }

        /* ── form actions ── */
        .form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:20px; flex-wrap:wrap; }
        .btn-cancel { background:transparent; border:1.5px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:10px 22px; font-size:14px; font-weight:600; cursor:pointer; transition:border-color .2s,color .2s; }
        .btn-cancel:hover { border-color:var(--border-hover); color:var(--text); }
        .btn-save { background:var(--accent); border:none; color:#fff; border-radius:var(--radius-sm); padding:10px 26px; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:background .2s,transform .15s; display:flex; align-items:center; gap:8px; }
        .btn-save.editing { background:var(--violet); }
        .btn-save:hover { background:#3a68e8; transform:translateY(-1px); }
        .btn-save.editing:hover { background:#7c3aed; }
        .btn-save:disabled { opacity:.6; cursor:not-allowed; transform:none; }

        /* ── filters ── */
        .filters { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px; align-items:center; }
        .search-wrap { flex:1; min-width:180px; position:relative; }
        .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
        .search-input { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; padding:10px 14px 10px 38px; outline:none; width:100%; transition:border-color .2s,box-shadow .2s; }
        .search-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }
        .search-input::placeholder { color:#444c65; }
        .filter-select { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; padding:10px 14px; outline:none; cursor:pointer; transition:border-color .2s; }
        .filter-select:focus { border-color:var(--accent); }

        /* ── job list ── */
        .section-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:var(--muted); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
        .section-title span { color:var(--text); }
        .jobs-list { display:flex; flex-direction:column; gap:10px; }

        /* ── job card ── */
        .job-card { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius); padding:18px 20px; display:flex; flex-direction:column; gap:12px; transition:border-color .25s,transform .2s,box-shadow .25s; animation:fadeUp .35s ease both; }
        .job-card:hover { border-color:var(--border-hover); transform:translateY(-2px); box-shadow:var(--shadow); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .card-meta { flex:1; min-width:0; }
        .card-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .card-dept { font-size:13px; color:var(--muted); }
        .card-dept b { color:var(--text); font-weight:600; }
        .card-tags { display:flex; flex-wrap:wrap; gap:6px; }
        .card-actions { display:flex; gap:8px; flex-shrink:0; }
        .card-desc { font-size:13px; color:var(--muted); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

        /* ── badges ── */
        .badge { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:4px 11px; font-size:11px; font-weight:700; letter-spacing:.04em; }
        .badge-green { background:rgba(34,197,94,.12); color:var(--green); border:1px solid rgba(34,197,94,.25); }
        .badge-red   { background:rgba(244,63,94,.12); color:var(--red); border:1px solid rgba(244,63,94,.25); }
        .badge-blue  { background:rgba(79,124,255,.12); color:var(--accent); border:1px solid rgba(79,124,255,.25); }
        .badge-violet{ background:rgba(139,92,246,.12); color:var(--violet); border:1px solid rgba(139,92,246,.25); }
        .badge-amber { background:rgba(245,158,11,.12); color:var(--amber); border:1px solid rgba(245,158,11,.25); }
        .badge-teal  { background:rgba(20,184,166,.12); color:var(--teal); border:1px solid rgba(20,184,166,.25); }
        .badge-dot { width:6px; height:6px; border-radius:50%; background:currentColor; display:inline-block; }

        /* ── action buttons ── */
        .btn-edit { background:var(--surface2); border:1.5px solid var(--border); color:var(--text); border-radius:var(--radius-sm); padding:7px 16px; font-size:13px; font-weight:600; cursor:pointer; transition:border-color .2s,background .2s; display:flex; align-items:center; gap:6px; }
        .btn-edit:hover { border-color:var(--accent); background:rgba(79,124,255,.08); color:var(--accent); }
        .btn-delete { background:var(--surface2); border:1.5px solid var(--border); color:var(--muted); border-radius:var(--radius-sm); padding:7px 16px; font-size:13px; font-weight:600; cursor:pointer; transition:border-color .2s,background .2s,color .2s; display:flex; align-items:center; gap:6px; }
        .btn-delete:hover { border-color:var(--red); background:rgba(244,63,94,.08); color:var(--red); }

        /* ── empty ── */
        .empty { text-align:center; padding:60px 20px; color:var(--muted); }
        .empty-icon { font-size:40px; margin-bottom:12px; opacity:.5; }
        .empty p { font-size:14px; }

        /* ── loading skeleton ── */
        .skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:var(--radius); height:90px; }
        @keyframes shimmer { to{ background-position:-200% 0; } }

        /* ── delete modal ── */
        .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; animation:fadeIn .2s ease; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal { background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius); padding:28px; max-width:380px; width:100%; box-shadow:0 24px 60px rgba(0,0,0,.6); animation:scaleIn .2s cubic-bezier(.34,1.56,.64,1); }
        @keyframes scaleIn { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        .modal-icon { font-size:32px; margin-bottom:12px; }
        .modal h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; margin-bottom:8px; }
        .modal p { font-size:14px; color:var(--muted); margin-bottom:22px; line-height:1.6; }
        .modal-actions { display:flex; gap:10px; justify-content:flex-end; }
        .btn-confirm-del { background:var(--red); border:none; color:#fff; border-radius:var(--radius-sm); padding:10px 22px; font-family:'Syne',sans-serif; font-size:13px; font-weight:700; cursor:pointer; transition:opacity .2s; }
        .btn-confirm-del:hover { opacity:.85; }

        /* ── toast ── */
        .toast { position:fixed; bottom:28px; right:20px; z-index:200; background:var(--surface); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:13px 18px; font-size:14px; font-weight:500; display:flex; align-items:center; gap:10px; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:toastIn .35s cubic-bezier(.34,1.56,.64,1); max-width:320px; }
        @keyframes toastIn { from{opacity:0;transform:translateY(16px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        .toast.success { border-color:rgba(34,197,94,.4); }
        .toast.error { border-color:rgba(244,63,94,.4); }
        .toast-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .toast.success .toast-dot { background:var(--green); }
        .toast.error .toast-dot { background:var(--red); }

        /* ── divider ── */
        .divider { border:none; border-top:1px solid var(--border); margin:24px 0; }

        /* ── spinner ── */
        .spinner { width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0; }
        @keyframes spin { to{ transform:rotate(360deg); } }

        /* ── scrollbar ── */
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:var(--border); border-radius:999px; }
      `}</style>

      <div className="jobs-wrap">
        {/* ── HEADER ── */}
        <div className="jobs-header">
          <div>
            <h1 className="jobs-title">
              Jobs <span>Management</span>
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
              Manage your open positions and hiring pipeline
            </p>
          </div>
          <button
            className="btn-post"
            onClick={panelOpen && !editId ? closePanel : openCreate}
          >
            {panelOpen && !editId ? (
              <>
                <span>✕</span> Cancel
              </>
            ) : (
              <>
                <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Post a
                Job
              </>
            )}
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Jobs</div>
            <div className="stat-val col-accent">{stats.total}</div>
            <div className="stat-sub">All postings</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active</div>
            <div className="stat-val col-green">{stats.active}</div>
            <div className="stat-sub">Hiring now</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Closed</div>
            <div className="stat-val col-red">{stats.closed}</div>
            <div className="stat-sub">Not hiring</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Departments</div>
            <div className="stat-val col-violet">{stats.depts}</div>
            <div className="stat-sub">Across teams</div>
          </div>
        </div>

        {/* ── PANEL (create / edit) ── */}
        <div className={cls("panel-wrap", panelOpen && "open")} ref={formRef}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                {editId ? "✏️ Edit Job Posting" : "📋 New Job Posting"}
                <span className={cls("panel-badge", editId && "edit")}>
                  {editId ? "Editing" : "New"}
                </span>
              </div>
              <button className="btn-close" onClick={closePanel}>
                ✕ Close
              </button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>
                  Job Title <span>*</span>
                </label>
                <input
                  className="finput"
                  name="title"
                  placeholder="e.g. Senior ML Engineer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="field">
                <label>
                  Department <span>*</span>
                </label>
                <input
                  className="finput"
                  name="department"
                  placeholder="e.g. Engineering"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>
                  Location <span>*</span>
                </label>
                <input
                  className="finput"
                  name="location"
                  placeholder="e.g. Kolkata / Remote"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Job Type</label>
                <select
                  className="finput"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Experience</label>
                <input
                  className="finput"
                  placeholder="e.g. 2+ years"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Salary (optional)</label>
                <input
                  className="finput"
                  placeholder="e.g. ₹12–18 LPA"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  className="finput"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="field span2">
                <label>
                  Job Description <span>*</span>
                </label>
                <textarea
                  className="finput"
                  placeholder="Describe the role, team, and impact…"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="field span2">
                <label>
                  Requirements{" "}
                  <span
                    style={{
                      color: "var(--muted)",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (comma separated)
                  </span>
                </label>
                <textarea
                  className="finput"
                  placeholder="e.g. Python, React, 3+ years experience"
                  value={form.requirements}
                  onChange={(e) =>
                    setForm({ ...form, requirements: e.target.value })
                  }
                  style={{ minHeight: 70 }}
                />
              </div>
              <div className="field span2">
                <label>
                  Responsibilities{" "}
                  <span
                    style={{
                      color: "var(--muted)",
                      fontWeight: 400,
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (comma separated)
                  </span>
                </label>
                <textarea
                  className="finput"
                  placeholder="e.g. Lead sprints, mentor junior devs"
                  value={form.responsibilities}
                  onChange={(e) =>
                    setForm({ ...form, responsibilities: e.target.value })
                  }
                  style={{ minHeight: 70 }}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={closePanel}>
                Cancel
              </button>
              <button
                className={cls("btn-save", editId && "editing")}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <span className="spinner" /> : null}
                {editId ? "Save Changes" : "Post Job"}
              </button>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* ── FILTERS ── */}
        <div className="filters">
          <div className="search-wrap">
            <svg
              className="search-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="search-input"
              placeholder="Search jobs, departments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All status</option>
            <option>Active</option>
            <option>Closed</option>
          </select>
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All types</option>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ── JOB LIST ── */}
        <div className="section-title">
          Job Postings —{" "}
          <span>
            {visible.length} of {jobs.length}
          </span>
        </div>

        <div className="jobs-list">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                className="skeleton"
                key={i}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))
          ) : visible.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <p>No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            visible.map((job, i) => (
              <div
                className="job-card"
                key={job._id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="card-top">
                  <div className="card-meta">
                    <div className="card-title">{job.title}</div>
                    <div className="card-dept">
                      <b>{job.dept}</b> · {job.location}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="btn-edit" onClick={() => openEdit(job)}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => setDeleteConfirm(job._id)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
                <div className="card-tags">
                  <span
                    className={cls(
                      "badge",
                      statusBadge[job.isActive ? "Active" : "Closed"],
                    )}
                  >
                    <span className="badge-dot" />
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                  <span
                    className={cls(
                      "badge",
                      typeBadge[job.type] || "badge-blue",
                    )}
                  >
                    {job.type}
                  </span>
                  {job.experience && (
                    <span className="badge badge-amber">
                      🕐 {job.experience}
                    </span>
                  )}
                  {job.salary && (
                    <span className="badge badge-teal">₹ {job.salary}</span>
                  )}
                </div>
                {job.description && (
                  <div className="card-desc">{job.description}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <h3>Delete Job Posting?</h3>
            <p>
              This action cannot be undone. The job posting will be permanently
              removed from your portal.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button className="btn-confirm-del" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={cls("toast", toast.type)}>
          <div className="toast-dot" />
          {toast.msg}
        </div>
      )}
    </>
  );
}
