"use client";

import React, { useEffect, useRef } from "react";

interface GiscusProps {
  slug: string;
}

export default function Giscus({ slug }: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "DDreamer01/imagitech-online");
    script.setAttribute("data-repo-id", "R_kgDOTcBAdg");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOTcBAds4DDmNc");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "noborder_dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [slug]);

  return (
    <section className="mt-12 pt-8 border-t border-slate-800/80">
      <h2 className="font-mono text-sm font-bold text-slate-300 mb-4">{'// Comments'}</h2>
      <div ref={ref} />
    </section>
  );
}
