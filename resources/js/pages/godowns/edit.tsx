/* resources/js/pages/godowns/edit.tsx
   ------------------------------------------------------------------ */
import GodownForm from '@/components/Form/GodownForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Godown {
    id: number;
    name: string;
    address: string;
}

export default function GodownEdit({
    godown,
    khamalCount,
}: {
    godown: Godown;
    khamalCount: number; // 🆕 comes from controller
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: godown.name,
        address: godown.address,
        khamal_count: khamalCount ?? '', // 🆕
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/godowns/${godown.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Godown" />
            <div className="h-full bg-gray-100 p-6">
                <div className="h-full rounded-lg bg-white p-6">
                    <PageHeader title="Edit Godown" addLinkHref="/godowns" addLinkText="Back" />

                    <GodownForm
                        data={data}
                        setData={setData}
                        handleSubmit={submit}
                        processing={processing}
                        errors={errors}
                        submitText="Update"
                        cancelHref="/godowns"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
