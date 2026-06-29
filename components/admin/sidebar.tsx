"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Package,
  Settings,
  Home,
  ChevronRight,
  Bot,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/posts",
    label: "Posts",
    icon: FileText,
    exact: false,
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/plano-editorial",
    label: "Plano Editorial",
    icon: ClipboardList,
    exact: false,
  },
  {
    href: "/admin/config/afiliados",
    label: "Afiliados",
    icon: Settings,
    exact: false,
  },
  {
    href: "/admin/config/ia",
    label: "IA & Geração",
    icon: Bot,
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block leading-none">
              Domus Digital
            </span>
            <span className="text-xs text-gray-400">Painel Admin</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          target="_blank"
        >
          <Home className="h-3 w-3" />
          Ver site público
        </Link>
      </div>
    </aside>
  );
}
