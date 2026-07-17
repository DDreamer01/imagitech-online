"use client";

import React, { useState, useRef } from "react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
  title?: string;
}

export default function CodeBlock({ children, title, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Extract language from data-language attribute passed by rehype-pretty-code
  const lang = (props as Record<string, unknown>)["data-language"] as string || "code";
  const displayTitle = title || lang.toUpperCase();

  const runFallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Keep offscreen
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const handleCopy = () => {
    if (!preRef.current) return;
    
    const codeElement = preRef.current.querySelector("code");
    const rawText = codeElement ? codeElement.innerText : preRef.current.innerText;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(rawText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          runFallbackCopy(rawText);
        });
      } else {
        runFallbackCopy(rawText);
      }
    } catch {
      runFallbackCopy(rawText);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-slate-800 bg-slate-950/40">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/20 text-xs font-mono">
        <span className="text-slate-400 font-semibold">{displayTitle}</span>
        <button
          onClick={handleCopy}
          data-testid="copy-button"
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          aria-label={copied ? "Code copied" : "Copy code snippet"}
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400 font-sans font-medium">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span className="font-sans font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        {...props}
        className="p-4 overflow-x-auto text-sm leading-relaxed font-mono !bg-transparent focus:outline-none"
      >
        {children}
      </pre>
    </div>
  );
}
