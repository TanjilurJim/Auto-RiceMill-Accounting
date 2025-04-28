import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Salesman {
    id: number;
    salesman_code: string;
    name: string;
    phone_number: string;
    email?: string;
    address?: string;
    created_by_user?: { name: string }; // Assuming you eager-loaded user relation
}

export default function SalesmanIndex({ salesmen }: { salesmen: Salesman[] }) {

    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/salesmen/${id}`);
            }
        );
    };

    // Define the columns for the table
    const columns = [
        {
            header: '#',
            accessor: (_: any, index?: number) => (index !== undefined ? index + 1 : '-'),
            className: 'text-center',
        },
        { header: 'Salesman Code', accessor: 'salesman_code', className: '' },
        { header: 'Salesman Name', accessor: 'name', className: '' },
        { header: 'Phone Number', accessor: 'phone_number', className: '' },
        { header: 'E-mail', accessor: (row: Salesman) => row.email || 'N/A', className: '' },
        { header: 'Address', accessor: (row: Salesman) => row.address || 'N/A', className: '' },
        { header: 'Created By', accessor: (row: Salesman) => row.created_by_user?.name || 'N/A', className: '' },
    ];

    return (
        <AppLayout>
            <Head title="All Salesmen" />
            <div className="p-6 h-full w-screen lg:w-full bg-gray-100">

                <div className="h-full bg-white rounded-lg p-6">
                    {/* Use the PageHeader component */}
                    <PageHeader title='All Salesmen' addLinkHref='/salesmen/create' addLinkText="+ Add New" />

                    {/* Responsive Table */}
                    <TableComponent
                        columns={columns}
                        data={salesmen}
                        actions={(salesman) => (
                            <ActionButtons
                                editHref={`/salesmen/${salesman.id}/edit`}
                                onDelete={() => handleDelete(salesman.id)}
                            />
                        )}
                        noDataMessage="No salesmen found."
                    />
                </div>

            </div>
        </AppLayout>
    );
}
