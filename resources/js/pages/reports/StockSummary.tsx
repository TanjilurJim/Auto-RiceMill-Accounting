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
            <div className="mx-auto max-w-7xl space-y-4 p-4">
                <Card className="shadow-lg">
                    <CardHeader className="bg-gray-50 py-6 text-center">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold uppercase">{company?.company_name ?? 'Company Name'}</h1>
                            {company?.address && <p className="text-sm text-gray-700">{company.address}</p>}
                            {company?.mobile && <p className="text-sm text-gray-700">Phone: {company.mobile}</p>}
                            {(company?.email || company?.website) && (
                                <p className="text-sm text-gray-700">
                                    {company.email && <span>{company.email}</span>}
                                    {company.email && company.website && <span className="mx-1">|</span>}
                                    {company.website && <span>{company.website}</span>}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold underline">Stock Summary Report</h2>
                            <p className="text-sm text-gray-600">
                                From: <strong>{filters.from}</strong>, To: <strong>{filters.to}</strong>
                            </p>
                        </div>

                        <div className="absolute top-4 right-4 print:hidden">
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
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm">#</th>
                                        <th className="px-4 py-2 text-left text-sm">Item Name</th>
                                        <th className="px-4 py-2 text-left text-sm">Godown</th>
                                        <th className="px-4 py-2 text-left text-sm">Qty (Unit) </th>

                                        <th className="px-4 py-2 text-left text-sm">Total Purchase</th>
                                        <th className="px-4 py-2 text-left text-sm">Total Sale</th>
                                        <th className="px-4 py-2 text-left text-sm">Last Purchase</th>
                                        <th className="px-4 py-2 text-left text-sm">Last Sale</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {stocks.length > 0 ? (
                                        <>
                                            {stocks.map((stock, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 text-sm">{i + 1}</td>
                                                    <td className="px-4 py-2 text-sm">{stock.item_name}</td>
                                                    <td className="px-4 py-2 text-sm">{stock.godown_name}</td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {Number(stock.qty).toFixed(2)} <span className="text-xs text-gray-500">({stock.unit})</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">{Number(stock.total_purchase).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-sm">{Number(stock.total_sale).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {stock.last_purchase_at ? new Date(stock.last_purchase_at).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm">
                                                        {stock.last_sale_at ? new Date(stock.last_sale_at).toLocaleDateString() : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="bg-gray-100 font-semibold">
                                                <td className="px-4 py-2 text-right" colSpan={3}>
                                                    Total
                                                </td>
                                                <td className="px-4 py-2">{totalQty.toFixed(2)}</td>
                                                <td className="px-4 py-2">{totalPurchase.toFixed(2)}</td>
                                                <td className="px-4 py-2">{totalSale.toFixed(2)}</td>
                                                <td className="px-4 py-2">—</td>
                                                <td className="px-4 py-2">—</td>
                                            </tr>
                                        </>
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
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
