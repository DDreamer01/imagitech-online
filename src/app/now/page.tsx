import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now",
  description: "What †hε drεαmεr is working on, learning, and focusing on right now.",
};

interface ActivityItem {
  date: string;
  text: React.ReactNode;
}

interface WeekLog {
  range: string;
  badge?: string;
  activities: ActivityItem[];
}

const WEEKLY_LOGS: WeekLog[] = [
  {
    range: "Week of Nov 16 – Nov 22, 2026",
    badge: "Current Week",
    activities: [
      {
        date: "Nov 22",
        text: (
          <>
            Started reading <em>Hacking APIs: Breaking Web Application Programming Interfaces</em> by Corey J. Ball.
          </>
        ),
      },
      {
        date: "Nov 22",
        text: (
          <>
            Completed HTB Academy module: <strong>Hacking WordPress</strong>.
          </>
        ),
      },
      {
        date: "Nov 20",
        text: (
          <>
            Attended <strong>NahamCon 2026</strong> virtual talks on AI distillation and keynote by Casey John Ellis (<em>&quot;Don&apos;t sell security to people who don&apos;t care&quot;</em>).
          </>
        ),
      },
      {
        date: "Nov 19–20",
        text: (
          <>
            Submitted first official bug bounty report to a private program (triaged/duplicate within 3 hours, assisted by @Vecoyenka).
          </>
        ),
      },
      {
        date: "Nov 19",
        text: (
          <>
            Solved HTB machine <strong>Included</strong> (Linux).
          </>
        ),
      },
      {
        date: "Nov 19",
        text: (
          <>
            Solved HTB machine <strong>Unified</strong> and published the{" "}
            <Link href="/writeups/hackthebox/unified" className="text-sky-400 hover:underline">
              Unified Walkthrough
            </Link>
            .
          </>
        ),
      },
      {
        date: "Nov 18",
        text: (
          <>
            Completed HTB Academy module: <strong>Attacking Web Applications with Ffuf</strong>.
          </>
        ),
      },
      {
        date: "Nov 18",
        text: (
          <>
            Completed HTB Academy module: <strong>Intro to Network Traffic Analysis</strong>.
          </>
        ),
      },
      {
        date: "Nov 17",
        text: (
          <>
            Completed HTB Academy module: <strong>Footprinting</strong> and awarded the{" "}
            <em>&quot;You need to trace before you can hunt&quot;</em> badge.
          </>
        ),
      },
      {
        date: "Nov 17",
        text: (
          <>
            Updated pwn.college{" "}
            <Link href="/writeups/pwn-college/intro-to-cybersecurity" className="text-sky-400 hover:underline">
              Intercepting Communication
            </Link>{" "}
            writeup (completed Monitor 2, Sniffing Cookies, and Network Configuration with command breakdown notes).
          </>
        ),
      },
      {
        date: "Nov 16",
        text: (
          <>
            Published pwn.college{" "}
            <Link href="/writeups/pwn-college/intro-to-cybersecurity" className="text-sky-400 hover:underline">
              Intercepting Communication
            </Link>{" "}
            module walkthrough.
          </>
        ),
      },
    ],
  },
  {
    range: "Week of Nov 09 – Nov 15, 2026",
    activities: [
      {
        date: "Nov 13",
        text: (
          <>
            Completed HTB Academy module: <strong>Introduction to Bash Scripting</strong>.
          </>
        ),
      },
      {
        date: "Nov 13",
        text: (
          <>
            Published standalone walkthrough for{" "}
            <Link href="/writeups/hackthebox/starting-point-tier-1#2-pennyworth" className="text-sky-400 hover:underline">
              Pennyworth
            </Link>
            .
          </>
        ),
      },
      {
        date: "Nov 12",
        text: (
          <>
            Solved 4 HTB Starting Point Tier 1 machines: <strong>Ignition</strong>, <strong>Pennyworth</strong>,{" "}
            <strong>Tactics</strong>, and <strong>Vaccine</strong>.
          </>
        ),
      },
      {
        date: "Nov 09",
        text: (
          <>
            Solved HTB Starting Point Tier 1 machine: <strong>Bike</strong>.
          </>
        ),
      },
    ],
  },
  {
    range: "Week of Nov 02 – Nov 08, 2026",
    activities: [
      {
        date: "Nov 05",
        text: (
          <>
            Published comprehensive walkthroughs for{" "}
            <Link href="/writeups/hackthebox/starting-point-tier-1" className="text-sky-400 hover:underline">
              Starting Point Tier 0 &amp; Tier 1
            </Link>{" "}
            with solve badges.
          </>
        ),
      },
      {
        date: "Nov 05",
        text: (
          <>
            Updated pwn.college <strong>Web Security</strong> writeup module.
          </>
        ),
      },
      {
        date: "Nov 05",
        text: (
          <>
            Published technical reference notes on <strong>Git &amp; GitHub Workflows</strong>.
          </>
        ),
      },
      {
        date: "Nov 04",
        text: (
          <>
            5-machine solve streak on HTB Tier 0: <strong>Explosion</strong>, <strong>Preignition</strong>,{" "}
            <strong>Mongod</strong>, <strong>Synced</strong>, and <strong>Funnel</strong>.
          </>
        ),
      },
      {
        date: "Nov 04",
        text: (
          <>
            Completed HTB Academy modules: <strong>Getting Started</strong> and{" "}
            <strong>Introduction to Windows Command Line</strong>.
          </>
        ),
      },
      {
        date: "Nov 03",
        text: (
          <>
            Published reference notes on{" "}
            <Link href="/notes/windows-command-line" className="text-sky-400 hover:underline">
              Windows Command Line
            </Link>
            .
          </>
        ),
      },
      {
        date: "Nov 02",
        text: (
          <>
            Completed HTB Academy module: <strong>Pentest in a Nutshell</strong>.
          </>
        ),
      },
      {
        date: "Nov 02",
        text: (
          <>
            Updated <strong>Python Programming</strong> challenge writeups (DSU Cyber Camp).
          </>
        ),
      },
    ],
  },
  {
    range: "Week of Oct 26 – Nov 01, 2026",
    activities: [
      {
        date: "Nov 01",
        text: (
          <>
            Earned <strong>Orange Belt</strong> on pwn.college (<em>Intro to Cybersecurity</em> track) and restructured writeups to modular architecture.
          </>
        ),
      },
      {
        date: "Oct 30",
        text: (
          <>
            Published PortSwigger Web Security Academy writeup:{" "}
            <Link href="/writeups/portswigger/csrf-vulnerability-with-no-defenses" className="text-sky-400 hover:underline">
              CSRF Vulnerability with No Defenses
            </Link>
            .
          </>
        ),
      },
      {
        date: "Oct 30",
        text: (
          <>
            Published Hack The Box Season 12 Aero writeup:{" "}
            <Link href="/writeups/hackthebox/layover" className="text-sky-400 hover:underline">
              Layover
            </Link>
            .
          </>
        ),
      },
      {
        date: "Oct 30",
        text: (
          <>
            Published project case study for{" "}
            <Link href="/projects/tgdownloader" className="text-sky-400 hover:underline">
              TG Downloader v2
            </Link>
            .
          </>
        ),
      },
    ],
  },
];

export default function NowPage() {
  const lastUpdated = "November 22, 2026";

  return (
    <div className="max-w-3xl">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-sky-400 mb-2">
          Status &amp; Real-Time Focus
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100 font-mono">Now</h1>
        <p className="mt-2 text-xs text-slate-400 font-mono tracking-wider uppercase">
          Last updated: {lastUpdated} | query_focus()
        </p>
      </header>

      <div className="space-y-8 text-slate-300">
        <p className="text-base text-slate-200 leading-relaxed">
          This is a snapshot of what I&apos;m actively learning, practicing, and solving right now, followed by a weekly chronological log of my activities.
        </p>

        {/* Current Focus Areas */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 font-mono border-b border-slate-800 pb-2">
            Current Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-800 bg-slate-950/30">
              <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-semibold block mb-2">
                Offensive Security &amp; Labs
              </span>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">•</span>
                  <span>Working through Hack The Box Academy modules and active lab machines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">•</span>
                  <span>Solving web vulnerabilities across PortSwigger Academy and pwn.college.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 select-none">•</span>
                  <span>Hunting on private bug bounty programs with focus on business logic &amp; API flaws.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 border border-slate-800 bg-slate-950/30">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-2">
                Reading &amp; Engineering
              </span>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none">•</span>
                  <span>
                    Started reading <em>Hacking APIs</em> by Corey J. Ball.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none">•</span>
                  <span>
                    Red Hat RHCSA study track (<Link href="https://learnrhcsa.com" className="text-sky-400 hover:underline">LearnRHCSA</Link> / DexTutor).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none">•</span>
                  <span>Picking up Go for small systems CLI utilities and automation tooling.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Weekly Activity Logs */}
        <section className="space-y-6 pt-4">
          <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              Weekly Activity Log
            </h2>
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              HTB · Labs · Writeups · Research
            </span>
          </div>

          <div className="space-y-6">
            {WEEKLY_LOGS.map((week) => (
              <div
                key={week.range}
                className="border border-slate-800 bg-slate-950/20 p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm sm:text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                    <span>{week.range}</span>
                  </h3>
                  {week.badge && (
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-sky-500/40 bg-sky-500/10 text-sky-400">
                      {week.badge}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 text-sm">
                  {week.activities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-sky-400 whitespace-nowrap pt-0.5 w-16 sm:w-20 shrink-0">
                        {item.date}
                      </span>
                      <span className="text-slate-300 leading-relaxed">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-slate-500 font-mono italic">
          Activities updated regularly from my terminal and social feeds. Simple.
        </p>
      </div>
    </div>
  );
}
