import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create({ accountLedgers = [] }: any) {
    const [voucherNo, setVoucherNo] = useState('');
    const [date, setDate] = useState('');
    const [rows, setRows] = useState([{ ledger_id: '', type: 'debit', amount: '', note: '' }]);
    const [errors, setErrors] = useState<any>({});
    const t = useTranslation();

    // Calculate debit and credit totals
    const getTotalDebit = () => {
        return rows.filter((row) => row.type === 'debit').reduce((sum, row) => sum + parseFloat(row.amount || '0'), 0);
    };

    const getTotalCredit = () => {
        return rows.filter((row) => row.type === 'credit').reduce((sum, row) => sum + parseFloat(row.amount || '0'), 0);
    };

    // Handle row changes
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

        router.post(
            '/journal-add',
            {
                date,
                voucher_no: voucherNo,
                rows,
            },
            {
                onError: (err) => setErrors(err),
            },
        );
    };

    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        const random = Math.floor(1000 + Math.random() * 9000);
        setVoucherNo(`JOURNAL-${today.replace(/-/g, '')}-${random}`);
        setDate(today);
    }, []);

    return (
        <AppLayout>
            <Head title={t('addJournalEntryTitle')} />
            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg bg-background p-4 md:p-12">
                    <PageHeader title={t('addJournalEntriesTitle')} addLinkHref="/journal-add" addLinkText={t('backText')} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('dateLabel')}</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">{t('voucherNoLabel')}</label>
                                <input
                                    type="text"
                                    value={voucherNo}
                                    readOnly
                                    className="w-full rounded border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-md border">
                            <table className="min-w-full table-fixed border-collapse text-left text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="w-1/4 border p-2">{t('ledgerLabel')}</th>
                                        <th className="w-1/6 border p-2">{t('typeLabel')}</th>
                                        <th className="w-1/6 border p-2 text-right">{t('amountLabel')}</th>
                                        <th className="border p-2">{t('noteLabel')}</th>
                                        <th className="w-1/12 border p-2 text-center">{t('action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border p-2">
                                                <select
                                                    value={row.ledger_id}
                                                    onChange={(e) => handleChangeRow(index, 'ledger_id', e.target.value)}
                                                    className="w-full rounded border px-2 py-1"
                                                >
                                                    <option value="">{t('selectLedgerPlaceholder')}</option>
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
                                                    className={`w-full rounded border px-2 py-1 ${row.type === 'debit' ? 'bg-green-50' : 'bg-red-50'} `}
                                                >
                                                    <option value="debit">{t('debitText')}</option>
                                                    <option value="credit">{t('creditText')}</option>
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
                                                        className="bg-danger hover:bg-danger-hover rounded px-3 py-1 text-xl text-white"
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={addRow}
                                                        className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-xl text-white"
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

                        {/* Running Totals Display */}
                        <div className="mt-4 flex justify-between text-sm">
                            <div className="font-semibold">
                                {t('totalDebitText')}: <span className="text-green-600">{getTotalDebit().toFixed(2)}</span>
                            </div>
                            <div className="font-semibold">
                                {t('totalCreditText')}: <span className="text-red-600">{getTotalCredit().toFixed(2)}</span>
                            </div>
                        </div>

                        <ActionFooter
                            className="justify-end"
                            onSubmit={handleSubmit}
                            cancelHref="/journal-add"
                            processing={false}
                            submitText={t('saveJournalEntryText')}
                            cancelText={t('cancelText')}
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
