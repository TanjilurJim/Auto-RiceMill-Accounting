import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, Folder, LayoutGrid, Lock, Wallet, Shield, Users, Settings2, CalendarCheck2, Building2, Landmark, Banknote,ClipboardList,ReceiptText,RotateCcw,ShoppingCart,Package, Boxes, FolderKanban, InfoIcon, BanknoteIcon } from 'lucide-react';
import AppLogo from './app-logo';

interface Role {
    name: string;
}

interface AuthUser {
    user: string;
    roles: Role[];
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Account Info',
        icon : InfoIcon,
        children: [
            {
                title: 'Account Groups',
                href: '/account-groups',
                icon: FileText,
                roles: ['admin'], // Only admin will see this
            },
            {
                title: 'Account Ledgers',
                href: '/account-ledgers',
                icon: Landmark,
            },
            {
                title: 'Salesmen',
                href: '/salesmen',
                icon: Users,
            },
        ],
    },
    {
        title: 'Inventory Info',
        icon: Boxes,
        children: [
            {
                title: 'Godowns',
                href: '/godowns',
                icon: Boxes,
            },
            {
                title: 'Units',
                href: '/units',
                icon: Package,
            },
            {
                title: 'Category',
                href: '/categories',
                icon: FolderKanban,
            },
            {
                title: 'Items',
                href: '/items',
                icon: ClipboardList,
            },
            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },
    {
        title: 'Transaction',
        icon: BanknoteIcon,
        children: [
            {
                title: 'Purchases',
                href: '/purchases',
                icon: ShoppingCart,
            },
            {
                title: 'Purchases Return',
                href: '/purchase-returns',
                icon: RotateCcw,
            },
            {
                title: 'Sales Add and List',
                href: '/sales',
                icon: ReceiptText,
            },
            {
                title: 'Sales Order & List',
                href: '/sales-orders',
                icon: Folder,
            },
            {
                title: 'Sales Return',
                href: '/sales-returns',
                icon: RotateCcw,
            },
            {
                title: 'Received Modes',
                href: '/received-modes',
                icon: Banknote,
            },
            {
                title: 'Received Add',
                href: '/received-add',
                icon: Folder,
            },
            {
                title: 'Payment Add',
                href: '/payment-add',
                icon: Wallet,
            },
            
            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },
    {
        title: 'Settings',
        icon: Settings2,
        
        children: [
            {
                title: 'Financial Year',
                href: '/financial-years',
                icon: Users,
        
            },
            {
                title: 'Company Settings',
                href: '/company-settings',
                icon: Building2, // 👈 This icon works well for users
            },
            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: Lock, // you can change this icon to something like a shield or lock if you prefer
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: Shield, // You could use Shield or User
        //icon if preferred
    },
    {
        title: 'Users',
        href: '/users',
        icon: Users, // 👈 This icon works well for users
    },
    
];



const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];


// Recursively filter nav items based on roles
function filterNavItems(items: NavItem[], userRoles: string[]): NavItem[] {
    return items
        .map((item) => {
            // Check current item role restriction
            if (item.roles && !item.roles.some((role) => userRoles.includes(role))) {
                return null;
            }

            // Recursively filter children if they exist
            let children: NavItem[] | undefined;
            if (item.children) {
                children = filterNavItems(item.children, userRoles);
            }

            return { ...item, children };
        })
        .filter(Boolean) as NavItem[];
}
export function AppSidebar() {
    const { props } = usePage();
    const authUser = props.auth?.user;
    
    // Get user roles array (e.g., ['admin', 'manager'])
    const roles = authUser?.roles?.map((r: any) => r.name) || [];

    // Apply role-based filtering to mainNavItems
    const filteredNavItems = filterNavItems(mainNavItems, roles);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

