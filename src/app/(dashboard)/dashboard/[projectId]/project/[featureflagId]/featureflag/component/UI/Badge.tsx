import { FlagStatus } from "../types/Flag";


const STATUS_MAP = {
  active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500", label: "Active" },
  draft: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500", label: "Draft" },
  deprecated: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500", label: "Deprecated" },
  archived: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400", label: "Archived" },
} as const;

export function Badge({ status }: { status: FlagStatus }) {
  const s = STATUS_MAP[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}   