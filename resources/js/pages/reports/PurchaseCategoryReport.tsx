import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link, Head } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Row {
    date: string;
    voucher_no: string;
    supplier: string; // account ledger name
    item: string; // item details / name
    total_qty: number;
    price_each: number;
    net_amount: number;
}

interface Company {
    company_name: string;
    email?: string;
    mobile?: string;
    address?: string;
    logo_path?: string;
        
    logo_url?: string;
    logo_thumb_url?: string;
    website?: string;
    financial_year?: string; // <-- string, not varChar
}

export default function PurchaseCategoryReport({
    entries,
    filters,
    company,
}: {
    entries: Row[];
    filters: { from_date: string; to_date: string; category_id?: string };
    company: Company;
}) {
    /* --- Totals --- */
    const totalQty = entries.reduce((s, r) => s + Number(r.total_qty), 0);
    const totalAmt = entries.reduce((s, r) => s + Number(r.net_amount), 0);

    /* --- Print --- */
    const handlePrint = () => window.print();
    /******************************
     *  Grand total by unit block *
     ******************************/
    const qtyByUnit = entries.reduce((acc: any, r: any) => {
        acc[r.unit_name] = (acc[r.unit_name] || 0) + Number(r.total_qty);
        return acc;
    }, {});

    return (
        <AppLayout title="Category-wise Purchase Report">
            <div className="max-w-full space-y-4 p-4">
                <Head title="Category-wise Purchase Report" />
                <Card className="shadow-lg">
                    {/* ── Header ───────────────────────────────────────────── */}
                    <CardHeader className="bg-background py-6 text-center">
                        {/* company block */}
                        <div className="space-y-1">
                            {company?.logo_url && (
                                <img src={company.logo_url} alt="Company Logo" className="mx-auto mb-2 h-20 object-contain print:h-12" />
                            )}
                            <h1 className="text-3xl font-bold uppercase">{company?.company_name ?? 'Company Name'}</h1>
                            {company?.address && <p className="text-sm text-foreground">{company?.address}</p>}
                            {company?.mobile && <p className="text-sm text-foreground">Phone: {company?.mobile}</p>}
                            {(company?.email || company?.website) && (
                                <p className="text-sm text-foreground">
                                    {company?.email && <span>{company?.email}</span>}
                                    {company?.email && company?.website && <span className="mx-1">|</span>}
                                    {company?.website && <span>{company?.website}</span>}
                                </p>
                            )}
                        </div>

                        {/* title + date range */}
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">Category-wise Purchase Report</h2>
                            <p className="text-sm text-foreground">
                                From: <strong>{filters.from_date}</strong>, To: <strong>{filters.to_date}</strong>
                            </p>
                        </div>

                        {/* “Change filters” link */}
                        <div className="absolute top-16 right-4 print:hidden">
                            <Link href={route('reports.purchase.filter', { tab: 'category' })} className="text-sm text-blue-600 hover:underline">
                                Change Filters
                            </Link>
                        </div>
                    </CardHeader>

                    {/* ── Body ─────────────────────────────────────────────── */}
                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                                <thead className="bg-gray-100 print:bg-white">
                                    <tr>
                                        <th className="border px-2 py-1">#</th>
                                        <th className="border px-2 py-1">Date</th>
                                        <th className="border px-2 py-1">Vch&nbsp;No</th>
                                        <th className="border px-2 py-1">Account&nbsp;Ledger</th>
                                        <th className="border px-2 py-1">Item&nbsp;Details</th>
                                        <th className="border px-2 py-1 text-right">Total&nbsp;Qty</th>
                                        <th className="border px-2 py-1">Unit</th>
                                        <th className="border px-2 py-1 text-right">Price&nbsp;(each)</th>
                                        <th className="border px-2 py-1 text-right">Total&nbsp;Price&nbsp;(Tk)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.length ? (
                                        <>
                                            {entries.map((r, i) => (
                                                <tr key={i} className="print:bg-white">
                                                    <td className="border px-2 py-1">{i + 1}</td>
                                                    <td className="border px-2 py-1">{new Date(r.date).toLocaleDateString()}</td>
                                                    <td className="border px-2 py-1">{r.voucher_no}</td>
                                                    <td className="border px-2 py-1">{r.supplier}</td>
                                                    <td className="border px-2 py-1">{r.item}</td>
                                                    <td className="border px-2 py-1 text-right">{Number(r.total_qty).toFixed(2)}</td>
                                                    <td className="border px-2 py-1">{r.unit_name}</td>
                                                    <td className="border px-2 py-1 text-right">{Number(r.price_each).toFixed(2)}</td>
                                                    <td className="border px-2 py-1 text-right">{Number(r.net_amount).toFixed(2)}</td>
                                                </tr>
                                            ))}

                                            {/* totals row */}
                                            <tr className="bg-gray-100 font-semibold print:bg-white">
                                                <td className="border px-2 py-1 text-right" colSpan={5}>
                                                    Grand&nbsp;Total
                                                </td>
                                                <td className="border px-2 py-1 text-right">{totalQty.toFixed(2)}</td>
                                                <td className="border px-2 py-1" />
                                                <td className="border px-2 py-1 text-right">{totalAmt.toFixed(2)}</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                                                No purchase data found.
                                            </td>
                                        </tr>
                                    )}
                                    <tr className="bg-background font-semibold print:bg-white">
                                        <td className="border px-2 py-2 text-sm font-medium" colSpan={9}>
                                            <strong>Total Qty by Unit:</strong>
                                            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground">
                                                {Object.entries(qtyByUnit).map(([unit, qty]) => (
                                                    <li key={unit}>
                                                        {qty.toFixed(2)} {unit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* ── Action buttons ───────────────────────── */}
                        <div className="mt-4 flex justify-end gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <a
                                href={route('reports.purchase.export', {
                                    tab: 'category',
                                    type: 'pdf',
                                    ...filters,
                                })}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" />
                                Save&nbsp;as&nbsp;PDF
                            </a>
                            <a
                                href={route('reports.purchase.export', {
                                    tab: 'category',
                                    type: 'xlsx',
                                    ...filters,
                                })}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export&nbsp;Excel
                            </a>
                        </div>
                    </CardContent>

                    {/* ── Footer ─────────────────────────────────── */}
                    <div className="text-muted-foreground flex justify-between text-sm">
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
