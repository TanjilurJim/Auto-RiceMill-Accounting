import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

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
    previous_stock: number;
    unit: string;
}

export default function SaleCreate({
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
        sale_items: [
            {
                product_id: '',
                qty: '',
                main_price: '',
                discount: '',
                discount_type: 'bdt',
                subtotal: '',
                note: '',
            },
        ],
        shipping_details: '',
        delivered_to: '',
        truck_rent: '',
        rent_advance: '',
        net_rent: '',
        truck_driver_name: '',
        driver_address: '',
        driver_mobile: '',
        receive_mode: '',
        receive_amount: '',
        total_due: '',
        closing_balance: '',
    });

    // Auto-generate voucher no on mount
    useEffect(() => {
        if (!data.voucher_no) {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const voucher = `SAL-${dateStr}-${randomId}`;
            setData('voucher_no', voucher);
        }
    }, []);

    // Handle changes in each row's product fields
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.sale_items];
        updatedItems[index][field] = value;

        // Recalculate subtotal
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].main_price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discount / 100) : discount;

        const subtotal = qty * price - discountAmount;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;

        setData('sale_items', updatedItems);
    };

    // Add a new row
    const addProductRow = () => {
        setData('sale_items', [
            ...data.sale_items,
            {
                product_id: '',
                qty: '',
                main_price: '',
                discount: '',
                discount_type: 'bdt',
                subtotal: '',
                note: '',
            },
        ]);
    };

    // Remove a row
    const removeProductRow = (index: number) => {
        if (data.sale_items.length > 1) {
            const updated = [...data.sale_items];
            updated.splice(index, 1);
            setData('sale_items', updated);
        }
    };

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/sales');
    };

    return (
        <AppLayout>
            <Head title="Add Sale" />
            <div className="bg-gray-100 p-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Sale</h1>
                    <Link href="/sales" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8 rounded bg-white p-6 shadow-md">
                    {/* Section 1: Basic Sale Info */}
                    <div>
                        <h2 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-700">Sale Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Date */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    className="w-full rounded border p-2"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                {errors.date && <div className="mt-1 text-sm text-red-500">{errors.date}</div>}
                            </div>

                            {/* Voucher No */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Voucher No</label>
                                <input type="text" className="w-full rounded border bg-gray-100 p-2" value={data.voucher_no} readOnly />
                            </div>

                            {/* Godown */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Godown</label>
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
                                {errors.godown_id && <div className="mt-1 text-sm text-red-500">{errors.godown_id}</div>}
                            </div>

                            {/* Salesman */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Salesman</label>
                                <select
                                    className="w-full rounded border p-2"
                                    value={data.salesman_id}
                                    onChange={(e) => setData('salesman_id', e.target.value)}
                                >
                                    <option value="">Select Salesman</option>
                                    {salesmen.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.salesman_id && <div className="mt-1 text-sm text-red-500">{errors.salesman_id}</div>}
                            </div>

                            {/* Party Ledger */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Party Ledger</label>
                                <select
                                    className="w-full rounded border p-2"
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
                                {errors.account_ledger_id && <div className="mt-1 text-sm text-red-500">{errors.account_ledger_id}</div>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Product Rows */}
                    <div>
                        <h2 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-700">Products</h2>

                        {data.sale_items.map((item, index) => (
                            <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                                {/* Product */}
                                <div className="col-span-3">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={item.product_id}
                                        onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {items.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.item_name} ({p.previous_stock} {p.unit})
                                            </option>
                                        ))}
                                    </select>
                                    {errors[`sale_items.${index}.product_id`] && (
                                        <div className="mt-1 text-sm text-red-500">{errors[`sale_items.${index}.product_id`]}</div>
                                    )}
                                </div>

                                {/* Qty */}
                                <div className="col-span-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Qty</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border p-2"
                                        value={item.qty}
                                        onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                    />
                                    {errors[`sale_items.${index}.qty`] && (
                                        <div className="mt-1 text-sm text-red-500">{errors[`sale_items.${index}.qty`]}</div>
                                    )}
                                </div>

                                {/* Main Price */}
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Main Price</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border p-2"
                                        value={item.main_price}
                                        onChange={(e) => handleItemChange(index, 'main_price', e.target.value)}
                                    />
                                    {errors[`sale_items.${index}.main_price`] && (
                                        <div className="mt-1 text-sm text-red-500">{errors[`sale_items.${index}.main_price`]}</div>
                                    )}
                                </div>

                                {/* Discount */}
                                <div className="col-span-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Disc</label>
                                    <input
                                        type="number"
                                        className="w-full rounded border p-2"
                                        value={item.discount}
                                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                    />
                                </div>

                                {/* Discount Type */}
                                <div className="col-span-1">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={item.discount_type}
                                        onChange={(e) => handleItemChange(index, 'discount_type', e.target.value)}
                                    >
                                        <option value="bdt">BDT</option>
                                        <option value="percent">%</option>
                                    </select>
                                </div>

                                {/* Subtotal */}
                                <div className="col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Subtotal</label>
                                    <input type="number" className="w-full rounded border bg-gray-100 p-2" value={item.subtotal} readOnly />
                                </div>

                                {/* Add/Remove Buttons */}
                                <div className="col-span-1 flex items-end gap-2">
                                    {data.sale_items.length > 1 && (
                                        <button
                                            type="button"
                                            className="rounded bg-red-500 px-3 py-2 text-white"
                                            onClick={() => removeProductRow(index)}
                                        >
                                            &minus;
                                        </button>
                                    )}
                                    {index === data.sale_items.length - 1 && (
                                        <button type="button" className="rounded bg-blue-500 px-3 py-2 text-white" onClick={addProductRow}>
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {/* Section 2: Product Rows */}
                        <div>
                            <h2 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-700">Products</h2>

                            {data.sale_items.map((item, index) => (
                                <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                                    {/* ... your product inputs (Product, Qty, Price, etc.) */}
                                </div>
                            ))}
                        </div>

                        {/* 🚩 Section 3: Financial Placeholders */}
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Other Expense Ledger */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Other Expense Ledger</label>
                                <select
                                    className="w-full border p-2"
                                    value={data.other_expense_ledger_id || ''}
                                    onChange={(e) => setData('other_expense_ledger_id', e.target.value)}
                                >
                                    <option value="">Select Ledger</option>
                                    {ledgers.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.account_ledger_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Other Amount */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Other Amount</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full border p-2"
                                    value={data.other_amount || ''}
                                    onChange={(e) => setData('other_amount', e.target.value)}
                                />
                            </div>

                            {/* Receive Mode */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Receive Mode</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cash, Bank"
                                    className="w-full border p-2"
                                    value={data.receive_mode || ''}
                                    onChange={(e) => setData('receive_mode', e.target.value)}
                                />
                            </div>

                            {/* Receive Amount */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Receive Amount</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full border p-2"
                                    value={data.receive_amount || ''}
                                    onChange={(e) => setData('receive_amount', e.target.value)}
                                />
                            </div>

                            {/* Total Due */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Total Due</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full border p-2"
                                    value={data.total_due || ''}
                                    onChange={(e) => setData('total_due', e.target.value)}
                                />
                            </div>

                            {/* Closing Balance */}
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">Closing Balance</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full border p-2"
                                    value={data.closing_balance || ''}
                                    onChange={(e) => setData('closing_balance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Shipping, Delivery, Truck Info */}
                    <div>
                        <h2 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-700">Shipping & Truck Details</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Shipping Details */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Shipping Details</label>
                                <textarea
                                    className="w-full rounded border p-2"
                                    rows={3}
                                    value={data.shipping_details}
                                    onChange={(e) => setData('shipping_details', e.target.value)}
                                />
                            </div>

                            {/* Delivered To */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Delivered To</label>
                                <textarea
                                    className="w-full rounded border p-2"
                                    rows={3}
                                    value={data.delivered_to}
                                    onChange={(e) => setData('delivered_to', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Truck Rent */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Truck Rent</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.truck_rent}
                                    onChange={(e) => setData('truck_rent', e.target.value)}
                                />
                            </div>

                            {/* Rent Advance */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Rent Advance</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.rent_advance}
                                    onChange={(e) => setData('rent_advance', e.target.value)}
                                />
                            </div>

                            {/* Net Rent */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Net Rent</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.net_rent}
                                    onChange={(e) => setData('net_rent', e.target.value)}
                                />
                            </div>

                            {/* Truck Driver Name */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Truck Driver Name</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.truck_driver_name}
                                    onChange={(e) => setData('truck_driver_name', e.target.value)}
                                />
                            </div>

                            {/* Driver Address */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Driver Address</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.driver_address}
                                    onChange={(e) => setData('driver_address', e.target.value)}
                                />
                            </div>

                            {/* Driver Mobile */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Driver Mobile</label>
                                <input
                                    type="text"
                                    className="w-full rounded border p-2"
                                    value={data.driver_mobile}
                                    onChange={(e) => setData('driver_mobile', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 🚩 Placeholders Section */}
                    {/* <h2 className="mt-8 border-b pb-1 text-lg font-semibold">Financial Details (Optional)</h2>
                <p className="text-sm text-gray-500 mb-4">These fields are placeholders for now and will be used later.</p> */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}

                    {/* Other Expense Ledger */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Other Expense Ledger</label>
                        <select
                            className="w-full border p-2"
                            value={data.other_expense_ledger_id || ''}
                            onChange={(e) => setData('other_expense_ledger_id', e.target.value)}
                        >
                            <option value="">Select Ledger</option>
                            {ledgers.map((l) => (
                                <option key={l.id} value={l.id}>{l.account_ledger_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Other Amount */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Other Amount</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full border p-2"
                            value={data.other_amount || ''}
                            onChange={(e) => setData('other_amount', e.target.value)}
                        />
                    </div> */}

                    {/* Receive Mode */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Receive Mode</label>
                        <input
                            type="text"
                            placeholder="e.g. Cash, Bank"
                            className="w-full border p-2"
                            value={data.receive_mode || ''}
                            onChange={(e) => setData('receive_mode', e.target.value)}
                        />
                    </div> */}

                    {/* Receive Amount */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Receive Amount</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full border p-2"
                            value={data.receive_amount || ''}
                            onChange={(e) => setData('receive_amount', e.target.value)}
                        />
                    </div> */}

                    {/* Total Due */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Due</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full border p-2"
                            value={data.total_due || ''}
                            onChange={(e) => setData('total_due', e.target.value)}
                        />
                    </div> */}

                    {/* Closing Balance */}
                    {/* <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Closing Balance</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full border p-2"
                            value={data.closing_balance || ''}
                            onChange={(e) => setData('closing_balance', e.target.value)}
                        />
                    </div>
                </div>  */}

                    {/* Section 4: Submit */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                        <Link href="/sales" className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
