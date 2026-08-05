"use client";

import { InputHTMLAttributes } from "react";

export default function Input(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500"
    />
  );
}