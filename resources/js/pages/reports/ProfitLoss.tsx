import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Printer } from 'lucide-react';

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
    logo_path?: string;
    logo_url?: string; // full‑size
    logo_thumb_url?: string; // thumbnail
}

interface Props {
    from_date: string;
    to_date: string;
    figures: Figures;
    byLedger: {
        ledger: string;
        type: string;
        debits: number;
        credits: number;
    }[];
    company: CompanyInfo | null;
}

export default function ProfitLoss({ from_date, to_date, figures, byLedger, company }: Props) {
    const logoSrc = company?.logo_url ?? company?.logo_thumb_url ?? null;

    return (
        <AppLayout>
            <Head title="Profit & Loss Report" />
            <div className="print:hidden flex justify-end">
                        <Link href={route('reports.profit-loss.filter')} className="text-sm text-blue-600 hover:underline">
                            Change Filters
                        </Link>
                    </div>
            {/* Company Info */}
            <div className="mb-2 text-center print:text-xs">
                {logoSrc && (
                    <div className="mb-2">
                        <img src={logoSrc} alt="Company Logo" className="mx-auto h-24 w-auto object-contain print:h-16" />
                    </div>
                )}
                
                <h1 className="text-2xl font-bold">{company.company_name}</h1>
                {company.address && <div>{company.address}</div>}
                {company.phone && <div>Phone: {company.phone}</div>}
                {company.email && <div>Email: {company.email}</div>}
            </div>

            <div className="p-6 print:bg-white print:p-0">
                {/* Header */}
                <div className="mb-4 flex items-center justify-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Profit & Loss Report</h1>
                        <p className="text-sm text-gray-500">
                            Period: <strong>{from_date}</strong> to <strong>{to_date}</strong>
                        </p>
                    </div>
                    
                </div>

                {/* Figures */}
                <div className="mx-auto grid max-w-lg gap-2 text-sm">
                    <h2 className="border-b pb-1 font-semibold text-gray-700">Income</h2>
                    <div className="flex justify-between">
                        <span>Sales</span>
                        <span>{Number(figures.sales).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Other Income</span>
                        <span>{Number(figures.otherIncome).toFixed(2)}</span>
                    </div>

                    <h2 className="border-b pt-4 pb-1 font-semibold text-gray-700">Expenses</h2>
                    <div className="flex justify-between">
                        <span>Cost of Goods Sold</span>
                        <span>{Number(figures.cogs).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Operating Expenses</span>
                        <span>{Number(figures.expenses).toFixed(2)}</span>
                    </div>

                    <h2 className="border-b pt-4 pb-1 font-semibold text-gray-700">Summary</h2>
                    <div className="flex justify-between font-semibold">
                        <span>Gross Profit</span>
                        <span>{Number(figures.grossProfit).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-700">
                        <span>Net Profit</span>
                        <span>{Number(figures.netProfit).toFixed(2)}</span>
                    </div>
                </div>

                {/* Ledger Breakdown Table */}
                <div className="mt-8 overflow-x-auto rounded border text-sm print:hidden">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2 text-left">Ledger</th>
                                <th className="border px-3 py-2 text-left">Type</th>
                                <th className="border px-3 py-2 text-right">Debits</th>
                                <th className="border px-3 py-2 text-right">Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byLedger.map((r, idx) => (
                                <tr key={r.ledger} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="border px-3 py-2">{r.ledger}</td>
                                    <td className="border px-3 py-2">{r.type ?? '-'}</td>
                                    <td className="border px-3 py-2 text-right">{Number(r.debits).toFixed(2)}</td>
                                    <td className="border px-3 py-2 text-right">{Number(r.credits).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-center gap-3 print:hidden">
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
