import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

type Row = {
    id: number;
    date: string; // ISO
    voucher_no: string;
    customer: string;
    sale_items: string; // 'Rice, Oil, Sugar'
    extra_count: number; // how many items were truncated
    outstanding: number;
};

interface Props {
    sales: {
        data: Row[];
        current_page: number;
        last_page: number;
        total?: number;
        links: any[];
    };
    filters: { q: string | null };
}

/* helpers ---------------------------------------------------------*/
const fmt = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(n);

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/` + `${String(d.getMonth() + 1).padStart(2, '0')}/` + `${String(d.getFullYear()).slice(-2)}`;
};
/*------------------------------------------------------------------*/

export default function DueIndex({ sales, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.q ?? '');
    const t = useTranslation();

    // Define table columns for TableComponent
    const tableColumns = [
        {
            header: t('dateHeader'),
            accessor: (row: Row) => formatDate(row.date),
        },
        {
            header: t('voucherHeader'),
            accessor: (row: Row) => row.voucher_no,
        },
        {
            header: t('customerHeader'),
            accessor: (row: Row) => row.customer,
        },
        {
            header: t('itemsHeader'),
            accessor: (row: Row) => (
                <div className="text-foreground/80 text-xs">
                    {row.sale_items}
                    {row.extra_count > 0 && (
                        <span className="text-gray-400"> {t('moreItemsText').replace('{count}', row.extra_count.toString())}</span>
                    )}
                </div>
            ),
        },
        {
            header: t('outstandingAmountHeader'),
            accessor: (row: Row) => <span className="font-medium">{fmt(row.outstanding)}</span>,
            className: 'text-right',
        },
    ];

    // Define actions for each row
    const renderActions = (row: Row) => (
        <Link href={route('dues.show', row.id)} className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
            {t('receivePaymentText')}
        </Link>
    );

    const handleReset = () => {
        setSearch(''); // clear local input
        router.get(
            route('dues.index'),
            {},
            {
                // hit the index with *no* query-string
                preserveState: true,
                replace: true,
            },
        );
    };

    /* debounce search ------------------------------------------------*/
    useEffect(() => {
        // if value coming from the server == what's in the input → no need to re-hit the server
        if (search === (filters.q ?? '')) return;

        const t = setTimeout(() => {
            // ⬇⬇⬇  send { q: search } only when search isn't blank
            router.get(
                route('dues.index'),
                search.trim() ? { q: search.trim() } : {}, //   <- change is here
                { preserveState: true, replace: true },
            );
        }, 400); // 0.4 s "lazy" typing

        return () => clearTimeout(t);
    }, [search, filters.q]);
    /*------------------------------------------------------------------*/

    return (
        <AppLayout>
            <Head title={t('outstandingDuesTitle')} />

            <div className="">
                <div className="bg-background h-full w-screen p-4 md:p-12 lg:w-full">
                    <PageHeader title={t('outstandingDuesTitle')} addLinkHref="/sales" addLinkText={t('backToSalesText')} />

                    {/* flash msg */}
                    {flash?.success && <div className="bg-background rounded p-3 text-green-800">{flash.success}</div>}

                    {/* search bar */}
                    <div className="mb-3 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={t('duesSearchPlaceholder')}
                            className="w-full max-w-sm rounded border-b-2 border-gray-600 p-2 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* show Reset only when a filter is applied */}
                        {(filters.q || search) && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                            >
                                {t('resetButtonText')}
                            </button>
                        )}
                    </div>

                    {/* table */}
                    <TableComponent columns={tableColumns} data={sales.data} actions={renderActions} noDataMessage={t('noDuesMessage')} />

                    {/* paginator */}
                    {sales.data.length > 0 && (
                        <Pagination
                            links={sales.links}
                            currentPage={sales.current_page}
                            lastPage={sales.last_page}
                            total={sales.total || sales.data.length}
                        />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
