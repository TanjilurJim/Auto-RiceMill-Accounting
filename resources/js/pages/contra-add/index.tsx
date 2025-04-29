import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Index({ contras }: any) {
    const handleDelete = (id: number) => {
        confirmDialog(
            {}, () => {
                router.delete(`/contra-add/${id}`);
            }
        )
    };

    const columns = [
        { header: 'Date', accessor: 'date' },
        { header: 'Voucher No', accessor: 'voucher_no' },
        { header: 'From Mode', accessor: (row: any) => row.mode_from?.mode_name || 'N/A' },
        { header: 'To Mode', accessor: (row: any) => row.mode_to?.mode_name || 'N/A' },
        {
            header: 'Amount',
            accessor: (row: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount),
            className: 'text-right'
        },
        { header: 'Description', accessor: 'description' },
    ];

    return (
        <AppLayout>
            <Head title="Contra Vouchers" />

            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">

                    <PageHeader title='Contra Entries' addLinkHref='/contra-add/create' addLinkText='+ Add New' />

                    <TableComponent
                        columns={columns}
                        data={contras.data}
                        actions={(row: any) => (
                            <ActionButtons
                                editHref={`/contra-add/${row.id}/edit`}
                                onDelete={() => handleDelete(row.id)}
                                printHref={`/contra-add/${row.voucher_no}/print`}
                                printText="Print"
                            />
                        )}
                    />

                    {/* Pagination */}
                    <Pagination
                        links={contras.links}
                        currentPage={contras.current_page}
                        lastPage={contras.last_page}
                        total={contras.total}
                    />


                </div>
            </div>

        </AppLayout>
    );
}
