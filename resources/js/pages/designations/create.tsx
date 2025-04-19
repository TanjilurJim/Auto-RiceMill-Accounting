import ActionFooter from '@/components/ActionFooter';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateDesignation() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/designations');
    };

    return (
        <AppLayout>
            <Head title="Create Designation" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Create Designation</h1>

                    <form onSubmit={handleSubmit} className="space-y-5 rounded bg-white p-6 shadow dark:bg-neutral-900">
                        {/* Designation Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">Designation Name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Enter designation name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                        {/* <div className="flex justify-end space-x-2">
                            <Link href="/designations" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Create'}
                            </button>
                        </div> */}
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/designations"
                            processing={processing}
                            submitText="Create"
                            cancelText="Cancel"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
