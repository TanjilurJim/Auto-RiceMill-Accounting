import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
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
  created_by_user?: { name: string };
}

export default function AccountLedgerIndex({
  accountLedgers,
}: {
  accountLedgers: PaginatedData<AccountLedger>;
}) {
  const handleDelete = (id: number) => {
    confirmDialog({}, () => {
      router.delete(`/account-ledgers/${id}`);
    });
  };

  const columns = [
    {
      header: '#',
      accessor: (_: AccountLedger, index?: number) =>
        index !== undefined ? index + 1 : '-',
      className: 'text-center w-1/12',
    },
    { header: 'Reference Number', accessor: 'reference_number', className: 'w-2/12' },
    { header: 'Account Name', accessor: 'account_ledger_name', className: 'w-2/12' },
    { header: 'Mobile No', accessor: 'phone_number', className: 'w-2/12' },
    {
      header: 'Group Under',
      accessor: (row: AccountLedger) =>
        row.group_under?.name || row.account_group?.name || 'N/A',
      className: 'w-2/12',
    },
    {
      header: 'Opening Balance',
      accessor: (row: AccountLedger) =>
        parseFloat(row.opening_balance).toLocaleString(),
      className: 'w-2/12',
    },
    {
      header: 'Closing Balance',
      accessor: (row: AccountLedger) =>
        parseFloat(row.closing_balance ?? row.opening_balance ?? '0').toLocaleString(),
      className: 'w-2/12 text-right',
    },
    { header: 'Debit/Credit', accessor: 'debit_credit', className: 'capitalize w-2/12' },
    {
      header: 'Created By',
      accessor: (row: AccountLedger) => row.created_by_user?.name || 'N/A',
      className: 'w-2/12',
    },
  ];

  return (
    <AppLayout>
      <Head title="Account Ledgers" />

      {/* Page background picks up tokens */}
      <div className="min-h-svh bg-background p-6">
        {/* Card container uses card tokens + border */}
        <div className="mx-auto rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <PageHeader
            title="All List of Account Ledgers"
            addLinkHref="/account-ledgers/create"
            addLinkText="+ Add New"
          />

          <TableComponent
            columns={columns}
            data={accountLedgers.data}
            actions={(ledger) => (
              <ActionButtons
                editHref={`/account-ledgers/${ledger.id}/edit`}
                onDelete={() => handleDelete(ledger.id)}
              />
            )}
            noDataMessage="No account ledgers found."
          />

          {/* Pagination (dark-friendly) */}
          <div className="mt-6 flex justify-end gap-1">
            {accountLedgers.links.map((link, index) => {
              const isActive = link.active;
              const isDisabled = !link.url;

              const base =
                'rounded border px-3 py-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50';
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
