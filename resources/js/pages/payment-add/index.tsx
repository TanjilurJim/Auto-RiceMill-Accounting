import ActionButtons from '@/components/ActionButtons';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
    paymentAdds: any;
    filters: {
        search?: string;
        payment_mode_id?: string;
        from_date?: string;
        to_date?: string;
    };
    paymentModes: any[];
}

export default function Index({ paymentAdds, filters, paymentModes }: Props) {
    const t = useTranslation();

    const [search, setSearch] = useState(filters.search || '');
    const [paymentModeId, setPaymentModeId] = useState(filters.payment_mode_id || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    // 🔁 Live search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('payment-add.index'),
                {
                    search,
                    payment_mode_id: paymentModeId,
                    from_date: fromDate,
                    to_date: toDate,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, paymentModeId, fromDate, toDate]);

    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/payment-add/${id}`);
        });
    };

    const columns = [
        { header: t('dateHeader'), accessor: 'date' },
        { header: t('voucherNoLabel'), accessor: 'voucher_no' },
        { header: t('paymentModeHeader'), accessor: (row: any) => row.paymentMode?.mode_name || 'N/A' },
        {
            header: t('accountLedgerHeader'),
            accessor: (row: any) =>
                `${row.accountLedger?.account_ledger_name || 'N/A'}${row.accountLedger?.reference_number ? ` - ${row.accountLedger.reference_number}` : ''}`,
        },
        { header: t('amountHeader'), accessor: (row: any) => Number(row.amount).toFixed(2), className: 'text-right' },
        { header: t('descriptionHeader'), accessor: 'description' },
    ];

    return (
        <AppLayout>
            <Head title={t('paymentListTitle')} />

            <div className="h-full w-screen lg:w-full">
                <div className="h-full rounded-lg bg-background p-4 md:p-12">
                    <PageHeader title={t('allPaymentsTitle')} addLinkHref="/payment-add/create" addLinkText={t('addPaymentText')} />

                    {/* ✅ Filters */}
                    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('searchVoucherPlaceholder')}
                            className="rounded border px-3 py-2 text-sm"
                        />
                        <select value={paymentModeId} onChange={(e) => setPaymentModeId(e.target.value)} className="rounded border px-3 py-2 text-sm">
                            <option value="">{t('allPaymentModesOption')}</option>
                            {paymentModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.mode_name}
                                </option>
                            ))}
                        </select>
                        <InputCalendar value={fromDate} label="" onChange={(val) => setFromDate(val)} />
                        <InputCalendar value={toDate} label="" onChange={(val) => setToDate(val)} />
                    </div>

                    <TableComponent
                        columns={columns}
                        data={paymentAdds.data}
                        actions={(row: any) => (
                            <ActionButtons
                                editHref={`/payment-add/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/payment-add/${row.voucher_no}/print`}
                                printText={t('printText')}
                            />
                        )}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
