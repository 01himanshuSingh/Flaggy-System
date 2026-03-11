"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ENVIRONMENTS } from "./constant/environmentselectorcolor";
import { EnvironmentButton } from "./UI/EnvironmentButton";
import { Environment } from "./constant/environment";

interface Props {
  env: Environment;
  setEnv: (env: Environment) => void;
}

export function EnvironmentSelector({ env, setEnv }: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-slate-600">
          Environment
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ENVIRONMENTS.map((environment) => (
            <EnvironmentButton
              key={environment}
              env={environment}
              currentEnv={env}
              onSelect={setEnv}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}