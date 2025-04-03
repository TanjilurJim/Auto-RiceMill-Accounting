import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateAccountGroup({
    natureOptions,
    groupOptions,
}: {
    natureOptions: { id: number; name: string }[];
    groupOptions: { id: number; name: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nature_id: '',
        group_under_id: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/account-groups');
    };

    return (
        <AppLayout>
            <Head title="Create Account Group" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Create Account Group</h1>

                    <form onSubmit={handleSubmit} className="space-y-5 rounded bg-white p-6 shadow dark:bg-neutral-900">
                        {/* Account Group Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">Account Group Name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Enter account group name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Nature */}
                        <div>
                            <label htmlFor="nature_id" className="mb-1 block font-medium">Nature</label>
                            <select
                                id="nature_id"
                                value={data.nature_id}
                                onChange={(e) => setData('nature_id', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select nature</option>
                                {natureOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            {errors.nature_id && <p className="text-sm text-red-500">{errors.nature_id}</p>}
                        </div>

                        {/* Group Under */}
                        <div>
                            <label htmlFor="group_under_id" className="mb-1 block font-medium">Group Under</label>
                            <select
                                id="group_under_id"
                                value={data.group_under_id}
                                onChange={(e) => setData('group_under_id', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            >
                                <option value="">Select group under</option>
                                {groupOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            {errors.group_under_id && <p className="text-sm text-red-500">{errors.group_under_id}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="mb-1 block font-medium">Description</label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Optional description"
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2">
                            <Link href="/account-groups" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
