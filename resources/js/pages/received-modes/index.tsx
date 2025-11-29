import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

interface ReceivedMode {
    id: number;
    mode_name: string;
    opening_balance: string;
    closing_balance: string;
    phone_number: string;
    ledger?: { id: number; account_ledger_name: string; closing_balance?: number };
}

interface PaginatedReceivedModes {
    data: ReceivedMode[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function Index({
    receivedModes,
    currentPage,
    perPage,
}: {
    receivedModes: PaginatedReceivedModes;
    currentPage: number;
    perPage: number;
}) {
    const t = useTranslation();

    const safeReceivedModes = receivedModes || { data: [], links: [] };
    const modes = safeReceivedModes.data || [];

    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [activeMode, setActiveMode] = useState<ReceivedMode | null>(null);
    const [amt, setAmt] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [note, setNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/received-modes/${id}`);
        });
    };

    const openAddMoney = (mode: ReceivedMode) => {
        setActiveMode(mode);
        setAmt('');
        setNote('');
        setDate(new Date().toISOString().slice(0, 10));
        setFormErrors({});
        setShowAddMoneyModal(true);
    };

    const submitAddMoney = async () => {
        if (!activeMode) return;
        setSubmitting(true);
        setFormErrors({});
        try {
            const payload = {
                amount: parseFloat(amt) || 0,
                date,
                note,
            };
            await axios.post(`/received-modes/${activeMode.id}/receive`, payload);
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
        { header: t('#'), accessor: (_: ReceivedMode, index?: number) => <span>{(index ?? 0) + 1}</span>, className: '' },
        { header: t('modeNameHeader'), accessor: 'mode_name' },
        { header: t('phoneNumberHeader'), accessor: 'phone_number' },
        {
            header: t('balanceHeader') ?? 'Balance',
            accessor: (r: ReceivedMode) => Number(r.ledger?.closing_balance ?? 0).toFixed(2),
            className: 'text-right',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('receivedModesTitle')} />
            <div className="h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-4 md:p-12">
                    <PageHeader title={t('receivedModesTitle')} addLinkHref="/received-modes/create" addLinkText={t('addNewReceivedMode')} />

                    <TableComponent
                        columns={columns}
                        data={safeReceivedModes.data}
                        actions={(row: ReceivedMode) => (
                            <div className="flex items-center space-x-2">
                                {/* View -> link to edit/show page for the received mode */}
                                <a href={`/received-modes/${row.id}`} className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                                    View
                                </a>

                                {/* Add Money */}
                                <button
                                    type="button"
                                    onClick={() => openAddMoney(row)}
                                    className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                >
                                    Add Money
                                </button>

                                {/* Existing delete button */}
                                <ActionButtons onDelete={() => handleDelete(row.id)} hideEdit />
                            </div>
                        )}
                    />

                    {/* Pagination */}
                    <Pagination
                        links={safeReceivedModes.links}
                        currentPage={safeReceivedModes.current_page}
                        lastPage={safeReceivedModes.last_page}
                        total={safeReceivedModes.total}
                    />
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddMoneyModal && activeMode && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="w-full max-w-md rounded bg-white p-6">
                        <h3 className="mb-3 text-lg font-semibold">Add money to {activeMode.mode_name}</h3>

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
                            <button className="rounded border px-4 py-2" onClick={() => setShowAddMoneyModal(false)} disabled={submitting}>
                                Cancel
                            </button>
                            <button className="rounded bg-green-600 px-4 py-2 text-white" onClick={submitAddMoney} disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
