import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now",
  description: "What †hε drεαmεr is working on, learning, and focusing on right now.",
};

export default function NowPage() {
  const lastUpdated = "October 2026";

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
              Started studying AZ-900 (Microsoft Azure Fundamentals) — still in progress.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Learning <strong>Go</strong> — picking it up in between infra work, next stop: small CLI tools.
            </li>
            <li>
              Daily-driving <Link href="https://github.com/DDreamer01/dotfiles" className="text-sky-400 hover:underline">Hyprland</Link> — my obsidian &lsquo;Last Horizon&rsquo; rice (Waybar, Rofi, SwayNC) plus an agent-built <Link href="https://github.com/DDreamer01/neovim" className="text-sky-400 hover:underline">Neovim IDE</Link> config.
            </li>
            <li>
              Working through <strong>Hack The Box Season 12 (Aero)</strong> and the PortSwigger Web Security Academy — solving and writing everything up in my new <Link href="/writeups" className="text-sky-400 hover:underline">Writeups</Link> section.
            </li>
            <li>
              Hardened this site&rsquo;s self-hosting: GitHub Actions CI/CD deploying to my Azure box, Giscus comments, and security headers.
            </li>
            <li>
              Still on RHCSA track via <Link href="https://learnrhcsa.com" className="text-sky-400 hover:underline">LearnRHCSA.Com</Link> and <Link href="https://www.youtube.com/@DexTutor" className="text-sky-400 hover:underline">DexTutor YT</Link>.
            </li>
            <li>
              Consolidated TG Downloader into a single resilient v2 package and added its <Link href="/projects/tgdownloader" className="text-sky-400 hover:underline">case study</Link> here.
            </li>
            <li>
              AI-assisted engineering is now the default workflow — coding agents build configs, scaffold content, and ship deploys; I architect and review.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 font-mono">
            {"// Shipped Recently"}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Built a vulnerable lab, a school lookup site, and a readme preview site.
            </li>
            <li>
              Completed an abandoned VPN project script I helped build for a friend.
            </li>
            <li>
              Made some UI updates and UX improvements to FileStation
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
