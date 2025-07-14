import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    /* ------------------------------------------------- */
    /* Helpers                                           */
    /* ------------------------------------------------- */
    const toggleGroup = (key: string) => setOpenGroups((p) => ({ ...p, [key]: !p[key] }));

    const clean = (p = '') => p.replace(/\/+$/, ''); // strip trailing /

    const isActive = (href?: string) => href && (clean(currentUrl).startsWith(clean(href)) || clean(href).startsWith(clean(currentUrl)));

    /** Recursively decide if any descendant is active */
    const hasActiveDesc = (item: NavItem): boolean => (item.children ? item.children.some((c) => isActive(c.href) || hasActiveDesc(c)) : false);

    /* Auto-open any parent whose subtree matches current URL */
    useEffect(() => {
        items.forEach((item) => {
            if (hasActiveDesc(item)) {
                setOpenGroups((p) => ({ ...p, [item.title]: true }));
            }
        });
    }, [currentUrl, items]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ------------------------------------------------- */
    /* Recursive render                                  */
    /* ------------------------------------------------- */
    const renderItems = (navs: NavItem[], depth = 0) =>
        navs.map((item) => {
            const withIcon = item.icon ? <item.icon /> : null;

            /* ---------- GROUP ---------- */
            if (item.children?.length) {
                const open = openGroups[item.title] ?? false;

                return (
                    <SidebarMenuItem key={item.title} className="overflow-x-hidden">
                        <SidebarMenuButton onClick={() => toggleGroup(item.title)} className="flex items-center">
                            {withIcon}
                            <span className="flex-1 truncate">{item.title}</span>
                            {open ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
                        </SidebarMenuButton>

                        {open && <SidebarMenu className="space-y-1 overflow-hidden">{renderItems(item.children, depth + 1)}</SidebarMenu>}
                    </SidebarMenuItem>
                );
            }

            /* ---------- LEAF ---------- */
            return (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} className={`truncate pl-${depth * 4}`}>
                        <Link href={item.href ?? '#'} prefetch>
                            {withIcon}
                            <span className="ml-2">{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            );
        });

    /* ------------------------------------------------- */
    /* Render root group                                 */
    /* ------------------------------------------------- */
    return (
        <SidebarGroup className="overflow-x-hidden px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{renderItems(items)}</SidebarMenu>
        </SidebarGroup>
    );
}
