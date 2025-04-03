import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditAccountGroup({
    accountGroup,
    natureOptions,
    groupOptions,
}: {
    accountGroup: any;
    natureOptions: { id: number; name: string }[];
    groupOptions: { id: number; name: string }[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: accountGroup.name || '',
        nature_id: accountGroup.nature_id || '',
        group_under_id: accountGroup.group_under_id || '',
        description: accountGroup.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/account-groups/${accountGroup.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Account Group - ${accountGroup.name}`} />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Edit Account Group</h1>

                    <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">

                        {/* Name */}
                        <div>
                            <label className="mb-1 block font-medium">Account Group Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Nature */}
                        <div>
                            <label className="mb-1 block font-medium">Nature</label>
                            <select
                                value={data.nature_id}
                                onChange={(e) => setData('nature_id', parseInt(e.target.value))}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select Nature</option>
                                {natureOptions.map((nature) => (
                                    <option key={nature.id} value={nature.id}>
                                        {nature.name}
                                    </option>
                                ))}
                            </select>
                            {errors.nature_id && <p className="text-sm text-red-500">{errors.nature_id}</p>}
                        </div>

                        {/* Group Under */}
                        <div>
                            <label className="mb-1 block font-medium">Group Under</label>
                            <select
                                value={data.group_under_id}
                                onChange={(e) => setData('group_under_id', parseInt(e.target.value))}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select Group Under</option>
                                {groupOptions.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                            {errors.group_under_id && <p className="text-sm text-red-500">{errors.group_under_id}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1 block font-medium">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Link href="/account-groups" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
