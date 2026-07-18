"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { useLocale } from "@/lib/i18n/LocaleContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const [checked, setChecked] = useState(false);

  const navItems = [
    { href: "/calendario", label: t.nav.calendar, icon: "📅" },
    { href: "/barcas", label: t.nav.boats, icon: "🚤" },
    { href: "/recursos", label: t.nav.resources, icon: "📎" },
  ];

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- token presence can only be read client-side
    setChecked(true);
  }, [router]);

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch {
      // ignore, we clear the local token regardless
    }
    clearToken();
    router.replace("/login");
  }

  if (!checked) return null;

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <header className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-white px-4 py-3">
        <span className="shrink-0 text-base font-semibold text-brand">
          Gemelli Boat
        </span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-zinc-500 active:text-zinc-700"
          >
            {t.nav.logout}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                active ? "text-brand" : "text-zinc-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
