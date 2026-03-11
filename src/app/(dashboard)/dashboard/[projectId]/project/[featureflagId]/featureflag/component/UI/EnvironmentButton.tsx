import { memo } from "react";

import { cn } from "@/lib/utils";

import { Environment } from "../constant/environment";
import { ENVIRONMENT_COLORS } from "../constant/environmentselectorcolor";

interface Props {
  env: Environment;
  currentEnv: Environment;
  onSelect: (env: Environment) => void;
}

export const EnvironmentButton = memo(function EnvironmentButton({
  env,
  currentEnv,
  onSelect,
}: Props) {
  const active = env === currentEnv;
  const color = ENVIRONMENT_COLORS[env];

  return (
    <button
      onClick={() => onSelect(env)}
      className={cn(
        "flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all",
        active
          ? `border-${color}-500 bg-${color}-50 text-${color}-600`
          : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
      )}
    >
      {env === "PRODUCTION" && (
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            active ? `bg-${color}-500` : "bg-slate-300"
          )}
        />
      )}
      {env}
    </button>
  );
});