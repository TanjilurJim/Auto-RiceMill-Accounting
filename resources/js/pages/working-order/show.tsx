import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, } from '@inertiajs/react';

/* same types as before */
interface Godown {
    name: string;
}
interface Item {
    item_name: string;
}
interface Row {
    id: number;
    item: Item;
    godown: Godown;
    quantity: number;
    purchase_price: number;
    subtotal: number;
}
interface Extra {
    id: number;
    title: string;
    quantity: number | null;
    price: number | null;
    total: number;
}

interface Props {
    workingOrder: {
        id: number;
        date: string;
        voucher_no: string;
        reference_no: string | null;
        total_amount: number;
        items: Row[];
        extras: Extra[];
    };
}

export default function Show({ workingOrder }: Props) {
    const materialTotal = workingOrder.items.reduce((t, r) => t + r.subtotal, 0);
    const expenseTotal = workingOrder.extras.reduce((t, r) => t + r.total, 0);

    return (
        <AppLayout>
            <Head title={`WO ${workingOrder.voucher_no}`} />

            <div className="mx-auto h-full w-full p-6 shadow-xl bg-background">
                <div className="h-full rounded-xl border-gray-200 bg-background p-6">
                    {/* Header */}
                    <PageHeader
                        title={
                            <>
                                <h1 className="">Working Order&nbsp;{workingOrder.voucher_no}</h1>
                                <p className="text-xs text-gray-500">Date: {workingOrder.date}</p>
                            </>
                        }
                        addLinkHref={route('working-orders.index')}
                        addLinkText={
                            <span className="inline-flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Back
                            </span>
                        }
                    />

                    {/* Items */}
                    <h2 className="mb-2 text-sm font-semibold text-gray-800">Materials / Stock</h2>
                    <div className="space-y-1">
                        {workingOrder.items.map((row) => (
                            <div
                                key={row.id}
                                className="grid grid-cols-1 gap-4 rounded border border-gray-100 bg-background p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12"
                            >
                                <div className="col-span-4 lg:col-span-4 text-xs">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Product</label>
                                    {row.item?.item_name ?? '—'}
                                </div>
                                <div className="col-span-2 lg:col-span-2 text-xs">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Godown</label>
                                    {row.godown?.name ?? '—'}
                                </div>
                                <div className="col-span-2 lg:col-span-2 text-right text-xs">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Unit Price</label>
                                    {Number(row.quantity).toFixed(2)}
                                </div>
                                <div className="col-span-2 lg:col-span-2 text-right text-xs">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Qty</label>
                                    {Number(row.purchase_price).toFixed(2)}
                                </div>
                                <div className="col-span-2 lg:col-span-2 text-right text-xs font-medium text-indigo-600">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Subtotal</label>
                                    {Number(row.subtotal).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Extras */}
                    {/* {workingOrder.extras.length > 0 && (
                        <>
                            <h2 className="mt-4 mb-2 text-sm font-semibold text-gray-800">Additional Expenses</h2>
                            <div className="space-y-1">
                                {workingOrder.extras.map((ex) => (
                                    <div
                                        key={ex.id}
                                        className="grid grid-cols-1 gap-4 rounded border border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-12"
                                    >
                                        <div className="col-span-6 lg:col-span-6 text-xs">{ex.title}</div>
                                        <div className="col-span-2 lg:col-span-2 text-right text-xs">{ex.quantity ?? '-'}</div>
                                        <div className="col-span-2 lg:col-span-2 text-right text-xs">{ex.price ?? '-'}</div>
                                        <div className="col-span-2 lg:col-span-2 text-right text-xs font-medium text-indigo-600">
                                            {Number(ex.total).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )} */}

                    {/* Totals */}
                    <div className="mt-4 rounded border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>Materials Total</span>
                            <span>{Number(materialTotal).toFixed(2)}</span>
                        </div>
                        {/* <div className="flex items-center justify-between text-sm">
                            <span>Expenses Total</span>
                            <span>{Number(expenseTotal).toFixed(2)}</span>
                        </div> */}
                        <div className="mt-1 flex items-center justify-between text-base font-semibold">
                            <span className="text-indigo-700">{Number(workingOrder.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
