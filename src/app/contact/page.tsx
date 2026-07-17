import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with †hε drεαmεr: email, GitHub, and secure PGP credentials.",
};

export default function ContactPage() {
  const pgpFingerprint = "7F3E B10A 4D89 6C23 9A81  5E4C D521 F9A2 8B30 E147";

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Contact</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">mail.connect()</p>
      </header>

      <div className="space-y-6 text-slate-300">
        <p className="text-base text-slate-200">
          If you want to collaborate on open-source networking tools, discuss cloud automation systems, or just talk tech, feel free to reach out.
        </p>

        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-1 border-l-2 border-sky-500 pl-4 py-1">
            <span className="text-xs text-slate-500 font-mono">Email Address</span>
            <a 
              href="mailto:thedreamer@imagitech.online" 
              className="text-lg font-mono font-medium text-slate-200 hover:text-sky-400 transition-colors"
            >
              thedreamer@imagitech.online
            </a>
          </div>

          <div className="flex flex-col gap-1 border-l-2 border-emerald-500 pl-4 py-1">
            <span className="text-xs text-slate-500 font-mono">Code Repository</span>
            <a 
              href="https://github.com/DDreamer01" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg font-mono font-medium text-slate-200 hover:text-emerald-400 transition-colors"
            >
              github.com/DDreamer01
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
