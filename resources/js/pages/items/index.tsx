// resources/js/pages/items/index.tsx
import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Item {
    id: number;
    item_name: string;
    item_code: string;
    item_part: string;
    purchase_price: number;
    sale_price: number;
    previous_stock: number;
    total_previous_stock_value: number;
    description: string;
    created_by_user?: { name: string };
    category?: { name: string };
    unit?: { name: string };
    godown?: { name: string };
}

interface PaginatedItems {
    data: Item[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function ItemIndex({ items }: { items: PaginatedItems }) {
    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/items/${id}`);
            }
        )
    };

    const columns = [
        { header: '#', accessor: (_: Item, index?: number) => (index !== undefined ? index + 1 : '-'), className: 'text-center' },
        { header: 'Item Name', accessor: 'item_name' },
        { header: 'Item Code', accessor: 'item_code' },
        { header: 'Category', accessor: (item: Item) => item.category?.name || 'N/A' },
        { header: 'Unit', accessor: (item: Item) => item.unit?.name || 'N/A' },
        { header: 'Purchase Price', accessor: 'purchase_price' },
        { header: 'Sales Price', accessor: 'sale_price' },
        { header: 'Stock', accessor: (item: Item) => item.current_stock ?? 0 },
        { header: 'Created By', accessor: (item: Item) => item.creator?.name || 'N/A' },
        {
            header: 'Actions',
            accessor: (item: Item) => (
                <ActionButtons
                    editHref={`/items/${item.id}/edit`}
                    onDelete={() => handleDelete(item.id)}
                />
            ),
            className: 'text-center',
        },
    ];

    return (
        <AppLayout>
            <Head title="Items" />
            <div className="p-6 w-screen lg:w-full bg-gray-100">

                {/* Use the PageHeader component */}
                <PageHeader title='All Items' addLinkHref='/items/create' addLinkText="+ Add New" />


                {/* Table */}
                <TableComponent
                    columns={columns}
                    data={items.data}
                    noDataMessage="No items found."
                />

                {/* Pagination */}
                <Pagination
                    links={items.links}
                    currentPage={items.current_page}
                    lastPage={items.last_page}
                    total={items.total}
                />

            </div>
        </AppLayout>
    );
}
