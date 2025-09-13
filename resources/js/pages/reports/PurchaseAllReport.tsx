import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
    date: string;
    voucher_no: string;
    supplier: string;
    qty: number;
    net_amount: number;
    amount_paid: number;
    due: number;
}

interface Company {
    company_name: string;
    email?: string;
    financial_year?: string;
    website?: string;
    logo_path?: string;
    mobile?: string;
    address?: string;
    logo_url?: string;
    logo_thumb_url?: string;
}

export default function PurchaseAllReport({
    entries,
    filters,
    company,
}: {
    entries: Row[];
    filters: { from_date: string; to_date: string; year?: string };
    company: Company;
}) {
    // totals
    const totalQty = entries.reduce((s, r) => s + Number(r.qty ?? 0), 0);
    const totalNet = entries.reduce((s, r) => s + Number(r.net_amount ?? 0), 0);
    const totalPaid = entries.reduce((s, r) => s + Number(r.amount_paid ?? 0), 0);
    const totalDue = entries.reduce((s, r) => s + Number(r.due ?? 0), 0);

    const handlePrint = () => window.print();

    return (
        <AppLayout title="All Purchases Report">
            <div className="max-w-full space-y-4 p-4">
                <Card className="shadow-lg">
                    {/* ─── Header ─── */}
                    <CardHeader className="bg-background py-6 text-center">
                        {company?.logo_url && (
                                <img src={company.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />
                            )}
                        <h1 className="text-3xl font-bold uppercase">{company?.company_name}</h1>
                        {company?.address && <p className="text-sm">{company?.address}</p>}
                        {company?.mobile && <p className="text-sm">Phone: {company?.mobile}</p>}
                        {company?.email && <p className="text-sm">{company?.email}</p>}

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">All Purchases</h2>

                            {filters.year ? (
                                <p className="text-sm">
                                    Showing for Year <strong>{filters.year}</strong>
                                </p>
                            ) : (
                                <p className="text-sm">
                                    From <strong>{filters.from_date}</strong> to <strong>{filters.to_date}</strong>
                                </p>
                            )}
                        </div>

                        <div className="absolute top-16 right-4 print:hidden">
                            <Link href={route('reports.purchase.filter', { tab: 'all' })} className="text-sm text-blue-600 hover:underline">
                                Change Filters
                            </Link>
                        </div>
                    </CardHeader>

                    {/* ─── Table ─── */}
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                                <thead className="bg-gray-100 print:bg-white">
                                    {filters.year ? (
                                        <tr>
                                            <th className="border px-2 py-1">#</th>
                                            <th className="border px-2 py-1">Month</th>
                                            <th className="border px-2 py-1 text-right">Amount (Tk)</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th className="border px-2 py-1">#</th>
                                            <th className="border px-2 py-1">Date</th>
                                            <th className="border px-2 py-1">Vch No</th>
                                            <th className="border px-2 py-1">Supplier</th>
                                            <th className="border px-2 py-1 text-right">Qty</th>
                                            <th className="border px-2 py-1 text-right">Net (Tk)</th>
                                            <th className="border px-2 py-1 text-right">Paid (Tk)</th>
                                            <th className="border px-2 py-1 text-right">Due (Tk)</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody>
                                    {entries.length ? (
                                        <>
                                            {filters.year ? (
                                                <>
                                                    {entries.map((r, i) => (
                                                        <tr key={i} className="print:bg-white">
                                                            <td className="border px-2 py-1">{i + 1}</td>
                                                            <td className="border px-2 py-1">
                                                                {new Date(2025, (r.month ?? 0) - 1).toLocaleString('default', { month: 'long' })}
                                                            </td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.amount ?? 0).toFixed(2)}</td>
                                                        </tr>
                                                    ))}

                                                    {/* Grand Total row */}
                                                    <tr className="bg-gray-100 font-semibold print:bg-white">
                                                        <td colSpan={2} className="border px-2 py-1 text-right">
                                                            Grand Total
                                                        </td>
                                                        <td className="border px-2 py-1 text-right">
                                                            {entries.reduce((s, r) => s + Number(r.amount ?? 0), 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : (
                                                <>
                                                    {entries.map((r, i) => (
                                                        <tr key={i} className="print:bg-white">
                                                            <td className="border px-2 py-1">{i + 1}</td>
                                                            <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                                                            <td className="border px-2 py-1">{r.voucher_no}</td>
                                                            <td className="border px-2 py-1">{r.supplier}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.qty ?? 0).toFixed(2)}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.net_amount ?? 0).toFixed(2)}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.amount_paid ?? 0).toFixed(2)}</td>
                                                            <td className="border px-2 py-1 text-right">{Number(r.due ?? 0).toFixed(2)}</td>
                                                        </tr>
                                                    ))}

                                                    {/* totals row */}
                                                    <tr className="bg-gray-100 font-semibold print:bg-white">
                                                        <td colSpan={4} className="border px-2 py-1 text-right">
                                                            Grand Total
                                                        </td>
                                                        <td className="border px-2 py-1 text-right">{totalQty.toFixed(2)}</td>
                                                        <td className="border px-2 py-1 text-right">{totalNet.toFixed(2)}</td>
                                                        <td className="border px-2 py-1 text-right">{totalPaid.toFixed(2)}</td>
                                                        <td className="border px-2 py-1 text-right">{totalDue.toFixed(2)}</td>
                                                    </tr>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={filters.year ? 3 : 8} className="border px-4 py-4 text-center text-gray-500">
                                                No data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ─── Buttons ─── */}
                        <div className="mt-4 flex justify-end gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <a
                                href={route('reports.purchase.export', {
                                    tab: 'all',
                                    type: 'pdf',
                                    ...filters,
                                })}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" /> Save PDF
                            </a>
                            <a
                                href={route('reports.purchase.export', {
                                    tab: 'all',
                                    type: 'xlsx',
                                    ...filters,
                                })}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" /> Export Excel
                            </a>
                        </div>
                    </CardContent>

                    {/* ─── Footer ─── */}
                    <div className="text-muted-foreground flex justify-between px-6 py-2 text-sm">
                        <span>Generated on {new Date().toLocaleString()}</span>
                        <span>
                            {company?.company_name} • {company?.email}
                        </span>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
