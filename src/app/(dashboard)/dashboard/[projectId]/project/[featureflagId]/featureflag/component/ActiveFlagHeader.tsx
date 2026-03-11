"use client";

import { useState } from "react";
import { FlagHeaderProps } from "./types/Flag";
import { copyToClipboard } from "./utils/copy";
import { Card } from "./UI/Cards";
import { Badge } from "./UI/Badge";
import { Avatar } from "./UI/Avtar";

export function ActiveFlagHeader({ env }: FlagHeaderProps) {
  const [copied, setCopied] = useState(false);

  const flagKey = "new-checkout-flow-v2";

  async function handleCopy() {
    await copyToClipboard(flagKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-6">

        {/* Left */}
        <div className="flex flex-col gap-3">

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">
              New Checkout Flow
            </h1>

            <Badge status="active" />

            <span className="rounded bg-indigo-50 border border-indigo-200 px-2 py-1 text-xs font-semibold text-indigo-700">
              {env}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
            <code className="text-xs text-slate-600 font-mono">
              {flagKey}
            </code>

            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-green-600 font-semibold"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-6">

          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">
              Created
            </p>
            <p className="text-sm text-slate-600">
              Apr 7, 2025
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Avatar initials="ER" color="#ec4899" size={28} />
            <span className="text-sm font-semibold text-slate-700">
              Emily Ross
            </span>
          </div>

          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Actions
          </button>

        </div>
      </div>
    </Card>
  );
}