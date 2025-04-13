import AddLink from '@/components/Btn&Link/AddLink';
import DeleteBtn from '@/components/Btn&Link/DeleteBtn';
import EditLink from '@/components/Btn&Link/EditLink';
import { confirmDialog } from '@/components/confirmDialog';
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
        // Swal.fire({
        //     title: "Are you sure?",
        //     text: "You won't be able to revert this!",
        //     icon: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#d33",
        //     cancelButtonColor: "#3085d6",
        //     confirmButtonText: "Yes, delete it!",
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/salesmen/${id}`);
        //         Swal.fire("Deleted!", "Salesman has been deleted.", "success");
        //     }
        // });

        confirmDialog(
            {
                // title: 'Are you sure?',
                // text: "You won't be able to revert this!",
                // confirmButtonText: 'Yes, delete it!',
                // confirmButtonColor: '#F96D6D',
                // cancelButtonColor: '#A9D7F6',
            },
            () => { 
                router.delete(`/salesmen/${id}`);
            }
        );
    };

    return (
        <AppLayout>
            <Head title="All Salesmen" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">All Salesmen</h1>
                    {/* <Link href="/salesmen/create" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        + Add New
                    </Link> */}
                    <AddLink href="/salesmen/create"/>
                </div>

                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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

                                    <td className="py-2 px-4 flex justify-center space-x-2">
                                        {/* <Link href={`/salesmen/${salesman.id}/edit`} className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600">
                                            Edit
                                        </Link> */}
                                        <EditLink href={`/salesmen/${salesman.id}/edit`} />
                                        {/* <button
                                            onClick={() => handleDelete(salesman.id)}
                                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button> */}
                                        <DeleteBtn handleDelete={handleDelete} delId={salesman} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
