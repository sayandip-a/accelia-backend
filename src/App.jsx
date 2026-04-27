import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "./hook/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import News from "./pages/News";
import Solutions from "./pages/Solutions";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Trails from "./pages/Trails";
import Sidebar from "./components/layout/Sidebar";
import Locations from "./pages/Locations";
import Analytics from "./pages/Analytics";
import Contacts from "./pages/Contacts";
import AboutAdmin from "./pages/AboutAdmin";
const PAGE_ROUTES = {
  dashboard: "/dashboard",
  trials: "/trails",
  solutions: "/solutions",
  analytics: "/analytics",
  appointments: "/appointments",
  news: "/news",
  jobs: "/jobs",
  documents: "/documents",
  team: "/team",
  settings: "/settings",
  patients: "/patients",
  locations: "/locations",
  contacts: "/contacts",
  aboutadmin: "/aboutadmin",
};

function ProtectedLayout() {
  const { admin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#080f1e",
          color: "#38bdf8",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );

  if (!admin) return <Navigate to="/login" replace />;

  const activePage =
    Object.entries(PAGE_ROUTES).find(
      ([, path]) => path === location.pathname,
    )?.[0] ?? "dashboard";

  const handleNavigate = (pageId) => {
    const route = PAGE_ROUTES[pageId];
    if (route) navigate(route);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#080f1e",
      }}
    >
      <Sidebar activePage={activePage} setActivePage={handleNavigate} />
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trails" element={<Trails />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/news" element={<News />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/team" element={<Team />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/aboutadmin" element={<AboutAdmin />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/patients" element={<ComingSoon title="Patients" />} />
          <Route
            path="/appointments"
            element={<ComingSoon title="Appointments" />}
          />
          <Route path="/documents" element={<ComingSoon title="Documents" />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ComingSoon({ title }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 12,
        fontFamily: "'DM Sans', sans-serif",
        background: "#0b1220",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          border: "1px solid rgba(56,189,248,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          style={{ width: 24, height: 24 }}
        >
          <path d="M12 6v6l4 2M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, color: "#64748b" }}>
        {title} — coming soon
      </div>
    </div>
  );
}
