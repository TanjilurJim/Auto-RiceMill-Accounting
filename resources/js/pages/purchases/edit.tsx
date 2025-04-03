import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

/**
 * Types matching the create page
 */
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

/**
 * The shape we expect from the server for editing
 * (matching your create logic, but with purchase data).
 */
interface PurchaseItem {
    id?: number;
    product_id: string | number;
    qty: string | number;
    price: string | number;
    discount: string | number;
    discount_type: 'bdt' | 'percent';
    subtotal: string | number;
}

interface PurchaseData {
    id: number;
    date: string;
    voucher_no: string | null;
    godown_id: string | number | null;
    salesman_id: string | number | null;
    account_ledger_id: string | number | null;
    phone: string | null;
    address: string | null;
    shipping_details: string | null;
    delivered_to: string | null;
    purchase_items?: PurchaseItem[]; // snake_case from the server
}

/**
 * Props for Edit page
 */
interface EditProps {
    purchase?: PurchaseData; // The purchase being edited
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[]; // We call it 'ledgers' for UI consistency
    items: Item[];
}

export default function PurchaseEdit({ purchase, godowns, salesmen, ledgers, items }: EditProps) {
    // 1) Make sure we actually have purchase data
    if (!purchase || !purchase.purchase_items) {
        return (
            <AppLayout>
                <div className="p-6 text-red-600">
                    No <strong>purchase</strong> data or <strong>purchase_items</strong> found.
                </div>
            </AppLayout>
        );
    }

    // 2) useForm with the same shape as "create.tsx"
    const { data, setData, put, processing } = useForm({
        date: purchase.date || '',
        voucher_no: purchase.voucher_no || '',
        godown_id: purchase.godown_id || '',
        salesman_id: purchase.salesman_id || '',
        account_ledger_id: purchase.account_ledger_id || '',
        phone: purchase.phone || '',
        address: purchase.address || '',
        shipping_details: purchase.shipping_details || '',
        delivered_to: purchase.delivered_to || '',
        purchase_items: purchase.purchase_items.map((item) => ({
            product_id: item.product_id || '',
            qty: item.qty || '',
            price: item.price || '',
            discount: item.discount || '',
            discount_type: item.discount_type || 'bdt',
            subtotal: item.subtotal || '',
        })),
        print: false,
    });

    // 3) handleItemChange (same logic as create)
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.purchase_items];
        updatedItems[index][field] = value;

        // Recalculate subtotal:
        const qty = parseFloat(updatedItems[index].qty as string) || 0;
        const price = parseFloat(updatedItems[index].price as string) || 0;
        const discountVal = parseFloat(updatedItems[index].discount as string) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discountVal / 100) : discountVal;
        const subtotal = qty * price - discountAmount;

        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;

        setData('purchase_items', updatedItems);
    };

    // 4) Add product row
    const addProductRow = () => {
        setData('purchase_items', [...data.purchase_items, { product_id: '', qty: '', price: '', discount: '', discount_type: 'bdt', subtotal: '' }]);
    };

    // 5) Remove product row
    const removeProductRow = (index: number) => {
        if (data.purchase_items.length === 1) return;
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to remove this product row?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updated = [...data.purchase_items];
                updated.splice(index, 1);
                setData('purchase_items', updated);
            }
        });
    };

    // 6) handleSubmit - same approach, but we do a PUT request to update
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clean items to numeric values
        const cleanedItems = data.purchase_items.map((item) => ({
            ...item,
            qty: item.qty === '' ? 0 : parseFloat(item.qty as string),
            price: item.price === '' ? 0 : parseFloat(item.price as string),
            discount: item.discount === '' ? 0 : parseFloat(item.discount as string),
            subtotal: item.subtotal === '' ? 0 : parseFloat(item.subtotal as string),
        }));

        // We do put to your update route with route param = purchase.id
        put(route('purchases.update', purchase.id), {
            data: { ...data, purchase_items: cleanedItems },
        });
    };

    const handleSaveAndPrint = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Set print to true before submitting
        setData('print', true);
    
        // Proceed with the normal form submission (PUT request)
        put(route('purchases.update', purchase.id), {
            data: { ...data, print: true },
            onSuccess: () => {
                // After successful update, redirect to invoice page
                window.location.href = route('purchases.invoice', purchase.id);
            },
        });
    };

    // 7) total calculations
    const totalQty = data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.qty as string) || 0), 0);
    const totalDiscount = data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.discount as string) || 0), 0);
    const totalAmount = data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as string) || 0), 0);

    return (
        <AppLayout>
            <Head title="Update Purchase" />
            <div className="bg-gray-100 p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Update Purchase</h1>
                    <Link href="/purchases" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
                    {/* Section 1 - Purchase Info */}
                    <div className="space-y-4">
                        <h2 className="border-b pb-1 text-lg font-semibold">Purchase Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <input
                                type="date"
                                className="border p-2"
                                placeholder="Date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                            />
                            <input
                                type="text"
                                className="border p-2"
                                placeholder="Voucher No"
                                value={data.voucher_no}
                                onChange={(e) => setData('voucher_no', e.target.value)}
                            />
                            <select className="border p-2" value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)}>
                                <option value="">Select Godown</option>
                                {godowns.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                            <select className="border p-2" value={data.salesman_id} onChange={(e) => setData('salesman_id', e.target.value)}>
                                <option value="">Select Salesman</option>
                                {salesmen.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
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
                            <input
                                type="text"
                                className="border p-2"
                                placeholder="Phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <input
                                type="text"
                                className="border p-2"
                                placeholder="Address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section 2 - Product Table */}
                    <div>
                        <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Products</h2>
                        <div className="overflow-x-auto rounded border">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50 text-sm">
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
                                    {data.purchase_items.map((item, index) => (
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
                                                <input
                                                    type="number"
                                                    className="w-full"
                                                    value={item.discount}
                                                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                                />
                                            </td>
                                            <td className="border px-2 py-1">
                                                <select
                                                    className="w-full"
                                                    value={item.discount_type}
                                                    onChange={(e) => handleItemChange(index, 'discount_type', e.target.value)}
                                                >
                                                    <option value="bdt">BDT</option>
                                                    <option value="percent">%</option>
                                                </select>
                                            </td>
                                            <td className="border px-2 py-1">
                                                <input type="number" className="w-full bg-gray-100" value={item.subtotal} readOnly />
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                <div className="flex justify-center space-x-1">
                                                    {data.purchase_items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProductRow(index)}
                                                            className="rounded bg-red-500 px-2 py-1 text-white"
                                                        >
                                                            &minus;
                                                        </button>
                                                    )}
                                                    {index === data.purchase_items.length - 1 && (
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

                    {/* Totals Section */}
                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="space-y-3">
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Item Qty Total:</span>
                                <span className="font-semibold">
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.qty as string) || 0), 0)}
                                </span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Discount:</span>
                                <span className="font-semibold">
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.discount as string) || 0), 0)}
                                </span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">All Total Amount:</span>
                                <span className="font-semibold">
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal as string) || 0), 0)}
                                </span>
                            </div>
                        </div>

                        {/* Shipping & Delivered To */}
                        <div className="col-span-2 space-y-4">
                            <div>
                                <label className="mb-1 block font-semibold text-gray-700">Shipping Details</label>
                                <textarea
                                    className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.shipping_details || ''}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                ></textarea>
                            </div>
                            <div>
                                <label className="mb-1 block font-semibold text-gray-700">Delivered To</label>
                                <textarea
                                    className="w-full rounded border bg-white p-2 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    value={data.delivered_to || ''}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" onClick={handleSaveAndPrint} disabled={processing} className="bg-blue-600 px-5 py-2 text-white">
                            Save & Print
                        </button>
                        <Link href="/purchases" className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
