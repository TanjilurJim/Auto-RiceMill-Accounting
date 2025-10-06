import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpenCheck,
    BookText,
    Calculator as CalculatorIcon,
    CreditCard,
    Languages,
    Layers3,
    Maximize,
    Minimize,
    Package,
    ShoppingCart,
} from 'lucide-react';
import * as React from 'react';
import { useEffect } from 'react';
import Calculator from './calculator';
import { useLanguage } from './LanguageContext';
import { useTranslation } from './useTranslation';

// import { Button } from '@headlessui/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const t = useTranslation();
    const quickLinks = [
        { label: t('calculator'), href: '#', icon: CalculatorIcon, color: 'bg-slate-700', isCalculator: true },
        { label: t('received'), href: '/received-add', icon: Banknote, color: 'bg-green-600' },
        { label: t('payment'), href: '/payment-add?from_date=&to_date=', icon: CreditCard, color: 'bg-red-500' },
        { label: t('purchases'), href: '/purchases', icon: ShoppingCart, color: 'bg-amber-500' },
        { label: t('sales'), href: '/sales', icon: Package, color: 'bg-blue-600' },
        { label: t('dayBook'), href: '/reports/day-book', icon: BookText, color: 'bg-indigo-500' },
        // { label: 'Account Ledger', href: '/reports/account-ledger', icon: BookOpenCheck, color: 'bg-purple-500' },
        { label: t('ledgers'), href: '/account-ledgers', icon: BookOpenCheck, color: 'bg-purple-500' },
        { label: t('stock'), href: '/reports/stock-summary', icon: Layers3, color: 'bg-cyan-600' },
    ];

    const { company } = usePage().props as { company?: { name?: string; logo_url?: string } };

    /* ───────── Language toggle state ───────── */
    const { language, toggleLanguage } = useLanguage();

    /* ───────── Full-screen helper ───────── */
    const [isFullscreen, setIsFullscreen] = React.useState<boolean>(!!document.fullscreenElement);

    useEffect(() => {
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

    function cn(...classes: (string | undefined | false | null)[]): string {
        return classes.filter(Boolean).join(' ');
    }
    return (
        <div>
            <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                {/* Ghost button + Dashboard title  */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="cursor-pointer print:hidden" />

                    {company?.logo_url ? (
                        <Link
                            href="/company-settings/edit"
                            className="inline-flex items-center"
                            aria-label="Company Settings"
                            title={company?.name ?? 'Company'}
                        >
                            <span className="inline-block max-w-[55vw] truncate text-lg leading-none font-semibold sm:max-w-[260px] sm:text-xl">
                                {company?.name ?? 'Company'}
                            </span>
                        </Link>
                    ) : (
                        t('dashboardTitle')
                    )}
                </div>

                {/* Language Toggle Button */}
                <button
                    onClick={toggleLanguage}
                    type="button"
                    className={cn(
                        'flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition',
                        'bg-background border border-gray-300 text-gray-700 hover:bg-gray-50',
                        'shadow-sm hover:shadow focus-visible:ring focus-visible:outline-none',
                        'print:hidden',
                    )}
                    title={`Switch to ${language === 'en' ? 'বাংলা' : 'English'}`}
                >
                    <Languages className="h-4 w-4" />
                    <span className="">{language === 'en' ? 'বাং' : 'En'}</span>
                </button>
            </header>

            {/* Quick buttons */}
            <div className="my-4 grid w-full grid-cols-3 items-center justify-between gap-3 px-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 print:hidden">
                <button
                    onClick={toggleFullscreen}
                    type="button"
                    className={cn(
                        'font-large items-center gap-1 rounded-md pl-2 py-2 text-xl text-white bg-teal-500',
                        'shadow transition hover:shadow-md focus-visible:ring focus-visible:outline-none',
                    )}
                >
                    {isFullscreen ? (
                        <div className="flex cursor-pointer items-center gap-2">
                            <Minimize className="h-4 w-4" /> <span className='text-xs md:text-base font-medium'>{t('exitFullScreen')}</span>
                        </div>
                    ) : (
                        <div className="flex cursor-pointer items-center gap-2">
                            <Maximize className="h-4 w-4" /> <span className='text-xs md:text-base font-medium'>{t('fullScreen')}</span>
                        </div>
                    )}
                </button>

                {quickLinks.map(({ label, href, icon: Icon, color, isCalculator }) =>
                    isCalculator ? (
                        // <Dialog key={label}>
                        //     <DialogTrigger asChild>
                        //         <button
                        //             className={cn(
                        //                 'flex cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-white',
                        //                 'shadow transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring focus-visible:outline-none',
                        //                 color,
                        //             )}
                        //         >
                        //             <Icon className="h-4 w-4" />
                        //             <span className="hidden md:inline">{label}</span>
                        //         </button>
                        //     </DialogTrigger>
                        //     {/* <DialogOverlay /> */}
                        //     <DialogContent className="border-none bg-transparent p-0">
                        //         {/* <DialogHeader className="sr-only">
                        //             <DialogTitle>{label}</DialogTitle>
                        //         </DialogHeader> */}
                        //         <Calculator />
                        //     </DialogContent>
                        // </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    className={cn(
                                        'flex cursor-pointer items-center gap-1 rounded-md px-2 py-2 text-sm font-medium text-white',
                                        'shadow transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring focus-visible:outline-none',
                                        color,
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden md:inline">{label}</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                                <Calculator />
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <a
                            key={label}
                            href={href}
                            className={cn(
                                'flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white',
                                'shadow transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring focus-visible:outline-none',
                                color,
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden md:inline">{label}</span>
                        </a>
                    ),
                )}
            </div>
        </div>
    );
}
