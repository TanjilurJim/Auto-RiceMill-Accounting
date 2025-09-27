import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FiEdit, FiTrash, FiEye } from 'react-icons/fi'; // Icon library
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';

interface Godown {
    name: string;
}
interface Item {
    id: number;
    item_name: string;
}
interface StockTransferItem {
    id: number;
    item: Item;
}
interface StockTransfer {
    id: number;
    voucher_no: string;
    reference_no?: string;
    from_godown: Godown | null;
    to_godown: Godown | null;
    total_quantity: number;
    total_amount: number;
    date: string;
    items: StockTransferItem[];
}
interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}
interface Props {
    stockTransfers: Paginated<StockTransfer>;
}

export default function Index({ stockTransfers }: Props) {
    const transfers = stockTransfers.data ?? [];

    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/stock-transfers/${id}`);
            }
        );
    };

    const columns = [
        { header: 'Voucher No', accessor: 'voucher_no', className: 'font-medium text-blue-700' },
        { header: 'Reference', accessor: 'reference_no', defaultValue: '—' },
        {
            header: 'Items',
            accessor: (row: StockTransfer) => row.items?.map((i) => i.item?.item_name).join(', ') || '—',
            className: 'text-gray-700'
        },
        { header: 'From', accessor: (row: StockTransfer) => row.from_godown?.name || '—' },
        { header: 'To', accessor: (row: StockTransfer) => row.to_godown?.name || '—' },
        {
            header: 'Qty',
            accessor: (row: StockTransfer) => Number(row.total_quantity).toFixed(2),
            className: 'text-right'
        },
        {
            header: 'Amount',
            accessor: (row: StockTransfer) => Number(row.total_amount).toFixed(2),
            className: 'text-right'
        },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Actions',
            accessor: (row: StockTransfer) => (
                <ActionButtons
                    editText={<FiEdit />}
                    deleteText={<FiTrash />}
                    editHref={`/stock-transfers/${row.id}/edit`}
                    onDelete={() => handleDelete(row.id)}
                    printHref={`/stock-transfers/${row.id}`}
                    printText={<FiEye />}
                />
            ),
            className: 'text-center'
        },
    ];

    return (
        <AppLayout>
            <Head title="Stock Transfers" />
            <div className="h-full w-screen lg:w-full">
                <div className="bg-background h-full rounded-lg p-4 md:p-12">

                    <PageHeader title='Stock Transfers' addLinkHref='/stock-transfers/create' addLinkText='+ New Transfer' />

                    <TableComponent
                        columns={columns}
                        data={transfers}
                        noDataMessage="No stock transfers found."
                    />


                    {/* Pagination */}
                    <Pagination
                        links={stockTransfers.links}
                        currentPage={stockTransfers.current_page}
                        lastPage={stockTransfers.last_page}
                        total={stockTransfers.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
