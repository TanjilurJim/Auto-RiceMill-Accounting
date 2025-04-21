import SalesmanForm from '@/components/Form/SalesmanForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateSalesman() {
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
            <Head title="Create Salesman" />
            <div className="flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-xl p-6">
                    <PageHeader title='Add New Salesman' addLinkHref='/salesmen' addLinkText="Back" />

                    <SalesmanForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        submitText="Create"
                        cancelHref="/salesmen"
                    />

                </div>
            </div>
        </AppLayout>
    );
}
