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
    <nav className="space-y-3">
      <h3 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3">
        On this page
      </h3>
      <ul className="relative border-l border-slate-800/80 space-y-2 font-mono text-[11px] leading-relaxed">
        {items.map((item) => (
          <li 
            key={item.id}
            style={{ paddingLeft: `${(item.depth - 2) * 10}px` }}
            className="group"
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 pl-3 -ml-[1px] border-l transition-all duration-150 ${
                activeId === item.id
                  ? "border-sky-400 text-sky-400 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
