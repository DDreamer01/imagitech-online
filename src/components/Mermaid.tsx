"use client";

import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface MermaidProps {
  chart: string;
}

let mermaidCount = 0;

export default function Mermaid({ chart }: MermaidProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef<string>(`mermaid-${++mermaidCount}`);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            background: "#181818",
            primaryColor: "#222222",
            primaryTextColor: "#F2F2F2",
            lineColor: "#CF7253",
            fontSize: "13px",
            fontFamily: "var(--font-mono)",
          },
        });

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

  // Lock scroll when zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isZoomed]);

  if (error) {
    return (
      <div className="my-6 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive font-mono text-xs">
        <div className="font-semibold mb-1">Mermaid Syntax Error:</div>
        <pre className="whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center p-8 rounded-lg border border-edge bg-surface/20 text-content-muted font-mono text-xs animate-pulse">
        Rendering diagram...
      </div>
    );
  }

  return (
    <>
      <div className="my-6 relative group rounded-lg border border-edge bg-surface/30 p-5 overflow-hidden transition-all hover:border-brand/50">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-edge/60 text-xs font-mono text-content-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            Architecture Flowchart
          </span>
          <button
            onClick={() => setIsZoomed(true)}
            type="button"
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-edge bg-canvas/60 hover:bg-surface-elevated hover:text-brand transition-colors text-[11px]"
            aria-label="Zoom diagram"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            <span>Zoom</span>
          </button>
        </div>

        <div 
          className="flex justify-center overflow-x-auto py-2 cursor-pointer"
          onClick={() => setIsZoomed(true)}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {/* Click-to-Zoom Modal */}
      {mounted && isZoomed && createPortal(
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/90 backdrop-blur-sm p-4 md:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-surface border border-edge rounded-xl p-6 shadow-2xl overflow-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-edge mb-4">
              <span className="font-mono text-sm font-bold text-content-main">
                Architecture Diagram View
              </span>
              <button
                onClick={() => setIsZoomed(false)}
                type="button"
                className="p-1.5 rounded-md text-content-muted hover:text-content-main hover:bg-surface-elevated transition-colors"
                aria-label="Close zoomed view"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div 
              className="flex justify-center items-center py-6 overflow-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
