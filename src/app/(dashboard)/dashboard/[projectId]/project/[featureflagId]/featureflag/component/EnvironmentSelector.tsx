import { Card } from "./UI/Cards";

function EnvironmentSelector({ env, setEnv }) {
  const colors = { Development: "#6366f1", Test: "#f59e0b", Staging: "#3b82f6", Production: "#ef4444" };
  return (
    <Card style={{ marginBottom: 20 }}>
      <SectionLabel>Environment</SectionLabel>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ENVIRONMENTS.map((e) => {
          const active = env === e;
          return (
            <button key={e} onClick={() => setEnv(e)} style={{ padding: "8px 20px", borderRadius: 8, border: active ? `2px solid ${colors[e]}` : "2px solid #e2e8f0", background: active ? `${colors[e]}12` : "#f8fafc", color: active ? colors[e] : "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
              {e === "Production" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? colors[e] : "#cbd5e1", display: "inline-block" }} />}
              {e}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
