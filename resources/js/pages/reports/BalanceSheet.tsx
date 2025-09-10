import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Printer } from 'lucide-react';

interface Row {
    group: string;
    side: 'asset' | 'liability';
    value: number;
}

export default function BalanceSheet({ from_date, to_date, balances, stock, working, assetTotal, liabTotal, difference, company }) {
    const assets = balances.filter((r: Row) => r.side === 'asset');
    const liabs = balances.filter((r: Row) => r.side === 'liability');

    const logo = company?.logo_url ?? company?.logo_thumb_url ?? undefined;

    return (
        <AppLayout>
            <Head title="Balance Sheet" />

            {/* ─── Company header ─── */}
            <div className="mb-6 text-center print:text-xs">
                {logo && <img src={logo} alt="Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />}

                <h1 className="text-2xl font-bold">{company?.company_name}</h1>
                {company?.address && <div>{company?.address}</div>}
                {company?.phone && <div>Phone: {company?.phone}</div>}
                {company?.email && <div>Email: {company?.email}</div>}
                <p className="mt-1 text-sm">
                    Balance Sheet &nbsp;
                    <strong>{from_date}</strong> → <strong>{to_date}</strong>
                </p>
            </div>

            {/* Two‑column layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 print:text-xs">
                {/* ASSETS */}
                <div>
                    <h2 className="bg-background/20 px-3 py-1 font-semibold">Assets</h2>
                    {assets.map((r) => (
                        <div key={r.group} className="flex justify-between border-b px-3 py-1">
                            <span>{r.group}</span>
                            <span>{r.value.toFixed(2)}</span>
                        </div>
                    ))}

                    {/* inventory extras */}
                    <div className="flex justify-between border-t px-3 py-1">
                        <span>Stock Value</span>
                        <span>{stock.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b px-3 py-1">
                        <span>Work‑in‑Process</span>
                        <span>{working.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between bg-background px-3 py-1 font-bold">
                        <span>Total Assets</span>
                        <span>{assetTotal.toFixed(2)}</span>
                    </div>
                </div>

                {/* LIABILITIES & EQUITY */}
                <div>
                    <h2 className="bg-background px-3 py-1 font-semibold">Liabilities &amp; Equity</h2>
                    {liabs.map((r) => (
                        <div key={r.group} className="flex justify-between border-b px-3 py-1">
                            <span>{r.group}</span>
                            <span>{r.value.toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="flex justify-between bg-background px-3 py-1 font-bold">
                        <span>Total Liabilities&nbsp;</span>
                        <span>{liabTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Imbalance banner */}
            {difference !== 0 && <p className="mt-4 text-center font-semibold text-red-600">Difference: {difference.toFixed(2)}</p>}

            {/* Filters / print buttons could go here */}
            <div className="mt-6 flex justify-center gap-4 print:hidden">
                {/* <Link href={route('reports.balance-sheet', { from_date, to_date })} className="rounded border px-4 py-2">
                    Refresh
                </Link> */}

                <Button variant="outline" onClick={() => window.print()} className="rounded border px-4 py-2">
                    <Printer className="mr-2 h-6 w-6" />
                    Print
                </Button>

                <a
                    href={route('reports.balance-sheet.pdf', { from_date, to_date })}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                >
                    <FileText className="h-4 w-4" />
                    Save PDF
                </a>

                <a
                    href={route('reports.balance-sheet.excel', { from_date, to_date })}
                    className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                >
                    <FileText className="h-4 w-4" />
                    Save Excel
                </a>
            </div>
        </AppLayout>
    );
}
