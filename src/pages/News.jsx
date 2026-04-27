import { useState, useEffect, useRef } from "react";

// ── Constants ────────────────────────────────────────────────────────────
const NEWS_CATS = [
  "Research",
  "Company News",
  "Education",
  "Partnership",
  "Regulatory",
  "Clinical Trial",
];
const EVENT_TYPES = [
  "Conference",
  "Webinar",
  "Workshop",
  "Symposium",
  "Summit",
  "Training",
];

const CAT_COLOR = {
  Research: "#8b5cf6",
  "Company News": "#4f7cff",
  Education: "#22c55e",
  Partnership: "#f59e0b",
  Regulatory: "#f43f5e",
  "Clinical Trial": "#14b8a6",
};

const EMPTY_NEWS = {
  title: "",
  category: "Research",
  status: "Draft",
  author: "",
  content: "",
  tag: "",
  body: "",
  date: new Date().toISOString().split("T")[0],
};

const EMPTY_EVENT = {
  title: "",
  type: "Conference",
  location: "",
  date: new Date().toISOString().split("T")[0],
  time: "",
  description: "",
  status: "Upcoming",
  imagePreview: null,
};

// ── Safe string extractor ────────────────────────────────────────────────
// Handles: plain string | { _id, name } | { _id, title } | null | undefined
function str(val) {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") {
    // populated MongoDB ref: { _id, name } or { _id, title }
    return val.name || val.title || val.label || val._id?.toString() || "";
  }
  return String(val);
}

// ── Helpers ──────────────────────────────────────────────────────────────
function getAPI(path) {
  try {
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}${path}`;
  } catch {
    return path;
  }
}

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ── Small components ──────────────────────────────────────────────────────
function Badge({ label, color = "#4f7cff" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {str(label)}
    </span>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        border: "2px solid rgba(255,255,255,.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "nspin .7s linear infinite",
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
}

function Toast({ data }) {
  if (!data) return null;
  const c = data.type === "error" ? "#f43f5e" : "#22c55e";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 999,
        background: "#111318",
        border: `1.5px solid ${c}40`,
        borderRadius: 10,
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#e8ecf4",
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 8px 32px rgba(0,0,0,.6)",
        animation: "nfadeUp .3s ease",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: c,
          flexShrink: 0,
        }}
      />
      {str(data.msg)}
    </div>
  );
}

function ConfirmModal({ item, onConfirm, onCancel }) {
  if (!item) return null;
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: "nfadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111318",
          border: "1.5px solid #2a2f3d",
          borderRadius: 14,
          padding: 28,
          maxWidth: 360,
          width: "100%",
          animation: "nscaleIn .2s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <div style={{ fontSize: 30, marginBottom: 12 }}>🗑️</div>
        <h3
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 17,
            fontWeight: 700,
            color: "#e8ecf4",
            marginBottom: 8,
          }}
        >
          Delete?
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "#7a8099",
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "#e8ecf4" }}>{str(item.title)}</strong> will
          be permanently removed.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={btnStyle()}>
            Cancel
          </button>
          <button onClick={onConfirm} style={btnStyle("#f43f5e", "#fff")}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUpload({ preview, onChange }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  function handle(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files[0]);
      }}
      style={{
        border: `2px dashed ${drag ? "#4f7cff" : preview ? "#22c55e" : "#3a4155"}`,
        borderRadius: 12,
        cursor: "pointer",
        overflow: "hidden",
        background: drag ? "rgba(79,124,255,.05)" : "rgba(255,255,255,.02)",
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color .2s",
        position: "relative",
      }}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt=""
            style={{
              width: "100%",
              height: 170,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#22c55e",
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            ✓ Ready
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,.55)",
              padding: "8px 12px",
              fontSize: 12,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Click to change
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>
            {drag ? "📂" : "🖼️"}
          </div>
          <p style={{ color: "#7a8099", fontSize: 13, margin: 0 }}>
            Drop image or{" "}
            <span style={{ color: "#4f7cff", fontWeight: 600 }}>browse</span>
          </p>
          <p style={{ color: "#444c65", fontSize: 11, marginTop: 4 }}>
            PNG, JPG, WebP
          </p>
        </div>
      )}
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────
function btnStyle(bg = "#232733", color = "#e8ecf4", extra = {}) {
  return {
    padding: "9px 18px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transition: "opacity .15s",
    ...extra,
  };
}

function inputStyle(extra = {}) {
  return {
    background: "#181c24",
    border: "1.5px solid #2a2f3d",
    borderRadius: 8,
    color: "#e8ecf4",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 14,
    padding: "10px 13px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color .2s, box-shadow .2s",
    ...extra,
  };
}

function FieldLabel({ label, required }) {
  return (
    <label
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".07em",
        textTransform: "uppercase",
        color: "#7a8099",
        display: "block",
        marginBottom: 6,
      }}
    >
      {label}
      {required && <span style={{ color: "#f43f5e", marginLeft: 3 }}>*</span>}
    </label>
  );
}

// ════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════════════════
export default function News() {
  const token = localStorage.getItem("token") || "";
  const [tab, setTab] = useState("news");

  // News state
  const [posts, setPosts] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsPanel, setNewsPanel] = useState(false);
  const [editNewsId, setEditNewsId] = useState(null);
  const [newsForm, setNewsForm] = useState({ ...EMPTY_NEWS });
  const [newsSaving, setNewsSaving] = useState(false);
  const [deleteNewsItem, setDeleteNewsItem] = useState(null);
  const [newsFilter, setNewsFilter] = useState("All");
  const [newsSearch, setNewsSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Events state
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventPanel, setEventPanel] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [eventForm, setEventForm] = useState({ ...EMPTY_EVENT });
  const [eventSaving, setEventSaving] = useState(false);
  const [deleteEventItem, setDeleteEventItem] = useState(null);
  const [eventFilter, setEventFilter] = useState("All");
  const [eventSearch, setEventSearch] = useState("");

  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg: str(msg), type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Fetch ──────────────────────────────────────────────────────────────
  async function fetchNews() {
    setNewsLoading(true);
    try {
      const r = await fetch(getAPI("/api/news"));
      const d = await r.json();
      setPosts(Array.isArray(d.news) ? d.news : []);
    } catch (e) {
      console.error("News fetch error:", e);
      setPosts([]);
    } finally {
      setNewsLoading(false);
    }
  }

  async function fetchEvents() {
    setEventsLoading(true);
    try {
      const r = await fetch(getAPI("/api/events"));
      const d = await r.json();
      setEvents(Array.isArray(d.events) ? d.events : []);
    } catch (e) {
      console.error("Events fetch error:", e);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  // ── News handlers ──────────────────────────────────────────────────────
  function openEditNews(post) {
    setNewsForm({
      title: str(post.title),
      category: str(post.category) || "Research",
      status: post.isActive ? "Published" : "Draft",
      author: str(post.author),
      content: str(post.description),
      tag: str(post.tag),
      body: str(post.body) || str(post.description),
      date: post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setEditNewsId(post._id);
    setNewsPanel(true);
  }

  function closeNewsPanel() {
    setNewsPanel(false);
    setEditNewsId(null);
    setNewsForm({ ...EMPTY_NEWS });
  }

  async function saveNews() {
    if (!newsForm.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    setNewsSaving(true);
    try {
      const url = editNewsId
        ? getAPI(`/api/news/${editNewsId}`)
        : getAPI("/api/news");
      const r = await fetch(url, {
        method: editNewsId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newsForm.title,
          category: newsForm.category,
          description: newsForm.content || newsForm.body,
          body: newsForm.body || newsForm.content,
          author: newsForm.author,
          tag: newsForm.tag,
          date: newsForm.date,
          isActive: newsForm.status === "Published",
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || "Save failed", "error");
        return;
      }
      showToast(editNewsId ? "Post updated!" : "Post published!");
      closeNewsPanel();
      fetchNews();
    } catch {
      showToast("Network error", "error");
    } finally {
      setNewsSaving(false);
    }
  }

  async function confirmDeleteNews() {
    if (!deleteNewsItem) return;
    try {
      await fetch(getAPI(`/api/news/${deleteNewsItem._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Post deleted");
      fetchNews();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteNewsItem(null);
    }
  }

  // ── Events handlers ────────────────────────────────────────────────────
  function openEditEvent(ev) {
    setEventForm({
      title: str(ev.title),
      type: str(ev.type) || "Conference",
      location: str(ev.location),
      date: ev.date
        ? new Date(ev.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      time: str(ev.time),
      description: str(ev.description),
      status: ev.isActive ? "Upcoming" : "Past",
      imagePreview: str(ev.imageUrl) || null,
    });
    setEditEventId(ev._id);
    setEventPanel(true);
  }

  function closeEventPanel() {
    setEventPanel(false);
    setEditEventId(null);
    setEventForm({ ...EMPTY_EVENT });
  }

  async function saveEvent() {
    if (!eventForm.title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    setEventSaving(true);
    try {
      const url = editEventId
        ? getAPI(`/api/events/${editEventId}`)
        : getAPI("/api/events");
      const r = await fetch(url, {
        method: editEventId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: eventForm.title,
          type: eventForm.type,
          location: eventForm.location,
          date: eventForm.date,
          time: eventForm.time,
          description: eventForm.description,
          isActive: eventForm.status === "Upcoming",
          imageUrl: eventForm.imagePreview || "",
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        showToast(d.message || "Save failed", "error");
        return;
      }
      showToast(editEventId ? "Event updated!" : "Event created!");
      closeEventPanel();
      fetchEvents();
    } catch {
      showToast("Network error", "error");
    } finally {
      setEventSaving(false);
    }
  }

  async function confirmDeleteEvent() {
    if (!deleteEventItem) return;
    try {
      await fetch(getAPI(`/api/events/${deleteEventItem._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Event deleted");
      fetchEvents();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleteEventItem(null);
    }
  }

  // ── Filtered data ──────────────────────────────────────────────────────
  const visibleNews = posts.filter((p) => {
    const q = newsSearch.toLowerCase();
    const title = str(p.title).toLowerCase();
    const author = str(p.author).toLowerCase();
    const matchQ = !q || title.includes(q) || author.includes(q);
    const matchF =
      newsFilter === "All" ||
      (newsFilter === "Published" && p.isActive) ||
      (newsFilter === "Draft" && !p.isActive);
    return matchQ && matchF;
  });

  const visibleEvents = events.filter((e) => {
    const q = eventSearch.toLowerCase();
    const title = str(e.title).toLowerCase();
    const location = str(e.location).toLowerCase();
    const matchQ = !q || title.includes(q) || location.includes(q);
    const matchF =
      eventFilter === "All" ||
      (eventFilter === "Upcoming" && e.isActive) ||
      (eventFilter === "Past" && !e.isActive);
    return matchQ && matchF;
  });

  const nStats = {
    total: posts.length,
    pub: posts.filter((p) => p.isActive).length,
    draft: posts.filter((p) => !p.isActive).length,
    cats: new Set(posts.map((p) => str(p.category))).size,
  };

  const eStats = {
    total: events.length,
    upcoming: events.filter((e) => e.isActive).length,
    past: events.filter((e) => !e.isActive).length,
  };

  // ── Inline CSS ─────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
    @keyframes nfadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes nfadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes nscaleIn  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
    @keyframes nspin     { to{transform:rotate(360deg)} }
    .ncard:hover { border-color:#3a4155!important; transform:translateY(-2px)!important; box-shadow:0 6px 24px rgba(0,0,0,.4)!important; }
    .nbtn:hover:not(:disabled) { opacity:.82!important; }
    .nbtn:disabled { opacity:.55!important; cursor:not-allowed!important; }
    .ndelbtn:hover  { border-color:#f43f5e!important; color:#f43f5e!important; }
    .neditbtn:hover { border-color:#4f7cff!important; color:#4f7cff!important; }
    input::placeholder, textarea::placeholder { color:#444c65; }
    input:focus, textarea:focus, select:focus {
      border-color:#4f7cff!important;
      box-shadow:0 0 0 3px rgba(79,124,255,.14)!important;
      outline:none;
    }
    select option { background:#181c24; color:#e8ecf4; }
    input[type=date]::-webkit-calendar-picker-indicator { filter:invert(.45); }
    input[type=time]::-webkit-calendar-picker-indicator { filter:invert(.45); }
    @media(max-width:580px) {
      .twocol   { grid-template-columns:1fr!important; }
      .statgrid { grid-template-columns:1fr 1fr!important; }
    }
  `;

  const pageStyle = {
    minHeight: "100vh",
    padding: "28px 20px 80px",
    maxWidth: 1100,
    margin: "0 auto",
    fontFamily: "'DM Sans',sans-serif",
    color: "#e8ecf4",
  };

  const cardStyle = {
    background: "#111318",
    border: "1.5px solid #232733",
    borderRadius: 14,
    overflow: "hidden",
    transition: "border-color .25s, transform .2s, box-shadow .25s",
    animation: "nfadeUp .35s ease both",
  };

  const panelStyle = {
    background: "#111318",
    border: "1px solid #2a2f3d",
    borderRadius: 14,
    padding: 24,
    marginBottom: 28,
    animation: "nfadeUp .25s ease both",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
    gap: 14,
  };

  const filterTabStyle = (active) => ({
    padding: "6px 16px",
    borderRadius: 999,
    border: `1.5px solid ${active ? "#4f7cff" : "#232733"}`,
    background: active ? "rgba(79,124,255,.1)" : "transparent",
    color: active ? "#4f7cff" : "#7a8099",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    transition: "all .2s",
  });

  const statCardStyle = {
    background: "#111318",
    border: "1px solid #232733",
    borderRadius: 14,
    padding: "17px 20px",
    transition: "transform .2s, border-color .2s",
  };

  return (
    <>
      <style>{css}</style>
      <div style={pageStyle}>
        {/* ── Page header ── */}
        <div
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
            <h1
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "clamp(21px,4vw,28px)",
                fontWeight: 800,
                letterSpacing: "-.5px",
                color: "#e8ecf4",
              }}
            >
              News &amp; <span style={{ color: "#4f7cff" }}>Events</span>
            </h1>
            <p style={{ fontSize: 13, color: "#7a8099", marginTop: 4 }}>
              Manage publications, announcements and upcoming events
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["news", "events"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: `1.5px solid ${tab === t ? "#4f7cff" : "#232733"}`,
                  background:
                    tab === t ? "rgba(79,124,255,.12)" : "transparent",
                  color: tab === t ? "#4f7cff" : "#7a8099",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "all .2s",
                }}
              >
                {t === "news" ? "📰 News" : "📅 Events"}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ NEWS TAB ══════════ */}
        {tab === "news" && (
          <div style={{ animation: "nfadeIn .25s ease" }}>
            {/* Stats */}
            <div
              className="statgrid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Total Posts",
                  val: nStats.total,
                  color: "#4f7cff",
                  sub: "All articles",
                },
                {
                  label: "Published",
                  val: nStats.pub,
                  color: "#22c55e",
                  sub: "Live now",
                },
                {
                  label: "Drafts",
                  val: nStats.draft,
                  color: "#f59e0b",
                  sub: "Unpublished",
                },
                {
                  label: "Categories",
                  val: nStats.cats,
                  color: "#8b5cf6",
                  sub: "Topic areas",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="ncard"
                  style={statCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "#3a4155";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.borderColor = "#232733";
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#7a8099",
                      marginBottom: 8,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 28,
                      fontWeight: 800,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a8099", marginTop: 6 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 14,
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7a8099",
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  style={inputStyle({ paddingLeft: 36 })}
                  placeholder="Search posts…"
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                />
              </div>
              <button
                className="nbtn"
                onClick={() => {
                  if (newsPanel && !editNewsId) closeNewsPanel();
                  else {
                    setEditNewsId(null);
                    setNewsForm({ ...EMPTY_NEWS });
                    setNewsPanel(true);
                  }
                }}
                style={btnStyle("#4f7cff", "#fff")}
              >
                {newsPanel && !editNewsId ? "✕ Close" : "+ New Post"}
              </button>
            </div>

            {/* Filter tabs */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {[
                { k: "All", l: "All", c: posts.length },
                { k: "Published", l: "Published", c: nStats.pub },
                { k: "Draft", l: "Drafts", c: nStats.draft },
              ].map((f) => (
                <button
                  key={f.k}
                  style={filterTabStyle(newsFilter === f.k)}
                  onClick={() => setNewsFilter(f.k)}
                >
                  {f.l}
                  <span
                    style={{
                      background: "#232733",
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 10,
                      marginLeft: 5,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* News form */}
            {newsPanel && (
              <div style={panelStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#e8ecf4",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {editNewsId ? "✏️ Edit Post" : "📝 New Post"}
                    <Badge
                      label={editNewsId ? "Editing" : "New"}
                      color={editNewsId ? "#8b5cf6" : "#4f7cff"}
                    />
                  </h2>
                  <button
                    onClick={closeNewsPanel}
                    style={{ ...btnStyle(), padding: "7px 14px", fontSize: 12 }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div
                  className="twocol"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Title" required />
                    <input
                      style={inputStyle()}
                      placeholder="Enter post title…"
                      value={newsForm.title}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Category" />
                    <select
                      style={inputStyle()}
                      value={newsForm.category}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {NEWS_CATS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel label="Author" />
                    <input
                      style={inputStyle()}
                      placeholder="Author name"
                      value={newsForm.author}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, author: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Tag" />
                    <input
                      style={inputStyle()}
                      placeholder="e.g. oncology, AI"
                      value={newsForm.tag}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, tag: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Date" />
                    <input
                      style={inputStyle()}
                      type="date"
                      value={newsForm.date}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Status" />
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Draft", "Published"].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setNewsForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            padding: "7px 18px",
                            borderRadius: 999,
                            border: "1.5px solid",
                            borderColor:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#22c55e"
                                  : "#f59e0b"
                                : "#232733",
                            background:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "rgba(34,197,94,.1)"
                                  : "rgba(245,158,11,.1)"
                                : "transparent",
                            color:
                              newsForm.status === s
                                ? s === "Published"
                                  ? "#22c55e"
                                  : "#f59e0b"
                                : "#7a8099",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                            transition: "all .2s",
                          }}
                        >
                          {s === "Published" ? "🟢" : "🟡"} {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Short Description" />
                    <textarea
                      style={inputStyle({ minHeight: 80, resize: "vertical" })}
                      placeholder="Brief summary…"
                      value={newsForm.content}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, content: e.target.value }))
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Full Body" required />
                    <textarea
                      style={inputStyle({ minHeight: 150, resize: "vertical" })}
                      placeholder="Write the full article…"
                      value={newsForm.body}
                      onChange={(e) =>
                        setNewsForm((f) => ({ ...f, body: e.target.value }))
                      }
                    />
                    <div
                      style={{
                        fontSize: 11,
                        color: "#7a8099",
                        textAlign: "right",
                        marginTop: 4,
                      }}
                    >
                      {newsForm.body.length} chars
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={closeNewsPanel} style={btnStyle()}>
                    Cancel
                  </button>
                  <button
                    className="nbtn"
                    onClick={saveNews}
                    disabled={newsSaving}
                    style={btnStyle(
                      editNewsId ? "#8b5cf6" : "#4f7cff",
                      "#fff",
                      { minWidth: 130 },
                    )}
                  >
                    {newsSaving && <Spinner />}
                    {newsSaving
                      ? "Saving…"
                      : editNewsId
                        ? "Save Changes"
                        : "Publish Post"}
                  </button>
                </div>
              </div>
            )}

            {/* Posts count */}
            <p style={{ fontSize: 13, color: "#7a8099", marginBottom: 14 }}>
              Showing{" "}
              <strong style={{ color: "#e8ecf4" }}>{visibleNews.length}</strong>{" "}
              of {posts.length} posts
            </p>

            {/* Posts grid */}
            {newsLoading ? (
              <div style={gridStyle}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 160,
                      borderRadius: 14,
                      background: "#111318",
                      border: "1px solid #232733",
                      animation: "nfadeUp .3s ease",
                    }}
                  />
                ))}
              </div>
            ) : visibleNews.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "56px 20px",
                  color: "#7a8099",
                }}
              >
                <div style={{ fontSize: 38, marginBottom: 12, opacity: 0.5 }}>
                  📰
                </div>
                <p>No posts found. Create one above!</p>
              </div>
            ) : (
              <div style={gridStyle}>
                {visibleNews.map((post, i) => {
                  const isExpanded = expandedId === post._id;
                  const description = str(post.description);
                  const isLong = description.length > 160;
                  const category = str(post.category);
                  const author = str(post.author);
                  const tag = str(post.tag);

                  return (
                    <div
                      key={post._id}
                      className="ncard"
                      style={{
                        ...cardStyle,
                        padding: 18,
                        display: "flex",
                        flexDirection: "column",
                        gap: 11,
                        animationDelay: `${i * 35}ms`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <Badge
                            label={category || "News"}
                            color={CAT_COLOR[category] || "#4f7cff"}
                          />
                          <Badge
                            label={post.isActive ? "Published" : "Draft"}
                            color={post.isActive ? "#22c55e" : "#f59e0b"}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            className="neditbtn"
                            onClick={() => openEditNews(post)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1.5px solid #232733",
                              background: "transparent",
                              color: "#7a8099",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'DM Sans',sans-serif",
                              transition: "all .2s",
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="ndelbtn"
                            onClick={() => setDeleteNewsItem(post)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1.5px solid #232733",
                              background: "transparent",
                              color: "#7a8099",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              fontFamily: "'DM Sans',sans-serif",
                              transition: "all .2s",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <h3
                        style={{
                          fontFamily: "'Syne',sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#e8ecf4",
                          lineHeight: 1.4,
                          margin: 0,
                        }}
                      >
                        {str(post.title)}
                      </h3>

                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {author && (
                          <span style={{ fontSize: 12, color: "#7a8099" }}>
                            👤 {author}
                          </span>
                        )}
                        {tag && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#4f7cff",
                              background: "rgba(79,124,255,.08)",
                              border: "1px solid rgba(79,124,255,.2)",
                              borderRadius: 999,
                              padding: "2px 8px",
                              fontWeight: 600,
                            }}
                          >
                            # {tag}
                          </span>
                        )}
                        {post.date && (
                          <span style={{ fontSize: 11, color: "#7a8099" }}>
                            {fmtDate(post.date)}
                          </span>
                        )}
                      </div>

                      {description && (
                        <>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#7a8099",
                              lineHeight: 1.6,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? 100 : 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {description}
                          </p>
                          {isLong && (
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : post._id)
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: "#4f7cff",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: "pointer",
                                padding: 0,
                                fontFamily: "'DM Sans',sans-serif",
                                textAlign: "left",
                              }}
                            >
                              {isExpanded ? "Show less ▲" : "Read more ▼"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ EVENTS TAB ══════════ */}
        {tab === "events" && (
          <div style={{ animation: "nfadeIn .25s ease" }}>
            {/* Stats */}
            <div
              className="statgrid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {[
                {
                  label: "Total Events",
                  val: eStats.total,
                  color: "#4f7cff",
                  sub: "All events",
                },
                {
                  label: "Upcoming",
                  val: eStats.upcoming,
                  color: "#22c55e",
                  sub: "Scheduled",
                },
                {
                  label: "Past",
                  val: eStats.past,
                  color: "#7a8099",
                  sub: "Completed",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="ncard"
                  style={statCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "#3a4155";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.borderColor = "#232733";
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#7a8099",
                      marginBottom: 8,
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 28,
                      fontWeight: 800,
                      color: s.color,
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: 11, color: "#7a8099", marginTop: 6 }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 14,
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#7a8099",
                    pointerEvents: "none",
                  }}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  style={inputStyle({ paddingLeft: 36 })}
                  placeholder="Search events…"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
              </div>
              <button
                className="nbtn"
                onClick={() => {
                  if (eventPanel && !editEventId) closeEventPanel();
                  else {
                    setEditEventId(null);
                    setEventForm({ ...EMPTY_EVENT });
                    setEventPanel(true);
                  }
                }}
                style={btnStyle("#22c55e", "#fff")}
              >
                {eventPanel && !editEventId ? "✕ Close" : "+ New Event"}
              </button>
            </div>

            {/* Filter tabs */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 18,
                flexWrap: "wrap",
              }}
            >
              {[
                { k: "All", l: "All", c: events.length },
                { k: "Upcoming", l: "Upcoming", c: eStats.upcoming },
                { k: "Past", l: "Past", c: eStats.past },
              ].map((f) => (
                <button
                  key={f.k}
                  style={filterTabStyle(eventFilter === f.k)}
                  onClick={() => setEventFilter(f.k)}
                >
                  {f.l}
                  <span
                    style={{
                      background: "#232733",
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 10,
                      marginLeft: 5,
                    }}
                  >
                    {f.c}
                  </span>
                </button>
              ))}
            </div>

            {/* Event form */}
            {eventPanel && (
              <div style={panelStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    flexWrap: "wrap",
                    gap: 10,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#e8ecf4",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {editEventId ? "✏️ Edit Event" : "📅 New Event"}
                    <Badge
                      label={editEventId ? "Editing" : "New"}
                      color={editEventId ? "#8b5cf6" : "#22c55e"}
                    />
                  </h2>
                  <button
                    onClick={closeEventPanel}
                    style={{ ...btnStyle(), padding: "7px 14px", fontSize: 12 }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div
                  className="twocol"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Event Title" required />
                    <input
                      style={inputStyle()}
                      placeholder="e.g. International Oncology Summit 2025"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Event Type" />
                    <select
                      style={inputStyle()}
                      value={eventForm.type}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, type: e.target.value }))
                      }
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel label="Location" />
                    <input
                      style={inputStyle()}
                      placeholder="City, Venue or Online"
                      value={eventForm.location}
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Date" required />
                    <input
                      style={inputStyle()}
                      type="date"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>

                  <div>
                    <FieldLabel label="Time" />
                    <input
                      style={inputStyle()}
                      type="time"
                      value={eventForm.time}
                      onChange={(e) =>
                        setEventForm((f) => ({ ...f, time: e.target.value }))
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Status" />
                    <div style={{ display: "flex", gap: 8 }}>
                      {["Upcoming", "Past"].map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setEventForm((f) => ({ ...f, status: s }))
                          }
                          style={{
                            padding: "7px 18px",
                            borderRadius: 999,
                            border: "1.5px solid",
                            borderColor:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#22c55e"
                                  : "#7a8099"
                                : "#232733",
                            background:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "rgba(34,197,94,.1)"
                                  : "rgba(122,128,153,.1)"
                                : "transparent",
                            color:
                              eventForm.status === s
                                ? s === "Upcoming"
                                  ? "#22c55e"
                                  : "#7a8099"
                                : "#7a8099",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'DM Sans',sans-serif",
                            transition: "all .2s",
                          }}
                        >
                          {s === "Upcoming" ? "🟢" : "⚫"} {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Description" />
                    <textarea
                      style={inputStyle({ minHeight: 90, resize: "vertical" })}
                      placeholder="Describe the event…"
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div style={{ gridColumn: "1/-1" }}>
                    <FieldLabel label="Event Banner Image" />
                    <ImageUpload
                      preview={eventForm.imagePreview}
                      onChange={(preview) =>
                        setEventForm((f) => ({ ...f, imagePreview: preview }))
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={closeEventPanel} style={btnStyle()}>
                    Cancel
                  </button>
                  <button
                    className="nbtn"
                    onClick={saveEvent}
                    disabled={eventSaving}
                    style={btnStyle(
                      editEventId ? "#8b5cf6" : "#22c55e",
                      "#fff",
                      { minWidth: 130 },
                    )}
                  >
                    {eventSaving && <Spinner />}
                    {eventSaving
                      ? "Saving…"
                      : editEventId
                        ? "Save Changes"
                        : "Create Event"}
                  </button>
                </div>
              </div>
            )}

            {/* Events count */}
            <p style={{ fontSize: 13, color: "#7a8099", marginBottom: 14 }}>
              Showing{" "}
              <strong style={{ color: "#e8ecf4" }}>
                {visibleEvents.length}
              </strong>{" "}
              of {events.length} events
            </p>

            {/* Events grid */}
            {eventsLoading ? (
              <div style={gridStyle}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 200,
                      borderRadius: 14,
                      background: "#111318",
                      border: "1px solid #232733",
                      animation: "nfadeUp .3s ease",
                    }}
                  />
                ))}
              </div>
            ) : visibleEvents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "56px 20px",
                  color: "#7a8099",
                }}
              >
                <div style={{ fontSize: 38, marginBottom: 12, opacity: 0.5 }}>
                  📅
                </div>
                <p>No events found. Create one above!</p>
              </div>
            ) : (
              <div style={gridStyle}>
                {visibleEvents.map((ev, i) => {
                  const evTitle = str(ev.title);
                  const evType = str(ev.type);
                  const evLocation = str(ev.location);
                  const evDescription = str(ev.description);
                  const evImageUrl = str(ev.imageUrl);

                  return (
                    <div
                      key={ev._id}
                      className="ncard"
                      style={{ ...cardStyle, animationDelay: `${i * 35}ms` }}
                    >
                      {evImageUrl && (
                        <div
                          style={{
                            height: 155,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            src={evImageUrl}
                            alt={evTitle}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              transition: "transform .35s",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.transform = "scale(1.06)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.transform = "scale(1)")
                            }
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              display: "flex",
                              gap: 6,
                            }}
                          >
                            <Badge label={evType || "Event"} color="#4f7cff" />
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          padding: 16,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {!evImageUrl && (
                              <Badge
                                label={evType || "Event"}
                                color="#4f7cff"
                              />
                            )}
                            <Badge
                              label={ev.isActive ? "Upcoming" : "Past"}
                              color={ev.isActive ? "#22c55e" : "#7a8099"}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 5 }}>
                            <button
                              className="neditbtn"
                              onClick={() => openEditEvent(ev)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 6,
                                border: "1.5px solid #232733",
                                background: "transparent",
                                color: "#7a8099",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                                transition: "all .2s",
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="ndelbtn"
                              onClick={() => setDeleteEventItem(ev)}
                              style={{
                                padding: "5px 10px",
                                borderRadius: 6,
                                border: "1.5px solid #232733",
                                background: "transparent",
                                color: "#7a8099",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'DM Sans',sans-serif",
                                transition: "all .2s",
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <h3
                          style={{
                            fontFamily: "'Syne',sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#e8ecf4",
                            lineHeight: 1.4,
                            margin: 0,
                          }}
                        >
                          {evTitle}
                        </h3>

                        <div
                          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                        >
                          {ev.date && (
                            <span style={{ fontSize: 12, color: "#7a8099" }}>
                              📅 {fmtDate(ev.date)}
                              {ev.time ? ` · ${str(ev.time)}` : ""}
                            </span>
                          )}
                          {evLocation && (
                            <span style={{ fontSize: 12, color: "#7a8099" }}>
                              📍 {evLocation}
                            </span>
                          )}
                        </div>

                        {evDescription && (
                          <p
                            style={{
                              fontSize: 13,
                              color: "#7a8099",
                              lineHeight: 1.6,
                              margin: 0,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {evDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals & Toast */}
      <ConfirmModal
        item={deleteNewsItem}
        onConfirm={confirmDeleteNews}
        onCancel={() => setDeleteNewsItem(null)}
      />
      <ConfirmModal
        item={deleteEventItem}
        onConfirm={confirmDeleteEvent}
        onCancel={() => setDeleteEventItem(null)}
      />
      <Toast data={toast} />
    </>
  );
}
