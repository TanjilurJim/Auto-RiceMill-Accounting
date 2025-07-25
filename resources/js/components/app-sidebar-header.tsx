import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Banknote, BookOpenCheck, BookText, CreditCard, Layers3, Package, ShoppingCart } from 'lucide-react';

const quickLinks = [
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
    return (
        <header className="border-sidebar-border/50 h-16 shrink-0 flex justify-between items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* <div className="flex items-center gap-2"> */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <SidebarTrigger className="-ml-1 print:hidden" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* <div className="mb-4 flex flex-wrap items-center gap-2 ml-2"> */}
            <div className="hidden mb-2 sm:mb-0 md:flex flex-wrap items-center gap-2 ml-0 sm:ml-2 w-full sm:w-auto justify-center sm:justify-end">
                {quickLinks.map(({ label, href, icon: Icon, color }) => (
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
                ))}
            </div>

        </header>
    );
}
