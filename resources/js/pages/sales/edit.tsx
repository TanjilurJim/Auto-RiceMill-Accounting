import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Sale {
    id: number;
    date: string;
    voucher_no: string;
    godown_id: string;
    salesman_id: string;
    account_ledger_id: string;
    phone: string;
    address: string;
    shipping_details: string;
    delivered_to: string;
    other_expense_ledger_id: string | null;
    other_amount: string | null;
    received_mode_id: string | null;
    amount_received: string | null;
    total_due: string | null;
    closing_balance: string | null;
    truck_rent: string | null;
    rent_advance: string | null;
    net_rent: string | null;
    truck_driver_name: string | null;
    
    driver_address: string | null;
    driver_mobile: string | null;
    sale_items: SaleItem[];
}

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}

interface SaleItem {
    id?: number;
    product_id: string;
    qty: string;
    main_price: string;
    discount: string;
    discount_type: string;
    subtotal: string;
    note?: string;
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
    previous_stock: number;
    unit: string;
}

export default function SaleEdit({
    sale,
    godowns,
    salesmen,
    ledgers,
    items,
    receivedModes,
    inventoryLedgers, // ✅ add this
    accountGroups,
}: {
    sale: Sale;
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    items: Item[];
    receivedModes: ReceivedMode[];
    inventoryLedgers: Ledger[]; // ✅ define type
    accountGroups: { id: number; name: string }[]; // ✅ define type
}) {
    const { data, setData, put, processing, errors } = useForm({
        date: sale.date,
        voucher_no: sale.voucher_no,
        godown_id: sale.godown_id,
        salesman_id: sale.salesman_id,
        account_ledger_id: sale.account_ledger_id,
        phone: sale.phone,
        address: sale.address,
        shipping_details: sale.shipping_details,
        delivered_to: sale.delivered_to,
        other_expense_ledger_id: sale.other_expense_ledger_id,
        other_amount: sale.other_amount,
        received_mode_id: sale.received_mode_id ?? '', // ✅ updated
        amount_received: sale.amount_received ?? '',
        cogs_ledger_id: sale.cogs_ledger_id || '',
        inventory_ledger_id: sale.inventory_ledger_id || '',
        total_due: sale.total_due,
        closing_balance: sale.closing_balance,
        truck_rent: sale.truck_rent,
        rent_advance: sale.rent_advance,
        net_rent: sale.net_rent,
        truck_driver_name: sale.truck_driver_name,
        driver_address: sale.driver_address,
        driver_mobile: sale.driver_mobile,
        sale_items: sale.sale_items,
    });

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.sale_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].main_price) || 0;
        const discount = parseFloat(updatedItems[index].discount) || 0;
        const discountType = updatedItems[index].discount_type;
        const discountAmount = discountType === 'percent' ? qty * price * (discount / 100) : discount;
        const subtotal = qty * price - discountAmount;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('sale_items', updatedItems);
    };

    const addProductRow = () =>
        setData('sale_items', [
            ...data.sale_items,
            { product_id: '', qty: '', main_price: '', discount: '', discount_type: 'bdt', subtotal: '', note: '' },
        ]);

    const removeProductRow = (index: number) => {
        if (data.sale_items.length > 1) {
            const updated = [...data.sale_items];
            updated.splice(index, 1);
            setData('sale_items', updated);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/sales/${sale.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Sale" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Edit Sale</h1>
                    <Link href="/sales" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">Back</Link>
                </div> */}

                    <PageHeader title='Edit Sale' addLinkHref='/sales' addLinkText='Back' />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 border">
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
                                                className="rounded bg-danger hover:bg-danger-hover px-3 py-2 text-white"
                                                onClick={() => removeProductRow(index)}
                                            >
                                                &minus;
                                            </button>
                                        )}
                                        {index === data.sale_items.length - 1 && (
                                            <button type="button" className="rounded bg-primary hover:bg-primary-hover px-3 py-2 text-white" onClick={addProductRow}>
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
                                {/* Inventory Ledger */}
                                <div className="col-span-1">
                                    <label className="mb-1 block flex items-center gap-1 text-sm font-semibold text-gray-700">
                                        Inventory Ledger <span className="text-red-500">*</span>
                                        <div className="group relative cursor-pointer">
                                            <span className="inline-block h-4 w-4 rounded-full bg-gray-300 text-center text-xs font-bold">?</span>
                                            <div className="absolute top-6 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white shadow-md group-hover:block">
                                                This is the account where sold inventory is tracked in accounting.
                                            </div>
                                        </div>
                                    </label>
                                    <select
                                        className="w-full rounded border p-2"
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
                                    {errors.inventory_ledger_id && <div className="text-sm text-red-500">{errors.inventory_ledger_id}</div>}
                                </div>

                                {/* COGS Ledger */}
                                <div className="col-span-1">
                                    <label className="mb-1 block flex items-center gap-1 text-sm font-semibold text-gray-700">
                                        COGS Ledger <span className="text-red-500">*</span>
                                        <div className="group relative cursor-pointer">
                                            <span className="inline-block h-4 w-4 rounded-full bg-gray-300 text-center text-xs font-bold">?</span>
                                            <div className="absolute top-6 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white shadow-md group-hover:block">
                                                COGS (Cost of Goods Sold) tracks the cost related to items sold. It's an expense.
                                            </div>
                                        </div>
                                    </label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={data.cogs_ledger_id}
                                        onChange={(e) => setData('cogs_ledger_id', e.target.value)}
                                    >
                                        <option value="">Select COGS Ledger</option>
                                        {ledgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.cogs_ledger_id && <div className="text-sm text-red-500">{errors.cogs_ledger_id}</div>}
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
                                    <select
                                        className="w-full border p-2"
                                        value={data.received_mode_id}
                                        onChange={(e) => setData('received_mode_id', e.target.value)}
                                    >
                                        <option value="">Select Payment Method</option>
                                        {receivedModes.map((mode) => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Receive Amount */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Amount Received</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full border p-2"
                                        value={data.amount_received || ''}
                                        onChange={(e) => setData('amount_received', e.target.value)}
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



                        {/* Section 5: Submit */}
                        {/* <div className="mt-6 flex justify-end gap-3">
                        <button type="submit" disabled={processing} className="rounded bg-purple-600 px-5 py-2 font-semibold text-white shadow hover:bg-purple-700">{processing ? 'Updating...' : 'Update'}</button>
                        <Link href="/sales" className="rounded border border-gray-400 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-100">Cancel</Link>
                    </div> */}
                        <ActionFooter
                            className='w-full justify-end'
                            onSubmit={handleSubmit} // Function to handle form submission
                            cancelHref="/sales" // URL for the cancel action
                            processing={processing} // Indicates whether the form is processing
                            submitText={processing ? 'Updating...' : 'Update'} // Text for the submit button
                            cancelText="Cancel" // Text for the cancel button
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
