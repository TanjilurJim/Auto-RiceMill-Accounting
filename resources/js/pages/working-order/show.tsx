import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

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

            <div className="mx-auto max-w-5xl bg-gray-300 px-3 py-6 shadow-xl">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    {/* header */}
                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Working Order&nbsp;{workingOrder.voucher_no}</h1>
                            <p className="text-xs text-gray-500">Date: {workingOrder.date}</p>
                        </div>
                        <Link href={route('working-orders.index')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            ← Back
                        </Link>
                    </div>

                    {/* items */}
                    <h2 className="mb-2 text-sm font-semibold text-gray-800">Materials / Stock</h2>
                    <div className="space-y-1">
                        {workingOrder.items.map((row) => (
                            <div key={row.id} className="grid grid-cols-12 gap-2 rounded border border-gray-100 bg-gray-50 px-3 py-2">
                                <div className="col-span-4 text-xs">{row.item?.item_name ?? '—'}</div>

                                <div className="col-span-2 text-xs">{row.godown?.name ?? '—'}</div>

                                <div className="col-span-2 text-right text-xs">{Number(row.quantity).toFixed(2)}</div>

                                <div className="col-span-2 text-right text-xs">{Number(row.purchase_price).toFixed(2)}</div>

                                <div className="col-span-2 text-right text-xs font-medium text-indigo-600">{Number(row.subtotal).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>

                    {/* extras */}
                    {workingOrder.extras.length > 0 && (
                        <>
                            <h2 className="mt-4 mb-2 text-sm font-semibold text-gray-800">Additional Expenses</h2>
                            <div className="space-y-1">
                                {workingOrder.extras.map((ex) => (
                                    <div key={ex.id} className="grid grid-cols-12 gap-2 rounded border border-gray-100 bg-gray-50 px-3 py-2">
                                        <div className="col-span-6 text-xs">{ex.title}</div>
                                        <div className="col-span-2 text-right text-xs">{ex.quantity ?? '-'}</div>
                                        <div className="col-span-2 text-right text-xs">{ex.price ?? '-'}</div>
                                        <div className="col-span-2 text-right text-xs font-medium text-indigo-600">{Number(ex.total).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* totals */}
                    <div className="mt-4 rounded border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>Materials Total</span>
                            <span>{Number(materialTotal).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>Expenses Total</span>
                            <span>{Number(expenseTotal).toFixed(2)}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-base font-semibold">
                            <span className="text-indigo-700">{Number(workingOrder.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
