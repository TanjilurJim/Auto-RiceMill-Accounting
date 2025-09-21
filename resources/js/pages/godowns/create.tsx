// resources/js/pages/godowns/create.tsx
import GodownForm from '@/components/Form/GodownForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateGodown() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        address: '',
        khamal_count: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/godowns');
    };

    return (
        <AppLayout>
            <Head title="Add Godown" />
            <div className="h-full">
                <div className="h-full bg-background rounded-lg p-4 md:p-12">
                    <PageHeader title="Add Godown" addLinkHref="/godowns" addLinkText="Back" />
                    <GodownForm
                        data={data}
                        setData={setData}
                        handleSubmit={submit}
                        processing={processing}
                        errors={errors}
                        submitText="Create"
                        cancelHref="/godowns"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
