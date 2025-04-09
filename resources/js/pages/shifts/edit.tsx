import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EditShift({
    shift,
}: {
    shift: any;
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: shift.name || '',
        start_time: shift.start_time || '',
        end_time: shift.end_time || '',
        description: shift.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shifts/${shift.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Shift - ${shift.name}`} />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <h1 className="mb-4 text-2xl font-bold">Edit Shift</h1>

                    <form onSubmit={handleSubmit} className="space-y-4 rounded bg-white p-4 shadow dark:bg-neutral-900">

                        {/* Name */}
                        <div>
                            <label className="mb-1 block font-medium">Shift Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="mb-1 block font-medium">Start Time</label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="mb-1 block font-medium">End Time</label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) => setData('end_time', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
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
                            <Link href="/shifts" className="rounded border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
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

