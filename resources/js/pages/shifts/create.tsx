import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateShift() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_time: '',
        end_time: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/shifts');
    };

    return (
        <AppLayout>
            <Head title="Create Shift" />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Create Shift</h1>

                    <form onSubmit={handleSubmit} className="space-y-5 rounded bg-white p-6 shadow dark:bg-neutral-900">
                        {/* Shift Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block font-medium">Shift Name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                                placeholder="Enter shift name"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Start Time */}
                        <div>
                            <label htmlFor="start_time" className="mb-1 block font-medium">Start Time</label>
                            <input
                                id="start_time"
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.start_time && <p className="text-sm text-red-500">{errors.start_time}</p>}
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="end_time" className="mb-1 block font-medium">End Time</label>
                            <input
                                id="end_time"
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.end_time && <p className="text-sm text-red-500">{errors.end_time}</p>}
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
                            <Link href="/shifts" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
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
