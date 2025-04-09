import AppLayout from '@/layouts/app-layout';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import Select from 'react-select';

interface WorkingOrder {
    id: number;
    voucher_no: string;
    date: string;
}

interface Item {
    id: number;
    item_name: string;
}

interface Godown {
    id: number;
    name: string;
}

interface ProductRow {
    id?: number;
    product_id: string;
    godown_id: string;
    quantity: string;
    unit_price: string;
    total: number;
}

interface Props {
    finishedProduct: any;
    workingOrders: WorkingOrder[];
    products: Item[];
    godowns: Godown[];
}

export default function Edit({ finishedProduct, workingOrders, products, godowns }: Props) {
    const [selectedWOId, setSelectedWOId] = useState<number | null>(finishedProduct.working_order_id);
    const [date, setDate] = useState(finishedProduct.production_date);
    const [voucherNo] = useState(finishedProduct.production_voucher_no);
    const [referenceNo, setReferenceNo] = useState(finishedProduct.reference_no || '');
    const [note, setNote] = useState(finishedProduct.remarks || '');

    const [rows, setRows] = useState<ProductRow[]>(
        finishedProduct.items.map((item: any) => ({
            id: item.id,
            product_id: String(item.product_id),
            godown_id: String(item.godown_id),
            quantity: String(item.quantity),
            unit_price: String(item.unit_price),
            total: Number(item.total),
        }))
    );

    const workingOrderOptions = workingOrders.map((wo) => ({
        value: wo.id,
        label: `${wo.voucher_no} (${wo.date})`,
    }));

    const handleRowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        const updated = [...rows];
        updated[idx] = { ...updated[idx], [name]: value };

        const qty = parseFloat(updated[idx].quantity) || 0;
        const price = parseFloat(updated[idx].unit_price) || 0;
        updated[idx].total = qty * price;

        setRows(updated);
    };

    const addRow = () => {
        setRows([...rows, { product_id: '', godown_id: '', quantity: '', unit_price: '', total: 0 }]);
    };

    const removeRow = (idx: number) => {
        if (rows.length > 1) {
            setRows(rows.filter((_, i) => i !== idx));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('finished-products.update', finishedProduct.id), {
            working_order_id: selectedWOId,
            production_date: date,
            production_voucher_no: voucherNo,
            reference_no: referenceNo,
            remarks: note,
            productRows: rows,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Finished Product" />
            <div className="mx-auto max-w-6xl space-y-6 rounded-xl bg-gray-100 px-6 py-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6 rounded border bg-white p-6 shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700">Edit Finished Product</h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Working Order</label>
                            <Select
                                options={workingOrderOptions}
                                onChange={(opt) => setSelectedWOId(opt?.value || null)}
                                value={workingOrderOptions.find((opt) => opt.value === selectedWOId) || null}
                                isClearable
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded border px-2 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Voucher No</label>
                            <input
                                type="text"
                                value={voucherNo}
                                readOnly
                                className="w-full cursor-not-allowed rounded border bg-gray-100 px-2 py-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Reference No</label>
                            <input
                                type="text"
                                value={referenceNo}
                                onChange={(e) => setReferenceNo(e.target.value)}
                                className="w-full rounded border px-2 py-2"
                            />
                        </div>
                    </div>

                    {/* Output Product Rows */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">Product Output</h3>
                            <button
                                type="button"
                                onClick={addRow}
                                className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                            >
                                <PlusCircleIcon className="h-5 w-5" />
                                Add Row
                            </button>
                        </div>

                        {rows.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 items-center gap-2 rounded bg-gray-50 p-2">
                                <div className="col-span-3">
                                    <select
                                        name="product_id"
                                        value={row.product_id}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1"
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
                                    <select
                                        name="godown_id"
                                        value={row.godown_id}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1"
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
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={row.quantity}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-right"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <input
                                        type="number"
                                        name="unit_price"
                                        value={row.unit_price}
                                        onChange={(e) => handleRowChange(e, idx)}
                                        className="w-full rounded border px-2 py-1 text-right"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 text-right font-medium text-indigo-600">
                                    {row.total.toFixed(2)}
                                </div>

                                <div className="col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeRow(idx)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <label className="text-sm font-medium text-gray-700">Note</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded border px-3 py-2"
                            rows={3}
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="rounded bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
                        >
                            Update Finished Product
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
