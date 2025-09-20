import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { FileSpreadsheet, FileText, Printer } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

import { Link } from '@inertiajs/react';

interface ItemSummary {
    item_name: string;
    unit: string;
    total_qty: number;
    total_purchase: number;
    total_sale: number;
    total_sale_qty: number;
    last_purchase_at: string | null;
    last_purchase_qty: number;
    last_sale_at: string | null;
    last_sale_qty: number;
}

interface Company {
    company_name: string;
    email?: string;
    mobile?: string;
    address?: string;
    logo_path?: string;
    website?: string;

    logo_url?: string;
    logo_thumb_url?: string;
    financial_year?: string; // <-- string, not varChar
}

interface Props {
    items: ItemSummary[];
    filters: {
        from: string;
        to: string;
        godown_id?: string;
    };
    company: Company;
}

export default function ItemWiseStockSummary({ items, filters, company }: Props) {
    const totalQty = items.reduce((sum, c) => sum + Number(c.total_qty ?? 0), 0);
    const totalPurchase = items.reduce((sum, c) => sum + Number(c.total_purchase ?? 0), 0);
    const totalSale = items.reduce((sum, c) => sum + Number(c.total_sale ?? 0), 0);
    const totalSaleQty = items.reduce((sum, c) => sum + Number(c.total_sale_qty ?? 0), 0);
    const handlePrint = () => window.print();

    useEffect(() => {
        document.title = 'Item Wise Stock Summary';
    }, []);

    return (
        <AppLayout title="Item Wise Stock Summary">
            <div className="max-w-full space-y-6 p-4">
                <Card className="shadow">
                    <CardHeader className="space-y-1 border-b bg-gray-50 py-6 text-center">
                        {company?.logo_path && (
                            <img
                                src={company?.logo_path}
                                alt="Company Logo"
                                className="mx-auto mb-4 h-16 w-16 object-cover"
                            />
                        )}
                        <h1 className="text-3xl font-bold uppercase">{company?.company_name ?? 'Company Name'}</h1>
                        {company?.address && <p className="text-sm text-gray-700">{company?.address}</p>}
                        {company?.mobile && <p className="text-sm text-gray-700">Phone: {company?.mobile}</p>}
                        {(company?.email || company?.website) && (
                            <p className="text-sm text-gray-700">
                                {company?.email} {company?.email && company?.website && ' | '}
                                {company?.website}
                            </p>
                        )}

                        <div className="mt-3">
                            <h2 className="text-xl font-semibold underline">Item Wise Stock Summary</h2>
                            <p className="text-sm text-gray-600">
                                From: <strong>{filters.from}</strong> To: <strong>{filters.to}</strong>
                            </p>
                        </div>
                        <Link href={route('reports.stock-summary')} className="text-sm text-blue-600 hover:underline">
                            Change Filters
                        </Link>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 print:table-fixed print:text-xs">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm">#</th>
                                        <th className="px-4 py-2 text-left text-sm">Item</th>
                                        <th className="px-4 py-2 text-left text-sm">Unit</th>
                                        <th className="px-4 py-2 text-right text-sm">Qty</th>
                                        <th className="px-4 py-2 text-right text-sm">Purchase</th>
                                        <th className="px-4 py-2 text-right text-sm">Sale</th>
                                        <th className="px-4 py-2 text-right text-sm">Sale Qty</th>
                                        <th className="px-4 py-2 text-right text-sm">Last Purchase</th>
                                        <th className="px-4 py-2 text-right text-sm">Purchase Qty</th>
                                        <th className="px-4 py-2 text-right text-sm">Last Sale</th>
                                        <th className="px-4 py-2 text-right text-sm">Sale Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="break-inside-avoid">
                                            <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                            <td className="px-4 py-2 text-sm">{item.item_name}</td>
                                            <td className="px-4 py-2 text-sm">{item.unit}</td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.total_qty ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.total_purchase ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.total_sale ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.total_sale_qty ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {item.last_purchase_at ? new Date(item.last_purchase_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.last_purchase_qty ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {item.last_sale_at ? new Date(item.last_sale_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-4 py-2 text-right text-sm">{Number(item.last_sale_qty ?? 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="px-4 py-2 text-right text-sm" colSpan={3}>
                                            Total
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm">{Number(totalQty).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">{Number(totalPurchase).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">{Number(totalSale).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">{Number(totalSaleQty).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end gap-2 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <a
                                href={route('reports.stock-summary.item-wise.pdf', filters)}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" />
                                Save as PDF
                            </a>

                            <a
                                href={route('reports.stock-summary.item-wise.excel', filters)}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                                Export Excel
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
