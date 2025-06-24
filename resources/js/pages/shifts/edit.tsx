import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Shift {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    description: string;
}

export default function EditShift({ shift }: { shift: Shift }) {
    const { data, setData, put, processing, errors } = useForm({
        name: shift.name,
        start_time: shift.start_time,
        end_time: shift.end_time,
        description: shift.description,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shifts/${shift.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Shift" />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title="Edit Shift" addLinkHref='/shifts' addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-6 border dark:bg-neutral-900">
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
                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/shifts"
                            processing={processing}
                            submitText="Save"
                            cancelText="Cancel"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
