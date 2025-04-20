import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Sale {
    id: number;
    voucher_no: string;
}

interface AccountLedger {
    id: number;
    account_ledger_name: string;
}

interface Product {
    id: number;
    item_name: string;
}
interface ReceivedMode {
    id: number;
    mode_name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface Salesman {
    id: number;
    name: string;
}

export default function SalesReturnCreate({
    sales,
    ledgers,
    products,
    godowns,
    salesmen,
    voucher,
    receivedModes,
}: {
    sales: Sale[];
    ledgers: AccountLedger[];
    products: Product[];
    godowns: Godown[];
    salesmen: Salesman[];
    voucher: string;
    receivedModes: ReceivedMode[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        sale_id: '',
        voucher_no: voucher,
        account_ledger_id: '',
        godown_id: '',
        salesman_id: '',
        return_date: '',
        reason: '',
        phone: '',
        address: '',
        shipping_details: '',
        inventory_ledger_id: '',
        received_mode_id: '',
        amount_received: '',
        delivered_to: '',
        sales_return_items: [{ product_id: '', qty: '', main_price: '', discount: '', return_amount: '' }],
    });

    useEffect(() => {
        if (data.sale_id) {
            axios.get(`/sales/${data.sale_id}/load`).then((res) => {
                const sale = res.data;
                setData((prev) => ({
                    ...prev,
                    account_ledger_id: sale.account_ledger_id,
                    godown_id: sale.godown_id,
                    salesman_id: sale.salesman_id,
                    phone: sale.phone || '',
                    address: sale.address || '',
                    inventory_ledger_id: sale.inventory_ledger_id ?? '',
                    cogs_ledger_id: sale.cogs_ledger_id ?? '',
                    received_mode_id: sale.received_mode_id ?? '',
                    amount_received: sale.amount_received ?? '', // or 0
                    sales_return_items: sale.sale_items.map((item: any) => ({
                        product_id: item.product_id,
                        qty: item.qty,
                        max_qty: item.max_qty, // 💡 include this
                        main_price: item.main_price,
                        discount: item.discount ?? '0',
                        return_amount: (parseFloat(item.qty) * parseFloat(item.main_price) - parseFloat(item.discount ?? 0)).toFixed(2),
                    })),
                }));
            });
        }
    }, [data.sale_id]);

    const calculateTotals = () => {
        let totalQty = 0;
        let totalReturnAmount = 0;

        data.sales_return_items.forEach((item) => {
            const qty = parseFloat(item.qty) || 0;
            const price = parseFloat(item.main_price) || 0;
            const discount = parseFloat(item.discount) || 0;
            const amount = qty * price - discount;

            totalQty += qty;
            totalReturnAmount += amount;
        });

        return { totalQty, totalReturnAmount };
    };

    useEffect(() => {
        const refundAmount = calculateTotals().totalReturnAmount;
        setData('amount_received', refundAmount.toFixed(2));
    }, [data.sales_return_items]);
    


    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.sales_return_items];
        updatedItems[index][field] = value;

        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].main_price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;

        updatedItems[index].return_amount = (qty * price - discount).toFixed(2);
        setData('sales_return_items', updatedItems);
    };

    const addProductRow = () =>
        setData('sales_return_items', [...data.sales_return_items, { product_id: '', qty: '', main_price: '', discount: '', return_amount: '' }]);

    const removeProductRow = (index: number) => {
        if (data.sales_return_items.length > 1) {
            const updated = [...data.sales_return_items];
            updated.splice(index, 1);
            setData('sales_return_items', updated);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales-returns');
    };
    const [showCogsLedgerModal, setShowCogsLedgerModal] = useState(false);
    const [newLedgerName, setNewLedgerName] = useState('');
    const [newGroupId, setNewGroupId] = useState('');
    const [showInventoryLedgerModal, setShowInventoryLedgerModal] = useState(false);
    const [modalTargetField, setModalTargetField] = useState<'inventory' | 'cogs'>('inventory');

    const { totalQty, totalReturnAmount } = calculateTotals();

    return (
        <AppLayout>
            <Head title="Create Sales Return" />
            <div className="bg-gray-100 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Sales Return</h1>
                    <Link href="/sales-returns" className="rounded bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
                    {/* Top Info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Voucher No</label>
                            <input type="text" className="w-full rounded border bg-gray-100 p-2" value={data.voucher_no} readOnly />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Related Sale</label>
                            <select className="w-full rounded border p-2" value={data.sale_id} onChange={(e) => setData('sale_id', e.target.value)}>
                                <option value="">Select Sale (optional)</option>
                                {sales.map((sale) => (
                                    <option key={sale.id} value={sale.id}>
                                        {sale.voucher_no}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Account Ledger</label>
                            <select
                                className="w-full rounded border p-2"
                                value={data.account_ledger_id}
                                onChange={(e) => setData('account_ledger_id', e.target.value)}
                            >
                                <option value="">Select Ledger</option>
                                {ledgers.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.account_ledger_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Inventory Ledger Selection */}
                        <label className="mb-1 block text-sm font-medium">Inventory Ledger</label>
                        <select
                            className="w-full border p-2"
                            value={data.inventory_ledger_id}
                            onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                        >
                            <option value="">Select Inventory Ledger</option>
                            {ledgers.map((ledger) => (
                                <option key={ledger.id} value={ledger.id}>
                                    {ledger.account_ledger_name}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm text-gray-500">
                            Don’t see one?{' '}
                            <button
                                type="button"
                                className="text-blue-600 underline"
                                onClick={() => {
                                    setModalTargetField('inventory');
                                    setShowInventoryLedgerModal(true);
                                }}
                            >
                                Create
                            </button>
                        </div>
                        <label className="mb-1 block text-sm font-medium">COGS Ledger</label>
                        <select
                            className="w-full border p-2"
                            value={data.cogs_ledger_id || ''}
                            onChange={(e) => setData('cogs_ledger_id', e.target.value)}
                        >
                            <option value="">Select COGS Ledger</option>
                            {ledgers.map((ledger) => (
                                <option key={ledger.id} value={ledger.id}>
                                    {ledger.account_ledger_name}
                                </option>
                            ))}
                        </select>
                        <div className="text-sm text-gray-500">
                            Don’t see one?{' '}
                            <button
                                type="button"
                                className="text-blue-600 underline"
                                onClick={() => {
                                    setModalTargetField('cogs');
                                    setShowInventoryLedgerModal(true); // same modal
                                }}
                            >
                                Create
                            </button>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Refund Mode</label>
                            <select
                                className="w-full border p-2"
                                value={data.received_mode_id}
                                onChange={(e) => setData('received_mode_id', e.target.value)}
                            >
                                <option value="">Select Mode</option>
                                {receivedModes.map((mode) => (
                                    <option key={mode.id} value={mode.id}>
                                        {mode.mode_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Refund Amount</label>
                            <input
                                type="number"
                                className="w-full border p-2"
                                value={data.amount_received}
                                onChange={(e) => setData('amount_received', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Godown</label>
                            <select
                                className="w-full rounded border p-2"
                                value={data.godown_id}
                                onChange={(e) => setData('godown_id', e.target.value)}
                            >
                                <option value="">Select Godown</option>
                                {godowns.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Salesman</label>
                            <select
                                className="w-full rounded border p-2"
                                value={data.salesman_id}
                                onChange={(e) => setData('salesman_id', e.target.value)}
                            >
                                <option value="">Select Salesman</option>
                                {salesmen.map((sm) => (
                                    <option key={sm.id} value={sm.id}>
                                        {sm.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Return Date</label>
                            <input
                                type="date"
                                className="w-full rounded border p-2"
                                value={data.return_date}
                                onChange={(e) => setData('return_date', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium">Address</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Product Section */}
                    <div>
                        <h2 className="mb-2 text-lg font-semibold">Returned Products</h2>

                        {data.sales_return_items.map((item, index) => (
                            <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                                {/* Product Selector */}
                                <div className="col-span-3">
                                    <label className="mb-1 block text-sm font-medium">Product</label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={item.product_id}
                                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.item_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity */}
                                <div className="col-span-1">
                                    <label className="mb-1 block text-sm font-medium">Qty</label>
                                    <input
                                        type="number"
                                        max={item.max_qty}
                                        className="w-full rounded border p-2"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                    />
                                </div>

                                {/* Price */}
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        className="w-full rounded border p-2"
                                        value={item.main_price}
                                        onChange={(e) => handleItemChange(index, 'main_price', e.target.value)}
                                    />
                                </div>

                                {/* Discount */}
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Discount</label>
                                    <input
                                        type="number"
                                        placeholder="Discount"
                                        className="w-full rounded border p-2"
                                        value={item.discount}
                                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                    />
                                </div>

                                {/* Subtotal */}
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium">Subtotal</label>
                                    <input
                                        type="number"
                                        placeholder="Subtotal"
                                        className="w-full rounded border bg-gray-100 p-2"
                                        value={item.return_amount}
                                        readOnly
                                    />
                                </div>

                                {/* Buttons for Adding and Removing Rows */}
                                <div className="col-span-1 flex gap-1">
                                    {data.sales_return_items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductRow(index)}
                                            className="rounded bg-red-500 px-3 py-1 text-white"
                                        >
                                            &minus;
                                        </button>
                                    )}
                                    {index === data.sales_return_items.length - 1 && (
                                        <button type="button" onClick={addProductRow} className="rounded bg-blue-500 px-3 py-1 text-white">
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Shipping Details</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={data.shipping_details}
                                onChange={(e) => setData('shipping_details', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Delivered To</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={data.delivered_to}
                                onChange={(e) => setData('delivered_to', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">Return Reason</label>
                        <textarea className="w-full rounded border p-2" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save Sales Return'}
                        </button>
                    </div>
                </form>
            </div>
            {showInventoryLedgerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-700">Create New Ledger</h2>

                        <input
                            type="text"
                            placeholder="Ledger Name"
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">Select Group</option>
                            {/* Assuming you pass `accountGroups` from backend */}
                            {accountGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button className="rounded bg-gray-400 px-4 py-2 text-white" onClick={() => setShowInventoryLedgerModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="rounded bg-green-600 px-4 py-2 text-white"
                                onClick={async () => {
                                    try {
                                        const response = await axios.post('/account-ledgers/modal', {
                                            account_ledger_name: newLedgerName,
                                            account_group_id: newGroupId,
                                            for_transition_mode: 0,
                                            mark_for_user: 0,
                                            phone_number: '0',
                                            opening_balance: 0,
                                            debit_credit: 'debit',
                                            status: 'active',
                                        });

                                        const newLedger = response.data;

                                        if (modalTargetField === 'inventory') {
                                            setData('inventory_ledger_id', newLedger.id);
                                        } else {
                                            setData('cogs_ledger_id', newLedger.id);
                                        }

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowInventoryLedgerModal(false);
                                    } catch (err) {
                                        alert('Failed to create ledger');
                                    }
                                }}
                            >
                                Create Ledger
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
