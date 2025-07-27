import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sectionColor } from './app-sidebar'; // ⬅️ re‑use helper

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    /* ------------------------------------------------- */
    /* Helpers                                           */
    /* ------------------------------------------------- */
    const toggle = (k: string) => setOpenGroups((p) => ({ ...p, [k]: !p[k] }));
    const strip = (p = '') => p.replace(/\/+$/, '');
    /* helper – strip trailing slashes so "/sales/" === "/sales" */
    const cleanPath = (p: string = '') => p.replace(/\/+$/, '');
    const isActive = (href?: string) => {
        if (!href) return false;

        const cur = cleanPath(currentUrl);
        const base = cleanPath(href);

        // active if current URL is the link itself or nested under it
        return cur === base || cur.startsWith(base + '/');
    };
    const hasActiveDesc = (item: NavItem): boolean => (item.children ? item.children.some((c) => isActive(c.href) || hasActiveDesc(c)) : false);

    // Auto‑open parents that own current route
    useEffect(() => {
        items.forEach((item) => {
            if (hasActiveDesc(item)) setOpenGroups((p) => ({ ...p, [item.title]: true }));
        });
    }, [currentUrl, items]);

    /* ------------------------------------------------- */
    /* Recursive render                                  */
    /* ------------------------------------------------- */
    const render = (navs: NavItem[], depth = 0, colour = '--color-primary') =>
        navs.map((item) => {
            const colourVar = depth === 0 ? sectionColor(item.title) : colour;
            const icon = item.icon ? <item.icon className="h-5 w-5 shrink-0" style={{ color: `var(${colourVar})` }} /> : null;

            /* ---------- GROUP ---------- */
            if (item.children?.length) {
                const open = openGroups[item.title] ?? false;

                return (
                    <SidebarMenuItem key={item.title} className="overflow-x-hidden">
                        <SidebarMenuButton
                            onClick={() => toggle(item.title)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[color:var(--color-sidebar-foreground)] hover:bg-[color:var(--color-sidebar-accent)] hover:text-[color:var(--color-sidebar-accent-foreground)]"
                            style={{ paddingLeft: depth ? `${depth * 0.75}rem` : undefined }}
                        >
                            {icon}
                            <span className="flex-1 truncate">{item.title}</span>
                            {open ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />}
                        </SidebarMenuButton>

                        {open && <SidebarMenu className="space-y-1 overflow-hidden">{render(item.children, depth + 1, colourVar)}</SidebarMenu>}
                    </SidebarMenuItem>
                );
            }

            /* ---------- LEAF ---------- */
            const active = isActive(item.href);
            return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        className={`flex items-center gap-2 truncate rounded-md px-3 py-2 text-sm ${
                            active
                                ? 'bg-[color:var(--color-sidebar-accent)] font-semibold text-[color:var(--color-sidebar-primary)]'
                                : 'text-[color:var(--color-sidebar-foreground)] hover:bg-[color:var(--color-sidebar-accent)] hover:text-[color:var(--color-sidebar-accent-foreground)]'
                        }`}
                        style={{
                            paddingLeft: depth ? `${depth * 0.75}rem` : undefined,
                            borderLeft: active ? `4px solid var(${colourVar})` : undefined,
                        }}
                    >
                        <Link href={item.href ?? '#'} prefetch className="flex w-full items-center gap-2">
                            {icon}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        });

    /* ------------------------------------------------- */
    /* Render root                                       */
    /* ------------------------------------------------- */
    return (
        <SidebarGroup className="overflow-x-hidden px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{render(items)}</SidebarMenu>
        </SidebarGroup>
    );
}
