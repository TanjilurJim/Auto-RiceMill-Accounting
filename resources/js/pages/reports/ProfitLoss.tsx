import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FileSpreadsheet, FileText, Printer, RefreshCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/* ------------------------------------------------------------------
   Profit & Loss – Fully Responsive UI
   - Mobile-optimized header
   - Responsive KPI cards
   - Stacked charts on mobile
   - Horizontally scrollable table
   - Touch-friendly actions
------------------------------------------------------------------- */

interface Figures {
    sales: number;
    cogs: number;
    grossProfit: number;
    expenses: number;
    otherIncome: number;
    serviceIncome: number;
    netProfit: number;
}

interface CompanyInfo {
    company_name: string;
    phone?: string;
    email?: string;
    address?: string;
    logo_url?: string;
    logo_thumb_url?: string;
}

interface ByLedgerRow {
    ledger: string;
    ledger_type: string | null; 
    debits: number;
    credits: number;
}

interface GroupRow {
    group: string;
    side: 'expense' | 'income' | 'neutral';
    value: number;
}

interface Props {
    from_date: string;
    to_date: string;
    figures: Figures;
    byLedger: ByLedgerRow[];
    grouped: GroupRow[];
    company: CompanyInfo | null;
}

const fmt = (n: number | string) => {
    const val = typeof n === 'string' ? parseFloat(n) || 0 : n || 0;
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function Kpi({ label, value, trend }: { label: string; value: number; trend?: 'up' | 'down' | 'flat' }) {
    const positive = value >= 0;
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-xs sm:text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className={`text-lg sm:text-2xl font-semibold ${positive ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ৳ {fmt(value)}
                </div>
                {trend && (
                    <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                        {trend === 'up' ? <ChevronUp className="h-3 w-3" /> : trend === 'down' ? <ChevronDown className="h-3 w-3" /> : null}
                        <span className="hidden sm:inline">vs previous period</span>
                        <span className="sm:hidden">vs prev</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ProfitLossRevamp({ from_date, to_date, figures, byLedger, grouped, company }: Props) {
    const logoSrc = company?.logo_url ?? company?.logo_thumb_url ?? undefined;

    const expenses = useMemo(() => grouped.filter((g) => g.side === 'expense'), [grouped]);
    const income = useMemo(() => grouped.filter((g) => g.side === 'income'), [grouped]);

    const chartData = useMemo(() => {
        const e = expenses.map((g) => ({ name: g.group, value: Math.abs(g.value) }));
        const i = income.map((g) => ({ name: g.group, value: Math.abs(g.value) }));
        return [
            { label: 'Expenses', items: e },
            { label: 'Income', items: i },
        ];
    }, [expenses, income]);

    const barData = useMemo(
        () => [
            { name: 'Income', value: Math.abs((figures?.sales ?? 0) + (figures?.otherIncome ?? 0) + (figures?.serviceIncome ?? 0)) },
            { name: 'Expenses', value: Math.abs((figures?.cogs ?? 0) + (figures?.expenses ?? 0)) },
        ],
        [figures],
    );

    // ledger table helpers
    const [q, setQ] = useState('');
    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const rows = needle
            ? byLedger.filter((r) => `${r.ledger} ${r.ledger_type ?? ''}`.toLowerCase().includes(needle))
            : byLedger;
        const withNet = rows.map((r) => ({ ...r, net: (r.credits || 0) - (r.debits || 0) }));
        const total = withNet.reduce(
            (acc, r) => {
                acc.debits += r.debits || 0;
                acc.credits += r.credits || 0;
                acc.net += r.net;
                return acc;
            },
            { debits: 0, credits: 0, net: 0 },
        );
        return { rows: withNet, total };
    }, [byLedger, q]);

    const netPositive = figures.netProfit >= 0;
    const colors = ['#22c55e', '#ef4444'];
    
    return (
        <AppLayout>
            <Head title="Profit & Loss" />

            {/* Header actions - Mobile optimized */}
            <div className="mb-4 print:hidden">
                {/* Company info */}
                <div className="flex items-start gap-2 sm:gap-3 mb-3">
                    {logoSrc && <img src={logoSrc} alt="logo" className="h-8 w-8 sm:h-10 sm:w-10 rounded object-contain flex-shrink-0" />}
                    <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-lg leading-tight font-semibold truncate">{company?.company_name}</div>
                        <div className="text-muted-foreground text-xs sm:text-sm">
                            <span className="block sm:inline">Profit &amp; Loss</span>
                            <span className="hidden sm:inline"> • </span>
                            <span className="block sm:inline">
                                <span className="font-medium">{from_date}</span> to <span className="font-medium">{to_date}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Link 
                        className="text-sm text-blue-600 underline-offset-2 hover:underline text-center sm:text-left" 
                        href={route('reports.profit-loss.filter')}
                    >
                        Change filters
                    </Link>
                    <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()} 
                        className="gap-2 w-full sm:w-auto sm:ml-auto"
                    >
                        <RefreshCcw className="h-4 w-4" /> Refresh
                    </Button>
                </div>
            </div>

            {/* KPI row - Responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                <Kpi label="Sales" value={figures.sales} />
                <Kpi label="COGS" value={figures.cogs} />
                <Kpi label="Gross Profit" value={figures.grossProfit} />
                <Kpi label="Operating Expenses" value={figures.expenses} />
                <Kpi label="Other Income" value={figures.serviceIncome} />
                <Card className={`${netPositive ? 'border-emerald-300' : 'border-rose-300'} shadow-sm col-span-2 sm:col-span-3 lg:col-span-1`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-xs sm:text-sm font-medium">
                            Net Profit
                            <Badge variant={netPositive ? 'default' : 'destructive'} className="rounded-full text-xs flex-shrink-0">
                                {netPositive ? 'Positive' : 'Loss'}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className={`text-2xl sm:text-3xl font-bold break-all ${netPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                            ৳ {fmt(figures.netProfit)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart + Group columns - Stack on mobile */}
            <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                {/* Chart */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48 sm:h-64 w-full">
                            <ResponsiveContainer>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(v: any) => `৳ ${fmt(v as number)}`} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {barData.map((_, i) => (
                                            <Cell key={i} fill={colors[i % colors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Expense groups */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Expenses by Group</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {expenses.length === 0 && <div className="text-muted-foreground text-sm">No expense groups found.</div>}
                        {expenses.map((g) => (
                            <div key={g.group} className="flex items-center justify-between text-xs sm:text-sm gap-2">
                                <span className="truncate">{g.group}</span>
                                <span className="tabular-nums flex-shrink-0">৳ {fmt(g.value)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Income groups */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Income by Group</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {income.length === 0 && <div className="text-muted-foreground text-sm">No income groups found.</div>}
                        {income.map((g) => (
                            <div key={g.group} className="flex items-center justify-between text-xs sm:text-sm gap-2">
                                <span className="truncate">{g.group}</span>
                                <span className="tabular-nums flex-shrink-0">৳ {fmt(g.value)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Ledger table - Horizontal scroll on mobile */}
            <Card className="mt-4 sm:mt-6">
                <CardHeader className="flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0">
                    <CardTitle className="text-sm font-medium">Ledger Breakdown</CardTitle>
                    <div className="flex items-center gap-2 sm:ml-auto">
                        <input
                            placeholder="Search ledger..."
                            className="h-9 w-full sm:w-56 rounded-md border px-3 text-sm focus:outline-none"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-xs sm:text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="border px-2 sm:px-3 py-2 text-left whitespace-nowrap">Ledger</th>
                                    <th className="border px-2 sm:px-3 py-2 text-left whitespace-nowrap">Type</th>
                                    <th className="border px-2 sm:px-3 py-2 text-right whitespace-nowrap">Debits</th>
                                    <th className="border px-2 sm:px-3 py-2 text-right whitespace-nowrap">Credits</th>
                                    <th className="border px-2 sm:px-3 py-2 text-right whitespace-nowrap">Net</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.rows.map((r, i) => (
                                    <tr key={`${r.ledger}-${i}`} className={i % 2 ? 'bg-muted/20' : undefined}>
                                        <td className="border px-2 sm:px-3 py-2 max-w-[150px] sm:max-w-none truncate">{r.ledger}</td>
                                        <td className="border px-2 sm:px-3 py-2 whitespace-nowrap">{r.ledger_type ?? '—'}</td>
                                        <td className="border px-2 sm:px-3 py-2 text-right tabular-nums whitespace-nowrap">{fmt(r.debits)}</td>
                                        <td className="border px-2 sm:px-3 py-2 text-right tabular-nums whitespace-nowrap">{fmt(r.credits)}</td>
                                        <td
                                            className={`border px-2 sm:px-3 py-2 text-right tabular-nums whitespace-nowrap ${r.credits - r.debits >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                                        >
                                            {fmt(r.credits - r.debits)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="border px-2 sm:px-3 py-2 font-medium whitespace-nowrap" colSpan={2}>
                                        Total
                                    </td>
                                    <td className="border px-2 sm:px-3 py-2 text-right font-medium tabular-nums whitespace-nowrap">{fmt(filtered.total.debits)}</td>
                                    <td className="border px-2 sm:px-3 py-2 text-right font-medium tabular-nums whitespace-nowrap">{fmt(filtered.total.credits)}</td>
                                    <td
                                        className={`border px-2 sm:px-3 py-2 text-right font-semibold tabular-nums whitespace-nowrap ${filtered.total.net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                                    >
                                        {fmt(filtered.total.net)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Actions - Mobile optimized */}
            <div className="sticky bottom-3 z-10 mt-4 sm:mt-6 print:hidden">
                {/* Desktop layout */}
                <div className="hidden sm:flex justify-center gap-2">
                    <Button variant="outline" onClick={() => window.print()} className="gap-2">
                        <Printer className="h-4 w-4" /> Print
                    </Button>
                    <a
                        href={route('reports.profit-loss.pdf', { from_date, to_date })}
                        target="_blank"
                        className="hover:bg-muted inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
                    >
                        <FileText className="h-4 w-4" /> Save PDF
                    </a>
                    <a
                        href={route('reports.profit-loss.excel', { from_date, to_date })}
                        className="hover:bg-muted inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Export Excel
                    </a>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => window.print()} className="gap-1 text-xs px-2">
                        <Printer className="h-4 w-4" /> Print
                    </Button>
                    <a
                        href={route('reports.profit-loss.pdf', { from_date, to_date })}
                        target="_blank"
                        className="hover:bg-muted inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-xs"
                    >
                        <FileText className="h-4 w-4" /> PDF
                    </a>
                    <a
                        href={route('reports.profit-loss.excel', { from_date, to_date })}
                        className="hover:bg-muted inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-xs"
                    >
                        <FileSpreadsheet className="h-4 w-4" /> Excel
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
