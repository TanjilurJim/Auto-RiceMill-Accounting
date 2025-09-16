import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
    ledgers: { id: number; name: string }[];
    salesmen: { id: number; name: string }[];
    products: { id: number; name: string; stock: number; unit_id: number; unit: { name: string } }[];
    units: { id: number; name: string }[];
    godowns: { id: number; name: string }[];
}

interface Product {
    id: number;
    name: string;
    stock: number;
    unit_id: number;
    unit: { name: string };
}

export default function SalesOrderCreate({ ledgers, salesmen, products, units, godowns, stockItemsByGodown }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        voucher_no: '',
        ledger_id: '',
        salesman_id: '',
        godown_id: '',
        shipping_details: '',
        delivered_to: '',
        items: [
            {
                product_id: '',
                quantity: 1,
                unit_id: '',
                rate: 0,
                discount_type: 'flat',
                discount_value: 0,
                subtotal: 0,
            },
        ],
    });


    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);




    useEffect(() => {
        if (!data.voucher_no) {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0].replace(/-/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            setData('voucher_no', `SO-${formatted}-${random}`);
        }
    }, []);

    // Fetch products for selected godown
    useEffect(() => {
        if (data.godown_id) {
            axios.get(`/sales-orders/products/by-godown/${data.godown_id}`).then((res) => {
                setFilteredProducts(res.data); // Make sure your backend returns [{id, name, stock, unit_id, unit:{name}}]
            });
        } else {
            setFilteredProducts([]);
        }
    }, [data.godown_id]);

    const totalQuantity = data.items.reduce((sum, item) => sum + parseFloat((item.quantity as any) || 0), 0);
    const grandTotal = data.items.reduce((sum, item) => sum + parseFloat((item.subtotal as any) || 0), 0);

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;

        const qty = parseFloat(updatedItems[index].quantity as any) || 0;
        const rate = parseFloat(updatedItems[index].rate as any) || 0;
        const discount = parseFloat(updatedItems[index].discount_value as any) || 0;
        const type = updatedItems[index].discount_type;



        let subtotal = qty * rate;
        if (type === 'percentage') subtotal -= (subtotal * discount) / 100;
        else subtotal -= discount;

        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('items', updatedItems);
    };

    const addRow = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                quantity: 1,
                unit_id: '',
                rate: 0,
                discount_type: 'flat',
                discount_value: 0,
                subtotal: 0,
            },
        ]);
    };

    const removeRow = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales-orders');
    };

    return (
        <AppLayout>
            <Head title="Create Sales Order" />
            <div className="p-4 md:p-12 h-full w-screen lg:w-full">
                <div className="h-full rounded-lg">
                    {/* <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">Create Sales Order</h2> */}

                    <PageHeader title='Create Sales Order' addLinkHref='/sales-orders' addLinkText='Back' />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Order Details</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Date</label>
                                    <input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Voucher No</label>
                                    <input type="text" value={data.voucher_no} readOnly className="w-full rounded border bg-gray-100 px-3 py-2" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Ledger</label>
                                    <select
                                        value={data.ledger_id}
                                        onChange={(e) => setData('ledger_id', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    >
                                        <option value="">Select Ledger</option>
                                        {ledgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Salesman</label>
                                    <select
                                        value={data.salesman_id}
                                        onChange={(e) => setData('salesman_id', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    >
                                        <option value="">Select Salesman</option>
                                        {salesmen.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Godown</label>
                                    <select
                                        value={data.godown_id}
                                        onChange={(e) => setData('godown_id', e.target.value)}
                                        className="w-full rounded border px-3 py-2"
                                    >
                                        <option value="">Select Godown</option>
                                        {godowns.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Product Items */}
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Products</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm">
                                    <thead className="bg-gray-200 text-gray-700">
                                        <tr>
                                            <th className="border px-2 py-2">Product</th>
                                            <th className="border px-2 py-2">Qty</th>
                                            <th className="border px-2 py-2">Unit</th>
                                            <th className="border px-2 py-2">Rate</th>
                                            <th className="border px-2 py-2">Discount</th>
                                            <th className="border px-2 py-2">Type</th>
                                            <th className="border px-2 py-2">Subtotal</th>
                                            <th className="border px-2 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item, i) => (
                                            <tr key={i} className="text-center">
                                                <td className="border px-2 py-1">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => handleItemChange(i, 'product_id', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                        disabled={!data.godown_id}
                                                    >
                                                        <option value="">Select</option>
                                                        {/* {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} ({p.stock})
                                                            </option>
                                                        ))} */}
                                                        {filteredProducts.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} ({p.stock} {p.unit?.name})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(i, 'quantity', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <select
                                                        value={item.unit_id}
                                                        onChange={(e) => handleItemChange(i, 'unit_id', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                    >
                                                        <option value="">Unit</option>
                                                        {units.map((u) => (
                                                            <option key={u.id} value={u.id}>
                                                                {u.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) => handleItemChange(i, 'rate', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={item.discount_value}
                                                        onChange={(e) => handleItemChange(i, 'discount_value', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <select
                                                        value={item.discount_type}
                                                        onChange={(e) => handleItemChange(i, 'discount_type', e.target.value)}
                                                        className="w-full rounded border px-1 py-1"
                                                    >
                                                        <option value="flat">৳</option>
                                                        <option value="percentage">%</option>
                                                    </select>
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={item.subtotal}
                                                        readOnly
                                                        className="w-full rounded border bg-gray-100 px-1 py-1"
                                                    />
                                                </td>
                                                <td className="border px-2 py-1">
                                                    <div className="flex justify-center gap-1">
                                                        {i > 0 && (
                                                            <button
                                                                type="button"
                                                                className="rounded bg-danger hover:bg-danger-hover px-3 py-1 text-white"
                                                                onClick={() => removeRow(i)}
                                                                title="Remove Item"
                                                            >
                                                                −
                                                            </button>
                                                        )}
                                                        {i === data.items.length - 1 && (
                                                            <button
                                                                type="button"
                                                                className="rounded bg-primary hover:bg-primary-hover px-3 py-1 text-white"
                                                                onClick={addRow}
                                                                title="Add Item"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-100 text-sm font-semibold">
                                            <td colSpan={1} className="border px-2 py-2 text-right">
                                                Total
                                            </td>
                                            <td className="border px-2 py-2 text-center">{totalQuantity}</td>
                                            <td colSpan={4} className="border"></td>
                                            <td className="border px-2 py-2 text-right">{grandTotal.toFixed(2)}</td>
                                            <td className="border"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            {/* <div className="mt-2">
                                <button type="button" onClick={addRow} className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700">
                                    + Add Item
                                </button>
                            </div> */}
                        </div>

                        {/* Shipping + Delivered To */}
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-700">Delivery Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <textarea
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="Shipping Details"
                                    value={data.shipping_details}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="w-full rounded border px-3 py-2"
                                    placeholder="Delivered To"
                                    value={data.delivered_to}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        {/* <div className="border-t pt-4 text-right">
                            <button type="submit" disabled={processing} className="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                                {processing ? 'Saving...' : 'Submit Order'}
                            </button>
                        </div> */}
                        <ActionFooter
                            className='w-full justify-end'
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/sales-orders" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? 'Saving...' : 'Submit Order'} // Text for the submit button
                            cancelText="Cancel" // Text for the cancel button
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
