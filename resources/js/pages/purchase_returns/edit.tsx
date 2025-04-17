import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Godown {
    id: number;
    name: string;
}
interface Ledger {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
}
interface PurchaseReturnItem {
    id: number;
    product_id: number;
    qty: number;
    price: number;
    subtotal: number;
}

export default function PurchaseReturnEdit({
    purchase_return,
    godowns,
    ledgers,
    items,
    receivedModes, // 🆕
    inventoryLedgers,
}: {
    purchase_return: any;
    godowns: Godown[];
    ledgers: Ledger[];
    items: Item[];
    receivedModes: { id: number; mode_name: string; ledger_id: number; ledger?: any }[]; // 🆕
    inventoryLedgers: Ledger[]; // 🆕
}) {
    const { data, setData, put, processing, errors } = useForm({
        date: purchase_return.date || '',
        return_voucher_no: purchase_return.return_voucher_no || '',
        godown_id: purchase_return.godown_id || '',
        account_ledger_id: purchase_return.account_ledger_id || '',
        inventory_ledger_id: purchase_return.inventory_ledger_id || '', // 🆕
        reason: purchase_return.reason || '',
        return_items: purchase_return.return_items.map((i: PurchaseReturnItem) => ({
            id: i.id, // keep if you need row IDs
            product_id: i.product_id,
            qty: i.qty,
            price: i.price,
            subtotal: i.subtotal,
        })),
        refund_modes: purchase_return.refund_modes?.length
            ? purchase_return.refund_modes.map((r: any) => ({
                  id: r.id,
                  mode_name: r.mode_name,
                  phone_number: r.phone_number,
                  ledger_id: r.ledger_id,
                  amount_paid: r.amount_paid,
              }))
            : [{ id: null, mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' }],
    });

    // Dynamic item row logic
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.return_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].price) || 0;
        const subtotal = qty * price;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('return_items', updatedItems);
    };

    const addProductRow = () => setData('return_items', [...data.return_items, { product_id: '', qty: '', price: '', subtotal: '' }]);

    const removeProductRow = (index: number) => {
        if (data.return_items.length === 1) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Remove this item row?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = [...data.return_items];
                updated.splice(index, 1);
                setData('return_items', updated);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/purchase-returns/${purchase_return.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Purchase Return" />
            <div className="bg-gray-100 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Purchase Return</h1>
                    <Link href="/purchase-returns" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
                    {/* Return Info */}
                    <div className="space-y-4">
                        <h2 className="border-b pb-1 text-lg font-semibold">Return Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input type="date" className="border p-2" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                            <input type="text" className="border p-2" value={data.return_voucher_no} readOnly />
                            <select className="border p-2" value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)}>
                                <option value="">Select Godown</option>
                                {godowns.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="border p-2"
                                value={data.account_ledger_id}
                                onChange={(e) => setData('account_ledger_id', e.target.value)}
                            >
                                <option value="">Select Party Ledger</option>
                                {ledgers.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.account_ledger_name}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="border p-2"
                                value={data.inventory_ledger_id}
                                onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                            >
                                <option value="">Select Inventory Ledger</option>
                                {inventoryLedgers.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.account_ledger_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Reason for Return"
                            className="w-full border p-2"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                        ></textarea>
                    </div>

                    {/* Return Items Table */}
                    <div>
                        <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Return Items</h2>
                        <div className="overflow-x-auto rounded border">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50 text-sm">
                                    <tr>
                                        <th className="border px-2 py-1">Product</th>
                                        <th className="border px-2 py-1">Qty</th>
                                        <th className="border px-2 py-1">Unit Price</th>
                                        <th className="border px-2 py-1">Subtotal</th>
                                        <th className="border px-2 py-1 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.return_items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border px-2 py-1">
                                                <select
                                                    className="w-full"
                                                    value={item.product_id}
                                                    onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    {items.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.item_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input
                                                    type="number"
                                                    className="w-full"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                />
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input
                                                    type="number"
                                                    className="w-full"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                                />
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input type="number" className="w-full bg-gray-100" value={item.subtotal} readOnly />
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                <div className="flex justify-center space-x-1">
                                                    {data.return_items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProductRow(index)}
                                                            className="rounded bg-red-500 px-2 py-1 text-white"
                                                        >
                                                            &minus;
                                                        </button>
                                                    )}
                                                    {index === data.return_items.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={addProductRow}
                                                            className="rounded bg-blue-500 px-2 py-1 text-white"
                                                        >
                                                            +
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="mt-6 flex justify-between gap-4">
                        <div className="w-1/3 space-y-3">
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Qty:</span>
                                <span className="font-semibold">{data.return_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Return Value:</span>
                                <span className="font-semibold">
                                    {data.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)} Tk
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <h2 className="border-b pb-1 text-lg font-semibold">Refund Mode</h2>
                        {data.refund_modes.map((mode, index) => (
                            <div key={index} className="grid grid-cols-1 items-center gap-4 md:grid-cols-5">
                                <select
                                    className="border p-2"
                                    value={mode.ledger_id}
                                    onChange={(e) => {
                                        const u = [...data.refund_modes];
                                        u[index].ledger_id = e.target.value;

                                        // optional auto‑fill of mode_name
                                        const sel = receivedModes.find((rm) => rm.ledger_id == e.target.value);
                                        u[index].mode_name = sel?.mode_name ?? u[index].mode_name;

                                        setData('refund_modes', u);
                                    }}
                                >
                                    <option value="">Select Refund Mode</option>
                                    {receivedModes.map((rm) => (
                                        <option key={rm.id} value={rm.ledger_id}>
                                            {rm.mode_name} — {rm.ledger?.account_ledger_name ?? ''}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="border p-2"
                                    placeholder="Phone"
                                    value={mode.phone_number}
                                    onChange={(e) => {
                                        const u = [...data.refund_modes];
                                        u[index].phone_number = e.target.value;
                                        setData('refund_modes', u);
                                    }}
                                />
                                
                                <input
                                    type="number"
                                    className="border p-2"
                                    placeholder="Amount"
                                    value={mode.amount_paid}
                                    onChange={(e) => {
                                        const u = [...data.refund_modes];
                                        u[index].amount_paid = e.target.value;
                                        setData('refund_modes', u);
                                    }}
                                />
                                <div className="flex gap-2">
                                    {data.refund_modes.length > 1 && (
                                        <button
                                            type="button"
                                            className="rounded bg-red-500 px-3 py-1 text-white"
                                            onClick={() => {
                                                const u = [...data.refund_modes];
                                                u.splice(index, 1);
                                                setData('refund_modes', u);
                                            }}
                                        >
                                            &minus;
                                        </button>
                                    )}
                                    {index === data.refund_modes.length - 1 && (
                                        <button
                                            type="button"
                                            className="rounded bg-blue-500 px-3 py-1 text-white"
                                            onClick={() => {
                                                setData('refund_modes', [
                                                    ...data.refund_modes,
                                                    { mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' },
                                                ]);
                                            }}
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Submit */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Update Return'}
                        </button>
                        <Link
                            href="/purchase-returns"
                            className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
