export default function StatCard({
  label,
  value,
  change,
  icon,
  color = "sky",
  trend = "up",
}) {
  const colors = {
    sky: {
      bg: "rgba(14,165,233,0.1)",
      border: "rgba(14,165,233,0.2)",
      text: "#38bdf8",
      icon: "rgba(14,165,233,0.15)",
    },
    green: {
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.2)",
      text: "#4ade80",
      icon: "rgba(34,197,94,0.15)",
    },
    amber: {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
      text: "#fbbf24",
      icon: "rgba(245,158,11,0.15)",
    },
    rose: {
      bg: "rgba(244,63,94,0.1)",
      border: "rgba(244,63,94,0.2)",
      text: "#fb7185",
      icon: "rgba(244,63,94,0.15)",
    },
    purple: {
      bg: "rgba(168,85,247,0.1)",
      border: "rgba(168,85,247,0.2)",
      text: "#c084fc",
      icon: "rgba(168,85,247,0.15)",
    },
  };
  const c = colors[color];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.02] cursor-default"
      style={{
        background: "rgba(15,23,42,0.8)",
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-white text-3xl font-bold mt-1">{value}</p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.icon }}
        >
          <span style={{ color: c.text }}>{icon}</span>
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background:
                trend === "up"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(244,63,94,0.15)",
              color: trend === "up" ? "#4ade80" : "#fb7185",
            }}
          >
            {trend === "up" ? "↑" : "↓"} {change}
          </span>
          <span className="text-slate-500 text-xs">vs last month</span>
        </div>
      )}
    </div>
  );
}
