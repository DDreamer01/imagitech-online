"use client";

import React, { useEffect, useState, useRef } from "react";

interface MermaidProps {
  chart: string;
}

let mermaidCount = 0;

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef<string>(`mermaid-${++mermaidCount}`);

  useEffect(() => {
    let active = true;

    async function renderChart() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            background: "#090d16",
            primaryColor: "#1e293b",
            primaryTextColor: "#f8fafc",
            lineColor: "#334155",
            fontSize: "13px",
            fontFamily: "var(--font-mono)",
          },
        });

        // Clean up text if needed (e.g. nested tags or quotes)
        const cleanedChart = chart.trim();

        const { svg: renderedSvg } = await mermaid.render(idRef.current, cleanedChart);
        if (active) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        if (active) {
          const errMsg = err instanceof Error ? err.message : "Failed to render Mermaid diagram.";
          setError(errMsg);
        }
      }
    }

    renderChart();

    return () => {
      active = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-400 font-mono text-xs">
        <div className="font-semibold mb-1">Mermaid Syntax Error:</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center p-8 rounded-lg border border-slate-800 bg-slate-900/10 text-slate-500 font-mono text-xs animate-pulse">
        Generating diagram...
      </div>
    );
  }

  return (
    <div 
      className="my-6 flex justify-center p-6 rounded-lg border border-slate-800 bg-slate-950/20 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
