import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';

interface AccountLedger {
    id: number;
    account_ledger_name: string;
    phone_number: string;
    opening_balance: string;
    closing_balance?: string;
    debit_credit: string;
    reference_number: string;
    account_group?: { name: string };
    group_under?: { name: string };
    created_by?: { name: string };
}

export default function AccountLedgerIndex({ accountLedgers }: { accountLedgers: PaginatedData<AccountLedger> }) {
    const t = useTranslation();
    const handleDelete = (id: number) => {
        confirmDialog({}, () => {
            router.delete(`/account-ledgers/${id}`);
        });
    };

    const columns = [
        {
            header: '#',
            accessor: (_: AccountLedger, index?: number) => (index !== undefined ? index + 1 : '-'),
        },
        { header: t('referenceNumber'), accessor: 'reference_number', className: 'w-2/12' },
        { header: t('accountName'), accessor: 'account_ledger_name', className: 'w-2/12' },
        { header: t('mobileNo'), accessor: 'phone_number', className: 'w-2/12' },
        {
            header: t('groupUnderLedger'),
            accessor: (row: AccountLedger) => row.group_under?.name || row.account_group?.name || 'N/A',
            className: 'w-2/12',
        },
        {
            header: t('openingBalance'),
            accessor: (row: AccountLedger) => parseFloat(row.opening_balance).toLocaleString(),
            className: 'w-2/12',
        },
        {
            header: t('closingBalance'),
            accessor: (row: AccountLedger) => parseFloat(row.closing_balance ?? row.opening_balance ?? '0').toLocaleString(),
            className: 'w-2/12 text-right',
        },
        { header: t('debitCredit'), accessor: 'debit_credit', className: 'capitalize w-2/12' },
        {
            header: t('createdBy'),
            accessor: (row: AccountLedger) => row.created_by?.name || 'N/A',
        },
    ];

    return (
        <AppLayout>
            <Head title={t('accountLedgers')} />

            {/* Page background picks up tokens */}
            <div className="bg-background h-full w-screen md:p-6 lg:w-full">
                {/* Card container uses card tokens + border */}
                <div className="bg-background h-full rounded-lg p-4 md:p-12">
                    <PageHeader title={t('accountLedgersHeader')} addLinkHref="/account-ledgers/create" addLinkText={t('addNewLedger')} />

                    <TableComponent
                        columns={columns}
                        data={accountLedgers.data}
                        actions={(ledger) => (
                            <ActionButtons editHref={`/account-ledgers/${ledger.id}/edit`} onDelete={() => handleDelete(ledger.id)} />
                        )}
                        noDataMessage="No account ledgers found."
                    />

                    {/* Pagination (dark-friendly) */}
                    {/* <div className="mt-6 flex justify-end gap-1">
                        {accountLedgers.links.map((link, index) => {
                            const isActive = link.active;
                            const isDisabled = !link.url;

                            const base = 'rounded border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50';
                            const state = isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card text-foreground hover:bg-accent hover:text-accent-foreground';
                            const disabled = isDisabled ? 'pointer-events-none' : '';

                            return (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={isDisabled}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`${base} ${state} ${disabled}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
