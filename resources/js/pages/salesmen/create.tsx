import SalesmanForm from '@/components/Form/SalesmanForm';
import PageHeader from '@/components/PageHeader';
import { useTranslation } from '@/components/useTranslation';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function CreateSalesman() {
    const t = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone_number: '',
        email: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/salesmen');
    };

    return (
        <AppLayout>
            <Head title={t('createSalesmanTitle')} />

            {/* Theme-aware page surface */}
            <div className="bg-background min-h-svh">
                {/* Card surface with border + correct text color */}
                <div className="text-card-foreground p-4 shadow-sm md:p-12">
                    <PageHeader title={t('addNewSalesmanHeader')} addLinkHref="/salesmen" addLinkText={t('back')} />

                    <SalesmanForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        submitText={t('createSalesmanSubmit')}
                        cancelHref="/salesmen"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
