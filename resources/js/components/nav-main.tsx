import { Badge } from '@/components/ui/badge';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sectionColor } from './app-sidebar';

/* ---------- types ---------- */
interface Counters {
    sales_sub?: number;
    sales_resp?: number;
    purch_sub?: number;
    purch_resp?: number;
}

/* ---------- component ---------- */
export function NavMain({ items = [], counters = {} }: { items: NavItem[]; counters?: Counters }) {
    const { url: currentUrl } = usePage<{ url: string }>();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    /* ---------- helpers ---------- */
    const toggle = (k: string) => setOpenGroups((p) => ({ ...p, [k]: !p[k] }));

    const cleanPath = (p = '') => p.replace(/\/+$/, '');

    const isActive = (href?: string) => {
        if (!href) return false;
        const cur = cleanPath(currentUrl);
        const base = cleanPath(href);
        return cur === base || cur.startsWith(base + '/');
    };

    const hasActiveDesc = (item: NavItem): boolean => (item.children ? item.children.some((c) => isActive(c.href) || hasActiveDesc(c)) : false);

    /* auto‑expand groups that contain current route */
    useEffect(() => {
        items.forEach((item) => {
            if (hasActiveDesc(item)) setOpenGroups((p) => ({ ...p, [item.title]: true }));
        });
    }, [currentUrl, items]);

    /* which high‑level branch are we inside? */
    const branchPath = (item: NavItem, parents: string[]): 'sales' | 'purchases' | null => {
        const chain = [...parents, item.title.toLowerCase()];
        if (chain.includes('sales')) return 'sales';
        if (chain.includes('purchases')) return 'purchases';
        return null;
    };

    /* counts for group badges */
    const groupCount = (title: string, c: Counters): number | null => {
        switch (title) {
            case 'Inbox':
                return (c.sales_sub ?? 0) + (c.sales_resp ?? 0) + (c.purch_sub ?? 0) + (c.purch_resp ?? 0);
            case 'Purchases':
                return (c.purch_sub ?? 0) + (c.purch_resp ?? 0);
            case 'Sales':
                return (c.sales_sub ?? 0) + (c.sales_resp ?? 0);
            default:
                return null;
        }
    };

    /* ---------- recursive renderer ---------- */
    const render = (navs: NavItem[], depth = 0, colour = '--color-primary', parents: string[] = []) =>
        navs.map((item) => {
            const branch = branchPath(item, parents);
            const colourVar = depth === 0 ? sectionColor(item.title) : colour;
            const icon = item.icon ? <item.icon className="h-5 w-5 shrink-0" style={{ color: `var(${colourVar})` }} /> : null;
            const isGroup = !!item.children?.length;

            /* ---------- GROUP ---------- */
            if (isGroup) {
                const open = openGroups[item.title] ?? false;
                const hasActiveChild = hasActiveDesc(item);
                const gCount = groupCount(item.title, counters); // 🔹 new

                return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            onClick={() => toggle(item.title)}
                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                                depth === 0
                                    ? 'text-[color:var(--color-sidebar-foreground)] hover:bg-[color:var(--color-sidebar-accent)]'
                                    : 'hover:bg-[color:var(--color-sidebar-subtle)]'
                            } ${open || hasActiveChild ? 'bg-[color:var(--color-sidebar-accent)]' : ''}`}
                            style={{ paddingLeft: depth ? `${depth * 0.75}rem` : undefined }}
                        >
                            {icon}
                            <span className="truncate">{item.title}</span>

                            {/* badge on group */}
                            {gCount !== null && <Badge className="ml-auto rounded-full bg-red-600 px-2 text-xs text-white">{gCount}</Badge>}

                            {/* chevron (pushes right when no badge) */}
                            {gCount !== null ? (
                                open ? (
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                ) : (
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                )
                            ) : open ? (
                                <ChevronDown className="ml-auto h-4 w-4" />
                            ) : (
                                <ChevronRight className="ml-auto h-4 w-4" />
                            )}
                        </SidebarMenuButton>

                        {open && (
                            <div className="overflow-hidden transition-all">
                                <SidebarMenu className="space-y-1 py-1">
                                    {render(item.children!, depth + 1, colourVar, [...parents, item.title.toLowerCase()])}
                                </SidebarMenu>
                            </div>
                        )}
                    </SidebarMenuItem>
                );
            }

            /* ---------- LEAF ---------- */
            const active = isActive(item.href);

            /** count = 0 | 1 | 2 | …   (null = no badge for this leaf) */
            const count =
                item.title === 'Sub' && branch === 'sales'
                    ? (counters.sales_sub ?? 0)
                    : item.title === 'Sub' && branch === 'purchases'
                      ? (counters.purch_sub ?? 0)
                      : item.title === 'Responsible' && branch === 'sales'
                        ? (counters.sales_resp ?? 0)
                        : item.title === 'Responsible' && branch === 'purchases'
                          ? (counters.purch_resp ?? 0)
                          : null;

            return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        className={`flex items-center gap-2 truncate rounded-md px-3 py-2 text-sm ${
                            active
                                ? 'bg-[color:var(--color-sidebar-accent)] font-semibold text-[color:var(--color-sidebar-primary)]'
                                : 'text-[color:var(--color-sidebar-foreground)] hover:bg-[color:var(--color-sidebar-accent)]'
                        }`}
                        style={{
                            paddingLeft: depth ? `${depth * 0.75}rem` : undefined,
                            borderLeft: active ? `4px solid var(${colourVar})` : undefined,
                        }}
                    >
                        <Link href={item.href ?? '#'} prefetch className="flex w-full items-center gap-2">
                            {icon}
                            <span>{item.title}</span>

                            {count !== null && <Badge className="ml-auto rounded-full bg-red-600 px-2 text-xs text-white">{count}</Badge>}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        });

    /* ---------- render root ---------- */
    return <SidebarMenu className="space-y-1">{render(items)}</SidebarMenu>;
}
