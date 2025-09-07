import SalesmanForm from '@/components/Form/SalesmanForm';
import PageHeader from '@/components/PageHeader';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

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

      {/* Theme-aware page surface */}
      <div className="min-h-svh bg-background p-6">
        {/* Card surface with border + correct text color */}
        <div className="mx-auto rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
          <PageHeader title="Add New Salesman" addLinkHref="/salesmen" addLinkText="Back" />

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
