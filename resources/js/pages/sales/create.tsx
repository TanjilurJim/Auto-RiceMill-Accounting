import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Godown {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
}

interface Salesman {
    id: number;
    name: string;
}
interface Ledger {
    id: number;
    account_ledger_name: string;
    mark_for_user?: boolean; // Added property
}
interface Item {
    id: number;
    item_name: string;
    stock_qty: number;
    unit: string;
}

export default function SaleCreate({
    godowns,
    salesmen,
    ledgers,
    items,
    receivedModes,
    inventoryLedgers,
    accountGroups,
}: {
    godowns: Godown[];
    salesmen: Salesman[];
    ledgers: Ledger[];
    items: Item[];
    receivedModes: ReceivedMode[];
    inventoryLedgers: Ledger[];
    accountGroups: { id: number; name: string }[];
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
        received_mode_id: '',
        amount_received: '',
        inventory_ledger_id: '',
        total_due: '',
        closing_balance: '',
    });
    useEffect(() => {
        if (data.godown_id) {
            axios.get(`/sales/items/by-godown/${data.godown_id}`).then((res) => {
                // Update the state with the items and their stock quantities
                setFilteredItems(res.data); // Ensure you get the correct stock quantities here
            });
        } else {
            setFilteredItems([]); // Clear the items if no godown is selected
        }
    }, [data.godown_id]); // Trigger this effect whenever the godown_id changes
    const [filteredItems, setFilteredItems] = useState<Item[]>([]);
    const [modalTargetField, setModalTargetField] = useState<'inventory' | 'cogs'>('inventory');

    const [showInventoryLedgerModal, setShowInventoryLedgerModal] = useState(false);
    const [showCogsLedgerModal, setShowCogsLedgerModal] = useState(false);
    const [showLedgerModal, setShowLedgerModal] = useState(false);
    const [newLedgerName, setNewLedgerName] = useState('');
    const [newGroupId, setNewGroupId] = useState('');

    // useEffect(() => {
    //     if (data.received_mode_id) {
    //         const mode = receivedModes.find((m) => m.id === parseInt(data.received_mode_id));
    //         if (mode?.ledger_id) {
    //             axios.get(`/account-ledgers/${mode.ledger_id}/balance`).then((res) => {
    //                 setData('closing_balance', res.data.balance);
    //             });
    //         }
    //     }
    // }, [data.received_mode_id]);

    const customerLedgers = ledgers.filter((l) => l.mark_for_user);

    const [currentLedgerBalance, setCurrentLedgerBalance] = useState(0);

    // When received_mode_id changes ➜ fetch balance and recompute
    useEffect(() => {
        const mode = receivedModes.find((m) => m.id === parseInt(data.received_mode_id));
        if (mode?.ledger_id) {
            axios.get(`/account-ledgers/${mode.ledger_id}/balance`).then((res) => {
                const fetchedBalance = parseFloat(res.data.balance) || 0;
                setCurrentLedgerBalance(fetchedBalance);
                const received = parseFloat(data.amount_received) || 0;
                setData('closing_balance', (fetchedBalance + received).toFixed(2)); // ✅ updated here
            });
        } else {
            setCurrentLedgerBalance(0);
            setData('closing_balance', '0.00');
        }
    }, [data.received_mode_id]);

    // When amount_received changes ➜ recompute
    useEffect(() => {
        const received = parseFloat(data.amount_received) || 0;
        setData('closing_balance', (currentLedgerBalance + received).toFixed(2)); // ✅ updates UI live
    }, [data.amount_received]);

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
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    {/* Header */}

                    <PageHeader title='Create Sale' addLinkHref='/sales' addLinkText='Back' />

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-6 border">
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
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Customer Ledger</label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={data.account_ledger_id}
                                        onChange={(e) => setData('account_ledger_id', e.target.value)}
                                    >
                                        <option value="">Choose the buyer's Ledger</option>
                                        {customerLedgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Helper Text and Link */}
                                    <div className="mt-1 text-sm text-gray-500">
                                        Create Customer Ledger if not created yet.{' '}
                                        <a href="/account-ledgers/create" target="_blank" className="text-blue-600 underline hover:text-blue-800">
                                            Create New
                                        </a>
                                    </div>

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
                                // <div key={index} className="mb-3 grid grid-cols-12 items-end gap-2">
                                <div key={index} className="mb-3 flex flex-col md:flex-row gap-2 h-full w-full">
                                    {/* Product */}
                                    <div className="w-full h-full">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
                                        <select
                                            className="w-full rounded border p-2 h-fit"
                                            value={item.product_id}
                                            onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            {filteredItems.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.item_name} ({p.stock_qty} in stock)
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`sale_items.${index}.product_id`] && (
                                            <div className="mt-1 text-sm text-red-500">{errors[`sale_items.${index}.product_id`]}</div>
                                        )}
                                    </div>

                                    {/* Qty */}
                                    <div className="w-full h-full">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Qty</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border p-2 h-fit"
                                            value={item.qty}
                                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                        />
                                        {errors[`sale_items.${index}.qty`] && (
                                            <div className="mt-1 text-sm text-red-500 h-fit">{errors[`sale_items.${index}.qty`]}</div>
                                        )}
                                    </div>

                                    {/* Main Price */}
                                    <div className="w-full h-full">
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
                                    <div className="w-full h-full">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Disc</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border p-2"
                                            value={item.discount}
                                            onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                                        />
                                    </div>

                                    {/* Discount Type */}
                                    <div className="w-full h-full">
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
                                    <div className="w-full h-full">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Subtotal</label>
                                        <input type="number" className="w-full rounded border bg-gray-100 p-2" value={item.subtotal} readOnly />
                                    </div>

                                    {/* Add/Remove Buttons */}
                                    <div className="w-full flex items-start justify-s gap-2 md:pt-6">
                                        {data.sale_items.length > 1 && (
                                            <button
                                                type="button"
                                                className="rounded bg-danger hover:bg-danger-hover px-3 py-2 text-white w-full md:w-fit"
                                                onClick={() => removeProductRow(index)}
                                            >
                                                &minus;
                                            </button>
                                        )}
                                        {index === data.sale_items.length - 1 && (
                                            <button type="button" className="rounded bg-primary hover:bg-primary-hover px-3 py-2 text-white w-full md:w-fit" onClick={addProductRow}>
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
                                        {/* Tooltip icon */}
                                        <div className="group relative cursor-pointer">
                                            <span className="inline-block h-4 w-4 rounded-full bg-gray-300 text-center text-xs font-bold">?</span>

                                            {/* Tooltip text */}
                                            <div className="absolute top-6 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white shadow-md group-hover:block">
                                                This is the account where purchased or stocked items are tracked. It represents your inventory value in
                                                accounting.
                                            </div>
                                        </div>
                                    </label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={data.inventory_ledger_id}
                                        onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                                    >
                                        <option value="">Your Inventory Ledger</option>
                                        {inventoryLedgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1 text-sm text-gray-500">
                                        Don’t see your ledger?{' '}
                                        <button onClick={() => setShowInventoryLedgerModal(true)} className="text-blue-600 underline">
                                            Create here
                                        </button>
                                    </div>
                                    {errors.inventory_ledger_id && <div className="text-sm text-red-500">{errors.inventory_ledger_id}</div>}
                                </div>

                                {/* Other Amount */}
                                {/* COGS Ledger */}
                                <div className="col-span-1">
                                    <label className="mb-1 block flex items-center gap-1 text-sm font-semibold text-gray-700">
                                        COGS Ledger <span className="text-red-500">*</span>
                                        <div className="group relative cursor-pointer">
                                            <span className="inline-block h-4 w-4 rounded-full bg-gray-300 text-center text-xs font-bold">?</span>
                                            <div className="absolute top-6 left-1/2 z-10 hidden w-64 -translate-x-1/2 rounded-md bg-gray-700 p-2 text-xs text-white shadow-md group-hover:block">
                                                COGS (Cost of Goods Sold) tracks the cost associated with items sold. It reduces your inventory and
                                                reflects business expense.
                                            </div>
                                        </div>
                                    </label>
                                    <select
                                        className="w-full rounded border p-2"
                                        value={data.cogs_ledger_id}
                                        onChange={(e) => setData('cogs_ledger_id', e.target.value)}
                                    >
                                        <option value="">Select cost tracking ledger</option>
                                        {ledgers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.account_ledger_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1 text-sm text-gray-500">
                                        Used to track cost of goods sold. Don’t see one?{' '}
                                        <button onClick={() => setShowCogsLedgerModal(true)} className="text-blue-600 underline">
                                            Create one
                                        </button>
                                    </div>
                                    {errors.cogs_ledger_id && <div className="text-sm text-red-500">{errors.cogs_ledger_id}</div>}
                                </div>

                                {/* Receive Mode */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Receive Mode</label>
                                    <select
                                        className="w-full border p-2"
                                        value={data.received_mode_id || ''}
                                        onChange={(e) => setData('received_mode_id', e.target.value)}
                                    >
                                        <option value="">Select Mode</option>
                                        {receivedModes.map((mode) => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.mode_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1 text-sm text-gray-500">Current Balance: {currentLedgerBalance.toFixed(2)}</div>
                                </div>

                                {/* Receive Amount */}
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">Receive Amount</label>
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
                                    <input type="number" className="w-full border bg-gray-100 p-2" value={data.closing_balance || ''} readOnly />
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
                        <ActionFooter
                            className='w-full justify-end'
                            onSubmit={handleSubmit}
                            cancelHref="/sales"
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save'}
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>

            {/* Inventory Ledger Modal */}
            {showInventoryLedgerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center " style={{
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }} >
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-700">Create Inventory Ledger</h2>

                        <input
                            type="text"
                            placeholder="Ledger Name"
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">Select Group</option>
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

                                        setData('inventory_ledger_id', newLedger.id);
                                        setInventoryLedgers((prev) => [...prev, newLedger]);

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowInventoryLedgerModal(false);
                                    } catch (err) {
                                        console.error(err);
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

            {/* COGS Ledger Modal */}
            {showCogsLedgerModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center" style={{
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }} >
                    <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold text-gray-700">Create COGS Ledger</h2>

                        <input
                            type="text"
                            placeholder="Ledger Name"
                            className="mb-3 w-full rounded border p-2"
                            value={newLedgerName}
                            onChange={(e) => setNewLedgerName(e.target.value)}
                        />

                        <select className="mb-4 w-full rounded border p-2" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)}>
                            <option value="">Select Group</option>
                            {accountGroups.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-3">
                            <button className="rounded bg-gray-400 px-4 py-2 text-white" onClick={() => setShowCogsLedgerModal(false)}>
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

                                        setData('cogs_ledger_id', newLedger.id);
                                        // optional: update dropdown if COGS ledgers are filtered separately

                                        setNewLedgerName('');
                                        setNewGroupId('');
                                        setShowCogsLedgerModal(false);
                                    } catch (err) {
                                        console.error(err);
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
