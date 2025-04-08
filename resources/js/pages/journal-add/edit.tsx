import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Edit({ journal, accountLedgers, errors }: any) {
    // Map journal entries to include ledger_id for initial state
    const initialRows = journal.entries.map((entry) => ({
        ledger_id: entry.ledger.id,
        type: entry.type,
        amount: entry.amount,
        note: entry.note,
    }));

    const [rows, setRows] = useState(initialRows); // Use mapped entries
    const { data, setData, put } = useForm({
        date: journal.date,
        voucher_no: journal.voucher_no,
        rows: initialRows, // Use the same initial structure for form data
    });

    // Handle row changes (keep existing logic)
    const handleChangeRow = (index: number, field: string, value: any) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
        setData('rows', updated);
    };

    const addRow = () => {
        const newRow = { ledger_id: '', type: 'debit', amount: '', note: '' };
        setRows([...rows, newRow]);
        setData('rows', [...rows, newRow]);
    };

    const removeRow = (index: number) => {
        if (rows.length > 1) {
            const updatedRows = rows.filter((_, i) => i !== index);
            setRows(updatedRows);
            setData('rows', updatedRows);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(
            `/journal-add/${journal.id}`,
            {
                ...data,
            },
            {
                onError: (err) => console.log(err),
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Edit Journal Entry" />
            <div className="mx-auto max-w-5xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Journal Entry</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Date</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Voucher No</label>
                            <input
                                type="text"
                                value={data.voucher_no}
                                readOnly
                                className="w-full rounded border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-md border">
                        <table className="min-w-full table-fixed border-collapse text-left text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="w-1/4 border p-2">Ledger</th>
                                    <th className="w-1/6 border p-2">Type</th>
                                    <th className="w-1/6 border p-2 text-right">Amount</th>
                                    <th className="border p-2">Note</th>
                                    <th className="border p-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            <select
                                                value={row.ledger_id} // Set the ledger_id to the value from the existing row
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
                                                <p className="mt-1 text-xs text-red-500">{errors[`rows.${index}.ledger_id`]}</p>
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            <select
                                                value={row.type}
                                                onChange={(e) => handleChangeRow(index, 'type', e.target.value)}
                                                className={`w-full rounded border px-2 py-1 ${row.type === 'debit' ? 'bg-green-50' : 'bg-red-50'}`}
                                            >
                                                <option value="debit">Debit</option>
                                                <option value="credit">Credit</option>
                                            </select>
                                        </td>
                                        <td className="border p-2 text-right">
                                            <input
                                                type="number"
                                                value={row.amount}
                                                onChange={(e) => handleChangeRow(index, 'amount', e.target.value)}
                                                className="w-full rounded border px-2 py-1 text-right"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                value={row.note}
                                                onChange={(e) => handleChangeRow(index, 'note', e.target.value)}
                                                className="w-full rounded border px-2 py-1"
                                            />
                                        </td>
                                        <td className="border p-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => removeRow(index)}
                                                    className="rounded bg-red-600 px-3 py-1 text-xl text-white hover:bg-red-700"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={addRow}
                                                    className="rounded bg-blue-600 px-3 py-1 text-xl text-white hover:bg-blue-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {errors.rows && <p className="px-3 pt-2 text-sm text-red-500">{errors.rows}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button type="submit" className="rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
                            Update Journal
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
