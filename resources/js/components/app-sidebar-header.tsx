import { Breadcrumbs } from '@/components/breadcrumbs';
import Calculator from '@/components/calculator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpenCheck,
    BookText,
    Calculator as CalculatorIcon,
    CreditCard,
    Layers3,
    Maximize,
    Minimize,
    Package,
    ShoppingCart,
} from 'lucide-react';
import * as React from 'react';
const quickLinks = [
    { label: 'Calculator', href: '#', icon: CalculatorIcon, color: 'bg-slate-700', isCalculator: true },
    { label: 'Received', href: '/received-add', icon: Banknote, color: 'bg-green-600' },
    { label: 'Payment', href: '/payment-add?from_date=&to_date=', icon: CreditCard, color: 'bg-red-500' },
    { label: 'Purchases', href: '/purchases', icon: ShoppingCart, color: 'bg-amber-500' },
    { label: 'Sales', href: '/sales', icon: Package, color: 'bg-blue-600' },
    { label: 'Day Book', href: '/reports/day-book', icon: BookText, color: 'bg-indigo-500' },
    // { label: 'Account Ledger', href: '/reports/account-ledger', icon: BookOpenCheck, color: 'bg-purple-500' },
    { label: 'Account Ledgers', href: '/account-ledgers', icon: BookOpenCheck, color: 'bg-purple-500' },
    { label: 'Stock Report', href: '/reports/stock-summary', icon: Layers3, color: 'bg-cyan-600' },
];

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { company } = usePage().props as { company?: { name?: string; logo_url?: string } };

    /* ───────── Full-screen helper ───────── */
    const [isFullscreen, setIsFullscreen] = React.useState<boolean>(!!document.fullscreenElement);

    React.useEffect(() => {
        const h = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener('fullscreenchange', h);
        return () => document.removeEventListener('fullscreenchange', h);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            void document.documentElement.requestFullscreen();
        } else {
            void document.exitFullscreen();
        }
    };

    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-1 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            {/* Ghost button + Dashboard title  */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="print:hidden cursor-pointer" />

                {company?.logo_url ? (
                    <Link
                        href="/company-settings/edit"
                        className="inline-flex items-center"
                        aria-label="Company Settings"
                        title={company?.name ?? 'Company'}
                    >
                        <span className="inline-block truncate text-lg sm:text-xl font-semibold leading-none max-w-[55vw] sm:max-w-[260px]">
                        {company?.name ?? 'Company'}
                        </span>
                    </Link>
                ) : (
                'Dashboard'
                )}
            </div>

            <div className="mb-2 ml-0 hidden w-full flex-wrap items-end justify-start gap-2 sm:mb-0 sm:ml-2 sm:w-auto sm:justify-end md:flex">
                {/* 👇 logo button (left of calculator) */}
                {/* {company?.logo_url && (
                    <img
                        src={company.logo_url}
                        alt={company?.name ?? 'Company'}
                        className="h-12 w-full max-w-[120px] items-start justify-items-start sm:max-w-[150px] md:max-w-[180px]"
                    />
                )} */}
            </div>

            {/* <div className="mb-4 flex flex-wrap items-center gap-2 ml-2"> */}
            <div className="mb-2 w-full flex items-center justify-end gap-2">
                <button
                    onClick={toggleFullscreen}
                    type="button"
                    className={cn(
                        'font-large inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xl text-black',
                        'shadow transition hover:shadow-md focus-visible:ring focus-visible:outline-none',
                    )}
                >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    <span className="hidden xl:inline">{isFullscreen}</span>
                </button>
                {quickLinks.map(({ label, href, icon: Icon, color, isCalculator }) =>
                    isCalculator ? (
                        <Dialog key={label}>
                            <DialogTrigger asChild>
                                <button
                                    className={cn(
                                        'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white',
                                        'shadow transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring focus-visible:outline-none',
                                        color,
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden xl:inline">{label}</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="border-none bg-transparent p-0 sm:max-w-xs">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>{label}</DialogTitle>
                                </DialogHeader>
                                <Calculator />
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <a
                            key={label}
                            href={href}
                            className={cn(
                                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white',
                                'shadow transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring focus-visible:outline-none',
                                color,
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden xl:inline">{label}</span>
                        </a>
                    ),
                )}
            </div>
        </header>
    );
}
