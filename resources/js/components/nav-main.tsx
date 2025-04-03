import { useEffect, useState } from 'react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const currentUrl = page.url;

    const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});

    const toggleGroup = (groupTitle: string) => {
        setOpenGroups((prev) => ({
            ...prev,
            [groupTitle]: !prev[groupTitle],
        }));
    };

    useEffect(() => {
        items.forEach((item) => {
            if (item.children) {
                const found = item.children.find((child) => child.href === currentUrl);
                if (found) {
                    setOpenGroups((prev) => ({
                        ...prev,
                        [item.title]: true,
                    }));
                }
            }
        });
    }, [currentUrl, items]);

    return (
        <SidebarGroup className="px-2 py-0 overflow-x-hidden">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (item.children) {
                        const isOpen = openGroups[item.title] ?? false;

                        return (
                            <SidebarMenuItem key={item.title} className="overflow-x-hidden">
                                <SidebarMenuButton
                                    onClick={() => toggleGroup(item.title)}
                                    className="flex items-center"
                                >
                                    {item.icon && <item.icon />}
                                    <span className="flex-1">{item.title}</span>
                                    {isOpen ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
                                </SidebarMenuButton>

                                {isOpen && (
                                    <SidebarMenu className="space-y-1 overflow-hidden">
                                        {item.children.map((child) => (
                                            <SidebarMenuItem key={child.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={child.href === currentUrl}
                                                    className="pl-8 truncate"
                                                >
                                                    <Link href={child.href} className="flex items-center">
                                                        {child.icon && <child.icon />}
                                                        <span className="ml-2">{child.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                )}
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.href === currentUrl}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
