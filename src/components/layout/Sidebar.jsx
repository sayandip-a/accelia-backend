import { useState, useEffect, useRef } from "react";

const navSections = [
  {
    label: "Main Menu",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        id: "trials",
        label: "Clinical Trials",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
        ),
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        id: "news",
        label: "News & Events",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        ),
      },
      {
        id: "jobs",
        label: "Jobs",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        id: "solutions",
        label: "Solutions",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
      {
        id: "locations",
        label: "Locations",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        id: "aboutadmin",
        label: "About Us",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        id: "team",
        label: "Team",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        id: "settings",
        label: "Settings",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ width: 17, height: 17 }}
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
];

const mobileBottomItems = [
  {
    id: "dashboard",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 20, height: 20 }}
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "trials",
    label: "Trials",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 20, height: 20 }}
      >
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Stats",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 20, height: 20 }}
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: "news",
    label: "News",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: 20, height: 20 }}
      >
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
      </svg>
    ),
  },
];

const CSS_VARS = `
  :root {
    --sb-bg: #070d1a;
    --sb-bg2: #0c1525;
    --sb-bg3: #111d30;
    --sb-accent: #4f9cf9;
    --sb-accent2: #7c6af7;
    --sb-text1: #e8edf5;
    --sb-text2: #6b7fa3;
    --sb-text3: #3a4a66;
    --sb-border: rgba(79,156,249,0.10);
    --sb-border2: rgba(79,156,249,0.18);
    --sb-active-bg: rgba(79,156,249,0.10);
    --sb-hover-bg: rgba(255,255,255,0.04);
  }
`;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ── Modern Logo ───────────────────────────────────────────────────────────────
function LogoIcon({ size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 11,
        flexShrink: 0,
        background: "linear-gradient(135deg, #4f9cf9 0%, #7c6af7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 14px rgba(79,156,249,0.35)",
      }}
    >
      {/* gloss */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)",
        }}
      />
      {/* DNA / cross icon — clinical feel */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        style={{
          width: size * 0.52,
          height: size * 0.52,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* cross */}
        <rect
          x="10"
          y="3"
          width="4"
          height="18"
          rx="2"
          fill="white"
          opacity="0.95"
        />
        <rect
          x="3"
          y="10"
          width="18"
          height="4"
          rx="2"
          fill="white"
          opacity="0.95"
        />
        {/* small accent circles */}
        <circle cx="12" cy="12" r="2.5" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  );
}

// ── Desktop Sidebar ───────────────────────────────────────────────────────────
function DesktopSidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });

  const W = collapsed ? 68 : 256;
  const allItems = navSections.flatMap((s) => s.items);
  const filteredIds = searchVal
    ? new Set(
        allItems
          .filter((i) =>
            i.label.toLowerCase().includes(searchVal.toLowerCase()),
          )
          .map((i) => i.id),
      )
    : null;

  const handleMouseEnter = (id, e) => {
    if (!collapsed) return;
    setHoveredItem(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipStyle({ top: rect.top + rect.height / 2, left: rect.right + 10 });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        ${CSS_VARS}
        nav::-webkit-scrollbar { display: none; }
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>

      {/* Floating tooltip */}
      {collapsed && hoveredItem && (
        <div
          style={{
            position: "fixed",
            top: tooltipStyle.top - 14,
            left: tooltipStyle.left,
            background: "var(--sb-bg2)",
            border: "1px solid var(--sb-border2)",
            color: "var(--sb-text1)",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 10px",
            borderRadius: 7,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {allItems.find((i) => i.id === hoveredItem)?.label}
        </div>
      )}

      <aside
        style={{
          width: W,
          minWidth: W,
          height: "100vh",
          background: "var(--sb-bg)",
          borderRight: "1px solid var(--sb-border)",
          display: "flex",
          flexDirection: "column",
          transition:
            "width 0.35s cubic-bezier(0.4,0,0.2,1), min-width 0.35s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "18px 16px 14px",
            borderBottom: "1px solid var(--sb-border)",
            flexShrink: 0,
            minHeight: 68,
            position: "relative",
          }}
        >
          <div
            style={{
              animation: "logoFloat 4s ease-in-out infinite",
              flexShrink: 0,
            }}
          >
            <LogoIcon size={36} />
          </div>

          <div
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              transition: collapsed
                ? "opacity 0.1s ease, width 0.35s cubic-bezier(0.4,0,0.2,1)"
                : "opacity 0.2s ease 0.1s, width 0.35s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--sb-text1)",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: "0.02em",
              }}
            >
              Accelia
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "var(--sb-accent)",
                marginTop: 2,
                letterSpacing: "0.04em",
              }}
            >
              Management Portal
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: "absolute",
              right: collapsed ? "50%" : 12,
              top: "50%",
              transform: collapsed
                ? "translateY(-50%) translateX(50%) rotate(180deg)"
                : "translateY(-50%)",
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--sb-bg3)",
              border: "1px solid var(--sb-border2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--sb-text2)",
              transition:
                "background 0.2s, color 0.2s, right 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--sb-accent)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--sb-bg3)";
              e.currentTarget.style.color = "var(--sb-text2)";
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: 12, height: 12 }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            padding: collapsed ? "0 12px" : "12px 12px 6px",
            flexShrink: 0,
            overflow: "hidden",
            opacity: collapsed ? 0 : 1,
            maxHeight: collapsed ? 0 : 52,
            transition: "opacity 0.2s, max-height 0.3s, padding 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--sb-bg3)",
              border: `1px solid ${searchVal ? "var(--sb-accent)" : "var(--sb-border)"}`,
              borderRadius: 9,
              padding: "8px 10px",
              transition: "border-color 0.2s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7fa3"
              strokeWidth="2"
              style={{ width: 13, height: 13, flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--sb-text1)",
                fontSize: 12.5,
                fontFamily: "'DM Sans', sans-serif",
                flex: 1,
              }}
            />
            {searchVal && (
              <span
                onClick={() => setSearchVal("")}
                style={{
                  cursor: "pointer",
                  color: "var(--sb-text2)",
                  fontSize: 11,
                  lineHeight: 1,
                }}
              >
                ✕
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: collapsed ? "8px 8px" : "8px 10px",
            scrollbarWidth: "none",
          }}
        >
          {navSections.map((section, si) => (
            <div key={si}>
              {si > 0 && (
                <div
                  style={{
                    height: 1,
                    background: "var(--sb-border)",
                    margin: "6px 4px",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--sb-text3)",
                  padding: collapsed ? "0 8px" : "10px 8px 5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  opacity: collapsed ? 0 : 1,
                  maxHeight: collapsed ? 0 : 30,
                  transition: "opacity 0.15s, max-height 0.3s, padding 0.3s",
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                if (filteredIds && !filteredIds.has(item.id)) return null;
                const isActive = activePage === item.id;
                const isHov = hoveredItem === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    onMouseEnter={(e) => {
                      setHoveredItem(item.id);
                      handleMouseEnter(item.id, e);
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: collapsed ? "9px 0" : "9px 10px",
                      justifyContent: collapsed ? "center" : "flex-start",
                      borderRadius: 9,
                      cursor: "pointer",
                      marginBottom: 2,
                      position: "relative",
                      overflow: "hidden",
                      transition:
                        "background 0.18s, color 0.18s, border-color 0.18s",
                      color: isActive
                        ? "var(--sb-accent)"
                        : isHov
                          ? "var(--sb-text1)"
                          : "var(--sb-text2)",
                      background: isActive
                        ? "var(--sb-active-bg)"
                        : isHov
                          ? "var(--sb-hover-bg)"
                          : "transparent",
                      border: isActive
                        ? "1px solid var(--sb-border2)"
                        : "1px solid transparent",
                      userSelect: "none",
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "18%",
                          bottom: "18%",
                          width: 3,
                          background: "var(--sb-accent)",
                          borderRadius: "0 3px 3px 0",
                        }}
                      />
                    )}
                    <span
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isActive ? 500 : 400,
                        whiteSpace: "nowrap",
                        flex: 1,
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: collapsed
                          ? "opacity 0.1s ease"
                          : "opacity 0.15s ease 0.05s",
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {filteredIds && filteredIds.size === 0 && (
            <div
              style={{
                padding: "16px 8px",
                color: "var(--sb-text3)",
                fontSize: 12,
              }}
            >
              No results found
            </div>
          )}
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: collapsed ? "12px 10px" : "12px 12px",
            borderTop: "1px solid var(--sb-border)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f9cf9, #7c6af7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              position: "relative",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            AD
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22d3a0",
                border: "2px solid var(--sb-bg)",
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              transition: "opacity 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--sb-text1)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Admin User
            </div>
            <div
              style={{ fontSize: 10.5, color: "var(--sb-text2)", marginTop: 1 }}
            >
              Super Admin
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({ activePage, setActivePage, open, onClose }) {
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const allItems = navSections.flatMap((s) => s.items);
  const filteredIds = searchVal
    ? new Set(
        allItems
          .filter((i) =>
            i.label.toLowerCase().includes(searchVal.toLowerCase()),
          )
          .map((i) => i.id),
      )
    : null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 50,
          background: "var(--sb-bg)",
          borderRight: "1px solid var(--sb-border)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            borderBottom: "1px solid var(--sb-border)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoIcon size={32} />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--sb-text1)",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Accelia
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--sb-accent)",
                  marginTop: 1,
                }}
              >
                Management Portal
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "var(--sb-bg3)",
              border: "1px solid var(--sb-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--sb-text2)",
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

        {/* Search */}
        <div style={{ padding: "10px 12px 4px", flexShrink: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--sb-bg3)",
              border: `1px solid ${searchVal ? "var(--sb-accent)" : "var(--sb-border)"}`,
              borderRadius: 9,
              padding: "8px 12px",
              transition: "border-color 0.2s",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7fa3"
              strokeWidth="2"
              style={{ width: 13, height: 13 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--sb-text1)",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                flex: 1,
              }}
            />
            {searchVal && (
              <span
                onClick={() => setSearchVal("")}
                style={{
                  cursor: "pointer",
                  color: "var(--sb-text2)",
                  fontSize: 11,
                }}
              >
                ✕
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "6px 10px",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {navSections.map((section, si) => (
            <div key={si}>
              {si > 0 && (
                <div
                  style={{
                    height: 1,
                    background: "var(--sb-border)",
                    margin: "6px 2px",
                  }}
                />
              )}
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--sb-text3)",
                  padding: "10px 6px 5px",
                }}
              >
                {section.label}
              </div>
              {section.items.map((item) => {
                if (filteredIds && !filteredIds.has(item.id)) return null;
                const isActive = activePage === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      onClose();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 10px",
                      borderRadius: 9,
                      cursor: "pointer",
                      marginBottom: 2,
                      position: "relative",
                      color: isActive ? "var(--sb-accent)" : "var(--sb-text2)",
                      background: isActive
                        ? "var(--sb-active-bg)"
                        : "transparent",
                      border: isActive
                        ? "1px solid var(--sb-border2)"
                        : "1px solid transparent",
                      minHeight: 44,
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "20%",
                          bottom: "20%",
                          width: 3,
                          background: "var(--sb-accent)",
                          borderRadius: "0 3px 3px 0",
                        }}
                      />
                    )}
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: isActive ? 500 : 400,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          {filteredIds && filteredIds.size === 0 && (
            <div
              style={{
                padding: "16px 8px",
                color: "var(--sb-text3)",
                fontSize: 13,
              }}
            >
              No results found
            </div>
          )}
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: "14px",
            borderTop: "1px solid var(--sb-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f9cf9, #7c6af7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              position: "relative",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            AD
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22d3a0",
                border: "2px solid var(--sb-bg)",
              }}
            />
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--sb-text1)",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Admin User
            </div>
            <div
              style={{ fontSize: 11, color: "var(--sb-text2)", marginTop: 1 }}
            >
              Super Admin
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Mobile Bottom Nav ─────────────────────────────────────────────────────────
function MobileBottomNav({ activePage, setActivePage, onMenuOpen }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        background: "var(--sb-bg)",
        borderTop: "1px solid var(--sb-border)",
        zIndex: 30,
        display: "flex",
        alignItems: "stretch",
        fontFamily: "'DM Sans', sans-serif",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {mobileBottomItems.map((item) => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? "var(--sb-accent)" : "var(--sb-text2)",
              transition: "color 0.18s",
              position: "relative",
              minHeight: 44,
              padding: "6px 4px",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 7,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "var(--sb-accent)",
                }}
              />
            )}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
      <button
        onClick={onMenuOpen}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--sb-text2)",
          minHeight: 44,
          padding: "6px 4px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ width: 20, height: 20 }}
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span style={{ fontSize: 10 }}>More</span>
      </button>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function Sidebar({ activePage, setActivePage }) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        ${CSS_VARS}
      `}</style>

      {!isMobile && (
        <DesktopSidebar activePage={activePage} setActivePage={setActivePage} />
      )}

      {isMobile && (
        <>
          <MobileDrawer
            activePage={activePage}
            setActivePage={setActivePage}
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />
          <MobileBottomNav
            activePage={activePage}
            setActivePage={setActivePage}
            onMenuOpen={() => setDrawerOpen(true)}
          />
        </>
      )}
    </>
  );
}
