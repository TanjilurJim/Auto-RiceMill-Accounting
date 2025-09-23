// resources/ts/Pages/dashboard/Dashboard.tsx
import RunningDryersPanel from '@/components/dashboard/RunningDryersPanel';
import TrialBanner from '@/components/TrialBanner';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Building, CheckCircle2, CircleDollarSign, ReceiptText, RotateCcw, ShoppingCart, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';
import '../echo';

/* ─────────────────────────────── Charts data (demo) ────────────────────────── */

const cashSeries = [
    { day: 1, cash: 30 },
    { day: 5, cash: 42 },
    { day: 10, cash: 55 },
    { day: 15, cash: 61 },
    { day: 20, cash: 70 },
    { day: 25, cash: 66 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6'];

/* ─────────────────────────────── Component ──────────────────────────── */
type DashboardProps = {
    runningDryers: any[]; // from controller
};

export default function Dashboard({ runningDryers }: DashboardProps) {
    const page = usePage().props as any;

    const auth = page.auth ?? {};
    const roles: string[] = auth?.roles ?? [];
    const isAdmin = roles.some((r) => ['Admin', 'Super Admin'].includes(r));

    // 👉 define tenantId (adjust if you use top-parent id helper instead)
    const tenantId: number | undefined = auth?.tenant_id ?? auth?.user?.tenant_id;

    const totalSales = page.totalSales ?? 0;
    const totalPurchases = page.totalPurchases ?? 0;
    const totalPurchaseReturns = page.totalPurchaseReturns ?? 0;
    const totalSalesReturns = page.totalSalesReturns ?? 0;
    const totalSalesOrders = page.totalSalesOrders ?? 0;
    const totalReceived = page.totalReceived ?? 0;
    const totalPayment = page.totalPayment ?? 0;
    const totalWorkOrders = page.totalWorkOrders ?? 0;
    const completedWorkOrders = page.completedWorkOrders ?? 0;
    const totalDues = page.totalDues ?? 0;
    const clearedDuesCount = page.clearedDuesCount ?? 0;
    const purchasePayableTotal = page.purchasePayableTotal ?? 0;
    const topPurchaseSuppliers = (page.topPurchaseSuppliers ?? []) as Array<{ id: number; name: string; payable: number }>;

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // 🔔 Echo listener → refresh only the runningDryers prop
    useEffect(() => {
        console.log('[Dashboard] tenantId:', tenantId, 'Echo?', !!window?.Echo);

        if (!tenantId || !window?.Echo) return;

        const name = `dryers.${tenantId}`;
        console.log('[Dashboard] subscribing:', name);

        window.Echo.private(name).listen('.dryer.job.updated', (e) => {
            console.log('[Dashboard] dryer event:', e);
            router.reload({ only: ['runningDryers'] });
        });

        return () => {
            console.log('[Dashboard] leaving:', name);
            window.Echo.leave(name);
        };
    }, [tenantId]);

    const fmtMoney = (n: number) => new Intl.NumberFormat('en-BD', { minimumFractionDigits: 2 }).format(n || 0);

    const t = useTranslation();
    const expBreakdown = [
        { name: t('rawPaddy'), value: 45 },
        { name: t('huskBran'), value: 12 },
        { name: t('labour'), value: 18 },
        { name: t('utility'), value: 10 },
        { name: t('other'), value: 15 },
    ];
    const monthly = [
        { month: t('monthJan'), sales: 120, purchases: 95 },
        { month: t('monthFeb'), sales: 105, purchases: 88 },
        { month: t('monthMar'), sales: 140, purchases: 100 },
        { month: t('monthApr'), sales: 130, purchases: 97 },
        { month: t('monthMay'), sales: 150, purchases: 110 },
        { month: t('monthJun'), sales: 170, purchases: 123 },
    ];
    const kpis = [
        { title: t('totalSales'), value: totalSales, icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: t('totalPurchases'), value: totalPurchases, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: t('cashReceived'), value: totalReceived, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: t('cashPaid'), value: totalPayment, icon: Wallet, color: 'text-red-600', bg: 'bg-red-50' },
        { title: t('netIncome'), value: 275000, icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: t('totalExpenses'), value: 210000, icon: ReceiptText, color: 'text-gray-700', bg: 'bg-gray-50' },
        { title: t('salesReturns'), value: totalSalesReturns, icon: RotateCcw, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
        { title: t('purchaseReturns'), value: totalPurchaseReturns, icon: RotateCcw, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { title: t('openSalesOrders'), value: totalSalesOrders, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
        {
            title: t('workOrdersDone'),
            value: `${completedWorkOrders} / ${totalWorkOrders}`,
            icon: CheckCircle2,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        { title: t('outstandingDues'), value: totalDues, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: t('duesCleared'), value: clearedDuesCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: t('dashboard'), href: '/dashboard' }]}>
            <Head title={t('dashboard')} />

            {!isAdmin && <TrialBanner />}

            {/* KPIs */}
            <div className="m-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {kpis.map(({ title, value, icon: Icon, color, bg }) => (
                    <Card
                        key={title}
                        className={cn(
                            'dark:border-muted/30 flex items-center gap-4 rounded-lg border border-gray-100 p-4',
                            'dark:bg-muted/40 bg-white shadow-sm transition-transform duration-200',
                            'hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg',
                            bg,
                        )}
                    >
                        <div className={cn('flex h-12 w-12 items-center justify-center rounded-full shadow-sm', color, 'bg-opacity-10')}>
                            <Icon className={cn('h-7 w-7', color)} />
                        </div>
                        <div className="min-w-0 flex-1 text-center">
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{title}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-100">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Running dryers + Payables */}
            <div className="m-2 mt-4 grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold tracking-tight">{t('topSupplierPayables')}</h2>
                                <p className="text-muted-foreground text-sm">
                                    {t('totalOutstanding')}: <span className="font-bold text-red-500">{fmtMoney(purchasePayableTotal)} BDT</span>
                                </p>
                            </div>
                            <Building className="text-muted-foreground h-6 w-6" />
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {topPurchaseSuppliers.length === 0 ? (
                            <div className="flex h-24 flex-col items-center justify-center p-6 text-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                                <p className="text-muted-foreground mt-2 text-sm">{t('noOutstandingPayables')}</p>
                            </div>
                        ) : (
                            <div className="divide-y dark:divide-white/10">
                                {topPurchaseSuppliers.slice(0, 5).map((supplier) => {
                                    const topPayable = Math.max(...topPurchaseSuppliers.map((s) => s.payable));
                                    const barWidth = topPayable > 0 ? (supplier.payable / topPayable) * 100 : 0;

                                    return (
                                        <Link
                                            key={supplier.id}
                                            href={route('payment-add.create', { ledger_id: supplier.id })}
                                            title={`Settle dues for ${supplier.name}`}
                                            className="group hover:bg-muted/50 relative block px-4 py-3 transition-colors"
                                        >
                                            <div
                                                className="absolute top-0 bottom-0 left-0 bg-red-500/10 opacity-0 transition-opacity group-hover:opacity-100"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                            <div className="relative flex items-center justify-between gap-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                                                        {supplier.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <p className="text-primary truncate font-semibold">{supplier.name}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{fmtMoney(supplier.payable)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>

                    {topPurchaseSuppliers.length > 5 && (
                        <CardFooter className="p-2">
                            <Link
                                href={route('purchases.index')}
                                className="text-primary hover:bg-muted flex w-full items-center justify-center gap-2 rounded-md p-2 text-sm font-semibold transition-colors"
                            >
                                {t('seeAll')} {topPurchaseSuppliers.length} {t('suppliers')}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </CardFooter>
                    )}
                </Card>

                {/* Running Dryers */}
                <RunningDryersPanel items={Array.isArray(runningDryers) ? runningDryers : []} />
            </div>

            {/* Charts */}
            <div className="m-2 mt-6 grid gap-6 lg:grid-cols-2">
                {/* Monthly Sales vs Purchases (lakh BDT) */}
                <Card className="p-4">
                    <CardHeader className="text-lg font-medium">{t('monthlySalesPurchases')}</CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthly}>
                                <XAxis dataKey="month" strokeOpacity={0.5} />
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                                <Bar dataKey="sales" name={t('sales')} barSize={16} fill="#22c55e" />
                                <Bar dataKey="purchases" name={t('purchases')} barSize={16} fill="#f97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardHeader className="text-lg font-medium">{t('cashPosition')}</CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cashSeries}>
                                <XAxis dataKey="day" strokeOpacity={0.5} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="cash" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="p-4 lg:col-span-2">
                    <CardHeader className="text-lg font-medium">{t('expenseBreakdown')}</CardHeader>
                    <CardContent className="flex h-72 items-center justify-center">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expBreakdown}
                                    dataKey="value"
                                    outerRadius="80%"
                                    innerRadius="40%"
                                    paddingAngle={1}
                                    activeIndex={activeIndex ?? -1}
                                    onMouseEnter={(_, idx) => setActiveIndex(idx)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                    activeShape={(props) => (
                                        <g>
                                            <text x={props.cx} y={props.cy} dy={8} textAnchor="middle" className="fill-gray-700 text-sm font-medium">
                                                {props.name}: {(props.percent * 100).toFixed(0)}%
                                            </text>
                                            <Sector
                                                {...props}
                                                innerRadius={props.innerRadius}
                                                outerRadius={Number(props.outerRadius) + 4}
                                                cornerRadius={4}
                                            />
                                        </g>
                                    )}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {expBreakdown.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} fillOpacity={activeIndex === idx ? 0.85 : 1} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val: number) => `${val.toLocaleString()} BDT`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
