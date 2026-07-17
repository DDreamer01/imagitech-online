"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface SearchResult {
  url: string;
  meta: {
    title: string;
  };
  excerpt: string;
}

interface PagefindSearchResult {
  results: Array<{
    data: () => Promise<SearchResult>;
  }>;
}

interface PagefindInstance {
  init: () => Promise<void>;
  search: (query: string) => Promise<PagefindSearchResult>;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  
  const pagefindRef = useRef<PagefindInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Lazy load Pagefind client library
  const loadPagefind = async () => {
    if (pagefindRef.current) return;
    try {
      // Dynamic import with webpackIgnore prevents compilation errors 
      // because pagefind.js only exists post-build.
      // @ts-expect-error - pagefind.js is not present during build time
      const pagefind = await import(/* webpackIgnore: true */ "/pagefind/pagefind.js");
      await pagefind.init();
      pagefindRef.current = pagefind as PagefindInstance;
    } catch (err) {
      console.error("Failed to load Pagefind:", err);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setFocusedIndex(-1);
  };

  // Keyboard shortcut listener (CMD+K / CTRL+K / Slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) {
            setQuery("");
            setResults([]);
            setFocusedIndex(-1);
          }
          return !prev;
        });
      } else if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      loadPagefind();
    }
  }, [isOpen]);

  // Scroll lock when search modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Perform search queries
  useEffect(() => {
    let active = true;
    if (!query.trim()) {
      return;
    }

    const search = async () => {
      if (!pagefindRef.current) await loadPagefind();
      if (!pagefindRef.current) return;

      setIsLoading(true);
      try {
        const searchResult = await pagefindRef.current.search(query);
        
        // Fetch data for the first 5 results
        const firstResults = searchResult.results.slice(0, 5);
        const dataPromises = firstResults.map((r) => r.data());
        const dataList = await Promise.all(dataPromises);

        if (active) {
          setResults(dataList);
          setFocusedIndex(-1);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const debounce = setTimeout(search, 150);
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [query]);

  const handleSelectResult = (url: string) => {
    closeModal();
    router.push(url);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setFocusedIndex(-1);
    }
  };

  // Keyboard navigation within the result listbox
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < results.length) {
        handleSelectResult(results[focusedIndex].url);
      } else if (results.length > 0) {
        // Fallback: select first result if none highlighted explicitly
        handleSelectResult(results[0].url);
      }
    }
  };

  return (
    <>
      {/* Navigation Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-0 md:gap-2 px-2 md:px-3 py-1.5 rounded-md border border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 text-xs font-mono select-none focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open search dialog"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden md:inline">search()</span>
        <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-500 font-sans tracking-tight">
          ⌘K
        </kbd>
      </button>

      {/* Modal Dialog */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
            onClick={closeModal}
          />

          {/* Centering Wrapper */}
          <div 
            className="flex min-h-full items-start justify-center pt-24 px-4 text-center"
            onClick={closeModal}
          >
            {/* Dialog Body */}
            <div 
              className="relative w-full max-w-xl rounded-lg border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[60vh] text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Box */}
              <div className="flex items-center gap-3 px-4 border-b border-slate-800 bg-slate-950/20">
                <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search blog, projects, notes..."
                  className="w-full py-4 text-sm bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none focus-visible:outline-none"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results-listbox"
                  aria-activedescendant={focusedIndex >= 0 ? `search-result-item-${focusedIndex}` : undefined}
                  aria-label="Search site content"
                />
                <button
                  onClick={closeModal}
                  type="button"
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/50"
                  aria-label="Close search"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">
                  ESC
                </span>
              </div>

              {/* Results Section */}
              <div 
                className="flex-1 overflow-y-auto p-2 min-h-[100px]"
                id="search-results-listbox"
                role="listbox"
                aria-label="Search results"
              >
                {isLoading && (
                  <div className="py-6 text-center text-xs font-mono text-slate-500 animate-pulse">
                    searching_index...
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="space-y-1">
                    {results.map((result, idx) => (
                      <button
                        key={result.url}
                        id={`search-result-item-${idx}`}
                        role="option"
                        aria-selected={focusedIndex === idx}
                        onClick={() => handleSelectResult(result.url)}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        className={`w-full text-left p-3 rounded transition-colors border border-transparent flex flex-col focus:outline-none ${
                          focusedIndex === idx
                            ? "bg-slate-800/80 border-slate-700/80 text-sky-400"
                            : "hover:bg-slate-800/40 text-slate-200"
                        }`}
                      >
                        <h4 className={`text-sm font-bold transition-colors ${
                          focusedIndex === idx ? "text-sky-400" : "text-slate-200"
                        }`}>
                          {result.meta.title}
                        </h4>
                        <p 
                          className="text-xs text-slate-400 mt-1 font-sans line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {!isLoading && query && results.length === 0 && (
                  <div className="py-6 text-center text-xs font-mono text-slate-500" role="status">
                    exit_code: 404 (No results found)
                  </div>
                )}

                {!query && (
                  <div className="py-8 text-center text-xs font-mono text-slate-500" role="status">
                    Type to query the site indices...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
