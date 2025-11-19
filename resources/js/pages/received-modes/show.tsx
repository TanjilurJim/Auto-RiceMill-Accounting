// resources/js/Pages/received-modes/show.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useState } from 'react';
import axios from 'axios';

interface Ledger {
    id: number;
    account_ledger_name: string;
    closing_balance: number | string;
}

interface Transaction {
    id: number;
    date: string;
    type: string;
    debit: number;
    credit: number;
    note?: string;
}

export default function Show({
    receivedMode,
    ledger,
    transactions,
}: {
    receivedMode: any;
    ledger: Ledger;
    transactions: Transaction[];
}) {
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [amt, setAmt] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const openAddMoney = () => {
        setAmt('');
        setNote('');
        setDate(new Date().toISOString().slice(0, 10));
        setFormErrors({});
        setShowAddMoneyModal(true);
    };

    const submitAddMoney = async () => {
        setSubmitting(true);
        setFormErrors({});
        try {
            const payload = {
                amount: parseFloat(amt) || 0,
                date,
                note,
            };
            await axios.post(`/received-modes/${receivedMode.id}/receive`, payload);
            setShowAddMoneyModal(false);
            // refresh page / list
            router.reload();
        } catch (err: any) {
            if (err?.response?.status === 422) {
                setFormErrors(err.response.data.errors || {});
            } else {
                console.error(err);
                alert(err?.response?.data?.message ?? 'Failed to record receipt.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { header: 'Date', accessor: (t: Transaction) => t.date },
        { header: 'Type', accessor: 'type' },
        {
            header: 'Debit',
            className: 'text-right',
            accessor: (t: Transaction) => Number(t.debit || 0).toFixed(2),
        },
        {
            header: 'Credit',
            className: 'text-right',
            accessor: (t: Transaction) => Number(t.credit || 0).toFixed(2),
        },
        {
            header: 'Note',
            accessor: (t: Transaction) => t.note ?? '—',
        },
    ];

    return (
        <AppLayout>
            <Head title={`Received Mode · ${receivedMode.mode_name}`} />

            <div className="h-full w-screen lg:w-full p-4 md:p-12">
                <div className="rounded-lg">
                    <PageHeader title={receivedMode.mode_name} addLinkHref="/received-modes" addLinkText="Back" />

                    {/* Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Balance card */}
                        <div className="rounded-xl border bg-background shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {Number(ledger.closing_balance ?? 0).toFixed(2)} TK
                            </p>
                        </div>

                        {/* Mode info */}
                        <div className="rounded-xl border bg-background shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-700">Mode Details</h3>

                            <p className="mt-2 text-sm">
                                <strong>Name:</strong> {receivedMode.mode_name}
                            </p>

                            <p className="mt-1 text-sm">
                                <strong>Phone:</strong> {receivedMode.phone_number || '—'}
                            </p>

                            <p className="mt-1 text-sm">
                                <strong>Ledger:</strong> {ledger.account_ledger_name}
                            </p>
                        </div>

                        {/* Add Money Button */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={openAddMoney}
                                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white text-lg rounded-lg shadow"
                            >
                                + Add Money
                            </button>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="mt-10 rounded-2xl border bg-background p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Transactions</h3>

                        <TableComponent columns={columns} data={transactions} noDataMessage="No transactions yet." />
                    </div>
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddMoneyModal && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded bg-white p-6">
                        <h3 className="mb-3 text-lg font-semibold">Add money to {receivedMode.mode_name}</h3>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium">Amount</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amt}
                                    onChange={(e) => setAmt(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {formErrors.amount && <p className="text-xs text-red-600">{formErrors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {formErrors.date && <p className="text-xs text-red-600">{formErrors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Note</label>
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />
                                {formErrors.note && <p className="text-xs text-red-600">{formErrors.note}</p>}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button 
                                className="rounded border px-4 py-2" 
                                onClick={() => setShowAddMoneyModal(false)} 
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="rounded bg-green-600 px-4 py-2 text-white" 
                                onClick={submitAddMoney} 
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}