import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

/* 🧠 Local helper for formatting money */
const formatMoney = (val: any) => {
    const num = Number(val);
    return isNaN(num) ? '—' : num.toFixed(2);
};

interface FinishedProductItem {
    id: number;
    product_id: number;
    godown_id: number;
    quantity: number;
    unit_price: number;
    total: number;
    product?: {
        id: number;
        item_name: string;
    };
    godown?: {
        id: number;
        name: string;
    };
}

interface FinishedProductData {
    id: number;
    working_order_id: number;
    production_date: string;
    production_voucher_no: string;
    reference_no?: string | null;
    remarks?: string | null;
    items: FinishedProductItem[];
    working_order?: {
        id: number;
        voucher_no: string;
        production_status: string;
    };
}

export default function Show({ finishedProduct }: { finishedProduct: FinishedProductData }) {
    return (
        <AppLayout>
            <Head title={`Finished Product - ${finishedProduct.production_voucher_no}`} />

            <div className="min-h-screen bg-gray-100 p-6">
                {/* Page Header */}
                {/* <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Finished Product: {finishedProduct.production_voucher_no}</h1>
                    <div className="space-x-2">
                        <Link
                            href={route('finished-products.print', finishedProduct.id)}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Print
                        </Link>
                        
                        <Link href={route('finished-products.index')} className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400">
                            Back
                        </Link>
                    </div>
                </div> */}

                <PageHeader
                    title={`Finished Product: ${finishedProduct.production_voucher_no}`}
                    addLinkHref={route('finished-products.index')}
                    addLinkText="Back"
                    printLinkHref={route('finished-products.print', finishedProduct.id)}
                    printLinkText="Print"
                />

                {/* Basic Info */}
                <div className="grid grid-cols-1 gap-4 rounded bg-white p-4 shadow md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-2">
                        <div>
                            <span className="font-semibold">Production Date:</span> <span>{finishedProduct.production_date}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Reference:</span> <span>{finishedProduct.reference_no ?? 'N/A'}</span>
                        </div>
                        <div>
                            <span className="font-semibold">Remarks:</span> <span>{finishedProduct.remarks ?? 'N/A'}</span>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                        <div>
                            <span className="font-semibold">Working Order:</span>{' '}
                            {finishedProduct.working_order ? finishedProduct.working_order.voucher_no : 'N/A'}
                        </div>
                        <div>
                            <span className="font-semibold">Production Status:</span>{' '}
                            {finishedProduct.working_order ? finishedProduct.working_order.production_status : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-8 rounded bg-white p-4 shadow">
                    <h2 className="mb-2 text-lg font-semibold text-gray-800">Finished Product Items</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">#</th>
                                    <th className="border px-4 py-2">Product</th>
                                    <th className="border px-4 py-2">Godown</th>
                                    <th className="border px-4 py-2">Quantity</th>
                                    <th className="border px-4 py-2">Unit Price</th>
                                    <th className="border px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {finishedProduct.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{item.product ? item.product.item_name : 'N/A'}</td>
                                        <td className="border px-4 py-2">{item.godown ? item.godown.name : 'N/A'}</td>
                                        <td className="border px-4 py-2">{item.quantity}</td>
                                        <td className="border px-4 py-2">{formatMoney(item.unit_price)}</td>
                                        <td className="border px-4 py-2">{formatMoney(item.total)}</td>
                                    </tr>
                                ))}

                                {finishedProduct.items.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="border px-4 py-2 text-center text-gray-500">
                                            No finished product items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
