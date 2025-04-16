import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

interface Godown {
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

export default function PurchaseReturnCreate({ godowns, ledgers, items }: { godowns: Godown[]; ledgers: Ledger[]; items: Item[] }) {
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        return_voucher_no: '',
        godown_id: '',
        account_ledger_id: '',
        reason: '',
        return_items: [{ product_id: '', qty: '', price: '', subtotal: '' }],
    });

    // Auto voucher generator
    useEffect(() => {
        if (!data.return_voucher_no) {
            const today = new Date();
            const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const voucher = `RET-${dateStr}-${randomId}`;
            setData('return_voucher_no', voucher);
        }
    }, []);

    // Dynamic item row logic
    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...data.return_items];
        updatedItems[index][field] = value;
        const qty = parseFloat(updatedItems[index].qty) || 0;
        const price = parseFloat(updatedItems[index].price) || 0;
        const subtotal = qty * price;
        updatedItems[index].subtotal = subtotal > 0 ? subtotal : 0;
        setData('return_items', updatedItems);
    };

    const addProductRow = () => setData('return_items', [...data.return_items, { product_id: '', qty: '', price: '', subtotal: '' }]);

    const removeProductRow = (index: number) => {
        if (data.return_items.length === 1) return;
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'Remove this item row?',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, remove it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         const updated = [...data.return_items];
        //         updated.splice(index, 1);
        //         setData('return_items', updated);
        //     }
        // });

        confirmDialog({}, () => {
                const updated = [...data.return_items];
                updated.splice(index, 1);
                setData('return_items', updated);
            }
        );
    };

    const handleSubmit = (e: React.FormEvent, printAfter = false) => {
        e.preventDefault();
        post('/purchase-returns', {
            data: { ...data, print: printAfter }, // 🟢 now print flag is sent to backend
            onSuccess: (page) => {
                const id = page.props.flash?.id;
                if (printAfter && id) {
                    router.visit(`/purchase-returns/${id}/invoice`);
                }
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Add Purchase Return" />
            <div className="bg-gray-100 p-6">
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Create Purchase Return</h1>
                    <Link href="/purchase-returns" className="rounded bg-gray-300 px-4 py-2 hover:bg-neutral-100">
                        Back
                    </Link>
                </div> */}

                <PageHeader title='Create Purchase Return' addLinkText='Back' addLinkHref='/purchase-returns' />

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="space-y-6 rounded bg-white p-6 shadow-md">
                    {/* Return Info */}
                    <div className="space-y-4">
                        <h2 className="border-b pb-1 text-lg font-semibold">Return Information</h2>
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
                                placeholder="Return Voucher No"
                                value={data.return_voucher_no}
                                onChange={(e) => setData('return_voucher_no', e.target.value)}
                                readOnly
                            />
                            <select className="border p-2" value={data.godown_id} onChange={(e) => setData('godown_id', e.target.value)}>
                                <option value="">Select Godown</option>
                                {godowns.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
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
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Reason for Return"
                            className="w-full border p-2"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                        ></textarea>
                    </div>

                    {/* Return Items Table */}
                    <div>
                        <h2 className="mb-3 border-b bg-gray-100 pb-1 text-lg font-semibold">Return Items</h2>
                        <div className="overflow-x-auto rounded border">
                            <table className="min-w-full text-left">
                                <thead className="bg-gray-50 text-sm">
                                    <tr>
                                        <th className="border px-2 py-1">Product</th>
                                        <th className="border px-2 py-1">Qty</th>
                                        <th className="border px-2 py-1">Unit Price</th>
                                        <th className="border px-2 py-1">Subtotal</th>
                                        <th className="border px-2 py-1 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.return_items.map((item, index) => (
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
                                                <input type="number" className="w-full bg-gray-100" value={item.subtotal} readOnly />
                                            </td>
                                            <td className="border px-2 py-1 text-center">
                                                <div className="flex justify-center space-x-1">
                                                    {data.return_items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProductRow(index)}
                                                            className="rounded bg-danger px-2 py-1 text-white hover:bg-danger-hover"
                                                        >
                                                            &minus;
                                                        </button>
                                                    )}
                                                    {index === data.return_items.length - 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={addProductRow}
                                                            className="rounded bg-primary hover:bg-primary-hover px-2 py-1 text-white"
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

                    {/* Totals */}
                    <div className="mt-6 flex justify-between gap-4">
                        <div className="w-1/3 space-y-3">
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Qty:</span>
                                <span className="font-semibold">{data.return_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                <span className="font-semibold text-gray-700">Total Return Value:</span>
                                <span className="font-semibold">
                                    {data.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)} Tk
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    {/* <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, false)}
                            disabled={processing}
                            className="rounded bg-green-600 px-5 py-2 font-semibold text-white shadow hover:bg-green-700"
                        >
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e, true)}
                            disabled={processing}
                            className="rounded bg-blue-600 px-5 py-2 font-semibold text-white shadow hover:bg-blue-700"
                        >
                            Save & Print
                        </button>
                    </div> */}
                    <ActionFooter
                        className='w-full justify-end'
                        onSubmit={(e) => handleSubmit(e, false)}
                        onSaveAndPrint={(e) => handleSubmit(e, true)}
                        cancelHref="/purchase-returns"
                        processing={processing}
                        submitText={processing ? 'Saving...' : 'Save'} 
                        saveAndPrintText= 'Save & Print'
                        cancelText="Cancel"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
