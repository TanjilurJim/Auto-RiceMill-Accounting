import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BanknoteIcon,
    BarChart2,
    BarChartBig,
    Boxes,
    Building,
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
    MailCheck,
    Notebook,
    Package,
    Phone,
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
import { useEffect, useState } from 'react';
import { FiAward, FiClock, FiHome, FiSettings, FiUsers } from 'react-icons/fi';
import AppLogo from './app-logo';
import { useTranslation } from './useTranslation';

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
    const t = useTranslation();
    const mainNavItems: NavItem[] = [
        {
            title: t('superAdminDashboard'),
            href: '/admin/dashboard',
            icon: LayoutGrid,
            roles: ['admin'],
        },
        {
            title: t('dashboard'),
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: t('accountInfo'),
            icon: InfoIcon,
            children: [
                {
                    title: t('accountGroups'),
                    href: '/account-groups',
                    icon: FileText,
                    roles: ['admin'], // Only admin will see this
                },
                {
                    title: t('accountLedgers'),
                    href: '/account-ledgers',
                    icon: Landmark,
                },
                {
                    title: t('salesmen'),
                    href: '/salesmen',
                    icon: Users,
                },
            ],
        },
        {
            title: t('inventoryInfo'),
            icon: Boxes,
            children: [
                {
                    title: t('godowns'),
                    href: '/godowns',
                    icon: Boxes,
                },
                {
                    title: t('dryers'),
                    href: '/dryers',
                    icon: Boxes,
                },

                {
                    title: t('units'),
                    href: '/units',
                    icon: Package,
                },
                {
                    title: t('category'),
                    href: '/categories',
                    icon: FolderKanban,
                },
                {
                    title: t('items'),
                    href: '/items',
                    icon: ClipboardList,
                },
                {
                    title: t('stockAdd'),
                    href: '/stock-moves',
                    icon: ClipboardList,
                },
                // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
            ],
        },
        {
            title: t('inbox'),
            icon: ReceiptText,
            group: true, // Add group marker
            children: [
                {
                    title: t('purchasesNotification'),
                    icon: ShoppingCart,
                    group: true, // Add group marker
                    children: [
                        { title: t('sub'), href: '/purchases/inbox/sub', icon: ReceiptText },
                        { title: t('responsible'), href: '/purchases/inbox/resp', icon: ReceiptText },
                        { title: t('purchaseApproveRejectLog'), href: '/approvals', icon: History },
                    ],
                },
                {
                    title: t('sales'),
                    icon: ReceiptText,
                    group: true, // Add group marker
                    children: [
                        { title: t('sub'), href: '/sales/inbox/sub', icon: ReceiptText },
                        { title: t('responsible'), href: '/sales/inbox/resp', icon: ReceiptText },
                        { title: t('saleApproveRejectLog'), href: '/sales/approvals', icon: History },
                    ],
                },
            ],
        },

        {
            title: t('transaction'),
            icon: BanknoteIcon,
            children: [
                {
                    title: t('purchases'),
                    href: '/purchases',
                    icon: ShoppingCart,
                },

                // {
                //     title: 'Purchase Approve-Reject Log',
                //     href: '/purchases/approvals',
                //     icon: History, // pick any Lucide icon
                // },

                {
                    title: t('purchasesReturn'),
                    href: '/purchase-returns',
                    icon: RotateCcw,
                },
                {
                    title: t('sales'),
                    href: '/sales',
                    icon: ReceiptText,
                },

                {
                    title: t('dues'),
                    href: '/dues',
                    icon: ReceiptText,
                },
                {
                    title: t('duesSettled'),
                    href: '/dues/settled',
                    icon: ReceiptText,
                },
                {
                    title: t('salesOrderList'),
                    href: '/sales-orders',
                    icon: Folder,
                },
                {
                    title: t('salesReturn'),
                    href: '/sales-returns',
                    icon: RotateCcw,
                },
                {
                    title: t('receivedModes'),
                    href: '/received-modes',
                    icon: Banknote,
                },
                // {
                //     title: 'Received Add',
                //     href: '/received-add',
                //     icon: Folder,
                // },
                {
                    title: t('paymentAdd'),
                    href: '/payment-add',
                    icon: Wallet,
                },
                {
                    title: t('contraAdd'),
                    href: '/contra-add',
                    icon: Shuffle,
                },
                {
                    title: t('journalAdd'),
                    href: '/journal-add',
                    icon: Notebook,
                },
                // {
                //     title: 'Stock Transfer',
                //     href: '/stock-transfers',
                //     icon: Notebook,
                // },

                // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
            ],
        },
        {
            title: t('production'),
            icon: Factory,
            children: [
                {
                    title: t('workingOrder'),
                    href: '/working-orders',
                    icon: Workflow,
                },
                {
                    title: t('finishedProducts'),
                    href: '/finished-products',
                    icon: Workflow,
                },
            ],
        },

        {
            title: t('payroll'),
            icon: FiSettings,

            children: [
                {
                    title: t('department'),
                    href: '/departments',
                    icon: FiHome,
                },
                {
                    title: t('designation'),
                    href: '/designations',
                    icon: FiAward,
                },
                {
                    title: t('shift'),
                    href: '/shifts',
                    icon: FiClock,
                },
                {
                    title: t('employees'),
                    href: '/employees',
                    icon: FiUsers,
                },
                {
                    title: t('salarySlips'),
                    href: '/salary-slips',
                    icon: FiUsers,
                },
                {
                    title: t('salaryOwed'),
                    href: '/salary-owed',
                    icon: FiUsers,
                },
                {
                    title: t('salaryPayments'),
                    href: '/salary-receives',
                    icon: FiUsers,
                },

                {
                    title: t('employeeLedgerReport'),
                    href: '/employee-ledger',
                    icon: FiUsers,
                },
                {
                    title: t('employeeReport'),
                    href: '/employee-reports',
                    icon: FiUsers,
                },
            ],
        },

        {
            title: t('reports'),
            icon: BarChartBig,

            children: [
                {
                    title: t('stockReport'),
                    href: '/reports/stock-summary',
                    icon: Warehouse,
                },
                {
                    title: t('dayBook'),
                    href: '/reports/day-book',
                    icon: ScrollText,
                },
                {
                    title: t('accountBook'),
                    href: '/reports/account-book',
                    icon: ScrollText,
                },
                {
                    title: t('ledgerGroupSummary'),
                    href: '/reports/ledger-group-summary/filter',
                    icon: FolderKanban,
                },
                {
                    title: t('purchaseReport'),
                    href: '/reports/purchase/filter',
                    icon: FolderKanban,
                },

                {
                    title: t('saleReport'),
                    href: '/reports/sale/filter',
                    icon: BarChart2,
                },

                {
                    title: t('receivablePayable'),
                    href: '/reports/receivable-payable/filter',
                    icon: Scale,
                },

                {
                    title: t('receivedPayment'),
                    href: '/reports/all-received-payment/filter',
                    icon: Scale,
                },
                {
                    title: t('profitLoss'),
                    href: '/reports/profit-loss/filter',
                    icon: Scale,
                },
                {
                    title: t('balanceSheet'),
                    href: '/reports/balance-sheet/filter',
                    icon: Scale,
                },
            ],
        },

        {
            title: t('crushingRent'),
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
                    title: 'পার্টি পণ্য ট্রান্সফার তালিকা',
                    href: '/party-stock/convert-list',
                    icon: FileText,
                },
                {
                    title: 'কম্পানি পণ্য ট্রান্সফার তালিকা',
                    href: '/party-stock/company/convert-list',
                    icon: FileText,
                },

                {
                    title: 'ক্রাশিং জবসমূহ তালিকা',
                    href: '/party-stock/crushing/jobs',
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
            title: t('settings'),
            icon: Settings2,

            children: [
                {
                    title: t('financialYear'),
                    href: '/financial-years',
                    icon: CalendarClock,
                },
                {
                    title: t('companySettings'),
                    href: '/company-settings',
                    icon: Building2, // 👈 This icon works well for users
                },
                {
                    title: t('productionCostSetting'),
                    href: '/company-settings/costings',
                    icon: Building, // 👈 This icon works well for users
                },

                // Later you can add more inventory-related items here (e.g., Products, Stock Transfers, etc.)
            ],
        },
        {
            title: t('permissions'),
            href: '/permissions',
            icon: Lock,
            roles: ['admin'], // you can change this icon to something like a shield or lock if you prefer
        },
        {
            title: t('roles'),
            href: '/roles',
            icon: Shield, // You could use Shield or User
            //icon if preferred
        },
        {
            title: t('users'),
            href: '/users',
            icon: Users, // 👈 This icon works well for users
        },
        {
            title: t('smtpSettings'),
            href: '/smtp',
            icon: MailCheck,
            roles: ['admin'],
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
        {
            title: t('support1'),
            href: 'https://wa.me/8801744333888',
            icon: Phone,
        },
        {
            title: t('support2'),
            href: 'https://wa.me/8801750014052',
            icon: Phone,
        },
    ];

    const { props, url } = usePage<any>();
    const initialCounters = props.counters || {};
    const roles = props.auth?.user?.roles?.map((r: any) => r.name) || [];
    const userId = props.auth?.user?.id;

    // 🔹 live counters state
    const [counters, setCounters] = useState(initialCounters);

    // 🔹 subscribe once
    useEffect(() => {
        if (!userId || !window.Echo) return;

        const channel = window.Echo.private(`approvals.${userId}`);
        channel.listen('ApprovalCountersUpdated', (e: any) => setCounters(e.counters));

        return () => channel.stopListening('ApprovalCountersUpdated').unsubscribe();
    }, [userId]);

    const filteredNavItems = filterNavItems(mainNavItems, roles);

    return (
        <Sidebar collapsible="icon" variant="inset" className='print:hidden' >
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
