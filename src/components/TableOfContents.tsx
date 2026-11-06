"use client";

import React, { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const headingElements = items.map((item) => document.getElementById(item.id));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Highlight the first visible heading
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      headingElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav className="border border-slate-800 bg-slate-950/30 p-4 font-mono transition-all">
      <button
        type="button"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className={`w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none ${
          !isCollapsed ? "border-b border-slate-800 pb-2 mb-3" : ""
        }`}
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand table of contents" : "Minimize table of contents"}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-slate-100 transition-colors">
            On this page
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            [{items.length}]
          </span>
        </div>
        <span className="font-mono text-xs text-slate-500 group-hover:text-sky-400 transition-colors select-none">
          {isCollapsed ? "[ + ]" : "[ − ]"}
        </span>
      </button>

      {!isCollapsed && (
        <ul className="space-y-1.5 text-[11px] leading-relaxed">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.depth - 2) * 8}px` }}
              className="group"
            >
              <a
                href={`#${item.id}`}
                className={`block py-1 pl-2.5 border-l-2 transition-all duration-150 truncate ${
                  activeId === item.id
                    ? "border-sky-400 text-sky-400 font-semibold bg-sky-950/20"
                    : "border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
