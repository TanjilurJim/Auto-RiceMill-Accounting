import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { useState, useEffect } from 'react'; 
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BanknoteIcon,
    BarChart2,
    BarChartBig,
    Boxes,
    Building2,
    CalendarClock,
    CalendarDays,
    ClipboardList,
    DownloadCloud,
    Factory,
    FileText,
    Folder,
    FolderKanban,
    History,
    InfoIcon,
    Landmark,
    Layers,
    LayoutGrid,
    Lock,
    Notebook,
    Package,
    ReceiptText,
    Repeat,
    RotateCcw,
    Scale,
    ScrollText,
    Settings2,
    Shield,
    ShoppingCart,
    Shuffle,
    UploadCloud,
    Users,
    Wallet,
    Warehouse,
    Workflow,
} from 'lucide-react';
import { FiAward, FiClock, FiHome, FiSettings, FiUsers } from 'react-icons/fi';
import AppLogo from './app-logo';

interface Role {
    name: string;
}

interface AuthUser {
    user: string;
    roles: Role[];
}

export function sectionColor(title: string): string {
    switch (title) {
        case 'Payroll':
            return '--color-warning';
        case 'Reports':
            return '--color-danger';
        case 'Crushing / Rent':
        case 'Production':
            return '--color-info';
        default:
            return '--color-primary';
    }
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Account Info',
        icon: InfoIcon,
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
                title: 'Dryers',
                href: '/dryers',
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
        title: 'Inbox',
        icon: ReceiptText,
        group: true, // Add group marker
        children: [
            {
                title: 'Purchases',
                icon: ShoppingCart,
                group: true, // Add group marker
                children: [
                    { title: 'Sub', href: '/purchases/inbox/sub', icon: ReceiptText },
                    { title: 'Responsible', href: '/purchases/inbox/resp', icon: ReceiptText },
                    { title: 'Approve-Reject Log', href: route('purchases.approvals'), icon: History },
                ],
            },
            {
                title: 'Sales',
                icon: ReceiptText,
                group: true, // Add group marker
                children: [
                    { title: 'Sub', href: '/sales/inbox/sub', icon: ReceiptText },
                    { title: 'Responsible', href: '/sales/inbox/resp', icon: ReceiptText },
                    { title: 'Approve-Reject Log', href: '/sales/approvals', icon: History },
                ],
            },
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

            // {
            //     title: 'Purchase Approve-Reject Log',
            //     href: '/purchases/approvals',
            //     icon: History, // pick any Lucide icon
            // },

            {
                title: 'Purchases Return',
                href: '/purchase-returns',
                icon: RotateCcw,
            },
            {
                title: 'Sales',
                href: '/sales',
                icon: ReceiptText,
            },

            {
                title: 'Dues',
                href: '/dues',
                icon: ReceiptText,
            },
            {
                title: 'Dues Settled',
                href: '/dues/settled',
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
            {
                title: 'Contra Add',
                href: '/contra-add',
                icon: Shuffle,
            },
            {
                title: 'Journal Add',
                href: '/journal-add',
                icon: Notebook,
            },
            {
                title: 'Stock Transfer',
                href: '/stock-transfers',
                icon: Notebook,
            },

            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },
    {
        title: 'Production',
        icon: Factory,
        children: [
            {
                title: 'Working Order',
                href: '/working-orders',
                icon: Workflow,
            },
            {
                title: 'Finished Products',
                href: '/finished-products',
                icon: Workflow,
            },
        ],
    },

    {
        title: 'Payroll',
        icon: FiSettings,

        children: [
            {
                title: 'Departament',
                href: '/departments',
                icon: FiHome,
            },
            {
                title: 'Designation',
                href: '/designations',
                icon: FiAward,
            },
            {
                title: 'Shift',
                href: '/shifts',
                icon: FiClock,
            },
            {
                title: 'Employees',
                href: '/employees',
                icon: FiUsers,
            },
            {
                title: 'Salary Slips',
                href: '/salary-slips',
                icon: FiUsers,
            },
            {
                title: 'Salary Owed',
                href: '/salary-owed',
                icon: FiUsers,
            },
            {
                title: 'Salary Payments',
                href: '/salary-receives',
                icon: FiUsers,
            },

            {
                title: 'Employee Ledger Report',
                href: '/employee-ledger',
                icon: FiUsers,
            },
            {
                title: 'Employee  Report',
                href: '/employee-reports',
                icon: FiUsers,
            },

            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },

    {
        title: 'Reports',
        icon: BarChartBig,

        children: [
            {
                title: 'Stock Report',
                href: '/reports/stock-summary',
                icon: Warehouse,
            },
            {
                title: 'Day Book',
                href: '/reports/day-book',
                icon: ScrollText, // 👈 This icon works well for users
            },
            {
                title: 'Account Book',
                href: '/reports/account-book',
                icon: ScrollText, // 👈 This icon works well for users
            },
            {
                title: 'Ledger Group Summary',
                href: '/reports/ledger-group-summary/filter',
                icon: FolderKanban, // 🗂 or use Icon that represents grouping/categories
            },
            {
                title: 'Purchase Report',
                href: '/reports/purchase/filter',
                icon: FolderKanban, // 🗂 or use Icon that represents grouping/categories
            },

            {
                title: 'Sale Report',
                href: '/reports/sale/filter',
                icon: BarChart2, // 🗂 same or pick a new icon like BarChart2 📊 if you want
            },

            {
                title: 'Receivable & Payable',
                href: '/reports/receivable-payable/filter',
                icon: Scale, // ⚖️ Choose icon like Scale or DollarSign
            },

            {
                title: 'Received & Payment',
                href: '/reports/all-received-payment/filter',
                icon: Scale, // ⚖️ Choose icon like Scale or DollarSign
            },
            {
                title: 'Profit & Loss',
                href: '/reports/profit-loss/filter',

                icon: Scale, // ⚖️ Choose icon like Scale or DollarSign
            },
            {
                title: 'Balance Sheet',
                href: '/reports/balance-sheet/filter',

                icon: Scale, // ⚖️ Choose icon like Scale or DollarSign
            },

            // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
        ],
    },

    {
        title: 'Crushing / Rent',
        icon: Warehouse,
        children: [
            {
                title: 'পার্টির পণ্য জমা',
                href: '/party-stock/deposit',
                icon: UploadCloud,
            },
            {
                title: 'পার্টির পণ্য জমা তালিকা',
                href: '/party-stock/deposit-list',
                icon: FileText,
            },
            {
                title: 'পণ্য উত্তোলন',
                href: '/party-stock/withdraw',
                icon: DownloadCloud,
            },
            {
                title: 'পণ্য উত্তোলন তালিকা',
                href: '/party-stock/withdraw-list',
                icon: FileText,
            },
            {
                title: 'পণ্য ট্রান্সফার/রুপান্তর',
                href: '/party-stock/convert',
                icon: Repeat,
            },
            {
                title: 'পণ্য ট্রান্সফার তালিকা',
                href: '/party-stock/convert-list',
                icon: FileText,
            },
            {
                title: 'ক্রাশিং ভাউচারসমূহ',
                href: '/party-stock/rent-voucher/',
                icon: FileText,
            },
            {
                title: 'ক্রাশিং রিপোর্টসমূহ',
                icon: BarChart2,
                href: '/crushing',
                children: [
                    {
                        title: 'পার্টি স্টক রিপোর্ট',
                        href: '/crushing/party-stock-report',
                        icon: Layers,
                    },
                    {
                        title: 'Rent Day Book',
                        href: '/crushing/rent-day-book',
                        icon: CalendarDays,
                    },
                ],
            },
        ],
    },

    {
        title: 'Settings',
        icon: Settings2,

        children: [
            {
                title: 'Financial Year',
                href: '/financial-years',
                icon: CalendarClock,
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
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

// Recursively filter nav items based on roles
function filterNavItems(items: NavItem[], userRoles: string[]): NavItem[] {
    return items
        .map((item) => {
            if (item.roles && !item.roles.some((r) => userRoles.includes(r))) return null;
            const children = item.children ? filterNavItems(item.children, userRoles) : undefined;
            return { ...item, children };
        })
        .filter(Boolean) as NavItem[];
}

export function AppSidebar() {
    const { props, url } = usePage<any>();
    const initialCounters = props.counters || {};
    const roles = props.auth?.user?.roles?.map((r: any) => r.name) || [];
    const userId = props.auth?.user?.id;

    // 🔹 live counters state
    const [counters, setCounters] = useState(initialCounters);

    // 🔹 subscribe once
    useEffect(() => {
        if (!userId || !window.Echo) return;

        window.Echo.private(`approvals.${userId}`).listen('ApprovalCountersUpdated', (e: any) => setCounters(e.counters));

        return () => window.Echo.leave(`private-approvals.${userId}`);
    }, [userId]);

    const filteredNavItems = filterNavItems(mainNavItems, roles);

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* ---------- Logo ---------- */}
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

            {/* ---------- Navigation ---------- */}
            <SidebarContent>
                {/* Pass colour helper down via props */}
                <NavMain items={filteredNavItems} counters={counters} />
            </SidebarContent>

            {/* ---------- Footer ---------- */}
            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
// function useState(initialCounters: any): [any, any] {
//     throw new Error('Function not implemented.');
// }
