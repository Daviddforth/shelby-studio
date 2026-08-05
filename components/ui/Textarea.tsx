"use client";

import {
  TextareaHTMLAttributes,
} from "react";

export default function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none transition focus:border-blue-500"
    />
  );
}