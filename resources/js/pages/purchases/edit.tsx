import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
/*  resources/js/Pages/purchases/edit.tsx  */
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

/* ---------- helper ---------- */
const scrollToFirstError = (errors: Record<string, any>) => {
    const first = Object.keys(errors)[0];
    if (!first) return;

    const el = document.querySelector(`[name="${first.replace(/\./g, '\\.')}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (el as HTMLElement)?.focus?.();
};
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------- types ---------- */

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}
interface Godown {
    id: number;
    name: string;
}
interface Salesman {
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

interface StockRow {
    id: number;
    qty: number;
    item: { id: number; item_name: string };
}

interface PurchaseItem {
    product_id: number | string;
    qty: number | string;
    price: number | string;
    discount: number | string;
    discount_type: 'bdt' | 'percent';
    subtotal: number | string;
}

interface PurchaseData {
    id: number;
    date: string;
    voucher_no: string | null;
    godown_id: number | string | null;
    salesman_id: number | string | null;
    account_ledger_id: number | string | null;
    phone: string | null;
    address: string | null;
    shipping_details: string | null;
    delivered_to: string | null;
    purchase_items: PurchaseItem[];
    /* amount_paid / received_mode_id if you add them */
}

interface Props {
    purchase: PurchaseData;
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    inventoryLedgers: Ledger[]; // 👈 NEW
    receivedModes: ReceivedMode[]; // 👈 NEW
    stockItemsByGodown: { [k: number]: StockRow[] };
}

/* ---------- component ---------- */
export default function PurchaseEdit({ purchase, godowns, salesmen, ledgers, stockItemsByGodown, inventoryLedgers, receivedModes }: Props) {
    /* form ----------------------------- */
    const { data, setData, put, processing, errors } = useForm({
        date: purchase.date,
        voucher_no: purchase.voucher_no ?? '',
        godown_id: purchase.godown_id ?? '',
        salesman_id: purchase.salesman_id ?? '',
        account_ledger_id: purchase.account_ledger_id ?? '',
        phone: purchase.phone ?? '',
        address: purchase.address ?? '',
        shipping_details: purchase.shipping_details ?? '',
        delivered_to: purchase.delivered_to ?? '',
        purchase_items: purchase.purchase_items.map((pi) => ({ ...pi })),
        inventory_ledger_id: purchase.inventory_ledger_id ?? '',
        received_mode_id: purchase.received_mode_id ?? '',
        amount_paid: purchase.amount_paid ?? '',
    });

    /* scroll to first error ------------- */
    useEffect(() => {
        if (Object.keys(errors).length) scrollToFirstError(errors);
    }, [errors]);

    /* stock list for the selected godown */
    const godownItems: StockRow[] =
        data.godown_id && stockItemsByGodown[data.godown_id as number] ? stockItemsByGodown[data.godown_id as number] : [];

    /* --------- handlers --------------- */
    const handleItemChange = (idx: number, field: string, value: any) => {
        const items = [...data.purchase_items];
        items[idx][field as keyof PurchaseItem] = value;

        const qty = parseFloat(items[idx].qty as any) || 0;
        const price = parseFloat(items[idx].price as any) || 0;
        const disc = parseFloat(items[idx].discount as any) || 0;
        const discAmt = items[idx].discount_type === 'percent' ? qty * price * (disc / 100) : disc;

        items[idx].subtotal = Math.max(qty * price - discAmt, 0);
        setData('purchase_items', items);
    };

    const addRow = () =>
        setData('purchase_items', [...data.purchase_items, { product_id: '', qty: '', price: '', discount: '', discount_type: 'bdt', subtotal: '' }]);

    const removeRow = (idx: number) => {
        if (data.purchase_items.length === 1) return;

        confirmDialog({}, () => {
            const updated = [...data.purchase_items];
            updated.splice(idx, 1);
            setData('purchase_items', updated);
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('purchases.update', purchase.id));
    };

    /* totals --------------------------- */
    const totalQty = data.purchase_items.reduce((s, i) => s + (+i.qty || 0), 0);
    const totalDisc = data.purchase_items.reduce((s, i) => s + (+i.discount || 0), 0);
    const grandTotal = data.purchase_items.reduce((s, i) => s + (+i.subtotal || 0), 0);

    function handleSaveAndPrint(e?: any): void {
        if (e) e.preventDefault();
        put(route('purchases.update', purchase.id), {
            onSuccess: () => {
                window.open(route('purchases.print', purchase.id), '_blank');
            },
        });
    }
    /* ----------- render --------------- */
    return (
        <AppLayout>
            <Head title="Update Purchase" />
            <div className="h-full w-screen bg-gray-100 p-6 lg:w-full">
                <div className="h-full rounded-lg bg-white p-6">
                    {/* Header */}
                    <PageHeader title="Update Purchase" addLinkHref="/purchases" addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow">
                        {/* ---------- Info section ---------- */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">Purchase Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <input
                                    type="date"
                                    name="date"
                                    className="border p-2"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                <input type="text" className="border p-2" readOnly value={data.voucher_no ?? ''} />
                                <select
                                    name="godown_id"
                                    className={cn('border p-2', errors.godown_id && 'border-red-500')}
                                    value={data.godown_id ?? ''}
                                    onChange={(e) => setData('godown_id', e.target.value)}
                                >
                                    <option value="">Select Godown</option>
                                    {godowns.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="border p-2"
                                    value={data.salesman_id ?? ''}
                                    onChange={(e) => setData('salesman_id', e.target.value)}
                                >
                                    <option value="">Select Salesman</option>
                                    {salesmen.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="border p-2"
                                    value={data.account_ledger_id ?? ''}
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
                                    className={cn('border p-2', errors.inventory_ledger_id && 'border-red-500')}
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

                                <input
                                    type="text"
                                    className="border p-2"
                                    placeholder="Phone"
                                    value={data.phone ?? ''}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="border p-2"
                                    placeholder="Address"
                                    value={data.address ?? ''}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* ---------- Items table ---------- */}
                        <div>
                            <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Products</h2>
                            <div className="overflow-x-auto rounded border">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border px-2 py-1">Product</th>
                                            <th className="border px-2 py-1">Qty</th>
                                            <th className="border px-2 py-1">Price</th>
                                            <th className="border px-2 py-1">Discount</th>
                                            <th className="border px-2 py-1">Type</th>
                                            <th className="border px-2 py-1">Subtotal</th>
                                            <th className="border px-2 py-1 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.purchase_items.map((it, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border px-2 py-1">
                                                    <select
                                                        className="w-full"
                                                        value={it.product_id}
                                                        onChange={(e) => handleItemChange(idx, 'product_id', e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        {godownItems.map((s) => (
                                                            <option key={s.item.id} value={s.item.id}>
                                                                {s.item.item_name} ({s.qty} in stock)
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={it.qty}
                                                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={it.price}
                                                        onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        className="w-full"
                                                        value={it.discount}
                                                        onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <select
                                                        className="w-full"
                                                        value={it.discount_type}
                                                        onChange={(e) => handleItemChange(idx, 'discount_type', e.target.value)}
                                                    >
                                                        <option value="bdt">BDT</option>
                                                        <option value="percent">%</option>
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input readOnly type="number" className="w-full bg-gray-100" value={it.subtotal} />
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    <div className="flex justify-center space-x-1">
                                                        {data.purchase_items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRow(idx)}
                                                                className="bg-danger hover:bg-danger-hover rounded px-2 py-1 text-white"
                                                            >
                                                                &minus;
                                                            </button>
                                                        )}
                                                        {idx === data.purchase_items.length - 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={addRow}
                                                                className="bg-primary hover:bg-primary-hover rounded px-2 py-1 text-white"
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

                        {/* ---------- Payment Info ---------- */}
                        <div className="mt-8 space-y-4 border-t pt-4">
                            <h2 className="text-lg font-semibold">Payment Info</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Payment Mode */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                                    <select
                                        className={cn('w-full rounded border p-2', errors.received_mode_id && 'border-red-500')}
                                        value={data.received_mode_id}
                                        onChange={(e) => setData('received_mode_id', e.target.value)}
                                    >
                                        <option value="">Select Payment Mode</option>
                                        {receivedModes.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Amount Paid */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                                    <input
                                        type="number"
                                        className={cn('w-full rounded border p-2', errors.amount_paid && 'border-red-500')}
                                        placeholder="Amount Paid"
                                        value={data.amount_paid}
                                        onChange={(e) => setData('amount_paid', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ---------- totals --------------- */}
                        <div className="mt-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Item Qty Total */}
                                <div className="flex justify-between rounded border bg-gray-50 p-3">
                                    <span className="font-medium text-gray-700">Item Qty Total:</span>
                                    <span className="font-semibold text-gray-900">{totalQty}</span>
                                </div>

                                {/* Total Discount */}
                                <div className="flex justify-between rounded border bg-gray-50 p-3">
                                    <span className="font-medium text-gray-700">Total Discount:</span>
                                    <span className="font-semibold text-gray-900">{totalDisc}</span>
                                </div>

                                {/* Grand Total */}
                                <div className="flex justify-between rounded border bg-gray-50 p-3">
                                    <span className="font-medium text-gray-700">Grand Total:</span>
                                    <span className="font-semibold text-gray-900">{grandTotal}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Delivered To */}
                        <div className="col-span-2 grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2">
                            {/* Supplier Info */}
                            <div>
                                <label className="mb-1 block font-semibold text-gray-700">Supplier Info</label>
                                <textarea
                                    className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.delivered_to || ''}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                ></textarea>
                            </div>
                            {/* Shipping Details */}
                            <div>
                                <label className="mb-1 block font-semibold text-gray-700">Shipping Details</label>
                                <textarea
                                    className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.shipping_details || ''}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            processing={processing}
                            // saveAndPrintText='Save & Print'
                            cancelText="Cancel"
                            cancelHref="/purchases"
                            submitText={processing ? 'Updating...' : 'Update'}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
