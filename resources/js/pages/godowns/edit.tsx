import GodownForm from '@/components/Form/GodownForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

interface Godown {
    id: number;
    name: string;
    godown_code: string;
    address: string;
}

export default function GodownEdit({ godown }: { godown: Godown }) {
    const { data, setData, put, processing, errors } = useForm({
        name: godown.name,
        address: godown.address,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/godowns/${godown.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Godown" />
            <div className="h-full bg-gray-100 p-6">
                <div className="h-full bg-white rounded-lg p-6">
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
