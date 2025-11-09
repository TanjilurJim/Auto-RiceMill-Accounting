// resources/js/Pages/account-ledgers/index.tsx
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData } from '@/types/pagination';
import { Head, router } from '@inertiajs/react';
import React from 'react';

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

interface PageProps {
  accountLedgers: PaginatedData<AccountLedger>;
  filters?: { search?: string; type?: string | null };
  ledgerTypes?: string[];
}

export default function AccountLedgerIndex({ accountLedgers, filters, ledgerTypes = [] }: PageProps) {
  const t = useTranslation();

  // --- Local UI state for search + filter (seeded from server filters) ---
  const [q, setQ] = React.useState<string>(filters?.search ?? '');
  const [type, setType] = React.useState<string>(filters?.type ?? '');

  // Debounced search -> /account-ledgers?search=&type=
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      router.get(
        '/account-ledgers',
        { search: q || undefined, type: type || undefined, page: 1 }, // reset to page 1
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['accountLedgers', 'filters'],
        }
      );
    }, 300);
    return () => clearTimeout(id);
  }, [q, type]);

  const handleDelete = (id: number) => {
    confirmDialog({}, () => router.delete(`/account-ledgers/${id}`));
  };

  const columns = [
    { header: '#', accessor: (_: AccountLedger, index?: number) => (index !== undefined ? index + 1 : '-') },
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
      accessor: (row: AccountLedger) =>
        parseFloat(row.closing_balance ?? row.opening_balance ?? '0').toLocaleString(),
      className: 'w-2/12 text-right',
    },
    { header: t('debitCredit'), accessor: 'debit_credit', className: 'capitalize w-2/12' },
    // { header: t('createdBy'), accessor: (row: AccountLedger) => row.created_by?.name || 'N/A' },
  ];

  return (
    <AppLayout>
      <Head title={t('accountLedgers')} />

      <div className="bg-background h-full w-screen md:p-6 lg:w-full">
        <div className="bg-background h-full rounded-lg p-4 md:p-12">
          <PageHeader
            title={t('accountLedgersHeader')}
            addLinkHref="/account-ledgers/create"
            addLinkText={t('addNewLedger')}
          />

          {/* Toolbar: responsive search + type filter (two columns on md+) */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <label htmlFor="ledger-search" className="sr-only">
                {t('search') || 'Search'}
              </label>
              <input
                id="ledger-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('Search Ledgers') || 'Search ledgers...'}
                className="h-10 w-full rounded border px-3"
                // prevent Enter from submitting any surrounding forms
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              />
            </div>

            <div className="md:col-span-4">
              <label htmlFor="ledger-type" className="sr-only">
                {t('filterByType') || 'Filter by type'}
              </label>
              <select
                id="ledger-type"
                className="h-10 w-full rounded border px-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">{t('All Types') || 'All types'}</option>
                {ledgerTypes.map((tpe) => (
                  <option key={tpe} value={tpe}>
                    {tpe.replace(/_/g, ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TableComponent
            columns={columns}
            data={accountLedgers.data}
            actions={(ledger) => (
              <ActionButtons
                editHref={`/account-ledgers/${ledger.id}/edit`}
                onDelete={() => handleDelete(ledger.id)}
              />
            )}
            noDataMessage={t('noAccountLedgers') || 'No account ledgers found.'}
          />

          {/* Pagination — keep current query params via router.visit */}
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
