import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ accountLedgers = [] }: any) {
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState('');
    const [rows, setRows] = useState([{ ledger_id: '', type: 'debit', amount: '', note: '' }]);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const random = Math.floor(1000 + Math.random() * 9000);
        setVoucherNo(`JOURNAL-${today.replace(/-/g, '')}-${random}`);
        setDate(today);
    }, []);

    const handleChangeRow = (index: number, field: string, value: any) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    const addRow = () => {
        setRows([...rows, { ledger_id: '', type: 'debit', amount: '', note: '' }]);
    };

    const removeRow = (index: number) => {
        if (rows.length > 2) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post('/journal-add', {
            date,
            voucher_no: voucherNo,
            rows,
        }, {
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout>
            <Head title="Add Journal Entry" />
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Add Journal Entry</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Voucher No</label>
                            <input
                                type="text"
                                value={voucherNo}
                                readOnly
                                className="w-full bg-gray-100 rounded border-gray-300 px-3 py-2 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-md">
                        <table className="min-w-full table-fixed text-sm text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border w-1/4">Ledger</th>
                                    <th className="p-2 border w-1/6">Type</th>
                                    <th className="p-2 border w-1/6 text-right">Amount</th>
                                    <th className="p-2 border">Note</th>
                                    <th className="p-2 border w-1/12 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="p-2 border">
                                            <select
                                                value={row.ledger_id}
                                                onChange={(e) => handleChangeRow(index, 'ledger_id', e.target.value)}
                                                className="w-full rounded border px-2 py-1"
                                            >
                                                <option value="">Select Ledger</option>
                                                {accountLedgers.map((ledger: any) => (
                                                    <option key={ledger.id} value={ledger.id}>
                                                        {ledger.account_ledger_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`rows.${index}.ledger_id`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`rows.${index}.ledger_id`]}</p>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            <select
                                                value={row.type}
                                                onChange={(e) => handleChangeRow(index, 'type', e.target.value)}
                                                className={`w-full rounded px-2 py-1 border ${
                                                    row.type === 'debit' ? 'bg-green-50' : 'bg-red-50'
                                                }`}
                                            >
                                                <option value="debit">Debit</option>
                                                <option value="credit">Credit</option>
                                            </select>
                                        </td>
                                        <td className="p-2 border text-right">
                                            <input
                                                type="number"
                                                value={row.amount}
                                                onChange={(e) => handleChangeRow(index, 'amount', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-right"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                type="text"
                                                value={row.note}
                                                onChange={(e) => handleChangeRow(index, 'note', e.target.value)}
                                                className="w-full rounded border px-2 py-1"
                                            />
                                        </td>
                                        <td className="p-2 border text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="text-red-600 hover:underline text-xs"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {errors.rows && <p className="text-red-500 text-sm px-3 pt-2">{errors.rows}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={addRow}
                            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 text-sm"
                        >
                            + Add Row
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-5 py-2 text-white text-sm hover:bg-blue-700"
                        >
                            Save Journal
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
