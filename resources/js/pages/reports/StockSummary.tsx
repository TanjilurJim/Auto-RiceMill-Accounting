import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';

interface Stock {
    item_name: string;
    godown_name: string;
    qty: number;
    unit: string;
    total_purchase: number;
    total_sale: number;
    total_sale_qty: number;
    last_purchase_at: string | null;
    last_sale_at: string | null;
}

interface Company {
    company_name: string;
    email?: string;
    mobile?: string;
    address?: string;
    logo_path?: string;
}

interface Props {
    stocks: Stock[];
    filters: {
        from: string;
        to: string;
        godown_id?: string;
    };
    company: Company;
}

export default function StockSummary({ stocks, filters, company }: Props) {
    const totalPurchase = stocks.reduce((sum, s) => sum + (s.total_purchase || 0), 0);
    const totalSale = stocks.reduce((sum, s) => sum + (s.total_sale || 0), 0);
    const totalQty = stocks.reduce((sum, s) => sum + (s.qty || 0), 0);

    const handlePrint = () => window.print();

    return (
        <AppLayout title="Stock Summary Report">
            <div className="max-w-full space-y-4 p-4">
                <Card className="shadow-lg">
                    <CardHeader className="bg-gray-50 py-6 text-center">
                        <div className="space-y-1">
                            {company?.logo_path && (
                                <img src={company?.logo_path} alt="Company Logo" className="mx-auto mb-2 h-16 w-16 object-cover" />
                            )}

                            <h1 className="text-3xl font-bold uppercase">{company?.company_name ?? 'Company Name'}</h1>
                            {company?.address && <p className="text-sm text-gray-700">{company?.address}</p>}
                            {company?.mobile && <p className="text-sm text-gray-700">Phone: {company?.mobile}</p>}
                            {(company?.email || company?.website) && (
                                <p className="text-sm text-gray-700">
                                    {company?.email && <span>{company?.email}</span>}
                                    {company?.email && company?.website && <span className="mx-1">|</span>}
                                    {company?.website && <span>{company?.website}</span>}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">Stock Summary Report</h2>
                            <p className="text-sm text-gray-600">
                                From: <strong>{filters.from}</strong>, To: <strong>{filters.to}</strong>
                            </p>
                        </div>

                        <div className="absolute top-16 right-4 print:hidden">
                            <Link href={route('reports.stock-summary')} className="text-sm text-blue-600 hover:underline">
                                Change Filters
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="mb-4 text-sm text-gray-600">
                            Stock from <strong>{filters.from}</strong> to <strong>{filters.to}</strong>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm print:text-xs">
                                <thead className="bg-gray-100 print:bg-white">
                                    <tr>
                                        <th className="border px-2 py-1 text-left">#</th>
                                        <th className="border px-2 py-1 text-left">Item Name</th>
                                        <th className="border px-2 py-1 text-left">Godown</th>
                                        <th className="border px-2 py-1 text-left">Qty (Unit)</th>
                                        <th className="border px-2 py-1 text-left">Lot_no</th>
                                        {/* <th className="border px-2 py-1 text-left">Total Purchase</th>
                                        <th className="border px-2 py-1 text-left">Total Sale</th>
                                        <th className="border px-2 py-1 text-left">Sale Qty (Unit)</th> */}
                                        <th className="border px-2 py-1 text-left">Last Purchase</th>
                                        <th className="border px-2 py-1 text-left">Last Sale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.length > 0 ? (
                                        <>
                                            {stocks.map((stock, i) => (
                                                <tr key={i} className="print:bg-white">
                                                    <td className="border px-2 py-1">{i + 1}</td>
                                                    <td className="border px-2 py-1">{stock.item_name}</td>
                                                    <td className="border px-2 py-1">{stock.godown_name}</td>
                                                    <td className="border px-2 py-1">
                                                        {Number(stock.qty).toFixed(2)} <span className="text-xs text-gray-500">({stock.unit})</span>

                                                    </td>
                                                    <td className="border px-2 py-1">{stock.lot_no || '-'}</td>
                                                    
                                                    {/* <td className="border px-2 py-1">{Number(stock.total_purchase).toFixed(2)}</td>
                                                    <td className="border px-2 py-1">{Number(stock.total_sale).toFixed(2)}</td>
                                                    <td className="border px-2 py-1">
                                                        {Number(stock.total_sale_qty || 0).toFixed(2)}{' '}
                                                        <span className="text-xs text-gray-500">({stock.unit})</span>
                                                    </td> */}
                                                    <td className="border px-2 py-1">
                                                        {stock.last_purchase_at ? new Date(stock.last_purchase_at).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="border px-2 py-1">
                                                        {stock.last_sale_at ? new Date(stock.last_sale_at).toLocaleDateString() : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-100 font-semibold print:bg-white">
                                                <td className="border px-2 py-1 text-right" colSpan={3}>
                                                    Total
                                                </td>
                                                <td className="border px-2 py-1">{totalQty.toFixed(2)}</td>
                                                {/* <td className="border px-2 py-1">{totalPurchase.toFixed(2)}</td>
                                                <td className="border px-2 py-1">{totalSale.toFixed(2)}</td> */}
                                                {/* <td className="border px-2 py-1">
                                                    {Number(stocks.reduce((sum, s) => sum + (Number(s.total_sale_qty) || 0), 0)).toFixed(2)}
                                                </td> */}
                                                <td className="border px-2 py-1">—</td>
                                                <td className="border px-2 py-1">—</td>
                                            </tr>
                                            {/* --- Per-item stock summary --- */}
                                            <tr className="bg-gray-50 print:bg-white">
                                                <td className="border px-2 py-2 text-sm font-medium" colSpan={9}>
                                                    <strong>Closing Stock&nbsp;by&nbsp;Item:</strong>
                                                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-gray-700">
                                                        {Object.entries(
                                                            stocks.reduce<Record<string, number>>((acc, s) => {
                                                                const key = `${s.item_name} (${s.unit})`;
                                                                acc[key] = (acc[key] || 0) + Number(s.qty || 0);
                                                                return acc;
                                                            }, {}),
                                                        ).map(([item, qty]) => (
                                                            <li key={item}>
                                                                {item}: {qty.toFixed(2)}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                                                No stock data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-end gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <a
                                href={route('reports.stock-summary.pdf', filters)}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" />
                                Save as PDF
                            </a>

                            <a
                                href={route('reports.stock-summary.excel', filters)}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export Excel
                            </a>
                        </div>
                    </CardContent>
                    {/* Footer */}
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
