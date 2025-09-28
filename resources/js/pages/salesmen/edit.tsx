import SalesmanForm from '@/components/Form/SalesmanForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function EditSalesman({ salesman }: { salesman: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: salesman.name || '',
        phone_number: salesman.phone_number || '',
        email: salesman.email || '',
        address: salesman.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/salesmen/${salesman.id}`);
    };

    return (
        <AppLayout>
            <Head title="Edit Salesman" />
            <div className="h-full bg-background p-6">
                <div className="h-full bg-background rounded-lg p-6">
                    <PageHeader title='Edit Salesman' addLinkHref='/salesmen' addLinkText="Back" />

                    <SalesmanForm
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        processing={processing}
                        errors={errors}
                        submitText="Update"
                        cancelHref="/salesmen"
                        salesmanCode={salesman.salesman_code} // Pass the salesman code for display
                    />

                </div>
            </div>
        </AppLayout>
    );
}
