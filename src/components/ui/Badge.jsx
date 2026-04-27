export default function Badge({ label, color = "slate" }) {
  const colors = {
    green: "bg-green-500/15 text-green-400 border-green-500/20",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/20",
    slate: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.slate}`}
    >
      {label}
    </span>
  );
}
