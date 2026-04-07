'use client'
import { useState } from "react";
import { ActiveFlagHeader } from "./ActiveFlagHeader";
import { EnvironmentSelector } from "./Environment-Selecctor";
import { Environment } from "./constant/environment";
import { ToggleSwitch } from "./ToggleSwitch";
import { RolloutSlider } from "./RolloutSlider";
import { TargetingRules } from "./Targetingrule";
import { VariationsEditor } from "./VariationEditor";
import { Variation } from "./types/variation";
import { AuditHistory } from "./AuditHistory";
import { RollbackSection } from "./RollbackSection";
import { useActiveFlag } from "./hook/useActiveFlag";

export default function ActiveFeatureFlagDashboard() {
  const [env, setEnv] = useState<Environment>("DEVELOPMENT");
 const flagId = "0b93cd70-f3ea-45f0-a761-3e0a3721335b";

  const { data, isLoading, error } = useActiveFlag(flagId, env);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flag</div>;

  const flag = data?.data;
const mockRollbackVersions = [
  {
    id: 4,
    rollout: 100,
    user: "Emily Ross",
    date: "Apr 7"
  },
  {
    id: 3,
    rollout: 50,
    user: "John Carter",
    date: "Apr 6"
  },
  {
    id: 2,
    rollout: 25,
    user: "David Lee",
    date: "Apr 5"
  }
]
  const mockAuditHistory = [
  {
    id: "1",
    user: "Emily Ross",
    avatar: "ER",
    color: "#6366f1",
    change: "Enabled flag in production",
    date: "Apr 7",
    time: "14:23"
  },
  {
    id: "2",
    user: "John Carter",
    avatar: "JC",
    color: "#10b981",
    change: "Updated rollout to 50%",
    date: "Apr 7",
    time: "15:02"
  }
]
const mockVariations:Variation[] = [
  {
    id: 1,
    name: "Variation A",
    value: "false",
    type: "Boolean",
    weight: 50
  },
  {
    id: 2,
    name: "Variation B",
    value: "true",
    type: "Boolean",
    weight: 50
  }
]
  return (
    <div style={{ minHeight: "100vh", background: "#ffff", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Top Nav */}
    

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: "24px auto", padding: "0 24px 48px" }}>
        <ActiveFlagHeader env={env} flag={flag}/>
        {/* <EnvironmentSelector env={env} setEnv={setEnv} />
        <ToggleSwitch env={env} />
        <RolloutSlider />
        <TargetingRules />
        <VariationsEditor />
        <AuditHistory />
        <RollbackSection /> */}
         <EnvironmentSelector
        env={env}
        setEnv={setEnv}
        />
        <ToggleSwitch env={env} flag={flag}/>
        <RolloutSlider/>
        <TargetingRules  attributes={[
    "user.email",
    "user.id",
    "country",
    "plan"
  ]}
  operators={[
    "contains",
    "equals",
    "startsWith"
  ]}
/>
<VariationsEditor
   initialVariations={mockVariations}
/>
<AuditHistory history={mockAuditHistory} />
<RollbackSection versions={mockRollbackVersions}/>
      </div>
    </div>
  );
}