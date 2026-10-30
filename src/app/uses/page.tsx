import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "†hε drεαmεr's setup: hardware, servers, home lab, software tools, terminal configuration, and self-hosted apps.",
};

const GEAR = [
  {
    category: "Hardware & Home Lab",
    items: [
      { name: "Primary Workstation", desc: "Dell Precision 5540, Intel Core i9, 32GB RAM." },
      // { name: "Server Node 01", desc: "Intel NUC (i5-1135G7, 64GB RAM, 2TB NVMe). Virtualization host running Proxmox VE." },
      // { name: "Server Node 02", desc: "Custom Mini-ITX build (AMD Ryzen 5 5600G, 32GB RAM, 8TB HDD pool). Running TrueNAS Scale." },
    ],
  },
  {
    category: "Software & Terminal",
    items: [
      { name: "Operating System", desc: "Kali Linux (Desktop)." },
      { name: "Desktop Environment", desc: "Hyprland (Wayland) with Waybar, Rofi, SwayNC, Hyprlock — obsidian 'Last Horizon' rice, tuned for NVIDIA Turing GPUs (see dotfiles)." },
      { name: "Terminal Emulator", desc: "Kitty — GPU-accelerated, obsidian-themed. Still pairing Tmux for remote session management." },
      { name: "Text Editor / IDE", desc: "Neovim — a modular Lua-based IDE config (lazy.nvim, TokyoNight, Go/Python tooling) evolved by my coding agents; Neovide as GUI, VS Code for the rest." },
      { name: "Shell & Prompt", desc: "Zsh." },
      { name: "Languages", desc: "Bash, Python, and Go (learning)." },
    ],
  },
  {
    category: "Self-Hosted Infrastructure",
    items: [
      { name: "Nextcloud", desc: "Self hosted cloud storage platform." },
      { name: "FileStation", desc: "Python server for uploading and moving files around." },
      { name: "Schlookup", desc: "Retrieve verified administrative address and contact of Universities."},
      { name: "README Studio", desc: "Create, preview, and beautify your README files."}
    ],
  },
];

export default function UsesPage() {
  return (
    <div className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Uses</h1>
        <p className="mt-2 text-sm text-slate-400 font-mono">system.list_hardware_and_software()</p>
      </header>

      <div className="space-y-8 text-slate-300">
        <p className="text-base text-slate-200">
          This is a detailed list of the hardware, servers, operating systems, self-hosted configurations, and development tools I use daily.
        </p>

        {GEAR.map((group) => (
          <section key={group.category} className="mt-8">
            <h2 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-2 mb-4 font-mono">
              {"//"} {group.category}
            </h2>
            <ul className="space-y-4">
              {group.items.map((item) => (
                <li key={item.name} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                  <span className="font-mono text-sm font-semibold text-emerald-400 sm:w-48 shrink-0">
                    {item.name}
                  </span>
                  <span className="text-sm text-slate-300">{item.desc}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
