export interface PlatformTheme {
  name: string;
  text: string;
  hoverText: string;
  border: string;
  bg: string;
  chip: string;
  borderHover: string;
  actionHover: string;
  badge: string;
  accentBg: string;
}

export function getPlatformTheme(platformSlug: string): PlatformTheme {
  switch (platformSlug) {
    case "hackthebox":
      return {
        name: "Hack The Box",
        text: "text-emerald-400",
        hoverText: "hover:text-emerald-400",
        border: "border-emerald-500/40",
        bg: "bg-emerald-950/30",
        chip: "border-emerald-500/40 text-emerald-400 bg-emerald-950/30",
        borderHover: "hover:border-emerald-500/60",
        actionHover: "group-hover:text-emerald-400",
        badge: "border-emerald-500/40 text-emerald-400 group-hover:border-emerald-400 group-hover:text-emerald-300",
        accentBg: "bg-emerald-400",
      };
    case "portswigger":
      return {
        name: "PortSwigger",
        text: "text-orange-400",
        hoverText: "hover:text-orange-400",
        border: "border-orange-500/40",
        bg: "bg-orange-950/30",
        chip: "border-orange-500/40 text-orange-400 bg-orange-950/30",
        borderHover: "hover:border-orange-500/60",
        actionHover: "group-hover:text-orange-400",
        badge: "border-orange-500/40 text-orange-400 group-hover:border-orange-400 group-hover:text-orange-300",
        accentBg: "bg-orange-400",
      };
    case "pwn-college":
      return {
        name: "pwn.college",
        text: "text-yellow-400",
        hoverText: "hover:text-yellow-400",
        border: "border-yellow-500/40",
        bg: "bg-yellow-950/30",
        chip: "border-yellow-500/40 text-yellow-400 bg-yellow-950/30",
        borderHover: "hover:border-yellow-500/60",
        actionHover: "group-hover:text-yellow-400",
        badge: "border-yellow-500/40 text-yellow-400 group-hover:border-yellow-400 group-hover:text-yellow-300",
        accentBg: "bg-yellow-400",
      };
    default:
      return {
        name: platformSlug,
        text: "text-sky-400",
        hoverText: "hover:text-sky-400",
        border: "border-sky-500/30",
        bg: "bg-sky-950/20",
        chip: "border-sky-500/30 text-sky-400 bg-sky-950/20",
        borderHover: "hover:border-slate-600",
        actionHover: "group-hover:text-sky-400",
        badge: "border-slate-700 text-slate-300 group-hover:border-sky-400 group-hover:text-sky-400",
        accentBg: "bg-sky-400",
      };
  }
}
