import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now",
  description: "What †hε drεαmεr is working on, learning, and focusing on right now.",
};

export default function NowPage() {
  const lastUpdated = "July 2026";

  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Now</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">
          Last updated: {lastUpdated} | query_focus()
        </p>
      </header>

      <div className="space-y-6 text-slate-300">
        <p className="text-base text-slate-200">
          This is a snapshot of my current priorities, focus areas, and active projects.
        </p>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 font-mono">
            {"// Learning & Experiments"}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Learnt Git for version control, using resources like the <Link href="https://git-scm.com/book/en/v2" className="text-sky-400 hover:underline">Pro Git Book</Link>, <Link href="https://learn.microsoft.com/en-us/training/modules/intro-to-git/" className="text-sky-400 hover:underline">Introduction to Git</Link> on Microsoft Learn, alongside Github's skill <Link href="https://github.com/DDreamer01/skills-introduction-to-git" className="text-sky-400 hover:underline">Introduction to Git.</Link>
            </li>
            <li>
              Signed up for <Link href="https://developers.redhat.com" className="text-sky-400 hover:underline">Red Hat Developer Subscription.</Link>
            </li>
            <li>
              Started studying AZ-900 (Microsoft Azure Fundamentals).
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Halted Sander Van Vugts Oreilly's course as my  trial is up 😅. Now using resources like <Link href="https://learnrhcsa.com" className="text-sky-400 hover:underline">LearnRHCSA.Com</Link> (looks AI generated but quite resourceful), <Link href="https://https://www.youtube.com/@DexTutor" className="text-sky-400 hover:underline">DexTutor YT</Link>
            </li>
            <li>
              Started learning Go
            </li>
            <li>
              Built a vulnerable lab, a school lookup site, and a readme preview site.
            </li>
            <li>
              Completed an abandoned VPN project script I helped build for a friend.
            </li>
            <li>
              Made some UI updates and UX improvements to FileStation
            </li>
            <li>
              Started using Opencode with Deepseek V4, previously using only Antigravity with Gemini & Claude.
            </li>
          </ul>
        </section>

        <p className="mt-8 text-xs text-slate-500 italic">
          If my focus changes, I commit new details here in git and push to deploy. Simple.
        </p>
      </div>
    </div>
  );
}
