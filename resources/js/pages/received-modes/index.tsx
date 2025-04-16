import ActionButtons from '@/components/ActionButtons';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface ReceivedMode {
    id: number;
    mode_name: string;
    opening_balance: string;
    closing_balance: string;
    phone_number: string;
}

interface PaginatedReceivedModes {
    data: ReceivedMode[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function Index({
    receivedModes,
    currentPage,
    perPage,
}: {
    receivedModes: PaginatedReceivedModes;
    currentPage: number;
    perPage: number;
}) {
    // Ensure that receivedModes is always defined and fallback to empty data if undefined
    const safeReceivedModes = receivedModes || { data: [], links: [] };

    const handleDelete = (id: number) => {
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: 'This received mode will be permanently deleted!',
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#d33',
        //     cancelButtonColor: '#3085d6',
        //     confirmButtonText: 'Yes, delete it!',
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         router.delete(`/received-modes/${id}`);
        //         Swal.fire('Deleted!', 'The received mode has been deleted.', 'success');
        //     }
        // });

        confirmDialog(
            {}, () => {
                router.delete(`/received-modes/${id}`);
            }
        )

    };

    // Safe access to the data array before trying to map over it
    const modes = safeReceivedModes.data || [];

    return (
        <AppLayout>
            <Head title="Received Modes" />
            <div className="bg-gray-100 p-4">
                {/* <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Received Modes</h1>
                    <Link href="/received-modes/create" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        + Add New Mode
                    </Link>
                </div> */}

                <PageHeader title="Received Modes" addLinkHref="/received-modes/create" />

                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                            <tr>
                                <th className="border px-3 py-2">SL</th>
                                <th className="border px-3 py-2">Mode Name</th>
                                <th className="border px-3 py-2">Opening Balance</th>
                                <th className="border px-3 py-2">Closing Balance</th>
                                <th className="border px-3 py-2">Phone Number</th>
                                <th className="border px-3 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Ensure data exists before trying to map */}
                            {modes.length > 0 ? (
                                modes.map((mode, index) => (
                                    <tr key={mode.id}>
                                        <td className="border px-3 py-2 text-center">{(currentPage - 1) * perPage + index + 1}</td>
                                        <td className="border px-3 py-2">{mode.mode_name}</td>
                                        <td className="border px-3 py-2">{mode.opening_balance}</td>
                                        <td className="border px-3 py-2">{mode.closing_balance}</td>
                                        <td className="border px-3 py-2">{mode.phone_number}</td>
                                        {/* <td className="border px-3 py-2 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <Link
                                                    href={`/received-modes/${mode.id}/edit`}
                                                    className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(mode.id)}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td> */}
                                        <ActionButtons
                                            editHref={`/received-modes/${mode.id}/edit`} // URL for the edit action
                                            onDelete={() => handleDelete(mode.id)} // Function to handle the delete action
                                        />
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="border px-3 py-2 text-center text-gray-500">
                                        No received modes available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-end gap-1">
                    {safeReceivedModes.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || ''}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                } ${!link.url && 'pointer-events-none opacity-50'}`}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
