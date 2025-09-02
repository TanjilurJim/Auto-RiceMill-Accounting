import { Badge } from '@/components/ui/badge';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'; // ✅ add useRef + useState
import { sectionColor } from './app-sidebar';

/* ---------- types ---------- */
interface Counters {
    sales_sub?: number;
    sales_resp?: number;
    purch_sub?: number;
    purch_resp?: number;
}

const scrollOpts: ScrollIntoViewOptions = { behavior: 'smooth', block: 'nearest', inline: 'nearest' };

export function NavMain({ items = [], counters = {} }: { items: NavItem[]; counters?: Counters }) {
    const { url: currentUrl } = usePage<{ url: string }>();

    // ✅ declare state/refs
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // ✅ stable key per node (prevents collisions for duplicate titles)
    const nodeKey = (item: NavItem, parents: string[]) => {
        const id = item.href ?? item.title;
        return [...parents, id].join('>');
    };

    /* ---------- helpers ---------- */
    const toggle = (k: string) =>
        setOpenGroups((p) => {
            const next = { ...p, [k]: !p[k] };
            requestAnimationFrame(() => {
                if (next[k]) groupRefs.current[k]?.scrollIntoView(scrollOpts);
            });
            return next;
        });

    const cleanPath = (p = '') => p.replace(/\/+$/, '');

    const isActive = (href?: string) => {
        if (!href) return false;
        const cur = cleanPath(currentUrl);
        const base = cleanPath(href);

        if (cur === base) return true;

        // Guard: don't light up Transaction Purchases for Inbox/Approvals routes
        if (base === '/purchases') {
            if (cur.startsWith('/purchases/inbox')) return false;
            if (cur.startsWith('/purchases/approvals')) return false;
            return cur.startsWith('/purchases/');
        }
        if (base === '/sales') {
            if (cur.startsWith('/sales/inbox')) return false;
            if (cur.startsWith('/sales/approvals')) return false;
            return cur.startsWith('/sales/');
        }

        return cur.startsWith(base + '/');
    };

    const hasActiveDesc = (item: NavItem): boolean => (item.children ? item.children.some((c) => isActive(c.href) || hasActiveDesc(c)) : false);

    // which high-level branch are we inside? (for counters)
    const branchPath = (item: NavItem, parents: string[]): 'sales' | 'purchases' | null => {
        const chain = [...parents, item.title.toLowerCase()];
        if (chain.includes('sales')) return 'sales';
        if (chain.includes('purchases')) return 'purchases';
        return null;
    };

    // counts for group badges
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

    // ✅ open all ancestor groups for the current route, using unique keys
    const collectActiveGroups = (navs: NavItem[], parents: string[] = [], acc: string[] = []): string[] => {
        navs.forEach((item) => {
            if (item.children?.length) {
                const k = nodeKey(item, parents);
                if (hasActiveDesc(item)) {
                    acc.push(k);
                    collectActiveGroups(item.children, [...parents, item.href ?? item.title], acc);
                } else {
                    collectActiveGroups(item.children, [...parents, item.href ?? item.title], acc);
                }
            }
        });
        return acc;
    };

    useEffect(() => {
        const mustBeOpen = collectActiveGroups(items, []);
        setOpenGroups((prev) => {
            const next = { ...prev };
            let changed = false;
            mustBeOpen.forEach((k) => {
                if (!next[k]) {
                    next[k] = true;
                    changed = true;
                }
            });
            return changed ? next : prev;
        });

        requestAnimationFrame(() => {
            const deepest = mustBeOpen[mustBeOpen.length - 1];
            if (deepest) groupRefs.current[deepest]?.scrollIntoView(scrollOpts);
        });
    }, [currentUrl, items]);

    // ❌ REMOVE the old title-based auto-expand effect (it fights with the new keys)
    // useEffect(() => {
    //   items.forEach((item) => {
    //     if (hasActiveDesc(item)) setOpenGroups((p) => ({ ...p, [item.title]: true }));
    //   });
    // }, [currentUrl, items]);

    /* ---------- recursive renderer ---------- */
    const render = (navs: NavItem[], depth = 0, colour = '--color-primary', parents: string[] = []) =>
        navs.map((item) => {
            const key = nodeKey(item, parents);
            const isGroup = !!item.children?.length;
            const colourVar = depth === 0 ? sectionColor(item.title) : colour;
            const icon = item.icon ? <item.icon className="h-5 w-5 shrink-0" style={{ color: `var(${colourVar})` }} /> : null;

            if (isGroup) {
                const open = openGroups[key] ?? false;
                const hasActiveChild = hasActiveDesc(item);
                const gCount = groupCount(item.title, counters);

                return (
                    <SidebarMenuItem key={key}>
                        <div ref={(el) => (groupRefs.current[key] = el)}>
                            <SidebarMenuButton
                                onClick={() => toggle(key)}
                                data-state={open ? 'open' : 'closed'}
                                aria-expanded={open}
                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                                    depth === 0
                                        ? 'text-[color:var(--color-sidebar-foreground)] hover:bg-[color:var(--color-sidebar-accent)]'
                                        : 'hover:bg-[color:var(--color-sidebar-subtle)]'
                                } ${open || hasActiveChild ? 'bg-[color:var(--color-sidebar-accent)]' : ''}`}
                                style={{ paddingLeft: depth ? `${depth * 0.75}rem` : undefined }}
                            >
                                {icon}
                                <span className="truncate">{item.title}</span>
                                {gCount !== null && <Badge className="ml-auto rounded-full bg-red-600 px-2 text-xs text-white">{gCount}</Badge>}
                                <ChevronRight className={`ml-auto h-4 w-4 transform transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                            </SidebarMenuButton>

                            <div
                                className={`grid transition-[grid-template-rows] duration-350 ease-linear ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                            >
                                <div className="overflow-hidden">
                                    <SidebarMenuSub>
                                        {render(item.children!, depth + 1, colourVar, [...parents, item.href ?? item.title])}
                                    </SidebarMenuSub>
                                </div>
                            </div>
                        </div>
                    </SidebarMenuItem>
                );
            }

            // ✅ define branch before using it for counters
            const branch = branchPath(item, parents);
            const active = isActive(item.href);

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
                <SidebarMenuItem key={key}>
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
                        <Link href={item.href ?? '#'} prefetch preserveScroll className="flex w-full items-center gap-2">
                            {icon}
                            <span>{item.title}</span>
                            {count !== null && <Badge className="ml-auto rounded-full bg-red-600 px-2 text-xs text-white">{count}</Badge>}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        });

    return <SidebarMenu className="space-y-1">{render(items)}</SidebarMenu>;
}
