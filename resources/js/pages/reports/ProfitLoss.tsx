import React, { useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, FileText, Printer, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/* ------------------------------------------------------------------
   Profit & Loss – Revamped UI
   - Filters quick link
   - KPI cards
   - Income vs Expenses by group (bar chart)
   - Group breakdown columns
   - Searchable ledger table with subtotal
   - Print/PDF/Excel actions
------------------------------------------------------------------- */

interface Figures {
  sales: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  otherIncome: number;
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
  type: string | null;
  debits: number;
  credits: number;
}

interface GroupRow {
  group: string;
  side: "expense" | "income";
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
  const val = typeof n === "string" ? parseFloat(n) || 0 : n || 0;
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function Kpi({ label, value, trend }: { label: string; value: number; trend?: "up" | "down" | "flat" }) {
  const positive = value >= 0;
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold ${positive ? "text-emerald-700" : "text-rose-700"}`}>৳ {fmt(value)}</div>
        {trend && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {trend === "up" ? <ChevronUp className="h-3 w-3" /> : trend === "down" ? <ChevronDown className="h-3 w-3" /> : null}
            <span>vs previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfitLossRevamp({ from_date, to_date, figures, byLedger, grouped, company }: Props) {
  const logoSrc = company?.logo_url ?? company?.logo_thumb_url ?? undefined;

  const expenses = useMemo(() => grouped.filter((g) => g.side === "expense"), [grouped]);
  const income = useMemo(() => grouped.filter((g) => g.side === "income"), [grouped]);

  const chartData = useMemo(() => {
    const e = expenses.map((g) => ({ name: g.group, value: Math.abs(g.value) }));
    const i = income.map((g) => ({ name: g.group, value: Math.abs(g.value) }));
    return [
      { label: "Expenses", items: e },
      { label: "Income", items: i },
    ];
  }, [expenses, income]);

  // ledger table helpers
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const rows = needle
      ? byLedger.filter((r) => `${r.ledger} ${r.type ?? ""}`.toLowerCase().includes(needle))
      : byLedger;
    const withNet = rows.map((r) => ({ ...r, net: (r.credits || 0) - (r.debits || 0) }));
    const total = withNet.reduce(
      (acc, r) => {
        acc.debits += r.debits || 0;
        acc.credits += r.credits || 0;
        acc.net += r.net;
        return acc;
      },
      { debits: 0, credits: 0, net: 0 }
    );
    return { rows: withNet, total };
  }, [byLedger, q]);

  const netPositive = figures.netProfit >= 0;

  return (
    <AppLayout>
      <Head title="Profit & Loss" />

      {/* Header actions */}
      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          {logoSrc && <img src={logoSrc} alt="logo" className="h-10 w-10 rounded object-contain" />}
          <div>
            <div className="text-lg font-semibold leading-tight">{company?.company_name}</div>
            <div className="text-xs text-muted-foreground">
              Profit &amp; Loss • <span className="font-medium">{from_date}</span> to <span className="font-medium">{to_date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="text-sm text-blue-600 underline-offset-2 hover:underline"
            href={route("reports.profit-loss.filter")}
          >
            Change filters
          </Link>
          <Button variant="outline" onClick={() => window.location.reload()} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Sales" value={figures.sales} />
        <Kpi label="COGS" value={figures.cogs} />
        <Kpi label="Gross Profit" value={figures.grossProfit} />
        <Kpi label="Operating Expenses" value={figures.expenses} />
        <Kpi label="Other Income" value={figures.otherIncome} />
        <Card className={`${netPositive ? "border-emerald-300" : "border-rose-300"} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              Net Profit
              <Badge variant={netPositive ? "default" : "destructive"} className="rounded-full">
                {netPositive ? "Positive" : "Loss"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-3xl font-bold ${netPositive ? "text-emerald-700" : "text-rose-700"}`}>৳ {fmt(figures.netProfit)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Group columns */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Income vs Expenses by Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={[{ name: "Income", value: Math.abs(figures.sales + figures.otherIncome) }, { name: "Expenses", value: Math.abs(figures.cogs + figures.expenses) }] }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: any) => `৳ ${fmt(v as number)}`} />
                  <Bar dataKey="value" />
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
            {expenses.length === 0 && <div className="text-sm text-muted-foreground">No expense groups found.</div>}
            {expenses.map((g) => (
              <div key={g.group} className="flex items-center justify-between text-sm">
                <span>{g.group}</span>
                <span className="tabular-nums">৳ {fmt(g.value)}</span>
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
            {income.length === 0 && <div className="text-sm text-muted-foreground">No income groups found.</div>}
            {income.map((g) => (
              <div key={g.group} className="flex items-center justify-between text-sm">
                <span>{g.group}</span>
                <span className="tabular-nums">৳ {fmt(g.value)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ledger table */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Ledger Breakdown</CardTitle>
          <div className="flex items-center gap-2">
            <input
              placeholder="Search ledger or type..."
              className="h-9 w-56 rounded-md border px-3 text-sm focus:outline-none"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="border px-3 py-2 text-left">Ledger</th>
                  <th className="border px-3 py-2 text-left">Type</th>
                  <th className="border px-3 py-2 text-right">Debits</th>
                  <th className="border px-3 py-2 text-right">Credits</th>
                  <th className="border px-3 py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {filtered.rows.map((r, i) => (
                  <tr key={`${r.ledger}-${i}`} className={i % 2 ? "bg-muted/20" : undefined}>
                    <td className="border px-3 py-2">{r.ledger}</td>
                    <td className="border px-3 py-2">{r.type ?? "—"}</td>
                    <td className="border px-3 py-2 text-right tabular-nums">{fmt(r.debits)}</td>
                    <td className="border px-3 py-2 text-right tabular-nums">{fmt(r.credits)}</td>
                    <td className={`border px-3 py-2 text-right tabular-nums ${r.credits - r.debits >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {fmt(r.credits - r.debits)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="border px-3 py-2 font-medium" colSpan={2}>Total</td>
                  <td className="border px-3 py-2 text-right font-medium tabular-nums">{fmt(filtered.total.debits)}</td>
                  <td className="border px-3 py-2 text-right font-medium tabular-nums">{fmt(filtered.total.credits)}</td>
                  <td className={`border px-3 py-2 text-right font-semibold tabular-nums ${filtered.total.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {fmt(filtered.total.net)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-3 z-10 mt-6 flex justify-center gap-2 print:hidden">
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Print
        </Button>
        <a
          href={route("reports.profit-loss.pdf", { from_date, to_date })}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          <FileText className="h-4 w-4" /> Save PDF
        </a>
        <a
          href={route("reports.profit-loss.excel", { from_date, to_date })}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </a>
      </div>
    </AppLayout>
  );
}
