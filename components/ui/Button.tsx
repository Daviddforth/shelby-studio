"use client";

import { ButtonHTMLAttributes } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      {...props}
      className={`rounded-xl px-5 py-3 font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}