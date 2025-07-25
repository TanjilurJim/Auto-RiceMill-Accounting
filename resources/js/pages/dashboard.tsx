// resources/ts/Pages/dashboard/Dashboard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, CircleDollarSign, ReceiptText, RotateCcw, ShoppingCart, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';

// const quickLinks = [
//     { label: 'Received', href: '/received-add', icon: Banknote, color: 'bg-green-600' },
//     { label: 'Payment', href: '/payment-add?from_date=&to_date=', icon: CreditCard, color: 'bg-red-500' },
//     { label: 'Purchases', href: '/purchases', icon: ShoppingCart, color: 'bg-amber-500' },
//     { label: 'Sales', href: '/sales', icon: Package, color: 'bg-blue-600' },
//     { label: 'Day Book', href: '/reports/day-book', icon: BookText, color: 'bg-indigo-500' },
//     { label: 'Account Ledger', href: '/reports/account-ledger', icon: BookOpenCheck, color: 'bg-purple-500' },
//     { label: 'Stock Report', href: '/reports/stock-summary', icon: Layers3, color: 'bg-cyan-600' },
// ];

/* ─────────────────────────────── Charts data ────────────────────────── */
const monthly = [
    { month: 'Jan', sales: 120, purchases: 95 },
    { month: 'Feb', sales: 105, purchases: 88 },
    { month: 'Mar', sales: 140, purchases: 100 },
    { month: 'Apr', sales: 130, purchases: 97 },
    { month: 'May', sales: 150, purchases: 110 },
    { month: 'Jun', sales: 170, purchases: 123 },
];

const cashSeries = [
    { day: 1, cash: 30 },
    { day: 5, cash: 42 },
    { day: 10, cash: 55 },
    { day: 15, cash: 61 },
    { day: 20, cash: 70 },
    { day: 25, cash: 66 },
];

const expBreakdown = [
    { name: 'Raw paddy', value: 45 },
    { name: 'Husk / Bran', value: 12 },
    { name: 'Labour', value: 18 },
    { name: 'Utility', value: 10 },
    { name: 'Other', value: 15 },
];

const COLORS = [
    '#22c55e' /* green-500   */,
    '#3b82f6' /* blue-500    */,
    '#f97316' /* orange-500  */,
    '#8b5cf6' /* violet-500  */,
    '#ef4444' /* red-500     */,
    '#14b8a6' /* teal-500    */,
];

/* ─────────────────────────────── Component ──────────────────────────── */
export default function Dashboard() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // const { totalSales } = usePage().props as { totalSales: number };
    const totalSales = (usePage().props as any).totalSales ?? 0;
    const totalPurchases = (usePage().props as any).totalPurchases ?? 0;
    const totalPurchaseReturns = (usePage().props as any).totalPurchaseReturns ?? 0;
    const totalSalesReturns = (usePage().props as any).totalSalesReturns ?? 0;
    const totalSalesOrders = (usePage().props as any).totalSalesOrders ?? 0;
    const totalReceived = (usePage().props as any).totalReceived ?? 0;
    const totalPayment = (usePage().props as any).totalPayment ?? 0;
    const totalWorkOrders = (usePage().props as any).totalWorkOrders ?? 0;

    const totalDues = (usePage().props as any).totalDues ?? 0;
    // const totalDueAdjustments = (usePage().props as any).totalDueAdjustments ?? 0;
    const clearedDuesCount = (usePage().props as any).clearedDuesCount ?? 0;
    const completedWorkOrders = (usePage().props as any).completedWorkOrders ?? 0;

    /* ───────────────────────────────── KPIs ─────────────────────────────── */
    const kpis = [
        { title: 'Total Sales', value: totalSales, icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Purchases', value: totalPurchases, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Cash Received', value: totalReceived, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Cash Paid', value: totalPayment, icon: Wallet, color: 'text-red-600', bg: 'bg-red-50' },
        { title: 'Net Income', value: 275000, icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Total Expenses', value: 210000, icon: ReceiptText, color: 'text-gray-700', bg: 'bg-gray-50' },
        { title: 'Sales Returns', value: totalSalesReturns, icon: RotateCcw, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
        { title: 'Purchase Returns', value: totalPurchaseReturns, icon: RotateCcw, color: 'text-cyan-600', bg: 'bg-cyan-50' },
        { title: 'Open Sales Orders', value: totalSalesOrders, icon: ShoppingCart, color: 'text-orange-600', bg: 'bg-orange-50' },
        {
            title: 'Work Orders Done',
            value: `${completedWorkOrders} / ${totalWorkOrders}`,
            icon: CheckCircle2,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        { title: 'Outstanding Dues', value: totalDues, icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Dues Cleared', value: clearedDuesCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        // { title: 'Due Adjustments', value: totalDueAdjustments, icon: RotateCcw, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Dashboard" />

            {/* <div className="mb-4 flex flex-wrap items-center gap-2 ml-2">
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
                        <span>{label}</span>
                    </a>
                ))}
            </div> */}

            {/* KPI cards */}
            {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 m-2">
                {kpis.map(({ title, value, icon: Icon, color, bg }) => (
                    <Card
                        key={title}
                        className={cn(
                            'relative flex items-center gap-3 rounded-xl p-4', // base layout
                            'dark:bg-muted/40 bg-white shadow-sm', // default look
                            'transform transition duration-200 ease-in-out', // animation
                            'hover:z-10 hover:-translate-y-1 hover:shadow-lg',
                            bg, // lift on hover
                        )}
                    >
                        <Icon className={cn('h-9 w-9 shrink-0', color)} />
                        <div className="flex-1">
                            <p className="text-muted-foreground text-sm">{title}</p>
                            <p className="flex justify-center text-xl font-semibold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        </div>
                    </Card>
                ))}
            </div> */}
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

            {/* Charts */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Monthly bar chart */}
                <Card className="p-4">
                    <CardHeader className="text-lg font-medium">Monthly Sales vs Purchases&nbsp;(lakh&nbsp;BDT)</CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthly}>
                                <XAxis dataKey="month" strokeOpacity={0.5} />
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                                <Bar dataKey="sales" name="Sales" barSize={16} fill="#22c55e" />
                                <Bar dataKey="purchases" name="Purchases" barSize={16} fill="#f97316" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Cash line chart */}
                <Card className="p-4">
                    <CardHeader className="text-lg font-medium">Cash Position&nbsp;(current month)</CardHeader>
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

                {/* Expense breakdown pie */}
                <Card className="p-4 lg:col-span-2">
                    <CardHeader className="text-lg font-medium">Expense Breakdown</CardHeader>
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
                                        /* hover slice “pops” 4 px + label in the centre */
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
