import ActionFooter from '@/components/ActionFooter';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function EditDesignation({
    designation,
}: {
    designation: any;
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: designation.name || '',
        description: designation.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/designations/${designation.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Edit Designation - ${designation.name}`} />
            <div className="bg-gray-100 p-6 h-full w-screen lg:w-full">
                <div className="bg-white h-full rounded-lg p-6">
                    <PageHeader title="Edit Designation" addLinkHref='/designations' addLinkText="Back" />

                    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-4 border dark:bg-neutral-900">

                        {/* Name */}
                        <div>
                            <label className="mb-1 block font-medium">Designation Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded border p-2 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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

                        <ActionFooter
                            onSubmit={handleSubmit}
                            cancelHref="/designations"
                            processing={processing}
                            submitText="Update"
                            cancelText="Cancel"
                            className="justify-end"
                        />
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
