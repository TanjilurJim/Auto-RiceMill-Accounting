import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileSpreadsheet } from 'lucide-react';
import { useEffect } from 'react';

interface CategorySummary {
    category_name: string;
    total_qty: number;
    total_purchase: number;
    total_sale: number;
    last_purchase_at: string | null;
    last_sale_at: string | null;
    last_purchase_qty: number;
    last_sale_qty: number;
    last_purchase_unit?: string;
    last_sale_unit?: string;
}

interface Company {
    company_name: string;
    email?: string;
    mobile?: string;
    address?: string;

    website?: string;
    logo_path?: string;

    logo_url?: string;
    logo_thumb_url?: string;
}

interface Props {
    categories: CategorySummary[];
    filters: {
        from: string;
        to: string;
    };
    company: Company;
}

export default function CategoryWiseStockSummary({ categories, filters, company }: Props) {
    const totalQty = categories.reduce((sum, c) => sum + c.total_qty, 0);
    const totalPurchase = categories.reduce((sum, c) => sum + c.total_purchase, 0);
    const totalSale = categories.reduce((sum, c) => sum + c.total_sale, 0);
    const totalLastPurchaseQty = categories.reduce((sum, c) => sum + (typeof c.last_purchase_qty === 'number' ? c.last_purchase_qty : 0), 0);
    const totalLastSaleQty = categories.reduce((sum, c) => sum + (typeof c.last_sale_qty === 'number' ? c.last_sale_qty : 0), 0);

    const handlePrint = () => window.print();

    useEffect(() => {
        document.title = 'Category Wise Stock Summary';
    }, []);

    return (
        <AppLayout title="Category Wise Stock Summary">
            <div className="max-w-full space-y-6 p-4">
                <Card className="shadow">
                    <CardHeader className="space-y-1 border-b bg-gray-50 py-6 text-center">
                        {company?.logo_url && (
                <img
                  src={company.logo_url}
                  alt="Company Logo"
                  className="mx-auto mb-2 h-16 w-auto object-contain sm:h-20 print:h-12"
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
                            <h2 className="text-xl font-semibold underline">Category Wise Stock Summary</h2>
                            <p className="text-sm text-gray-600">
                                From: <strong>{filters.from}</strong> To: <strong>{filters.to}</strong>
                            </p>
                        </div>
                        <div className="absolute top-16 right-4 print:hidden">
                            <Link href={route('reports.stock-summary')} className="text-sm text-blue-600 hover:underline">
                                Change Filters
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 print:table-fixed print:text-xs">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm">#</th>
                                        <th className="px-4 py-2 text-left text-sm">Category</th>
                                        <th className="px-4 py-2 text-right text-sm">Total Qty</th>
                                        <th className="px-4 py-2 text-right text-sm">Total Purchase</th>
                                        <th className="px-4 py-2 text-right text-sm">Total Sale</th>
                                        <th className="px-4 py-2 text-right text-sm">Last Purchase</th>
                                        <th className="px-4 py-2 text-right text-sm">Purchase Qty</th>
                                        <th className="px-4 py-2 text-right text-sm">Last Sale</th>
                                        <th className="px-4 py-2 text-right text-sm">Last Sale Qty</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map((cat, idx) => (
                                        <tr key={idx} className="break-inside-avoid">
                                            <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                            <td className="px-4 py-2 text-sm">{cat.category_name}</td>
                                            <td className="px-4 py-2 text-right text-sm">{cat.total_qty.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">{cat.total_purchase.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">{cat.total_sale.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {cat.last_purchase_at ? new Date(cat.last_purchase_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {Number(cat.last_purchase_qty).toFixed(2)} {cat.last_purchase_unit ?? ''}
                                            </td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {cat.last_sale_at ? new Date(cat.last_sale_at).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-4 py-2 text-right text-sm">
                                                {Number(cat.last_sale_qty).toFixed(2)} {cat.last_sale_unit ?? ''}
                                            </td>
                                        </tr>
                                    ))}

                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="px-4 py-2 text-right text-sm" colSpan={2}>
                                            Total
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm">{totalQty.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">{totalPurchase.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">{totalSale.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        {/* <td className="px-4 py-2 text-right text-sm">{totalLastPurchaseQty.toFixed(2)}</td> */}

                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        <td className="px-4 py-2 text-right text-sm">—</td>
                                        {/* <td className="px-4 py-2 text-right text-sm">{totalLastSaleQty.toFixed(2)}</td> */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end gap-2 print:hidden">
                            {/* <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> Print
                            </Button>
                            <a
                                href={route('reports.stock-summary.category-wise.pdf', filters)}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileText className="h-4 w-4" /> Save as PDF
                            </a> */}
                            <a
                                href={route('reports.stock-summary.category-wise.excel', filters)}
                                className="inline-flex items-center gap-1 rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <FileSpreadsheet className="h-4 w-4" /> Export Excel
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
