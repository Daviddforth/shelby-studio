"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}