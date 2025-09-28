// resources/js/pages/godowns/create.tsx

import GodownForm from '@/components/Form/GodownForm';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateGodown() {
    const t = useTranslation();
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
            <Head title={t('addGodownTitle')} />
            <div className="h-full">
                <div className="h-full rounded-lg bg-background p-4 md:p-12">
                    <PageHeader title={t('addGodownHeader')} addLinkHref="/godowns" addLinkText={t('back')} />
                    <GodownForm
                        data={data}
                        setData={setData}
                        handleSubmit={submit}
                        processing={processing}
                        errors={errors}
                        submitText={t('createGodownSubmit')}
                        cancelHref="/godowns"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
