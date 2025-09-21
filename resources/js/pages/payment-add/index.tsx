import ActionButtons from '@/components/ActionButtons';
import InputCalendar from '@/components/Btn&Link/InputCalendar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
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
    const [search, setSearch] = useState(filters.search || '');
    const [paymentModeId, setPaymentModeId] = useState(filters.payment_mode_id || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    // 🔁 Live search effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('payment-add.index'), {
                search,
                payment_mode_id: paymentModeId,
                from_date: fromDate,
                to_date: toDate,
            }, {
                preserveState: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [search, paymentModeId, fromDate, toDate]);

    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/payment-add/${id}`);
            }
        )
    };

    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Voucher No', accessor: 'voucher_no' },
        { header: 'Payment Mode', accessor: (row: any) => row.paymentMode?.mode_name || 'N/A' },
        {
            header: 'Account Ledger',
            accessor: (row: any) =>
                `${row.accountLedger?.account_ledger_name || 'N/A'}${row.accountLedger?.reference_number ? ` - ${row.accountLedger.reference_number}` : ''}`,
        },
        { header: 'Amount', accessor: (row: any) => Number(row.amount).toFixed(2), className: 'text-right' },
        { header: 'Description', accessor: 'description' },
    ];

    return (
        <AppLayout>
            <Head title="Payment List" />

            <div className="h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-4 md:p-12">

                    <PageHeader title='All List of Payments' addLinkHref='/payment-add/create' addLinkText="+ Add New" />

                    {/* ✅ Filters */}
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search voucher or ledger..."
                            className="rounded border px-3 py-2 text-sm"
                        />
                        <select
                            value={paymentModeId}
                            onChange={(e) => setPaymentModeId(e.target.value)}
                            className="rounded border px-3 py-2 text-sm"
                        >
                            <option value="">All Payment Modes</option>
                            {paymentModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.mode_name}
                                </option>
                            ))}
                        </select>
                        <InputCalendar
                            value={fromDate}
                            label=""
                            onChange={(val) => setFromDate(val)}
                        />
                        <InputCalendar
                            value={toDate}
                            label=""
                            onChange={(val) => setToDate(val)}
                        />
                    </div>

                    <TableComponent
                        columns={columns}
                        data={paymentAdds.data}
                        actions={(row: any) => (
                            <ActionButtons
                                editHref={`/payment-add/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/payment-add/${row.voucher_no}/print`}
                                printText="Print"
                            />
                        )}
                    />

                </div>
            </div>

        </AppLayout>
    );
}
