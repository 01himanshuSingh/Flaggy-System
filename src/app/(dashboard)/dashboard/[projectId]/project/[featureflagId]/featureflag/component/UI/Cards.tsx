import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-xs">
      {children}
    </div>
  );
}