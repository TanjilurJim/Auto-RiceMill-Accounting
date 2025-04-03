import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface AccountGroup {
    id: number;
    name: string;
    nature?: { name: string };
    groupUnder?: { name: string };
    creator?: { name: string };
}

export default function AccountGroupIndex({ accountGroups }: { accountGroups: AccountGroup[] }) {

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This     action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/account-groups/${id}`);
                Swal.fire("Deleted!", "Account group has been deleted.", "success");
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Account Groups" />
            <div className="p-6">
                
                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Account Groups</h1>
                    <Link href="/account-groups/create" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg dark:bg-neutral-900">
                    <table className="min-w-full border-collapse border border-gray-200 dark:border-neutral-700">
                        <thead className="bg-gray-100 dark:bg-neutral-800">
                            <tr>
                                <th className="py-2 px-4 border">#</th>
                                <th className="py-2 px-4 border">Name</th>
                                <th className="py-2 px-4 border">Nature</th>
                                <th className="py-2 px-4 border">Group Under</th>
                                <th className="py-2 px-4 border">Created By</th>
                                <th className="py-2 px-4 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accountGroups.map((group, index) => (
                                <tr key={group.id} className="border-t border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800">
                                    <td className="py-2 px-4 text-center">{index + 1}</td>
                                    <td className="py-2 px-4">{group.name}</td>
                                    <td className="py-2 px-4">{group.nature?.name || 'N/A'}</td>
                                    <td className="py-2 px-4">{group.group_under?.name || 'N/A'}</td>
                                    <td className="py-2 px-4">{group.creator?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 flex justify-center space-x-2">
                                        <Link 
                                            href={`/account-groups/${group.id}/edit`} 
                                            className="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(group.id)} 
                                            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
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
