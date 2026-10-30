"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Search from "./Search";

const NAV_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/notes", label: "Notes" },
  { href: "/writeups", label: "Writeups" },
  { href: "/about", label: "About" },
];

// Contact lives under About in the nav (dropdown on desktop, indented in mobile)
const ABOUT_CHILDREN = [{ href: "/contact", label: "Contact" }];

// Secondary pages, kept accessible via the mobile drawer footer / site footer
const SECONDARY_LINKS = [
  { href: "/tags", label: "Tags" },
  { href: "/uses", label: "Uses" },
  { href: "/now", label: "Now" },
  { href: "/changelog", label: "Changelog" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Return focus to trigger button when mobile menu is closed
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      triggerRef.current?.focus();
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  // Trap keyboard focus in mobile overlay menu & handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const menuElement = menuRef.current;
    if (!menuElement) return;

    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      "a[href], button, input, textarea, select, [tabindex]:not([tabindex=\"-1\"])"
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the close button first for better mobile menu usability
    const closeButton = menuElement.querySelector<HTMLElement>("button[aria-label=\"Close menu\"]");
    if (closeButton) {
      closeButton.focus();
    } else {
      firstElement.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Clean Wordmark */}
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center font-mono text-sm font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors whitespace-nowrap"
            >
              <span>the-dreamer</span>
              <span className="text-slate-500 mx-1.5">/</span>
              <span className="text-sky-400">imagitech</span>
            </Link>
          </div>

          {/* Desktop Right Side (Nav + Search) */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex space-x-6 text-sm font-medium">
              {NAV_LINKS.map((link) =>
                link.href === "/about" ? (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className={`relative inline-flex items-center gap-0.5 py-1 transition-colors hover:text-slate-100 ${
                        isActive(link.href) || pathname.startsWith("/contact")
                          ? "text-sky-400 font-semibold"
                          : "text-slate-400"
                      }`}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <svg
                        className="h-3 w-3 opacity-70 transition-transform group-hover:translate-y-px"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {(isActive(link.href) || pathname.startsWith("/contact")) && (
                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-400" />
                      )}
                    </Link>
                    {/* Dropdown panel (opens on hover or keyboard focus) */}
                    <div className="absolute right-0 top-full pt-2 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150 ease-out z-50">
                      <div className="min-w-[150px] rounded-md border border-slate-800/80 bg-slate-950 py-1.5 shadow-lg shadow-black/40">
                        {ABOUT_CHILDREN.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(child.href)
                                ? "bg-slate-900/80 text-sky-400"
                                : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-100"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 transition-colors hover:text-slate-100 ${
                      isActive(link.href)
                        ? "text-sky-400 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-400" />
                    )}
                  </Link>
                )
              )}
            </nav>
            <Search />
          </div>

          {/* Mobile Right Side (Search + Hamburger) */}
          <div className="flex md:hidden items-center gap-3">
            <Search />
            <button
              ref={triggerRef}
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-haspopup="dialog"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Navigation Drawer */}
    {isOpen && (
      <div 
        ref={menuRef}
        className="fixed inset-0 z-50 bg-background flex flex-col p-6 animate-mobile-menu" 
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
      >
          {/* Header of mobile menu overlay */}
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6 shrink-0">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="flex items-center font-mono text-sm font-bold tracking-tight text-slate-100 hover:text-sky-400 transition-colors whitespace-nowrap"
            >
              <span>the-dreamer</span>
              <span className="text-slate-500 mx-1.5">/</span>
              <span className="text-sky-400">imagitech</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links with comfortable spacing and large tap targets */}
          <nav className="flex-1 flex flex-col justify-start pt-2 space-y-1.5 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-md px-4 py-2.5 text-xl font-semibold transition-colors ${
                    isActive(link.href) ||
                    (link.href === "/about" && pathname.startsWith("/contact"))
                      ? "bg-slate-900/80 text-sky-400 border-l-4 border-sky-400 pl-3"
                      : "text-slate-400 hover:bg-slate-900/40 hover:text-slate-200"
                  }`}
                >
                  {link.label}
                </Link>
                {/* Contact sits under About */}
                {link.href === "/about" &&
                  ABOUT_CHILDREN.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setIsOpen(false)}
                      className={`block rounded-md pl-10 pr-4 py-2.5 text-lg font-semibold transition-colors ${
                        isActive(child.href)
                          ? "bg-slate-900/80 text-sky-400 border-l-4 border-sky-400 pl-8"
                          : "text-slate-500 hover:bg-slate-900/40 hover:text-slate-200"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
              </React.Fragment>
            ))}
          </nav>

          {/* Footer at bottom left with secondary utility links */}
          <div className="mt-auto pt-6 border-t border-slate-800/60 space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-mono text-slate-500">
              {SECONDARY_LINKS.map((link, idx) => (
                <React.Fragment key={link.href}>
                  {idx > 0 && <span className="text-slate-800">/</span>}
                  <Link href={link.href} onClick={() => setIsOpen(false)} className="hover:text-sky-400 transition-colors">
                    {link.label}
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center space-x-6 text-sm font-mono text-slate-400">
              <a href="https://x.com/This_is_Dreamer" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                X
              </a>
              <span className="text-slate-800">/</span>
              <a href="https://t.me/DR34_M3R" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                Telegram
              </a>
              <span className="text-slate-800">/</span>
              <a href="https://www.youtube.com/@ddreamer1" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">
                YouTube
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
