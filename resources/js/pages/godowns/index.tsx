import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { SearchBar } from '@/components/ui/search-bar';
import { confirmDialog } from '@/components/confirmDialog';
import PageHeader from '@/components/PageHeader';
import ActionButtons from '@/components/ActionButtons';

interface Godown {
    id: number;
    name: string;
    godown_code: string;
    address?: string;
}

interface PaginatedGodowns {
    data: Godown[];
    links: { url: string | null; label: string; active: boolean }[];
}

export default function GodownIndex({ godowns }: { godowns: PaginatedGodowns }) {
    const handleDelete = (id: number) => {

        confirmDialog(
            {}, () => {
                router.delete(`/godowns/${id}`);
            }
        )

    };

    return (
        <AppLayout>
            <Head title="All List Of Godowns" />
            <div className="p-6 bg-gray-100">
                {/* <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">All List Of Godowns</h1>
                    <Link href="/godowns/create" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                        + Add New
                    </Link>
                </div> */}

                {/* Use the PageHeader component */}
                <PageHeader title='All List Of Godowns' addLinkHref='/godowns/create' />

                {/* 🔍 Search Bar */}
                <div className="mb-4">
                    <SearchBar endpoint="/godowns" placeholder="Search godowns..." />
                </div>

                <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="border px-4 py-2">#Id.No</th>
                                <th className="border px-4 py-2">Godown Name</th>
                                <th className="border px-4 py-2">Godown Id</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {godowns.data.map((godown) => (
                                <tr key={godown.id} className="border-t text-gray-700 hover:bg-gray-100">
                                    <td className="px-4 py-2 text-center">{godown.id}</td>
                                    <td className="px-4 py-2">{godown.name}</td>
                                    <td className="px-4 py-2">{godown.godown_code}</td>
                                    <td className="px-4 py-2">{godown.address || 'N/A'}</td>
                                    {/* <td className="flex justify-center space-x-2 px-4 py-2">
                                        <Link
                                            href={`/godowns/${godown.id}/edit`}
                                            className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(godown.id)}
                                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td> */}
                                    <ActionButtons
                                        editHref={`/godowns/${godown.id}/edit`} // URL for the edit action
                                        onDelete={() => handleDelete(godown.id)} // Function to handle the delete action
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-end gap-1">
                        {godowns.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || ''}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded px-3 py-1 text-sm ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                    } ${!link.url && 'pointer-events-none opacity-50'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
