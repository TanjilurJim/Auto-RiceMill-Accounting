import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
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

    const columns = [
        { header: '#', accessor: (_: any, index: number) => index + 1, className: 'text-center' },
        { header: 'Product', accessor: (item: FinishedProductItem) => item.product?.item_name || 'N/A' },
        { header: 'Godown', accessor: (item: FinishedProductItem) => item.godown?.name || 'N/A' },
        { header: 'Unit Price', accessor: (item: FinishedProductItem) => formatMoney(item.unit_price), className: 'text-right' },
        { header: 'Quantity', accessor: (item: FinishedProductItem) => item.quantity, className: 'text-right' },
        { header: 'Total', accessor: (item: FinishedProductItem) => formatMoney(item.total), className: 'text-right' },
    ];

    return (
        <AppLayout>
            <Head title={`Finished Product - ${finishedProduct.production_voucher_no}`} />

            <div className="h-full w-screen lg:w-full bg-gray-100 p-6">
                {/* Page Header */}

                <div className="h-full bg-white rounded-lg p-6">
                    <PageHeader
                        title={`Finished Product: ${finishedProduct.production_voucher_no}`}
                        addLinkHref={route('finished-products.index')}
                        addLinkText="Back"
                        printLinkHref={route('finished-products.print', finishedProduct.id)}
                        printLinkText="Print"
                    />

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-2 border">
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
                    <div className="mt-8 rounded-lg bg-white p-4 shadow border">
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">Finished Product Items</h2>
                        <TableComponent
                            columns={columns}
                            data={finishedProduct.items}
                            noDataMessage="No finished product items found."
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
