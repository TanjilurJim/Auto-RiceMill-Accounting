import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

export default function PurchaseReturnInvoice({ purchase_return }: { purchase_return: any }) {
    const totalAmount = purchase_return.return_items.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.subtotal) || 0),
        0
    );

    return (
        <AppLayout>
            <Head title={`Invoice - ${purchase_return.return_voucher_no}`} />
            <div className="p-6 bg-white w-[800px] mx-auto">
                {/* Invoice Header */}
                <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <h1 className="text-xl font-semibold">Purchase Return Invoice</h1>
                    <span className="text-sm text-gray-500">Date: {purchase_return.date}</span>
                </div>

                {/* Invoice Info */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-sm">
                        <div><strong>Return Voucher:</strong> {purchase_return.return_voucher_no}</div>
                        <div><strong>Godown:</strong> {purchase_return.godown.name}</div>
                        <div><strong>Party:</strong> {purchase_return.account_ledger.account_ledger_name}</div>
                        <div><strong>Reason:</strong> {purchase_return.reason || 'N/A'}</div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                        <p>Prepared By: {purchase_return.creator?.name}</p>
                        <p>Prepared On: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Return Items Table */}
                <table className="min-w-full border-collapse border text-[13px]">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="border px-3 py-2">#</th>
                            <th className="border px-3 py-2">Product</th>
                            <th className="border px-3 py-2">Qty</th>
                            <th className="border px-3 py-2">Unit Price</th>
                            <th className="border px-3 py-2">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase_return.return_items.map((item: any, index: number) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border px-3 py-1">{index + 1}</td>
                                <td className="border px-3 py-1">{item.item?.item_name || 'N/A'}</td>
                                <td className="border px-3 py-1">{item.qty}</td>
                                <td className="border px-3 py-1">{parseFloat(item.price).toFixed(2)} Tk</td>
                                <td className="border px-3 py-1">{parseFloat(item.subtotal).toFixed(2)} Tk</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Total Summary */}
                <div className="mt-4 text-right space-y-1">
                    <p className="font-semibold">Total Qty: {purchase_return.total_qty}</p>
                    <p className="font-semibold">Grand Total: {totalAmount.toFixed(2)} Tk</p>
                </div>

                {/* Print Button */}
                <div className="mt-6 flex justify-end gap-3 print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="rounded bg-blue-600 px-5 py-2 font-semibold text-white shadow hover:bg-blue-700"
                    >
                        Print Invoice
                    </button>
                    <Link href="/purchase-returns" className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100">
                        Back
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
