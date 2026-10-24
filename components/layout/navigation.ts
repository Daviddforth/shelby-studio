import {
  BookOpen,
  Bot,
  Clapperboard,
  Code2,
  LayoutDashboard,
  Radio,
  Search,
  UploadCloud,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Replaced by the creator's public page once a wallet is connected. */
  isMyPage?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** One menu for the sidebar and the phone menu, so they never drift apart. */
export const navSections: NavSection[] = [
  {
    title: "Create",
    items: [
      { name: "Home", href: "/dashboard", icon: LayoutDashboard },
      { name: "Upload", href: "/storage", icon: UploadCloud },
      { name: "Library", href: "/library", icon: Clapperboard },
      { name: "Go Live", href: "/live", icon: Radio },
      { name: "My Page", href: "/library", icon: UserCircle2, isMyPage: true },
    ],
  },
  {
    title: "More",
    items: [
      { name: "Explorer", href: "/explorer", icon: Search },
      { name: "Developer", href: "/developer", icon: Code2 },
      { name: "Documentation", href: "/docs", icon: BookOpen },
    ],
  },
];

// The AI Tools page is left out of the menu until it is connected to a real model.
export const hiddenPages = [{ name: "AI Tools", href: "/ai", icon: Bot }];
