import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import TableComponent from '@/components/TableComponent';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

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
        { header: '#', accessor: (_: any, index: number) => index + 1, className: 'text-center' },
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
            <div className="p-6 w-screen lg:w-full bg-gray-100">

                {/* Use the PageHeader component */}
                <PageHeader title='All Salesmen' addLinkHref='/salesmen/create' />

                {/* <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="py-2 px-4 border">#</th>
                                <th className="py-2 px-4 border">Salesman Code</th>
                                <th className="py-2 px-4 border">Salesman Name</th>
                                <th className="py-2 px-4 border">Phone Number</th>
                                <th className="py-2 px-4 border">E-mail</th>
                                <th className="py-2 px-4 border">Address</th>
                                <th className="py-2 px-4 border">Created By</th>
                                <th className="py-2 px-4 border text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesmen.map((salesman, index) => (
                                <tr key={salesman.id} className="border-t text-gray-700 hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4">{salesman.salesman_code}</td>
                                    <td className="py-2 px-4">{salesman.name}</td>
                                    <td className="py-2 px-4">{salesman.phone_number}</td>
                                    <td className="py-2 px-4">{salesman.email || 'N/A'}</td>
                                    <td className="py-2 px-4">{salesman.address || 'N/A'}</td>
                                    <td className="py-2 px-4">{salesman.creator?.name || 'N/A'}</td>
                                    
                                    <ActionButtons
                                        editHref={`/salesmen/${salesman.id}/edit`}
                                        onDelete={() => handleDelete(salesman.id)}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}

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
        </AppLayout>
    );
}
