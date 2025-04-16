import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

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

export default function PurchaseCreate({
    godowns,
    salesmen,
    ledgers,
    items,
}: {
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    items: Item[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        voucher_no: '',
        godown_id: '',
        salesman_id: '',
        account_ledger_id: '',
        phone: '',
        address: '',
        shipping_details: '',
        delivered_to: '',
        purchase_items: [{ product_id: '', qty: '', price: '', discount: '', discount_type: 'bdt', subtotal: '' }],
    });

    useEffect(() => {
        if (!data.voucher_no) {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const voucher = `PUR-${dateStr}-${randomId}`;
            setData('voucher_no', voucher);
        }
    }, []);

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.purchase_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discount / 100) : discount;
        const subtotal = qty * price - discountAmount;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('purchase_items', updatedItems);
    };

    const addProductRow = () =>
        setData('purchase_items', [...data.purchase_items, { product_id: '', qty: '', price: '', discount: '', discount_type: 'bdt', subtotal: '' }]);

    const removeProductRow = (index: number) => {
        if (data.purchase_items.length === 1) return;
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'Do you want to remove this product row?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, remove it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         const updated = [...data.purchase_items];
        //         updated.splice(index, 1);
        //         setData('purchase_items', updated);
        //     }
        // });

        confirmDialog(
            { }, () => {
                const updated = [...data.purchase_items];
                updated.splice(index, 1);
                setData('purchase_items', updated);
            }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedItems = data.purchase_items.map((item) => ({
            ...item,
            qty: item.qty === '' ? 0 : parseFloat(item.qty),
            price: item.price === '' ? 0 : parseFloat(item.price),
            discount: item.discount === '' ? 0 : parseFloat(item.discount),
            subtotal: item.subtotal === '' ? 0 : parseFloat(item.subtotal),
        }));
        post('/purchases', { data: { ...data, purchase_items: cleanedItems } });
    };

    return (
        <AppLayout>
            <Head title="Add Purchase" />
            <div className="bg-gray-100 p-6">
                {/* Header */}
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Create New Purchase</h1>
                    <Link href="/purchases" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
                </div> */}

                <PageHeader title="Purchase Information" addLinkHref="/purchases" addLinkText="Bank" />

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
                                readOnly // Optional, remove 'readOnly' if you want to allow manual edits
                            />
                            {errors.voucher_no && <p className="mt-1 text-sm text-red-500">{errors.voucher_no}</p>}
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
                                                            className="rounded bg-danger px-2 py-1 text-white hover:bg-danger-hover"
                                                        >
                                                            &minus;
                                                        </button>
                                                    )}
                                                    {index === data.purchase_items.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={addProductRow}
                                                            className="rounded bg-primary px-2 py-1 text-white hover:bg-primary-hover"
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
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}
                                </span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Discount:</span>
                                <span className="font-semibold">
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.discount) || 0), 0)}
                                </span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">All Total Amount:</span>
                                <span className="font-semibold">
                                    {data.purchase_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)}
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
                    {/* <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            disabled={processing}
                            className="rounded bg-blue-600 px-5 py-2 font-semibold text-white shadow hover:bg-blue-700"
                        >
                            Save & Print
                        </button>
                    </div> */}
                    <ActionFooter
                        className='w-full justify-end'
                        onSubmit={handleSubmit} // Function to handle form  submission
                        cancelHref="/purchases" // URL for the cancel action
                        processing={processing} // Indicates whether the form is processing
                        submitText={processing ? 'Saving & Printing...' : 'Save & Print'} // Text for the submit button
                        cancelText="Cancel" // Text for the cancel button
                    />
                </form>
            </div>
        </AppLayout>
    );
}
