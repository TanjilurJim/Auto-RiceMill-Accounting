import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface WorkingOrder {
    id: number;
    voucher_no: string;
    date: string;
    items: {
        item: { item_name: string };
        godown: { name: string };
        quantity: number;
        purchase_price: number;
        subtotal: number;
    }[];
    extras: {
        title: string;
        total: number;
    }[];
}

interface Item {
    id: number;
    item_name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface Props {
    workingOrders: WorkingOrder[];
    products: Item[];
    godowns: Godown[];
    autoVoucherNo: string;
}

export default function Create({ workingOrders, products, godowns, autoVoucherNo }: Props) {
    const [selectedWOId, setSelectedWOId] = useState<number | null>(null);
    const [selectedWO, setSelectedWO] = useState<WorkingOrder | null>(null);

    const [productionDate, setProductionDate] = useState('');
    const [referenceNo, setReferenceNo] = useState('');
    const [note, setNote] = useState('');

    const [rows, setRows] = useState([{ product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);

    const workingOrderOptions = workingOrders.map((wo) => ({
        value: wo.id,
        label: `${wo.voucher_no} (${wo.date})`,
    }));

    useEffect(() => {
        if (selectedWOId) {
            const wo = workingOrders.find((wo) => wo.id === selectedWOId);
            setSelectedWO(wo || null);
        } else {
            setSelectedWO(null);
        }
    }, [selectedWOId]);

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        const updated = [...rows];
        updated[idx] = { ...updated[idx], [name]: value };

        const qty = parseFloat(updated[idx].quantity) || 0;
        const price = parseFloat(updated[idx].unit_price) || 0;
        updated[idx].total = qty * price;

        setRows(updated);
    };

    const addRow = () => setRows([...rows, { product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);

    const removeRow = (idx: number) => rows.length > 1 && setRows(rows.filter((_, i) => i !== idx));

    const itemTotal = rows.reduce((t, r) => t + r.total, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted');

        router.post(route('finished-products.store'), {
            working_order_id: selectedWOId,
            production_date: productionDate,
            production_voucher_no: autoVoucherNo,
            reference_no: referenceNo,
            remarks: note,
            productRows: rows,
        });
    };

    return (
        <AppLayout>
            <Head title="Add Finished Product" />

            <div className="mx-auto max-w-6xl space-y-6 rounded-xl bg-gray-100 px-6 py-8 shadow-xl">

                <PageHeader title="Add Finished Product" addLinkHref='/finished-products' addLinkText='Back' />

                {/* Working Order Selection */}
                <div className="rounded border bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-lg font-bold">Select Working Order</h2>
                    <Select
                        options={workingOrderOptions}
                        onChange={(option) => setSelectedWOId(option?.value || null)}
                        placeholder="Search Working Order..."
                        isClearable
                    />

                    {selectedWO && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-md mb-2 font-semibold">Materials Used:</h3>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {selectedWO?.items?.length ? (
                                    selectedWO.items.map((i, idx) => (
                                        <li key={idx}>
                                            {i.item?.item_name} from {i.godown?.name} — Qty: {i.quantity} @ {i.purchase_price} = {i.subtotal}
                                        </li>
                                    ))
                                ) : (
                                    <li>No material items</li>
                                )}
                            </ul>

                            {selectedWO?.extras?.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-800">Extras:</h4>
                                    <ul className="text-sm text-gray-600">
                                        {selectedWO?.extras?.length ? (
                                            selectedWO.extras.map((e, i) => (
                                                <li key={i}>
                                                    {e.title} - {e.total}
                                                </li>
                                            ))
                                        ) : (
                                            <li>No extra expenses</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Production Entry Form */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded border bg-white p-6 shadow-md">
                    <h2 className="mb-2 text-lg font-bold">Add Production</h2>

                    {/* Header Fields */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={productionDate}
                                onChange={(e) => setProductionDate(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Voucher No</label>
                            <input
                                type="text"
                                value={autoVoucherNo}
                                readOnly
                                className="w-full cursor-not-allowed rounded border bg-gray-100 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Reference No</label>
                            <input
                                type="text"
                                value={referenceNo}
                                onChange={(e) => setReferenceNo(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Dynamic Product Rows */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Production Output</h3>
                            <button type="button" onClick={addRow} className="flex items-center gap-1 text-sm text-indigo-600 hover:underline">
                                <PlusCircleIcon className="h-5 w-5" />
                                Add Row
                            </button>
                        </div>

                        {rows.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 items-center gap-2 rounded bg-gray-50 p-2">
                                <div className="col-span-3">
                                <label className="text-sm font-medium text-gray-700">Item</label>
                                    <select
                                        name="product_id"
                                        value={row.product_id}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-sm"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.item_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700">Godown</label>
                                    <select
                                        name="godown_id"
                                        value={row.godown_id}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-sm"
                                        required
                                    >
                                        <option value="">Select Godown</option>
                                        {godowns.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={row.quantity}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-right text-sm"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        name="unit_price"
                                        value={row.unit_price}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-right text-sm"
                                    />
                                </div>
                                <div className="col-span-2 text-right font-semibold text-indigo-600">{Number(row.total || 0).toFixed(2)}</div>
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(idx)}
                                        disabled={rows.length === 1}
                                        className="text-danger hover:text-danger-hover"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex items-center justify-between border-t pt-2 text-sm font-medium text-gray-800">
                        <span>Total Items: {rows.length}</span>
                        <span>Total Amount: {itemTotal.toFixed(2)}</span>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Any additional notes..."
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <ActionFooter
                        className='justify-end'
                        onSubmit={handleSubmit}
                        cancelHref="/finished-products"
                        processing={false}
                        submitText="Save Finished Product"
                        cancelText="Cancel"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
