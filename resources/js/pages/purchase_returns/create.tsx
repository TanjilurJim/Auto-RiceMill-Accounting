import ActionFooter from '@/components/ActionFooter';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

interface Godown {
    id: number;
    name: string;
}

interface ReceivedMode {
    id: number;
    mode_name: string;
    ledger_id: number;
    ledger: {
        id: number;
        account_ledger_name: string;
    };
}
interface Ledger {
    id: number;
    account_ledger_name: string;
}
interface Item {
    id: number;
    item_name: string;
}

export default function PurchaseReturnCreate({ godowns, ledgers, items, receivedModes, }: { godowns: Godown[]; ledgers: Ledger[]; items: Item[]; receivedModes: ReceivedMode[]; }) {
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        return_voucher_no: '',
        godown_id: '',
        account_ledger_id: '',
        inventory_ledger_id: '', // 🆕 for journal credit
        reason: '',
        return_items: [{ product_id: '', qty: '', price: '', subtotal: '' }],
        refund_modes: [{ mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' }], // 🆕 for optional refund flow
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
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title='Create Purchase Return' addLinkText='Back' addLinkHref='/purchase-returns' />

                    {/* Form Card */}
                    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6  border">
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
                                <select
                                    className="border p-2"
                                    value={data.inventory_ledger_id}
                                    onChange={(e) => setData('inventory_ledger_id', e.target.value)}
                                >
                                    <option value="">Select Inventory Ledger</option>
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
                            <div className="w-full flex flex-col md:flex-row  gap-2.5">
                                <div className="w-full flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                    <span className="font-semibold text-gray-700">Total Qty:</span>
                                    <span className="font-semibold">{data.return_items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0)}</span>
                                </div>
                                <div className="w-full flex justify-between rounded border bg-gray-50 p-3 shadow-sm">
                                    <span className="font-semibold text-gray-700">Total Return Value:</span>
                                    <span className="font-semibold">
                                        {data.return_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)} Tk
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <h2 className="border-b pb-1 text-lg font-semibold">Refund Mode</h2>
                            {data.refund_modes.map((mode, index) => (
                                <div key={index} className="grid grid-cols-1 items-center gap-4 md:grid-cols-4">
                                    <select
                                        className="border p-2"
                                        value={mode.ledger_id}
                                        onChange={(e) => {
                                            const selected = receivedModes.find((r) => r.ledger_id == e.target.value);
                                            const updated = [...data.refund_modes];
                                            updated[index].ledger_id = e.target.value;
                                            updated[index].mode_name = selected?.mode_name || ''; // auto-fill mode_name
                                            setData('refund_modes', updated);
                                        }}
                                    >
                                        <option value="">Select Refund Mode</option>
                                        {receivedModes.map((rm) => (
                                            <option key={rm.ledger_id} value={rm.ledger_id}>
                                                {rm.mode_name} — {rm.ledger?.account_ledger_name || 'Ledger'}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        className="border p-2"
                                        value={mode.phone_number}
                                        onChange={(e) => {
                                            const updated = [...data.refund_modes];
                                            updated[index].phone_number = e.target.value;
                                            setData('refund_modes', updated);
                                        }}
                                    />

                                    <input
                                        type="number"
                                        placeholder="Amount Paid"
                                        className="border p-2"
                                        value={mode.amount_paid}
                                        onChange={(e) => {
                                            const updated = [...data.refund_modes];
                                            updated[index].amount_paid = e.target.value;
                                            setData('refund_modes', updated);
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        {data.refund_modes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...data.refund_modes];
                                                    updated.splice(index, 1);
                                                    setData('refund_modes', updated);
                                                }}
                                                className="rounded bg-danger hover:bg-danger-hover px-3 py-1 text-white w-full md:w-fit"
                                            >
                                                &minus;
                                            </button>
                                        )}
                                        {index === data.refund_modes.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData('refund_modes', [
                                                        ...data.refund_modes,
                                                        { mode_name: '', phone_number: '', ledger_id: '', amount_paid: '' },
                                                    ])
                                                }
                                                className="rounded bg-primary hover:bg-primary-hover px-3 py-1 text-white w-full md:w-fit"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 text-right text-sm text-gray-600">
                            Total Refunded: {data.refund_modes.reduce((sum, r) => sum + (parseFloat(r.amount_paid) || 0), 0)} Tk
                        </div>

                        {/* Submit */}
                        <ActionFooter
                            onSubmit={(e) => handleSubmit(e, false)}
                            onSaveAndPrint={(e) => handleSubmit(e, true)}
                            cancelHref="/purchase-returns"
                            processing={processing}
                            submitText={processing ? 'Saving...' : 'Save'}
                            // saveAndPrintText='Save & Print'
                            cancelText="Cancel"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
